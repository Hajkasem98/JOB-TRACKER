import api from './axios'

export function getApplications(page = 1, pageSize = 20) {
  return api
    .get('/applications', { params: { page, pageSize } })
    .then((res) => res.data)
}

export function getApplication(id) {
  return api.get(`/applications/${id}`).then((res) => res.data)
}

export function createApplication(data) {
  return api.post('/applications', data).then((res) => res.data)
}

export function updateApplication(id, data) {
  return api.put(`/applications/${id}`, data).then((res) => res.data)
}

export function deleteApplication(id) {
  return api.delete(`/applications/${id}`).then((res) => res.data)
}

export function updateStage(id, stage, note) {
  return api
    .patch(`/applications/${id}/stage`, { stage, note })
    .then((res) => res.data)
}
