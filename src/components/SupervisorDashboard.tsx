import { useState } from 'react';
import { Button } from './ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { LogOut, Plus, CalendarDays, ListTodo, Users } from 'lucide-react';
import { CreateScheduleDialog } from './CreateScheduleDialog';
import { CreateTaskDialog } from './CreateTaskDialog';
import { ScheduleList } from './ScheduleList';
import { TaskList } from './TaskList';
import { TaskDetailsDialog } from './TaskDetailsDialog';
import type { User, AppData, Task, Schedule } from '@routes/index';

interface SupervisorDashboardProps {
  currentUser: User;
  appData: AppData;
  setAppData: (data: AppData) => void;
  onLogout: () => void;
}

export function SupervisorDashboard({
  currentUser,
  appData,
  setAppData,
  onLogout,
}: SupervisorDashboardProps) {
  const [showCreateSchedule, setShowCreateSchedule] = useState(false);
  const [showCreateTask, setShowCreateTask] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState<Schedule | null>(null);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [showTaskDetails, setShowTaskDetails] = useState(false);

  const handleCreateSchedule = (schedule: Schedule) => {
    setAppData({
      ...appData,
      schedules: [...appData.schedules, schedule],
    });
    setShowCreateSchedule(false);
  };

  const handleCreateTask = (task: Task) => {
    const now = new Date().toISOString();
    setAppData({
      ...appData,
      tasks: [...appData.tasks, task],
      traceLog: [
        ...appData.traceLog,
        {
          id: `trace-${Date.now()}`,
          taskId: task.id,
          action: 'CREATED',
          user: currentUser.name,
          timestamp: now,
          details: `Tarea creada y asignada a ${appData.workers.find((w) => w.id === task.assignedTo)?.name}`,
        },
      ],
    });
    setShowCreateTask(false);
  };

  const handleUpdateTask = (taskId: string, updates: Partial<Task>, traceDetails: string) => {
    const now = new Date().toISOString();
    setAppData({
      ...appData,
      tasks: appData.tasks.map((t) =>
        t.id === taskId ? { ...t, ...updates, updatedAt: now } : t
      ),
      traceLog: [
        ...appData.traceLog,
        {
          id: `trace-${Date.now()}`,
          taskId,
          action: 'UPDATED',
          user: currentUser.name,
          timestamp: now,
          details: traceDetails,
        },
      ],
    });
  };

  const handleApproveTask = (taskId: string) => {
    handleUpdateTask(taskId, { status: 'APPROVED' }, 'Tarea aprobada por el supervisor');
  };

  const handleRejectTask = (taskId: string) => {
    handleUpdateTask(taskId, { status: 'REJECTED' }, 'Tarea rechazada por el supervisor');
  };

  const handleViewTaskDetails = (task: Task) => {
    setSelectedTask(task);
    setShowTaskDetails(true);
  };

  const tasksForSchedule = selectedSchedule
    ? appData.tasks.filter((t) => t.scheduleId === selectedSchedule.id)
    : [];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-amber-500 p-2 rounded-lg">
                <CalendarDays className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-slate-900">Panel de Supervisor</h1>
                <p className="text-sm text-slate-600">{currentUser.name}</p>
              </div>
            </div>
            <Button variant="outline" onClick={onLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Salir
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue="schedules" className="space-y-6">
          <TabsList className="bg-white border border-slate-200">
            <TabsTrigger value="schedules" className="gap-2">
              <CalendarDays className="w-4 h-4" />
              Cronogramas
            </TabsTrigger>
            <TabsTrigger value="tasks" className="gap-2">
              <ListTodo className="w-4 h-4" />
              Todas las Tareas
            </TabsTrigger>
            <TabsTrigger value="workers" className="gap-2">
              <Users className="w-4 h-4" />
              Trabajadores
            </TabsTrigger>
          </TabsList>

          <TabsContent value="schedules" className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-slate-900">Cronogramas</h2>
                <p className="text-slate-600">Gestiona los cronogramas de obra</p>
              </div>
              <Button onClick={() => setShowCreateSchedule(true)} className="bg-amber-500 hover:bg-amber-600">
                <Plus className="w-4 h-4 mr-2" />
                Nuevo Cronograma
              </Button>
            </div>

            <ScheduleList
              schedules={appData.schedules}
              tasks={appData.tasks}
              onSelectSchedule={setSelectedSchedule}
              selectedSchedule={selectedSchedule}
            />

            {selectedSchedule && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-slate-900">Tareas de: {selectedSchedule.name}</h3>
                    <p className="text-sm text-slate-600">
                      {tasksForSchedule.length} tarea(s)
                    </p>
                  </div>
                  <Button
                    onClick={() => setShowCreateTask(true)}
                    className="bg-amber-500 hover:bg-amber-600"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Nueva Tarea
                  </Button>
                </div>

                <TaskList
                  tasks={tasksForSchedule}
                  workers={appData.workers}
                  onApprove={handleApproveTask}
                  onReject={handleRejectTask}
                  onViewDetails={handleViewTaskDetails}
                  viewMode="supervisor"
                />
              </div>
            )}
          </TabsContent>

          <TabsContent value="tasks" className="space-y-4">
            <div>
              <h2 className="text-slate-900">Todas las Tareas</h2>
              <p className="text-slate-600">Vista general de todas las tareas en la obra</p>
            </div>

            <TaskList
              tasks={appData.tasks}
              workers={appData.workers}
              schedules={appData.schedules}
              onApprove={handleApproveTask}
              onReject={handleRejectTask}
              onViewDetails={handleViewTaskDetails}
              viewMode="supervisor"
            />
          </TabsContent>

          <TabsContent value="workers" className="space-y-4">
            <div>
              <h2 className="text-slate-900">Trabajadores</h2>
              <p className="text-slate-600">Personal disponible en la obra</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {appData.workers.map((worker) => {
                const workerTasks = appData.tasks.filter((t) => t.assignedTo === worker.id);
                const pendingTasks = workerTasks.filter((t) => t.status === 'PENDING').length;
                const inProgressTasks = workerTasks.filter((t) => t.status === 'IN_PROGRESS').length;
                const completedTasks = workerTasks.filter((t) => t.status === 'COMPLETED').length;

                return (
                  <div key={worker.id} className="bg-white rounded-lg border border-slate-200 p-4">
                    <div className="flex items-start gap-3">
                      <div className="bg-amber-100 p-2 rounded-lg">
                        <Users className="w-5 h-5 text-amber-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-slate-900">{worker.name}</h3>
                        <p className="text-sm text-slate-500">{worker.email}</p>
                        <div className="mt-3 space-y-1">
                          <div className="flex justify-between text-sm">
                            <span className="text-slate-600">Pendientes:</span>
                            <span className="text-slate-900">{pendingTasks}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-slate-600">En progreso:</span>
                            <span className="text-blue-600">{inProgressTasks}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-slate-600">Completadas:</span>
                            <span className="text-green-600">{completedTasks}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </TabsContent>
        </Tabs>
      </main>

      {/* Dialogs */}
      <CreateScheduleDialog
        open={showCreateSchedule}
        onClose={() => setShowCreateSchedule(false)}
        onCreate={handleCreateSchedule}
        currentUser={currentUser}
      />

      {selectedSchedule && (
        <CreateTaskDialog
          open={showCreateTask}
          onClose={() => setShowCreateTask(false)}
          onCreate={handleCreateTask}
          schedule={selectedSchedule}
          workers={appData.workers}
        />
      )}

      {selectedTask && (
        <TaskDetailsDialog
          open={showTaskDetails}
          onClose={() => setShowTaskDetails(false)}
          task={selectedTask}
          schedule={appData.schedules.find((s) => s.id === selectedTask.scheduleId)}
          worker={appData.workers.find((w) => w.id === selectedTask.assignedTo)}
          traceLog={appData.traceLog.filter((t) => t.taskId === selectedTask.id)}
          onUpdateTask={handleUpdateTask}
          currentUser={currentUser}
          allWorkers={appData.workers}
        />
      )}
    </div>
  );
}
