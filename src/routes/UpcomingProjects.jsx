import { createFileRoute } from '@tanstack/react-router'
import UpcomingProjects from '../pages/UpcomingProjects'
function UpcomingProjectsWithEvidence() {
  return <UpcomingProjects />
}

export const Route = createFileRoute('/UpcomingProjects')({
  component: UpcomingProjectsWithEvidence,
})
