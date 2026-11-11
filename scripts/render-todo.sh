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

# Paso final de cada video:
#  - color estándar para redes (yuv420p, BT.709, rango limitado) y compresión H.264 de buena calidad
#  - audio masterizado a aprox. -14 LUFS (el nivel habitual de las redes sociales) con un limitador
COLOR="scale=in_range=full:in_color_matrix=bt601:out_range=tv:out_color_matrix=bt709,format=yuv420p"
AUDIO="volume=6dB,alimiter=limit=0.891:attack=5:release=60:level=disabled"

exportar() { # composición, archivo final
  npx remotion render .cache/bundle "$1" ".cache/$1.mp4" --audio-codec=aac --audio-bitrate=256k --log=error
  ffmpeg -v error -y -i ".cache/$1.mp4" -vf "$COLOR" -c:v libx264 -preset slow -crf 21 \
    -color_range tv -colorspace bt709 -color_primaries bt709 -color_trc bt709 \
    -af "$AUDIO" -c:a aac -b:a 256k -movflags +faststart "entregables/$2"
  echo "listo: entregables/$2"
}

case "${1:-todas}" in
  PromoVertical|todas)   exportar PromoVertical   tiforti-promo-vertical-1080x1920.mp4 ;;&
  PromoHorizontal|todas) exportar PromoHorizontal tiforti-promo-horizontal-1920x1080.mp4 ;;&
  PromoCorto30|todas)    exportar PromoCorto30    tiforti-promo-corto-30s-1080x1920.mp4 ;;
esac
ls -lh entregables
