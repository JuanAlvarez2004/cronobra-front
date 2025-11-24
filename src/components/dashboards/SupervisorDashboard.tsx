import { CalendarDays, ListTodo, Users } from 'lucide-react'
import { Link, Outlet, useMatchRoute } from '@tanstack/react-router'
import { Tabs, TabsList, TabsTrigger } from '../ui/tabs'
import { useTabBubbleAnimation } from '@/hooks/useTabBubbleAnimation'
import useMediaQuery from '@/hooks/useMediaQuery'

export function SupervisorDashboard() {
  const matchRoute = useMatchRoute()
  const isMobile = useMediaQuery()

  // Determinar qué tab está activa basándose en la ruta actual
  const getActiveTab = () => {
    if (matchRoute({ to: '/schedules', fuzzy: true })) return 'schedules'
    if (matchRoute({ to: '/tasks', fuzzy: true })) return 'tasks'
    if (matchRoute({ to: '/workers', fuzzy: true })) return 'workers'
    return 'schedules' // default
  }

  const activeTab = getActiveTab()
  const { bubbleRef, tabsListRef, getTabHandlers } = useTabBubbleAnimation({ 
    activeTab,
    disabled: isMobile
  })

  return (
    <div className="min-h-screen">
      <main className="container mx-auto px-3 sm:px-4 lg:px-6 py-3 sm:py-4 lg:py-6">
        <Tabs value={activeTab} className="space-y-4 sm:space-y-6">
          <div ref={tabsListRef} className="relative">
            {/* Burbuja animada - solo en desktop */}
            {!isMobile && (
              <div
                ref={bubbleRef}
                className="absolute top-[3px] h-[calc(100%-6px)] border-2 border-amber-600 rounded-xl pointer-events-none opacity-0 z-10"
                style={{ transition: 'none' }}
              />
            )}
            
            <TabsList className="border border-slate-200 relative bg-white flex flex-col md:flex-row h-max gap-1 p-1">
              <Link to="/schedules" {...getTabHandlers('schedules')} className="w-full md:w-auto">
                <TabsTrigger
                  id="tab-schedules"
                  value="schedules"
                  className="gap-2 relative z-10 w-full justify-center md:justify-start text-sm sm:text-base"
                >
                  <CalendarDays className="w-4 h-4 shrink-0" />
                  <span className="truncate">Cronogramas</span>
                </TabsTrigger>
              </Link>
              <Link to="/tasks" {...getTabHandlers('tasks')} className="w-full md:w-auto">
                <TabsTrigger
                  id="tab-tasks"
                  value="tasks"
                  className="gap-2 relative z-10 w-full justify-center md:justify-start text-sm sm:text-base"
                >
                  <ListTodo className="w-4 h-4 shrink-0" />
                  <span className="truncate">Todas las Tareas</span>
                </TabsTrigger>
              </Link>
              <Link to="/workers" {...getTabHandlers('workers')} className="w-full md:w-auto">
                <TabsTrigger
                  id="tab-workers"
                  value="workers"
                  className="gap-2 relative z-10 w-full justify-center md:justify-start text-sm sm:text-base"
                >
                  <Users className="w-4 h-4 shrink-0" />
                  <span className="truncate">Trabajadores</span>
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
