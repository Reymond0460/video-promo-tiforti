// Escenografías ilustradas. Todo se dibuja sobre un lienzo cuadrado de 1920 x 1920:
// el video vertical muestra la columna central (x 420–1500) y el horizontal la franja central (y 420–1500),
// por eso lo importante de cada toma vive en el cuadrado central de 1080 x 1080.
import React from 'react';
import { AbsoluteFill, Img, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import { FUENTE, LUMBRE, TIFORTI } from '../tema';
import { azar, deriva, limitar, mezclarColor } from '../util';

export const LADO = 1920;

/** Lienzo cuadrado centrado con "cámara": zoom, paneo y un leve pulso de cámara en mano. */
export const Escenario: React.FC<{
  zoom?: number; // 1 = encuadre completo
  x?: number; // punto del lienzo que queda al centro del cuadro
  y?: number;
  mano?: number; // intensidad del movimiento de cámara en mano
  children: React.ReactNode;
  fondo?: string;
}> = ({ zoom = 1, x = 960, y = 960, mano = 1, children, fondo = '#000' }) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const base = Math.max(width, height) / LADO;
  const dx = deriva(frame, 3, 0.8) * 5 * mano;
  const dy = deriva(frame, 8, 0.7) * 4 * mano;
  const giro = deriva(frame, 5, 0.5) * 0.12 * mano;
  const s = base * zoom * 1.012; // un pelo de margen para que el pulso no muestre bordes
  return (
    <AbsoluteFill style={{ background: fondo, overflow: 'hidden' }}>
      <svg
        width={LADO}
        height={LADO}
        viewBox={`0 0 ${LADO} ${LADO}`}
        style={{
          position: 'absolute',
          left: width / 2 - LADO / 2,
          top: height / 2 - LADO / 2,
          transform: `translate(${dx}px, ${dy}px) rotate(${giro}deg) scale(${s}) translate(${960 - x}px, ${960 - y}px)`,
          transformOrigin: '50% 50%',
        }}
      >
        {children}
      </svg>
    </AbsoluteFill>
  );
};

// ------------------------------------------------------------------ utilería

/** Isotipo de Lumbre: una llama. Se dibuja en una caja de 24 x 32. */
export const Llama: React.FC<{ x?: number; y?: number; alto?: number; color?: string }> = ({ x = 0, y = 0, alto = 32, color = LUMBRE.terracota }) => (
  <g transform={`translate(${x} ${y}) scale(${alto / 32})`}>
    <path d="M12 0 C13 7 23 13 23 21.5 A11 10.5 0 0 1 1 21.5 C1 16 5 13 6.5 8.5 C8.5 11 10 11.5 12 0 Z" fill={color} />
    <path d="M12 15 C13 19 17 20.5 17 24.5 A5 5 0 0 1 7 24.5 C7 21.5 10.5 19.5 12 15 Z" fill="#fff" opacity={0.55} />
  </g>
);

