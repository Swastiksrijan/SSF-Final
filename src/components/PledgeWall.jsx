// Government pledge and participation certificates — 40+ national campaigns
// (LiFE, Fit India, Swachh Bharat, TB Mukt Bharat and more) that the Foundation
// has formally taken part in. The tiles rest slightly muted and come up to full
// on hover, so the wall reads as evidence without competing with the page. They
// are mostly white paper with small text, so the resting opacity must stay well
// above half or the certificates stop being legible.
import { useState } from "react";
import { X } from "lucide-react";
import { BADGES } from "../data/brandAssets";

export default function PledgeWall({ limit = 20, className = '' }) {
  const [open, setOpen] = useState(null);
  const items = limit ? BADGES.slice(0, limit) : BADGES;

  return (
    <div className={className}>
      <div className="flex flex-wrap justify-center gap-3">
        {items.map((b) => (
          <button
            key={b.src}
            type="button"
            onClick={() => setOpen(b)}
            title={`${b.en} — ${b.hi}`}
            className="group w-36 shrink-0 overflow-hidden rounded-xl border border-slate-200 bg-white text-left opacity-80 shadow-sm transition duration-300 hover:opacity-100 hover:shadow-lg sm:w-44"
          >
            <span className="block h-20 overflow-hidden sm:h-24">
              <img src={b.src} alt={`${b.en} — ${b.hi}`} loading="lazy" className="h-full w-full object-contain p-1.5" />
            </span>
            <span className="block truncate px-2 pb-2 text-[10px] font-bold leading-tight text-[#12345A]">{b.en}</span>
          </button>
        ))}
      </div>

      {open && (
        <div role="dialog" aria-modal="true" aria-label={`${open.en} — ${open.hi}`} onClick={() => setOpen(null)} className="fixed inset-0 z-[80] flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm">
          <div className="relative max-h-[90vh] w-full max-w-2xl overflow-auto rounded-2xl bg-white p-4 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <button type="button" onClick={() => setOpen(null)} aria-label="Close" className="absolute right-3 top-3 rounded-full bg-white/90 p-2 text-[#12345A] shadow hover:bg-white">
              <X size={18} />
            </button>
            <img src={open.src} alt={`${open.en} — ${open.hi}`} className="mx-auto max-h-[72vh] w-auto object-contain" />
            <div className="mt-3 text-center">
              <p className="text-sm font-bold text-[#12345A]">{open.en}</p>
              <p className="text-xs text-[#176447]">{open.hi}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
