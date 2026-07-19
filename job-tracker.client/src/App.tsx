import type { ReactNode } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AuthProvider } from './store/authStore'
import { ApplicationsProvider } from './store/applicationsStore'
import { TasksProvider } from './store/tasksStore'
import Navbar from './components/Navbar'
import PrivateRoute from './components/PrivateRoute'
import LoginPage from './pages/LoginPage'
import DashboardPage from './pages/DashboardPage'
import StagePage from './pages/StagePage'
import ApplicationListPage from './pages/ApplicationListPage'
import ApplicationDetailPage from './pages/ApplicationDetailPage'
import ContactsPage from './pages/ContactsPage'
import TasksPage from './pages/TasksPage'

function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-white text-gray-900 dark:bg-gray-950 dark:text-gray-100">
      <Navbar />
      <main className="p-6">{children}</main>
    </div>
  )
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/"
        element={
          <PrivateRoute>
            <Layout>
              <DashboardPage />
            </Layout>
          </PrivateRoute>
        }
      />
      <Route
        path="/stage"
        element={
          <PrivateRoute>
            <Layout>
              <StagePage />
            </Layout>
          </PrivateRoute>
        }
      />
      <Route
        path="/applications"
        element={
          <PrivateRoute>
            <Layout>
              <ApplicationListPage />
            </Layout>
          </PrivateRoute>
        }
      />
      <Route
        path="/applications/:id"
        element={
          <PrivateRoute>
            <Layout>
              <ApplicationDetailPage />
            </Layout>
          </PrivateRoute>
        }
      />
      <Route
        path="/applications/:applicationId/contacts"
        element={
          <PrivateRoute>
            <Layout>
              <ContactsPage />
            </Layout>
          </PrivateRoute>
        }
      />
      <Route
        path="/tasks"
        element={
          <PrivateRoute>
            <Layout>
              <TasksPage />
            </Layout>
          </PrivateRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

function App() {
  return (
    <AuthProvider>
      <ApplicationsProvider>
        <TasksProvider>
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </TasksProvider>
      </ApplicationsProvider>
    </AuthProvider>
  )
}

export default App
