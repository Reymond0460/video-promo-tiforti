// ESCENA 2 — El descubrimiento: mientras sigue buscando, aparece TiforTi.
import React from 'react';
import { AbsoluteFill, Img, staticFile, useCurrentFrame } from 'remotion';
import { FondoMarca, FondoTaller, PANTALLA, Telefono, Toque } from '../componentes/Dispositivos';
import { Pelicula } from '../componentes/Escenario';
import { ALTO_POST, Feed } from '../componentes/Feed';
import { Pose } from '../componentes/Persona';
import { Chip, useFormato } from '../componentes/Textos';
import { FUENTE, TIFORTI } from '../tema';
import { claves, fr, limitar, mezclar, st } from '../util';
import { CamilaEnTaller, CelularEnMano, Pulgar } from './E1Problema';

/** 2A · Sigue deslizando… y aparece la publicación de TiforTi. */
export const T2Hallazgo: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const { w, h, vertical } = useFormato();
  const f = (frame / dur) * 112;
  const centro = (i: number) => i * ALTO_POST - 117;
  const scroll = claves(f, [[0, centro(2) + 14], [30, centro(2) + 20], [46, centro(3)]]);
  const ancho = vertical ? 720 : 430;
  const alto = ancho * (870 / 416);
  const x0 = vertical ? (w - ancho) / 2 : w * 0.34 - ancho / 2;
  const y0 = vertical ? 236 : (h - alto) / 2 + 6;
  const kf = ancho / 416;
  const brillo = st(f, 46, 64) * (0.75 + 0.25 * Math.sin(frame / 9));
  const flick = Math.sin(Math.PI * st(f, 28, 48));
  const toca = st(f, 78, 88) - st(f, 92, 100);
  return (
    <AbsoluteFill>
      <FondoTaller frame={frame} />
      <AbsoluteFill style={{ background: `radial-gradient(ellipse at 50% 45%, rgba(34,211,238,${0.22 * st(f, 46, 80)}), rgba(34,211,238,0) 60%)` }} />
      <Telefono ancho={ancho} style={{ position: 'absolute', left: x0, top: y0 + Math.sin(frame / 30) * 4, transform: `scale(${1 + 0.03 * st(f, 46, 100)})` }}>
        <Feed scroll={scroll} brilloTiforti={brillo} gusta={f > 90} />
      </Telefono>
      <Toque x={x0 + 208 * kf} y={y0 + 440 * kf} t={limitar((f - 88) / 14)} color={TIFORTI.cian} />
      <Pulgar x={x0 + ancho * (0.8 - toca * 0.16)} y={y0 + alto * (0.7 - flick * 0.09 - toca * 0.12)} k={(ancho / 720) * 0.95} />
      {!vertical ? (
        <div style={{ position: 'absolute', left: w * 0.56, top: h * 0.36, width: 700, opacity: st(f, 56, 72), transform: `translateY(${(1 - fr(f, 56, 76)) * 30}px)`, fontFamily: FUENTE.marca, fontWeight: 800, fontSize: 84, lineHeight: 1.05, letterSpacing: '-0.04em', color: '#fff' }}>
          Hasta que un día<span style={{ color: TIFORTI.cian }}>…</span>
        </div>
      ) : null}
      <Pelicula fuerza={0.6} />
    </AbsoluteFill>
  );
};

const DEMOS = [
  { img: 'huellitas-desktop.webp', cat: 'Tiendas online' },
  { img: 'studiobarber-desktop.webp', cat: 'Reservas y agenda' },
  { img: 'evento-desktop.webp', cat: 'Eventos' },
  { img: 'profesional-desktop.webp', cat: 'Sitios profesionales' },
  { img: 'aseo-desktop.webp', cat: 'Catálogos' },
];

export const TarjetaDemo: React.FC<{ img: string; ancho: number; cat?: string; style?: React.CSSProperties; dentro?: boolean }> = ({ img, ancho, cat, style, dentro }) => (
  <div style={{ width: ancho, position: 'relative', ...style }}>
    <div style={{ width: ancho, height: ancho * 0.625, borderRadius: ancho * 0.045, overflow: 'hidden', boxShadow: '0 24px 50px rgba(16,32,59,.22), 0 0 0 1px rgba(16,32,59,.08)', background: '#fff' }}>
      <Img src={staticFile(`tiforti/proyectos/${img}`)} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top', display: 'block' }} />
    </div>
    {cat ? <div style={dentro ? { position: 'absolute', left: ancho * 0.04, bottom: ancho * 0.04 } : { marginTop: ancho * 0.045 }}><Chip tam={ancho * 0.07} fondo="#fff" style={{ boxShadow: '0 6px 16px rgba(16,32,59,.12)' }}>{cat}</Chip></div> : null}
  </div>
);

