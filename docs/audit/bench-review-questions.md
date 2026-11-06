# 벤치프레스 — 전문가 검토가 필요한 판단 규칙

> 자동 생성 문서 — `node tools/audit/build-trace.js --topic bench` 로 다시 만든다. 직접 고치지 말 것.
> 콘텐츠 버전 8.2 · 코드 지문 `8d95c2721854` (코드가 바뀌면 `node tools/audit/verify-trace.js`가 알려준다)
> "수동 검토 필요" 표시는 코드에서 자동으로 확인할 수 없어 사람이 확인해야 하는 곳이다. 추측으로 채우지 않았다.

이 목록은 **질문만** 정리한다. 의학적 판단이나 새 기준은 담지 않는다. 모든 항목의 검토 상태는 `content/review-status.js` 기준 **검토 전**이다(이 문서는 상태를 바꾸지 않는다).
항목 번호(B·C)는 [expert-review-pending.md](../expert-review-pending.md)의 번호이고, 규칙 ID는 [bench-traceability.md](bench-traceability.md)와 같다. 규칙 ID와 검토 항목 번호의 연결은 사람이 한 것이다(`tools/audit/manual/bench.json`).

## 1. 점수 규칙

| 규칙 ID | 코드 원문·내용 | 검토 항목 | 이 규칙과 코드상 연결된 근거 위치 | 전문가에게 물을 것 |
| --- | --- | --- | --- | --- |
| `bench.S.rc.where=front/where=sideback` | where=front 또는 where=sideback → rc +2 | C1 | bench.pat.rc.evText (Pieters 2020)<br>bench.pat.rc.evText (Kibler 2013) | 이 답이 이 운동 변수와 연결된다는 근거가 있나요? 점수 크기(다른 규칙과의 상대 크기)가 적절한가요? |
| `bench.S.rc.other=lateral` | other=lateral → rc +1 | C1 | bench.pat.rc.evText (Pieters 2020)<br>bench.pat.rc.evText (Kibler 2013) | 이 답이 이 운동 변수와 연결된다는 근거가 있나요? 점수 크기(다른 규칙과의 상대 크기)가 적절한가요? |
| `bench.S.rc.other=upright` | other=upright → rc +1 | C1 | bench.pat.rc.evText (Pieters 2020)<br>bench.pat.rc.evText (Kibler 2013) | 이 답이 이 운동 변수와 연결된다는 근거가 있나요? 점수 크기(다른 규칙과의 상대 크기)가 적절한가요? |
| `bench.S.rc.other=ohp` | other=ohp → rc +1 | C1 | bench.pat.rc.evText (Pieters 2020)<br>bench.pat.rc.evText (Kibler 2013) | 이 답이 이 운동 변수와 연결된다는 근거가 있나요? 점수 크기(다른 규칙과의 상대 크기)가 적절한가요? |
| `bench.S.rc.daily=overhead` | daily=overhead → rc +2 | C1 | bench.pat.rc.evText (Pieters 2020)<br>bench.pat.rc.evText (Kibler 2013) | 이 답이 이 운동 변수와 연결된다는 근거가 있나요? 점수 크기(다른 규칙과의 상대 크기)가 적절한가요? |
| `bench.S.rc.when=lower/when=press` | when=lower 또는 when=press → rc +1 | C1 | bench.pat.rc.evText (Pieters 2020)<br>bench.pat.rc.evText (Kibler 2013) | 이 답이 이 운동 변수와 연결된다는 근거가 있나요? 점수 크기(다른 규칙과의 상대 크기)가 적절한가요? |
| `bench.S.acj.where=top` | where=top → acj +4 | C1 | bench.pat.acj.evText (Nevalainen 2016)<br>bench.pat.acj.evText (Noteboom 2024) | 이 답이 이 운동 변수와 연결된다는 근거가 있나요? 점수 크기(다른 규칙과의 상대 크기)가 적절한가요? |
| `bench.S.acj.daily=cross` | daily=cross → acj +1 | C1 | bench.pat.acj.evText (Nevalainen 2016)<br>bench.pat.acj.evText (Noteboom 2024) | 이 답이 이 운동 변수와 연결된다는 근거가 있나요? 점수 크기(다른 규칙과의 상대 크기)가 적절한가요? |
| `bench.S.acj.grip=g2` | grip=g2 → acj +2 | B2, C1 | bench.pat.acj.evText (Nevalainen 2016)<br>bench.pat.acj.evText (Noteboom 2024) | 이 답이 이 운동 변수와 연결된다는 근거가 있나요? 점수 크기(다른 규칙과의 상대 크기)가 적절한가요? |
| `bench.S.acj.grip=g15` | grip=g15 → acj +1 | B2, C1 | bench.pat.acj.evText (Nevalainen 2016)<br>bench.pat.acj.evText (Noteboom 2024) | 이 답이 이 운동 변수와 연결된다는 근거가 있나요? 점수 크기(다른 규칙과의 상대 크기)가 적절한가요? |
| `bench.S.acj.load=gt15` | load=gt15 → acj +2 | B2, C1 | bench.pat.acj.evText (Nevalainen 2016)<br>bench.pat.acj.evText (Noteboom 2024) | 이 답이 이 운동 변수와 연결된다는 근거가 있나요? 점수 크기(다른 규칙과의 상대 크기)가 적절한가요? |
| `bench.S.scap.scap=no/scap=unsure` | scap=no 또는 scap=unsure → scap +2 | C1 | bench.pat.scap.evText (Kibler 2013)<br>bench.pat.scap.evText (Hickey 2018) | 이 답이 이 운동 변수와 연결된다는 근거가 있나요? 점수 크기(다른 규칙과의 상대 크기)가 적절한가요? |
| `bench.S.scap.acc=never` | acc=never → scap +1 | C1 | bench.pat.scap.evText (Kibler 2013)<br>bench.pat.scap.evText (Hickey 2018) | 이 답이 이 운동 변수와 연결된다는 근거가 있나요? 점수 크기(다른 규칙과의 상대 크기)가 적절한가요? |

