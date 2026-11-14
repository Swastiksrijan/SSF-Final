import { useEffect, useState } from "react";
import { FaDownload, FaCheckCircle } from "react-icons/fa";

// A visible "Install app" button on the admin login. Chrome fires
// beforeinstallprompt when the app is installable; we stash that event and
// replay it on click, so staff never have to hunt through the browser menu —
// which is the usual reason the option "never appears" on a phone.
//
// If the event does not fire (already installed, iOS Safari, or a browser with
// no install support) the button shows the platform's manual steps instead.
const isStandalone = () =>
  window.matchMedia?.("(display-mode: standalone)").matches || window.navigator.standalone === true;

const isIos = () =>
  /iphone|ipad|ipod/i.test(window.navigator.userAgent) ||
  (window.navigator.platform === "MacIntel" && window.navigator.maxTouchPoints > 1);

export default function InstallOfficeApp() {
  const [promptEvent, setPromptEvent] = useState(() => (typeof window !== "undefined" ? window.__ssfInstallPrompt || null : null));
  const [installed, setInstalled] = useState(() => (typeof window !== "undefined" ? isStandalone() : false));
  const [showHelp, setShowHelp] = useState(false);

  useEffect(() => {
    const onAvailable = () => setPromptEvent(window.__ssfInstallPrompt || null);
    const onInstalled = () => { setInstalled(true); setPromptEvent(null); };
    window.addEventListener("ssf-install-available", onAvailable);
    window.addEventListener("appinstalled", onInstalled);
    return () => {
      window.removeEventListener("ssf-install-available", onAvailable);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  const handleClick = async () => {
    if (!promptEvent) { setShowHelp(true); return; }
    promptEvent.prompt();
    const { outcome } = await promptEvent.userChoice;
    if (outcome === "accepted") setInstalled(true);
    setPromptEvent(null);
  };

  if (installed) {
    return (
      <p className="mt-4 flex items-center justify-center gap-2 text-xs font-semibold text-[#176447]">
        <FaCheckCircle /> SSF Office app installed on this device
      </p>
    );
  }

  return (
    <div className="mt-4">
      <button
        type="button"
        onClick={handleClick}
        className="flex w-full items-center justify-center gap-2 rounded-xl border border-[#176447]/30 bg-[#176447]/5 py-3 text-sm font-bold text-[#176447]"
      >
        <FaDownload /> Install SSF Office app on this phone
      </button>

      {showHelp && (
        <div className="mt-3 rounded-xl border border-zinc-200 bg-zinc-50 p-4 text-xs leading-relaxed text-zinc-700">
          {isIos() ? (
            <>
              <p className="font-bold text-[#12345A]">On iPhone — Safari me:</p>
              <p className="mt-1">Neeche <b>Share</b> (⬆️) dabaiye → <b>“Add to Home Screen”</b> → <b>Add</b>. (WhatsApp/Instagram ke andar wale browser me nahi hota — Safari kholiye.)</p>
            </>
          ) : (
            <>
              <p className="font-bold text-[#12345A]">On Android — Chrome me:</p>
              <p className="mt-1">Upar daayein <b>teen dots (⋮)</b> → <b>“Install app”</b> ya <b>“Add to Home screen”</b> → <b>Install</b>.</p>
              <p className="mt-1">Agar option na dikhe: page ko <b>Chrome</b> me kholiye (WhatsApp/Instagram ke browser me nahi).</p>
            </>
          )}
        </div>
      )}
    </div>
  );
}
