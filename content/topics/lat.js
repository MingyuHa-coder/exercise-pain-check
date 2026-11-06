/* 레터럴 레이즈·업라이트 로우 어깨 */
TOPICS.lat = {
  meta: { version: "8.2", updated: "2026-11-06" },
  name: "레터럴 레이즈·업라이트 로우", brand: "레터럴 레이즈 어깨 점검", eyebrow: "LATERAL RAISE · SHOULDER",
  hero: "레터럴 레이즈·업라이트 로우에서 어깨가 아프다면",
  redFlags: TOPICS.ohp.redFlags, flagLevels: TOPICS.ohp.flagLevels, flagSrc: TOPICS.ohp.flagSrc,
  questions: [
    TOPICS.ohp.questions.find(q => q.id === "where"),
    { id: "ex", q: "어떤 운동에서 아픈가요?", opts: [
      ["lat", "사이드 레터럴 레이즈"], ["urow", "업라이트 로우"], ["both", "둘 다"] ] },
    { id: "height", q: "팔을 어디까지 올리나요?", opts: [
      ["below", "어깨 높이 아래"], ["level", "어깨 높이쯤"], ["above", "어깨보다 위"] ] },
    { id: "thumb", q: "레터럴 레이즈할 때 손 방향은 어떤가요?", hint: "팔을 가장 높이 올렸을 때를 떠올려 보세요.", opts: [
      ["up", "엄지가 위나 앞을 향해요"], ["flat", "손등이 위를 향해요"], ["down", "새끼손가락이 위로 가요 (물 따르듯)"] ] },
    TOPICS.ohp.questions.find(q => q.id === "arc"),
    TOPICS.ohp.questions.find(q => q.id === "side"),
    { id: "spike", q: "최근 4주 사이 무게나 횟수를 크게 늘렸나요?", hypo: "\"4주\"와 \"크게\"라는 기준은 앱이 정한 거예요.", opts: [
      ["yes", "예"], ["no", "아니오"] ] },
    COMMON_Q.dur, COMMON_Q.trend, COMMON_Q.acc,
  ],
  patterns: {
    rc: TOPICS.ohp.patterns.rc,
    acj: TOPICS.ohp.patterns.acj,
    ir: { title: "팔을 안쪽으로 돌린 채 높이 드는 자세", plain: "팔을 안쪽으로 돌린 채(업라이트 로우, 물 따르듯 드는 레이즈) 어깨 높이 이상으로 올리면 어깨 속 공간이 좁아지기 쉬운 자세가 돼요.",
        check: ["올리는 높이", "손 방향(엄지 위 vs 새끼손가락 위)", "업라이트 로우"],
          say: "높이와 손 방향부터 바꿔 보세요.",
          ev: "weak", evText: "팔을 올릴 때는 바깥회전이 필요한데, 업라이트 로우는 안쪽으로 돌린 채 올려요. 충돌은 팔 올림 70~120°에서 가장 커진다는 영상·해부 연구를 정리한 실무 칼럼이에요. 헬스 부상 고찰들도 이런 자세를 주의하라고 해요.", src: "Schoenfeld 2011, Kolber 2010, Bonilla 2022" },
  },
  adjustments: {
    height: { title: "어깨 높이 바로 아래까지만 올리기", how: "팔이 바닥과 평행해지기 직전에서 멈추세요. 그 높이에서도 아프면 아프지 않은 높이까지만 올리세요.",
              fact: "저자들은 통증 없는 사람도 90° 바로 아래까지만, 통증이 있으면 아프지 않은 높이까지만 올리라고 권했어요(실무 칼럼).", hypo: "저자들의 추론이고, 통증이 줄어드는지는 연구되지 않았어요.", ev: "weak", src: "Schoenfeld 2011" },
    thumb: { title: "엄지를 위·앞으로 향하게 들기", how: "물 따르듯 새끼손가락을 올리지 말고, 엄지가 위나 약간 앞을 향하게 드세요. 팔은 몸 옆보다 약간 앞쪽으로 드세요.",
             fact: "건강한 남성 15명에서 엄지 위(풀 캔)는 엄지 아래(엠프티 캔)보다 어깨관절이 더 움직이는 정상적인 협응을 보였고, 엄지 아래는 날개뼈·쇄골이 더 올라가는 보상 패턴을 보였어요.", hypo: "2.27kg으로 건강한 사람을 잰 연구예요. 어깨 속 공간이나 통증은 재지 않았어요.", ev: "weak", src: "Robert-Lachaine 2015" },
    urow: { title: "업라이트 로우는 낮게, 아프면 빼기", how: "바를 몸에 붙여 팔꿈치로 당기고, 어깨 높이 아래에서 멈추세요. 그래도 아프면 당분간 빼고 레터럴 레이즈로 대신하세요.",
            fact: "바를 몸에 가깝게 두고, 통증이 있으면 높이를 줄이거나 하지 말라고 권했어요(실무 칼럼).", hypo: "레터럴 레이즈로 대신하라는 건 앱의 제안이에요.", ev: "weak", src: "Schoenfeld 2011" },
    load: { title: "무게와 횟수 낮추기", how: "통증 없이 할 수 있는 무게로 해 보세요.",
            fact: "무게를 낮추는 건 어깨 통증 보존적 관리의 기본 원칙이에요.", hypo: "얼마 동안 해야 하는지는 정해 두지 않았어요. 기록을 보며 판단하세요.", ev: "mid", src: "BESS/BOA 2021" },
    acc: COMMON_A.acc,
  },
  sources: [
    ["Schoenfeld 2011, 업라이트 로우와 어깨 충돌 (실무 칼럼)", "https://www.lookgreatnaked.com/articles/upright_row_implications_for_preventing_subacromial_impingement.pdf"],
    ["Robert-Lachaine 2015, 엄지 위·아래 들기의 어깨 협응", "https://nata.kglmeridian.com/downloadpdf/view/journals/attr/50/11/article-p1117.pdf"],
    ...TOPICS.ohp.sources.filter(s => /Kolber|Bonilla|BESS|Pieters|Kibler|KISS|Michener|Hegedus/.test(s[0]))],
  sample: { where: "frontside", ex: "both", height: "above", thumb: "down", arc: "mid", side: "no", spike: "no", dur: "w2to6", trend: "same", acc: "never" },
  summary(a) { return [
    `아픈 곳: ${label("where", a.where)} / 운동: ${label("ex", a.ex)}`,
    `올리는 높이: ${label("height", a.height)} / 손 방향: ${label("thumb", a.thumb)}`,
    `팔을 옆으로 들 때: ${label("arc", a.arc)} / 아픈 쪽으로 누우면 아픔: ${label("side", a.side)}`,
    `최근 4주 급증: ${label("spike", a.spike)} / 보조운동: ${label("acc", a.acc)}`,
    `기간·경과: ${label("dur", a.dur)}, ${label("trend", a.trend)}`]; },
  analyse(a) {
    const sc = { rc: 0, acj: 0, ir: 0 };
    if (has(a, "where", "frontside")) sc.rc += 2;
    if (has(a, "arc", "mid")) sc.rc += 3; else if (has(a, "arc", "all")) sc.rc += 1;
    if (has(a, "side", "yes")) sc.rc += 2;
    if (has(a, "where", "top")) sc.acj += 4;
    if (has(a, "arc", "top")) sc.acj += 2;
    if (has(a, "ex", "urow") || has(a, "ex", "both")) sc.ir += 2;
    if (has(a, "thumb", "down")) sc.ir += 2;
    if (has(a, "height", "above")) sc.ir += 1;
    const main = sc.acj > sc.rc ? "acj" : "rc";
    const other = main === "rc" ? "acj" : "rc";
    const patterns = [main];
    if (sc[other] >= 3) patterns.push(other);
    if (sc.ir >= 3) patterns.push("ir");
    const picks = [];
    if (has(a, "height", "above") || has(a, "height", "level")) picks.push(["height", 1]);
    if (has(a, "thumb", "down")) picks.push(["thumb", 2]);
    if (has(a, "ex", "urow") || has(a, "ex", "both")) picks.push(["urow", 3]);
    picks.push(["load", has(a, "spike", "yes") ? 1.5 : 5]);
    if (has(a, "acc", "never") || has(a, "acc", "sometimes")) picks.push(["acc", 4]);
    return finish(a, sc, patterns, picks, false);
  },
  extras() {
    return [card("물 따르듯 드는 레터럴 레이즈, 괜찮을까요?", "weak",
      "새끼손가락을 올리면 팔이 안쪽으로 돌아가요. 건강한 사람에서도 이 자세는 날개뼈와 쇄골이 더 올라가는 보상 패턴을 보였고, 팔을 안쪽으로 돌린 채 어깨 높이 이상 올리는 자세는 어깨 속 공간이 좁아지기 쉽다고 봐요. 다만 이 자세가 통증을 만든다는 걸 직접 보여준 연구는 이번에 본문을 확인한 자료 중엔 없어요.", "Robert-Lachaine 2015, Schoenfeld 2011")];
  },
};
