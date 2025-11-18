import { Calendar, CheckCircle, Eye, Image, User, XCircle } from 'lucide-react'
import { Card } from '../../ui/card'
import { Badge } from '../../ui/badge'
import { Button } from '../../ui/button'
import type { Schedule, Task, Worker } from '@routes/index'

interface TaskListProps {
  tasks: Array<Task>
  workers: Array<Worker>
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
      APPROVED: {
        label: 'Aprobada',
        className: 'bg-emerald-100 text-emerald-700',
      },
      REJECTED: { label: 'Rechazada', className: 'bg-red-100 text-red-700' },
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
    if (status === 'APPROVED' || status === 'REJECTED') return false
    return new Date(dueDate) < new Date()
  }

  if (tasks.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-lg border border-slate-200">
        <p className="text-slate-600">No hay tareas para mostrar</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {tasks.map((task) => {
        const worker = workers.find((w) => w.id === task.assignedTo)
        const schedule = schedules?.find((s) => s.id === task.scheduleId)
        const overdue = isOverdue(task.dueDate, task.status)

        return (
          <Card key={task.id} className="p-4">
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-slate-900">{task.title}</h3>
                    {getStatusBadge(task.status)}
                    {overdue && (
                      <Badge variant="destructive" className="text-xs">
                        Vencida
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-slate-600">{task.description}</p>
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onViewDetails(task)}
                  className="shrink-0"
                >
                  <Eye className="w-4 h-4" />
                </Button>
              </div>

              <div className="flex flex-wrap gap-4 text-sm text-slate-600">
                {schedule && (
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>{schedule.name}</span>
                  </div>
                )}
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>Vence: {formatDate(task.dueDate)}</span>
                </div>
                <div className="flex items-center gap-1">
                  <User className="w-4 h-4" />
                  <span>{worker?.name || 'Sin asignar'}</span>
                </div>
                {task.evidence && (
                  <div className="flex items-center gap-1 text-green-600">
                    <Image className="w-4 h-4" />
                    <span>Con evidencia</span>
                  </div>
                )}
              </div>

              {task.status === 'COMPLETED' && (
                <div className="flex gap-2 pt-2 border-t border-slate-200">
                  <Button
                    size="sm"
                    onClick={() => onApprove(task.id)}
                    className="flex-1 bg-green-600 hover:bg-green-700"
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Aprobar
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => onReject(task.id)}
                    className="flex-1"
                  >
                    <XCircle className="w-4 h-4 mr-2" />
                    Rechazar
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
