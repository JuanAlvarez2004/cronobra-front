import { createFileRoute, redirect } from '@tanstack/react-router'
import { isAuthenticated, getAccessToken } from '@/lib/api-client'
import { SupervisorDashboard } from '@/components/dashboards/SupervisorDashboard'

// Admin-only layout - needs to verify user role
export const Route = createFileRoute('/_authenticated/_admin')({
  beforeLoad: async () => {
    if (!isAuthenticated() || !getAccessToken()) {
      throw redirect({ to: '/login' })
    }
    // Note: User role validation happens in the component
    // because we need access to React Query hooks
  },
  component: AdminLayout,
})

function AdminLayout() {
  // Use SupervisorDashboard as the layout with tabs navigation
  return <SupervisorDashboard />
}
