# 벤치프레스 — 질문에서 운동 조정까지 추적표

> 자동 생성 문서 — `node tools/audit/build-trace.js --topic bench` 로 다시 만든다. 직접 고치지 말 것.
> 콘텐츠 버전 8.2 · 코드 지문 `8d95c2721854` (코드가 바뀌면 `node tools/audit/verify-trace.js`가 알려준다)
> "수동 검토 필요" 표시는 코드에서 자동으로 확인할 수 없어 사람이 확인해야 하는 곳이다. 추측으로 채우지 않았다.

관련 문서: 판단 규칙 전체 목록 [rule-inventory.md](../rule-inventory.md) · 근거 연결 [bench-evidence-links.csv](bench-evidence-links.csv) · 검토 질문 [bench-review-questions.md](bench-review-questions.md) · 구조 설명 [README.md](README.md)

## 0. 흐름

위험 신호 질문 (하나라도 "예"면 진료 안내에서 멈춤) → 상황 질문 → **점수 규칙**(`bench.S.*`) → **변수 선택**(`bench.SEL.*` + 공통 `common.F.zero`) → **조정 후보**(`bench.P.*`) → **공통 마무리**(`common.F.*`: 상위 3개, 진료 먼저) → 화면

- 판단 함수: `content/topics/bench.js` 의 `analyse()` (content/topics/bench.js:71부터) · 공통 마무리: `js/app.js` 의 `finish()`
- 코드 해석 결과: 점수 규칙 13개, 조정 후보 규칙 6개, 변수 선택 줄 5개, 해석 못 한 줄 0개
- 자동 대조: 무작위 답변 50,000개에서 해석한 점수 규칙으로 다시 계산한 점수가 실제 `analyse()` 점수와 다른 경우 **0건**, 조정 후보 목록이 다른 경우 **0건**

## 1. 질문과 답이 쓰이는 곳

| 질문 ID | 질문 | 답 값 | 답 문구 | 점수 규칙 | 조정 후보 규칙 | 진료 먼저 규칙 |
| --- | --- | --- | --- | --- | --- | --- |
| `where` | 어디가 아픈가요? | `front` | 어깨 앞쪽 | `bench.S.rc.where=front/where=sideback` | - | - |
|  |  | `top` | 어깨 위쪽 한 점 (쇄골 끝) | `bench.S.acj.where=top` | - | - |
|  |  | `sideback` | 어깨 옆이나 뒤 | `bench.S.rc.where=front/where=sideback` | - | - |
|  |  | `unsure` | 잘 모르겠음 | - | - | - |
| `when` | 언제 가장 아픈가요? | `lower` | 바를 가슴까지 내릴 때 | `bench.S.rc.when=lower/when=press` | - | - |
|  |  | `press` | 바를 밀어 올릴 때 | `bench.S.rc.when=lower/when=press` | - | - |
|  |  | `after` | 운동 후나 다음 날 | - | - | - |
|  |  | `daily` | 운동 안 할 때, 일상생활에서도 | - | - | `bench.REFER.daily` |
| `grip` | 벤치 그립 너비는 어느 정도인가요? | `g1` | 어깨너비 정도 | - | - | - |
|  |  | `g15` | 어깨너비의 1.5배쯤 | `bench.S.acj.grip=g15` | `bench.P.grip` | - |
|  |  | `g2` | 그보다 넓게 | `bench.S.acj.grip=g2` | `bench.P.grip` | - |
| `elbow` | 바를 내릴 때 팔꿈치는 어떻게 되나요? | `tucked` | 몸통에 바짝 붙임 (약 45°) | - | `bench.P.elbow` | - |
|  |  | `mid` | 중간 정도 (약 70°) | - | - | - |
|  |  | `flared` | 옆으로 거의 일자 (약 90°) | - | `bench.P.elbow` | - |
| `scap` | 날개뼈를 모으고 아래로 내린 채로 벤치를 하나요? | `yes` | 예 | - | - | - |
|  |  | `no` | 아니오 | `bench.S.scap.scap=no/scap=unsure` | `bench.P.scap` | - |
|  |  | `unsure` | 잘 모르겠음 | `bench.S.scap.scap=no/scap=unsure` | `bench.P.scap` | - |
| `other` (여러 개) | 벤치 말고 아픈 운동이 있나요? | `lateral` | 사이드 레터럴 레이즈 | `bench.S.rc.other=lateral` | - | - |
|  |  | `upright` | 업라이트 로우 | `bench.S.rc.other=upright` | - | - |
|  |  | `ohp` | 숄더 프레스 | `bench.S.rc.other=ohp` | - | - |
|  |  | `dips` | 딥스 | - | - | - |
|  |  | `none` | 없음 | - | - | - |
| `daily` (여러 개) | 최근 일상에서 불편했던 동작이 있나요? | `cross` | 팔을 반대편으로 가로질러 뻗기 (안전벨트 매기) | `bench.S.acj.daily=cross` | `bench.P.flex` | - |
|  |  | `behind` | 등 뒤로 손 올리기 | - | `bench.P.flex` | - |
|  |  | `overhead` | 머리 위로 팔 들기 | `bench.S.rc.daily=overhead` | - | - |
|  |  | `none` | 없음 | - | - | - |
| `load` | 벤치 최고 무게(1RM)는 내 체중의 몇 배쯤인가요? | `lt1` | 1배 미만 | - | - | - |
|  |  | `mid` | 1~1.5배 | - | - | - |
|  |  | `gt15` | 1.5배 넘음 | `bench.S.acj.load=gt15` | `bench.P.load` | - |
|  |  | `unknown` | 잘 모름 | - | - | - |
| `dur` | 아픈 지 얼마나 됐나요? | `lt2` | 2주 미만 | - | - | - |
|  |  | `w2to6` | 2~6주 | - | - | - |
|  |  | `gt6` | 6주 이상 | - | - | `common.F.referLong` |
| `trend` | 요즘 통증은 어떻게 변하고 있나요? | `better` | 좋아지는 중 | - | - | - |
|  |  | `same` | 그대로 | - | - | - |
|  |  | `worse` | 나빠지는 중 | - | - | `common.F.referWorse` |
| `acc` | 밴드 외회전이나 날개뼈 운동 같은 보조운동을 하나요? | `regular` | 정기적으로 함 | - | - | - |
|  |  | `sometimes` | 가끔 | - | `bench.P.acc` | - |
|  |  | `never` | 안 함 | `bench.S.scap.acc=never` | `bench.P.acc` | - |