## 2. 변수 선택 규칙

| 규칙 ID | 코드 원문·내용 | 검토 항목 | 이 규칙과 코드상 연결된 근거 위치 | 전문가에게 물을 것 |
| --- | --- | --- | --- | --- |
| `bench.SEL.1` | const main = sc.acj > sc.rc ? "acj" : "rc"; | C1 | bench.pat.rc.evText (Pieters 2020)<br>bench.pat.rc.evText (Kibler 2013)<br>bench.pat.acj.evText (Nevalainen 2016)<br>bench.pat.acj.evText (Noteboom 2024)<br>bench.adj.load.fact (BESS/BOA 2021)<br>bench.adj.load.fact (Nevalainen 2016)<br>bench.adj.load.hypo (출처 없음)<br>bench.adj.load.how (출처 없음) | 이 방식으로 먼저 점검할 변수를 정해도 되나요? |
| `bench.SEL.2` | const other = main === "rc" ? "acj" : "rc"; | C1 | bench.pat.rc.evText (Pieters 2020)<br>bench.pat.rc.evText (Kibler 2013)<br>bench.pat.acj.evText (Nevalainen 2016)<br>bench.pat.acj.evText (Noteboom 2024) | 이 방식으로 먼저 점검할 변수를 정해도 되나요? |
| `bench.SEL.3` | const patterns = [main]; | C1 | bench.pat.rc.evText (Pieters 2020)<br>bench.pat.rc.evText (Kibler 2013)<br>bench.pat.acj.evText (Nevalainen 2016)<br>bench.pat.acj.evText (Noteboom 2024) | 이 방식으로 먼저 점검할 변수를 정해도 되나요? |
| `bench.SEL.4` | if (sc[other] >= 3) patterns.push(other); | C1 | bench.pat.rc.evText (Pieters 2020)<br>bench.pat.rc.evText (Kibler 2013)<br>bench.pat.acj.evText (Nevalainen 2016)<br>bench.pat.acj.evText (Noteboom 2024) | 이 기준선(숫자)으로 함께 보여줄 변수를 정해도 되나요? |
| `bench.SEL.5` | if (sc.scap >= 2) patterns.push("scap"); | C1 | bench.pat.scap.evText (Kibler 2013)<br>bench.pat.scap.evText (Hickey 2018) | 이 기준선(숫자)으로 함께 보여줄 변수를 정해도 되나요? |
| `common.F.zero` | 점수표에 있는 변수 중 0점인 변수는 결과에서 뺀다. | C9 | bench.pat.rc.evText (Pieters 2020)<br>bench.pat.rc.evText (Kibler 2013)<br>bench.pat.acj.evText (Nevalainen 2016)<br>bench.pat.acj.evText (Noteboom 2024)<br>bench.pat.scap.evText (Kibler 2013)<br>bench.pat.scap.evText (Hickey 2018) | 이 방식으로 먼저 점검할 변수를 정해도 되나요? |
| `common.F.unclearNoAdj` | 맨 앞 변수가 빠지고 남는 변수가 없으면 조정도 보여주지 않는다('좁히기 어려움' 안내). | C9 | bench.adj.load.fact (BESS/BOA 2021)<br>bench.adj.load.fact (Nevalainen 2016)<br>bench.adj.load.hypo (출처 없음)<br>bench.adj.load.how (출처 없음)<br>bench.adj.grip.fact (Noteboom 2024)<br>bench.adj.grip.hypo (출처 없음)<br>bench.adj.grip.how (출처 없음)<br>bench.adj.scap.fact (Noteboom 2024)<br>bench.adj.scap.hypo (출처 없음)<br>bench.adj.scap.how (출처 없음)<br>bench.adj.elbow.fact (Noteboom 2024)<br>bench.adj.elbow.hypo (출처 없음)<br>bench.adj.elbow.how (출처 없음)<br>bench.adj.acc.fact (Pieters 2020)<br>bench.adj.acc.fact (Kibler 2013)<br>bench.adj.acc.hypo (출처 없음)<br>bench.adj.acc.how (출처 없음)<br>bench.adj.flex.fact (Kibler 2013)<br>bench.adj.flex.fact (MedBridge)<br>bench.adj.flex.hypo (출처 없음)<br>bench.adj.flex.how (출처 없음) | 이 방식으로 먼저 점검할 변수를 정해도 되나요? |

