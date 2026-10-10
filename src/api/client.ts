import axios from 'axios'

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_BASE_URL,
})
