import { Link } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'

const linkClasses =
  'font-medium text-gray-700 hover:text-violet-600 dark:text-gray-300 dark:hover:text-violet-400'

export default function Navbar() {
  const { user, logout } = useAuthStore()

  return (
    <nav className="flex items-center justify-between border-b border-gray-200 px-6 py-4 dark:border-gray-800">
      <div className="flex items-center gap-6">
        <Link to="/" className={linkClasses}>
          Dashboard
        </Link>
        <Link to="/stage" className={linkClasses}>
          Stage board
        </Link>
        <Link to="/applications" className={linkClasses}>
          Applications
        </Link>
        <Link to="/tasks" className={linkClasses}>
          Tasks
        </Link>
      </div>
      <div className="flex items-center gap-4">
        {user && (
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {user.firstName} {user.lastName}
          </span>
        )}
        <button
          type="button"
          className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-900 hover:border-violet-400 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
          onClick={logout}
        >
          Log out
        </button>
      </div>
    </nav>
  )
}
