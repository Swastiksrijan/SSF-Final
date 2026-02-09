// import { createFileRoute } from '@tanstack/react-router'

// export const Route = createFileRoute('/Journey')({
//   component: RouteComponent,
// })

// function RouteComponent() {
//   return <div>Hello "/Journey"!</div>
// }


import { createFileRoute } from "@tanstack/react-router";
import JourneyPage from "../pages/JourneyPage";

export const Route = createFileRoute("/Journey")({
  component: JourneyPage,
});
