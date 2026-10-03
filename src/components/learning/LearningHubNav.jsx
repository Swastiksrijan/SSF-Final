import { Link, useRouterState } from "@tanstack/react-router";
import { FaHome } from "react-icons/fa";

const LINKS = [
  { to: "/LearningHub", label: "Welcome", hi: "स्वागत", icon: FaHome, match: (p) => p === "/LearningHub" }
];

export default function LearningHubNav() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return <nav aria-label="SSF Learning Hub navigation"
    className="sticky top-20 z-40 border-y border-white/10 bg-[#062a52]/95 shadow-[0_10px_30px_rgba(3,20,40,0.28)] backdrop-blur md:top-[116px]">
    <div className="mx-auto flex max-w-7xl items-center gap-1.5 px-3 py-2.5 md:gap-2 md:px-4">
      <Link to="/LearningHub" className="hidden shrink-0 items-center gap-2 pr-2 lg:flex" aria-label="SSF Learning Hub home">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#ffd166] to-[#f4b400] text-[#062a52] shadow-sm">🎓</span>
        <span className="flex flex-col leading-none">
          <span className="text-[13px] font-black text-white">SSF Learning Hub</span>
          <span className="mt-0.5 text-[9px] font-bold uppercase tracking-[0.16em] text-[#ffd166]">Learn • Grow • Share</span>
        </span>
      </Link>

      <div className="flex flex-1 items-center gap-1.5 overflow-x-auto md:gap-2">
        {LINKS.map(({ to, label, hi, icon: Icon, match }) => {
          const active = match(pathname);
          return <Link key={label} to={to}
            className={"flex shrink-0 items-center gap-2 rounded-xl px-3 py-2 text-xs font-black transition md:px-3.5 " + (active ? "bg-white text-[#062a52] shadow-sm" : "text-white/80 hover:bg-white/10 hover:text-white")}
            aria-current={active ? "page" : undefined}>
            <Icon aria-hidden="true" />
            <span className="whitespace-nowrap">{label}</span>
            <span className={"hidden whitespace-nowrap text-[10px] font-bold xl:inline " + (active ? "text-[#0b4a86]/70" : "text-white/45")}>{hi}</span>
          </Link>;
        })}
      </div>
    </div>
  </nav>;
}
