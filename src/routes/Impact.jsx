import { createFileRoute } from '@tanstack/react-router'
import ImpactPage from '../pages/ImpactPage'
import ImpactTimeline from '../components/ImpactTimeline'

function ImpactWithJourney() {
  return (
    <>
      <ImpactPage />
      <ImpactTimeline />
    </>
  )
}

export const Route = createFileRoute('/Impact')({
  component: ImpactWithJourney,
})
