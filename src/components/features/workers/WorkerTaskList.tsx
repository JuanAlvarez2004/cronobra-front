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
    <div className="space-y-3">
      {tasks.map((task) => {
        const schedule = schedules.find((s) => s.id === task.schedule_id)
        const overdue = isOverdue(task.due_date, task.status)

        return (
          <Card key={task.id} className="p-4">
            <div className="space-y-3">
              <div className="space-y-2">
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

              <div className="flex flex-wrap gap-4 text-sm text-slate-600">
                {schedule && (
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>{schedule.name}</span>
                  </div>
                )}
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>Vence: {formatDate(task.due_date)}</span>
                </div>
              </div>

              {task.status === 'PENDING' && (
                <Button
                  onClick={() => onStartTask(task.id.toString())}
                  className="w-full bg-blue-500 hover:bg-blue-600"
                >
                  <PlayCircle className="w-4 h-4 mr-2" />
                  Iniciar Tarea
                </Button>
              )}

              {task.status === 'IN_PROGRESS' && (
                <Button
                  onClick={() => onCompleteTask(task)}
                  className="w-full bg-green-600 hover:bg-green-700"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Subir Evidencia y Completar
                </Button>
              )}
            </div>
          </Card>
        )
      })}
    </div>
  )
}
