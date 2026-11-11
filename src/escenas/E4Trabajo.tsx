// ESCENA 4 — Manos a la obra: una semana de trabajo real (planificación, diseño, código, integración, pruebas).
// La semana es un ejemplo narrativo de un proyecto acotado; por eso siempre va la nota de plazo en pantalla.
import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { Cursor, FondoMarca, Icono, Navegador, PANTALLA, Telefono } from '../componentes/Dispositivos';
import { Escenario, Pelicula } from '../componentes/Escenario';
import { Pose } from '../componentes/Persona';
import { SitioLumbre } from '../componentes/SitioLumbre';
import { CintaDias, NotaPlazo, useFormato } from '../componentes/Textos';
import { LineaTerminal, VSCode } from '../componentes/VSCode';
import { FUENTE, TIFORTI } from '../tema';
import { claves, fr, limitar, mezclar, st } from '../util';
import { EquipoSVG } from './E3Idea';

const Capa: React.FC<{ dia: number; f: number; entrada?: boolean }> = ({ dia, f, entrada }) => (
  <>
    <CintaDias dia={dia} entrada={entrada ? fr(f, 0, 14) : 1} />
    <NotaPlazo opacidad={entrada ? st(f, 6, 20) : 1} />
  </>
);

/** Toma del equipo trabajando. La luz de la ventana cuenta el paso del día. */
const TomaEquipo: React.FC<{ hora: number; poseA: Pose; poseB: Pose; zoom?: number; extra?: React.ReactNode; children?: React.ReactNode; xH?: number; zoomH?: number }> = ({ hora, poseA, poseB, zoom = 1, extra, children, xH = 960, zoomH = 1.02 }) => {
  const frame = useCurrentFrame();
  const { vertical } = useFormato();
  return (
    <AbsoluteFill>
      <Escenario zoom={vertical ? zoom : zoom * zoomH} x={vertical ? 960 : xH} y={vertical ? 960 : 930} mano={0.8}>
        <EquipoSVG frame={frame} hora={hora} poseA={poseA} poseB={poseB} extra={extra} />
      </Escenario>
      <Pelicula fuerza={0.8} />
      {children}
    </AbsoluteFill>
  );
};

const teclea = (frame: number, s: number): Pose => ({ mirada: [Math.sin(frame / 23 + s) * 0.25, 0.7], cabezaY: 5 + Math.sin(frame / 31 + s) * 1.5, luzPantalla: 0.7 });

/** 4A · Día 1: el equipo se sienta a planificar. Conversan antes de escribir una línea. */
export const T4Equipo: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const f = (frame / dur) * 64;
  const habla = limitar(Math.abs(Math.sin(frame * 0.45)) * 0.8) * st(f, 8, 16);
  return (
    <TomaEquipo hora={0.1} zoom={mezclar(1, 1.05, st(f, 0, 64))}
      poseA={{ boca: 0.4, mirada: [0.7, 0.1], cabeza: 6, cabezaY: Math.max(0, Math.sin(frame / 8)) * 4, cejas: 0.2 }}
      poseB={{ boca: 0.5, hablar: habla, mirada: [-0.7, 0.1], cabeza: -8, cejas: 0.3, manoI: [-150, 120 + Math.sin(frame / 7) * 8] }}>
      <Capa dia={1} f={f} entrada />
    </TomaEquipo>
  );
};

const ETAPAS_PLAN = [
  { n: 'Diseño', t: ['Boceto', 'Maqueta', 'Colores'] },
  { n: 'Desarrollo', t: ['Estructura', 'Estilos', 'Componentes'] },
  { n: 'Integración', t: ['Productos', 'Pedidos', 'Publicación'] },
  { n: 'Pruebas y entrega', t: ['Celular', 'Formularios', 'Revisión final'] },
];

