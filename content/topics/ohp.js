/* 숄더 프레스 어깨 */
TOPICS.ohp = {
  meta: { version: "8", updated: "2026-11-06" },
  name: "숄더 프레스", brand: "숄더 프레스 어깨 점검", eyebrow: "OVERHEAD · SHOULDER",
  hero: "숄더 프레스할 때 어깨가 아프다면",
  redFlags: withFlag({ id: "cuff", q: "무게를 들다가 다친 뒤로, 많이 아프지 않은데도 팔을 어깨 높이 위로 들 힘이 없나요?", level: 2 }),
  flagLevels: withLevel({ title: "며칠 안에 정형외과 진료를 받으세요", body: "힘줄이 다쳤을 때 나타나는 신호예요. 통증보다 힘이 빠진 게 더 중요해요. 일찍 확인받을수록 선택지가 많아요." }),
  flagSrc: "BESS/BOA 어깨 통증 진료 경로 (Rees 2021), KISS 1차 진료 요약",
  questions: [
    { id: "where", q: "어디가 아픈가요?", opts: [
      ["frontside", "어깨 앞이나 옆 (삼각근 부위)"], ["top", "어깨 위쪽 한 점 (쇄골 끝)"], ["neck", "목과 어깨 사이"], ["unsure", "잘 모르겠음"] ] },
    { id: "arc", q: "최근 운동이나 일상에서 팔을 옆으로 들어 올릴 때, 언제 아팠나요?", hint: "새로 해 볼 필요는 없어요. 기억나는 대로 골라 주세요.", figure: "arc",
      hypo: "60~120° 기준은 논문에서 확인됐지만, 진료실에서 검사자가 한 결과예요. 기억으로 답한 높이도 같은 의미인지는 검증되지 않았어요.", opts: [
      ["mid", "어깨 높이 전후, 중간에서만 아프고 더 올리면 덜했어요"], ["top", "끝까지 올렸을 때만 아팠어요"], ["all", "올리는 내내 아팠어요"], ["none", "아프지 않았거나 기억나지 않아요"] ] },
    { id: "style", q: "어떤 숄더 프레스를 주로 하나요?", opts: [
      ["front", "바벨, 턱 앞으로 내림"], ["behind", "바벨, 목 뒤로 내림"], ["db", "덤벨"], ["machine", "머신"] ] },
    { id: "ogrip", q: "바벨을 잡을 때 손 간격은 어느 정도인가요?", hint: "어깨너비는 양쪽 어깨 끝 사이 거리예요.",
      hypo: "\"주먹 하나씩 넓게\"는 1.4배를 쉽게 바꾼 앱의 표현이에요. 실제 1.4배와 맞는지는 확인하지 않았어요.", opts: [
      ["narrow", "어깨너비 정도"], ["medium", "어깨너비의 1.4배쯤 (어깨보다 주먹 하나씩 넓게)"], ["wide", "그보다 넓게"], ["nobar", "바벨을 쓰지 않아요"] ] },
    { id: "side", q: "아픈 쪽 어깨를 바닥에 대고 누우면 아픈가요?", opts: [
      ["yes", "예"], ["no", "아니오"] ] },
    { id: "arch", q: "위로 밀 때 허리가 크게 젖혀지나요?", hint: "거울이나 영상으로 확인해 보면 좋아요.", opts: [
      ["yes", "예"], ["no", "아니오"], ["unsure", "잘 모르겠음"] ] },
    { id: "wall", q: "최근 운동이나 일상에서 두 팔을 머리 위로 끝까지 올릴 때, 허리를 젖히거나 어깨를 으쓱해야만 올라갔나요?", hint: "새로 해 볼 필요는 없어요. 기억나는 대로 골라 주세요.",
      hypo: "앱이 만든 질문이에요. 이 답으로 등·어깨 가동성을 판단할 수 있는지는 검증되지 않았어요.", opts: [
      ["easy", "아니요, 편하게 올라갔어요"], ["barely", "조금 젖히거나 으쓱해야 했어요"], ["no", "끝까지 올라가지 않았어요"] ] },
    { id: "shrug", q: "밀어 올릴 때 어깨가 귀 쪽으로 솟나요?", opts: [
      ["yes", "예"], ["no", "아니오"], ["unsure", "잘 모르겠음"] ] },
    COMMON_Q.dur, COMMON_Q.trend, COMMON_Q.acc,
  ],
  patterns: {
    rc: { ...COMMON_P.rc("팔을 머리 위로 드는 동작에서 가장 흔하고, 중간 높이에서만 아픈 것이 대표적인 단서예요.", "팔을 머리 위로 올리는 구간의 어깨 부담",
            ["무게와 횟수", "그립 너비", "날개뼈·어깨 보조운동"]),
          internal: { text: "통증 호는 진료실 검사에서 있으면 가능성을 약 2배 높이는 단서지만, 그것만으로 확진하진 못해요.", src: "Michener 2009, Hegedus 2012" }, evText: "운동치료가 1차 치료라는 근거는 강해요.", src: "Pieters 2020" },
    acj: { title: "팔을 끝까지 올리는 구간의 어깨 위쪽 부담", term: "쇄골 끝 관절 통증 (견봉쇄골관절)",
          plain: "어깨 위쪽, 쇄골 끝이 아픈 모습이에요. 팔을 끝까지 올렸을 때 아픈 게 특징이에요.",
          check: ["무게", "끝까지 올리는 범위"],
          say: "무게를 줄이고, 계속되면 전문가에게 확인받으세요.",
          ev: "weak", evText: "증상 특징은 영국 1차 진료 지침 요약에 나와요. 숄더 프레스와의 관계를 직접 본 연구는 없어요.", src: "KISS 요약" },
    btn: { title: "목 뒤로 내리는 바 경로", plain: "바를 목 뒤로 내리면 어깨를 바깥으로 많이 돌려야 하고, 바가 머리를 피하도록 고개를 앞으로 숙이게 돼요.",
          check: ["바를 내리는 위치(목 뒤 → 턱 앞)"],
          say: "앞으로 내리는 방식으로 바꿔 보세요.",
          ev: "mid", evText: "숙련자 33명 분석에서 남성은 어깨 회전이 자기 가동범위를 넘었고 목이 더 굽었어요. 팔을 벌리고 바깥으로 돌린 자세에서 아픈 헬스인 사례들도 보고됐어요.", src: "McKean 2015, Kolber 2010, Bonilla 2022" },
    trunk: { title: "몸통·날개뼈 고정", plain: "허리가 젖혀지거나 어깨가 솟으면서, 팔을 끝까지 올리는 부담이 어깨로 몰릴 수 있어요.",
          check: ["밀 때 허리 젖힘", "어깨 솟음", "등 가동성", "등받이 사용"],
          say: "자세와 보조운동이 도움이 될 수 있어요.",
          ev: "mid", evText: "등을 편 자세에서 어깨를 더 높이 올릴 수 있었어요. 다만 한 번 측정한 연구들이에요.", src: "Barrett 2016, McKean 2015, Kibler 2013" },
  },
  adjustments: {
    front: { title: "앞으로 내리는 프레스로 바꾸기", how: "바를 목 뒤가 아니라 턱 앞, 윗가슴 쪽으로 내리세요.",
             fact: "목 뒤로 내리면 남성은 어깨 바깥회전이 자기 가동범위를 넘었고 목이 더 굽었어요(다치지 않은 33명). 헬스 부상 고찰들도 바를 몸 앞으로 내리라고 권하지만, 근거는 사례 보고 수준이에요.", hypo: "앞으로 바꾸면 통증이 줄어든다는 걸 직접 확인한 연구는 없어요.", ev: "mid", src: "McKean 2015, Kolber 2010, Bonilla 2022" },
    grip: { title: "그립을 중간 너비로", how: "손 간격을 어깨너비의 1.4배쯤으로 잡아 보세요. 너무 넓게 잡지 마세요.",
            fact: "건강한 11명에게 1.0배·1.4배·1.7배 그립을 비교했더니, 넓은 그립은 어깨에 걸리는 회전력을 키웠고 좁은 그립은 어깨를 더 많이 벌려야 했어요. 저자들은 무거운 무게와 가동범위가 목표라면 중간이나 좁은 그립을 권했어요.", hypo: "어깨가 아픈 사람에게 1.4배가 가장 낫다는 근거는 없어요. 두 단점 사이의 중간값을 고른 앱의 가설이에요.", ev: "weak", src: "Gundersen 2026" },
    load: { title: "무게와 횟수 낮추기", how: "통증 없이 할 수 있는 무게로 해 보세요.",
            fact: "무게를 낮추는 건 어깨 통증 보존적 관리의 기본 원칙이에요.", hypo: "얼마 동안 해야 하는지는 정해 두지 않았어요. 기록을 보며 판단하세요.", ev: "mid", src: "BESS/BOA 2021" },
    brace: { title: "갈비뼈를 내리고 배에 힘주기", how: "밀 때 허리가 젖혀지지 않도록 배와 엉덩이에 힘을 주세요. 계속 젖혀진다면 등받이가 있는 벤치에서 해 보세요.",
             fact: "등받이 없이 앉아서 하는 프레스는 몸통 고정이 필요했고, 여성은 허리 움직임이 더 컸어요.", hypo: "배에 힘주기와 등받이 사용이 통증을 줄인다는 건 이 결과에서 나온 앱의 추론이에요.", ev: "weak", src: "McKean 2015" },
    tspine: { title: "등 펴기와 가동성 운동", how: "폼롤러에 윗등을 대고 뒤로 펴기, 벽에 기대 팔 올리기 연습을 해 보세요.",
              fact: "등을 편 자세에서 어깨를 더 높이 올릴 수 있었어요. 한 번 측정한 연구들이라 꾸준히 했을 때의 효과는 아직 몰라요.", hypo: "벽 팔 올리기 결과로 이 조정을 고르는 기준은 앱이 만든 것이에요.", ev: "mid", src: "Barrett 2016, Kibler 2013" },
    acc: COMMON_A.acc,
  },
  sources: [
    ["McKean 2015, 앞으로 vs 뒤로 내리는 숄더 프레스", "https://research.usc.edu.au/esploro/outputs/journalArticle/Overhead-shoulder-press--In-front-of/99448807302621"],
    SRC.bess, SRC.pieters, SRC.kibler, SRC.hickey, SRC.barrett,
    ["KISS 1차 진료 어깨 통증 요약", "https://api.nbmedical.com/file/28a1e6ed-f590-4136-9cd5-3fc1b2f04263/kiss-shoulder-pain.pdf"],
    ["Kolber 2010, 웨이트 트레이닝 관련 어깨 부상 고찰", "https://paulogentil.com/pdf/Shoulder%20Injuries%20Attributed%20to%20Resistance%20Training%20-%20A%20Brief%20Review.pdf"],
    ["Bonilla 2022, 피트니스센터 운동 선택과 부상 고찰", "https://pmc.ncbi.nlm.nih.gov/articles/PMC9565175/"],
    ["Michener 2009, 어깨 충돌 검사 5가지의 정확도", "https://doi.org/10.1016/j.apmr.2009.05.015"],
    ["Hegedus 2012, 어깨 진찰 검사 메타분석", "https://upload.orthobullets.com/journalclub/free_pdf/22773322_BrJSportsMed-2012-Hegedus-bjsports-2012-091066.pdf"],
    ["Gundersen 2026, 숄더 프레스 그립 너비와 관절 부하", "https://doi.org/10.1080/14763141.2025.2590028"]],
  sample: { where: "frontside", arc: "mid", style: "behind", ogrip: "wide", side: "yes", arch: "yes", wall: "barely", shrug: "unsure", dur: "w2to6", trend: "same", acc: "sometimes" },
  summary(a) { return [
    `아픈 곳: ${label("where", a.where)}`,
    `팔을 옆으로 들 때: ${label("arc", a.arc)}`,
    `기간·경과: ${label("dur", a.dur)}, ${label("trend", a.trend)}`,
    `프레스 방식: ${label("style", a.style)} / 그립: ${label("ogrip", a.ogrip)}`,
    `아픈 쪽으로 누우면 아픔: ${label("side", a.side)} / 허리 젖혀짐: ${label("arch", a.arch)} / 어깨 솟음: ${label("shrug", a.shrug)}`,
    `벽 팔 올리기: ${label("wall", a.wall)}`]; },
  analyse(a) {
    const sc = { rc: 0, acj: 0, btn: 0, trunk: 0 };
    if (has(a, "where", "frontside")) sc.rc += 2;
    if (has(a, "arc", "mid")) sc.rc += 3; else if (has(a, "arc", "all")) sc.rc += 1;
    if (has(a, "side", "yes")) sc.rc += 2;
    if (has(a, "where", "top")) sc.acj += 4;
    if (has(a, "arc", "top")) sc.acj += 2;
    if (has(a, "style", "behind")) sc.btn += 3;
    if (has(a, "where", "neck")) sc.btn += 2;
    if (has(a, "arch", "yes")) sc.trunk += 2; else if (has(a, "arch", "unsure")) sc.trunk += 1;
    if (has(a, "wall", "no")) sc.trunk += 2; else if (has(a, "wall", "barely")) sc.trunk += 1;
    if (has(a, "shrug", "yes")) sc.trunk += 2;
    if (has(a, "acc", "never")) sc.trunk += 1;

    const main = sc.acj > sc.rc ? "acj" : "rc";
    const other = main === "rc" ? "acj" : "rc";
    const patterns = [main];
    if (sc[other] >= 3) patterns.push(other);
    if (sc.btn >= 3) patterns.push("btn");
    if (sc.trunk >= 2) patterns.push("trunk");

    const picks = [];
    if (has(a, "style", "behind")) picks.push(["front", 1]);
    picks.push(["load", main === "acj" ? 2 : 6]);
    if (has(a, "acc", "never") || has(a, "acc", "sometimes") || has(a, "shrug", "yes")) picks.push(["acc", 3]);
    if (has(a, "arch", "yes") || has(a, "arch", "unsure")) picks.push(["brace", 4]);
    if (has(a, "wall", "barely") || has(a, "wall", "no")) picks.push(["tspine", 5]);
    if (has(a, "ogrip", "wide")) picks.push(["grip", 4.5]);
    return finish(a, sc, patterns, picks, false);
  },
  extras() {
    return [card("목 뒤로 내리는 프레스, 위험한가요?", "mid",
      "무조건 위험하진 않아요. 몸통이 안정적이고 어깨 가동범위가 충분하면 앞이나 뒤 모두 안전하다는 결론이었어요. 다만 남성은 뒤로 내릴 때 어깨 회전이 자기 가동범위를 넘었고, 고개를 앞으로 숙이게 돼서 목에 문제가 있는 사람은 주의하라고 했어요. 지금 어깨가 아프다면 앞으로 내리는 방식이 무난해요.", "McKean 2015")];
  },
};
