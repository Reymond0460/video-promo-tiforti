// Ensambla el comercial: tomas, subtítulos, narración, música y efectos.
import React from 'react';
import { AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame } from 'remotion';
import { Subtitulos } from './componentes/Subtitulos';
import { T1Duda, T1Escritorio, T1Feed } from './escenas/E1Problema';
import { T2Hallazgo, T2Mensaje, T2Sitio } from './escenas/E2Descubrimiento';
import { T3Boceto, T3Llamada, T3Notas } from './escenas/E3Idea';
import { T4Codigo, T4Entrega, T4Equipo, T4EquipoTarde, T4Integracion, T4Plan, T4Pruebas } from './escenas/E4Trabajo';
import { T5Compartir, T5Presentacion, T5Reaccion, T5ReaccionPronto, T5Recorrido } from './escenas/E5Resultado';
import { T6Lema, T6Marca, T6Mosaico } from './escenas/E6Cierre';
import { DURACION, EFECTOS, frases, seg, Version, volumenMusica } from './tiempos';
import { st } from './util';

type Toma = {
  id: string;
  desde: number; // segundo en que empieza
  hasta: number; // segundo en que termina
  C: React.FC<{ dur: number }>;
  fundido?: number; // fotogramas de fundido de entrada (0 = corte directo)
};

// ------------------------------------------------------------------ VERSIÓN COMPLETA (75 s)
const TOMAS_COMPLETO: Toma[] = [
  // Escena 1 — El problema (0:00–0:10)
  { id: '1A', desde: 0, hasta: 3.2, C: T1Escritorio, fundido: 0 },
  { id: '1B', desde: 3.2, hasta: 7.4, C: T1Feed },
  { id: '1C', desde: 7.4, hasta: 10.6, C: T1Duda },
  // Escena 2 — El descubrimiento de TiforTi (0:10–0:20)
  { id: '2A', desde: 10.6, hasta: 14.0, C: T2Hallazgo },
  { id: '2B', desde: 14.0, hasta: 18.2, C: T2Sitio },
  { id: '2C', desde: 18.2, hasta: 20.4, C: T2Mensaje },
  // Escena 3 — Conocemos su idea (0:20–0:30)
  { id: '3A', desde: 20.4, hasta: 24.2, C: T3Llamada },
  { id: '3B', desde: 24.2, hasta: 27.0, C: T3Notas },
  { id: '3C', desde: 27.0, hasta: 30.0, C: T3Boceto },
  // Escena 4 — Manos a la obra (0:30–0:47,5): una semana de trabajo
  { id: '4A', desde: 30.0, hasta: 31.8, C: T4Equipo },
  { id: '4B', desde: 31.8, hasta: 34.2, C: T4Plan, fundido: 6 },
  { id: '4C', desde: 34.2, hasta: 38.4, C: T4Codigo, fundido: 6 },
  { id: '4D', desde: 38.4, hasta: 39.6, C: T4EquipoTarde, fundido: 6 },
  { id: '4E', desde: 39.6, hasta: 43.0, C: T4Integracion, fundido: 6 },
  { id: '4F', desde: 43.0, hasta: 45.6, C: T4Pruebas, fundido: 6 },
  { id: '4G', desde: 45.6, hasta: 47.5, C: T4Entrega, fundido: 6 },
  // Escena 5 — El gran resultado (0:47,5–1:00)
  { id: '5A', desde: 47.5, hasta: 50.4, C: T5Presentacion },
  { id: '5B', desde: 50.4, hasta: 53.4, C: T5Recorrido },
  { id: '5C', desde: 53.4, hasta: 56.4, C: T5Reaccion },
  { id: '5D', desde: 56.4, hasta: 60.0, C: T5Compartir },
  // Escena 6 — TiforTi: hagamos realidad tu idea (1:00–1:15)
  { id: '6A', desde: 60.0, hasta: 64.2, C: T6Mosaico, fundido: 14 },
  { id: '6B', desde: 64.2, hasta: 68.6, C: T6Lema, fundido: 14 },
  { id: '6C', desde: 68.6, hasta: 75.0, C: T6Marca },
];

