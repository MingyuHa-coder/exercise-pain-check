/* =========================================================
   ENGINE — 화면, 상태, 공통 판단 함수. 콘텐츠(질문·문구·근거)는 content/ 폴더에 있다.
   ========================================================= */
const STAGES = ["위험 신호", "상황 질문", "점검할 것", "조정", "전문가"];
/* =========================================================
   RULES — 공통 규칙 (주제별 규칙은 content/topics/*.js 의 analyse)
   ========================================================= */
function has(a, q, v) { const x = a[q]; return Array.isArray(x) ? x.includes(v) : x === v; }
function finish(a, sc, patterns, picks, referDaily, referNerve = false) {
  const adjustments = picks.sort((x, y) => x[1] - y[1]).slice(0, 3).map(p => p[0]);
  const referLong = has(a, "dur", "gt6");
  const referWorse = has(a, "trend", "worse");
  /* C9: 답이 모호해 맨 앞 변수의 점수가 기준에 못 미치면 "좁히기 어려움"으로 표시한다. 기준(unclearBelow)은 주제 파일에 있다. */
  const top = (sc && patterns.length && sc[patterns[0]]) || 0;
  const unclear = !!(T && T.unclearBelow) && top < T.unclearBelow;
  return { sc, patterns, adjustments, unclear, referFirst: referDaily || referLong || referWorse || referNerve, referDaily, referLong, referWorse, referNerve };
}
const KIND = { fact: "논문 확인", synth: "연구 종합 해석", app: "앱 제안", hypo: "검증 안 된 가설" };
const tag = k => `<span class="tag ${k}">${KIND[k]}</span>`;
/* 전문가 검토 표시: content/reviews.js 의 기록에서 만든다. 검토 뒤 문구가 바뀐 항목(changedAfter)은 표시하지 않는다. */
const REVIEW_AT = {};
REVIEWS.forEach(r => { if (!r.changedAfter) r.keys.forEach(k => { REVIEW_AT[k] = r; }); });
function rvb(key) {
  const r = REVIEW_AT[key]; if (!r) return "";
  const who = r.field ? ` · ${r.field}` : "";
  return `<span class="rv" title="검토 목록 ${esc(r.item)}${esc(who)} · ${esc(r.date)}">${r.result === "고침" ? "전문가 검토 의견 반영" : "전문가 검토 완료"}</span>`;
}
/* 근거 수준: 출처에 나온 연구마다 "연구 종류 · 대상"을 붙인다 (content/studies.js) */
function levels(src) {
  const list = studiesIn(src);
  if (!list.length) return "";
  return `<ul class="lv">${list.map(s => `<li><b>${esc(s.name)}</b> ${esc(s.type)} · ${esc(s.who)} <span class="fit ${s.app === "직접" ? "d" : s.app === "지침" ? "g" : "i"}">${esc(APP_FIT[s.app])}</span></li>`).join("")}</ul>`;
}
const basis = (k, text, src) => text ? `<div class="basis">${tag(k)}<div><p>${esc(text)}${src ? ` <span class="src">· ${esc(src)}</span>` : ""}</p>${k === "fact" ? levels(src) : ""}</div></div>` : "";
/* 설명 카드. detail은 "근거 자세히" 안에 접어서 보여준다. */
function card(title, ev, body, src, rvKey, detail) {
  return `<div class="card"><div class="head"><h3>${esc(title)}</h3>${chip(ev)}</div><div class="tags">${tag("synth")}${rvKey ? rvb(rvKey) : ""}</div><p>${esc(body)}</p>${detail ? `<details class="more"><summary>근거 자세히</summary><p>${esc(detail)}</p></details>` : ""}<p class="src">${esc(src)}</p>${levels(src)}</div>`;
}

let T, RED_FLAGS, FLAG_LEVELS, QUESTIONS, PATTERNS, ADJUSTMENTS, SOURCES;
function setTopic(id) {
  S.topic = id; T = TOPICS[id];
  ({ redFlags: RED_FLAGS, flagLevels: FLAG_LEVELS, questions: QUESTIONS, patterns: PATTERNS, adjustments: ADJUSTMENTS, sources: SOURCES } = T);
}
function analyse(a) { return T.analyse(a); }

