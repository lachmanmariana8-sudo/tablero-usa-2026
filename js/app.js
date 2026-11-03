/* Tablero Democrac.IA — Elecciones de medio término EE.UU. 2026 */
(function(){
"use strict";
const E = window.DATA_ELECTORAL, M = window.DATA_ECONOMIA, MAP = window.US_MAP;
const RATINGS = ["safe-d","likely-d","lean-d","tossup","lean-r","likely-r","safe-r"];
const COLORS = {"safe-d":"#124a85","likely-d":"#4480c4","lean-d":"#a7c8ec","tossup":"#f0c525","lean-r":"#ef9d9d","likely-r":"#d2574a","safe-r":"#8e1f1c"};
const DARK_FILLS = new Set(["safe-d","likely-d","likely-r","safe-r"]);
const TINY = new Set(["RI","DE","CT","NJ","MD","MA","NH","VT","DC","HI"]);

const I18N = {
es:{
  brandSub:"Tablero electoral · EE.UU. 2026",
  livePill:"Día de la elección · mar 3 nov 2026",
  heroTitle:"Elecciones de medio término · Estados Unidos 2026",
  heroSub:"35 bancas del Senado, las 435 de la Cámara de Representantes y 36 gobernaciones. Mapa estado por estado, escenarios de control del Congreso, variables económicas e impacto para América Latina. Todos los datos provienen de fuentes citadas; donde no hay dato verificado, se dice.",
  tabMap:"Mapa nacional", tabCongress:"Congreso y escenarios", tabEconomy:"Economía", tabLatam:"América Latina", tabSources:"Fuentes y metodología",
  boards:{senate:"Senado",governors:"Gobernaciones",house:"Cámara"},
  mapHint:"Pasá el mouse por un estado; hacé clic para el detalle completo.",
  ratings:{"safe-d":"Seguro D","likely-d":"Probable D","lean-d":"Inclinado D","tossup":"Toss-up","lean-r":"Inclinado R","likely-r":"Probable R","safe-r":"Seguro R"},
  noRace:"Sin elección de Senado en 2026", noRaceGov:"Sin elección de gobernador en 2026",
  lastPoll:"Última encuesta", incumbent:"Titular", defends:"defiende", openSeat:"banca abierta",
  summary:{
    senateK:"Senado · composición actual", senateV:"53 R — 47 D*", senateD:"35 bancas en juego: los republicanos defienden 22 y los demócratas 13. Los demócratas necesitan +4 netas para llegar a 51. *Incluye 2 independientes que votan con los demócratas.",
    houseK:"Cámara · composición actual", houseV:"220 R — 215 D", houseD:"Mayoría: 218. A los demócratas les bastan +3 bancas netas. Promedio final de boleta genérica: D +8,6 (mediana de 5 agregadores, 1-nov).",
    govK:"Gobernaciones en juego", govV:"36",
    ratingNote:"Rating de consenso: mediana de Cook Political Report, Inside Elections y Sabato's Crystal Ball (3-nov-2026); la categoría «tilt» se asimila a «inclinado», con nota en cada carrera."
  },
  houseMapNote:"La Cámara se elige por distrito, no por estado. Los círculos marcan cuántos de los distritos toss-up del consenso hay en cada estado; el detalle está debajo del mapa.",
  houseKeyTitle:"Distritos toss-up de la Cámara", houseKeySub:"Consenso de calificadores (13 toss-ups) más los que ABC News agrega a su lista (14).",
  congress:{
    title:"Congreso y escenarios de control",
    senBarTitle:"Senado — si los ratings de consenso se cumplen",
    senBarNote:"Un punto por banca: las que no se eligen en 2026 más las 35 en juego asignadas según el rating de consenso. Los toss-ups quedan sin asignar: son los que definen el control.",
    notUpD:"D sin elección", notUpR:"R sin elección",
    senMajority:"51 para el control", houseMajority:"218 para la mayoría",
    coherence:(nd,dr,toss,rr,nr)=>`Aritmética: ${nd} (D sin elección) + ${dr} (rating D) + ${toss} (toss-up) + ${rr} (rating R) + ${nr} (R sin elección) = ${nd+dr+toss+rr+nr} bancas.`,
    houseBarTitle:"Cámara — composición actual y umbral de mayoría",
    houseBarNote:"No hay proyección banca por banca de las 435: el consenso identifica 13 toss-ups y una ventaja demócrata de +8,6 en la boleta genérica.",
    closest:"Las carreras más cerradas del Senado", closestSub:"Ordenadas por el margen de la última encuesta disponible; el rating es el de consenso.",
    scenTitle:"Escenarios de control", scenSub:"Probabilidades asignadas por la mesa de JPMorgan (3-nov-2026); las implicancias completas, con fuentes, están en la sección Economía.",
    keysTitle:"Las claves de la elección", keysSub:"Según la cobertura y los agregadores citados en Fuentes.",
    gb:"Boleta genérica (promedio final)", tossups:"toss-ups", approval:"Aprobación presidencial", earlyVote:"Voto anticipado (récord)"
  },
  economy:{
    title:"Economía: punto de partida y escenarios",
    indTitle:"Variables al día de la elección", indSub:"Último dato verificado de cada indicador, con su fecha y fuente. Donde no hay dato verificable reciente, se consigna sin aproximar.",
    scenTitle:"Qué cambia según el resultado", scenSub:"Síntesis de análisis de terceros citados (JPMorgan AM, National Bank Financial, Capital.com, Charles Schwab, Morgan Stanley, CEPA, Orlando Ferreres, entre otros). Cada afirmación conserva su atribución.",
    fields:{fiscal:"Política fiscal",trade:"Comercio y aranceles",fed_rates:"Fed y tasas",markets:"Mercados",regulation:"Regulación y supervisión"},
    nd:"sin dato verificado"
  },
  latam:{
    title:"Impacto para América Latina",
    matrixTitle:"Matriz país × canal de impacto", matrixSub:"El punto indica que hay análisis citado para ese canal; el color, el nivel de exposición del país. Clic en una fila para el detalle.",
    country:"País / bloque", exposure:"Exposición",
    exp:{"alta":"Alta","media":"Media","media-baja":"Media-baja"},
    scen:{dem_sweep:"Demócratas ambas cámaras",divided:"Congreso dividido",gop_hold:"Republicanos retienen"},
    pick:"Elegí un país en la matriz para ver sus canales de impacto."
  },
  sources:{
    title:"Fuentes y metodología",
    method:"Metodología de la corrida",
    methodText:"Corrida del 3 de noviembre de 2026 (día de la elección, antes del cierre de urnas). Dos líneas de investigación independientes —electoral y económica/regional— relevaron fuentes primarias y de prensa el mismo día; cada cifra, rating y afirmación de escenario conserva su fuente. Regla editorial: el dato entra con fuente verificada o se consigna su ausencia; las proyecciones son siempre de terceros citados, nunca propias. El rating por carrera es la mediana de Cook Political Report, Inside Elections y Sabato's Crystal Ball. Próximas corridas incorporarán resultados oficiales a medida que se publiquen.",
    electoral:"Fuentes electorales", economic:"Fuentes económicas y regionales", accessed:"consultado"
  },
  footerLine:"tablero de monitoreo electoral · corrida del 3-nov-2026",
  footerNote:"Elaborado con flujos de agentes de investigación con fuentes citadas. Este tablero acerca elementos de análisis; no formula pronósticos propios.",
  keys_en:null
},
en:{
  brandSub:"Election dashboard · US 2026",
  livePill:"Election Day · Tue Nov 3, 2026",
  heroTitle:"United States 2026 Midterm Elections",
  heroSub:"35 Senate seats, all 435 House seats and 36 governorships. A state-by-state map, congressional control scenarios, economic variables and the impact on Latin America. Every figure is sourced; where no verified data exists, we say so.",
  tabMap:"National map", tabCongress:"Congress & scenarios", tabEconomy:"Economy", tabLatam:"Latin America", tabSources:"Sources & methodology",
  boards:{senate:"Senate",governors:"Governors",house:"House"},
  mapHint:"Hover over a state; click for the full rundown.",
  ratings:{"safe-d":"Safe D","likely-d":"Likely D","lean-d":"Lean D","tossup":"Toss-up","lean-r":"Lean R","likely-r":"Likely R","safe-r":"Safe R"},
  noRace:"No Senate race in 2026", noRaceGov:"No governor race in 2026",
  lastPoll:"Latest poll", incumbent:"Incumbent", defends:"defends", openSeat:"open seat",
  summary:{
    senateK:"Senate · current composition", senateV:"53 R — 47 D*", senateD:"35 seats up: Republicans defend 22, Democrats 13. Democrats need a net +4 for 51. *Includes 2 independents who caucus with Democrats.",
    houseK:"House · current composition", houseV:"220 R — 215 D", houseD:"Majority: 218. Democrats need a net +3. Final generic-ballot average: D +8.6 (median of 5 aggregators, Nov 1).",
    govK:"Governorships up", govV:"36",
    ratingNote:"Consensus rating: median of Cook Political Report, Inside Elections and Sabato's Crystal Ball (Nov 3, 2026); 'tilt' is folded into 'lean', noted per race."
  },
  houseMapNote:"The House is elected by district, not by state. Circles show how many consensus toss-up districts each state holds; details are below the map.",
  houseKeyTitle:"House toss-up districts", houseKeySub:"Rater consensus (13 toss-ups) plus the races ABC News adds to its list (14).",
  congress:{
    title:"Congress and control scenarios",
    senBarTitle:"Senate — if consensus ratings hold",
    senBarNote:"One dot per seat: those not up in 2026 plus the 35 contested seats assigned by consensus rating. Toss-ups stay unassigned: they decide control.",
    notUpD:"D not up", notUpR:"R not up",
    senMajority:"51 for control", houseMajority:"218 for a majority",
    coherence:(nd,dr,toss,rr,nr)=>`Arithmetic: ${nd} (D not up) + ${dr} (D-rated) + ${toss} (toss-up) + ${rr} (R-rated) + ${nr} (R not up) = ${nd+dr+toss+rr+nr} seats.`,
    houseBarTitle:"House — current composition and majority threshold",
    houseBarNote:"No seat-by-seat projection of all 435: the consensus flags 13 toss-ups and a D +8.6 generic-ballot lead.",
    closest:"The closest Senate races", closestSub:"Sorted by latest available poll margin; the rating is the consensus one.",
    scenTitle:"Control scenarios", scenSub:"Probabilities from JPMorgan's trading desk (Nov 3, 2026); full implications, with sources, in the Economy section.",
    keysTitle:"What this election decides", keysSub:"Per the coverage and aggregators cited under Sources.",
    gb:"Generic ballot (final average)", tossups:"toss-ups", approval:"Presidential approval", earlyVote:"Early vote (record)"
  },
  economy:{
    title:"Economy: starting point and scenarios",
    indTitle:"Where things stand on Election Day", indSub:"Latest verified reading for each indicator, with date and source. Where no recent verifiable figure exists, it is reported as missing rather than approximated.",
    scenTitle:"What changes with each outcome", scenSub:"A synthesis of third-party analysis (JPMorgan AM, National Bank Financial, Capital.com, Charles Schwab, Morgan Stanley, CEPA, Orlando Ferreres, among others). Every claim keeps its attribution.",
    fields:{fiscal:"Fiscal policy",trade:"Trade & tariffs",fed_rates:"Fed & rates",markets:"Markets",regulation:"Regulation & oversight"},
    nd:"no verified figure"
  },
  latam:{
    title:"Impact on Latin America",
    matrixTitle:"Country × impact-channel matrix", matrixSub:"A dot means cited analysis exists for that channel; its color shows the country's exposure level. Click a row for details.",
    country:"Country / bloc", exposure:"Exposure",
    exp:{"alta":"High","media":"Medium","media-baja":"Medium-low"},
    scen:{dem_sweep:"Democrats both chambers",divided:"Divided Congress",gop_hold:"Republicans hold"},
    pick:"Pick a country in the matrix to see its impact channels."
  },
  sources:{
    title:"Sources and methodology",
    method:"Run methodology",
    methodText:"Run of November 3, 2026 (Election Day, before polls closed). Two independent research tracks — electoral and economic/regional — surveyed primary and press sources the same day; every figure, rating and scenario claim keeps its source. Editorial rule: a figure enters with a verified source or its absence is stated; projections are always attributed to cited third parties, never our own. Per-race ratings are the median of Cook Political Report, Inside Elections and Sabato's Crystal Ball. Future runs will fold in official results as they are published.",
    electoral:"Electoral sources", economic:"Economic & regional sources", accessed:"accessed"
  },
  footerLine:"election monitoring dashboard · Nov 3, 2026 run",
  footerNote:"Built with research-agent workflows on cited sources. This dashboard offers elements of analysis; it makes no forecasts of its own.",
  keys_en:[
    "House control: Democrats need just 3 net seats (215→218) to block Trump's legislative agenda, open investigations and enable a potential impeachment; aggregators and markets make them clear favorites (generic ballot D+8.6; Polymarket ~94% for the House).",
    "The Senate is the deeper fight: Democrats need a net +4 to reach 51 on an adverse map (defending 13 seats against 22 Republican ones); the keys are Maine, Ohio, Texas, Iowa, Kansas, Alaska and North Carolina, and control decides judicial confirmations, including the Supreme Court (Polymarket ~76% Democratic).",
    "Cost of living dominates: it is voters' top concern and Trump's weakest flank — his approval (38% in the Silver Bulletin average, near its low) turns the election into a midterm referendum with parallels to the 2018 wave.",
    "Mid-decade redistricting driven by Republican southern states (new seats like FL-22 and TX-35 among the toss-ups) could blunt the size of Democratic House gains.",
    "Record turnout: over 48.5 million early votes (a midterm record), with key governorships in Georgia, Ohio, Nevada, Wisconsin and Alaska shaping the state map toward 2028; in Georgia, races without an absolute majority go to a Dec 1 runoff."
  ]
}
};

let lang = "es", board = "senate";
try{ lang = localStorage.getItem("tb_lang") || "es"; }catch(e){}
const $ = s => document.querySelector(s);
const t = () => I18N[lang];

/* ---------- theme ---------- */
function initTheme(){
  let th = null;
  try{ th = localStorage.getItem("tb_theme"); }catch(e){}
  if(!th) th = (window.matchMedia && matchMedia("(prefers-color-scheme: dark)").matches) ? "dark" : "light";
  document.documentElement.setAttribute("data-theme", th);
}
$("#themeToggle").addEventListener("click", ()=>{
  const cur = document.documentElement.getAttribute("data-theme")==="dark" ? "light":"dark";
  document.documentElement.setAttribute("data-theme", cur);
  try{ localStorage.setItem("tb_theme", cur); }catch(e){}
});
$("#langToggle").addEventListener("click", ()=>{
  lang = lang==="es" ? "en":"es";
  try{ localStorage.setItem("tb_lang", lang); }catch(e){}
  renderAll();
});

/* ---------- tabs ---------- */
document.querySelectorAll(".tab").forEach(b=>{
  b.addEventListener("click", ()=>{
    document.querySelectorAll(".tab").forEach(x=>{x.classList.remove("is-active");x.setAttribute("aria-selected","false");});
    document.querySelectorAll(".section").forEach(x=>x.classList.remove("is-active"));
    b.classList.add("is-active"); b.setAttribute("aria-selected","true");
    $("#sec-"+b.dataset.section).classList.add("is-active");
  });
});

/* ---------- helpers ---------- */
const senByState = {}; E.senate.races.forEach(r=>senByState[r.state]=r);
const govByState = {}; E.governors.races.forEach(r=>govByState[r.state]=r);
const cdByState = {}; E.house.key_districts.forEach(d=>{
  const st = d.district.slice(0,2); (cdByState[st]=cdByState[st]||[]).push(d);
});
function ratingBadge(r){ return `<span class="rb" style="background:${COLORS[r]};color:${DARK_FILLS.has(r)?"#fff":"#1b2735"}">${t().ratings[r]}</span>`; }
function candLine(r){ return `<span class="chip-d">${r.dem_candidate||"—"} (D)</span> vs <span class="chip-r">${r.rep_candidate||"—"} (R)</span>`; }
function pollLine(r){ return r.last_poll ? `${t().lastPoll}: ${r.last_poll.pollster} · ${r.last_poll.date} · <span class="mono">${r.last_poll.margin}</span>` : ""; }

/* ---------- static i18n ---------- */
function applyStatic(){
  document.documentElement.lang = lang;
  document.querySelectorAll("[data-i18n]").forEach(el=>{
    const k = el.dataset.i18n;
    if(t()[k]) el.textContent = t()[k];
  });
  $("#langToggle").textContent = lang==="es" ? "EN":"ES";
}

/* ---------- map section ---------- */
function renderSummary(){
  const s = t().summary, tossS = E.senate.races.filter(r=>r.rating==="tossup").length,
        tossG = E.governors.races.filter(r=>r.rating==="tossup").length;
  $("#mapSummary").innerHTML = `
    <div class="stat"><div class="k">${s.senateK}</div><div class="v">${s.senateV}</div><div class="d">${s.senateD}</div></div>
    <div class="stat"><div class="k">${s.houseK}</div><div class="v">${s.houseV}</div><div class="d">${s.houseD}</div></div>
    <div class="stat"><div class="k">${s.govK}</div><div class="v">${s.govV}</div><div class="d">${lang==="es"?`${tossG} toss-ups en gobernaciones y ${tossS} en el Senado.`:`${tossG} governor toss-ups and ${tossS} in the Senate.`} ${s.ratingNote}</div></div>`;
}

function buildMapOnce(){
  const svg = $("#usMap");
  svg.setAttribute("viewBox", MAP.viewBox);
  svg.innerHTML = MAP.states.map(st=>`<path class="state" id="st-${st.id}" d="${st.d}"></path>`).join("") +
    MAP.states.filter(st=>!TINY.has(st.id)).map(st=>`<text class="st-label" x="${st.cx}" y="${st.cy}" dy="4">${st.id}</text>`).join("") +
    `<g id="cdBubbles"></g>`;
  const tip = $("#mapTip"), stage = document.querySelector(".map-stage");
  svg.addEventListener("mousemove", ev=>{
    const p = ev.target.closest("path.state"); if(!p){tip.hidden=true;return;}
    const id = p.id.slice(3), html = tipHTML(id);
    if(!html){tip.hidden=true;return;}
    tip.innerHTML = html; tip.hidden = false;
    const r = stage.getBoundingClientRect();
    let x = ev.clientX - r.left + 14, y = ev.clientY - r.top + 14;
    if(x + 290 > r.width) x -= 310; if(y + 120 > r.height) y -= 130;
    tip.style.left = x+"px"; tip.style.top = y+"px";
  });
  svg.addEventListener("mouseleave", ()=>tip.hidden=true);
  svg.addEventListener("click", ev=>{
    const p = ev.target.closest("path.state"); if(p) showStateDetail(p.id.slice(3));
  });
}

function tipHTML(id){
  const st = MAP.states.find(s=>s.id===id); if(!st) return null;
  if(board==="senate"){
    const r = senByState[id];
    if(!r) return `<div class="t-state">${st.name}</div>${t().noRace}`;
    return `<div class="t-state">${r.state_name}</div><div class="t-rating" style="color:${COLORS[r.rating]==="#f0c525"?"#f0c525":"#fff"}">${t().ratings[r.rating]}</div>${candLine(r)}<br>${pollLine(r)}`;
  }
  if(board==="governors"){
    const r = govByState[id];
    if(!r) return `<div class="t-state">${st.name}</div>${t().noRaceGov}`;
    return `<div class="t-state">${r.state_name}</div><div class="t-rating">${t().ratings[r.rating]}</div>${candLine(r)}`;
  }
  const ds = cdByState[id];
  if(!ds) return `<div class="t-state">${st.name}</div>${lang==="es"?"Sin distritos toss-up listados":"No listed toss-up districts"}`;
  return `<div class="t-state">${st.name}</div>${ds.map(d=>`<b>${d.district}</b> · ${d.dem} (D) vs ${d.rep} (R)`).join("<br>")}`;
}

function paintBoard(){
  const counts = {}; RATINGS.forEach(r=>counts[r]=0);
  MAP.states.forEach(st=>{
    const p = $("#st-"+st.id); let r = null;
    if(board==="senate") r = senByState[st.id] && senByState[st.id].rating;
    else if(board==="governors") r = govByState[st.id] && govByState[st.id].rating;
    if(board!=="house" && r){ p.setAttribute("fill", COLORS[r]); p.classList.remove("no-race"); counts[r]++; }
    else { p.setAttribute("fill", "var(--neutral-state)"); if(board!=="house") p.classList.add("no-race"); else p.classList.remove("no-race"); }
  });
  // labels contrast
  document.querySelectorAll("#usMap text.st-label").forEach(el=>{
    const id = el.textContent;
    const r = board==="senate" ? (senByState[id]&&senByState[id].rating) : board==="governors" ? (govByState[id]&&govByState[id].rating) : null;
    el.classList.toggle("on-dark", !!(r && DARK_FILLS.has(r)));
  });
  // house bubbles
  const g = $("#cdBubbles");
  if(board==="house"){
    g.innerHTML = Object.keys(cdByState).map(id=>{
      const st = MAP.states.find(s=>s.id===id); if(!st) return "";
      const n = cdByState[id].length, rad = 9 + n*2.5;
      return `<circle class="cd-bubble" cx="${st.cx}" cy="${st.cy}" r="${rad}"></circle><text class="cd-count" x="${st.cx}" y="${st.cy}" dy="4">${n}</text>`;
    }).join("");
  } else g.innerHTML = "";
  // legend
  const lg = $("#mapLegend");
  if(board==="house"){
    lg.innerHTML = `<div class="lg"><span class="sw" style="background:var(--accent)"></span>${t().houseMapNote}</div>`;
  } else {
    lg.innerHTML = RATINGS.map(r=>`<div class="lg"><span class="sw" style="background:${COLORS[r]}"></span>${t().ratings[r]} <span class="ct">${counts[r]}</span></div>`).join("") +
      `<div class="lg"><span class="sw" style="background:var(--neutral-state)"></span>${board==="senate"?t().noRace:t().noRaceGov}</div>`;
  }
  renderHouseKeyRaces();
}

function renderBoardSwitch(){
  $("#boardSwitch").innerHTML = ["senate","governors","house"].map(b=>
    `<button type="button" data-board="${b}" class="${b===board?"is-active":""}">${t().boards[b]}</button>`).join("");
  document.querySelectorAll("#boardSwitch button").forEach(btn=>btn.addEventListener("click", ()=>{
    board = btn.dataset.board; renderBoardSwitch(); paintBoard(); $("#stateDetail").hidden = true;
  }));
}

function renderHouseKeyRaces(){
  const box = $("#houseKeyRaces");
  if(board!=="house"){ box.innerHTML=""; return; }
  box.innerHTML = `<h2 class="sec-title">${t().houseKeyTitle}</h2><p class="sec-sub">${t().houseKeySub}</p>
  <div class="race-list">` + E.house.key_districts.map(d=>`
    <div class="race-card" style="border-left-color:${COLORS[d.rating]}">
      <div class="rc-top"><span class="rc-state">${d.district}</span>${ratingBadge(d.rating)}</div>
      <div class="rc-cand"><span class="chip-d">${d.dem} (D)</span> vs <span class="chip-r">${d.rep} (R)</span></div>
      <div class="rc-poll">${d.notes||""}</div>
    </div>`).join("") + `</div>`;
}

function showStateDetail(id){
  const st = MAP.states.find(s=>s.id===id), box = $("#stateDetail");
  const sen = senByState[id], gov = govByState[id], ds = cdByState[id];
  if(!sen && !gov && !ds){ box.hidden = true; return; }
  let html = `<h3>${st.name}</h3><div class="sd-grid">`;
  if(sen) html += `<div class="sd-race">${ratingBadge(sen.rating)}<div><b>${lang==="es"?"Senado":"Senate"}${sen.state_name.includes("especial")?(lang==="es"?" · especial":" · special"):""}</b></div>
    <div class="cand">${candLine(sen)}</div>
    <div class="meta">${t().incumbent}: ${sen.incumbent||"—"} · ${sen.defending_party} ${t().defends}</div>
    ${sen.last_poll?`<div class="meta">${pollLine(sen)}</div>`:""}
    ${sen.notes?`<div class="meta">${sen.notes}</div>`:""}</div>`;
  if(gov) html += `<div class="sd-race">${ratingBadge(gov.rating)}<div><b>${lang==="es"?"Gobernación":"Governor"}</b></div>
    <div class="cand">${candLine(gov)}</div>
    <div class="meta">${lang==="es"?"Partido del titular":"Incumbent party"}: ${gov.incumbent_party}</div>
    ${gov.notes?`<div class="meta">${gov.notes}</div>`:""}</div>`;
  if(ds) ds.forEach(d=>{ html += `<div class="sd-race">${ratingBadge(d.rating)}<div><b>${lang==="es"?"Cámara":"House"} · ${d.district}</b></div>
    <div class="cand"><span class="chip-d">${d.dem} (D)</span> vs <span class="chip-r">${d.rep} (R)</span></div>
    ${d.notes?`<div class="meta">${d.notes}</div>`:""}</div>`; });
  box.innerHTML = html + "</div>"; box.hidden = false;
  box.scrollIntoView({behavior:"smooth", block:"nearest"});
}

/* ---------- congress ---------- */
function senateProjection(){
  const cc = E.senate.current_composition;
  const notUpD = cc.total_dem_caucus - cc.defended_by_democrats;   // 34
  const notUpR = cc.republicans - cc.defended_by_republicans;      // 31
  const byR = {}; RATINGS.forEach(r=>byR[r]=E.senate.races.filter(x=>x.rating===r).length);
  const dTotal = notUpD + byR["safe-d"] + byR["likely-d"] + byR["lean-d"];
  const rTotal = notUpR + byR["safe-r"] + byR["likely-r"] + byR["lean-r"];
  return {notUpD, notUpR, byR, dTotal, rTotal, toss: byR["tossup"]};
}
/* Hemiciclo parlamentario: un punto por banca, llenado por ángulo de izquierda a derecha.
   segments = [{n, color, label}] en orden izquierda→derecha; la suma de n DEBE ser igual a total (se verifica). */
function hemicycleSVG(segments, total, majorityLabel, leftLabel, rightLabel, centerLabel){
  const N = segments.reduce((a,s)=>a+s.n,0);
  if(N !== total) return `<p class="sec-sub">⚠ inconsistencia: ${N} ≠ ${total}</p>`;
  const W=820, H=424, cx=W/2, cy=H-46, r0=150, r1=320;
  const rows = total<=120 ? 4 : 11;
  const radii=[]; for(let i=0;i<rows;i++) radii.push(r0 + (r1-r0)*i/(rows-1));
  const sumR = radii.reduce((a,b)=>a+b,0);
  const per = radii.map(r=>Math.round(N*r/sumR));
  per[rows-1] += N - per.reduce((a,b)=>a+b,0);
  const rowGap = (r1-r0)/(rows-1);
  let minChord = Infinity;
  per.forEach((n,ri)=>{ if(n>1) minChord = Math.min(minChord, Math.PI*radii[ri]/(n-1)); });
  const dotR = Math.max(2.5, Math.min(rowGap*0.42, minChord*0.42));
  const pts=[];
  per.forEach((n,ri)=>{ const r=radii[ri];
    for(let k=0;k<n;k++){ const a = n===1 ? Math.PI/2 : Math.PI*(1 - k/(n-1)); pts.push({x:cx+r*Math.cos(a), y:cy-r*Math.sin(a), a}); }
  });
  pts.sort((p,q)=> q.a - p.a || p.y - q.y);
  const flat=[]; segments.forEach(s=>{ for(let i=0;i<s.n;i++) flat.push(s); });
  const dots = pts.map((p,i)=>{
    const s = flat[i];
    const paint = s.hollow ? `fill="var(--surface)" stroke="${s.color}" stroke-width="2"` : `fill="${s.color}"`;
    return `<circle cx="${p.x.toFixed(1)}" cy="${p.y.toFixed(1)}" r="${(s.hollow?dotR-1:dotR).toFixed(1)}" ${paint}><title>${s.label} (${s.n})</title></circle>`;
  }).join("");
  return `<svg class="hemi" viewBox="0 0 ${W} ${H}" role="img" aria-label="${leftLabel} · ${rightLabel}">
    ${dots}
    <line x1="${cx}" y1="${cy-r1-16}" x2="${cx}" y2="${cy-r0+34}" stroke="var(--ink)" stroke-width="2" stroke-dasharray="5 4"/>
    <text x="${cx}" y="${cy-r1-26}" text-anchor="middle" class="hemi-maj">${majorityLabel}</text>
    <text x="${cx-82}" y="${cy-12}" text-anchor="middle" class="hemi-total hemi-d">${leftLabel}</text>
    <text x="${cx+82}" y="${cy-12}" text-anchor="middle" class="hemi-total hemi-r">${rightLabel}</text>
    ${centerLabel?`<text x="${cx}" y="${cy-r0+58}" text-anchor="middle" class="hemi-center">${centerLabel}</text>`:""}
  </svg>`;
}

function renderCongress(){
  const c = t().congress, p = senateProjection(), gb = E.house.generic_ballot, ctx = E.context;
  const closest = E.senate.races.filter(r=>r.last_poll && ["tossup","lean-d","lean-r"].includes(r.rating))
    .sort((a,b)=>{
      const m = s=>{const x=s.last_poll.margin.match(/\+?(\d+(?:\.\d+)?)/);return x?parseFloat(x[1]):(s.last_poll.margin.toLowerCase().includes("empate")||s.last_poll.margin.toLowerCase().includes("even")?0:99);};
      return m(a)-m(b);
    });
  const keys = (lang==="en" && I18N.en.keys_en) ? I18N.en.keys_en : ctx.keys;
  const probs = {dem_sweep:"66%",divided:"27%",gop_hold:"7%"};
  $("#sec-congreso").innerHTML = `
  <h2 class="sec-title">${c.title}</h2>
  <div class="card">
    <h3>${c.senBarTitle}</h3>
    ${hemicycleSVG([
      {n:p.notUpD, color:"var(--safe-d)", label:c.notUpD, hollow:true},
      {n:p.byR["safe-d"], color:COLORS["safe-d"], label:t().ratings["safe-d"]},
      {n:p.byR["likely-d"], color:COLORS["likely-d"], label:t().ratings["likely-d"]},
      {n:p.byR["lean-d"], color:COLORS["lean-d"], label:t().ratings["lean-d"]},
      {n:p.toss, color:COLORS["tossup"], label:t().ratings["tossup"]},
      {n:p.byR["lean-r"], color:COLORS["lean-r"], label:t().ratings["lean-r"]},
      {n:p.byR["likely-r"], color:COLORS["likely-r"], label:t().ratings["likely-r"]},
      {n:p.byR["safe-r"], color:COLORS["safe-r"], label:t().ratings["safe-r"]},
      {n:p.notUpR, color:"var(--safe-r)", label:c.notUpR, hollow:true}
    ], 100, c.senMajority, `D ${p.dTotal}`, `R ${p.rTotal}`, `${p.toss} ${c.tossups}`)}
    <div class="cb-legend">
      <span><span class="sw-dot sw-hollow" style="border-color:var(--safe-d)"></span> ${c.notUpD}: ${p.notUpD}</span>
      ${RATINGS.map(r=>`<span><span class="sw-dot" style="background:${COLORS[r]}"></span> ${t().ratings[r]}: ${r==="tossup"?p.toss:p.byR[r]}</span>`).join("")}
      <span><span class="sw-dot sw-hollow" style="border-color:var(--safe-r)"></span> ${c.notUpR}: ${p.notUpR}</span>
    </div>
    <p class="sec-sub" style="margin-top:8px">${c.senBarNote} ${c.coherence(p.notUpD, p.byR["safe-d"]+p.byR["likely-d"]+p.byR["lean-d"], p.toss, p.byR["safe-r"]+p.byR["likely-r"]+p.byR["lean-r"], p.notUpR)}</p>
  </div>
  <div class="card">
    <h3>${c.houseBarTitle}</h3>
    ${hemicycleSVG([
      {n:E.house.current_composition.democrats, color:"var(--safe-d)", label:lang==="es"?"Demócratas":"Democrats"},
      {n:E.house.current_composition.republicans, color:"var(--safe-r)", label:lang==="es"?"Republicanos":"Republicans"}
    ], E.house.current_composition.total, c.houseMajority, `D ${E.house.current_composition.democrats}`, `R ${E.house.current_composition.republicans}`, "")}
    <p class="sec-sub" style="margin-top:8px">${c.houseBarNote}</p>
    <div class="card-row">
      <div class="stat"><div class="k">${c.gb}</div><div class="v">${gb.average.replace("D +","D+")}</div><div class="d">${gb.aggregators.map(a=>`${a.name}: ${a.value}`).join(" · ")}</div><div class="src">${gb.as_of}</div></div>
      <div class="stat"><div class="k">${c.approval}</div><div class="v">${ctx.presidential_approval.aggregator_figure.approve}%</div><div class="d">${lang==="es"?"aprueba":"approve"} · ${ctx.presidential_approval.aggregator_figure.disapprove}% ${lang==="es"?"desaprueba":"disapprove"} (${ctx.presidential_approval.aggregator_figure.source})</div><div class="src">${ctx.presidential_approval.aggregator_figure.as_of}</div></div>
      <div class="stat"><div class="k">${c.earlyVote}</div><div class="v">${(ctx.early_vote.total_ballots/1e6).toFixed(1).replace(".",lang==="es"?",":".")} M</div><div class="d">${lang==="es"?"votos anticipados al 30-oct (2022: 45,9 M)":"early votes by Oct 30 (2022: 45.9M)"}</div><div class="src">${ctx.early_vote.source.split("(")[0]}</div></div>
    </div>
  </div>
  <h2 class="sec-title">${c.closest}</h2><p class="sec-sub">${c.closestSub}</p>
  <div class="race-list">${closest.map(r=>`
    <div class="race-card" style="border-left-color:${COLORS[r.rating]}">
      <div class="rc-top"><span class="rc-state">${r.state_name}</span>${ratingBadge(r.rating)}</div>
      <div class="rc-cand">${candLine(r)}</div>
      <div class="rc-poll">${pollLine(r)}</div>
    </div>`).join("")}</div>
  <h2 class="sec-title">${c.scenTitle}</h2><p class="sec-sub">${c.scenSub}</p>
  <div class="scen-grid">${M.scenarios.map(s=>`
    <div class="scen-card">
      <div class="scen-prob">${probs[s.id]||""} <small>JPMorgan</small></div>
      <h3>${lang==="es"?s.label_es:s.label_en}</h3>
      <p class="scen-note">${s.probability_note}</p>
    </div>`).join("")}</div>
  <h2 class="sec-title">${c.keysTitle}</h2><p class="sec-sub">${c.keysSub}</p>
  <div class="card"><ol class="keys-list">${keys.map(k=>`<li>${k}</li>`).join("")}</ol></div>`;
}

/* ---------- economy ---------- */
function renderEconomy(){
  const ec = t().economy;
  $("#sec-economia").innerHTML = `
  <h2 class="sec-title">${ec.title}</h2>
  <h2 class="sec-title" style="font-size:20px">${ec.indTitle}</h2><p class="sec-sub">${ec.indSub}</p>
  <div class="card-row">${M.indicators.map(i=>`
    <div class="stat">
      <div class="k">${lang==="es"?i.label_es:i.label_en}</div>
      <div class="v">${i.value===null?`<span style="font-size:20px;color:var(--ink-3)">${ec.nd}</span>`:i.value}${i.value!==null&&i.unit?` <small style="font-size:14px;font-family:'DM Sans';font-weight:600;color:var(--ink-3)">${i.unit}</small>`:""}</div>
      <div class="trend">${i.trend}</div>
      <div class="src">${i.source} · ${i.as_of}</div>
    </div>`).join("")}</div>
  <h2 class="sec-title" style="font-size:20px">${ec.scenTitle}</h2><p class="sec-sub">${ec.scenSub}</p>
  <div class="scen-grid">${M.scenarios.map(s=>`
    <div class="scen-card">
      <h3>${lang==="es"?s.label_es:s.label_en}</h3>
      <p class="scen-note">${s.probability_note}</p>
      ${["fiscal","trade","fed_rates","markets","regulation"].map(f=>`
        <details><summary>${ec.fields[f]}</summary>
          <p>${lang==="es"?s[f].es:s[f].en}</p>
          <div class="srcs">${s[f].sources.join(" · ")}</div>
        </details>`).join("")}
    </div>`).join("")}</div>`;
}

/* ---------- latam ---------- */
function renderLatam(){
  const la = t().latam, L = M.latam;
  const dimLabel = d => lang==="es"?d.label_es:d.label_en;
  const expClass = e => "exp-"+e.split(" ")[0].replace("media-baja","media-baja");
  const expKey = e => e.startsWith("media-baja")?"media-baja":e.startsWith("alta")?"alta":"media";
  $("#sec-latam").innerHTML = `
  <h2 class="sec-title">${la.title}</h2>
  <div class="card"><p style="margin:0">${lang==="es"?L.overview.es:L.overview.en}</p></div>
  <h2 class="sec-title" style="font-size:20px">${la.matrixTitle}</h2><p class="sec-sub">${la.matrixSub}</p>
  <div class="card matrix"><table>
    <thead><tr><th>${la.country}</th><th>${la.exposure}</th>${L.dimensions.map(d=>`<th>${dimLabel(d)}</th>`).join("")}</tr></thead>
    <tbody>${L.countries.map(cn=>{
      const dims = new Set(cn.channels.map(ch=>ch.dimension));
      const ek = expKey(cn.exposure_level);
      return `<tr class="row-click" data-code="${cn.code}">
        <td><b>${cn.name}</b></td>
        <td><span class="exp-badge exp-${ek}" ${ek==="media"?'style="color:#1b2735"':""}>${la.exp[ek]}</span></td>
        ${L.dimensions.map(d=>`<td class="c">${dims.has(d.id)?`<span class="dot exp-${ek}"></span>`:""}</td>`).join("")}
      </tr>`;
    }).join("")}</tbody>
  </table></div>
  <div id="countryDetail" class="card country-detail"><p class="sec-sub" style="margin:0">${la.pick}</p></div>`;
  document.querySelectorAll("#sec-latam tr.row-click").forEach(tr=>tr.addEventListener("click", ()=>showCountry(tr.dataset.code)));
}
function showCountry(code){
  const la = t().latam, L = M.latam, cn = L.countries.find(c=>c.code===code);
  const dimLabel = id => { const d = L.dimensions.find(x=>x.id===id); return d ? (lang==="es"?d.label_es:d.label_en) : id; };
  $("#countryDetail").innerHTML = `<h3>${cn.name}</h3>
  ${cn.channels.map(ch=>`
    <div class="chan">
      <div class="ch-dim">${dimLabel(ch.dimension)}</div>
      <p>${lang==="es"?ch.es:ch.en}</p>
      <div class="sc-imp">${["dem_sweep","divided","gop_hold"].map(sc=>`
        <div><b>${la.scen[sc]}</b>${ch.scenario_impacts[sc]}</div>`).join("")}</div>
      <div class="srcs">${ch.sources.join(" · ")}</div>
    </div>`).join("")}`;
  $("#countryDetail").scrollIntoView({behavior:"smooth", block:"nearest"});
}

/* ---------- sources ---------- */
function renderSources(){
  const s = t().sources;
  const li = x => `<li>${x.name}. <a href="${x.url}" target="_blank" rel="noopener">${x.url}</a> (${s.accessed}: ${x.accessed}).</li>`;
  $("#sec-fuentes").innerHTML = `
  <h2 class="sec-title">${s.title}</h2>
  <div class="card"><h3>${s.method}</h3><p style="font-size:13.5px;color:var(--ink-2)">${s.methodText}</p></div>
  <div class="card"><h3>${s.electoral}</h3><ol class="src-list">${E.metadata.sources.map(li).join("")}</ol></div>
  <div class="card"><h3>${s.economic}</h3><ol class="src-list">${M.metadata.sources.map(li).join("")}</ol></div>`;
}

/* ---------- boot ---------- */
function renderAll(){
  applyStatic(); renderSummary(); renderBoardSwitch(); paintBoard();
  renderCongress(); renderEconomy(); renderLatam(); renderSources();
  $("#stateDetail").hidden = true;
}
initTheme(); buildMapOnce(); renderAll();
})();
