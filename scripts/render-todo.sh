#!/usr/bin/env bash
# Exporta las tres versiones del video a la carpeta entregables/.
#   npm run render
# Opcional: REMOTION_CHROME=/ruta/a/chrome-headless-shell para usar un Chrome ya instalado.
set -euo pipefail
cd "$(dirname "$0")/.."
mkdir -p entregables .cache
node scripts/generar-subtitulos.mjs
npx remotion bundle --out-dir .cache/bundle
AUDIO="--audio-codec=aac --audio-bitrate=256k"
npx remotion render .cache/bundle PromoVertical   entregables/tiforti-promo-vertical-1080x1920.mp4   $AUDIO
npx remotion render .cache/bundle PromoHorizontal entregables/tiforti-promo-horizontal-1920x1080.mp4 $AUDIO
npx remotion render .cache/bundle PromoCorto30    entregables/tiforti-promo-corto-30s-1080x1920.mp4  $AUDIO
ls -lh entregables
