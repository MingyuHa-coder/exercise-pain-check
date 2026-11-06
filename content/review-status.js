/* =========================================================
   전문가 검토 상태 (콘텐츠 버전 8.1)
   - 13개 주제 × 7개 검토 영역마다 상태를 하나씩 가진다.
   - 상태는 아래 REVIEW_RECORDS(실제 검토 기록)에서만 만들어진다. 기록이 없으면 "검토 전"이다.
   - 검토 완료 기록은 검토자·분야·자격·날짜·범위·콘텐츠 버전·적용 범위·내용 지문이 모두 있어야 인정된다.
   - 검토 뒤 그 부분의 내용이 바뀌면(지문이 달라지면) 완료로 보지 않고 "재확인 필요"로 표시한다.
   - 영역의 일부만 검토했으면(coverage: "partial") 영역 전체를 완료로 표시하지 않는다.
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

/* 조정 중 "대체 운동 및 스트레칭" 영역으로 나누는 것 (다른 운동으로 바꾸기, 스트레칭·가동성 운동).
   나머지 조정은 "운동 조정 방법" 영역이다. 이 분류는 앱이 정한 것이다. */
const ALT_ADJUSTMENTS = {
  bench: ["flex"], ohp: ["front", "tspine"], dl: ["trap", "move"], sqb: ["front", "move"], lat: ["urow"],
  dps: ["nobench"], pul: ["front", "assist"], row: ["support", "move"], run: ["cross"],
};

/* 검토 기록. 실제로 전문가 검토가 이루어졌을 때만 한 줄씩 더한다. (지금은 비어 있음 → 모든 주제·영역이 검토 전)
   {
     topic: "bench",              // 주제 id (13개 중 하나)
     area: "safety",              // REVIEW_AREAS의 id
     state: "done",               // REVIEW_STATES의 키
     coverage: "full",            // 검토 완료일 때 필수: "full"(영역 전체) 또는 "partial"(일부 항목만)
     items: ["bench.flag.tear"],  // partial이면 필수: 검토한 항목. 형식: 주제.q.질문id / 주제.adj.조정id / 주제.pat.변수id / 주제.flag.신호id
     scope: "위험 신호 6문항과 진료 안내 4단계 전체",   // 무엇을 검토했는지 (사람이 읽는 설명)
     reviewer: "검토자 A",          // 검토자 식별 정보 (실명 또는 내부 식별 표기)
     field: "정형외과",             // 전문 분야
     qualification: "전문의",       // 자격
     date: "2026-12-01",
     opinion: "",                 // 검토 의견
     requests: "",                // 수정 요청 사항
     version: "8.1",              // 검토한 콘텐츠 버전
     fingerprint: "1a2b3c4d",     // 검토한 내용의 지문. 검토할 때 reviewFingerprint(topic, area, items)로 만든다
   }
   같은 주제·영역에 기록이 여러 개면 가장 최근 날짜(같으면 아래쪽) 기록을 쓴다. */
const REVIEW_RECORDS = [
];

/* ---- 내용 지문: 검토한 내용이 그 뒤에 바뀌었는지 알아내기 위한 값 ---- */
function fnv(str) {
  let h = 0x811c9dc5;
  for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 0x01000193) >>> 0; }
  return h.toString(16).padStart(8, "0");
}
function areaContent(topic, area) {
  const T0 = TOPICS[topic]; if (!T0) return "";
  const alt = ALT_ADJUSTMENTS[topic] || [];
  const adj = Object.entries(T0.adjustments);
  const pick = (o, keys) => keys.reduce((m, k) => (o[k] !== undefined ? (m[k] = o[k], m) : m), {});
  const extras = () => { try { return T0.extras({ sc: {}, patterns: [], adjustments: [] }).join(""); } catch (e) { return ""; } };
  switch (area) {
    case "safety": return JSON.stringify([T0.redFlags, T0.flagLevels, T0.flagSrc]);
    case "questions": return JSON.stringify(T0.questions);
    case "rules": return T0.analyse.toString() + (typeof finish === "function" ? finish.toString() : "");
    case "adjust": return JSON.stringify(adj.filter(([k]) => !alt.includes(k)));
    case "alt": return JSON.stringify(adj.filter(([k]) => alt.includes(k)));
    case "evidence": return JSON.stringify([Object.values(T0.patterns).map(p => pick(p, ["evText", "src", "hypo", "internal", "internalEv", "term"])),
      adj.map(([k, a]) => pick(a, ["fact", "src", "hypo"])), T0.sources]) + extras();
    case "wording": return JSON.stringify([Object.values(T0.patterns).map(p => pick(p, ["title", "plain", "check", "say"])),
      adj.map(([k, a]) => pick(a, ["title", "how"])), T0.questions.map(q => [q.q, q.hint, q.opts]), T0.flagLevels]) + extras();
  }
  return "";
}
function itemContent(key) {
  const [topic, kind, id] = key.split("."); const T0 = TOPICS[topic]; if (!T0) return "";
  const v = kind === "q" ? T0.questions.find(q => q.id === id) : kind === "adj" ? T0.adjustments[id]
    : kind === "pat" ? T0.patterns[id] : kind === "flag" ? T0.redFlags.find(f => f.id === id) : null;
  return v ? JSON.stringify(v) : "";
}
/* 검토 기록을 만들 때 쓴다. items가 있으면 그 항목들만, 없으면 영역 전체의 지문 */
function reviewFingerprint(topic, area, items) {
  return fnv(items && items.length ? items.map(itemContent).join("|") : areaContent(topic, area));
}

