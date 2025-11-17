import apiClient from '@/lib/api-client'
import type { Evidence } from '@/types/api'

export const evidenceService = {
  // Upload photo evidence for a task (WORKER)
  upload: async (taskId: number, photo: File, metadata?: string): Promise<Evidence> => {
    const formData = new FormData()
    formData.append('photo', photo)
    if (metadata) {
      formData.append('metadata', metadata)
    }

    const response = await apiClient.post<Evidence>(`/tasks/${taskId}/evidence`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return response.data
  },
}
