// Configuración de Remotion (render y Studio).
import { Config } from '@remotion/cli/config';

Config.setVideoImageFormat('jpeg');
Config.setJpegQuality(92);
Config.setOverwriteOutput(true);
Config.setCodec('h264');
Config.setCrf(17);
Config.setPixelFormat('yuv420p');
Config.setConcurrency(null); // usa los núcleos disponibles

// Opcional: usar un Chrome ya instalado en vez de que Remotion descargue el suyo.
//   REMOTION_CHROME=/ruta/a/chrome-headless-shell npm run render
if (process.env.REMOTION_CHROME) {
  Config.setBrowserExecutable(process.env.REMOTION_CHROME);
}