판단 규칙 어디에도 쓰이지 않는 답 (요약·기록에만 쓰임): `where=unsure`, `when=after`, `grip=g1`, `elbow=mid`, `scap=yes`, `other=dips`, `other=none`, `daily=none`, `load=lt1`, `load=mid`, `load=unknown`, `dur=lt2`, `dur=w2to6`, `trend=better`, `trend=same`, `acc=regular`

질문 위치: `where` content/topics/bench.js:10 · `when` content/topics/bench.js:12 · `grip` content/topics/bench.js:14 · `elbow` content/topics/bench.js:16 · `scap` content/topics/bench.js:18 · `other` content/topics/bench.js:20 · `daily` content/topics/bench.js:22 · `load` content/topics/bench.js:24 · `dur` content/common.js:25 (COMMON_Q) · `trend` content/common.js:26 (COMMON_Q) · `acc` content/common.js:27 (COMMON_Q)

## 2. 점수 규칙 (`bench.S.*`)

변수 점수는 0에서 시작해 아래 조건마다 더한다. 코드 원문 기준이며 위 자동 대조로 확인했다.

| 규칙 ID | 조건 | 변수 | 점수 | 위치 |
| --- | --- | --- | --- | --- |
| `bench.S.rc.where=front/where=sideback` | where=front 또는 where=sideback | `rc` | +2 | content/topics/bench.js:72 |
| `bench.S.rc.other=lateral` | other=lateral | `rc` | +1 | content/topics/bench.js:73 |
| `bench.S.rc.other=upright` | other=upright | `rc` | +1 | content/topics/bench.js:73 |
| `bench.S.rc.other=ohp` | other=ohp | `rc` | +1 | content/topics/bench.js:73 |
| `bench.S.rc.daily=overhead` | daily=overhead | `rc` | +2 | content/topics/bench.js:74 |
| `bench.S.rc.when=lower/when=press` | when=lower 또는 when=press | `rc` | +1 | content/topics/bench.js:75 |
| `bench.S.acj.where=top` | where=top | `acj` | +4 | content/topics/bench.js:76 |
| `bench.S.acj.daily=cross` | daily=cross | `acj` | +1 | content/topics/bench.js:77 |
| `bench.S.acj.grip=g2` | grip=g2 | `acj` | +2 | content/topics/bench.js:78 |
| `bench.S.acj.grip=g15` | grip=g15 (단, grip=g2가 아닐 때) | `acj` | +1 | content/topics/bench.js:78 |
| `bench.S.acj.load=gt15` | load=gt15 | `acj` | +2 | content/topics/bench.js:79 |
| `bench.S.scap.scap=no/scap=unsure` | scap=no 또는 scap=unsure | `scap` | +2 | content/topics/bench.js:80 |
| `bench.S.scap.acc=never` | acc=never | `scap` | +1 | content/topics/bench.js:81 |

## 3. 결과 변수와 선택 규칙

| 변수 ID | 화면 제목 | 근거 표시 | 근거 위치 | 화면에 안 보이는 내부 자료 |
| --- | --- | --- | --- | --- |
| `rc` | 바를 내리고 미는 동작의 어깨 부담 | 연구 종합 해석 카드 · 논문 확인: Pieters 2020, Kibler 2013 | content/common.js:35 | 질환명(term) |
| `acj` | 무겁게·자주 하는 벤치의 어깨 위쪽 부담 | 연구 종합 해석 카드 · 논문 확인: Nevalainen 2016, Noteboom 2024 | content/topics/bench.js:35 | 질환명(term) |
| `scap` | 날개뼈 세팅과 보조운동 | 연구 종합 해석 카드 · 논문 확인: Kibler 2013, Hickey 2018 | content/topics/bench.js:40 | 질환명(term) |

**선택 규칙 (코드 원문이 기준. 설명은 사람이 쓴 것 = 수동)**

| 규칙 ID | 코드 원문 | 위치 | 설명 (수동) |
| --- | --- | --- | --- |
| `bench.SEL.1` | `const main = sc.acj > sc.rc ? "acj" : "rc";` | content/topics/bench.js:83 | rc(어깨 부담)와 acj(어깨 위쪽 부담) 점수를 비교해 acj가 더 크면 acj, 아니면(같을 때 포함) rc를 맨 앞 변수로 정한다. |
| `bench.SEL.2` | `const other = main === "rc" ? "acj" : "rc";` | content/topics/bench.js:84 | 맨 앞이 아닌 쪽(rc 또는 acj)을 'other'로 둔다. |
| `bench.SEL.3` | `const patterns = [main];` | content/topics/bench.js:85 | 맨 앞 변수로 결과 목록을 시작한다. |
| `bench.SEL.4` | `if (sc[other] >= 3) patterns.push(other);` | content/topics/bench.js:86 | other의 점수가 3 이상이면 함께 보여준다. |
| `bench.SEL.5` | `if (sc.scap >= 2) patterns.push("scap");` | content/topics/bench.js:87 | scap(날개뼈) 점수가 2 이상이면 함께 보여준다. |
| `common.F.zero` | 공통 | js/app.js:16 | 점수표에 있는 변수 중 0점인 변수는 결과에서 뺀다. |

## 4. 조정 후보 규칙과 우선순위 (`bench.P.*`)

숫자가 작을수록 먼저 보인다. 후보 중 상위 3개만 화면에 나온다(`common.F.top3`).

