import { createFileRoute } from '@tanstack/react-router'
import FreeHelpCentre from '../pages/FreeHelpCentre'

export const Route = createFileRoute('/HelpCentre')({
  component: FreeHelpCentre,
})