/** 4B · Día 1: el plan de trabajo y la maqueta aprobada. */
export const T4Plan: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const { w, h, vertical } = useFormato();
  const f = (frame / dur) * 82;
  const k = vertical ? 1 : 0.8;
  const ancho = 980;
  return (
    <AbsoluteFill>
      <FondoMarca frame={frame} />
      <div style={{ position: 'absolute', left: (w - ancho * k) / 2, top: vertical ? 390 : (h - 940 * k) / 2 + 50, width: ancho, transform: `scale(${k}) translateY(${(1 - fr(f, 0, 14)) * 40}px)`, transformOrigin: '0 0', opacity: st(f, 0, 8) }}>
        <div style={{ background: '#fff', borderRadius: 40, padding: '38px 42px 42px', boxShadow: '0 40px 90px rgba(0,0,0,.4)', fontFamily: FUENTE.marca, position: 'relative' }}>
          <div style={{ fontSize: 26, fontWeight: 700, color: TIFORTI.azul, letterSpacing: '.06em', textTransform: 'uppercase' }}>Plan de trabajo</div>
          <div style={{ fontSize: 52, fontWeight: 800, color: TIFORTI.navy, letterSpacing: '-0.04em', lineHeight: 1.1, marginBottom: 26 }}>Página web de Lumbre</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18, width: 600 }}>
            {ETAPAS_PLAN.map((e, i) => {
              const t = fr(f, 10 + i * 9, 24 + i * 9);
              const hecha = i === 0 && f > 58;
              return (
                <div key={e.n} style={{ opacity: limitar(t * 1.5), transform: `translateX(${(1 - t) * -40}px)`, padding: '20px 24px', borderRadius: 26, background: hecha ? '#e8f8ee' : TIFORTI.suave, border: `2px solid ${hecha ? '#86d6a4' : TIFORTI.linea}` }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                    <span style={{ width: 48, height: 48, borderRadius: 16, background: hecha ? '#16a34a' : TIFORTI.azul, color: '#fff', fontWeight: 800, fontSize: 26, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{hecha ? <Icono n="check" color="#fff" tam={30} grosor={3} /> : i + 1}</span>
                    <span style={{ fontSize: 36, fontWeight: 800, color: TIFORTI.navy, letterSpacing: '-0.03em' }}>{e.n}</span>
                  </div>
                  <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
                    {e.t.map((x) => <span key={x} style={{ padding: '6px 14px', borderRadius: 14, background: '#fff', border: `1.5px solid ${TIFORTI.linea}`, fontSize: 23, fontWeight: 600, color: TIFORTI.texto }}>{x}</span>)}
                  </div>
                </div>
              );
            })}
          </div>
          {/* maqueta aprobada */}
          <div style={{ position: 'absolute', right: 40, top: 170, width: 268, opacity: st(f, 26, 40), transform: `translateY(${(1 - fr(f, 26, 44)) * 40}px) rotate(2deg)` }}>
            <div style={{ width: 268, height: 580, borderRadius: 34, overflow: 'hidden', boxShadow: '0 24px 50px rgba(16,32,59,.25), 0 0 0 6px #10203b' }}>
              <div style={{ transform: `scale(${268 / PANTALLA.w})`, transformOrigin: '0 0' }}><SitioLumbre movil frame={frame} /></div>
            </div>
            <div style={{ marginTop: 18, textAlign: 'center', fontFamily: FUENTE.mano, fontSize: 44, fontWeight: 700, color: '#16a34a', opacity: st(f, 56, 64), transform: `rotate(-4deg) scale(${0.8 + 0.2 * fr(f, 56, 68)})` }}>¡maqueta aprobada!</div>
          </div>
        </div>
      </div>
      <Capa dia={1} f={f} />
    </AbsoluteFill>
  );
};

/** 4C · Días 2 y 3: estructura y programación en Visual Studio Code. La vista previa pasa de HTML plano a una página con diseño. */
export const T4Codigo: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const { w, h, vertical } = useFormato();
  const f = (frame / dur) * 136;
  const css = f > 72;
  const ancho = vertical ? 1020 : 1700;
  const alto = vertical ? 1010 : 830;
  const lateral = vertical ? 236 : 250;
  const panel = vertical ? ancho - 58 - lateral : Math.round((ancho - 58 - lateral) * 0.45);
  const k = panel / 1280;
  const estilo = st(f, 94, 112);
  const vista = (
    <div style={{ transform: `scale(${k})`, transformOrigin: '0 0', width: 1280, position: 'absolute', top: 0, left: 0, opacity: st(f, 24, 34) }}>
      <SitioLumbre etapa="html" />
      <div style={{ position: 'absolute', top: 0, left: 0, opacity: estilo }}><SitioLumbre etapa="estilo" productos={0} frame={frame} /></div>
    </div>
  );
  return (
    <AbsoluteFill>
      <FondoMarca frame={frame} lineas={0.5} />
      <div style={{ position: 'absolute', left: (w - ancho) / 2, top: vertical ? 380 : (h - alto) / 2 + 60, opacity: st(f, 0, 8), transform: `scale(${0.97 + 0.03 * fr(f, 0, 14)})` }}>
        <VSCode
          ancho={ancho} alto={alto} frame={frame} lateral={lateral} letra={vertical ? 21 : 20}
          archivo={css ? 'estilos.css' : 'index.html'} pestanas={css ? ['index.html', 'estilos.css'] : ['index.html']}
          escrito={css ? mezclar(0.12, 1, st(f, 76, 132)) : mezclar(0.2, 1, st(f, 0, 66))}
          arbolVisible={mezclar(2, 13, st(f, 4, 60))}
          vista={vista} tituloVista="Vista previa · localhost:5000" division={vertical ? 'abajo' : 'derecha'} proporcionVista={vertical ? 0.4 : 0.45}
        />
      </div>
      <Capa dia={css ? 3 : 2} f={f} />
    </AbsoluteFill>
  );
};

