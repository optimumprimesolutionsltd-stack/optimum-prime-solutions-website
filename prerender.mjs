import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { writeFileSync, existsSync, mkdirSync, readFileSync, copyFileSync } from 'fs';
import { createRequire } from 'module';
import { createServer } from 'http';
import { extname } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const require = createRequire(import.meta.url);

// siteData.ts is TypeScript and this script runs under plain Node ESM (no ts-node/tsx
// loader configured), so it can't be imported directly. Scrape blog slugs out of the
// source text instead — this is what silently dropped every blog post route before,
// since the static `routes` list below never included them.
function getBlogRoutes() {
  const source = readFileSync(join(__dirname, 'src', 'data', 'siteData.ts'), 'utf-8');
  const slugs = [...source.matchAll(/slug:\s*'([^']+)'/g)].map((m) => m[1]);
  return slugs.map((slug) => `/blog/${slug}`);
}
const blogRoutes = getBlogRoutes();

const routes = [
  '/',
  '/about',
  '/testimonials',
  '/features',
  '/products',
  '/tallyprime',
  '/tally-prime-kenya',
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
  '/tallyprime/consulting',
  '/industries/manufacturing',
  '/industries/distribution',
  '/industries/retail',
  '/industries/construction',
  '/industries/hardware',
  '/industries/ngo',
  '/industries/ngos',
  '/industries/schools',
  '/industries/sacco',
  '/industries/saccos',
  '/knowledge-hub/videos',
  '/webinar',
  '/workshop-rsvp',
  '/workshop-attendees',
  '/why-choose-us',
  '/biz-analyst',
  '/privacy-policy',
  '/admin',
  '/404',
  ...blogRoutes,
];

const MIME_TYPES = {
  '.html': 'text/html',
  '.js': 'application/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.txt': 'text/plain',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.eot': 'application/vnd.ms-fontobject',
};

function createStaticServer(distDir, port, spaShellHtml) {
  return new Promise((resolve) => {
    const server = createServer((req, res) => {
      let url = new URL(req.url, `http://localhost:${port}`).pathname;
      if (!url.includes('.') && !url.endsWith('/')) {
        url += '/';
      }
      if (url === '/' || url.endsWith('/')) {
        url += 'index.html';
      }
      const filePath = join(distDir, url.substring(1));
      if (!filePath.startsWith(distDir)) {
        res.writeHead(403); res.end('Forbidden'); return;
      }
      const serveFile = async () => {
        try {
          const { readFile } = await import('fs/promises');
          let content;
          let contentType;
          try {
            content = await readFile(filePath, 'utf-8');
            contentType = MIME_TYPES[extname(filePath).toLowerCase()] || 'application/octet-stream';
          } catch {
            // SPA fallback: always serve the original, unrendered shell in memory
            // rather than re-reading dist/index.html from disk. That file gets
            // overwritten with each route's rendered output as the loop below
            // progresses, so a disk re-read would serve the PREVIOUS route's
            // already-tagged <head> as the base for the next route, causing
            // Helmet to stack a second title/canonical/robots tag on top of it.
            content = spaShellHtml;
            contentType = 'text/html';
          }
          res.writeHead(200, { 'Content-Type': contentType });
          res.end(content);
        } catch (err) { res.writeHead(404); res.end('Not Found'); }
      };
      serveFile();
    });
    server.listen(port, '127.0.0.1', () => {
      console.log(`  Static server on http://127.0.0.1:${port}`);
      resolve(server);
    });
  });
}

