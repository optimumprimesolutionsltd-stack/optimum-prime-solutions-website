import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { writeFileSync, existsSync, mkdirSync, readFileSync, copyFileSync, readdirSync, statSync, rmSync } from 'fs';
import { createRequire } from 'module';
import { createServer } from 'http';
import { extname } from 'path';
import { execFileSync } from 'child_process';

const __dirname = dirname(fileURLToPath(import.meta.url));
const require = createRequire(import.meta.url);

// Walk dist/ in plain Node rather than shelling out to `find` and `du`. Those are
// Unix-only, and the paths were interpolated into the command unquoted — so any
// checkout whose directory contains a space (e.g. "C:\Users\MR CHEGE\...") split
// into separate arguments and the stats line reported "0 HTML files".
function collectDistStats(dir) {
  let htmlFiles = 0;
  let bytes = 0;
  const walk = (current) => {
    for (const entry of readdirSync(current, { withFileTypes: true })) {
      const full = join(current, entry.name);
      if (entry.isDirectory()) {
        walk(full);
      } else if (entry.isFile()) {
        bytes += statSync(full).size;
        // Matches the old `find -name "index.html"`: route pages only, not 404.html.
        if (entry.name === 'index.html') htmlFiles += 1;
      }
    }
  };
  if (existsSync(dir)) walk(dir);
  return { htmlFiles, bytes };
}

// Approximates `du -sh` output (1K, 4.2M, …).
function formatSize(bytes) {
  const units = ['B', 'K', 'M', 'G'];
  let value = bytes;
  let unit = 0;
  while (value >= 1024 && unit < units.length - 1) {
    value /= 1024;
    unit += 1;
  }
  return `${unit === 0 || value >= 10 ? Math.round(value) : value.toFixed(1)}${units[unit]}`;
}

// Live blog posts are stored in Firebase under /siteData (world-readable — the
// whole public site reads it unauthenticated), and posts added through the admin
// panel exist ONLY there, never in siteData.ts. Fetched over the REST API rather
// than the Firebase SDK so this stays a dependency-free plain-Node script.
const RTDB_BLOGS_URL =
  'https://optimum-prime-website-default-rtdb.europe-west1.firebasedatabase.app/siteData/blogs.json';

