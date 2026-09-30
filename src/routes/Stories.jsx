import { createFileRoute } from '@tanstack/react-router'
import StoriesPage from '../pages/StoriesPage'

export const Route = createFileRoute('/Stories')({
    component: StoriesPage,
})