## 3. 조정 후보와 우선순위

| 규칙 ID | 코드 원문·내용 | 검토 항목 | 이 규칙과 코드상 연결된 근거 위치 | 전문가에게 물을 것 |
| --- | --- | --- | --- | --- |
| `bench.P.load` | picks.push(["load", main === "acj" \|\| has(a, "load", "gt15") ? 1 : 6]); | C2 | bench.adj.load.fact (BESS/BOA 2021)<br>bench.adj.load.fact (Nevalainen 2016)<br>bench.adj.load.hypo (출처 없음)<br>bench.adj.load.how (출처 없음) | 이 답에서 이 조정을 후보로 내도 되나요? 우선순위 숫자가 적절한가요? |
| `bench.P.grip` | if (has(a, "grip", "g15") \|\| has(a, "grip", "g2")) picks.push(["grip", 2]); | C2 | bench.adj.grip.fact (Noteboom 2024)<br>bench.adj.grip.hypo (출처 없음)<br>bench.adj.grip.how (출처 없음) | 이 답에서 이 조정을 후보로 내도 되나요? 우선순위 숫자가 적절한가요? |
| `bench.P.scap` | if (has(a, "scap", "no") \|\| has(a, "scap", "unsure")) picks.push(["scap", 3]); | C2 | bench.adj.scap.fact (Noteboom 2024)<br>bench.adj.scap.hypo (출처 없음)<br>bench.adj.scap.how (출처 없음) | 이 답에서 이 조정을 후보로 내도 되나요? 우선순위 숫자가 적절한가요? |
| `bench.P.elbow` | if (has(a, "elbow", "flared") \|\| has(a, "elbow", "tucked")) picks.push(["elbow", 5]); | C2 | bench.adj.elbow.fact (Noteboom 2024)<br>bench.adj.elbow.hypo (출처 없음)<br>bench.adj.elbow.how (출처 없음) | 이 답에서 이 조정을 후보로 내도 되나요? 우선순위 숫자가 적절한가요? |
| `bench.P.acc` | if (has(a, "acc", "never") \|\| has(a, "acc", "sometimes")) picks.push(["acc", 4]); | C2 | bench.adj.acc.fact (Pieters 2020)<br>bench.adj.acc.fact (Kibler 2013)<br>bench.adj.acc.hypo (출처 없음)<br>bench.adj.acc.how (출처 없음) | 이 답에서 이 조정을 후보로 내도 되나요? 우선순위 숫자가 적절한가요? |
| `bench.P.flex` | if (has(a, "daily", "cross") \|\| has(a, "daily", "behind")) picks.push(["flex", 7]); | B6, C2 | bench.adj.flex.fact (Kibler 2013)<br>bench.adj.flex.fact (MedBridge)<br>bench.adj.flex.hypo (출처 없음)<br>bench.adj.flex.how (출처 없음) | 이 답에서 이 조정을 후보로 내도 되나요? 우선순위 숫자가 적절한가요? |
| `common.F.top3` | 조정 후보를 우선순위 숫자가 작은 순으로 정렬해 상위 3개만 보여준다. 같은 숫자는 코드에 넣은 순서대로. | C2 | bench.adj.load.fact (BESS/BOA 2021)<br>bench.adj.load.fact (Nevalainen 2016)<br>bench.adj.load.hypo (출처 없음)<br>bench.adj.load.how (출처 없음)<br>bench.adj.grip.fact (Noteboom 2024)<br>bench.adj.grip.hypo (출처 없음)<br>bench.adj.grip.how (출처 없음)<br>bench.adj.scap.fact (Noteboom 2024)<br>bench.adj.scap.hypo (출처 없음)<br>bench.adj.scap.how (출처 없음)<br>bench.adj.elbow.fact (Noteboom 2024)<br>bench.adj.elbow.hypo (출처 없음)<br>bench.adj.elbow.how (출처 없음)<br>bench.adj.acc.fact (Pieters 2020)<br>bench.adj.acc.fact (Kibler 2013)<br>bench.adj.acc.hypo (출처 없음)<br>bench.adj.acc.how (출처 없음)<br>bench.adj.flex.fact (Kibler 2013)<br>bench.adj.flex.fact (MedBridge)<br>bench.adj.flex.hypo (출처 없음)<br>bench.adj.flex.how (출처 없음) | 상위 3개만 보여주는 것이 적절한가요? 같은 우선순위일 때 순서는? |

