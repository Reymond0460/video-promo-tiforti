// Marcos de dispositivos e interfaz genérica: celular, ventana de navegador, cursor, fondos.
import React from 'react';
import { AbsoluteFill } from 'remotion';
import { FUENTE, TIFORTI } from '../tema';
import { azar, deriva } from '../util';

export const PANTALLA = { w: 390, h: 844 }; // tamaño lógico de la pantalla del celular
const MARCO = 13;

/** Celular. `ancho` = ancho total en px del video; el contenido se diseña a 390 x 844. */
export const Telefono: React.FC<{
  ancho: number;
  children: React.ReactNode;
  style?: React.CSSProperties;
  barraOscura?: boolean; // texto de la barra de estado en oscuro (para fondos claros)
  hora?: string;
  sombra?: boolean;
}> = ({ ancho, children, style, barraOscura = true, hora = '19:42', sombra = true }) => {
  const total = PANTALLA.w + MARCO * 2;
  const k = ancho / total;
  const tinta = barraOscura ? '#0b1220' : '#fff';
  return (
    <div style={{ width: ancho, height: (PANTALLA.h + MARCO * 2) * k, position: 'relative', ...style }}>
      <div
        style={{
          width: total, height: PANTALLA.h + MARCO * 2, transform: `scale(${k})`, transformOrigin: '0 0', position: 'absolute',
          borderRadius: 58, background: 'linear-gradient(145deg,#2b3140,#0c0f17)', padding: MARCO, boxSizing: 'border-box',
          boxShadow: sombra ? '0 50px 90px rgba(5,10,30,.45), 0 0 0 2px #454c5c inset' : '0 0 0 2px #454c5c inset',
        }}
      >
        <div style={{ width: PANTALLA.w, height: PANTALLA.h, borderRadius: 46, overflow: 'hidden', position: 'relative', background: '#fff' }}>
          {children}
          {/* barra de estado */}
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 46, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 30px 0', boxSizing: 'border-box', fontFamily: FUENTE.marca, fontWeight: 700, fontSize: 15, color: tinta }}>
            <span>{hora}</span>
            <span style={{ display: 'flex', gap: 5, alignItems: 'center' }}>
              <svg width="18" height="12" viewBox="0 0 18 12">{[0, 1, 2, 3].map((i) => <rect key={i} x={i * 4.6} y={9 - i * 3} width={3.2} height={3 + i * 3} rx={1} fill={tinta} />)}</svg>
              <svg width="26" height="12" viewBox="0 0 26 12"><rect x={0.5} y={0.5} width={22} height={11} rx={3.5} fill="none" stroke={tinta} opacity={0.5} /><rect x={2} y={2} width={16} height={8} rx={2} fill={tinta} /><rect x={23.5} y={4} width={2} height={4} rx={1} fill={tinta} opacity={0.5} /></svg>
            </span>
          </div>
          <div style={{ position: 'absolute', top: 11, left: '50%', marginLeft: -52, width: 104, height: 30, borderRadius: 16, background: '#05070c' }} />
        </div>
      </div>
    </div>
  );
};

/** Ventana de navegador. El contenido se diseña a `anchoLogico` px y se escala al ancho de la ventana. */
export const Navegador: React.FC<{
  ancho: number;
  alto: number;
  url: string;
  anchoLogico?: number;
  children: React.ReactNode;
  style?: React.CSSProperties;
  candado?: boolean;
}> = ({ ancho, alto, url, anchoLogico = 1280, children, style, candado = true }) => {
  const k = ancho / anchoLogico;
  const barra = 54;
  return (
    <div style={{ width: ancho, height: alto, borderRadius: 18 * Math.max(0.7, k * 1.4), overflow: 'hidden', background: '#fff', boxShadow: '0 40px 80px rgba(8,16,40,.35), 0 0 0 1px rgba(16,32,59,.12)', position: 'relative', ...style }}>
      <div style={{ width: anchoLogico, transform: `scale(${k})`, transformOrigin: '0 0', position: 'absolute', top: 0, left: 0 }}>
        <div style={{ height: barra, background: '#eef1f5', display: 'flex', alignItems: 'center', gap: 9, padding: '0 20px', borderBottom: '1px solid #dfe4ea' }}>
          {['#f26b5e', '#f5be4f', '#5bc65a'].map((c) => <span key={c} style={{ width: 14, height: 14, borderRadius: 7, background: c }} />)}
          <div style={{ marginLeft: 22, flex: 1, maxWidth: 640, height: 32, borderRadius: 16, background: '#fff', display: 'flex', alignItems: 'center', gap: 8, padding: '0 16px', fontFamily: FUENTE.marca, fontSize: 16, fontWeight: 600, color: '#4a566b' }}>
            {candado ? <svg width="12" height="14" viewBox="0 0 12 14"><rect x={1} y={6} width={10} height={8} rx={2} fill="#7b879a" /><path d="M3 6 V4 a3 3 0 0 1 6 0 V6" fill="none" stroke="#7b879a" strokeWidth={1.8} /></svg> : null}
            {url}
          </div>
        </div>
        <div style={{ position: 'relative', height: alto / k - barra, overflow: 'hidden' }}>{children}</div>
      </div>
    </div>
  );
};

