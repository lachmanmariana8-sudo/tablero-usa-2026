# Primeros resultados reales — 21:08 ART (19:08 ET)

## Qué cambió

`data/resultados.js`: `status` pasa de `pending` a `live` — es la primera carrera llamada de la noche.

- **Senado Virginia — LLAMADA.** Fox News proyectó a **Mark Warner (D)** como ganador a las 19:00 ET, apenas cerradas las urnas (banca calificada "safe-d", sin oposición real). Al momento de la llamada la tabla de Fox todavía mostraba 0 votos cargados — es una llamada por fundamentals/boca de urna, no por conteo. Fuente: Fox News, sección Elections ([foxnews.com/elections](https://www.foxnews.com/elections)), consultada 21:05 ART / 19:05 ET.
- **Senado Kentucky — CONTANDO.** 9.28% escrutado, Charles Booker (D) 51.55% vs. Andy Barr (R) 47.06% (79.241 vs 72.336 votos), margen D+4.5. Banca abierta (se retira McConnell) calificada "safe-r" por el consenso del tablero — el liderazgo demócrata en este recorte muy parcial no se interpretó como tendencia ni se tocó el rating. Misma fuente y hora que arriba.

## Qué se revisó y no cambió

Repasé con WebSearch/WebFetch Georgia, Carolina del Sur (urnas cerradas a las 19:00 ET junto con Virginia) y el resto de las 35 carreras de Senado: Fox las muestra todas en 0 votos / 0% a esta hora, así que no se agregó nada. Gobernaciones (36) y los 16 distritos clave de Cámara: ningún cierre de urnas ocurrió todavía dentro de ese universo con datos cargados (Georgia y Carolina del Sur sí tienen gobernación en el tablero, pero tampoco reportan conteo aún). No se tocó `electoral.js` ni `jornada.js`.

## Pendiente para la próxima corrida

Próxima tanda de cierres relevantes: 19:30 ET (Carolina del Norte, Ohio especial, Virginia Occidental). Seguir el conteo de Kentucky y confirmar si alguna cadena mayor llama Georgia o Carolina del Sur.
