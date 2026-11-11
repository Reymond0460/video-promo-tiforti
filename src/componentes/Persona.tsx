// Personaje ilustrado (busto) con expresiones y brazos animables.
// Se dibuja en SVG con origen en la base del cuello: la cabeza queda hacia -y y el torso hacia +y.
import React from 'react';
import { azar, limitar } from '../util';

export type Aspecto = {
  piel: string;
  pielSombra: string;
  pelo: string;
  peloLuz: string;
  ropa: string;
  ropaSombra: string;
  polera?: string; // prenda interior que asoma en el cuello
  peinado: 'mono' | 'corto' | 'rizado';
  lentes?: boolean;
  barba?: boolean;
  aros?: boolean;
};

export type Pose = {
  cabeza?: number; // giro de la cabeza en grados (+ = hacia la derecha de la pantalla)
  cabezaY?: number; // la cabeza baja (+) o sube (-)
  cuerpo?: number; // inclinación del torso en grados
  mirada?: [number, number]; // hacia dónde miran los ojos, -1..1
  ojos?: number; // 1 normal · 0 cerrados · >1 muy abiertos
  cejas?: number; // -1 preocupación (centro arriba) · 0 neutro · 1 levantadas
  boca?: number; // -1 mueca hacia abajo · 0 neutra · 1 sonrisa
  hablar?: number; // 0..1 apertura de la boca
  ojosRisa?: number; // 0..1 los ojos se achican al sonreír
  manoD?: [number, number] | null; // posición de la mano derecha (lado derecho de la pantalla)
  manoI?: [number, number] | null;
  objetoD?: React.ReactNode; // lo que sostiene la mano derecha (se dibuja centrado en la mano)
  objetoI?: React.ReactNode;
  luzPantalla?: number; // 0..1 brillo frío de una pantalla sobre la cara
};

// ---- Elenco. Camila mantiene siempre el mismo aspecto: moño, chaleco verde salvia y aros dorados.
export const CAMILA: Aspecto = {
  piel: '#e3ad88', pielSombra: '#cf9470', pelo: '#3b2620', peloLuz: '#5a3b30',
  ropa: '#7d9070', ropaSombra: '#677a5c', polera: '#f4ead9', peinado: 'mono', aros: true,
};
export const DEV_A: Aspecto = {
  piel: '#d9a37e', pielSombra: '#c48a66', pelo: '#1f1a1c', peloLuz: '#3a3236',
  ropa: '#17305f', ropaSombra: '#10244a', polera: '#e9eef5', peinado: 'corto', lentes: true,
};
export const DEV_B: Aspecto = {
  piel: '#e8b999', pielSombra: '#d39f7d', pelo: '#4a3226', peloLuz: '#6b4a38',
  ropa: '#dfe6ee', ropaSombra: '#c3cfdb', polera: '#22d3ee', peinado: 'rizado', barba: true,
};

const HOMBRO = { x: 138, y: 52 };
const BRAZO = 178;
const ANTEBRAZO = 168;

/** Cinemática inversa de dos huesos: devuelve el codo para que la mano llegue al objetivo. */
const codo = (lado: 1 | -1, mano: [number, number]) => {
  const sx = HOMBRO.x * lado;
  const sy = HOMBRO.y;
  let dx = mano[0] - sx;
  let dy = mano[1] - sy;
  let d = Math.hypot(dx, dy) || 1;
  const max = BRAZO + ANTEBRAZO - 2;
  if (d > max) {
    dx *= max / d;
    dy *= max / d;
    d = max;
  }
  const a = Math.acos(limitar((BRAZO * BRAZO + d * d - ANTEBRAZO * ANTEBRAZO) / (2 * BRAZO * d), -1, 1));
  const base = Math.atan2(dy, dx);
  const op = [base + a, base - a].map((ang) => ({ x: sx + Math.cos(ang) * BRAZO, y: sy + Math.sin(ang) * BRAZO }));
  // se prefiere el codo hacia afuera y hacia abajo
  const puntaje = (p: { x: number; y: number }) => p.y + p.x * lado * 0.6;
  const e = puntaje(op[0]) > puntaje(op[1]) ? op[0] : op[1];
  return { sx, sy, ex: e.x, ey: e.y, hx: sx + dx, hy: sy + dy };
};