function josa(word, j) {
  const core = word.replace(/\([^)]*\)$/, "").trim();
  const c = core.charCodeAt(core.length - 1) - 0xAC00;
  const hangul = c >= 0 && c < 11172, jong = hangul ? c % 28 : 0, b = jong !== 0, r = jong === 8;
  return { "이": b ? "이" : "가", "가": b ? "이" : "가", "을": b ? "을" : "를", "를": b ? "을" : "를",
    "은": b ? "은" : "는", "는": b ? "은" : "는", "과": b ? "과" : "와", "와": b ? "과" : "와",
    "으로": b && !r ? "으로" : "로", "로": b && !r ? "으로" : "로", "이에요": b ? "이에요" : "예요", "예요": b ? "이에요" : "예요" }[j];
}
const toPro = text => text.replace(GLOSS_RE, (m, t, j) => { const w = GLOSS_MAP[t]; return w + (j ? josa(w, j) : ""); });
function applyLevel(root) {
  if (S.level !== "pro") return;
  const walk = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  const nodes = []; while (walk.nextNode()) nodes.push(walk.currentNode);
  nodes.forEach(n => { if (n.parentElement && n.parentElement.closest("[data-raw]")) return; const t = toPro(n.nodeValue); if (t !== n.nodeValue) n.nodeValue = t; });
  root.querySelectorAll("textarea").forEach(el => { el.value = toPro(el.value); });
}

/* =========================================================
   STATE & STORAGE
   ========================================================= */
const S = { screen: "start", level: (() => { try { return localStorage.getItem("painLevel") === "pro" ? "pro" : "easy"; } catch (e) { return "easy"; } })(), topic: null, part: null, exi: null, area: null, agreed: false, flags: {}, qi: 0, a: {} };
const LOG_KEY = "bench-shoulder-log";
function loadLog() { try { return JSON.parse(localStorage.getItem(LOG_KEY)) || {}; } catch (e) { return {}; } }
function saveLog(log) { try { localStorage.setItem(LOG_KEY, JSON.stringify(log)); } catch (e) { /* 저장 불가 환경 */ } }
let LOG = loadLog();
const logId = id => S.topic === "bench" ? id : `${S.topic}:${id}`;

const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const EV = { strong: ["strong", "근거 강함"], mid: ["mid", "근거 중간"], weak: ["weak", "근거 약함"] };
const chip = ev => `<span class="chip ${EV[ev][0]}">${EV[ev][1]}</span>`;
const label = (qid, v) => { const q = QUESTIONS.find(x => x.id === qid); const o = q && q.opts.find(x => x[0] === v); return o ? o[1] : v; };

/* =========================================================
   VIEWS
   ========================================================= */
function stageIndex() {
  return { start: -1, flags: 0, flagged: 0, q: 1, result: 3, expert: 4 }[S.screen];
}

function renderStages() {
  const now = stageIndex();
  document.getElementById("stages").innerHTML = STAGES.map((s, i) => {
    let cls = i < now ? "done" : i === now ? "now" : "";
    if (S.screen === "result" && i === 2) cls = "done";
    return `<div class="stage ${cls}"><i></i><small>${s}</small></div>`;
  }).join("");
}

function viewPicker() {
  const part = BODY.find(b => b.id === S.part);
  const ex = part && part.ex[S.exi];
  return `<div class="parts body" role="group" aria-label="운동 부위">
      ${BODY.map(b => `<button class="part" data-act="part" data-v="${b.id}" aria-pressed="${S.part === b.id}">${esc(b.name)}</button>`).join("")}
    </div>
    ${part ? `<div class="opts" role="group" aria-label="${esc(part.name)} 운동">
      ${part.ex.map((e, i) => `<button class="opt" data-act="exer" data-v="${i}" aria-pressed="${S.exi === i}"><span class="mark"></span><span>${esc(e.n)}</span></button>`).join("")}
    </div>` : `<p class="subq">운동한 부위를 먼저 골라 주세요.</p>`}
    ${ex && ex.at.length > 1 ? `<p class="subq">${esc(ex.n)}에서 어디가 아픈가요?</p>
    <div class="parts" role="group" aria-label="아픈 곳">
      ${ex.at.map((x, i) => `<button class="part" data-act="area" data-v="${i}" aria-pressed="${S.area === i}">${esc(x[0])}</button>`).join("")}
    </div>` : ""}`;
}

function pickArea(at, i) {
  S.area = i; S.pre = at[2] || {}; S.flags = {}; S.a = Object.assign({}, S.pre); S.qi = 0;
  setTopic(at[1]); render();
}

