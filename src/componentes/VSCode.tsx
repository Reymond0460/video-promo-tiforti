// Representación fiel del entorno de trabajo: Visual Studio Code (tema oscuro) con explorador de archivos,
// pestañas, editor con resaltado de sintaxis, terminal integrada y panel de vista previa.
// El código que se muestra es real y coherente con el proyecto de ejemplo (la web de Lumbre).
import React from 'react';
import { FUENTE } from '../tema';
import { limitar } from '../util';

export type Lenguaje = 'html' | 'css' | 'js' | 'json';
export type Nodo = { nombre: string; nivel: number; carpeta?: boolean; tipo?: Lenguaje | 'img' };

const C = {
  editor: '#1e1e1e', lateral: '#252526', actividad: '#333333', pestanas: '#2d2d2d', barra: '#3c3c3c', estado: '#007acc',
  texto: '#d4d4d4', tenue: '#858585', linea: '#2a2d2e', seleccion: '#37373d',
  clave: '#569cd6', control: '#c586c0', cadena: '#ce9178', comentario: '#6a9955', funcion: '#dcdcaa', variable: '#9cdcfe', numero: '#b5cea8', tipo: '#4ec9b0', etiqueta: '#569cd6', gris: '#808080', selector: '#d7ba7d',
};

// ---------------------------------------------------------------- código del proyecto de ejemplo
export const CODIGO: Record<string, { lenguaje: Lenguaje; texto: string }> = {
  'index.html': {
    lenguaje: 'html',
    texto: `<!doctype html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <title>Lumbre · Velas artesanales</title>
  <link rel="stylesheet" href="css/estilos.css">
</head>
<body>
  <header class="encabezado">
    <a class="marca" href="/">Lumbre</a>
    <nav id="menu"></nav>
  </header>
  <main>
    <section class="portada">
      <h1>Velas hechas a mano, con calma.</h1>
      <a class="boton" href="#velas">Ver velas</a>
    </section>
    <section id="velas" class="grilla"></section>
  </main>
  <script type="module" src="js/app.js"></script>
</body>
</html>`,
  },
  'estilos.css': {
    lenguaje: 'css',
    texto: `:root {
  --crema: #f7efe4;
  --terracota: #c2613a;
  --cafe: #3a2a20;
}
body {
  margin: 0;
  background: var(--crema);
  color: var(--cafe);
  font-family: "Plus Jakarta Sans", sans-serif;
}
.portada h1 {
  font-family: "Fraunces", serif;
  font-size: clamp(2.6rem, 6vw, 4.6rem);
}
.boton {
  padding: 14px 26px;
  border-radius: 999px;
  background: var(--terracota);
  color: #fff;
}
.grilla {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 22px;
}
@media (max-width: 600px) {
  .grilla { grid-template-columns: 1fr 1fr; }
}`,
  },
  'firebase.js': {
    lenguaje: 'js',
    texto: `// Conexión con los servicios del proyecto
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const config = {
  projectId: "lumbre-web",
  authDomain: "lumbre-web.firebaseapp.com",
};

const app = initializeApp(config);
export const db = getFirestore(app);
export const auth = getAuth(app);`,
  },
  'productos.js': {
    lenguaje: 'js',
    texto: `import { collection, getDocs } from "firebase/firestore";
import { db } from "../core/firebase.js";
import { tarjeta } from "./tarjeta.js";

// Lee las velas desde Firestore y las muestra
export async function cargarVelas() {
  const datos = await getDocs(collection(db, "velas"));
  const grilla = document.querySelector("#velas");
  datos.forEach((doc) => {
    grilla.append(tarjeta(doc.data()));
  });
}`,
  },
};

