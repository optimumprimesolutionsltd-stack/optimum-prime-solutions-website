// Submit URLs to IndexNow by hand, reading the LIVE sitemap rather than the
// local build. Use this after a deploy — `npm run indexnow` — when you want to
// announce what is actually being served, rather than what was just built.
//
//   npm run indexnow                  submit every URL in the live sitemap
//   npm run indexnow -- /blog/foo/    submit specific paths or full URLs
//
// The build fires its own narrower submission (changed pages only); this is the
// blunt instrument for when that was skipped, failed, or you want to re-announce
// everything after a large change.

const SITE_ORIGIN = 'https://www.optimumprimesolutions.co.ke';
const KEY = '3fd67103052cd75b3b1146cf0670b20e';
const ENDPOINT = 'https://api.indexnow.org/IndexNow';

function toUrl(arg) {
  if (arg.startsWith('http://') || arg.startsWith('https://')) return arg;
  return `${SITE_ORIGIN}${arg.startsWith('/') ? '' : '/'}${arg}`;
}

async function urlsFromLiveSitemap() {
  const res = await fetch(`${SITE_ORIGIN}/sitemap.xml`, { signal: AbortSignal.timeout(20000) });
  if (!res.ok) throw new Error(`sitemap fetch failed: HTTP ${res.status}`);
  const xml = await res.text();
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].trim());
}

async function main() {
  const args = process.argv.slice(2).filter((a) => !a.startsWith('-'));
  const urls = args.length ? args.map(toUrl) : await urlsFromLiveSitemap();

  if (!urls.length) {
    console.log('Nothing to submit.');
    return;
  }

  // Refuse anything off-origin — IndexNow rejects the whole batch if one URL
  // does not belong to the declared host, so catch it here with a clear message.
  const foreign = urls.filter((u) => !u.startsWith(`${SITE_ORIGIN}/`));
  if (foreign.length) {
    console.error(`Refusing to submit ${foreign.length} URL(s) not on ${SITE_ORIGIN}:`);
    for (const u of foreign) console.error(`  ${u}`);
    process.exit(1);
  }

  // Confirm the key file is actually being served; without it the engine has no
  // way to verify the submission and silently discards it.
  const keyRes = await fetch(`${SITE_ORIGIN}/${KEY}.txt`, { signal: AbortSignal.timeout(15000) });
  const keyBody = keyRes.ok ? (await keyRes.text()).trim() : '';
  if (keyBody !== KEY) {
    console.error(`Key file check failed: ${SITE_ORIGIN}/${KEY}.txt`);
    console.error(`  HTTP ${keyRes.status}, body "${keyBody.slice(0, 40)}" — expected "${KEY}"`);
    process.exit(1);
  }
  console.log(`Key file verified. Submitting ${urls.length} URL(s)…`);

  const res = await fetch(ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify({
      host: new URL(SITE_ORIGIN).host,
      key: KEY,
      keyLocation: `${SITE_ORIGIN}/${KEY}.txt`,
      urlList: urls,
    }),
    signal: AbortSignal.timeout(30000),
  });

  // 200 accepted, 202 accepted pending key validation. Anything else is a real
  // failure worth a non-zero exit so CI notices.
  if (res.status === 200 || res.status === 202) {
    console.log(`Accepted: HTTP ${res.status}`);
    for (const u of urls.slice(0, 10)) console.log(`  ${u}`);
    if (urls.length > 10) console.log(`  …and ${urls.length - 10} more`);
    console.log('\nNote: acceptance is not indexing. Bing decides what to crawl');
    console.log('and when; confirm coverage in Bing Webmaster Tools.');
  } else {
    console.error(`Rejected: HTTP ${res.status}`);
    console.error(await res.text().catch(() => ''));
    process.exit(1);
  }
}

main().catch((err) => {
  console.error(`indexnow failed: ${err.message}`);
  process.exit(1);
});
