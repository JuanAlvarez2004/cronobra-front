import { createContext, useContext } from 'react'
import type { ReactNode } from 'react'
import type { User, LoginRequest } from '@/types/api'
import { useLogin, useLogout, useMe } from '@/hooks/queries/useAuth'
import { isAuthenticated } from '@/lib/api-client'

interface AuthContextType {
  user: User | undefined
  isLoading: boolean
  isAuthenticated: boolean
  login: (data: LoginRequest) => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  // Get current user
  const { data: user, isLoading, refetch } = useMe()

  // Login mutation
  const loginMutation = useLogin()

  // Logout mutation
  const logoutMutation = useLogout()

  const login = async (data: LoginRequest) => {
    await loginMutation.mutateAsync(data)
    await refetch()
    // Navigation will be handled by the component after successful login
  }

  const logout = async () => {
    await logoutMutation.mutateAsync()
    // Navigation will be handled by the component after successful logout
  }

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: isAuthenticated() && !!user,
    login,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
