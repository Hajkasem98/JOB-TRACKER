import api from './axios'

export function getDocuments(applicationId) {
  return api
    .get(`/applications/${applicationId}/documents`)
    .then((res) => res.data)
}

export function uploadDocument(applicationId, file, fileType) {
  const formData = new FormData()
  formData.append('File', file)
  formData.append('FileType', fileType)

  return api
    .post(`/applications/${applicationId}/documents`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    .then((res) => res.data)
}

export function downloadDocument(id) {
  return api.get(`/documents/${id}/download`, { responseType: 'blob' }).then((res) => res.data)
}

export function deleteDocument(id) {
  return api.delete(`/documents/${id}`).then((res) => res.data)
}
