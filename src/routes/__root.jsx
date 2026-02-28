import { createRootRoute, Outlet } from "@tanstack/react-router";
import Header from "../components/Header";
import FooterSection from "../pages/FooterSection";
import ScrollToHash from "../components/ScrollToHash";
import ScrollToTopButton from "../components/ScrollToTopButton";
import SeoManager from "../components/SeoManager";
import WhatsAppChatWidget from "../components/WhatsAppChatWidget";
import { LanguageProvider } from "../context/LanguageContext";

export const Route = createRootRoute({
  component: () => (
    <LanguageProvider>
    <div className="min-h-screen w-full flex flex-col font-inria overflow-x-hidden">
      <SeoManager />
      <Header />
      <ScrollToHash />
      <ScrollToTopButton />
      <WhatsAppChatWidget />
      <Outlet />
      <FooterSection />
    </div>
    </LanguageProvider>
  ),
});
