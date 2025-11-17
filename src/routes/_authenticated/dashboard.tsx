import { createFileRoute } from '@tanstack/react-router'
import { useAuth } from '@/contexts/AuthContext'
import { UserRole } from '@/types/api'
import SupervisorDashboard from '@/components/SupervisorDashboard'
import WorkerDashboard from '@/components/WorkerDashboard'

export const Route = createFileRoute('/_authenticated/dashboard')({
  component: DashboardPage,
})

function DashboardPage() {
  const { user } = useAuth()

  if (!user) {
    return <div>Loading...</div>
  }

  // Render different dashboard based on user role
  if (user.role === UserRole.ADMIN) {
    return <SupervisorDashboard />
  }

  return <WorkerDashboard />
}
