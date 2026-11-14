import { useEffect } from "react";
import { useRouterState } from "@tanstack/react-router";

// One codebase, two installable apps. The public site keeps /manifest.webmanifest
// (start_url "/"); on /Admin we point the manifest at /office.webmanifest
// (start_url "/Admin", name "SSF Office") so "Add to Home screen" from the admin
// login creates a separate office icon that opens straight into login.
//
// The swap happens before install-time capture, which Chrome reads when the user
// opens the install prompt from this page, so the office manifest is what gets used.
const isOfficePath = (p) =>
  p === "/Admin" || p === "/admin" || p === "/ims" || p.startsWith("/ims/");

export default function AppManifest() {
  const pathname = useRouterState({ select: (state) => state.location.pathname });

  useEffect(() => {
    const isOffice = isOfficePath(pathname);
    const link = document.querySelector('link[rel="manifest"]');
    if (!link) return;
    const href = isOffice ? "/office.webmanifest" : "/manifest.webmanifest";
    if (link.getAttribute("href") !== href) link.setAttribute("href", href);

    const appleTitle = document.querySelector('meta[name="apple-mobile-web-app-title"]');
    if (appleTitle) appleTitle.setAttribute("content", isOffice ? "SSF Office" : "SSF");
  }, [pathname]);

  return null;
}
