import { createContext, useContext } from 'react'
import type { ReactNode } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { useMe, useLogin, useLogout } from '@/hooks/queries/useAuth'
import { isAuthenticated } from '@/lib/api-client'
import type { AuthUser, LoginRequest } from '@/types/api'

interface AuthContextType {
  user: AuthUser | undefined
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
  const navigate = useNavigate()
  
  // Get current user
  const { data: user, isLoading, refetch } = useMe()
  
  // Login mutation
  const loginMutation = useLogin()
  
  // Logout mutation
  const logoutMutation = useLogout()

  const login = async (data: LoginRequest) => {
    try {
      await loginMutation.mutateAsync(data)
      await refetch()
      navigate({ to: '/' })
    } catch (error) {
      throw error
    }
  }

  const logout = async () => {
    try {
      await logoutMutation.mutateAsync()
      navigate({ to: '/login' })
    } catch (error) {
      throw error
    }
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
