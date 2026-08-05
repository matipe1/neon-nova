import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/inventory/filaments')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/inventory/filaments"!</div>
}
