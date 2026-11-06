/* =========================================================
   Exercise Pain Check 자동 테스트
   실행: node tests/run-tests.js            (전체)
         node tests/run-tests.js --quick    (화면을 직접 누르는 13개 주제 흐름 테스트 생략)
         node tests/run-tests.js --only review   (검토 표시 테스트만)
         node tests/run-tests.js --app <폴더>    (다른 폴더의 앱을 검사. 예전 버전과 비교할 때)
   준비: Node.js와 Playwright(Chromium)가 필요하다. 자세한 내용은 tests/README.md
   결과: 실패가 하나라도 있으면 종료 코드 1
   ========================================================= */
const { chromium } = require('playwright');
const path = require('path');
const args = process.argv.slice(2);
const opt = n => { const i = args.indexOf(n); return i >= 0 ? (args[i + 1] || true) : null; };
const APP = path.resolve(opt('--app') || path.join(__dirname, '..'));
const URL = 'file://' + path.join(APP, 'index.html');
const QUICK = args.includes('--quick');
const ONLY = opt('--only');
let pass = 0, fail = 0; const failed = [];
const ok = (name, cond, info = "") => { cond ? pass++ : (fail++, failed.push(name)); console.log(`${cond ? "PASS" : "FAIL"} ${name}${info && !cond ? " — " + info : ""}`); };
const noFonts = p => p.route(/fonts\.(googleapis|gstatic)\.com/, r => r.abort());

