import { createFileRoute } from '@tanstack/react-router'
import WorkerTaskList from '@/components/WorkerTaskList'

export const Route = createFileRoute('/_authenticated/tasks')({
  component: TasksPage,
})

function TasksPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Mis Tareas</h1>
      <WorkerTaskList />
    </div>
  )
}
