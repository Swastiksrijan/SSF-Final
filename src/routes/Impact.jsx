import { createFileRoute } from '@tanstack/react-router'
import ImpactPage from '../pages/ImpactPage'

export const Route = createFileRoute('/Impact')({
    component: ImpactPage,
})