function viewStart() {
  return `<section class="screen stack-lg">
    <div class="stack">
      <p class="eyebrow">5분 자가점검</p>
      <h1>${T ? esc(T.hero) : "운동할 때 아프다면"}</h1>
      <p class="lead">질문에 답하면 위험 신호를 먼저 거르고, 내 운동에서 점검할 것과 다음 운동에서 바꿔볼 것, 그리고 전문가를 만나야 할 때를 알려드려요.</p>
    </div>
    <div class="stack">
      <h3>설명은 어떻게 볼까요?</h3>
      <div class="levelpick" role="group" aria-label="설명 방식">
        <button class="opt" data-act="level" data-v="easy" aria-pressed="${S.level === "easy"}"><span>쉬운 말</span><small data-raw>날개뼈, 무릎뼈처럼 풀어서</small></button>
        <button class="opt" data-act="level" data-v="pro" aria-pressed="${S.level === "pro"}"><span>의학 용어</span><small>견갑골, 슬개골처럼 논문 용어로</small></button>
      </div>
      <p class="subq">위쪽 "설명" 버튼으로 언제든 바꿀 수 있어요.</p>
    </div>
    <div class="stack">
      <h3>어떤 운동에서 아픈가요?</h3>
      ${viewPicker()}
    </div>
    <div class="card">
      <h3>이렇게 진행돼요</h3>
      <ol class="flow">
        <li><em>1</em><span>위험 신호 ${T ? RED_FLAGS.length + "문항" : "5~6문항"}. 해당하면 바로 진료를 안내해요.</span></li>
        <li><em>2</em><span>아픈 상황과 ${T ? esc(T.name) : "운동"} 방식에 대한 질문 ${T ? QUESTIONS.length + "개" : "10~11개"}</span></li>
        <li><em>3</em><span>답변과 관련 있는 운동 변수와 근거</span></li>
        <li><em>4</em><span>다음 운동에서 바꿔볼 조정 2~3개와 결과 기록</span></li>
        <li><em>5</em><span>전문가에게 확인받아야 할 때</span></li>
      </ol>
    </div>
    <div class="notice">
      <h3>시작하기 전에</h3>
      <p>이 앱은 의료기기가 아니며 질병 여부를 판단하지 않습니다. 결과는 진단이 아니라 운동할 때 참고할 정보예요. 통증이 계속되거나 심해지면 정형외과나 재활의학과 진료를 받으세요.</p>
      <label class="check" for="agree"><input type="checkbox" id="agree" ${S.agreed ? "checked" : ""}> 위 내용을 확인했어요</label>
    </div>
    <div class="row">
      <button class="btn" data-act="start" ${S.agreed && T ? "" : "disabled"}>점검 시작</button>
    </div>
    ${T ? `<p class="src">먼저 둘러보고 싶다면 <button class="linkbtn" data-act="sample">예시 답변으로 결과 미리보기</button></p>` : `<p class="src">위에서 운동을 고르면 시작할 수 있어요.</p>`}
  </section>`;
}

function viewFlags() {
  const all = RED_FLAGS.every(f => S.flags[f.id] !== undefined);
  return `<section class="screen stack-lg">
    <div class="stack">
      <p class="eyebrow">1단계 · 위험 신호</p>
      <h2>먼저 위험 신호부터 확인할게요</h2>
      <p class="lead">하나라도 "예"면 운동 조언 대신 진료를 안내해요.</p>
    </div>
    <div class="card">
      ${RED_FLAGS.map(f => {
        const v = S.flags[f.id];
        return `<div class="flag"><p>${esc(f.q)}${rvb(S.topic + ".flag." + f.id) ? " " + rvb(S.topic + ".flag." + f.id) : ""}</p>
          <div class="seg" role="group" aria-label="${esc(f.q)}">
            <button class="yes" data-act="flag" data-id="${f.id}" data-v="1" aria-pressed="${v === true}">예</button>
            <button class="no" data-act="flag" data-id="${f.id}" data-v="0" aria-pressed="${v === false}">아니오</button>
          </div></div>`;
      }).join("")}
    </div>
    <div class="row">
      <button class="btn ghost" data-act="home">처음으로</button>
      <button class="btn" data-act="flagsNext" ${all ? "" : "disabled"}>다음</button>
    </div>
    ${all ? "" : `<p class="src">${RED_FLAGS.length - Object.keys(S.flags).length}개 항목이 남았어요.</p>`}
  </section>`;
}

function viewFlagged() {
  const hits = RED_FLAGS.filter(f => S.flags[f.id]);
  const level = Math.min(...hits.map(f => f.level));
  const L = FLAG_LEVELS[level];
  return `<section class="screen stack-lg">
    <div class="alert">
      <p class="eyebrow">위험 신호 해당</p>
      <h2>${esc(L.title)}</h2>
      <p>${esc(L.body)}</p>
      ${L.call ? `<p><a href="tel:119" style="font-family:var(--font-display);font-size:32px;text-decoration:none;color:var(--danger)">119</a></p>` : ""}
    </div>
    <div class="card">
      <h3>"예"라고 답한 항목</h3>
      <ul class="sources" style="color:var(--ink);font-size:15px">${hits.map(f => `<li>${esc(f.q)}</li>`).join("")}</ul>
      <p class="note">이 경우엔 운동 조정이나 보조운동을 안내하지 않아요. 진료를 받은 뒤 운동 복귀는 담당 의료진과 상의하세요.</p>
    </div>
    <div class="row">
      <button class="btn ghost" data-act="backFlags">답 고치기</button>
      <button class="btn ghost" data-act="home">처음으로</button>
    </div>
    <p class="src">근거: ${esc(T.flagSrc)}</p>
  </section>`;
}

