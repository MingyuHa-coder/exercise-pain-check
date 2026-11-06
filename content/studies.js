/* =========================================================
   연구 정보 — 근거 카드 아래에 "연구 종류 · 대상"을 붙이는 데 쓴다 (기획서 3-2 근거 수준 표시).
   match: 출처 문자열에서 이 연구를 찾는 정규식
   type : 연구 종류 / who: 연구 대상(인원은 앱 본문에서 확인한 것만 적는다. 논문의 질환명 그대로 = 내부 검토용)
   whoUser: 사용자 화면에 보이는 연구 대상. 질환명 대신 "진료에서 ~로 분류된 사람"처럼 대상 범위를 넓히지 않게 적는다 (없으면 who를 보여줌)
   app  : 대상이 앱 이용자(헬스하다 아픈 사람)와 얼마나 가까운지
          "직접" = 통증이 있는 사람 대상 / "간접" = 건강인·선수·모델·동물 등이라 옮겨 쓴 것 / "지침" = 진료 지침·합의
   ========================================================= */
const STUDIES = [
  { match: /BESS\/BOA|Rees 2021/, name: "BESS/BOA 2021", type: "진료 경로(지침)", who: "어깨 통증 환자 진료", app: "지침" },
  { match: /KISS/, name: "KISS 요약", type: "1차 진료 요약", who: "어깨 통증 환자 진료", app: "지침" },
  { match: /Pieters 2020/, name: "Pieters 2020", type: "체계적 고찰 종합", who: "어깨 충돌성 통증 환자", whoUser: "진료에서 '팔을 들 때 아픈 어깨 통증'으로 분류된 사람", app: "직접" },
  { match: /Kibler 2013/, name: "Kibler 2013", type: "전문가 합의", who: "날개뼈 움직임 문제", app: "지침" },
  { match: /Hickey 2018/, name: "Hickey 2018", type: "메타분석", who: "통증 없는 사람 포함 추적 연구", app: "간접" },
  { match: /Barrett 2016/, name: "Barrett 2016", type: "체계적 고찰", who: "등 자세와 어깨 통증", app: "간접" },
  { match: /Michener 2009/, name: "Michener 2009", type: "진단 정확도 연구", who: "진료실에서 검사자가 검사한 어깨 통증 환자", app: "간접" },
  { match: /Hegedus 2012/, name: "Hegedus 2012", type: "메타분석", who: "어깨 진찰 검사", app: "간접" },
  { match: /Nevalainen 2016/, name: "Nevalainen 2016", type: "환자-대조 연구(MRI)", who: "벤치프레스 하는 사람", app: "직접" },
  { match: /Noteboom 2024/, name: "Noteboom 2024", type: "근골격 모델 계산", who: "모델(실제 통증 측정 없음)", app: "간접" },
  { match: /ElMaraghy 2012/, name: "ElMaraghy 2012", type: "체계적 고찰", who: "대흉근 파열 환자", whoUser: "가슴 근육(대흉근) 부상 환자", app: "직접" },
  { match: /Torwichien 2020/, name: "Torwichien 2020", type: "평가자 일치도 연구", who: "물리치료사의 분류", app: "간접" },
  { match: /McKean 2015/, name: "McKean 2015", type: "동작 측정", who: "다치지 않은 숙련자 33명", app: "간접" },
  { match: /Kolber 2010/, name: "Kolber 2010", type: "고찰(증례·전문가 의견)", who: "웨이트 트레이닝 어깨 부상", app: "직접" },
  { match: /Bonilla 2022/, name: "Bonilla 2022", type: "고찰", who: "피트니스센터 운동과 부상", app: "간접" },
  { match: /Gundersen 2026/, name: "Gundersen 2026", type: "동작·관절 부하 측정", who: "건강인 11명", app: "간접" },
  { match: /Schoenfeld 2011/, name: "Schoenfeld 2011", type: "실무 칼럼", who: "연구 아님", app: "간접" },
  { match: /Robert-Lachaine 2015/, name: "Robert-Lachaine 2015", type: "동작 측정", who: "건강한 남성 15명", app: "간접" },
  { match: /MedBridge/, name: "MedBridge", type: "교육 자료", who: "-", app: "간접" },
  { match: /McKenzie 2022a/, name: "McKenzie 2022a", type: "동작·근활성 측정", who: "건강한 남성 13명", app: "간접" },
  { match: /McKenzie 2022a·b|McKenzie 2022b/, name: "McKenzie 2022b", type: "동작 측정(피로)", who: "건강인", app: "간접" },
  { match: /Suprak 2013/, name: "Suprak 2013", type: "동작 측정", who: "건강인 16명", app: "간접" },
  { match: /Ludewig 2004/, name: "Ludewig 2004", type: "근활성 측정", who: "30명(가벼운 어깨 문제 포함)", app: "간접" },
  { match: /Prinold & Bull 2016/, name: "Prinold & Bull 2016", type: "동작 측정", who: "풀업하는 11명", app: "간접" },
  { match: /Finucane 2020/, name: "Finucane 2020", type: "국제 합의 프레임워크", who: "척추 위험 신호", app: "지침" },
  { match: /NICE NG59/, name: "NICE NG59", type: "진료 가이드라인", who: "허리 통증·좌골신경통", whoUser: "허리 통증, 다리로 내려가는 통증", app: "지침" },
  { match: /Menezes Costa 2012/, name: "da C Menezes Costa 2012", type: "메타분석(33개 코호트)", who: "허리 통증 환자", app: "직접" },
  { match: /Michaelson 2016/, name: "Michaelson 2016", type: "무작위 대조 시험", who: "만성 허리 통증 70명(물리치료사 지도)", app: "직접" },
  { match: /Strömbäck 2018/, name: "Strömbäck 2018", type: "단면 설문 연구", who: "파워리프터 104명", app: "간접" },
  { match: /Saraceni 2020/, name: "Saraceni 2020", type: "체계적 고찰", who: "12kg 이하 들기 작업", app: "간접" },
  { match: /Martín-Fuentes 2020/, name: "Martín-Fuentes 2020", type: "체계적 고찰", who: "건강한 남성(인용 연구 20명)", app: "간접" },
  { match: /Tampier 2007/, name: "Tampier 2007", type: "동물 실험", who: "돼지 척추", app: "간접" },
  { match: /HSE/, name: "HSE 들기 지침", type: "산업안전 지침", who: "작업 중 들기", app: "간접" },
  { match: /Coenen 2014/, name: "Coenen 2014", type: "메타분석", who: "작업자", app: "간접" },
  { match: /Bunt 2018/, name: "Bunt 2018", type: "임상 리뷰", who: "무릎 통증 환자 평가", app: "지침" },
  { match: /Crossley 2016/, name: "Crossley 2016", type: "국제 합의문", who: "슬개대퇴 통증 환자", whoUser: "진료 기준으로 무릎뼈 주변 통증으로 분류된 사람", app: "직접" },
  { match: /Rosen 2022/, name: "Rosen 2022", type: "임상 리뷰", who: "무릎힘줄 통증 환자", whoUser: "진료에서 무릎뼈 아래 힘줄 통증으로 분류된 사람", app: "직접" },
  { match: /Straub & Powers 2024/, name: "Straub & Powers 2024", type: "임상 해설", who: "스쿼트 생체역학", app: "간접" },
  { match: /Kernozek 2020/, name: "Kernozek 2020", type: "실험 연구", who: "슬개대퇴 통증 20명", whoUser: "무릎뼈 주변 통증으로 분류된 20명", app: "직접" },
  { match: /Escamilla 2022/, name: "Escamilla 2022", type: "모델 계산", who: "건강인 16명", app: "간접" },
  { match: /Escamilla 2023/, name: "Escamilla 2023", type: "리뷰", who: "무릎 재활 운동 원칙", app: "간접" },
  { match: /Lucado 2022/, name: "Lucado 2022", type: "진료 지침", who: "팔꿈치 바깥쪽 힘줄 통증 환자", whoUser: "진찰로 팔꿈치 바깥쪽 힘줄 통증이 확인된 사람", app: "지침" },
  { match: /Konarski 2022/, name: "Konarski 2022", type: "서술적 리뷰", who: "팔꿈치 안쪽 통증", app: "간접" },
  { match: /Alentorn-Geli 2016/, name: "Alentorn-Geli 2016", type: "리뷰", who: "이두근 힘줄 손상", whoUser: "팔꿈치 앞쪽 힘줄 부상", app: "간접" },
  { match: /Shehab 2013/, name: "Shehab 2013", type: "임상 리뷰", who: "손목 통증 평가", app: "지침" },
  { match: /Hanson & Lourie 2022/, name: "Hanson & Lourie 2022", type: "서술적 리뷰", who: "선수", app: "간접" },
  { match: /Pang & Yao 2017/, name: "Pang & Yao 2017", type: "리뷰", who: "선수", app: "간접" },
  { match: /Patel 2011/, name: "Patel 2011", type: "임상 리뷰", who: "피로골절", whoUser: "반복 부하로 생긴 뼈 손상 진료", app: "지침" },
  { match: /Mellinger/, name: "Mellinger & Neurohr 2019", type: "서술적 리뷰", who: "러너 무릎 부상", app: "직접" },
  { match: /Saad 2025/, name: "Saad 2025", type: "범위 고찰", who: "정강이 부목", whoUser: "진료에서 정강이 안쪽 통증으로 분류된 사람", app: "직접" },
  { match: /Lenhart 2014/, name: "Lenhart 2014", type: "모델 추정", who: "건강한 러너 30명", app: "간접" },
  { match: /Frandsen 2025/, name: "Frandsen 2025", type: "전향적 관찰 연구", who: "아프지 않은 러너 약 5,200명", app: "간접" },
  { match: /Griffin 2016|Warwick/, name: "Warwick 합의 (Griffin 2016)", type: "국제 합의", who: "고관절 충돌 증후군", whoUser: "진찰·영상으로 확인된 고관절 통증", app: "지침" },
  { match: /Weir 2015|Doha/, name: "Doha 합의 (Weir 2015)", type: "국제 합의", who: "운동선수 사타구니 통증", app: "지침" },
  { match: /Kemp 2020/, name: "Kemp 2020", type: "국제 합의", who: "고관절 관련 통증", whoUser: "진료에서 고관절 관련 통증으로 분류된 사람", app: "지침" },
  { match: /Lamontagne 2009/, name: "Lamontagne 2009", type: "비교 연구", who: "15명(충돌 있는 사람 포함)", app: "간접" },
  { match: /Fenwick 2009/, name: "Fenwick 2009", type: "허리 부하 측정", who: "건강한 남성 7명", app: "간접" },
];
const APP_FIT = { "직접": "통증 있는 사람 대상", "간접": "건강인·선수·모델 등에서 옮김", "지침": "진료 지침·합의" };
function studiesIn(src) {
  if (!src) return [];
  const seen = new Set();
  return STUDIES.filter(s => s.match.test(src) && !seen.has(s.name) && seen.add(s.name));
}