/* ---------- 검토 표시 구조 테스트 (v8.2) ---------- */
async function reviewTests(p) {
  const R = await p.evaluate(() => {
    const out = {}; REVIEW_RECORDS.length = 0;
    const who = { reviewer: "검토자 A", field: "정형외과", qualification: "전문의", version: "8.2" };
    const done = (topic, area, date, extra = {}) => ({ topic, area, state: "done", date, coverage: "full", scope: "테스트 범위", ...who, fingerprint: reviewFingerprint(topic, area), ...extra });
    const part = (topic, area, date, items, extra = {}) => ({ topic, area, state: "done", date, coverage: "partial", items, scope: "테스트 일부", ...who, fingerprint: reviewFingerprint(topic, area, items), ...extra });
    const badgeCount = () => document.querySelectorAll(".rv").length;
    // [문제 1] 검토 완료 뒤 더 최근 "수정 필요"가 들어오면 완료 표시가 사라져야 한다
    REVIEW_RECORDS.push(done("bench", "safety", "2026-12-01"));
    out.r1_before = !!itemReview("bench.flag.tear");
    REVIEW_RECORDS.push({ topic: "bench", area: "safety", state: "needsFix", date: "2026-12-05", field: "정형외과" });
    out.r1_item = itemReview("bench.flag.tear") === null;
    out.r1_area = areaStatus("bench", "safety").state === "needsFix";
    setTopic("bench"); S.flags = {}; go("flags"); out.r1_screen = badgeCount() === 0;
    REVIEW_RECORDS.length = 0;
    REVIEW_RECORDS.push(part("bench", "adjust", "2026-12-01", ["bench.adj.grip"]));
    REVIEW_RECORDS.push({ topic: "bench", area: "adjust", state: "needsFix", date: "2026-12-05", items: ["bench.adj.grip"], field: "물리치료" });
    out.r1_partial = itemReview("bench.adj.grip") === null;
    REVIEW_RECORDS.length = 0;
    REVIEW_RECORDS.push(part("bench", "adjust", "2026-12-01", ["bench.adj.grip"]));
    REVIEW_RECORDS.push({ topic: "bench", area: "adjust", state: "needsFix", date: "2026-12-05", items: ["bench.adj.scap"], field: "물리치료" });
    out.r1_otherItemKept = !!itemReview("bench.adj.grip") && itemReview("bench.adj.scap") === null;
    REVIEW_RECORDS.length = 0;
    REVIEW_RECORDS.push(done("bench", "safety", "2026-12-01"));
    REVIEW_RECORDS.push({ topic: "bench", area: "safety", state: "inProgress", date: "2026-12-03" });
    out.r1_inProgress = itemReview("bench.flag.tear") === null && areaStatus("bench", "safety").state === "inProgress";
    REVIEW_RECORDS.length = 0;
    REVIEW_RECORDS.push({ topic: "bench", area: "safety", state: "needsFix", date: "2026-12-01" });
    REVIEW_RECORDS.push(done("bench", "safety", "2026-12-05"));
    out.r1_fixedThenDone = !!itemReview("bench.flag.tear") && areaStatus("bench", "safety").state === "done";
    REVIEW_RECORDS.length = 0;

    // [문제 2] 판단 결과를 바꾸는 것이 바뀌면 판단 규칙 검토 완료가 유지되지 않아야 한다
    const stale = (topic, area) => areaStatus(topic, area).state !== "done";
    REVIEW_RECORDS.push(done("dl", "rules", "2026-12-01"), done("sqb", "rules", "2026-12-01"), done("wri", "rules", "2026-12-01"), done("bench", "safety", "2026-12-01"), done("ohp", "rules", "2026-12-01"));
    out.r2_start = ["dl", "sqb", "wri", "ohp"].every(t => areaStatus(t, "rules").state === "done") && areaStatus("bench", "safety").state === "done";
    TOPICS.dl.patterns.nerve.referOnly = false;
    out.r2_referOnly = stale("dl", "rules") && stale("sqb", "rules");   // 스쿼트 허리는 데드리프트 변수를 함께 쓴다
    TOPICS.dl.patterns.nerve.referOnly = true; out.r2_referOnlyBack = !stale("dl", "rules");
    const leg = TOPICS.dl.questions.find(q => q.id === "leg"); const ov = leg.opts[2][0]; leg.opts[2][0] = "below_x";
    out.r2_answerValue = stale("dl", "rules"); leg.opts[2][0] = ov;
    const pre = BODY.find(b => b.id === "chest").ex[0].at[1]; const pv = pre[2].ex; pre[2].ex = "dips";
    out.r2_prefill = stale("wri", "rules"); pre[2].ex = pv;
    const f0 = window.finish; window.finish = function finish(a, sc, patterns, picks, referDaily, referNerve) { return f0(a, sc, patterns, picks.slice(0, 2), referDaily, referNerve); };
    out.r2_finish = stale("ohp", "rules"); window.finish = f0;
    const h0 = window.has; window.has = function has(a, q, v) { return h0(a, q, v); /* 바뀜 */ };
    out.r2_has = stale("ohp", "rules"); window.has = h0;
    TOPICS.dl.patterns.load.newRuleAttr = 1; out.r2_newAttr = stale("dl", "rules"); delete TOPICS.dl.patterns.load.newRuleAttr;
    const pk = window.pickFlagLevel; window.pickFlagLevel = function pickFlagLevel(h) { return Math.max(...h.map(f => f.level)); };
    out.r2_flagLevelFn = stale("bench", "safety"); window.pickFlagLevel = pk;
    const lvl = TOPICS.bench.redFlags[3].level; TOPICS.bench.redFlags[3].level = 3;
    out.r2_flagLevel = stale("bench", "safety"); TOPICS.bench.redFlags[3].level = lvl;
    const t0 = TOPICS.dl.patterns.nsp.title; TOPICS.dl.patterns.nsp.title = t0 + " (문구만)";
    out.r2_wordingOnlyKeepsRules = !stale("dl", "rules"); TOPICS.dl.patterns.nsp.title = t0;
    out.r2_allBack = ["dl", "sqb", "wri", "ohp"].every(t => areaStatus(t, "rules").state === "done") && areaStatus("bench", "safety").state === "done";
    REVIEW_RECORDS.length = 0;
    out.empty = REVIEW_RECORDS.length === 0 && Object.keys(TOPICS).every(t => REVIEW_AREAS.every(a => areaStatus(t, a.id).state === "none"));
    return out;
  });
  const names = {
    r1_before: "[문제1] 준비: 검토 완료 표시가 먼저 보임",
    r1_item: "[문제1] 완료 뒤 '수정 필요'(영역 전체) → 항목 완료 표시 사라짐",
    r1_area: "[문제1] 같은 경우 영역 상태는 '수정 필요'",
    r1_screen: "[문제1] 위험 신호 화면에도 완료 표시 없음",
    r1_partial: "[문제1] 일부 항목 완료 뒤 같은 항목 '수정 필요' → 표시 사라짐",
    r1_otherItemKept: "[문제1] 다른 항목의 '수정 필요'는 이 항목 완료에 영향 없음",
    r1_inProgress: "[문제1] 완료 뒤 '검토 중' → 완료 표시 사라짐",
    r1_fixedThenDone: "[문제1] '수정 필요' 뒤 다시 '검토 완료' → 완료 표시",
    r2_start: "[문제2] 준비: 판단 규칙·위험 신호 검토 완료",
    r2_referOnly: "[문제2] referOnly 변경 → 판단 규칙 재확인 필요 (데드리프트·스쿼트 허리)",
    r2_referOnlyBack: "[문제2] 되돌리면 다시 검토 완료",
    r2_answerValue: "[문제2] 질문의 답 값 변경 → 재확인 필요",
    r2_prefill: "[문제2] 운동 선택 때 미리 채우는 답(공통 데이터) 변경 → 재확인 필요",
    r2_finish: "[문제2] 공통 함수 finish() 변경 → 재확인 필요",
    r2_has: "[문제2] 공통 함수 has() 변경 → 재확인 필요",
    r2_newAttr: "[문제2] 변수에 새 판단 속성 추가 → 재확인 필요",
    r2_flagLevelFn: "[문제2] 위험 신호 단계 고르는 함수 변경 → 위험 신호 재확인 필요",
    r2_flagLevel: "[문제2] 위험 신호 단계 숫자 변경 → 재확인 필요",
    r2_wordingOnlyKeepsRules: "[문제2] 화면 문구만 바꾸면 판단 규칙 검토는 유지",
    r2_allBack: "[문제2] 모두 되돌리면 검토 완료로 돌아옴",
    empty: "실제 검토 기록은 0개, 모든 주제·영역 검토 전",
  };
  for (const [k, n] of Object.entries(names)) ok(n, R[k] === true, String(R[k]));
}