const Brazo: React.FC<{ a: Aspecto; lado: 1 | -1; mano: [number, number]; objeto?: React.ReactNode }> = ({ a, lado, mano, objeto }) => {
  const { sx, sy, ex, ey, hx, hy } = codo(lado, mano);
  const d = `M ${sx} ${sy} L ${ex} ${ey} L ${hx} ${hy}`;
  // el puño del chaleco queda un poco antes de la mano
  const ux = hx - (hx - ex) * 0.16;
  const uy = hy - (hy - ey) * 0.16;
  return (
    <g>
      <path d={d} fill="none" stroke={a.ropaSombra} strokeWidth={78} strokeLinecap="round" strokeLinejoin="round" />
      <path d={d} fill="none" stroke={a.ropa} strokeWidth={68} strokeLinecap="round" strokeLinejoin="round" />
      <path d={`M ${ux} ${uy} L ${hx} ${hy}`} fill="none" stroke={a.ropaSombra} strokeWidth={70} strokeLinecap="round" opacity={0.55} />
      {objeto ? <g transform={`translate(${hx} ${hy})`}>{objeto}</g> : null}
      <circle cx={hx} cy={hy} r={31} fill={a.piel} />
      <circle cx={hx + 8 * lado} cy={hy + 9} r={22} fill={a.pielSombra} opacity={0.35} />
    </g>
  );
};

const Pelo: React.FC<{ a: Aspecto; capa: 'atras' | 'delante' }> = ({ a, capa }) => {
  if (a.peinado === 'mono') {
    return capa === 'atras' ? (
      <g>
        <circle cx={6} cy={-158} r={56} fill={a.pelo} />
        <path d="M -30 -190 q 36 -26 72 4" fill="none" stroke={a.peloLuz} strokeWidth={7} strokeLinecap="round" opacity={0.7} />
        <path d="M -116 -30 C -128 -150 128 -150 116 -30 C 122 30 112 78 96 96 L -96 96 C -112 78 -122 30 -116 -30 Z" fill={a.pelo} />
      </g>
    ) : (
      <g>
        <path d="M -109 -8 C -122 -132 -30 -146 14 -138 C 84 -134 122 -96 109 -8 C 104 -52 82 -86 40 -100 C 8 -70 -62 -52 -109 -8 Z" fill={a.pelo} />
        <path d="M -60 -112 C -20 -128 30 -126 62 -108" fill="none" stroke={a.peloLuz} strokeWidth={8} strokeLinecap="round" opacity={0.65} />
        {/* mechones sueltos junto a la cara */}
        <path d="M -107 -14 C -112 22 -104 52 -96 70" fill="none" stroke={a.pelo} strokeWidth={10} strokeLinecap="round" />
        <path d="M 107 -14 C 113 16 108 40 102 56" fill="none" stroke={a.pelo} strokeWidth={9} strokeLinecap="round" />
      </g>
    );
  }
  if (a.peinado === 'corto') {
    return capa === 'atras' ? (
      <path d="M -112 -20 C -122 -150 122 -150 112 -20 L 104 30 L -104 30 Z" fill={a.pelo} />
    ) : (
      <g>
        <path d="M -108 -22 C -120 -140 -20 -150 20 -146 C 90 -142 120 -100 108 -22 C 100 -62 86 -84 60 -92 C 10 -104 -50 -100 -80 -80 C -96 -66 -104 -44 -108 -22 Z" fill={a.pelo} />
        <path d="M -40 -122 C -6 -134 34 -132 62 -118" fill="none" stroke={a.peloLuz} strokeWidth={8} strokeLinecap="round" opacity={0.6} />
      </g>
    );
  }
  // rizado
  const rizos = [[-92, -70, 34], [-70, -112, 38], [-30, -136, 40], [14, -144, 40], [56, -128, 38], [90, -92, 36], [100, -52, 30], [-102, -34, 28], [-48, -100, 34], [0, -112, 36], [44, -100, 34]];
  return capa === 'atras' ? (
    <g>{rizos.map(([x, y, r], i) => <circle key={i} cx={x} cy={y} r={r + 6} fill={a.pelo} />)}</g>
  ) : (
    <g>
      {rizos.slice(0, 7).map(([x, y, r], i) => <circle key={i} cx={x * 0.96} cy={y + 4} r={r * 0.82} fill={a.pelo} />)}
      {[[-60, -118], [-8, -140], [48, -128], [86, -96]].map(([x, y], i) => (
        <path key={i} d={`M ${x - 12} ${y} q 12 -14 24 0`} fill="none" stroke={a.peloLuz} strokeWidth={6} strokeLinecap="round" opacity={0.7} />
      ))}
    </g>
  );
};

