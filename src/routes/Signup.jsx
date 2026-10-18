import { createFileRoute } from "@tanstack/react-router";
import SignupPage from "../pages/SignupPage";

export const Route = createFileRoute("/Signup")({
  component: SignupPage,
});
