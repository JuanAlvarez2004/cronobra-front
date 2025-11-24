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
import { useMediaQuery } from '@/hooks/useMediaQuery'

export function WorkerDashboard() {
  const { user: currentUser } = useAuth()
  const isMobile = useMediaQuery()
  
  // Fetch data from backend using React Query
  const { data: schedules = [], isLoading: loadingSchedules } = useSchedules()
  const { data: tasks = [], isLoading: loadingTasks } = useTasks()
  const updateTaskStatus = useUpdateTaskStatus()
  
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [showUploadEvidence, setShowUploadEvidence] = useState(false)
  const [activeTab, setActiveTab] = useState('pending')
  
  const { bubbleRef, tabsListRef, getTabHandlers } = useTabBubbleAnimation({ 
    activeTab,
    disabled: isMobile
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
      <main className="container mx-auto px-3 sm:px-4 lg:px-6 py-3 sm:py-4 lg:py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4 sm:space-y-6">
          <div ref={tabsListRef} className="relative">
            {/* Burbuja animada - solo en desktop */}
            {!isMobile && (
              <div
                ref={bubbleRef}
                className="absolute top-[3px] h-[calc(100%-6px)] border-2 border-amber-600 rounded-xl pointer-events-none opacity-0 z-10"
                style={{ transition: 'none' }}
              />
            )}
            
            <TabsList className="bg-white border border-slate-200 w-full relative flex flex-col md:flex-row h-max gap-1 p-1">
              <TabsTrigger 
                id="tab-pending" 
                value="pending" 
                className="flex-1 relative z-10 text-sm sm:text-base py-2.5 sm:py-2"
                {...getTabHandlers('pending')}
              >
                <span className="hidden sm:inline">Pendientes</span>
                <span className="sm:hidden">Pend.</span>
                <span className="ml-1">({pendingTasks.length})</span>
              </TabsTrigger>
              <TabsTrigger 
                id="tab-in-progress" 
                value="in-progress" 
                className="flex-1 relative z-10 text-sm sm:text-base py-2.5 sm:py-2"
                {...getTabHandlers('in-progress')}
              >
                <span className="hidden sm:inline">En Progreso</span>
                <span className="sm:hidden">Progreso</span>
                <span className="ml-1">({inProgressTasks.length})</span>
              </TabsTrigger>
              <TabsTrigger 
                id="tab-completed" 
                value="completed" 
                className="flex-1 relative z-10 text-sm sm:text-base py-2.5 sm:py-2"
                {...getTabHandlers('completed')}
              >
                <span className="hidden sm:inline">Completadas</span>
                <span className="sm:hidden">Compl.</span>
                <span className="ml-1">({completedTasks.length})</span>
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="pending" className="space-y-3 sm:space-y-4">
            {pendingTasks.length === 0 ? (
              <div className="text-center py-8 sm:py-12 bg-white rounded-lg border border-slate-200 mx-1 sm:mx-0">
                <Clock className="w-10 h-10 sm:w-12 sm:h-12 text-slate-300 mx-auto mb-2 sm:mb-3" />
                <p className="text-sm sm:text-base text-slate-600 px-4">No tienes tareas pendientes</p>
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

          <TabsContent value="in-progress" className="space-y-3 sm:space-y-4">
            {inProgressTasks.length === 0 ? (
              <div className="text-center py-8 sm:py-12 bg-white rounded-lg border border-slate-200 mx-1 sm:mx-0">
                <PlayCircle className="w-10 h-10 sm:w-12 sm:h-12 text-slate-300 mx-auto mb-2 sm:mb-3" />
                <p className="text-sm sm:text-base text-slate-600 px-4">No tienes tareas en progreso</p>
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

          <TabsContent value="completed" className="space-y-3 sm:space-y-4">
            {completedTasks.length === 0 ? (
              <div className="text-center py-8 sm:py-12 bg-white rounded-lg border border-slate-200 mx-1 sm:mx-0">
                <CheckCircle className="w-10 h-10 sm:w-12 sm:h-12 text-slate-300 mx-auto mb-2 sm:mb-3" />
                <p className="text-sm sm:text-base text-slate-600 px-4">No tienes tareas completadas</p>
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