/** `capa`: 'cuerpo' dibuja todo menos los brazos y 'brazos' solo los brazos (para que pasen por delante de una mesa). */
export const Persona: React.FC<{ a: Aspecto; pose?: Pose; frame: number; semilla?: number; escala?: number; x?: number; y?: number; capa?: 'todo' | 'cuerpo' | 'brazos' }> = ({
  a, pose = {}, frame, semilla = 1, escala = 1, x = 0, y = 0, capa = 'todo',
}) => {
  const { cabeza = 0, cabezaY = 0, cuerpo = 0, mirada = [0, 0], cejas = 0, boca = 0, hablar = 0, ojosRisa = 0, manoD, manoI, luzPantalla = 0 } = pose;
  // parpadeo natural: cada 2,5 a 4,5 s, dura unos 5 fotogramas
  const ciclo = 105 + Math.floor(azar(semilla) * 40);
  const fase = (frame + Math.floor(azar(semilla + 9) * ciclo)) % ciclo;
  const parpadeo = fase < 6 ? 1 - Math.abs(fase - 2.5) / 3 : 0;
  const apertura = limitar((pose.ojos ?? 1) * (1 - limitar(parpadeo)) * (1 - ojosRisa * 0.45), 0, 1.35);
  const respiro = Math.sin(frame / 22 + semilla) * 2.2;

  const ojo = (lado: 1 | -1) => {
    const cx = 44 * lado + mirada[0] * 6;
    const cy = 4 + mirada[1] * 5;
    return (
      <g key={lado}>
        <ellipse cx={cx} cy={cy} rx={9.5} ry={Math.max(1.4, 11.5 * apertura)} fill="#2a1b17" />
        {apertura > 0.5 ? <circle cx={cx + 3} cy={cy - 4} r={2.6} fill="#fff" opacity={0.85} /> : null}
        {a.aros && apertura > 0.35 ? <path d={`M ${cx + 8 * lado} ${cy - 9 * apertura} q ${7 * lado} -3 ${10 * lado} -8`} fill="none" stroke="#2a1b17" strokeWidth={3.2} strokeLinecap="round" /> : null}
        {ojosRisa > 0.3 ? <path d={`M ${cx - 13} ${cy + 9} q 13 6 26 0`} fill="none" stroke={a.pielSombra} strokeWidth={4} strokeLinecap="round" opacity={ojosRisa} /> : null}
      </g>
    );
  };
  const ceja = (lado: 1 | -1) => {
    // preocupación: la punta interior sube; sorpresa/interés: sube entera
    const giro = cejas < 0 ? -cejas * 14 * lado : cejas * 5 * lado;
    const sube = cejas > 0 ? -cejas * 9 : cejas * 3;
    return (
      <g key={lado} transform={`translate(${44 * lado} ${-27 + sube}) rotate(${giro})`}>
        <path d={`M ${-19} ${3 * 1} Q 0 -7 19 ${3}`} fill="none" stroke={a.pelo} strokeWidth={7.5} strokeLinecap="round" />
      </g>
    );
  };
  const curva = boca * 15;
  const ancho = 22 + Math.max(0, boca) * 7;

  const brazos = (
    <>
      {manoI ? <Brazo a={a} lado={-1} mano={manoI} objeto={pose.objetoI} /> : null}
      {manoD ? <Brazo a={a} lado={1} mano={manoD} objeto={pose.objetoD} /> : null}
    </>
  );
  if (capa === 'brazos') {
    return (
      <g transform={`translate(${x} ${y}) scale(${escala})`}>
        <g transform={`rotate(${cuerpo} 0 420)`}>{brazos}</g>
      </g>
    );
  }

  return (
    <g transform={`translate(${x} ${y}) scale(${escala})`}>
      <g transform={`rotate(${cuerpo} 0 420)`}>
        {/* cabeza: capa trasera del pelo */}
        <g transform={`translate(0 ${-176 + cabezaY + respiro * 0.6}) rotate(${cabeza} 0 96)`}>
          <Pelo a={a} capa="atras" />
        </g>
        {/* torso */}
        <g transform={`translate(0 ${respiro * 0.5})`}>
          <path d="M -176 70 C -176 14 -112 -10 -58 -22 L 58 -22 C 112 -10 176 14 176 70 L 190 560 L -190 560 Z" fill={a.ropa} />
          <path d="M -176 70 C -176 14 -112 -10 -58 -22 L -30 -22 C -90 0 -128 30 -132 110 L -150 560 L -190 560 Z" fill={a.ropaSombra} opacity={0.55} />
          {/* cuello de la prenda */}
          <path d="M -50 -24 C -30 26 30 26 50 -24 L 36 -30 L -36 -30 Z" fill={a.polera ?? a.piel} />
          <path d="M -58 -22 C -34 40 34 40 58 -22" fill="none" stroke={a.ropaSombra} strokeWidth={9} strokeLinecap="round" />
        </g>
        {/* cuello */}
        <path d="M -36 -84 L 36 -84 L 38 -18 C 20 6 -20 6 -38 -18 Z" fill={a.piel} />
        <path d="M -36 -70 C -10 -44 10 -44 36 -70 L 36 -84 L -36 -84 Z" fill={a.pielSombra} opacity={0.8} />
        {/* cabeza */}
        <g transform={`translate(0 ${-176 + cabezaY + respiro * 0.6}) rotate(${cabeza} 0 96)`}>
          <ellipse cx={-106} cy={10} rx={13} ry={21} fill={a.piel} />
          <ellipse cx={106} cy={10} rx={13} ry={21} fill={a.piel} />
          {a.aros ? (
            <>
              <circle cx={-108} cy={36} r={6.5} fill="#e8b84b" />
              <circle cx={108} cy={36} r={6.5} fill="#e8b84b" />
            </>
          ) : null}
          <path d="M -104 -34 C -104 -146 104 -146 104 -34 C 104 62 62 126 0 126 C -62 126 -104 62 -104 -34 Z" fill={a.piel} />
          {a.barba ? (
            <path d="M -103 6 C -98 78 -58 127 0 127 C 58 127 98 78 103 6 C 92 52 62 76 34 62 C 14 50 -14 50 -34 62 C -62 76 -92 52 -103 6 Z" fill={a.pelo} opacity={0.82} />
          ) : null}
          {/* rubor */}
          <ellipse cx={-64} cy={44} rx={21} ry={13} fill="#e9785e" opacity={0.2 + Math.max(0, boca) * 0.12} />
          <ellipse cx={64} cy={44} rx={21} ry={13} fill="#e9785e" opacity={0.2 + Math.max(0, boca) * 0.12} />
          {/* luz de pantalla */}
          {luzPantalla > 0 ? (
            <path d="M -104 -34 C -104 -146 104 -146 104 -34 C 104 62 62 126 0 126 C -62 126 -104 62 -104 -34 Z" fill="#bfe6ff" opacity={luzPantalla * 0.2} />
          ) : null}
          {ojo(-1)}
          {ojo(1)}
          {ceja(-1)}
          {ceja(1)}
          <path d={`M ${3 + mirada[0] * 2} 20 q 9 16 -5 21`} fill="none" stroke={a.pielSombra} strokeWidth={5.5} strokeLinecap="round" />
          {/* boca */}
          {hablar > 0.12 ? (
            <path d={`M ${-ancho * 0.8} ${68 - curva * 0.3} Q 0 ${68 + curva * 0.5 - 2} ${ancho * 0.8} ${68 - curva * 0.3} Q 0 ${72 + curva + hablar * 26} ${-ancho * 0.8} ${68 - curva * 0.3} Z`} fill="#6e2d26" />
          ) : (
            <path d={`M ${-ancho} ${70 - curva * 0.45} Q 0 ${70 + curva} ${ancho} ${70 - curva * 0.45}`} fill="none" stroke="#7d3a2e" strokeWidth={6} strokeLinecap="round" />
          )}
          {a.lentes ? (
            <g fill="none" stroke="#1b2536" strokeWidth={5.5}>
              <rect x={-74} y={-18} width={58} height={44} rx={15} fill="#ffffff" fillOpacity={0.14} />
              <rect x={16} y={-18} width={58} height={44} rx={15} fill="#ffffff" fillOpacity={0.14} />
              <path d="M -16 2 q 16 -9 32 0 M -74 0 L -102 -6 M 74 0 L 102 -6" />
            </g>
          ) : null}
          <Pelo a={a} capa="delante" />
        </g>
        {/* brazos (por delante del torso) */}
        {capa === 'todo' ? brazos : null}
      </g>
    </g>
  );
};
