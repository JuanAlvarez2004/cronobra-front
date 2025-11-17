import apiClient from '@/lib/api-client'
import type {
  Task,
  CreateTaskRequest,
  UpdateTaskStatusRequest,
  TaskLog,
} from '@/types/api'

export const tasksService = {
  // Get a specific task by ID
  getById: async (id: number): Promise<Task> => {
    const response = await apiClient.get<Task>(`/tasks/${id}`)
    return response.data
  },

  // Create a new task (Only ADMIN)
  create: async (data: CreateTaskRequest): Promise<Task> => {
    const response = await apiClient.post<Task>('/tasks', data)
    return response.data
  },

  // Update task status (WORKER)
  updateStatus: async (id: number, data: UpdateTaskStatusRequest): Promise<Task> => {
    const response = await apiClient.patch<Task>(`/tasks/${id}/status`, data)
    return response.data
  },

  // Get task change history (Only ADMIN)
  getLogs: async (id: number): Promise<TaskLog[]> => {
    const response = await apiClient.get<TaskLog[]>(`/tasks/${id}/logs`)
    return response.data
  },
}
