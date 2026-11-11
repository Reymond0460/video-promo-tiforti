// La página web de "Lumbre", el emprendimiento ficticio de la protagonista.
// Es la misma página en todas sus etapas: boceto (alambre), HTML sin estilos, con estilos y terminada,
// en versión de escritorio (1280 px) y de celular (390 px). Así el resultado final es coherente con
// los productos, los colores y la marca que se ven en su taller desde la primera escena.
import React from 'react';
import { FUENTE, LUMBRE } from '../tema';
import { Icono } from './Dispositivos';
import { Definiciones, Llama, Vela } from './Escenario';

export const PRODUCTOS = [
  { nombre: 'Canelo y naranja', nota: 'Especiada y cálida', cera: '#f1dfc2', fondo: '#f3dccb' },
  { nombre: 'Lavanda del sur', nota: 'Floral y serena', cera: '#d8cbe6', fondo: '#e6def0' },
  { nombre: 'Bosque nativo', nota: 'Fresca, a madera y lluvia', cera: '#cfe0c4', fondo: '#dbe6d3' },
  { nombre: 'Miel de ulmo', nota: 'Dulce y suave', cera: '#f3d58e', fondo: '#f6e6bd' },
];

export const ALTO_SITIO = { escritorio: 1700, movil: 1840 };

export const MarcaLumbre: React.FC<{ tam?: number; color?: string }> = ({ tam = 30, color = LUMBRE.cafe }) => (
  <span style={{ display: 'inline-flex', alignItems: 'center', gap: tam * 0.26, fontFamily: FUENTE.serif, fontWeight: 600, fontSize: tam, color, letterSpacing: '-0.02em', lineHeight: 1 }}>
    <svg width={tam * 0.75} height={tam} viewBox="0 0 24 32"><Llama /></svg>
    Lumbre
  </span>
);

const FotoVela: React.FC<{ p: (typeof PRODUCTOS)[number]; alto: number; frame?: number; encendida?: boolean }> = ({ p, alto, frame = 0, encendida = false }) => (
  <div style={{ height: alto, background: `linear-gradient(160deg, ${p.fondo}, #fbf4ea)`, borderRadius: 14, position: 'relative', overflow: 'hidden' }}>
    <svg viewBox="0 0 200 200" width="100%" height="100%" preserveAspectRatio="xMidYMax meet" style={{ position: 'absolute', inset: 0 }}>
      <Definiciones />
      <ellipse cx={100} cy={176} rx={84} ry={12} fill="#fff" opacity={0.6} />
      <Vela x={100} y={172} ancho={84} alto={106} cera={p.cera} encendida={encendida} frame={frame} />
    </svg>
  </div>
);

const Boton: React.FC<{ children: React.ReactNode; color?: string; texto?: string; tam?: number; borde?: boolean; icono?: React.ReactNode; resaltar?: number }> = ({ children, color = LUMBRE.terracota, texto = '#fff', tam = 17, borde = false, icono, resaltar = 0 }) => (
  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 9, padding: `${tam * 0.78}px ${tam * 1.45}px`, borderRadius: 999, background: borde ? 'transparent' : color, border: borde ? `2px solid ${color}` : 'none', color: borde ? color : texto, fontFamily: FUENTE.marca, fontWeight: 700, fontSize: tam, whiteSpace: 'nowrap', transform: `scale(${1 - resaltar * 0.06})`, boxShadow: resaltar ? `0 0 0 ${6 * resaltar}px ${color}33` : 'none' }}>
    {icono}
    {children}
  </span>
);

/** Tarjeta de producto. `cargado` = false muestra el esqueleto de carga (antes de conectar los datos). */
const Tarjeta: React.FC<{ p: (typeof PRODUCTOS)[number]; cargado: boolean; movil: boolean; frame: number; resaltar?: number }> = ({ p, cargado, movil, frame, resaltar = 0 }) => {
  const foto = movil ? 132 : 214;
  if (!cargado) {
    return (
      <div style={{ background: '#fff', borderRadius: 18, padding: movil ? 10 : 14, boxShadow: '0 10px 24px rgba(58,42,32,.07)' }}>
        <div style={{ height: foto, borderRadius: 14, background: 'linear-gradient(100deg,#f0e6d8 30%,#f8f1e7 50%,#f0e6d8 70%)', backgroundSize: '300% 100%', backgroundPosition: `${100 - ((frame * 4) % 200)}% 0` }} />
        <div style={{ height: 14, width: '70%', borderRadius: 7, background: '#efe4d5', marginTop: 14 }} />
        <div style={{ height: 10, width: '45%', borderRadius: 5, background: '#f3eadd', marginTop: 9, marginBottom: 6 }} />
      </div>
    );
  }
  return (
    <div style={{ background: '#fff', borderRadius: 18, padding: movil ? 10 : 14, boxShadow: `0 10px 24px rgba(58,42,32,.08), 0 0 0 ${3 * resaltar}px ${LUMBRE.terracota}` }}>
      <FotoVela p={p} alto={foto} frame={frame} />
      <div style={{ fontFamily: FUENTE.serif, fontWeight: 600, fontSize: movil ? 17 : 21, color: LUMBRE.cafe, marginTop: movil ? 10 : 14, letterSpacing: '-0.01em' }}>{p.nombre}</div>
      <div style={{ fontFamily: FUENTE.marca, fontSize: movil ? 12 : 14, color: LUMBRE.cafeSuave, marginTop: 3 }}>{p.nota}</div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: movil ? 9 : 12 }}>
        <span style={{ fontFamily: FUENTE.marca, fontSize: movil ? 11 : 13, fontWeight: 600, color: LUMBRE.salvia }}>Cera de soya · 220 g</span>
        <span style={{ width: movil ? 30 : 36, height: movil ? 30 : 36, borderRadius: 20, background: LUMBRE.terracota, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontFamily: FUENTE.marca, fontWeight: 700, fontSize: movil ? 20 : 24, lineHeight: 1 }}>+</span>
      </div>
    </div>
  );
};

