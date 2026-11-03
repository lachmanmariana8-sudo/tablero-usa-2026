// Entradas numéricas de los gráficos — transcritas de los análisis citados (corrida 3-nov-2026).
// Reacción del S&P 500: mesa de JPMorgan vía BlockBeats/KuCoin, 3-nov-2026 (cuatro escenarios, suma 100 %).
// Riesgo país argentino: Grupo Atenas vía El Cronista, 2-nov-2026; valor actual: Infobae, 2-nov-2026.
window.DATA_GRAFICOS={
  sp500_scenarios:{
    source:"JPMorgan (mesa de operaciones) vía BlockBeats/KuCoin · 3-nov-2026",
    unit:"%",
    rows:[
      {id:"dem_sweep", es:"Demócratas ambas cámaras", en:"Democrats both chambers", prob:66, lo:-0.25, hi:0.5},
      {id:"dem_house_rep_senate", es:"Cámara demócrata · Senado republicano", en:"Democratic House · Republican Senate", prob:26, lo:0.5, hi:1.0},
      {id:"rep_house_dem_senate", es:"Cámara republicana · Senado demócrata", en:"Republican House · Democratic Senate", prob:1, lo:0.25, hi:0.75},
      {id:"gop_hold", es:"Republicanos ambas cámaras", en:"Republicans both chambers", prob:7, lo:1.0, hi:1.25}
    ]
  },
  riesgo_pais_ar:{
    source:"Grupo Atenas vía El Cronista · 2-nov-2026",
    unit:"puntos",
    current:{value:791, es:"Cierre del viernes previo a la elección", en:"Close on the Friday before the election", source:"Infobae · 2-nov-2026"},
    rows:[
      {id:"dem_sweep", es:"Demócratas ambas cámaras", en:"Democrats both chambers", lo:860, hi:1000},
      {id:"divided", es:"Cámara demócrata", en:"Democratic House", lo:750, hi:860},
      {id:"gop_hold", es:"Statu quo republicano", en:"Republican status quo", lo:600, hi:650}
    ]
  }
};
