/* 데드리프트 허리 */
TOPICS.dl = {
  meta: { version: "7", updated: "2026-11-06" },
  name: "데드리프트", brand: "데드리프트 허리 점검", eyebrow: "DEADLIFT · LOW BACK",
  hero: "데드리프트할 때 허리가 아프다면",
  redFlags: [
    { id: "ces", q: "사타구니나 항문 주변 감각이 무뎌졌거나, 소변·대변을 참기 어렵거나 보기 어렵게 변했나요?", level: 0 },
    { id: "weak", q: "다리나 발에 힘이 점점 빠지거나(발이 끌림), 다리 통증이 한쪽에서 양쪽으로 번졌나요?", level: 0 },
    { id: "frac", q: "높은 곳에서 떨어지거나 사고를 당했나요? 또는 골다공증이 있거나 스테로이드를 3개월 넘게 쓰고 있나요?", level: 1 },
    { id: "infect", q: "열이 나거나 온몸이 아프고, 면역이 떨어지는 병이나 주사 약물 사용이 있나요?", level: 1 },
    { id: "cancer", q: "암을 앓은 적이 있거나, 이유 없이 살이 빠지거나, 쉬어도 밤새 계속 점점 심하게 아픈가요?", level: 3 },
    { id: "radic", q: "다리가 저리거나 감각이 둔하고, 통증이 무릎 아래로 내려가나요?", level: 3 },
  ],
  flagLevels: [
    { title: "지금 바로 응급실로 가세요", body: "허리 아래 신경이 심하게 눌릴 때 나타나는 신호예요. 바로 검사가 필요한 상황이에요. 기다리지 마세요." },
    { title: "오늘 응급실로 가세요", body: "오늘 바로 확인이 필요한 신호예요. 운동 조언으로 해결할 수 있는 상황이 아니에요." },
    null,
    { title: "빠른 시일 내 진료를 받으세요", body: "운동 중 부담이 아닌 다른 원인이 있는지 먼저 확인해야 하는 신호예요." },
  ],
  flagSrc: "Finucane 2020 척추 위험 신호 국제 프레임워크",
  questions: [
    { id: "where", q: "어디가 아픈가요?", opts: [
      ["center", "허리 가운데나 양옆"], ["buttock", "한쪽 엉덩이"], ["unsure", "잘 모르겠음"] ] },
    { id: "leg", q: "다리로 통증이나 저림이 내려가나요?", opts: [
      ["none", "내려가지 않아요"], ["thigh", "엉덩이나 허벅지까지"], ["below", "무릎 아래나 발까지"] ] },
    { id: "onset", q: "어떻게 시작됐나요?", opts: [
      ["sudden", "들다가 갑자기 \"삐끗\"했어요"], ["gradual", "서서히 아파졌어요"] ] },
    { id: "when", q: "언제 가장 아픈가요?", opts: [
      ["lift", "바닥에서 들어올릴 때"], ["lower", "바를 내릴 때"], ["after", "운동 후나 다음 날"], ["daily", "운동 안 할 때, 일상에서도"] ] },
    { id: "style", q: "어떤 데드리프트를 주로 하나요?", opts: [
      ["conv", "컨벤셔널 (발을 골반 너비로)"], ["sumo", "스모 (발을 넓게)"], ["rdl", "루마니안 (무릎을 거의 펴고)"], ["trap", "트랩바 (육각 바)"] ] },
    { id: "freq", q: "일주일에 데드리프트를 몇 번 하나요?", opts: [
      ["one", "1번 이하"], ["two", "2번"], ["three", "3번 이상"] ] },
    { id: "spike", q: "최근 4주 사이 무게나 횟수를 크게 늘렸나요?", hypo: "\"4주\"와 \"크게\"라는 기준은 앱이 정한 거예요. 얼마나 늘리면 위험한지는 이번에 본 연구에 없어요.", opts: [
      ["yes", "예"], ["no", "아니오"] ] },
    { id: "now", q: "아프고 나서 데드리프트는 어떻게 하고 있나요?", opts: [
      ["rest", "아예 쉬고 있어요"], ["light", "가볍게 계속하고 있어요"], ["same", "원래대로 하고 있어요"] ] },
    COMMON_Q.dur, COMMON_Q.trend,
  ],
  patterns: {
    nsp: { title: "허리에 걸리는 전체 운동 부하", term: "비특이적 허리 통증",
           plain: "운동하다 생긴 허리 통증은 대부분 특정 구조물 하나를 짚기 어렵고, 근육이나 관절이 감당할 수 있는 양보다 많은 부하를 받은 경우가 많아요.",
           check: ["무게와 횟수", "주당 빈도", "쉬는 대신 가볍게 이어가는 방식", "운동 종류(바 종류 등)"],
           say: "대부분 몇 주 안에 많이 좋아져요. 아래 조정부터 해 보세요.",
           ev: "strong", evText: "갑자기 생긴 허리 통증은 통증 점수가 6주 만에 절반 넘게 줄었고, 1년에는 대부분 낮은 수준이었어요(33개 코호트 메타분석). 다만 3개월 넘게 이어진 통증은 1년 뒤에도 중간 정도가 남았어요.", src: "da C Menezes Costa 2012" },
    nerve: { title: "다리로 내려가는 증상 → 진료 먼저", term: "신경 뿌리 자극 (좌골신경통)",
             plain: "통증이나 저림이 다리, 특히 무릎 아래로 내려가면 운동 부하만의 문제가 아닐 수 있어요.",
             check: [],
             say: "운동 조정보다 진료를 먼저 받아 보세요.",
             ev: "mid", evText: "다리로 번지는 통증과 감각 변화는 신경 증상의 단서이고, 새로 생긴 근력 약화나 양쪽으로 번지는 통증은 응급 신호예요.", src: "Finucane 2020",
             hypo: "\"무릎 아래까지\"를 기준으로 진료를 먼저 권하는 건 앱의 보수적인 선택이에요." },
    load: { title: "최근 훈련량 급증", plain: "최근 무게나 횟수를 갑자기 늘렸거나 자주 하면서, 허리가 회복할 시간이 부족했을 수 있어요.",
            check: ["최근 4주 사이 무게·횟수 변화", "주당 운동 횟수"],
            say: "부하부터 조절해 보세요.",
            ev: "weak", evText: "파워리프터 104명 중 허리·골반 부상의 52%가 데드리프트 훈련 중 시작됐고, 본인이 꼽은 원인은 과도한 훈련량·강도가 23%로 가장 많았어요. 설문 연구라 원인이라고 단정할 순 없어요.", src: "Strömbäck 2018" },
  },
  adjustments: {
    load: { title: "무게와 횟수 낮추기", how: "통증이 늘지 않는 무게로, 데드리프트는 주 1~2번으로 줄여 2주 동안 해 보세요.",
            fact: "허리를 다친 파워리프터 대부분은 훈련을 멈추지 않고 훈련량·강도를 줄이거나 종목을 바꿔 이어갔어요.", hypo: "\"주 1~2번\"과 \"2주\"는 앱이 정한 값이에요. 부하를 줄이면 통증이 줄어드는지는 설문 연구로 알 수 없어요.", ev: "weak", src: "Strömbäck 2018" },
    ramp: { title: "끊지 말고 가볍게 다시 늘리기", how: "빈 바나 아주 가벼운 무게로 시작해서, 하고 난 뒤 통증이 늘지 않을 때만 다음에 무게를 조금 더하세요.",
            fact: "만성 허리 통증 70명 RCT에서 10kg부터 통증에 맞춰 올린 데드리프트 8주(12회)는 저부하 운동과 비슷하게 통증을 줄였고, 24개월까지 차이가 없었어요. 가이드라인도 평소 활동을 이어가길 권해요.", hypo: "연구는 물리치료사가 지도했고 아무것도 안 한 대조군이 없었어요. 혼자 해도 같은 효과인지는 몰라요.", ev: "mid", src: "Michaelson 2016, NICE NG59" },
    trap: { title: "트랩바 데드리프트로 바꾸기", how: "육각형 트랩바 안에 서서 들면 바가 몸 가운데로 와요. 같은 무게보다 가볍게 시작하세요.",
            fact: "건강한 남성 20명에서 트랩바 데드리프트는 일반 바보다 척추기립근 활성도가 낮았어요(체계적 고찰에 정리된 연구).", hypo: "허리 근육이 덜 일한다고 통증이 줄어드는지는 확인되지 않았어요. 원래 논문은 직접 읽지 못했어요.", ev: "weak", src: "Martín-Fuentes 2020" },
    move: { title: "다른 운동으로 계속 움직이기", how: "데드리프트를 쉬는 동안 걷기, 자전거, 아프지 않은 상체 운동처럼 몸을 계속 움직이세요.",
            fact: "허리 통증에는 평소 활동을 이어가도록 격려하고 운동 프로그램을 권해요.", hypo: "여기 적은 운동은 앱이 고른 예시예요.", ev: "mid", src: "NICE NG59" },
  },
  sources: [
    ["Finucane 2020, 척추 위험 신호 국제 프레임워크", "https://core.ac.uk/download/387934007.pdf"],
    ["NICE NG59, 허리 통증·좌골신경통 가이드라인", "https://www.nice.org.uk/guidance/ng59/chapter/Recommendation"],
    ["da C Menezes Costa 2012, 허리 통증의 경과 메타분석", "https://pmc.ncbi.nlm.nih.gov/articles/PMC3414626/"],
    ["Michaelson 2016, 데드리프트 훈련 vs 저부하 운동 RCT", "https://medicaljournals.se/jrm/content/html/10.2340/16501977-2091"],
    ["Strömbäck 2018, 파워리프팅 부상 단면 연구", "https://pmc.ncbi.nlm.nih.gov/articles/PMC5954586/"],
    ["Saraceni 2020, 들기 중 허리 굽힘과 허리 통증", "https://doi.org/10.2519/jospt.2020.9218"],
    ["Martín-Fuentes 2020, 데드리프트 변형별 근활성도", "https://pmc.ncbi.nlm.nih.gov/articles/PMC7046193/"],
    ["Tampier 2007, 반복 굽힘과 디스크 탈출 (돼지 척추 실험)", "https://www.backfitpro.com/medical-scientific-articles/2007/[104]Tampier,C.(2007)Progressive-disc-herniation[Spine].pdf"],
    ["HSE, 영국 산업안전청 들기 지침", "https://hse.gov.uk/msd/manual-handling/good-handling-technique.htm"],
    ["Coenen 2014, 작업 중 들기와 허리 통증 메타분석", "https://research.vu.nl/ws/files/42834184/Coenen_OEM_2014b.pdf"]],
  sample: { where: "center", leg: "none", onset: "gradual", when: "lift", style: "conv", freq: "three", spike: "yes", now: "rest", dur: "lt2", trend: "same" },
  summary(a) { return [
    `아픈 곳: ${label("where", a.where)} / 다리 증상: ${label("leg", a.leg)}`,
    `시작: ${label("onset", a.onset)} / 아플 때: ${label("when", a.when)}`,
    `기간·경과: ${label("dur", a.dur)}, ${label("trend", a.trend)}`,
    `데드리프트: ${label("style", a.style)}, 주 ${label("freq", a.freq)}, 최근 4주 급증: ${label("spike", a.spike)}`,
    `통증 후 데드리프트: ${label("now", a.now)}`]; },
  analyse(a) {
    const sc = { nerve: 0, load: 0 };
    if (has(a, "leg", "below")) sc.nerve += 4; else if (has(a, "leg", "thigh")) sc.nerve += 1;
    if (has(a, "where", "buttock")) sc.nerve += 1;
    if (has(a, "spike", "yes")) sc.load += 3;
    if (has(a, "freq", "three")) sc.load += 2; else if (has(a, "freq", "two")) sc.load += 1;
    const patterns = sc.nerve >= 4 ? ["nerve", "nsp"] : ["nsp"];
    if (sc.load >= 3) patterns.push("load");

    const picks = [];
    if (sc.load >= 2) picks.push(["load", 1]);
    if (has(a, "now", "rest") || has(a, "now", "light")) picks.push(["ramp", 2]);
    if (has(a, "now", "same") && sc.load < 2) picks.push(["load", 3]);
    if ((has(a, "style", "conv") || has(a, "style", "rdl")) && has(a, "when", "lift")) picks.push(["trap", 4]);
    if (has(a, "now", "rest") && !has(a, "when", "daily")) picks.push(["move", 5]);
    if (!picks.length) picks.push(["ramp", 2]);
    return finish(a, sc, patterns, picks, has(a, "when", "daily"), has(a, "leg", "below"));
  },
  extras() {
    return [
      card("허리를 굽히면 다치나요?", "weak",
        "양쪽 근거가 다 있어요. 실험실에서 돼지 척추 디스크에 압박을 주며 굽혔다 펴기를 수천 번 반복하자 디스크가 조금씩 밀려나 16개 중 8개가 완전히 탈출했어요. 영국 산업안전청도 들 때 허리를 크게 굽히지 말고, 드는 도중 더 굽히지 말라고 권해요. 사람을 직접 본 연구들은 12kg 이하의 가벼운 물건을 드는 작업만 다뤄서, 무거운 데드리프트에 그대로 옮기기 어려워요. 무거운 데드리프트에서 허리를 굽히는 것이 부상 원인인지는 아직 연구로 확인되지 않았어요. 분명한 건 드는 무게와 횟수가 많을수록 허리 통증 위험이 늘었다는 점이에요.", "Tampier 2007, HSE 들기 지침, Saraceni 2020, Coenen 2014", "dl.card.bend"),
      card("허리 보호대를 차면 나을까요?", "mid",
        "허리 통증 치료 목적의 벨트나 코르셋은 영국 가이드라인이 권하지 않아요. 운동할 때 차는 리프팅 벨트가 통증에 어떤 영향을 주는지는 이번에 본 자료에 없어요.", "NICE NG59")];
  },
};
