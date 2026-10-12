import PageShell from '../components/PageShell.jsx'
import StudyPlan from '../components/StudyPlan.jsx'
import plan from '../data/plan.js'

export default function PlanPage() {
  return (
    <PageShell accent={2} title="Plan">
      <StudyPlan plan={plan} />
    </PageShell>
  )
}