// Mirrors src/utils/slugify.ts. Kept in sync by hand because that file is
// TypeScript and this script has no TS loader — if the app's slug rules change,
// change them here too or admin posts will prerender to the wrong directory.
function slugify(title) {
  return title
    .toLowerCase()
    .replace(/[®©™]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

function getPostSlug(post) {
  return post.slug || slugify(post.title);
}

// siteData.ts is TypeScript and this script runs under plain Node ESM (no ts-node/tsx
// loader configured), so it can't be imported directly. Scrape blog slugs out of the
// source text instead — this is what silently dropped every blog post route before,
// since the static `routes` list below never included them.
function getSeedBlogPosts() {
  const source = readFileSync(join(__dirname, 'src', 'data', 'siteData.ts'), 'utf-8');
  // `date` follows `slug` in each post object, separated by the excerpt, so pair
  // them with a bounded non-greedy gap rather than matching each field alone.
  const paired = [...source.matchAll(/slug:\s*'([^']+)'[\s\S]{0,2000}?date:\s*'([^']+)'/g)];
  const byslug = new Map(paired.map((m) => [m[1], m[2]]));
  // Any slug the pairing missed still gets a route, just without a lastmod.
  for (const m of source.matchAll(/slug:\s*'([^']+)'/g)) {
    if (!byslug.has(m[1])) byslug.set(m[1], null);
  }
  return [...byslug].map(([slug, date]) => ({ route: `/blog/${slug}`, lastmod: date }));
}

// Union of the seed posts in siteData.ts and whatever is live in Firebase.
//
// `regeneratingDist` says whether this run is about to REWRITE dist/ (a local or
// CI build) or merely read the copy already committed to git (Vercel). It decides
// what a failed fetch means: when dist/ is being rewritten a fallback silently
// deletes pages, so the build must stop; on Vercel nothing is regenerated, so the
// same failure is harmless and a transient blip must not break the deploy.
async function getBlogPosts({ regeneratingDist }) {
  const seed = getSeedBlogPosts();
  try {
    const res = await fetch(RTDB_BLOGS_URL, { signal: AbortSignal.timeout(15000) });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    // Firebase returns an array for integer-keyed data and an object otherwise;
    // either way the entries can contain nulls from deleted records.
    const posts = (Array.isArray(data) ? data : Object.values(data || {})).filter(
      (p) => p && p.title
    );
    // Live data wins on lastmod — a post edited in the admin panel has a fresher
    // date there than whatever siteData.ts was committed with. Title and excerpt
    // are available only from Firebase; the siteData scrape does not carry them,
    // which is why llms.txt regeneration is skipped outright when this fetch
    // fails rather than written with posts missing their descriptions.
    const merged = new Map(seed.map((p) => [p.route, { lastmod: p.lastmod }]));
    for (const p of posts) {
      const route = `/blog/${getPostSlug(p)}`;
      merged.set(route, {
        lastmod: p.date || merged.get(route)?.lastmod || null,
        title: p.title,
        excerpt: p.excerpt,
      });
    }
    const added = merged.size - seed.length;
    console.log(
      `  Blog routes: ${merged.size} (${seed.length} from siteData.ts, ${added} more live in Firebase)`
    );
    return [...merged].map(([route, meta]) => ({ route, ...meta }));
  } catch (err) {
    // A failed fetch is NOT a soft degradation. dist/ is committed wholesale and
    // Vercel serves whatever is in it, so a build that quietly falls back to the
    // seed list doesn't just "miss" the admin-panel posts — it removes their
    // directories from dist/, and the next deploy DELETES those pages from the
    // live site. That very nearly shipped once: the fetch failed, the build
    // still printed "55/55 pages prerendered" and "7/7 checks passed", and only
    // an HTML file count that dropped by one gave it away.
    //
    // So stop, loudly, and make continuing a deliberate act. The escape hatch is
    // for genuinely offline builds where nobody intends to commit the result.
    const detail =
      `Could not read blog posts from Firebase (${err.message}). ` +
      `Only the ${seed.length} seed slugs in siteData.ts are available, so any ` +
      `post created in the admin panel would be dropped from dist/ — and deleted ` +
      `from the live site on the next deploy.`;
    if (regeneratingDist && process.env.ALLOW_STALE_BLOGS !== '1') {
      throw new Error(
        `${detail}\n` +
          `  Re-run once the database is reachable. To build anyway, set ` +
          `ALLOW_STALE_BLOGS=1 — but do NOT commit the dist/ it produces.`
      );
    }
    console.warn(`  ! ${detail}`);
    console.warn(
      regeneratingDist
        ? '  ! ALLOW_STALE_BLOGS=1 is set, continuing with the seed list. ' +
            'This dist/ is incomplete and must not be committed.'
        : '  ! Not regenerating dist/, so the committed pages are unaffected — ' +
            'only the sitemap and llms.txt lose their Firebase-only entries.'
    );
    return seed;
  }
}

const SITE_ORIGIN = 'https://www.optimumprimesolutions.co.ke';

// IndexNow pushes changed URLs straight to Bing (and Yandex, Seznam, Naver)
// without an account. The key is the file already sitting in public/ — its name
// and its contents must match, which is how the receiving engine proves the
// submitter controls the domain.
const INDEXNOW_KEY = '3fd67103052cd75b3b1146cf0670b20e';
const INDEXNOW_ENDPOINT = 'https://api.indexnow.org/IndexNow';

// Which prerendered pages actually changed in this build. IndexNow is for
// changed URLs — resubmitting the whole site on every build is what gets a
// submitter throttled or ignored — so ask git rather than guessing. If this
// isn't a git checkout, or git errors, return null and let the caller skip
// submission entirely rather than fall back to blasting all 49 URLs.
function changedDistPages() {
  try {
    const out = execFileSync('git', ['status', '--porcelain', '--', 'dist'], {
      cwd: __dirname,
      encoding: 'utf-8',
    });
    const paths = out
      .split('\n')
      .filter(Boolean)
      // Index and worktree status columns: take anything added or modified,
      // skip deletions — a deleted page is not a URL worth announcing.
      .filter((line) => /^[AM ?][AM ?]\s/.test(line) && !line.includes('D'))
      .map((line) => line.slice(3).trim().replace(/^"|"$/g, ''))
      .filter((p) => p.endsWith('/index.html'));
    return paths.map((p) => {
      const route = p.replace(/^dist/, '').replace(/\/index\.html$/, '');
      return route === '' ? `${SITE_ORIGIN}/` : `${SITE_ORIGIN}${route}/`;
    });
  } catch {
    return null;
  }
}

async function submitToIndexNow(urls) {
  const body = JSON.stringify({
    host: new URL(SITE_ORIGIN).host,
    key: INDEXNOW_KEY,
    keyLocation: `${SITE_ORIGIN}/${INDEXNOW_KEY}.txt`,
    urlList: urls,
  });
  const res = await fetch(INDEXNOW_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body,
    signal: AbortSignal.timeout(20000),
  });
  return res.status;
}

