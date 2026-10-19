export const API_BASE_URL = import.meta.env.VITE_API_URL || '/api'

export async function apiRequest(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`
  
  const defaultOptions = {
    credentials: 'include',
    ...options,
  }

  const isFormData = options.body instanceof FormData
  
  if (!isFormData) {
    defaultOptions.headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    }
    if (defaultOptions.body && typeof defaultOptions.body === 'object') {
      defaultOptions.body = JSON.stringify(defaultOptions.body)
    }
  } else {
    // If it IS FormData, ensure we don't pass any headers that break the boundary
    defaultOptions.headers = options.headers || {}
  }

  const response = await fetch(url, defaultOptions)
  
  let data
  try {
    data = await response.json()
  } catch (err) {
    data = { error: 'Invalid response from server' }
  }

  if (!response.ok) {
    throw new Error(data.error || `Request failed with status ${response.status}`)
  }

  return data
}