/* 스쿼트·런지 고관절 */
TOPICS.hip = {
  meta: { version: "8.1", updated: "2026-11-06" },
  name: "스쿼트·런지·레그프레스 (고관절)", brand: "하체 운동 고관절 점검", eyebrow: "SQUAT · LUNGE · HIP",
  hero: "스쿼트나 런지에서 사타구니·고관절이 아프다면",
  redFlags: [
    { id: "trauma", q: "넘어지거나 부딪힌 뒤 고관절이 아프고, 체중을 싣고 걷기 어렵나요?", level: 1 },
    { id: "infect", q: "열이 나고, 고관절이 아파서 다리를 거의 움직이지 못하나요?", level: 1 },
    { id: "stress", q: "달리기나 운동량을 늘린 뒤로 사타구니 깊은 곳이 아프고, 걸을 때나 쉴 때도 아픈가요?", level: 2 },
    { id: "other", q: "소변 볼 때 아프거나, 배가 아프거나, 고환·아랫배가 붓거나 혹이 만져지나요?", level: 3 },
    { id: "nerve", q: "허리부터 다리로 저림이 내려가거나, 감각이 둔해졌나요?", level: 3 },
    { id: "night", q: "이유 없이 살이 빠지거나, 쉬어도 밤새 계속 아픈가요?", level: 3 },
  ],
  flagLevels: [null,
    { title: "오늘 진료를 받으세요", body: "오늘 바로 확인이 필요한 신호예요. 운동 조언으로 해결할 상황이 아니에요." },
    { title: "며칠 안에 정형외과 진료를 받으세요", body: "반복된 부하로 뼈에 부담이 쌓였을 때 나타나는 신호예요. 특히 확인이 필요한 부위라 운동을 멈추고 확인받으세요. 처음 엑스레이에서는 안 보일 수 있어요." },
    { title: "빠른 시일 내 진료를 받으세요", body: "고관절이 아닌 다른 곳의 원인이 사타구니 통증으로 나타날 수 있어요. 먼저 원인을 확인받으세요." }],
  flagSrc: "Doha 합의 (Weir 2015) '놓치면 안 되는 원인', Patel 2011",
  questions: [
    { id: "where", q: "어디가 아픈가요?", opts: [
      ["deep", "사타구니 깊은 곳 (고관절 안쪽)"], ["inner", "허벅지 안쪽 근육"], ["front", "엉덩이 앞 접히는 곳 근육 (다리를 들 때)"], ["side", "엉덩이 바깥쪽"] ] },
    { id: "ex", q: "어떤 운동에서 가장 아픈가요?", opts: [
      ["squat", "스쿼트"], ["wide", "와이드·스모 스쿼트"], ["lunge", "런지"], ["press", "레그프레스"] ] },
    { id: "when", q: "언제 가장 아픈가요?", opts: [
      ["bottom", "가장 깊이 앉아 고관절이 접힐 때"], ["spread", "다리가 넓게 벌어질 때"], ["lift", "다리를 들어 올리거나 일어날 때"], ["daily", "운동 말고 오래 앉거나 양말 신을 때도"] ] },
    { id: "mech", q: "고관절에서 \"딸깍\" 걸리거나, 잠기거나, 힘이 빠지는 느낌이 드나요?", opts: [ ["yes", "예"], ["no", "아니오"] ] },
    { id: "depth", q: "스쿼트를 얼마나 깊이 앉나요?", opts: [
      ["deep", "엉덩이가 무릎보다 아래로"], ["par", "허벅지가 바닥과 평행쯤"], ["half", "그보다 덜 앉아요"] ] },
    { id: "spike", q: "최근 4주 사이 무게나 횟수, 깊이를 크게 늘렸나요?", hypo: "\"4주\"와 \"크게\"라는 기준은 앱이 정한 거예요.", opts: [ ["yes", "예"], ["no", "아니오"] ] },
    COMMON_Q.dur, COMMON_Q.trend,
  ],
  patterns: {
    hipj: { title: "고관절을 깊이 접는 구간의 사타구니 부담", term: "고관절 관련 사타구니 통증 (고관절 충돌 증후군 등)",
          plain: "고관절을 깊이 굽히거나 특정 자세를 할 때 사타구니가 아픈 모습이에요.",
          check: ["앉는 깊이", "발 간격·발끝 방향", "고관절·몸통 근력 운동"],
            say: "아프지 않은 깊이로 줄이고, 고관절·몸통 근력 운동을 꾸준히 해 보세요.",
            ev: "mid", internal: { text: "국제 합의는 움직임이나 자세에 따른 고관절·사타구니 통증을 고관절 충돌 증후군의 주된 증상으로 봐요. 진단에는 증상·진찰·영상이 모두 필요해요.", src: "Warwick 합의 (Griffin 2016)" }, evText: "1차 치료로 교육·활동 조정·운동 재활을 권하고, 운동 치료는 최소 3개월을 권해요.", src: "Warwick 합의 (Griffin 2016), Kemp 2020",
            hypo: "앱은 진단을 하지 않아요. 뼈 모양 변화는 증상 없는 사람에게도 흔해요." },
    add: { title: "다리를 넓게 벌리는 동작의 허벅지 안쪽 부담", term: "내전근 관련 사타구니 통증",
         plain: "허벅지 안쪽 근육이 다리를 모으거나 넓게 벌릴 때 아픈 모습이에요.",
         check: ["와이드·스모 스쿼트", "런지 보폭"],
           say: "다리를 넓게 벌리는 동작을 잠시 줄여 보세요.",
           ev: "weak", internal: { text: "국제 합의는 내전근 쪽 누름 통증과 다리를 모으는 힘을 줄 때의 통증을 내전근 관련 사타구니 통증으로 정의해요.", src: "Doha 합의 (Weir 2015)" }, evText: "", src: "Doha 합의 (Weir 2015)",
           hypo: "스스로 답한 위치·동작만으로 나누는 건 앱의 추론이에요. 진찰로 확인하는 정의예요." },
    ilio: { title: "다리를 들어 올리는 동작의 엉덩이 앞쪽 부담", term: "장요근 관련 사타구니 통증",
          plain: "다리를 들어 올리거나 고관절 앞을 늘릴 때 엉덩이 앞 근육이 아픈 모습이에요.",
          check: ["앉는 깊이", "무게"],
            say: "깊이와 무게를 줄이고, 아프지 않은 범위에서 근력 운동을 이어가 보세요.",
            ev: "weak", internal: { text: "국제 합의는 장요근 누름 통증이 있고, 다리를 드는 힘을 주거나 늘릴 때 아프면 장요근 관련 사타구니 통증일 가능성이 크다고 해요.", src: "Doha 합의 (Weir 2015)" }, evText: "", src: "Doha 합의 (Weir 2015)",
            hypo: "스스로 답한 위치·동작만으로 나누는 건 앱의 추론이에요." },
    side: { referOnly: true, title: "엉덩이 바깥쪽 통증 → 진료 먼저", term: "엉덩이 바깥쪽 힘줄·점액낭 문제 가능성",
          plain: "엉덩이 바깥쪽 통증은 이번 자료로 다루지 못해 운동 조정을 안내하지 않아요.",
          check: [],
            say: "운동 조정보다 진료를 먼저 받아 보세요.",
            ev: "weak", evText: "이번에 본 자료는 사타구니·고관절 앞쪽 통증을 다뤄서, 바깥쪽 통증의 근거는 없어요.", src: "",
            hypo: "근거가 없어 진료를 먼저 권하는 건 앱의 보수적인 선택이에요." },
  },
  adjustments: {
    depth: { title: "아프지 않은 깊이까지만 앉기", how: "고관절이 접히며 아프기 직전에서 멈추세요. 박스나 벤치를 엉덩이 아래에 두면 깊이를 일정하게 지킬 수 있어요.",
             fact: "국제 합의는 진찰·영상으로 확인된 고관절 통증의 수술 아닌 관리에 활동 조정을 포함해요. 넙다리뼈 머리 모양 변화(캠형)가 영상으로 확인된 사람은 최대 스쿼트 깊이가 얕았고 골반 움직임이 적었어요(15명 비교).", hypo: "깊이를 줄이면 통증이 줄어드는지는 직접 연구되지 않았어요. 박스 사용은 앱의 제안이에요.", ev: "weak", src: "Griffin 2016, Lamontagne 2009" },
    stance: { title: "편한 발 간격과 발끝 방향 찾기", how: "고관절 안쪽이 아프면 발 간격과 발끝 각도를 조금씩 바꿔 아프지 않은 자세를 찾으세요. 허벅지 안쪽이 아프면 와이드 스쿼트와 큰 보폭 런지를 잠시 줄이세요.",
              fact: "", hypo: "이번 자료에는 발 간격·발끝 방향과 고관절 통증을 직접 비교한 연구가 없어요. 전부 앱의 제안이에요.", ev: "weak", src: "앱 제안" },
    strength: { title: "고관절·몸통 근력 운동 3개월 이상", how: "브릿지, 옆으로 누워 다리 들기, 밴드 옆걸음, 플랭크 같은 운동을 주 2~3회, 최소 3개월 꾸준히 하세요.",
                fact: "국제 합의는 진료에서 고관절 관련 통증으로 분류된 사람에게 운동 치료, 특히 근력 운동을 권하고(근거 중간), 3개월 이상 할 때 효과가 더 컸어요(근거 제한적).", hypo: "운동 종류와 횟수는 앱이 고른 예시예요. 가장 좋은 운동 종류·양은 아직 정해지지 않았어요.", ev: "mid", src: "Kemp 2020" },
    active: { title: "운동은 끊지 말고 줄여서 이어가기", how: "아픈 운동은 무게·횟수를 줄이고, 아프지 않은 다른 하체 운동과 유산소는 이어가세요.",
              fact: "국제 합의는 진료에서 고관절 관련 통증으로 분류된 사람에게도 신체 활동(운동 포함)을 권해요.", hypo: "줄이는 정도와 기간은 정해 두지 않았어요.", ev: "weak", src: "Kemp 2020" },
  },
  sources: [
    ["Griffin 2016, 고관절 충돌 증후군 Warwick 국제 합의", "https://doi.org/10.1136/bjsports-2016-096743"],
    ["Weir 2015, 운동선수 사타구니 통증 Doha 합의", "https://eprints.whiterose.ac.uk/id/eprint/110611/1/Doha%20agreement%20meeting%20on%20terminology%20and%20definitions%20in%20groin%20pain%20in%20athletes.pdf"],
    ["Kemp 2020, 고관절 관련 통증 물리치료 국제 합의 (Zurich)", "https://doi.org/10.1136/bjsports-2019-101458"],
    ["Lamontagne 2009, 캠형 충돌과 최대 스쿼트", "https://doi.org/10.1007/s11999-008-0620-x"],
    ["Patel 2011, 피로골절 진단·치료·예방 (AFP)", "https://www.aafp.org/pubs/afp/issues/2011/0101/p39.html"]],
  sample: { where: "deep", ex: "squat", when: "bottom", mech: "no", depth: "deep", spike: "no", dur: "w2to6", trend: "same" },
  summary(a) { return [
    `아픈 곳: ${label("where", a.where)} / 운동: ${label("ex", a.ex)} / 가장 아플 때: ${label("when", a.when)}`,
    `걸림·잠김: ${label("mech", a.mech)} / 스쿼트 깊이: ${label("depth", a.depth)}`,
    `최근 4주 급증: ${label("spike", a.spike)}`,
    `기간·경과: ${label("dur", a.dur)}, ${label("trend", a.trend)}`]; },
  analyse(a) {
    const sc = { hipj: 0, add: 0, ilio: 0, side: 0 };
    if (has(a, "where", "deep")) sc.hipj += 3;
    if (has(a, "when", "bottom")) sc.hipj += 2;
    if (has(a, "when", "daily")) sc.hipj += 1;
    if (has(a, "mech", "yes")) sc.hipj += 2;
    if (has(a, "where", "inner")) sc.add += 3;
    if (has(a, "when", "spread")) sc.add += 2;
    if (has(a, "ex", "wide")) sc.add += 1;
    if (has(a, "where", "front")) sc.ilio += 3;
    if (has(a, "when", "lift")) sc.ilio += 2;
    if (has(a, "where", "side")) sc.side += 6;
    const order = Object.entries(sc).sort((x, y) => y[1] - x[1]);
    const main = order[0][1] > 0 ? order[0][0] : "hipj";
    const patterns = [main, ...order.filter(([k, v]) => k !== main && v >= 3).map(([k]) => k)].slice(0, 2);
    if (main === "side") {
      const r = finish(a, sc, patterns, [], has(a, "when", "daily"));
      r.referFirst = true; r.referHip = true; return r;
    }
    const picks = [];
    if (main === "hipj" || has(a, "depth", "deep")) picks.push(["depth", 1]);
    if (main === "add" || has(a, "ex", "wide")) picks.push(["stance", 1.2]); else picks.push(["stance", 3.5]);
    picks.push(["strength", 2]);
    picks.push(["active", has(a, "spike", "yes") ? 1.5 : 3]);
    const r = finish(a, sc, patterns, picks, false);
    if (has(a, "mech", "yes")) { r.referFirst = true; r.referHip = true; }
    return r;
  },
  extras() {
    return [card("고관절이 아프면 스쿼트를 그만둬야 하나요?", "mid",
      "꼭 그렇지는 않아요. 국제 합의는 진료에서 고관절 관련 통증으로 분류된 사람에게도 운동을 포함한 신체 활동을 권하고, 근력 운동 위주의 운동 치료를 최소 3개월 하라고 해요. 다만 \"딸깍\"·걸림·잠김이 있거나 6주 넘게 아프면 영상 검사를 포함한 진료로 원인을 확인하는 게 좋아요. 뼈 모양 변화만으로는 진단이 아니에요. 증상 없는 사람에게도 흔하거든요.", "Griffin 2016, Kemp 2020")];
  },
};
