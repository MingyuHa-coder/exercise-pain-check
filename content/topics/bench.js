/* 벤치프레스 어깨 */
TOPICS.bench = {
  meta: { version: "8.2", updated: "2026-11-06" },
  name: "벤치프레스", brand: "벤치 어깨 점검", eyebrow: "BENCH · SHOULDER",
  hero: "벤치할 때 어깨가 아프다면",
  redFlags: withFlag({ id: "tear", q: "무거운 무게를 내리다 \"뚝\" 하는 느낌과 함께 아프고 힘이 빠졌나요? 가슴이나 겨드랑이 모양이 그대로여도 해당돼요.", level: 2 }),
  flagLevels: withLevel({ title: "며칠 안에 정형외과 진료를 받으세요", body: "근육이나 힘줄이 다쳤을 때 나타나는 신호예요. 겉모양이 그대로여도 해당될 수 있어요. 일찍 확인받을수록 선택지가 많아요." }),
  flagSrc: "BESS/BOA 어깨 통증 진료 경로 (Rees 2021), ElMaraghy 2012",
  questions: [
    { id: "where", q: "어디가 아픈가요?", opts: [
      ["front", "어깨 앞쪽"], ["top", "어깨 위쪽 한 점 (쇄골 끝)"], ["sideback", "어깨 옆이나 뒤"], ["unsure", "잘 모르겠음"] ] },
    { id: "when", q: "언제 가장 아픈가요?", opts: [
      ["lower", "바를 가슴까지 내릴 때"], ["press", "바를 밀어 올릴 때"], ["after", "운동 후나 다음 날"], ["daily", "운동 안 할 때, 일상생활에서도"] ] },
    { id: "grip", q: "벤치 그립 너비는 어느 정도인가요?", hint: "내 손 간격과 가장 비슷한 사진을 골라 주세요.", imgs: { g1: "img/grip-1.jpg", g15: "img/grip-15.jpg", g2: "img/grip-2.jpg" }, opts: [
      ["g1", "어깨너비 정도"], ["g15", "어깨너비의 1.5배쯤"], ["g2", "그보다 넓게"] ] },
    { id: "elbow", q: "바를 내릴 때 팔꿈치는 어떻게 되나요?", hint: "누운 모습을 위에서 내려다본 그림이에요. 몸통과 위팔 사이 각도를 비교해 보세요.", figure: "elbow", opts: [
      ["tucked", "몸통에 바짝 붙임 (약 45°)"], ["mid", "중간 정도 (약 70°)"], ["flared", "옆으로 거의 일자 (약 90°)"] ] },
    { id: "scap", q: "날개뼈를 모으고 아래로 내린 채로 벤치를 하나요?", opts: [
      ["yes", "예"], ["no", "아니오"], ["unsure", "잘 모르겠음"] ] },
    { id: "other", q: "벤치 말고 아픈 운동이 있나요?", hint: "해당하는 것을 모두 골라 주세요.", multi: true, opts: [
      ["lateral", "사이드 레터럴 레이즈"], ["upright", "업라이트 로우"], ["ohp", "숄더 프레스"], ["dips", "딥스"], ["none", "없음"] ] },
    { id: "daily", q: "최근 일상에서 불편했던 동작이 있나요?", hint: "새로 해 볼 필요는 없어요. 최근에 겪은 것만 모두 골라 주세요.", multi: true, opts: [
      ["cross", "팔을 반대편으로 가로질러 뻗기 (안전벨트 매기)"], ["behind", "등 뒤로 손 올리기"], ["overhead", "머리 위로 팔 들기"], ["none", "없음"] ] },
    { id: "load", q: "벤치 최고 무게(1RM)는 내 체중의 몇 배쯤인가요?", opts: [
      ["lt1", "1배 미만"], ["mid", "1~1.5배"], ["gt15", "1.5배 넘음"], ["unknown", "잘 모름"] ] },
    COMMON_Q.dur, COMMON_Q.trend, COMMON_Q.acc,
  ],
  patterns: {
    rc: COMMON_P.rc("헬스하는 사람의 어깨 통증에서 가장 흔한 모습이에요.", "바를 내리고 미는 동작의 어깨 부담",
          ["무게와 횟수", "그립 너비", "날개뼈 세팅", "머리 위로 드는 다른 운동의 양"]),
    acj: { title: "무겁게·자주 하는 벤치의 어깨 위쪽 부담", term: "쇄골 끝 관절 통증 (원위 쇄골 골용해 등)",
          plain: "어깨 위쪽, 쇄골 끝이 반복해서 눌릴 때 보이는 모습이에요. 무겁게, 자주, 오래 벤치를 한 사람에게 많아요.",
          check: ["벤치 무게(1RM이 체중의 몇 배인지)", "주당 벤치 횟수", "그립 너비"],
          say: "무게와 빈도를 먼저 줄이고 그립을 조정해 보세요.",
          ev: "mid", evText: "체중의 1.5배 넘는 벤치, 주 1회 초과, 5년 이상이 겹치면 위험이 크게 높아졌어요 (MRI 환자-대조 연구).", src: "Nevalainen 2016, Noteboom 2024" },
    scap: { title: "날개뼈 세팅과 보조운동", term: "견갑 운동이상 (날개뼈 움직임 문제)",
          plain: "팔을 움직일 때 날개뼈가 몸통에 잘 고정되지 않으면 어깨에 부담이 더 갈 수 있어요.",
          check: ["바를 잡기 전 날개뼈 모으고 내리기", "날개뼈·어깨 보조운동"],
          say: "날개뼈 세팅과 보조운동이 도움이 될 수 있어요.",
          ev: "mid", evText: "통증 없는 사람에게도 70% 넘게 보여서, 이것만으로 원인이라고 보진 않아요.", src: "Kibler 2013, Hickey 2018" },
  },
  adjustments: {
    load: { title: "무게와 횟수 낮추기", how: "통증 없이 할 수 있는 무게로 해 보세요. 쇄골 끝이 아프면 벤치 횟수도 주 1회로 줄여 보세요.",
            fact: "무게를 낮추는 건 어깨 통증 보존적 관리의 기본 원칙이에요. 체중 1.5배 넘는 벤치, 주 1회 초과, 5년 이상이 겹치면 MRI에서 쇄골 끝 뼈가 녹는 변화가 생길 위험이 높았어요.", hypo: "\"주 1회\"로 줄이라는 횟수는 앱이 정한 값이에요. 얼마 동안 해야 하는지는 정해 두지 않았어요.", ev: "mid", src: "BESS/BOA 2021, Nevalainen 2016" },
    grip: { title: "그립을 어깨너비 1~1.5배로", how: "손 간격을 어깨너비의 1.5배보다 좁게 잡으세요. 너무 좁게(어깨너비 정도)도 잡지 마세요.",
            fact: "근골격 모델에서 2배 그립은 쇄골 끝 압박과 회전근개 부담을 키웠고, 아주 좁은 그립은 관절 위쪽에 힘이 더 걸렸어요.", hypo: "그립을 바꾸면 실제로 통증이 줄어드는지는 사람 대상으로 확인되지 않았어요.", ev: "mid", src: "Noteboom 2024" },
    scap: { title: "날개뼈 모으고 내리기", how: "바를 잡기 전에 날개뼈를 뒤로 모으고 아래로 내려 벤치에 고정한 채로 하세요.",
            fact: "근골격 모델에서 날개뼈를 모으면 어깨 관절 압박이 줄고 회전근개가 덜 일했어요.", hypo: "실제로 통증이 줄어드는지는 사람 대상으로 확인되지 않았어요.", ev: "mid", src: "Noteboom 2024" },
    elbow: { title: "팔꿈치 각도를 중간으로", how: "팔꿈치를 옆으로 일자(90°)로 벌리지도, 몸통에 바짝(45°) 붙이지도 말고 그 사이(약 70°)로 내리세요.",
            fact: "근골격 모델에서 팔꿈치 각도의 영향은 그립·날개뼈보다 작았고, 45°는 관절 위쪽에 걸리는 힘을 키웠어요.", hypo: "약 70°를 권하는 건 모델 결과를 바탕으로 한 앱의 제안이에요. 통증이 줄어드는지는 확인되지 않았어요.", ev: "weak", src: "Noteboom 2024" },
    acc: COMMON_A.acc,
    flex: { title: "어깨 뒤쪽 스트레칭", how: "팔을 반대편으로 가로질러 당기는 스트레칭, 옆으로 누워 팔을 안쪽으로 돌리는 스트레칭을 해 보세요.",
            fact: "전문가 합의문은 어깨 뒤쪽이 뻣뻣하면 날개뼈가 앞으로 끌려갈 수 있고, 재활은 유연성 확보부터 시작한다고 봐요.", hypo: "팔을 가로지르는 동작이 불편한 사람에게 이 스트레칭을 연결한 건 앱의 판단이에요.", ev: "weak", src: "Kibler 2013, MedBridge" },
  },
  sources: [SRC.bess, SRC.pieters, SRC.kibler,
    ["Nevalainen 2016, 벤치 강도와 쇄골 끝 골용해", "https://link.springer.com/doi/10.1007/s00256-016-2446-z"],
    ["Noteboom 2024, 벤치 기술에 따른 어깨 부하", "https://repository.tudelft.nl/file/File_e93e7ee3-27f5-4ced-8650-3db606326d44"],
    ["ElMaraghy 2012, 대흉근 파열 체계적 고찰", "https://doi.org/10.1016/j.jse.2011.04.035"],
    SRC.hickey, SRC.barrett,
    ["Torwichien 2020, 움직임 손상 분류의 일치도", "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC7136527/"]],
  sample: { where: "front", when: "lower", grip: "g2", elbow: "flared", scap: "unsure", other: ["lateral"], daily: ["cross"], load: "mid", dur: "w2to6", trend: "same", acc: "never" },
  summary(a) { return [
    `아픈 곳: ${label("where", a.where)}`,
    `아플 때: ${label("when", a.when)}`,
    `기간·경과: ${label("dur", a.dur)}, ${label("trend", a.trend)}`,
    `그립: ${label("grip", a.grip)} / 팔꿈치: ${label("elbow", a.elbow)} / 날개뼈 세팅: ${label("scap", a.scap)}`,
    `벤치 1RM: 체중의 ${label("load", a.load)}`,
    `다른 아픈 운동: ${(a.other || []).map(v => label("other", v)).join(", ") || "-"}`,
    `불편한 일상 동작: ${(a.daily || []).map(v => label("daily", v)).join(", ") || "-"}`]; },
  analyse(a) {
    const sc = { rc: 0, acj: 0, scap: 0 };
    if (has(a, "where", "front") || has(a, "where", "sideback")) sc.rc += 2;
    ["lateral", "upright", "ohp"].forEach(v => { if (has(a, "other", v)) sc.rc += 1; });
    if (has(a, "daily", "overhead")) sc.rc += 2;
    if (has(a, "when", "lower") || has(a, "when", "press")) sc.rc += 1;
    if (has(a, "where", "top")) sc.acj += 4;
    if (has(a, "daily", "cross")) sc.acj += 1;
    if (has(a, "grip", "g2")) sc.acj += 2; else if (has(a, "grip", "g15")) sc.acj += 1;
    if (has(a, "load", "gt15")) sc.acj += 2;
    if (has(a, "scap", "no") || has(a, "scap", "unsure")) sc.scap += 2;
    if (has(a, "acc", "never")) sc.scap += 1;

    const main = sc.acj > sc.rc ? "acj" : "rc";
    const other = main === "rc" ? "acj" : "rc";
    const patterns = [main];
    if (sc[other] >= 3) patterns.push(other);
    if (sc.scap >= 2) patterns.push("scap");

    const picks = [];
    picks.push(["load", main === "acj" || has(a, "load", "gt15") ? 1 : 6]);
    if (has(a, "grip", "g15") || has(a, "grip", "g2")) picks.push(["grip", 2]);
    if (has(a, "scap", "no") || has(a, "scap", "unsure")) picks.push(["scap", 3]);
    if (has(a, "elbow", "flared") || has(a, "elbow", "tucked")) picks.push(["elbow", 5]);
    if (has(a, "acc", "never") || has(a, "acc", "sometimes")) picks.push(["acc", 4]);
    if (has(a, "daily", "cross") || has(a, "daily", "behind")) picks.push(["flex", 7]);
    return finish(a, sc, patterns, picks, has(a, "when", "daily"));
  },
  extras() {
    const out = [];
    /* v7: 답변 점수로 띄우던 규칙(B1, 4개 중 3개)을 없애고, 누구나 보는 질문 카드로 바꿨다. */
    out.push(card("어깨 앞쪽 통증을 '자세 분류'로 설명하는 글을 봤다면", "weak",
      "벤치에서 어깨 앞쪽이 아플 때 인터넷에서 자주 나오는 개념이에요. 하지만 전문 물리치료사끼리도 이 분류의 일치도가 낮았고(카파 0.30), 헬스하는 사람을 대상으로 한 연구는 아직 없어요. 앱은 답변으로 이 분류를 고르지 않아요. 궁금하면 전문가에게 직접 확인받으세요.", "Torwichien 2020"));
    out.push(card("라운드 숄더 때문일까요?", "weak",
      "자세만으로 통증 원인이라고 보긴 어려워요. 등이 굽은 정도는 어깨가 아픈 사람과 안 아픈 사람 사이에 차이가 없었어요. 교정 운동으로 자세 각도는 좋아지지만, 그게 통증을 줄인다는 근거는 아직 없어요.", "Barrett 2016, Sepehri 2024"));
    return out;
  },
};
