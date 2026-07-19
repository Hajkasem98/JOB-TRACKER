import { createContext, createElement, useCallback, useContext, useMemo, useState } from 'react'
import * as tasksApi from '../api/tasks'

const TasksContext = createContext(/** @type {any} */ (null))

export function TasksProvider({ children }) {
  const [tasks, setTasks] = useState([])
  const [upcomingTasks, setUpcomingTasks] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchTasks = useCallback(async (applicationId) => {
    setLoading(true)
    setError(null)
    try {
      const result = await tasksApi.getTasks(applicationId)
      setTasks(result)
      return result
    } catch (err) {
      setError('Could not load tasks.')
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const fetchUpcoming = useCallback(async (withinDays = 7) => {
    setLoading(true)
    setError(null)
    try {
      const result = await tasksApi.getUpcomingTasks(withinDays)
      setUpcomingTasks(result)
      return result
    } catch (err) {
      setError('Could not load upcoming tasks.')
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const createTask = useCallback(async (applicationId, data) => {
    const created = await tasksApi.createTask(applicationId, data)
    setTasks((prev) => [...prev, created])
    return created
  }, [])

  const updateTask = useCallback(async (id, data) => {
    const updated = await tasksApi.updateTask(id, data)
    setTasks((prev) => prev.map((t) => (t.id === id ? updated : t)))
    setUpcomingTasks((prev) => prev.map((t) => (t.id === id ? updated : t)))
    return updated
  }, [])

  const completeTask = useCallback(async (id) => {
    const updated = await tasksApi.completeTask(id)
    setTasks((prev) => prev.map((t) => (t.id === id ? updated : t)))
    setUpcomingTasks((prev) => prev.filter((t) => t.id !== id))
    return updated
  }, [])

  const deleteTask = useCallback(async (id) => {
    await tasksApi.deleteTask(id)
    setTasks((prev) => prev.filter((t) => t.id !== id))
    setUpcomingTasks((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const value = useMemo(
    () => ({
      tasks,
      upcomingTasks,
      loading,
      error,
      fetchTasks,
      fetchUpcoming,
      createTask,
      updateTask,
      completeTask,
      deleteTask,
    }),
    [tasks, upcomingTasks, loading, error, fetchTasks, fetchUpcoming, createTask, updateTask, completeTask, deleteTask],
  )

  return createElement(TasksContext.Provider, { value }, children)
}

export function useTasksStore() {
  const context = useContext(TasksContext)
  if (!context) {
    throw new Error('useTasksStore must be used within a TasksProvider')
  }
  return context
}
