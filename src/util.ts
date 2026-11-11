// Utilidades de animación.
export const limitar = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
export const mezclar = (a: number, b: number, t: number) => a + (b - a) * t;
/** 0→1 lineal mientras f va de a hasta b. */
export const tramo = (f: number, a: number, b: number) => limitar((f - a) / (b - a || 1));
/** Curva suave (acelera y frena). */
export const suave = (t: number) => t * t * (3 - 2 * t);
/** 0→1 suavizado mientras f va de a hasta b. */
export const st = (f: number, a: number, b: number) => suave(tramo(f, a, b));
/** Entrada que frena al final. */
export const frenar = (t: number) => 1 - Math.pow(1 - limitar(t), 3);
export const fr = (f: number, a: number, b: number) => frenar(tramo(f, a, b));
/** Entrada con un leve rebote. */
export const rebote = (t: number) => {
  const x = limitar(t);
  const c = 1.55;
  return 1 + (c + 1) * Math.pow(x - 1, 3) + c * Math.pow(x - 1, 2);
};
/** Sube entre a→b y vuelve a bajar entre c→d (para elementos que aparecen y se van). */
export const ventana = (f: number, a: number, b: number, c: number, d: number) => Math.min(st(f, a, b), 1 - st(f, c, d));
/** Movimiento orgánico continuo entre -1 y 1 (suma de senos; determinista). */
export const deriva = (f: number, semilla = 0, vel = 1) =>
  (Math.sin(f * 0.031 * vel + semilla * 1.7) + Math.sin(f * 0.017 * vel + semilla * 3.1) * 0.7 + Math.sin(f * 0.053 * vel + semilla * 0.9) * 0.35) / 2.05;
/** Número pseudoaleatorio estable 0..1. */
export const azar = (n: number) => {
  const x = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};
/** Interpola entre claves [fotograma, valor] con suavizado. */
export const claves = (f: number, puntos: Array<[number, number]>) => {
  if (f <= puntos[0][0]) return puntos[0][1];
  for (let i = 1; i < puntos.length; i++) {
    if (f <= puntos[i][0]) return mezclar(puntos[i - 1][1], puntos[i][1], st(f, puntos[i - 1][0], puntos[i][0]));
  }
  return puntos[puntos.length - 1][1];
};
/** Mezcla dos colores hexadecimales. */
export const mezclarColor = (a: string, b: string, t: number) => {
  const p = (h: string) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
  const [x, y] = [p(a), p(b)];
  return `rgb(${x.map((v, i) => Math.round(mezclar(v, y[i], limitar(t)))).join(',')})`;
};