/** 4D · Cae la tarde: siguen trabajando, cada uno en lo suyo. */
export const T4EquipoTarde: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const f = (frame / dur) * 46;
  return (
    <TomaEquipo hora={mezclar(0.7, 0.98, st(f, 0, 46))} zoom={1.06} poseA={{ ...teclea(frame, 1), boca: 0.1 }} poseB={{ ...teclea(frame, 4), boca: 0.2, cabeza: -3 }}>
      <Capa dia={f < 24 ? 3 : 4} f={f} />
    </TomaEquipo>
  );
};

const Servicio: React.FC<{ nombre: string; uso: string; color: string; t: number; activo?: boolean; icono: React.ReactNode }> = ({ nombre, uso, color, t, activo, icono }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '16px 20px', borderRadius: 24, background: '#fff', boxShadow: activo ? `0 0 0 4px ${color}, 0 14px 30px rgba(0,0,0,.25)` : '0 14px 30px rgba(0,0,0,.25)', opacity: limitar(t * 1.5), transform: `translateX(${(1 - t) * 50}px)` }}>
    <span style={{ width: 62, height: 62, borderRadius: 18, background: color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{icono}</span>
    <div style={{ fontFamily: FUENTE.marca }}>
      <div style={{ fontSize: 31, fontWeight: 800, color: TIFORTI.navy, letterSpacing: '-0.03em', lineHeight: 1.1 }}>{nombre}</div>
      <div style={{ fontSize: 23, fontWeight: 600, color: TIFORTI.texto }}>{uso}</div>
    </div>
  </div>
);

/** 4E · Días 4 y 5: integración. La interfaz se conecta con los servicios que este proyecto necesita (Firebase). */
export const T4Integracion: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const { w, vertical } = useFormato();
  const f = (frame / dur) * 112;
  const segundo = f > 46;
  const productos = Math.floor(st(f, 52, 100) * 4.2);
  const anchoVista = vertical ? 520 : 500;
  const kv = anchoVista / 1280;
  const editor = vertical ? { left: 30, top: 380, ancho: 1020, alto: 520 } : { left: 60, top: 170, ancho: 960, alto: 830 };
  const caja = vertical ? { left: 30, top: 924, width: 1020, height: 480 } : { left: 1050, top: 170, width: 810, height: 830 };
  const ico = (d: string) => <svg width={36} height={36} viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d={d} /></svg>;
  return (
    <AbsoluteFill>
      <FondoMarca frame={frame} lineas={0.5} />
      <div style={{ position: 'absolute', left: editor.left, top: editor.top, opacity: st(f, 0, 8) }}>
        <VSCode ancho={editor.ancho} alto={editor.alto} frame={frame} lateral={vertical ? 220 : 240} letra={vertical ? 20 : 21}
          archivo={segundo ? 'productos.js' : 'firebase.js'} pestanas={segundo ? ['firebase.js', 'productos.js'] : ['firebase.js']}
          escrito={segundo ? mezclar(0.25, 1, st(f, 48, 88)) : mezclar(0.25, 1, st(f, 0, 40))} />
      </div>
      <div style={{ position: 'absolute', ...caja, borderRadius: 34, background: 'rgba(255,255,255,.08)', boxShadow: '0 0 0 1.5px rgba(125,227,247,.3)', opacity: st(f, 6, 18), padding: 26, boxSizing: 'border-box', display: 'flex', flexDirection: vertical ? 'row' : 'column', gap: 26, alignItems: 'center' }}>
        <div style={{ width: anchoVista, height: anchoVista * 0.72, borderRadius: 20, overflow: 'hidden', background: '#fff', flexShrink: 0, boxShadow: '0 20px 40px rgba(0,0,0,.35)', position: 'relative' }}>
          <div style={{ transform: `scale(${kv})`, transformOrigin: '0 0', width: 1280, position: 'absolute', top: -660 * kv, left: 0 }}>
            <SitioLumbre etapa="estilo" productos={productos} frame={frame} />
          </div>
        </div>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 14, width: vertical ? undefined : '100%' }}>
          <div style={{ fontFamily: FUENTE.marca, color: '#fff', fontSize: 34, fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1.1 }}>Firebase <span style={{ fontSize: 22, fontWeight: 600, color: TIFORTI.cianSuave, display: 'block', letterSpacing: 0, marginTop: 4 }}>según lo que cada proyecto necesite</span></div>
          <Servicio nombre="Firestore" uso="Productos y pedidos" color="#f59e0b" t={fr(f, 14, 28)} activo={f > 52 && f < 104} icono={ico('M4 6 c0 -4 16 -4 16 0 v12 c0 4 -16 4 -16 0 Z M4 6 c0 4 16 4 16 0 M4 12 c0 4 16 4 16 0')} />
          <Servicio nombre="Authentication" uso="Acceso al panel" color={TIFORTI.azul} t={fr(f, 22, 36)} icono={ico('M12 3 l7 3 v6 c0 4 -3 7 -7 9 c-4 -2 -7 -5 -7 -9 V6 Z M9 12 l2.2 2.2 L15 10')} />
          <Servicio nombre="Hosting" uso="Publicación del sitio" color="#0ea5b7" t={fr(f, 30, 44)} icono={ico('M12 3 a9 9 0 1 0 0.01 0 M3 12 h18 M12 3 c-5 5 -5 13 0 18 M12 3 c5 5 5 13 0 18')} />
        </div>
      </div>
      <Capa dia={f < 56 ? 4 : 5} f={f} />
    </AbsoluteFill>
  );
};

