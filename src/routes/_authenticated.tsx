import { Outlet, createFileRoute, redirect } from '@tanstack/react-router'
import { isAuthenticated } from '@/lib/api-client'
import Header from '@/components/Header'

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
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>
    </div>
  )
}
