#!/usr/bin/env node
/* =========================================================
   근거-판단 규칙 추적 자료 만들기
   실행: node tools/audit/build-trace.js [--topic bench]
   만드는 파일 (docs/audit/):
     <topic>-traceability.md      질문 → 점수 → 결과 변수 → 조정 후보 → 최종 조정, 연구별 역추적
     <topic>-evidence-links.csv   연구 ID ↔ 코드 위치 ↔ 앱 문장 ↔ 관련 규칙·질문
     <topic>-review-questions.md  전문가 검토가 필요한 판단 규칙 목록
     <topic>-trace.json           위 내용을 기계가 읽는 형식으로 (Work의 Evidence Matrix와 합칠 때 사용)
   docs/audit/work/<topic>-evidence-matrix.csv 가 있으면 연구 ID로 합쳐서 함께 보여준다.
   앱 파일은 읽기만 한다.
   ========================================================= */
const fs = require("fs");
const path = require("path");
const L = require("./lib");

const args = process.argv.slice(2);
const TOPIC = (args[args.indexOf("--topic") + 1] && args.includes("--topic")) ? args[args.indexOf("--topic") + 1] : "bench";
const OUT = path.join(L.ROOT, "docs", "audit");
const SAMPLES = 50000;

function build(topic = TOPIC) {
  const app = L.loadApp();
  const T = app.TOPICS[topic];
  if (!T) throw new Error(`주제 ${topic} 없음`);
  const topicFile = `content/topics/${topic}.js`;
  const files = [topicFile, "content/common.js"];
  const manualPath = path.join(__dirname, "manual", `${topic}.json`);
  const manual = fs.existsSync(manualPath) ? JSON.parse(fs.readFileSync(manualPath, "utf8")) : { reviewItems: {}, selectionNotes: {}, priorityNotes: {} };
  const parsed = L.parseAnalyse(topic, T.analyse.toString(), app.fileText(topicFile));
  const has = app.has;
  const finishSrc = L.extractFunction(app.appSrc, "finish");
  const appLine = needle => { const ln = L.lineOf(app.appSrc, needle); return ln ? `js/app.js:${ln}` : null; };

  /* ---- 1. 질문 ---- */
  const questions = T.questions.map(q => {
    const qLine = L.lineOf(app.fileText(topicFile), `id: "${q.id}", q:`);
    const cLine = L.lineOf(app.fileText("content/common.js"), `${q.id}: { id: "${q.id}"`);
    return { id: q.id, qid: `${topic}.Q.${q.id}`, text: q.q, multi: !!q.multi, hypo: q.hypo || "", opts: q.opts.map(o => ({ v: o[0], label: o[1] })),
      where: qLine ? `${topicFile}:${qLine}` : cLine ? `content/common.js:${cLine} (COMMON_Q)` : L.MANUAL };
  });

  /* ---- 2. 공통 규칙 (js/app.js finish) ---- */
  const COMMON_RULES = [
    { id: "common.F.top3", needle: "picks.sort((x, y) => x[1] - y[1]).slice(0, 3)", text: "조정 후보를 우선순위 숫자가 작은 순으로 정렬해 상위 3개만 보여준다. 같은 숫자는 코드에 넣은 순서대로." },
    { id: "common.F.referLong", needle: 'has(a, "dur", "gt6")', text: "아픈 지 6주 이상(dur=gt6)이면 '진료를 먼저 권해요'." },
    { id: "common.F.referWorse", needle: 'has(a, "trend", "worse")', text: "나빠지는 중(trend=worse)이면 '진료를 먼저 권해요'." },
    { id: "common.F.zero", needle: "sc[p] === 0", text: "점수표에 있는 변수 중 0점인 변수는 결과에서 뺀다." },
    { id: "common.F.unclearNoAdj", needle: "if (unclear && !kept.length) adjustments = [];", text: "맨 앞 변수가 빠지고 남는 변수가 없으면 조정도 보여주지 않는다('좁히기 어려움' 안내)." },
    { id: "common.F.referOnly", needle: ".referOnly)) adjustments = [];", text: "'→ 진료 먼저' 변수(referOnly)가 결과에 있으면 조정을 보여주지 않는다." },
    { id: "common.F.referFirst", needle: "referFirst: referDaily || referLong || referWorse || referNerve", text: "주제 조건·6주 이상·악화 중 하나면 결과 맨 위에 '진료를 먼저 권해요'를 띄우고 조정은 '참고만'으로 함께 보여준다." },
  ].map(r => ({ ...r, found: finishSrc.includes(r.needle), where: appLine(r.needle) || L.MANUAL }));

  /* ---- 3. 위험 신호 ---- */
  const flags = T.redFlags.map(f => ({ id: `${topic}.FLAG.${f.id}`, flag: f.id, text: f.q, level: f.level, levelTitle: (T.flagLevels[f.level] || {}).title || L.MANUAL,
    from: app.BASE_FLAGS.some(b => b.id === f.id) ? "content/common.js (BASE_FLAGS, 어깨 공통)" : topicFile }));

  /* ---- 4. 실제 판단과 대조 (표본) ---- */
  const r = L.rng(20261106);
  const stats = { n: 0, scoreMismatch: 0, pickMismatch: 0, examples: [], pattern: {}, patternMain: {}, cand: {}, fin: {}, cut: {}, unclear: 0, referFirst: 0, noAdj: 0 };
  Object.keys(T.patterns).forEach(k => { stats.pattern[k] = 0; stats.patternMain[k] = 0; });
  Object.keys(T.adjustments).forEach(k => { stats.cand[k] = 0; stats.fin[k] = 0; stats.cut[k] = 0; });
  for (let i = 0; i < SAMPLES; i++) {
    const a = L.randomAnswers(T, r);
    const { r: res, raw } = app.run(topic, a);
    stats.n++;
    const m = L.modelScores(parsed, a, has);
    if (JSON.stringify(m) !== JSON.stringify(raw.sc)) { stats.scoreMismatch++; if (stats.examples.length < 3) stats.examples.push({ a, model: m, real: raw.sc }); }
    const mp = L.modelPickSet(parsed, a, has).join();
    if (mp !== raw.picks.map(p => p[0]).sort().join()) stats.pickMismatch++;
    res.patterns.forEach((p, j) => { stats.pattern[p]++; if (j === 0) stats.patternMain[p]++; });
    raw.picks.forEach(([k]) => { stats.cand[k]++; if (!res.adjustments.includes(k)) stats.cut[k]++; });
    res.adjustments.forEach(k => stats.fin[k]++);
    if (res.unclear) stats.unclear++;
    if (res.referFirst) stats.referFirst++;
    if (!res.adjustments.length) stats.noAdj++;
  }
  const pct = (x) => `${(x / stats.n * 100).toFixed(1)}%`;

  /* ---- 5. 질문 → 규칙 연결 (코드에서 자동) ---- */
  const useOf = (qid, v) => ({
    score: parsed.scoreRules.filter(s => s.cond.some(c => c.q === qid && c.v === v)).map(s => s.id),
    pick: parsed.pickRules.filter(p => (p.cond || []).some(c => c.q === qid && c.v === v) || (p.priorityRule && L.hasCalls(p.priorityRule.expr).some(c => c.q === qid && c.v === v))).map(p => p.id),
    refer: (Array.isArray(parsed.referArgs && parsed.referArgs.referDaily) && parsed.referArgs.referDaily.some(c => c.q === qid && c.v === v) ? [`${topic}.REFER.daily`] : [])
      .concat(COMMON_RULES.filter(c => c.needle.includes(`"${qid}", "${v}"`)).map(c => c.id)),
  });
  questions.forEach(q => q.opts.forEach(o => { o.use = useOf(q.id, o.v); o.unused = !o.use.score.length && !o.use.pick.length && !o.use.refer.length; }));

  /* ---- 6. 한 답만 바꿔 보기 (예시 답변 기준) ---- */
  const base = app.run(topic, T.sample).r;
  const perturb = [];
  T.questions.forEach(q => q.opts.forEach(([v]) => {
    if (q.multi ? (v === "none" ? false : T.sample[q.id].includes(v)) : T.sample[q.id] === v) return;
    const a = JSON.parse(JSON.stringify(T.sample));
    a[q.id] = q.multi ? (v === "none" ? ["none"] : [...T.sample[q.id].filter(x => x !== "none"), v]) : v;
    const x = app.run(topic, a).r;
    const changed = x.patterns.join() !== base.patterns.join() || x.adjustments.join() !== base.adjustments.join() || x.referFirst !== base.referFirst;
    perturb.push({ q: q.id, v, change: q.multi ? (v === "none" ? "없음으로" : `${v} 추가`) : `→ ${v}`, patterns: x.patterns, adjustments: x.adjustments, referFirst: x.referFirst, unclear: x.unclear, changed });
  }));

  /* ---- 7. 근거 위치와 연구 연결 ---- */
  const studyIdx = L.studyIndex(app);
  const anchorOf = l => l.owner.type === "pattern" ? { section: "patterns", key: l.owner.id } : l.owner.type === "adjustment" ? { section: "adjustments", key: l.owner.id } : null;
  const locs = L.evidenceLocations(app, topic).map(l => ({ ...l, where: L.locate(app, l.text, files, anchorOf(l)) || (l.kind.startsWith("위험") ? `${topicFile}:${L.lineOf(app.fileText(topicFile), "flagSrc:")}` : `${L.MANUAL} (같은 문장이 여러 곳이거나 찾지 못함)`) }));
  /* 변수 선택 줄과 변수의 연결: 줄에 sc.X 또는 "X"가 있으면 직접 연결. main/other를 쓰는 줄은 main을 정하는 줄에 나온 변수들과 연결 */
  const mainLine = parsed.selection.find(x => /const main\b/.test(x.code));
  const mainVars = mainLine ? [...new Set([...mainLine.code.matchAll(/sc\.(\w+)|"(\w+)"/g)].map(m => m[1] || m[2]))].filter(v => parsed.variables.includes(v)) : [];
  const selFor = v => parsed.selection.filter(x => new RegExp(`sc\\.${v}\\b|"${v}"`).test(x.code) || (mainVars.includes(v) && /\b(main|other)\b/.test(x.code))).map(x => x.id);
  const qOfVars = vars => [...new Set(parsed.scoreRules.filter(x => vars.includes(x.variable)).flatMap(x => x.cond.map(c => c.q)))];
  const relatedRules = (owner) => {
    if (owner.type === "pattern") {
      const direct = qOfVars([owner.id]);
      const indirect = mainVars.includes(owner.id) ? qOfVars(mainVars.filter(v => v !== owner.id)).filter(q => !direct.includes(q)) : [];
      return { rules: [...parsed.scoreRules.filter(x => x.variable === owner.id).map(x => x.id), ...selFor(owner.id), "common.F.zero"], questions: direct, indirect };
    }
    if (owner.type === "adjustment") {
      const p = parsed.pickRules.filter(x => x.adj === owner.id);
      const qs = [...new Set(p.flatMap(x => (x.cond || []).map(c => c.q).concat(x.priorityRule ? L.hasCalls(x.priorityRule.expr).map(c => c.q) : [])))];
      const viaMain = p.some(x => x.priorityRule && /\bmain\b/.test(x.priorityRule.expr));
      const indirect = viaMain ? qOfVars(mainVars).filter(q => !qs.includes(q)) : [];
      return { rules: [...p.map(x => x.id), "common.F.top3", ...(viaMain && mainLine ? [mainLine.id] : []), "common.F.unclearNoAdj", "common.F.referOnly"], questions: qs, indirect, viaMain };
    }
    if (owner.type === "safety") return { rules: flags.map(f => f.id), questions: [], indirect: [] };
    if (owner.type === "question") return { rules: [`${topic}.Q.${owner.id}`], questions: [owner.id], indirect: [] };
    return { rules: [], questions: [], indirect: [], always: true };
  };
  const links = [];
  locs.forEach(l => {
    const parts = L.splitSources(l.src);
    const rel = relatedRules(l.owner);
    const variables = l.owner.type === "pattern" ? [l.owner.id] : [];
    const adjs = l.owner.type === "adjustment" ? [l.owner.id] : [];
    if (!parts.length) {
      links.push({ link_id: `${l.id}#-`, study_id: "", study_name_in_code: "", registry: "", study_type_in_app: "", population_in_app: "", population_shown: "", location_id: l.id, location: l.where, element_kind: l.kind, app_label: l.label, shown_to_user: l.shown ? "Y" : "N",
        claim_text: l.text, sentence_study_mapping: "출처 없음", related_variables: variables.join(" "), related_adjustments: adjs.join(" "), related_rule_ids: rel.rules.join(" "), related_question_ids: rel.questions.join(" "), related_question_ids_indirect: (rel.indirect || []).join(" ") });
      return;
    }
    parts.forEach(part => {
      const ms = L.matchStudies(app, part);
      const st = ms[0];
      links.push({
        link_id: `${l.id}#${st ? st.id : "unregistered-" + L.slug(part)}`,
        study_id: st ? st.id : `unregistered:${L.slug(part)}`,
        study_name_in_code: part,
        registry: st ? "content/studies.js" : `${L.MANUAL} (연구 목록에 없음)`,
        study_type_in_app: st ? st.type : L.MANUAL,
        population_in_app: st ? st.who : L.MANUAL,
        population_shown: st ? (st.whoUser || st.who) : "",
        location_id: l.id, location: l.where, element_kind: l.kind, app_label: l.label, shown_to_user: l.shown ? "Y" : "N",
        claim_text: l.text,
        sentence_study_mapping: parts.length === 1 ? "출처 1개 (문장 전체에 대응)" : `${L.MANUAL} (출처 ${parts.length}개 중 어느 문장이 이 연구인지 코드에 없음)`,
        related_variables: variables.join(" "), related_adjustments: adjs.join(" "),
        related_rule_ids: rel.always ? "(답변과 무관하게 항상 표시)" : rel.rules.join(" "), related_question_ids: rel.questions.join(" "), related_question_ids_indirect: (rel.indirect || []).join(" "),
      });
    });
  });
  // Work 칸 (비워 둠)
  links.forEach(x => Object.assign(x, { claim_category: L.MANUAL, work_matrix_row: "", work_finding_type: "", work_grade: "", work_note: "" }));

  /* ---- 8. Work Evidence Matrix 합치기 (파일이 있을 때만) ---- */
  const workPath = path.join(OUT, "work", `${topic}-evidence-matrix.csv`);
  let work = null;
  if (fs.existsSync(workPath)) {
    work = parseCsv(fs.readFileSync(workPath, "utf8"));
    links.forEach(x => {
      const rows = work.filter(w => w.study_id === x.study_id && (!w.location_id || w.location_id === x.location_id));
      if (rows.length) Object.assign(x, { work_matrix_row: rows.map(w => w.matrix_row_id).join(" "), work_finding_type: rows.map(w => w.finding_type).join(" / "), work_grade: rows.map(w => w.work_grade).join(" / "), work_note: rows.map(w => w.finding_text).join(" / ") });
    });
  }

  /* ---- 9. 연구별 역추적 ---- */
  const byStudy = {};
  links.filter(x => x.study_id).forEach(x => { (byStudy[x.study_id] = byStudy[x.study_id] || []).push(x); });

  const reviewRecords = []; // 검토 상태는 바꾸지 않는다. 문서에는 "검토 전"만 적는다(review-status.js 기록 0개 기준).
  const fp = L.topicFingerprint(app, topic);
  return { topic, T, app, parsed, questions, COMMON_RULES, flags, stats, pct, perturb, base, locs, links, byStudy, manual, work, fp, files, reviewRecords };
}

