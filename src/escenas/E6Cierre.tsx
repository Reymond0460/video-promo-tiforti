// ESCENA 6 — Cierre: de la página de Camila a muchas otras ideas, y la marca TiforTi.
import React from 'react';
import { AbsoluteFill, Img, staticFile, useCurrentFrame } from 'remotion';
import { FondoMarca } from '../componentes/Dispositivos';
import { SitioLumbre } from '../componentes/SitioLumbre';
import { useFormato } from '../componentes/Textos';
import { FUENTE, TIFORTI } from '../tema';
import { fr, limitar, mezclar, st } from '../util';

// Demos reales publicadas en tiforti.cl (sección "Proyectos y demos").
const DEMOS = ['huellitas', 'studiobarber', 'evento', 'pasteleria', 'cabanas', 'profesional', 'joyeria', 'gimnasio', 'aseo', 'sushi', 'taller', 'arriendos', 'picada', 'modelux'];

/** 6A · La página de Lumbre es una entre muchas ideas: distintos rubros, distintos tamaños. */
export const T6Mosaico: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const { w, h, vertical } = useFormato();
  const f = (frame / dur) * 136;
  const cols = vertical ? 3 : 5;
  const filas = vertical ? 8 : 5;
  const cw = vertical ? 330 : 350;
  const ch = cw * 0.625;
  const gap = 24;
  const anchoTotal = cols * cw + (cols - 1) * gap;
  const colCentro = Math.floor(cols / 2);
  const filaCentro = vertical ? 3 : 2;
  const zoom = mezclar(vertical ? 2.9 : 2.6, 1, st(f, 0, 56));
  const cy0 = h * (vertical ? 0.44 : 0.5);
  let n = 0;
  return (
    <AbsoluteFill style={{ background: TIFORTI.noche, overflow: 'hidden' }}>
      <div style={{ position: 'absolute', left: 0, top: 0, width: w, height: h, transform: `scale(${zoom})`, transformOrigin: `50% ${cy0}px` }}>
        {Array.from({ length: cols }, (_, c) => {
          const dir = c % 2 ? 1 : -1;
          const corre = c === colCentro ? 0 : dir * (frame * 0.9 + 40);
          return (
            <div key={c} style={{ position: 'absolute', left: (w - anchoTotal) / 2 + c * (cw + gap), top: cy0 - ch / 2 - filaCentro * (ch + gap) + corre }}>
              {Array.from({ length: filas }, (_, r) => {
                const esLumbre = c === colCentro && r === filaCentro;
                const img = esLumbre ? '' : DEMOS[n++ % DEMOS.length];
                return (
                  <div key={r} style={{ width: cw, height: ch, marginBottom: gap, borderRadius: 16, overflow: 'hidden', background: '#fff', boxShadow: esLumbre ? `0 0 0 ${4 / zoom + 2}px ${TIFORTI.cian}, 0 20px 50px rgba(0,0,0,.5)` : '0 16px 40px rgba(0,0,0,.45)', position: 'relative' }}>
                    {esLumbre ? (
                      <div style={{ transform: `scale(${cw / 1280})`, transformOrigin: '0 0', width: 1280 }}><SitioLumbre frame={frame} /></div>
                    ) : (
                      <Img src={staticFile(`tiforti/proyectos/${img}-desktop.webp`)} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top', display: 'block' }} />
                    )}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
      <AbsoluteFill style={{ background: `linear-gradient(180deg, rgba(6,18,48,.92) 0%, rgba(6,18,48,${0.1 + 0.25 * st(f, 40, 136)}) 22%, rgba(6,18,48,${0.1 + 0.25 * st(f, 40, 136)}) 62%, rgba(6,18,48,.95) 100%)`, opacity: st(f, 14, 50) }} />
    </AbsoluteFill>
  );
};

const Linea: React.FC<{ children: React.ReactNode; t: number; tam: number; color?: string }> = ({ children, t, tam, color = '#fff' }) => (
  <div style={{ fontFamily: FUENTE.marca, fontWeight: 800, fontSize: tam, lineHeight: 1.02, letterSpacing: '-0.04em', color, opacity: limitar(t * 1.5), transform: `translateY(${(1 - t) * 44}px)`, textShadow: '0 6px 40px rgba(34,211,238,.25)' }}>{children}</div>
);

/** 6B · "TÚ TIENES LA IDEA." — "NOSOTROS LA HACEMOS REALIDAD." */
export const T6Lema: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const { vertical } = useFormato();
  const f = (frame / dur) * 142;
  const tam = vertical ? 118 : 112;
  const b = 60;
  return (
    <AbsoluteFill>
      <FondoMarca frame={frame} />
      <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: vertical ? '0 60px 180px' : '0 120px 40px', opacity: 1 - st(f, 130, 142) }}>
        <Linea t={fr(f, 8, 26)} tam={tam}>TÚ TIENES</Linea>
        <Linea t={fr(f, 13, 31)} tam={tam}>LA IDEA.</Linea>
        <div style={{ width: mezclar(0, vertical ? 260 : 320, fr(f, b - 8, b + 14)), height: 6, borderRadius: 3, background: `linear-gradient(90deg, ${TIFORTI.cian}, ${TIFORTI.azul})`, margin: vertical ? '44px 0' : '30px 0', boxShadow: `0 0 24px ${TIFORTI.cian}` }} />
        <Linea t={fr(f, b, b + 18)} tam={tam * 0.8}>NOSOTROS LA HACEMOS</Linea>
        <Linea t={fr(f, b + 7, b + 25)} tam={tam * 1.24} color={TIFORTI.cian}>REALIDAD.</Linea>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/** 6C · Marca: logo real, nombre, bajada y dirección web visibles hasta el último fotograma. */
export const T6Marca: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const { vertical } = useFormato();
  const f = (frame / dur) * 202;
  const logo = fr(f, 6, 30);
  const k = vertical ? 1 : 0.8;
  const pulso = 1 + Math.sin(frame / 18) * 0.012;
  return (
    <AbsoluteFill>
      <FondoMarca frame={frame} />
      <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', paddingBottom: vertical ? 150 : 0 }}>
        <div style={{ transform: `scale(${k})`, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{ position: 'relative', width: 300, height: 300, opacity: limitar(logo * 1.5), transform: `scale(${(0.7 + 0.3 * logo) * pulso})` }}>
            <div style={{ position: 'absolute', inset: -120, borderRadius: '50%', background: 'radial-gradient(circle, rgba(34,211,238,.38), rgba(34,211,238,0) 62%)', opacity: 0.7 + 0.3 * Math.sin(frame / 14) }} />
            <Img src={staticFile('marca/logo-ti.png')} style={{ width: 300, height: 300, position: 'relative' }} />
          </div>
          <div style={{ fontFamily: FUENTE.marca, fontWeight: 800, fontSize: 170, letterSpacing: '-0.05em', color: '#fff', lineHeight: 1, marginTop: 34, opacity: st(f, 20, 34), transform: `translateY(${(1 - fr(f, 20, 40)) * 30}px)` }}>TiforTi</div>
          <div style={{ fontFamily: FUENTE.marca, fontWeight: 600, fontSize: 54, color: TIFORTI.cianSuave, marginTop: 14, letterSpacing: '-0.02em', opacity: st(f, 32, 46), transform: `translateY(${(1 - fr(f, 32, 50)) * 24}px)` }}>Desarrollo web a tu medida.</div>
          <div style={{ marginTop: 60, padding: '22px 60px 26px', borderRadius: 999, background: '#fff', color: TIFORTI.nocheMedia, fontFamily: FUENTE.marca, fontWeight: 800, fontSize: 84, letterSpacing: '-0.04em', lineHeight: 1, boxShadow: `0 0 0 6px rgba(34,211,238,.35), 0 20px 60px rgba(34,211,238,.35)`, opacity: limitar(fr(f, 52, 62) * 2), transform: `scale(${0.8 + 0.2 * fr(f, 52, 68)})` }}>tiforti.cl</div>
          <div style={{ fontFamily: FUENTE.marca, fontWeight: 600, fontSize: 36, color: 'rgba(255,255,255,.82)', marginTop: 44, textAlign: 'center', lineHeight: 1.3, opacity: st(f, 72, 88) }}>Tú tienes la idea.<br />Nosotros la hacemos realidad.</div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