/* ---- 기록 검사 ---- */
const REQUIRED_DONE = ["reviewer", "field", "qualification", "date", "scope", "version", "coverage", "fingerprint"];
function recordProblems(r) {
  const p = [];
  if (!TOPICS[r.topic]) p.push("topic");
  if (!REVIEW_AREAS.some(a => a.id === r.area)) p.push("area");
  if (!REVIEW_STATES[r.state]) p.push("state");
  if (!r.date) p.push("date");
  if (r.state === "done") {
    REQUIRED_DONE.forEach(k => { if (!r[k]) p.push(k); });
    if (r.coverage && !["full", "partial"].includes(r.coverage)) p.push("coverage");
    if (r.coverage === "partial" && !(r.items && r.items.length)) p.push("items");
  }
  return p;
}
const validRecord = r => recordProblems(r).length === 0;
REVIEW_RECORDS.filter(r => !validRecord(r)).forEach(r => console.warn("[검토 기록] 빠진 항목이 있어 쓰지 않아요:", recordProblems(r).join(", "), r));
/* 검토 완료 기록이 지금 내용과 같은지 (검토 뒤 바뀌었으면 false) */
const isCurrent = r => r.fingerprint === reviewFingerprint(r.topic, r.area, r.coverage === "partial" ? r.items : null);

function latestRecord(list) {
  return list.reduce((best, r) => (!best || r.date >= best.date) ? r : best, null);
}
/* 영역 상태. 화면에는 state(5가지 중 하나)와 note(일부 범위·재확인 필요 안내)를 함께 보여준다. */
function areaStatus(topic, area) {
  const rec = latestRecord(REVIEW_RECORDS.filter(r => validRecord(r) && r.topic === topic && r.area === area));
  if (!rec) return { state: "none", record: null, note: "" };
  if (rec.state !== "done") return { state: rec.state, record: rec, note: "" };
  if (!isCurrent(rec)) return { state: "none", record: rec, note: `검토(${rec.date}) 뒤 내용이 바뀌어 다시 확인이 필요해요` };
  if (rec.coverage === "partial") return { state: "none", record: rec, note: `일부 항목만 검토 완료: ${rec.scope}` };
  return { state: "done", record: rec, note: "" };
}
/* 항목 표시: 그 항목을 포함한 검토 완료 기록이 있고, 내용이 바뀌지 않았을 때만 */
function itemReview(key) {
  const recs = REVIEW_RECORDS.filter(r => validRecord(r) && r.state === "done" && isCurrent(r) &&
    (r.coverage === "partial" ? (r.items || []).includes(key) : key.startsWith(r.topic + ".") && areaOfItem(key) === r.area));
  return latestRecord(recs);
}
function areaOfItem(key) {
  const [topic, kind, id] = key.split(".");
  if (kind === "flag") return "safety";
  if (kind === "q") return "questions";
  if (kind === "adj") return (ALT_ADJUSTMENTS[topic] || []).includes(id) ? "alt" : "adjust";
  if (kind === "pat") return "evidence";
  return "";
}
