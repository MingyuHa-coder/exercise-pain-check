#!/usr/bin/env node
/* =========================================================
   추적 자료 검증
   실행: node tools/audit/verify-trace.js [--topic bench] [--root 폴더] [--out 자료폴더] [--work Work폴더]
   1) docs/audit의 자료가 지금 코드로 다시 만든 것과 같은지 (코드가 바뀌었는데 자료를 안 고쳤는지)
   2) 판단 규칙이 기준 자료(<topic>-trace.json)와 달라졌는지 — 점수·우선순위·선택 줄·공통 규칙을 하나씩 비교
   3) 해석한 규칙이 실제 analyse()와 같은지, 최종 결과 독립 모델이 실제 결과와 같은지
   4) 손으로 계산한 고정 사례(tools/audit/cases/<topic>.json)가 모두 맞는지
   5) 코드와 추적 자료 사이에 빠진 것·맞지 않는 것이 없는지
   6) (있으면) Work 자료: 앱 인용 연구 + 신규 연구(new:) ID·연결이 올바른지
   오류가 있으면 종료 코드 1. "수동 검토 필요"는 오류가 아니라 알림으로 보여준다(검증 완료로 세지 않음).
   ========================================================= */
const fs = require("fs");
const path = require("path");
const L = require("./lib");
const B = require("./build-trace");
const W = require("./work");

function snapshotDiff(oldJ, d) {
  const out = [];
  const byId = arr => new Map((arr || []).map(x => [x.id, x]));
  const prio = p => p.priorityRule ? `(${p.priorityRule.expr}) ? ${p.priorityRule.ifTrue} : ${p.priorityRule.ifFalse}` : String(p.priority);
  const cond = c => (c || []).map(x => `${x.q}=${x.v}`).join("/") || "(항상)";
  const oS = byId(oldJ.scoreRules), nS = byId(d.parsed.scoreRules);
  nS.forEach((r, id) => { const o = oS.get(id); if (!o) out.push(`${id} 새 점수 규칙 (+${r.points})`); else if (o.points !== r.points) out.push(`${id} 점수 ${o.points} → ${r.points}`); else if (JSON.stringify(o.elseOf || null) !== JSON.stringify(r.elseOf || null)) out.push(`${id} else 관계 바뀜`); });
  oS.forEach((r, id) => { if (!nS.has(id)) out.push(`${id} 점수 규칙 사라짐`); });
  const oP = byId(oldJ.pickRules), nP = byId(d.parsed.pickRules);
  nP.forEach((p, id) => { const o = oP.get(id); if (!o) out.push(`${id} 새 조정 후보 규칙`); else { if (prio(o) !== prio(p)) out.push(`${id} 우선순위 ${prio(o)} → ${prio(p)}`); if (cond(o.cond) !== cond(p.cond)) out.push(`${id} 후보 조건 ${cond(o.cond)} → ${cond(p.cond)}`); } });
  oP.forEach((p, id) => { if (!nP.has(id)) out.push(`${id} 조정 후보 규칙 사라짐`); });
  const oSel = (oldJ.selection || []).map(x => x.code), nSel = d.parsed.selection.map(x => x.code);
  const n = Math.max(oSel.length, nSel.length);
  for (let i = 0; i < n; i++) if (oSel[i] !== nSel[i]) out.push(`${d.topic}.SEL.${i + 1} 변수 선택 줄 바뀜: ${oSel[i] || "(없음)"} → ${nSel[i] || "(없음)"}`);
  const oC = byId(oldJ.commonRules);
  d.COMMON_RULES.forEach(c => { const o = oC.get(c.id); if (o && o.found && !c.found) out.push(`${c.id} 공통 규칙 코드가 바뀜 (기준 문장을 js/app.js finish()에서 찾을 수 없음)`); });
  if (JSON.stringify(oldJ.referArgs || null) !== JSON.stringify(d.parsed.referArgs || null)) out.push(`${d.topic}.REFER.daily 진료 먼저 조건 바뀜`);
  return out;
}

