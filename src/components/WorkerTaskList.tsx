import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Calendar, PlayCircle, Upload, CheckCircle, XCircle, Image } from 'lucide-react';
import type { Task, Schedule } from '@routes/index';

interface WorkerTaskListProps {
  tasks: Task[];
  schedules: Schedule[];
  onStartTask: (taskId: string) => void;
  onCompleteTask: (task: Task) => void;
}

export function WorkerTaskList({
  tasks,
  schedules,
  onStartTask,
  onCompleteTask,
}: WorkerTaskListProps) {
  const getStatusBadge = (status: Task['status']) => {
    const variants: Record<Task['status'], { label: string; className: string }> = {
      PENDING: { label: 'Pendiente', className: 'bg-slate-100 text-slate-700' },
      IN_PROGRESS: { label: 'En Progreso', className: 'bg-blue-100 text-blue-700' },
      COMPLETED: { label: 'Esperando Aprobación', className: 'bg-green-100 text-green-700' },
      APPROVED: { label: 'Aprobada', className: 'bg-emerald-100 text-emerald-700' },
      REJECTED: { label: 'Rechazada', className: 'bg-red-100 text-red-700' },
    };

    const variant = variants[status];
    return (
      <Badge className={variant.className} variant="secondary">
        {variant.label}
      </Badge>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const isOverdue = (dueDate: string, status: Task['status']) => {
    if (status === 'APPROVED' || status === 'REJECTED') return false;
    return new Date(dueDate) < new Date();
  };

  return (
    <div className="space-y-3">
      {tasks.map((task) => {
        const schedule = schedules.find((s) => s.id === task.scheduleId);
        const overdue = isOverdue(task.dueDate, task.status);

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
                  <span>Vence: {formatDate(task.dueDate)}</span>
                </div>
              </div>

              {task.evidence && (
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <div className="flex items-center gap-2 text-sm text-slate-600 mb-2">
                    <Image className="w-4 h-4" />
                    <span>Evidencia subida</span>
                  </div>
                  <img
                    src={task.evidence.photoUrl}
                    alt="Evidencia"
                    className="w-full h-48 object-cover rounded"
                  />
                  <p className="text-xs text-slate-500 mt-2">
                    Subida el {formatDate(task.evidence.uploadedAt)}
                  </p>
                </div>
              )}

              {task.status === 'PENDING' && (
                <Button
                  onClick={() => onStartTask(task.id)}
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

              {task.status === 'APPROVED' && (
                <div className="flex items-center gap-2 p-3 bg-emerald-50 rounded-lg border border-emerald-200">
                  <CheckCircle className="w-5 h-5 text-emerald-600" />
                  <span className="text-sm text-emerald-700">
                    Tarea aprobada por el supervisor
                  </span>
                </div>
              )}

              {task.status === 'REJECTED' && (
                <div className="flex items-center gap-2 p-3 bg-red-50 rounded-lg border border-red-200">
                  <XCircle className="w-5 h-5 text-red-600" />
                  <span className="text-sm text-red-700">
                    Tarea rechazada - Contacta al supervisor
                  </span>
                </div>
              )}
            </div>
          </Card>
        );
      })}
    </div>
  );
}
