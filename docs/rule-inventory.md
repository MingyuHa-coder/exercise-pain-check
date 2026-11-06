# 판단 규칙 목록 (내부 검토 자료)

앱이 답변으로 결과를 고르는 모든 기준을 모은 문서다. **사용자에게 보여주는 문서가 아니다.** 전문가 검토와 식약처 사전 상담 때 이 문서를 그대로 쓴다.

- 기준 버전: 콘텐츠 버전 8.1 (2026-11-06)
- 판단 규칙이 있는 곳: `js/app.js`의 `finish`(공통), `content/topics/*.js`의 `analyse`(주제별)
- 검토 상태: 아래 모든 항목이 **검토 전**이다.
- 이 문서의 점수·기준선·우선순위는 **모두 앱(Claude)이 정한 값**이다. 논문에서 나온 수치가 아니다.

## 1. 분류

| 분류 | 뜻 |
| --- | --- |
| ① 유지 | 근거가 확인돼 그대로 쓸 수 있음 (그래도 전문가 확인은 받는다) |
| ② 검토 후 결정 | 앱이 정한 기준. 검토 전까지는 "앱이 정한 값"이라고 표시한 채 사용 |
| ③ 화면에서 숨김 | 진단·위험도 평가로 읽힐 수 있어 사용자에게 보여주지 않음. 데이터는 내부 검토용으로 보존 |

| 항목 | 위치 | 분류 | 현재 처리 |
| --- | --- | --- | --- |
| 위험 신호 질문의 존재와 내용 | 주제별 `redFlags` | ① (손목·팔꿈치 골절·감염 문항은 다른 부위 원칙을 옮겨서 ②) | 유지 |
| 진료 시점 구분 (119 / 오늘 / 며칠 안 / 빠른 시일 내) | 주제별 `flagLevels` | ② | 유지. 위험 신호 화면에 "시점 구분은 앱이 정한 것이고 검토 전. 걱정되면 더 빨리 진료" 안내 추가(v8) |
| 진료 먼저 조건: 일상에서도 아픔 / 6주 이상 / 나빠지는 중 | `finish` | ② | 유지 (안전 쪽) |
| 부위·증상별 진료 먼저 (무릎 아래 저림, 무릎 안·바깥·붓기, 팔꿈치 앞, 손목 옆, 빠질 듯한 느낌, 고관절 걸림, 엉덩이 바깥) | 주제별 `analyse` | ② | 유지 (안전 쪽) |
| 변수별 점수(+1~+6)와 함께 보이는 기준선(2·3·4·6점) | 주제별 `analyse` | ② | 유지. 점수는 화면에 안 나오고 "먼저/함께 점검할 것" 순서로만 쓰임 |
| 변수를 고르는 방식 (가장 높은 점수, 아픈 위치 하나로 결정 등) | 주제별 `analyse` | ② | 유지 |
| 조정 우선순위 숫자와 "상위 3개만" | `picks`, `finish` | ② | 유지 |
| 답변이 뒷받침하지 않는 변수(점수 0)는 보여주지 않음 | `finish` | ② | **v8 신설, 별도 전문가 검토 대상**. 새 수치 없이 "0점 = 어떤 답변도 해당 안 됨"만 사용 |
| "→ 진료 먼저" 변수(`referOnly`)가 있으면 조정을 보여주지 않음 | `finish` + 주제별 `patterns` | ② | **v8.1 신설.** "조정보다 진료 먼저"라면서 조정을 보여주던 모순 제거. 대상: 데드리프트·스쿼트 허리 다리 증상, 무릎 안·바깥·붓기, 팔꿈치 앞, 손목 옆, 빠질 듯한 느낌, 엉덩이 바깥 |
| 일반 진료 먼저 조건(일상 통증·6주·악화·고관절 걸림)일 때 조정을 "참고만" 하라며 함께 보여줌 | 결과 화면 | ② | 유지 (v7부터 같은 방식). 조정을 숨길지 전문가 의견 필요 |
| "최근 4주 크게 늘렸나요" 문항 | 주제별 `spike` 질문 | ② | 유지 |
| "2주" 기간 | 조정 문구, 기록 안내, 전문가 화면 | ② → 화면에서 제거 | **v8에서 기간 표현을 모두 뺌.** 새 기간은 정하지 않음 (원래 문구는 4장) |
| C9 "좁히기 어려움" 기준 점수 2·3점 | (v7) `finish` + 주제별 `unclearBelow` | ③ | **v8에서 제거.** 원래 값은 3장 |
| C10 연구 분류 (통증 있는 사람 대상 / 옮김 / 지침) | `content/studies.js` | ② | 유지 |
| 자가검사 동작 | (없음) | 해당 없음 | v7에서 모두 경험 질문으로 바뀜. "옆에서 영상을 찍어 보세요" 같은 자기 관찰 안내 3곳(스쿼트 허리 골반 말림, 바벨 로우 들썩임, 딥스 깊이)은 ② |
| 결과 카드의 질환명 (`term`) | 주제별 `patterns` | ③ | **v8에서 화면 제거**, 데이터 보존. 아래 주제별 표 |
| 진단 가능성·질환 정의 문장 (`internal`) | 주제별 `patterns` | ③ | **v8에서 화면 제거**, 데이터 보존. 아래 주제별 표 |
| 의학 용어 모드의 질환명 변환 | `content/glossary.js` | ③ | **v8에서 화면 제거**, `GLOSS_DISEASE_INTERNAL`로 보존. 해부학 용어 변환은 유지 |

## 2. 공통 규칙 (`js/app.js` `finish`)