/**
 * Página de Lumbre.
 * etapa: 'html' (sin estilos) · 'estilo' (diseño aplicado) · 'final' (igual a 'estilo'; se usa en la entrega)
 * productos: cuántas tarjetas ya recibieron sus datos (0..4); el resto se muestra como esqueleto de carga.
 */
export const SitioLumbre: React.FC<{ movil?: boolean; etapa?: 'html' | 'estilo' | 'final'; productos?: number; frame?: number; resaltarBoton?: number; resaltarProducto?: number }> = ({
  movil = false, etapa = 'final', productos = 4, frame = 0, resaltarBoton = 0, resaltarProducto = -1,
}) => {
  const w = movil ? 390 : 1280;
  if (etapa === 'html') {
    return (
      <div style={{ width: w, minHeight: movil ? 844 : 800, background: '#fff', padding: movil ? 14 : 22, boxSizing: 'border-box', fontFamily: '"Times New Roman", "Liberation Serif", Times, serif', fontSize: movil ? 17 : 21, color: '#000', lineHeight: 1.35 }}>
        <div style={{ fontSize: '2em', fontWeight: 700, margin: '0.4em 0' }}>Lumbre</div>
        <div style={{ color: '#0000ee', textDecoration: 'underline' }}>Velas &nbsp; Nosotras &nbsp; Contacto</div>
        <div style={{ fontSize: '1.5em', fontWeight: 700, margin: '0.7em 0 0.3em' }}>Velas hechas a mano, con calma.</div>
        <div>Cera de soya, aromas del sur de Chile y mucho cariño en cada frasco.</div>
        <div style={{ margin: '0.6em 0' }}><span style={{ border: '2px outset #767676', background: '#efefef', padding: '1px 7px', fontFamily: 'Arial, "Liberation Sans", sans-serif', fontSize: '0.75em' }}>Ver velas</span></div>
        <div style={{ fontSize: '1.5em', fontWeight: 700, margin: '0.7em 0 0.3em' }}>Nuestras velas</div>
        <ul style={{ margin: 0, paddingLeft: 40 }}>{PRODUCTOS.map((p) => <li key={p.nombre}>{p.nombre}</li>)}</ul>
        <div style={{ fontSize: '1.5em', fontWeight: 700, margin: '0.7em 0 0.3em' }}>Contacto</div>
        <div style={{ color: '#0000ee', textDecoration: 'underline' }}>Escríbenos por WhatsApp</div>
      </div>
    );
  }
  const px = movil ? 20 : 72;
  return (
    <div style={{ width: w, height: movil ? ALTO_SITIO.movil : ALTO_SITIO.escritorio, background: LUMBRE.crema, fontFamily: FUENTE.marca, color: LUMBRE.cafe, position: 'relative', overflow: 'hidden' }}>
      {/* encabezado */}
      <div style={{ height: movil ? 104 : 84, padding: movil ? `46px ${px}px 0` : `0 ${px}px`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxSizing: 'border-box' }}>
        <MarcaLumbre tam={movil ? 27 : 32} />
        {movil ? (
          <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}><Icono n="carro" color={LUMBRE.cafe} tam={24} /><Icono n="menu" color={LUMBRE.cafe} tam={26} /></div>
        ) : (
          <div style={{ display: 'flex', gap: 38, alignItems: 'center', fontWeight: 600, fontSize: 17 }}>
            <span style={{ color: LUMBRE.terracota }}>Velas</span><span>Nuestra historia</span><span>Contacto</span>
            <Boton tam={15} icono={<Icono n="carro" color="#fff" tam={18} />}>Mi pedido</Boton>
          </div>
        )}
      </div>

      {/* portada */}
      <div style={{ padding: movil ? `22px ${px}px 0` : `44px ${px}px 0`, display: 'flex', flexDirection: movil ? 'column' : 'row', gap: movil ? 22 : 50, alignItems: 'center' }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'inline-block', padding: '7px 14px', borderRadius: 20, background: '#fff', color: LUMBRE.terracota, fontWeight: 700, fontSize: movil ? 12 : 14, letterSpacing: '.06em', textTransform: 'uppercase' }}>Hechas a mano en el sur de Chile</div>
          <div style={{ fontFamily: FUENTE.serif, fontWeight: 600, fontSize: movil ? 43 : 74, lineHeight: 1.03, letterSpacing: '-0.03em', margin: movil ? '16px 0 12px' : '22px 0 18px' }}>
            Velas hechas a mano, <span style={{ color: LUMBRE.terracota, fontStyle: 'italic' }}>con calma.</span>
          </div>
          <div style={{ fontSize: movil ? 16 : 21, lineHeight: 1.5, color: LUMBRE.cafeSuave, maxWidth: 480 }}>Cera de soya, aromas del sur y mucho cariño en cada frasco.</div>
          <div style={{ display: 'flex', gap: 12, marginTop: movil ? 20 : 30 }}>
            <Boton tam={movil ? 15 : 18} resaltar={resaltarBoton}>Ver velas</Boton>
            <Boton tam={movil ? 15 : 18} borde>Nuestra historia</Boton>
          </div>
        </div>
        <div style={{ width: movil ? '100%' : 520, height: movil ? 250 : 430, borderRadius: 28, background: `linear-gradient(150deg, ${LUMBRE.cremaOscura}, #e9c9a8)`, position: 'relative', overflow: 'hidden', flexShrink: 0 }}>
          <svg viewBox="0 0 520 430" width="100%" height="100%" preserveAspectRatio="xMidYMax slice" style={{ position: 'absolute', inset: 0 }}>
            <Definiciones />
            <circle cx={380} cy={110} r={150} fill="#fff" opacity={0.22} />
            <rect x={0} y={350} width={520} height={80} fill="#c99a6b" />
            <rect x={0} y={350} width={520} height={6} fill="#e4bb8e" />
            <Vela x={170} y={372} ancho={150} alto={190} cera="#f1dfc2" encendida frame={frame} semilla={2} />
            <Vela x={330} y={384} ancho={112} alto={132} cera="#d8cbe6" tapa />
            <Vela x={436} y={376} ancho={90} alto={104} cera="#cfe0c4" encendida frame={frame} semilla={5} />
          </svg>
        </div>
      </div>

      {/* productos */}
      <div style={{ padding: movil ? `40px ${px}px 0` : `70px ${px}px 0` }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
          <div style={{ fontFamily: FUENTE.serif, fontWeight: 600, fontSize: movil ? 28 : 42, letterSpacing: '-0.02em' }}>Nuestras velas</div>
          {movil ? null : <div style={{ fontWeight: 700, color: LUMBRE.terracota, fontSize: 17 }}>Ver todas →</div>}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: movil ? '1fr 1fr' : 'repeat(4, 1fr)', gap: movil ? 12 : 22, marginTop: movil ? 16 : 26 }}>
          {PRODUCTOS.map((p, i) => <Tarjeta key={p.nombre} p={p} cargado={etapa === 'final' ? true : i < productos} movil={movil} frame={frame} resaltar={resaltarProducto === i ? 1 : 0} />)}
        </div>
      </div>

      {/* historia */}
      <div style={{ margin: movil ? `40px ${px}px 0` : `70px ${px}px 0`, padding: movil ? 24 : 44, borderRadius: 28, background: LUMBRE.salvia, color: '#fff', display: 'flex', flexDirection: movil ? 'column' : 'row', gap: movil ? 12 : 44, alignItems: movil ? 'flex-start' : 'center' }}>
        <div style={{ fontFamily: FUENTE.serif, fontWeight: 600, fontSize: movil ? 26 : 38, lineHeight: 1.1, flex: 1, letterSpacing: '-0.02em' }}>Un taller pequeño,<br />una vela a la vez.</div>
        <div style={{ flex: 1.3, fontSize: movil ? 15 : 19, lineHeight: 1.55, opacity: 0.95 }}>Lumbre nació en una mesa de cocina. Cada vela se vierte, se etiqueta y se envuelve a mano, sin apuro.</div>
      </div>

      {/* contacto */}
      <div style={{ padding: movil ? `40px ${px}px 0` : `64px ${px}px 0`, textAlign: 'center' }}>
        <div style={{ fontFamily: FUENTE.serif, fontWeight: 600, fontSize: movil ? 28 : 40, letterSpacing: '-0.02em' }}>¿Buscas un aroma especial?</div>
        <div style={{ fontSize: movil ? 15 : 19, color: LUMBRE.cafeSuave, margin: '10px 0 22px' }}>Escríbenos y armamos tu pedido.</div>
        <Boton color="#25a55a" tam={movil ? 16 : 19} icono={<Icono n="whatsapp" color="#fff" tam={movil ? 20 : 24} />}>Pedir por WhatsApp</Boton>
      </div>
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: movil ? 74 : 70, background: LUMBRE.cafe, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: `0 ${px}px`, boxSizing: 'border-box' }}>
        <MarcaLumbre tam={movil ? 20 : 22} color="#f7efe4" />
        <span style={{ color: '#cdbba9', fontSize: movil ? 12 : 14 }}>Velas artesanales · Chile</span>
      </div>
    </div>
  );
};

