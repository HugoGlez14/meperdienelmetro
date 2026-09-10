# meperdienelmetro

Aplicación local en React + Vite para planear viajes en las 12 líneas del Metro de la CDMX.

## Ejecutar

Requiere Node.js 20.19+ o 22.12+.

```sh
npm install
npm run dev
```

## Validar y compilar

```sh
npm test
npm run build
```

## Git y Vercel

El proyecto incluye `.gitignore` y `vercel.json`. Crea un repositorio en GitHub, sube el contenido de esta carpeta e importa ese repositorio en Vercel. Selecciona Vite, comando `npm run build` y carpeta de salida `dist`. El nombre sugerido es `meperdienelmetro`, sujeto a disponibilidad. No necesita claves ni un servidor backend. No se han vinculado cuentas ni publicado el sitio.

## Rutas y datos

`src/metro.js` contiene las estaciones por línea y un algoritmo de Dijkstra sobre pares estación/línea. Los transbordos se modelan como cambios de línea en estaciones compartidas. El modo menor tiempo usa 2 minutos por tramo y 5 por transbordo. El modo menos cambios prioriza el número de transbordos y después los tramos. No incluye espera, afluencia, cierres, accesibilidad ni tiempos reales; se debe verificar la operación antes de viajar.

Referencia pública: https://www.metro.cdmx.gob.mx/la-red/mapa-de-la-red

El mapa es una adaptación vectorial del plano del STC, con posiciones de estaciones transcritas de https://www.metro.cdmx.gob.mx/storage/app/media/red/plano_red19ok.png. Los tramos conectan esas posiciones con segmentos rectos; no es una reproducción exacta de todos los quiebres del original ni un plano geográfico. Permite ampliar y resalta la ruta elegida sobre toda la red. Las alternativas se generan excluyendo conexiones de la ruta preferida, se deduplican y se descartan ciclos o desvíos mayores a 30 minutos adicionales; se muestran hasta tres opciones, no una enumeración exhaustiva. Las fuentes de Google son opcionales y cuentan con alternativas locales.

