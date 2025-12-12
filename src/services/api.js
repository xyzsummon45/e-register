import axios from 'axios'

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? 'https://api.example.com/',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json'
  }
})

const get = async (url, config = {}) => {
  try {
    const response = await apiClient.get(url, config)
    return response.data
  } catch (error) {
    console.error('GET request gagal:', error)
    throw error
  }
}

const post = async (url, data = {}, config = {}) => {
  try {
    const response = await apiClient.post(url, data, config)
    return response.data
  } catch (error) {
    console.error('POST request gagal:', error)
    throw error
  }
}

export { apiClient, get, post }

export default {
  get,
  post
}
