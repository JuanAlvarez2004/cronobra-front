import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { CreateScheduleDialog } from '@/components/features/schedules/CreateScheduleDialog'
import { CreateTaskDialog } from '@/components/features/tasks/CreateTaskDialog'
import { ScheduleList } from '@/components/features/schedules/ScheduleList'
import { TaskList } from '@/components/features/tasks/TaskList'
import type { Schedule, Task } from '@/types/api'
import { TaskStatus, UserRole } from '@/types/api'
import { useSchedules } from '@/hooks/queries/useSchedules'
import { useTasks, useUpdateTaskStatus } from '@/hooks/queries/useTasks'
import { useUsers } from '@/hooks/queries/useUsers'
import { useAuth } from '@/contexts/AuthContext'

export const Route = createFileRoute('/_authenticated/_admin/schedules/')({
  component: SchedulesPage,
})

function SchedulesPage() {
  const navigate = useNavigate()
  const { user: currentUser } = useAuth()
  const { data: schedules = [], isLoading: loadingSchedules } = useSchedules()
  const { data: tasks = [], isLoading: loadingTasks } = useTasks()
  const { data: users = [], isLoading: loadingUsers } = useUsers()
  const updateTaskStatus = useUpdateTaskStatus()

  const [showCreateSchedule, setShowCreateSchedule] = useState(false)
  const [showCreateTask, setShowCreateTask] = useState(false)
  const [selectedSchedule, setSelectedSchedule] = useState<Schedule | null>(null)

  const workers = users.filter((u) => u.role === UserRole.WORKER)

  const handleApproveTask = async (_taskId: string) => {
    // La tarea ya está en COMPLETED y aprobada
    alert('Tarea aprobada correctamente ✅')
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

  const tasksForSchedule = selectedSchedule
    ? tasks.filter((t: Task) => t.schedule_id === selectedSchedule.id)
    : []

  if (loadingSchedules || loadingTasks || loadingUsers || !currentUser) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-slate-600">Cargando...</div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-slate-900">Cronogramas</h2>
          <p className="text-slate-600">Gestiona los cronogramas de obra</p>
        </div>
        <Button
          onClick={() => setShowCreateSchedule(true)}
          className="bg-amber-500 hover:bg-amber-600"
        >
          <Plus className="w-4 h-4 mr-2" />
          Nuevo Cronograma
        </Button>
      </div>

      <ScheduleList
        schedules={schedules}
        tasks={tasks}
        onSelectSchedule={setSelectedSchedule}
        selectedSchedule={selectedSchedule}
      />

      {selectedSchedule && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-slate-900">
                Tareas de: {selectedSchedule.name}
              </h3>
              <p className="text-sm text-slate-600">
                {tasksForSchedule.length} tarea(s)
              </p>
            </div>
            <Button
              onClick={() => setShowCreateTask(true)}
              className="bg-amber-500 hover:bg-amber-600"
            >
              <Plus className="w-4 h-4 mr-2" />
              Nueva Tarea
            </Button>
          </div>

          <TaskList
            tasks={tasksForSchedule}
            workers={workers}
            onApprove={handleApproveTask}
            onReject={handleRejectTask}
            onViewDetails={handleViewTaskDetails}
            viewMode="supervisor"
          />
        </div>
      )}

      <CreateScheduleDialog
        open={showCreateSchedule}
        onClose={() => setShowCreateSchedule(false)}
      />

      {selectedSchedule && (
        <CreateTaskDialog
          open={showCreateTask}
          onClose={() => setShowCreateTask(false)}
          schedule={selectedSchedule}
          workers={workers}
        />
      )}
    </div>
  )
}
