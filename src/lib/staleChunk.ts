// Recovery for tabs left open across a deploy.
//
// Every page and the admin panel are split into hashed chunks loaded on demand.
// Each deploy replaces those files, so a tab opened before it still asks for the
// old names, gets a 404, and React's error boundary shows "Failed to fetch
// dynamically imported module". The fix is simply to reload: the fresh
// index.html names the current chunks.
//
// The reload is rate-limited through sessionStorage so a chunk that is really
// missing (a broken build, the visitor offline) shows the error page instead of
// reloading forever.

const RELOAD_KEY = 'stale-chunk-reload-at';
const RELOAD_COOLDOWN_MS = 10_000;

// Chrome, Firefox and Safari word the failure differently; Vite's preload
// helper adds its own for CSS.
const CHUNK_ERROR_PATTERNS = [
  /Failed to fetch dynamically imported module/i,
  /error loading dynamically imported module/i,
  /Importing a module script failed/i,
  /Unable to preload CSS/i,
];

export function isStaleChunkError(error: unknown): boolean {
  const message = error instanceof Error ? error.message : String(error ?? '');
  return CHUNK_ERROR_PATTERNS.some((pattern) => pattern.test(message));
}

/** Reloads the page unless it already did so moments ago. Returns whether it reloaded. */
export function reloadForStaleChunk(): boolean {
  try {
    const last = Number(sessionStorage.getItem(RELOAD_KEY) ?? 0);
    if (Date.now() - last < RELOAD_COOLDOWN_MS) return false;
    sessionStorage.setItem(RELOAD_KEY, String(Date.now()));
  } catch {
    // Storage blocked: reloading without the guard risks a loop, so don't.
    return false;
  }
  window.location.reload();
  return true;
}
