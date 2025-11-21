import type {
  User,
  LoginRequest,
  LoginResponse,
  RegisterRequest,
} from '@/types/api'
import apiClient from '@/lib/api-client'

export const authService = {
  // Register a new admin (Public endpoint - to be created in backend)
  registerAdmin: async (data: {
    name: string
    email: string
    password: string
  }): Promise<User> => {
    const response = await apiClient.post<User>('/auth/register-admin', {
      ...data,
      role: 'ADMIN',
    })
    return response.data
  },

  // Register a new user (Only ADMIN should use this)
  register: async (data: RegisterRequest): Promise<User> => {
    const response = await apiClient.post<User>('/auth/register', data)
    return response.data
  },

  // Login to the system
  login: async (data: LoginRequest): Promise<LoginResponse> => {
    const response = await apiClient.post<LoginResponse>('/auth/login', data)
    return response.data
  },

  // Get current authenticated user
  me: async (): Promise<User> => {
    const response = await apiClient.get<User>('/auth/me')
    return response.data
  },
}
