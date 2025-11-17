import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { tasksService } from '@/services/tasksService'
import type { CreateTaskRequest, UpdateTaskStatusRequest } from '@/types/api'

// Query keys
export const tasksKeys = {
  all: ['tasks'] as const,
  lists: () => [...tasksKeys.all, 'list'] as const,
  list: (filters?: string) => [...tasksKeys.lists(), { filters }] as const,
  details: () => [...tasksKeys.all, 'detail'] as const,
  detail: (id: number) => [...tasksKeys.details(), id] as const,
  logs: (id: number) => [...tasksKeys.detail(id), 'logs'] as const,
}

// Get task by ID
export const useTask = (id: number) => {
  return useQuery({
    queryKey: tasksKeys.detail(id),
    queryFn: () => tasksService.getById(id),
    enabled: !!id,
  })
}

// Get task logs
export const useTaskLogs = (id: number) => {
  return useQuery({
    queryKey: tasksKeys.logs(id),
    queryFn: () => tasksService.getLogs(id),
    enabled: !!id,
  })
}

// Create task mutation
export const useCreateTask = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateTaskRequest) => tasksService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: tasksKeys.lists() })
    },
  })
}

// Update task status mutation
export const useUpdateTaskStatus = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateTaskStatusRequest }) =>
      tasksService.updateStatus(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: tasksKeys.detail(variables.id) })
      queryClient.invalidateQueries({ queryKey: tasksKeys.logs(variables.id) })
    },
  })
}
