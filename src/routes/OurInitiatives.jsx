import { createFileRoute } from '@tanstack/react-router'
import OurInitiativesPage from '../pages/OurInitiativesPage'

export const Route = createFileRoute('/OurInitiatives')({
  component: OurInitiativesPage,
})
