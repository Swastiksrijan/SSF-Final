// Keep the existing user-session consumers tab-specific while they migrate away from localStorage.
// Only the SSF user-session key is redirected; all other localStorage keys keep normal behavior.
const KEY = 'ssf_user_session';

if (typeof window !== 'undefined' && !window.__ssfSessionBridgeInstalled) {
  window.__ssfSessionBridgeInstalled = true;
  const originalGetItem = Storage.prototype.getItem;
  const originalSetItem = Storage.prototype.setItem;
  const originalRemoveItem = Storage.prototype.removeItem;

  // Remove any old shared session once, before redirecting future reads/writes.
  originalRemoveItem.call(window.localStorage, KEY);

  Storage.prototype.getItem = function (key) {
    if (this === window.localStorage && key === KEY) return originalGetItem.call(window.sessionStorage, KEY);
    return originalGetItem.call(this, key);
  };

  Storage.prototype.setItem = function (key, value) {
    if (this === window.localStorage && key === KEY) return originalSetItem.call(window.sessionStorage, KEY, value);
    return originalSetItem.call(this, key, value);
  };

  Storage.prototype.removeItem = function (key) {
    // localStorage.removeItem is used by existing components for legacy cleanup.
    // Do not let that cleanup accidentally log the current tab out of sessionStorage.
    if (this === window.localStorage && key === KEY) return originalRemoveItem.call(window.localStorage, KEY);
    return originalRemoveItem.call(this, key);
  };
}
