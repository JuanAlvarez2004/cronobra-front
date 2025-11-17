import { Outlet, createRootRoute } from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { TanStackDevtools } from '@tanstack/react-devtools'
import { useMe } from '@/hooks/queries/useAuth'

export const Route = createRootRoute({
  component: RootComponent,
  beforeLoad: async () => {
    // This will be available in context for child routes
    return {}
  },
})

function RootComponent() {
  const { data: user } = useMe()

  return (
    <>
      <Outlet />
      <TanStackDevtools
        config={{
          position: 'bottom-right',
        }}
        plugins={[
          {
            name: 'Tanstack Router',
            render: <TanStackRouterDevtoolsPanel />,
          },
        ]}
      />
    </>
  )
}
