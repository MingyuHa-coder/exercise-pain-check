/* 딥스·벤치·푸시업 손목 */
TOPICS.wri = {
  meta: { version: "7", updated: "2026-11-06" },
  name: "딥스·벤치·푸시업 (손목)", brand: "손목 점검", eyebrow: "DIPS · BENCH · WRIST",
  hero: "딥스·벤치·푸시업에서 손목이 아프다면",
  redFlags: [
    { id: "scaph", q: "넘어지며 손을 짚은 뒤 엄지 쪽 손목이 붓거나 눌렀을 때 아픈가요?", level: 1 },
    { id: "infect", q: "열이 나고 손목이 붉고 뜨겁게 부었나요?", level: 1 },
    { id: "click", q: "다친 뒤 손목에 힘을 주면 \"딸깍\" 소리나 걸리는 느낌이 나며 아픈가요?", level: 2 },
    { id: "nerve", q: "손가락이 저리거나 감각이 둔해졌나요?", level: 3 },
    { id: "systemic", q: "이유 없이 붓고 계속 아프거나, 다른 관절도 같이 아픈가요?", level: 3 },
  ],
  flagLevels: [null,
    { title: "오늘 진료를 받으세요", body: "오늘 바로 확인이 필요한 신호예요. 처음 엑스레이에서 안 보이는 손목 부상도 있어서, 의심되면 진료에서 다시 확인해요." },
    { title: "며칠 안에 정형외과 진료를 받으세요", body: "손목을 지지하는 구조물이 다쳤을 때 나타나는 신호예요. 운동으로 버티기보다 먼저 확인받으세요." },
    { title: "빠른 시일 내 진료를 받으세요", body: "운동 중 부담이 아닌 다른 원인이 있는지 먼저 확인해야 하는 신호예요." }],
  flagSrc: "Shehab 2013 (미국 가정의학회 손목 통증 평가), Hanson & Lourie 2022",
  questions: [
    { id: "where", q: "어디가 아픈가요?", opts: [
      ["dorsal", "손등 쪽 가운데"], ["ulnar", "새끼손가락 쪽"], ["radial", "엄지 쪽"], ["volar", "손바닥 쪽"] ] },
    { id: "ex", q: "어떤 운동에서 아픈가요?", opts: [
      ["dips", "딥스"], ["press", "벤치·프레스"], ["push", "푸시업·플랭크"], ["other", "그 밖의 운동"] ] },
    { id: "ext", q: "손목을 뒤로 꺾은 채 체중이나 무게를 실을 때 아픈가요?", opts: [ ["yes", "예"], ["no", "아니오"] ] },
    { id: "spike", q: "최근 4주 사이 무게나 횟수를 크게 늘렸나요?", hypo: "\"4주\"와 \"크게\"라는 기준은 앱이 정한 거예요.", opts: [ ["yes", "예"], ["no", "아니오"] ] },
    { id: "now", q: "아프고 나서 운동은 어떻게 하고 있나요?", opts: [
      ["rest", "쉬고 있어요"], ["light", "가볍게 계속하고 있어요"], ["same", "원래대로 하고 있어요"] ] },
    COMMON_Q.dur, COMMON_Q.trend,
  ],
  patterns: {
    dorsal: { title: "손목을 뒤로 꺾은 채 체중을 싣는 자세", term: "손목 등쪽 통증 (등쪽 관절막 충돌 등)",
            plain: "손목을 뒤로 꺾은 채 체중이나 무게를 실을 때 손등 쪽이 눌릴 수 있어요.",
            check: ["벤치에서 바가 놓이는 위치", "푸시업 손 모양(손잡이·주먹)", "딥스 그립", "딥스·푸시업 양"],
              say: "손목을 덜 꺾고 부하를 줄여 보세요.",
              ev: "weak", evText: "손등 가운데 통증은 생각보다 흔하고 웨이트에서도 생겨요. 관절막 충돌은 대부분 2~3개월 쉬면 나아지지만 다시 하면 재발할 수 있어요(선수 대상 서술적 리뷰).", src: "Hanson & Lourie 2022",
              hypo: "헬스인 손목 통증을 직접 다룬 연구는 찾지 못했어요. 선수 리뷰를 옮겨 온 거예요." },
    side: { title: "손목 옆쪽·손바닥 쪽 통증 → 진료 먼저", term: "TFCC·힘줄·신경 문제 가능성",
          plain: "새끼손가락 쪽·엄지 쪽·손바닥 쪽 통증은 스스로 확인할 수 없는 원인이 있을 수 있어요.",
          check: [],
            say: "운동 조정보다 진료를 먼저 받아 보세요.",
            ev: "weak", evText: "엄지 쪽은 힘줄염, 새끼손가락 쪽 저림은 척골신경 문제를 의심해요. 새끼손가락 쪽 연골(TFCC)·힘줄 문제는 진찰로 불안정성을 확인해야 하고, 불안정하지 않으면 보조기·테이핑·활동 조정이 1차 치료예요(선수 대상 리뷰).", src: "Shehab 2013, Pang & Yao 2017",
            hypo: "불안정성은 스스로 확인할 수 없어서 진료를 먼저 권하는 건 앱의 보수적인 선택이에요." },
  },
  adjustments: {
    neutral: { title: "손목을 덜 꺾기", how: "벤치에서는 바를 손바닥 아래쪽(손목 바로 위)에 두고, 푸시업은 푸시업 손잡이나 주먹을 쥐고 해 보세요. 딥스는 손목이 뒤로 꺾이지 않게 바를 잡으세요.",
               fact: "손목에 압박과 체중이 실리는 동작을 피하는 것이 첫 치료로 쓰여요(체조 선수 손목).", hypo: "여기 적은 구체적인 방법은 모두 앱의 제안이고 연구되지 않았어요.", ev: "weak", src: "Hanson & Lourie 2022" },
    reduce: { title: "딥스·푸시업 쉬거나 줄이기", how: "아픈 운동은 2주 정도 줄이거나 쉬고, 손목을 쓰지 않는 운동(머신 등)으로 대신하세요.",
              fact: "손목 등쪽 관절막 충돌은 2~3개월 휴식·고정·소염제로 대부분 나아졌지만, 다시 높은 강도로 하면 재발할 수 있었어요.", hypo: "고수준 선수 리뷰를 헬스인에게 옮긴 거예요. \"2주\"는 앱이 정한 값이에요.", ev: "weak", src: "Hanson & Lourie 2022" },
  },
  sources: [
    ["Shehab 2013, 손목 통증 평가 (AFP)", "https://www.aafp.org/pubs/afp/issues/2013/0415/p568.html"],
    ["Hanson & Lourie 2022, 선수의 손등 가운데 통증 리뷰", "https://rcastoragev2.blob.core.windows.net/12fd6379e0f04b0b64c1f95366fcbd3c/PMC9036339.pdf"],
    ["Pang & Yao 2017, 선수의 새끼손가락 쪽 손목 통증 리뷰", "https://doi.org/10.1007/s12178-017-9384-9"]],
  sample: { where: "dorsal", ex: "push", ext: "yes", spike: "no", now: "same", dur: "w2to6", trend: "same" },
  summary(a) { return [
    `아픈 곳: ${label("where", a.where)} / 운동: ${label("ex", a.ex)}`,
    `손목 꺾고 체중 실을 때 통증: ${label("ext", a.ext)}`,
    `최근 4주 급증: ${label("spike", a.spike)} / 통증 후 운동: ${label("now", a.now)}`,
    `기간·경과: ${label("dur", a.dur)}, ${label("trend", a.trend)}`]; },
  analyse(a) {
    const side = !has(a, "where", "dorsal");
    const patterns = side ? ["side"] : ["dorsal"];
    const picks = side ? [] : [["neutral", 1], ["reduce", has(a, "now", "same") || has(a, "spike", "yes") ? 1.5 : 2]];
    const r = finish(a, { side: side ? 1 : 0 }, patterns, picks, false);
    if (side) { r.referFirst = true; r.referWrist = true; }
    return r;
  },
  extras() {
    return [card("손목 보호대(랩)를 차면 나을까요?", "weak",
      "헬스할 때 차는 손목 랩이 통증을 줄이는지 직접 본 연구는 없었어요. 손목 옆쪽이 아프다면 랩보다 진료로 원인을 먼저 확인하세요.", "Pang & Yao 2017, Hanson & Lourie 2022", null,
      "선수 대상 리뷰에서, 새끼손가락 쪽 연골(TFCC) 손상의 진료에는 보조기·테이핑이 포함되고 한 연구에서는 4주 고정 뒤 57%가 좋아졌다고 해요. 인대를 다친 선수가 보호 보조기를 차고 복귀하는 경우도 언급돼요. 진료에서 다루는 내용이고, 헬스용 랩에 그대로 옮길 수는 없어요.")];
  },
};