/** Vela en frasco de vidrio con etiqueta de Lumbre. (x, y) = centro de la base. */
export const Vela: React.FC<{
  x: number; y: number; ancho?: number; alto?: number; cera?: string; etiqueta?: string; encendida?: boolean; frame?: number; tapa?: boolean; semilla?: number;
}> = ({ x, y, ancho = 96, alto = 120, cera = '#f3e3c8', etiqueta = LUMBRE.crema, encendida = false, frame = 0, tapa = false, semilla = 0 }) => {
  const w = ancho;
  const h = alto;
  const baile = encendida ? 1 + Math.sin(frame * 0.5 + semilla) * 0.06 + Math.sin(frame * 0.23 + semilla * 2) * 0.05 : 1;
  const lean = encendida ? Math.sin(frame * 0.17 + semilla) * 4 : 0;
  return (
    <g transform={`translate(${x} ${y})`}>
      <ellipse cx={0} cy={2} rx={w * 0.62} ry={9} fill="#000" opacity={0.13} />
      {encendida ? <circle cx={0} cy={-h - 20} r={w * 1.25} fill="url(#brilloVela)" opacity={0.75 * baile} /> : null}
      {/* cera */}
      <rect x={-w / 2 + 5} y={-h + h * 0.2} width={w - 10} height={h * 0.8 - 5} rx={10} fill={cera} />
      {/* vidrio */}
      <rect x={-w / 2} y={-h} width={w} height={h} rx={14} fill="#ffffff" opacity={0.3} />
      <rect x={-w / 2} y={-h} width={w} height={h} rx={14} fill="none" stroke="#ffffff" strokeWidth={3} opacity={0.75} />
      <rect x={-w / 2 + 9} y={-h + 12} width={7} height={h - 30} rx={3.5} fill="#fff" opacity={0.55} />
      {/* etiqueta */}
      <rect x={-w * 0.36} y={-h * 0.62} width={w * 0.72} height={h * 0.42} rx={5} fill={etiqueta} />
      <Llama x={-w * 0.09} y={-h * 0.58} alto={h * 0.2} />
      <rect x={-w * 0.22} y={-h * 0.33} width={w * 0.44} height={3.5} rx={1.5} fill={LUMBRE.cafe} opacity={0.7} />
      <rect x={-w * 0.14} y={-h * 0.27} width={w * 0.28} height={2.5} rx={1.2} fill={LUMBRE.cafe} opacity={0.4} />
      {tapa ? (
        <rect x={-w / 2 - 3} y={-h - 16} width={w + 6} height={20} rx={6} fill="#c9a36f" />
      ) : (
        <>
          <rect x={-1.5} y={-h * 0.8 - 13} width={3} height={15} fill="#4a3b30" />
          {encendida ? (
            <g transform={`translate(${lean * 0.4} ${-h * 0.8 - 12}) scale(${1} ${baile}) rotate(${lean})`}>
              <path d="M0 -40 C7 -26 13 -18 13 -9 A13 12 0 0 1 -13 -9 C-13 -18 -7 -26 0 -40 Z" fill="#f6a43a" />
              <path d="M0 -24 C4 -17 7 -12 7 -7 A7 7 0 0 1 -7 -7 C-7 -12 -4 -17 0 -24 Z" fill="#fff3c4" />
            </g>
          ) : null}
        </>
      )}
    </g>
  );
};

