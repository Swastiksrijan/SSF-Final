import { createFileRoute } from '@tanstack/react-router'
import UpcomingProjects from '../pages/UpcomingProjects'

export const Route = createFileRoute('/UpcomingProjects')({
    component: UpcomingProjects,
})
