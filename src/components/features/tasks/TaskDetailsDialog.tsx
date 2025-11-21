import {
  Calendar,
  History,
  Image,
  User,
} from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../../ui/dialog'
import { Badge } from '../../ui/badge'
import { Label } from '../../ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs'
import type {
  User as AppUser,
  Schedule,
  Task,
} from '@/types/api'
import { useTaskLogs } from '@/hooks/queries/useTasks'

interface TaskDetailsDialogProps {
  open: boolean
  onClose: () => void
  task: Task
  schedule?: Schedule
  worker?: AppUser
  currentUser: AppUser
  allWorkers: Array<AppUser>
}

export function TaskDetailsDialog({
  open,
  onClose,
  task,
  schedule,
  worker,
}: TaskDetailsDialogProps) {
  // Fetch task logs from backend
  const { data: traceLog = [], isLoading: loadingLogs } = useTaskLogs(task.id)

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

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('es-ES', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <DialogTitle>{task.title}</DialogTitle>
              <DialogDescription>
                Detalles y trazabilidad de la tarea
              </DialogDescription>
            </div>
            {getStatusBadge(task.status)}
          </div>
        </DialogHeader>

        <Tabs defaultValue="details" className="mt-4">
          <TabsList className="w-full border">
            <TabsTrigger value="details" className="flex-1">
              Detalles
            </TabsTrigger>
            <TabsTrigger value="evidence" className="flex-1">
              Evidencia
            </TabsTrigger>
            <TabsTrigger value="history" className="flex-1">
              Historial
            </TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="space-y-4 mt-4">
            <div className="space-y-3">
              <div>
                <Label className="text-slate-600">Descripción</Label>
                <p className="text-slate-900 mt-1">{task.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-slate-600">
                    Fecha de Vencimiento
                  </Label>
                  <div className="flex items-center gap-2 mt-1">
                    <Calendar className="w-4 h-4 text-slate-500" />
                    <span className="text-slate-900">
                      {formatDate(task.due_date)}
                    </span>
                  </div>
                </div>

                <div>
                  <Label className="text-slate-600">Asignado a</Label>
                  <div className="flex items-center gap-2 mt-1">
                    <User className="w-4 h-4 text-slate-500" />
                    <span className="text-slate-900">
                      {worker?.name || 'Sin asignar'}
                    </span>
                  </div>
                </div>
              </div>

              {schedule && (
                <div>
                  <Label className="text-slate-600">Cronograma</Label>
                  <p className="text-slate-900 mt-1">{schedule.name}</p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="evidence" className="space-y-4 mt-4">
            <div className="text-center py-12">
              <Image className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-600">
                La evidencia fotográfica se gestiona por separado
              </p>
              <p className="text-sm text-slate-500 mt-2">
                Consulta el módulo de evidencias para ver las fotos asociadas a esta tarea
              </p>
            </div>
          </TabsContent>

          <TabsContent value="history" className="space-y-3 mt-4">
            {loadingLogs ? (
              <div className="text-center py-12">
                <p className="text-slate-600">Cargando historial...</p>
              </div>
            ) : traceLog.length === 0 ? (
              <div className="text-center py-12">
                <History className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <p className="text-slate-600">
                  No hay registros en el historial
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {traceLog
                  .sort(
                    (a, b) =>
                      new Date(b.timestamp).getTime() -
                      new Date(a.timestamp).getTime(),
                  )
                  .map((entry) => (
                    <div
                      key={entry.id}
                      className="p-3 bg-slate-50 rounded-lg border border-slate-200"
                    >
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <span className="text-sm text-slate-900">
                          Usuario {entry.user_id}
                        </span>
                        <span className="text-xs text-slate-500">
                          {formatDateTime(entry.timestamp)}
                        </span>
                      </div>
                      <p className="text-sm text-slate-600">{entry.action}</p>
                    </div>
                  ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
