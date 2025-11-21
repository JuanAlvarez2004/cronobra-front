import axios from 'axios'
import type {
  AxiosError,
  AxiosInstance,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios'
import type { ApiError } from '@/types/api'
import { toSnakeCase, toCamelCase } from './transformers'

// Token storage keys
const ACCESS_TOKEN_KEY = 'cronobra_access_token'
const REFRESH_TOKEN_KEY = 'cronobra_refresh_token'

// Create axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080',
  timeout: Number(import.meta.env.VITE_API_TIMEOUT) || 30000,
  // Don't set default Content-Type - let it be set based on request data
})

// Request interceptor - Add JWT token and transform to camelCase
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Add JWT token
    const token = getAccessToken()
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`
    }

    // Only set Content-Type to application/json if it's not FormData
    if (!(config.data instanceof FormData) && !config.headers['Content-Type']) {
      config.headers['Content-Type'] = 'application/json'
    }

    // Transform request data from snake_case to camelCase for Java backend
    // Only transform if it's JSON data (not FormData for file uploads)
    if (
      config.data &&
      !(config.data instanceof FormData) &&
      config.headers['Content-Type'] === 'application/json'
    ) {
      config.data = toCamelCase(config.data)
    }

    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

// Response interceptor - Transform from camelCase and handle errors
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    // Transform response data from camelCase (Java) to snake_case (TypeScript)
    if (response.data && typeof response.data === 'object') {
      response.data = toSnakeCase(response.data)
    }
    return response
  },
  async (error: AxiosError<ApiError>) => {
    const originalRequest = error.config

    // If 401 and we have a refresh token, try to refresh
    if (error.response?.status === 401 && originalRequest) {
      const refreshToken = getRefreshToken()

      if (refreshToken) {
        try {
          // Clear tokens and redirect to login
          clearTokens()
          window.location.href = '/login'
        } catch (refreshError) {
          clearTokens()
          window.location.href = '/login'
          return Promise.reject(refreshError)
        }
      } else {
        // No refresh token, redirect to login
        clearTokens()
        window.location.href = '/login'
      }
    }

    // Format error response
    const apiError: ApiError = {
      message:
        error.response?.data?.message || error.message || 'An error occurred',
      statusCode: error.response?.status,
      errors: error.response?.data?.errors,
    }

    return Promise.reject(apiError)
  },
)

// Token management functions
export const getAccessToken = (): string | null => {
  return localStorage.getItem(ACCESS_TOKEN_KEY)
}

export const getRefreshToken = (): string | null => {
  return localStorage.getItem(REFRESH_TOKEN_KEY)
}

export const setAccessToken = (token: string): void => {
  localStorage.setItem(ACCESS_TOKEN_KEY, token)
}

export const setRefreshToken = (token: string): void => {
  localStorage.setItem(REFRESH_TOKEN_KEY, token)
}

export const setTokens = (accessToken: string, refreshToken: string): void => {
  setAccessToken(accessToken)
  setRefreshToken(refreshToken)
}

export const clearTokens = (): void => {
  localStorage.removeItem(ACCESS_TOKEN_KEY)
  localStorage.removeItem(REFRESH_TOKEN_KEY)
}

export const isAuthenticated = (): boolean => {
  return !!getAccessToken()
}

export default apiClient
