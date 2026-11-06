/* 스쿼트 허리 */
TOPICS.sqb = {
  meta: { version: "8", updated: "2026-11-06" },
  name: "스쿼트 (허리)", brand: "스쿼트 허리 점검", eyebrow: "SQUAT · LOW BACK",
  hero: "스쿼트할 때 허리가 아프다면",
  redFlags: TOPICS.dl.redFlags, flagLevels: TOPICS.dl.flagLevels, flagSrc: TOPICS.dl.flagSrc,
  questions: [
    TOPICS.dl.questions.find(q => q.id === "where"),
    TOPICS.dl.questions.find(q => q.id === "leg"),
    { id: "when", q: "언제 가장 아픈가요?", opts: [
      ["bottom", "가장 깊이 앉았을 때"], ["up", "일어설 때"], ["after", "운동 후나 다음 날"], ["daily", "운동 안 할 때, 일상에서도"] ] },
    { id: "wink", q: "가장 깊이 앉을 때 골반이 말리면서 허리가 둥글게 되나요?", hint: "옆에서 찍은 영상으로 확인해 보면 좋아요.", hypo: "혼자 영상으로 판단한 결과가 정확한지, 이것이 통증과 관련 있는지는 확인되지 않았어요.", opts: [
      ["yes", "예"], ["no", "아니오"], ["unsure", "잘 모르겠음"] ] },
    { id: "style", q: "어떤 스쿼트를 주로 하나요?", opts: [
      ["high", "바벨 백 스쿼트 (바를 높게, 목 아래)"], ["low", "바벨 백 스쿼트 (바를 낮게, 어깨뼈 위)"], ["front", "프런트·고블릿 스쿼트"] ] },
    TOPICS.dl.questions.find(q => q.id === "spike"),
    { id: "now", q: "아프고 나서 스쿼트는 어떻게 하고 있나요?", opts: [
      ["rest", "아예 쉬고 있어요"], ["light", "가볍게 계속하고 있어요"], ["same", "원래대로 하고 있어요"] ] },
    TOPICS.dl.questions.find(q => q.id === "onset"),
    COMMON_Q.dur, COMMON_Q.trend,
  ],
  patterns: TOPICS.dl.patterns,
  adjustments: {
    load: { ...TOPICS.dl.adjustments.load, how: "통증이 늘지 않는 무게로 낮춰서 해 보세요." },
    ramp: { ...TOPICS.dl.adjustments.ramp, fact: "가이드라인은 평소 활동을 이어가길 권해요. 데드리프트로는 10kg부터 통증에 맞춰 올린 8주 훈련이 저부하 운동과 비슷하게 통증을 줄였어요.",
            hypo: "스쿼트로 같은 방법을 시험한 연구는 없어요. 데드리프트 연구를 스쿼트에 옮긴 건 앱의 추론이에요.", ev: "weak" },
    depth: { title: "허리가 둥글어지기 전까지만 앉기", how: "골반이 말리기 시작하는 깊이 바로 위까지만 앉으세요. 박스나 벤치를 놓고 그 높이까지만 앉는 것도 방법이에요.",
             fact: "엉덩이가 굽힐 수 있는 끝에 닿으면 골반이 뒤로 말리며 허리도 굽어져 압박·전단력이 걸려요. 저자들은 허리 통증이 있으면 허리를 중립으로 유지할 수 있는 깊이까지만 앉으라고 권했어요(임상 해설).", hypo: "깊이를 줄이면 통증이 줄어드는지는 연구되지 않았어요.", ev: "weak", src: "Straub & Powers 2024" },
    front: { title: "프런트·고블릿 스쿼트로 바꾸기", how: "덤벨이나 케틀벨을 가슴 앞에 들고 하는 고블릿 스쿼트로 가볍게 시작하세요. 발을 조금 넓게 서도 좋아요.",
             fact: "무게를 몸 앞에 두면 상체가 더 서고, 백 스쿼트는 같은 무게에서 엉덩이 부담이 더 커요. 저자들은 허리 통증에 발을 조금 넓게 서서 상체를 덜 숙이도록 권했어요(임상 해설).", hypo: "이렇게 바꾸면 허리 통증이 줄어드는지는 확인되지 않았어요.", ev: "weak", src: "Straub & Powers 2024" },
    move: TOPICS.dl.adjustments.move,
  },
  sources: [
    TOPICS.dl.sources[0], TOPICS.dl.sources[1], TOPICS.dl.sources[2], TOPICS.dl.sources[3], TOPICS.dl.sources[4],
    ["Straub & Powers 2024, 스쿼트 생체역학 임상 해설", "https://pmc.ncbi.nlm.nih.gov/articles/PMC10987311/"],
    ...TOPICS.dl.sources.slice(5).filter(s => !/Martín-Fuentes/.test(s[0]))],
  sample: { where: "center", leg: "none", when: "bottom", wink: "yes", style: "high", spike: "no", now: "same", onset: "gradual", dur: "w2to6", trend: "same" },
  summary(a) { return [
    `아픈 곳: ${label("where", a.where)} / 다리 증상: ${label("leg", a.leg)}`,
    `아플 때: ${label("when", a.when)} / 시작: ${label("onset", a.onset)}`,
    `깊이에서 골반 말림: ${label("wink", a.wink)} / 스쿼트: ${label("style", a.style)}`,
    `최근 4주 급증: ${label("spike", a.spike)} / 통증 후 스쿼트: ${label("now", a.now)}`,
    `기간·경과: ${label("dur", a.dur)}, ${label("trend", a.trend)}`]; },
  analyse(a) {
    const sc = { nerve: 0, load: 0 };
    if (has(a, "leg", "below")) sc.nerve += 4; else if (has(a, "leg", "thigh")) sc.nerve += 1;
    if (has(a, "where", "buttock")) sc.nerve += 1;
    if (has(a, "spike", "yes")) sc.load += 3;
    const patterns = sc.nerve >= 4 ? ["nerve", "nsp"] : ["nsp"];
    if (sc.load >= 3) patterns.push("load");
    const picks = [];
    if (has(a, "spike", "yes") || has(a, "now", "same")) picks.push(["load", 1]);
    if (has(a, "now", "rest") || has(a, "now", "light")) picks.push(["ramp", 2]);
    if (has(a, "wink", "yes") || has(a, "when", "bottom")) picks.push(["depth", 3]);
    if (has(a, "style", "high") || has(a, "style", "low")) picks.push(["front", 4]);
    if (has(a, "now", "rest") && !has(a, "when", "daily")) picks.push(["move", 5]);
    if (!picks.length) picks.push(["ramp", 2]);
    return finish(a, sc, patterns, picks, has(a, "when", "daily"), has(a, "leg", "below"));
  },
  extras() { return TOPICS.dl.extras(); },
};
