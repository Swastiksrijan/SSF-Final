// After a new deploy the old hashed chunks no longer exist. A tab that was
// already open still requests them, the SPA fallback answers with HTML, and
// the dynamic import fails with "Failed to fetch dynamically imported module".
// Recover by reloading so the tab picks up the current build. Capped so a
// genuinely broken deploy cannot trap the tab in a reload loop.
const COUNT_KEY = "ssf_chunk_reload_count";
const TIME_KEY = "ssf_chunk_reload_at";
const MAX_RELOADS = 3;
const MIN_INTERVAL_MS = 8000;

const isChunkError = (message) =>
  /Failed to fetch dynamically imported module|Importing a module script failed|error loading dynamically imported module|Loading chunk .* failed/i.test(
    String(message || "")
  );

const recover = (message) => {
  if (!isChunkError(message)) return;
  try {
    const count = Number(sessionStorage.getItem(COUNT_KEY) || 0);
    const last = Number(sessionStorage.getItem(TIME_KEY) || 0);
    if (count >= MAX_RELOADS) return;
    if (Date.now() - last < MIN_INTERVAL_MS) return;
    sessionStorage.setItem(COUNT_KEY, String(count + 1));
    sessionStorage.setItem(TIME_KEY, String(Date.now()));
  } catch {
    // sessionStorage unavailable (private mode): still reload once.
  }
  window.location.reload();
};

window.addEventListener("error", (event) => recover(event?.message || event?.error?.message));
window.addEventListener("unhandledrejection", (event) => recover(event?.reason?.message || event?.reason));

export default recover;
