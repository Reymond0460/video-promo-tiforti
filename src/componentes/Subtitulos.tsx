// Subtítulos quemados en el video, sincronizados con la narración. Pensados para leerse en un celular.
import React from 'react';
import { useCurrentFrame } from 'remotion';
import { FUENTE, FPS } from '../tema';
import { subtitulos, Version } from '../tiempos';
import { fr } from '../util';
import { useFormato } from './Textos';

export const Subtitulos: React.FC<{ version: Version }> = ({ version }) => {
  const frame = useCurrentFrame();
  const { w, vertical } = useFormato();
  const t = frame / FPS;
  const lista = React.useMemo(() => subtitulos(version), [version]);
  const actual = lista.find((s) => t >= s.desde && t < s.hasta);
  if (!actual) return null;
  const entra = fr(frame, actual.desde * FPS, actual.desde * FPS + 5);
  return (
    <div style={{ position: 'absolute', left: 0, width: w, bottom: vertical ? 400 : 64, display: 'flex', justifyContent: 'center', zIndex: 100 }}>
      <div
        style={{
          maxWidth: vertical ? 940 : 1300, padding: vertical ? '16px 34px 20px' : '12px 28px 15px', borderRadius: 26, background: 'rgba(6,14,36,.78)',
          color: '#fff', fontFamily: FUENTE.marca, fontWeight: 700, fontSize: vertical ? 56 : 44, lineHeight: 1.16, letterSpacing: '-0.02em', textAlign: 'center',
          opacity: 0.4 + 0.6 * entra, transform: `translateY(${(1 - entra) * 10}px) scale(${0.97 + 0.03 * entra})`, boxShadow: '0 10px 30px rgba(0,0,0,.25)',
        }}
      >
        {actual.texto}
      </div>
    </div>
  );
};
