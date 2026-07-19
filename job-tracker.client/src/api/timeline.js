import api from './axios'

export function getTimeline(applicationId) {
  return api
    .get(`/applications/${applicationId}/timeline`)
    .then((res) => res.data)
}

export function addTimelineEntry(applicationId, data) {
  return api
    .post(`/applications/${applicationId}/timeline`, data)
    .then((res) => res.data)
}

export function deleteTimelineEntry(id) {
  return api.delete(`/timeline/${id}`).then((res) => res.data)
}
