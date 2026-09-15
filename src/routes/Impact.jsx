import { createFileRoute } from '@tanstack/react-router'
import ImpactPage from '../pages/ImpactPage'
import ImpactTimeline from '../components/ImpactTimeline'
import WorkEvidenceBanner from '../components/WorkEvidenceBanner'

function ImpactWithJourney() {
  return (
    <>
      <WorkEvidenceBanner page="impact" />
      <ImpactPage />
      <ImpactTimeline />
    </>
  )
}

export const Route = createFileRoute('/Impact')({
  component: ImpactWithJourney,
})