function barFigure(sel) {
  const pos = { g1: 50, g15: 75, g2: 100 }[sel];
  const hand = x => `<rect x="${x - 4}" y="22" width="8" height="26" rx="3" fill="var(--ink)"/>`;
  const tick = (x, t) => `<line x1="${x}" y1="52" x2="${x}" y2="58" stroke="var(--muted)" stroke-width="1"/>${t ? `<text x="${x}" y="70" text-anchor="middle">${t}</text>` : ""}`;
  return `<svg class="bar-fig" viewBox="0 0 320 78" role="img" aria-label="바벨 그립 너비 비교">
    <line x1="8" y1="35" x2="312" y2="35" stroke="var(--muted)" stroke-width="3" stroke-linecap="round"/>
    <rect x="12" y="10" width="12" height="50" rx="2" fill="var(--plate)"/>
    <rect x="296" y="10" width="12" height="50" rx="2" fill="var(--plate)"/>
    <line x1="110" y1="14" x2="210" y2="14" stroke="var(--muted)" stroke-width="1" stroke-dasharray="3 3"/>
    <text x="160" y="10" text-anchor="middle">어깨너비</text>
    ${tick(110, "")}${tick(85, "")}${tick(60, "")}${tick(210, "1×")}${tick(235, "1.5×")}${tick(260, "2×")}
    ${pos ? hand(160 - pos) + hand(160 + pos) : ""}
  </svg>`;
}

function elbowFigure(sel) {
  const sh = { L: [130, 62], R: [190, 62] }, len = 70;
  const angles = { tucked: 45, mid: 70, flared: 90 };
  const arm = (deg, side, cls) => {
    const r = deg * Math.PI / 180, s = side === "R" ? 1 : -1;
    const [x, y] = sh[side];
    const ex = x + s * len * Math.sin(r), ey = y + len * Math.cos(r);
    const on = cls === "on";
    return `<line x1="${x}" y1="${y}" x2="${ex.toFixed(1)}" y2="${ey.toFixed(1)}" stroke="${on ? "var(--plate)" : "var(--muted)"}" stroke-width="${on ? 10 : 1.5}" stroke-linecap="round" ${on ? "" : "stroke-dasharray=\"4 4\""}/>` +
      (on ? `<circle cx="${ex.toFixed(1)}" cy="${ey.toFixed(1)}" r="7" fill="var(--ink)"/>` : "");
  };
  const lab = { 90: [272, 66], 70: [266, 96], 45: [248, 128] };
  const label = deg => `<text x="${lab[deg][0]}" y="${lab[deg][1]}" style="${angles[sel] === deg ? "fill:var(--plate);font-weight:600" : ""}">${deg}°</text>`;
  return `<svg class="bar-fig" viewBox="0 0 320 186" role="img" aria-label="벤치에 누운 모습을 위에서 본 팔꿈치 각도 비교">
    <circle cx="160" cy="34" r="16" fill="none" stroke="var(--muted)" stroke-width="1.5"/>
    <rect x="126" y="52" width="68" height="120" rx="16" fill="var(--chalk)" stroke="var(--muted)" stroke-width="1.5"/>
    <text x="160" y="118" text-anchor="middle">몸통</text>
    ${[45, 70, 90].filter(d => d !== angles[sel]).map(d => arm(d, "L") + arm(d, "R")).join("")}
    ${sel ? arm(angles[sel], "L", "on") + arm(angles[sel], "R", "on") : ""}
    ${label(90)}${label(70)}${label(45)}
  </svg>`;
}

function arcFigure(sel) {
  const cx = 150, cy = 100, r = 84;
  const pt = deg => { const t = deg * Math.PI / 180; return [cx + r * Math.sin(t), cy + r * Math.cos(t)]; };
  const arc = (a, b, color, w) => { const [x1, y1] = pt(a), [x2, y2] = pt(b); return `<path d="M${x1.toFixed(1)} ${y1.toFixed(1)} A${r} ${r} 0 0 0 ${x2.toFixed(1)} ${y2.toFixed(1)}" fill="none" stroke="${color}" stroke-width="${w}" stroke-linecap="round"/>`; };
  const hot = k => sel === k || sel === "all";
  const armDeg = sel === "top" ? 165 : sel === "mid" ? 90 : sel === "all" ? 120 : 90;
  const [ax, ay] = pt(armDeg);
  return `<svg class="bar-fig" viewBox="0 0 320 200" role="img" aria-label="팔을 옆으로 들어 올리는 범위와 아픈 구간">
    ${arc(8, 60, "var(--muted)", 2)}
    ${arc(60, 120, "var(--warn)", hot("mid") ? 10 : 4)}
    ${arc(120, 172, "var(--plate)", hot("top") ? 10 : 4)}
    <circle cx="${cx - 26}" cy="${cy - 36}" r="15" fill="none" stroke="var(--muted)" stroke-width="1.5"/>
    <rect x="${cx - 50}" y="${cy - 16}" width="48" height="96" rx="14" fill="var(--chalk)" stroke="var(--muted)" stroke-width="1.5"/>
    <line x1="${cx}" y1="${cy}" x2="${ax.toFixed(1)}" y2="${ay.toFixed(1)}" stroke="var(--ink)" stroke-width="8" stroke-linecap="round"/>
    <circle cx="${cx}" cy="${cy}" r="5" fill="var(--ink)"/>
    <text x="${cx + r + 8}" y="${cy + 4}">90°</text>
    <text x="${cx}" y="${cy - r - 8}" text-anchor="middle">180°</text>
    <text x="${cx + 10}" y="${cy + r + 10}">0°</text>
  </svg>`;
}

