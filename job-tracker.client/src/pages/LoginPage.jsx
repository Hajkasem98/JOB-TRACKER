import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'

const initialForm = { email: '', password: '', firstName: '', lastName: '' }

const inputClasses =
  'rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-violet-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100'
const fieldClasses = 'flex flex-col gap-1 text-sm text-gray-600 dark:text-gray-400'

export default function LoginPage() {
  const { login, register, loading, error } = useAuthStore()
  const navigate = useNavigate()
  const [mode, setMode] = useState('login')
  const [form, setForm] = useState(initialForm)

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (mode === 'login') {
        await login({ email: form.email, password: form.password })
      } else {
        await register(form)
      }
      navigate('/', { replace: true })
    } catch {
      // error is surfaced via the store's error state
    }
  }

  return (
    <div className="flex min-h-screen justify-center bg-white pt-16 text-gray-900 dark:bg-gray-950 dark:text-gray-100">
      <div className="w-full max-w-sm px-4">
        <h1 className="mb-6 text-2xl font-semibold">Job Tracker</h1>
        <div className="mb-5 flex gap-2">
          <button
            type="button"
            className={
              mode === 'login'
                ? 'rounded-md border border-violet-400 bg-violet-50 px-4 py-2 text-sm font-medium text-violet-700 dark:border-violet-700 dark:bg-violet-950 dark:text-violet-300'
                : 'rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-600 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-400'
            }
            onClick={() => setMode('login')}
          >
            Log in
          </button>
          <button
            type="button"
            className={
              mode === 'register'
                ? 'rounded-md border border-violet-400 bg-violet-50 px-4 py-2 text-sm font-medium text-violet-700 dark:border-violet-700 dark:bg-violet-950 dark:text-violet-300'
                : 'rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-600 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-400'
            }
            onClick={() => setMode('register')}
          >
            Register
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
          {mode === 'register' && (
            <>
              <label className={fieldClasses}>
                First name
                <input
                  name="firstName"
                  value={form.firstName}
                  onChange={handleChange}
                  required
                  className={inputClasses}
                />
              </label>
              <label className={fieldClasses}>
                Last name
                <input
                  name="lastName"
                  value={form.lastName}
                  onChange={handleChange}
                  required
                  className={inputClasses}
                />
              </label>
            </>
          )}
          <label className={fieldClasses}>
            Email
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              className={inputClasses}
            />
          </label>
          <label className={fieldClasses}>
            Password
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              required
              minLength={6}
              className={inputClasses}
            />
          </label>

          {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}

          <button
            type="submit"
            className="rounded-md border border-violet-600 bg-violet-600 px-4 py-2 text-sm font-medium text-white hover:bg-violet-700 disabled:opacity-50"
            disabled={loading}
          >
            {loading ? 'Please wait…' : mode === 'login' ? 'Log in' : 'Create account'}
          </button>
        </form>
      </div>
    </div>
  )
}
