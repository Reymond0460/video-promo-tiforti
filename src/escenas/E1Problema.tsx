// ESCENA 1 — El problema: una emprendedora con una gran idea, pero sin presencia digital.
import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { Escenario, Pelicula, Taller } from '../componentes/Escenario';
import { CAMILA, Persona, Pose } from '../componentes/Persona';
import { FondoTaller, Telefono } from '../componentes/Dispositivos';
import { ALTO_POST, Feed } from '../componentes/Feed';
import { Titular, useFormato } from '../componentes/Textos';
import { FUENTE, LUMBRE } from '../tema';
import { claves, fr, mezclar, st, ventana } from '../util';

export const CAM = { x: 960, y: 905, escala: 1.12 };

/** Celular visto por detrás, en la mano. */
export const CelularEnMano: React.FC<{ giro?: number }> = ({ giro = -8 }) => (
  <g transform={`rotate(${giro})`}>
    <rect x={-46} y={-128} width={92} height={176} rx={17} fill="#1c2331" />
    <rect x={-46} y={-128} width={92} height={176} rx={17} fill="none" stroke="#3b4558" strokeWidth={3} />
    <rect x={-32} y={-116} width={28} height={28} rx={9} fill="#0e131d" />
    <circle cx={-18} cy={-102} r={6} fill="#2c3648" />
  </g>
);

/** Camila en su taller: la base de todas las tomas donde aparece. */
export const CamilaEnTaller: React.FC<{
  pose: Pose; tarde?: number; zoom?: number; x?: number; y?: number; notebook?: 'cerrado' | 'atras' | 'no'; extra?: React.ReactNode; velaEncendida?: boolean; mano?: number; uid?: string; pelicula?: boolean;
}> = ({ pose, tarde = 1, zoom = 1, x = 960, y = 960, notebook = 'atras', extra, velaEncendida = true, mano = 1, uid, pelicula = true }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Escenario zoom={zoom} x={x} y={y} mano={mano}>
        <Taller
          frame={frame} tarde={tarde} notebook={notebook} velaEncendida={velaEncendida} uid={uid}
          persona={<Persona a={CAMILA} frame={frame} x={CAM.x} y={CAM.y} escala={CAM.escala} pose={pose} capa="cuerpo" semilla={2} />}
          sobreMesa={<>{extra}<Persona a={CAMILA} frame={frame} x={CAM.x} y={CAM.y} escala={CAM.escala} pose={pose} capa="brazos" semilla={2} /></>}
        />
      </Escenario>
      {pelicula ? <Pelicula /> : null}
    </AbsoluteFill>
  );
};

/** 1A · Gancho: Camila en su taller, entre sus velas. "Tienes una idea." */
export const T1Escritorio: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const { vertical } = useFormato();
  const f = (frame / dur) * 106;
  const pose: Pose = {
    mirada: [claves(f, [[36, 0], [52, 0.25]]), claves(f, [[36, 0.05], [52, 0.85]])],
    boca: claves(f, [[40, 0.5], [78, 0.05]]),
    cejas: claves(f, [[40, 0.2], [80, -0.2]]),
    cabeza: claves(f, [[0, -3], [36, -2], [56, 4]]),
    cabezaY: claves(f, [[36, 0], [56, 7]]),
    manoD: [84, claves(f, [[0, 215], [40, 205], [56, 184]])],
    manoI: [-176, 262],
    objetoD: <CelularEnMano />,
    luzPantalla: claves(f, [[36, 0.1], [56, 0.6]]),
    ojosRisa: claves(f, [[40, 0.4], [70, 0]]),
  };
  const zoom = mezclar(1, 1.07, st(f, 0, 106));
  return (
    <AbsoluteFill>
      <CamilaEnTaller pose={pose} tarde={1} zoom={vertical ? zoom : zoom * 1.24} x={vertical ? 960 : 800} y={vertical ? 962 : 900} />
      <div style={vertical ? { position: 'absolute', top: 236, left: 70, right: 70, textAlign: 'center' } : { position: 'absolute', top: 210, left: 110, width: 640 }}>
        <Titular texto="Tienes una idea." desde={6} hasta={dur - 4} tam={vertical ? 116 : 112} />
      </div>
    </AbsoluteFill>
  );
};

const Etiqueta: React.FC<{ texto: string; t: number; giro?: number; style: React.CSSProperties }> = ({ texto, t, giro = -4, style }) => (
  <div style={{ position: 'absolute', ...style, opacity: Math.min(1, t * 1.6), transform: `rotate(${giro}deg) scale(${0.8 + 0.2 * fr(t, 0, 1)})`, transformOrigin: '50% 50%', zIndex: 20 }}>
    <div style={{ padding: '10px 30px 14px', background: '#fffaf0', borderRadius: 10, boxShadow: '0 14px 30px rgba(20,8,2,.4)', fontFamily: FUENTE.mano, fontWeight: 700, fontSize: 68, color: LUMBRE.terracotaOscura, whiteSpace: 'nowrap', lineHeight: 1 }}>{texto}</div>
  </div>
);

