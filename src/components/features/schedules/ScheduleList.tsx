import { Calendar } from 'lucide-react'
import { Card } from '../../ui/card'
import { Badge } from '../../ui/badge'
import type { Schedule, Task } from '@/types/api'

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
      <div className="text-center py-8 sm:py-12 bg-white rounded-lg border border-slate-200 mx-1 sm:mx-0">
        <Calendar className="w-10 h-10 sm:w-12 sm:h-12 text-slate-300 mx-auto mb-2 sm:mb-3" />
        <p className="text-sm sm:text-base text-slate-600 px-4">No hay cronogramas creados</p>
        <p className="text-xs sm:text-sm text-slate-500 px-4 mt-1">
          Crea tu primer cronograma para comenzar
        </p>
      </div>
    )
  }

  return (
    <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 mx-1 sm:mx-0">
      {schedules.map((schedule) => {
        const scheduleTasks = tasks.filter((t) => t.schedule_id === schedule.id)
        const completedTasks = scheduleTasks.filter(
          (t) => t.status === 'COMPLETED',
        ).length
        const progress =
          scheduleTasks.length > 0
            ? (completedTasks / scheduleTasks.length) * 100
            : 0

        const isSelected = selectedSchedule?.id === schedule.id

        return (
          <Card
            key={schedule.id}
            className={`p-3 sm:p-4 cursor-pointer transition-all hover:shadow-md bg-white ${
              isSelected ? 'ring-2 ring-amber-500 shadow-md' : ''
            }`}
            onClick={() => onSelectSchedule(schedule)}
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-2">
                <h3 className="text-sm sm:text-base font-medium text-slate-900 break-words flex-1">{schedule.name}</h3>
                <Badge variant="outline" className="text-xs shrink-0">
                  {scheduleTasks.length}
                </Badge>
              </div>

              <div className="space-y-2">
                <div className="flex items-start gap-2 text-xs sm:text-sm text-slate-600">
                  <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0 mt-0.5" />
                  <span className="break-words">
                    {formatDate(schedule.start_date)} -{' '}
                    {formatDate(schedule.end_date)}
                  </span>
                </div>
              </div>

              {scheduleTasks.length > 0 && (
                <div className="space-y-2">
                  <div className="flex justify-between text-xs sm:text-sm">
                    <span className="text-slate-600">Progreso</span>
                    <span className="text-slate-900 font-medium">
                      {Math.round(progress)}%
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2">
                    <div
                      className="bg-amber-600 h-2 rounded-full transition-all duration-300"
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
