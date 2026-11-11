// Textos en pantalla y piezas de interfaz compartidas entre escenas.
import React from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import { FUENTE, TIFORTI } from '../tema';
import { fr, limitar, st } from '../util';

/** Datos del formato actual. Las tomas se diseñan para vertical (1080x1920) y horizontal (1920x1080). */
export const useFormato = () => {
  const { width, height } = useVideoConfig();
  const vertical = height > width;
  return { w: width, h: height, vertical };
};

/** Titular grande que entra palabra por palabra. */
export const Titular: React.FC<{ texto: string; desde?: number; hasta?: number; tam?: number; color?: string; style?: React.CSSProperties; sombra?: boolean; paso?: number }> = ({
  texto, desde = 0, hasta = 99999, tam = 100, color = '#fff', style, sombra = true, paso = 5,
}) => {
  const frame = useCurrentFrame();
  const sale = 1 - st(frame, hasta - 12, hasta);
  return (
    <div style={{ fontFamily: FUENTE.marca, fontWeight: 800, fontSize: tam, lineHeight: 1.04, letterSpacing: '-0.04em', color, textShadow: sombra ? '0 4px 30px rgba(30,12,4,.55), 0 2px 6px rgba(30,12,4,.45)' : 'none', opacity: sale, ...style }}>
      {texto.split(' ').map((p, i) => {
        const t = fr(frame, desde + i * paso, desde + i * paso + 14);
        return (
          <span key={i} style={{ display: 'inline-block', marginRight: '0.24em', opacity: t, transform: `translateY(${(1 - t) * 40}px)` }}>{p}</span>
        );
      })}
    </div>
  );
};

/** Etiqueta redondeada. */
export const Chip: React.FC<{ children: React.ReactNode; fondo?: string; color?: string; tam?: number; style?: React.CSSProperties }> = ({ children, fondo = TIFORTI.palido, color = TIFORTI.azul, tam = 26, style }) => (
  <span style={{ display: 'inline-flex', alignItems: 'center', gap: tam * 0.4, padding: `${tam * 0.42}px ${tam * 0.85}px`, borderRadius: 999, background: fondo, color, fontFamily: FUENTE.marca, fontWeight: 700, fontSize: tam, whiteSpace: 'nowrap', lineHeight: 1.1, ...style }}>{children}</span>
);

const ETAPAS = ['Planificación y diseño', 'Estructura y programación', 'Estructura y programación', 'Integración y funcionalidades', 'Integración y funcionalidades', 'Pruebas y optimización', 'Preparación para la entrega'];

/** Calendario discreto de la semana de trabajo. `dia` puede ser fraccionario (2.5 = pasando del día 2 al 3). */
export const CintaDias: React.FC<{ dia: number; entrada?: number }> = ({ dia, entrada = 1 }) => {
  const { w, vertical } = useFormato();
  const actual = Math.min(7, Math.max(1, Math.floor(dia)));
  const k = vertical ? 1 : 0.86;
  return (
    <div style={{ position: 'absolute', left: 0, width: w, top: vertical ? 196 : 34, display: 'flex', justifyContent: 'center', opacity: entrada, transform: `translateY(${(1 - entrada) * -30}px)`, zIndex: 30 }}>
      <div style={{ transform: `scale(${k})`, transformOrigin: '50% 0', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 18px', borderRadius: 999, background: 'rgba(6,18,48,.86)', boxShadow: '0 12px 30px rgba(3,8,24,.35), 0 0 0 1.5px rgba(125,227,247,.28)' }}>
          {[1, 2, 3, 4, 5, 6, 7].map((d) => {
            const hecho = d < actual;
            const hoy = d === actual;
            return (
              <div key={d} style={{ minWidth: hoy ? 138 : 58, height: 58, borderRadius: 29, display: 'flex', alignItems: 'center', justifyContent: 'center', background: hoy ? TIFORTI.cian : hecho ? 'rgba(34,211,238,.22)' : 'rgba(255,255,255,.08)', color: hoy ? TIFORTI.noche : hecho ? TIFORTI.cianSuave : 'rgba(255,255,255,.5)', fontFamily: FUENTE.marca, fontWeight: 800, fontSize: hoy ? 30 : 26 }}>
                {hoy ? `Día ${d}` : hecho ? '✓' : d}
              </div>
            );
          })}
        </div>
        <div style={{ padding: '8px 22px', borderRadius: 999, background: 'rgba(255,255,255,.94)', color: TIFORTI.navy, fontFamily: FUENTE.marca, fontWeight: 700, fontSize: 30, boxShadow: '0 8px 20px rgba(3,8,24,.25)' }}>{ETAPAS[actual - 1]}</div>
      </div>
    </div>
  );
};

/** Aclaración discreta: la semana es un ejemplo, no una promesa de plazo. */
export const NotaPlazo: React.FC<{ opacidad?: number }> = ({ opacidad = 1 }) => {
  const { w, vertical } = useFormato();
  return (
    <div style={{ position: 'absolute', left: 0, width: w, top: vertical ? 1560 : undefined, bottom: vertical ? undefined : 14, display: 'flex', justifyContent: vertical ? 'center' : 'flex-end', paddingRight: vertical ? 0 : 30, boxSizing: 'border-box', opacity: opacidad, zIndex: 30 }}>
      <span style={{ padding: '7px 18px', borderRadius: 999, background: 'rgba(6,18,48,.6)', color: 'rgba(255,255,255,.86)', fontFamily: FUENTE.marca, fontWeight: 500, fontSize: vertical ? 23 : 19 }}>Ejemplo de un proyecto acotado. Cada proyecto tiene su propio plazo.</span>
    </div>
  );
};

/** Tarjeta que entra con un leve salto. */
export const Aparece: React.FC<{ desde: number; children: React.ReactNode; style?: React.CSSProperties; dy?: number; dur?: number }> = ({ desde, children, style, dy = 40, dur = 14 }) => {
  const frame = useCurrentFrame();
  const t = fr(frame, desde, desde + dur);
  return <div style={{ opacity: limitar(t * 1.5), transform: `translateY(${(1 - t) * dy}px)`, ...style }}>{children}</div>;
};