- 조정: 주제 규칙이 고른 후보를 우선순위 숫자 오름차순으로 정렬해 **상위 3개**만 보여준다.
- 진료 먼저(`referFirst`): 일상에서도 아픔 또는 6주 이상(`dur = gt6`) 또는 나빠지는 중(`trend = worse`) 또는 주제별 조건.
- v8: 점수 표에 있는 변수 중 **0점인 변수는 결과에서 뺀다.** 맨 앞 변수가 빠지면 "현재 답변만으로는 우선적으로 점검할 변수를 좁히기 어려워요" 안내를 띄우고, 남는 변수가 없으면 조정도 보여주지 않는다.
- v8.1: 결과에 "→ 진료 먼저" 변수(`referOnly: true`)가 있으면 조정을 보여주지 않는다.
- v8.1 점검: 주제마다 무작위 답변 4,000개(총 52,000개)로 확인한 결과, (1) 변수 없이 조정만 나오는 경우 (2) 진료 먼저 변수와 조정이 함께 나오는 경우 (3) 0점 변수가 보이는 경우가 모두 0건이다. v8에서는 (2)가 데드리프트·스쿼트 허리(무릎 아래 다리 증상)와 무릎(안·바깥쪽 통증)에서 생겼다.

## 3. 제거한 C9 기준 (보존)

v7에서 Claude가 만든 기준이다. 맨 앞 변수의 점수가 아래 값보다 낮으면 "좁히기 어려움"으로 표시했다. v8에서 사용하지 않는다.

| 주제 | `unclearBelow` |
| --- | --- |
| 벤치 어깨, 숄더 프레스 어깨, 레터럴 레이즈 어깨, 딥스·푸시업 어깨, 풀업·랫풀다운 어깨 | 2 |
| 하체 무릎, 팔꿈치, 고관절 | 3 |
| 데드리프트·스쿼트·로우 허리, 달리기, 손목 | 적용 안 함 |

## 4. 제거한 "2주" 문구 (보존)

| 주제 | v7 문구 | v8 문구 |
| --- | --- | --- |
| 벤치 · 숄더 프레스 · 레터럴 레이즈 | 통증 없이 할 수 있는 무게로 2주 동안 해 보세요. / 가설: "2주"라는 기간은 앱이 정한 값 | 통증 없이 할 수 있는 무게로 해 보세요. / 가설: 얼마 동안 해야 하는지는 정해 두지 않음 |
| 데드리프트 | 주 1~2번으로 줄여 2주 동안 해 보세요. | 주 1~2번으로 줄여 해 보세요. |
| 스쿼트 허리 · 바벨 로우 | 통증이 늘지 않는 무게로 (낮추고) 2주 동안 해 보세요. | 통증이 늘지 않는 무게로 (낮춰서) 해 보세요. |
| 하체 무릎 | 늘리기 전으로 되돌리고 2주 동안 지켜보세요. | 늘리기 전으로 되돌리고 지켜보세요. |
| 팔꿈치 | 2주 동안 통증이 늘지 않을 때만 조금씩 늘리세요. | 통증이 늘지 않을 때만 조금씩 늘리세요. |
| 손목 | 아픈 운동은 2주 정도 줄이거나 쉬고 | 아픈 운동은 줄이거나 쉬고 |
| 딥스·푸시업 · 풀업 | 2주 정도 줄이세요. | 줄이세요. |
| 고관절 | 무게·횟수를 2주 정도 줄이고 | 무게·횟수를 줄이고 |
| 공통: 기록 "같았어요" | 다른 조정과 함께 2주는 지켜보세요. | 다음 운동에서도 기록해 보세요. |
| 공통: 전문가 화면 | 조정을 2주 해도 그대로이거나 나빠짐 / 2주는 한 번 확인받을 시점 / 가설: 영국 1차 진료 요약은 6~12주 | 조정을 해 봐도 나아지지 않거나 나빠짐 / 얼마나 지켜볼지는 정해 두지 않음, 걱정되면 확인 |

"아픈 지 얼마나 됐나요?"의 선택지 "2주 미만"은 기간 권장이 아니라 질문 구간이라 그대로 뒀다.

## 5. 주제별 규칙 (코드에서 자동으로 뽑음)

진료 시점 단계는 모두 ② 검토 후 결정 항목이다.

### 벤치프레스 (`bench`)

**위험 신호와 진료 시점** · 출처: BESS/BOA 어깨 통증 진료 경로 (Rees 2021), ElMaraghy 2012

| 문항 | 단계 | 화면 제목 |
| --- | --- | --- |
| 가슴이 답답하거나 숨이 차고, 식은땀과 함께 어깨나 팔이 아픈가요? | 119 | 지금 119에 전화하세요 |
| 어깨가 빠진 느낌이 들거나 모양이 변했나요? | 오늘 | 오늘 응급실로 가세요 |
| 열이 나거나, 어깨가 붉고 뜨겁게 부었나요? | 오늘 | 오늘 응급실로 가세요 |
| 무거운 무게를 내리다 "뚝" 하는 느낌과 함께 아프고 힘이 빠졌나요? 가슴이나 겨드랑이 모양이 그대로여도 해당돼요. | 며칠 안 | 며칠 안에 정형외과 진료를 받으세요 |
| 쉬어도 밤새 계속 아프거나, 혹이 만져지거나, 이유 없이 살이 빠졌나요? | 빠른 시일 내 | 빠른 시일 내 진료를 받으세요 |
| 팔이나 손이 저리거나, 통증이 팔꿈치 아래까지 내려가나요? | 빠른 시일 내 | 빠른 시일 내 진료를 받으세요 |

**판단 규칙 (점수·기준선·조정 우선순위, 코드 그대로)**

