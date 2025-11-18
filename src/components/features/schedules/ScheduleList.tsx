import { Calendar, Clock } from 'lucide-react'
import { Card } from '../../ui/card'
import { Badge } from '../../ui/badge'
import type { Schedule, Task } from '@routes/index'

interface ScheduleListProps {
  schedules: Array<Schedule>
  tasks: Array<Task>
  onSelectSchedule: (schedule: Schedule) => void
  selectedSchedule: Schedule | null
}

export function ScheduleList({
  schedules,
  tasks,
  onSelectSchedule,
  selectedSchedule,
}: ScheduleListProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    })
  }

  if (schedules.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-lg border border-slate-200">
        <Calendar className="w-12 h-12 text-slate-300 mx-auto mb-3" />
        <p className="text-slate-600">No hay cronogramas creados</p>
        <p className="text-sm text-slate-500">
          Crea tu primer cronograma para comenzar
        </p>
      </div>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {schedules.map((schedule) => {
        const scheduleTasks = tasks.filter((t) => t.scheduleId === schedule.id)
        const completedTasks = scheduleTasks.filter(
          (t) => t.status === 'APPROVED',
        ).length
        const progress =
          scheduleTasks.length > 0
            ? (completedTasks / scheduleTasks.length) * 100
            : 0

        const isSelected = selectedSchedule?.id === schedule.id

        return (
          <Card
            key={schedule.id}
            className={`p-4 cursor-pointer transition-all hover:shadow-md ${
              isSelected ? 'ring-2 ring-amber-500 shadow-md' : ''
            }`}
            onClick={() => onSelectSchedule(schedule)}
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <h3 className="text-slate-900">{schedule.name}</h3>
                <Badge variant="outline" className="text-xs">
                  {scheduleTasks.length} tareas
                </Badge>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <Calendar className="w-4 h-4" />
                  <span>
                    {formatDate(schedule.startDate)} -{' '}
                    {formatDate(schedule.endDate)}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <Clock className="w-4 h-4" />
                  <span>Creado el {formatDate(schedule.createdAt)}</span>
                </div>
              </div>

              {scheduleTasks.length > 0 && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Progreso</span>
                    <span className="text-slate-900">
                      {Math.round(progress)}%
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2">
                    <div
                      className="bg-amber-500 h-2 rounded-full transition-all"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          </Card>
        )
      })}
    </div>
  )
}
