// The Foundation's award and appreciation certificates, as a grid with a
// lightbox. Kept separate from the pledge badges because they are different
// kinds of evidence: these name individual volunteers and awardees, the badges
// are national campaigns the Foundation has taken part in.
import { useState } from "react";
import { X } from "lucide-react";
import { FaAward } from "react-icons/fa";
import { CERTS } from "../data/brandAssets";

export default function CertificateWall({ limit }) {
  const [open, setOpen] = useState(null);
  const items = limit ? CERTS.slice(0, limit) : CERTS;

  return (
    <div>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {items.map((c) => (
          <button
            key={c.src}
            type="button"
            onClick={() => setOpen(c)}
            className="group overflow-hidden rounded-2xl border border-slate-200 bg-white text-left shadow-sm transition hover:-translate-y-1 hover:border-[#F7A814] hover:shadow-xl"
          >
            <span className="block overflow-hidden bg-[#F5F8FB]">
              <img src={c.src} alt={`${c.en} — awarded to ${c.name}`} loading="lazy" className="aspect-square w-full object-cover transition duration-500 group-hover:scale-105" />
            </span>
            <span className="block p-3">
              <span className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.14em] text-[#176447]">
                <FaAward /> {c.en}
              </span>
              <span className="mt-1 block truncate text-sm font-bold text-[#12345A]">{c.name}</span>
              <span className="block truncate text-[11px] text-slate-500">{c.hi}</span>
            </span>
          </button>
        ))}
      </div>

      {open && (
        <div role="dialog" aria-modal="true" aria-label={`${open.en} — ${open.name}`} onClick={() => setOpen(null)} className="fixed inset-0 z-[80] flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm">
          <div className="relative max-h-[90vh] w-full max-w-2xl overflow-auto rounded-2xl bg-white p-4 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <button type="button" onClick={() => setOpen(null)} aria-label="Close" className="absolute right-3 top-3 rounded-full bg-white/90 p-2 text-[#12345A] shadow hover:bg-white">
              <X size={18} />
            </button>
            <img src={open.src} alt={`${open.en} — ${open.name}`} className="mx-auto max-h-[72vh] w-auto object-contain" />
            <div className="mt-3 text-center">
              <p className="text-sm font-bold text-[#12345A]">{open.name}</p>
              <p className="text-xs text-[#176447]">{open.award}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
