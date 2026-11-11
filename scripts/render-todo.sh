#!/usr/bin/env bash
# Exporta las tres versiones del video a la carpeta entregables/.
#   npm run render                 (todas)
#   bash scripts/render-todo.sh PromoVertical   (solo una)
# Opcional: REMOTION_CHROME=/ruta/a/chrome-headless-shell para usar un Chrome ya instalado.
set -euo pipefail
cd "$(dirname "$0")/.."
mkdir -p entregables .cache
node scripts/generar-subtitulos.mjs
npx remotion bundle --out-dir .cache/bundle >/dev/null

exportar() { # composición, archivo final
  npx remotion render .cache/bundle "$1" ".cache/$1.mp4" --audio-codec=aac --audio-bitrate=256k --log=error
  # Masterización del audio: sube el nivel a aprox. -14 LUFS (el estándar de redes sociales) con un limitador.
  ffmpeg -v error -y -i ".cache/$1.mp4" -c:v copy -af "volume=6dB,alimiter=limit=0.891:attack=5:release=60:level=disabled" -c:a aac -b:a 256k -movflags +faststart "entregables/$2"
  echo "listo: entregables/$2"
}

case "${1:-todas}" in
  PromoVertical|todas)   exportar PromoVertical   tiforti-promo-vertical-1080x1920.mp4 ;;&
  PromoHorizontal|todas) exportar PromoHorizontal tiforti-promo-horizontal-1920x1080.mp4 ;;&
  PromoCorto30|todas)    exportar PromoCorto30    tiforti-promo-corto-30s-1080x1920.mp4 ;;
esac
ls -lh entregables
