import type { Evidence } from '@/types/api'
import apiClient from '@/lib/api-client'

export const evidenceService = {
  // Upload photo evidence for a task (WORKER)
  upload: async (
    taskId: number,
    photo: File,
    metadata?: string,
  ): Promise<Evidence> => {
    const formData = new FormData()
    formData.append('file', photo) // Backend expects 'file' parameter
    if (metadata) {
      formData.append('description', metadata) // Backend expects 'description' parameter
    }

    // Don't set Content-Type header - let axios set it automatically with boundary
    const response = await apiClient.post<Evidence>(
      `/tasks/${taskId}/evidence`,
      formData,
    )
    return response.data
  },

  // Get all evidence for a task
  getByTaskId: async (taskId: number): Promise<Evidence[]> => {
    const response = await apiClient.get<Evidence[]>(
      `/tasks/${taskId}/evidence`,
    )
    return response.data
  },
}
