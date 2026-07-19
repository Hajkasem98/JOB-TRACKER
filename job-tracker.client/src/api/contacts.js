import api from './axios'

export function getContacts(applicationId) {
  return api
    .get(`/applications/${applicationId}/contacts`)
    .then((res) => res.data)
}

export function createContact(applicationId, data) {
  return api
    .post(`/applications/${applicationId}/contacts`, data)
    .then((res) => res.data)
}

export function updateContact(id, data) {
  return api.put(`/contacts/${id}`, data).then((res) => res.data)
}

export function deleteContact(id) {
  return api.delete(`/contacts/${id}`).then((res) => res.data)
}
