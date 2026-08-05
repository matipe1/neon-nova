import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/inventory/supplies')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/inventory/supplies"!</div>
}