async function prerender() {
  const isVercel = process.env.VERCEL === '1';
  const isCI = process.env.CI === 'true';
  
  console.log('='.repeat(60));
  console.log('OPTIMUM PRIME SOLUTIONS - PRE-RENDER PIPELINE');
  console.log('='.repeat(60));
  console.log(`Environment: ${isVercel ? 'Vercel CI' : 'Local'} (CI=${isCI})`);
  
  // Save the SPA shell BEFORE prerendering (it has the SEO head)
  const spaShell = readFileSync(join(__dirname, 'dist', 'index.html'), 'utf-8');
  
  // Copy public assets
  console.log('\nPhase 1: Copying public assets...');
  const publicFiles = ['sitemap.xml', 'robots.txt', '3fd67103052cd75b3b1146cf0670b20e.txt', 'manifest.json'];
  for (const file of publicFiles) {
    const src = join(__dirname, 'public', file);
    const dst = join(__dirname, 'dist', file);
    if (existsSync(src) && !existsSync(dst)) {
      copyFileSync(src, dst);
      console.log(`  Copied: ${file}`);
    }
  }
  
  // Skip Puppeteer on Vercel - use pre-built dist/ committed to git
  if (isVercel) {
    console.log('\nPhase 2: Running on Vercel CI - skipping Puppeteer prerender.');
    console.log('  Using pre-built SSG dist/ from git.');
    
    // Copy public assets
    console.log('\nPhase 3: Copying public assets to dist...');
    const publicFiles = ['sitemap.xml', 'robots.txt', '3fd67103052cd75b3b1146cf0670b20e.txt', 'manifest.json'];
    for (const file of publicFiles) {
      const src = join(__dirname, 'public', file);
      const dst = join(__dirname, 'dist', file);
      if (existsSync(src)) {
        copyFileSync(src, dst);
        console.log(`  Copied: ${file}`);
      }
    }
    
    // Create route directories from SPA shell for any missing routes
    const routes = [
      '/', '/about', '/testimonials', '/features', '/products', '/tallyprime', '/tally-prime-kenya',
      '/industries', '/pricing', '/contact',
      '/faq', '/blog', '/knowledge-hub',
      '/tallyprime/implementation', '/tallyprime/licensing', '/tallyprime/cloud-hosting',
      '/tallyprime/training', '/tallyprime/support', '/tallyprime/customization', '/tallyprime/data-migration',
      '/tallyprime/consulting',
      '/industries/manufacturing', '/industries/distribution', '/industries/retail',
      '/industries/construction', '/industries/hardware', '/industries/ngo', '/industries/ngos',
      '/industries/schools', '/industries/sacco', '/industries/saccos',
      '/knowledge-hub/videos',
      '/webinar', '/workshop-rsvp', '/workshop-attendees', '/why-choose-us',
      '/biz-analyst', '/privacy-policy', '/admin',
      '/404',
      ...blogRoutes,
    ];
    for (const route of routes) {
      if (route !== '/') {
        // /404 is served as a flat dist/404.html by vercel.json's catch-all
        // (with a real 404 status), not as a directory — every other route
        // is a directory-style /route/index.html.
        const outputPath = route === '/404'
          ? join(__dirname, 'dist', '404.html')
          : join(__dirname, 'dist', route, 'index.html');
        if (!existsSync(outputPath)) {
          if (!existsSync(dirname(outputPath))) {
            mkdirSync(dirname(outputPath), { recursive: true });
          }
          writeFileSync(outputPath, spaShell);
          console.log(`  Created fallback: ${route}`);
        }
      }
    }
    
    console.log('\nPhase 4: Verifying prerendered output...');
    const finalHtml = readFileSync(join(__dirname, 'dist', 'index.html'), 'utf-8');
    const checks = {
      hasHeadSEO: finalHtml.includes('<title>') && finalHtml.includes('name="description"'),
      hasNoDuplicateHead: (finalHtml.match(/<title>/g) || []).length === 1,
      hasBodyContent: finalHtml.includes('<h1') || finalHtml.includes('<h2'),
      hasSemanticMain: finalHtml.includes('<main'),
      hasSchema: finalHtml.includes('application/ld+json'),
      hasCanonical: finalHtml.includes('rel="canonical"'),
      hasSkipNav: finalHtml.includes('skip-nav'),
    };
    const passed = Object.entries(checks).filter(([, v]) => v).length;
    const total = Object.keys(checks).length;
    console.log(`  Verification: ${passed}/${total} checks passed`);
    
    const { execSync } = await import('child_process');
    try {
      const count = execSync(`find ${join(__dirname, 'dist')} -name "index.html" | wc -l`, { encoding: 'utf-8' }).trim();
      const totalSize = execSync(`du -sh ${join(__dirname, 'dist')} | cut -f1`, { encoding: 'utf-8' }).trim();
      console.log(`\nFinal: ${count} HTML files, ${totalSize} total`);
    } catch {}
    
    console.log('\n' + '='.repeat(60));
    console.log('PRE-RENDER PIPELINE COMPLETE (Vercel mode)');
    console.log('='.repeat(60));
    return;
  }
  
  // Prerender with Puppeteer (local only)
  console.log('\nPhase 2: SSG prerendering with Puppeteer...');
  
  try {
    const puppeteerModule = await import('puppeteer');
    const puppeteer = puppeteerModule.default;
    
    const server = await createStaticServer(join(__dirname, 'dist'), 5178, spaShell);
    const browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--disable-gpu'],
    });
    const page = await browser.newPage();
    await page.setViewport({ width: 1920, height: 1080 });

    let successCount = 0;
    let failCount = 0;

    for (const route of routes) {
      try {
        // Use networkidle2 instead of networkidle0 for faster resolution
        await page.goto(`http://127.0.0.1:5178${route}`, { 
          waitUntil: 'domcontentloaded',
          timeout: 60000 
        });
        
        // Wait for React hydration
        await page.evaluate(() => {
          document.dispatchEvent(new Event('custom-render-trigger'));
        });
        
        // Wait for content to appear
        await page.waitForFunction(() => {
          const body = document.body.innerHTML;
          return body.includes('<h1') || body.includes('<h2') || body.includes('<main');
        }, { timeout: 15000 });
        
        // Brief additional wait
        await new Promise(resolve => setTimeout(resolve, 1000));

        const html = await page.content();
        
        const hasContent = html.includes('<h1') || html.includes('<h2') || html.includes('<main');
        if (!hasContent) {
          throw new Error('No semantic content');
        }

        const outputPath = route === '/'
          ? join(__dirname, 'dist', 'index.html')
          : route === '/404'
          ? join(__dirname, 'dist', '404.html')
          : join(__dirname, 'dist', route, 'index.html');
        
        if (!existsSync(dirname(outputPath))) {
          mkdirSync(dirname(outputPath), { recursive: true });
        }
        
        // Use Puppeteer's fully rendered document as-is: it already contains the
        // route-specific <head> (title/description/robots/canonical/OG set by
        // this route's <SEO> component via react-helmet-async) plus the static
        // tags from index.html (favicons, JSON-LD, GA4, etc). Previously this
        // discarded the rendered <head> and reused index.html's head verbatim
        // for every route, which is why every page shared the homepage's title,
        // canonical, and robots tag regardless of its own SEO settings.
        const finalHtml = /^<!doctype/i.test(html) ? html : `<!DOCTYPE html>\n${html}`;

        writeFileSync(outputPath, finalHtml);
        console.log(`  ✓ ${route} (${finalHtml.length} bytes)`);
        successCount++;
      } catch (err) {
        console.log(`  ✗ ${route} (${err.message})`);
        // Fallback: use SPA shell
        failCount++;
      }
    }

    await browser.close();
    server.close();
    
    console.log(`\nResult: ${successCount}/${routes.length} pages prerendered`);
  } catch (err) {
    console.log(`Puppeteer unavailable: ${err.message}`);
    console.log('Using SPA shell with SEO meta tags.');
    
    // Create route directories
    for (const route of routes) {
      if (route !== '/') {
        const outputPath = join(__dirname, 'dist', route, 'index.html');
        if (!existsSync(dirname(outputPath))) {
          mkdirSync(dirname(outputPath), { recursive: true });
        }
        writeFileSync(outputPath, spaShell);
      }
    }
  }
  
  // Verify the main index.html
  console.log('\nPhase 3: Verifying prerendered output...');
  const finalHtml = readFileSync(join(__dirname, 'dist', 'index.html'), 'utf-8');
  const checks = {
    hasHeadSEO: finalHtml.includes('<title>') && finalHtml.includes('name="description"'),
    hasNoDuplicateHead: (finalHtml.match(/<title>/g) || []).length === 1,
    hasBodyContent: finalHtml.includes('<h1') || finalHtml.includes('<h2'),
    hasSemanticMain: finalHtml.includes('<main'),
    hasSchema: finalHtml.includes('application/ld+json'),
    hasCanonical: finalHtml.includes('rel="canonical"'),
    hasSkipNav: finalHtml.includes('skip-nav'),
  };
  const passed = Object.entries(checks).filter(([, v]) => v).length;
  const total = Object.keys(checks).length;
  console.log(`  Verification: ${passed}/${total} checks passed`);
  Object.entries(checks).filter(([, v]) => !v).forEach(([k]) => console.log(`  FAILED: ${k}`));
  
  // Stats
  const { execSync } = await import('child_process');
  try {
    const count = execSync(`find ${join(__dirname, 'dist')} -name "index.html" | wc -l`, { encoding: 'utf-8' }).trim();
    const totalSize = execSync(`du -sh ${join(__dirname, 'dist')} | cut -f1`, { encoding: 'utf-8' }).trim();
    console.log(`\nFinal: ${count} HTML files, ${totalSize} total`);
  } catch {}
  
  console.log('\n' + '='.repeat(60));
  console.log('PRE-RENDER PIPELINE COMPLETE');
  console.log('='.repeat(60));
}

prerender().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
