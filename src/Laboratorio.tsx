// Composición de prueba para revisar personajes y piezas sueltas (no forma parte del video).
import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from 'remotion';
import { CAMILA, DEV_A, DEV_B, Persona } from './componentes/Persona';
import { Escenario, MESA_Y, NotebookAtras, Oficina, OFICINA_MESA_Y, Pelicula, Taller, Taza } from './componentes/Escenario';
import { SitioAlambre, SitioLumbre } from './componentes/SitioLumbre';

export const Laboratorio: React.FC<{ prueba: string }> = ({ prueba }) => {
  const frame = useCurrentFrame();
  const { width } = useVideoConfig();
  if (prueba === 'taller') {
    const pose = { boca: -0.3, cejas: -0.6, mirada: [0.3, 0.9] as [number, number], cabeza: 5, cabezaY: 6, manoD: [70, 190] as [number, number], manoI: [-150, 300] as [number, number] };
    return (
      <AbsoluteFill>
        <Escenario>
          <Taller frame={frame} tarde={1} persona={<Persona a={CAMILA} frame={frame} x={960} y={905} escala={1.12} pose={pose} capa="cuerpo" />} sobreMesa={<Persona a={CAMILA} frame={frame} x={960} y={905} escala={1.12} pose={pose} capa="brazos" />} />
        </Escenario>
        <Pelicula />
      </AbsoluteFill>
    );
  }
  if (prueba === 'oficina') {
    const pa = { boca: 0.2, mirada: [0.2, 0.7] as [number, number], cabezaY: 4, luzPantalla: 0.6 };
    return (
      <AbsoluteFill>
        <Escenario>
          <Oficina frame={frame} hora={frame / 100} personas={<><Persona a={DEV_A} frame={frame} x={700} y={930} pose={pa} semilla={3} /><Persona a={DEV_B} frame={frame} x={1220} y={930} pose={{ ...pa, boca: 0.5, cabeza: -6 }} semilla={7} /></>}
            sobreMesa={<><NotebookAtras x={700} y={OFICINA_MESA_Y + 70} color="#3a4558" logo /><NotebookAtras x={1220} y={OFICINA_MESA_Y + 70} color="#c5ccd4" /><Taza x={960} y={OFICINA_MESA_Y + 110} color="#1556d7" frame={frame} /></>} />
        </Escenario>
        <Pelicula />
      </AbsoluteFill>
    );
  }
  return (
    <AbsoluteFill style={{ background: '#223', flexDirection: 'row', gap: 20, padding: 20 }}>
      <div style={{ transform: `scale(${(width * 0.6) / 1280})`, transformOrigin: '0 0', width: 1280 }}><SitioLumbre frame={frame} /></div>
      <div style={{ position: 'absolute', left: width * 0.64, top: 20, transform: 'scale(0.9)', transformOrigin: '0 0' }}><SitioLumbre movil frame={frame} /></div>
      <div style={{ position: 'absolute', left: width * 0.84, top: 20, transform: 'scale(0.7)', transformOrigin: '0 0' }}><SitioAlambre movil avance={0.8} /></div>
    </AbsoluteFill>
  );
};
