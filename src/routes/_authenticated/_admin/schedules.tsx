import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useCallback, useEffect, useRef, useState, Suspense, lazy } from 'react'
import { Plus } from 'lucide-react'
import { ScheduleList } from '@/components/features/schedules'
import { CreateScheduleDialog } from '@/components/features/schedules'
import { CreateTaskDialog } from '@/components/features/tasks'
import { Button } from '@/components/ui/button'
import { useSchedules } from '@/hooks/queries/useSchedules'
import { useTasks } from '@/hooks/queries/useTasks'
import { useUsers } from '@/hooks/queries/useUsers'
import type { Schedule } from '@/types/api'
import { UserRole } from '@/types/api'
import type { Group } from 'three'

// Lazy load del modelo 3D para no bloquear el render inicial
const CanvasModel = lazy(() => import('@/components/model/CanvasModel'))

export const Route = createFileRoute('/_authenticated/_admin/schedules')({
  component: SchedulesPage,
})

function SchedulesPage() {
  const navigate = useNavigate()
  const { data: schedules = [], isLoading: loadingSchedules } = useSchedules()
  const { data: tasks = [], isLoading: loadingTasks } = useTasks()
  const { data: users = [], isLoading: loadingUsers } = useUsers()
  const modelRef = useRef<Group | null>(null)

  const [showCreateSchedule, setShowCreateSchedule] = useState(false)
  const [showCreateTask, setShowCreateTask] = useState(false)
  const [selectedSchedule, setSelectedSchedule] = useState<Schedule | null>(null)

  // Callback optimizado que se ejecuta cuando el modelo está listo
  const handleModelReady = useCallback((modelGroup: Group) => {
    if (modelGroup && !modelRef.current) {
      modelRef.current = modelGroup
    }
  }, [])

  // Resetear el estado del modelo cuando cambia el cronograma seleccionado
  useEffect(() => {
    if (selectedSchedule) {
      modelRef.current = null
    }
  }, [selectedSchedule?.id])

  // Filter workers from users
  const workers = users.filter((u) => u.role === UserRole.WORKER)

  const tasksForSchedule = selectedSchedule
    ? tasks.filter((t) => t.schedule_id === selectedSchedule.id)
    : []

  if (loadingSchedules || loadingTasks || loadingUsers) {
    return <div className="text-center py-12">Cargando cronogramas...</div>
  }

  return (
    <div>
      <div className="flex flex-col gap-3 md:gap-0 md:flex-row md:items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Cronogramas</h1>
          <p className="text-slate-600">Gestiona los cronogramas de obra</p>
        </div>
        <Button
          onClick={() => setShowCreateSchedule(true)}
          className="bg-amber-600 hover:bg-amber-600"
        >
          <Plus className="w-4 h-4 mr-2" />
          Nuevo Cronograma
        </Button>
      </div>

      <div className="space-y-6">
        <ScheduleList
          schedules={schedules}
          tasks={tasks}
          onSelectSchedule={setSelectedSchedule}
          selectedSchedule={selectedSchedule}
        />

        {selectedSchedule && (
          <div className="bg-white rounded-lg border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-slate-900">
                  Tareas: {selectedSchedule.name}
                </h3>
                <p className="text-sm text-slate-600">
                  {tasksForSchedule.length} tarea(s) en este cronograma
                </p>
              </div>
              <Button
                onClick={() => setShowCreateTask(true)}
                className="bg-amber-600 hover:bg-amber-600"
              >
                <Plus className="w-4 h-4 mr-2" />
                Nueva Tarea
              </Button>
            </div>

            {tasksForSchedule.length === 0 ? (
              <p className="text-center py-8 text-slate-500">
                No hay tareas en este cronograma
              </p>
            ) : (
              <div className="space-y-2">
                {tasksForSchedule.map((task) => (
                  <div
                    key={task.id}
                    className="p-4 border border-slate-200 rounded-lg hover:border-amber-300 transition-colors cursor-pointer"
                    onClick={() => navigate({ to: '/tasks/$taskId', params: { taskId: task.id.toString() } })}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-medium text-slate-900">{task.title}</h4>
                        <p className="text-sm text-slate-600 mt-1">{task.description}</p>
                      </div>
                      <span className={`px-2 py-1 text-xs rounded-full ${task.status === 'PENDING' ? 'bg-slate-100 text-slate-700' :
                        task.status === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-700' :
                          'bg-green-100 text-green-700'
                        }`}>
                        {task.status === 'PENDING' ? 'Pendiente' :
                          task.status === 'IN_PROGRESS' ? 'En Progreso' :
                            'Completada'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <div className='py-10 min-h-[70dvh] flex flex-col relative'>
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Modelo 3D Demo</h3>
              <Suspense fallback={
                <div className="flex items-center justify-center h-[70dvh]">
                  <div className="flex flex-col items-center gap-3">
                    <p className="text-slate-600 text-lg">Cargando modelo 3D...</p>
                  </div>
                </div>
              }>
                <CanvasModel ref={modelRef} onModelReady={handleModelReady} />
              </Suspense>
            </div>
          </div>
        )}
      </div>

      {/* Dialogs */}
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
