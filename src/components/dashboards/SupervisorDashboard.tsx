import { CalendarDays, ListTodo, Users } from 'lucide-react'
import { Link, Outlet, useMatchRoute } from '@tanstack/react-router'
import { Tabs, TabsList, TabsTrigger } from '../ui/tabs'

export function SupervisorDashboard() {
  const matchRoute = useMatchRoute()

  // Determinar qué tab está activa basándose en la ruta actual
  const getActiveTab = () => {
    if (matchRoute({ to: '/schedules', fuzzy: true })) return 'schedules'
    if (matchRoute({ to: '/tasks', fuzzy: true })) return 'tasks'
    if (matchRoute({ to: '/workers', fuzzy: true })) return 'workers'
    return 'schedules' // default
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <main className="container mx-auto px-4 py-8">
        <Tabs value={getActiveTab()} className="space-y-6">
          <TabsList className="bg-white border border-slate-200">
            <Link to="/schedules">
              <TabsTrigger value="schedules" className="gap-2">
                <CalendarDays className="w-4 h-4" />
                Cronogramas
              </TabsTrigger>
            </Link>
            <Link to="/tasks">
              <TabsTrigger value="tasks" className="gap-2">
                <ListTodo className="w-4 h-4" />
                Todas las Tareas
              </TabsTrigger>
            </Link>
            <Link to="/workers">
              <TabsTrigger value="workers" className="gap-2">
                <Users className="w-4 h-4" />
                Trabajadores
              </TabsTrigger>
            </Link>
          </TabsList>

          {/* El contenido se renderiza a través del Outlet */}
          <Outlet />
        </Tabs>
      </main>
    </div>
  )
}