function viewQuestion() {
  const q = QUESTIONS[S.qi];
  const v = S.a[q.id];
  const answered = q.multi ? Array.isArray(v) && v.length > 0 : v !== undefined;
  const pressed = val => q.multi ? (Array.isArray(v) && v.includes(val)) : v === val;
  return `<section class="screen stack-lg">
    <div class="stack">
      <div class="head"><p class="eyebrow">2단계 · 상황 질문</p><span class="qcount">${S.qi + 1} / ${QUESTIONS.length}</span></div>
      <h2>${esc(q.q)}</h2>
      ${q.hint ? `<p class="lead">${esc(q.hint)}</p>` : ""}
      ${basis("hypo", q.hypo)}
      ${rvb(S.topic + ".q." + q.id)}
    </div>
    ${q.figure === "bar" ? `<div class="card">${barFigure(v)}<p class="src">파란 원판 사이의 검은 막대가 지금 고른 손 위치예요.</p></div>` : ""}
    ${q.figure === "arc" ? `<div class="card">${arcFigure(v)}<p class="src">앞에서 본 모습이에요. 노란 구간이 어깨 높이 전후(60~120°), 파란 구간이 끝까지 올리는 범위예요. 60~120° 기준은 Michener 2009을 따랐어요.</p></div>` : ""}
    ${q.figure === "elbow" ? `<div class="card">${elbowFigure(v)}<p class="src">${v ? "파란 팔이 지금 고른 각도예요. 점선은 다른 선택지예요." : "아래에서 고르면 그림에 표시돼요."} 몸통에 바짝은 45°, 중간은 약 70°, 일자는 90°예요.</p></div>` : ""}
    <div class="opts" role="group" aria-label="${esc(q.q)}">
      ${q.opts.map(([val, text]) => q.imgs ? `<button class="opt pic" data-act="choose" data-v="${val}" aria-pressed="${pressed(val)}"><img src="${q.imgs[val]}" alt="${esc(text)}: 바벨을 잡은 손 간격을 위에서 본 사진" width="900" height="298"><span class="pic-label"><span class="mark"></span><span>${esc(text)}</span></span></button>` : `<button class="opt ${q.multi ? "multi" : ""}" data-act="choose" data-v="${val}" aria-pressed="${pressed(val)}"><span class="mark"></span><span>${esc(text)}</span></button>`).join("")}
    </div>
    <div class="row">
      <button class="btn ghost" data-act="prev">이전</button>
      <button class="btn" data-act="next" ${answered ? "" : "disabled"}>${S.qi === QUESTIONS.length - 1 ? "결과 보기" : "다음"}</button>
    </div>
  </section>`;
}

