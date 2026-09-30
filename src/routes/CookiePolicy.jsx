import { createFileRoute } from "@tanstack/react-router";
import CookiePolicy from "../pages/CookiePolicy";

export const Route = createFileRoute("/CookiePolicy")({
    component: CookiePolicy,
});