export const Taza: React.FC<{ x: number; y: number; color?: string; frame?: number; vapor?: boolean; escala?: number }> = ({ x, y, color = '#f4ead9', frame = 0, vapor = true, escala = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${escala})`}>
    <ellipse cx={0} cy={2} rx={46} ry={8} fill="#000" opacity={0.13} />
    <path d="M36 -62 C70 -66 70 -18 34 -22" fill="none" stroke={color} strokeWidth={12} strokeLinecap="round" />
    <path d="M-38 -84 L38 -84 L32 -6 C31 0 -31 0 -32 -6 Z" fill={color} />
    <path d="M-38 -84 L-22 -84 L-18 -3 C-26 -3 -31 -3 -32 -6 Z" fill="#000" opacity={0.07} />
    <ellipse cx={0} cy={-84} rx={38} ry={7} fill="#5a3a28" />
    {vapor
      ? [0, 1].map((i) => {
          const t = ((frame + i * 38) % 76) / 76;
          return (
            <path key={i} d={`M ${-10 + i * 20} ${-96 - t * 46} q 9 -12 0 -24 q -9 -12 0 -24`} fill="none" stroke="#fff" strokeWidth={5} strokeLinecap="round" opacity={0.42 * Math.sin(Math.PI * t)} />
          );
        })
      : null}
  </g>
);

/** Notebook visto por detrás (la persona queda mirando la pantalla). (x, y) = centro de la base. */
export const NotebookAtras: React.FC<{ x: number; y: number; ancho?: number; color?: string; logo?: boolean; brillo?: number; pegatina?: React.ReactNode }> = ({
  x, y, ancho = 330, color = '#b9c1cb', logo = false, brillo = 0.5, pegatina,
}) => {
  const w = ancho;
  const h = w * 0.64;
  return (
    <g transform={`translate(${x} ${y})`}>
      <ellipse cx={0} cy={6} rx={w * 0.6} ry={12} fill="#000" opacity={0.15} />
      {/* resplandor de la pantalla hacia quien la mira */}
      <ellipse cx={0} cy={-h - 6} rx={w * 0.62} ry={34} fill="#cfe8ff" opacity={0.22 * brillo} />
      <path d={`M ${-w / 2} ${-h} Q ${-w / 2} ${-h - 14} ${-w / 2 + 14} ${-h - 14} L ${w / 2 - 14} ${-h - 14} Q ${w / 2} ${-h - 14} ${w / 2} ${-h} L ${w / 2 + 8} -8 L ${-w / 2 - 8} -8 Z`} fill={color} />
      <path d={`M ${-w / 2} ${-h} Q ${-w / 2} ${-h - 14} ${-w / 2 + 14} ${-h - 14} L ${-w / 2 + 60} ${-h - 14} L ${-w / 2 + 30} -8 L ${-w / 2 - 8} -8 Z`} fill="#fff" opacity={0.12} />
      <rect x={-w / 2 - 22} y={-10} width={w + 44} height={13} rx={6} fill={mezclarColor('#000000', color.startsWith('#') ? color : '#b9c1cb', 0.78)} />
      {logo ? <image href={staticFile('marca/logo-ti.png')} x={-30} y={-h / 2 - 34} width={60} height={60} /> : null}
      {pegatina ? <g transform={`translate(0 ${-h / 2 - 8})`}>{pegatina}</g> : null}
    </g>
  );
};

export const Planta: React.FC<{ x: number; y: number; escala?: number; frame?: number; maceta?: string }> = ({ x, y, escala = 1, frame = 0, maceta = '#c9805a' }) => {
  const hojas = [[-70, -170, -24], [-36, -220, -10], [0, -240, 2], [38, -214, 14], [72, -160, 28], [-18, -150, -6], [22, -146, 8]];
  return (
    <g transform={`translate(${x} ${y}) scale(${escala})`}>
      <ellipse cx={0} cy={2} rx={60} ry={9} fill="#000" opacity={0.12} />
      {hojas.map(([hx, hy, r], i) => (
        <g key={i} transform={`rotate(${r + Math.sin(frame / 40 + i) * 1.5})`}>
          <path d={`M 0 -70 Q ${hx * 0.5 - 18} ${hy * 0.6} ${hx} ${hy} Q ${hx * 0.5 + 22} ${hy * 0.55} 0 -70 Z`} fill={i % 2 ? '#6f8f62' : '#5b7b52'} />
        </g>
      ))}
      <path d="M-48 -84 L48 -84 L38 0 L-38 0 Z" fill={maceta} />
      <rect x={-54} y={-92} width={108} height={18} rx={6} fill={mezclarColor(maceta, '#000000', 0.12)} />
    </g>
  );
};

const Caja: React.FC<{ x: number; y: number; w: number; h: number; cinta?: boolean }> = ({ x, y, w, h, cinta = true }) => (
  <g transform={`translate(${x} ${y})`}>
    <rect x={-w / 2} y={-h} width={w} height={h} rx={5} fill="#cfa877" />
    <rect x={-w / 2} y={-h} width={w} height={h * 0.16} fill="#000" opacity={0.08} />
    {cinta ? <rect x={-9} y={-h} width={18} height={h} fill="#e9d2a8" opacity={0.75} /> : null}
    <Llama x={w * 0.22} y={-h * 0.5} alto={h * 0.3} color={LUMBRE.cafe} />
  </g>
);

/** Luces de guirnalda en la pared (ambiente del taller). */
const Guirnalda: React.FC<{ frame: number; encendidas: number }> = ({ frame, encendidas }) => {
  const puntos = Array.from({ length: 15 }, (_, i) => {
    const t = i / 14;
    const x = 380 + t * 1160;
    const y = 150 + Math.sin(t * Math.PI * 3) * 34 + 26 * Math.sin(t * Math.PI);
    return [x, y] as const;
  });
  return (
    <g>
      <path d={`M ${puntos.map((p) => p.join(' ')).join(' L ')}`} fill="none" stroke="#6b5444" strokeWidth={3} opacity={0.7} />
      {puntos.map(([x, y], i) => {
        const brillo = encendidas * (0.85 + 0.15 * Math.sin(frame / 14 + i * 1.9));
        return (
          <g key={i}>
            <circle cx={x} cy={y + 16} r={46} fill="url(#brilloVela)" opacity={0.55 * brillo} />
            <ellipse cx={x} cy={y + 16} rx={9} ry={12} fill={mezclarColor('#d8c7ae', '#ffe9b0', brillo)} />
          </g>
        );
      })}
    </g>
  );
};

/** Definiciones compartidas (degradados). Debe ir dentro del <svg>. */
export const Definiciones: React.FC = () => (
  <defs>
    <radialGradient id="brilloVela">
      <stop offset="0" stopColor="#ffd98a" stopOpacity={0.9} />
      <stop offset="0.45" stopColor="#ffc46a" stopOpacity={0.3} />
      <stop offset="1" stopColor="#ffc46a" stopOpacity={0} />
    </radialGradient>
    <radialGradient id="brilloPantalla">
      <stop offset="0" stopColor="#d6ecff" stopOpacity={0.85} />
      <stop offset="1" stopColor="#d6ecff" stopOpacity={0} />
    </radialGradient>
    <linearGradient id="madera" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stopColor="#d2a273" />
      <stop offset="1" stopColor="#a87a4f" />
    </linearGradient>
    <linearGradient id="maderaClara" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stopColor="#e6d3b8" />
      <stop offset="1" stopColor="#c4ab8a" />
    </linearGradient>
    <linearGradient id="rayoSol" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stopColor="#fff2cf" stopOpacity={0.55} />
      <stop offset="1" stopColor="#fff2cf" stopOpacity={0} />
    </linearGradient>
  </defs>
);

// ------------------------------------------------------------------ taller de Camila

export const MESA_Y = 1150; // borde lejano de la mesa

/**
 * Taller de la emprendedora. `tarde` 0 = día luminoso · 1 = tarde cálida (guirnalda y velas encendidas).
 * `persona` se dibuja detrás de la mesa y `sobreMesa` por delante (brazos, objetos en uso).
 */
export const Taller: React.FC<{
  frame: number;
  tarde?: number;
  persona?: React.ReactNode;
  sobreMesa?: React.ReactNode;
  notebook?: 'cerrado' | 'atras' | 'no';
  taza?: boolean;
  velaEncendida?: boolean;
  uid?: string; // sufijo para los degradados cuando hay más de un taller en pantalla
}> = ({ frame, tarde = 1, persona, sobreMesa, notebook = 'atras', taza = true, velaEncendida = true, uid = 'a' }) => {
  const pared = mezclarColor('#f1e2cf', '#e5cdb1', tarde);
  const pared2 = mezclarColor('#ead6bd', '#d6b894', tarde);
  return (
    <g>
      <Definiciones />
      <defs>
        <linearGradient id={`paredTaller${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={pared} />
          <stop offset="1" stopColor={pared2} />
        </linearGradient>
      </defs>
      <rect width={LADO} height={LADO} fill={`url(#paredTaller${uid})`} />

      {/* ventana (solo se ve en horizontal) */}
      <g transform="translate(70 330)">
        <rect x={-16} y={-16} width={322} height={592} rx={10} fill="#f8f1e6" />
        <rect width={290} height={560} fill={mezclarColor('#cfe8fb', '#f6c48d', tarde)} />
        <rect y={330} width={290} height={230} fill={mezclarColor('#b9dcc0', '#d99a6c', tarde)} opacity={0.7} />
        <rect x={139} width={12} height={560} fill="#f8f1e6" />
        <rect y={270} width={290} height={12} fill="#f8f1e6" />
        <path d="M-40 -40 L70 -40 C60 200 20 420 -40 610 Z" fill="#f3e6d2" opacity={0.95} />
      </g>
      {/* luz que entra */}
      <path d="M 300 300 L 760 300 L 1500 1150 L 760 1150 Z" fill="url(#rayoSol)" opacity={0.5 - tarde * 0.25} />

      <Guirnalda frame={frame} encendidas={0.25 + tarde * 0.75} />

      {/* repisa con productos */}
      <g>
        <rect x={430} y={560} width={300} height={16} rx={4} fill="#b98a5d" />
        <rect x={452} y={576} width={10} height={34} fill="#9c734b" />
        <rect x={698} y={576} width={10} height={34} fill="#9c734b" />
        <Vela x={492} y={560} ancho={58} alto={72} cera="#efe0c6" tapa />
        <Vela x={562} y={560} ancho={52} alto={60} cera="#d7c9e4" tapa />
        <Planta x={670} y={560} escala={0.42} frame={frame} maceta="#e3d3bd" />
      </g>

      {/* panel de corcho con ideas */}
      <g transform="translate(1190 440)">
        <rect x={-10} y={-10} width={300} height={290} rx={8} fill="#a97c50" />
        <rect width={280} height={270} rx={4} fill="#d9b88c" />
        <g transform="rotate(-3 70 70)">
          <rect x={18} y={20} width={112} height={96} fill="#fff8ec" />
          <Llama x={58} y={34} alto={44} />
          <text x={74} y={102} fontFamily={FUENTE.serif} fontSize={22} fontWeight={600} fill={LUMBRE.cafe} textAnchor="middle">Lumbre</text>
        </g>
        <g transform="rotate(4 205 70)">
          <rect x={152} y={26} width={104} height={104} fill="#f6dc8b" />
          <text x={204} y={64} fontFamily={FUENTE.mano} fontSize={28} fill="#5a4630" textAnchor="middle">¿página</text>
          <text x={204} y={94} fontFamily={FUENTE.mano} fontSize={28} fill="#5a4630" textAnchor="middle">web?</text>
        </g>
        {[LUMBRE.terracota, LUMBRE.crema, LUMBRE.salvia, LUMBRE.miel].map((c, i) => (
          <rect key={i} x={24 + i * 34} y={150} width={28} height={44} rx={3} fill={c} stroke="#fff" strokeWidth={3} />
        ))}
        <g transform="rotate(-2 200 200)">
          <rect x={172} y={150} width={90} height={100} fill="#fff8ec" />
          {[0, 1, 2, 3].map((i) => <rect key={i} x={182} y={166 + i * 18} width={i === 3 ? 44 : 70} height={5} rx={2} fill="#b9a58c" />)}
        </g>
        {[[74, 16], [204, 22], [60, 146], [216, 146]].map(([px, py], i) => <circle key={i} cx={px} cy={py} r={6} fill={i % 2 ? LUMBRE.terracota : '#4f6b8a'} />)}
      </g>

      {/* estante de cajas (solo horizontal) */}
      <g transform="translate(1570 0)">
        <rect x={0} y={540} width={300} height={14} fill="#b98a5d" />
        <rect x={0} y={820} width={300} height={14} fill="#b98a5d" />
        <Caja x={80} y={540} w={120} h={96} />
        <Caja x={210} y={540} w={110} h={130} />
        <Caja x={90} y={820} w={130} h={120} />
        <Vela x={220} y={820} ancho={70} alto={90} cera="#e9c9a8" tapa />
        <Planta x={150} y={1150} escala={0.9} frame={frame} />
      </g>

      {persona}

      {/* mesa */}
      <rect x={0} y={MESA_Y} width={LADO} height={LADO - MESA_Y} fill="url(#madera)" />
      <rect x={0} y={MESA_Y} width={LADO} height={7} fill="#e4bb8e" />
      {[1330, 1560, 1790].map((yy, i) => <rect key={i} x={0} y={yy} width={LADO} height={3} fill="#8f6640" opacity={0.25} />)}
      {/* sombra de la persona sobre la mesa */}
      <ellipse cx={960} cy={MESA_Y + 26} rx={330} ry={34} fill="#5b3c22" opacity={0.2} />

      {/* objetos del negocio */}
      {notebook !== 'no' ? <NotebookAtras x={600} y={1238} ancho={300} color="#c5ccd4" brillo={notebook === 'atras' ? 0.8 : 0} pegatina={<Llama x={-14} y={-20} alto={40} />} /> : null}
      <Vela x={1330} y={1236} ancho={104} alto={132} cera="#f1dfc2" encendida={velaEncendida} frame={frame} semilla={1} />
      <Vela x={1452} y={1262} ancho={84} alto={98} cera="#d8cbe6" tapa />
      <Vela x={1222} y={1268} ancho={74} alto={84} cera="#e7c3a0" tapa />
      {taza ? <Taza x={1090} y={1296} frame={frame} /> : null}
      {/* florero con flores secas */}
      <g transform="translate(430 1232)">
        {[-18, -6, 6, 18].map((dx, i) => (
          <g key={i}>
            <path d={`M 0 -60 Q ${dx * 1.5} -130 ${dx * 3} -${190 + i * 8}`} fill="none" stroke="#a48a5c" strokeWidth={4} />
            <ellipse cx={dx * 3} cy={-(196 + i * 8)} rx={11} ry={20} fill={i % 2 ? '#e2b872' : '#d9946b'} />
          </g>
        ))}
        <path d="M-30 -70 L30 -70 L24 0 L-24 0 Z" fill="#e9dcc8" />
      </g>

      {/* primer plano (solo vertical): caja de envío y cuaderno de ideas */}
      <g transform="translate(640 1880)">
        <rect x={-190} y={-250} width={380} height={270} rx={8} fill="#c79d6c" />
        <rect x={-170} y={-232} width={340} height={240} rx={4} fill="#8a6a45" />
        {Array.from({ length: 26 }, (_, i) => (
          <path key={i} d={`M ${-160 + azar(i) * 320} ${-215 + azar(i + 40) * 190} q ${20 - azar(i + 7) * 40} 14 ${30 - azar(i + 3) * 60} 30`} fill="none" stroke="#f1e2c6" strokeWidth={7} strokeLinecap="round" opacity={0.85} />
        ))}
        <Vela x={-60} y={-40} ancho={120} alto={150} cera="#f1dfc2" tapa />
        <Vela x={84} y={-30} ancho={104} alto={128} cera="#e7c3a0" tapa />
      </g>
      <g transform="translate(1180 1700) rotate(-7)">
        <rect x={-150} y={-110} width={300} height={220} rx={8} fill="#fffaf0" />
        <rect x={-150} y={-110} width={18} height={220} fill="#d8c8ae" />
        <text x={-110} y={-56} fontFamily={FUENTE.mano} fontSize={40} fill={LUMBRE.cafe}>Ideas para Lumbre</text>
        <text x={-110} y={-6} fontFamily={FUENTE.mano} fontSize={32} fill="#7a6455">· ferias de diseño</text>
        <text x={-110} y={36} fontFamily={FUENTE.mano} fontSize={32} fill="#7a6455">· nuevos aromas</text>
        <text x={-110} y={78} fontFamily={FUENTE.mano} fontSize={32} fill={LUMBRE.terracota}>· ¡tener página web!</text>
      </g>

      {sobreMesa}

      {/* ambiente: tarde cálida */}
      <rect width={LADO} height={LADO} fill="#ff9d4d" opacity={0.07 * tarde} style={{ mixBlendMode: 'multiply' }} />
    </g>
  );
};

