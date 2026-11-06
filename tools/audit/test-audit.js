#!/usr/bin/env node
/* =========================================================
   추적 시스템 재현 테스트
   실행: node tools/audit/test-audit.js [--quick]
   저장소를 임시 폴더에 복사해서 시험한다. 이 저장소의 파일은 바꾸지 않는다.
   A. 신규 발굴 논문(Work): 올바른 자료는 통과·연결되고, 잘못된 ID·연결은 막히는지
   B. 우선순위·최종 추천: 규칙을 일부러 바꾸면 검증이 구체적인 이유로 실패하는지
   C. 독립 확인이 없는 규칙은 "검증 완료"가 아니라 "수동 검토 필요"로 남는지
   ========================================================= */
const fs = require("fs");
const os = require("os");
const path = require("path");
const crypto = require("crypto");
const L = require("./lib");
const B = require("./build-trace");
const V = require("./verify-trace");

const QUICK = process.argv.includes("--quick");
const SAMPLES = QUICK ? 1500 : 5000;
const TOPIC = "bench";
const results = [];
const test = (name, fn) => {
  try { const r = fn(); results.push({ name, ok: r === true, detail: r === true ? "" : String(r) }); }
  catch (e) { results.push({ name, ok: false, detail: "예외: " + e.message }); }
};