/* ---------- CSV ---------- */
const CSV_COLS = ["link_id", "study_id", "study_name_in_code", "registry", "study_type_in_app", "population_in_app", "population_shown", "location_id", "location", "element_kind", "app_label", "shown_to_user", "claim_text", "sentence_study_mapping", "related_variables", "related_adjustments", "related_rule_ids", "related_question_ids", "related_question_ids_indirect", "claim_category", "work_matrix_row", "work_finding_type", "work_grade", "work_note"];
const q = v => { const s = String(v ?? ""); return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s; };
function toCsv(rows, cols) { return [cols.join(","), ...rows.map(r => cols.map(c => q(r[c])).join(","))].join("\n") + "\n"; }
function parseCsv(text) {
  const rows = []; let row = [], cur = "", inq = false;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (inq) { if (ch === '"' && text[i + 1] === '"') { cur += '"'; i++; } else if (ch === '"') inq = false; else cur += ch; }
    else if (ch === '"') inq = true; else if (ch === ",") { row.push(cur); cur = ""; } else if (ch === "\n") { row.push(cur); rows.push(row); row = []; cur = ""; } else if (ch !== "\r") cur += ch;
  }
  if (cur || row.length) { row.push(cur); rows.push(row); }
  const head = rows.shift() || [];
  return rows.filter(r => r.some(Boolean)).map(r => Object.fromEntries(head.map((h, i) => [h, r[i] || ""])));
}