export const ARBOL: Nodo[] = [
  { nombre: 'css', nivel: 0, carpeta: true },
  { nombre: 'estilos.css', nivel: 1, tipo: 'css' },
  { nombre: 'img', nivel: 0, carpeta: true },
  { nombre: 'js', nivel: 0, carpeta: true },
  { nombre: 'core', nivel: 1, carpeta: true },
  { nombre: 'firebase.js', nivel: 2, tipo: 'js' },
  { nombre: 'modules', nivel: 1, carpeta: true },
  { nombre: 'pedido.js', nivel: 2, tipo: 'js' },
  { nombre: 'productos.js', nivel: 2, tipo: 'js' },
  { nombre: 'tarjeta.js', nivel: 2, tipo: 'js' },
  { nombre: 'app.js', nivel: 1, tipo: 'js' },
  { nombre: 'firebase.json', nivel: 0, tipo: 'json' },
  { nombre: 'index.html', nivel: 0, tipo: 'html' },
];

// ---------------------------------------------------------------- resaltado de sintaxis
type Trozo = { t: string; c: string };

const partir = (linea: string, reglas: Array<[RegExp, string | ((m: string) => string)]>): Trozo[] => {
  const res: Trozo[] = [];
  let resto = linea;
  while (resto.length) {
    let mejor: { i: number; m: string; c: string } | null = null;
    for (const [re, color] of reglas) {
      const m = re.exec(resto);
      if (m && m[0].length && (mejor === null || m.index < mejor.i)) {
        mejor = { i: m.index, m: m[0], c: typeof color === 'function' ? color(m[0]) : color };
        if (m.index === 0) break;
      }
    }
    if (!mejor) {
      res.push({ t: resto, c: C.texto });
      break;
    }
    if (mejor.i > 0) res.push({ t: resto.slice(0, mejor.i), c: C.texto });
    res.push({ t: mejor.m, c: mejor.c });
    resto = resto.slice(mejor.i + mejor.m.length);
  }
  return res;
};

