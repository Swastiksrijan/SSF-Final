import { createRootRoute, useRouterState, Outlet } from "@tanstack/react-router";
import Header from "../components/Header";
import FooterSection from "../pages/FooterSection";
import ScrollToHash from "../components/ScrollToHash";
import ScrollToTopButton from "../components/ScrollToTopButton";
import SeoManager from "../components/SeoManager";
import SSFSupportChatPro from "../components/SSFSupportChatPro";
import { LanguageProvider } from "../context/LanguageContext";
import OptimizedImage from "../components/OptimizedImage";
import logoImg from "../assets/new-logo.png";

function BlogHero() {
  const pathname = useRouterState({ select: (state) => state.location.pathname });

  if (pathname !== "/Blog") return null;

  return (
    <section className="relative min-h-[48vh] md:min-h-[56vh] flex items-center justify-center overflow-hidden bg-[#12345A] text-white">
      <div className="absolute inset-0">
        <OptimizedImage
          src="/images/real/education_girls.jpg"
          alt="Swastik Srijan Foundation stories and community work"
          className="w-full h-full"
          objectFit="cover"
          style={{ objectPosition: "center" }}
        />
        <div className="absolute inset-0 bg-[#12345A]/55 bg-gradient-to-b from-[#12345A]/65 via-black/20 to-[#12345A]/90" />
      </div>

      <div className="relative z-10 max-w-5xl px-6 pt-16 text-center">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-white/95 p-2 shadow-2xl ring-1 ring-white/40">
          <img src={logoImg} alt="Swastik Srijan Foundation" className="h-full w-full object-contain" />
        </div>
        <p className="mb-3 text-[10px] md:text-xs font-bold uppercase tracking-[0.35em] text-[#176447]">
          Swastik Srijan Foundation
        </p>
        <h1 className="font-serif text-4xl md:text-6xl lg:text-7xl font-bold leading-tight drop-shadow-2xl">
          Our Impact Stories
        </h1>
        <p className="mx-auto mt-5 max-w-3xl text-base md:text-xl font-light text-white/90">
          Real stories of service, learning, community action and the people behind our journey.
        </p>
      </div>
    </section>
  );
}

function RootChrome() {
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  // SSF-IMS (OneOffice) is a standalone app with its own chrome; the public
  // site header/footer would overlap it, so they are hidden on /ims routes.
  const isIms = pathname === "/ims" || pathname.startsWith("/ims/");
  return (
    <LanguageProvider>
      {/* `ssf-root-shell` is `overflow-x: clip`, NOT `hidden`. A hidden
          overflow here would become the sticky containing block and unpin the
          IMS header/strip/sidebar; `clip` trims the horizontal overflow
          identically while leaving sticky positioning intact. */}
      <div className="ssf-root-shell min-h-screen w-full flex flex-col font-inria">
        <SeoManager />
        {!isIms && <Header />}
        {!isIms && <ScrollToHash />}
        {!isIms && <ScrollToTopButton />}
        {!isIms && <SSFSupportChatPro />}
        <BlogHero />
        <Outlet />
        {!isIms && <FooterSection />}
      </div>
    </LanguageProvider>
  );
}

export const Route = createRootRoute({
  component: RootChrome,
});
