/* 바벨 로우 허리 */
TOPICS.row = {
  meta: { version: "8", updated: "2026-11-06" },
  name: "바벨 로우 (허리)", brand: "바벨 로우 허리 점검", eyebrow: "BENT-OVER ROW · LOW BACK",
  hero: "바벨 로우할 때 허리가 아프다면",
  redFlags: TOPICS.dl.redFlags,
  flagLevels: TOPICS.dl.flagLevels,
  flagSrc: TOPICS.dl.flagSrc,
  questions: [
    TOPICS.dl.questions.find(q => q.id === "where"),
    TOPICS.dl.questions.find(q => q.id === "leg"),
    TOPICS.dl.questions.find(q => q.id === "onset"),
    { id: "when", q: "언제 가장 아픈가요?", opts: [
      ["hold", "숙인 자세를 버티는 동안"], ["pull", "당길 때 상체가 들썩일 때"], ["after", "운동 후나 다음 날"], ["daily", "운동 안 할 때, 일상에서도"] ] },
    { id: "style", q: "로우를 어떻게 하나요?", opts: [
      ["bb", "바벨을 들고 서서 숙여서"], ["pend", "매번 바닥에서 들어 올리는 펜들레이 로우"], ["db", "한 손은 벤치를 짚고 덤벨로"], ["sup", "가슴을 받침대에 대거나 앉아서 (머신·케이블)"] ] },
    { id: "body", q: "당길 때 상체가 위아래로 크게 들썩이나요?", hint: "옆에서 찍은 영상으로 보면 쉬워요.", opts: [ ["yes", "예, 반동을 써요"], ["no", "아니오, 고정돼 있어요"], ["unsure", "잘 모르겠어요"] ] },
    TOPICS.dl.questions.find(q => q.id === "spike"),
    { id: "now", q: "아프고 나서 로우는 어떻게 하고 있나요?", opts: [
      ["rest", "아예 쉬고 있어요"], ["light", "가볍게 계속하고 있어요"], ["same", "원래대로 하고 있어요"] ] },
    COMMON_Q.dur, COMMON_Q.trend,
  ],
  patterns: {
    nsp: TOPICS.dl.patterns.nsp,
    nerve: TOPICS.dl.patterns.nerve,
    hold: { title: "숙인 자세 버티기 부담", plain: "서서 숙인 채 바를 들고 버티면 허리가 내내 무게를 받치며 굽어지는 방향으로 힘을 받아요. 상체가 들썩이면 부담이 더 흔들려요.",
          check: ["로우 방식(서서 vs 가슴 받침)", "상체 반동", "무게"],
            say: "가슴을 받치는 로우로 바꾸거나 무게를 줄여 보세요.",
            ev: "weak", evText: "건강한 남성 7명에서 서서 하는 바벨 로우는 허리 압박이 약 3,580N으로, 맨몸 인버티드 로우(약 2,340N)·한 손 케이블 로우(약 2,460N)보다 컸고 허리 굽힘도 가장 컸어요(굽힐 수 있는 범위의 약 43%).", src: "Fenwick 2009",
            hypo: "허리 압박이 크다고 통증이 생기거나 심해진다는 근거는 아니에요. 측정값을 통증 상황에 연결한 건 앱의 추론이에요." },
    load: TOPICS.dl.patterns.load,
  },
  adjustments: {
    support: { title: "가슴을 받치는 로우로 바꾸기", how: "인클라인 벤치에 가슴을 대고 하는 체스트 서포티드 로우, 한 손으로 벤치를 짚는 덤벨 로우, 앉아서 하는 케이블·머신 로우로 바꿔 보세요.",
               fact: "허리 압박은 서서 하는 바벨 로우에서 가장 컸어요. 저자들은 허리 움직임과 부하를 덜 견디는 사람에게 인버티드 로우가 더 맞을 수 있다고 했어요.", hypo: "가슴 받침·앉은 로우를 직접 측정한 건 아니에요(3명 예비 연구만 있어 근거로 쓰기 어려워요). 바꾸면 통증이 줄어드는지도 연구되지 않았어요.", ev: "weak", src: "Fenwick 2009" },
    strict: { title: "반동 없이 상체 고정하기", how: "상체 각도를 정하고 당길 때 들썩이지 않을 무게로 줄이세요. 허리는 중립으로 두고 배에 힘을 주세요.",
              fact: "저자들은 중립 척추를 지키는 엄격한 자세를 강조했어요.", hypo: "반동이 통증과 관련 있는지는 연구되지 않았어요. 앱의 제안이에요.", ev: "weak", src: "Fenwick 2009" },
    load: { title: "무게와 횟수 낮추기", how: "통증이 늘지 않는 무게로 해 보세요.",
            fact: "허리를 다친 파워리프터 대부분은 훈련을 멈추지 않고 훈련량·강도를 줄이거나 종목을 바꿔 이어갔어요.", hypo: "얼마 동안 지켜볼지는 정해 두지 않았어요.", ev: "weak", src: "Strömbäck 2018" },
    move: TOPICS.dl.adjustments.move,
  },
  sources: [
    ["Fenwick 2009, 로우 종류별 허리 압박·움직임", "https://www.backfitpro.com/medical-scientific-articles/2009/[80]Fenwick,C.M.J.(2009)Comparison-of-different-rowing-exercises[J.Strength-and-Cond.].pdf"],
    ...TOPICS.dl.sources.filter(s => /Finucane|NICE|Menezes|Strömbäck/.test(s[0]))],
  sample: { where: "center", leg: "none", onset: "gradual", when: "hold", style: "bb", body: "yes", spike: "no", now: "same", dur: "w2to6", trend: "same" },
  summary(a) { return [
    `아픈 곳: ${label("where", a.where)} / 다리 증상: ${label("leg", a.leg)}`,
    `시작: ${label("onset", a.onset)} / 아플 때: ${label("when", a.when)}`,
    `로우 방식: ${label("style", a.style)} / 상체 들썩임: ${label("body", a.body)}`,
    `최근 4주 급증: ${label("spike", a.spike)} / 통증 후 로우: ${label("now", a.now)}`,
    `기간·경과: ${label("dur", a.dur)}, ${label("trend", a.trend)}`]; },
  analyse(a) {
    if (has(a, "leg", "below")) return finish(a, { nerve: 1 }, ["nerve"], [], has(a, "when", "daily"), true);
    const patterns = ["nsp"];
    const standing = has(a, "style", "bb") || has(a, "style", "pend");
    if (standing && (has(a, "when", "hold") || has(a, "when", "pull") || has(a, "body", "yes"))) patterns.push("hold");
    if (has(a, "spike", "yes")) patterns.push("load");
    const picks = [];
    if (standing) picks.push(["support", 1]);
    if (has(a, "body", "yes") || has(a, "when", "pull")) picks.push(["strict", 1.5]);
    picks.push(["load", has(a, "spike", "yes") || has(a, "now", "same") ? 1.2 : 2.5]);
    if (has(a, "now", "rest")) picks.push(["move", 1.1]); else picks.push(["move", 4]);
    return finish(a, {}, patterns, picks, has(a, "when", "daily"));
  },
  extras() {
    return [card("로우를 하면 허리가 다치나요?", "weak",
      "그렇게 단정할 근거는 없어요. 서서 하는 바벨 로우는 다른 로우보다 허리 압박이 컸지만, 건강한 7명을 한 번 측정한 연구예요. 허리 통증이 있는 사람에게 어떤 로우가 나은지 비교한 연구는 찾지 못했어요. 허리 통증 가이드라인은 활동을 이어가며 운동하라고 권하니, 아프지 않은 방식으로 등 운동을 계속하는 게 좋아요.", "Fenwick 2009, NICE NG59")];
  },
};
