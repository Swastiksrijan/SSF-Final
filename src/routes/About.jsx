// import { createFileRoute } from '@tanstack/react-router'

// export const Route = createFileRoute('/About')({
//   component: RouteComponent,
// })

// function RouteComponent() {
//   return <div>Hello "/About"!</div>
// }

import { createFileRoute } from "@tanstack/react-router";
import AboutPage from "../pages/AboutPage";
import ServiceJourneyChart from "../components/ServiceJourneyChart";

function AboutWithJourney() {
  return (
    <>
      <AboutPage />
      <ServiceJourneyChart compact />
    </>
  );
}

export const Route = createFileRoute("/About")({
  component: AboutWithJourney,
});
