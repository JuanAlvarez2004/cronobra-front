import { Calendar, CheckCircle, Eye, User as UserIcon, XCircle } from 'lucide-react'
import { Card } from '../../ui/card'
import { Badge } from '../../ui/badge'
import { Button } from '../../ui/button'
import type { Schedule, Task, User } from '@/types/api'
import { TaskStatus } from '@/types/api'

interface TaskListProps {
  tasks: Array<Task>
  workers: Array<User>
  schedules?: Array<Schedule>
  onApprove: (taskId: string) => void
  onReject: (taskId: string) => void
  onViewDetails: (task: Task) => void
  viewMode: 'supervisor'
}

export function TaskList({
  tasks,
  workers,
  schedules,
  onApprove,
  onReject,
  onViewDetails,
}: TaskListProps) {
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

  if (tasks.length === 0) {
    return (
      <div className="text-center py-8 sm:py-12 bg-white rounded-lg border border-slate-200 mx-1 sm:mx-0">
        <p className="text-sm sm:text-base text-slate-600">No hay tareas para mostrar</p>
      </div>
    )
  }

  return (
    <div className="space-y-3 sm:space-y-4">
      {tasks.map((task) => {
        const worker = workers.find((w) => w.id === task.assigned_to)
        const schedule = schedules?.find((s) => s.id === task.schedule_id)
        const overdue = isOverdue(task.due_date, task.status)

        return (
          <Card key={task.id} className="p-3 sm:p-4 mx-1 sm:mx-0">
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-2 sm:gap-4">
                <div className="flex-1 space-y-1 min-w-0">
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

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onViewDetails(task)}
                  className="shrink-0 h-8 w-8 sm:h-9 sm:w-9 p-0"
                  aria-label="Ver detalles"
                >
                  <Eye className="w-4 h-4" />
                </Button>
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
                <div className="flex items-center gap-1.5">
                  <UserIcon className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0" />
                  <span className="truncate">{worker?.name || 'Sin asignar'}</span>
                </div>
              </div>

              {task.status === TaskStatus.COMPLETED && (
                <div className="flex flex-col sm:flex-row gap-2 pt-2 border-t border-slate-200">
                  <Button
                    size="sm"
                    onClick={() => onApprove(task.id.toString())}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-sm py-2"
                  >
                    <CheckCircle className="w-4 h-4 mr-2 shrink-0" />
                    <span>Aprobar</span>
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => onReject(task.id.toString())}
                    className="flex-1 bg-red-600 hover:bg-red-700 text-sm py-2"
                  >
                    <XCircle className="w-4 h-4 mr-2 shrink-0" />
                    <span>Rechazar</span>
                  </Button>
                </div>
              )}
            </div>
          </Card>
        )
      })}
    </div>
  )
}
