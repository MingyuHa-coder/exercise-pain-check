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

/* ---------- 독립 모델: 변수 선택 · 조건부 우선순위 · 공통 마무리 ----------
   점수·후보 조건은 코드에서 해석한 것을 쓰지만, 공통 마무리(상위 3개, 0점 제외, 좁히기 어려움, 진료 먼저 변수,
   진료 먼저 안내)는 js/app.js를 쓰지 않고 rule-inventory.md에 적힌 규칙대로 여기서 따로 구현한다.
   지원하지 않는 형태가 있으면 null을 돌려준다 → 그 주제의 최종 결과는 "수동 검토 필요". */
function parseSelection(parsed) {
  const steps = [];
  for (const x of parsed.selection) {
    let m;
    if ((m = x.code.match(/^const main = sc\.(\w+) (>=|>) sc\.(\w+) \? "(\w+)" : "(\w+)";$/))) steps.push({ t: "main", a: m[1], op: m[2], b: m[3], yes: m[4], no: m[5] });
    else if ((m = x.code.match(/^const other = main === "(\w+)" \? "(\w+)" : "(\w+)";$/))) steps.push({ t: "other", eq: m[1], yes: m[2], no: m[3] });
    else if (/^const patterns = \[main\];$/.test(x.code)) steps.push({ t: "start" });
    else if ((m = x.code.match(/^if \(sc\[other\] >= (\d+)\) patterns\.push\(other\);$/))) steps.push({ t: "addOther", min: +m[1] });
    else if ((m = x.code.match(/^if \(sc\.(\w+) >= (\d+)\) patterns\.push\("(\w+)"\);$/)) && m[1] === m[3]) steps.push({ t: "add", v: m[1], min: +m[2] });
    else return null;
  }
  return steps;
}
function runSelection(steps, sc) {
  let main = null, other = null; const patterns = [];
  for (const s of steps) {
    if (s.t === "main") main = (s.op === ">" ? sc[s.a] > sc[s.b] : sc[s.a] >= sc[s.b]) ? s.yes : s.no;
    else if (s.t === "other") other = main === s.eq ? s.yes : s.no;
    else if (s.t === "start") patterns.push(main);
    else if (s.t === "addOther") { if (sc[other] >= s.min) patterns.push(other); }
    else if (s.t === "add") { if (sc[s.v] >= s.min) patterns.push(s.v); }
  }
  return { main, patterns };
}
/* 조건부 우선순위 식: main === "x" 와 has(a, "q", "v") 를 || 로 묶은 형태만 */
function parsePriorityExpr(expr) {
  const terms = [];
  for (const part of expr.split("||").map(t => t.trim())) {
    let m;
    if ((m = part.match(/^main === "(\w+)"$/))) terms.push({ main: m[1] });
    else if ((m = part.match(/^has\(a,\s*"([^"]+)",\s*"([^"]+)"\)$/))) terms.push({ q: m[1], v: m[2] });
    else return null;
  }
  return terms;
}
function modelPicks(parsed, a, has, main) {
  const out = [];
  for (const p of parsed.pickRules) {
    if (p.cond && !condTrue(p.cond, a, has)) continue;
    let pr = p.priority;
    if (pr === null) {
      const terms = parsePriorityExpr(p.priorityRule.expr);
      if (!terms) return null;
      pr = terms.some(t => t.main ? main === t.main : has(a, t.q, t.v)) ? p.priorityRule.ifTrue : p.priorityRule.ifFalse;
    }
    out.push([p.adj, pr]);
  }
  return out;
}
/* rule-inventory.md 2장의 공통 규칙을 그대로 옮긴 별도 구현 */
function modelFinish(T, a, has, sc, patterns, picks, referTopic) {
  const ordered = picks.map((p, i) => ({ id: p[0], pr: p[1], i })).sort((x, y) => x.pr - y.pr || x.i - y.i);
  let adjustments = ordered.slice(0, 3).map(x => x.id);
  const kept = patterns.filter(p => !(p in sc && sc[p] === 0));
  const unclear = patterns.length > 0 && kept[0] !== patterns[0];
  if (unclear && kept.length === 0) adjustments = [];
  if (kept.some(p => T.patterns[p] && T.patterns[p].referOnly)) adjustments = [];
  const referFirst = !!referTopic || has(a, "dur", "gt6") || has(a, "trend", "worse");
  return { patterns: kept, adjustments, unclear, referFirst };
}
function buildModel(T, parsed) {
  const steps = parseSelection(parsed);
  const why = [];
  if (!steps) why.push("변수 선택 줄 중 지원하지 않는 형태가 있음");
  for (const p of parsed.pickRules) if (p.priority === null && !parsePriorityExpr(p.priorityRule.expr)) why.push(`${p.id}의 조건부 우선순위 식`);
  const ra = parsed.referArgs;
  if (!ra || !Array.isArray(ra.referDaily)) why.push("주제별 진료 먼저 조건");
  if (ra && ra.referNerve) why.push("주제별 두 번째 진료 먼저 조건");
  if (parsed.unparsed.length) why.push("해석 못 한 줄");
  if (why.length) return { ok: false, why };
  return { ok: true, steps, run: (a, has) => {
    const sc = modelScores(parsed, a, has);
    const sel = runSelection(steps, sc);
    const picks = modelPicks(parsed, a, has, sel.main);
    return modelFinish(T, a, has, sc, sel.patterns, picks, condTrue(ra.referDaily, a, has));
  } };
}
/* 고정 사례 실행 (기대값은 사람이 규칙 표로 계산해 둔 것) */
function runCases(app, topic, caseFile) {
  if (!fs.existsSync(caseFile)) return null;
  const spec = JSON.parse(fs.readFileSync(caseFile, "utf8"));
  const results = spec.cases.map(c => {
    const a = { ...spec.base, ...c.set };
    const r = app.run(topic, a).r;
    const got = { patterns: r.patterns, adjustments: r.adjustments, unclear: !!r.unclear, referFirst: !!r.referFirst };
    return { ...c, answers: a, got, pass: JSON.stringify(got) === JSON.stringify(c.expect) };
  });
  return { spec, results };
}

function sha(s) { return crypto.createHash("sha256").update(s).digest("hex").slice(0, 12); }
function topicFingerprint(app, topic) {
  const T = app.TOPICS[topic];
  return sha(JSON.stringify([T.questions, T.patterns, T.adjustments, T.redFlags, T.flagLevels, T.flagSrc, T.sources]) +
    T.analyse.toString() + extractFunction(app.appSrc, "finish") + extractFunction(app.appSrc, "has") +
    JSON.stringify(app.STUDIES.map(s => [s.name, String(s.match), s.type, s.who, s.whoUser, s.app])) +
    (() => { app.ctx.cards.length = 0; try { T.extras({ sc: {}, patterns: [], adjustments: [] }); } catch (e) {} return JSON.stringify(app.ctx.cards); })());
}

module.exports = { parseSelection, runSelection, parsePriorityExpr, modelPicks, modelFinish, buildModel, runCases, hasCalls, splitTop, ROOT, MANUAL, loadApp, parseAnalyse, modelScores, modelPickSet, condText, condTrue, randomAnswers, rng,
  evidenceLocations, splitSources, matchStudies, studyIndex, slug, locate, lineOf, topicFingerprint, sha, extractFunction };