/** Boceto de alambre de la misma página (lo que se dibuja en la reunión). `avance` 0..1 va dibujando los bloques. */
export const SitioAlambre: React.FC<{ movil?: boolean; avance?: number }> = ({ movil = false, avance = 1 }) => {
  const w = movil ? 390 : 1280;
  const h = movil ? 844 : 800;
  const gris = '#c5cedb';
  const linea = '#8e9bb0';
  const bloques: Array<{ x: number; y: number; w: number; h: number; r?: number; cruz?: boolean; fino?: boolean }> = movil
    ? [
        { x: 20, y: 58, w: 110, h: 26, r: 6 }, { x: 330, y: 58, w: 40, h: 26, r: 6 },
        { x: 20, y: 118, w: 190, h: 16, r: 8, fino: true }, { x: 20, y: 150, w: 330, h: 34, r: 6 }, { x: 20, y: 194, w: 250, h: 34, r: 6 },
        { x: 20, y: 246, w: 300, h: 12, r: 6, fino: true }, { x: 20, y: 268, w: 220, h: 12, r: 6, fino: true },
        { x: 20, y: 302, w: 120, h: 42, r: 21 }, { x: 150, y: 302, w: 150, h: 42, r: 21, fino: true },
        { x: 20, y: 372, w: 350, h: 200, r: 18, cruz: true },
        { x: 20, y: 606, w: 180, h: 24, r: 6 },
        { x: 20, y: 648, w: 169, h: 180, r: 14, cruz: true }, { x: 201, y: 648, w: 169, h: 180, r: 14, cruz: true },
      ]
    : [
        { x: 72, y: 26, w: 150, h: 32, r: 6 }, { x: 760, y: 32, w: 90, h: 18, r: 9, fino: true }, { x: 880, y: 32, w: 120, h: 18, r: 9, fino: true }, { x: 1030, y: 32, w: 90, h: 18, r: 9, fino: true }, { x: 1150, y: 22, w: 60, h: 40, r: 20 },
        { x: 72, y: 150, w: 260, h: 20, r: 10, fino: true }, { x: 72, y: 196, w: 540, h: 56, r: 8 }, { x: 72, y: 266, w: 420, h: 56, r: 8 },
        { x: 72, y: 350, w: 460, h: 16, r: 8, fino: true }, { x: 72, y: 378, w: 340, h: 16, r: 8, fino: true },
        { x: 72, y: 430, w: 150, h: 54, r: 27 }, { x: 236, y: 430, w: 200, h: 54, r: 27, fino: true },
        { x: 690, y: 120, w: 518, h: 400, r: 26, cruz: true },
        { x: 72, y: 580, w: 280, h: 34, r: 8 },
        ...[0, 1, 2, 3].map((i) => ({ x: 72 + i * 290, y: 640, w: 266, h: 160, r: 16, cruz: true })),
      ];
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{ background: '#fdfefe', display: 'block' }}>
      {bloques.map((b, i) => {
        const t = Math.min(1, Math.max(0, avance * (bloques.length + 2) - i));
        if (t <= 0) return null;
        const per = 2 * (b.w + b.h);
        return (
          <g key={i} opacity={Math.min(1, t * 2)}>
            <rect x={b.x} y={b.y} width={b.w} height={b.h} rx={b.r ?? 4} fill={b.fino ? 'none' : gris} fillOpacity={b.cruz ? 0.35 : 0.9 * t} stroke={linea} strokeWidth={2.5} strokeDasharray={per} strokeDashoffset={per * (1 - t)} />
            {b.cruz && t > 0.6 ? <path d={`M ${b.x + 14} ${b.y + 14} L ${b.x + b.w - 14} ${b.y + b.h - 14} M ${b.x + b.w - 14} ${b.y + 14} L ${b.x + 14} ${b.y + b.h - 14}`} stroke={linea} strokeWidth={2} opacity={(t - 0.6) * 1.6} /> : null}
          </g>
        );
      })}
    </svg>
  );
};
