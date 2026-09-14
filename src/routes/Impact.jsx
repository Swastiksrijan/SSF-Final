import { createFileRoute } from '@tanstack/react-router'
import ImpactPage from '../pages/ImpactPage'
import ServiceJourneyChart from '../components/ServiceJourneyChart'

function ImpactWithJourney() {
  return (
    <>
      <ImpactPage />
      <ServiceJourneyChart />
    </>
  )
}

export const Route = createFileRoute('/Impact')({
  component: ImpactWithJourney,
})
