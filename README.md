# Tablero — Elecciones de Medio Término EE.UU. 2026

Tablero de monitoreo de **Democrac.IA / Ágora Data** sobre las elecciones legislativas y de gobernadores de Estados Unidos del 3 de noviembre de 2026. Bilingüe (ES/EN), con modo claro/oscuro.

**Sitio publicado:** https://lachmanmariana8-sudo.github.io/tablero-usa-2026/

## Secciones

1. **Mapa nacional** — mapa interactivo por estado (proyección AlbersUSA) con tres tableros: Senado (35 carreras), Gobernaciones (36 carreras) y Cámara (distritos toss-up por estado). Tooltip y panel de detalle por estado con candidatos, rating de consenso y última encuesta.
2. **Congreso y escenarios** — composición actual y proyectada por ratings del Senado, umbral de mayoría de la Cámara, boleta genérica por agregador, carreras más cerradas y escenarios de control con probabilidades de JPMorgan.
3. **Economía** — variables al día de la elección (Fed, CPI, desempleo, PIB, petróleo, Tesoro a 10 años, aranceles, déficit) y qué cambia en política fiscal, comercio, Fed, mercados y regulación según cada escenario, con atribución.
4. **América Latina** — matriz país × canal de impacto (comercio/aranceles, inversión/tasas, migración/remesas, política exterior, programas específicos) y detalle por país con impactos por escenario.
5. **Fuentes y metodología** — todas las fuentes de la corrida, con fecha de consulta.

## Stack técnico

Mismo patrón que electionenjoyer.com (relevado el 3-nov-2026): **sitio 100 % estático, vanilla JS, sin framework ni build**.

- `index.html` + `css/index.css` + `js/app.js` — una página, tokens CSS para tema claro/oscuro.
- `data/*.js` — los datos se versionan como archivos JS (`window.DATA_*`) y se publican con el sitio; no hay backend. Cache-busting por query string (`?v=`).
- `data/map_paths.js` — paths SVG pre-proyectados (AlbersUSA 975×610), generados por `tools/build_map.py` desde `us-atlas@3.0.1` (TopoJSON 10 m). El runtime no necesita librería de mapas.
- Tipografías: Big Shoulders Display, DM Sans, DM Mono (Google Fonts).
- Paleta de ratings validada para daltonismo (deután/tritán) y separación en visión normal, en modo claro y oscuro.
- Hosting: GitHub Pages (deploy automático desde `main`).

## Workflow de actualización (corridas con agentes)

Cada actualización del tablero es una **corrida** documentada en `corridas/`:

1. **Agente electoral** — releva ratings (mediana Cook / Inside Elections / Sabato), candidatos, encuestas, boleta genérica, voto anticipado y, tras el cierre de urnas, resultados oficiales → actualiza `data/electoral.js`.
2. **Agente económico/regional** — releva indicadores con fecha y fuente, escenarios de analistas citados e impacto por país de América Latina → actualiza `data/economia.js`.
3. **Integración y verificación** — se valida el JSON, se renderiza el sitio y se revisa visualmente antes del push. Subir el número de versión (`?v=`) en `index.html` al cambiar datos.

**Regla editorial:** el dato entra con fuente verificada o se consigna su ausencia (`null` + nota); las proyecciones son siempre de terceros citados, nunca propias.

## Desarrollo local

```bash
python3 -m http.server 8080   # abrir http://localhost:8080
python3 tools/build_map.py <states-10m.json>   # regenerar el mapa (solo si cambia el atlas)
```