// ------------------------------------------------------------------ espacio de trabajo de TiforTi

/** Colores del cielo según la hora (0 mañana · 0.5 tarde · 0.8 atardecer · 1 noche). */
const cielo = (h: number) => {
  const paradas: Array<[number, string, string]> = [
    [0, '#cfe9ff', '#f4f9ff'],
    [0.45, '#8fc6f6', '#d9eeff'],
    [0.75, '#f6a868', '#ffd9a6'],
    [1, '#101c3f', '#27336b'],
  ];
  for (let i = 1; i < paradas.length; i++) {
    if (h <= paradas[i][0]) {
      const t = (h - paradas[i - 1][0]) / (paradas[i][0] - paradas[i - 1][0]);
      return [mezclarColor(paradas[i - 1][1], paradas[i][1], t), mezclarColor(paradas[i - 1][2], paradas[i][2], t)];
    }
  }
  return [paradas[3][1], paradas[3][2]];
};

export const OFICINA_MESA_Y = 1170;

/** Espacio de trabajo del equipo: un escritorio compartido, una ventana y una pizarra. Cotidiano, nada futurista. */
export const Oficina: React.FC<{ frame: number; hora?: number; personas?: React.ReactNode; sobreMesa?: React.ReactNode; uid?: string }> = ({ frame, hora = 0.2, personas, sobreMesa, uid = 'a' }) => {
  const [c1, c2] = cielo(hora);
  const noche = limitar((hora - 0.72) / 0.28);
  return (
    <g>
      <Definiciones />
      <defs>
        <linearGradient id={`cieloOficina${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={c1} />
          <stop offset="1" stopColor={c2} />
        </linearGradient>
        <linearGradient id="paredOficina" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#eef2f6" />
          <stop offset="1" stopColor="#dde5ee" />
        </linearGradient>
      </defs>
      <rect width={LADO} height={LADO} fill="url(#paredOficina)" />

      {/* lámparas colgantes */}
      {[700, 1220].map((lx, i) => (
        <g key={i}>
          <rect x={lx - 2} y={0} width={4} height={230} fill="#7d8794" />
          <circle cx={lx} cy={300} r={210} fill="url(#brilloVela)" opacity={0.25 + noche * 0.6} />
          <path d={`M ${lx - 70} 290 Q ${lx} 190 ${lx + 70} 290 Z`} fill="#2c3a55" />
          <ellipse cx={lx} cy={290} rx={70} ry={10} fill={mezclarColor('#f1ead8', '#ffe3a1', 0.4 + noche * 0.6)} />
        </g>
      ))}

      {/* ventana entre los dos puestos */}
      <g transform="translate(790 440)">
        <rect x={-14} y={-14} width={368} height={428} rx={10} fill="#ffffff" />
        <rect width={340} height={400} fill={`url(#cieloOficina${uid})`} />
        {/* cerros y edificios a lo lejos */}
        <path d="M0 330 L60 270 L120 310 L190 240 L260 300 L340 250 L340 400 L0 400 Z" fill={mezclarColor('#9db7cf', '#1a2550', noche)} opacity={0.9} />
        {[[30, 300, 44, 100], [96, 322, 38, 78], [250, 310, 52, 90]].map(([bx, by, bw, bh], i) => (
          <g key={i}>
            <rect x={bx} y={by} width={bw} height={bh} fill={mezclarColor('#7f99b5', '#111a3d', noche)} />
            {noche > 0.4 ? [0, 1, 2].map((k) => <rect key={k} x={bx + 8 + (k % 2) * 16} y={by + 12 + k * 20} width={8} height={10} fill="#ffd98a" opacity={noche * (0.5 + azar(i * 7 + k) * 0.5)} />) : null}
          </g>
        ))}
        {hora < 0.9 ? <circle cx={mezclarColorX(hora)} cy={90 + Math.pow(hora, 2) * 250} r={26} fill={hora > 0.6 ? '#ffb46a' : '#fff6d5'} opacity={0.95} /> : null}
        {noche > 0.5 ? Array.from({ length: 12 }, (_, i) => <circle key={i} cx={20 + azar(i) * 300} cy={16 + azar(i + 20) * 190} r={1.8} fill="#fff" opacity={noche * (0.5 + 0.5 * Math.sin(frame / 9 + i))} />) : null}
        <rect x={164} width={12} height={400} fill="#fff" />
        <rect y={194} width={340} height={12} fill="#fff" />
      </g>

      {/* pizarra con bocetos (izquierda) */}
      <g transform="translate(436 470)">
        <rect x={-8} y={-8} width={296} height={316} rx={8} fill="#c9d3de" />
        <rect width={280} height={300} rx={4} fill="#fff" />
        <rect x={20} y={22} width={110} height={76} rx={4} fill="none" stroke="#9aa9bc" strokeWidth={4} />
        <rect x={30} y={34} width={90} height={10} fill="#c7d2df" />
        <rect x={30} y={54} width={40} height={32} fill="#c7d2df" />
        <rect x={78} y={54} width={42} height={32} fill="#c7d2df" />
        <path d="M 134 60 L 164 60 M 156 52 L 164 60 L 156 68" fill="none" stroke={TIFORTI.azul} strokeWidth={4} strokeLinecap="round" />
        <rect x={172} y={18} width={54} height={92} rx={8} fill="none" stroke="#9aa9bc" strokeWidth={4} />
        <rect x={182} y={34} width={34} height={8} fill="#c7d2df" />
        <rect x={182} y={50} width={34} height={22} fill="#c7d2df" />
        {[['#f6dc8b', 22, 130, -3], ['#bfe6f7', 104, 136, 2], ['#f7c6b0', 186, 128, -2], ['#cfe9c4', 60, 214, 3], ['#f6dc8b', 150, 212, -1]].map(([c, nx, ny, r], i) => (
          <g key={i} transform={`rotate(${r} ${Number(nx) + 36} ${Number(ny) + 36})`}>
            <rect x={Number(nx)} y={Number(ny)} width={72} height={70} fill={String(c)} />
            <rect x={Number(nx) + 10} y={Number(ny) + 16} width={50} height={5} rx={2} fill="#000" opacity={0.25} />
            <rect x={Number(nx) + 10} y={Number(ny) + 30} width={36} height={5} rx={2} fill="#000" opacity={0.2} />
          </g>
        ))}
      </g>

      {/* repisa con libros y planta (derecha) */}
      <g transform="translate(1210 610)">
        <rect x={0} y={0} width={280} height={14} rx={4} fill="#c6ae8c" />
        {[['#1556d7', 20, 86], ['#22d3ee', 46, 72], ['#10203b', 70, 92], ['#e4eaf2', 98, 64], ['#f6a868', 122, 80]].map(([c, bx, bh], i) => (
          <rect key={i} x={Number(bx)} y={-Number(bh)} width={22} height={Number(bh)} rx={3} fill={String(c)} />
        ))}
        <Planta x={220} y={0} escala={0.5} frame={frame} maceta="#ffffff" />
      </g>

      {/* laterales (solo horizontal) */}
      <Planta x={200} y={1170} escala={1.5} frame={frame} maceta="#2c3a55" />
      <g transform="translate(1600 520)">
        <rect width={250} height={300} rx={8} fill="#fff" />
        <image href={staticFile('marca/logo-ti.png')} x={75} y={60} width={100} height={100} />
        <text x={125} y={214} fontFamily={FUENTE.marca} fontSize={40} fontWeight={800} fill={TIFORTI.navy} textAnchor="middle" letterSpacing={-2}>TiforTi</text>
        <text x={125} y={250} fontFamily={FUENTE.marca} fontSize={17} fontWeight={600} fill={TIFORTI.texto} textAnchor="middle">Tecnología para ti</text>
      </g>

      {personas}

      {/* escritorio */}
      <rect x={0} y={OFICINA_MESA_Y} width={LADO} height={LADO - OFICINA_MESA_Y} fill="url(#maderaClara)" />
      <rect x={0} y={OFICINA_MESA_Y} width={LADO} height={7} fill="#f3e6d2" />
      {[1400, 1660].map((yy, i) => <rect key={i} x={0} y={yy} width={LADO} height={3} fill="#a08a6c" opacity={0.22} />)}

      {sobreMesa}

      {/* ambiente según la hora */}
      <rect width={LADO} height={LADO} fill="#ff9a4a" opacity={0.1 * limitar(1 - Math.abs(hora - 0.75) / 0.2)} style={{ mixBlendMode: 'multiply' }} />
      <rect width={LADO} height={LADO} fill="#0b1640" opacity={0.36 * noche} style={{ mixBlendMode: 'multiply' }} />
    </g>
  );
};

// posición horizontal del sol en la ventana según la hora
const mezclarColorX = (h: number) => 60 + h * 240;

/** Viñeta y grano suaves para dar textura de cámara a las tomas ilustradas. */
export const Pelicula: React.FC<{ fuerza?: number }> = ({ fuerza = 1 }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ pointerEvents: 'none' }}>
      <AbsoluteFill style={{ background: `radial-gradient(ellipse at 50% 46%, rgba(0,0,0,0) 52%, rgba(20,10,5,${0.34 * fuerza}) 100%)` }} />
      <AbsoluteFill
        style={{
          backgroundImage: `url(${staticFile('texturas/grano.png')})`,
          backgroundPosition: `${Math.floor(azar(frame) * 256)}px ${Math.floor(azar(frame + 99) * 256)}px`,
          opacity: 0.07 * fuerza,
          mixBlendMode: 'overlay',
        }}
      />
    </AbsoluteFill>
  );
};

/** Logo real de TiforTi. */
export const LogoTiforti: React.FC<{ tam: number; style?: React.CSSProperties }> = ({ tam, style }) => (
  <Img src={staticFile('marca/logo-ti.png')} style={{ width: tam, height: tam, display: 'block', ...style }} />
);
