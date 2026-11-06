#!/usr/bin/env node
/* =========================================================
   추적 자료 검증
   실행: node tools/audit/verify-trace.js [--topic bench]
   1) docs/audit의 자료가 지금 코드로 다시 만든 것과 같은지 (코드가 바뀌었는데 자료를 안 고쳤는지)
   2) 코드와 추적 자료 사이에 빠진 것·맞지 않는 것이 없는지
   3) 해석한 규칙이 실제 analyse()와 같은지
   4) (있으면) Work의 Evidence Matrix가 올바른 연구 ID·위치 ID를 쓰는지
   오류가 있으면 종료 코드 1. "수동 검토 필요" 개수는 오류가 아니라 알림으로 보여준다.
   ========================================================= */
const fs = require("fs");
const path = require("path");
const L = require("./lib");
const B = require("./build-trace");

const args = process.argv.slice(2);
const TOPIC = args.includes("--topic") ? args[args.indexOf("--topic") + 1] : "bench";
const errors = [], notes = [], passes = [];
const check = (name, cond, detail = "") => { (cond ? passes : errors).push(cond ? name : `${name}${detail ? " — " + detail : ""}`); };

const d = B.build(TOPIC);
const files = B.write(d);
const { T, parsed, links, questions, COMMON_RULES, flags, locs, manual, stats, app } = d;

/* 1. 자료가 최신인지 */
for (const [name, content] of Object.entries(files)) {
  const p = path.join(B.OUT, name);
  const disk = fs.existsSync(p) ? fs.readFileSync(p, "utf8") : null;
  check(`docs/audit/${name} 최신`, disk === content, disk === null ? "파일 없음 → build-trace.js 실행" : "코드가 바뀜 → node tools/audit/build-trace.js 로 다시 만들기");
}

/* 2. 규칙 해석 */
check("analyse() 모든 줄 해석", parsed.unparsed.length === 0, parsed.unparsed.map(u => `줄 ${u.line}: ${u.code}`).join(" / "));
check(`점수 규칙 대조 (무작위 ${stats.n})`, stats.scoreMismatch === 0, `${stats.scoreMismatch}건 불일치`);
check(`조정 후보 대조 (무작위 ${stats.n})`, stats.pickMismatch === 0, `${stats.pickMismatch}건 불일치`);
check("공통 규칙(finish)이 모두 코드에 있음", COMMON_RULES.every(c => c.found), COMMON_RULES.filter(c => !c.found).map(c => c.id).join(", "));
check("점수 규칙의 변수가 모두 결과 변수에 있음", parsed.scoreRules.every(r => T.patterns[r.variable]), parsed.scoreRules.filter(r => !T.patterns[r.variable]).map(r => r.id).join(", "));
check("점수표 변수 = 결과 변수", JSON.stringify([...parsed.variables].sort()) === JSON.stringify(Object.keys(T.patterns).filter(k => parsed.variables.includes(k)).sort()) && parsed.variables.every(v => T.patterns[v]));
const varsWithoutScore = Object.keys(T.patterns).filter(k => !parsed.variables.includes(k));
if (varsWithoutScore.length) notes.push(`점수표 밖의 결과 변수(선택 규칙으로만 나옴): ${varsWithoutScore.join(", ")} — ${L.MANUAL}`);
check("조정 후보 규칙의 조정이 모두 있음", parsed.pickRules.every(p => T.adjustments[p.adj]), parsed.pickRules.filter(p => !T.adjustments[p.adj]).map(p => p.id).join(", "));
const noRule = Object.keys(T.adjustments).filter(k => !parsed.pickRules.some(p => p.adj === k));
check("모든 조정에 후보 규칙이 있음", noRule.length === 0, `규칙 없는 조정: ${noRule.join(", ")}`);
const condQ = [...parsed.scoreRules.flatMap(r => r.cond), ...parsed.pickRules.flatMap(p => p.cond || [])];
const badQ = condQ.filter(c => { const qq = T.questions.find(x => x.id === c.q); return !qq || !qq.opts.some(o => o[0] === c.v); });
check("규칙이 쓰는 질문·답 값이 모두 실제로 있음", badQ.length === 0, badQ.map(c => `${c.q}=${c.v}`).join(", "));

/* 3. 질문·답 빠짐 */
const traceQ = new Map(questions.map(qq => [qq.id, qq]));
check("모든 질문이 추적표에 있음", T.questions.every(qq => traceQ.has(qq.id)));
check("모든 답 값이 추적표에 있음", T.questions.every(qq => qq.opts.every(o => traceQ.get(qq.id).opts.some(x => x.v === o[0]))));
const unused = questions.flatMap(qq => qq.opts.filter(o => o.unused).map(o => `${qq.id}=${o.v}`));
notes.push(`판단 규칙에 쓰이지 않는 답 ${unused.length}개: ${unused.join(", ")}`);