const PRUEBAS = ['Navegación', 'Botones', 'Pedido por WhatsApp', 'Vista en celular'];

/** 4F · Día 6: pruebas en escritorio y celular. Se revisa cada botón y cada detalle. */
export const T4Pruebas: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const { vertical } = useFormato();
  const f = (frame / dur) * 88;
  const nav = vertical ? { left: 50, top: 380, ancho: 980, alto: 610 } : { left: 70, top: 170, ancho: 1060, alto: 790 };
  const k = nav.ancho / 1280;
  const scroll = claves(f, [[26, 0], [46, 600]]);
  const tel = vertical ? { left: 700, top: 780, ancho: 330 } : { left: 1170, top: 170, ancho: 372 };
  const lista = vertical ? { left: 56, top: 1036 } : { left: 1580, top: 250 };
  // cursor: botón "Ver velas" → tarjeta de producto
  const px = (x: number, y: number): [number, number] => [nav.left + x * k, nav.top + (54 + y) * k];
  const a = px(150, 520);
  const b = px(596, 478);
  const cx = claves(f, [[0, a[0] + 220], [16, a[0]], [50, a[0]], [62, b[0]]]);
  const cy = claves(f, [[0, a[1] + 160], [16, a[1]], [50, a[1]], [62, b[1]]]);
  const marcas = [22, 44, 68, 78];
  return (
    <AbsoluteFill>
      <FondoMarca frame={frame} lineas={0.5} />
      <Navegador ancho={nav.ancho} alto={nav.alto} url="localhost:5000" candado={false} style={{ position: 'absolute', left: nav.left, top: nav.top, opacity: st(f, 0, 8) }}>
        <div style={{ position: 'absolute', top: -scroll, left: 0 }}>
          <SitioLumbre frame={frame} resaltarBoton={st(f, 16, 20) - st(f, 22, 28)} resaltarProducto={f > 62 && f < 76 ? 1 : -1} />
        </div>
      </Navegador>
      <Telefono ancho={tel.ancho} style={{ position: 'absolute', left: tel.left, top: tel.top + (1 - fr(f, 8, 26)) * 120, opacity: st(f, 8, 18) }}>
        <div style={{ position: 'absolute', top: -claves(f, [[30, 0], [50, 560], [70, 560], [86, 1000]]), left: 0 }}><SitioLumbre movil frame={frame} /></div>
      </Telefono>
      <div style={{ position: 'absolute', ...lista, display: 'flex', flexDirection: 'column', gap: 16 }}>
        {PRUEBAS.map((p, i) => {
          const ok = f > marcas[i];
          return (
            <div key={p} style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '14px 26px 14px 16px', borderRadius: 999, background: ok ? '#fff' : 'rgba(255,255,255,.12)', color: ok ? TIFORTI.navy : 'rgba(255,255,255,.75)', fontFamily: FUENTE.marca, fontWeight: 700, fontSize: vertical ? 34 : 26, transform: `scale(${ok ? 0.94 + 0.06 * fr(f, marcas[i], marcas[i] + 8) : 1})`, transformOrigin: '0 50%', alignSelf: 'flex-start', boxShadow: ok ? '0 12px 26px rgba(0,0,0,.3)' : 'none' }}>
              <span style={{ width: vertical ? 50 : 40, height: vertical ? 50 : 40, borderRadius: 30, background: ok ? '#16a34a' : 'rgba(255,255,255,.16)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{ok ? <Icono n="check" color="#fff" tam={vertical ? 32 : 26} grosor={3} /> : null}</span>
              {p}
            </div>
          );
        })}
      </div>
      <Cursor x={cx} y={cy} clic={f > 60 ? limitar((f - 62) / 10) : limitar((f - 16) / 10)} escala={1.3} />
      <Capa dia={6} f={f} />
    </AbsoluteFill>
  );
};