## 4. 진료 먼저와 조정

| 규칙 ID | 코드 원문·내용 | 검토 항목 | 이 규칙과 코드상 연결된 근거 위치 | 전문가에게 물을 것 |
| --- | --- | --- | --- | --- |
| `common.F.referLong` | 아픈 지 6주 이상(dur=gt6)이면 '진료를 먼저 권해요'. | C4 | - | 이 조건에서 진료를 먼저 권하는 것과, 조정을 함께 보여주거나 숨기는 것이 적절한가요? (C11 사례: docs/c11-review-cases.md) |
| `common.F.referWorse` | 나빠지는 중(trend=worse)이면 '진료를 먼저 권해요'. | C4 | - | 이 조건에서 진료를 먼저 권하는 것과, 조정을 함께 보여주거나 숨기는 것이 적절한가요? (C11 사례: docs/c11-review-cases.md) |
| `common.F.referOnly` | '→ 진료 먼저' 변수(referOnly)가 결과에 있으면 조정을 보여주지 않는다. | C11 | bench.adj.load.fact (BESS/BOA 2021)<br>bench.adj.load.fact (Nevalainen 2016)<br>bench.adj.load.hypo (출처 없음)<br>bench.adj.load.how (출처 없음)<br>bench.adj.grip.fact (Noteboom 2024)<br>bench.adj.grip.hypo (출처 없음)<br>bench.adj.grip.how (출처 없음)<br>bench.adj.scap.fact (Noteboom 2024)<br>bench.adj.scap.hypo (출처 없음)<br>bench.adj.scap.how (출처 없음)<br>bench.adj.elbow.fact (Noteboom 2024)<br>bench.adj.elbow.hypo (출처 없음)<br>bench.adj.elbow.how (출처 없음)<br>bench.adj.acc.fact (Pieters 2020)<br>bench.adj.acc.fact (Kibler 2013)<br>bench.adj.acc.hypo (출처 없음)<br>bench.adj.acc.how (출처 없음)<br>bench.adj.flex.fact (Kibler 2013)<br>bench.adj.flex.fact (MedBridge)<br>bench.adj.flex.hypo (출처 없음)<br>bench.adj.flex.how (출처 없음) | 이 조건에서 진료를 먼저 권하는 것과, 조정을 함께 보여주거나 숨기는 것이 적절한가요? (C11 사례: docs/c11-review-cases.md) |
| `common.F.referFirst` | 주제 조건·6주 이상·악화 중 하나면 결과 맨 위에 '진료를 먼저 권해요'를 띄우고 조정은 '참고만'으로 함께 보여준다. | C4, C11 | - | 이 조건에서 진료를 먼저 권하는 것과, 조정을 함께 보여주거나 숨기는 것이 적절한가요? (C11 사례: docs/c11-review-cases.md) |
| `bench.REFER.daily` | return finish(a, sc, patterns, picks, has(a, "when", "daily")); | C4 | - | 이 조건에서 진료를 먼저 권하는 것과, 조정을 함께 보여주거나 숨기는 것이 적절한가요? (C11 사례: docs/c11-review-cases.md) |