| 규칙 ID | 조정 | 후보가 되는 조건 | 우선순위 | 위치 | 무작위 답에서 후보 / 최종 표시 / 3개 제한으로 빠짐 (※) |
| --- | --- | --- | --- | --- | --- |
| `bench.P.load` | 무게와 횟수 낮추기 | 항상 | 1 또는 6: `main === "acj" \|\| has(a, "load", "gt15")`이 참이면 1 — 맨 앞 변수가 acj이거나 1RM이 체중 1.5배를 넘으면 우선순위 1, 아니면 6. 조건 없이 항상 후보에 들어간다. (수동 설명) | content/topics/bench.js:90 | 100.0% / 69.4% / 30.6% |
| `bench.P.grip` | 그립을 어깨너비 1~1.5배로 | grip=g15 또는 grip=g2 | 2 | content/topics/bench.js:91 | 66.9% / 66.9% / 0.0% |
| `bench.P.scap` | 날개뼈 모으고 내리기 | scap=no 또는 scap=unsure | 3 | content/topics/bench.js:92 | 66.8% / 66.8% / 0.0% |
| `bench.P.elbow` | 팔꿈치 각도를 중간으로 | elbow=flared 또는 elbow=tucked | 5 | content/topics/bench.js:93 | 66.7% / 32.7% / 34.0% |
| `bench.P.acc` | 어깨·날개뼈 보조운동 더하기 | acc=never 또는 acc=sometimes | 4 | content/topics/bench.js:94 | 66.5% / 51.4% / 15.1% |
| `bench.P.flex` | 어깨 뒤쪽 스트레칭 | daily=cross 또는 daily=behind | 7 | content/topics/bench.js:95 | 55.6% / 6.2% / 49.4% |

※ 무작위 답 비율은 모든 답을 같은 확률로 골랐을 때의 값이다. **실제 이용자가 이 조정을 받는 비율이 아니다.** 규칙이 얼마나 자주 겹치거나 잘리는지 보는 용도로만 쓴다.

## 5. 공통 마무리 규칙 (`js/app.js` `finish()`)

| 규칙 ID | 내용 | 위치 |
| --- | --- | --- |
| `common.F.top3` | 조정 후보를 우선순위 숫자가 작은 순으로 정렬해 상위 3개만 보여준다. 같은 숫자는 코드에 넣은 순서대로. | js/app.js:10 |
| `common.F.referLong` | 아픈 지 6주 이상(dur=gt6)이면 '진료를 먼저 권해요'. | js/app.js:11 |
| `common.F.referWorse` | 나빠지는 중(trend=worse)이면 '진료를 먼저 권해요'. | js/app.js:12 |
| `common.F.zero` | 점수표에 있는 변수 중 0점인 변수는 결과에서 뺀다. | js/app.js:16 |
| `common.F.unclearNoAdj` | 맨 앞 변수가 빠지고 남는 변수가 없으면 조정도 보여주지 않는다('좁히기 어려움' 안내). | js/app.js:18 |
| `common.F.referOnly` | '→ 진료 먼저' 변수(referOnly)가 결과에 있으면 조정을 보여주지 않는다. | js/app.js:20 |
| `common.F.referFirst` | 주제 조건·6주 이상·악화 중 하나면 결과 맨 위에 '진료를 먼저 권해요'를 띄우고 조정은 '참고만'으로 함께 보여준다. | js/app.js:21 |
| `bench.REFER.daily` | 주제 조건: when=daily 이면 '진료를 먼저 권해요' | content/topics/bench.js:96 |

## 6. 위험 신호 (조정으로 넘어가지 않음)

여러 개에 "예"면 가장 급한 단계(숫자가 작은 것)를 보여준다 (`js/app.js` `pickFlagLevel()`). 출처: BESS/BOA 어깨 통증 진료 경로 (Rees 2021), ElMaraghy 2012

| 규칙 ID | 질문 | 단계 | 안내 제목 | 정의 위치 |
| --- | --- | --- | --- | --- |
| `bench.FLAG.cardiac` | 가슴이 답답하거나 숨이 차고, 식은땀과 함께 어깨나 팔이 아픈가요? | 0 | 지금 119에 전화하세요 | content/common.js (BASE_FLAGS, 어깨 공통) |
| `bench.FLAG.disloc` | 어깨가 빠진 느낌이 들거나 모양이 변했나요? | 1 | 오늘 응급실로 가세요 | content/common.js (BASE_FLAGS, 어깨 공통) |
| `bench.FLAG.infect` | 열이 나거나, 어깨가 붉고 뜨겁게 부었나요? | 1 | 오늘 응급실로 가세요 | content/common.js (BASE_FLAGS, 어깨 공통) |
| `bench.FLAG.tear` | 무거운 무게를 내리다 "뚝" 하는 느낌과 함께 아프고 힘이 빠졌나요? 가슴이나 겨드랑이 모양이 그대로여도 해당돼요. | 2 | 며칠 안에 정형외과 진료를 받으세요 | content/topics/bench.js |
| `bench.FLAG.night` | 쉬어도 밤새 계속 아프거나, 혹이 만져지거나, 이유 없이 살이 빠졌나요? | 3 | 빠른 시일 내 진료를 받으세요 | content/common.js (BASE_FLAGS, 어깨 공통) |
| `bench.FLAG.neck` | 팔이나 손이 저리거나, 통증이 팔꿈치 아래까지 내려가나요? | 3 | 빠른 시일 내 진료를 받으세요 | content/common.js (BASE_FLAGS, 어깨 공통) |

## 7. 연구별 역추적

어떤 연구에 대한 Work의 결론이 나오면 이 표에서 영향 범위를 찾는다. "관련 질문"은 코드상 그 카드·조정이 나오도록 만드는 질문이다(근거 관계가 아니라 **코드 경로**).

### `barrett-2016` — Barrett 2016