function viewResult() {
  const r = analyse(S.a);
  const today = new Date().toISOString().slice(0, 10);
  /* 결과는 질환명이 아니라 "답변과 관련 있는 운동 변수"로 보여준다 (기획서 6-3). 연구에서 쓰는 이름은 접어서 참고로만. */
  const pats = r.patterns.map((id, i) => {
    const p = PATTERNS[id];
    const eyebrow = r.unclear ? "참고로 볼 수 있는 것" : i === 0 ? "먼저 점검할 것" : "함께 점검할 것";
    return `<div class="card">
      <div class="head"><div class="stack" style="gap:2px"><span class="eyebrow">${eyebrow}</span><h3>${esc(p.title)}</h3></div>${chip(p.ev)}</div>
      <div class="tags">${tag("synth")}</div>
      <p>${esc(p.plain)}</p>
      ${p.check && p.check.length ? `<div class="checks"><span>점검할 운동 변수</span><ul>${p.check.map(c => `<li>${esc(c)}</li>`).join("")}</ul></div>` : ""}
      <p><b>${esc(p.say)}</b></p>
      ${basis("fact", p.evText, p.src)}
      ${basis("hypo", p.hypo)}
      ${p.term ? `<details class="more"><summary>연구에서 쓰는 이름</summary><p>${esc(p.term)}. 앱은 이 이름으로 판정하지 않아요. 논문을 찾아볼 때 참고하세요.</p></details>` : ""}
      ${rvb(S.topic + ".pat." + id)}
    </div>`;
  }).join("");

  const unclear = r.unclear ? `<div class="notice">
      <h3>답변만으로는 어떤 운동 변수가 관련 있는지 좁히기 어려워요</h3>
      <p>"잘 모르겠음"이 많거나 답이 서로 다른 쪽을 가리킬 때 이렇게 보여요. 아래는 이 운동에서 흔히 점검하는 것이니 참고만 하세요. 다음 운동 때 아픈 위치와 순간을 살펴본 뒤 다시 해 보면 더 좁힐 수 있어요.</p>
      ${basis("hypo", "어느 정도면 \"좁히기 어려움\"으로 볼지는 앱이 정한 기준이에요 (검토 목록 C9).")}
    </div>` : "";

  const adj = r.adjustments.map(id => {
    const d = ADJUSTMENTS[id];
    const entries = LOG[logId(id)] || [];
    const last = entries[entries.length - 1];
    const msg = !last ? "다음 운동 후에 기록해 주세요." :
      last.v === "less" ? `${last.d}: 덜 아팠어요. 이 조정이 나에게 맞는 단서예요.` :
      last.v === "same" ? `${last.d}: 같았어요. 다른 조정과 함께 2주는 지켜보세요.` :
      `${last.d}: 더 아팠어요. 이 조정은 멈추고, 계속 아프면 전문가에게 확인받으세요.`;
    return `<div class="adj">
      <div class="head"><h3>${esc(d.title)}</h3>${chip(d.ev)}</div>
      ${basis("app", d.how)}
      ${basis("fact", d.fact, d.src)}
      ${basis("hypo", d.hypo)}
      ${rvb(S.topic + ".adj." + id)}
      <div class="log">
        <div class="seg" role="group" aria-label="${esc(d.title)} 결과 기록">
          <button data-act="log" data-id="${id}" data-v="less" aria-pressed="${last && last.d === today && last.v === "less"}">덜 아팠어요</button>
          <button data-act="log" data-id="${id}" data-v="same" aria-pressed="${last && last.d === today && last.v === "same"}">같았어요</button>
          <button data-act="log" data-id="${id}" data-v="more" aria-pressed="${last && last.d === today && last.v === "more"}">더 아팠어요</button>
        </div>
        <p class="logmsg">${esc(msg)}</p>
      </div>
    </div>`;
  }).join("");

  const refer = r.referFirst ? `<div class="notice" style="background:var(--warn-tint)">
      <h3>이 경우엔 진료를 먼저 권해요</h3>
      <p>${[r.referHip && "고관절이 걸리거나 잠기는 느낌, 또는 엉덩이 바깥쪽 통증이 있고", r.referInstab && "어깨가 빠질 것 같은 느낌이 있고", r.referWrist && "손목 옆쪽이나 손바닥 쪽이 아프고", r.referElbow && "팔꿈치 앞쪽이 아프고", r.referKnee && "무릎이 붓거나 안·바깥쪽이 아프고", r.referNerve && "통증이나 저림이 무릎 아래로 내려가고", r.referDaily && "운동하지 않을 때도 아프고", r.referLong && "6주 넘게 계속되고", r.referWorse && "점점 나빠지고"].filter(Boolean).join(", ")} 있어요. 아래 조정은 참고만 하고, 정형외과나 재활의학과에서 먼저 확인받으세요.</p>
    </div>` : "";

  const logCount = Object.keys(LOG).length;
  return `<section class="screen stack-lg">
    <div class="stack">
      <p class="eyebrow">3단계 · 점검할 것</p>
      <h2>답변과 관련 있는 운동 변수예요</h2>
      <p class="lead">무엇이 문제인지 판정하는 게 아니라, 다음 운동에서 무엇을 살펴보고 바꿔볼지 정하기 위한 안내예요.</p>
    </div>
    <div class="card legend">
      <h3>이 결과를 읽는 법</h3>
      <p class="src">모든 내용에 아래 네 가지 중 하나를 붙였어요. 근거의 출처와 한계를 함께 보여드리기 위해서예요.</p>
      <ul class="kinds">
        <li>${tag("fact")}<span>논문 본문에서 직접 확인한 결과. 아래에 연구 종류와 대상을 붙였어요</span></li>
        <li>${tag("synth")}<span>여러 연구를 종합해서 내린 해석</span></li>
        <li>${tag("app")}<span>연구를 바탕으로 앱이 권하는 실용적인 방법</span></li>
        <li>${tag("hypo")}<span>앱이 세운 것으로, 아직 연구로 확인되지 않은 부분</span></li>
      </ul>
      <p class="src"><span class="rv">전문가 검토 완료</span> 표시는 그 항목만 검토를 마쳤다는 뜻이에요. 답변으로 점검할 것과 조정을 고르는 규칙 등 나머지는 아직 검토 전이에요.</p>
    </div>
    ${refer}
    ${unclear}
    ${pats}
    ${T.extras(r).join("")}

    ${adj ? `<div class="stack">
      <p class="eyebrow">4단계 · 다음 운동에서 해볼 조정</p>
      <h2>다음 운동에서 이것부터 바꿔 보세요</h2>
      <p class="lead">운동이 끝나면 각 조정 아래에 기록하세요. 내 운동을 돌아보기 위한 기록이고, 조정의 효과를 증명하는 건 아니에요.</p>
    </div>
    <div class="card">${adj}
      <p class="src">기록은 이 기기의 브라우저에만 저장되고 어디로도 보내지 않아요.${logCount ? ` <button class="linkbtn" data-act="clearLog">내 기록 모두 지우기</button>` : ""}</p>
      <p class="logmsg" id="clearmsg"></p>
    </div>` : `<div class="stack">
      <p class="eyebrow">4단계 · 다음 운동에서 해볼 조정</p>
      <h2>이 경우엔 운동 조정보다 진료가 먼저예요</h2>
      <p class="lead">아래 "전문가에게 확인받을 때 보기"에서 어디로 가면 되는지 확인하세요.</p>
    </div>`}

    <div class="row">
      <button class="btn" data-act="expert">전문가에게 확인받을 때 보기</button>
    </div>
    <div class="row">
      <button class="btn ghost small" data-act="editAnswers">답 고치기</button>
      <button class="btn ghost small" data-act="restart">처음부터 다시</button>
    </div>

    <div class="card">
      <h3>근거 자료</h3>
      <ul class="sources">${SOURCES.map(([t, u]) => `<li><a href="${u}" target="_blank" rel="noopener">${esc(t)}</a></li>`).join("")}</ul>
      <p class="src">${esc(T.name)} 콘텐츠 버전 ${esc(T.meta ? T.meta.version : CONTENT_VERSION)} · ${esc(T.meta ? T.meta.updated : "")}</p>
    </div>
  </section>`;
}

