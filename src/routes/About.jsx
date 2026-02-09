// import { createFileRoute } from '@tanstack/react-router'

// export const Route = createFileRoute('/About')({
//   component: RouteComponent,
// })

// function RouteComponent() {
//   return <div>Hello "/About"!</div>
// }

import { createFileRoute } from "@tanstack/react-router";
import AboutPage from "../pages/AboutPage";

export const Route = createFileRoute("/About")({
  component: AboutPage,
});
