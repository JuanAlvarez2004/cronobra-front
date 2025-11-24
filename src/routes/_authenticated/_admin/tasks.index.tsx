import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { TaskList } from '@/components/features/tasks/TaskList'
import type { Task } from '@/types/api'
import { TaskStatus, UserRole } from '@/types/api'
import { useSchedules } from '@/hooks/queries/useSchedules'
import { useTasks, useUpdateTaskStatus } from '@/hooks/queries/useTasks'
import { useUsers } from '@/hooks/queries/useUsers'
import { useAuth } from '@/contexts/AuthContext'

export const Route = createFileRoute('/_authenticated/_admin/tasks/')({
  component: TasksPage,
})

function TasksPage() {
  const navigate = useNavigate()
  const { user: currentUser } = useAuth()
  const { data: schedules = [], isLoading: loadingSchedules } = useSchedules()
  const { data: tasks = [], isLoading: loadingTasks } = useTasks()
  const { data: users = [], isLoading: loadingUsers } = useUsers()
  const updateTaskStatus = useUpdateTaskStatus()

  const workers = users.filter((u) => u.role === UserRole.WORKER)

  const handleApproveTask = async (_taskId: string) => {
    // Ya está completada, no necesitamos cambiarla, solo confirmar
    // En realidad, la tarea ya está en COMPLETED, este es solo un feedback visual
    alert('Tarea confirmada como completada ✅')
  }

  const handleRejectTask = async (taskId: string) => {
    if (!confirm('¿Estás seguro de rechazar esta tarea? El trabajador deberá rehacerla.')) {
      return
    }
    
    // Rechazar = volver a PENDING para que el worker la rehaga
    await updateTaskStatus.mutateAsync({
      taskId: parseInt(taskId),
      status: TaskStatus.PENDING,
    })
  }

  const handleViewTaskDetails = (task: Task) => {
    navigate({ to: '/tasks/$taskId', params: { taskId: task.id.toString() } })
  }

  if (loadingSchedules || loadingTasks || loadingUsers || !currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-slate-600">Cargando...</div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-slate-900">Todas las Tareas</h2>
        <p className="text-slate-600">
          Vista general de todas las tareas en la obra
        </p>
      </div>

      <TaskList
        tasks={tasks}
        workers={workers}
        schedules={schedules}
        onApprove={handleApproveTask}
        onReject={handleRejectTask}
        onViewDetails={handleViewTaskDetails}
        viewMode="supervisor"
      />
    </div>
  )
}