## 5. 위험 신호와 단계

| 규칙 ID | 코드 원문·내용 | 검토 항목 | 이 규칙과 코드상 연결된 근거 위치 | 전문가에게 물을 것 |
| --- | --- | --- | --- | --- |
| `bench.FLAG.cardiac` | 가슴이 답답하거나 숨이 차고, 식은땀과 함께 어깨나 팔이 아픈가요? → 단계 0 (지금 119에 전화하세요) | C6 | bench.flags.flagSrc (BESS/BOA 어깨 통증 진료 경로 (Rees 2021))<br>bench.flags.flagSrc (ElMaraghy 2012) | 빠진 신호나 지나친 신호가 있나요? 안내 단계(시점)가 적절한가요? |
| `bench.FLAG.disloc` | 어깨가 빠진 느낌이 들거나 모양이 변했나요? → 단계 1 (오늘 응급실로 가세요) | C6 | bench.flags.flagSrc (BESS/BOA 어깨 통증 진료 경로 (Rees 2021))<br>bench.flags.flagSrc (ElMaraghy 2012) | 빠진 신호나 지나친 신호가 있나요? 안내 단계(시점)가 적절한가요? |
| `bench.FLAG.infect` | 열이 나거나, 어깨가 붉고 뜨겁게 부었나요? → 단계 1 (오늘 응급실로 가세요) | C6 | bench.flags.flagSrc (BESS/BOA 어깨 통증 진료 경로 (Rees 2021))<br>bench.flags.flagSrc (ElMaraghy 2012) | 빠진 신호나 지나친 신호가 있나요? 안내 단계(시점)가 적절한가요? |
| `bench.FLAG.tear` | 무거운 무게를 내리다 "뚝" 하는 느낌과 함께 아프고 힘이 빠졌나요? 가슴이나 겨드랑이 모양이 그대로여도 해당돼요. → 단계 2 (며칠 안에 정형외과 진료를 받으세요) | C6 | bench.flags.flagSrc (BESS/BOA 어깨 통증 진료 경로 (Rees 2021))<br>bench.flags.flagSrc (ElMaraghy 2012) | 빠진 신호나 지나친 신호가 있나요? 안내 단계(시점)가 적절한가요? |
| `bench.FLAG.night` | 쉬어도 밤새 계속 아프거나, 혹이 만져지거나, 이유 없이 살이 빠졌나요? → 단계 3 (빠른 시일 내 진료를 받으세요) | C6 | bench.flags.flagSrc (BESS/BOA 어깨 통증 진료 경로 (Rees 2021))<br>bench.flags.flagSrc (ElMaraghy 2012) | 빠진 신호나 지나친 신호가 있나요? 안내 단계(시점)가 적절한가요? |
| `bench.FLAG.neck` | 팔이나 손이 저리거나, 통증이 팔꿈치 아래까지 내려가나요? → 단계 3 (빠른 시일 내 진료를 받으세요) | C6 | bench.flags.flagSrc (BESS/BOA 어깨 통증 진료 경로 (Rees 2021))<br>bench.flags.flagSrc (ElMaraghy 2012) | 빠진 신호나 지나친 신호가 있나요? 안내 단계(시점)가 적절한가요? |

