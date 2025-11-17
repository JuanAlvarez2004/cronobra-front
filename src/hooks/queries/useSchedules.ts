import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { schedulesService } from '@/services/schedulesService'
import type { CreateScheduleRequest, UpdateScheduleRequest } from '@/types/api'

// Query keys
export const schedulesKeys = {
  all: ['schedules'] as const,
  lists: () => [...schedulesKeys.all, 'list'] as const,
  list: (filters?: string) => [...schedulesKeys.lists(), { filters }] as const,
  details: () => [...schedulesKeys.all, 'detail'] as const,
  detail: (id: number) => [...schedulesKeys.details(), id] as const,
}

// Get all schedules
export const useSchedules = () => {
  return useQuery({
    queryKey: schedulesKeys.lists(),
    queryFn: schedulesService.getAll,
  })
}

// Get schedule by ID
export const useSchedule = (id: number) => {
  return useQuery({
    queryKey: schedulesKeys.detail(id),
    queryFn: () => schedulesService.getById(id),
    enabled: !!id,
  })
}

// Create schedule mutation
export const useCreateSchedule = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateScheduleRequest) => schedulesService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: schedulesKeys.lists() })
    },
  })
}

// Update schedule mutation
export const useUpdateSchedule = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateScheduleRequest }) =>
      schedulesService.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: schedulesKeys.lists() })
      queryClient.invalidateQueries({ queryKey: schedulesKeys.detail(variables.id) })
    },
  })
}

// Delete schedule mutation
export const useDeleteSchedule = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => schedulesService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: schedulesKeys.lists() })
    },
  })
}
