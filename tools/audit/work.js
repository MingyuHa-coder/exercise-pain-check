/* =========================================================
   Work(독립 문헌 조사) 결과 불러오기와 검사
   - <work>/<topic>-evidence-matrix.csv : 연구별 결과 (앱이 인용한 연구 + Work가 새로 찾은 연구)
   - <work>/<topic>-new-studies.csv     : Work가 새로 찾은 연구 목록 (DOI·PMID·제목으로 식별)
   세 가지를 섞지 않는다:
     1) 논문이 존재하는지        → new-studies.csv 의 existence_checked / existence_source
        (서지 정보 확인일 뿐, 논문 전문의 내용을 검증했다는 뜻이 아니다.
         Y가 아닌 신규 연구는 조사 후보로 등록·연결할 수 있지만 관계는 undetermined(판단 보류)만 가능)
     2) 논문이 무엇을 보고했는지  → evidence-matrix.csv 의 finding_type(E0~E4·E9), finding_text
     3) 그 결과가 앱 주장과 어떤 관계인지 → evidence-matrix.csv 의 relation_to_app (대상: location_id·rule_ids)
   이 파일들은 docs/audit 자료에만 반영된다. 앱(content/·js/)의 근거 표시·문구·검토 상태는 바뀌지 않는다.
   ========================================================= */
const fs = require("fs");
const path = require("path");

const FINDING_TYPES = { E0: "논문 존재·서지 확인만", E1: "측정·생체역학 결과 보고", E2: "조정·치료의 통증·기능 효과 보고", E3: "요인과 증상·소견의 연관 보고", E4: "지침·합의 권고", E9: "기타·분류 어려움" };
/* 논문 대상·설계·결과를 보고 내리는 판단(판단 보류 외 전부).
   - 서지 존재가 확인되지 않은(existence_checked ≠ Y) 신규 연구에는 쓸 수 없다 → undetermined만 허용
   - finding_type = E0(서지 존재만 확인)인 행에도 쓸 수 없다
   서지 확인 Y는 논문이 있다는 뜻일 뿐 내용 검증이 아니다. 판단을 적으려면 finding_type(E1~E4·E9)과 finding_text가 따로 있어야 한다. */
const CONFIRMING_RELATIONS = ["support_direct", "contradict", "indirect", "not_applicable"];
const RELATIONS = { support_direct: "직접 지지", contradict: "반박", indirect: "간접 근거", not_applicable: "적용 어려움", undetermined: "판단 보류" };
const NEW_PREFIX = "new:";
const MATRIX_COLS = ["matrix_row_id", "study_id", "citation", "location_id", "rule_ids", "finding_type", "population", "study_design", "finding_text", "relation_to_app", "relation_note", "work_grade", "checked_by", "checked_date", "notes"];
const NEW_COLS = ["new_study_id", "doi", "pmid", "title", "first_author", "year", "journal", "existence_checked", "existence_source", "added_by", "added_date", "notes"];