const REGLAS: Record<Lenguaje, Array<[RegExp, string | ((m: string) => string)]>> = {
  js: [
    [/\/\/.*/, C.comentario],
    [/"[^"]*"?|'[^']*'?|`[^`]*`?/, C.cadena],
    [/\b(import|from|export|return|await|async|if|else|for|of)\b/, C.control],
    [/\b(const|let|function|new|true|false|null)\b/, C.clave],
    [/\b\d+(\.\d+)?\b/, C.numero],
    [/\b[A-Za-z_]\w*(?=\()/, C.funcion],
    [/\b[A-Za-z_]\w*\b/, C.variable],
  ],
  html: [
    [/<!--.*?(-->|$)/, C.comentario],
    [/<!doctype[^>]*>?/i, C.gris],
    [/"[^"]*"?/, C.cadena],
    [/<\/?[a-z0-9]+/i, (m) => C.etiqueta],
    [/\/?>/, C.gris],
    [/\b[a-z-]+(?==)/, C.variable],
  ],
  css: [
    [/\/\*.*?(\*\/|$)/, C.comentario],
    [/"[^"]*"?/, C.cadena],
    [/@media[^{]*/, C.control],
    [/--[a-z-]+/, C.variable],
    [/#[0-9a-fA-F]{3,8}\b/, C.cadena],
    [/\b\d+(\.\d+)?(px|rem|vw|fr|%)?/, C.numero],
    [/\b(var|clamp|repeat|minmax)(?=\()/, C.funcion],
    [/^[^{}:;]+(?=\s*\{)/, C.selector],
    [/[a-z-]+(?=\s*:)/, C.variable],
    [/\b(grid|sans-serif|serif|none|auto)\b/, C.cadena],
  ],
  json: [
    [/"[^"]*"(?=\s*:)/, C.variable],
    [/"[^"]*"?/, C.cadena],
    [/\b(true|false|null)\b|\b\d+\b/, C.clave],
  ],
};

const IconoArchivo: React.FC<{ tipo?: Nodo['tipo']; carpeta?: boolean; tam: number }> = ({ tipo, carpeta, tam }) => {
  if (carpeta) return <span style={{ color: '#c5c5c5', fontSize: tam * 0.6, width: tam, display: 'inline-block', textAlign: 'center' }}>▾</span>;
  const m: Record<string, [string, string]> = { html: ['<>', '#e37933'], css: ['#', '#519aba'], js: ['JS', '#cbcb41'], json: ['{}', '#cbcb41'], img: ['▣', '#a074c4'] };
  const [txt, col] = m[tipo ?? 'js'];
  return <span style={{ color: col, fontFamily: FUENTE.codigo, fontWeight: 800, fontSize: tam * 0.56, width: tam, display: 'inline-block', textAlign: 'center', letterSpacing: '-0.08em' }}>{txt}</span>;
};

export type LineaTerminal = { t: string; c?: string };

export const VSCode: React.FC<{
  ancho: number;
  alto: number;
  archivo: string; // nombre del archivo activo (clave de CODIGO)
  pestanas: string[];
  escrito: number; // 0..1 cuánto del archivo ya está escrito
  arbolVisible?: number; // cuántas filas del explorador se ven (los archivos van apareciendo)
  resaltarArbol?: string;
  vista?: React.ReactNode; // contenido del panel de vista previa
  tituloVista?: string;
  division?: 'abajo' | 'derecha';
  proporcionVista?: number; // parte del área de trabajo que ocupa la vista previa
  terminal?: LineaTerminal[];
  terminalVisible?: number; // cuántas líneas de la terminal se ven
  altoTerminal?: number;
  frame: number;
  letra?: number;
  lateral?: number;
}> = ({
  ancho, alto, archivo, pestanas, escrito, arbolVisible = ARBOL.length, resaltarArbol, vista, tituloVista = 'Vista previa', division = 'derecha', proporcionVista = 0.45,
  terminal, terminalVisible = 0, altoTerminal = 220, frame, letra = 21, lateral = 250,
}) => {
  const { lenguaje, texto } = CODIGO[archivo];
  const n = Math.floor(limitar(escrito) * texto.length);
  const visible = texto.slice(0, n);
  const lineas = visible.split('\n');
  const interlinea = Math.round(letra * 1.5);
  const titulo = 40;
  const estado = 30;
  const actividad = 58;
  const altoPestanas = 42;
  const hayTerminal = !!terminal;
  const areaAlto = alto - titulo - estado;
  const vistaAlto = vista && division === 'abajo' ? Math.round(areaAlto * proporcionVista) : 0;
  const editorAlto = areaAlto - vistaAlto - (hayTerminal ? altoTerminal : 0) - altoPestanas;
  const caben = Math.floor((editorAlto - 12) / interlinea);
  const desplazar = Math.max(0, lineas.length - caben + 1);
  const parpadea = Math.floor(frame / 16) % 2 === 0 || escrito < 1;

  const editor = (
    <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', background: C.editor }}>
      {/* pestañas */}
      <div style={{ height: altoPestanas, background: C.pestanas, display: 'flex', flexShrink: 0 }}>
        {pestanas.map((p) => {
          const act = p === archivo;
          return (
            <div key={p} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '0 16px', background: act ? C.editor : 'transparent', borderTop: act ? `2px solid ${C.estado}` : '2px solid transparent', color: act ? '#fff' : '#969696', fontFamily: FUENTE.marca, fontSize: letra * 0.74, fontWeight: 500, borderRight: '1px solid #252526' }}>
              <IconoArchivo tipo={CODIGO[p]?.lenguaje} tam={letra} />
              {p}
              <span style={{ opacity: act ? 0.8 : 0, marginLeft: 4, fontSize: letra * 0.7 }}>{act && escrito < 1 ? '●' : '×'}</span>
            </div>
          );
        })}
      </div>
      {/* código */}
      <div style={{ height: editorAlto, overflow: 'hidden', position: 'relative', flexShrink: 0 }}>
        <div style={{ position: 'absolute', top: 8 - desplazar * interlinea, left: 0, right: 0, fontFamily: FUENTE.codigo, fontSize: letra, lineHeight: `${interlinea}px`, whiteSpace: 'pre' }}>
          {lineas.map((l, i) => {
            const ultima = i === lineas.length - 1;
            return (
              <div key={i} style={{ display: 'flex', background: ultima ? '#282828' : 'transparent', height: interlinea }}>
                <span style={{ width: letra * 2.5, textAlign: 'right', paddingRight: letra * 0.8, color: ultima ? '#c6c6c6' : C.tenue, flexShrink: 0, boxSizing: 'content-box' }}>{i + 1}</span>
                <span>
                  {partir(l, REGLAS[lenguaje]).map((t, k) => <span key={k} style={{ color: t.c }}>{t.t}</span>)}
                  {ultima && parpadea ? <span style={{ display: 'inline-block', width: 2.5, height: letra * 1.15, background: '#aeafad', verticalAlign: 'text-bottom', marginLeft: 1 }} /> : null}
                </span>
              </div>
            );
          })}
        </div>
      </div>
      {/* vista previa debajo del editor */}
      {vista && division === 'abajo' ? (
        <div style={{ height: vistaAlto, borderTop: '1px solid #3c3c3c', display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
          <div style={{ height: 34, background: C.pestanas, display: 'flex', alignItems: 'center', padding: '0 14px', color: '#cccccc', fontFamily: FUENTE.marca, fontSize: letra * 0.7, fontWeight: 600, gap: 8, flexShrink: 0 }}>
            <span style={{ color: '#75beff' }}>◧</span> {tituloVista}
          </div>
          <div style={{ flex: 1, position: 'relative', overflow: 'hidden', background: '#fff' }}>{vista}</div>
        </div>
      ) : null}
      {/* terminal */}
      {hayTerminal ? (
        <div style={{ height: altoTerminal, borderTop: '1px solid #3c3c3c', background: C.editor, flexShrink: 0, overflow: 'hidden' }}>
          <div style={{ display: 'flex', gap: 22, padding: '8px 18px 4px', fontFamily: FUENTE.marca, fontSize: letra * 0.62, fontWeight: 600, letterSpacing: '.04em', color: '#969696' }}>
            <span>PROBLEMAS</span><span>SALIDA</span><span style={{ color: '#e7e7e7', borderBottom: '1px solid #e7e7e7', paddingBottom: 3 }}>TERMINAL</span>
          </div>
          <div style={{ padding: '4px 18px', fontFamily: FUENTE.codigo, fontSize: letra * 0.9, lineHeight: `${Math.round(letra * 1.36)}px`, whiteSpace: 'pre' }}>
            {terminal!.slice(0, Math.ceil(terminalVisible)).map((l, i) => <div key={i} style={{ color: l.c ?? C.texto }}>{l.t}</div>)}
          </div>
        </div>
      ) : null}
    </div>
  );

  return (
    <div style={{ width: ancho, height: alto, borderRadius: 14, overflow: 'hidden', background: C.editor, boxShadow: '0 40px 90px rgba(3,8,24,.55), 0 0 0 1px rgba(255,255,255,.08)', display: 'flex', flexDirection: 'column' }}>
      {/* barra de título */}
      <div style={{ height: titulo, background: C.barra, display: 'flex', alignItems: 'center', padding: '0 16px', gap: 8, flexShrink: 0 }}>
        {['#f26b5e', '#f5be4f', '#5bc65a'].map((c) => <span key={c} style={{ width: 13, height: 13, borderRadius: 7, background: c }} />)}
        <span style={{ flex: 1, textAlign: 'center', color: '#cccccc', fontFamily: FUENTE.marca, fontSize: letra * 0.7, fontWeight: 500, marginRight: 50 }}>{archivo} — lumbre-web — Visual Studio Code</span>
      </div>
      <div style={{ flex: 1, display: 'flex', minHeight: 0 }}>
        {/* barra de actividad */}
        <div style={{ width: actividad, background: C.actividad, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 22, paddingTop: 16, flexShrink: 0 }}>
          {['M5 4 h9 l5 5 v11 h-14 Z M14 4 v5 h5', 'M10.5 4 a6.5 6.5 0 1 0 0.01 0 M15.5 15.5 L21 21', 'M7 4 v10 M7 18 a2 2 0 1 0 0.01 0 M17 6 a2 2 0 1 0 0.01 0 M17 8 c0 5 -10 3 -10 8', 'M5 4 l14 8 l-14 8 Z', 'M4 4 h7 v7 h-7 Z M13 13 h7 v7 h-7 Z M4 13 h7 v7 h-7 Z M15 3 l5 5 l-5 5 l-5 -5 Z'].map((d, i) => (
            <svg key={i} width={28} height={28} viewBox="0 0 24 24" fill="none" stroke={i === 0 ? '#fff' : '#858585'} strokeWidth={1.6} strokeLinejoin="round" strokeLinecap="round"><path d={d} /></svg>
          ))}
        </div>
        {/* explorador */}
        <div style={{ width: lateral, background: C.lateral, flexShrink: 0, overflow: 'hidden' }}>
          <div style={{ padding: '12px 18px 8px', color: '#bbbbbb', fontFamily: FUENTE.marca, fontSize: letra * 0.58, fontWeight: 600, letterSpacing: '.08em' }}>EXPLORADOR</div>
          <div style={{ padding: '4px 10px', color: '#cccccc', fontFamily: FUENTE.marca, fontSize: letra * 0.62, fontWeight: 800, letterSpacing: '.03em' }}>▾ LUMBRE-WEB</div>
          {ARBOL.slice(0, Math.ceil(arbolVisible)).map((nodo, i) => {
            const act = nodo.nombre === archivo || nodo.nombre === resaltarArbol;
            const nuevo = i === Math.ceil(arbolVisible) - 1 && arbolVisible < ARBOL.length;
            return (
              <div key={i} style={{ height: letra * 1.42, display: 'flex', alignItems: 'center', gap: 5, paddingLeft: 14 + nodo.nivel * 15, background: act ? C.seleccion : nuevo ? '#094771' : 'transparent', color: act ? '#fff' : '#cccccc', fontFamily: FUENTE.marca, fontSize: letra * 0.74, fontWeight: 500, whiteSpace: 'nowrap' }}>
                <IconoArchivo tipo={nodo.tipo} carpeta={nodo.carpeta} tam={letra * 0.95} />
                {nodo.nombre}
              </div>
            );
          })}
        </div>
        {editor}
        {/* vista previa al costado */}
        {vista && division === 'derecha' ? (
          <div style={{ width: Math.round((ancho - actividad - lateral) * proporcionVista), borderLeft: '1px solid #3c3c3c', display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
            <div style={{ height: altoPestanas, background: C.pestanas, display: 'flex', alignItems: 'center', padding: '0 14px', color: '#cccccc', fontFamily: FUENTE.marca, fontSize: letra * 0.72, fontWeight: 600, gap: 8, flexShrink: 0 }}>
              <span style={{ color: '#75beff' }}>◧</span> {tituloVista}
            </div>
            <div style={{ flex: 1, position: 'relative', overflow: 'hidden', background: '#fff' }}>{vista}</div>
          </div>
        ) : null}
      </div>
      {/* barra de estado */}
      <div style={{ height: estado, background: C.estado, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 14px', color: '#fff', fontFamily: FUENTE.marca, fontSize: letra * 0.62, fontWeight: 500, flexShrink: 0 }}>
        <span>⎇ main &nbsp;&nbsp; ⟳ &nbsp;&nbsp; ⓧ 0 &nbsp;⚠ 0</span>
        <span>Lín. {lineas.length}, col. {lineas[lineas.length - 1].length + 1} &nbsp;&nbsp; Espacios: 2 &nbsp;&nbsp; UTF-8 &nbsp;&nbsp; {lenguaje === 'js' ? 'JavaScript' : lenguaje.toUpperCase()} &nbsp;&nbsp; ✓ Prettier</span>
      </div>
    </div>
  );
};
