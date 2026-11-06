/* =========================================================
   전문가 검토 상태 (v8)
   - 13개 주제 × 7개 검토 영역마다 상태를 하나씩 가진다.
   - 상태는 아래 REVIEW_RECORDS(실제 검토 기록)에서만 만들어진다. 기록이 없으면 "검토 전"이다.
   - v7까지의 검토 이력은 승계하지 않는다 (보관본: docs/archive/reviews-legacy-v7.js, 앱에서 불러오지 않음).
   - 검토 완료는 반드시 검토 분야와 범위(scope)를 함께 적는다. 화면에도 함께 표시된다.
   ========================================================= */

/* 검토 영역 7가지 (사업 기획서 7-3 기준) */
const REVIEW_AREAS = [
  { id: "safety", name: "위험 신호 및 진료 안내" },
  { id: "questions", name: "운동 상황을 파악하는 질문" },
  { id: "rules", name: "질문에 따른 판단 규칙" },
  { id: "adjust", name: "운동 조정 방법" },
  { id: "alt", name: "대체 운동 및 스트레칭" },
  { id: "evidence", name: "연구 근거와 설명" },
  { id: "wording", name: "사용자에게 보여주는 문구" },
];

/* 검토 상태 5가지 */
const REVIEW_STATES = {
  none: "검토 전",
  requested: "검토 요청",
  inProgress: "검토 중",
  needsFix: "수정 필요",
  done: "검토 완료",
};

/* 검토 기록. 실제로 전문가 검토가 이루어졌을 때만 한 줄씩 더한다. (v8에서 초기화 → 비어 있음)
   한 줄의 형식:
   {
     topic: "bench",             // 주제 id. 여러 주제 공통이면 "all"
     area: "safety",             // REVIEW_AREAS의 id
     state: "done",              // REVIEW_STATES의 키
     scope: "위험 신호 6문항과 진료 안내 4단계 전체",   // 무엇을 검토했는지 (검토 완료면 필수)
     items: ["bench.flag.tear"], // (선택) 앱의 특정 위치에 표시를 붙일 때. 형식: 주제.q.질문id / 주제.adj.조정id / 주제.pat.변수id / 주제.flag.신호id / 주제.card.카드id
     reviewer: "",               // 검토자 (실명 또는 익명 표기)
     field: "정형외과",           // 전문 분야
     qualification: "전문의",     // 자격
     date: "2026-12-01",
     opinion: "",                // 검토 의견
     requests: "",               // 수정 요청 사항
     version: "8",               // 검토한 콘텐츠 버전
   }
   같은 주제·영역에 기록이 여러 개면 가장 최근 날짜(같으면 아래쪽) 기록의 상태를 쓴다. */
const REVIEW_RECORDS = [
];

/* ---- 상태 계산 (화면에서 사용) ----
   검토 완료인데 분야(field)나 범위(scope)가 비어 있는 기록은 잘못된 기록으로 보고 쓰지 않는다. */
const validRecord = r => REVIEW_STATES[r.state] && (r.state !== "done" || (r.field && r.scope));
REVIEW_RECORDS.filter(r => !validRecord(r)).forEach(r => console.warn("[검토 기록] 분야·범위가 없거나 상태가 잘못된 기록이라 쓰지 않아요:", r));
function latestRecord(list) {
  return list.reduce((best, r) => (!best || r.date >= best.date) ? r : best, null);
}
function areaStatus(topic, area) {
  const rec = latestRecord(REVIEW_RECORDS.filter(r => validRecord(r) && (r.topic === topic || r.topic === "all") && r.area === area));
  return { state: rec ? rec.state : "none", record: rec };
}
function itemReview(key) {
  const rec = latestRecord(REVIEW_RECORDS.filter(r => validRecord(r) && (r.items || []).includes(key)));
  return rec && rec.state === "done" ? rec : null;
}