```js
analyse(a) {
    const sc = { rc: 0, acj: 0, scap: 0 };
    if (has(a, "where", "front") || has(a, "where", "sideback")) sc.rc += 2;
    ["lateral", "upright", "ohp"].forEach(v => { if (has(a, "other", v)) sc.rc += 1; });
    if (has(a, "daily", "overhead")) sc.rc += 2;
    if (has(a, "when", "lower") || has(a, "when", "press")) sc.rc += 1;
    if (has(a, "where", "top")) sc.acj += 4;
    if (has(a, "daily", "cross")) sc.acj += 1;
    if (has(a, "grip", "g2")) sc.acj += 2; else if (has(a, "grip", "g15")) sc.acj += 1;
    if (has(a, "load", "gt15")) sc.acj += 2;
    if (has(a, "scap", "no") || has(a, "scap", "unsure")) sc.scap += 2;
    if (has(a, "acc", "never")) sc.scap += 1;

    const main = sc.acj > sc.rc ? "acj" : "rc";
    const other = main === "rc" ? "acj" : "rc";
    const patterns = [main];
    if (sc[other] >= 3) patterns.push(other);
    if (sc.scap >= 2) patterns.push("scap");

    const picks = [];
    picks.push(["load", main === "acj" || has(a, "load", "gt15") ? 1 : 6]);
    if (has(a, "grip", "g15") || has(a, "grip", "g2")) picks.push(["grip", 2]);
    if (has(a, "scap", "no") || has(a, "scap", "unsure")) picks.push(["scap", 3]);
    if (has(a, "elbow", "flared") || has(a, "elbow", "tucked")) picks.push(["elbow", 5]);
    if (has(a, "acc", "never") || has(a, "acc", "sometimes")) picks.push(["acc", 4]);
    if (has(a, "daily", "cross") || has(a, "daily", "behind")) picks.push(["flex", 7]);
    return finish(a, sc, patterns, picks, has(a, "when", "daily"));
  }
```

**내부 보존: 질환명·진단 가능성 문장 (사용자 화면에 표시 안 함)**

| 변수 id | 화면 제목 | 연구에서 쓰는 이름 | 진단 관련 문장 (출처) |
| --- | --- | --- | --- |
| rc | 바를 내리고 미는 동작의 어깨 부담 | 회전근개 관련 통증 (어깨 충돌성 통증) | - |
| acj | 무겁게·자주 하는 벤치의 어깨 위쪽 부담 | 쇄골 끝 관절 통증 (원위 쇄골 골용해 등) | - |
| scap | 날개뼈 세팅과 보조운동 | 견갑 운동이상 (날개뼈 움직임 문제) | - |

### 숄더 프레스 (`ohp`)

**위험 신호와 진료 시점** · 출처: BESS/BOA 어깨 통증 진료 경로 (Rees 2021), KISS 1차 진료 요약

| 문항 | 단계 | 화면 제목 |
| --- | --- | --- |
| 가슴이 답답하거나 숨이 차고, 식은땀과 함께 어깨나 팔이 아픈가요? | 119 | 지금 119에 전화하세요 |
| 어깨가 빠진 느낌이 들거나 모양이 변했나요? | 오늘 | 오늘 응급실로 가세요 |
| 열이 나거나, 어깨가 붉고 뜨겁게 부었나요? | 오늘 | 오늘 응급실로 가세요 |
| 무게를 들다가 다친 뒤로, 많이 아프지 않은데도 팔을 어깨 높이 위로 들 힘이 없나요? | 며칠 안 | 며칠 안에 정형외과 진료를 받으세요 |
| 쉬어도 밤새 계속 아프거나, 혹이 만져지거나, 이유 없이 살이 빠졌나요? | 빠른 시일 내 | 빠른 시일 내 진료를 받으세요 |
| 팔이나 손이 저리거나, 통증이 팔꿈치 아래까지 내려가나요? | 빠른 시일 내 | 빠른 시일 내 진료를 받으세요 |

**판단 규칙 (점수·기준선·조정 우선순위, 코드 그대로)**

```js
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
  }
```

**내부 보존: 질환명·진단 가능성 문장 (사용자 화면에 표시 안 함)**

| 변수 id | 화면 제목 | 연구에서 쓰는 이름 | 진단 관련 문장 (출처) |
| --- | --- | --- | --- |
| rc | 팔을 머리 위로 올리는 구간의 어깨 부담 | 회전근개 관련 통증 (어깨 충돌성 통증) | 통증 호는 진료실 검사에서 있으면 가능성을 약 2배 높이는 단서지만, 그것만으로 확진하진 못해요. (Michener 2009, Hegedus 2012) |
| acj | 팔을 끝까지 올리는 구간의 어깨 위쪽 부담 | 쇄골 끝 관절 통증 (견봉쇄골관절) | - |

### 데드리프트 (`dl`)

**위험 신호와 진료 시점** · 출처: Finucane 2020 척추 위험 신호 국제 프레임워크

| 문항 | 단계 | 화면 제목 |
| --- | --- | --- |
| 사타구니나 항문 주변 감각이 무뎌졌거나, 소변·대변을 참기 어렵거나 보기 어렵게 변했나요? | 119 | 지금 바로 응급실로 가세요 |
| 다리나 발에 힘이 점점 빠지거나(발이 끌림), 다리 통증이 한쪽에서 양쪽으로 번졌나요? | 119 | 지금 바로 응급실로 가세요 |
| 높은 곳에서 떨어지거나 사고를 당했나요? 또는 골다공증이 있거나 스테로이드를 3개월 넘게 쓰고 있나요? | 오늘 | 오늘 응급실로 가세요 |
| 열이 나거나 온몸이 아프고, 면역이 떨어지는 병이나 주사 약물 사용이 있나요? | 오늘 | 오늘 응급실로 가세요 |
| 암을 앓은 적이 있거나, 이유 없이 살이 빠지거나, 쉬어도 밤새 계속 점점 심하게 아픈가요? | 빠른 시일 내 | 빠른 시일 내 진료를 받으세요 |
| 다리가 저리거나 감각이 둔하고, 통증이 무릎 아래로 내려가나요? | 빠른 시일 내 | 빠른 시일 내 진료를 받으세요 |

**판단 규칙 (점수·기준선·조정 우선순위, 코드 그대로)**

```js
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
  }
```

**내부 보존: 질환명·진단 가능성 문장 (사용자 화면에 표시 안 함)**

| 변수 id | 화면 제목 | 연구에서 쓰는 이름 | 진단 관련 문장 (출처) |
| --- | --- | --- | --- |
| nsp | 허리에 걸리는 전체 운동 부하 | 비특이적 허리 통증 | - |
| nerve | 다리로 내려가는 증상 → 진료 먼저 | 신경 뿌리 자극 (좌골신경통) | - |

