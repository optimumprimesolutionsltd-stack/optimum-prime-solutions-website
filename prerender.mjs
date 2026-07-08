import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { writeFileSync, existsSync, mkdirSync, readFileSync, copyFileSync } from 'fs';
import { spawn } from 'child_process';

const __dirname = dirname(fileURLToPath(import.meta.url));

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

// Read the built index.html (SPA shell) as base template
const baseHtml = readFileSync(join(__dirname, 'dist', 'index.html'), 'utf-8');

// Verify base HTML has the essential SEO elements (it should, since it's prerendered via React hydration)
function verifyBaseHTML(html) {
  const checks = {
    hasDoctype: html.includes('<!DOCTYPE html>'),
    hasTitle: html.includes('<title>'),
    hasMetaDesc: html.includes('name="description"'),
    hasCanonical: html.includes('rel="canonical"'),
    hasOGTitle: html.includes('property="og:title"'),
    hasOGDesc: html.includes('property="og:description"'),
    hasSchema: html.includes('application/ld+json'),
    hasManifest: html.includes('manifest.json'),
    hasLang: html.includes('lang="en-KE"'),
  };
  
  const allPass = Object.values(checks).every(v => v);
  if (allPass) {
    console.log('Base HTML SEO verification: ALL PASS');
  } else {
    const failed = Object.entries(checks).filter(([, v]) => !v);
    console.log('Base HTML SEO verification: FAILURES:', failed.map(([k]) => k).join(', '));
  }
  return checks;
}

async function prerender() {
  console.log('Starting pre-render pipeline...');
  
  // Verify the base build output has proper SEO
  verifyBaseHTML(baseHtml);
  
  // Ensure sitemap, robots.txt, and IndexNow key are in dist
  const publicFiles = ['sitemap.xml', 'robots.txt', '3fd67103052cd75b3b1146cf0670b20e.txt', 'manifest.json', 'favicon.ico', 'apple-touch-icon.png'];
  for (const file of publicFiles) {
    const src = join(__dirname, 'public', file);
    const dst = join(__dirname, 'dist', file);
    if (existsSync(src) && !existsSync(dst)) {
      copyFileSync(src, dst);
      console.log(`  -> Copied ${file} to dist/`);
    }
  }
  
  // Try to use Puppeteer for full SSG prerendering
  try {
    console.log('Attempting full SSG prerendering with Puppeteer...');
    
    // Dynamic import to avoid crashing if puppeteer isn't available
    const { default: puppeteer } = await import('puppeteer');
    const { createServer } = await import('vite');
    
    // Start preview server
    const server = await createServer({
      configFile: join(__dirname, 'vite.config.ts'),
      preview: { port: 5175, strictPort: true },
    });
    
    const browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--disable-gpu'],
    });
    
    const page = await browser.newPage();
    await page.setViewport({ width: 1920, height: 1080 });

    for (const route of routes) {
      console.log(`  Prerendering: ${route}`);
      try {
        await page.goto(`http://localhost:5175${route}`, { 
          waitUntil: 'networkidle0', 
          timeout: 90000 
        });
        
        await page.evaluate(() => {
          document.dispatchEvent(new Event('custom-render-trigger'));
        });
        await new Promise(resolve => setTimeout(resolve, 3000));

        const html = await page.content();
        
        // Verify the prerendered HTML has real content
        const hasContent = html.includes('<h1') || html.includes('<h2') || html.includes('<main');
        if (!hasContent) {
          console.warn(`  -> Warning: No semantic content detected for ${route}, using fallback`);
          writeFileSync(join(__dirname, 'dist', route === '/' ? 'index.html' : join('dist', route, 'index.html')), baseHtml);
        } else {
          const outputPath = route === '/' 
            ? join(__dirname, 'dist', 'index.html') 
            : join(__dirname, 'dist', route, 'index.html');
          if (!existsSync(dirname(outputPath))) {
            mkdirSync(dirname(outputPath), { recursive: true });
          }
          writeFileSync(outputPath, html);
          console.log(`  -> Written: ${outputPath}`);
        }
      } catch (err) {
        console.error(`  -> Failed (${err.message}), using fallback`);
        const outputPath = route === '/' 
          ? join(__dirname, 'dist', 'index.html') 
          : join(__dirname, 'dist', route, 'index.html');
        if (!existsSync(dirname(outputPath))) {
          mkdirSync(dirname(outputPath), { recursive: true });
        }
        writeFileSync(outputPath, baseHtml);
      }
    }

    await browser.close();
    await server.close();
    console.log('Full SSG prerendering complete!');
  } catch (err) {
    console.log('Full prerendering not available (puppeteer not configured):', err.message);
    console.log('Using SPA shell with React hydration (SEO meta tags are in <head>)...');
    console.log('For full SSG, run: npm install puppeteer && npm run build');
    
    // Create route directories for SPA fallback
    for (const route of routes) {
      if (route !== '/') {
        const outputPath = join(__dirname, 'dist', route, 'index.html');
        if (!existsSync(dirname(outputPath))) {
          mkdirSync(dirname(outputPath), { recursive: true });
        }
        writeFileSync(outputPath, baseHtml);
        console.log(`  -> SPA fallback: ${outputPath}`);
      }
    }
  }
  
  // Final stats
  const htmlFiles = [];
  function countHTML(dir) {
    const entries = readFileSync('/dev/stdin').toString();
  }
  
  const { execSync } = await import('child_process');
  try {
    const result = execSync(`find ${join(__dirname, 'dist')} -name "*.html" | wc -l`, { encoding: 'utf-8' });
    console.log(`\nTotal HTML files in dist: ${result.trim()}`);
  } catch {}
}

prerender().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
