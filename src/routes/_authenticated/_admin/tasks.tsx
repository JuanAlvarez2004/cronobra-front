import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/_admin/tasks')({
  component: TasksLayout,
})

function TasksLayout() {
  return <Outlet />
}
