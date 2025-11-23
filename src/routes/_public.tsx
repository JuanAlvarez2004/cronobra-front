import { Outlet, createFileRoute } from '@tanstack/react-router'

// Public layout - no authentication required
export const Route = createFileRoute('/_public')({
  component: PublicLayout,
})

function PublicLayout() {
  return (
    <div className="min-h-screen">
      <Outlet />
    </div>
  )
}
