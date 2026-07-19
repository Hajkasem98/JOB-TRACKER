import api from './axios'

export function getTasks(applicationId) {
  return api
    .get(`/applications/${applicationId}/tasks`)
    .then((res) => res.data)
}

export function getUpcomingTasks(withinDays = 7) {
  return api.get('/tasks/upcoming', { params: { withinDays } }).then((res) => res.data)
}

export function createTask(applicationId, data) {
  return api
    .post(`/applications/${applicationId}/tasks`, data)
    .then((res) => res.data)
}

export function updateTask(id, data) {
  return api.put(`/tasks/${id}`, data).then((res) => res.data)
}

export function completeTask(id) {
  return api.patch(`/tasks/${id}/complete`).then((res) => res.data)
}

export function deleteTask(id) {
  return api.delete(`/tasks/${id}`).then((res) => res.data)
}
