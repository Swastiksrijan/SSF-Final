import { createFileRoute } from "@tanstack/react-router";
import JourneyPage from "../pages/JourneyPage";

function JourneySafe() {
  return (
    <div className="ssf-journey-safe">
      <style>{`
        /* Remove only the legacy unsupported counter strip and its spacing. */
        .ssf-journey-safe section.py-24.bg-white.px-4:has(> div.max-w-6xl.mx-auto.grid) {
          display: none !important;
        }
      `}</style>
      <JourneyPage />
    </div>
  );
}

export const Route = createFileRoute("/Journey")({
  component: JourneySafe,
});
