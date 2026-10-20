// A slow horizontal "chalak" band of SSF's recognitions — awards, government
// pledge certificates, the sanstha seal and the official logo. It drifts on its
// own so a visitor sees that the Foundation holds many recognitions without a
// wall of thumbnails pushing the page down. Pauses on hover; click opens a
// larger view.
import { useState } from "react";
import { X } from "lucide-react";
import { BRAND, CERTS, BADGES } from "../data/brandAssets";

/* The band is deliberately a mix, not a single category: the emblem plus two
   kinds of certificate and the government pledge badges, so it reads as
   "institutional credentials" rather than "photo album".
   It must NOT carry the organisation seal or the scanned signature — those are
   the marks used to authenticate paper the Foundation issues, and a public page
   that republishes them hands out a forgery kit. */
const RECOGNITION_ITEMS = [
  { src: BRAND.logoRound, label: 'SSF Emblem', sub: 'स्थापित 2013', kind: 'logo' },
  ...CERTS.slice(0, 6).map((c) => ({ src: c.src, label: c.name, sub: c.hi, kind: 'cert' })),
  ...BADGES.slice(0, 8).map((b) => ({ src: b.src, label: b.en, sub: b.hi, kind: 'pledge' })),
];

const KIND_TAG = {
  logo: { en: 'Emblem', hi: 'प्रतीक' },
  cert: { en: 'Certificate', hi: 'प्रमाण-पत्र' },
  pledge: { en: 'Pledge', hi: 'संकल्प' },
};

function Tile({ item, onOpen }) {
  const tag = KIND_TAG[item.kind] || KIND_TAG.cert;
  return (
    <button
      type="button"
      onClick={() => onOpen(item)}
      className="group w-40 shrink-0 overflow-hidden rounded-xl border border-slate-200 bg-white text-left shadow-sm transition hover:-translate-y-1 hover:border-[#F7A814] hover:shadow-lg sm:w-48"
    >
      <span className="flex h-28 items-center justify-center bg-[#F5F8FB] p-2 sm:h-32">
        <img
          src={item.src}
          alt={`${item.label} — ${tag.en}`}
          loading="lazy"
          className={`max-h-full max-w-full object-contain ${item.kind === 'sign' ? 'opacity-90' : ''}`}
        />
      </span>
      <span className="block px-3 py-2.5">
        <span className="block text-[10px] font-black uppercase tracking-[0.14em] text-[#176447]">{tag.en}</span>
        <span className="mt-1 block truncate text-xs font-bold text-[#12345A]">{item.label}</span>
        <span className="block truncate text-[11px] text-slate-500">{item.sub}</span>
      </span>
    </button>
  );
}

export default function RecognitionBand({
  items = RECOGNITION_ITEMS,
  duration = 60,
  className = '',
}) {
  const [open, setOpen] = useState(null);
  const loop = [...items, ...items];

  return (
    <div className={className}>
      <div
        className="group relative overflow-hidden"
        style={{ maskImage: 'linear-gradient(90deg,transparent,#000 5%,#000 95%,transparent)', WebkitMaskImage: 'linear-gradient(90deg,transparent,#000 5%,#000 95%,transparent)' }}
      >
        <div
          className="flex w-max gap-4 animate-scrollX group-hover:[animation-play-state:paused]"
          style={{ animationDuration: `${duration}s` }}
        >
          {loop.map((item, i) => (
            <Tile key={`${item.src}-${i}`} item={item} onOpen={setOpen} />
          ))}
        </div>
      </div>

      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={open.label}
          onClick={() => setOpen(null)}
          className="fixed inset-0 z-[80] flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm"
        >
          <div className="relative max-h-[88vh] w-full max-w-3xl overflow-auto rounded-2xl bg-white p-4 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <button type="button" onClick={() => setOpen(null)} aria-label="Close" className="absolute right-3 top-3 rounded-full bg-white/90 p-2 text-[#12345A] shadow hover:bg-white">
              <X size={18} />
            </button>
            <img src={open.src} alt={open.label} className="mx-auto max-h-[70vh] w-auto object-contain" />
            <p className="mt-3 text-center text-sm font-bold text-[#12345A]">{open.label}</p>
            <p className="text-center text-xs text-slate-500">{open.sub}</p>
          </div>
        </div>
      )}
    </div>
  );
}
