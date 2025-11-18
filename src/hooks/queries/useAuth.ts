import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { LoginRequest, RegisterRequest } from '@/types/api'
import { authService } from '@/services/authService'
import { clearTokens, setTokens } from '@/lib/api-client'

// Query keys
export const authKeys = {
  all: ['auth'] as const,
  me: () => [...authKeys.all, 'me'] as const,
}

// Get current user
export const useMe = () => {
  return useQuery({
    queryKey: authKeys.me(),
    queryFn: authService.me,
    retry: false,
  })
}

// Login mutation
export const useLogin = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: LoginRequest) => authService.login(data),
    onSuccess: (response) => {
      // Store tokens
      setTokens(response.access_token, response.refresh_token)

      // Set user in cache
      queryClient.setQueryData(authKeys.me(), response.user)
    },
  })
}

// Register mutation
export const useRegister = () => {
  return useMutation({
    mutationFn: (data: RegisterRequest) => authService.register(data),
  })
}

// Logout
export const useLogout = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async () => {
      // Clear tokens
      clearTokens()

      // Clear all queries
      queryClient.clear()
    },
  })
}
