/* Tablero Democrac.IA — Elecciones de medio término EE.UU. 2026 */
(function(){
"use strict";
const E = window.DATA_ELECTORAL, M = window.DATA_ECONOMIA, MAP = window.US_MAP, J = window.DATA_JORNADA;
/* Los indicadores de mercado de la tarde reemplazan la lectura de la mañana del mismo id. */
if(J && J.markets) J.markets.forEach(nu=>{
  const i = M.indicators.findIndex(x=>x.id===nu.id);
  if(i>=0) M.indicators[i] = nu; else M.indicators.push(nu);
});
/* El dato del S&P del día reemplaza al acumulado anual, sin lectura verificada del índice. */
if(M.indicators.some(x=>x.id==="sp500_intraday"))
  M.indicators = M.indicators.filter(x=>x.id!=="sp500_ytd");
/* Primero la rueda de hoy, después el telón de fondo macroeconómico. */
const ORDEN_IND = ["sp500_intraday","dow_close","nasdaq_close","ust10y","dxy_dollar","wti_oil",
                   "fed_funds","cpi_yoy","unemployment","gdp_q3_2026","tariff_policy","fiscal_deficit"];
M.indicators.sort((a,b)=>{
  const ia = ORDEN_IND.indexOf(a.id), ib = ORDEN_IND.indexOf(b.id);
  return (ia<0?99:ia) - (ib<0?99:ib);
});
const RATINGS = ["safe-d","likely-d","lean-d","tossup","lean-r","likely-r","safe-r"];
const COLORS = {"safe-d":"#124a85","likely-d":"#4480c4","lean-d":"#a7c8ec","tossup":"#f0c525","lean-r":"#ef9d9d","likely-r":"#d2574a","safe-r":"#8e1f1c"};
const DARK_FILLS = new Set(["safe-d","likely-d","likely-r","safe-r"]);
const TINY = new Set(["RI","DE","CT","NJ","MD","MA","NH","VT","DC","HI"]);

const I18N = {
es:{
  brandSub:"Tablero electoral · EE.UU. 2026",
  livePill:"Día de la elección · mar 3 nov 2026",
  heroTitle:"Elecciones de medio término · Estados Unidos 2026",
  heroSub:"35 bancas del Senado, las 435 de la Cámara de Representantes y 36 gobernaciones. Mapa estado por estado, escenarios de control del Congreso, variables económicas e impacto para América Latina.",
  tabResults:"Resultados", tabMap:"Mapa nacional", tabCongress:"Congreso y escenarios", tabEconomy:"Economía", tabLatam:"América Latina",
  boards:{senate:"Senado",governors:"Gobernaciones",house:"Cámara"},
  results:{
    title:"Resultados", updated:"Actualizado", autoEvery:"se actualiza solo cada 2 min", refreshNow:"Actualizar ahora",
    senateK:"Senado · bancas llamadas", houseK:"Cámara · distritos clave llamados", govK:"Gobernaciones · llamadas",
    nextClose:"Próximo cierre de urnas", statusTitle:"Estado de la jornada",
    watchTitle:"Carreras para seguir", watchSub:"Los toss-ups de consenso, con el resultado en vivo a medida que se cuenta.",
    pending:"Sin datos", reporting:"Contando", reportingLow:"escrutado", called:"Gana", wins:"gana",
    pendingNote:"Sin resultados reportados.", noTossups:"Sin toss-ups en este tablero.",
    calledOf:n=>`de ${n} en juego`,
    houseKeyNote:"Sólo los distritos toss-up de consenso; no es el resultado de la Cámara completa."
  },
  jornadaTitle:"El pulso de la jornada",
  jornada:{
    earlyVote:"Voto anticipado", earlyVoteD:"Récord absoluto para una elección de medio término; en 2022 fueron 45,9 millones.",
    mktHouse:"Cámara demócrata · mercados", mktHouseD:"Precio de cierre de la rueda; cedió desde el 94 % del mediodía.",
    mktSenate:"Senado demócrata · mercados", mktSenateD:"Cedió desde el 77 % del mediodía; los modelos de encuestas llegan al 80 %.",
    closing:"Primeros cierres", closingD:"Indiana y Kentucky abren el conteo; Alaska cierra a la 1:00 ET del 4 de noviembre.",
    incTitle:"Incidencias de la jornada"
  },
  mapHint:"",
  ratings:{"safe-d":"Seguro D","likely-d":"Probable D","lean-d":"Inclinado D","tossup":"Toss-up","lean-r":"Inclinado R","likely-r":"Probable R","safe-r":"Seguro R"},
  noRace:"Sin elección de Senado en 2026", noRaceGov:"Sin elección de gobernador en 2026",
  lastPoll:"Última encuesta", incumbent:"Titular", defends:"defiende", openSeat:"banca abierta",
  summary:{
    senateK:"Senado · composición actual", senateV:"53 R — 47 D*", senateD:"Los republicanos defienden 22 de las 35 bancas en juego; los demócratas, 13 — y necesitan 4 más para llegar a 51. *Incluye 2 independientes que votan con los demócratas.",
    houseK:"Cámara · composición actual", houseV:"220 R — 215 D", houseD:"Mayoría: 218. A los demócratas les bastan 3 bancas netas. Boleta genérica final: D +8,6.",
    govK:"Gobernaciones en juego", govV:"36",
    ratingNote:""
  },
  houseMapNote:"La Cámara se elige por distrito, no por estado. Los círculos marcan cuántos de los distritos toss-up del consenso hay en cada estado; el detalle está debajo del mapa.",
  houseKeyTitle:"Distritos toss-up de la Cámara", houseKeySub:"Consenso de calificadores (13 toss-ups) más los que ABC News agrega a su lista (14).",
  congress:{
    title:"Congreso y escenarios de control",
    senBarTitle:"Senado — si los ratings de consenso se cumplen",
    senBarNote:"Los anillos son bancas que no se eligen en 2026; las 35 en juego llevan el color de su rating de consenso. Los cuatro toss-ups definen el control.",
    notUpD:"D sin elección", notUpR:"R sin elección",
    senMajority:"51 para el control", houseMajority:"218 para la mayoría",
    coherence:()=>"",
    houseBarTitle:"Cámara — composición actual y umbral de mayoría",
    houseBarNote:"La mayoría exige 218 bancas. El consenso identifica 13 distritos toss-up, con boleta genérica D +8,6.",
    closest:"Las carreras más cerradas del Senado", closestSub:"",
    marginNote:"Margen de la última encuesta disponible en cada carrera.",
    scenTitle:"Escenarios de control", scenSub:"Probabilidades de la mesa de JPMorgan (3-nov-2026). El detalle económico de cada escenario está en la sección Economía.",
    keysTitle:"Las claves de la elección", keysSub:"",
    gb:"Boleta genérica (promedio final)", tossups:"toss-ups", approval:"Aprobación presidencial", earlyVote:"Voto anticipado (récord)"
  },
  economy:{
    title:"Economía: punto de partida y escenarios",
    indTitle:"Variables al día de la elección", indSub:"",
    spTitle:"Reacción esperada del S&P 500 según el resultado",
    spNote:"Rango esperado para el índice en cada escenario, con su probabilidad.",
    scenTitle:"Qué cambia según el resultado", scenSub:"Análisis de JPMorgan Asset Management, National Bank Financial, Capital.com, Morgan Stanley, Charles Schwab, CEPA y Orlando Ferreres, con atribución en cada punto.",
    fields:{fiscal:"Política fiscal",trade:"Comercio y aranceles",fed_rates:"Fed y tasas",markets:"Mercados",regulation:"Regulación y supervisión"},
    nd:"sin dato verificado"
  },
  latam:{
    title:"Impacto para América Latina",
    matrixTitle:"Matriz país × canal de impacto", matrixSub:"El color marca el nivel de exposición de cada país.",
    anchorsTitle:"Anclas de la región",
    riskTitle:"Riesgo país argentino proyectado por escenario",
    riskNote:"Rango proyectado en cada escenario frente al valor actual.",
    country:"País / bloque", exposure:"Exposición",
    exp:{"alta":"Alta","media":"Media","media-baja":"Media-baja"},
    scen:{dem_sweep:"Demócratas ambas cámaras",divided:"Congreso dividido",gop_hold:"Republicanos retienen"},
    pick:"Elegí un país en la matriz para ver sus canales de impacto."
  },
  footerLine:"tablero de monitoreo electoral · 3 de noviembre de 2026",
  footerNote:"Elementos de análisis sobre fuentes citadas; las proyecciones pertenecen siempre a los terceros que se citan.",
  keys_en:null
},
en:{
  brandSub:"Election dashboard · US 2026",
  livePill:"Election Day · Tue Nov 3, 2026",
  heroTitle:"United States 2026 Midterm Elections",
  heroSub:"35 Senate seats, all 435 House seats and 36 governorships. A state-by-state map, congressional control scenarios, economic variables and the impact on Latin America.",
  tabResults:"Results", tabMap:"National map", tabCongress:"Congress & scenarios", tabEconomy:"Economy", tabLatam:"Latin America",
  boards:{senate:"Senate",governors:"Governors",house:"House"},
  results:{
    title:"Results", updated:"Updated", autoEvery:"auto-updates every 2 min", refreshNow:"Refresh now",
    senateK:"Senate · seats called", houseK:"House · key districts called", govK:"Governorships · called",
    nextClose:"Next poll closing", statusTitle:"Status of the night",
    watchTitle:"Races to watch", watchSub:"Consensus toss-ups, with live results as the count comes in.",
    pending:"No data", reporting:"Counting", reportingLow:"reporting", called:"Winner", wins:"wins",
    pendingNote:"No results reported.", noTossups:"No toss-ups on this board.",
    calledOf:n=>`of ${n} up for election`,
    houseKeyNote:"Consensus toss-up districts only; not the full House result."
  },
  jornadaTitle:"Election-day pulse",
  jornada:{
    earlyVote:"Early vote", earlyVoteD:"An all-time midterm record; 2022 saw 45.9 million.",
    mktHouse:"Democratic House · markets", mktHouseD:"Price at the market close; down from 94% at midday.",
    mktSenate:"Democratic Senate · markets", mktSenateD:"Down from 77% at midday; poll-based models reach 80%.",
    closing:"First poll closings", closingD:"Indiana and Kentucky open the count; Alaska closes at 1:00 am ET on November 4.",
    incTitle:"Election-day incidents"
  },
  mapHint:"",
  ratings:{"safe-d":"Safe D","likely-d":"Likely D","lean-d":"Lean D","tossup":"Toss-up","lean-r":"Lean R","likely-r":"Likely R","safe-r":"Safe R"},
  noRace:"No Senate race in 2026", noRaceGov:"No governor race in 2026",
  lastPoll:"Latest poll", incumbent:"Incumbent", defends:"defends", openSeat:"open seat",
  summary:{
    senateK:"Senate · current composition", senateV:"53 R — 47 D*", senateD:"Republicans defend 22 of the 35 seats up; Democrats, 13 — and need 4 more for 51. *Includes 2 independents who caucus with Democrats.",
    houseK:"House · current composition", houseV:"220 R — 215 D", houseD:"Majority: 218. Democrats need a net 3 seats. Final generic ballot: D +8.6.",
    govK:"Governorships up", govV:"36",
    ratingNote:""
  },
  houseMapNote:"The House is elected by district, not by state. Circles show how many consensus toss-up districts each state holds; details are below the map.",
  houseKeyTitle:"House toss-up districts", houseKeySub:"Rater consensus (13 toss-ups) plus the races ABC News adds to its list (14).",
  congress:{
    title:"Congress and control scenarios",
    senBarTitle:"Senate — if consensus ratings hold",
    senBarNote:"Rings are seats not up in 2026; the 35 contested seats carry their consensus rating. The four toss-ups decide control.",
    notUpD:"D not up", notUpR:"R not up",
    senMajority:"51 for control", houseMajority:"218 for a majority",
    coherence:()=>"",
    houseBarTitle:"House — current composition and majority threshold",
    houseBarNote:"A majority takes 218 seats. The consensus flags 13 toss-up districts, with a D +8.6 generic ballot.",
    closest:"The closest Senate races", closestSub:"",
    marginNote:"Margin from the latest available poll in each race.",
    scenTitle:"Control scenarios", scenSub:"Probabilities from JPMorgan's trading desk (Nov 3, 2026). The economic detail of each scenario is in the Economy section.",
    keysTitle:"What this election decides", keysSub:"",
    gb:"Generic ballot (final average)", tossups:"toss-ups", approval:"Presidential approval", earlyVote:"Early vote (record)"
  },
  economy:{
    title:"Economy: starting point and scenarios",
    indTitle:"Where things stand on Election Day", indSub:"",
    spTitle:"Expected S&P 500 reaction by outcome",
    spNote:"Expected range for the index under each scenario, with its probability.",
    scenTitle:"What changes with each outcome", scenSub:"Analysis from JPMorgan Asset Management, National Bank Financial, Capital.com, Morgan Stanley, Charles Schwab, CEPA and Orlando Ferreres, attributed point by point.",
    fields:{fiscal:"Fiscal policy",trade:"Trade & tariffs",fed_rates:"Fed & rates",markets:"Markets",regulation:"Regulation & oversight"},
    nd:"no verified figure"
  },
  latam:{
    title:"Impact on Latin America",
    matrixTitle:"Country × impact-channel matrix", matrixSub:"Color marks each country's exposure level.",
    anchorsTitle:"Regional anchors",
    riskTitle:"Argentina country risk projected by scenario",
    riskNote:"Projected range under each scenario against the current level.",
    country:"Country / bloc", exposure:"Exposure",
    exp:{"alta":"High","media":"Medium","media-baja":"Medium-low"},
    scen:{dem_sweep:"Democrats both chambers",divided:"Divided Congress",gop_hold:"Republicans hold"},
    pick:"Pick a country in the matrix to see its impact channels."
  },
  footerLine:"election monitoring dashboard · November 3, 2026",
  footerNote:"Elements of analysis on cited sources; every projection belongs to the third party quoted.",
  keys_en:[
    "House control: Democrats need just 3 net seats (215→218) to block Trump's legislative agenda, open investigations and enable a potential impeachment; aggregators and markets make them clear favorites (generic ballot D+8.6; Polymarket ~94% for the House).",
    "The Senate is the deeper fight: Democrats need a net +4 to reach 51 on an adverse map (defending 13 seats against 22 Republican ones); the keys are Maine, Ohio, Texas, Iowa, Kansas, Alaska and North Carolina, and control decides judicial confirmations, including the Supreme Court (Polymarket ~76% Democratic).",
    "Cost of living dominates: it is voters' top concern and Trump's weakest flank — his approval (38% in the Silver Bulletin average, near its low) turns the election into a midterm referendum with parallels to the 2018 wave.",
    "Mid-decade redistricting driven by Republican southern states (new seats like FL-22 and TX-35 among the toss-ups) could blunt the size of Democratic House gains.",
    "Record turnout: over 57 million early votes (a midterm record), with key governorships in Georgia, Ohio, Nevada, Wisconsin and Alaska shaping the state map toward 2028; in Georgia, races without an absolute majority go to a Dec 1 runoff."
  ]
}
};

let lang = "es", board = "senate", resultsBoard = "senate";
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
function candRow(dem, rep){
  return `<div class="cand-row">
    <span class="cand-one">${monogram(dem,"D")}<span class="chip-d">${dem||"—"}</span></span>
    <span class="vs">vs</span>
    <span class="cand-one">${monogram(rep,"R")}<span class="chip-r">${rep||"—"}</span></span>
  </div>`;
}
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
  renderJornada();
}

/* Pulso de la jornada: cifras ancla del día, con su hora. */
function renderJornada(){
  if(!J) return;
  const j = t().jornada, pm = J.prediction_markets.multi_platform_best_price, ev = earlyVote();
  const pmSrc = lang==="es" ? pm.source_label_es : pm.source_label_en;
  $("#jornadaStrip").innerHTML = `
    <div class="stat stat-live">
      <div class="k">${j.earlyVote}</div><div class="v">${ev.v}</div>
      <div class="d">${j.earlyVoteD}</div><div class="src">${ev.src} · ${ev.cut}</div>
    </div>
    <div class="stat stat-live">
      <div class="k">${j.mktHouse}</div><div class="v">${fmtNum(pm.house_dem)} %</div>
      <div class="d">${j.mktHouseD}</div><div class="src">${pmSrc}</div>
    </div>
    <div class="stat stat-live">
      <div class="k">${j.mktSenate}</div><div class="v">${fmtNum(pm.senate_dem)} %</div>
      <div class="d">${j.mktSenateD}</div><div class="src">${pmSrc}</div>
    </div>
    <div class="stat stat-live">
      <div class="k">${j.closing}</div><div class="v">18:00 ET</div>
      <div class="d">${j.closingD}</div><div class="src">Fox News live blog · 3-nov-2026</div>
    </div>`;
  const vNote = J.jornada.verification_note_es && (lang==="es"?J.jornada.verification_note_es:J.jornada.verification_note_en);
  $("#jornadaNote").innerHTML = `<div class="card card-incident"><div class="inc-k">${j.incTitle}</div><p>${lang==="es"?J.jornada.incidents_es:J.jornada.incidents_en}</p>${vNote?`<p class="jornada-verify">${vNote}</p>`:""}</div>`;
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
    if(board!=="house" && r){ p.setAttribute("fill", COLORS[r]); p.classList.remove("no-race"); p.classList.toggle("is-toss", r==="tossup"); counts[r]++; }
    else { p.setAttribute("fill", "var(--neutral-state)"); p.classList.remove("is-toss"); if(board!=="house") p.classList.add("no-race"); else p.classList.remove("no-race"); }
  });
  // labels contrast
  document.querySelectorAll("#usMap text.st-label").forEach(el=>{
    const id = el.textContent;
    const r = board==="senate" ? (senByState[id]&&senByState[id].rating) : board==="governors" ? (govByState[id]&&govByState[id].rating) : null;
    el.classList.toggle("on-dark", !!(r && DARK_FILLS.has(r)));
    el.classList.toggle("on-light", !!(r && !DARK_FILLS.has(r)));
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
      <div class="rc-cand">${candRow(d.dem, d.rep)}</div>
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

/* ---------- resultados (en vivo, auto-actualización cada 2 min) ---------- */
function raceList(boardKey){
  if(boardKey==="senate") return E.senate.races.map(r=>({code:r.state, name:r.state_name, rating:r.rating, dem:r.dem_candidate, rep:r.rep_candidate}));
  if(boardKey==="governors") return E.governors.races.map(r=>({code:r.state, name:r.state_name, rating:r.rating, dem:r.dem_candidate, rep:r.rep_candidate}));
  return E.house.key_districts.map(d=>({code:d.district, name:d.district, rating:d.rating, dem:d.dem, rep:d.rep}));
}
/* Una carrera sin entrada en DATA_RESULTADOS.results se trata como "sin reportar": no hace falta precargar las 87. */
function resultFor(boardKey, code){
  const RES = window.DATA_RESULTADOS;
  return (RES && RES.results && RES.results[boardKey] && RES.results[boardKey][code]) || {status:"not_reported"};
}
function tallyBoard(boardKey){
  const list = raceList(boardKey);
  let d=0, r=0;
  list.forEach(x=>{
    const res = resultFor(boardKey, x.code);
    if(res.status==="called"){ if(res.called_for==="D") d++; else if(res.called_for==="R") r++; }
  });
  return {d, r, total:list.length};
}
function statusBadge(res){
  const rt = t().results;
  if(res.status==="called") return `<span class="res-badge res-badge-called party-${res.called_for==="D"?"d":"r"}">${rt.called} ${res.called_for}</span>`;
  if(res.status==="reporting") return `<span class="res-badge res-badge-live">${rt.reporting}${res.pct!=null?" · "+fmtNum(res.pct)+"%":""}</span>`;
  return `<span class="res-badge res-badge-pending">${rt.pending}</span>`;
}
/* Se recuerda el estado de la corrida anterior para que, al cambiar (sin reportar→contando→llamada),
   la ficha tenga un destello en vez de simplemente reaparecer distinta. */
let prevTileStatus = {};
function tile(x, boardKey){
  const res = resultFor(boardKey, x.code);
  const base = COLORS[x.rating] || "var(--neutral-state)";
  const cls = res.status==="reporting" ? "is-live" : res.status==="called" ? "is-called" : "";
  const bg = res.status==="called" ? COLORS[res.called_for==="D"?"safe-d":"safe-r"] : `color-mix(in srgb, ${base} 22%, var(--surface-2))`;
  const tip = `${x.name}${res.status!=="not_reported"?" · "+(res.leader||(res.called_for?(res.called_for==="D"?x.dem:x.rep):"")) + (res.margin?" "+res.margin:""):""}`;
  const key = boardKey+":"+x.code;
  const changed = prevTileStatus[key] !== undefined && prevTileStatus[key] !== res.status;
  prevTileStatus[key] = res.status;
  return `<div class="tile ${cls}${changed?" tile-flash":""}" style="background:${bg}" title="${tip}"><span class="tile-dot"></span>${x.code}</div>`;
}
function resultRaceCard(x, boardKey){
  const res = resultFor(boardKey, x.code), rt = t().results;
  let body;
  if(res.status==="called") body = `<span class="rc-margin">${res.called_for==="D"?x.dem:x.rep} ${rt.wins}</span>${res.margin?" · "+res.margin:""}`;
  else if(res.status==="reporting") body = `${res.pct!=null?fmtNum(res.pct)+"% "+rt.reportingLow:""}${res.leader?" · "+res.leader+(res.margin?" +"+res.margin:""):""}`;
  else body = rt.pendingNote;
  return `<div class="race-card" style="border-left-color:${COLORS[x.rating]}">
    <div class="rc-top"><span class="rc-state">${x.name}</span>${statusBadge(res)}</div>
    <div class="rc-cand">${candRow(x.dem, x.rep)}</div>
    <div class="rc-result">${body}${res.pct!=null?`<div class="pct-bar"><div class="pct-bar-fill" style="width:${res.pct}%"></div></div>`:""}</div>
    ${res.source?`<div class="src">${res.source}${res.as_of?" · "+res.as_of:""}</div>`:""}
  </div>`;
}
/* jornada.js sólo trae los nombres de estado en español (son datos, no texto de interfaz); se traducen acá para el modo inglés. */
const ES_EN_STATE = {"Carolina del Norte":"North Carolina","Carolina del Sur":"South Carolina","Dakota del Norte":"North Dakota","Dakota del Sur":"South Dakota","Luisiana":"Louisiana","Misisipi":"Mississippi","Misuri":"Missouri","Nueva Jersey":"New Jersey","Nuevo Hampshire":"New Hampshire","Nuevo México":"New Mexico","Pensilvania":"Pennsylvania","Virginia Occidental":"West Virginia","Oregón":"Oregon","Alaska (islas Aleutianas)":"Alaska (Aleutian Islands)"};
const ES_EN_REGION = {"Este":"Eastern","Centro":"Central","Montaña":"Mountain","Pacífico":"Pacific"};
function enStateLabel(s){
  let out = s;
  Object.keys(ES_EN_STATE).forEach(k=>{ if(out.includes(k)) out = out.replace(k, ES_EN_STATE[k]); });
  return out.replace(/\(([^)]+)\)/, (m,g)=>`(${ES_EN_REGION[g]||g})`);
}
/* Próximo cierre de urnas: se calcula contra el reloj, no se hardcodea — así sigue siendo correcto toda la noche. */
function nextClosing(){
  if(!J || !J.jornada || !J.jornada.poll_closing_times) return null;
  const sched = J.jornada.poll_closing_times.schedule_et, entries=[];
  Object.keys(sched).forEach(k=>{
    const m = k.match(/^(\d{2}):(\d{2})(?:\s*\((\d+)-nov\))?$/); if(!m) return;
    const dayOffset = m[3] ? (parseInt(m[3],10)-3) : 0;
    // Hora ET en horario estándar (UTC-5) el 3-nov-2026; ya no rige el horario de verano.
    const time = new Date(Date.UTC(2026,10,3+dayOffset, parseInt(m[1],10)+5, parseInt(m[2],10)));
    entries.push({time, label:k, states:sched[k]});
  });
  entries.sort((a,b)=>a.time-b.time);
  const now = Date.now();
  return entries.find(e=>e.time.getTime() > now - 60000) || null;
}
function relTime(iso){
  if(!iso) return "";
  const diffSec = Math.max(0, Math.round((Date.now()-new Date(iso).getTime())/1000));
  if(diffSec<60) return lang==="es"?`hace ${diffSec}s`:`${diffSec}s ago`;
  return lang==="es"?`hace ${Math.round(diffSec/60)} min`:`${Math.round(diffSec/60)} min ago`;
}
function renderResultados(){
  const RES = window.DATA_RESULTADOS, rt = t().results;
  if(!RES){ $("#sec-resultados").innerHTML=""; return; }
  const tallies = {}; ["senate","governors","house"].forEach(b=>tallies[b]=tallyBoard(b));
  const nc = nextClosing(), statusNote = lang==="es"?RES.status_note_es:RES.status_note_en;
  $("#sec-resultados").innerHTML = `
  <div class="results-toolbar">
    <h2 class="sec-title" style="margin:0">${rt.title}</h2>
    <div class="results-updated"><span class="dot"></span>${rt.updated} <span id="resultsAgo">${relTime(RES.metadata.generated)}</span> · ${rt.autoEvery}
      <button type="button" class="btn-refresh" id="resultsRefreshBtn">${rt.refreshNow}</button>
    </div>
  </div>
  <div class="card-row">
    <div class="stat stat-live"><div class="k">${rt.senateK}</div><div class="v">${tallies.senate.d}–${tallies.senate.r}</div><div class="d">${rt.calledOf(tallies.senate.total)}</div></div>
    <div class="stat stat-live"><div class="k">${rt.houseK}</div><div class="v">${tallies.house.d}–${tallies.house.r}</div><div class="d">${rt.houseKeyNote}</div></div>
    <div class="stat stat-live"><div class="k">${rt.govK}</div><div class="v">${tallies.governors.d}–${tallies.governors.r}</div><div class="d">${rt.calledOf(tallies.governors.total)}</div></div>
    <div class="stat stat-live"><div class="k">${rt.nextClose}</div><div class="v">${nc?nc.label+" ET":"—"}</div><div class="d">${nc?(lang==="es"?nc.states:nc.states.map(enStateLabel)).slice(0,3).join(", ")+(nc.states.length>3?"…":""):""}</div></div>
  </div>
  <div class="card card-pending">
    <div class="inc-k">${rt.statusTitle}</div><p>${statusNote||""}</p>
  </div>
  <div class="board-switch" id="resultsBoardSwitch" style="margin-top:16px"></div>
  <div class="tile-grid" id="resultsTiles"></div>
  <h2 class="sec-title" style="font-size:20px">${rt.watchTitle}</h2><p class="sec-sub">${rt.watchSub}</p>
  <div class="race-list" id="resultsWatchList"></div>`;
  renderResultsBoardSwitch(); paintResultsBoard();
  $("#resultsRefreshBtn").addEventListener("click", ()=>loadResultsData(renderResultados));
}
function renderResultsBoardSwitch(){
  $("#resultsBoardSwitch").innerHTML = ["senate","governors","house"].map(b=>
    `<button type="button" data-board="${b}" class="${b===resultsBoard?"is-active":""}">${t().boards[b]}</button>`).join("");
  document.querySelectorAll("#resultsBoardSwitch button").forEach(btn=>btn.addEventListener("click", ()=>{
    resultsBoard = btn.dataset.board; renderResultsBoardSwitch(); paintResultsBoard();
  }));
}
function paintResultsBoard(){
  const list = raceList(resultsBoard);
  $("#resultsTiles").innerHTML = list.map(x=>tile(x, resultsBoard)).join("");
  const watch = list.filter(x=>x.rating==="tossup");
  $("#resultsWatchList").innerHTML = watch.map(x=>resultRaceCard(x, resultsBoard)).join("") || `<p class="sec-sub">${t().results.noTossups}</p>`;
}
/* Recarga data/resultados.js con un <script> nuevo (no se puede "re-importar" un script ya corrido) y vuelve a pintar. */
let resultsScriptEl = null;
function loadResultsData(cb){
  const prev = resultsScriptEl, s = document.createElement("script");
  s.src = "data/resultados.js?t=" + Date.now();
  s.onload = ()=>{ if(prev) prev.remove(); resultsScriptEl = s; cb && cb(); };
  s.onerror = ()=>{ if(prev) prev.remove(); };
  document.body.appendChild(s);
}
setInterval(()=>loadResultsData(renderResultados), 120000);
/* El "hace Xs" se refresca más seguido que el dato en sí, para que la pantalla se sienta viva entre corridas. */
setInterval(()=>{
  const el = document.getElementById("resultsAgo");
  if(el && window.DATA_RESULTADOS) el.textContent = relTime(window.DATA_RESULTADOS.metadata.generated);
}, 15000);

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
    for(let k=0;k<n;k++){ const a = n===1 ? Math.PI/2 : Math.PI*(1 - k/(n-1)); pts.push({x:cx+r*Math.cos(a), y:cy-r*Math.sin(a), a, ri}); }
  });
  pts.sort((p,q)=> q.a - p.a || p.y - q.y);
  const flat=[]; segments.forEach(s=>{ for(let i=0;i<s.n;i++) flat.push(s); });
  /* De afuera hacia adentro: la fila de mayor radio (ri más alto) entra primero. */
  const dots = pts.map((p,i)=>{
    const s = flat[i];
    const paint = s.hollow ? `fill="var(--surface)" stroke="${s.color}" stroke-width="2"` : `fill="${s.color}"`;
    const tossCls = (!s.hollow && s.color === COLORS["tossup"]) ? " seat-toss" : "";
    const delay = ((rows-1-p.ri) * 90 + (p.ri%2)*6).toFixed(0);
    return `<circle class="dot-in${tossCls}" style="animation-delay:${delay}ms" cx="${p.x.toFixed(1)}" cy="${p.y.toFixed(1)}" r="${(s.hollow?dotR-1:dotR).toFixed(1)}" ${paint}><title>${s.label} (${s.n})</title></circle>`;
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
  const c = t().congress, p = senateProjection(), gb = E.house.generic_ballot, ctx = E.context, ev = earlyVote();
  const closest = E.senate.races.filter(r=>r.last_poll && ["tossup","lean-d","lean-r"].includes(r.rating))
    .sort((a,b)=>{
      // Un empate es el margen más cerrado: se ordena por el valor con signo, no por el texto.
      const m = s=>{const r=raceMargin(s); return r && r.v!==null ? Math.abs(r.v) : 99;};
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
      <div class="stat"><div class="k">${c.gb}</div><div class="v">${dec(gb.average.replace("D +","D+"))}</div><div class="d">${gb.aggregators.map(a=>`${a.name}: ${dec(a.value)}`).join(" · ")}</div><div class="src">${gb.as_of}</div></div>
      <div class="stat"><div class="k">${c.approval}</div><div class="v">${ctx.presidential_approval.aggregator_figure.approve}%</div><div class="d">${lang==="es"?"aprueba":"approve"} · ${ctx.presidential_approval.aggregator_figure.disapprove}% ${lang==="es"?"desaprueba":"disapprove"} (${ctx.presidential_approval.aggregator_figure.source})</div><div class="src">${ctx.presidential_approval.aggregator_figure.as_of}</div></div>
      <div class="stat"><div class="k">${c.earlyVote}</div><div class="v">${ev.v}</div><div class="d">${lang==="es"?`votos anticipados ${ev.cut} (2022: 45,9 M)`:`early votes ${ev.cut} (2022: 45.9M)`}</div><div class="src">${ev.src}</div></div>
    </div>
  </div>
  <h2 class="sec-title">${c.closest}</h2><p class="sec-sub">${c.closestSub}</p>
  <div class="card">${marginBars(closest)}
    <p class="chart-note">${c.marginNote}</p></div>
  <div class="race-list">${closest.map(r=>`
    <div class="race-card" style="border-left-color:${COLORS[r.rating]}">
      <div class="rc-top"><span class="rc-state">${r.state_name}</span>${ratingBadge(r.rating)}</div>
      <div class="rc-cand">${candRow(r.dem_candidate, r.rep_candidate)}</div>
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
/* ---------- gráficos ---------- */
const G = window.DATA_GRAFICOS;

/* Barras de rango sobre un eje común: compara escenarios sin perder la amplitud de cada uno. */
function rangeChart(cfg){
  // En pantalla angosta la etiqueta sube sobre la barra: si no, las barras quedan fuera de vista.
  const narrow = isNarrow();
  const W = narrow?420:760, L = narrow?10:(cfg.labelW||236), R = narrow?26:112,
        rowH = narrow?88:(cfg.rowH||56), top = narrow?34:30, bot=40;
  const H = top + cfg.rows.length*rowH + bot;
  const x = v => L + (v-cfg.min)/(cfg.max-cfg.min)*(W-L-R);
  const fm = v => (cfg.sign && v>0 ? "+" : "") + fmtNum(v);
  const ticks = cfg.ticks.map(v=>`
    <line x1="${x(v)}" y1="${top-8}" x2="${x(v)}" y2="${H-bot+6}" stroke="var(--line)" stroke-width="1"${v===0?' stroke-dasharray="none"':''}/>
    <text x="${x(v)}" y="${H-bot+22}" text-anchor="middle" class="rc-tick">${fm(v)}</text>`).join("");
  const zero = cfg.sign ? `<line x1="${x(0)}" y1="${top-10}" x2="${x(0)}" y2="${H-bot+6}" stroke="var(--ink)" stroke-width="1.5"/>` : "";
  const rows = cfg.rows.map((r,i)=>{
    const rt = top + i*rowH, y = narrow ? rt+66 : rt + rowH/2, h=16;
    const x0=x(r.lo), x1=x(r.hi), w=Math.max(x1-x0,4);
    const bar = `<rect class="rc-bar" style="animation-delay:${i*60}ms" x="${x0}" y="${y-h/2}" width="${w}" height="${h}" rx="4" fill="${r.color}"><title>${r.label}: ${fm(r.lo)} – ${fm(r.hi)} ${cfg.unit}</title></rect>`;
    if(narrow) return `<g class="rc-row">
      <text x="0" y="${rt+22}" class="rc-label">${r.label}</text>
      <text x="0" y="${rt+44}" class="rc-sub">${r.sub||""}</text>
      <text x="${W}" y="${rt+22}" text-anchor="end" class="rc-val">${fm(r.lo)} – ${fm(r.hi)}</text>
      ${bar}
    </g>`;
    return `<g class="rc-row">
      <text x="0" y="${y-4}" class="rc-label">${r.label}</text>
      ${r.sub?`<text x="0" y="${y+13}" class="rc-sub">${r.sub}</text>`:""}
      ${bar}
      <text x="${x1+8}" y="${y+5}" class="rc-val">${fm(r.lo)} – ${fm(r.hi)}</text>
    </g>`;
  }).join("");
  const marker = cfg.marker ? `
    <line x1="${x(cfg.marker.value)}" y1="${top-14}" x2="${x(cfg.marker.value)}" y2="${H-bot+6}" stroke="var(--accent)" stroke-width="2" stroke-dasharray="4 3"/>
    <text x="${x(cfg.marker.value)}" y="${top-20}" text-anchor="middle" class="rc-marker">${cfg.marker.label}</text>` : "";
  return `<div class="chart-wrap"><svg class="rangechart" viewBox="0 0 ${W} ${H}" role="img" aria-label="${cfg.aria||""}">${ticks}${zero}${rows}${marker}</svg></div>`;
}

/* Margen de la última encuesta, con signo: a la derecha ventaja demócrata, a la izquierda republicana. */
function raceMargin(r){
  const m = String(r.last_poll.margin);
  if(/^empate|^even|^tie/i.test(m)) return {v:0, tie:true};
  const hit = m.match(/^([A-Za-zÁÉÍÓÚÑáéíóúñ'’\-]+)\s*\+\s*(\d+(?:[.,]\d+)?)/);
  if(!hit) return null;
  const [,name,num] = hit, v = parseFloat(num.replace(",","."));
  const inName = c => c && c.toLowerCase().includes(name.toLowerCase());
  if(inName(r.dem_candidate)) return {v, who:r.dem_candidate, party:"D"};
  if(inName(r.rep_candidate)) return {v:-v, who:r.rep_candidate, party:"R"};
  return {v:null, who:name, party:"?"};   // tercero en competencia: no entra en el eje
}

function marginBars(races){
  const data = races.map(r=>({r, m:raceMargin(r)})).filter(d=>d.m && d.m.v!==null);
  if(!data.length) return "";
  const hi = Math.ceil(Math.max(...data.map(d=>Math.abs(d.m.v)))/5)*5;
  const lo = -hi/3;   // misma escala a ambos lados; se recorta el lado sin datos
  const lim = hi;
  const narrow = isNarrow();
  const W = narrow?420:760, L = narrow?104:168, R = narrow?58:92, rowH = narrow?32:34, top=26, bot=34;
  const H = top + data.length*rowH + bot;
  const x = v => L + (v-lo)/(hi-lo)*(W-L-R);
  const ticks=[-hi/3,0,hi/2,hi].map(v=>`
    <line x1="${x(v)}" y1="${top-8}" x2="${x(v)}" y2="${H-bot+4}" stroke="var(--line)"/>
    <text x="${x(v)}" y="${H-bot+20}" text-anchor="middle" class="rc-tick">${v>0?"D+"+v:v<0?"R+"+Math.abs(v):"0"}</text>`).join("");
  const rows = data.map((d,i)=>{
    const y = top + i*rowH + rowH/2, h=15, v=d.m.v;
    const x0 = v>=0 ? x(0) : x(v), w = Math.max(Math.abs(x(v)-x(0)), v===0?3:4);
    const col = v>0 ? COLORS["safe-d"] : v<0 ? COLORS["safe-r"] : "var(--ink-3)";
    const lbl = d.m.tie ? (lang==="es"?"empate":"tie") : (v>0?"D+":"R+")+fmtNum(Math.abs(v));
    return `<g class="rc-row">
      <text x="0" y="${y+5}" class="rc-label rc-label-sm">${d.r.state_name}</text>
      <rect class="rc-bar" style="animation-delay:${i*60}ms" x="${x0}" y="${y-h/2}" width="${w}" height="${h}" rx="4" fill="${col}"><title>${d.r.state_name}: ${d.r.last_poll.margin}</title></rect>
      <text x="${(v>=0?x(v)+8:x(v)-8)}" y="${y+5}" text-anchor="${v>=0?"start":"end"}" class="rc-val">${lbl}</text>
    </g>`;
  }).join("");
  return `<div class="chart-wrap"><svg class="rangechart" viewBox="0 0 ${W} ${H}" role="img">${ticks}
    <line x1="${x(0)}" y1="${top-10}" x2="${x(0)}" y2="${H-bot+4}" stroke="var(--ink)" stroke-width="1.5"/>${rows}</svg></div>`;
}

/* Separador decimal del idioma en cadenas de una sola cifra decimal (no toca miles). */
function dec(s){ return lang==="es" ? String(s).replace(/(\d)\.(\d)(?!\d)/g, "$1,$2") : String(s); }

/* Voto anticipado: una sola fuente para todo el tablero, para que no haya dos cifras distintas. */
function earlyVote(){
  const j = J && J.jornada && J.jornada.early_vote;
  if(j && j.total_ballots) return {
    v:`+${Math.floor(j.total_ballots/1e6)} M`,
    cut: lang==="es" ? "al 2 de noviembre" : "as of November 2",
    src:"University of Florida Election Lab · ABC News"
  };
  const e = E.context.early_vote;
  return {
    v:`${(e.total_ballots/1e6).toFixed(1).replace(".", lang==="es"?",":".")} M`,
    cut: lang==="es" ? "al 30 de octubre" : "as of October 30",
    src:"University of Florida Election Lab"
  };
}

/* Los gráficos cambian de disposición al cruzar este ancho. */
function isNarrow(){ return window.innerWidth < 760; }

/* Monograma: inicial sobre el color del partido, en lugar de retratos ajenos. */
function monogram(name, party){
  const ini = (name||"?").trim().charAt(0).toUpperCase();
  return `<span class="mono-badge mb-${party}" aria-hidden="true">${ini}</span>`;
}

/* Formato de cifra y unidad: el número manda, el detalle baja a la nota. */
function fmtNum(v){
  if(typeof v === "number") return v.toLocaleString(lang==="es" ? "es-AR" : "en-US", {maximumFractionDigits:2});
  // Rangos como "3.75–4.00" llevan coma decimal en español.
  if(lang==="es" && typeof v === "string" && /^[\d.,–\-\s≈+]+$/.test(v)) return v.replace(/\./g, ",");
  return v;
}
function shortUnit(u){ return u ? String(u).split(" (")[0] : ""; }
function unitTail(u){
  if(!u) return "";
  const i = String(u).indexOf(" (");
  if(i<0) return "";
  const tail = String(u).slice(i+2).replace(/\)$/,"");
  if(lang==="es" && /^trillions?$/i.test(tail)) return "";   // glosa en inglés, redundante acá
  return tail + " · ";
}

function renderEconomy(){
  const ec = t().economy;
  $("#sec-economia").innerHTML = `
  <h2 class="sec-title">${ec.title}</h2>
  <h2 class="sec-title" style="font-size:20px">${ec.indTitle}</h2><p class="sec-sub">${ec.indSub}</p>
  <div class="card-row">${M.indicators.map(i=>`
    <div class="stat">
      <div class="k">${lang==="es"?i.label_es:i.label_en}</div>
      <div class="v">${i.value===null?`<span style="font-size:20px;color:var(--ink-3)">${ec.nd}</span>`:fmtNum(i.value)}${i.value!==null&&i.unit?` <small style="font-size:14px;font-family:'DM Sans';font-weight:600;color:var(--ink-3)">${shortUnit(i.unit)}</small>`:""}</div>
      <div class="trend">${unitTail(i.unit)}${i.trend}</div>
      <div class="src">${i.source} · ${i.as_of}</div>
    </div>`).join("")}</div>
  <h2 class="sec-title" style="font-size:20px">${ec.spTitle}</h2>
  <div class="card">${rangeChart({
      rows: G.sp500_scenarios.rows.map(r=>({
        label: lang==="es"?r.es:r.en,
        sub: `${r.prob} % ${lang==="es"?"de probabilidad":"probability"}`,
        // Color único: el eje y el cero expresan el signo; un color de partido acá significaría otra cosa.
        lo:r.lo, hi:r.hi, color:"var(--accent)"
      })),
      min:-0.5, max:1.5, ticks:[-0.5,0,0.5,1,1.5], sign:true, unit:"%",
      aria: ec.spTitle
    })}
    <p class="chart-note">${ec.spNote} ${G.sp500_scenarios.source}.</p></div>
  <h2 class="sec-title" style="font-size:20px">${ec.scenTitle}</h2><p class="sec-sub">${ec.scenSub}</p>
  ${scenarioMatrix()}`;
}

/* Matriz de escenarios: cada dimensión en una fila, los tres resultados en columnas comparables. */
function scenarioMatrix(){
  const ec = t().economy, S = M.scenarios;
  return `<div class="card smatrix">
    <div class="sm-head">
      <div class="sm-dim"></div>
      ${S.map(s=>`<div class="sm-col"><b>${lang==="es"?s.label_es:s.label_en}</b></div>`).join("")}
    </div>
    ${["fiscal","trade","fed_rates","markets","regulation"].map(f=>`
      <div class="sm-row">
        <div class="sm-dim">${ec.fields[f]}</div>
        ${S.map(s=>`<div class="sm-cell">
          <p>${lang==="es"?s[f].es:s[f].en}</p>
          <div class="srcs">${s[f].sources.join(" · ")}</div>
        </div>`).join("")}
      </div>`).join("")}
  </div>`;
}

/* ---------- latam ---------- */
const LATAM_ANCHORS = [
  {l_es:"Riesgo país Argentina",l_en:"Argentina country risk",v_es:"791 pts",v_en:"791 pts",d_es:"Máximo desde octubre de 2025, al viernes previo a la elección.",d_en:"Highest since October 2025, on the Friday before the election.",src:"Infobae, 2-nov-2026"},
  {l_es:"Arancel combinado a Brasil",l_en:"Combined tariff on Brazil",v_es:"37,5 %",v_en:"37.5%",d_es:"Sección 301 más recargo por trabajo forzoso, sobre USD 10.800 millones.",d_en:"Section 301 plus forced-labour surcharge, on USD 10.8 billion.",src:"CNI vía The Rio Times"},
  {l_es:"Swap del Tesoro con Argentina",l_en:"US Treasury swap with Argentina",v_es:"USD 20.000 M",v_en:"USD 20 bn",d_es:"Con el «No Argentina Bailout Act» demócrata ya presentado en el Congreso.",d_en:"With the Democratic 'No Argentina Bailout Act' already filed in Congress.",src:"Infobae · El Cronista, 2-nov-2026"},
  {l_es:"Remesas a México 2025",l_en:"Remittances to Mexico 2025",v_es:"−4,6 %",v_en:"−4.6%",d_es:"Primera caída en 11 años; impuesto del 1 % vigente desde 2026.",d_en:"First drop in 11 years; 1% tax in force since 2026.",src:"Banxico vía Publimetro · BBVA Research"}
];
function renderLatam(){
  const la = t().latam, L = M.latam;
  const dimLabel = d => lang==="es"?d.label_es:d.label_en;
  const expClass = e => "exp-"+e.split(" ")[0].replace("media-baja","media-baja");
  const expKey = e => e.startsWith("media-baja")?"media-baja":e.startsWith("alta")?"alta":"media";
  $("#sec-latam").innerHTML = `
  <h2 class="sec-title">${la.title}</h2>
  <div class="card"><p style="margin:0">${lang==="es"?L.overview.es:L.overview.en}</p></div>
  <h2 class="sec-title" style="font-size:20px">${la.anchorsTitle}</h2>
  <div class="card-row">${LATAM_ANCHORS.map(a=>`
    <div class="stat stat-anchor">
      <div class="k">${lang==="es"?a.l_es:a.l_en}</div>
      <div class="v">${lang==="es"?a.v_es:a.v_en}</div>
      <div class="d">${lang==="es"?a.d_es:a.d_en}</div>
      <div class="src">${a.src}</div>
    </div>`).join("")}</div>
  <h2 class="sec-title" style="font-size:20px">${la.riskTitle}</h2>
  <div class="card">${rangeChart({
      rows: G.riesgo_pais_ar.rows.map(r=>({label: lang==="es"?r.es:r.en, lo:r.lo, hi:r.hi, color:"var(--accent)"})),
      min:550, max:1050, ticks:[600,700,800,900,1000], unit:G.riesgo_pais_ar.unit,
      marker:{value:G.riesgo_pais_ar.current.value, label:`${lang==="es"?"hoy":"today"} ${G.riesgo_pais_ar.current.value}`},
      aria: la.riskTitle
    })}
    <p class="chart-note">${la.riskNote} ${G.riesgo_pais_ar.source} · ${G.riesgo_pais_ar.current.source}.</p></div>
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
/* ---------- boot ---------- */
function renderAll(){
  applyStatic(); renderResultados(); renderSummary(); renderBoardSwitch(); paintBoard();
  renderCongress(); renderEconomy(); renderLatam();
  $("#stateDetail").hidden = true;
}
let wasNarrow = isNarrow();
addEventListener("resize", ()=>{ if(isNarrow()!==wasNarrow){ wasNarrow = isNarrow(); renderAll(); } });
initTheme(); buildMapOnce(); renderAll();
})();
