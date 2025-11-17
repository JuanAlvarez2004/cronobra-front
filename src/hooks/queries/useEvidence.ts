import { useMutation, useQueryClient } from '@tanstack/react-query'
import { evidenceService } from '@/services/evidenceService'
import { tasksKeys } from './useTasks'

// Upload evidence mutation
export const useUploadEvidence = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      taskId,
      photo,
      metadata,
    }: {
      taskId: number
      photo: File
      metadata?: string
    }) => evidenceService.upload(taskId, photo, metadata),
    onSuccess: (_, variables) => {
      // Invalidate task details to refresh evidence list
      queryClient.invalidateQueries({ queryKey: tasksKeys.detail(variables.taskId) })
    },
  })
}
