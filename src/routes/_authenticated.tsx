import { Outlet, createFileRoute, redirect, useLocation, useNavigate } from '@tanstack/react-router'
import { isAuthenticated } from '@/lib/api-client'
import { useAuth } from '@/contexts/AuthContext'
import { UserRole } from '@/types/api'
import { useEffect } from 'react'
import Header from '@/components/common/Header'

// Authenticated layout - requires authentication
export const Route = createFileRoute('/_authenticated')({
  beforeLoad: async ({ location }) => {
    // If not authenticated, redirect to login
    if (!isAuthenticated()) {
      throw redirect({
        to: '/login',
        search: {
          redirect: location.href,
        },
      })
    }
  },
  component: AuthenticatedLayout,
})

function AuthenticatedLayout() {
  const { user, isLoading } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()

  // Check if user is trying to access admin routes
  useEffect(() => {
    if (!isLoading && user) {
      const isAdminRoute = location.pathname.startsWith('/_admin') || location.pathname.includes('/schedules')
      
      if (isAdminRoute && user.role !== UserRole.ADMIN) {
        // Redirect non-admin users away from admin routes
        navigate({ to: '/dashboard' })
      }
    }
  }, [user, isLoading, location.pathname, navigate])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-slate-600">Cargando...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>
    </div>
  )
}