### 스쿼트·런지·레그프레스 (무릎) (`sqk`)

**위험 신호와 진료 시점** · 출처: Bunt 2018 (미국 가정의학회 무릎 통증 평가)

| 문항 | 단계 | 화면 제목 |
| --- | --- | --- |
| 다친 뒤 바로, 또는 지금 네 걸음 넘게 걷거나 체중을 싣기 어렵나요? | 오늘 | 오늘 응급실로 가세요 |
| 열이 나고, 무릎이 붉고 뜨겁게 부었나요? | 오늘 | 오늘 응급실로 가세요 |
| 다칠 때 "뚝" 소리나 느낌이 있었고, 몇 시간 안에 무릎이 붓거나 빠지는 느낌이 드나요? | 며칠 안 | 며칠 안에 정형외과 진료를 받으세요 |
| 무릎이 걸려서 끝까지 펴지지 않는 때가 있나요? | 며칠 안 | 며칠 안에 정형외과 진료를 받으세요 |
| 운동과 관계없이 쉬어도, 밤에도 아픈가요? | 빠른 시일 내 | 빠른 시일 내 진료를 받으세요 |

**판단 규칙 (점수·기준선·조정 우선순위, 코드 그대로)**

```js
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
  }
```

**내부 보존: 질환명·진단 가능성 문장 (사용자 화면에 표시 안 함)**

| 변수 id | 화면 제목 | 연구에서 쓰는 이름 | 진단 관련 문장 (출처) |
| --- | --- | --- | --- |
| pfp | 무릎을 깊이 굽혀 체중을 싣는 구간의 무릎 앞 부담 | 슬개대퇴 통증 | 무릎뼈 주변 통증이 무릎을 굽혀 체중을 싣는 동작에서 심해지는 게 핵심 기준이고, 스쿼트할 때 무릎 앞이 아픈 사람의 80%가 이 진단이었어요. (Crossley 2016) |
| pt | 점프·스쿼트 양에 따른 무릎뼈 아래 부담 | 무릎힘줄 통증 | - |
| side | 무릎 안·바깥쪽 통증이나 붓기 → 진료 먼저 | 반월상연골·인대 문제 가능성 | 다친 뒤 하루 이틀 안에 부으면 반월상연골, 걸려서 안 펴지면 반월상연골 파열을 의심해요. (Bunt 2018) |

### 스쿼트 (허리) (`sqb`)

**위험 신호와 진료 시점** · 출처: Finucane 2020 척추 위험 신호 국제 프레임워크

| 문항 | 단계 | 화면 제목 |
| --- | --- | --- |
| 사타구니나 항문 주변 감각이 무뎌졌거나, 소변·대변을 참기 어렵거나 보기 어렵게 변했나요? | 119 | 지금 바로 응급실로 가세요 |
| 다리나 발에 힘이 점점 빠지거나(발이 끌림), 다리 통증이 한쪽에서 양쪽으로 번졌나요? | 119 | 지금 바로 응급실로 가세요 |
| 높은 곳에서 떨어지거나 사고를 당했나요? 또는 골다공증이 있거나 스테로이드를 3개월 넘게 쓰고 있나요? | 오늘 | 오늘 응급실로 가세요 |
| 열이 나거나 온몸이 아프고, 면역이 떨어지는 병이나 주사 약물 사용이 있나요? | 오늘 | 오늘 응급실로 가세요 |
| 암을 앓은 적이 있거나, 이유 없이 살이 빠지거나, 쉬어도 밤새 계속 점점 심하게 아픈가요? | 빠른 시일 내 | 빠른 시일 내 진료를 받으세요 |
| 다리가 저리거나 감각이 둔하고, 통증이 무릎 아래로 내려가나요? | 빠른 시일 내 | 빠른 시일 내 진료를 받으세요 |

**판단 규칙 (점수·기준선·조정 우선순위, 코드 그대로)**

```js
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
  }
```

**내부 보존: 질환명·진단 가능성 문장 (사용자 화면에 표시 안 함)**

| 변수 id | 화면 제목 | 연구에서 쓰는 이름 | 진단 관련 문장 (출처) |
| --- | --- | --- | --- |
| nsp | 허리에 걸리는 전체 운동 부하 | 비특이적 허리 통증 | - |
| nerve | 다리로 내려가는 증상 → 진료 먼저 | 신경 뿌리 자극 (좌골신경통) | - |

### 레터럴 레이즈·업라이트 로우 (`lat`)

**위험 신호와 진료 시점** · 출처: BESS/BOA 어깨 통증 진료 경로 (Rees 2021), KISS 1차 진료 요약

| 문항 | 단계 | 화면 제목 |
| --- | --- | --- |
| 가슴이 답답하거나 숨이 차고, 식은땀과 함께 어깨나 팔이 아픈가요? | 119 | 지금 119에 전화하세요 |
| 어깨가 빠진 느낌이 들거나 모양이 변했나요? | 오늘 | 오늘 응급실로 가세요 |
| 열이 나거나, 어깨가 붉고 뜨겁게 부었나요? | 오늘 | 오늘 응급실로 가세요 |
| 무게를 들다가 다친 뒤로, 많이 아프지 않은데도 팔을 어깨 높이 위로 들 힘이 없나요? | 며칠 안 | 며칠 안에 정형외과 진료를 받으세요 |
| 쉬어도 밤새 계속 아프거나, 혹이 만져지거나, 이유 없이 살이 빠졌나요? | 빠른 시일 내 | 빠른 시일 내 진료를 받으세요 |
| 팔이나 손이 저리거나, 통증이 팔꿈치 아래까지 내려가나요? | 빠른 시일 내 | 빠른 시일 내 진료를 받으세요 |

**판단 규칙 (점수·기준선·조정 우선순위, 코드 그대로)**

```js
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
  }
```