/* ---------- Markdown ---------- */
const md = s => String(s ?? "").replace(/\|/g, "\\|").replace(/\n/g, " ");
function header(d, title) {
  return `# ${title}\n\n> 자동 생성 문서 — \`node tools/audit/build-trace.js --topic ${d.topic}\` 로 다시 만든다. 직접 고치지 말 것.\n> 콘텐츠 버전 ${d.app.CONTENT_VERSION} · 코드 지문 \`${d.fp}\` (코드가 바뀌면 \`node tools/audit/verify-trace.js\`가 알려준다)\n> "${L.MANUAL}" 표시는 코드에서 자동으로 확인할 수 없어 사람이 확인해야 하는 곳이다. 추측으로 채우지 않았다.\n\n`;
}

function traceMd(d) {
  const { topic, T, parsed, questions, COMMON_RULES, flags, stats, pct, perturb, base, links, byStudy, manual } = d;
  let s = header(d, `${T.name} — 질문에서 운동 조정까지 추적표`);
  s += `관련 문서: 판단 규칙 전체 목록 [rule-inventory.md](../rule-inventory.md) · 근거 연결 [${topic}-evidence-links.csv](${topic}-evidence-links.csv) · 검토 질문 [${topic}-review-questions.md](${topic}-review-questions.md) · 구조 설명 [README.md](README.md)\n\n`;
  s += `## 0. 흐름\n\n위험 신호 질문 (하나라도 "예"면 진료 안내에서 멈춤) → 상황 질문 → **점수 규칙**(\`${topic}.S.*\`) → **변수 선택**(\`${topic}.SEL.*\` + 공통 \`common.F.zero\`) → **조정 후보**(\`${topic}.P.*\`) → **공통 마무리**(\`common.F.*\`: 상위 3개, 진료 먼저) → 화면\n\n`;
  s += `- 판단 함수: \`${d.files[0]}\` 의 \`analyse()\` (${parsed.scInit ? `${d.files[0]}:${parsed.scInit.line}` : L.MANUAL}부터) · 공통 마무리: \`js/app.js\` 의 \`finish()\`\n`;
  s += `- 코드 해석 결과: 점수 규칙 ${parsed.scoreRules.length}개, 조정 후보 규칙 ${parsed.pickRules.length}개, 변수 선택 줄 ${parsed.selection.length}개, 해석 못 한 줄 ${parsed.unparsed.length}개\n`;
  s += `- 자동 대조: 무작위 답변 ${stats.n.toLocaleString()}개에서 해석한 점수 규칙으로 다시 계산한 점수가 실제 \`analyse()\` 점수와 다른 경우 **${stats.scoreMismatch}건**, 조정 후보 목록이 다른 경우 **${stats.pickMismatch}건**\n\n`;

  s += `## 1. 질문과 답이 쓰이는 곳\n\n| 질문 ID | 질문 | 답 값 | 답 문구 | 점수 규칙 | 조정 후보 규칙 | 진료 먼저 규칙 |\n| --- | --- | --- | --- | --- | --- | --- |\n`;
  questions.forEach(qq => qq.opts.forEach((o, i) => {
    s += `| ${i ? "" : `\`${qq.id}\`${qq.multi ? " (여러 개)" : ""}`} | ${i ? "" : md(qq.text)} | \`${o.v}\` | ${md(o.label)} | ${o.use.score.map(x => `\`${x}\``).join("<br>") || "-"} | ${o.use.pick.map(x => `\`${x}\``).join("<br>") || "-"} | ${o.use.refer.map(x => `\`${x}\``).join("<br>") || "-"} |\n`;
  }));
  const unused = questions.flatMap(qq => qq.opts.filter(o => o.unused).map(o => `\`${qq.id}=${o.v}\``));
  s += `\n판단 규칙 어디에도 쓰이지 않는 답 (요약·기록에만 쓰임): ${unused.join(", ") || "없음"}\n\n질문 위치: ${questions.map(qq => `\`${qq.id}\` ${qq.where}`).join(" · ")}\n\n`;

  s += `## 2. 점수 규칙 (\`${topic}.S.*\`)\n\n변수 점수는 0에서 시작해 아래 조건마다 더한다. 코드 원문 기준이며 위 자동 대조로 확인했다.\n\n| 규칙 ID | 조건 | 변수 | 점수 | 위치 |\n| --- | --- | --- | --- | --- |\n`;
  parsed.scoreRules.forEach(r => { s += `| \`${r.id}\` | ${md(L.condText(r.cond))}${r.elseOf ? ` (단, ${md(L.condText(r.elseOf))}가 아닐 때)` : ""} | \`${r.variable}\` | +${r.points} | ${d.files[0]}:${r.line} |\n`; });
  if (parsed.unparsed.length) { s += `\n**해석 못 한 줄 (${L.MANUAL})**\n\n`; parsed.unparsed.forEach(u => { s += `- ${d.files[0]}:${u.line} \`${md(u.code)}\` — ${u.why}\n`; }); }

  s += `\n## 3. 결과 변수와 선택 규칙\n\n| 변수 ID | 화면 제목 | 근거 표시 | 근거 위치 | 화면에 안 보이는 내부 자료 |\n| --- | --- | --- | --- | --- |\n`;
  Object.entries(T.patterns).forEach(([k, p]) => {
    s += `| \`${k}\`${p.referOnly ? " (진료 먼저)" : ""} | ${md(p.title)} | 연구 종합 해석 카드 · 논문 확인: ${md(p.src || "없음")}${p.hypo ? " · 가설 있음" : ""} | ${links.find(x => x.location_id === `${topic}.pat.${k}.evText`)?.location || L.MANUAL} | ${p.term ? "질환명(term)" : ""}${p.internal ? " · 진단 관련 문장" : ""} |\n`;
  });
  s += `\n**선택 규칙 (코드 원문이 기준. 설명은 사람이 쓴 것 = 수동)**\n\n| 규칙 ID | 코드 원문 | 위치 | 설명 (수동) |\n| --- | --- | --- | --- |\n`;
  parsed.selection.forEach((x, i) => { s += `| \`${x.id}\` | \`${md(x.code)}\` | ${d.files[0]}:${x.line} | ${md((manual.selectionNotes || {})[String(i + 1)] || L.MANUAL)} |\n`; });
  s += `| \`common.F.zero\` | 공통 | ${COMMON_RULES.find(c => c.id === "common.F.zero").where} | ${md(COMMON_RULES.find(c => c.id === "common.F.zero").text)} |\n`;

  s += `\n## 4. 조정 후보 규칙과 우선순위 (\`${topic}.P.*\`)\n\n숫자가 작을수록 먼저 보인다. 후보 중 상위 3개만 화면에 나온다(\`common.F.top3\`).\n\n| 규칙 ID | 조정 | 후보가 되는 조건 | 우선순위 | 위치 | 표본에서 후보 / 최종 표시 / 3개 제한으로 빠짐 |\n| --- | --- | --- | --- | --- | --- |\n`;
  parsed.pickRules.forEach(p => {
    const pr = p.priority !== null ? p.priority : `${p.priorityRule.ifTrue} 또는 ${p.priorityRule.ifFalse}: \`${md(p.priorityRule.expr)}\`이 참이면 ${p.priorityRule.ifTrue}${(manual.priorityNotes || {})[p.id] ? ` — ${md(manual.priorityNotes[p.id])} (수동 설명)` : ""}`;
    s += `| \`${p.id}\` | ${md(T.adjustments[p.adj]?.title || L.MANUAL)} | ${p.cond ? md(L.condText(p.cond)) : "항상"} | ${pr} | ${d.files[0]}:${p.line} | ${pct(stats.cand[p.adj])} / ${pct(stats.fin[p.adj])} / ${pct(stats.cut[p.adj])} |\n`;
  });
  s += `\n## 5. 공통 마무리 규칙 (\`js/app.js\` \`finish()\`)\n\n| 규칙 ID | 내용 | 위치 |\n| --- | --- | --- |\n`;
  COMMON_RULES.forEach(c => { s += `| \`${c.id}\` | ${md(c.text)}${c.found ? "" : ` **(코드에서 찾지 못함: ${L.MANUAL})**`} | ${c.where} |\n`; });
  if (parsed.referArgs) s += `| \`${topic}.REFER.daily\` | 주제 조건: ${Array.isArray(parsed.referArgs.referDaily) ? md(L.condText(parsed.referArgs.referDaily)) : `\`${md(parsed.referArgs.referDaily.expr)}\` (${L.MANUAL})`} 이면 '진료를 먼저 권해요' | ${d.files[0]}:${parsed.referArgs.line} |\n`;

  s += `\n## 6. 위험 신호 (조정으로 넘어가지 않음)\n\n여러 개에 "예"면 가장 급한 단계(숫자가 작은 것)를 보여준다 (\`js/app.js\` \`pickFlagLevel()\`). 출처: ${md(T.flagSrc)}\n\n| 규칙 ID | 질문 | 단계 | 안내 제목 | 정의 위치 |\n| --- | --- | --- | --- | --- |\n`;
  flags.forEach(f => { s += `| \`${f.id}\` | ${md(f.text)} | ${f.level} | ${md(f.levelTitle)} | ${f.from} |\n`; });

  s += `\n## 7. 연구별 역추적\n\n어떤 연구에 대한 Work의 결론이 나오면 이 표에서 영향 범위를 찾는다. "관련 질문"은 코드상 그 카드·조정이 나오도록 만드는 질문이다(근거 관계가 아니라 **코드 경로**).\n\n`;
  Object.entries(byStudy).sort().forEach(([sid, rows]) => {
    const first = rows[0];
    s += `### \`${sid}\` — ${md(first.study_name_in_code)}\n\n- 연구 목록 등록: ${md(first.registry)} · 앱에 적힌 연구 종류: ${md(first.study_type_in_app)} · 앱에 적힌 대상(내부): ${md(first.population_in_app)}\n`;
    rows.forEach(x => {
      s += `- **${md(x.element_kind)}** \`${x.location_id}\` (${x.location}, 화면 ${x.shown_to_user === "Y" ? "표시" : "안 보임"}) — ${md(x.app_label)}\n  - 문장: "${md(x.claim_text)}"\n  - 문장-연구 대응: ${md(x.sentence_study_mapping)}\n`;
      if (x.related_variables) s += `  - 영향받는 결과 변수: \`${x.related_variables}\`\n`;
      if (x.related_adjustments) s += `  - 영향받는 조정: \`${x.related_adjustments}\`\n`;
      s += `  - 관련 규칙: ${x.related_rule_ids ? x.related_rule_ids.split(" ").map(r => r.startsWith("(") ? r : `\`${r}\``).join(" ") : "-"}\n  - 관련 질문 (직접): ${x.related_question_ids ? x.related_question_ids.split(" ").map(r => `\`${r}\``).join(" ") : "-"}${x.related_question_ids_indirect ? ` · (간접: 맨 앞 변수 경쟁을 통해) ${x.related_question_ids_indirect.split(" ").map(r => `\`${r}\``).join(" ")}` : ""}\n`;
    });
    s += "\n";
  });

  s += `## 8. 한 답만 바꿨을 때 (예시 답변 기준)\n\n예시 답변의 결과: 변수 ${base.patterns.map(x => `\`${x}\``).join(", ")} · 조정 ${base.adjustments.map(x => `\`${x}\``).join(", ")}\n\n| 질문 | 바꾼 답 | 결과 변수 | 최종 조정 | 진료 먼저 | 달라짐 |\n| --- | --- | --- | --- | --- | --- |\n`;
  perturb.forEach(p => { s += `| \`${p.q}\` | ${p.change} | ${p.patterns.join(", ") || "(없음)"}${p.unclear ? " · 좁히기 어려움" : ""} | ${p.adjustments.join(", ") || "(없음)"} | ${p.referFirst ? "예" : ""} | ${p.changed ? "**예**" : ""} |\n`; });

  s += `\n## 9. 무작위 답변 ${stats.n.toLocaleString()}개에서 본 결과\n\n| 변수 | 결과에 나옴 | 맨 앞에 나옴 |\n| --- | --- | --- |\n`;
  Object.keys(T.patterns).forEach(k => { s += `| \`${k}\` | ${pct(stats.pattern[k])} | ${pct(stats.patternMain[k])} |\n`; });
  s += `\n좁히기 어려움 ${pct(stats.unclear)} · 진료 먼저 안내 ${pct(stats.referFirst)} · 조정 없음 ${pct(stats.noAdj)}\n`;
  return s;
}

