import { createFileRoute } from '@tanstack/react-router'
import SkillPrograms from '../pages/SkillPrograms'
import WorkEvidenceBanner from '../components/WorkEvidenceBanner'

function SkillProgramsWithEvidence() {
  return <><SkillPrograms /><WorkEvidenceBanner page="skills" /></>
}

export const Route = createFileRoute('/SkillPrograms')({
  component: SkillProgramsWithEvidence,
})
