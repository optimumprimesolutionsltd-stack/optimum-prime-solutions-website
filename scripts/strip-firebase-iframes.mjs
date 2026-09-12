/**
 * Remove Firebase Realtime Database long-polling iframes from the prerendered
 * HTML. Runs after prerender.mjs, as the last thing in the build.
 *
 * WHY THIS EXISTS
 * The RTDB client falls back to long polling when its WebSocket does not come
 * up quickly, and long polling works by appending hidden <iframe> elements to
 * the document. Puppeteer's page.content() then snapshots those into the static
 * HTML, so a one-off connection URL — session id and a per-connection pw token
 * — gets committed to the repo and served publicly:
 *
 *   <iframe src="https://s-gke-...firebasedatabase.app/.lp?dframe=t&id=...&pw=..."
 *           style="display: none;"></iframe>
 *
 * The token is ephemeral and scoped to a long-poll channel that is dead long
 * before anyone loads the page, so this is untidiness rather than a breach —
 * but every visitor's browser still burns a request failing to reach it, and
 * the URLs sit in a public repo forever. It also makes the build
 * non-deterministic: whether they appear depends on how fast the socket
 * connected during that particular run, so unrelated diffs get noisy.
 *
 * WHY IT IS A SEPARATE STEP RATHER THAN PART OF prerender.mjs
 * It was tried there first, both at capture time and as a phase near the end.
 * Pages reach dist through several write paths and the counts never came out
 * right — a sweep placed before the verification phase reported zero cleaned
 * while the files on disk still had them. Running as its own process after
 * prerender.mjs exits removes the ordering question entirely: everything that
 * is ever going to be written has been written.
 */
import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const distDir = join(dirname(fileURLToPath(import.meta.url)), '..', 'dist');

function strip(html) {
  return (
    html
      // <iframe src="...firebasedatabase.app..." ...></iframe>
      .replace(/<iframe[^>]*src="[^"]*firebasedatabase\.app[^"]*"[^>]*>\s*<\/iframe>/gi, '')
      // ...and any self-closing or unpaired variant of the same thing.
      .replace(/<iframe[^>]*src="[^"]*firebasedatabase\.app[^"]*"[^>]*\/?>/gi, '')
      // The client also leaves a bare hidden iframe with no src alongside them.
      .replace(/<iframe style="display: none;"><\/iframe>/gi, '')
  );
}

let scanned = 0;
let cleaned = 0;

function walk(dir) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(full);
    } else if (entry.name.endsWith('.html')) {
      scanned += 1;
      const before = readFileSync(full, 'utf-8');
      const after = strip(before);
      if (after !== before) {
        writeFileSync(full, after);
        cleaned += 1;
      }
    }
  }
}

walk(distDir);

// Fail the build rather than shipping them: if the markup ever changes shape
// enough that the patterns above stop matching, silence here would put the
// URLs straight back into the repo.
const remaining = [];
const check = (dir) => {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) check(full);
    else if (entry.name.endsWith('.html') && readFileSync(full, 'utf-8').includes('firebasedatabase.app/.lp')) {
      remaining.push(full);
    }
  }
};
check(distDir);

console.log(`Firebase iframe strip: ${cleaned} cleaned of ${scanned} html files`);

if (remaining.length > 0) {
  console.error('Still present in:');
  for (const f of remaining) console.error(`  ${f}`);
  process.exit(1);
}
