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
import { useTabBubbleAnimation } from '@/hooks/useTabBubbleAnimation'

export function WorkerDashboard() {
  const { user: currentUser } = useAuth()
  
  // Fetch data from backend using React Query
  const { data: schedules = [], isLoading: loadingSchedules } = useSchedules()
  const { data: tasks = [], isLoading: loadingTasks } = useTasks()
  const updateTaskStatus = useUpdateTaskStatus()
  
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [showUploadEvidence, setShowUploadEvidence] = useState(false)
  const [activeTab, setActiveTab] = useState('pending')
  
  const { bubbleRef, tabsListRef, getTabHandlers } = useTabBubbleAnimation({ 
    activeTab 
  })

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
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-slate-600">Cargando...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      {/* Main Content */}
      <main className="container mx-auto px-4 py-2">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <div ref={tabsListRef} className="relative">
            {/* Burbuja animada */}
            <div
              ref={bubbleRef}
              className="absolute top-[3px] h-[calc(100%-6px)] border-2 border-amber-600 rounded-xl pointer-events-none opacity-0 z-10"
              style={{ transition: 'none' }}
            />
            
            <TabsList className="bg-white border border-slate-200 w-full relative">
              <TabsTrigger 
                id="tab-pending" 
                value="pending" 
                className="flex-1 relative z-10"
                {...getTabHandlers('pending')}
              >
                Pendientes ({pendingTasks.length})
              </TabsTrigger>
              <TabsTrigger 
                id="tab-in-progress" 
                value="in-progress" 
                className="flex-1 relative z-10"
                {...getTabHandlers('in-progress')}
              >
                En Progreso ({inProgressTasks.length})
              </TabsTrigger>
              <TabsTrigger 
                id="tab-completed" 
                value="completed" 
                className="flex-1 relative z-10"
                {...getTabHandlers('completed')}
              >
                Completadas ({completedTasks.length})
              </TabsTrigger>
            </TabsList>
          </div>

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