function summaryText(r) {
  const lines = [`[${T.brand} 결과 요약]`, ...T.summary(S.a), `관련 운동 변수: ${r.patterns.map(p => PATTERNS[p].title).join(", ")}`];
  const logged = Object.keys(ADJUSTMENTS).filter(k => (LOG[logId(k)] || []).length);
  if (logged.length) {
    lines.push("조정 기록:");
    logged.forEach(k => { const arr = LOG[logId(k)]; const l = arr[arr.length - 1]; lines.push(`- ${ADJUSTMENTS[k].title}: ${{ less: "덜 아팠음", same: "같았음", more: "더 아팠음" }[l.v]} (${l.d})`); });
  }
  return lines.join("\n");
}

function viewExpert() {
  const r = analyse(S.a);
  const rows = [
    ["조정을 2주 해도 그대로이거나 나빠짐", "정형외과·재활의학과", "원인을 확인받을 시점이에요", r.referWorse],
    ["운동 안 할 때도 아프거나 6주 넘게 지속", "정형외과·재활의학과", "오래된 통증은 진료가 먼저예요", r.referDaily || r.referLong || r.referNerve || r.referKnee || r.referElbow || r.referWrist || r.referInstab || r.referHip],
    ["통증은 줄었는데 자세가 불안함", "트레이너", "폼 교정과 프로그램 조정", false],
  ];
  return `<section class="screen stack-lg">
    <div class="stack">
      <p class="eyebrow">5단계 · 전문가 연결</p>
      <h2>이럴 땐 전문가에게 확인받으세요</h2>
      <p class="lead">2주는 다 나을 때까지 기다리는 기간이 아니라, 한 번 확인받을 시점이에요.</p>
      ${rvb("all.expert")}
      ${basis("hypo", "\"2주\"는 앱이 정한 확인 시점이에요. 영국 1차 진료 요약은 운동으로 좋아지는 데 6~12주를 보고, 그때도 나아지지 않으면 의뢰하라고 해요.")}
    </div>
    <div class="card tablewrap">
      <table>
        <thead><tr><th>상황</th><th>찾아갈 곳</th><th>이유</th></tr></thead>
        <tbody>${rows.map(([a, b, c, hit]) => `<tr class="${hit ? "hit" : ""}"><td>${esc(a)}${hit ? "<br><span class=\"src\" style=\"color:var(--plate)\">내 답변에 해당</span>" : ""}</td><td>${esc(b)}</td><td>${esc(c)}</td></tr>`).join("")}</tbody>
      </table>
    </div>
    <div class="card">
      <h3>전문가에게 보여줄 요약</h3>
      <p class="src">진료나 상담 때 이 내용을 보여주면 설명 시간이 줄어요.</p>
      <pre class="summary" id="summary">${esc(summaryText(r))}</pre>
      <div class="row"><button class="btn small" data-act="copy">요약 복사</button></div>
      <p class="logmsg" id="copymsg"></p>
    </div>
    <div class="notice">
      <h3>병원·트레이너 연결은 준비 중이에요</h3>
      <p>나중에는 이 요약을 들고 가까운 전문가와 바로 연결할 수 있게 만들 예정이에요.</p>
    </div>
    <div class="row">
      <button class="btn ghost" data-act="toResult">결과로 돌아가기</button>
      <button class="btn ghost" data-act="restart">처음부터 다시</button>
    </div>
  </section>`;
}

