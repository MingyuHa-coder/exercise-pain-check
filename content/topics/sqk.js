/* 스쿼트·런지·레그프레스 무릎 */
TOPICS.sqk = {
  meta: { version: "8", updated: "2026-11-06" },
  name: "스쿼트·런지·레그프레스 (무릎)", brand: "하체 운동 무릎 점검", eyebrow: "SQUAT · LUNGE · KNEE",
  hero: "스쿼트·런지·레그프레스에서 무릎이 아프다면",
  redFlags: [
    { id: "frac", q: "다친 뒤 바로, 또는 지금 네 걸음 넘게 걷거나 체중을 싣기 어렵나요?", level: 1 },
    { id: "infect", q: "열이 나고, 무릎이 붉고 뜨겁게 부었나요?", level: 1 },
    { id: "lig", q: "다칠 때 \"뚝\" 소리나 느낌이 있었고, 몇 시간 안에 무릎이 붓거나 빠지는 느낌이 드나요?", level: 2 },
    { id: "lock", q: "무릎이 걸려서 끝까지 펴지지 않는 때가 있나요?", level: 2 },
    { id: "night", q: "운동과 관계없이 쉬어도, 밤에도 아픈가요?", level: 3 },
  ],
  flagLevels: [null,
    { title: "오늘 응급실로 가세요", body: "오늘 바로 확인이 필요한 신호예요. 운동 조언으로 해결할 수 있는 상황이 아니에요." },
    { title: "며칠 안에 정형외과 진료를 받으세요", body: "무릎 안쪽 구조물이 다쳤을 때 나타나는 신호예요. 일찍 확인받을수록 선택지가 많아요." },
    { title: "빠른 시일 내 진료를 받으세요", body: "운동 때문이 아닌 다른 원인이 있는지 먼저 확인해야 하는 신호예요." }],
  flagSrc: "Bunt 2018 (미국 가정의학회 무릎 통증 평가)",
  questions: [
    { id: "where", q: "어디가 아픈가요?", opts: [
      ["patella", "무릎뼈 주변이나 뒤쪽"], ["below", "무릎뼈 바로 아래"], ["side", "무릎 안쪽이나 바깥쪽"], ["unsure", "잘 모르겠음"] ] },
    { id: "when", q: "언제 가장 아픈가요?", opts: [
      ["down", "앉는 중이나 가장 깊이 앉았을 때"], ["up", "일어설 때"], ["after", "운동 후나 다음 날"], ["daily", "운동 안 할 때, 일상에서도"] ] },
    { id: "depth", q: "운동할 때 무릎을 얼마나 굽히나요?", hint: "스쿼트라면 앉는 깊이, 레그프레스라면 무게를 내렸을 때를 떠올려 보세요.", opts: [
      ["above", "허벅지가 바닥과 평행보다 위"], ["parallel", "평행쯤"], ["deep", "평행보다 깊게"] ] },
    { id: "sit", q: "오래 앉아 있다 일어날 때나 계단에서 무릎 앞이 아픈가요?", opts: [
      ["yes", "예"], ["no", "아니오"] ] },
    { id: "warm", q: "운동 시작할 때 아프다가 몸이 풀리면 덜해지나요?", opts: [
      ["yes", "예"], ["no", "아니오"] ] },
    { id: "style", q: "어떤 운동에서 가장 아픈가요?", opts: [
      ["back", "바벨 백 스쿼트"], ["front", "프런트·고블릿 스쿼트"], ["machine", "레그프레스·핵 스쿼트"], ["lunge", "런지"], ["body", "맨몸 스쿼트"] ] },
    { id: "spike", q: "최근 4주 사이 스쿼트나 점프·달리기를 크게 늘렸나요?", hypo: "\"4주\"와 \"크게\"라는 기준은 앱이 정한 거예요.", opts: [
      ["yes", "예"], ["no", "아니오"] ] },
    { id: "swell", q: "운동 후 무릎이 붓나요?", opts: [
      ["yes", "예"], ["no", "아니오"] ] },
    COMMON_Q.dur, COMMON_Q.trend,
  ],
  patterns: {
    pfp: { title: "무릎을 깊이 굽혀 체중을 싣는 구간의 무릎 앞 부담", term: "슬개대퇴 통증",
             plain: "무릎을 굽힌 채 체중을 실을수록 무릎뼈 뒤쪽에 걸리는 힘이 커져요. 스쿼트·계단·오래 앉았다 일어날 때 무릎 앞이 아픈 흔한 모습이에요.",
             check: ["앉는 깊이", "런지 범위와 순서", "상체 기울기(엉덩이 위주 vs 무릎 위주)", "엉덩이·무릎 근력 운동"],
             say: "깊이와 동작을 조정하고 엉덩이·무릎 근력 운동을 함께 해 보세요.",
           ev: "mid", internal: { text: "무릎뼈 주변 통증이 무릎을 굽혀 체중을 싣는 동작에서 심해지는 게 핵심 기준이고, 스쿼트할 때 무릎 앞이 아픈 사람의 80%가 이 진단이었어요.", src: "Crossley 2016" }, evText: "여러 해 이어지기도 해요.", src: "Crossley 2016" },
    pt: { title: "점프·스쿼트 양에 따른 무릎뼈 아래 부담", term: "무릎힘줄 통증",
        plain: "무릎뼈 바로 아래 힘줄이 감당할 수 있는 것보다 많은 부하를 받았을 때 보이는 모습이에요. 훈련량이 갑자기 늘었을 때 생기기 쉬워요.",
        check: ["최근 4주 스쿼트·점프·달리기 양", "운동 중·다음 날 통증 점수", "버티기 운동으로 시작하기"],
          say: "힘줄이 감당할 수 있게 부하를 맞춰 보세요.",
          ev: "mid", evText: "힘줄 부위에 국한된 통증이 부하와 빈도가 늘면서 서서히 생기고, 초기에는 운동 시작 때 아프다 풀려요. 훈련량이 많을수록 관련이 있었어요. 회복에 몇 달 걸리기도 해요.", src: "Rosen 2022" },
    side: { title: "무릎 안·바깥쪽 통증이나 붓기 → 진료 먼저", term: "반월상연골·인대 문제 가능성",
          plain: "무릎 안쪽이나 바깥쪽 통증, 운동 후 붓기는 운동 부하만의 문제가 아닐 수 있어요.",
          check: [],
            say: "운동 조정보다 진료를 먼저 받아 보세요.",
            ev: "weak", internal: { text: "다친 뒤 하루 이틀 안에 부으면 반월상연골, 걸려서 안 펴지면 반월상연골 파열을 의심해요.", src: "Bunt 2018" }, evText: "", src: "Bunt 2018",
            hypo: "이번 자료에 스쿼트 중 안·바깥쪽 통증을 다룬 근거가 없어서, 진료를 먼저 권하는 건 앱의 보수적인 선택이에요." },
  },
  adjustments: {
    hipknee: { title: "엉덩이·무릎 근력 운동 함께 하기", how: "옆으로 누워 다리 들기, 밴드 걷기 같은 엉덩이 운동과 레그 익스텐션 같은 무릎 운동을 함께 해 보세요.",
               fact: "슬개대퇴 통증에 운동치료는 단기·중기·장기 통증을 줄였고, 엉덩이와 무릎 운동을 함께 하는 게 무릎 운동만 하는 것보다 나았어요(체계적 고찰 22편 바탕 합의문).", hypo: "여기 적은 운동은 앱이 고른 예시예요.", ev: "strong", src: "Crossley 2016" },
    depth: { title: "아프지 않은 깊이까지만 앉기", how: "아프기 시작하는 깊이 바로 위까지만 앉으세요. 평행보다 깊게 앉았다면 평행 위로 줄여 보세요.",
             fact: "슬개대퇴 관절에 걸리는 스트레스는 무릎 0°에서 90°까지 계속 늘었고, 스쿼트·레그프레스는 85~95°에서 가장 컸어요. 재활 초기엔 0~50° 범위를 권해요. 슬개대퇴 통증 20명이 피드백을 받자 무릎을 약 6° 덜 굽히며 관절 힘이 14.4% 줄었어요.", hypo: "깊이를 줄이면 통증이 줄어드는지는 측정되지 않았어요.", ev: "weak", src: "Straub & Powers 2024, Escamilla 2023, Kernozek 2020" },
    lunge: { title: "런지는 짧은 범위·제자리부터", how: "무릎을 40~50°쯤만 굽히는 짧은 런지로 시작하세요. 제자리 런지 → 걸어가는 런지, 10cm 발판 위로 내딛기 → 바닥 순서로 늘리고, 옆 런지는 나중에 하세요.",
             fact: "건강한 16명 모델 분석에서 런지의 슬개대퇴 부하는 무릎을 굽힐수록 커졌고, 10cm 발판 위로 내딛으면 40~60°에서 바닥보다 낮았어요. 옆 런지는 40~100°에서 앞 런지보다 높았어요. 저자들은 재활 초기에 0~40° 미니 런지를 권했어요.", hypo: "모델로 계산한 부하이고 통증 환자는 재지 않았어요. 이 순서가 통증을 줄이는지는 몰라요.", ev: "weak", src: "Escamilla 2022, Escamilla 2023" },
    hip: { title: "엉덩이를 뒤로 빼고 상체를 조금 숙이기", how: "앉을 때 의자에 앉듯 엉덩이를 뒤로 빼고 상체를 조금 더 숙여 보세요. 박스 스쿼트가 도움이 돼요.",
           fact: "상체를 앞으로 숙이면 무릎 부담은 줄고 엉덩이 부담은 늘어요. 저자들은 슬개대퇴 통증 초기에 엉덩이 위주 스쿼트를 권했어요(임상 해설).", hypo: "허리 부담이 늘 수 있어서, 허리가 아픈 사람에게는 권하지 않아요. 이건 앱의 판단이에요.", ev: "weak", src: "Straub & Powers 2024" },
    pain: { title: "통증 점수로 부하 맞추기", how: "운동 중 통증이 10점 중 5점 이하이고, 다음 날 원래대로 돌아오는 범위에서만 무게와 횟수를 늘리세요.",
            fact: "무릎힘줄 통증은 통증 점수로 부하를 정해요. 운동 중·후 5점까지는 괜찮지만 다음 날에는 5점보다 낮아야 해요. 초기에는 점프·스쿼트를 자전거 등으로 바꿔요.", hypo: "슬개대퇴 통증에도 같은 기준을 쓰는 건 앱의 확장이에요.", ev: "mid", src: "Rosen 2022" },
    iso: { title: "버티기 운동으로 시작하기", how: "레그 익스텐션을 중간에서 멈춰 버티거나 벽에 기대 앉아 버티기를 30~60초씩 5번 해 보세요.",
           fact: "무릎힘줄 통증 1단계 운동으로 넙다리네갈래근 버티기 30→60초, 5회를 제시했어요(임상 리뷰).", hypo: "리뷰의 예시이고, 이 방법을 시험한 연구는 직접 읽지 않았어요.", ev: "weak", src: "Rosen 2022" },
    load: { title: "무게·횟수·점프 줄이기", how: "스쿼트 무게나 횟수, 점프·달리기를 늘리기 전으로 되돌리고 지켜보세요.",
            fact: "훈련량이 많을수록 무릎힘줄 통증과 관련이 있었어요.", hypo: "얼마 동안 지켜볼지는 정해 두지 않았어요.", ev: "weak", src: "Rosen 2022" },
  },
  sources: [
    ["Bunt 2018, 무릎 통증 초기 평가 (AFP)", "https://aafp.org/afp/2018/1101/p576"],
    ["Crossley 2016 Part 1, 슬개대퇴 통증 정의·진단 합의문", "https://pmc.ncbi.nlm.nih.gov/articles/PMC4975817/"],
    ["Crossley 2016 Part 2, 슬개대퇴 통증 운동치료 합의문", "https://pmc.ncbi.nlm.nih.gov/articles/PMC4975825/"],
    ["Rosen 2022, 무릎힘줄 통증 임상 관리", "https://pmc.ncbi.nlm.nih.gov/articles/PMC9528703/"],
    ["Straub & Powers 2024, 스쿼트 생체역학 임상 해설", "https://pmc.ncbi.nlm.nih.gov/articles/PMC10987311/"],
    ["Kernozek 2020, 슬개대퇴 통증 스쿼트 피드백", "https://doi.org/10.1016/j.clinbiomech.2020.105050"],
    ["Escamilla 2022, 앞·옆 런지와 발판 높이에 따른 슬개대퇴 부하", "https://ijspt.scholasticahq.com/article/31876.pdf"],
    ["Escamilla 2023, 무릎 재활 운동 선택 다섯 가지 원칙", "https://rcastoragev2.blob.core.windows.net/0f09a192d085a339c6544fb8e8203880/ijspt_2023_18_1_65896.PMC9897005.pdf"]],
  sample: { where: "patella", when: "down", depth: "deep", sit: "yes", warm: "no", style: "back", spike: "no", swell: "no", dur: "w2to6", trend: "same" },
  summary(a) { return [
    `아픈 곳: ${label("where", a.where)} / 아플 때: ${label("when", a.when)}`,
    `굽히는 정도: ${label("depth", a.depth)} / 아픈 운동: ${label("style", a.style)}`,
    `앉았다 일어날 때·계단 통증: ${label("sit", a.sit)} / 몸 풀리면 덜함: ${label("warm", a.warm)} / 운동 후 붓기: ${label("swell", a.swell)}`,
    `최근 4주 급증: ${label("spike", a.spike)}`,
    `기간·경과: ${label("dur", a.dur)}, ${label("trend", a.trend)}`]; },
  analyse(a) {
    const sc = { pfp: 0, pt: 0, side: 0 };
    if (has(a, "where", "patella")) sc.pfp += 3;
    if (has(a, "sit", "yes")) sc.pfp += 2;
    if (has(a, "when", "down")) sc.pfp += 1;
    if (has(a, "where", "below")) sc.pt += 3;
    if (has(a, "warm", "yes")) sc.pt += 2;
    if (has(a, "spike", "yes")) sc.pt += 1;
    if (has(a, "where", "side")) sc.side += 4;
    let patterns;
    if (sc.side >= 4) patterns = ["side"];
    else { const main = sc.pt > sc.pfp ? "pt" : "pfp"; const other = main === "pfp" ? "pt" : "pfp"; patterns = [main]; if (sc[other] >= 3) patterns.push(other); }
    const picks = [];
    const main = patterns[0];
    if (main === "pfp") {
      picks.push(["hipknee", 2]);
      if (has(a, "style", "lunge")) picks.push(["lunge", 1.5]);
      if (has(a, "depth", "deep") || has(a, "depth", "parallel")) picks.push(["depth", 1]);
      picks.push(["hip", 4]);
    } else if (main === "pt") {
      picks.push(["pain", 1]); picks.push(["iso", 3]);
    }
    if (has(a, "spike", "yes")) picks.push(["load", main === "pt" ? 2 : 3]);
    if (!picks.find(p => p[0] === "hipknee")) picks.push(["hipknee", 5]);
    const referExtra = has(a, "swell", "yes") || main === "side";
    const r = finish(a, sc, patterns, picks, has(a, "when", "daily"));
    if (referExtra) { r.referFirst = true; r.referKnee = true; }
    return r;
  },
  extras() {
    return [
      card("무릎이 발끝을 넘으면 안 되나요?", "weak",
        "넘는다고 무조건 위험한 건 아니에요. 정강이가 앞으로 기울수록 무릎 부담이 커지지만, 상체를 숙이면 무릎 부담은 줄어요. 무릎만 막으면 그만큼 엉덩이와 허리로 부담이 옮겨가요. 그래서 무릎 위치 하나보다 상체와 정강이의 기울기를 함께 봐야 해요.", "Straub & Powers 2024"),
      card("MRI를 찍어봐야 할까요?", "mid",
        "무릎이 걸리거나 붓지 않는 무릎 앞 통증이라면, 운동 관리를 먼저 해 보기 전에 MRI를 찍지 말라고 권해요. MRI는 보존 치료에도 낫지 않을 때 고려해요.", "Bunt 2018 (Choosing Wisely 인용)")];
  },
};
