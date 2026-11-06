# Work 결과 넣는 곳

Work가 작성한 파일을 이 폴더에 넣는다. 둘 다 없어도 되고, 하나만 있어도 된다.

| 파일 | 양식 | 내용 |
| --- | --- | --- |
| `<주제>-evidence-matrix.csv` (예: `bench-evidence-matrix.csv`) | [../evidence-matrix-template.csv](../evidence-matrix-template.csv) | 연구 하나가 보고한 결과 한 줄. 앱이 인용한 연구와 새로 찾은 연구를 함께 적는다 |
| `<주제>-new-studies.csv` (예: `bench-new-studies.csv`) | [../new-studies-template.csv](../new-studies-template.csv) | **앱이 인용하지 않은, Work가 새로 찾은 연구** 목록. `new:` ID와 DOI·PMID·제목으로 식별 |

- 앱이 이미 인용한 연구는 근거 연결표(`bench-evidence-links.csv`)의 `study_id`를 그대로 쓴다. 바꾸지 않는다.
- 새로 찾은 연구는 먼저 `<주제>-new-studies.csv`에 `new:소문자-숫자-하이픈` ID로 등록하고, 행렬에서는 그 ID를 쓴다. DOI·PMID·제목 중 하나는 반드시 적는다.
- `existence_checked = Y`는 **서지 정보(논문이 실제로 있는지)만 확인했다는 뜻**이고, 논문 전문의 내용을 검증했다는 뜻이 아니다. Y이면 확인한 곳(`existence_source`)을 반드시 적는다.
- 서지 확인 전(N 또는 빈칸)인 신규 연구도 조사 후보로 등록·연결할 수 있지만, 관계는 `undetermined`(판단 보류)만 쓸 수 있다.
- 서지 확인 Y여도 `finding_type = E0`인 행은 `undetermined`만 쓸 수 있다. `support_direct`·`contradict`·`indirect`·`not_applicable`은 논문 내용을 확인해 `finding_type`(E1~E4·E9)과 `finding_text`를 적은 뒤에만 쓴다.
- 칸의 뜻, 결과 종류(E0~E4·E9), 앱과의 관계 코드는 [../README.md](../README.md)에 있다.

넣은 뒤:

```bash
node tools/audit/build-trace.js --topic bench    # 자료에 Work 결과를 붙임
node tools/audit/verify-trace.js --topic bench   # ID·연결 검사
```

Work 자료는 `docs/audit` 자료에만 붙는다. 앱의 근거 표시, 사용자 문구, 검토 상태는 **자동으로 바뀌지 않는다.** 바꿀지는 전문가 검토를 거쳐 따로 정한다.

아직 아무 파일도 없다. 근거 등급과 관계는 Work가 원문을 확인한 뒤에만 채운다.
