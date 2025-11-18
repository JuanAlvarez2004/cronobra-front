import type {
  AuthUser,
  LoginRequest,
  LoginResponse,
  RegisterRequest,
} from '@/types/api'
import apiClient from '@/lib/api-client'

export const authService = {
  // Register a new user (Only ADMIN should use this)
  register: async (data: RegisterRequest): Promise<void> => {
    const response = await apiClient.post('/auth/register', data)
    return response.data
  },

  // Login to the system
  login: async (data: LoginRequest): Promise<LoginResponse> => {
    const response = await apiClient.post<LoginResponse>('/auth/login', data)
    return response.data
  },

  // Get current authenticated user
  me: async (): Promise<AuthUser> => {
    const response = await apiClient.get<AuthUser>('/auth/me')
    return response.data
  },
}
