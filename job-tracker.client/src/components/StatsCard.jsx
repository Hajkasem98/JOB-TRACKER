export default function StatsCard({ value, label }) {
  return (
    <div className="flex min-w-[140px] flex-col gap-1 rounded-lg border border-gray-200 px-5 py-4 dark:border-gray-800">
      <span className="text-2xl font-semibold text-gray-900 dark:text-gray-100">{value}</span>
      <span className="text-sm text-gray-500 dark:text-gray-400">{label}</span>
    </div>
  )
}
