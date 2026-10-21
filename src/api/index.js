import axios from 'axios'

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1/blog'

const apiClient = axios.create({
  baseURL: API_BASE,
  timeout: 10000,
})

export const blogApi = {
  getPosts: (params = {}) => apiClient.get('/posts', { params }),
  getPost: (slug) => apiClient.get(`/posts/${slug}`),
  getCategories: () => apiClient.get('/categories'),
  getTags: () => apiClient.get('/tags'),
  getAds: (placement = 'in_article') => apiClient.get('/ads', { params: { placement } }),
}
