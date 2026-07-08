import puppeteer from 'puppeteer';
import { createServer } from 'vite';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { writeFileSync, existsSync, mkdirSync } from 'fs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const BASE_URL = 'https://www.optimumprimesolutions.co.ke';

const routes = [
  '/',
  '/about',
  '/tallyprime',
  '/industries',
  '/pricing',
  '/contact',
  '/faq',
  '/blog',
  '/knowledge-hub',
  '/tallyprime/implementation',
  '/tallyprime/licensing',
  '/tallyprime/cloud-hosting',
  '/tallyprime/training',
  '/tallyprime/support',
  '/tallyprime/customization',
  '/tallyprime/data-migration',
  '/industries/manufacturing',
  '/industries/distribution',
  '/industries/retail',
  '/industries/construction',
  '/industries/hardware',
  '/industries/ngos',
  '/industries/schools',
  '/industries/saccos',
];

async function prerender() {
  // Start Vite dev server
  const server = await createServer({ configFile: join(__dirname, 'vite.config.ts') });
  await server.listen(5174, true);
  
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });

  for (const route of routes) {
    console.log(`Prerendering: ${route}`);
    try {
      await page.goto(`http://localhost:5174${route}`, { waitUntil: 'networkidle0', timeout: 60000 });
      
      // Wait for content to be fully injected
      await page.evaluate(() => {
        document.dispatchEvent(new Event('custom-render-trigger'));
      });
      await new Promise(resolve => setTimeout(resolve, 2000));

      const html = await page.content();
      
      const outputPath = route === '/' 
        ? join(__dirname, 'dist', 'index.html') 
        : join(__dirname, 'dist', route, 'index.html');

      if (!existsSync(dirname(outputPath))) {
        mkdirSync(dirname(outputPath), { recursive: true });
      }
      writeFileSync(outputPath, html);
      console.log(`  -> Written to ${outputPath}`);
    } catch (err) {
      console.error(`  -> Failed: ${err.message}`);
    }
  }

  await browser.close();
  await server.close();
}

prerender().catch(console.error);
