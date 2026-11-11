// Captura pantallas reales de tiforti.cl para usarlas dentro del video.
// Uso: node scripts/capturar-sitio.mjs   (requiere `npm i -D playwright` o un Playwright global)
// Las capturas quedan en public/tiforti/. Se cierra el aviso de cookies antes de capturar.
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const { chromium } = require('playwright');

const SITIO = 'https://tiforti.cl/';
const OUT = new URL('../public/tiforti/', import.meta.url).pathname;

// Elementos que se ocultan SOLO en la captura para que el video no envejezca
// (precios de lanzamiento y plazos): el video no comunica precios ni plazos.
// Elementos que se ocultan SOLO en la captura: el aviso de cookies y el botón flotante de WhatsApp
// (tapan la portada) y las menciones a precios de lanzamiento y plazos, porque el video
// no comunica precios ni plazos y así no envejece si cambian.
const OCULTAR = `
  [class*="consent"], [class*="cookie"], [class*="whatsapp"], [class*="wa-float"], .wa { display: none !important; }
  .hero-ctas a:nth-child(2), .microtrust li:nth-child(3) { display: none !important; }
`;

const abrir = async (browser, viewport, opts = {}) => {
  const page = await browser.newPage({ viewport, ...opts });
  await page.goto(SITIO, { waitUntil: 'networkidle', timeout: 60000 });
  const rechazar = page.getByRole('button', { name: 'Rechazar' });
  if (await rechazar.count()) await rechazar.first().click().catch(() => {});
  await page.addStyleTag({ content: OCULTAR });
  // Recorre la página para activar las animaciones de aparición y la carga diferida.
  const alto = await page.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y < alto; y += 400) { await page.evaluate((v) => window.scrollTo(0, v), y); await page.waitForTimeout(120); }
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(600);
  return page;
};

const browser = await chromium.launch();

// Portada en celular (390 px de ancho, x3): 1170 x 2850 px.
const movil = await abrir(browser, { width: 390, height: 844 }, { deviceScaleFactor: 3, isMobile: true, hasTouch: true });
await movil.screenshot({ path: OUT + 'movil-inicio.png', fullPage: true, clip: { x: 0, y: 0, width: 390, height: 950 } });

// Portada en escritorio (1440 x 900, x2): 2880 x 1800 px.
const escritorio = await abrir(browser, { width: 1440, height: 900 }, { deviceScaleFactor: 2 });
await escritorio.screenshot({ path: OUT + 'escritorio-portada.png' });

await browser.close();
console.log('Capturas listas en public/tiforti/');