// Never list these. /admin and /404 are not content; the two attendee pages
// render with noIndex. A sitemap entry for a noindex URL is a direct
// contradiction and Search Console reports it as an error.
const SITEMAP_EXCLUDE = new Set([
  '/admin',
  '/404',
  '/workshop-attendees',
  '/webinar-attendees',
]);

// The floating chat widget runs a perpetual framer-motion wobble, and Puppeteer
// snapshots whatever rotation it happens to hold — so every build wrote a
// different `transform: rotate(-7.63214deg)` into all 54 pages. That is pure
// noise in every dist/ commit, and it makes it impossible to tell which pages
// genuinely changed.
//
// Normalised here in Node rather than in the page: framer-motion caches its own
// requestAnimationFrame reference at import time, so overriding the global from
// page.evaluate does not stop the loop, and any DOM edit gets overwritten before
// the snapshot is taken.
//
// Only fractional angles are pinned. Whole-degree rotations like rotate(520deg)
// are static design values in the markup and are left exactly as they are.
function normaliseAnimationNoise(html) {
  return html.replace(/rotate\(-?\d+\.\d+deg\)/g, 'rotate(0deg)');
}

// llms.txt is the file AI engines read to work out what a site is and which
// pages are worth citing. Everything in it is hand-written except the guide
// list between these markers — that had drifted to listing /blog and none of
// the eleven posts under it, which is exactly the content most worth citing.
//
// Only the marked block is touched; the positioning prose, service descriptions
// and company details around it are left exactly as written.
const LLMS_BEGIN = '<!-- BEGIN GENERATED GUIDES -->';
const LLMS_END = '<!-- END GENERATED GUIDES -->';

function buildLlmsGuides(blogPosts) {
  // Newest first — the same order a reader would see on /blog.
  const sorted = [...blogPosts]
    .filter((p) => p.title)
    .sort((a, b) => String(b.lastmod || '').localeCompare(String(a.lastmod || '')));
  return sorted
    .map((p) => {
      // Excerpts are author-written and occasionally span lines; collapse them
      // so each guide stays one bullet, which is the format llms.txt expects.
      const desc = (p.excerpt || '').replace(/\s+/g, ' ').trim();
      const title = p.title.replace(/\s+/g, ' ').trim();
      return `- [${title}](${SITE_ORIGIN}${p.route}/)${desc ? `: ${desc}` : ''}`;
    })
    .join('\n');
}

function updateLlmsTxt(path, blogPosts) {
  if (!existsSync(path)) return { ok: false, reason: 'public/llms.txt not found' };
  const current = readFileSync(path, 'utf-8');
  const start = current.indexOf(LLMS_BEGIN);
  const end = current.indexOf(LLMS_END);
  if (start === -1 || end === -1 || end < start) {
    return { ok: false, reason: 'generated-guides markers missing — left untouched' };
  }
  const guides = buildLlmsGuides(blogPosts);
  const next =
    current.slice(0, start + LLMS_BEGIN.length) + '\n' + guides + '\n' + current.slice(end);
  const changed = next !== current;
  if (changed) writeFileSync(path, next);
  return { ok: true, changed, count: guides ? guides.split('\n').length : 0 };
}

// Sitemap <loc> values. No trailing slash except on the root, matching the
// canonical emitted by SEO.tsx, the internal <Link> hrefs, and the 308 in
// vercel.json. These previously carried a trailing slash that nothing else
// used, so every URL in the sitemap was one Google had never crawled.
function routeToLoc(route) {
  return route === '/' ? `${SITE_ORIGIN}/` : `${SITE_ORIGIN}${route}`;
}