/* ---------- 13개 주제 화면 흐름 (부위 → 운동 → 위험 신호 → 질문 → 결과 → 기록 → 전문가 화면) ---------- */
async function flowTests(b) {
  const p = await (await b.newContext({ viewport: { width: 390, height: 800 } })).newPage(); await noFonts(p);
  p.setDefaultTimeout(8000); const errs = []; p.on('pageerror', e => errs.push(e.message));
  await p.goto(URL);
  const routes = [["chest",0,0],["chest",0,1],["chest",1,0],["shoulder",0,0],["shoulder",1,null],["back",0,null],["back",1,0],["back",1,1],["back",2,null],["arm",0,null],["leg",0,0],["leg",0,2],["leg",1,1],["cardio",0,null]];
  const seen = new Set();
  for (const [part, ex, area] of routes) {
    try {
      await p.evaluate(() => { S.screen = "start"; S.part = null; S.exi = null; S.area = null; T = null; render(); });
      await p.click(`[data-act=part][data-v=${part}]`); await p.click(`[data-act=exer][data-v="${ex}"]`);
      if (area !== null) await p.click(`[data-act=area][data-v="${area}"]`);
      if (!(await p.isChecked('#agree'))) await p.check('#agree');
      await p.click('[data-act=start]');
      const nf = await p.locator('[data-act=flag][data-v="0"]').count();
      for (let k = 0; k < nf; k++) await p.locator('[data-act=flag][data-v="0"]').nth(k).click();
      await p.click('[data-act=flagsNext]');
      for (let i = 0; i < 20; i++) {
        await p.waitForTimeout(250); await p.locator('[data-act=choose]').first().click(); await p.waitForTimeout(250);
        const t = await p.locator('[data-act=next]').innerText(); await p.locator('[data-act=next]').click(); if (t === "결과 보기") break;
      }
      const topic = await p.evaluate(() => S.topic); seen.add(topic);
      const h = await p.$eval('h2', e => e.textContent);
      if (await p.locator('[data-act=log][data-v=less]').count()) { await p.locator('[data-act=log][data-v=less]').first().click(); if (await p.locator('[data-act=logAccept]').count()) await p.locator('[data-act=logAccept]').click(); }
      await p.click('[data-act=expert]'); const sum = await p.$eval('#summary', e => e.textContent);
      ok(`화면 흐름 ${topic} (${part}-${ex}${area !== null ? "-" + area : ""})`, h.includes("운동 변수") && sum.includes("관련 운동 변수"));
    } catch (e) { ok(`화면 흐름 ${part}-${ex}-${area}`, false, e.message.split("\n")[0]); }
  }
  ok("화면 흐름으로 13개 주제 모두 거침", seen.size === 13, [...seen].join(","));
  ok("화면 흐름 중 페이지 오류 없음", errs.length === 0, errs.join(" | "));
}
(async () => {
  const b = await chromium.launch();
  const ctx = await b.newContext({ viewport: { width: 390, height: 800 }, timezoneId: "Asia/Seoul" });
  console.log("검사 대상:", URL);
  const p = await ctx.newPage(); await noFonts(p);
  const errs = []; p.on('pageerror', e => errs.push(e.message));
  await p.goto(URL);

  await reviewTests(p);
  if (ONLY !== 'review') {
  // A. 예시 답변 결과 (v8과 비교: 진료 먼저 변수에서만 조정이 빠져야 함)
  const base = {"bench":"rc,acj,scap|grip,scap,acc","ohp":"rc,btn,trunk|front,acc,brace","dl":"nsp,load|load,ramp,trap","sqk":"pfp|depth,hipknee,hip","sqb":"nsp|load,depth,front","lat":"rc,ir|height,thumb,urow","elb":"lat|wext,ramp,strap","wri":"dorsal|neutral,reduce","run":"pfp|strength,volume,cadence","dps":"deep|depth,plus,acc","pul":"hi5|front,grip,load","hip":"hipj|depth,strength,active","row":"nsp,hold|support,load,strict"};
  const A = await p.evaluate(() => Object.keys(TOPICS).map(id => { setTopic(id); const r = analyse(JSON.parse(JSON.stringify(T.sample))); return [id, r.patterns.join(",") + "|" + r.adjustments.join(",")]; }));
  ok("13개 주제 예시 답변 결과가 v8과 같음", A.every(([id, v]) => base[id] === v), JSON.stringify(A));

  // B. 무작위 답변 조합 검사 (주제당 4000개)
  const B = await p.evaluate(() => {
    const out = {}; let seed = 7; /* mulberry32 (v8.3: 선형 합동법은 낮은 자리 주기가 짧아 답 조합이 고르게 나오지 않았다) */ const rnd = n => { seed = (seed + 0x6D2B79F5) >>> 0; let t = seed; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) % n; };
    for (const id of Object.keys(TOPICS)) {
      setTopic(id); const o = { n: 0, emptyWithAdj: 0, referWithAdj: 0, zeroShown: 0, unclear: 0, unclearKeptAdj: [], errors: 0 };
      for (let i = 0; i < 4000; i++) {
        const a = {}; QUESTIONS.forEach(q => { const opts = q.opts.map(x => x[0]); a[q.id] = q.multi ? opts.filter(() => rnd(3) === 0) : opts[rnd(opts.length)]; if (q.multi && !a[q.id].length) a[q.id] = ["none"]; });
        let r; try { r = analyse(a); } catch (e) { o.errors++; continue; }
        o.n++;
        if (!r.patterns.length && r.adjustments.length) o.emptyWithAdj++;
        if (r.patterns.some(k => PATTERNS[k].referOnly) && r.adjustments.length) o.referWithAdj++;
        if (r.patterns.some(k => r.sc && Object.prototype.hasOwnProperty.call(r.sc, k) && r.sc[k] === 0)) o.zeroShown++;
        if (r.unclear) { o.unclear++; if (r.patterns.length && o.unclearKeptAdj.length < 3) o.unclearKeptAdj.push(r.patterns.join(",") + "→" + r.adjustments.join(",")); }
      }
      out[id] = o;
    }
    return out;
  });
  for (const [id, o] of Object.entries(B)) ok(`무작위 4000개 ${id}: 변수 없는 조정·진료 먼저+조정·0점 변수 표시·오류 없음`, !o.emptyWithAdj && !o.referWithAdj && !o.zeroShown && !o.errors, JSON.stringify(o));
  console.log("INFO 좁히기 어려움 비율과 예:", Object.entries(B).map(([id, o]) => `${id} ${(o.unclear / o.n * 100).toFixed(1)}% ${o.unclearKeptAdj.join(" ; ")}`).join("\n     "));

  // B2. 답이 모호한 경우 (모든 변수 0점)
  const B2 = await p.evaluate(() => {
    const cases = { bench: { where: "unsure", when: "after", grip: "g1", elbow: "mid", scap: "yes", other: ["none"], daily: ["none"], load: "unknown", dur: "lt2", trend: "same", acc: "regular" },
      sqk: { where: "unsure", when: "after", depth: "above", sit: "no", warm: "no", style: "body", spike: "no", swell: "no", dur: "lt2", trend: "same" },
      elb: { where: "unsure", ex: "curl", grip: "no", palm: "unsure", onset: "gradual", spike: "no", now: "light", dur: "lt2", trend: "same" },
      ohp: { where: "unsure", arc: "none", style: "front", ogrip: "medium", side: "no", arch: "no", wall: "easy", shrug: "no", dur: "lt2", trend: "same", acc: "regular" } };
    return Object.entries(cases).map(([id, a]) => { setTopic(id); S.a = a; const r = analyse(a); go("result"); const t = document.getElementById("main").innerText;
      return { id, unclear: r.unclear, pats: r.patterns.length, adj: r.adjustments.length, notice: t.includes("우선적으로 점검할 변수를 좁히기 어려워요"), noAdjCards: !document.querySelector(".adj") }; });
  });
  ok("답이 모호하면 변수·조정 없이 안내만 (벤치·무릎·팔꿈치·숄더프레스)", B2.every(x => x.unclear && !x.pats && !x.adj && x.notice && x.noAdjCards), JSON.stringify(B2));

  // C. 위험 신호 → 조정으로 넘어가지 않음 (화면 클릭)
  const C = await p.evaluate(() => {
    const out = [];
    for (const id of Object.keys(TOPICS)) { setTopic(id);
      for (const f of RED_FLAGS) { S.flags = Object.fromEntries(RED_FLAGS.map(x => [x.id, x.id === f.id])); go("flags"); document.querySelector('[data-act=flagsNext]').click();
        const m = document.getElementById("main"); const acts = [...m.querySelectorAll("[data-act]")].map(e => e.dataset.act);
        out.push({ id, f: f.id, screen: S.screen, adj: !!m.querySelector(".adj"), acts: acts.join(",") }); } }
    return out;
  });
  ok(`위험 신호 ${C.length}개 모두 진료 안내 화면에서 멈춤 (조정·질문으로 가는 버튼 없음)`, C.every(c => c.screen === "flagged" && !c.adj && c.acts === "backFlags,home"), JSON.stringify(C.filter(c => !(c.screen === "flagged" && !c.adj && c.acts === "backFlags,home"))));

  // D. 화면 문구
  const D = await p.evaluate(() => {
    const out = []; const dz = GLOSS_DISEASE_INTERNAL.map(g => g[1]);
    for (const id of Object.keys(TOPICS)) {
      setTopic(id); S.flags = {}; S.a = JSON.parse(JSON.stringify(T.sample));
      for (const lv of ["easy", "pro"]) {
        S.level = lv; go("result"); document.querySelectorAll("details").forEach(d => d.open = true);
        const srcCard = [...document.querySelectorAll(".card")].find(c => c.querySelector("h3") && c.querySelector("h3").textContent === "근거 자료"); if (srcCard) srcCard.remove();
        const res = document.getElementById("main").innerText; go("expert"); const ex = document.getElementById("main").innerText;
        const internals = Object.values(PATTERNS).flatMap(v => [v.term, v.internal && v.internal.text, v.internalEv && v.internalEv.text]).filter(Boolean);
        out.push({ id, lv, hidden: internals.filter(t => res.includes(t)), dz: lv === "pro" ? dz.filter(w => res.includes(w)) : [], two: /2주(?! 미만)/.test(res + ex),
          expertSplit: ex.includes("의료기관에서 확인받을 때") && ex.includes("운동 지도 전문가에게 도움받을 때") && ex.includes("추천·예약·연결하지 않아요") && !/바로 연결|준비 중/.test(ex), summary: !!document.getElementById("summary").textContent });
      }
      S.level = "easy";
    }
    return out;
  });
  ok("숨긴 질환명·진단 문장이 화면에 없음 (쉬운 말·의학 용어 26화면)", D.every(d => !d.hidden.length && !d.dz.length), JSON.stringify(D.filter(d => d.hidden.length || d.dz.length)));
  ok("'2주' 기간 표현 없음", D.every(d => !d.two));
  ok("전문가 화면: 의료기관/운동 지도 전문가 분리, '바로 연결 예정' 없음, 요약 유지", D.every(d => d.expertSplit && d.summary));

  // E. 검토 표시
  const E = await p.evaluate(() => {
    const R = {}; const badges = () => document.querySelectorAll(".rv").length;
    const allNone = () => Object.keys(TOPICS).every(id => REVIEW_AREAS.every(a => areaStatus(id, a.id).state === "none" && !areaStatus(id, a.id).note));
    R.empty = REVIEW_RECORDS.length === 0 && allNone();
    let anyBadge = 0; for (const id of Object.keys(TOPICS)) { setTopic(id); S.a = JSON.parse(JSON.stringify(T.sample)); go("result"); anyBadge += badges(); S.flags = {}; go("flags"); anyBadge += badges(); } R.noBadge = anyBadge === 0;
    const base = { topic: "bench", reviewer: "검토자 A", field: "정형외과", qualification: "전문의", date: "2026-12-01", version: "8.1", state: "done" };
    // 1) 필수 항목 빠짐 → 무시
    REVIEW_RECORDS.push({ ...base, area: "safety", coverage: "full", scope: "위험 신호 전체", fingerprint: reviewFingerprint("bench", "safety"), qualification: "" });
    R.missingIgnored = areaStatus("bench", "safety").state === "none"; REVIEW_RECORDS.length = 0;
    // 2) 영역 전체 완료
    REVIEW_RECORDS.push({ ...base, area: "safety", coverage: "full", scope: "위험 신호 6문항과 진료 안내 전체", fingerprint: reviewFingerprint("bench", "safety") });
    R.fullDone = areaStatus("bench", "safety").state === "done";
    setTopic("bench"); S.flags = {}; go("flags"); R.fullBadge = badges() === 6 && document.querySelector(".rv").textContent.includes("정형외과 전문의");
    R.otherTopicNone = areaStatus("ohp", "safety").state === "none";
    // 3) 검토 뒤 내용 수정 → 재확인 필요
    const old = TOPICS.bench.redFlags[3].q; TOPICS.bench.redFlags[3].q = old + " (수정)";
    const st = areaStatus("bench", "safety"); R.stale = st.state === "none" && st.note.includes("다시 확인"); go("flags"); R.staleNoBadge = badges() === 0;
    TOPICS.bench.redFlags[3].q = old; R.restored = areaStatus("bench", "safety").state === "done"; REVIEW_RECORDS.length = 0;
    // 4) 일부 항목만 검토
    REVIEW_RECORDS.push({ ...base, area: "adjust", coverage: "partial", items: ["bench.adj.grip"], scope: "그립 조정 1개", fingerprint: reviewFingerprint("bench", "adjust", ["bench.adj.grip"]) });
    const ps = areaStatus("bench", "adjust"); R.partialNotDone = ps.state === "none" && ps.note.includes("일부 항목만");
    S.a = JSON.parse(JSON.stringify(T.sample)); go("result");
    R.partialBadgeOnlyGrip = [...document.querySelectorAll(".adj")].map(a => !!a.querySelector(".rv")).join() === "true,false,false";
    document.querySelector("details.review").open = true; R.panel = document.querySelector("details.review").innerText.replace(/\n/g, " / ");
    REVIEW_RECORDS.length = 0;
    // 5) 수정 필요 상태
    REVIEW_RECORDS.push({ topic: "bench", area: "rules", state: "needsFix", date: "2026-12-01", field: "물리치료" });
    R.needsFix = areaStatus("bench", "rules").state === "needsFix"; REVIEW_RECORDS.length = 0;
    R.backToEmpty = allNone();
    return R;
  });
  for (const k of ["empty", "noBadge", "missingIgnored", "fullDone", "fullBadge", "otherTopicNone", "stale", "staleNoBadge", "restored", "partialNotDone", "partialBadgeOnlyGrip", "needsFix", "backToEmpty"]) ok("검토 표시: " + k, E[k]);
  console.log("INFO 일부 검토 때 패널:", E.panel.slice(0, 260));

  // F. 저장·삭제·마이그레이션
  await p.evaluate(() => { localStorage.clear(); localStorage.setItem("painLevel", "pro"); localStorage.setItem("bench-shoulder-log", JSON.stringify({ grip: [{ d: "2026-11-01", v: "less" }] })); });
  await p.reload();
  const mig = await p.evaluate(() => ({ keys: Object.keys(localStorage).sort().join(), lv: S.level, e: Object.keys(JSON.parse(localStorage.getItem("epc.healthlog")).entries).join() }));
  ok("옛 기록 옮기기", mig.keys === "epc.healthlog,epc.settings" && mig.lv === "pro" && mig.e === "bench:grip", JSON.stringify(mig));
  await p.click('[data-act=clearLog]');
  ok("시작 화면 삭제 (설정 유지)", (await p.evaluate(() => Object.keys(localStorage).join())) === "epc.settings");

  // G. 현지 날짜: 자정 전후
  await p.clock.install({ time: new Date("2026-11-06T23:59:00+09:00") });
  await p.evaluate(() => { localStorage.clear(); SETTINGS = loadSettings(); HEALTH = null; SETTINGS.logNotice = { accepted: true, date: "x" }; setTopic("bench"); S.a = JSON.parse(JSON.stringify(T.sample)); go("result"); });
  await p.locator('[data-act=log][data-v=less]').first().click();
  await p.clock.setSystemTime(new Date("2026-11-07T00:01:00+09:00"));
  await p.evaluate(() => go("result")); await p.locator('[data-act=log][data-v=more]').first().click();
  let g = await p.evaluate(() => JSON.parse(localStorage.getItem("epc.healthlog")).entries["bench:grip"]);
  ok("자정 전후(23:59 → 00:01)는 다른 날로 기록", g.length === 2 && g[0].d === "2026-11-06" && g[1].d === "2026-11-07", JSON.stringify(g));
  await p.clock.setSystemTime(new Date("2026-11-07T08:59:00+09:00"));
  await p.evaluate(() => go("result")); await p.locator('[data-act=log][data-v=same]').first().click();
  await p.clock.setSystemTime(new Date("2026-11-07T09:01:00+09:00"));
  await p.evaluate(() => go("result")); await p.locator('[data-act=log][data-v=less]').first().click();
  g = await p.evaluate(() => JSON.parse(localStorage.getItem("epc.healthlog")).entries["bench:grip"]);
  ok("UTC 날짜가 바뀌는 08:59 → 09:01(한국)은 같은 날이라 덮어씀", g.length === 2 && g[1].d === "2026-11-07" && g[1].v === "less" && /Z$/.test(g[1].savedAt), JSON.stringify(g));
  const pressed = await p.evaluate(() => document.querySelector('[data-act=log][data-v=less]').getAttribute("aria-pressed"));
  ok("오늘 기록이 버튼에 표시됨", pressed === "true");

  // H. 저장 실패
  await p.evaluate(() => { window.__orig = Storage.prototype.setItem; Storage.prototype.setItem = function () { throw new DOMException("full", "QuotaExceededError"); }; go("result"); });
  await p.locator('[data-act=log][data-v=more]').nth(1).click();
  const fh = await p.evaluate(() => ({ err: document.querySelector(".logmsg.err") && document.querySelector(".logmsg.err").textContent, pressed: document.querySelectorAll('[data-act=log][data-v=more]')[1].getAttribute("aria-pressed"), mem: !!(HEALTH.entries["bench:scap"]), stored: !!JSON.parse(localStorage.getItem("epc.healthlog")).entries["bench:scap"] }));
  ok("저장 실패: 안내 표시, 저장된 것처럼 보이지 않음", fh.err && fh.err.includes("저장하지 못했어요") && fh.pressed === "false" && !fh.mem && !fh.stored, JSON.stringify(fh));
  await p.evaluate(() => { Storage.prototype.setItem = window.__orig; window.__rm = Storage.prototype.removeItem; Storage.prototype.removeItem = function () { throw new Error("no"); }; });
  await p.click('[data-act=clearLog]');
  const fc = await p.evaluate(() => ({ msg: document.getElementById("clearmsg").textContent, still: !!localStorage.getItem("epc.healthlog"), mem: healthCount() }));
  ok("삭제 실패: '지우지 못했어요' 안내, 지운 것처럼 보이지 않음", fc.msg.includes("지우지 못했어요") && fc.still && fc.mem > 0, JSON.stringify(fc));
  await p.evaluate(() => { Storage.prototype.removeItem = window.__rm; });
  await p.click('[data-act=clearLog]');
  ok("삭제 정상", (await p.evaluate(() => [document.getElementById("clearmsg").textContent, localStorage.getItem("epc.healthlog")])).join("|") === "기록을 지웠어요.|");
  // 첫 저장 전 안내
  await p.evaluate(() => { localStorage.clear(); SETTINGS = loadSettings(); HEALTH = null; go("result"); });
  await p.locator('[data-act=log][data-v=less]').first().click();
  ok("첫 기록 전 안내가 뜨고 저장 안 됨", await p.evaluate(() => !!document.querySelector(".notice.consent") && !localStorage.getItem("epc.healthlog")));

  if (!QUICK) await flowTests(b);
  }
  // 근거-판단 규칙 추적 자료 (tools/audit). 다른 폴더의 앱을 검사할 때(--app)는 건너뛴다.
  if (ONLY !== 'review' && !opt('--app')) {
    const { spawnSync } = require('child_process');
    const run = (file, extra = []) => spawnSync(process.execPath, [path.join(__dirname, '..', 'tools', 'audit', file), ...extra], { encoding: 'utf8' });
    const v = run('verify-trace.js', ['--topic', 'bench']);
    ok("추적 자료 검증 (bench: 최신·규칙 기준 자료·독립 모델·고정 사례·Work ID)", v.status === 0, (v.stdout.match(/^FAIL .*/gm) || []).join(" / "));
    const t = run('test-audit.js', QUICK ? ['--quick'] : []);
    ok("추적 시스템 재현 테스트 (신규 논문 차단·우선순위 변경 감지)", t.status === 0, (t.stdout.match(/^FAIL .*/gm) || []).join(" / ") + (t.stderr || "").slice(0, 300));
  }
  console.log("page errors:", errs.length ? errs : "없음");
  ok("페이지 오류 없음", errs.length === 0, errs.join(" | "));
  console.log(`\n합계 PASS ${pass} / FAIL ${fail}`);
  if (failed.length) console.log("실패:", failed.join(" / "));
  await b.close();
  process.exit(fail ? 1 : 0);
})();
