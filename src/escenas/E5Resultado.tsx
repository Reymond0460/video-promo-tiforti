// ESCENA 5 — El gran resultado: la idea ya es una página real. Un momento de silencio, y una sonrisa.
import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { Navegador, Telefono } from '../componentes/Dispositivos';
import { Pose } from '../componentes/Persona';
import { SitioLumbre } from '../componentes/SitioLumbre';
import { useFormato } from '../componentes/Textos';
import { FUENTE, LUMBRE, TIFORTI } from '../tema';
import { claves, fr, limitar, st } from '../util';
import { CamilaEnTaller } from './E1Problema';
import { EquipoSVG } from './E3Idea';

/** Recuadro de videollamada con el equipo de TiforTi. */
const EquipoEnLlamada: React.FC<{ style: React.CSSProperties; sonrisa?: number; habla?: number; uid: string }> = ({ style, sonrisa = 0.5, habla = 0, uid }) => {
  const frame = useCurrentFrame();
  const poseA: Pose = { boca: 0.3 + sonrisa * 0.6, ojosRisa: sonrisa * 0.7, cejas: 0.3, hablar: habla * limitar(Math.abs(Math.sin(frame * 0.4)) * 0.8) };
  const poseB: Pose = { boca: 0.4 + sonrisa * 0.55, ojosRisa: sonrisa * 0.8, cejas: 0.3, cabeza: -3 };
  return (
    <div style={{ position: 'absolute', borderRadius: 28, overflow: 'hidden', boxShadow: '0 20px 50px rgba(30,12,4,.4), 0 0 0 5px #fff', background: '#dde5ee', ...style }}>
      <svg viewBox="400 540 1120 700" width="100%" height="100%" preserveAspectRatio="xMidYMid slice" style={{ display: 'block' }}>
        <EquipoSVG frame={frame} hora={0.25} poseA={poseA} poseB={poseB} uid={uid} />
      </svg>
      <div style={{ position: 'absolute', left: 12, bottom: 10, padding: '5px 13px', borderRadius: 12, background: 'rgba(8,14,30,.72)', color: '#fff', fontFamily: FUENTE.marca, fontWeight: 700, fontSize: 22 }}>TiforTi</div>
    </div>
  );
};

/** 5A · El equipo le presenta su página. Camila espera, con las manos juntas. */
export const T5Presentacion: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const { vertical } = useFormato();
  const f = (frame / dur) * 97;
  const pose: Pose = {
    mirada: [claves(f, [[0, 0.5], [40, 0.5], [56, -0.55]]), claves(f, [[0, -0.2], [40, -0.2], [56, 0.5]])],
    cejas: claves(f, [[0, 0.3], [60, 0.6]]),
    boca: claves(f, [[0, 0.4], [60, 0.25]]),
    ojos: claves(f, [[60, 1], [80, 1.15]]),
    cabeza: claves(f, [[40, 3], [58, -5]]),
    manoD: [44, 214 + Math.sin(frame / 14) * 3], manoI: [-40, 222],
    luzPantalla: st(f, 60, 90) * 0.9,
  };
  return (
    <AbsoluteFill>
      <CamilaEnTaller pose={pose} tarde={0.12} velaEncendida={false} zoom={vertical ? 1.06 : 1.26} x={vertical ? 960 : 820} y={vertical ? 930 : 880} />
      <EquipoEnLlamada uid="p5" habla={1 - st(f, 44, 54)} style={vertical ? { left: 560, top: 236, width: 480, height: 320, opacity: st(f, 0, 10) } : { left: 80, top: 100, width: 540, height: 350, opacity: st(f, 0, 10) }} />
      <div style={{ position: 'absolute', ...(vertical ? { left: 50, top: 300, width: 480 } : { left: 80, top: 480, width: 540 }), opacity: st(f, 8, 18) * (1 - st(f, 62, 74)), transform: `translateY(${(1 - fr(f, 8, 22)) * 20}px)` }}>
        <div style={{ padding: '22px 28px', borderRadius: vertical ? '30px 30px 8px 30px' : '8px 30px 30px 30px', background: '#fff', boxShadow: '0 16px 40px rgba(30,12,4,.3)', fontFamily: FUENTE.marca, fontWeight: 700, fontSize: 38, lineHeight: 1.2, color: TIFORTI.navy, letterSpacing: '-0.02em' }}>
          Camila, te presentamos tu página.
        </div>
      </div>
    </AbsoluteFill>
  );
};