function reviewMd(d) {
  const { topic, T, parsed, COMMON_RULES, flags, links, manual, questions } = d;
  let s = header(d, `${T.name} — 전문가 검토가 필요한 판단 규칙`);
  s += `이 목록은 **질문만** 정리한다. 의학적 판단이나 새 기준은 담지 않는다. 모든 항목의 검토 상태는 \`content/review-status.js\` 기준 **검토 전**이다(이 문서는 상태를 바꾸지 않는다).\n`;
  s += `항목 번호(B·C)는 [expert-review-pending.md](../expert-review-pending.md)의 번호이고, 규칙 ID는 [${topic}-traceability.md](${topic}-traceability.md)와 같다. 규칙 ID와 검토 항목 번호의 연결은 사람이 한 것이다(\`tools/audit/manual/${topic}.json\`).\n\n`;
  const ruleToItems = {};
  const allIds = [...parsed.scoreRules.map(r => r.id), ...parsed.selection.map(r => r.id), ...parsed.pickRules.map(r => r.id), ...COMMON_RULES.map(r => r.id), ...flags.map(f => f.id), ...questions.map(qq => qq.qid), `${topic}.REFER.daily`];
  Object.entries(manual.reviewItems || {}).forEach(([item, v]) => v.targets.forEach(t => {
    const ids = t === "*score" ? parsed.scoreRules.map(r => r.id) : t === "*pick" ? parsed.pickRules.map(r => r.id) : t === "*selection" ? parsed.selection.map(r => r.id)
      : t.endsWith(".*") ? allIds.filter(x => x.startsWith(t.slice(0, -1))) : [t];
    ids.forEach(id => { (ruleToItems[id] = ruleToItems[id] || []).push(item); });
  }));
  const ev = id => links.filter(x => (x.related_rule_ids || "").split(" ").includes(id)).map(x => `${x.location_id} (${x.study_name_in_code || "출처 없음"})`);
  const sect = (title, rows, qtext) => {
    s += `## ${title}\n\n| 규칙 ID | 코드 원문·내용 | 검토 항목 | 이 규칙과 코드상 연결된 근거 위치 | 전문가에게 물을 것 |\n| --- | --- | --- | --- | --- |\n`;
    rows.forEach(r => { s += `| \`${r.id}\` | ${md(r.code)} | ${(ruleToItems[r.id] || []).join(", ") || "-"} | ${[...new Set(ev(r.id))].map(md).join("<br>") || "-"} | ${md(qtext(r))} |\n`; });
    s += "\n";
  };
  sect("1. 점수 규칙", parsed.scoreRules.map(r => ({ id: r.id, code: `${L.condText(r.cond)} → ${r.variable} +${r.points}` })),
    r => "이 답이 이 운동 변수와 연결된다는 근거가 있나요? 점수 크기(다른 규칙과의 상대 크기)가 적절한가요?");
  sect("2. 변수 선택 규칙", [...parsed.selection.map(r => ({ id: r.id, code: r.code })), ...COMMON_RULES.filter(c => ["common.F.zero", "common.F.unclearNoAdj"].includes(c.id)).map(c => ({ id: c.id, code: c.text }))],
    r => /\b3\b|\b2\b/.test(r.code) ? "이 기준선(숫자)으로 함께 보여줄 변수를 정해도 되나요?" : "이 방식으로 먼저 점검할 변수를 정해도 되나요?");
  sect("3. 조정 후보와 우선순위", [...parsed.pickRules.map(p => ({ id: p.id, code: p.code })), ...COMMON_RULES.filter(c => c.id === "common.F.top3").map(c => ({ id: c.id, code: c.text }))],
    r => r.id === "common.F.top3" ? "상위 3개만 보여주는 것이 적절한가요? 같은 우선순위일 때 순서는?" : "이 답에서 이 조정을 후보로 내도 되나요? 우선순위 숫자가 적절한가요?");
  sect("4. 진료 먼저와 조정", [...COMMON_RULES.filter(c => ["common.F.referLong", "common.F.referWorse", "common.F.referFirst", "common.F.referOnly"].includes(c.id)).map(c => ({ id: c.id, code: c.text })), ...(parsed.referArgs ? [{ id: `${topic}.REFER.daily`, code: parsed.referArgs.code }] : [])],
    r => "이 조건에서 진료를 먼저 권하는 것과, 조정을 함께 보여주거나 숨기는 것이 적절한가요? (C11 사례: docs/c11-review-cases.md)");
  sect("5. 위험 신호와 단계", flags.map(f => ({ id: f.id, code: `${f.text} → 단계 ${f.level} (${f.levelTitle})` })),
    r => "빠진 신호나 지나친 신호가 있나요? 안내 단계(시점)가 적절한가요?");
  sect("6. 질문 문항·선택지", questions.map(qq => ({ id: qq.qid, code: `${qq.text} [${qq.opts.map(o => o.v).join(", ")}]` })),
    r => "일반 이용자가 정확히 답할 수 있나요? 선택지 구간이 적절한가요?");

  s += `## 7. 앱이 '검증 안 된 가설'로 표시한 내용\n\n| 위치 | 내용 |\n| --- | --- |\n`;
  d.locs.filter(l => l.label === "검증 안 된 가설").forEach(l => { s += `| \`${l.id}\` (${l.where}) | ${md(l.text)} |\n`; });
  s += `\n## 8. 출처가 여러 개라 문장-연구 대응을 사람이 확인해야 하는 곳\n\n`;
  const multi = [...new Set(links.filter(x => x.sentence_study_mapping.startsWith(L.MANUAL)).map(x => x.location_id))];
  multi.forEach(id => { const x = links.find(y => y.location_id === id); s += `- \`${id}\` (${x.location}): 출처 "${md(links.filter(y => y.location_id === id).map(y => y.study_name_in_code).join(", "))}" — "${md(x.claim_text)}"\n`; });
  const unreg = [...new Set(links.filter(x => x.study_id.startsWith("unregistered:")).map(x => x.study_name_in_code))];
  s += `\n## 9. 연구 목록(content/studies.js)에 없는 출처\n\n${unreg.length ? unreg.map(x => `- ${md(x)} — 연구 종류·대상 정보가 없어 화면의 근거 수준 표시에도 빠져 있다 (${L.MANUAL})`).join("\n") : "- 없음"}\n`;
  return s;
}