- 연구 목록 등록: content/studies.js · 앱에 적힌 연구 종류: 체계적 고찰 · 앱에 적힌 대상(내부): 등 자세와 어깨 통증
- **설명 카드: 라운드 숄더 때문일까요?** `bench.card.2` (content/topics/bench.js:104, 화면 표시) — 연구 종합 해석
  - 문장: "자세만으로 통증 원인이라고 보긴 어려워요. 등이 굽은 정도는 어깨가 아픈 사람과 안 아픈 사람 사이에 차이가 없었어요. 교정 운동으로 자세 각도는 좋아지지만, 그게 통증을 줄인다는 근거는 아직 없어요."
  - 문장-연구 대응: 수동 검토 필요 (출처 2개 중 어느 문장이 이 연구인지 코드에 없음)
  - 관련 규칙: (답변과 `무관하게` `항상` `표시)`
  - 관련 질문 (직접): -

### `bess-boa-2021` — BESS/BOA 2021

- 연구 목록 등록: content/studies.js · 앱에 적힌 연구 종류: 진료 경로(지침) · 앱에 적힌 대상(내부): 어깨 통증 환자 진료
- **조정 카드 근거** `bench.adj.load.fact` (content/topics/bench.js:44, 화면 표시) — 논문 확인
  - 문장: "무게를 낮추는 건 어깨 통증 보존적 관리의 기본 원칙이에요. 체중 1.5배 넘는 벤치, 주 1회 초과, 5년 이상이 겹치면 MRI에서 쇄골 끝 뼈가 녹는 변화가 생길 위험이 높았어요."
  - 문장-연구 대응: 수동 검토 필요 (출처 2개 중 어느 문장이 이 연구인지 코드에 없음)
  - 영향받는 조정: `load`
  - 관련 규칙: `bench.P.load` `common.F.top3` `bench.SEL.1` `common.F.unclearNoAdj` `common.F.referOnly`
  - 관련 질문 (직접): `load` · (간접: 맨 앞 변수 경쟁을 통해) `where` `other` `daily` `when` `grip`
- **위험 신호 출처** `bench.flags.flagSrc` (content/topics/bench.js:8, 화면 표시) — 출처
  - 문장: "위험 신호 문항과 진료 안내 단계"
  - 문장-연구 대응: 수동 검토 필요 (출처 2개 중 어느 문장이 이 연구인지 코드에 없음)
  - 관련 규칙: `bench.FLAG.cardiac` `bench.FLAG.disloc` `bench.FLAG.infect` `bench.FLAG.tear` `bench.FLAG.night` `bench.FLAG.neck`
  - 관련 질문 (직접): -

### `elmaraghy-2012` — ElMaraghy 2012

- 연구 목록 등록: content/studies.js · 앱에 적힌 연구 종류: 체계적 고찰 · 앱에 적힌 대상(내부): 대흉근 파열 환자
- **위험 신호 출처** `bench.flags.flagSrc` (content/topics/bench.js:8, 화면 표시) — 출처
  - 문장: "위험 신호 문항과 진료 안내 단계"
  - 문장-연구 대응: 수동 검토 필요 (출처 2개 중 어느 문장이 이 연구인지 코드에 없음)
  - 관련 규칙: `bench.FLAG.cardiac` `bench.FLAG.disloc` `bench.FLAG.infect` `bench.FLAG.tear` `bench.FLAG.night` `bench.FLAG.neck`
  - 관련 질문 (직접): -

### `hickey-2018` — Hickey 2018

- 연구 목록 등록: content/studies.js · 앱에 적힌 연구 종류: 메타분석 · 앱에 적힌 대상(내부): 통증 없는 사람 포함 추적 연구
- **점검 변수 카드 근거** `bench.pat.scap.evText` (content/topics/bench.js:40, 화면 표시) — 논문 확인
  - 문장: "통증 없는 사람에게도 70% 넘게 보여서, 이것만으로 원인이라고 보진 않아요."
  - 문장-연구 대응: 수동 검토 필요 (출처 2개 중 어느 문장이 이 연구인지 코드에 없음)
  - 영향받는 결과 변수: `scap`
  - 관련 규칙: `bench.S.scap.scap=no/scap=unsure` `bench.S.scap.acc=never` `bench.SEL.5` `common.F.zero`
  - 관련 질문 (직접): `scap` `acc`

### `kibler-2013` — Kibler 2013

- 연구 목록 등록: content/studies.js · 앱에 적힌 연구 종류: 전문가 합의 · 앱에 적힌 대상(내부): 날개뼈 움직임 문제
- **점검 변수 카드 근거** `bench.pat.rc.evText` (content/common.js:35, 화면 표시) — 논문 확인
  - 문장: "진료에서 '팔을 들 때 아픈 어깨 통증'으로 분류된 사람에게는 운동치료가 1차 치료라는 근거가 강해요. 다만 이 분류 이름 자체는 모호해요."
  - 문장-연구 대응: 수동 검토 필요 (출처 2개 중 어느 문장이 이 연구인지 코드에 없음)
  - 영향받는 결과 변수: `rc`
  - 관련 규칙: `bench.S.rc.where=front/where=sideback` `bench.S.rc.other=lateral` `bench.S.rc.other=upright` `bench.S.rc.other=ohp` `bench.S.rc.daily=overhead` `bench.S.rc.when=lower/when=press` `bench.SEL.1` `bench.SEL.2` `bench.SEL.3` `bench.SEL.4` `common.F.zero`
  - 관련 질문 (직접): `where` `other` `daily` `when` · (간접: 맨 앞 변수 경쟁을 통해) `grip` `load`
- **점검 변수 카드 근거** `bench.pat.scap.evText` (content/topics/bench.js:40, 화면 표시) — 논문 확인
  - 문장: "통증 없는 사람에게도 70% 넘게 보여서, 이것만으로 원인이라고 보진 않아요."
  - 문장-연구 대응: 수동 검토 필요 (출처 2개 중 어느 문장이 이 연구인지 코드에 없음)
  - 영향받는 결과 변수: `scap`
  - 관련 규칙: `bench.S.scap.scap=no/scap=unsure` `bench.S.scap.acc=never` `bench.SEL.5` `common.F.zero`
  - 관련 질문 (직접): `scap` `acc`
- **조정 카드 근거** `bench.adj.acc.fact` (content/common.js:39, 화면 표시) — 논문 확인
  - 문장: "운동치료는 진료에서 '팔을 들 때 아픈 어깨 통증'으로 분류된 사람의 1차 치료로 권고돼요. 날개뼈 중심 운동이 단기에 일반 운동보다 나았어요."
  - 문장-연구 대응: 수동 검토 필요 (출처 2개 중 어느 문장이 이 연구인지 코드에 없음)
  - 영향받는 조정: `acc`
  - 관련 규칙: `bench.P.acc` `common.F.top3` `common.F.unclearNoAdj` `common.F.referOnly`
  - 관련 질문 (직접): `acc`
- **조정 카드 근거** `bench.adj.flex.fact` (content/topics/bench.js:53, 화면 표시) — 논문 확인
  - 문장: "전문가 합의문은 어깨 뒤쪽이 뻣뻣하면 날개뼈가 앞으로 끌려갈 수 있고, 재활은 유연성 확보부터 시작한다고 봐요."
  - 문장-연구 대응: 수동 검토 필요 (출처 2개 중 어느 문장이 이 연구인지 코드에 없음)
  - 영향받는 조정: `flex`
  - 관련 규칙: `bench.P.flex` `common.F.top3` `common.F.unclearNoAdj` `common.F.referOnly`
  - 관련 질문 (직접): `daily`

### `medbridge` — MedBridge

- 연구 목록 등록: content/studies.js · 앱에 적힌 연구 종류: 교육 자료 · 앱에 적힌 대상(내부): -
- **조정 카드 근거** `bench.adj.flex.fact` (content/topics/bench.js:53, 화면 표시) — 논문 확인
  - 문장: "전문가 합의문은 어깨 뒤쪽이 뻣뻣하면 날개뼈가 앞으로 끌려갈 수 있고, 재활은 유연성 확보부터 시작한다고 봐요."
  - 문장-연구 대응: 수동 검토 필요 (출처 2개 중 어느 문장이 이 연구인지 코드에 없음)
  - 영향받는 조정: `flex`
  - 관련 규칙: `bench.P.flex` `common.F.top3` `common.F.unclearNoAdj` `common.F.referOnly`
  - 관련 질문 (직접): `daily`

### `nevalainen-2016` — Nevalainen 2016

- 연구 목록 등록: content/studies.js · 앱에 적힌 연구 종류: 환자-대조 연구(MRI) · 앱에 적힌 대상(내부): 벤치프레스 하는 사람
- **점검 변수 카드 근거** `bench.pat.acj.evText` (content/topics/bench.js:35, 화면 표시) — 논문 확인
  - 문장: "체중의 1.5배 넘는 벤치, 주 1회 초과, 5년 이상이 겹치면 위험이 크게 높아졌어요 (MRI 환자-대조 연구)."
  - 문장-연구 대응: 수동 검토 필요 (출처 2개 중 어느 문장이 이 연구인지 코드에 없음)
  - 영향받는 결과 변수: `acj`
  - 관련 규칙: `bench.S.acj.where=top` `bench.S.acj.daily=cross` `bench.S.acj.grip=g2` `bench.S.acj.grip=g15` `bench.S.acj.load=gt15` `bench.SEL.1` `bench.SEL.2` `bench.SEL.3` `bench.SEL.4` `common.F.zero`
  - 관련 질문 (직접): `where` `daily` `grip` `load` · (간접: 맨 앞 변수 경쟁을 통해) `other` `when`
- **조정 카드 근거** `bench.adj.load.fact` (content/topics/bench.js:44, 화면 표시) — 논문 확인
  - 문장: "무게를 낮추는 건 어깨 통증 보존적 관리의 기본 원칙이에요. 체중 1.5배 넘는 벤치, 주 1회 초과, 5년 이상이 겹치면 MRI에서 쇄골 끝 뼈가 녹는 변화가 생길 위험이 높았어요."
  - 문장-연구 대응: 수동 검토 필요 (출처 2개 중 어느 문장이 이 연구인지 코드에 없음)
  - 영향받는 조정: `load`
  - 관련 규칙: `bench.P.load` `common.F.top3` `bench.SEL.1` `common.F.unclearNoAdj` `common.F.referOnly`
  - 관련 질문 (직접): `load` · (간접: 맨 앞 변수 경쟁을 통해) `where` `other` `daily` `when` `grip`

### `noteboom-2024` — Noteboom 2024

- 연구 목록 등록: content/studies.js · 앱에 적힌 연구 종류: 근골격 모델 계산 · 앱에 적힌 대상(내부): 모델(실제 통증 측정 없음)
- **점검 변수 카드 근거** `bench.pat.acj.evText` (content/topics/bench.js:35, 화면 표시) — 논문 확인
  - 문장: "체중의 1.5배 넘는 벤치, 주 1회 초과, 5년 이상이 겹치면 위험이 크게 높아졌어요 (MRI 환자-대조 연구)."
  - 문장-연구 대응: 수동 검토 필요 (출처 2개 중 어느 문장이 이 연구인지 코드에 없음)
  - 영향받는 결과 변수: `acj`
  - 관련 규칙: `bench.S.acj.where=top` `bench.S.acj.daily=cross` `bench.S.acj.grip=g2` `bench.S.acj.grip=g15` `bench.S.acj.load=gt15` `bench.SEL.1` `bench.SEL.2` `bench.SEL.3` `bench.SEL.4` `common.F.zero`
  - 관련 질문 (직접): `where` `daily` `grip` `load` · (간접: 맨 앞 변수 경쟁을 통해) `other` `when`
- **조정 카드 근거** `bench.adj.grip.fact` (content/topics/bench.js:46, 화면 표시) — 논문 확인
  - 문장: "근골격 모델에서 2배 그립은 쇄골 끝 압박과 회전근개 부담을 키웠고, 아주 좁은 그립은 관절 위쪽에 힘이 더 걸렸어요."
  - 문장-연구 대응: 출처 1개 (문장 전체에 대응)
  - 영향받는 조정: `grip`
  - 관련 규칙: `bench.P.grip` `common.F.top3` `common.F.unclearNoAdj` `common.F.referOnly`
  - 관련 질문 (직접): `grip`
- **조정 카드 근거** `bench.adj.scap.fact` (content/topics/bench.js:48, 화면 표시) — 논문 확인
  - 문장: "근골격 모델에서 날개뼈를 모으면 어깨 관절 압박이 줄고 회전근개가 덜 일했어요."
  - 문장-연구 대응: 출처 1개 (문장 전체에 대응)
  - 영향받는 조정: `scap`
  - 관련 규칙: `bench.P.scap` `common.F.top3` `common.F.unclearNoAdj` `common.F.referOnly`
  - 관련 질문 (직접): `scap`
- **조정 카드 근거** `bench.adj.elbow.fact` (content/topics/bench.js:50, 화면 표시) — 논문 확인
  - 문장: "근골격 모델에서 팔꿈치 각도의 영향은 그립·날개뼈보다 작았고, 45°는 관절 위쪽에 걸리는 힘을 키웠어요."
  - 문장-연구 대응: 출처 1개 (문장 전체에 대응)
  - 영향받는 조정: `elbow`
  - 관련 규칙: `bench.P.elbow` `common.F.top3` `common.F.unclearNoAdj` `common.F.referOnly`
  - 관련 질문 (직접): `elbow`

### `pieters-2020` — Pieters 2020

- 연구 목록 등록: content/studies.js · 앱에 적힌 연구 종류: 체계적 고찰 종합 · 앱에 적힌 대상(내부): 어깨 충돌성 통증 환자
- **점검 변수 카드 근거** `bench.pat.rc.evText` (content/common.js:35, 화면 표시) — 논문 확인
  - 문장: "진료에서 '팔을 들 때 아픈 어깨 통증'으로 분류된 사람에게는 운동치료가 1차 치료라는 근거가 강해요. 다만 이 분류 이름 자체는 모호해요."
  - 문장-연구 대응: 수동 검토 필요 (출처 2개 중 어느 문장이 이 연구인지 코드에 없음)
  - 영향받는 결과 변수: `rc`
  - 관련 규칙: `bench.S.rc.where=front/where=sideback` `bench.S.rc.other=lateral` `bench.S.rc.other=upright` `bench.S.rc.other=ohp` `bench.S.rc.daily=overhead` `bench.S.rc.when=lower/when=press` `bench.SEL.1` `bench.SEL.2` `bench.SEL.3` `bench.SEL.4` `common.F.zero`
  - 관련 질문 (직접): `where` `other` `daily` `when` · (간접: 맨 앞 변수 경쟁을 통해) `grip` `load`
- **조정 카드 근거** `bench.adj.acc.fact` (content/common.js:39, 화면 표시) — 논문 확인
  - 문장: "운동치료는 진료에서 '팔을 들 때 아픈 어깨 통증'으로 분류된 사람의 1차 치료로 권고돼요. 날개뼈 중심 운동이 단기에 일반 운동보다 나았어요."
  - 문장-연구 대응: 수동 검토 필요 (출처 2개 중 어느 문장이 이 연구인지 코드에 없음)
  - 영향받는 조정: `acc`
  - 관련 규칙: `bench.P.acc` `common.F.top3` `common.F.unclearNoAdj` `common.F.referOnly`
  - 관련 질문 (직접): `acc`

### `torwichien-2020` — Torwichien 2020

- 연구 목록 등록: content/studies.js · 앱에 적힌 연구 종류: 평가자 일치도 연구 · 앱에 적힌 대상(내부): 물리치료사의 분류
- **설명 카드: 어깨 앞쪽 통증을 '자세 분류'로 설명하는 글을 봤다면** `bench.card.1` (content/topics/bench.js:102, 화면 표시) — 연구 종합 해석
  - 문장: "벤치에서 어깨 앞쪽이 아플 때 인터넷에서 자주 나오는 개념이에요. 하지만 전문 물리치료사끼리도 이 분류의 일치도가 낮았고(카파 0.30), 헬스하는 사람을 대상으로 한 연구는 아직 없어요. 앱은 답변으로 이 분류를 고르지 않아요. 궁금하면 전문가에게 직접 확인받으세요."
  - 문장-연구 대응: 출처 1개 (문장 전체에 대응)
  - 관련 규칙: (답변과 `무관하게` `항상` `표시)`
  - 관련 질문 (직접): -

### `unregistered:sepehri-2024` — Sepehri 2024

- 연구 목록 등록: 수동 검토 필요 (연구 목록에 없음) · 앱에 적힌 연구 종류: 수동 검토 필요 · 앱에 적힌 대상(내부): 수동 검토 필요
- **설명 카드: 라운드 숄더 때문일까요?** `bench.card.2` (content/topics/bench.js:104, 화면 표시) — 연구 종합 해석
  - 문장: "자세만으로 통증 원인이라고 보긴 어려워요. 등이 굽은 정도는 어깨가 아픈 사람과 안 아픈 사람 사이에 차이가 없었어요. 교정 운동으로 자세 각도는 좋아지지만, 그게 통증을 줄인다는 근거는 아직 없어요."
  - 문장-연구 대응: 수동 검토 필요 (출처 2개 중 어느 문장이 이 연구인지 코드에 없음)
  - 관련 규칙: (답변과 `무관하게` `항상` `표시)`
  - 관련 질문 (직접): -

## 8. 한 답만 바꿨을 때 (예시 답변 기준)

예시 답변의 결과: 변수 `rc`, `acj`, `scap` · 조정 `grip`, `scap`, `acc`

| 질문 | 바꾼 답 | 결과 변수 | 최종 조정 | 진료 먼저 | 달라짐 |
| --- | --- | --- | --- | --- | --- |
| `where` | → top | acj, scap | load, grip, scap |  | **예** |
| `where` | → sideback | rc, acj, scap | grip, scap, acc |  |  |
| `where` | → unsure | acj, scap | load, grip, scap |  | **예** |
| `when` | → press | rc, acj, scap | grip, scap, acc |  |  |
| `when` | → after | rc, acj, scap | grip, scap, acc |  |  |
| `when` | → daily | rc, acj, scap | grip, scap, acc | 예 | **예** |
| `grip` | → g1 | rc, scap | scap, acc, elbow |  | **예** |
| `grip` | → g15 | rc, scap | grip, scap, acc |  | **예** |
| `elbow` | → tucked | rc, acj, scap | grip, scap, acc |  |  |
| `elbow` | → mid | rc, acj, scap | grip, scap, acc |  |  |
| `scap` | → yes | rc, acj | grip, acc, elbow |  | **예** |
| `scap` | → no | rc, acj, scap | grip, scap, acc |  |  |
| `other` | upright 추가 | rc, acj, scap | grip, scap, acc |  |  |
| `other` | ohp 추가 | rc, acj, scap | grip, scap, acc |  |  |
| `other` | dips 추가 | rc, acj, scap | grip, scap, acc |  |  |
| `other` | 없음으로 | rc, acj, scap | grip, scap, acc |  |  |
| `daily` | behind 추가 | rc, acj, scap | grip, scap, acc |  |  |
| `daily` | overhead 추가 | rc, acj, scap | grip, scap, acc |  |  |
| `daily` | 없음으로 | rc, scap | grip, scap, acc |  | **예** |
| `load` | → lt1 | rc, acj, scap | grip, scap, acc |  |  |
| `load` | → gt15 | acj, rc, scap | load, grip, scap |  | **예** |
| `load` | → unknown | rc, acj, scap | grip, scap, acc |  |  |
| `dur` | → lt2 | rc, acj, scap | grip, scap, acc |  |  |
| `dur` | → gt6 | rc, acj, scap | grip, scap, acc | 예 | **예** |
| `trend` | → better | rc, acj, scap | grip, scap, acc |  |  |
| `trend` | → worse | rc, acj, scap | grip, scap, acc | 예 | **예** |
| `acc` | → regular | rc, acj, scap | grip, scap, elbow |  | **예** |
| `acc` | → sometimes | rc, acj, scap | grip, scap, acc |  |  |

## 9. 무작위 답변 50,000개에서 본 결과 (실제 이용자 빈도 아님)

| 변수 | 결과에 나옴 | 맨 앞에 나옴 |
| --- | --- | --- |
| `rc` | 75.3% | 64.2% |
| `acj` | 49.4% | 35.4% |
| `scap` | 66.8% | 0.3% |

좁히기 어려움 0.4% · 진료 먼저 안내 66.7% · 조정 없음 0.1%

**주의:** 이 비율은 모든 답을 같은 확률로 무작위로 고른 답에서 나온 것이다. 실제 이용자 집단에서의 빈도가 아니며, 어떤 결과가 흔하다거나 드물다는 근거로 쓰면 안 된다.

## 10. 검증 수준

세 가지를 구분한다.

1. **해석 대조:** 코드에서 해석한 점수·후보 규칙을 실제 `analyse()`와 무작위 답 50,000개로 비교 (점수 불일치 0건, 후보 불일치 0건). 같은 코드에서 나온 해석이라 **해석이 정확한지만** 확인한다.
2. **최종 결과 모델 대조:** 변수 선택·조건부 우선순위·공통 마무리(상위 3개, 0점 제외, 좁히기 어려움, 진료 먼저)를 `js/app.js`를 쓰지 않고 규칙 표대로 따로 구현해 실제 결과와 비교 — 무작위 답 50,000개에서 불일치 **0건**
3. **고정 사례:** 사람이 규칙 표로 기대값을 미리 계산해 둔 답 조합 (`tools/audit/cases/bench.json`) — 17개 중 통과 **17개**

이 세 가지는 **코드가 적힌 규칙대로 동작하는지**만 확인한다. 규칙이 의학적으로 맞는지는 확인하지 않는다(전문가 검토: [bench-review-questions.md](bench-review-questions.md)).

### 고정 사례

| 사례 | 내용 | 기대 변수 | 기대 조정 | 좁히기 어려움 / 진료 먼저 | 결과 |
| --- | --- | --- | --- | --- | --- |
| C01 | 모든 점수 0 → 변수 없음, 좁히기 어려움, 조정 없음 (무게 후보가 있어도) | (없음) | (없음) | 예 / - | 통과 |
| C02 | rc 3 = acj 3 동점 → rc가 맨 앞(acj가 '더 클 때'만 acj), acj 3은 기준선 3 이상이라 함께 표시. 조정: 그립2·무게6·스트레칭7 | rc, acj | grip, load, flex | - / - | 통과 |
| C03 | rc 4 = acj 4 동점(더 높은 점수) → rc 맨 앞, acj 함께. 무게 우선순위 6 | rc, acj | load | - / - | 통과 |
| C04 | acj 4 > rc 1 → acj 맨 앞, rc 1은 기준선 미만. 맨 앞이 acj라서 무게 우선순위 1 | acj | load | - / - | 통과 |
| C05 | 맨 앞 rc, 1RM 1.5배 넘음 → 무게 우선순위 1. 보조운동4·팔꿈치5 순서 | rc | load, acc, elbow | - / - | 통과 |
| C06 | 후보 6개 모두 → 상위 3개(그립2·날개뼈3·보조운동4)만, 무게6·팔꿈치5·스트레칭7은 빠짐 | rc, scap | grip, scap, acc | - / - | 통과 |
| C07 | C06 + 1RM 1.5배 넘음 → acj 3 = rc 3 동점으로 rc 맨 앞·acj 함께, 무게 우선순위 1로 맨 앞 | rc, acj, scap | load, grip, scap | - / - | 통과 |
| C08 | 기준선 경계: 맨 앞 acj, rc 2 → rc 안 보임 | acj | load | - / - | 통과 |
| C09 | 기준선 경계: 맨 앞 acj, rc 3 → rc 함께 보임 | acj, rc | load | - / - | 통과 |
| C10 | 날개뼈 기준선 경계: scap 1 → 안 보임. 조정: 보조운동4·무게6 | rc | acc, load | - / - | 통과 |
| C11 | 날개뼈 기준선 경계: scap 2 → 보임. 조정: 날개뼈3·무게6 | rc, scap | scap, load | - / - | 통과 |
| C12 | rc·acj 0점, scap 2 → 맨 앞 rc가 빠져 좁히기 어려움, scap만 남고 조정은 보임 | scap | scap, load | 예 / - | 통과 |
| C13 | 일상에서도 아픔(when=daily) → 진료 먼저, 조정은 '참고만'으로 보임. when=daily는 rc 점수에 안 들어감 | rc | load | - / 예 | 통과 |
| C14 | 6주 이상 → 진료 먼저 (C02와 같은 변수·조정) | rc, acj | grip, load, flex | - / 예 | 통과 |
| C15 | 나빠지는 중 → 진료 먼저 | rc | load | - / 예 | 통과 |
| C16 | 어깨 옆·뒤 + 머리 위로 팔 들기 불편 → rc 4 | rc | load | - / - | 통과 |
| C17 | 그립 2배는 +2만(1.5배 +1과 겹치지 않음): acj = 2 + 2(1RM) = 4 > rc 3 | acj, rc | load, grip | - / - | 통과 |

고정 사례의 답은 기본 답(모든 점수 0)에서 일부만 바꾼 것이다: `{"where":"unsure","when":"after","grip":"g1","elbow":"mid","scap":"yes","other":["none"],"daily":["none"],"load":"lt1","dur":"lt2","trend":"same","acc":"regular"}`

### 규칙별 동작 확인 상태 (코드 동작만. 의학적 타당성은 모두 전문가 검토 전)

| 규칙 ID | 종류 | 고정 사례 | 상태 |
| --- | --- | --- | --- |
| `bench.S.rc.where=front/where=sideback` | 점수 | C02, C16 | 동작 확인 (고정 사례 + 해석·모델 대조) |
| `bench.S.rc.other=lateral` | 점수 | C03 | 동작 확인 (고정 사례 + 해석·모델 대조) |
| `bench.S.rc.other=upright` | 점수 | C03 | 동작 확인 (고정 사례 + 해석·모델 대조) |
| `bench.S.rc.other=ohp` | 점수 | C03 | 동작 확인 (고정 사례 + 해석·모델 대조) |
| `bench.S.rc.daily=overhead` | 점수 | C16 | 동작 확인 (고정 사례 + 해석·모델 대조) |
| `bench.S.rc.when=lower/when=press` | 점수 | C02 | 동작 확인 (고정 사례 + 해석·모델 대조) |
| `bench.S.acj.where=top` | 점수 | C03 | 동작 확인 (고정 사례 + 해석·모델 대조) |
| `bench.S.acj.daily=cross` | 점수 | C02 | 동작 확인 (고정 사례 + 해석·모델 대조) |
| `bench.S.acj.grip=g2` | 점수 | C02, C17 | 동작 확인 (고정 사례 + 해석·모델 대조) |
| `bench.S.acj.grip=g15` | 점수 | C06, C17 | 동작 확인 (고정 사례 + 해석·모델 대조) |
| `bench.S.acj.load=gt15` | 점수 | C05, C17 | 동작 확인 (고정 사례 + 해석·모델 대조) |
| `bench.S.scap.scap=no/scap=unsure` | 점수 | C06, C11 | 동작 확인 (고정 사례 + 해석·모델 대조) |
| `bench.S.scap.acc=never` | 점수 | C06, C10 | 동작 확인 (고정 사례 + 해석·모델 대조) |
| `bench.SEL.1` | 변수 선택 | C01, C02, C03, C04, C07, C17 | 동작 확인 (고정 사례 + 해석·모델 대조) |
| `bench.SEL.2` | 변수 선택 | C02, C17 | 동작 확인 (고정 사례 + 해석·모델 대조) |
| `bench.SEL.3` | 변수 선택 | C01 | 동작 확인 (고정 사례 + 해석·모델 대조) |
| `bench.SEL.4` | 변수 선택 | C02, C03, C04, C05, C07, C08, C09 | 동작 확인 (고정 사례 + 해석·모델 대조) |
| `bench.SEL.5` | 변수 선택 | C06, C07, C10, C11 | 동작 확인 (고정 사례 + 해석·모델 대조) |
| `bench.P.load` | 조정 후보·우선순위 | C02, C03, C04, C05, C06, C07 | 동작 확인 (고정 사례 + 해석·모델 대조) |
| `bench.P.grip` | 조정 후보·우선순위 | C02, C06 | 동작 확인 (고정 사례 + 해석·모델 대조) |
| `bench.P.scap` | 조정 후보·우선순위 | C06, C11 | 동작 확인 (고정 사례 + 해석·모델 대조) |
| `bench.P.elbow` | 조정 후보·우선순위 | C05, C06 | 동작 확인 (고정 사례 + 해석·모델 대조) |
| `bench.P.acc` | 조정 후보·우선순위 | C05, C06, C10 | 동작 확인 (고정 사례 + 해석·모델 대조) |
| `bench.P.flex` | 조정 후보·우선순위 | C02, C06 | 동작 확인 (고정 사례 + 해석·모델 대조) |
| `common.F.top3` | 공통 마무리 | C02, C05, C06, C07 | 동작 확인 (고정 사례 + 해석·모델 대조) · 일부 미확인: 같은 우선순위 숫자일 때 코드에 넣은 순서를 따르는 부분은 벤치프레스에 같은 숫자가 없어 확인하지 못함 (수동 검토 필요) |
| `common.F.referLong` | 공통 마무리 | C14 | 동작 확인 (고정 사례 + 해석·모델 대조) |
| `common.F.referWorse` | 공통 마무리 | C15 | 동작 확인 (고정 사례 + 해석·모델 대조) |
| `common.F.zero` | 공통 마무리 | C01, C12 | 동작 확인 (고정 사례 + 해석·모델 대조) |
| `common.F.unclearNoAdj` | 공통 마무리 | C01, C12 | 동작 확인 (고정 사례 + 해석·모델 대조) |
| `common.F.referOnly` | 공통 마무리 | - | 수동 검토 필요 — 벤치프레스에는 '→ 진료 먼저' 변수(referOnly)가 없어 이 주제에서는 확인할 수 없다 (다른 주제에서 확인 필요). |
| `common.F.referFirst` | 공통 마무리 | C13, C14, C15 | 동작 확인 (고정 사례 + 해석·모델 대조) |
| `bench.REFER.daily` | 진료 먼저 조건 | C13 | 동작 확인 (고정 사례 + 해석·모델 대조) |

## 11. Work 자료 연결

Work 자료는 이 문서와 근거 연결표에만 붙는다. **앱의 근거 표시·근거 등급·사용자 문구·검토 상태는 자동으로 바뀌지 않는다.**

- Work 행렬 (`docs/audit/work/bench-evidence-matrix.csv`): 없음
- 신규 연구 목록 (`docs/audit/work/bench-new-studies.csv`): 없음
- 앱 인용 연구 중 Work 결과가 붙은 근거 연결: 0줄 / 32줄