// The committed sitemap carries hand-tuned <priority> and <changefreq> values,
// and <lastmod> dates that reflect real edits. Regenerating from scratch would
// throw all of that away and stamp today's date on every page, which is both
// untrue and a signal Google discounts. So: read what's there, keep it, and
// only add what's missing.
function readExistingSitemap(path) {
  const existing = new Map();
  if (!existsSync(path)) return existing;
  const xml = readFileSync(path, 'utf-8');
  for (const block of xml.matchAll(/<url>([\s\S]*?)<\/url>/g)) {
    const get = (tag) => (block[1].match(new RegExp(`<${tag}>([^<]*)</${tag}>`)) || [])[1];
    const loc = get('loc');
    if (loc) {
      existing.set(loc.trim(), {
        lastmod: get('lastmod'),
        changefreq: get('changefreq'),
        priority: get('priority'),
      });
    }
  }
  return existing;
}

// A route is only listed if the page it renders claims that URL as its own
// canonical. /industries/ngos and /industries/saccos are alias routes that
// canonicalise to the singular form — listing them would put non-canonical URLs
// in the sitemap, which Search Console reports as an error. Reading the built
// HTML means new aliases are handled automatically instead of via a hardcoded
// list that someone has to remember to update.
function isCanonicalRoute(distDir, route) {
  const file = route === '/'
    ? join(distDir, 'index.html')
    : join(distDir, route, 'index.html');
  if (!existsSync(file)) return { ok: true, reason: 'no prerendered file — listing anyway' };
  const html = readFileSync(file, 'utf-8');
  const m = html.match(/rel="canonical"\s+href="([^"]+)"/);
  if (!m) return { ok: true, reason: 'no canonical tag' };
  const canonical = m[1].trim();
  const own = routeToLoc(route);
  return canonical === own
    ? { ok: true }
    : { ok: false, reason: `canonical -> ${canonical}` };
}

