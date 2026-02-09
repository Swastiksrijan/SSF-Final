import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/verify/$certId')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/verify/$certId"!</div>
}