## 6. 질문 문항·선택지

| 규칙 ID | 코드 원문·내용 | 검토 항목 | 이 규칙과 코드상 연결된 근거 위치 | 전문가에게 물을 것 |
| --- | --- | --- | --- | --- |
| `bench.Q.where` | 어디가 아픈가요? [front, top, sideback, unsure] | - | - | 일반 이용자가 정확히 답할 수 있나요? 선택지 구간이 적절한가요? |
| `bench.Q.when` | 언제 가장 아픈가요? [lower, press, after, daily] | - | - | 일반 이용자가 정확히 답할 수 있나요? 선택지 구간이 적절한가요? |
| `bench.Q.grip` | 벤치 그립 너비는 어느 정도인가요? [g1, g15, g2] | B5 | - | 일반 이용자가 정확히 답할 수 있나요? 선택지 구간이 적절한가요? |
| `bench.Q.elbow` | 바를 내릴 때 팔꿈치는 어떻게 되나요? [tucked, mid, flared] | B4 | - | 일반 이용자가 정확히 답할 수 있나요? 선택지 구간이 적절한가요? |
| `bench.Q.scap` | 날개뼈를 모으고 아래로 내린 채로 벤치를 하나요? [yes, no, unsure] | - | - | 일반 이용자가 정확히 답할 수 있나요? 선택지 구간이 적절한가요? |
| `bench.Q.other` | 벤치 말고 아픈 운동이 있나요? [lateral, upright, ohp, dips, none] | - | - | 일반 이용자가 정확히 답할 수 있나요? 선택지 구간이 적절한가요? |
| `bench.Q.daily` | 최근 일상에서 불편했던 동작이 있나요? [cross, behind, overhead, none] | - | - | 일반 이용자가 정확히 답할 수 있나요? 선택지 구간이 적절한가요? |
| `bench.Q.load` | 벤치 최고 무게(1RM)는 내 체중의 몇 배쯤인가요? [lt1, mid, gt15, unknown] | B3 | - | 일반 이용자가 정확히 답할 수 있나요? 선택지 구간이 적절한가요? |
| `bench.Q.dur` | 아픈 지 얼마나 됐나요? [lt2, w2to6, gt6] | - | - | 일반 이용자가 정확히 답할 수 있나요? 선택지 구간이 적절한가요? |
| `bench.Q.trend` | 요즘 통증은 어떻게 변하고 있나요? [better, same, worse] | - | - | 일반 이용자가 정확히 답할 수 있나요? 선택지 구간이 적절한가요? |
| `bench.Q.acc` | 밴드 외회전이나 날개뼈 운동 같은 보조운동을 하나요? [regular, sometimes, never] | - | - | 일반 이용자가 정확히 답할 수 있나요? 선택지 구간이 적절한가요? |

## 7. 앱이 '검증 안 된 가설'로 표시한 내용

