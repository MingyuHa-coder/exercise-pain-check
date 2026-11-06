/* 달리기 무릎·정강이 */
TOPICS.run = {
  meta: { version: "8", updated: "2026-11-06" },
  name: "달리기 (무릎·정강이)", brand: "달리기 통증 점검", eyebrow: "RUNNING · KNEE · SHIN",
  hero: "달리기에서 무릎이나 정강이가 아프다면",
  redFlags: [
    { id: "trauma", q: "넘어지거나 삐끗한 뒤 무릎이 바로 붓고, 체중을 싣기 어렵나요?", level: 1 },
    { id: "infect", q: "열이 나고 무릎이나 다리가 붉고 뜨겁게 부었나요?", level: 1 },
    { id: "focal", q: "정강이·발등의 한 곳(손가락 끝 크기)을 누르면 콕 아프고, 걸을 때도 아픈가요?", level: 2 },
    { id: "hip", q: "달릴 때 사타구니나 엉덩이 깊은 곳이 아프고, 걸을 때도 아픈가요?", level: 2 },
    { id: "lock", q: "무릎이 걸려서 끝까지 펴지지 않는 때가 있나요?", level: 2 },
    { id: "bone", q: "전에 피로골절이 있었거나, 생리가 몇 달째 없나요?", level: 3 },
  ],
  flagLevels: [null,
    { title: "오늘 진료를 받으세요", body: "오늘 바로 확인이 필요한 신호예요. 달리기는 멈추고 확인부터 받으세요." },
    { title: "며칠 안에 진료를 받으세요", body: "반복된 충격으로 뼈에 부담이 쌓였을 때 나타나는 신호예요. 정강이 앞쪽·사타구니 쪽·발등은 특히 확인이 필요한 부위예요. 처음 엑스레이에서는 안 보일 수 있어요." },
    { title: "빠른 시일 내 진료를 받으세요", body: "뼈 건강을 함께 확인받아야 하는 신호예요. 통증 원인과 함께 확인받으세요." }],
  flagSrc: "Patel 2011 (미국 가정의학회 피로골절 리뷰)",
  questions: [
    { id: "where", q: "어디가 아픈가요?", opts: [
      ["front", "무릎 앞·무릎뼈 주변"], ["below", "무릎뼈 바로 아래"], ["lat", "무릎 바깥쪽"], ["shin", "정강이 안쪽을 따라 넓게"] ] },
    { id: "sit", q: "계단, 쪼그려 앉기, 오래 앉아 있기에서도 아픈가요?", opts: [ ["yes", "예"], ["no", "아니오"] ] },
    { id: "spike", q: "최근 한 번에, 지난 한 달 중 가장 길게 달린 거리보다 10% 넘게 더 달린 적이 있나요?", opts: [ ["yes", "예"], ["no", "아니오"] ] },
    { id: "rest", q: "달리지 않을 때(걷기, 밤)에도 아픈가요?", opts: [ ["yes", "예"], ["no", "아니오"] ] },
    { id: "now", q: "아프고 나서 달리기는 어떻게 하고 있나요?", opts: [
      ["rest", "쉬고 있어요"], ["light", "줄여서 하고 있어요"], ["same", "원래대로 하고 있어요"] ] },
    COMMON_Q.dur, COMMON_Q.trend,
  ],
  patterns: {
    pfp: { title: "달리기·계단에서 무릎 앞에 걸리는 부담", term: "무릎 앞쪽 통증 (슬개대퇴 통증)",
         plain: "무릎뼈 뒤·주변이 눌리는 힘을 받을 때 아픈 모습이에요. 달리기, 쪼그려 앉기, 계단, 오래 앉아 있기에서 심해져요.",
         check: ["한 번에 달리는 거리", "발걸음 수(보폭)", "엉덩이·무릎 근력 운동"],
           say: "달리는 양을 조절하고 엉덩이·무릎 근력 운동을 해 보세요.",
           ev: "mid", evText: "엉덩이와 무릎을 함께 강화하는 운동이 국제 합의에서 권고되고, 무작위 연구에서 통증이 줄었어요.", src: "Mellinger & Neurohr 2019 (서술적 리뷰)" },
    pt: { title: "점프·착지가 많은 운동의 무릎뼈 아래 부담", term: "무릎뼈 아래 힘줄 통증 (슬개건병증)",
        plain: "무릎뼈 바로 아래 힘줄이 아픈 모습이에요. 깊이 앉기, 점프, 착지에서 가장 심하고 쉬면 대개 괜찮아요.",
        check: ["달리는 양", "점프·언덕 달리기 양", "근력 운동"],
          say: "달리는 양과 점프를 줄이고 천천히 늘려 보세요.",
          ev: "weak", evText: "치료 근거가 적어요. 무거운 무게를 천천히 드는 운동이 편심 운동과 비슷했다는 연구가 두 편 정도예요.", src: "Mellinger & Neurohr 2019" },
    itb: { title: "거리를 늘린 뒤 무릎 바깥쪽 부담", term: "무릎 바깥쪽 통증 (장경인대)",
         plain: "무릎 바깥쪽이 달릴 때 아픈 모습이에요. 달리는 거리를 늘린 뒤 흔히 생겨요.",
         check: ["최근 늘린 거리", "발걸음 수(보폭)", "엉덩이 근력 운동"],
           say: "달리는 양을 줄이고, 보폭을 줄여 발걸음 수를 조금 늘려 보세요.",
           ev: "weak", evText: "거리 증가가 가장 흔한 관련 요인이었어요. 엉덩이 근력 운동과 달리기 자세 교정을 같이 권하지만 근거는 약해요.", src: "Mellinger & Neurohr 2019" },
    mtss: { title: "충격이 반복되는 정강이 안쪽 부담", term: "정강이 안쪽 통증 (정강이 부목)",
          plain: "정강이 안쪽을 따라 5cm 넘게 넓게 아픈 모습이에요. 달리기 시작할 때 아프고 하다 보면 덜해지며, 다음 날 아침 더 아플 수 있어요.",
          check: ["달리는 양", "충격이 적은 유산소로 바꾸기"],
            say: "달리는 양을 줄이고 다른 유산소로 대신해 보세요.",
            ev: "weak", internal: { text: "넓게 아프면 정강이 부목, 한 곳(2~3cm)만 콕 아프면 피로골절을 의심해요.", src: "Saad 2025, Patel 2011" }, evText: "치료 방법별 효과는 정리돼 있지 않아요.", src: "Saad 2025 (범위 고찰), Patel 2011" },
  },
  adjustments: {
    volume: { title: "달리는 양 줄이고 천천히 늘리기", how: "아프지 않은 수준까지 거리와 횟수를 줄이세요. 다시 늘릴 때는 한 번에 지난 한 달 중 가장 긴 거리를 넘지 않게 하세요.",
              fact: "약 5,200명 추적 연구에서, 한 번에 지난 30일 중 가장 긴 거리보다 10% 넘게 달린 날은 부상 위험이 1.5~2.3배였어요. 주 단위 증가율은 관련이 없었어요.",
              hypo: "이 연구는 아프지 않은 러너가 대상인 관찰 연구라, 10% 아래로 지키면 부상이 줄어드는지는 아직 시험되지 않았어요(저자들도 무작위 연구가 필요하다고 해요). \"아프지 않은 수준\"은 앱이 정한 안내예요.", ev: "mid", src: "Frandsen 2025, Patel 2011" },
    cadence: { title: "보폭 줄이고 발걸음 수 5~10% 늘리기", how: "같은 속도에서 보폭을 조금 줄여 1분당 발걸음 수를 5~10% 늘려 보세요. 메트로놈 앱을 쓰면 쉬워요.",
               fact: "건강한 러너 30명이 발걸음 수를 10% 늘리자 무릎뼈 관절에 걸리는 최대 힘이 14% 줄었어요(실험실 모델 추정).",
               hypo: "아픈 사람에게서 통증이 줄어드는지는 확인되지 않았어요.", ev: "weak", src: "Lenhart 2014" },
    strength: { title: "엉덩이·무릎 근력 운동", how: "옆으로 누워 다리 들기, 밴드 옆걸음 같은 엉덩이 운동과 레그 익스텐션·스쿼트 같은 무릎 운동을 주 2~3회 하세요.",
                fact: "무릎 앞쪽 통증에서 엉덩이·무릎을 함께 강화하는 운동이 권고되고, 엉덩이 운동을 한 군이 통증이 더 빨리 줄었어요.",
                hypo: "여기 적은 운동과 횟수는 앱이 고른 예시예요. 무릎 바깥쪽·힘줄 통증에 대한 근거는 약해요.", ev: "mid", src: "Mellinger & Neurohr 2019" },
    cross: { title: "다른 유산소로 대신하기", how: "아픈 동안 자전거나 수영처럼 충격이 적은 운동으로 체력을 유지하세요.",
             fact: "피로골절 치료 중 교차 훈련으로 심폐 체력을 유지하라고 권고돼요.",
             hypo: "정강이 부목에 같은 방법을 쓰는 건 앱이 옮겨 온 거예요.", ev: "weak", src: "Patel 2011" },
  },
  sources: [
    ["Patel 2011, 피로골절 진단·치료·예방 (AFP)", "https://www.aafp.org/pubs/afp/issues/2011/0101/p39.html"],
    ["Mellinger & Neurohr 2019, 러너 무릎 부상 치료 리뷰", "https://atm.amegroups.org/article/view/26028/26142"],
    ["Saad 2025, 정강이 부목 범위 고찰 (Cureus)", "https://assets.cureus.com/uploads/review_article/pdf/345672/20250401-813832-3n6cmj.pdf"],
    ["Lenhart 2014, 발걸음 수와 무릎뼈 관절 힘", "https://uwnmbl.engr.wisc.edu/pubs/msse14_lenhart.pdf"],
    ["Frandsen 2025, 한 번에 달리는 거리 급증과 부상 (BJSM)", "https://doi.org/10.1136/bjsports-2024-109380"]],
  sample: { where: "front", sit: "yes", spike: "yes", rest: "no", now: "same", dur: "w2to6", trend: "same" },
  summary(a) { return [
    `아픈 곳: ${label("where", a.where)}`,
    `계단·앉기에서도 통증: ${label("sit", a.sit)} / 쉴 때도 통증: ${label("rest", a.rest)}`,
    `한 번에 거리 급증: ${label("spike", a.spike)} / 통증 후 달리기: ${label("now", a.now)}`,
    `기간·경과: ${label("dur", a.dur)}, ${label("trend", a.trend)}`]; },
  analyse(a) {
    const w = a.where || "front";
    const busy = has(a, "spike", "yes") || has(a, "now", "same");
    const picks = { front: [["strength", 1], ["volume", busy ? 1.5 : 2], ["cadence", 3]],
                    below: [["volume", 1], ["strength", 2]],
                    lat: [["volume", 1], ["cadence", 2], ["strength", 3]],
                    shin: [["volume", 1], ["cross", 2]] }[w];
    const pat = { front: "pfp", below: "pt", lat: "itb", shin: "mtss" }[w];
    return finish(a, { [pat]: 1 }, [pat], picks, has(a, "rest", "yes"));
  },
  extras() {
    return [card("10% 규칙은 맞나요?", "weak",
      "\"주당 거리를 10%씩만 늘려라\"는 흔한 조언이에요. 리뷰에서는 학회 권고로 소개되지만, 5,200명 추적 연구에서는 주 단위 증가율보다 한 번에 달린 거리가 지난 한 달 최장 거리를 넘는 것이 부상과 관련 있었어요.", "Mellinger & Neurohr 2019, Frandsen 2025")];
  },
};
