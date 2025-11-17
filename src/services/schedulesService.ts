import apiClient from '@/lib/api-client'
import type {
  Schedule,
  CreateScheduleRequest,
  UpdateScheduleRequest,
  MessageResponse,
} from '@/types/api'

export const schedulesService = {
  // List all schedules (Only ADMIN)
  getAll: async (): Promise<Schedule[]> => {
    const response = await apiClient.get<Schedule[]>('/schedules')
    return response.data
  },

  // Create a new schedule (Only ADMIN)
  create: async (data: CreateScheduleRequest): Promise<Schedule> => {
    const response = await apiClient.post<Schedule>('/schedules', data)
    return response.data
  },

  // Get a specific schedule
  getById: async (id: number): Promise<Schedule> => {
    const response = await apiClient.get<Schedule>(`/schedules/${id}`)
    return response.data
  },

  // Update a schedule (Only ADMIN)
  update: async (id: number, data: UpdateScheduleRequest): Promise<Schedule> => {
    const response = await apiClient.patch<Schedule>(`/schedules/${id}`, data)
    return response.data
  },

  // Delete a schedule (Only ADMIN)
  delete: async (id: number): Promise<MessageResponse> => {
    const response = await apiClient.delete<MessageResponse>(`/schedules/${id}`)
    return response.data
  },
}
