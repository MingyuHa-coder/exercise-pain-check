# Work 결과 넣는 곳

Work가 작성한 Evidence Matrix를 `<주제>-evidence-matrix.csv` 이름으로 이 폴더에 넣는다 (예: `bench-evidence-matrix.csv`).
양식은 [../evidence-matrix-template.csv](../evidence-matrix-template.csv), 칸의 뜻과 결과 종류(E0~E4)는 [../README.md](../README.md)에 있다.

넣은 뒤:

```bash
node tools/audit/build-trace.js --topic bench
node tools/audit/verify-trace.js --topic bench
```

아직 아무 파일도 없다. 근거 등급은 Work가 확인한 뒤에만 채운다.