**내부 보존: 질환명·진단 가능성 문장 (사용자 화면에 표시 안 함)**

| 변수 id | 화면 제목 | 연구에서 쓰는 이름 | 진단 관련 문장 (출처) |
| --- | --- | --- | --- |
| rc | 팔을 머리 위로 올리는 구간의 어깨 부담 | 회전근개 관련 통증 (어깨 충돌성 통증) | 통증 호는 진료실 검사에서 있으면 가능성을 약 2배 높이는 단서지만, 그것만으로 확진하진 못해요. (Michener 2009, Hegedus 2012) |
| acj | 팔을 끝까지 올리는 구간의 어깨 위쪽 부담 | 쇄골 끝 관절 통증 (견봉쇄골관절) | - |

### 컬·풀업 (팔꿈치) (`elb`)

**위험 신호와 진료 시점** · 출처: Alentorn-Geli 2016, Konarski 2022, Lucado 2022 (골절·감염 문항은 앱이 다른 부위 원칙을 옮긴 것)

| 문항 | 단계 | 화면 제목 |
| --- | --- | --- |
| 넘어지거나 부딪힌 뒤 팔꿈치가 붓고, 펴거나 굽히기 어렵나요? | 오늘 | 오늘 응급실로 가세요 |
| 열이 나고 팔꿈치가 붉고 뜨겁게 부었나요? | 오늘 | 오늘 응급실로 가세요 |
| 무거운 걸 들다가 "뚝" 하고, 팔꿈치 앞에 멍이 들거나 알통 모양이 변하거나 손바닥을 뒤집는 힘이 약해졌나요? | 며칠 안 | 며칠 안에 정형외과 진료를 받으세요 |
| 넷째·다섯째 손가락이 저리거나 감각이 둔하고, 손 힘이 약해졌나요? | 빠른 시일 내 | 빠른 시일 내 진료를 받으세요 |
| 목이 아프면서 저림이 팔꿈치 아래로 내려가나요? | 빠른 시일 내 | 빠른 시일 내 진료를 받으세요 |

**판단 규칙 (점수·기준선·조정 우선순위, 코드 그대로)**

```js
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
  }
```

**내부 보존: 질환명·진단 가능성 문장 (사용자 화면에 표시 안 함)**

| 변수 id | 화면 제목 | 연구에서 쓰는 이름 | 진단 관련 문장 (출처) |
| --- | --- | --- | --- |
| lat | 손등을 위로 하고 들거나 쥐는 동작의 팔꿈치 바깥쪽 부담 | 팔꿈치 바깥쪽 힘줄 통증 (외측 상과병증, 테니스 엘보) | 바깥쪽 뼈 부위 통증이 누르기, 손목·손가락 펴기 저항에서 재현되는 것으로 진단해요. (Lucado 2022) |
| med | 손목을 굽히고 쥐는 동작의 팔꿈치 안쪽 부담 | 팔꿈치 안쪽 힘줄 통증 (내측 상과병증, 골프 엘보) | 바깥쪽보다 7~10배 드물고, 손목 굽힘·아래팔 안쪽 돌리기 저항이 가장 민감한 검사예요. (Konarski 2022) |
| front | 팔꿈치 앞쪽 통증 → 진료 먼저 | 이두근 원위힘줄 문제 가능성 | 이두근 원위힘줄 파열은 팔꿈치 앞 통증, 멍, 알통 모양 변화, 손바닥 뒤집기 약화로 나타나요. (Alentorn-Geli 2016) |

### 딥스·벤치·푸시업 (손목) (`wri`)

**위험 신호와 진료 시점** · 출처: Shehab 2013 (미국 가정의학회 손목 통증 평가), Hanson & Lourie 2022

| 문항 | 단계 | 화면 제목 |
| --- | --- | --- |
| 넘어지며 손을 짚은 뒤 엄지 쪽 손목이 붓거나 눌렀을 때 아픈가요? | 오늘 | 오늘 진료를 받으세요 |
| 열이 나고 손목이 붉고 뜨겁게 부었나요? | 오늘 | 오늘 진료를 받으세요 |
| 다친 뒤 손목에 힘을 주면 "딸깍" 소리나 걸리는 느낌이 나며 아픈가요? | 며칠 안 | 며칠 안에 정형외과 진료를 받으세요 |
| 손가락이 저리거나 감각이 둔해졌나요? | 빠른 시일 내 | 빠른 시일 내 진료를 받으세요 |
| 이유 없이 붓고 계속 아프거나, 다른 관절도 같이 아픈가요? | 빠른 시일 내 | 빠른 시일 내 진료를 받으세요 |

**판단 규칙 (점수·기준선·조정 우선순위, 코드 그대로)**

```js
analyse(a) {
    const side = !has(a, "where", "dorsal");
    const patterns = side ? ["side"] : ["dorsal"];
    const picks = side ? [] : [["neutral", 1], ["reduce", has(a, "now", "same") || has(a, "spike", "yes") ? 1.5 : 2]];
    const r = finish(a, { side: side ? 1 : 0 }, patterns, picks, false);
    if (side) { r.referFirst = true; r.referWrist = true; }
    return r;
  }
```

**내부 보존: 질환명·진단 가능성 문장 (사용자 화면에 표시 안 함)**

| 변수 id | 화면 제목 | 연구에서 쓰는 이름 | 진단 관련 문장 (출처) |
| --- | --- | --- | --- |
| dorsal | 손목을 뒤로 꺾은 채 체중을 싣는 자세 | 손목 등쪽 통증 (등쪽 관절막 충돌 등) | 관절막 충돌은 대부분 2~3개월 쉬면 나아지지만 다시 하면 재발할 수 있어요(선수 대상 서술적 리뷰). (Hanson & Lourie 2022) |
| side | 손목 옆쪽·손바닥 쪽 통증 → 진료 먼저 | TFCC·힘줄·신경 문제 가능성 | 엄지 쪽은 힘줄염, 새끼손가락 쪽 저림은 척골신경 문제를 의심해요. (Shehab 2013) |

