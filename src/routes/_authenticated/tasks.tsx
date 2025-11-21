import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { WorkerTaskList } from '@/components/features/workers'
import { UploadEvidenceDialog } from '@/components/features/evidence'
import { useAuth } from '@/contexts/AuthContext'
import { useSchedules } from '@/hooks/queries/useSchedules'
import { useTasks, useUpdateTaskStatus } from '@/hooks/queries/useTasks'
import { TaskStatus } from '@/types/api'
import type { Task } from '@/types/api'
import { CheckCircle, Clock, PlayCircle } from 'lucide-react'

export const Route = createFileRoute('/_authenticated/tasks')({
  component: TasksPage,
})

function TasksPage() {
  const { user } = useAuth()
  const { data: schedules = [], isLoading: loadingSchedules } = useSchedules()
  const { data: tasks = [], isLoading: loadingTasks } = useTasks()
  const updateTaskStatus = useUpdateTaskStatus()
  
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [showUploadEvidence, setShowUploadEvidence] = useState(false)

  if (!user) {
    return <div>Cargando...</div>
  }

  // Filtrar solo las tareas asignadas al trabajador actual
  const myTasks = tasks.filter((t) => t.assigned_to === user.id)

  const pendingTasks = myTasks.filter((t) => t.status === TaskStatus.PENDING)
  const inProgressTasks = myTasks.filter((t) => t.status === TaskStatus.IN_PROGRESS)
  const completedTasks = myTasks.filter((t) => t.status === TaskStatus.COMPLETED)

  const handleStartTask = async (taskId: string) => {
    await updateTaskStatus.mutateAsync({
      taskId: parseInt(taskId),
      status: TaskStatus.IN_PROGRESS,
    })
  }

  const handleCompleteTask = (task: Task) => {
    setSelectedTask(task)
    setShowUploadEvidence(true)
  }

  if (loadingSchedules || loadingTasks) {
    return <div className="text-center py-12">Cargando tareas...</div>
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Mis Tareas</h1>
        <p className="text-slate-600">Gestiona tus tareas asignadas</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-lg border border-slate-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600">Pendientes</p>
              <p className="text-2xl font-bold text-slate-900">{pendingTasks.length}</p>
            </div>
            <Clock className="w-8 h-8 text-slate-400" />
          </div>
        </div>
        <div className="bg-white rounded-lg border border-slate-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600">En Progreso</p>
              <p className="text-2xl font-bold text-blue-600">{inProgressTasks.length}</p>
            </div>
            <PlayCircle className="w-8 h-8 text-blue-400" />
          </div>
        </div>
        <div className="bg-white rounded-lg border border-slate-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600">Completadas</p>
              <p className="text-2xl font-bold text-green-600">{completedTasks.length}</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-400" />
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {myTasks.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg border border-slate-200">
            <p className="text-slate-600">No tienes tareas asignadas</p>
          </div>
        ) : (
          <WorkerTaskList
            tasks={myTasks}
            schedules={schedules}
            onStartTask={handleStartTask}
            onCompleteTask={handleCompleteTask}
          />
        )}
      </div>

      {/* Upload Evidence Dialog */}
      {selectedTask && (
        <UploadEvidenceDialog
          open={showUploadEvidence}
          onClose={() => {
            setShowUploadEvidence(false)
            setSelectedTask(null)
          }}
          task={selectedTask}
        />
      )}
    </div>
  )
}