const DEPLOY: LineaTerminal[] = [
  { t: '$ firebase deploy --only hosting' },
  { t: '=== Deploying to \'lumbre-web\'...', c: '#9cdcfe' },
  { t: 'i  hosting[lumbre-web]: beginning deploy...', c: '#858585' },
  { t: '✔  hosting[lumbre-web]: file upload complete', c: '#89d185' },
  { t: '✔  hosting[lumbre-web]: release complete', c: '#89d185' },
  { t: '✔  Deploy complete!', c: '#4ade80' },
];

/** 4G · Día 7: se publica la versión para la entrega. El equipo lo celebra con un gesto simple. */
export const T4Entrega: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const { vertical } = useFormato();
  const f = (frame / dur) * 67;
  const listo = st(f, 42, 52);
  const choca = st(f, 46, 56) - st(f, 62, 67) * 0.3;
  const poseA: Pose = { boca: 0.2 + listo * 0.7, ojosRisa: listo * 0.7, mirada: [listo * 0.6, 0.7 - listo * 0.6], cabeza: listo * 6, cejas: listo * 0.4, manoD: listo > 0.05 ? [mezclar(120, 222, choca), mezclar(260, 120, choca)] : null, luzPantalla: 0.5 };
  const poseB: Pose = { boca: 0.3 + listo * 0.65, ojosRisa: listo * 0.8, mirada: [-listo * 0.6, 0.7 - listo * 0.6], cabeza: -listo * 7, cejas: listo * 0.4, manoI: listo > 0.05 ? [mezclar(-120, -226, choca), mezclar(260, 120, choca)] : null, luzPantalla: 0.5 };
  const tw = vertical ? 1000 : 640;
  return (
    <TomaEquipo hora={0.08} zoom={1.03} poseA={poseA} poseB={poseB} xH={800} zoomH={1.2}>
      <div style={{ position: 'absolute', left: vertical ? 40 : 50, top: vertical ? 372 : 190, width: tw, borderRadius: 22, overflow: 'hidden', background: '#1e1e1e', boxShadow: '0 30px 70px rgba(3,8,24,.5)', opacity: st(f, 0, 8), transform: `translateY(${(1 - fr(f, 0, 12)) * -30}px)` }}>
        <div style={{ height: 40, background: '#3c3c3c', display: 'flex', alignItems: 'center', gap: 8, padding: '0 16px' }}>
          {['#f26b5e', '#f5be4f', '#5bc65a'].map((c) => <span key={c} style={{ width: 13, height: 13, borderRadius: 7, background: c }} />)}
          <span style={{ flex: 1, textAlign: 'center', color: '#ccc', fontFamily: FUENTE.marca, fontSize: 18, marginRight: 50 }}>Terminal — lumbre-web</span>
        </div>
        <div style={{ padding: '14px 22px 18px', fontFamily: FUENTE.codigo, fontSize: vertical ? 26 : 19, lineHeight: 1.5, whiteSpace: 'pre', minHeight: vertical ? 250 : 220 }}>
          {DEPLOY.slice(0, Math.ceil(claves(f, [[4, 1], [42, 6]]))).map((l, i) => <div key={i} style={{ color: l.c ?? '#d4d4d4', fontWeight: i === 5 ? 700 : 400 }}>{l.t}</div>)}
        </div>
      </div>
      <Capa dia={7} f={f} />
    </TomaEquipo>
  );
};