### 달리기 (무릎·정강이) (`run`)

**위험 신호와 진료 시점** · 출처: Patel 2011 (미국 가정의학회 피로골절 리뷰)

| 문항 | 단계 | 화면 제목 |
| --- | --- | --- |
| 넘어지거나 삐끗한 뒤 무릎이 바로 붓고, 체중을 싣기 어렵나요? | 오늘 | 오늘 진료를 받으세요 |
| 열이 나고 무릎이나 다리가 붉고 뜨겁게 부었나요? | 오늘 | 오늘 진료를 받으세요 |
| 정강이·발등의 한 곳(손가락 끝 크기)을 누르면 콕 아프고, 걸을 때도 아픈가요? | 며칠 안 | 며칠 안에 진료를 받으세요 |
| 달릴 때 사타구니나 엉덩이 깊은 곳이 아프고, 걸을 때도 아픈가요? | 며칠 안 | 며칠 안에 진료를 받으세요 |
| 무릎이 걸려서 끝까지 펴지지 않는 때가 있나요? | 며칠 안 | 며칠 안에 진료를 받으세요 |
| 전에 피로골절이 있었거나, 생리가 몇 달째 없나요? | 빠른 시일 내 | 빠른 시일 내 진료를 받으세요 |

**판단 규칙 (점수·기준선·조정 우선순위, 코드 그대로)**

```js
analyse(a) {
    const w = a.where || "front";
    const busy = has(a, "spike", "yes") || has(a, "now", "same");
    const picks = { front: [["strength", 1], ["volume", busy ? 1.5 : 2], ["cadence", 3]],
                    below: [["volume", 1], ["strength", 2]],
                    lat: [["volume", 1], ["cadence", 2], ["strength", 3]],
                    shin: [["volume", 1], ["cross", 2]] }[w];
    const pat = { front: "pfp", below: "pt", lat: "itb", shin: "mtss" }[w];
    return finish(a, { [pat]: 1 }, [pat], picks, has(a, "rest", "yes"));
  }
```

**내부 보존: 질환명·진단 가능성 문장 (사용자 화면에 표시 안 함)**

| 변수 id | 화면 제목 | 연구에서 쓰는 이름 | 진단 관련 문장 (출처) |
| --- | --- | --- | --- |
| pfp | 달리기·계단에서 무릎 앞에 걸리는 부담 | 무릎 앞쪽 통증 (슬개대퇴 통증) | - |
| pt | 점프·착지가 많은 운동의 무릎뼈 아래 부담 | 무릎뼈 아래 힘줄 통증 (슬개건병증) | - |
| itb | 거리를 늘린 뒤 무릎 바깥쪽 부담 | 무릎 바깥쪽 통증 (장경인대) | - |
| mtss | 충격이 반복되는 정강이 안쪽 부담 | 정강이 안쪽 통증 (정강이 부목) | 넓게 아프면 정강이 부목, 한 곳(2~3cm)만 콕 아프면 피로골절을 의심해요. (Saad 2025, Patel 2011) |

### 딥스·푸시업 (어깨) (`dps`)

**위험 신호와 진료 시점** · 출처: BESS/BOA 어깨 통증 진료 경로 (Rees 2021), Kolber 2010

| 문항 | 단계 | 화면 제목 |
| --- | --- | --- |
| 가슴이 답답하거나 숨이 차고, 식은땀과 함께 어깨나 팔이 아픈가요? | 119 | 지금 119에 전화하세요 |
| 어깨가 빠진 느낌이 들거나 모양이 변했나요? | 오늘 | 오늘 응급실로 가세요 |
| 열이 나거나, 어깨가 붉고 뜨겁게 부었나요? | 오늘 | 오늘 응급실로 가세요 |
| 딥스나 푸시업 중 "뚝" 하는 느낌과 함께 가슴·겨드랑이 앞이 아프고 힘이 빠졌나요? 멍이 들거나 겨드랑이 앞 모양이 달라졌다면 꼭 해당돼요. | 며칠 안 | 며칠 안에 정형외과 진료를 받으세요 |
| 쉬어도 밤새 계속 아프거나, 혹이 만져지거나, 이유 없이 살이 빠졌나요? | 빠른 시일 내 | 빠른 시일 내 진료를 받으세요 |
| 팔이나 손이 저리거나, 통증이 팔꿈치 아래까지 내려가나요? | 빠른 시일 내 | 빠른 시일 내 진료를 받으세요 |

**판단 규칙 (점수·기준선·조정 우선순위, 코드 그대로)**

```js
analyse(a) {
    const sc = { deep: 0, flare: 0, rc: 0, acj: 0, chest: 0 };
    if (has(a, "depth", "deep")) sc.deep += 3; else if (has(a, "depth", "par")) sc.deep += 1;
    if (has(a, "ex", "bdip")) sc.deep += 3;
    if (has(a, "when", "bottom")) sc.deep += 2;
    if (has(a, "where", "front")) sc.deep += 1;
    if (has(a, "flare", "wide")) sc.flare += 3;
    if (has(a, "ex", "push") || has(a, "ex", "both")) sc.flare += 1;
    if (has(a, "when", "arm")) sc.rc += 3;
    if (has(a, "where", "side")) sc.rc += 3;
    if (has(a, "where", "top")) sc.acj += 4;
    if (has(a, "where", "chest")) sc.chest += 4;
    const order = Object.entries(sc).sort((x, y) => y[1] - x[1]);
    const main = order[0][1] > 0 ? order[0][0] : "rc";
    const patterns = [main, ...order.filter(([k, v]) => k !== main && v >= 3).map(([k]) => k)].slice(0, 3);
    const picks = [];
    if (has(a, "ex", "bdip")) picks.push(["nobench", 1]);
    if (has(a, "depth", "deep") || has(a, "depth", "par") || main === "deep" || main === "chest") picks.push(["depth", 1.5]);
    if (has(a, "flare", "wide")) picks.push(["tuck", 1.5]);
    picks.push(["load", has(a, "spike", "yes") ? 2 : 4]);
    if (main === "rc" || main === "flare" || has(a, "acc", "never")) picks.push(["plus", 3]);
    if (has(a, "acc", "never") || has(a, "acc", "sometimes")) picks.push(["acc", 3.5]);
    return finish(a, sc, patterns, picks, false);
  }
```

