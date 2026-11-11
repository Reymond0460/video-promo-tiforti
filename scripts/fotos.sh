#!/usr/bin/env bash
# Uso: scripts/fotos.sh <Composicion> <carpeta_salida> <fotograma> [fotograma...]
# Renderiza fotogramas sueltos (a media resolución) para revisar el video sin exportarlo completo.
set -e
COMP=$1; OUT=$2; shift 2
mkdir -p "$OUT"
BUNDLE=${BUNDLE:-.cache/bundle}
if [ -z "$SIN_BUNDLE" ]; then npx remotion bundle --out-dir "$BUNDLE" >/dev/null 2>&1; fi
for f in "$@"; do
  ( npx remotion still "$BUNDLE" "$COMP" "$OUT/$COMP-$(printf %04d $f).png" --frame=$f --scale=${ESCALA:-0.5} >/dev/null 2>&1 || echo "falló $f" ) &
  while [ "$(jobs -r | wc -l)" -ge 4 ]; do sleep 0.3; done
done
wait
ls "$OUT" | wc -l
