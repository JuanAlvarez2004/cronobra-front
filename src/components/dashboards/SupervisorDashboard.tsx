import { CalendarDays, ListTodo, Users } from 'lucide-react'
import { Link, Outlet, useMatchRoute } from '@tanstack/react-router'
import { Tabs, TabsList, TabsTrigger } from '../ui/tabs'
import { useTabBubbleAnimation } from '@/hooks/useTabBubbleAnimation'

export function SupervisorDashboard() {
  const matchRoute = useMatchRoute()

  // Determinar qué tab está activa basándose en la ruta actual
  const getActiveTab = () => {
    if (matchRoute({ to: '/schedules', fuzzy: true })) return 'schedules'
    if (matchRoute({ to: '/tasks', fuzzy: true })) return 'tasks'
    if (matchRoute({ to: '/workers', fuzzy: true })) return 'workers'
    return 'schedules' // default
  }

  const activeTab = getActiveTab()
  const { bubbleRef, tabsListRef, getTabHandlers } = useTabBubbleAnimation({ 
    activeTab 
  })

  return (
    <div className="min-h-screen">
      <main className="container mx-auto px-4 py-2">
        <Tabs value={activeTab} className="space-y-6">
          <div ref={tabsListRef} className="relative">
            {/* Burbuja animada */}
            <div
              ref={bubbleRef}
              className="absolute top-[3px] h-[calc(100%-6px)] border-2 border-amber-600 rounded-xl pointer-events-none opacity-0 z-10"
              style={{ transition: 'none' }}
            />
            
            <TabsList className=" border border-slate-200 relative bg-white">
              <Link to="/schedules" {...getTabHandlers('schedules')}>
                <TabsTrigger
                  id="tab-schedules"
                  value="schedules"
                  className="gap-2 relative z-10"
                >
                  <CalendarDays className="w-4 h-4" />
                  Cronogramas
                </TabsTrigger>
              </Link>
              <Link to="/tasks" {...getTabHandlers('tasks')}>
                <TabsTrigger
                  id="tab-tasks"
                  value="tasks"
                  className="gap-2 relative z-10"
                >
                  <ListTodo className="w-4 h-4" />
                  Todas las Tareas
                </TabsTrigger>
              </Link>
              <Link to="/workers" {...getTabHandlers('workers')}>
                <TabsTrigger
                  id="tab-workers"
                  value="workers"
                  className="gap-2 relative z-10"
                >
                  <Users className="w-4 h-4" />
                  Trabajadores
                </TabsTrigger>
              </Link>
            </TabsList>
          </div>

          {/* El contenido se renderiza a través del Outlet */}
          <Outlet />
        </Tabs>
      </main>
    </div>
  )
}
