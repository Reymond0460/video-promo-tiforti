// ESCENA 3 — Conocemos su idea: antes de programar, escuchamos.
import React from 'react';
import { AbsoluteFill, Img, staticFile, useCurrentFrame } from 'remotion';
import { FondoMarca, Icono, PANTALLA } from '../componentes/Dispositivos';
import { NotebookAtras, Oficina, OFICINA_MESA_Y, Taller, Taza, Vela } from '../componentes/Escenario';
import { CAMILA, DEV_A, DEV_B, Persona, Pose } from '../componentes/Persona';
import { SitioAlambre, SitioLumbre } from '../componentes/SitioLumbre';
import { Chip, useFormato } from '../componentes/Textos';
import { FUENTE, LUMBRE, TIFORTI } from '../tema';
import { claves, fr, limitar, st } from '../util';
import { CAM } from './E1Problema';

/** El equipo de TiforTi en su espacio de trabajo. Se reutiliza en varias escenas. */
export const EquipoSVG: React.FC<{ frame: number; hora?: number; poseA?: Pose; poseB?: Pose; uid?: string; extra?: React.ReactNode }> = ({ frame, hora = 0.2, poseA = {}, poseB = {}, uid, extra }) => (
  <Oficina
    frame={frame} hora={hora} uid={uid}
    personas={
      <>
        <Persona a={DEV_A} frame={frame} x={700} y={930} pose={{ luzPantalla: 0.5, ...poseA }} semilla={3} capa="cuerpo" />
        <Persona a={DEV_B} frame={frame} x={1220} y={930} pose={{ luzPantalla: 0.5, ...poseB }} semilla={7} capa="cuerpo" />
      </>
    }
    sobreMesa={
      <>
        <NotebookAtras x={700} y={OFICINA_MESA_Y + 70} color="#3a4558" logo />
        <NotebookAtras x={1220} y={OFICINA_MESA_Y + 70} color="#c5ccd4" />
        <Taza x={960} y={OFICINA_MESA_Y + 112} color="#1556d7" frame={frame} />
        <g transform={`translate(1010 ${OFICINA_MESA_Y + 330}) rotate(-6)`}>
          <rect x={-130} y={-90} width={260} height={180} rx={6} fill="#fff" />
          <rect x={-110} y={-70} width={90} height={60} rx={4} fill="none" stroke="#9aa9bc" strokeWidth={4} />
          <rect x={-6} y={-70} width={116} height={10} fill="#c7d2df" /><rect x={-6} y={-50} width={90} height={10} fill="#c7d2df" />
          <rect x={-110} y={10} width={220} height={10} fill="#c7d2df" /><rect x={-110} y={34} width={160} height={10} fill="#c7d2df" />
        </g>
        {extra}
        <Persona a={DEV_A} frame={frame} x={700} y={930} pose={poseA} semilla={3} capa="brazos" />
        <Persona a={DEV_B} frame={frame} x={1220} y={930} pose={poseB} semilla={7} capa="brazos" />
      </>
    }
  />
);

const Recuadro: React.FC<{ vista: string; children: React.ReactNode; nombre: string; habla?: boolean; style: React.CSSProperties; logo?: boolean }> = ({ vista, children, nombre, habla, style, logo }) => (
  <div style={{ position: 'absolute', borderRadius: 30, overflow: 'hidden', boxShadow: habla ? `0 0 0 5px ${TIFORTI.cian}, 0 20px 50px rgba(0,0,0,.4)` : '0 20px 50px rgba(0,0,0,.4)', background: '#222', ...style }}>
    <svg viewBox={vista} width="100%" height="100%" preserveAspectRatio="xMidYMid slice" style={{ display: 'block' }}>{children}</svg>
    <div style={{ position: 'absolute', left: 16, bottom: 14, display: 'flex', alignItems: 'center', gap: 10, padding: '8px 16px', borderRadius: 14, background: 'rgba(8,14,30,.7)', color: '#fff', fontFamily: FUENTE.marca, fontWeight: 700, fontSize: 26 }}>
      {logo ? <Img src={staticFile('marca/logo-ti.png')} style={{ width: 30, height: 30 }} /> : null}
      {nombre}
    </div>
  </div>
);

