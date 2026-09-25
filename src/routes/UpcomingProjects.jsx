import { createFileRoute } from '@tanstack/react-router'
import UpcomingProjects from '../pages/UpcomingProjects'
import UpcomingEvidenceBanner from '../components/UpcomingEvidenceBanner'

function UpcomingProjectsWithEvidence() {
  return <><UpcomingProjects /><UpcomingEvidenceBanner /></>
}

export const Route = createFileRoute('/UpcomingProjects')({
  component: UpcomingProjectsWithEvidence,
})
