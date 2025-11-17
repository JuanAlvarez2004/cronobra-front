import { createFileRoute, redirect } from '@tanstack/react-router'
import { UserRole } from '@/types/api'
import { isAuthenticated } from '@/lib/api-client'

// Admin-only layout
export const Route = createFileRoute('/_authenticated/_admin')({
  beforeLoad: async ({ context }) => {
    if (!isAuthenticated()) {
      throw redirect({ to: '/login' })
    }
    
    // We'll need to check user role from context
    // This will be populated from the root route
    const user = (context as any).user
    
    if (user && user.role !== UserRole.ADMIN) {
      throw redirect({ to: '/' })
    }
  },
})
