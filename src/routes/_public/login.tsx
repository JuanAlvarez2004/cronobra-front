import { createFileRoute, redirect } from '@tanstack/react-router'
import { isAuthenticated } from '@/lib/api-client'
import LoginPage from '@/components/LoginPage'

export const Route = createFileRoute('/_public/login')({
  beforeLoad: async () => {
    // If already authenticated, redirect to home
    if (isAuthenticated()) {
      throw redirect({ to: '/' })
    }
  },
  component: LoginPage,
})
