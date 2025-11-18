import type {
  CreateUserRequest,
  MessageResponse,
  UpdateUserRequest,
  User,
} from '@/types/api'
import apiClient from '@/lib/api-client'

export const usersService = {
  // List all users (Only ADMIN)
  getAll: async (): Promise<Array<User>> => {
    const response = await apiClient.get<Array<User>>('/users')
    return response.data
  },

  // Create a new user (Only ADMIN)
  create: async (data: CreateUserRequest): Promise<User> => {
    const response = await apiClient.post<User>('/users', data)
    return response.data
  },

  // Get a specific user by ID
  getById: async (id: number): Promise<User> => {
    const response = await apiClient.get<User>(`/users/${id}`)
    return response.data
  },

  // Update user information (Only ADMIN)
  update: async (id: number, data: UpdateUserRequest): Promise<User> => {
    const response = await apiClient.patch<User>(`/users/${id}`, data)
    return response.data
  },

  // Delete a user (Only ADMIN)
  delete: async (id: number): Promise<MessageResponse> => {
    const response = await apiClient.delete<MessageResponse>(`/users/${id}`)
    return response.data
  },
}
