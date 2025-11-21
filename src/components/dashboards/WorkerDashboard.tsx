import { useState } from 'react'
import { CheckCircle, Clock, PlayCircle } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs'
import { WorkerTaskList } from '../features/workers/WorkerTaskList'
import { UploadEvidenceDialog } from '../features/evidence/UploadEvidenceDialog'
import type { Task } from '@/types/api'
import { TaskStatus } from '@/types/api'
import { useAuth } from '@/contexts/AuthContext'
import { useSchedules } from '@/hooks/queries/useSchedules'
import { useTasks, useUpdateTaskStatus } from '@/hooks/queries/useTasks'

export function WorkerDashboard() {
  const { user: currentUser } = useAuth()
  
  // Fetch data from backend using React Query
  const { data: schedules = [], isLoading: loadingSchedules } = useSchedules()
  const { data: tasks = [], isLoading: loadingTasks } = useTasks()
  const updateTaskStatus = useUpdateTaskStatus()
  
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [showUploadEvidence, setShowUploadEvidence] = useState(false)

  if (!currentUser) {
    return null
  }

  // Filtrar solo las tareas asignadas al trabajador actual
  const myTasks = tasks.filter((t) => t.assigned_to === currentUser.id)

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
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-slate-600">Cargando...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Stats */}
      <div className="bg-white border-b border-slate-200">
        <div className="container mx-auto px-4 py-6">
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Clock className="w-5 h-5 text-slate-500" />
              </div>
              <div className="text-slate-900">{pendingTasks.length}</div>
              <div className="text-sm text-slate-600">Pendientes</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <PlayCircle className="w-5 h-5 text-blue-500" />
              </div>
              <div className="text-slate-900">{inProgressTasks.length}</div>
              <div className="text-sm text-slate-600">En Progreso</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
              </div>
              <div className="text-slate-900">{completedTasks.length}</div>
              <div className="text-sm text-slate-600">Completadas</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue="pending" className="space-y-6">
          <TabsList className="bg-white border border-slate-200 w-full">
            <TabsTrigger value="pending" className="flex-1">
              Pendientes ({pendingTasks.length})
            </TabsTrigger>
            <TabsTrigger value="in-progress" className="flex-1">
              En Progreso ({inProgressTasks.length})
            </TabsTrigger>
            <TabsTrigger value="completed" className="flex-1">
              Completadas ({completedTasks.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="pending" className="space-y-4">
            {pendingTasks.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-lg border border-slate-200">
                <Clock className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <p className="text-slate-600">No tienes tareas pendientes</p>
              </div>
            ) : (
              <WorkerTaskList
                tasks={pendingTasks}
                schedules={schedules}
                onStartTask={handleStartTask}
                onCompleteTask={handleCompleteTask}
              />
            )}
          </TabsContent>

          <TabsContent value="in-progress" className="space-y-4">
            {inProgressTasks.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-lg border border-slate-200">
                <PlayCircle className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <p className="text-slate-600">No tienes tareas en progreso</p>
              </div>
            ) : (
              <WorkerTaskList
                tasks={inProgressTasks}
                schedules={schedules}
                onStartTask={handleStartTask}
                onCompleteTask={handleCompleteTask}
              />
            )}
          </TabsContent>

          <TabsContent value="completed" className="space-y-4">
            {completedTasks.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-lg border border-slate-200">
                <CheckCircle className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <p className="text-slate-600">No tienes tareas completadas</p>
              </div>
            ) : (
              <WorkerTaskList
                tasks={completedTasks}
                schedules={schedules}
                onStartTask={handleStartTask}
                onCompleteTask={handleCompleteTask}
              />
            )}
          </TabsContent>
        </Tabs>
      </main>

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
