// Red social genérica que revisa la protagonista (no imita ninguna aplicación ni usa marcas reales,
// salvo la publicación de TiforTi, que usa su logo y su mensaje).
import React from 'react';
import { Img, staticFile } from 'remotion';
import { FUENTE, TIFORTI } from '../tema';
import { Icono, PANTALLA } from './Dispositivos';

export const ALTO_POST = 524;
const IMAGEN = 340;

const Avatar: React.FC<{ letra: string; color: string }> = ({ letra, color }) => (
  <div style={{ width: 38, height: 38, borderRadius: 19, background: color, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FUENTE.marca, fontWeight: 800, fontSize: 17 }}>{letra}</div>
);

const Post: React.FC<{ avatar: React.ReactNode; nombre: string; bajada: string; pie: React.ReactNode; children: React.ReactNode; gusta?: boolean }> = ({ avatar, nombre, bajada, pie, children, gusta }) => (
  <div style={{ height: ALTO_POST - 12, background: '#fff', marginBottom: 12 }}>
    <div style={{ height: 58, display: 'flex', alignItems: 'center', gap: 10, padding: '0 14px' }}>
      {avatar}
      <div style={{ flex: 1 }}>
        <div style={{ fontFamily: FUENTE.marca, fontWeight: 700, fontSize: 15, color: '#10203b' }}>{nombre}</div>
        <div style={{ fontFamily: FUENTE.marca, fontSize: 12, color: '#7b879a' }}>{bajada}</div>
      </div>
      <span style={{ color: '#7b879a', fontSize: 20, letterSpacing: 2 }}>···</span>
    </div>
    <div style={{ height: IMAGEN, position: 'relative', overflow: 'hidden' }}>{children}</div>
    <div style={{ height: 48, display: 'flex', alignItems: 'center', gap: 16, padding: '0 14px' }}>
      <Icono n="corazon" tam={26} color={gusta ? '#e0245e' : '#10203b'} relleno={gusta ? '#e0245e' : 'none'} />
      <Icono n="comentario" tam={26} />
      <Icono n="enviar" tam={25} />
      <span style={{ flex: 1 }} />
      <Icono n="guardar" tam={25} />
    </div>
    <div style={{ padding: '0 14px', fontFamily: FUENTE.marca, fontSize: 14, lineHeight: 1.35, color: '#28344a' }}>{pie}</div>
  </div>
);

const Plantillas = (
  <div style={{ position: 'absolute', inset: 0, background: '#e6eaf0', padding: 18, boxSizing: 'border-box' }}>
    <div style={{ fontFamily: FUENTE.marca, fontWeight: 800, fontSize: 21, color: '#3d4a5e' }}>200 plantillas listas</div>
    <div style={{ fontFamily: FUENTE.marca, fontSize: 13, color: '#6c7889', marginBottom: 10 }}>Elige una y cambia el logo.</div>
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
      {Array.from({ length: 6 }, (_, i) => (
        <div key={i} style={{ height: 112, background: '#fff', borderRadius: 6, padding: 7, boxSizing: 'border-box', boxShadow: '0 2px 6px rgba(0,0,0,.08)' }}>
          <div style={{ height: 7, width: '45%', background: '#b8c1ce', borderRadius: 3 }} />
          <div style={{ height: 40, background: '#d4dae3', borderRadius: 4, margin: '7px 0' }} />
          <div style={{ height: 5, background: '#d4dae3', borderRadius: 3, marginBottom: 5 }} />
          <div style={{ height: 5, width: '70%', background: '#d4dae3', borderRadius: 3, marginBottom: 7 }} />
          <div style={{ height: 12, width: '50%', background: '#9aa6b6', borderRadius: 6 }} />
        </div>
      ))}
    </div>
  </div>
);