/** 5B · Recorrido por la página terminada, en escritorio y en celular. Sin narración: la imagen habla sola. */
export const T5Recorrido: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const { vertical } = useFormato();
  const f = (frame / dur) * 100;
  const nav = vertical ? { left: 40, top: 246, ancho: 1000, alto: 660 } : { left: 80, top: 106, ancho: 1210, alto: 868 };
  const tel = vertical ? { left: 430, top: 560, ancho: 600 } : { left: 1400, top: 120, ancho: 400 };
  const scrollNav = vertical ? claves(f, [[10, 0], [60, 330]]) : claves(f, [[8, 0], [50, 600], [64, 600], [98, 850]]);
  const scrollTel = claves(f, [[36, 0], [62, 470], [72, 470], [98, 1000]]);
  const entraTel = fr(f, vertical ? 22 : 10, vertical ? 44 : 30);
  return (
    <AbsoluteFill style={{ background: `linear-gradient(160deg, ${LUMBRE.crema} 0%, #efd9c0 60%, #e2bd9a 100%)` }}>
      <div style={{ position: 'absolute', right: '-20%', top: '-10%', width: '80%', aspectRatio: '1', borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,255,255,.7), rgba(255,255,255,0) 65%)' }} />
      <Navegador ancho={nav.ancho} alto={nav.alto} url="lumbre-web.web.app" style={{ position: 'absolute', left: nav.left, top: nav.top, opacity: st(f, 0, 10), transform: `scale(${0.96 + 0.04 * fr(f, 0, 20)})` }}>
        <div style={{ position: 'absolute', top: -scrollNav, left: 0 }}><SitioLumbre frame={frame} /></div>
      </Navegador>
      <Telefono ancho={tel.ancho} style={{ position: 'absolute', left: tel.left, top: tel.top + (1 - entraTel) * 500, opacity: limitar(entraTel * 3) }}>
        <div style={{ position: 'absolute', top: -scrollTel, left: 0 }}><SitioLumbre movil frame={frame} /></div>
      </Telefono>
    </AbsoluteFill>
  );
};

/** 5C · Primero silencio. Después, una sonrisa pequeña y genuina. "¡Qué bonita quedó!" */
export const T5Reaccion: React.FC<{ dur: number; pronto?: boolean }> = ({ dur, pronto }) => {
  const frame = useCurrentFrame();
  const { vertical } = useFormato();
  const f = (frame / dur) * 100;
  const q = pronto ? 30 : 52; // cuándo habla
  const s = pronto ? 12 : 30; // cuándo empieza a sonreír
  const habla = (st(f, q + 4, q + 8) - st(f, q + 30, q + 36)) * limitar(Math.abs(Math.sin(frame * 0.43)) * 0.8 + 0.1);
  const pose: Pose = {
    mirada: [claves(f, [[0, -0.6], [s - 6, -0.35], [s + 6, -0.55], [q + 34, -0.5], [q + 44, 0.45]]), claves(f, [[0, 0.5], [s, 0.6], [q + 34, 0.5], [q + 44, -0.1]])],
    ojos: claves(f, [[0, 1.2], [s + 10, 1]]),
    cejas: claves(f, [[0, 0.5], [s + 20, 0.35]]),
    boca: claves(f, [[s, 0.05], [s + 22, 0.8]]),
    ojosRisa: claves(f, [[s + 4, 0], [s + 24, 0.6]]),
    hablar: habla,
    cabeza: claves(f, [[0, -5], [s + 20, -2], [q + 34, -2], [q + 46, 3]]),
    cabezaY: claves(f, [[s, 0], [s + 16, 4], [s + 30, 0]]),
    manoD: [claves(f, [[s + 4, 60], [s + 22, 16]]), claves(f, [[s + 4, 262], [s + 22, 128]])],
    manoI: [-176, 262],
    luzPantalla: 0.8,
  };
  const cita = fr(f, q, q + 10);
  return (
    <AbsoluteFill>
      <CamilaEnTaller pose={pose} tarde={0.12} velaEncendida={false} zoom={vertical ? 1.3 : 1.5} x={vertical ? 960 : 780} y={vertical ? 840 : 820} mano={0.7} />
      <div style={{ position: 'absolute', ...(vertical ? { left: 60, top: 232, width: 960 } : { left: 90, top: 120, width: 760 }), opacity: limitar(cita * 1.6), transform: `translateY(${(1 - cita) * 30}px) scale(${0.96 + 0.04 * cita})`, transformOrigin: '70% 100%' }}>
        <div style={{ padding: vertical ? '30px 40px 34px' : '26px 34px 30px', borderRadius: '40px 40px 40px 10px', background: '#fff', boxShadow: '0 20px 50px rgba(30,12,4,.32)', fontFamily: FUENTE.marca }}>
          <div style={{ fontSize: vertical ? 64 : 52, fontWeight: 800, lineHeight: 1.12, letterSpacing: '-0.035em', color: LUMBRE.cafe }}>“¡Qué bonita quedó! <span style={{ color: LUMBRE.terracota }}>Es justo lo que tenía en mente.</span>”</div>
          <div style={{ fontSize: vertical ? 28 : 24, fontWeight: 600, color: LUMBRE.cafeSuave, marginTop: 10 }}>Camila · Lumbre</div>
        </div>
      </div>
      <EquipoEnLlamada uid="r5" sonrisa={st(f, s + 16, s + 34)} style={vertical ? { left: 50, top: 1090, width: 400, height: 270, opacity: st(f, 0, 10) } : { left: 90, top: 640, width: 470, height: 300, opacity: st(f, 0, 10) }} />
    </AbsoluteFill>
  );
};
export const T5ReaccionPronto: React.FC<{ dur: number }> = ({ dur }) => <T5Reaccion dur={dur} pronto />;

