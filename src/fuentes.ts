// Carga las tipografías locales (public/fonts) antes de renderizar cualquier fotograma.
import { continueRender, delayRender, staticFile } from 'remotion';

const FUENTES: Array<[string, string, string]> = [
  ['Plus Jakarta Sans', 'fonts/plus-jakarta-sans.woff2', '400 800'],
  ['JetBrains Mono', 'fonts/jetbrains-mono-latin-wght-normal.woff2', '100 800'],
  ['Caveat', 'fonts/caveat-latin-wght-normal.woff2', '400 700'],
  ['Fraunces', 'fonts/fraunces-latin-wght-normal.woff2', '100 900'],
];

let pedido = false;
export const cargarFuentes = () => {
  if (pedido || typeof document === 'undefined') return;
  pedido = true;
  const espera = delayRender('Cargando tipografías');
  Promise.all(
    FUENTES.map(([familia, archivo, peso]) =>
      new FontFace(familia, `url(${staticFile(archivo)}) format("woff2")`, { weight: peso }).load().then((f) => document.fonts.add(f)),
    ),
  )
    .catch((e) => console.error('No se pudo cargar una tipografía', e))
    .finally(() => continueRender(espera));
};
