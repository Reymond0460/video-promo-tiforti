// Línea de tiempo del video: narración, subtítulos y efectos de sonido.
// La lista de tomas (qué se ve y cuándo) está en src/Promo.tsx.
import guion from './datos/guion.json';
import vozTiempos from './datos/voz-tiempos.json';
import { FPS } from './tema';

export type Version = 'completo' | 'corto';
export const DURACION: Record<Version, number> = { completo: 75 * FPS, corto: 30 * FPS };
export const seg = (s: number) => Math.round(s * FPS);

type Linea = { id: string; inicio: number; tts: string; subs: string[]; enPantalla?: boolean; ocultar?: number[] };
type Medida = { dur: number; habla: number; cortes: number[] };
const medidas = vozTiempos as Record<string, Medida>;

export type Frase = { id: string; inicio: number; fin: number; dur: number };
export type Subtitulo = { texto: string; desde: number; hasta: number; id: string };

/** Frases de la narración con su inicio y fin en segundos. */
export const frases = (v: Version): Frase[] =>
  (guion[v] as Linea[]).map((l) => ({ id: l.id, inicio: l.inicio, fin: l.inicio + medidas[l.id].habla, dur: medidas[l.id].dur }));

/** Subtítulos sincronizados con la voz (en segundos). */
export const subtitulos = (v: Version, soloEnPantalla = true): Subtitulo[] => {
  const res: Subtitulo[] = [];
  for (const l of guion[v] as Linea[]) {
    if (soloEnPantalla && l.enPantalla === false) continue;
    const m = medidas[l.id];
    l.subs.forEach((texto, i) => {
      if (soloEnPantalla && l.ocultar?.includes(i)) return;
      res.push({ id: `${l.id}-${i}`, texto, desde: l.inicio + m.cortes[i], hasta: l.inicio + m.cortes[i + 1] + (i === l.subs.length - 1 ? 0.25 : 0) });
    });
  }
  return res;
};

/** Efectos de sonido: [segundo, archivo, volumen]. */
export const EFECTOS: Record<Version, Array<[number, string, number]>> = {
  completo: [
    [3.25, 'transicion', 0.16],
    [4.55, 'toque', 0.22], [6.0, 'toque', 0.22],
    [7.45, 'taza', 0.3],
    [12.0, 'notificacion', 0.5],
    [13.45, 'toque', 0.35], [14.0, 'transicion', 0.2],
    [18.5, 'tecleo-corto', 0.3], [20.05, 'envio', 0.4],
    [20.5, 'llamada', 0.4],
    [24.3, 'tecleo-corto', 0.26], [27.1, 'lapiz', 0.4], [28.5, 'transicion', 0.18],
    [30.1, 'tecleo-corto', 0.2],
    [31.9, 'toque', 0.25], [32.5, 'toque', 0.25], [33.1, 'toque', 0.25],
    [34.3, 'tecleo-largo', 0.34], [36.6, 'clic', 0.4], [36.8, 'tecleo-corto', 0.34],
    [38.5, 'tecleo-corto', 0.22],
    [39.8, 'tecleo-corto', 0.3], [41.3, 'toque', 0.3], [41.7, 'toque', 0.3], [42.1, 'toque', 0.3], [42.5, 'toque', 0.3],
    [43.5, 'clic', 0.45], [44.3, 'clic', 0.45], [45.0, 'clic', 0.45],
    [45.8, 'tecleo-corto', 0.3], [46.75, 'exito', 0.45],
    [50.4, 'transicion', 0.14],
    [56.9, 'envio', 0.3], [57.9, 'toque', 0.3], [58.7, 'toque', 0.3],
    [64.2, 'transicion-baja', 0.2],
  ],
  corto: [
    [2.65, 'transicion', 0.14], [3.5, 'toque', 0.22], [4.3, 'toque', 0.22],
    [5.9, 'notificacion', 0.45], [6.75, 'toque', 0.3], [7.2, 'transicion', 0.18],
    [9.05, 'llamada', 0.35], [10.9, 'lapiz', 0.35],
    [12.5, 'tecleo-corto', 0.32], [15.1, 'tecleo-corto', 0.26], [15.9, 'toque', 0.3], [16.2, 'toque', 0.3],
    [17.0, 'clic', 0.4], [17.6, 'clic', 0.4], [18.75, 'exito', 0.42],
    [19.2, 'transicion', 0.14], [23.4, 'transicion-baja', 0.2],
  ],
};

/** Volumen de la música: baja mientras habla la narración y sube en los silencios. */
export const volumenMusica = (v: Version) => {
  const fs = frases(v);
  const total = DURACION[v] / FPS;
  return (frame: number) => {
    const t = frame / FPS;
    let dist = 99;
    for (const f of fs) {
      const d = t < f.inicio ? f.inicio - t : t > f.fin ? t - f.fin : 0;
      if (d < dist) dist = d;
    }
    const x = Math.min(1, dist / 0.45);
    const libre = t > total - 6 ? 0.62 : 0.6;
    return 0.27 + (libre - 0.27) * x * x * (3 - 2 * x);
  };
};
