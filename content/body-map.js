/* ---------------- 부위 → 운동 → 아픈 곳 ---------------- */
/* at: [아픈 곳, 주제 id, 미리 채울 답] */
const BODY = [
  { id: "chest", name: "가슴", ex: [
    { n: "벤치프레스", at: [["어깨", "bench"], ["손목", "wri", { ex: "press" }]] },
    { n: "딥스", at: [["어깨", "dps", { ex: "dips" }], ["손목", "wri", { ex: "dips" }]] },
    { n: "푸시업", at: [["어깨", "dps", { ex: "push" }], ["손목", "wri", { ex: "push" }]] } ] },
  { id: "shoulder", name: "어깨", ex: [
    { n: "숄더 프레스", at: [["어깨", "ohp"], ["손목", "wri", { ex: "press" }]] },
    { n: "레터럴 레이즈", at: [["어깨", "lat", { ex: "lat" }]] },
    { n: "업라이트 로우", at: [["어깨", "lat", { ex: "urow" }]] } ] },
  { id: "back", name: "등", ex: [
    { n: "데드리프트", at: [["허리", "dl"]] },
    { n: "풀업·랫풀다운", at: [["어깨", "pul"], ["팔꿈치", "elb", { ex: "pull" }]] },
    { n: "바벨 로우", at: [["허리", "row"]] } ] },
  { id: "arm", name: "팔", ex: [
    { n: "바벨·덤벨 컬", at: [["팔꿈치", "elb", { ex: "curl" }]] } ] },
  { id: "leg", name: "하체", ex: [
    { n: "스쿼트", at: [["무릎", "sqk", { style: "back" }], ["고관절·사타구니", "hip", { ex: "squat" }], ["허리", "sqb"]] },
    { n: "런지", at: [["무릎", "sqk", { style: "lunge" }], ["고관절·사타구니", "hip", { ex: "lunge" }]] },
    { n: "레그프레스", at: [["무릎", "sqk", { style: "machine" }], ["고관절·사타구니", "hip", { ex: "press" }]] } ] },
  { id: "cardio", name: "유산소", ex: [
    { n: "달리기", at: [["무릎·정강이", "run"]] } ] },
];
