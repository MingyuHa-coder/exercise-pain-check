/* =========================================================
   근거-판단 규칙 추적 도구 (공통 부분)
   - 앱의 콘텐츠 파일을 Node에서 그대로 불러온다(브라우저 불필요).
   - 판단 규칙(analyse)의 코드 원문을 단순한 형태만 해석한다. 해석하지 못한 줄은 "수동 검토 필요"로 남긴다.
   - 해석한 점수 규칙은 실제 analyse()를 수천 번 돌려 대조한다(추측으로 채우지 않기 위해).
   이 도구는 앱 동작을 바꾸지 않는다. 읽기만 한다.
   ========================================================= */
const fs = require("fs");
const path = require("path");
const vm = require("vm");
const crypto = require("crypto");

const ROOT = path.resolve(__dirname, "..", "..");
const MANUAL = "수동 검토 필요";

/* ---------- 앱 불러오기 ---------- */
function extractFunction(src, name) {
  const start = src.indexOf(`function ${name}(`);
  if (start < 0) throw new Error(`js/app.js에서 ${name}()을 찾지 못함`);
  let i = src.indexOf("{", start), depth = 0;
  for (; i < src.length; i++) {
    if (src[i] === "{") depth++;
    else if (src[i] === "}" && --depth === 0) break;
  }
  return src.slice(start, i + 1);
}
function topicFiles(root) {
  const html = fs.readFileSync(path.join(root, "index.html"), "utf8");
  return [...html.matchAll(/<script src="(content\/[^"]+)"><\/script>/g)].map(m => m[1]);
}
function loadApp(root = ROOT) {
  const files = topicFiles(root).filter(f => !/review-status|glossary/.test(f));
  const appSrc = fs.readFileSync(path.join(root, "js/app.js"), "utf8");
  const cards = [];
  const ctx = {
    console, cards,
    card: (title, ev, body, src, rvKey, detail) => { cards.push({ title, ev, body, src, rvKey, detail }); return ""; },
    label: (q, v) => v, T: null,
  };
  vm.createContext(ctx);
  const code = files.map(f => `/* ${f} */\n` + fs.readFileSync(path.join(root, f), "utf8")).join("\n") + "\n" +
    extractFunction(appSrc, "has") + "\n" + extractFunction(appSrc, "finish") + "\n" +
    "this.__ = { TOPICS, BODY, STUDIES, studiesIn, COMMON_Q, COMMON_P, COMMON_A, BASE_FLAGS, BASE_LEVELS, CONTENT_VERSION, has, finish };";
  vm.runInContext(code, ctx, { filename: "app-content.js" });
  const app = ctx.__;
  app.ctx = ctx;
  app.files = files;
  app.appSrc = appSrc;
  app.fileText = f => fs.readFileSync(path.join(root, f), "utf8");
  /* 실제 판단: 주제 analyse() + 공통 finish(). 원시 후보(finish 전)도 함께 돌려준다 */
  app.run = (topic, answers) => {
    const T = app.TOPICS[topic]; ctx.T = T;
    let raw = null; const realFinish = ctx.finish;
    ctx.finish = (a, sc, patterns, picks, referDaily, referNerve) => {
      raw = { sc: { ...sc }, patterns: [...patterns], picks: picks.map(p => [...p]), referDaily: !!referDaily, referNerve: !!referNerve };
      return realFinish(a, sc, patterns, picks, referDaily, referNerve);
    };
    try { const r = T.analyse(JSON.parse(JSON.stringify(answers))); return { r, raw }; }
    finally { ctx.finish = realFinish; }
  };
  return app;
}

/* ---------- 답변 만들기 ---------- */
/* mulberry32: 고른 난수 (단순 선형 합동법은 낮은 자리 주기가 짧아 답 조합이 빠질 수 있다) */
function rng(seed) {
  let s = seed >>> 0;
  return n => { s = (s + 0x6D2B79F5) >>> 0; let t = s; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return (((t ^ (t >>> 14)) >>> 0) % n); };
}
function randomAnswers(T, r) {
  const a = {};
  for (const q of T.questions) {
    const vals = q.opts.map(o => o[0]);
    if (q.multi) {
      const real = vals.filter(v => v !== "none");
      const pick = real.filter(() => r(3) === 0);
      a[q.id] = pick.length ? pick : ["none"];
    } else a[q.id] = vals[r(vals.length)];
  }
  return a;
}