/** Cursor de mouse. `clic` 0..1 dibuja la onda del clic. */
export const Cursor: React.FC<{ x: number; y: number; clic?: number; escala?: number }> = ({ x, y, clic = 0, escala = 1 }) => (
  <div style={{ position: 'absolute', left: x, top: y, transform: `scale(${escala})`, transformOrigin: '0 0', zIndex: 50 }}>
    {clic > 0 && clic < 1 ? <div style={{ position: 'absolute', left: -30, top: -30, width: 60, height: 60, borderRadius: 30, border: `4px solid ${TIFORTI.azul}`, opacity: 1 - clic, transform: `scale(${0.3 + clic})` }} /> : null}
    <svg width="34" height="44" viewBox="0 0 34 44" style={{ filter: 'drop-shadow(0 3px 4px rgba(0,0,0,.35))', transform: `scale(${1 - 0.12 * Math.sin(Math.PI * Math.min(1, clic * 2.5))})`, transformOrigin: '0 0' }}>
      <path d="M2 2 L2 34 L11 26 L17 41 L23 38.5 L17 24 L29 24 Z" fill="#fff" stroke="#10203b" strokeWidth={2.4} strokeLinejoin="round" />
    </svg>
  </div>
);

/** Toque con el dedo sobre una pantalla táctil. */
export const Toque: React.FC<{ x: number; y: number; t: number; color?: string }> = ({ x, y, t, color = '#fff' }) =>
  t > 0 && t < 1 ? (
    <div style={{ position: 'absolute', left: x - 40, top: y - 40, width: 80, height: 80, borderRadius: 40, background: color, opacity: 0.55 * (1 - t), transform: `scale(${0.4 + t * 0.9})`, zIndex: 40 }} />
  ) : null;

/** Fondo cálido desenfocado (las luces del taller fuera de foco). */
export const FondoTaller: React.FC<{ frame: number; tono?: number }> = ({ frame, tono = 1 }) => (
  <AbsoluteFill style={{ background: `linear-gradient(170deg, #5a3e2d 0%, #7d5437 45%, #3f2a1f 100%)`, overflow: 'hidden' }}>
    {Array.from({ length: 16 }, (_, i) => {
      const x = azar(i) * 100;
      const y = azar(i + 50) * 100;
      const r = 110 + azar(i + 20) * 240;
      return (
        <div key={i} style={{ position: 'absolute', left: `${x + deriva(frame, i, 0.6) * 1.5}%`, top: `${y + deriva(frame, i + 4, 0.5) * 1.2}%`, width: r, height: r, marginLeft: -r / 2, marginTop: -r / 2, borderRadius: '50%', background: i % 3 ? '#ffc977' : '#ffe2a8', opacity: (0.1 + azar(i + 9) * 0.14) * tono * (0.85 + 0.15 * Math.sin(frame / 20 + i)), filter: 'blur(14px)' }} />
      );
    })}
    <AbsoluteFill style={{ background: 'radial-gradient(ellipse at 50% 45%, rgba(0,0,0,0) 40%, rgba(20,8,2,.55) 100%)' }} />
  </AbsoluteFill>
);

