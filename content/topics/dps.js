/* 딥스·푸시업 어깨 */
TOPICS.dps = {
  meta: { version: "8.2", updated: "2026-11-06" },
  name: "딥스·푸시업 (어깨)", brand: "딥스·푸시업 어깨 점검", eyebrow: "DIPS · PUSH-UP · SHOULDER",
  hero: "딥스나 푸시업에서 어깨가 아프다면",
  redFlags: withFlag({ id: "tear", q: "딥스나 푸시업 중 \"뚝\" 하는 느낌과 함께 가슴·겨드랑이 앞이 아프고 힘이 빠졌나요? 멍이 들거나 겨드랑이 앞 모양이 달라졌다면 꼭 해당돼요.", level: 2 }),
  flagLevels: withLevel({ title: "며칠 안에 정형외과 진료를 받으세요", body: "근육이 다쳤을 때 나타나는 신호예요. 바 딥스 중에도 이런 부상이 보고돼 있어요. 일찍 확인받을수록 선택지가 많아요." }),
  flagSrc: "BESS/BOA 어깨 통증 진료 경로 (Rees 2021), Kolber 2010",
  questions: [
    { id: "where", q: "어디가 아픈가요?", opts: [
      ["front", "어깨 앞쪽"], ["top", "어깨 위쪽 한 점 (쇄골 끝)"], ["side", "어깨 바깥쪽·깊은 곳"], ["chest", "가슴·겨드랑이 앞 근육"] ] },
    { id: "ex", q: "어떤 운동에서 아픈가요?", opts: [
      ["dips", "바 딥스 (평행봉)"], ["bdip", "벤치 딥스 (뒤에 손 짚고)"], ["push", "푸시업"], ["both", "딥스와 푸시업 둘 다"] ] },
    { id: "when", q: "언제 가장 아픈가요?", opts: [
      ["bottom", "가장 깊이 내려갔을 때"], ["up", "밀어 올릴 때"], ["after", "운동 끝난 뒤나 다음 날"], ["arm", "운동 말고 팔을 옆으로 들 때도"] ] },
    { id: "depth", q: "딥스에서 가장 깊이 내려가면 위팔이 어떻게 되나요?", hint: "옆에서 찍은 영상으로 보면 쉬워요. 딥스를 안 하면 마지막을 골라 주세요.", opts: [
      ["above", "위팔이 바닥과 평행이 되기 전에 멈춰요"], ["par", "위팔이 바닥과 평행쯤"], ["deep", "평행보다 더 깊이 (어깨가 팔꿈치보다 아래로)"], ["na", "딥스는 안 해요"] ] },
    { id: "flare", q: "푸시업에서 팔꿈치가 몸통에서 얼마나 벌어지나요?", hint: "위에서 봤을 때 몸통과 위팔 사이 각도예요. 푸시업을 안 하면 마지막을 골라 주세요.", opts: [
      ["wide", "거의 옆으로 쫙 (T자에 가깝게)"], ["mid", "비스듬히 (45° 정도)"], ["tuck", "몸통에 붙여서"], ["na", "푸시업은 안 해요"] ] },
    { id: "spike", q: "최근 4주 사이 무게나 횟수를 크게 늘렸나요?", hypo: "\"4주\"와 \"크게\"라는 기준은 앱이 정한 거예요.", opts: [ ["yes", "예"], ["no", "아니오"] ] },
    COMMON_Q.dur, COMMON_Q.trend, COMMON_Q.acc,
  ],
  patterns: {
    deep: { title: "깊이 내려갈 때 어깨 앞쪽 부담", plain: "딥스에서 깊이 내려가면 어깨가 뒤로 크게 젖혀지면서 어깨 앞쪽 관절막과 가슴 근육이 늘어나요.",
          check: ["딥스 깊이", "벤치 딥스 여부", "무게·횟수"],
            say: "깊이를 줄이고, 벤치 딥스는 다른 운동으로 바꿔 보세요.",
            ev: "weak", evText: "건강한 남성 13명에서 벤치 딥스는 스스로 낼 수 있는 최대 어깨 뒤로 젖히기 범위를 넘었고(101%), 바 딥스는 88%였어요. 저자들은 어깨 앞쪽 관절막에 부담이 될 수 있다고 봤어요.", src: "McKenzie 2022a",
            hypo: "아픈 사람에게서 깊이와 통증의 관계를 본 연구는 없어요. 동작 측정을 통증 상황에 연결한 건 앱의 추론이에요." },
    flare: { title: "팔꿈치를 벌린 푸시업 자세", plain: "푸시업에서 팔꿈치를 옆으로 많이 벌리면 날개뼈가 어깨 위쪽 공간을 좁히는 자세가 되기 쉬워요.",
           check: ["푸시업 팔꿈치 각도", "날개뼈 보조운동"],
             say: "팔꿈치를 몸통 쪽으로 조금 모아 보세요.",
             ev: "weak", evText: "건강한 16명에서 위팔을 60° 넘게 벌린 푸시업은 날개뼈 뒤로 기울기가 줄었어요. 저자들은 어깨 위쪽 공간이 좁아질 수 있다고 추론했어요.", src: "Suprak 2013",
             hypo: "공간이 실제로 좁아지는지, 통증과 관련 있는지는 측정하지 않았어요." },
    rc: COMMON_P.rc("운동 말고 팔을 옆으로 들 때도 아프면 이 모습에 가까워요.", "팔을 옆으로 들 때도 아픈 어깨 부담",
      ["무게와 횟수", "날개뼈·어깨 보조운동"]),
    acj: { title: "체중을 받을 때 어깨 위쪽 부담", term: "쇄골 끝 관절 통증",
         plain: "어깨 위쪽, 쇄골 끝이 체중을 받으며 눌리는 모습이에요.",
         check: ["딥스 깊이", "횟수"],
           say: "깊이와 횟수를 줄여 보세요.",
           ev: "weak", internal: { text: "쇄골 끝 골용해는 무거운 벤치를 자주, 오래 한 사람에게 많았어요.", src: "Nevalainen 2016" }, evText: "", src: "Nevalainen 2016",
           hypo: "딥스·푸시업에서 쇄골 끝 통증을 본 연구는 찾지 못했어요. 벤치 연구를 옮겨 온 거예요." },
    chest: { title: "깊은 자세에서 가슴 근육이 늘어나며 받는 부담", term: "대흉근 부담",
           plain: "가슴·겨드랑이 앞 근육이 깊은 자세에서 크게 늘어나며 힘을 받아요.",
           check: ["딥스 깊이", "무게·손 간격", "지친 상태에서 하는 세트"],
             say: "깊이와 무게를 줄이고, 갑자기 아팠다면 진료를 받아 보세요.",
             ev: "weak", evText: "대흉근 파열은 벤치프레스 외에 바 딥스에서도 보고돼 있어요(증례 보고). 바 딥스 연구 저자들은 무게를 달거나 지치거나 손을 넓게 잡으면 대흉근 부상 위험이 커질 수 있다고 했어요.", src: "Kolber 2010, McKenzie 2022a",
             hypo: "파열이 아닌 가벼운 근육 통증을 조정으로 다루는 건 앱의 판단이에요." },
  },
  adjustments: {
    depth: { title: "딥스 깊이 줄이기", how: "위팔이 바닥과 평행해지기 전, 아프지 않은 곳까지만 내려가세요. 거울이나 영상으로 확인하면 쉬워요.",
             fact: "바 딥스·벤치 딥스는 어깨를 거의 끝까지 뒤로 젖혀요(최대 범위의 88~101%).", hypo: "\"평행 전까지\"라는 기준은 앱이 정한 거예요. 깊이를 줄이면 통증이 줄어드는지는 연구되지 않았어요.", ev: "weak", src: "McKenzie 2022a" },
    nobench: { title: "벤치 딥스는 다른 운동으로 바꾸기", how: "의자 뒤에 손을 짚는 벤치 딥스 대신 밴드나 기계로 도움받는 바 딥스, 또는 케이블 푸시다운으로 바꿔 보세요.",
               fact: "벤치 딥스는 스스로 낼 수 있는 최대 범위보다 어깨를 더 젖혔고, 저자들은 일반 근력 운동이나 재활에 넣지 말라고 했어요. 바 딥스는 서서·도움받아·밴드로 하는 쉬운 단계를 권했어요.", hypo: "건강한 13명 연구라, 아픈 사람에게 바꾸는 효과는 확인되지 않았어요.", ev: "weak", src: "McKenzie 2022a" },
    tuck: { title: "푸시업 팔꿈치 모으기", how: "팔꿈치를 옆으로 쫙 벌리지 말고 몸통에서 비스듬히(45° 정도) 모아서 하세요.",
            fact: "저자들은 위팔을 60° 넘게 벌리지 말고 스스로 편한 위치나 몸통 가까이에서 하라고 권했어요(건강한 16명).", hypo: "\"45° 정도\"는 앱이 쉽게 바꾼 표현이에요. 통증 감소 효과는 연구되지 않았어요.", ev: "weak", src: "Suprak 2013" },
    plus: { title: "푸시업 플러스로 날개뼈 운동", how: "푸시업 맨 위에서 팔을 편 채 등을 둥글게 밀어 날개뼈를 벌려 주는 동작을 더하세요. 힘들면 무릎을 대고 하세요.",
            fact: "가벼운 어깨 문제가 있는 사람을 포함한 30명에서, 푸시업 플러스는 날개뼈를 잡아 주는 앞톱니근을 가장 많이 썼고 위쪽 승모근 비율은 낮았어요. 무릎·팔꿈치를 댄 변형도 비율이 낮았어요.", hypo: "근육 활동을 본 연구예요. 통증이 줄어드는지는 이 연구에서 보지 않았어요.", ev: "mid", src: "Ludewig 2004" },
    load: { title: "무게·횟수 줄이기", how: "중량 딥스는 맨몸으로, 세트와 횟수는 아프지 않은 만큼 줄이세요.",
            fact: "무게를 낮추는 건 어깨 통증 보존적 관리의 기본 원칙이에요.", hypo: "얼마 동안 해야 하는지는 정해 두지 않았어요. 기록을 보며 판단하세요.", ev: "mid", src: "BESS/BOA 2021" },
    acc: COMMON_A.acc,
  },
  sources: [
    ["McKenzie 2022a, 벤치·바·링 딥스의 동작과 근활성", "https://doi.org/10.3390/ijerph192013211"],
    ["McKenzie 2022b, 피로와 바 딥스 관절 각도", "https://doi.org/10.3390/ijerph192114390"],
    ["Suprak 2013, 푸시업 팔 각도와 날개뼈 움직임", "https://doi.org/10.4085/1062-6050-48.5.08"],
    ["Ludewig 2004, 푸시업 변형과 앞톱니근·승모근 활성", "https://doi.org/10.1177/0363546503258911"],
    ["Kolber 2010, 웨이트 트레이닝 관련 어깨 부상 고찰", "https://paulogentil.com/pdf/Shoulder%20Injuries%20Attributed%20to%20Resistance%20Training%20-%20A%20Brief%20Review.pdf"],
    ["BESS/BOA 어깨 통증 진료 경로 (Rees 2021)", "https://pmc.ncbi.nlm.nih.gov/articles/PMC7905504"]],
  sample: { where: "front", ex: "dips", when: "bottom", depth: "deep", flare: "na", spike: "no", dur: "w2to6", trend: "same", acc: "never" },
  summary(a) { return [
    `아픈 곳: ${label("where", a.where)} / 운동: ${label("ex", a.ex)} / 가장 아플 때: ${label("when", a.when)}`,
    `딥스 깊이: ${label("depth", a.depth)} / 푸시업 팔꿈치: ${label("flare", a.flare)}`,
    `최근 4주 급증: ${label("spike", a.spike)} / 보조운동: ${label("acc", a.acc)}`,
    `기간·경과: ${label("dur", a.dur)}, ${label("trend", a.trend)}`]; },
  analyse(a) {
    const sc = { deep: 0, flare: 0, rc: 0, acj: 0, chest: 0 };
    if (has(a, "depth", "deep")) sc.deep += 3; else if (has(a, "depth", "par")) sc.deep += 1;
    if (has(a, "ex", "bdip")) sc.deep += 3;
    if (has(a, "when", "bottom")) sc.deep += 2;
    if (has(a, "where", "front")) sc.deep += 1;
    if (has(a, "flare", "wide")) sc.flare += 3;
    if (has(a, "ex", "push") || has(a, "ex", "both")) sc.flare += 1;
    if (has(a, "when", "arm")) sc.rc += 3;
    if (has(a, "where", "side")) sc.rc += 3;
    if (has(a, "where", "top")) sc.acj += 4;
    if (has(a, "where", "chest")) sc.chest += 4;
    const order = Object.entries(sc).sort((x, y) => y[1] - x[1]);
    const main = order[0][1] > 0 ? order[0][0] : "rc";
    const patterns = [main, ...order.filter(([k, v]) => k !== main && v >= 3).map(([k]) => k)].slice(0, 3);
    const picks = [];
    if (has(a, "ex", "bdip")) picks.push(["nobench", 1]);
    if (has(a, "depth", "deep") || has(a, "depth", "par") || main === "deep" || main === "chest") picks.push(["depth", 1.5]);
    if (has(a, "flare", "wide")) picks.push(["tuck", 1.5]);
    picks.push(["load", has(a, "spike", "yes") ? 2 : 4]);
    if (main === "rc" || main === "flare" || has(a, "acc", "never")) picks.push(["plus", 3]);
    if (has(a, "acc", "never") || has(a, "acc", "sometimes")) picks.push(["acc", 3.5]);
    return finish(a, sc, patterns, picks, false);
  },
  extras() {
    return [card("딥스는 어깨에 나쁜 운동인가요?", "weak",
      "그렇게 단정할 근거는 없어요. 딥스가 어깨 부상 위험을 높일 수 있다는 말은 전문가 의견 수준이에요. 바 딥스를 지칠 때까지 한 세트 해도 가장 깊은 어깨 각도는 변하지 않았어요. 다만 벤치 딥스는 어깨를 스스로 낼 수 있는 범위보다 더 젖혀서 저자들이 권하지 않았고, 대흉근 파열은 딥스 중에도 보고돼 있어요.", "Kolber 2010, McKenzie 2022a·b")];
  },
};
