import {
  Calendar,
  PlayCircle,
  Upload,
} from 'lucide-react'
import { Card } from '../../ui/card'
import { Badge } from '../../ui/badge'
import { Button } from '../../ui/button'
import type { Schedule, Task } from '@/types/api'

interface WorkerTaskListProps {
  tasks: Array<Task>
  schedules: Array<Schedule>
  onStartTask: (taskId: string) => void
  onCompleteTask: (task: Task) => void
}

export function WorkerTaskList({
  tasks,
  schedules,
  onStartTask,
  onCompleteTask,
}: WorkerTaskListProps) {
  const getStatusBadge = (status: Task['status']) => {
    const variants: Record<
      Task['status'],
      { label: string; className: string }
    > = {
      PENDING: { label: 'Pendiente', className: 'bg-slate-100 text-slate-700' },
      IN_PROGRESS: {
        label: 'En Progreso',
        className: 'bg-blue-100 text-blue-700',
      },
      COMPLETED: {
        label: 'Completada',
        className: 'bg-green-100 text-green-700',
      },
    }

    const variant = variants[status]
    return (
      <Badge className={variant.className} variant="secondary">
        {variant.label}
      </Badge>
    )
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    })
  }

  const isOverdue = (dueDate: string, status: Task['status']) => {
    if (status === 'COMPLETED') return false
    return new Date(dueDate) < new Date()
  }

  return (
    <div className="space-y-3 sm:space-y-4">
      {tasks.map((task) => {
        const schedule = schedules.find((s) => s.id === task.schedule_id)
        const overdue = isOverdue(task.due_date, task.status)

        return (
          <Card key={task.id} className="p-3 sm:p-4 mx-1 sm:mx-0">
            <div className="space-y-3">
              <div className="space-y-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-sm sm:text-base font-medium text-slate-900 break-words">{task.title}</h3>
                  {getStatusBadge(task.status)}
                  {overdue && (
                    <Badge variant="destructive" className="text-xs">
                      Vencida
                    </Badge>
                  )}
                </div>
                <p className="text-xs sm:text-sm text-slate-600 break-words">{task.description}</p>
              </div>

              <div className="flex flex-col sm:flex-row sm:flex-wrap gap-2 sm:gap-4 text-xs sm:text-sm text-slate-600">
                {schedule && (
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
                    <span className="truncate">{schedule.name}</span>
                  </div>
                )}
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
                  <span className="whitespace-nowrap">Vence: {formatDate(task.due_date)}</span>
                </div>
              </div>

              {task.status === 'PENDING' && (
                <Button
                  onClick={() => onStartTask(task.id.toString())}
                  className="w-full bg-blue-500 hover:bg-blue-600 text-sm sm:text-base py-2 sm:py-2.5"
                >
                  <PlayCircle className="w-4 h-4 mr-2 shrink-0" />
                  <span className="truncate">Iniciar Tarea</span>
                </Button>
              )}

              {task.status === 'IN_PROGRESS' && (
                <Button
                  onClick={() => onCompleteTask(task)}
                  className="w-full bg-green-600 hover:bg-green-700 text-sm sm:text-base py-2 sm:py-2.5"
                >
                  <Upload className="w-4 h-4 mr-2 shrink-0" />
                  <span className="truncate">Subir Evidencia y Completar</span>
                </Button>
              )}
            </div>
          </Card>
        )
      })}
    </div>
  )
}
