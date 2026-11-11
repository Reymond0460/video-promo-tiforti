import React from 'react';
import { Composition } from 'remotion';
import { cargarFuentes } from './fuentes';
import { Laboratorio } from './Laboratorio';
import { Promo } from './Promo';
import { DURACION } from './tiempos';
import { FPS } from './tema';

cargarFuentes();

export const Raiz: React.FC = () => (
  <>
    {/* Entregable principal: vertical 9:16 para Reels, TikTok y Shorts */}
    <Composition id="PromoVertical" component={Promo} durationInFrames={DURACION.completo} fps={FPS} width={1080} height={1920} defaultProps={{ version: 'completo' as const, subtitulos: true }} />
    {/* Versión horizontal 16:9 */}
    <Composition id="PromoHorizontal" component={Promo} durationInFrames={DURACION.completo} fps={FPS} width={1920} height={1080} defaultProps={{ version: 'completo' as const, subtitulos: true }} />
    {/* Versión corta de 30 s para anuncios */}
    <Composition id="PromoCorto30" component={Promo} durationInFrames={DURACION.corto} fps={FPS} width={1080} height={1920} defaultProps={{ version: 'corto' as const, subtitulos: true }} />
    {/* Pruebas de piezas sueltas */}
    <Composition id="LabV" component={Laboratorio} durationInFrames={120} fps={FPS} width={1080} height={1920} defaultProps={{ prueba: 'taller' }} />
    <Composition id="LabH" component={Laboratorio} durationInFrames={120} fps={FPS} width={1920} height={1080} defaultProps={{ prueba: 'taller' }} />
  </>
);
