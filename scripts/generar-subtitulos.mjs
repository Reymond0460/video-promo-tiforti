// Genera los archivos de subtítulos (.srt) a partir del guion y de los tiempos medidos de la voz.
// Uso: node scripts/generar-subtitulos.mjs
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';

const raiz = new URL('..', import.meta.url).pathname;
const guion = JSON.parse(readFileSync(raiz + 'src/datos/guion.json', 'utf8'));
const tiempos = JSON.parse(readFileSync(raiz + 'src/datos/voz-tiempos.json', 'utf8'));

const marca = (s) => {
  const ms = Math.round(s * 1000);
  const p = (n, l = 2) => String(n).padStart(l, '0');
  return `${p(Math.floor(ms / 3600000))}:${p(Math.floor(ms / 60000) % 60)}:${p(Math.floor(ms / 1000) % 60)},${p(ms % 1000, 3)}`;
};

// Frase que la protagonista dice en pantalla (no la narra la voz en off).
const CITA = { completo: [54.6, 56.1], corto: [21.7, 23.3] };

mkdirSync(raiz + 'entregables', { recursive: true });
for (const [version, archivo] of [['completo', 'tiforti-promo-completo.srt'], ['corto', 'tiforti-promo-corto-30s.srt']]) {
  const bloques = [];
  for (const l of guion[version]) {
    const m = tiempos[l.id];
    l.subs.forEach((texto, i) => bloques.push({ desde: l.inicio + m.cortes[i], hasta: l.inicio + m.cortes[i + 1] + (i === l.subs.length - 1 ? 0.25 : 0), texto }));
  }
  bloques.push({ desde: CITA[version][0], hasta: CITA[version][1], texto: '[Camila] ¡Qué bonita quedó!\nEs justo lo que tenía en mente.' });
  bloques.sort((a, b) => a.desde - b.desde);
  const srt = bloques.map((b, i) => `${i + 1}\n${marca(b.desde)} --> ${marca(b.hasta)}\n${b.texto}\n`).join('\n');
  writeFileSync(raiz + 'entregables/' + archivo, srt, 'utf8');
  console.log(archivo, '·', bloques.length, 'subtítulos');
}