function parseCsv(text) {
  const rows = []; let row = [], cur = "", inq = false;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (inq) { if (ch === '"' && text[i + 1] === '"') { cur += '"'; i++; } else if (ch === '"') inq = false; else cur += ch; }
    else if (ch === '"') inq = true; else if (ch === ",") { row.push(cur); cur = ""; } else if (ch === "\n") { row.push(cur); rows.push(row); row = []; cur = ""; } else if (ch !== "\r") cur += ch;
  }
  if (cur || row.length) { row.push(cur); rows.push(row); }
  const head = (rows.shift() || []).map(h => h.trim());
  return { head, rows: rows.filter(r => r.some(x => x.trim())).map(r => Object.fromEntries(head.map((h, i) => [h, (r[i] || "").trim()]))) };
}
const normDoi = d => String(d || "").trim().toLowerCase().replace(/^https?:\/\/(dx\.)?doi\.org\//, "").replace(/^doi:\s*/, "");

function loadWork(workDir, topic) {
  const mPath = path.join(workDir, `${topic}-evidence-matrix.csv`);
  const nPath = path.join(workDir, `${topic}-new-studies.csv`);
  return {
    matrixPath: mPath, newPath: nPath,
    matrix: fs.existsSync(mPath) ? parseCsv(fs.readFileSync(mPath, "utf8")) : null,
    newStudies: fs.existsSync(nPath) ? parseCsv(fs.readFileSync(nPath, "utf8")) : null,
  };
}

/* ctx: { appStudyIds:Set, locIds:Set, ruleIds:Set, appDois: Map(doi → 앱 연구 이름), appStudyNames: Map(id → 앱 표기) } */
function validateWork(work, ctx) {
  const errors = [], notes = [], passes = [];
  const ok = (name, cond, detail = "") => (cond ? passes : errors).push(cond ? name : `${name} — ${detail}`);
  const newIds = new Map();
  if (work.newStudies) {
    const { head, rows } = work.newStudies;
    ok("신규 연구 목록: 필수 칸이 있음", ["new_study_id", "doi", "pmid", "title", "existence_checked"].every(c => head.includes(c)), `없는 칸: ${["new_study_id", "doi", "pmid", "title", "existence_checked"].filter(c => !head.includes(c)).join(", ")}`);
    const bad = [], sameAuthorYear = []; const seenDoi = new Map(), seenPmid = new Map();
    rows.forEach((r, i) => {
      const at = `${i + 2}행(${r.new_study_id || "ID 없음"})`;
      if (!r.new_study_id || !r.new_study_id.startsWith(NEW_PREFIX) || !/^new:[a-z0-9][a-z0-9-]*$/.test(r.new_study_id)) bad.push(`${at}: ID는 "new:소문자-숫자-하이픈" 형식이어야 함`);
      if (newIds.has(r.new_study_id)) bad.push(`${at}: ID 중복`);
      if (ctx.appStudyIds.has(r.new_study_id.slice(NEW_PREFIX.length))) bad.push(`${at}: 앱이 이미 인용한 연구 ID(${r.new_study_id.slice(NEW_PREFIX.length)})와 같음 → 신규가 아니라 기존 ID로 적을 것`);
      if (!r.doi && !r.pmid && !r.title) bad.push(`${at}: DOI·PMID·제목 중 하나는 있어야 식별 가능`);
      if (r.doi && !/^10\.\d{4,9}\/\S+$/.test(normDoi(r.doi))) bad.push(`${at}: DOI 형식 오류 (${r.doi})`);
      if (r.pmid && !/^\d{1,9}$/.test(r.pmid)) bad.push(`${at}: PMID는 숫자만 (${r.pmid})`);
      if (r.existence_checked && !["Y", "N"].includes(r.existence_checked)) bad.push(`${at}: existence_checked는 Y 또는 N`);
      if (r.existence_checked === "Y" && !r.existence_source) bad.push(`${at}: existence_checked가 Y이면 존재를 확인한 곳(existence_source)을 적어야 함`);
      const d = normDoi(r.doi);
      if (d && ctx.appDois.has(d)) bad.push(`${at}: 이 DOI는 앱이 이미 인용한 연구(${ctx.appDois.get(d)})임 → 기존 ID로 적을 것`);
      if (d && seenDoi.has(d)) bad.push(`${at}: DOI가 ${seenDoi.get(d)}와 같음`);
      if (r.pmid && seenPmid.has(r.pmid)) bad.push(`${at}: PMID가 ${seenPmid.get(r.pmid)}와 같음`);
      const au = String(r.first_author || "").trim().split(/[\s,]+/)[0].toLowerCase();
      if (au && r.year && ctx.appStudyNames) ctx.appStudyNames.forEach((name, id) => { const n = name.toLowerCase(); if (n.includes(au) && n.includes(String(r.year))) sameAuthorYear.push(`${r.new_study_id} ↔ 앱 인용 ${name} (${id})`); });
      if (d) seenDoi.set(d, r.new_study_id); if (r.pmid) seenPmid.set(r.pmid, r.new_study_id);
      newIds.set(r.new_study_id, r);
    });
    ok("신규 연구 목록: ID·식별자 형식과 중복", bad.length === 0, bad.join(" / "));
    if (sameAuthorYear.length) notes.push(`앱이 이미 인용한 연구와 저자·연도가 같은 신규 연구 — 같은 논문인지 사람이 확인 (앱 출처에는 DOI가 없어 자동 판정 불가): ${sameAuthorYear.join(", ")}`);
    const unchecked = rows.filter(r => r.existence_checked !== "Y").map(r => r.new_study_id);
    if (unchecked.length) notes.push(`존재(서지) 확인이 Y가 아닌 신규 연구 ${unchecked.length}개: ${unchecked.join(", ")}`);
  }
  if (work.matrix) {
    const { head, rows } = work.matrix;
    const need = ["matrix_row_id", "study_id", "location_id", "rule_ids", "finding_type", "finding_text", "relation_to_app"];
    ok("Work 행렬: 필수 칸이 있음", need.every(c => head.includes(c)), `없는 칸: ${need.filter(c => !head.includes(c)).join(", ")}`);
    const bad = []; const seenRow = new Set();
    rows.forEach((r, i) => {
      const at = `${i + 2}행(${r.matrix_row_id || "행 ID 없음"})`;
      if (!r.matrix_row_id) bad.push(`${at}: matrix_row_id 없음`);
      else if (seenRow.has(r.matrix_row_id)) bad.push(`${at}: matrix_row_id 중복`);
      seenRow.add(r.matrix_row_id);
      const sid = r.study_id;
      if (!sid) bad.push(`${at}: study_id 없음`);
      else if (sid.startsWith(NEW_PREFIX)) {
        if (!newIds.has(sid)) bad.push(`${at}: 신규 연구 ${sid}가 신규 연구 목록(${path.basename(work.newPath)})에 없음`);
        else if (newIds.get(sid).existence_checked !== "Y" && CONFIRMING_RELATIONS.includes(r.relation_to_app))
          bad.push(`${at}: 신규 연구 ${sid}는 서지 존재 확인 전(existence_checked=${newIds.get(sid).existence_checked || "빈칸"})이라 ${r.relation_to_app}(${RELATIONS[r.relation_to_app]})로 기록할 수 없음 (undetermined만 가능) → 존재를 확인해 Y와 existence_source를 적고 내용을 확인하거나, 관계를 undetermined로 둘 것`);
      }
      else if (!ctx.appStudyIds.has(sid)) bad.push(`${at}: ${sid}는 앱이 인용한 연구 ID가 아님 (새로 찾은 연구면 "new:" ID로 신규 목록에 등록)`);
      if (r.location_id && !ctx.locIds.has(r.location_id)) bad.push(`${at}: 위치 ID ${r.location_id} 없음`);
      (r.rule_ids || "").split(/\s+/).filter(Boolean).forEach(x => { if (!ctx.ruleIds.has(x)) bad.push(`${at}: 규칙 ID ${x} 없음`); });
      if (r.finding_type && !FINDING_TYPES[r.finding_type]) bad.push(`${at}: finding_type ${r.finding_type}는 E0~E4·E9가 아님`);
      if (r.relation_to_app && !RELATIONS[r.relation_to_app]) bad.push(`${at}: relation_to_app ${r.relation_to_app}는 ${Object.keys(RELATIONS).join("/")} 중 하나여야 함`);
      if (r.relation_to_app && r.relation_to_app !== "undetermined") {
        if (!r.location_id && !r.rule_ids) bad.push(`${at}: 앱과의 관계(${r.relation_to_app})를 적었으면 대상 location_id 또는 rule_ids가 있어야 함`);
        if (!r.finding_text) bad.push(`${at}: 앱과의 관계를 적었으면 논문이 보고한 내용(finding_text)이 있어야 함`);
        if (!r.finding_type) bad.push(`${at}: 앱과의 관계를 적었으면 finding_type이 있어야 함`);
        if (r.finding_type === "E0" && CONFIRMING_RELATIONS.includes(r.relation_to_app)) bad.push(`${at}: E0(존재만 확인)으로는 지지·반박·간접 근거·적용 어려움을 기록할 수 없음 (undetermined만 가능)`);
      }
    });
    ok("Work 행렬: 연구 ID·위치·규칙·결과 종류·관계 값", bad.length === 0, bad.join(" / "));
    const linkedNew = new Set(rows.map(r => r.study_id).filter(s => s.startsWith(NEW_PREFIX)));
    const unlinked = [...newIds.keys()].filter(id => !linkedNew.has(id));
    if (unlinked.length) notes.push(`신규 연구 중 Work 행렬에 결과가 없는 것 ${unlinked.length}개: ${unlinked.join(", ")}`);
    const notInWork = [...ctx.appStudyIds].filter(s => !rows.some(r => r.study_id === s));
    notes.push(`Work 행렬에 아직 없는 앱 인용 연구 ${notInWork.length}개${notInWork.length ? ": " + notInWork.join(", ") : ""}`);
  } else if (work.newStudies && work.newStudies.rows.length) {
    notes.push("신규 연구 목록은 있지만 Work 행렬이 없어 앱 주장과의 관계는 비어 있음");
  }
  if (!work.matrix && !work.newStudies) notes.push(`Work 자료 없음 — 앱 인용 연구 ${ctx.appStudyIds.size}개 모두 Work 확인 전`);
  return { errors, notes, passes, newIds };
}

module.exports = { loadWork, validateWork, parseCsv, FINDING_TYPES, RELATIONS, CONFIRMING_RELATIONS, NEW_PREFIX, MATRIX_COLS, NEW_COLS, normDoi };
