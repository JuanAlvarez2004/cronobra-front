import { createFileRoute } from '@tanstack/react-router'
import ScheduleList from '@/components/ScheduleList'

export const Route = createFileRoute('/_authenticated/_admin/schedules')({
  component: SchedulesPage,
})

function SchedulesPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Cronogramas</h1>
      <ScheduleList />
    </div>
  )
}
