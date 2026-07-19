import { useApplications } from '../hooks/useApplications'
import StageBoard from '../components/StageBoard'

export default function StagePage() {
  const { applications, loading, error, updateStage } = useApplications(1, 100)

  return (
    <div className="mx-auto max-w-5xl">
      <h1 className="mb-5 text-2xl font-semibold">Stage board</h1>
      {loading && <p>Loading…</p>}
      {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}

      <StageBoard applications={applications} onStageChange={(id, stage) => updateStage(id, stage)} />
    </div>
  )
}
