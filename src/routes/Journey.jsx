import { createFileRoute } from "@tanstack/react-router";
import JourneyPage from "../pages/JourneyPage";

function JourneySafe() {
  return (
    <div className="ssf-journey-safe">
      <style>{`
        /* The legacy Journey page contains an unsupported numeric counter strip.
           Hide only that dedicated four-column strip; all journey content remains intact. */
        .ssf-journey-safe section.py-24.bg-white.px-4 > div.max-w-6xl.mx-auto.grid {
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
