// A tab left open across a deploy keeps running the old bundle. That is not
// harmless here: the API hardened to require a signed session token, so an old
// bundle that never sends one gets a 401 and shows a stale error instead of the
// portal. Poll the deployed build id and reload once when it changes.
const BUILD_ID = typeof __SSF_BUILD_ID__ === 'string' ? __SSF_BUILD_ID__ : '';
const POLL_MS = 5 * 60 * 1000;
const RELOAD_KEY = 'ssf_version_reload_at';
const MIN_RELOAD_GAP_MS = 60 * 1000;

let pendingReload = false;

// Reloading while the visitor is mid-form would throw away what they typed, so
// wait for the field to lose focus first.
const isTyping = () => {
  const el = document.activeElement;
  if (!el) return false;
  const tag = el.tagName;
  return tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || el.isContentEditable;
};

const reloadForNewBuild = () => {
  if (isTyping()) { pendingReload = true; return; }
  try {
    const last = Number(sessionStorage.getItem(RELOAD_KEY) || 0);
    if (Date.now() - last < MIN_RELOAD_GAP_MS) return;
    sessionStorage.setItem(RELOAD_KEY, String(Date.now()));
  } catch {
    // sessionStorage unavailable: fall through and reload once.
  }
  window.location.reload();
};

const checkVersion = async () => {
  if (!BUILD_ID || pendingReload) return;
  try {
    const response = await fetch(`/version.json?t=${Date.now()}`, { cache: 'no-store' });
    if (!response.ok) return;
    const data = await response.json();
    if (data?.buildId && data.buildId !== BUILD_ID) reloadForNewBuild();
  } catch {
    // Offline or the file is missing: keep working with the current bundle.
  }
};

if (typeof window !== 'undefined' && BUILD_ID) {
  // A tab that is hidden when the deploy lands should not reload mid-scroll, so
  // wait until it is visible again.
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') checkVersion();
  });
  // focusout fires before the browser moves focus to the next element, so the
  // check is deferred one tick: tabbing between fields keeps deferring, while
  // clicking away finally allows the reload.
  document.addEventListener('focusout', () => {
    if (!pendingReload) return;
    setTimeout(() => { if (!isTyping()) { pendingReload = false; reloadForNewBuild(); } }, 0);
  });
  setInterval(() => { if (document.visibilityState === 'visible') checkVersion(); }, POLL_MS);
  checkVersion();
}

export default checkVersion;
