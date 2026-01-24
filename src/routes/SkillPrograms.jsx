import { createFileRoute } from '@tanstack/react-router'
import SkillPrograms from '../pages/SkillPrograms'

export const Route = createFileRoute('/SkillPrograms')({
    component: SkillPrograms,
})
