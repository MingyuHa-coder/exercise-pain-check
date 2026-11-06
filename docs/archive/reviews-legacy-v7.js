/* [보관용 · 앱에서 불러오지 않음] v7까지의 전문가 검토 기록.
   2026-11-06 v8에서 검토 이력을 초기화하면서 옮겨 둠. 새 검토 상태 시스템(content/review-status.js)으로 승계하지 않는다. */
/* =========================================================
   전문가 검토 기록 — 기획서 7-5의 양식을 따른다.
   한 줄 = 검토 목록의 한 항목. keys는 앱에서 표시를 붙일 위치
   (주제.q.질문id / 주제.adj.조정id / 주제.pat.변수id / 주제.flag.신호id / 주제.card.카드id / all.*).

   - result: "그대로" → 앱에 "전문가 검토 완료"
             "고침"   → 앱에 "전문가 검토 의견 반영"
   - changedAfter: 검토 뒤 앱 문구를 바꿔서 다시 확인이 필요하면 적는다. 적혀 있으면 앱에 표시하지 않는다.
   - reviewer / field: 검토자 이름(또는 익명 표기)과 자격·전문 분야. 비어 있으면 "기록 필요".
   ========================================================= */
const CONTENT_VERSION = "7";   // 콘텐츠 버전. 문구·규칙을 바꾸면 올린다.

const REVIEWS = [
  // 2026-11-06 1차 검토 (🟡 항목)
  { item: "B3", keys: ["bench.q.load"], result: "그대로", date: "2026-11-06", version: "6", reviewer: "", field: "정형외과 의사", opinion: "", change: "" },
  { item: "B4", keys: ["bench.q.elbow"], result: "그대로", date: "2026-11-06", version: "6", reviewer: "", field: "정형외과 의사", opinion: "", change: "" },
  { item: "B5", keys: ["bench.q.grip"], result: "그대로", date: "2026-11-06", version: "6", reviewer: "", field: "정형외과 의사", opinion: "", change: "" },
  { item: "B6", keys: ["bench.adj.flex"], result: "그대로", date: "2026-11-06", version: "6", reviewer: "", field: "정형외과 의사", opinion: "", change: "" },
  { item: "O2", keys: ["ohp.q.arc"], result: "그대로", date: "2026-11-06", version: "6", reviewer: "", field: "정형외과 의사", opinion: "", change: "",
    changedAfter: "v7: \"직접 팔을 들어 보세요\" → \"최근에 들 때 언제 아팠나요\" 경험 질문으로 바꿈. 바뀐 문구로 다시 확인 필요" },
  { item: "O5", keys: ["ohp.q.shrug"], result: "그대로", date: "2026-11-06", version: "6", reviewer: "", field: "정형외과 의사", opinion: "", change: "" },
  { item: "O6", keys: ["ohp.adj.brace"], result: "그대로", date: "2026-11-06", version: "6", reviewer: "", field: "정형외과 의사", opinion: "", change: "" },
  { item: "O8", keys: ["ohp.adj.front"], result: "그대로", date: "2026-11-06", version: "6", reviewer: "", field: "정형외과 의사", opinion: "", change: "" },
  { item: "O9", keys: ["ohp.adj.grip"], result: "그대로", date: "2026-11-06", version: "6", reviewer: "", field: "정형외과 의사", opinion: "", change: "" },
  { item: "O10", keys: ["ohp.q.ogrip"], result: "그대로", date: "2026-11-06", version: "6", reviewer: "", field: "정형외과 의사", opinion: "", change: "" },
  { item: "D3", keys: ["dl.q.spike"], result: "그대로", date: "2026-11-06", version: "6", reviewer: "", field: "정형외과 의사", opinion: "", change: "" },
  { item: "D6", keys: ["dl.adj.trap"], result: "그대로", date: "2026-11-06", version: "6", reviewer: "", field: "정형외과 의사", opinion: "", change: "" },
  { item: "D7", keys: ["dl.card.bend"], result: "고침", date: "2026-11-06", version: "6", reviewer: "", field: "정형외과 의사",
    opinion: "12kg 이하 들기 연구를 데드리프트에 적용하기엔 무리",
    change: "\"굽혀 들어도 통증이 더 생긴다는 근거가 없다\"를 빼고, 무거운 데드리프트에 옮기기 어렵고 굽힘이 부상 원인인지는 확인되지 않았다고 고침" },
  { item: "K2", keys: ["sqk.flag.night"], result: "그대로", date: "2026-11-06", version: "6", reviewer: "", field: "정형외과 의사", opinion: "", change: "" },
  { item: "K5", keys: ["sqk.adj.pain"], result: "그대로", date: "2026-11-06", version: "6", reviewer: "", field: "정형외과 의사", opinion: "", change: "" },
  { item: "K6", keys: ["sqk.adj.hip"], result: "그대로", date: "2026-11-06", version: "6", reviewer: "", field: "정형외과 의사", opinion: "", change: "" },
  { item: "K7", keys: ["sqk.adj.depth"], result: "그대로", date: "2026-11-06", version: "6", reviewer: "", field: "정형외과 의사", opinion: "", change: "" },
  { item: "K8", keys: ["sqk.adj.lunge"], result: "그대로", date: "2026-11-06", version: "6", reviewer: "", field: "정형외과 의사", opinion: "", change: "" },
  { item: "Q2", keys: ["sqb.q.wink"], result: "그대로", date: "2026-11-06", version: "6", reviewer: "", field: "정형외과 의사", opinion: "", change: "" },
  { item: "Q3", keys: ["sqb.adj.depth", "sqb.adj.front"], result: "그대로", date: "2026-11-06", version: "6", reviewer: "", field: "정형외과 의사", opinion: "", change: "" },
  { item: "L1", keys: ["lat.adj.height"], result: "그대로", date: "2026-11-06", version: "6", reviewer: "", field: "정형외과 의사", opinion: "", change: "" },
  { item: "L2", keys: ["lat.adj.thumb"], result: "그대로", date: "2026-11-06", version: "6", reviewer: "", field: "정형외과 의사", opinion: "", change: "" },
  { item: "L3", keys: ["lat.adj.urow"], result: "그대로", date: "2026-11-06", version: "6", reviewer: "", field: "정형외과 의사", opinion: "", change: "" },
  { item: "E4", keys: ["elb.adj.wflex"], result: "그대로", date: "2026-11-06", version: "6", reviewer: "", field: "정형외과 의사", opinion: "", change: "" },
  { item: "E5", keys: ["elb.pat.front"], result: "그대로", date: "2026-11-06", version: "6", reviewer: "", field: "정형외과 의사", opinion: "", change: "" },
  { item: "C5", keys: ["all.log"], result: "그대로", date: "2026-11-06", version: "6", reviewer: "", field: "정형외과 의사", opinion: "", change: "" },
  { item: "C7", keys: ["all.expert"], result: "고침", date: "2026-11-06", version: "6", reviewer: "", field: "정형외과 의사",
    opinion: "의료 연결은 웬만하면 정형외과·재활의학과 중에서",
    change: "\"정형외과·재활의학과 → 물리치료\"를 \"정형외과·재활의학과\"로, 안내 문구의 \"의사나 물리치료사\"를 \"정형외과나 재활의학과\"로 고침" },
  // C8(질문 문구 전반)처럼 앱의 특정 위치가 없는 항목은 표시 없이 문서(전문가 검토 대기 목록)에만 기록한다.
];