function render() {
  renderStages();
  document.getElementById("brandName").textContent = T ? T.brand : "운동 통증 점검";
  document.getElementById("brandTag").textContent = T ? T.eyebrow : "PAIN CHECK";
  document.getElementById("ver").textContent = `콘텐츠 버전 ${CONTENT_VERSION}`;
  const v = { start: viewStart, flags: viewFlags, flagged: viewFlagged, q: viewQuestion, result: viewResult, expert: viewExpert }[S.screen];
  document.getElementById("main").innerHTML = v();
  document.querySelectorAll('[data-act="level"]').forEach(el => el.setAttribute("aria-pressed", String(el.dataset.v === S.level)));
  applyLevel(document.getElementById("main"));
}
function go(screen) { S.screen = screen; render(); window.scrollTo(0, 0); }

/* =========================================================
   ACTIONS
   ========================================================= */
const ACT = {
  level(d) { S.level = d.v === "pro" ? "pro" : "easy"; try { localStorage.setItem("painLevel", S.level); } catch (e) { /* 저장 불가 */ } render(); },
  part(d) { if (S.part !== d.v) { S.part = d.v; S.exi = null; S.area = null; S.topic = null; T = null; } render(); },
  exer(d) { const ex = BODY.find(b => b.id === S.part).ex[+d.v]; S.exi = +d.v; S.area = null;
    if (ex.at.length === 1) pickArea(ex.at[0], 0); else { S.topic = null; T = null; render(); } },
  area(d) { const ex = BODY.find(b => b.id === S.part).ex[S.exi]; pickArea(ex.at[+d.v], +d.v); },
  start() { go("flags"); },
  home() { go("start"); },
  sample() { S.agreed = true; S.flags = Object.fromEntries(RED_FLAGS.map(f => [f.id, false])); S.a = JSON.parse(JSON.stringify(T.sample)); S.qi = QUESTIONS.length - 1; go("result"); },
  flag(d) { S.flags[d.id] = d.v === "1"; const y = window.scrollY; render(); window.scrollTo(0, y); },
  flagsNext() { go(RED_FLAGS.some(f => S.flags[f.id]) ? "flagged" : "q"); },
  backFlags() { go("flags"); },
  choose(d) {
    const q = QUESTIONS[S.qi];
    if (q.multi) {
      let cur = Array.isArray(S.a[q.id]) ? S.a[q.id].slice() : [];
      if (d.v === "none") cur = cur.includes("none") ? [] : ["none"];
      else { cur = cur.filter(x => x !== "none"); cur = cur.includes(d.v) ? cur.filter(x => x !== d.v) : cur.concat(d.v); }
      S.a[q.id] = cur;
    } else S.a[q.id] = d.v;
    render();
  },
  prev() { if (S.qi === 0) go("flags"); else { S.qi--; go("q"); } },
  next() { if (S.qi < QUESTIONS.length - 1) { S.qi++; go("q"); } else go("result"); },
  log(d) {
    const today = new Date().toISOString().slice(0, 10);
    const key = logId(d.id);
    const arr = (LOG[key] || []).filter(e => e.d !== today);
    arr.push({ d: today, v: d.v });
    LOG[key] = arr; saveLog(LOG);
    const y = window.scrollY; render(); window.scrollTo(0, y);
  },
  clearLog() { LOG = {}; try { localStorage.removeItem(LOG_KEY); } catch (e) { /* 저장 불가 */ } const y = window.scrollY; render(); window.scrollTo(0, y); },
  expert() { go("expert"); },
  toResult() { go("result"); },
  editAnswers() { S.qi = 0; go("q"); },
  restart() { S.flags = {}; S.a = Object.assign({}, S.pre || {}); S.qi = 0; go("start"); },
  copy() {
    const el = document.getElementById("summary"), msg = document.getElementById("copymsg");
    const done = () => { msg.textContent = "복사했어요."; };
    const fallback = () => { const r = document.createRange(); r.selectNodeContents(el); const s = getSelection(); s.removeAllRanges(); s.addRange(r); msg.textContent = "복사가 막혀 있어요. 선택된 글을 길게 눌러 복사해 주세요."; };
    try { navigator.clipboard.writeText(el.textContent).then(done, fallback); } catch (e) { fallback(); }
  },
};

document.addEventListener("click", e => {
  const t = e.target.closest("[data-act]");
  if (!t || t.disabled) return;
  ACT[t.dataset.act](t.dataset);
});
document.addEventListener("change", e => {
  if (e.target.id === "agree") { S.agreed = e.target.checked; render(); document.getElementById("agree").focus(); }
});

render();