const TMP = fs.mkdtempSync(path.join(os.tmpdir(), "audit-test-"));
const COPY = ["content", "js", "css", "index.html", "tools", "docs"];
let n = 0;
function copyRepo() {
  const dir = path.join(TMP, `r${++n}`);
  fs.mkdirSync(dir);
  COPY.forEach(f => fs.cpSync(path.join(L.ROOT, f), path.join(dir, f), { recursive: true }));
  return dir;
}
function appHash(root) {
  const h = crypto.createHash("sha256");
  const walk = p => { const s = fs.statSync(p); if (s.isDirectory()) fs.readdirSync(p).sort().forEach(x => walk(path.join(p, x))); else h.update(p.slice(root.length) + "\0" + fs.readFileSync(p)); };
  ["content", "js", "css", "index.html"].forEach(f => walk(path.join(root, f)));
  return h.digest("hex");
}
function rebuild(root) {
  const d = B.build(TOPIC, { root, samples: SAMPLES });
  const files = B.write(d);
  const out = path.join(root, "docs", "audit");
  Object.entries(files).forEach(([f, c]) => fs.writeFileSync(path.join(out, f), c));
  return d;
}
const verify = root => V.verify(TOPIC, { root, samples: SAMPLES });
const csv = rows => rows.map(r => r.map(v => /[",\n]/.test(v) ? `"${v.replace(/"/g, '""')}"` : v).join(",")).join("\n") + "\n";
const NEW_HEAD = ["new_study_id", "doi", "pmid", "title", "first_author", "year", "journal", "existence_checked", "existence_source", "added_by", "added_date", "notes"];
const MAT_HEAD = ["matrix_row_id", "study_id", "citation", "location_id", "rule_ids", "finding_type", "population", "study_design", "finding_text", "relation_to_app", "relation_note", "work_grade", "checked_by", "checked_date", "notes"];
/* 시험용 가짜 연구. 실제 논문이 아니며 저장소의 Work 자료에는 들어가지 않는다. */
const NS = (o = {}) => NEW_HEAD.map(h => o[h] ?? ({ new_study_id: "new:fixture-a-2099", doi: "10.9999/fixture.0001", pmid: "", title: "시험용 가상 연구 A", first_author: "Fixture", year: "2099", existence_checked: "Y", existence_source: "시험", added_by: "test" }[h] || ""));
const MR = (o = {}) => MAT_HEAD.map(h => o[h] ?? ({ matrix_row_id: "W1", study_id: "new:fixture-a-2099", location_id: "bench.adj.grip.fact", finding_type: "E1", finding_text: "시험용 결과 문장", relation_to_app: "indirect" }[h] || ""));
function withWork(newRows, matRows) {
  const root = copyRepo();
  const w = path.join(root, "docs", "audit", "work");
  fs.mkdirSync(w, { recursive: true });
  if (newRows) fs.writeFileSync(path.join(w, `${TOPIC}-new-studies.csv`), csv([NEW_HEAD, ...newRows]));
  if (matRows) fs.writeFileSync(path.join(w, `${TOPIC}-evidence-matrix.csv`), csv([MAT_HEAD, ...matRows]));
  return root;
}
const workErrors = r => r.errors.filter(e => /신규 연구 목록|Work 행렬/.test(e)).join(" / ");
function expectBlocked(name, newRows, matRows, needle) {
  test(`A. 차단: ${name}`, () => {
    const root = withWork(newRows, matRows);
    rebuild(root);
    const r = verify(root);
    const we = workErrors(r);
    if (!we) return `막히지 않음 (오류: ${r.errors.join(" / ") || "없음"})`;
    if (!we.includes(needle)) return `막혔지만 이유가 다름: ${we}`;
    return true;
  });
}

/* ---------- A. 신규 발굴 논문 ---------- */
const baseHash = appHash(L.ROOT);
test("A. 정상: 신규 연구 + 앱 인용 연구가 함께 있는 Work 자료는 통과", () => {
  const root = withWork([NS(), NS({ new_study_id: "new:fixture-b-2098", doi: "", pmid: "99999999", title: "시험용 가상 연구 B", first_author: "Other", year: "2098", existence_checked: "N" })],
    [MR(), MR({ matrix_row_id: "W2", study_id: "nevalainen-2016", location_id: "bench.adj.load.fact", finding_type: "E0", finding_text: "", relation_to_app: "undetermined" }),
     MR({ matrix_row_id: "W3", study_id: "new:fixture-b-2098", location_id: "", rule_ids: "bench.P.grip bench.S.acj.grip=g2", finding_type: "E3", finding_text: "시험용", relation_to_app: "contradict" })]);
  const before = appHash(root);
  const d = rebuild(root);
  const r = verify(root);
  if (r.errors.length) return "오류: " + r.errors.join(" / ");
  if (appHash(root) !== before) return "Work 자료를 넣은 뒤 앱 파일이 바뀜";
  const nl = d.newLinks;
  const a = nl.find(x => x.new_study_id === "new:fixture-a-2099");
  if (!a || a.target_location_id !== "bench.adj.grip.fact" || a.relation_label !== "간접 근거" || !a.target_claim_text) return "신규 연구 A 연결이 자료에 없음: " + JSON.stringify(a);
  const b = nl.find(x => x.new_study_id === "new:fixture-b-2098");
  if (!b || b.relation_label !== "반박" || b.target_rule_ids !== "bench.P.grip bench.S.acj.grip=g2") return "신규 연구 B 규칙 연결이 없음";
  if (!r.notes.some(x => x.includes("존재(서지) 확인이 Y가 아닌 신규 연구 1개"))) return "존재 확인 N이 알림에 없음";
  const link = d.links.find(x => x.study_id === "nevalainen-2016" && x.location_id === "bench.adj.load.fact");
  if (link.work_finding_type !== "E0" || link.work_grade !== "") return "앱 인용 연구 Work 칸이 이상함";
  /* 앱이 보여주는 근거 표시는 그대로 */
  const app = L.loadApp(root);
  if (app.TOPICS.bench.adjustments.grip.ev !== L.loadApp(L.ROOT).TOPICS.bench.adjustments.grip.ev) return "앱 근거 표시가 바뀜";
  return true;
});
test("A. 정상: 신규 연구만 등록하고 아직 연결하지 않아도 통과 (관계는 비어 있음)", () => {
  const root = withWork([NS()], null);
  rebuild(root);
  const r = verify(root);
  if (r.errors.length) return "오류: " + r.errors.join(" / ");
  return r.notes.some(x => x.includes("Work 행렬이 없어")) || "알림 없음";
});
expectBlocked("신규 목록에 없는 new: ID를 행렬에서 사용", [NS()], [MR({ study_id: "new:not-registered" })], "신규 연구 목록");
expectBlocked("앱에도 신규 목록에도 없는 연구 ID", [NS()], [MR({ study_id: "smith-2020" })], "앱이 인용한 연구 ID가 아님");
expectBlocked("new: 접두어 없는 신규 ID", [NS({ new_study_id: "fixture-a" })], null, "형식");
expectBlocked("대문자·공백이 있는 신규 ID", [NS({ new_study_id: "new:Fixture A" })], null, "형식");
expectBlocked("신규 ID가 앱 인용 연구 ID와 같음", [NS({ new_study_id: "new:nevalainen-2016" })], null, "앱이 이미 인용한 연구 ID");
expectBlocked("DOI·PMID·제목이 모두 없음", [NS({ doi: "", pmid: "", title: "" })], null, "식별");
expectBlocked("DOI 형식 오류", [NS({ doi: "doi-없음" })], null, "DOI 형식");
expectBlocked("PMID에 숫자 아닌 값", [NS({ pmid: "PMID12a" })], null, "PMID");
expectBlocked("신규 ID 중복", [NS(), NS({ doi: "10.9999/other" })], null, "ID 중복");
expectBlocked("같은 DOI를 두 신규 ID로 등록", [NS(), NS({ new_study_id: "new:fixture-c" })], null, "DOI가");
expectBlocked("existence_checked가 Y/N이 아님", [NS({ existence_checked: "yes" })], null, "existence_checked");
expectBlocked("관계 값이 정해진 목록 밖", [NS()], [MR({ relation_to_app: "supports" })], "relation_to_app");
expectBlocked("결과 종류 값이 E0~E4·E9 밖", [NS()], [MR({ finding_type: "E5" })], "finding_type");
expectBlocked("E0(존재만 확인)인데 직접 지지로 기록", [NS()], [MR({ finding_type: "E0", relation_to_app: "support_direct" })], "E0");
expectBlocked("관계를 적었는데 대상(위치·규칙)이 없음", [NS()], [MR({ location_id: "" })], "대상");
expectBlocked("관계를 적었는데 보고 내용(finding_text)이 없음", [NS()], [MR({ finding_text: "" })], "finding_text");
expectBlocked("없는 위치 ID", [NS()], [MR({ location_id: "bench.adj.nothing.fact" })], "위치 ID");
expectBlocked("없는 규칙 ID", [NS()], [MR({ location_id: "", rule_ids: "bench.P.nothing" })], "규칙 ID");
expectBlocked("행 ID 중복", [NS()], [MR(), MR()], "matrix_row_id 중복");
expectBlocked("행렬 필수 칸이 빠짐", [NS()], null, "필수 칸");
/* 위 마지막 사례는 아래에서 칸을 지운 행렬로 다시 만든다 */
results.pop();
test("A. 차단: 행렬 필수 칸(relation_to_app)이 빠짐", () => {
  const root = withWork([NS()], null);
  const head = MAT_HEAD.filter(h => h !== "relation_to_app");
  fs.writeFileSync(path.join(root, "docs/audit/work", `${TOPIC}-evidence-matrix.csv`), csv([head, MR().filter((_, i) => MAT_HEAD[i] !== "relation_to_app")]));
  rebuild(root);
  const we = workErrors(verify(root));
  return we.includes("필수 칸") || `막히지 않음: ${we}`;
});
test("A. 저자·연도가 앱 인용 연구와 같은 신규 연구는 사람이 확인하도록 알림", () => {
  const root = withWork([NS({ first_author: "Nevalainen", year: "2016" })], null);
  rebuild(root);
  const r = verify(root);
  return r.notes.some(x => x.includes("저자·연도가 같은")) || "알림 없음";
});
test("A. Work 자료를 넣지 않은 이 저장소의 앱 파일은 시험 전후로 같음", () => appHash(L.ROOT) === baseHash || "바뀜");

/* ---------- B. 우선순위·최종 추천 변경 감지 ---------- */
function mutate(name, file, from, to, needles) {
  test(`B. 변경 감지: ${name}`, () => {
    const root = copyRepo();
    const p = path.join(root, file);
    const s = fs.readFileSync(p, "utf8");
    if (!s.includes(from)) return `시험할 코드를 찾지 못함: ${from}`;
    fs.writeFileSync(p, s.replace(from, to));
    const r = verify(root);
    const all = r.errors.join("\n");
    const miss = needles.filter(nd => !all.includes(nd));
    return miss.length === 0 || `기대한 실패 이유가 없음: ${miss.join(", ")}\n실제: ${all}`;
  });
}
const T = "content/topics/bench.js";
mutate("그립 조정 우선순위 2 → 8", T, 'picks.push(["grip", 2]);', 'picks.push(["grip", 8]);',
  ["bench.P.grip 우선순위 2 → 8", "고정 사례", "C02"]);
mutate("부하 조정 조건부 우선순위 1 → 5", T, '? 1 : 6]);', '? 5 : 6]);',
  ["bench.P.load 우선순위", "? 1 : 6 → (", "고정 사례", "C05"]);
mutate("상위 3개 → 상위 4개 (공통 마무리)", "js/app.js", ".slice(0, 3)", ".slice(0, 4)",
  ["common.F.top3 공통 규칙 코드가 바뀜", "최종 결과 독립 모델 대조", "고정 사례", "C06"]);
mutate("점수가 같을 때 고르는 변수 (acj > rc → acj >= rc)", T, "sc.acj > sc.rc", "sc.acj >= sc.rc",
  ["bench.SEL.1 변수 선택 줄 바뀜", "고정 사례", "C03"]);
mutate("두 번째 변수 기준 3점 → 2점", T, "if (sc[other] >= 3)", "if (sc[other] >= 2)",
  ["bench.SEL.4 변수 선택 줄 바뀜", "고정 사례"]);
mutate("scap 변수 기준 2점 → 1점", T, "if (sc.scap >= 2)", "if (sc.scap >= 1)",
  ["bench.SEL.5 변수 선택 줄 바뀜", "고정 사례", "C10"]);
mutate("점수 2 → 3 (어깨 앞쪽)", T, 'has(a, "where", "sideback")) sc.rc += 2;', 'has(a, "where", "sideback")) sc.rc += 3;',
  ["bench.S.rc.where=front/where=sideback 점수 2 → 3"]);
mutate("조정 후보 조건 변경 (팔꿈치: tucked 제외)", T, '|| has(a, "elbow", "tucked")) picks.push(["elbow", 5]);', ') picks.push(["elbow", 5]);',
  ["bench.P.elbow 후보 조건", "고정 사례"]);
mutate("조정 후보 삭제 (flex)", T, '    if (has(a, "daily", "cross") || has(a, "daily", "behind")) picks.push(["flex", 7]);\n', "",
  ["bench.P.flex 조정 후보 규칙 사라짐", "모든 조정에 후보 규칙이 있음", "고정 사례"]);
mutate("해석할 수 없는 형태(&&)로 바꾸면 검증 완료가 아님", T, 'if (has(a, "acc", "never")) sc.scap += 1;', 'if (has(a, "acc", "never") && has(a, "scap", "no")) sc.scap += 1;',
  ["analyse() 모든 줄 해석", "점수 규칙 해석 대조"]);
mutate("진료 먼저 조건(when=daily → when=press)", T, 'picks, has(a, "when", "daily"));', 'picks, has(a, "when", "press"));',
  ["bench.REFER.daily 진료 먼저 조건 바뀜", "고정 사례", "C13"]);
mutate("6주 이상 진료 먼저 규칙 삭제 (공통)", "js/app.js", 'has(a, "dur", "gt6")', 'has(a, "dur", "never")',
  ["common.F.referLong 공통 규칙 코드가 바뀜", "고정 사례", "C14"]);
test("B. 무작위 표본에 거의 안 나오는 조합도 고정 사례로 확인 (C07: 6개 후보 중 3개, load 우선)", () => {
  const app = L.loadApp(L.ROOT);
  const c = L.runCases(app, TOPIC, path.join(L.ROOT, "tools/audit/cases/bench.json")).results.find(x => x.id === "C07");
  return (c && c.pass && c.got.adjustments.join() === "load,grip,scap") || JSON.stringify(c && c.got);
});

/* ---------- C. 독립 확인 없는 규칙은 수동 검토 필요 ---------- */
test("C. 고정 사례가 없는 규칙은 '동작 확인'이 아니라 '수동 검토 필요'", () => {
  const root = copyRepo();
  const p = path.join(root, "tools/audit/cases/bench.json");
  const spec = JSON.parse(fs.readFileSync(p, "utf8"));
  spec.cases.forEach(c => { c.covers = (c.covers || []).filter(id => id !== "bench.P.flex"); });
  fs.writeFileSync(p, JSON.stringify(spec, null, 1));
  const d = B.build(TOPIC, { root, samples: SAMPLES });
  const row = d.ruleRows.find(r => r.id === "bench.P.flex");
  if (row.status.startsWith("동작 확인")) return "고정 사례 없이도 동작 확인으로 표시됨";
  if (!row.status.startsWith(L.MANUAL)) return row.status;
  const r = verify(root);
  return r.manualChecks.some(x => x.startsWith("bench.P.flex")) || "검증 결과의 수동 검토 목록에 없음";
});
test("C. 독립 모델을 만들 수 없으면 최종 추천은 수동 검토 필요로 남음", () => {
  const root = copyRepo();
  const p = path.join(root, T);
  fs.writeFileSync(p, fs.readFileSync(p, "utf8").replace("const patterns = [main];", "const patterns = [main].concat([]);"));
  const r = verify(root);
  if (!r.manualChecks.some(x => x.includes("최종 결과 독립 모델을 만들 수 없음"))) return "수동 검토 목록에 없음: " + r.manualChecks.join(" / ");
  return !r.passes.some(x => x.startsWith("최종 결과 독립 모델 대조")) || "모델 대조가 통과로 셈해짐";
});
test("C. 벤치프레스에서 확인할 수 없는 referOnly·같은 우선순위 순서는 수동 검토 필요", () => {
  const r = verify(L.ROOT);
  return (r.manualChecks.some(x => x.startsWith("common.F.referOnly")) && r.manualChecks.some(x => x.startsWith("common.F.top3"))) || r.manualChecks.join(" / ");
});
test("C. 이 저장소 자료 검증 통과 (무작위 50,000)", () => { const r = V.verify(TOPIC, { root: L.ROOT }); return r.errors.length === 0 || r.errors.join(" / "); });

fs.rmSync(TMP, { recursive: true, force: true });
results.forEach(r => console.log(`${r.ok ? "PASS" : "FAIL"} ${r.name}${r.ok ? "" : "\n     " + r.detail.replace(/\n/g, "\n     ")}`));
const fail = results.filter(r => !r.ok).length;
console.log(`\n추적 시스템 재현 테스트: ${results.length - fail}/${results.length} 통과`);
module.exports = { results };
if (require.main === module) process.exit(fail ? 1 : 0);