**내부 보존: 질환명·진단 가능성 문장 (사용자 화면에 표시 안 함)**

| 변수 id | 화면 제목 | 연구에서 쓰는 이름 | 진단 관련 문장 (출처) |
| --- | --- | --- | --- |
| rc | 팔을 옆으로 들 때도 아픈 어깨 부담 | 회전근개 관련 통증 (어깨 충돌성 통증) | - |
| acj | 체중을 받을 때 어깨 위쪽 부담 | 쇄골 끝 관절 통증 | 쇄골 끝 골용해는 무거운 벤치를 자주, 오래 한 사람에게 많았어요. (Nevalainen 2016) |
| chest | 깊은 자세에서 가슴 근육이 늘어나며 받는 부담 | 대흉근 부담 | - |

### 풀업·랫풀다운 (어깨) (`pul`)

**위험 신호와 진료 시점** · 출처: BESS/BOA 어깨 통증 진료 경로 (Rees 2021), Kolber 2010

| 문항 | 단계 | 화면 제목 |
| --- | --- | --- |
| 가슴이 답답하거나 숨이 차고, 식은땀과 함께 어깨나 팔이 아픈가요? | 119 | 지금 119에 전화하세요 |
| 어깨가 빠진 느낌이 들거나 모양이 변했나요? | 오늘 | 오늘 응급실로 가세요 |
| 열이 나거나, 어깨가 붉고 뜨겁게 부었나요? | 오늘 | 오늘 응급실로 가세요 |
| 날개뼈가 갑자기 등에서 툭 튀어나오고, 팔을 앞이나 위로 들기가 힘들어졌나요? | 빠른 시일 내 | 빠른 시일 내 진료를 받으세요 |
| 쉬어도 밤새 계속 아프거나, 혹이 만져지거나, 이유 없이 살이 빠졌나요? | 빠른 시일 내 | 빠른 시일 내 진료를 받으세요 |
| 팔이나 손이 저리거나, 통증이 팔꿈치 아래까지 내려가나요? | 빠른 시일 내 | 빠른 시일 내 진료를 받으세요 |

**판단 규칙 (점수·기준선·조정 우선순위, 코드 그대로)**

```js
analyse(a) {
    const sc = { hi5: 0, chin: 0, rc: 0, instab: 0, acj: 0 };
    if (has(a, "ex", "neck")) sc.hi5 += 4;
    if (has(a, "grip", "wide")) sc.hi5 += 3;
    if (has(a, "where", "front")) sc.hi5 += 1;
    if (has(a, "ex", "chin")) sc.chin += 3;
    if (has(a, "when", "arm")) sc.rc += 3;
    if (has(a, "where", "side")) sc.rc += 3;
    if (has(a, "unstable", "yes")) sc.instab += 6;
    if (has(a, "where", "top")) sc.acj += 4;
    const order = Object.entries(sc).sort((x, y) => y[1] - x[1]);
    const main = order[0][1] > 0 ? order[0][0] : "rc";
    const patterns = [main, ...order.filter(([k, v]) => k !== main && v >= 3).map(([k]) => k)].slice(0, 3);
    const picks = [];
    if (has(a, "ex", "neck")) picks.push(["front", 1]);
    if (has(a, "grip", "wide") || has(a, "ex", "chin")) picks.push(["grip", 1.5]);
    if (has(a, "ex", "pull") || has(a, "ex", "chin")) picks.push(["assist", 2]);
    picks.push(["load", has(a, "spike", "yes") ? 1.8 : 3]);
    if (has(a, "acc", "never") || has(a, "acc", "sometimes")) picks.push(["acc", 3.5]);
    const r = finish(a, sc, patterns, has(a, "unstable", "yes") ? [] : picks, false);
    if (has(a, "unstable", "yes")) { r.referFirst = true; r.referInstab = true; }
    return r;
  }
```

**내부 보존: 질환명·진단 가능성 문장 (사용자 화면에 표시 안 함)**

| 변수 id | 화면 제목 | 연구에서 쓰는 이름 | 진단 관련 문장 (출처) |
| --- | --- | --- | --- |
| rc | 팔을 옆·위로 들 때도 아픈 어깨 부담 | 회전근개 관련 통증 (어깨 충돌성 통증) | - |
| instab | 팔을 젖힐 때 빠질 듯한 느낌 → 진료 먼저 | 어깨 앞쪽 불안정성 | 웨이트하는 사람의 어깨 앞쪽 불안정성은 하이파이브 자세(목 뒤 랫풀다운·프레스, 넓은 벤치)에서 통증이 생겼다고 보고됐어요(20명 증례). (Kolber 2010) |
| acj | 당길 때 어깨 위쪽 부담 | 쇄골 끝 관절 통증 | 쇄골 끝 골용해는 무거운 벤치를 자주, 오래 한 사람에게 많았어요. (Nevalainen 2016) |

### 스쿼트·런지·레그프레스 (고관절) (`hip`)

**위험 신호와 진료 시점** · 출처: Doha 합의 (Weir 2015) '놓치면 안 되는 원인', Patel 2011

| 문항 | 단계 | 화면 제목 |
| --- | --- | --- |
| 넘어지거나 부딪힌 뒤 고관절이 아프고, 체중을 싣고 걷기 어렵나요? | 오늘 | 오늘 진료를 받으세요 |
| 열이 나고, 고관절이 아파서 다리를 거의 움직이지 못하나요? | 오늘 | 오늘 진료를 받으세요 |
| 달리기나 운동량을 늘린 뒤로 사타구니 깊은 곳이 아프고, 걸을 때나 쉴 때도 아픈가요? | 며칠 안 | 며칠 안에 정형외과 진료를 받으세요 |
| 소변 볼 때 아프거나, 배가 아프거나, 고환·아랫배가 붓거나 혹이 만져지나요? | 빠른 시일 내 | 빠른 시일 내 진료를 받으세요 |
| 허리부터 다리로 저림이 내려가거나, 감각이 둔해졌나요? | 빠른 시일 내 | 빠른 시일 내 진료를 받으세요 |
| 이유 없이 살이 빠지거나, 쉬어도 밤새 계속 아픈가요? | 빠른 시일 내 | 빠른 시일 내 진료를 받으세요 |