function write(d) {
  fs.mkdirSync(OUT, { recursive: true });
  const files = {
    [`${d.topic}-traceability.md`]: traceMd(d),
    [`${d.topic}-evidence-links.csv`]: toCsv(d.links, CSV_COLS),
    [`${d.topic}-review-questions.md`]: reviewMd(d),
    [`${d.topic}-trace.json`]: JSON.stringify({
      topic: d.topic, contentVersion: d.app.CONTENT_VERSION, fingerprint: d.fp,
      questions: d.questions, scoreRules: d.parsed.scoreRules, selection: d.parsed.selection, pickRules: d.parsed.pickRules,
      referArgs: d.parsed.referArgs, commonRules: d.COMMON_RULES.map(({ needle, ...c }) => c), flags: d.flags,
      unparsed: d.parsed.unparsed, links: d.links,
      verification: { samples: d.stats.n, scoreMismatch: d.stats.scoreMismatch, pickMismatch: d.stats.pickMismatch },
    }, null, 1) + "\n",
  };
  return files;
}

module.exports = { build, write, CSV_COLS, parseCsv, OUT };

if (require.main === module) {
  const d = build(TOPIC);
  const files = write(d);
  for (const [name, content] of Object.entries(files)) fs.writeFileSync(path.join(OUT, name), content);
  console.log(`만듦: ${Object.keys(files).map(f => "docs/audit/" + f).join(", ")}`);
  console.log(`점수 규칙 ${d.parsed.scoreRules.length} · 조정 후보 규칙 ${d.parsed.pickRules.length} · 선택 줄 ${d.parsed.selection.length} · 해석 못 한 줄 ${d.parsed.unparsed.length}`);
  console.log(`대조(무작위 ${d.stats.n}): 점수 불일치 ${d.stats.scoreMismatch} · 후보 불일치 ${d.stats.pickMismatch}`);
  console.log(`근거 연결 ${d.links.length}줄 · 수동 검토 필요 ${d.links.filter(x => Object.values(x).some(v => String(v).startsWith(L.MANUAL) && v !== x.claim_category)).length}줄${d.work ? " · Work 행렬 합침" : " · Work 행렬 없음"}`);
}
