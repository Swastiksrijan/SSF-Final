// import { createFileRoute } from '@tanstack/react-router'

// export const Route = createFileRoute('/Donate')({
//   component: RouteComponent,
// })

// function RouteComponent() {
//   return <div>Hello "/Donate"!</div>
// }

import { createFileRoute } from "@tanstack/react-router";
import DonatePage from "../pages/DonatePage";

export const Route = createFileRoute("/Donate")({
  component: DonatePage,
});