/* 4. 근거 위치 */
const srcPlaces = [
  ...Object.entries(T.patterns).filter(([, p]) => p.src).map(([k, p]) => [`${TOPIC}.pat.${k}.evText`, p.src]),
  ...Object.entries(T.adjustments).filter(([, a]) => a.src).map(([k, a]) => [`${TOPIC}.adj.${k}.fact`, a.src]),
  [`${TOPIC}.flags.flagSrc`, T.flagSrc],
];
const missing = srcPlaces.filter(([id, src]) => L.splitSources(src).some(part => !links.some(x => x.location_id === id && x.study_name_in_code === part)));
check("코드의 모든 출처(변수·조정·위험 신호)가 근거 연결표에 있음", missing.length === 0, missing.map(m => m[0]).join(", "));
app.ctx.cards.length = 0; T.extras({ sc: {}, patterns: [], adjustments: [] });
const cardSrc = app.ctx.cards.map((c, i) => [`${TOPIC}.card.${i + 1}`, c.src]);
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
if (manualLoc) notes.push(`파일 위치를 자동으로 못 찾은 근거 ${manualLoc}곳 — ${L.MANUAL}`);

/* 5. 규칙 ID 연결 */
const ruleIds = new Set([...parsed.scoreRules.map(r => r.id), ...parsed.selection.map(r => r.id), ...parsed.pickRules.map(r => r.id), ...COMMON_RULES.map(r => r.id), ...flags.map(f => f.id), ...questions.map(qq => qq.qid), `${TOPIC}.REFER.daily`]);
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
check("수동 연결(manual/" + TOPIC + ".json)의 대상이 모두 존재", badManual.length === 0, badManual.join(", "));
check("수동 설명이 선택 규칙 수와 맞음", Object.keys(manual.selectionNotes || {}).length === parsed.selection.length, `설명 ${Object.keys(manual.selectionNotes || {}).length}개, 규칙 ${parsed.selection.length}개 → 수동 설명 다시 확인`);

/* 6. 연구 연결 */
const unreg = [...new Set(links.filter(x => x.study_id.startsWith("unregistered:")).map(x => x.study_name_in_code))];
if (unreg.length) notes.push(`연구 목록에 없는 출처: ${unreg.join(", ")} — ${L.MANUAL}`);
const multi = new Set(links.filter(x => x.sentence_study_mapping.startsWith(L.MANUAL)).map(x => x.location_id));
notes.push(`출처가 여러 개라 문장-연구 대응을 사람이 확인해야 하는 위치 ${multi.size}곳`);
check("근거 등급·연구 결과 칸은 비어 있음 (Work 확인 전 임의 기재 금지)", links.every(x => d.work ? true : (!x.work_grade && !x.work_finding_type && x.claim_category === L.MANUAL)));

/* 7. 검토 상태를 건드리지 않았는지 */
const rs = fs.readFileSync(path.join(L.ROOT, "content/review-status.js"), "utf8");
check("전문가 검토 기록은 여전히 0개", /const REVIEW_RECORDS = \[\s*\];/.test(rs));

/* 8. Work Evidence Matrix (있으면) */
const workPath = path.join(B.OUT, "work", `${TOPIC}-evidence-matrix.csv`);
if (fs.existsSync(workPath)) {
  const rows = B.parseCsv(fs.readFileSync(workPath, "utf8"));
  const study = new Set(links.map(x => x.study_id));
  const allowed = new Set(["", "E0", "E1", "E2", "E3", "E4", "E9"]);
  check("Work 행렬: 연구 ID가 앱 근거 연결표에 있음", rows.every(r => !r.study_id || study.has(r.study_id)), rows.filter(r => r.study_id && !study.has(r.study_id)).map(r => r.study_id).join(", "));
  check("Work 행렬: 위치 ID가 실제 위치", rows.every(r => !r.location_id || locIds.has(r.location_id)), rows.filter(r => r.location_id && !locIds.has(r.location_id)).map(r => r.location_id).join(", "));
  check("Work 행렬: 규칙 ID가 실제 규칙", rows.every(r => !r.rule_ids || r.rule_ids.split(" ").every(x => !x || ruleIds.has(x))));
  check("Work 행렬: finding_type은 E0~E4·E9", rows.every(r => allowed.has(r.finding_type || "")));
  const notInWork = [...study].filter(s => s && !rows.some(r => r.study_id === s));
  notes.push(`Work 행렬에 아직 없는 연구 ${notInWork.length}개: ${notInWork.join(", ")}`);
} else notes.push(`Work 행렬 없음 (docs/audit/work/${TOPIC}-evidence-matrix.csv) — 연구 ${new Set(links.map(x => x.study_id).filter(Boolean)).size}개 모두 Work 확인 전`);

console.log(`\n[${TOPIC}] 추적 자료 검증`);
passes.forEach(p => console.log("PASS " + p));
errors.forEach(e => console.log("FAIL " + e));
console.log("\n알림 (오류 아님):");
notes.forEach(n => console.log("- " + n));
console.log(`\n합계 PASS ${passes.length} / FAIL ${errors.length}`);
process.exit(errors.length ? 1 : 0);