// ------------------------------------------------------------------ VERSIÓN CORTA (30 s)
const TOMAS_CORTO: Toma[] = [
  { id: '1A', desde: 0, hasta: 2.6, C: T1Escritorio, fundido: 0 },
  { id: '1B', desde: 2.6, hasta: 5.0, C: T1Feed },
  { id: '2A', desde: 5.0, hasta: 7.2, C: T2Hallazgo },
  { id: '2B', desde: 7.2, hasta: 9.0, C: T2Sitio },
  { id: '3A', desde: 9.0, hasta: 10.8, C: T3Llamada },
  { id: '3C', desde: 10.8, hasta: 12.4, C: T3Boceto },
  { id: '4C', desde: 12.4, hasta: 15.0, C: T4Codigo, fundido: 6 },
  { id: '4E', desde: 15.0, hasta: 16.6, C: T4Integracion, fundido: 6 },
  { id: '4F', desde: 16.6, hasta: 18.0, C: T4Pruebas, fundido: 6 },
  { id: '4G', desde: 18.0, hasta: 19.2, C: T4Entrega, fundido: 6 },
  { id: '5B', desde: 19.2, hasta: 21.0, C: T5Recorrido },
  { id: '5C', desde: 21.0, hasta: 23.4, C: T5ReaccionPronto },
  { id: '6B', desde: 23.4, hasta: 26.2, C: T6Lema, fundido: 14 },
  { id: '6C', desde: 26.2, hasta: 30.0, C: T6Marca },
];

const SOLAPE = 12; // cada toma sigue viva estos fotogramas mientras entra la siguiente

const Fundido: React.FC<{ n: number; children: React.ReactNode }> = ({ n, children }) => {
  const frame = useCurrentFrame();
  return <AbsoluteFill style={{ opacity: n > 0 ? st(frame, 0, n) : 1 }}>{children}</AbsoluteFill>;
};

export const Promo: React.FC<{ version: Version; subtitulos?: boolean }> = ({ version, subtitulos = true }) => {
  const tomas = version === 'completo' ? TOMAS_COMPLETO : TOMAS_CORTO;
  const total = DURACION[version];
  const vol = React.useMemo(() => volumenMusica(version), [version]);
  return (
    <AbsoluteFill style={{ background: '#061230' }}>
      {tomas.map((t, i) => {
        const fundido = t.fundido ?? 10;
        const desde = Math.max(0, seg(t.desde) - fundido);
        const ultimo = i === tomas.length - 1;
        const dur = seg(t.hasta) - desde + (ultimo ? 0 : SOLAPE);
        return (
          <Sequence key={t.id + i} from={desde} durationInFrames={Math.min(dur, total - desde)} name={`Toma ${t.id}`}>
            <Fundido n={i === 0 ? 0 : fundido}>
              <t.C dur={seg(t.hasta) - desde} />
            </Fundido>
          </Sequence>
        );
      })}

      {subtitulos ? <Subtitulos version={version} /> : null}

      {/* ---- banda sonora ---- */}
      <Audio src={staticFile(`audio/musica-${version === 'completo' ? 'completa' : 'corta'}.wav`)} volume={vol} />
      {frases(version).map((f) => (
        <Sequence key={f.id} from={seg(f.inicio)} durationInFrames={Math.min(seg(f.dur) + 2, total - seg(f.inicio))} name={`Voz ${f.id}`}>
          <Audio src={staticFile(`audio/voz/${f.id}.wav`)} volume={1} />
        </Sequence>
      ))}
      {EFECTOS[version].map(([s, archivo, v], i) => (
        <Sequence key={i} from={seg(s)} durationInFrames={Math.min(180, total - seg(s))} name={`SFX ${archivo}`}>
          <Audio src={staticFile(`audio/sfx/${archivo}.wav`)} volume={v} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
