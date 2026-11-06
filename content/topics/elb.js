/* 컬·풀업 팔꿈치 */
TOPICS.elb = {
  meta: { version: "8.2", updated: "2026-11-06" },
  name: "컬·풀업 (팔꿈치)", brand: "팔꿈치 점검", eyebrow: "CURL · PULL-UP · ELBOW",
  hero: "컬·풀업할 때 팔꿈치가 아프다면",
  redFlags: [
    { id: "frac", q: "넘어지거나 부딪힌 뒤 팔꿈치가 붓고, 펴거나 굽히기 어렵나요?", level: 1 },
    { id: "infect", q: "열이 나고 팔꿈치가 붉고 뜨겁게 부었나요?", level: 1 },
    { id: "biceps", q: "무거운 걸 들다가 \"뚝\" 하고, 팔꿈치 앞에 멍이 들거나 알통 모양이 변하거나 손바닥을 뒤집는 힘이 약해졌나요?", level: 2 },
    { id: "ulnar", q: "넷째·다섯째 손가락이 저리거나 감각이 둔하고, 손 힘이 약해졌나요?", level: 3 },
    { id: "neck", q: "목이 아프면서 저림이 팔꿈치 아래로 내려가나요?", level: 3 },
  ],
  flagLevels: [null,
    { title: "오늘 응급실로 가세요", body: "오늘 바로 확인이 필요한 신호예요. 운동 조언으로 해결할 수 있는 상황이 아니에요." },
    { title: "며칠 안에 정형외과 진료를 받으세요", body: "힘줄이 다쳤을 때 나타나는 신호예요. 늦어지면 선택지가 줄어들 수 있어서 일찍 확인받는 게 좋아요." },
    { title: "빠른 시일 내 진료를 받으세요", body: "운동 중 부담이 아닌 다른 원인이 있는지 먼저 확인해야 하는 신호예요." }],
  flagSrc: "Alentorn-Geli 2016, Konarski 2022, Lucado 2022 (골절·감염 문항은 앱이 다른 부위 원칙을 옮긴 것)",
  questions: [
    { id: "where", q: "어디가 아픈가요?", opts: [
      ["lat", "팔꿈치 바깥쪽"], ["med", "팔꿈치 안쪽"], ["front", "팔꿈치 앞쪽 (오금)"], ["unsure", "잘 모르겠음"] ] },
    { id: "ex", q: "어떤 운동에서 아픈가요?", opts: [
      ["curl", "바벨·덤벨 컬"], ["pull", "풀업·랫풀다운"], ["both", "둘 다"], ["other", "그 밖의 운동"] ] },
    { id: "grip", q: "물건을 꽉 쥐거나 문고리를 돌릴 때도 아픈가요?", opts: [ ["yes", "예"], ["no", "아니오"] ] },
    { id: "palm", q: "최근 손바닥을 아래로 하고 무언가를 들 때(가방, 리버스 컬 등) 팔꿈치가 아팠나요?", hint: "새로 해 볼 필요는 없어요. 기억나는 대로 골라 주세요.", hypo: "이 답으로 점검할 것을 고르는 건 앱의 방식이에요.", opts: [ ["yes", "예"], ["no", "아니오"], ["unsure", "그런 동작을 안 해 봤거나 기억나지 않아요"] ] },
    { id: "onset", q: "어떻게 시작됐나요?", opts: [ ["sudden", "\"뚝\" 하며 갑자기"], ["gradual", "서서히"] ] },
    { id: "spike", q: "최근 4주 사이 무게나 횟수를 크게 늘렸나요?", hypo: "\"4주\"와 \"크게\"라는 기준은 앱이 정한 거예요.", opts: [ ["yes", "예"], ["no", "아니오"] ] },
    { id: "now", q: "아프고 나서 운동은 어떻게 하고 있나요?", opts: [
      ["rest", "쉬고 있어요"], ["light", "가볍게 계속하고 있어요"], ["same", "원래대로 하고 있어요"] ] },
    COMMON_Q.dur, COMMON_Q.trend,
  ],
  patterns: {
    lat: { title: "손등을 위로 하고 들거나 쥐는 동작의 팔꿈치 바깥쪽 부담", term: "팔꿈치 바깥쪽 힘줄 통증 (외측 상과병증, 테니스 엘보)",
             plain: "손목을 펴는 근육의 힘줄이 팔꿈치 바깥쪽 뼈에 붙는 곳이 부담을 받을 때 보이는 모습이에요.",
             check: ["손바닥을 아래로 드는 운동(리버스 컬 등)", "그립을 꽉 쥐는 정도", "컬·풀업 무게와 횟수"],
             say: "부하를 맞추며 운동을 이어가는 게 중심이에요. 다만 오래 갈 수 있어요.",
           ev: "mid", internal: { text: "바깥쪽 뼈 부위 통증이 누르기, 손목·손가락 펴기 저항에서 재현되는 것으로 진단해요.", src: "Lucado 2022" }, evText: "최대 55%는 2년 넘게 통증이 남았어요.", src: "Lucado 2022" },
    med: { title: "손목을 굽히고 쥐는 동작의 팔꿈치 안쪽 부담", term: "팔꿈치 안쪽 힘줄 통증 (내측 상과병증, 골프 엘보)",
         plain: "손목을 굽히는 근육의 힘줄이 팔꿈치 안쪽 뼈에 붙는 곳이 부담을 받을 때 보이는 모습이에요.",
         check: ["그립을 꽉 쥐는 정도", "컬·풀업 무게와 횟수"],
           say: "부하를 줄이고 천천히 다시 늘려 보세요.",
           ev: "weak", internal: { text: "바깥쪽보다 7~10배 드물고, 손목 굽힘·아래팔 안쪽 돌리기 저항이 가장 민감한 검사예요.", src: "Konarski 2022" }, evText: "70%는 서서히 시작돼요(서술적 리뷰).", src: "Konarski 2022" },
    front: { referOnly: true, title: "팔꿈치 앞쪽 통증 → 진료 먼저", term: "이두근 원위힘줄 문제 가능성",
           plain: "팔꿈치 앞쪽 통증은 원인을 조사하지 못했고, 갑자기 생겼다면 운동 조정으로 다룰 상황이 아닐 수 있어요.",
           check: [],
             say: "운동 조정보다 진료를 먼저 받아 보세요.",
             ev: "weak", internal: { text: "이두근 원위힘줄 파열은 팔꿈치 앞 통증, 멍, 알통 모양 변화, 손바닥 뒤집기 약화로 나타나요.", src: "Alentorn-Geli 2016" }, evText: "", src: "Alentorn-Geli 2016",
             hypo: "앞쪽 통증의 흔한 원인은 이번에 조사하지 못해서, 진료를 먼저 권하는 건 앱의 보수적인 선택이에요." },
  },
  adjustments: {
    wext: { title: "손목 펴기 저항 운동", how: "가벼운 덤벨을 들고 손등을 위로 한 채 손목을 펴서 버티기 → 천천히 올리기 → 3초 동안 천천히 내리기 순서로 해 보세요.",
            fact: "진료 지침은 진찰로 팔꿈치 바깥쪽 힘줄 통증이 확인된 사람에게 손목 펴기 저항 운동(버티기·들기·내리기)을 권고해요(등급 B).", hypo: "운동 순서와 횟수 예시는 앱이 고른 거예요.", ev: "mid", src: "Lucado 2022" },
    wflex: { title: "손목 굽히기 저항 운동", how: "가벼운 덤벨을 들고 손바닥을 위로 한 채 손목을 굽혀 버티기 → 천천히 올리기 → 천천히 내리기로 해 보세요.",
             fact: "진료 지침은 진찰로 팔꿈치 바깥쪽 힘줄 통증이 확인된 사람에게 저항 운동을 권고해요(등급 B).", hypo: "안쪽 통증에 같은 원리를 쓴 건 앱의 추론이에요. 안쪽 전용 연구는 이번에 찾지 못했어요.", ev: "weak", src: "Lucado 2022" },
    ramp: { title: "컬·풀업 부하를 낮춰 단계적으로 늘리기", how: "아프지 않은 무게로 낮추고, 통증이 늘지 않을 때만 조금씩 늘리세요.",
            fact: "부하를 단계적으로 다시 넣기를 권해요(등급 F, 전문가 의견).", hypo: "줄이는 정도와 기간은 정해 두지 않았어요.", ev: "weak", src: "Lucado 2022" },
    strap: { title: "아플 때 팔꿈치 밴드 차기", how: "팔꿈치 바로 아래 아래팔에 밴드를 감고, 아픈 운동을 할 때만 차세요.",
             fact: "아픈 동작 때 차면 즉시 통증이 줄 수 있어요(등급 F). 몇 주 이상 차는 효과는 권고할 근거가 없어요(등급 D).", hypo: "안쪽 통증에 대한 근거는 없어요.", ev: "weak", src: "Lucado 2022" },
  },
  sources: [
    ["Lucado 2022, 팔꿈치 바깥쪽 힘줄 통증 진료 지침 (JOSPT)", "https://www.orthopt.org/uploads/content_files/files/jospt.2022.0302.pdf"],
    ["Konarski 2022, 팔꿈치 안쪽 통증 감별 진단 리뷰", "https://rcastoragev2.blob.core.windows.net/52b7d0b21ff50062bf7562cd326c0fb1/PMC9407887.pdf"],
    ["Alentorn-Geli 2016, 이두근 원위힘줄 손상 리뷰", "https://pmc.ncbi.nlm.nih.gov/articles/PMC5367534"]],
  sample: { where: "lat", ex: "curl", grip: "yes", palm: "yes", onset: "gradual", spike: "yes", now: "same", dur: "w2to6", trend: "same" },
  summary(a) { return [
    `아픈 곳: ${label("where", a.where)} / 운동: ${label("ex", a.ex)}`,
    `쥘 때 통증: ${label("grip", a.grip)} / 손바닥 아래로 들 때 통증: ${label("palm", a.palm)}`,
    `시작: ${label("onset", a.onset)} / 최근 4주 급증: ${label("spike", a.spike)} / 통증 후 운동: ${label("now", a.now)}`,
    `기간·경과: ${label("dur", a.dur)}, ${label("trend", a.trend)}`]; },
  analyse(a) {
    const sc = { lat: 0, med: 0, front: 0 };
    if (has(a, "where", "lat")) sc.lat += 3;
    if (has(a, "palm", "yes")) sc.lat += 2;
    if (has(a, "grip", "yes")) { sc.lat += 1; sc.med += 1; }
    if (has(a, "where", "med")) sc.med += 3;
    if (has(a, "where", "front")) sc.front += 3;
    if (has(a, "onset", "sudden")) sc.front += 1;
    let patterns;
    if (sc.front >= 3) patterns = ["front"];
    else patterns = [sc.med > sc.lat ? "med" : "lat"];
    const main = patterns[0];
    const picks = [];
    if (main === "lat") { picks.push(["wext", 1]); picks.push(["strap", 4]); }
    if (main === "med") picks.push(["wflex", 1]);
    if (main !== "front") picks.push(["ramp", has(a, "spike", "yes") || has(a, "now", "same") ? 2 : 3]);
    const r = finish(a, sc, patterns, picks, false);
    if (main === "front") { r.referFirst = true; r.referKnee = false; r.referElbow = true; }
    return r;
  },
  extras() {
    return [card("팔꿈치 바깥쪽이 아픈 게 오래 갈 수 있나요?", "mid",
      "오래 갈 수 있어요. 진찰로 팔꿈치 바깥쪽 힘줄 통증이 확인된 사람 중 최대 55%가 2년 넘게 통증과 불편이 남았고, 반복적으로 손을 쓰는 일을 하면 6개월 결과가 더 나빴어요. 그래서 완전히 쉬기보다 부하를 맞추며 운동을 이어가는 게 중심이에요.", "Lucado 2022")];
  },
};