function buildSitemapXml(routes, blogLastmod, existing, todayIso, distDir) {
  const entries = [];
  const skipped = [];
  for (const route of routes) {
    if (SITEMAP_EXCLUDE.has(route)) continue;
    const canon = isCanonicalRoute(distDir, route);
    if (!canon.ok) {
      skipped.push({ route, reason: canon.reason });
      continue;
    }
    const loc = routeToLoc(route);
    const prev = existing.get(loc);
    const isBlogPost = route.startsWith('/blog/');
    entries.push({
      loc,
      // Prefer what was already published; fall back to the post's own date for
      // a blog entry, and only then to the build date.
      lastmod: prev?.lastmod || (isBlogPost ? blogLastmod.get(route) : null) || todayIso,
      changefreq: prev?.changefreq || (isBlogPost ? 'yearly' : 'monthly'),
      priority: prev?.priority || (isBlogPost ? '0.7' : '0.8'),
      isNew: !prev,
    });
  }
  const body = entries
    .map(
      (e) =>
        `  <url>\n    <loc>${e.loc}</loc>\n    <lastmod>${e.lastmod}</lastmod>\n` +
        `    <changefreq>${e.changefreq}</changefreq>\n    <priority>${e.priority}</priority>\n  </url>`
    )
    .join('\n');
  const xml =
    `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<!--\n` +
    `  Generated by prerender.mjs from the same route list used to prerender the\n` +
    `  site, so a blog post published through the admin panel appears here without\n` +
    `  anyone remembering to add it.\n` +
    `\n` +
    `  Editing priority, changefreq and lastmod by hand IS safe — those values are\n` +
    `  read back in and preserved on every rebuild. Adding or removing url blocks\n` +
    `  by hand is not: the URL set comes from the route list each time.\n` +
    `\n` +
    `  Alias routes are omitted automatically when the page they render points its\n` +
    `  canonical somewhere else.\n` +
    `-->\n` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>\n`;
  return { xml, entries, skipped };
}

const staticRoutes = [
  '/',
  '/about',
  '/testimonials',
  '/features',
  '/products',
  '/tallyprime',
  '/tally-prime-kenya',
  '/tallyprime-small-business-kenya',
  '/kra-etims-compliance',
  '/cloud-accounting-software-kenya',
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
  '/webinar-attendees',
  '/why-choose-us',
  '/biz-analyst',
  '/privacy-policy',
  '/admin',
  '/404',
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

  // Resolved once, up front, and shared by both the Vercel and local paths so
  // the two can't drift out of sync the way two hardcoded lists did.
  const blogPosts = await getBlogPosts({ regeneratingDist: !isVercel });
  const routes = [...staticRoutes, ...blogPosts.map((p) => p.route)];

  // Save the SPA shell BEFORE prerendering (it has the SEO head)
  const spaShell = readFileSync(join(__dirname, 'dist', 'index.html'), 'utf-8');

  // Copy public assets
  console.log('\nPhase 1: Copying public assets...');
  const publicFiles = ['sitemap.xml', 'robots.txt', 'llms.txt', '3fd67103052cd75b3b1146cf0670b20e.txt', 'manifest.json'];
  for (const file of publicFiles) {
    const src = join(__dirname, 'public', file);
    const dst = join(__dirname, 'dist', file);
    // sitemap.xml is regenerated by this script and robots.txt is edited by
    // hand; both must overwrite whatever sits in dist/. Otherwise `npm run
    // prerender` on its own (no vite build to empty dist/ first) keeps shipping
    // the previous build's copy, and an edit to public/robots.txt silently
    // never reaches the site.
    const mustOverwrite =
      file === 'sitemap.xml' || file === 'robots.txt' || file === 'llms.txt';
    if (existsSync(src) && (mustOverwrite || !existsSync(dst))) {
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
    const publicFiles = ['sitemap.xml', 'robots.txt', 'llms.txt', '3fd67103052cd75b3b1146cf0670b20e.txt', 'manifest.json'];
    for (const file of publicFiles) {
      const src = join(__dirname, 'public', file);
      const dst = join(__dirname, 'dist', file);
      if (existsSync(src)) {
        copyFileSync(src, dst);
        console.log(`  Copied: ${file}`);
      }
    }
    
    // Create route directories from SPA shell for any missing routes. Uses the
    // same `routes` resolved at the top of prerender() — this used to be a
    // second hardcoded copy of the list, which could silently fall behind the
    // first one.
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
      // Match the opening tag, not the literal "<title>": the tag now carries
      // data-rh so Helmet adopts it on hydration instead of appending a second
      // one, and an exact-string check silently reported that fix as a failure.
      hasHeadSEO: /<title[\s>]/.test(finalHtml) && finalHtml.includes('name="description"'),
      hasNoDuplicateHead: (finalHtml.match(/<title[\s>]/g) || []).length === 1,
      hasBodyContent: finalHtml.includes('<h1') || finalHtml.includes('<h2'),
      hasSemanticMain: finalHtml.includes('<main'),
      hasSchema: finalHtml.includes('application/ld+json'),
      hasCanonical: finalHtml.includes('rel="canonical"'),
      hasSkipNav: finalHtml.includes('skip-nav'),
    };
    const passed = Object.entries(checks).filter(([, v]) => v).length;
    const total = Object.keys(checks).length;
    console.log(`  Verification: ${passed}/${total} checks passed`);
    
    const { htmlFiles, bytes } = collectDistStats(join(__dirname, 'dist'));
    console.log(`\nFinal: ${htmlFiles} HTML files, ${formatSize(bytes)} total`);
    
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

        // Blog posts are loaded from Firebase, which resolves well after first
        // paint. Until it does, BlogPostPage correctly renders NotFoundPage —
        // and NotFoundPage has an <h1>, so the generic wait above sails right
        // past it. Capturing at that moment writes a static "Page Not Found"
        // for a live post, which is worse than not prerendering it at all.
        // Wait for the post's own BlogPosting schema, which only renders once
        // the post has actually been found.
        if (route.startsWith('/blog/')) {
          await page.waitForFunction(
            () =>
              [...document.querySelectorAll('script[type="application/ld+json"]')].some((s) =>
                s.textContent.includes('"BlogPosting"')
              ),
            { timeout: 25000 }
          );
        }

        // Brief additional wait
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Freeze animations before capturing. The floating chat widget runs a
        // perpetual framer-motion wobble that writes an inline
        // `transform: rotate(-7.63214deg)` — whatever value it happened to hold
        // at snapshot time. Left alone that makes every build differ on every
        // page for no reason: pure noise in each dist/ commit, and it defeats
        // any attempt to work out which pages genuinely changed.
        //
        // framer-motion drives this from JS, so disabling CSS animation is not
        // enough; the inline transform has to be normalised after the fact.
        // Tag the SEO head tags so the client can remove them before React
        // renders — see the matching block at the top of src/main.tsx.
        //
        // React 19 hoists <title>, <meta> and <link> rendered anywhere in the
        // tree into <head> itself, and has no way to adopt DOM nodes it did not
        // create. So these prerendered tags survived alongside React's own and
        // every page served two <title>, two meta descriptions and two
        // canonicals once JavaScript ran. Bing reports that as an error.
        //
        // They still have to be in the static HTML for crawlers that never run
        // JavaScript, hence tag-then-remove rather than simply omitting them.
        // (Marking them data-rh so react-helmet-async would adopt them does not
        // work: React is doing the hoisting here, not Helmet.)
        //
        // Deliberately narrow, and scoped to <head>: only the tags SEO.tsx
        // renders. Tagging anything static from index.html — charset, viewport,
        // favicons, the site-verification meta, or the LocalBusiness / WebSite /
        // SiteNavigationElement JSON-LD — would delete it on load and nothing
        // would put it back.
        //
        // The SEO component's JSON-LD is excluded on purpose: React puts it in
        // <body>, so it is outside this query, and it is not duplicated the way
        // the head tags are. JSON-LD is valid anywhere in the document.
        const markedTags = await page.evaluate(() => {
          const selectors = [
            'title',
            'meta[name="description"]',
            'meta[name="robots"]',
            'link[rel="canonical"]',
            'meta[property^="og:"]',
            'meta[property^="article:"]',
            'meta[name^="twitter:"]',
          ].join(',');
          let n = 0;
          for (const el of document.head.querySelectorAll(selectors)) {
            el.setAttribute('data-prerendered-seo', '');
            n += 1;
          }
          return n;
        });
        if (markedTags === 0) {
          throw new Error('no SEO head tags found to tag for client-side removal');
        }

        const html = normaliseAnimationNoise(await page.content());

        const hasContent = html.includes('<h1') || html.includes('<h2') || html.includes('<main');
        if (!hasContent) {
          throw new Error('No semantic content');
        }

        // Belt and braces: never write a 404 shell over a real route.
        if (route !== '/404' && /Page Not Found/i.test(html)) {
          throw new Error('rendered as 404 — leaving route to the SPA fallback');
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
        // Drop any output left from an earlier run so a stale or 404 page can't
        // survive a failed render. With the file gone the host's SPA rewrite
        // serves the shell, which still client-renders the route correctly.
        // (A full `vite build` empties dist/ anyway; this matters when
        // `npm run prerender` is run on its own.)
        const stalePath = route === '/'
          ? join(__dirname, 'dist', 'index.html')
          : route === '/404'
          ? join(__dirname, 'dist', '404.html')
          : join(__dirname, 'dist', route, 'index.html');
        if (route !== '/' && existsSync(stalePath)) {
          rmSync(stalePath, { force: true });
          console.log(`    removed stale ${route}/index.html`);
        }
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
  
  // Regenerate the sitemap from the same route list that was just prerendered,
  // so a post that gets a page gets an entry. Runs here, after prerendering,
  // because it reads each page's canonical out of the built HTML to decide
  // whether that URL belongs in the sitemap at all.
  console.log('\nPhase 2b: Generating sitemap from route list...');
  let sitemapLocs = new Set();
  {
    const distDir = join(__dirname, 'dist');
    const sitemapPath = join(__dirname, 'public', 'sitemap.xml');
    const existing = readExistingSitemap(sitemapPath);
    const blogLastmod = new Map(blogPosts.map((p) => [p.route, p.lastmod]));
    const today = new Date().toISOString().slice(0, 10);
    const { xml, entries, skipped } = buildSitemapXml(routes, blogLastmod, existing, today, distDir);
    const added = entries.filter((e) => e.isNew);
    const dropped = [...existing.keys()].filter((loc) => !entries.some((e) => e.loc === loc));
    writeFileSync(sitemapPath, xml);
    writeFileSync(join(distDir, 'sitemap.xml'), xml);
    sitemapLocs = new Set(entries.map((e) => e.loc));
    console.log(`  ${entries.length} URLs listed`);
    for (const e of added) console.log(`  + added: ${e.loc} (lastmod ${e.lastmod})`);
    for (const loc of dropped) console.log(`  - dropped: ${loc}`);
    for (const s of skipped) console.log(`  · skipped ${s.route} (${s.reason})`);
    if (!added.length && !dropped.length) console.log('  no additions or removals');
  }

  // Refresh the guide list in llms.txt from the same blog data. Skipped when
  // the Firebase fetch failed, because titles and excerpts come from there and
  // a partial list is worse than a stale one.
  console.log('\nPhase 2d: Updating llms.txt guide list...');
  {
    const llmsPath = join(__dirname, 'public', 'llms.txt');
    const havePostMeta = blogPosts.some((p) => p.title);
    if (!havePostMeta) {
      console.log('  Skipped: no post titles available (Firebase fetch failed)');
    } else {
      const res = updateLlmsTxt(llmsPath, blogPosts);
      if (!res.ok) {
        console.log(`  Skipped: ${res.reason}`);
      } else {
        copyFileSync(llmsPath, join(__dirname, 'dist', 'llms.txt'));
        console.log(
          res.changed ? `  Updated: ${res.count} guides listed` : `  Unchanged: ${res.count} guides listed`
        );
      }
    }
  }

  // Push the pages that changed to IndexNow, which is how Bing (and so
  // ChatGPT's search, which leans on Bing's index) hears about them without
  // waiting to be crawled. Filtered against the sitemap so an excluded or
  // non-canonical route can never be submitted.
  //
  // NOTE ON TIMING: this fires at BUILD time, but the site goes live only after
  // dist/ is committed and pushed. Bing takes far longer than a deploy to act on
  // a submission, so in practice the content is live well before it looks — but
  // if a build is never deployed, its URLs will have been announced anyway.
  // Set INDEXNOW_SKIP=1 to suppress, or run `npm run indexnow` by hand after a
  // deploy instead.
  console.log('\nPhase 2c: IndexNow submission...');
  if (process.env.INDEXNOW_SKIP === '1') {
    console.log('  Skipped (INDEXNOW_SKIP=1)');
  } else {
    const changed = changedDistPages();
    if (changed === null) {
      console.log('  Skipped: not a git checkout, cannot tell what changed');
    } else {
      const submittable = [...new Set(changed)].filter((u) => sitemapLocs.has(u));
      const ignored = changed.length - submittable.length;
      if (!submittable.length) {
        console.log(`  Nothing to submit (${changed.length} changed page(s), none listed in sitemap)`);
      } else {
        try {
          const status = await submitToIndexNow(submittable);
          const ok = status === 200 || status === 202;
          console.log(`  ${ok ? 'Submitted' : 'FAILED'}: ${submittable.length} URL(s), HTTP ${status}`);
          for (const u of submittable.slice(0, 10)) console.log(`    ${u}`);
          if (submittable.length > 10) console.log(`    …and ${submittable.length - 10} more`);
          if (ignored) console.log(`  (${ignored} changed page(s) not in sitemap, not submitted)`);
          if (!ok) console.log('  Non-fatal — the build is fine, only the ping failed.');
        } catch (err) {
          console.log(`  Submission failed: ${err.message} (non-fatal)`);
        }
      }
    }
  }

  // Verify the main index.html
  console.log('\nPhase 3: Verifying prerendered output...');
  const finalHtml = readFileSync(join(__dirname, 'dist', 'index.html'), 'utf-8');
  const checks = {
    // Match the opening tag, not the literal "<title>": the tag now carries
    // data-rh so Helmet adopts it on hydration instead of appending a second
    // one, and an exact-string check silently reported that fix as a failure.
    hasHeadSEO: /<title[\s>]/.test(finalHtml) && finalHtml.includes('name="description"'),
    hasNoDuplicateHead: (finalHtml.match(/<title[\s>]/g) || []).length === 1,
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
  // A verification step that only prints "FAILED" and then exits 0 is not
  // verification — the CI rebuild would commit the broken dist/ regardless.
  // This path is the one that rewrites dist/, so a failure here must stop it.
  if (passed !== total) {
    throw new Error(
      `Prerender verification failed ${total - passed} of ${total} checks (see FAILED lines above). ` +
        `dist/ has NOT been verified and must not be committed.`
    );
  }

  // Stats
  const { htmlFiles, bytes } = collectDistStats(join(__dirname, 'dist'));
  console.log(`\nFinal: ${htmlFiles} HTML files, ${formatSize(bytes)} total`);
  
  console.log('\n' + '='.repeat(60));
  console.log('PRE-RENDER PIPELINE COMPLETE');
  console.log('='.repeat(60));
}

prerender().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