/** 3A · Videollamada: Camila cuenta su idea y muestra sus velas; el equipo escucha y toma apuntes. */
export const T3Llamada: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const { w, h, vertical } = useFormato();
  const f = (frame / dur) * 124;
  const habla = limitar(Math.abs(Math.sin(frame * 0.42)) * 0.75 + Math.sin(frame * 0.23) * 0.3) * st(f, 14, 24);
  const poseC: Pose = {
    boca: 0.6, hablar: habla, cejas: 0.35 + Math.sin(frame / 17) * 0.2, cabeza: Math.sin(frame / 26) * 3, ojosRisa: 0.25,
    manoD: [claves(f, [[10, 150], [34, 168]]), claves(f, [[10, 250], [34, -6 + Math.sin(frame / 12) * 5]])],
    objetoD: <Vela x={0} y={36} ancho={96} alto={122} cera="#f1dfc2" tapa />,
    manoI: [-170, 262],
  };
  const asiente = Math.max(0, Math.sin(frame / 9)) * 5;
  const poseA: Pose = { boca: 0.35, mirada: [0.1, claves(f, [[40, 0.1], [52, 0.85], [96, 0.85], [108, 0.1]])], cabezaY: claves(f, [[40, 0], [52, 8], [96, 8], [108, 0]]), cejas: 0.2 };
  const poseB: Pose = { boca: 0.6, cabezaY: asiente, cabeza: -3, cejas: 0.3, ojosRisa: 0.3 };
  const entra = (i: number) => ({ opacity: st(f, 2 + i * 5, 14 + i * 5), transform: `scale(${0.94 + 0.06 * fr(f, 2 + i * 5, 18 + i * 5)})` });
  const cajas = vertical
    ? { c: { left: 40, top: 236, width: 1000, height: 750 }, a: { left: 40, top: 1006, width: 490, height: 390 }, b: { left: 550, top: 1006, width: 490, height: 390 } }
    : { c: { left: 60, top: 100, width: 1130, height: 800 }, a: { left: 1220, top: 100, width: 640, height: 388 }, b: { left: 1220, top: 512, width: 640, height: 388 } };
  return (
    <AbsoluteFill style={{ background: 'linear-gradient(170deg,#141c33,#0a1020)' }}>
      <div style={{ position: 'absolute', top: vertical ? 168 : 36, left: vertical ? 48 : 68, display: 'flex', alignItems: 'center', gap: 14, color: '#fff', fontFamily: FUENTE.marca, fontWeight: 700, fontSize: vertical ? 30 : 28, opacity: 0.9 }}>
        <span style={{ width: 14, height: 14, borderRadius: 7, background: '#ef4444', opacity: 0.6 + 0.4 * Math.sin(frame / 8) }} />
        Reunión · Lumbre y TiforTi
      </div>
      <Recuadro vista="470 440 980 735" nombre="Camila · Lumbre" habla style={{ ...cajas.c, ...entra(0) }}>
        <Taller frame={frame} tarde={0.3} uid="call" notebook="no" taza={false}
          persona={<Persona a={CAMILA} frame={frame} x={CAM.x} y={CAM.y} escala={CAM.escala} pose={poseC} capa="cuerpo" semilla={2} />}
          sobreMesa={<Persona a={CAMILA} frame={frame} x={CAM.x} y={CAM.y} escala={CAM.escala} pose={poseC} capa="brazos" semilla={2} />} />
      </Recuadro>
      <Recuadro vista="420 560 560 446" nombre="TiforTi" logo style={{ ...cajas.a, ...entra(1) }}>
        <EquipoSVG frame={frame} hora={0.2} poseA={poseA} poseB={poseB} uid="ca" />
      </Recuadro>
      <Recuadro vista="940 560 560 446" nombre="TiforTi" logo style={{ ...cajas.b, ...entra(2) }}>
        <EquipoSVG frame={frame} hora={0.2} poseA={poseA} poseB={poseB} uid="cb" />
      </Recuadro>
      <div style={{ position: 'absolute', left: 0, width: w, top: vertical ? 1580 : h - 96, display: 'flex', justifyContent: 'center', gap: 26 }}>
        {(['mic', 'camara', 'pantalla', 'colgar'] as const).map((n) => (
          <div key={n} style={{ width: vertical ? 96 : 68, height: vertical ? 96 : 68, borderRadius: 50, background: n === 'colgar' ? '#ef4444' : 'rgba(255,255,255,.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Icono n={n} color="#fff" tam={vertical ? 44 : 32} />
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};

const NOTAS = ['Velas artesanales de cera de soya', 'Mostrar sus productos', 'Recibir pedidos por WhatsApp', 'Que se sienta cálida, como su taller'];

/** 3B · Los apuntes de la reunión se vuelven un plan: necesidades, colores y estructura. */
export const T3Notas: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const { w, h, vertical } = useFormato();
  const f = (frame / dur) * 94;
  const k = vertical ? 1.08 : 0.84;
  const ancho = 950;
  return (
    <AbsoluteFill>
      <FondoMarca frame={frame} claro />
      <div style={{ position: 'absolute', left: (w - ancho * k) / 2, top: vertical ? 240 : (h - 1060 * k) / 2 - 20, width: ancho, transform: `scale(${k}) translateY(${(1 - fr(f, 0, 16)) * 50}px)`, transformOrigin: '0 0', opacity: st(f, 0, 10) }}>
        <div style={{ background: '#fff', borderRadius: 40, padding: '40px 50px 46px', boxShadow: '0 40px 90px rgba(16,32,59,.18), 0 0 0 1px rgba(16,32,59,.06)', fontFamily: FUENTE.marca }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
            <Img src={staticFile('marca/logo-ti.png')} style={{ width: 70, height: 70 }} />
            <div>
              <div style={{ fontSize: 26, fontWeight: 700, color: TIFORTI.azul, letterSpacing: '.06em', textTransform: 'uppercase' }}>Notas de la reunión</div>
              <div style={{ fontSize: 50, fontWeight: 800, color: TIFORTI.navy, letterSpacing: '-0.04em', lineHeight: 1.1 }}>Proyecto: Lumbre</div>
            </div>
          </div>
          <div style={{ marginTop: 30, display: 'flex', flexDirection: 'column', gap: 20 }}>
            {NOTAS.map((n, i) => {
              const a = 8 + i * 12;
              const escrito = Math.floor(st(f, a, a + 12) * n.length);
              const listo = f > a + 13;
              return (
                <div key={n} style={{ display: 'flex', alignItems: 'center', gap: 18, opacity: f > a ? 1 : 0, minHeight: 56 }}>
                  <span style={{ width: 46, height: 46, borderRadius: 14, background: listo ? TIFORTI.azul : TIFORTI.palido, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transform: `scale(${listo ? 0.85 + 0.15 * fr(f, a + 13, a + 20) : 1})` }}>
                    {listo ? <Icono n="check" color="#fff" tam={30} grosor={3} /> : null}
                  </span>
                  <span style={{ fontSize: 39, fontWeight: 600, color: TIFORTI.navy, letterSpacing: '-0.02em' }}>{n.slice(0, escrito)}</span>
                </div>
              );
            })}
          </div>
          <div style={{ marginTop: 34, paddingTop: 28, borderTop: `2px solid ${TIFORTI.linea}`, opacity: st(f, 56, 64) }}>
            <div style={{ fontSize: 26, fontWeight: 700, color: TIFORTI.texto, marginBottom: 16 }}>Colores de su marca</div>
            <div style={{ display: 'flex', gap: 18 }}>
              {[LUMBRE.terracota, LUMBRE.crema, LUMBRE.salvia, LUMBRE.miel, LUMBRE.cafe].map((c, i) => (
                <div key={c} style={{ width: 104, height: 104, borderRadius: 26, background: c, boxShadow: '0 8px 20px rgba(16,32,59,.14), inset 0 0 0 2px rgba(16,32,59,.07)', transform: `scale(${fr(f, 58 + i * 3, 70 + i * 3)})` }} />
              ))}
            </div>
          </div>
          <div style={{ marginTop: 30, opacity: st(f, 72, 80) }}>
            <div style={{ fontSize: 26, fontWeight: 700, color: TIFORTI.texto, marginBottom: 16 }}>Estructura</div>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              {['Portada', 'Velas', 'Historia', 'Contacto'].map((c, i) => (
                <span key={c} style={{ transform: `scale(${fr(f, 74 + i * 3, 84 + i * 3)})`, display: 'inline-block' }}><Chip tam={32}>{c}</Chip></span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

/** 3C · Del boceto a la primera maqueta, con los colores de su marca. */
export const T3Boceto: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const { w, h, vertical } = useFormato();
  const f = (frame / dur) * 100;
  const dibuja = st(f, 4, 42);
  const pinta = st(f, 48, 86);
  const lw = vertical ? PANTALLA.w : 1280;
  const lh = vertical ? PANTALLA.h : 800;
  const k = vertical ? 1.42 : 1.02;
  const x = (w - lw * k) / 2;
  const y = vertical ? 236 : (h - lh * k) / 2 - 10;
  return (
    <AbsoluteFill>
      <FondoMarca frame={frame} claro />
      <div style={{ position: 'absolute', left: x, top: y, width: lw * k, height: lh * k, borderRadius: vertical ? 54 : 26, overflow: 'hidden', boxShadow: '0 40px 90px rgba(16,32,59,.2), 0 0 0 2px rgba(16,32,59,.08)', background: '#fff', opacity: st(f, 0, 8) }}>
        <div style={{ transform: `scale(${k})`, transformOrigin: '0 0', width: lw, height: lh, position: 'relative' }}>
          <SitioAlambre movil={vertical} avance={dibuja} />
          <div style={{ position: 'absolute', inset: 0, clipPath: `inset(0 0 ${(1 - pinta) * 100}% 0)` }}>
            <SitioLumbre movil={vertical} frame={frame} />
          </div>
          {pinta > 0 && pinta < 1 ? <div style={{ position: 'absolute', left: 0, right: 0, top: `${pinta * 100}%`, height: 5, marginTop: -2, background: TIFORTI.cian, boxShadow: `0 0 26px 6px ${TIFORTI.cian}` }} /> : null}
        </div>
      </div>
      <div style={{ position: 'absolute', left: vertical ? x - 26 : x + 30, top: vertical ? y + 60 : y - 34, zIndex: 5 }}>
        <Chip tam={vertical ? 34 : 28} fondo={pinta > 0.5 ? TIFORTI.azul : TIFORTI.navy} color="#fff" style={{ boxShadow: '0 10px 24px rgba(16,32,59,.3)' }}>{pinta > 0.5 ? 'Primera maqueta' : 'Boceto'}</Chip>
      </div>
    </AbsoluteFill>
  );
};