**판단 규칙 (점수·기준선·조정 우선순위, 코드 그대로)**

```js
analyse(a) {
    const sc = { hipj: 0, add: 0, ilio: 0, side: 0 };
    if (has(a, "where", "deep")) sc.hipj += 3;
    if (has(a, "when", "bottom")) sc.hipj += 2;
    if (has(a, "when", "daily")) sc.hipj += 1;
    if (has(a, "mech", "yes")) sc.hipj += 2;
    if (has(a, "where", "inner")) sc.add += 3;
    if (has(a, "when", "spread")) sc.add += 2;
    if (has(a, "ex", "wide")) sc.add += 1;
    if (has(a, "where", "front")) sc.ilio += 3;
    if (has(a, "when", "lift")) sc.ilio += 2;
    if (has(a, "where", "side")) sc.side += 6;
    const order = Object.entries(sc).sort((x, y) => y[1] - x[1]);
    const main = order[0][1] > 0 ? order[0][0] : "hipj";
    const patterns = [main, ...order.filter(([k, v]) => k !== main && v >= 3).map(([k]) => k)].slice(0, 2);
    if (main === "side") {
      const r = finish(a, sc, patterns, [], has(a, "when", "daily"));
      r.referFirst = true; r.referHip = true; return r;
    }
    const picks = [];
    if (main === "hipj" || has(a, "depth", "deep")) picks.push(["depth", 1]);
    if (main === "add" || has(a, "ex", "wide")) picks.push(["stance", 1.2]); else picks.push(["stance", 3.5]);
    picks.push(["strength", 2]);
    picks.push(["active", has(a, "spike", "yes") ? 1.5 : 3]);
    const r = finish(a, sc, patterns, picks, false);
    if (has(a, "mech", "yes")) { r.referFirst = true; r.referHip = true; }
    return r;
  }
```

**내부 보존: 질환명·진단 가능성 문장 (사용자 화면에 표시 안 함)**

| 변수 id | 화면 제목 | 연구에서 쓰는 이름 | 진단 관련 문장 (출처) |
| --- | --- | --- | --- |
| hipj | 고관절을 깊이 접는 구간의 사타구니 부담 | 고관절 관련 사타구니 통증 (고관절 충돌 증후군 등) | 국제 합의는 움직임이나 자세에 따른 고관절·사타구니 통증을 고관절 충돌 증후군의 주된 증상으로 봐요. 진단에는 증상·진찰·영상이 모두 필요해요. (Warwick 합의 (Griffin 2016)) |
| add | 다리를 넓게 벌리는 동작의 허벅지 안쪽 부담 | 내전근 관련 사타구니 통증 | 국제 합의는 내전근 쪽 누름 통증과 다리를 모으는 힘을 줄 때의 통증을 내전근 관련 사타구니 통증으로 정의해요. (Doha 합의 (Weir 2015)) |
| ilio | 다리를 들어 올리는 동작의 엉덩이 앞쪽 부담 | 장요근 관련 사타구니 통증 | 국제 합의는 장요근 누름 통증이 있고, 다리를 드는 힘을 주거나 늘릴 때 아프면 장요근 관련 사타구니 통증일 가능성이 크다고 해요. (Doha 합의 (Weir 2015)) |
| side | 엉덩이 바깥쪽 통증 → 진료 먼저 | 엉덩이 바깥쪽 힘줄·점액낭 문제 가능성 | - |

### 바벨 로우 (허리) (`row`)

**위험 신호와 진료 시점** · 출처: Finucane 2020 척추 위험 신호 국제 프레임워크

| 문항 | 단계 | 화면 제목 |
| --- | --- | --- |
| 사타구니나 항문 주변 감각이 무뎌졌거나, 소변·대변을 참기 어렵거나 보기 어렵게 변했나요? | 119 | 지금 바로 응급실로 가세요 |
| 다리나 발에 힘이 점점 빠지거나(발이 끌림), 다리 통증이 한쪽에서 양쪽으로 번졌나요? | 119 | 지금 바로 응급실로 가세요 |
| 높은 곳에서 떨어지거나 사고를 당했나요? 또는 골다공증이 있거나 스테로이드를 3개월 넘게 쓰고 있나요? | 오늘 | 오늘 응급실로 가세요 |
| 열이 나거나 온몸이 아프고, 면역이 떨어지는 병이나 주사 약물 사용이 있나요? | 오늘 | 오늘 응급실로 가세요 |
| 암을 앓은 적이 있거나, 이유 없이 살이 빠지거나, 쉬어도 밤새 계속 점점 심하게 아픈가요? | 빠른 시일 내 | 빠른 시일 내 진료를 받으세요 |
| 다리가 저리거나 감각이 둔하고, 통증이 무릎 아래로 내려가나요? | 빠른 시일 내 | 빠른 시일 내 진료를 받으세요 |

**판단 규칙 (점수·기준선·조정 우선순위, 코드 그대로)**

```js
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
  }
```

**내부 보존: 질환명·진단 가능성 문장 (사용자 화면에 표시 안 함)**

| 변수 id | 화면 제목 | 연구에서 쓰는 이름 | 진단 관련 문장 (출처) |
| --- | --- | --- | --- |
| nsp | 허리에 걸리는 전체 운동 부하 | 비특이적 허리 통증 | - |
| nerve | 다리로 내려가는 증상 → 진료 먼저 | 신경 뿌리 자극 (좌골신경통) | - |
