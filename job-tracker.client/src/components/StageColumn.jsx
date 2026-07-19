import ApplicationCard from './ApplicationCard'

export default function StageColumn({ stage, applications, onStageChange }) {
  return (
    <div className="w-56 shrink-0 rounded-lg border border-gray-200 p-3 dark:border-gray-800">
      <h2 className="mb-3 flex items-center justify-between text-sm font-semibold">
        {stage}
        <span className="font-normal text-gray-500 dark:text-gray-400">{applications.length}</span>
      </h2>
      {applications.map((app) => (
        <ApplicationCard key={app.id} application={app} onStageChange={onStageChange} />
      ))}
    </div>
  )
}
