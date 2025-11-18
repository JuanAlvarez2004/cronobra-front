import { useState } from 'react'
import { CheckCircle, Clock, HardHat, LogOut, PlayCircle } from 'lucide-react'
import { Button } from '../ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs'
import { WorkerTaskList } from '../features/workers/WorkerTaskList'
import { UploadEvidenceDialog } from '../features/evidence/UploadEvidenceDialog'
import type { AppData, Task, User } from '@routes/index'

interface WorkerDashboardProps {
  currentUser: User
  appData: AppData
  setAppData: (data: AppData) => void
  onLogout: () => void
}

export function WorkerDashboard({
  currentUser,
  appData,
  setAppData,
  onLogout,
}: WorkerDashboardProps) {
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [showUploadEvidence, setShowUploadEvidence] = useState(false)

  // Filtrar solo las tareas asignadas al trabajador actual
  const myTasks = appData.tasks.filter((t) => t.assignedTo === currentUser.id)

  const pendingTasks = myTasks.filter((t) => t.status === 'PENDING')
  const inProgressTasks = myTasks.filter((t) => t.status === 'IN_PROGRESS')
  const completedTasks = myTasks.filter(
    (t) =>
      t.status === 'COMPLETED' ||
      t.status === 'APPROVED' ||
      t.status === 'REJECTED',
  )

  const handleStartTask = (taskId: string) => {
    const now = new Date().toISOString()
    setAppData({
      ...appData,
      tasks: appData.tasks.map((t) =>
        t.id === taskId ? { ...t, status: 'IN_PROGRESS', updatedAt: now } : t,
      ),
      traceLog: [
        ...appData.traceLog,
        {
          id: `trace-${Date.now()}`,
          taskId,
          action: 'STATUS_CHANGED',
          user: currentUser.name,
          timestamp: now,
          details: 'Tarea iniciada - Estado cambió de PENDING a IN_PROGRESS',
        },
      ],
    })
  }

  const handleCompleteTask = (task: Task) => {
    setSelectedTask(task)
    setShowUploadEvidence(true)
  }

  const handleUploadEvidence = (taskId: string, photoUrl: string) => {
    const now = new Date().toISOString()
    setAppData({
      ...appData,
      tasks: appData.tasks.map((t) =>
        t.id === taskId
          ? {
              ...t,
              status: 'COMPLETED',
              evidence: { photoUrl, uploadedAt: now },
              updatedAt: now,
            }
          : t,
      ),
      traceLog: [
        ...appData.traceLog,
        {
          id: `trace-${Date.now()}`,
          taskId,
          action: 'EVIDENCE_UPLOADED',
          user: currentUser.name,
          timestamp: now,
          details:
            'Evidencia fotográfica subida - Tarea completada y esperando aprobación',
        },
      ],
    })
    setShowUploadEvidence(false)
    setSelectedTask(null)
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-blue-500 p-2 rounded-lg">
                <HardHat className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-slate-900">Mis Tareas</h1>
                <p className="text-sm text-slate-600">{currentUser.name}</p>
              </div>
            </div>
            <Button variant="outline" onClick={onLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Salir
            </Button>
          </div>
        </div>
      </header>

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
                schedules={appData.schedules}
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
                schedules={appData.schedules}
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
                schedules={appData.schedules}
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
          onUpload={handleUploadEvidence}
        />
      )}
    </div>
  )
}
