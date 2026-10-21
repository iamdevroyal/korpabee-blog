import axios from 'axios'

export function getBlogApiBaseUrl() {
  const envUrl = import.meta.env.VITE_API_URL || import.meta.env.VITE_API_BASE_URL
  if (envUrl && !envUrl.includes('127.0.0.1') && !envUrl.includes('localhost')) {
    const url = envUrl.replace(/\/+$/, '')
    return url.endsWith('/blog') ? url : `${url}/blog`
  }
  if (typeof window !== 'undefined' && window.location?.hostname) {
    const host = window.location.hostname
    if (host.endsWith('korpabee.com') || host.includes('pages.dev')) {
      return 'https://api.korpabee.com/api/v1/blog'
    }
    if (host !== 'localhost' && host !== '127.0.0.1') {
      return `http://${host}:8000/api/v1/blog`
    }
  }
  if (envUrl) {
    const url = envUrl.replace(/\/+$/, '')
    return url.endsWith('/blog') ? url : `${url}/blog`
  }
  return 'http://localhost:8000/api/v1/blog'
}

const apiClient = axios.create({
  baseURL: getBlogApiBaseUrl(),
  timeout: 15000,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  },
})

export const blogApi = {
  getPosts: (params = {}) => apiClient.get('/posts', { params }),
  getPost: (slug) => apiClient.get(`/posts/${slug}`),
  getCategories: () => apiClient.get('/categories'),
  getTags: () => apiClient.get('/tags'),
  getAds: (placement = 'in_article') => apiClient.get('/ads', { params: { placement } }),
}
