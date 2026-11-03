# Corrida de la tarde — 3 de noviembre de 2026 (urnas abiertas, ~14:30 ET)

## Qué entró

**Pulso de la jornada** (nuevo, encabeza el tablero): voto anticipado +57 millones (University of Florida Election Lab vía ABC News; AP reporta +54 M — discrepancia registrada en el dato), mercados de predicción 94 % Cámara / 77 % demócrata en Senado (mejor precio Kalshi-Polymarket, 12:37 ET), primeros cierres 18:00 ET, e incidencias verificadas de la jornada (máquinas en Westchester NY-17 con la fiscal general Letitia James monitoreando, reubicaciones por inundaciones en ocho condados del sur de Florida, 1.000 monitores del Departamento de Justicia).

**Mercados intradía** (reemplazan la lectura de la mañana del mismo indicador): S&P 500 7.585,02 (+0,58 %), Tesoro a 10 años 4,96 %, petróleo WTI 95,92 USD (baja desde el pico matinal de 98,51 tras el ataque a Qeshm), dólar DXY 101,84 — este último completa el campo que por la mañana quedó sin dato verificado.

**Anclas regionales** (nuevo, sección América Latina): riesgo país argentino 791 puntos, arancel combinado a Brasil 37,5 %, swap del Tesoro con Argentina 20.000 millones de dólares, remesas a México −4,6 %.

## Qué no cambió

Ninguna encuesta publicada hoy modifica el cuadro: boleta genérica D +8,6 y aprobación presidencial ~38 % se sostienen. NBC News (1-nov) y Reuters/Ipsos (2-nov) dieron D +8, consistentes. El acumulado anual del S&P quedó fuera: no hubo lectura verificada de hoy y la cifra intradía cubre el indicador.

## Rediseño visual

Lenguaje gráfico al nivel de referencia: banda de estado superior, cabecera con desenfoque, cifras clave con tratamiento LED, profundidad en capas, mapa con transiciones y estados toss-up encendidos, hemiciclos animados y modo oscuro como protagonista. Verificado en claro, oscuro, inglés y móvil; animaciones desactivadas bajo `prefers-reduced-motion`.

## Pendientes

- Resultados oficiales a medida que se publiquen (primeros cierres 18:00 ET).
- Participación final de la jornada, sin cifra verificada al cierre de esta corrida.
- Composición de la Cámara: persiste la divergencia 220-215 vs 222-213 entre fuentes.

## Corrección de coherencia (16:30)

El voto anticipado aparecía con dos valores: 57 millones en el pulso de la jornada y 48,5 millones en Congreso, porque cada sección leía un dataset distinto. Ahora ambas tarjetas y la clave de la elección se sirven de una única función, con la cifra del 2 de noviembre de University of Florida Election Lab. También se corrigió el separador decimal de la boleta genérica, que en castellano mostraba punto.

## Migración de alojamiento (16:50)

El tablero pasó de GitHub Pages a Vercel, proyecto `usa2026` del equipo Ágora Data, desplegando desde la rama `main` sin paso de compilación. El repositorio quedó privado: el código y estas notas de corrida dejaron de ser legibles desde fuera, y la dirección anterior de GitHub Pages ya no responde.

La dirección definitiva será `usa2026.democracia.ar`, pendiente de un registro CNAME en Cloudflare. Mientras tanto el tablero se sirve en `usa2026-three.vercel.app`.

## Corrida de cierre (16:35 ET)

**Mercados al cierre de la rueda.** S&P 500 en 7.568,92 (+0,36 %), con el mercado dividido: Dow Jones 51.786,72 (−0,38 %) y Nasdaq 25.372,01 (+0,83 %), ambos incorporados como indicadores propios. Tesoro a 10 años 4,952 %, petróleo WTI 96,09 dólares de liquidación y dólar DXY 101,86. Los indicadores se reordenaron para que la rueda de hoy encabece y el telón macroeconómico quede detrás.

**Mercados de predicción.** Cámara demócrata 93,3 % y Senado 73 % en Kalshi al cierre, cediendo desde el 94 % y el 77 % del mediodía.

**Jornada.** Carolina del Norte extendió el horario en cinco mesas y demora su difusión de resultados hasta al menos las 20:15 ET; un tribunal del condado de Chester, en Pensilvania, ordenó extender hasta las 20:30 ET en tres mesas; una amenaza de bomba obligó a evacuar un centro de votación en Toledo, Ohio.

**Sin resultados ni boca de urna.** Las urnas seguían abiertas en todos los estados. CNN reemplazó sus encuestas a boca de urna por el CNN Voter Poll y retiene los datos que caracterizan cada carrera hasta el cierre.

### Criterios aplicados en esta corrida

El acumulado anual del S&P quedó fuera: la única fuente disponible lo calcula sobre el ETF SPY como aproximación, no sobre el índice, y corta al lunes.

Del bloque de incidencias se retiraron los hechos provenientes de un agregador sin confirmación primaria independiente. Quedaron los tres con fuente propia más los ya verificados por la mañana.

La divergencia del voto anticipado entre 57 y 54 millones quedó explicada: son rastreadores de cobertura distinta, no cifras en conflicto. El tablero usa la de University of Florida Election Lab, de cobertura más amplia.
