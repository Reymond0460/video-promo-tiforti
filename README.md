# Video publicitario de TiforTi

Comercial para redes sociales de [tiforti.cl](https://tiforti.cl): **“Tú tienes la idea. Nosotros la hacemos realidad.”**

Cuenta la historia de Camila, una emprendedora que hace velas artesanales (*Lumbre*, un negocio ficticio), desde que busca cómo tener su página web hasta que el equipo de TiforTi se la entrega.

El video está hecho con código ([Remotion](https://www.remotion.dev/): React + TypeScript). Todo es editable: textos, tiempos, colores, personajes, narración y música.

## Videos listos para publicar

En la carpeta [`entregables/`](entregables/):

| Archivo | Formato | Uso |
| --- | --- | --- |
| `tiforti-promo-vertical-1080x1920.mp4` | 9:16 · 75 s | Reels, TikTok, Shorts (pieza principal) |
| `tiforti-promo-horizontal-1920x1080.mp4` | 16:9 · 75 s | YouTube, sitio web, presentaciones |
| `tiforti-promo-corto-30s-1080x1920.mp4` | 9:16 · 30 s | Anuncios pagados |
| `tiforti-promo-completo.srt` · `tiforti-promo-corto-30s.srt` | Subtítulos | Para subirlos aparte a cada plataforma |

Los tres videos llevan los subtítulos incrustados, narración, música y efectos mezclados (audio a −14 LUFS aprox.).

## La historia, escena por escena

| Tiempo | Escena | Qué se ve |
| --- | --- | --- |
| 0:00–0:10 | El problema | Camila en su taller. Busca opciones en redes: plantillas todas iguales, agencias caras, cursos complicados. |
| 0:10–0:20 | El descubrimiento | Aparece la publicación de TiforTi. Entra al sitio (captura real) y ve demos reales de distintos rubros. Escribe. |
| 0:20–0:30 | Conocemos su idea | Videollamada con el equipo, apuntes de la reunión, boceto y primera maqueta con sus colores. |
| 0:30–0:47 | Manos a la obra | Una semana de trabajo: plan, VS Code, Firebase, pruebas en escritorio y celular, publicación. |
| 0:47–1:00 | El resultado | Le presentan su página. Silencio, una sonrisa: “¡Qué bonita quedó! Es justo lo que tenía en mente.” |
| 1:00–1:15 | Cierre | Muchas otras ideas (demos reales), el lema, el logo y `tiforti.cl`. |

## Cómo usar el proyecto

Requisitos: Node 18 o superior. Para regenerar voz o música, además Python 3.10+.

```bash
npm install
npm run studio            # abre Remotion Studio: vista previa y edición en vivo
npm run render            # exporta las tres versiones a entregables/
npm run render:vertical   # solo una (también :horizontal y :corto)
```

La primera exportación descarga un Chrome propio de Remotion. Para usar uno ya instalado: `REMOTION_CHROME=/ruta/a/chrome-headless-shell npm run render`.

### Cambiar la narración

1. Edita `src/datos/guion.json`: `tts` es lo que dice la voz, `subs` cómo se parte en subtítulos, `inicio` el segundo en que empieza cada frase.
2. `pip install piper-tts numpy scipy soundfile` y luego `npm run voz` (sintetiza y mide los tiempos).
3. `npm run subtitulos` y `npm run render`.

**Con una voz humana (recomendado):** graba cada frase del guion, guárdala como `public/audio/voz/<id>.wav` (c01, c02, …) y ejecuta `python3 scripts/generar-voz.py --solo-medir`. Los subtítulos se vuelven a sincronizar solos.

### Cambiar la música o los efectos

`npm run audio` vuelve a generar la música (`scripts/generar-musica.py`) y los efectos (`scripts/generar-sfx.py`). Para usar otra pista, reemplaza `public/audio/musica-completa.wav` (75 s) y `musica-corta.wav` (30 s).

### Cambiar lo que se ve

| Qué | Dónde |
| --- | --- |
| Orden y duración de las tomas | `src/Promo.tsx` (listas `TOMAS_COMPLETO` y `TOMAS_CORTO`) |
| Cada escena | `src/escenas/E1…E6` |
| Aspecto de Camila y del equipo (pelo, ropa, lentes, barba) | `src/componentes/Persona.tsx` (`CAMILA`, `DEV_A`, `DEV_B`) |
| Colores y tipografías | `src/tema.ts` |
| Página de Lumbre | `src/componentes/SitioLumbre.tsx` |
| Código que aparece en VS Code | `src/componentes/VSCode.tsx` (`CODIGO`, `ARBOL`) |
| Capturas de tiforti.cl | `npm run capturas` (requiere Playwright) |
| Momentos de los efectos de sonido | `src/tiempos.ts` (`EFECTOS`) |

Cada toma se adapta sola al formato vertical u horizontal.

## Decisiones de producción

- **Animación ilustrada, no filmación.** No hay cámara ni actores: los personajes son ilustraciones animadas. Se eligió un estilo cálido y sencillo en lugar de imitar personas reales con IA.
- **Identidad real de TiforTi.** Logo, colores, tipografía (Plus Jakarta Sans) y capturas vienen del sitio. Las demos que aparecen son las publicadas en “Proyectos y demos”.
- **Sin precios ni plazos prometidos.** En la captura de la portada se ocultan el botón de precios y “Lista en una semana”. La semana de trabajo lleva siempre en pantalla: “Ejemplo de un proyecto acotado. Cada proyecto tiene su propio plazo.”
- **Firebase como ejemplo.** Se muestra con la leyenda “según lo que cada proyecto necesite”.
- **Lumbre es ficticio.** Si existe un negocio con ese nombre, es coincidencia; conviene cambiarlo si genera confusión.
- **El equipo es una representación.** Los dos desarrolladores no retratan a nadie; su aspecto se ajusta en `Persona.tsx`.

## Créditos y licencias de los recursos

| Recurso | Origen | Licencia |
| --- | --- | --- |
| Logo, capturas y demos | tiforti.cl | Propiedad de TiforTi |
| Ilustraciones, animación, página de Lumbre | Hechas para este proyecto | Propias |
| Música y efectos de sonido | Sintetizados por los scripts de `scripts/` | Propios |
| Voz | [Piper](https://github.com/OHF-Voice/piper1-gpl), voz `es_MX-claude-high` | Voz: Apache-2.0 (el motor es GPL-3.0; no condiciona el audio generado) |
| Plus Jakarta Sans, Fraunces, Caveat, JetBrains Mono | Tipografías | SIL Open Font License 1.1 |
| Remotion | Motor de render | Gratis para equipos de hasta 3 personas ([licencia](https://www.remotion.dev/docs/license)) |