/** Fondo de marca TiforTi: azul noche con luz cian y líneas tecnológicas muy sutiles. */
export const FondoMarca: React.FC<{ frame: number; lineas?: number; claro?: boolean }> = ({ frame, lineas = 1, claro = false }) => {
  if (claro) {
    return (
      <AbsoluteFill style={{ background: 'linear-gradient(125deg,#ffffff 10%,#f4f8fe 60%,#e6f0ff 100%)', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', right: '-18%', top: '-8%', width: '70%', aspectRatio: '1', borderRadius: '50%', background: 'radial-gradient(circle,#d6e6ff 0%,rgba(214,230,255,0) 68%)' }} />
        <div style={{ position: 'absolute', left: '-25%', bottom: '-12%', width: '70%', aspectRatio: '1', borderRadius: '50%', background: 'radial-gradient(circle,#dff6fb 0%,rgba(223,246,251,0) 68%)' }} />
      </AbsoluteFill>
    );
  }
  return (
    <AbsoluteFill style={{ background: `linear-gradient(160deg, ${TIFORTI.nocheMedia} 0%, ${TIFORTI.noche} 55%, #040b20 100%)`, overflow: 'hidden' }}>
      <div style={{ position: 'absolute', left: `${50 + deriva(frame, 1, 0.5) * 6}%`, top: `${38 + deriva(frame, 2, 0.5) * 4}%`, width: '120%', aspectRatio: '1', transform: 'translate(-50%,-50%)', borderRadius: '50%', background: 'radial-gradient(circle, rgba(34,211,238,.20) 0%, rgba(21,86,215,.12) 35%, rgba(6,18,48,0) 65%)' }} />
      <svg width="100%" height="100%" style={{ position: 'absolute', inset: 0, opacity: 0.55 * lineas }} preserveAspectRatio="none" viewBox="0 0 100 100">
        {Array.from({ length: 7 }, (_, i) => {
          const y = 12 + i * 13 + deriva(frame, i, 0.4) * 1.5;
          const fase = ((frame * 0.35 + i * 37) % 160) - 30;
          return (
            <g key={i}>
              <line x1={0} y1={y} x2={100} y2={y + (i % 2 ? 6 : -5)} stroke="#22d3ee" strokeWidth={0.06} opacity={0.35} vectorEffect="non-scaling-stroke" />
              <circle cx={fase} cy={y + (i % 2 ? 6 : -5) * (fase / 100)} r={0.35} fill="#7de3f7" opacity={0.8} />
            </g>
          );
        })}
      </svg>
      <AbsoluteFill style={{ background: 'radial-gradient(ellipse at 50% 50%, rgba(0,0,0,0) 45%, rgba(2,6,20,.6) 100%)' }} />
    </AbsoluteFill>
  );
};

/** Iconos de línea simples (24 x 24). */
export const Icono: React.FC<{ n: 'corazon' | 'comentario' | 'enviar' | 'guardar' | 'mic' | 'camara' | 'colgar' | 'pantalla' | 'check' | 'whatsapp' | 'carro' | 'menu' | 'buscar' | 'flecha'; tam?: number; color?: string; grosor?: number; relleno?: string }> = ({ n, tam = 24, color = '#10203b', grosor = 2, relleno = 'none' }) => {
  const d: Record<string, React.ReactNode> = {
    corazon: <path d="M12 20 C4 14 3 10 3 8 a4.5 4.5 0 0 1 9 -1 a4.5 4.5 0 0 1 9 1 c0 2 -1 6 -9 12 Z" />,
    comentario: <path d="M4 5 h16 v11 h-9 l-5 4 v-4 h-2 Z" />,
    enviar: <path d="M3 11 L21 3 L14 21 L11 13 Z M11 13 L21 3" />,
    guardar: <path d="M6 3 h12 v18 l-6 -5 l-6 5 Z" />,
    mic: <g><rect x={9} y={3} width={6} height={11} rx={3} /><path d="M5 11 a7 7 0 0 0 14 0 M12 18 v3" /></g>,
    camara: <g><rect x={3} y={6} width={13} height={12} rx={2.5} /><path d="M16 10 l5 -3 v10 l-5 -3 Z" /></g>,
    colgar: <path d="M3 13 c5 -6 13 -6 18 0 l-3 3 l-3.5 -2 v-2.5 c-2 -.6 -3 -.6 -5 0 v2.5 l-3.5 2 Z" />,
    pantalla: <g><rect x={3} y={4} width={18} height={12} rx={2} /><path d="M8 20 h8 M12 16 v4" /></g>,
    check: <path d="M5 12.5 l4.5 4.5 L19 7" />,
    whatsapp: <g><path d="M4 20 l1.4 -4.2 A8 8 0 1 1 8.4 18.7 Z" /><path d="M9 8.5 c0 3 2.5 5.8 5.6 6.2 l1.2 -1.4 l-1.8 -1 l-.9 .8 c-.9 -.4 -1.8 -1.3 -2.2 -2.2 l.8 -.9 l-1 -1.8 Z" fill={color} stroke="none" /></g>,
    carro: <g><path d="M3 4 h2.5 l2.2 10 h9.6 l1.9 -7 H7" /><circle cx={9} cy={18.5} r={1.4} /><circle cx={16} cy={18.5} r={1.4} /></g>,
    menu: <path d="M4 7 h16 M4 12 h16 M4 17 h16" />,
    buscar: <g><circle cx={11} cy={11} r={6} /><path d="M16 16 l4.5 4.5" /></g>,
    flecha: <path d="M5 12 h14 M13 6 l6 6 l-6 6" />,
  };
  return (
    <svg width={tam} height={tam} viewBox="0 0 24 24" fill={relleno} stroke={color} strokeWidth={grosor} strokeLinecap="round" strokeLinejoin="round" style={{ display: 'block', flexShrink: 0 }}>
      {d[n]}
    </svg>
  );
};
