# Nueva sección: Resultados — 19:30 ART

## Qué se agregó

Pestaña **Resultados**, primera en el orden de navegación y activa por defecto (hasta ahora la pestaña por defecto era Mapa nacional; con las urnas por cerrar, resultados pasa a ser lo más relevante).

Contenido:
- Cuatro cifras ancla (LED, mismo tratamiento visual que el pulso de la jornada): bancas del Senado llamadas, distritos clave de la Cámara llamados, gobernaciones llamadas, y próximo cierre de urnas — este último calculado contra el reloj real a partir de `jornada.js`, no hardcodeado, así se mantiene correcto toda la noche sin tocar el código.
- Banner de estado de la jornada (sin resultados reportados, con fuente).
- Selector Senado/Gobernaciones/Cámara con un tablero de 35/36/16 fichas, una por carrera, coloreadas por rating de consenso y con un punto de estado (gris = sin datos, rojo pulsante = contando, blanco = llamada). Tooltip con candidato líder y margen.
- Tarjetas detalladas para los toss-ups de cada tablero, con el mismo diseño que las carreras más cerradas de Congreso, ahora con badge de estado, margen y barra de % escrutado.

## Actualización automática

El tablero vuelve a pedir `data/resultados.js` cada 2 minutos (con cache-busting) y re-renderiza sin recargar la página; hay también un botón "Actualizar ahora". Probado end-to-end: se simuló una carrera llamada en el archivo de datos y el botón de refresco la reflejó correctamente sin reload.

**Importante — qué significan los 2 minutos:** es el tablero (el navegador de quien lo mira) el que revisa el archivo de datos cada 2 minutos. La carga de datos reales — qué carrera está contando, quién ganó — sigue dependiendo de que yo la actualice en `data/resultados.js` cuando haya una novedad verificable; no hay una fuente oficial con API que lo haga sola. Mientras no haya resultados (las urnas siguen abiertas), el auto-refresh simplemente confirma que no cambió nada.

## Formato de datos

`results.{senate|governors|house}` sólo lleva una entrada por carrera cuando hay un dato verificado (`reporting` o `called`); una carrera ausente se interpreta como `not_reported`. Evita precargar a mano las 87 carreras vacías y hace que cada corrida futura sea un diff mínimo.

## Verificado

Sin errores de consola (Chromium headless), probado en claro/oscuro, español/inglés y mobile (390px). Traducción de los nombres de estado de `jornada.js` (vienen sólo en español) agregada para que la tarjeta de próximo cierre no mezcle idiomas en la versión en inglés.

## Pendiente

Cargar resultados reales en `data/resultados.js` a medida que cierren urnas y se llamen carreras.
