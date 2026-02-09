import { createRootRoute, Outlet } from "@tanstack/react-router";
import Header from "../components/Header";
import FooterSection from "../pages/FooterSection";
import ScrollToHash from "../components/ScrollToHash";
import ScrollToTopButton from "../components/ScrollToTopButton";

export const Route = createRootRoute({
  component: () => (
    <div className="min-h-screen w-full flex flex-col font-inria overflow-x-hidden">
      <Header />
      <ScrollToHash />
      <ScrollToTopButton />
      <Outlet />
      <FooterSection />
    </div>
  ),
});