/** Celular de frente, en la mano, con su página abierta. */
const CelularConSitio: React.FC<{ frame: number }> = ({ frame }) => (
  <g transform="rotate(7) translate(0 -150)">
    <rect x={-86} y={-176} width={172} height={352} rx={28} fill="#1c2331" />
    <rect x={-86} y={-176} width={172} height={352} rx={28} fill="none" stroke="#49556b" strokeWidth={3} />
    <foreignObject x={-76} y={-166} width={152} height={332} style={{ borderRadius: 20, overflow: 'hidden' }}>
      <div style={{ width: 152, height: 332, borderRadius: 20, overflow: 'hidden', background: LUMBRE.crema }}>
        <div style={{ transform: `scale(${152 / 390})`, transformOrigin: '0 0', width: 390, marginTop: -14 }}><SitioLumbre movil frame={frame} /></div>
      </div>
    </foreignObject>
    <circle cx={30} cy={-250} r={120} fill="url(#brilloPantalla)" opacity={0.0} />
  </g>
);

const Mensaje: React.FC<{ texto: string; t: number; mio?: boolean; corazon?: boolean; style: React.CSSProperties }> = ({ texto, t, mio, corazon, style }) => (
  <div style={{ position: 'absolute', ...style, opacity: limitar(t * 1.6), transform: `translateY(${(1 - t) * 26}px) scale(${0.9 + 0.1 * t})`, transformOrigin: mio ? '100% 100%' : '0 100%' }}>
    <div style={{ padding: '18px 28px', borderRadius: mio ? '30px 30px 8px 30px' : '30px 30px 30px 8px', background: mio ? LUMBRE.terracota : '#fff', color: mio ? '#fff' : LUMBRE.cafe, fontFamily: FUENTE.marca, fontWeight: 700, fontSize: 38, letterSpacing: '-0.02em', boxShadow: '0 14px 34px rgba(30,12,4,.28)', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: 12 }}>
      {texto}
      {corazon ? <svg width={36} height={36} viewBox="0 0 24 24"><path d="M12 20 C4 14 3 10 3 8 a4.5 4.5 0 0 1 9 -1 a4.5 4.5 0 0 1 9 1 c0 2 -1 6 -9 12 Z" fill="#e0245e" /></svg> : null}
    </div>
  </div>
);

/** 5D · La usa desde su celular y la comparte con orgullo. */
export const T5Compartir: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const { vertical } = useFormato();
  const f = (frame / dur) * 118;
  const sube = st(f, 0, 22);
  const pose: Pose = {
    boca: 0.85, ojosRisa: 0.65, cejas: 0.4, cabeza: claves(f, [[0, 4], [30, -3]]), mirada: [claves(f, [[0, 0.5], [26, 0]]), claves(f, [[0, 0.3], [26, 0]])],
    manoD: [168, 250 - sube * 150 + Math.sin(frame / 16) * 3],
    objetoD: <CelularConSitio frame={frame} />,
    manoI: [-176, 262],
  };
  const m = vertical
    ? [{ right: 50, top: 240 }, { left: 50, top: 356 }, { left: 50, top: 472 }]
    : [{ left: 90, top: 150 }, { left: 90, top: 270 }, { left: 90, top: 390 }];
  return (
    <AbsoluteFill>
      <CamilaEnTaller pose={pose} tarde={0.12} velaEncendida={false} zoom={vertical ? 1.12 : 1.26} x={vertical ? 990 : 800} y={vertical ? 900 : 880} />
      <Mensaje mio texto="¡Lumbre ya tiene página web!" t={fr(f, 16, 28)} style={m[0]} />
      <Mensaje texto="¡Quedó preciosa!" corazon t={fr(f, 46, 58)} style={m[1]} />
      <Mensaje texto="Ya hice mi primer pedido" t={fr(f, 70, 82)} style={m[2]} />
    </AbsoluteFill>
  );
};
