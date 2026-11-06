/* 풀업·랫풀다운 어깨 */
TOPICS.pul = {
  meta: { version: "8.1", updated: "2026-11-06" },
  name: "풀업·랫풀다운 (어깨)", brand: "풀업·랫풀다운 어깨 점검", eyebrow: "PULL-UP · PULLDOWN · SHOULDER",
  hero: "풀업이나 랫풀다운에서 어깨가 아프다면",
  redFlags: withFlag({ id: "wing", q: "날개뼈가 갑자기 등에서 툭 튀어나오고, 팔을 앞이나 위로 들기가 힘들어졌나요?", level: 3 }),
  flagLevels: BASE_LEVELS,
  flagSrc: "BESS/BOA 어깨 통증 진료 경로 (Rees 2021), Kolber 2010",
  questions: [
    { id: "where", q: "어디가 아픈가요?", opts: [
      ["front", "어깨 앞쪽"], ["top", "어깨 위쪽 한 점 (쇄골 끝)"], ["side", "어깨 바깥쪽·깊은 곳"], ["back", "어깨 뒤나 날개뼈 주변"] ] },
    { id: "ex", q: "어떤 운동에서 가장 아픈가요?", opts: [
      ["pull", "풀업 (손등이 나를 보게)"], ["chin", "친업 (손바닥이 나를 보게)"], ["front", "랫풀다운 (가슴 앞으로)"], ["neck", "랫풀다운 (목 뒤로)"] ] },
    { id: "grip", q: "바를 잡는 손 간격은 어느 정도인가요?", opts: [
      ["wide", "어깨너비보다 훨씬 넓게 (1.5배 이상)"], ["mid", "어깨너비보다 조금 넓게"], ["narrow", "어깨너비 이하"] ] },
    { id: "when", q: "언제 가장 아픈가요?", opts: [
      ["hang", "팔을 쭉 펴고 매달린 맨 아래"], ["top", "끝까지 당겼을 때"], ["arm", "운동 말고 팔을 옆이나 위로 들 때도"], ["after", "운동 끝난 뒤나 다음 날"] ] },
    { id: "unstable", q: "팔을 머리 위나 옆·뒤로 젖힐 때 어깨가 빠질 것 같은 불안한 느낌이 드나요?", opts: [ ["yes", "예"], ["no", "아니오"] ] },
    { id: "spike", q: "최근 4주 사이 무게나 횟수를 크게 늘렸나요?", hypo: "\"4주\"와 \"크게\"라는 기준은 앱이 정한 거예요.", opts: [ ["yes", "예"], ["no", "아니오"] ] },
    COMMON_Q.dur, COMMON_Q.trend, COMMON_Q.acc,
  ],
  patterns: {
    hi5: { title: "팔을 벌리고 바깥으로 돌린 자세 부담", plain: "목 뒤로 당기거나 아주 넓게 잡으면 팔이 옆으로 벌어진 채 바깥으로 크게 돌아가요(하이파이브 자세). 어깨 앞쪽이 늘어나고 어깨 위쪽 공간이 좁아지기 쉬워요.",
         check: ["당기는 위치(목 뒤 → 가슴 앞)", "손 간격"],
           say: "가슴 앞으로 당기고, 손 간격을 줄여 보세요.",
           ev: "weak", evText: "넓은 그립 풀업은 팔 90° 벌림에 바깥 회전 45°가 관찰됐고 어깨 위쪽 충돌 위험과 연결됐어요(11명 동작 측정). 목 뒤 랫풀다운은 웨이트하는 사람에게서 어깨 앞쪽이 불안정하거나 아픈 것과 관련 있다고 보고됐어요(증례·전문가 의견).", src: "Prinold & Bull 2016, Kolber 2010",
           hypo: "아픈 사람에게서 그립을 바꿨을 때 통증이 줄어드는지는 연구되지 않았어요." },
    chin: { title: "친업의 어깨 회전 부담", plain: "손바닥이 나를 보게 잡는 친업은 당길 때 어깨가 안팎으로 크게 돌아가고 팔이 날개뼈 면에서 많이 벗어나요.",
          check: ["손 방향(친업 → 풀업)", "체중을 덜어 주는 방법"],
            say: "어깨너비 정도로 손등이 나를 보게 잡는 풀업이나 랫풀다운으로 바꿔 보세요.",
            ev: "weak", evText: "친업은 어깨 회전이 극단적이고 날개뼈 면에서 크게 벗어났어요. 저자들은 어깨 위쪽 충돌 위험과 연결했어요(11명 동작 측정).", src: "Prinold & Bull 2016",
            hypo: "동작 측정을 통증 상황에 연결한 건 앱의 추론이에요." },
    rc: COMMON_P.rc("운동 말고 팔을 옆이나 위로 들 때도 아프면 이 모습에 가까워요.", "팔을 옆·위로 들 때도 아픈 어깨 부담",
      ["무게와 횟수", "날개뼈·어깨 보조운동"]),
    instab: { referOnly: true, title: "팔을 젖힐 때 빠질 듯한 느낌 → 진료 먼저", term: "어깨 앞쪽 불안정성",
            plain: "팔을 벌리고 바깥으로 돌릴 때 어깨가 빠질 것 같은 느낌은 스스로 판단할 수 없어 먼저 확인받는 게 좋아요.",
            check: [],
              say: "운동 조정보다 진료를 먼저 받아 보세요.",
              ev: "weak", internal: { text: "웨이트하는 사람의 어깨 앞쪽 불안정성은 하이파이브 자세(목 뒤 랫풀다운·프레스, 넓은 벤치)에서 통증이 생겼다고 보고됐어요(20명 증례).", src: "Kolber 2010" }, evText: "", src: "Kolber 2010",
              hypo: "스스로 느끼는 불안감만으로 어깨가 실제로 불안정한지 판단할 수는 없어요. 진료를 먼저 권하는 건 앱의 보수적인 선택이에요." },
    acj: { title: "당길 때 어깨 위쪽 부담", term: "쇄골 끝 관절 통증",
         plain: "어깨 위쪽, 쇄골 끝이 아픈 모습이에요.",
         check: ["당기는 범위", "무게"],
           say: "범위와 무게를 줄여 보세요.",
           ev: "weak", internal: { text: "쇄골 끝 골용해는 무거운 벤치를 자주, 오래 한 사람에게 많았어요.", src: "Nevalainen 2016" }, evText: "", src: "Nevalainen 2016",
           hypo: "풀업·랫풀다운에서 쇄골 끝 통증을 본 연구는 찾지 못했어요. 벤치 연구를 옮겨 온 거예요." },
  },
  adjustments: {
    front: { title: "목 뒤 대신 가슴 앞으로 당기기", how: "랫풀다운 바를 목 뒤가 아니라 쇄골·가슴 위쪽으로 당기세요. 상체를 살짝 뒤로 기울이면 편해요.",
             fact: "목 뒤로 당기는 하이파이브 자세를 피하고 바를 몸 앞으로 가져오는 운동을 고르라고 권해요(고찰의 실무 권고).", hypo: "권고 자체는 연구로 시험되지 않았어요.", ev: "weak", src: "Kolber 2010, Bonilla 2022" },
    grip: { title: "손 간격 줄이기", how: "어깨너비보다 조금 넓은 정도로 잡고, 손등이 나를 보게 잡아 보세요.",
            fact: "넓은 그립과 친업은 충돌 위험과 연결된 움직임을 보였고, 손등이 앞을 보는 일반 풀업이 상대적으로 나았어요(11명).", hypo: "\"조금 넓은 정도\"는 앱이 정한 표현이에요. 통증 효과는 연구되지 않았어요.", ev: "weak", src: "Prinold & Bull 2016" },
    assist: { title: "도움받는 풀업이나 랫풀다운으로 바꾸기", how: "밴드나 어시스트 머신으로 체중을 덜어 주거나, 아픈 동안은 랫풀다운으로 무게를 조절하세요.",
              fact: "저자들은 체중을 덜어 주는 풀업을 약한 사람이나 위험 요인이 있는 사람에게 권할 수 있다고 했어요. 다른 연구는 풀업을 어깨 재활의 후반 단계에 넣으라고 했어요.", hypo: "체중을 덜어 주는 풀업의 효과는 저자들도 더 연구가 필요하다고 했어요.", ev: "weak", src: "Prinold & Bull 2016, Bonilla 2022" },
    load: { title: "무게·횟수 줄이기", how: "아프지 않은 무게와 횟수로 줄이세요. 맨 아래에서 완전히 늘어지지 말고 살짝 힘을 준 채 매달리세요.",
            fact: "무게를 낮추는 건 어깨 통증 보존적 관리의 기본 원칙이에요.", hypo: "매달리는 방법은 앱이 정한 거예요. 얼마 동안 줄일지는 정해 두지 않았어요.", ev: "mid", src: "BESS/BOA 2021" },
    acc: COMMON_A.acc,
  },
  sources: [
    ["Prinold & Bull 2016, 풀업 방식별 날개뼈 움직임", "https://doi.org/10.1016/j.jsams.2015.08.002"],
    ["Kolber 2010, 웨이트 트레이닝 관련 어깨 부상 고찰", "https://paulogentil.com/pdf/Shoulder%20Injuries%20Attributed%20to%20Resistance%20Training%20-%20A%20Brief%20Review.pdf"],
    ["Bonilla 2022, 피트니스센터 운동 선택과 부상 고찰", "https://pmc.ncbi.nlm.nih.gov/articles/PMC9565175/"],
    ["BESS/BOA 어깨 통증 진료 경로 (Rees 2021)", "https://pmc.ncbi.nlm.nih.gov/articles/PMC7905504"]],
  sample: { where: "front", ex: "neck", grip: "wide", when: "top", unstable: "no", spike: "no", dur: "w2to6", trend: "same", acc: "sometimes" },
  summary(a) { return [
    `아픈 곳: ${label("where", a.where)} / 운동: ${label("ex", a.ex)} / 손 간격: ${label("grip", a.grip)}`,
    `가장 아플 때: ${label("when", a.when)} / 빠질 듯한 느낌: ${label("unstable", a.unstable)}`,
    `최근 4주 급증: ${label("spike", a.spike)} / 보조운동: ${label("acc", a.acc)}`,
    `기간·경과: ${label("dur", a.dur)}, ${label("trend", a.trend)}`]; },
  analyse(a) {
    const sc = { hi5: 0, chin: 0, rc: 0, instab: 0, acj: 0 };
    if (has(a, "ex", "neck")) sc.hi5 += 4;
    if (has(a, "grip", "wide")) sc.hi5 += 3;
    if (has(a, "where", "front")) sc.hi5 += 1;
    if (has(a, "ex", "chin")) sc.chin += 3;
    if (has(a, "when", "arm")) sc.rc += 3;
    if (has(a, "where", "side")) sc.rc += 3;
    if (has(a, "unstable", "yes")) sc.instab += 6;
    if (has(a, "where", "top")) sc.acj += 4;
    const order = Object.entries(sc).sort((x, y) => y[1] - x[1]);
    const main = order[0][1] > 0 ? order[0][0] : "rc";
    const patterns = [main, ...order.filter(([k, v]) => k !== main && v >= 3).map(([k]) => k)].slice(0, 3);
    const picks = [];
    if (has(a, "ex", "neck")) picks.push(["front", 1]);
    if (has(a, "grip", "wide") || has(a, "ex", "chin")) picks.push(["grip", 1.5]);
    if (has(a, "ex", "pull") || has(a, "ex", "chin")) picks.push(["assist", 2]);
    picks.push(["load", has(a, "spike", "yes") ? 1.8 : 3]);
    if (has(a, "acc", "never") || has(a, "acc", "sometimes")) picks.push(["acc", 3.5]);
    const r = finish(a, sc, patterns, has(a, "unstable", "yes") ? [] : picks, false);
    if (has(a, "unstable", "yes")) { r.referFirst = true; r.referInstab = true; }
    return r;
  },
  extras() {
    return [card("목 뒤로 당기는 랫풀다운, 꼭 피해야 하나요?", "weak",
      "피트니스 부상 고찰들은 목 뒤로 당기는 랫풀다운과 프레스를 대체로 피하라고 권해요. 팔을 벌린 채 바깥으로 끝까지 돌리는 자세가 어깨 앞쪽을 늘린다는 이유예요. 다만 이 권고는 증례 보고와 전문가 의견에 기댄 것이고, 직접 비교한 임상 연구는 없어요. 가슴 앞으로 당겨도 등 운동 효과는 충분히 얻을 수 있어요.", "Kolber 2010, Bonilla 2022")];
  },
};
