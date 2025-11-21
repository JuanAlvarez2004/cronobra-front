import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { tasksKeys } from './useTasks'
import { evidenceService } from '@/services/evidenceService'

// Query keys for evidence
export const evidenceKeys = {
  all: ['evidence'] as const,
  byTask: (taskId: number) => [...evidenceKeys.all, 'task', taskId] as const,
}

// Get evidence by task ID
export const useTaskEvidence = (taskId: number) => {
  return useQuery({
    queryKey: evidenceKeys.byTask(taskId),
    queryFn: () => evidenceService.getByTaskId(taskId),
    enabled: !!taskId,
  })
}

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
      // Invalidate task details and evidence list
      queryClient.invalidateQueries({
        queryKey: tasksKeys.detail(variables.taskId),
      })
      queryClient.invalidateQueries({
        queryKey: evidenceKeys.byTask(variables.taskId),
      })
    },
  })
}
