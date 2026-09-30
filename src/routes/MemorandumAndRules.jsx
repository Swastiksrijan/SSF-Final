import { createFileRoute } from "@tanstack/react-router";
import MemorandumAndRules from "../pages/MemorandumAndRules";

export const Route = createFileRoute("/MemorandumAndRules")({
  component: MemorandumAndRules,
});
