import type {
  CreateTaskRequest,
  Task,
  TaskLog,
  UpdateTaskStatusRequest,
} from '@/types/api'
import apiClient from '@/lib/api-client'

export const tasksService = {
  // Get all tasks
  getAll: async (): Promise<Task[]> => {
    const response = await apiClient.get<Task[]>('/tasks')
    return response.data
  },

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
  updateStatus: async (
    id: number,
    data: UpdateTaskStatusRequest,
  ): Promise<Task> => {
    const response = await apiClient.patch<Task>(`/tasks/${id}/status`, data)
    return response.data
  },

  // Get task change history (Only ADMIN)
  getLogs: async (id: number): Promise<Array<TaskLog>> => {
    const response = await apiClient.get<Array<TaskLog>>(`/tasks/${id}/logs`)
    return response.data
  },
}