function verify(topic = "bench", opts = {}) {
  const root = opts.root || L.ROOT;
  const outDir = opts.outDir || path.join(root, "docs", "audit");
  const workDir = opts.workDir || path.join(root, "docs", "audit", "work");
  const errors = [], notes = [], passes = [], manualChecks = [];
  const check = (name, cond, detail = "") => { (cond ? passes : errors).push(cond ? name : `${name}${detail ? " — " + detail : ""}`); };

  const d = B.build(topic, { root, workDir, samples: opts.samples });
  const files = B.write(d);
  const { T, parsed, links, questions, COMMON_RULES, flags, locs, manual, stats, app, model, modelMismatch, cases } = d;

  /* 1. 판단 규칙이 기준 자료와 같은지 (의도적으로 바꾼 우선순위·점수도 여기서 드러난다) */
  const tracePath = path.join(outDir, `${topic}-trace.json`);
  if (fs.existsSync(tracePath)) {
    const diff = snapshotDiff(JSON.parse(fs.readFileSync(tracePath, "utf8")), d);
    check("판단 규칙이 기준 자료(trace.json)와 같음", diff.length === 0, `바뀐 규칙: ${diff.join(" / ")} → 의도한 변경이면 전문가 검토 후 build-trace.js로 기준 자료를 다시 만들고 고정 사례 기대값을 손으로 다시 계산할 것`);
  } else check("기준 자료(trace.json) 있음", false, "파일 없음 → build-trace.js 실행");

  /* 2. 자료가 최신인지 */
  for (const [name, content] of Object.entries(files)) {
    const p = path.join(outDir, name);
    const disk = fs.existsSync(p) ? fs.readFileSync(p, "utf8") : null;
    check(`docs/audit/${name} 최신`, disk === content, disk === null ? "파일 없음 → build-trace.js 실행" : "코드 또는 Work 자료가 바뀜 → node tools/audit/build-trace.js 로 다시 만들기");
  }

  /* 3. 규칙 해석과 최종 결과 */
  check("analyse() 모든 줄 해석", parsed.unparsed.length === 0, parsed.unparsed.map(u => `줄 ${u.line}: ${u.code}`).join(" / "));
  check(`점수 규칙 해석 대조 (무작위 ${stats.n})`, stats.scoreMismatch === 0, `${stats.scoreMismatch}건 불일치`);
  check(`조정 후보 해석 대조 (무작위 ${stats.n})`, stats.pickMismatch === 0, `${stats.pickMismatch}건 불일치`);
  if (model.ok) check(`최종 결과 독립 모델 대조 (무작위 ${stats.n}: 변수·조정 순서·상위 3개·좁히기 어려움·진료 먼저)`, modelMismatch === 0,
    `${modelMismatch}건 불일치. 예: ${d.modelExamples.slice(0, 1).map(e => `모델 ${JSON.stringify(e.model)} / 실제 ${JSON.stringify(e.real)}`).join("")}`);
  else manualChecks.push(`최종 결과 독립 모델을 만들 수 없음 (${model.why.join(", ")}) — 변수 선택·최종 추천은 ${L.MANUAL}`);
  if (cases) {
    const failed = cases.results.filter(c => !c.pass);
    check(`고정 사례 ${cases.results.length}개 (손으로 계산한 경계·특정 답 조합)`, failed.length === 0,
      failed.map(c => `${c.id}: 기대 ${JSON.stringify(c.expect)} / 실제 ${JSON.stringify(c.got)}`).join(" / "));
    const ruleIdSet = new Set(d.ruleRows.map(r => r.id));
    const badCover = cases.results.flatMap(c => (c.covers || []).filter(id => !ruleIdSet.has(id)).map(id => `${c.id}→${id}`));
    check("고정 사례가 가리키는 규칙 ID가 모두 실제 규칙", badCover.length === 0, badCover.join(", "));
  } else manualChecks.push(`고정 사례 없음 (tools/audit/cases/${topic}.json) — 모든 규칙 ${L.MANUAL}`);
  d.ruleRows.filter(r => !r.status.startsWith("동작 확인")).forEach(r => {
    if (r.status.startsWith("실패")) errors.push(`${r.id}: ${r.status}`); else manualChecks.push(`${r.id}: ${r.status}`);
  });
  d.ruleRows.filter(r => r.status.includes("일부 미확인")).forEach(r => manualChecks.push(`${r.id}: ${r.status.split(" · ").slice(1).join(" · ")}`));

  check("공통 규칙(finish)이 모두 코드에 있음", COMMON_RULES.every(c => c.found), COMMON_RULES.filter(c => !c.found).map(c => c.id).join(", "));
  check("점수 규칙의 변수가 모두 결과 변수에 있음", parsed.scoreRules.every(r => T.patterns[r.variable]), parsed.scoreRules.filter(r => !T.patterns[r.variable]).map(r => r.id).join(", "));
  const varsWithoutScore = Object.keys(T.patterns).filter(k => !parsed.variables.includes(k));
  if (varsWithoutScore.length) notes.push(`점수표 밖의 결과 변수(선택 규칙으로만 나옴): ${varsWithoutScore.join(", ")}`);
  check("조정 후보 규칙의 조정이 모두 있음", parsed.pickRules.every(p => T.adjustments[p.adj]), parsed.pickRules.filter(p => !T.adjustments[p.adj]).map(p => p.id).join(", "));
  const noRule = Object.keys(T.adjustments).filter(k => !parsed.pickRules.some(p => p.adj === k));
  check("모든 조정에 후보 규칙이 있음", noRule.length === 0, `규칙 없는 조정: ${noRule.join(", ")}`);
  const condQ = [...parsed.scoreRules.flatMap(r => r.cond), ...parsed.pickRules.flatMap(p => p.cond || [])];
  const badQ = condQ.filter(c => { const qq = T.questions.find(x => x.id === c.q); return !qq || !qq.opts.some(o => o[0] === c.v); });
  check("규칙이 쓰는 질문·답 값이 모두 실제로 있음", badQ.length === 0, badQ.map(c => `${c.q}=${c.v}`).join(", "));

  /* 4. 질문·답 빠짐 */
  const traceQ = new Map(questions.map(qq => [qq.id, qq]));
  check("모든 질문·답 값이 추적표에 있음", T.questions.every(qq => traceQ.has(qq.id) && qq.opts.every(o => traceQ.get(qq.id).opts.some(x => x.v === o[0]))));
  const unused = questions.flatMap(qq => qq.opts.filter(o => o.unused).map(o => `${qq.id}=${o.v}`));
  notes.push(`판단 규칙에 쓰이지 않는 답 ${unused.length}개: ${unused.join(", ")}`);

  /* 5. 근거 위치 */
  const srcPlaces = [
    ...Object.entries(T.patterns).filter(([, p]) => p.src).map(([k, p]) => [`${topic}.pat.${k}.evText`, p.src]),
    ...Object.entries(T.adjustments).filter(([, a]) => a.src).map(([k, a]) => [`${topic}.adj.${k}.fact`, a.src]),
    [`${topic}.flags.flagSrc`, T.flagSrc],
  ];
  const missing = srcPlaces.filter(([id, src]) => L.splitSources(src).some(part => !links.some(x => x.location_id === id && x.study_name_in_code === part)));
  check("코드의 모든 출처(변수·조정·위험 신호)가 근거 연결표에 있음", missing.length === 0, missing.map(m => m[0]).join(", "));
  app.ctx.cards.length = 0; T.extras({ sc: {}, patterns: [], adjustments: [] });
  const cardSrc = app.ctx.cards.map((c, i) => [`${topic}.card.${i + 1}`, c.src]);
  const missingCard = cardSrc.filter(([id, src]) => L.splitSources(src).some(part => !links.some(x => x.location_id === id && x.study_name_in_code === part)));
  check("설명 카드의 출처가 근거 연결표에 있음", missingCard.length === 0, missingCard.map(m => m[0]).join(", "));
  let badLine = 0, manualLoc = 0;
  locs.forEach(l => {
    if (!l.text || l.kind.startsWith("위험")) return;
    if (String(l.where).startsWith(L.MANUAL)) { manualLoc++; return; }
    const [f, ln] = l.where.split(":");
    const lineText = app.fileText(f).split("\n")[+ln - 1].replace(/\\"/g, '"');
    if (!lineText.includes(l.text.replace(/\\"/g, '"').slice(0, 24))) badLine++;
  });
  check("근거 위치(파일:줄)가 실제 그 문장을 가리킴", badLine === 0, `${badLine}곳 불일치`);
  if (manualLoc) manualChecks.push(`파일 위치를 자동으로 못 찾은 근거 ${manualLoc}곳`);

  /* 6. 규칙 ID 연결 */
  const ruleIds = new Set([...parsed.scoreRules.map(r => r.id), ...parsed.selection.map(r => r.id), ...parsed.pickRules.map(r => r.id), ...COMMON_RULES.map(r => r.id), ...flags.map(f => f.id), ...questions.map(qq => qq.qid), `${topic}.REFER.daily`]);
  const badRel = links.flatMap(x => (x.related_rule_ids || "").startsWith("(") ? [] : (x.related_rule_ids || "").split(" ").filter(r => r && !ruleIds.has(r)));
  check("근거 연결표의 규칙 ID가 모두 실제 규칙", badRel.length === 0, [...new Set(badRel)].join(", "));
  const idCount = {}; [...parsed.scoreRules, ...parsed.pickRules].forEach(r => { idCount[r.id] = (idCount[r.id] || 0) + 1; });
  const dupIds = Object.entries(idCount).filter(([, n]) => n > 1).map(([id]) => id);
  check("규칙 ID가 겹치지 않음", dupIds.length === 0, dupIds.join(", "));
  const locIds = new Set(locs.map(l => l.id));
  const badManual = [];
  Object.entries(manual.reviewItems || {}).forEach(([item, v]) => v.targets.forEach(t => {
    if (t.startsWith("*") || t.endsWith(".*") || t.startsWith("content/")) return;
    if (!ruleIds.has(t) && !locIds.has(t)) badManual.push(`${item}→${t}`);
  }));
  check(`수동 연결(manual/${topic}.json)의 대상이 모두 존재`, badManual.length === 0, badManual.join(", "));
  check("수동 설명이 선택 규칙 수와 맞음", Object.keys(manual.selectionNotes || {}).length === parsed.selection.length, `설명 ${Object.keys(manual.selectionNotes || {}).length}개, 규칙 ${parsed.selection.length}개 → 수동 설명 다시 확인`);

  /* 7. 연구 연결 */
  const unreg = [...new Set(links.filter(x => x.study_id.startsWith("unregistered:")).map(x => x.study_name_in_code))];
  if (unreg.length) manualChecks.push(`연구 목록에 없는 출처: ${unreg.join(", ")} (연구 종류·대상)`);
  const multi = new Set(links.filter(x => x.sentence_study_mapping.startsWith(L.MANUAL)).map(x => x.location_id));
  manualChecks.push(`출처가 여러 개라 문장-연구 대응을 사람이 확인해야 하는 위치 ${multi.size}곳`);
  manualChecks.push(`앱 문장이 주장하는 결과 종류(claim_category) ${links.length}줄 전부`);
  const hasWork = !!(d.work.matrix || d.work.newStudies);
  check("근거 등급·결과 칸은 Work 자료에서만 옴 (도구가 임의로 채우지 않음)", links.every(x => x.claim_category === L.MANUAL && (x.work_matrix_row || (!x.work_grade && !x.work_finding_type && !x.work_relation))));

  /* 8. Work 자료 (앱 인용 연구 + 신규 연구) */
  const appStudyIds = new Set(links.map(x => x.study_id).filter(Boolean));
  const appStudyNames = new Map(links.filter(x => x.study_id).map(x => [x.study_id, x.study_name_in_code]));
  const appDois = new Map(); // 앱 출처(content/studies.js)에는 DOI가 없다. 생기면 여기서 읽는다.
  app.STUDIES.forEach(s => { const m = JSON.stringify(s).match(/10\.\d{4,9}\/[^\s"]+/); if (m) appDois.set(W.normDoi(m[0]), s.name); });
  const wv = W.validateWork(d.work, { appStudyIds, locIds, ruleIds, appDois, appStudyNames });
  wv.passes.forEach(p => passes.push(p)); wv.errors.forEach(e => errors.push(e)); wv.notes.forEach(n => notes.push(n));
  if (hasWork) notes.push("Work 자료는 docs/audit 자료에만 붙는다. 앱의 근거 표시·사용자 문구·검토 상태는 바뀌지 않는다(아래 검사).");

  /* 9. 앱 파일·검토 상태를 건드리지 않았는지 */
  const rs = fs.readFileSync(path.join(root, "content/review-status.js"), "utf8");
  check("전문가 검토 기록은 여전히 0개", /const REVIEW_RECORDS = \[\s*\];/.test(rs));
  const idx = fs.readFileSync(path.join(root, "index.html"), "utf8");
  check("앱 화면(index.html)이 추적 자료(docs/audit)를 불러오지 않음", !/docs\/audit|tools\/audit/.test(idx));

  return { topic, passes, errors, notes, manualChecks, d };
}

module.exports = { verify, snapshotDiff };

if (require.main === module) {
  const args = process.argv.slice(2);
  const opt = n => args.includes(n) ? args[args.indexOf(n) + 1] : null;
  const topic = opt("--topic") || "bench";
  const abs = v => v ? path.resolve(v) : undefined;
  const r = verify(topic, { root: abs(opt("--root")), outDir: abs(opt("--out")), workDir: abs(opt("--work")) });
  console.log(`\n[${topic}] 추적 자료 검증`);
  r.passes.forEach(p => console.log("PASS " + p));
  r.errors.forEach(e => console.log("FAIL " + e));
  console.log(`\n${L.MANUAL} (자동 검증 완료로 세지 않음):`);
  r.manualChecks.forEach(n => console.log("- " + n));
  console.log("\n알림 (오류 아님):");
  r.notes.forEach(n => console.log("- " + n));
  console.log(`\n합계 PASS ${r.passes.length} / FAIL ${r.errors.length} / ${L.MANUAL} ${r.manualChecks.length}`);
  process.exit(r.errors.length ? 1 : 0);
}
