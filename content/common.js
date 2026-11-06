/* =========================================================
   공통 콘텐츠 — 여러 주제가 함께 쓰는 위험 신호·질문·조정·출처
   (주제 파일보다 먼저 불러온다)
   ========================================================= */
const CONTENT_VERSION = "8";   // 콘텐츠 버전. 문구·규칙을 바꾸면 올린다.
const TOPICS = {};

const BASE_FLAGS = [
  { id: "cardiac", q: "가슴이 답답하거나 숨이 차고, 식은땀과 함께 어깨나 팔이 아픈가요?", level: 0 },
  { id: "disloc", q: "어깨가 빠진 느낌이 들거나 모양이 변했나요?", level: 1 },
  { id: "infect", q: "열이 나거나, 어깨가 붉고 뜨겁게 부었나요?", level: 1 },
  { id: "night", q: "쉬어도 밤새 계속 아프거나, 혹이 만져지거나, 이유 없이 살이 빠졌나요?", level: 3 },
  { id: "neck", q: "팔이나 손이 저리거나, 통증이 팔꿈치 아래까지 내려가나요?", level: 3 },
];
const BASE_LEVELS = [
  { title: "지금 119에 전화하세요", body: "운동 때문에 생긴 어깨 통증이 아닐 수 있는 응급 신호예요. 운동을 멈추고 바로 도움을 요청하세요.", call: true },
  { title: "오늘 응급실로 가세요", body: "오늘 바로 확인이 필요한 신호예요. 운동 조언으로 해결할 수 있는 상황이 아니에요." },
  null,
  { title: "빠른 시일 내 진료를 받으세요", body: "운동 중 부담이 아닌 다른 원인이 있는지 먼저 확인해야 하는 신호예요." },
];
const withFlag = (extra) => [BASE_FLAGS[0], BASE_FLAGS[1], BASE_FLAGS[2], extra, BASE_FLAGS[3], BASE_FLAGS[4]];
const withLevel = (lv2) => BASE_LEVELS.map((l, i) => i === 2 ? lv2 : l);

const COMMON_Q = {
  dur: { id: "dur", q: "아픈 지 얼마나 됐나요?", opts: [["lt2", "2주 미만"], ["w2to6", "2~6주"], ["gt6", "6주 이상"]] },
  trend: { id: "trend", q: "요즘 통증은 어떻게 변하고 있나요?", opts: [["better", "좋아지는 중"], ["same", "그대로"], ["worse", "나빠지는 중"]] },
  acc: { id: "acc", q: "밴드 외회전이나 날개뼈 운동 같은 보조운동을 하나요?", opts: [["regular", "정기적으로 함"], ["sometimes", "가끔"], ["never", "안 함"]] },
};
/* 결과 카드(운동 변수) 필드: title = 화면 제목(운동 변수), plain = 설명, check = 점검할 운동 변수,
   say = 다음 행동, term = 연구에서 쓰는 이름(접어서 참고로만), ev/evText/src = 근거, hypo = 앱의 가설 */
const COMMON_P = {
  rc: (where, title, check) => ({ title, term: "회전근개 관련 통증 (어깨 충돌성 통증)",
        plain: `팔을 들거나 미는 동작에서 어깨 속 힘줄이 받는 부담이 감당할 수 있는 양을 넘었을 때 흔히 보이는 모습이에요. ${where}`,
        check, say: "무게와 동작 방식을 조정하고 어깨 보조운동을 더해 보세요.",
        ev: "mid", evText: "진단명 자체는 모호하지만, 운동치료가 1차 치료라는 근거는 강해요.", src: "Pieters 2020, Kibler 2013" }),
};
const COMMON_A = {
  acc: { title: "어깨·날개뼈 보조운동 더하기", how: "밴드 외회전, 엎드려 Y자로 팔 들기처럼 아래쪽 등과 날개뼈 근육을 쓰는 운동을 가볍게 시작하세요. 어깨를 귀 쪽으로 으쓱하지 않도록 하세요.",
         fact: "운동치료는 어깨 충돌성 통증의 1차 치료로 권고돼요. 날개뼈 중심 운동이 단기에 일반 운동보다 나았어요.", hypo: "여기 적은 두 운동은 앱이 고른 예시예요. 어떤 운동을 몇 번 하는 게 가장 좋은지는 정해져 있지 않아요.", ev: "strong", src: "Pieters 2020, Kibler 2013" },
};
const SRC = {
  bess: ["BESS/BOA 어깨 통증 진료 경로 (Rees 2021)", "https://pmc.ncbi.nlm.nih.gov/articles/PMC7905504"],
  pieters: ["Pieters 2020, 어깨 충돌성 통증 보존치료 종합 고찰", "https://repository.uantwerpen.be/docman/irua/187b87/163966_2020_05_18.pdf"],
  kibler: ["Kibler 2013, 견갑 운동이상 국제 합의문", "https://bjsm.bmj.com/content/47/14/877"],
  hickey: ["Hickey 2018, 견갑 운동이상과 어깨 통증 위험", "https://bjsm.bmj.com/content/52/2/102"],
  barrett: ["Barrett 2016, 등 자세와 어깨 통증·가동범위", "https://www.pubmed.gov/27475532/"],
};
