import api from './axios'

export function register({ email, password, firstName, lastName }) {
  return api
    .post('/auth/register', { email, password, firstName, lastName })
    .then((res) => res.data)
}

export function login({ email, password }) {
  return api.post('/auth/login', { email, password }).then((res) => res.data)
}
