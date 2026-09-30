import { createFileRoute, redirect } from "@tanstack/react-router";
import SSFDigitalOffice from "../pages/SSFDigitalOffice";
import { ENDPOINTS } from "../config/api";

const TOKEN_KEY = "ssf_admin_token";

export const Route = createFileRoute("/SSFDigitalOffice")({
  beforeLoad: ({ location }) => {
    const token = localStorage.getItem(TOKEN_KEY) || "";
    if (!token) {
      throw redirect({
        to: "/Admin",
        search: { redirect: location.href },
        replace: true,
      });
    }
  },
  component: SSFDigitalOffice,
});
