import api from './axios'

export function getStats() {
  return api.get('/dashboard/stats').then((res) => res.data)
}