| 위치 | 내용 |
| --- | --- |
| `bench.adj.load.hypo` (content/topics/bench.js:44) | "주 1회"로 줄이라는 횟수는 앱이 정한 값이에요. 얼마 동안 해야 하는지는 정해 두지 않았어요. |
| `bench.adj.grip.hypo` (content/topics/bench.js:46) | 그립을 바꾸면 실제로 통증이 줄어드는지는 사람 대상으로 확인되지 않았어요. |
| `bench.adj.scap.hypo` (content/topics/bench.js:48) | 실제로 통증이 줄어드는지는 사람 대상으로 확인되지 않았어요. |
| `bench.adj.elbow.hypo` (content/topics/bench.js:50) | 약 70°를 권하는 건 모델 결과를 바탕으로 한 앱의 제안이에요. 통증이 줄어드는지는 확인되지 않았어요. |
| `bench.adj.acc.hypo` (content/common.js:39) | 여기 적은 두 운동은 앱이 고른 예시예요. 어떤 운동을 몇 번 하는 게 가장 좋은지는 정해져 있지 않아요. |
| `bench.adj.flex.hypo` (content/topics/bench.js:53) | 팔을 가로지르는 동작이 불편한 사람에게 이 스트레칭을 연결한 건 앱의 판단이에요. |

## 8. 출처가 여러 개라 문장-연구 대응을 사람이 확인해야 하는 곳

- `bench.pat.rc.evText` (content/common.js:35): 출처 "Pieters 2020, Kibler 2013" — "진료에서 '팔을 들 때 아픈 어깨 통증'으로 분류된 사람에게는 운동치료가 1차 치료라는 근거가 강해요. 다만 이 분류 이름 자체는 모호해요."
- `bench.pat.acj.evText` (content/topics/bench.js:35): 출처 "Nevalainen 2016, Noteboom 2024" — "체중의 1.5배 넘는 벤치, 주 1회 초과, 5년 이상이 겹치면 위험이 크게 높아졌어요 (MRI 환자-대조 연구)."
- `bench.pat.scap.evText` (content/topics/bench.js:40): 출처 "Kibler 2013, Hickey 2018" — "통증 없는 사람에게도 70% 넘게 보여서, 이것만으로 원인이라고 보진 않아요."
- `bench.adj.load.fact` (content/topics/bench.js:44): 출처 "BESS/BOA 2021, Nevalainen 2016" — "무게를 낮추는 건 어깨 통증 보존적 관리의 기본 원칙이에요. 체중 1.5배 넘는 벤치, 주 1회 초과, 5년 이상이 겹치면 MRI에서 쇄골 끝 뼈가 녹는 변화가 생길 위험이 높았어요."
- `bench.adj.acc.fact` (content/common.js:39): 출처 "Pieters 2020, Kibler 2013" — "운동치료는 진료에서 '팔을 들 때 아픈 어깨 통증'으로 분류된 사람의 1차 치료로 권고돼요. 날개뼈 중심 운동이 단기에 일반 운동보다 나았어요."
- `bench.adj.flex.fact` (content/topics/bench.js:53): 출처 "Kibler 2013, MedBridge" — "전문가 합의문은 어깨 뒤쪽이 뻣뻣하면 날개뼈가 앞으로 끌려갈 수 있고, 재활은 유연성 확보부터 시작한다고 봐요."
- `bench.flags.flagSrc` (content/topics/bench.js:8): 출처 "BESS/BOA 어깨 통증 진료 경로 (Rees 2021), ElMaraghy 2012" — "위험 신호 문항과 진료 안내 단계"
- `bench.card.2` (content/topics/bench.js:104): 출처 "Barrett 2016, Sepehri 2024" — "자세만으로 통증 원인이라고 보긴 어려워요. 등이 굽은 정도는 어깨가 아픈 사람과 안 아픈 사람 사이에 차이가 없었어요. 교정 운동으로 자세 각도는 좋아지지만, 그게 통증을 줄인다는 근거는 아직 없어요."

## 9. 연구 목록(content/studies.js)에 없는 출처

- Sepehri 2024 — 연구 종류·대상 정보가 없어 화면의 근거 수준 표시에도 빠져 있다 (수동 검토 필요)
