import { createFileRoute } from '@tanstack/react-router'
import SkillPrograms from '../pages/SkillPrograms'
import WorkEvidenceBanner from '../components/WorkEvidenceBanner'

function SkillProgramsWithEvidence() {
  return <><WorkEvidenceBanner page="skills" /><SkillPrograms /></>
}

export const Route = createFileRoute('/SkillPrograms')({
  component: SkillProgramsWithEvidence,
})