/* ---------- 판단 규칙 해석 ---------- */
const HAS_RE = /^has\(a,\s*"([^"]+)",\s*"([^"]+)"\)$/;
function parseCond(expr) {
  const parts = expr.split("||").map(s => s.trim());
  const terms = [];
  for (const p of parts) {
    const m = p.match(HAS_RE);
    if (!m) return null;
    terms.push({ q: m[1], v: m[2] });
  }
  return terms;
}
const condText = terms => terms.map(t => `${t.q}=${t.v}`).join(" 또는 ");
const condKey = terms => terms.map(t => `${t.q}=${t.v}`).join("/");
const condTrue = (terms, a, has) => terms.some(t => has(a, t.q, t.v));

/* analyse() 원문을 줄 단위로 해석한다. 지원하는 형태:
   if (조건) sc.X += N;   / ... else if (조건) sc.X += M;   / [..].forEach(v => { if (has(a, "q", v)) sc.X += N; });
   if (조건) picks.push(["id", N]);   / picks.push(["id", 식 ? N : M]);
   그 밖의 줄은 "선택 규칙(원문)" 또는 "해석 못 함"으로 남긴다. */
function parseAnalyse(topic, fnSrc, fileText) {
  const lines = fnSrc.split("\n");
  const out = { variables: [], scoreRules: [], pickRules: [], selection: [], referArgs: null, unparsed: [] };
  const baseLine = fileText ? lineOf(fileText, lines[0].trim()) : null;
  lines.forEach((raw, i) => {
    const line = raw.trim();
    const ln = baseLine ? baseLine + i : null;
    if (!line || line === "}" || /^analyse\(a\)\s*\{$/.test(line) || line.startsWith("//") || line.startsWith("/*")) return;
    let m;
    if ((m = line.match(/^const sc = \{(.*)\};$/))) {
      out.variables = m[1].split(",").map(s => s.split(":")[0].trim()).filter(Boolean);
      out.scInit = { code: line, line: ln };
      return;
    }
    if ((m = line.match(/^if \((.+?)\) sc\.(\w+) \+= (\d+);(?: else if \((.+?)\) sc\.(\w+) \+= (\d+);)?$/))) {
      const c1 = parseCond(m[1]);
      if (!c1) { out.unparsed.push({ line: ln, code: line, why: "조건이 has(...) 또는 || 형태가 아님" }); return; }
      out.scoreRules.push(mkScore(topic, m[2], +m[3], c1, null, ln, line));
      if (m[4]) {
        const c2 = parseCond(m[4]);
        if (!c2) { out.unparsed.push({ line: ln, code: line, why: "else if 조건 해석 못 함" }); return; }
        out.scoreRules.push(mkScore(topic, m[5], +m[6], c2, c1, ln, line));
      }
      return;
    }
    if ((m = line.match(/^\[(.+)\]\.forEach\(v => \{ if \(has\(a, "([^"]+)", v\)\) sc\.(\w+) \+= (\d+); \}\);$/))) {
      const vals = m[1].split(",").map(s => s.trim().replace(/^"|"$/g, ""));
      vals.forEach(v => out.scoreRules.push(mkScore(topic, m[3], +m[4], [{ q: m[2], v }], null, ln, line)));
      return;
    }
    if ((m = line.match(/^if \((.+?)\) picks\.push\(\["(\w+)", (\d+(?:\.\d+)?)\]\);$/))) {
      const c = parseCond(m[1]);
      if (!c) { out.unparsed.push({ line: ln, code: line, why: "조정 후보 조건 해석 못 함" }); return; }
      out.pickRules.push({ id: `${topic}.P.${m[2]}`, adj: m[2], cond: c, priority: +m[3], priorityRule: null, line: ln, code: line, parsed: true });
      return;
    }
    if ((m = line.match(/^picks\.push\(\["(\w+)", (.+) \? (\d+(?:\.\d+)?) : (\d+(?:\.\d+)?)\]\);$/))) {
      out.pickRules.push({ id: `${topic}.P.${m[1]}`, adj: m[1], cond: null, priority: null,
        priorityRule: { expr: m[2], ifTrue: +m[3], ifFalse: +m[4] }, line: ln, code: line, parsed: true });
      return;
    }
    if ((m = line.match(/^return finish\(a, sc, patterns, picks, (.+)\);$/))) {
      const args = splitTop(m[1]);
      const d = parseCond(args[0]);
      out.referArgs = { line: ln, code: line, referDaily: d || { expr: args[0], manual: true }, referNerve: args[1] || null };
      return;
    }
    if (/^const picks = \[\];$/.test(line)) return;
    if (/^(const (main|other|patterns|picks|order)\b|if \(sc\[|if \(sc\.|patterns\.push|const \w+ = )/.test(line)) {
      out.selection.push({ id: `${topic}.SEL.${out.selection.length + 1}`, line: ln, code: line });
      return;
    }
    out.unparsed.push({ line: ln, code: line, why: "지원하지 않는 형태" });
  });
  return out;
}
/* 괄호 밖의 쉼표로만 나누기 */
function splitTop(s) {
  const out = []; let depth = 0, cur = "", q = false;
  for (const ch of s) {
    if (ch === '"') q = !q;
    if (!q && "([{".includes(ch)) depth++;
    if (!q && ")]}".includes(ch)) depth--;
    if (!q && ch === "," && depth === 0) { out.push(cur.trim()); cur = ""; continue; }
    cur += ch;
  }
  if (cur.trim()) out.push(cur.trim());
  return out;
}
/* 식 안의 has(a, "q", "v") 모두 뽑기 (조건식 해석이 아니라 "어떤 질문을 보는지"만) */
function hasCalls(expr) { return [...expr.matchAll(/has\(a,\s*"([^"]+)",\s*"([^"]+)"\)/g)].map(m => ({ q: m[1], v: m[2] })); }
function mkScore(topic, variable, points, cond, elseOf, line, code) {
  return { id: `${topic}.S.${variable}.${condKey(cond)}`, variable, points, cond, elseOf, line, code };
}
function lineOf(text, needle) {
  const idx = text.indexOf(needle);
  if (idx < 0) return null;
  return text.slice(0, idx).split("\n").length;
}

/* 해석한 점수 규칙만으로 점수를 다시 계산 (실제 analyse와 대조용) */
function modelScores(parsed, a, has) {
  const sc = Object.fromEntries(parsed.variables.map(v => [v, 0]));
  for (const r of parsed.scoreRules) {
    if (r.elseOf && condTrue(r.elseOf, a, has)) continue;
    if (condTrue(r.cond, a, has)) sc[r.variable] = (sc[r.variable] || 0) + r.points;
  }
  return sc;
}
function modelPickSet(parsed, a, has) {
  return parsed.pickRules.filter(p => p.cond ? condTrue(p.cond, a, has) : true).map(p => p.adj).sort();
}

/* ---------- 근거 위치 모으기 ---------- */
const LABEL = { fact: "논문 확인", synth: "연구 종합 해석", app: "앱 제안", hypo: "검증 안 된 가설" };
function evidenceLocations(app, topic) {
  const T = app.TOPICS[topic];
  const locs = [];
  const add = (o) => locs.push(o);
  for (const [k, p] of Object.entries(T.patterns)) {
    add({ id: `${topic}.pat.${k}.evText`, kind: "점검 변수 카드 근거", owner: { type: "pattern", id: k }, label: LABEL.fact, text: p.evText || "", src: p.src || "", shown: !!p.evText });
    if (p.hypo) add({ id: `${topic}.pat.${k}.hypo`, kind: "점검 변수 카드 가설", owner: { type: "pattern", id: k }, label: LABEL.hypo, text: p.hypo, src: "", shown: true });
    if (p.internal) add({ id: `${topic}.pat.${k}.internal`, kind: "내부 보존 (화면에 안 보임)", owner: { type: "pattern", id: k }, label: "내부 자료", text: p.internal.text, src: p.internal.src, shown: false });
    if (p.internalEv) add({ id: `${topic}.pat.${k}.internalEv`, kind: "내부 보존 (화면에 안 보임)", owner: { type: "pattern", id: k }, label: "내부 자료", text: p.internalEv.text, src: p.internalEv.src, shown: false });
  }
  for (const [k, d] of Object.entries(T.adjustments)) {
    add({ id: `${topic}.adj.${k}.fact`, kind: "조정 카드 근거", owner: { type: "adjustment", id: k }, label: LABEL.fact, text: d.fact || "", src: d.src || "", shown: !!d.fact });
    if (d.hypo) add({ id: `${topic}.adj.${k}.hypo`, kind: "조정 카드 가설", owner: { type: "adjustment", id: k }, label: LABEL.hypo, text: d.hypo, src: "", shown: true });
    add({ id: `${topic}.adj.${k}.how`, kind: "조정 방법 (앱 제안)", owner: { type: "adjustment", id: k }, label: LABEL.app, text: d.how, src: "", shown: true });
  }
  T.questions.forEach(q => { if (q.hypo) add({ id: `${topic}.q.${q.id}.hypo`, kind: "질문 가설", owner: { type: "question", id: q.id }, label: LABEL.hypo, text: q.hypo, src: "", shown: true }); });
  add({ id: `${topic}.flags.flagSrc`, kind: "위험 신호 출처", owner: { type: "safety", id: "flags" }, label: "출처", text: "위험 신호 문항과 진료 안내 단계", src: T.flagSrc || "", shown: true });
  app.ctx.cards.length = 0;
  try { T.extras({ sc: {}, patterns: [], adjustments: [] }); } catch (e) { /* extras가 결과에 의존하면 수동 */ }
  app.ctx.cards.forEach((c, i) => {
    add({ id: `${topic}.card.${i + 1}`, kind: `설명 카드: ${c.title}`, owner: { type: "card", id: String(i + 1) }, label: LABEL.synth, text: c.body + (c.detail ? " [근거 자세히] " + c.detail : ""), src: c.src || "", shown: true, cardTitle: c.title });
  });
  return locs;
}
/* 출처 문자열에서 연구 이름 나누기 */
function splitSources(src) {
  if (!src) return [];
  return src.split(/,\s*(?![^()]*\))/).map(s => s.trim()).filter(Boolean);
}
function slug(name) {
  return name.toLowerCase().replace(/\(.*?\)/g, "").replace(/[^a-z0-9가-힣]+/g, "-").replace(/^-|-$/g, "");
}
function studyIndex(app) {
  return app.STUDIES.map(s => ({ ...s, id: slug(s.name) }));
}
function matchStudies(app, srcPart) {
  return studyIndex(app).filter(s => s.match.test(srcPart));
}

/* 파일 위치 찾기: 문장 앞부분을 파일에서 검색.
   anchor(예: "adjustments", "scap")가 있으면 그 정의 블록 뒤에서 처음 나오는 곳을 찾는다.
   같은 문장이 여러 곳에 있고 블록으로도 좁히지 못하면 null (= 수동 검토 필요) */
function locate(app, text, files, anchor) {
  if (!text) return null;
  const needle = text.replace(/\\"/g, '"').slice(0, 24);
  for (const f of files) {
    const t = app.fileText(f).replace(/\\"/g, '"');
    const count = t.split(needle).length - 1;
    if (!count) continue;
    if (anchor) {
      let from = 0;
      if (anchor.section) { const si = t.indexOf(`${anchor.section}: {`); if (si >= 0) from = si; }
      const ki = t.slice(from).search(new RegExp(`\\n\\s+${anchor.key}: (\\{|COMMON_|\\()`));
      if (ki >= 0) {
        const start = from + ki;
        const idx = t.indexOf(needle, start);
        const nextKey = t.slice(start + 1).search(/\n {2,4}\w+: (\{|COMMON_|\()/);
        if (idx >= 0 && (nextKey < 0 || idx < start + 1 + nextKey)) return `${f}:${t.slice(0, idx).split("\n").length}`;
      }
    }
    if (count === 1) return `${f}:${lineOf(t, needle)}`;
  }
  return null;
}
function locateLoose(app, text, files) {
  if (!text) return null;
  const needle = text.replace(/\\"/g, '"').slice(0, 24);
  for (const f of files) {
    const t = app.fileText(f).replace(/\\"/g, '"');
    const ln = lineOf(t, needle);
    if (ln) return `${f}:${ln}`;
  }
  return null;
}

function sha(s) { return crypto.createHash("sha256").update(s).digest("hex").slice(0, 12); }
function topicFingerprint(app, topic) {
  const T = app.TOPICS[topic];
  return sha(JSON.stringify([T.questions, T.patterns, T.adjustments, T.redFlags, T.flagLevels, T.flagSrc, T.sources]) +
    T.analyse.toString() + extractFunction(app.appSrc, "finish") + extractFunction(app.appSrc, "has") +
    JSON.stringify(app.STUDIES.map(s => [s.name, String(s.match), s.type, s.who, s.whoUser, s.app])) +
    (() => { app.ctx.cards.length = 0; try { T.extras({ sc: {}, patterns: [], adjustments: [] }); } catch (e) {} return JSON.stringify(app.ctx.cards); })());
}

module.exports = { hasCalls, splitTop, ROOT, MANUAL, loadApp, parseAnalyse, modelScores, modelPickSet, condText, condTrue, randomAnswers, rng,
  evidenceLocations, splitSources, matchStudies, studyIndex, slug, locate, lineOf, topicFingerprint, sha, extractFunction };
