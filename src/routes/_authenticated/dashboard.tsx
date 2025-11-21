import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useAuth } from '@/contexts/AuthContext'
import { UserRole } from '@/types/api'
import { WorkerDashboard } from '@/components/dashboards/WorkerDashboard'
import { useEffect } from 'react'

export const Route = createFileRoute('/_authenticated/dashboard')({
  component: DashboardPage,
})

function DashboardPage() {
  const { user } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    // Redirect ADMIN to schedules page
    if (user?.role === UserRole.ADMIN) {
      navigate({ to: '/schedules' })
    }
  }, [user, navigate])

  if (!user) {
    return <div>Loading...</div>
  }

  // For ADMIN, show loading while redirecting
  if (user.role === UserRole.ADMIN) {
    return <div>Redirigiendo...</div>
  }

  return <WorkerDashboard />
}