/** Pulgar que desliza la pantalla. */
export const Pulgar: React.FC<{ x: number; y: number; k: number }> = ({ x, y, k }) => (
  <div style={{ position: 'absolute', left: x, top: y, width: 150 * k, height: 420 * k, borderRadius: 80 * k, background: `linear-gradient(100deg, ${CAMILA.piel}, ${CAMILA.pielSombra})`, transform: 'rotate(-24deg)', transformOrigin: '50% 0', boxShadow: '0 10px 30px rgba(20,8,2,.35)', zIndex: 15 }}>
    <div style={{ position: 'absolute', left: 30 * k, top: 14 * k, width: 90 * k, height: 80 * k, borderRadius: `${45 * k}px ${45 * k}px ${30 * k}px ${30 * k}px`, background: '#f1c9ad', opacity: 0.85 }} />
  </div>
);

/** 1B · Busca alternativas en redes: plantillas iguales, agencias caras, cursos complicados. */
export const T1Feed: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const { w, h, vertical } = useFormato();
  const f = (frame / dur) * 136;
  const centro = (i: number) => Math.max(0, i * ALTO_POST - 117);
  const scroll = claves(f, [[0, 0], [46, 0], [58, centro(1)], [92, centro(1)], [104, centro(2)], [136, centro(2) + 14]]);
  const ancho = vertical ? 720 : 430;
  const alto = ancho * (870 / 416);
  const x0 = vertical ? (w - ancho) / 2 : w * 0.34 - ancho / 2;
  const y0 = vertical ? 236 : (h - alto) / 2 + 6;
  const flick = Math.sin(Math.PI * st(f, 44, 60)) + Math.sin(Math.PI * st(f, 90, 106));
  const k = ancho / 720;
  return (
    <AbsoluteFill>
      <FondoTaller frame={frame} />
      <Telefono ancho={ancho} style={{ position: 'absolute', left: x0, top: y0 + Math.sin(frame / 30) * 4 }}>
        <Feed scroll={scroll} />
      </Telefono>
      <Pulgar x={x0 + ancho * 0.8} y={y0 + alto * (0.7 - flick * 0.09)} k={k * 0.95} />
      <Etiqueta texto="todas iguales…" t={ventana(f, 18, 30, 44, 50)} giro={-5} style={vertical ? { left: 96, top: 1090 } : { left: w * 0.58, top: 250 }} />
      <Etiqueta texto="¿tan caro?" t={ventana(f, 64, 76, 90, 96)} giro={4} style={vertical ? { left: 470, top: 1120 } : { left: w * 0.62, top: 420 }} />
      <Etiqueta texto="muy complicado…" t={ventana(f, 110, 122, 400, 410)} giro={-3} style={vertical ? { left: 150, top: 1110 } : { left: w * 0.58, top: 590 }} />
      <Pelicula fuerza={0.6} />
    </AbsoluteFill>
  );
};

/** 1C · Deja el celular. Tiene una necesidad que todavía no logra resolver. */
export const T1Duda: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const { vertical } = useFormato();
  const f = (frame / dur) * 106;
  const pose: Pose = {
    mirada: [claves(f, [[10, 0.2], [34, 0.75], [66, 0.75], [84, 0.1]]), claves(f, [[10, 0.8], [34, 0.45], [66, 0.45], [84, 0.75]])],
    boca: claves(f, [[0, -0.1], [40, -0.42]]),
    cejas: claves(f, [[0, -0.3], [36, -0.8]]),
    cabeza: claves(f, [[0, 4], [40, 7]]),
    cabezaY: claves(f, [[0, 6], [30, 3], [50, 9]]),
    cuerpo: claves(f, [[20, 0], [44, -1.5]]),
    manoD: [claves(f, [[4, 84], [26, 150]]), claves(f, [[4, 184], [26, 268]])],
    objetoD: <CelularEnMano giro={claves(f, [[4, -8], [26, 62]])} />,
    manoI: [claves(f, [[18, -176], [42, -62]]), claves(f, [[18, 262], [42, -52]])],
    luzPantalla: claves(f, [[4, 0.6], [24, 0]]),
  };
  const zoom = mezclar(1.1, 1.2, st(f, 0, 106));
  return <CamilaEnTaller pose={pose} tarde={1} zoom={vertical ? zoom : zoom * 1.15} x={960} y={vertical ? 880 : 860} />;
};
