import { createFileRoute } from '@tanstack/react-router'
import OurInitiativesPage from '../pages/OurInitiativesPage'
import WorkEvidenceBanner from '../components/WorkEvidenceBanner'

function OurInitiativesWithEvidence() {
  return <><WorkEvidenceBanner page="initiatives" /><OurInitiativesPage /></>
}

export const Route = createFileRoute('/OurInitiatives')({
  component: OurInitiativesWithEvidence,
})