/** 2B · Entra a tiforti.cl (captura real del sitio) y ve ejemplos de páginas para distintos rubros (demos reales). */
export const T2Sitio: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const { w, vertical } = useFormato();
  const f = (frame / dur) * 136;
  const mueve = st(f, 38, 62);
  const ancho = vertical ? mezclar(660, 440, mueve) : 400;
  const top = vertical ? mezclar(280, 218, mueve) : 118;
  const left = vertical ? (w - ancho) / 2 : 250;
  const scroll = claves(f, [[16, 0], [70, 106]]);
  const entra = fr(f, 0, 18);
  return (
    <AbsoluteFill>
      <FondoMarca frame={frame} claro />
      <Telefono ancho={ancho} style={{ position: 'absolute', left, top: top + (1 - entra) * 80, opacity: limitar(entra * 2) }}>
        <Img src={staticFile('tiforti/movil-inicio.png')} style={{ width: PANTALLA.w, position: 'absolute', top: 44 - scroll, left: 0 }} />
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 46, background: '#fff' }} />
      </Telefono>
      {vertical ? (
        <div style={{ position: 'absolute', top: 1158, left: 0, width: w, height: 300 }}>
          {DEMOS.map((d, i) => {
            const t = fr(f, 58 + i * 7, 76 + i * 7);
            const x = 56 + i * 428 - st(f, 70, 136) * 620;
            return <TarjetaDemo key={d.img} img={d.img} cat={d.cat} dentro ancho={400} style={{ position: 'absolute', left: x, top: (1 - t) * 60, opacity: limitar(t * 1.6) }} />;
          })}
        </div>
      ) : (
        <div style={{ position: 'absolute', left: 800, top: 120, width: 1040, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '34px 40px' }}>
          {DEMOS.slice(0, 4).map((d, i) => {
            const t = fr(f, 40 + i * 9, 60 + i * 9);
            return <TarjetaDemo key={d.img} img={d.img} cat={d.cat} ancho={500} style={{ transform: `translateY(${(1 - t) * 60}px)`, opacity: limitar(t * 1.6) }} />;
          })}
        </div>
      )}
    </AbsoluteFill>
  );
};

/** 2C · Interés y esperanza: Camila escribe a TiforTi. */
export const T2Mensaje: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const { w, vertical } = useFormato();
  const f = (frame / dur) * 78;
  const texto = 'Hola, tengo un emprendimiento de velas y quiero mi página web.';
  const n = Math.floor(st(f, 10, 52) * texto.length);
  const enviado = f > 56;
  const pose: Pose = {
    mirada: [claves(f, [[58, 0.1], [68, 0]]), claves(f, [[58, 0.85], [68, 0.1]])],
    boca: claves(f, [[0, 0.35], [60, 0.55], [72, 0.85]]),
    cejas: claves(f, [[0, 0.5], [60, 0.4]]),
    ojosRisa: claves(f, [[58, 0.1], [72, 0.6]]),
    cabeza: claves(f, [[0, 3], [70, -2]]),
    cabezaY: claves(f, [[0, 6], [58, 6], [70, 0]]),
    manoD: [70, 186 + (enviado ? 0 : Math.sin(frame * 1.3) * 2)],
    manoI: [-34, 210 + (enviado ? 0 : Math.sin(frame * 1.7) * 5)],
    objetoD: <CelularEnMano giro={-4} />,
    luzPantalla: 0.7,
  };
  const k = vertical ? 1 : 0.8;
  return (
    <AbsoluteFill>
      <CamilaEnTaller pose={pose} tarde={0.85} zoom={vertical ? 1.08 : 1.34} x={vertical ? 960 : 800} y={vertical ? 930 : 880} />
      <div style={{ position: 'absolute', top: vertical ? 232 : 110, left: vertical ? (w - 920) / 2 : 90, width: 920, transform: `scale(${k}) translateY(${(1 - fr(f, 0, 14)) * -40}px)`, transformOrigin: '0 0', opacity: st(f, 0, 10) }}>
        <div style={{ background: 'rgba(255,255,255,.97)', borderRadius: 36, padding: '22px 28px 26px', boxShadow: '0 24px 60px rgba(30,12,4,.35)', fontFamily: FUENTE.marca }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, paddingBottom: 16, borderBottom: `2px solid ${TIFORTI.linea}` }}>
            <Img src={staticFile('marca/logo-ti.png')} style={{ width: 62, height: 62 }} />
            <div>
              <div style={{ fontWeight: 800, fontSize: 36, color: TIFORTI.navy, letterSpacing: '-0.05em', lineHeight: 1 }}>TiforTi</div>
              <div style={{ fontSize: 22, color: '#16a34a', fontWeight: 600, marginTop: 4 }}>● en línea</div>
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 20 }}>
            <div style={{ maxWidth: 720, padding: '18px 26px', borderRadius: '30px 30px 8px 30px', background: enviado ? TIFORTI.azul : TIFORTI.palido, color: enviado ? '#fff' : TIFORTI.navy, fontSize: 36, fontWeight: 600, lineHeight: 1.25, minHeight: 90 }}>
              {texto.slice(0, n)}
              {!enviado ? <span style={{ opacity: Math.floor(frame / 8) % 2 ? 1 : 0.2 }}>|</span> : null}
            </div>
          </div>
          <div style={{ textAlign: 'right', fontSize: 22, color: TIFORTI.texto, marginTop: 8, opacity: enviado ? 1 : 0 }}>Enviado ✓</div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
