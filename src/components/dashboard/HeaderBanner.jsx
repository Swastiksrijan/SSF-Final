import { FaArrowRight } from "react-icons/fa";

/* Deep royal blue → cyan/teal sweep. Written as an explicit gradient rather than
   Tailwind colour stops so the exact reference palette survives. */
const BANNER_GRADIENT =
  "linear-gradient(112deg, #0A2350 0%, #12345A 30%, #14507E 58%, #17809F 80%, #1FAAC8 100%)";

/* The slanted geometry: skewed bands of translucent light-blue/turquoise plus a
   clip-path wedge. All decorative, so the whole layer is aria-hidden and never
   intercepts a click. */
const Diagonals = () => (
  <>
    {/* glossy sheen across the top */}
    <span aria-hidden="true" className="pointer-events-none absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(255,255,255,0.16), rgba(255,255,255,0) 46%)" }} />
    {/* wide turquoise band sweeping in from the right */}
    <span aria-hidden="true" className="pointer-events-none absolute -top-1/3 right-[-6%] h-[180%] w-[42%] rotate-[16deg]" style={{ background: "linear-gradient(90deg, rgba(88,214,255,0) 0%, rgba(88,214,255,0.20) 45%, rgba(88,214,255,0.34) 100%)" }} />
    {/* thinner cyan sliver */}
    <span aria-hidden="true" className="pointer-events-none absolute -top-1/3 right-[26%] h-[180%] w-[9%] rotate-[16deg]" style={{ background: "linear-gradient(180deg, rgba(190,240,255,0.30), rgba(190,240,255,0.06))" }} />
    {/* soft pale wedge, mid-left */}
    <span aria-hidden="true" className="pointer-events-none absolute -top-1/4 left-[16%] h-[170%] w-[16%] -rotate-[14deg]" style={{ background: "linear-gradient(180deg, rgba(150,205,255,0.22), rgba(150,205,255,0))" }} />
    {/* turquoise wedge with a harder edge, far left */}
    <span aria-hidden="true" className="pointer-events-none absolute inset-y-0 left-0 w-[34%]" style={{ background: "linear-gradient(120deg, rgba(31,170,200,0.30) 0%, rgba(31,170,200,0.04) 62%, rgba(31,170,200,0) 100%)", clipPath: "polygon(0 0, 74% 0, 46% 100%, 0 100%)" }} />
    {/* glassy highlight strip */}
    <span aria-hidden="true" className="pointer-events-none absolute -top-[40%] left-[52%] h-[180%] w-[3px] rotate-[16deg]" style={{ background: "linear-gradient(180deg, rgba(255,255,255,0.55), rgba(255,255,255,0))" }} />
  </>
);

/* Reusable premium banner: gradient plate, diagonal cyan graphics, a left text
   block and an optional white pill action on the right. Everything the caller
   passes in (avatar, badges, extra rows) is rendered as-is. */
export default function HeaderBanner({ eyebrow, title, subtitle, leading, badges, action, secondaryAction, children }) {
  return (
    <header className="relative overflow-hidden rounded-[20px] text-white shadow-lg" style={{ background: BANNER_GRADIENT }}>
      <Diagonals />
      <div className="relative z-10 flex flex-col gap-5 p-5 md:p-6 lg:min-h-[140px] lg:flex-row lg:items-center lg:justify-between lg:gap-8 lg:px-8 lg:py-4">
        <div className="flex min-w-0 items-center gap-4">
          {leading}
          <div className="min-w-0">
            {eyebrow && <p className="text-[10px] font-black uppercase tracking-[0.24em] text-[#9FE4F5]">{eyebrow}</p>}
            <h1 className="mt-1 truncate text-2xl font-black leading-tight md:text-[28px] lg:text-[30px]">{title}</h1>
            {subtitle && <p className="mt-1 truncate text-sm font-medium text-white/75">{subtitle}</p>}
            {badges && <div className="mt-2.5 flex flex-wrap items-center gap-2">{badges}</div>}
          </div>
        </div>
        {(action || secondaryAction) && (
          <div className="flex shrink-0 flex-wrap items-center gap-2.5">
            {secondaryAction}
            {action}
          </div>
        )}
      </div>
      {children}
    </header>
  );
}

/* The reference's right-hand call to action: an off-white pill with blue text
   and a trailing arrow. */
export function BannerAction({ label, icon, onClick, type = "button" }) {
  return (
    <button
      type={type}
      onClick={onClick}
      className="group inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-black text-[#12345A] shadow-md transition hover:bg-[#F2F7FC] hover:shadow-lg"
    >
      {icon}
      {label}
      <FaArrowRight className="text-[11px] transition-transform group-hover:translate-x-0.5" />
    </button>
  );
}