const Agencia = (
  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(160deg,#20232b,#0f1115)', padding: 24, boxSizing: 'border-box', color: '#fff', fontFamily: FUENTE.marca }}>
    <div style={{ fontSize: 12, letterSpacing: '.22em', color: '#c9a45c', fontWeight: 700 }}>SOLUCIONES CORPORATIVAS</div>
    <div style={{ fontSize: 31, fontWeight: 800, lineHeight: 1.08, margin: '14px 0 16px', letterSpacing: '-0.02em' }}>Plataformas web para grandes empresas</div>
    {['Planes Enterprise', 'Contrato mínimo de 12 meses', 'Cotización en 15 días hábiles'].map((t) => (
      <div key={t} style={{ display: 'flex', alignItems: 'center', gap: 9, fontSize: 15, color: '#c8ccd4', marginBottom: 9 }}><span style={{ width: 6, height: 6, borderRadius: 3, background: '#c9a45c' }} />{t}</div>
    ))}
    <div style={{ position: 'absolute', left: 24, bottom: 22, padding: '10px 18px', border: '1.5px solid #c9a45c', color: '#c9a45c', fontWeight: 700, fontSize: 14, borderRadius: 4 }}>SOLICITAR PROPUESTA</div>
  </div>
);

const Curso = (
  <div style={{ position: 'absolute', inset: 0, background: '#fff5d9', padding: 22, boxSizing: 'border-box', fontFamily: FUENTE.marca, color: '#3b3320' }}>
    <div style={{ fontSize: 27, fontWeight: 800, lineHeight: 1.1, letterSpacing: '-0.02em' }}>Haz tu página web tú mismo</div>
    <div style={{ fontSize: 14, margin: '6px 0 12px', color: '#7a6c45' }}>Curso completo · 47 lecciones</div>
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
      {['Hosting', 'Dominio y DNS', 'Certificado SSL', 'Plugins', 'Base de datos', 'SEO técnico', 'Respaldos', 'Seguridad', 'Pasarela de pago', 'Caché'].map((t) => (
        <span key={t} style={{ padding: '6px 11px', borderRadius: 14, background: '#fff', border: '1px solid #e3d5a4', fontSize: 13, fontWeight: 600 }}>{t}</span>
      ))}
    </div>
    <div style={{ position: 'absolute', right: 20, bottom: 18, fontSize: 13, color: '#7a6c45', fontWeight: 700 }}>… y 37 temas más</div>
  </div>
);

const Tiforti = (
  <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(155deg, ${TIFORTI.nocheMedia}, ${TIFORTI.noche})`, padding: 26, boxSizing: 'border-box', fontFamily: FUENTE.marca, color: '#fff', overflow: 'hidden' }}>
    <div style={{ position: 'absolute', right: -90, top: -90, width: 320, height: 320, borderRadius: '50%', background: 'radial-gradient(circle, rgba(34,211,238,.35), rgba(34,211,238,0) 68%)' }} />
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <Img src={staticFile('marca/logo-ti.png')} style={{ width: 44, height: 44 }} />
      <span style={{ fontWeight: 800, fontSize: 26, letterSpacing: '-0.05em' }}>TiforTi</span>
    </div>
    <div style={{ fontWeight: 800, fontSize: 40, lineHeight: 1.04, letterSpacing: '-0.04em', marginTop: 34 }}>Tú tienes la idea.</div>
    <div style={{ fontWeight: 800, fontSize: 40, lineHeight: 1.04, letterSpacing: '-0.04em', color: TIFORTI.cian, marginTop: 6 }}>Nosotros la hacemos realidad.</div>
    <div style={{ position: 'absolute', left: 26, bottom: 24, padding: '9px 16px', borderRadius: 20, background: 'rgba(255,255,255,.12)', fontWeight: 700, fontSize: 15 }}>Páginas web a tu medida</div>
  </div>
);

export const N_POSTS = 5;

/** Contenido de la pantalla del celular: la red social. `scroll` en px lógicos. `gusta` marca "me gusta" en la publicación de TiforTi. */
export const Feed: React.FC<{ scroll: number; gusta?: boolean; brilloTiforti?: number }> = ({ scroll, gusta, brilloTiforti = 0 }) => (
  <div style={{ width: PANTALLA.w, height: PANTALLA.h, background: '#f1f3f6', position: 'relative', overflow: 'hidden' }}>
    <div style={{ position: 'absolute', top: 98 - scroll, left: 0, right: 0 }}>
      <Post avatar={<Avatar letra="P" color="#9aa6b6" />} nombre="Plantillas web" bajada="Publicidad" pie={<><b>Plantillas web</b> Tu sitio en 5 minutos. Igual al de todos.</>}>{Plantillas}</Post>
      <Post avatar={<Avatar letra="A" color="#2b2f38" />} nombre="Agencia digital" bajada="Publicidad" pie={<><b>Agencia digital</b> Proyectos desde nivel corporativo.</>}>{Agencia}</Post>
      <Post avatar={<Avatar letra="C" color="#d9a514" />} nombre="Curso online" bajada="Publicidad" pie={<><b>Curso online</b> Aprende todo lo técnico por tu cuenta.</>}>{Curso}</Post>
      <div style={{ boxShadow: `0 0 0 ${3 * brilloTiforti}px ${TIFORTI.cian}, 0 0 ${50 * brilloTiforti}px rgba(34,211,238,${0.55 * brilloTiforti})`, position: 'relative', zIndex: 2 }}>
        <Post gusta={gusta} avatar={<Img src={staticFile('marca/logo-ti.png')} style={{ width: 38, height: 38 }} />} nombre="tiforti.cl" bajada="Desarrollo web · Chile" pie={<><b>tiforti.cl</b> Páginas web a tu medida para emprendedores y pymes. Conversemos tu idea.</>}>{Tiforti}</Post>
      </div>
      <Post avatar={<Avatar letra="M" color="#c2613a" />} nombre="Feria de diseño" bajada="Sugerencia para ti" pie={<><b>Feria de diseño</b> Este fin de semana, emprendedores locales.</>}>
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(160deg,#f3d9c4,#e9b08c)' }} />
      </Post>
    </div>
    {/* barra superior de la app */}
    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 98, background: 'rgba(255,255,255,.97)', borderBottom: '1px solid #e4e8ee', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', gap: 34, paddingBottom: 12, boxSizing: 'border-box', fontFamily: FUENTE.marca, fontSize: 17 }}>
      <span style={{ fontWeight: 800, color: '#10203b', borderBottom: '3px solid #10203b', paddingBottom: 4 }}>Para ti</span>
      <span style={{ fontWeight: 600, color: '#8a94a6', paddingBottom: 7 }}>Siguiendo</span>
    </div>
  </div>
);
