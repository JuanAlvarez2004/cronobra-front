import { useState } from 'react'
import {
  Calendar,
  CheckCircle,
  Edit,
  History,
  Image,
  Save,
  User,
  X,
  XCircle,
} from 'lucide-react'
import { Button } from '../../ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../../ui/dialog'
import { Badge } from '../../ui/badge'
import { Input } from '../../ui/input'
import { Label } from '../../ui/label'
import { Textarea } from '../../ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs'
import type {
  User as AppUser,
  Schedule,
  Task,
  TraceEntry,
  Worker,
} from '@routes/index'

interface TaskDetailsDialogProps {
  open: boolean
  onClose: () => void
  task: Task
  schedule?: Schedule
  worker?: Worker
  traceLog: Array<TraceEntry>
  onUpdateTask: (
    taskId: string,
    updates: Partial<Task>,
    traceDetails: string,
  ) => void
  currentUser: AppUser
  allWorkers: Array<Worker>
}

export function TaskDetailsDialog({
  open,
  onClose,
  task,
  schedule,
  worker,
  traceLog,
  onUpdateTask,
  currentUser,
  allWorkers,
}: TaskDetailsDialogProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editedTitle, setEditedTitle] = useState(task.title)
  const [editedDescription, setEditedDescription] = useState(task.description)
  const [editedDueDate, setEditedDueDate] = useState(task.dueDate)
  const [editedAssignedTo, setEditedAssignedTo] = useState(task.assignedTo)

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
      APPROVED: {
        label: 'Aprobada',
        className: 'bg-emerald-100 text-emerald-700',
      },
      REJECTED: { label: 'Rechazada', className: 'bg-red-100 text-red-700' },
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

  const handleSaveEdit = () => {
    const changes: Array<string> = []

    if (editedTitle !== task.title) changes.push(`Título: "${editedTitle}"`)
    if (editedDescription !== task.description)
      changes.push('Descripción actualizada')
    if (editedDueDate !== task.dueDate)
      changes.push(`Fecha de vencimiento: ${formatDate(editedDueDate)}`)
    if (editedAssignedTo !== task.assignedTo) {
      const newWorker = allWorkers.find((w) => w.id === editedAssignedTo)
      changes.push(`Reasignado a ${newWorker?.name}`)
    }

    onUpdateTask(
      task.id,
      {
        title: editedTitle,
        description: editedDescription,
        dueDate: editedDueDate,
        assignedTo: editedAssignedTo,
      },
      `Tarea modificada: ${changes.join(', ')}`,
    )

    setIsEditing(false)
  }

  const handleCancelEdit = () => {
    setEditedTitle(task.title)
    setEditedDescription(task.description)
    setEditedDueDate(task.dueDate)
    setEditedAssignedTo(task.assignedTo)
    setIsEditing(false)
  }

  const handleApprove = () => {
    onUpdateTask(
      task.id,
      { status: 'APPROVED' },
      'Tarea aprobada por el supervisor',
    )
  }

  const handleReject = () => {
    onUpdateTask(
      task.id,
      { status: 'REJECTED' },
      'Tarea rechazada por el supervisor',
    )
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
          <TabsList className="w-full">
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
            {!isEditing ? (
              <>
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
                          {formatDate(task.dueDate)}
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

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-slate-600">Creada</Label>
                      <p className="text-slate-900 text-sm mt-1">
                        {formatDateTime(task.createdAt)}
                      </p>
                    </div>

                    <div>
                      <Label className="text-slate-600">
                        Última Actualización
                      </Label>
                      <p className="text-slate-900 text-sm mt-1">
                        {formatDateTime(task.updatedAt)}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 pt-4 border-t border-slate-200">
                  <Button
                    onClick={() => setIsEditing(true)}
                    variant="outline"
                    className="flex-1"
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Editar Tarea
                  </Button>

                  {task.status === 'COMPLETED' && (
                    <>
                      <Button
                        onClick={handleApprove}
                        className="flex-1 bg-green-600 hover:bg-green-700"
                      >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Aprobar
                      </Button>
                      <Button
                        onClick={handleReject}
                        variant="destructive"
                        className="flex-1"
                      >
                        <XCircle className="w-4 h-4 mr-2" />
                        Rechazar
                      </Button>
                    </>
                  )}
                </div>
              </>
            ) : (
              <>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-title">Título</Label>
                    <Input
                      id="edit-title"
                      value={editedTitle}
                      onChange={(e) => setEditedTitle(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="edit-description">Descripción</Label>
                    <Textarea
                      id="edit-description"
                      value={editedDescription}
                      onChange={(e) => setEditedDescription(e.target.value)}
                      rows={3}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="edit-due-date">Fecha de Vencimiento</Label>
                    <Input
                      id="edit-due-date"
                      type="date"
                      value={editedDueDate}
                      onChange={(e) => setEditedDueDate(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="edit-worker">Asignar a</Label>
                    <Select
                      value={editedAssignedTo}
                      onValueChange={setEditedAssignedTo}
                    >
                      <SelectTrigger id="edit-worker">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {allWorkers.map((w) => (
                          <SelectItem key={w.id} value={w.id}>
                            {w.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex gap-2 pt-4 border-t border-slate-200">
                  <Button
                    onClick={handleCancelEdit}
                    variant="outline"
                    className="flex-1"
                  >
                    <X className="w-4 h-4 mr-2" />
                    Cancelar
                  </Button>
                  <Button
                    onClick={handleSaveEdit}
                    className="flex-1 bg-amber-500 hover:bg-amber-600"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Guardar Cambios
                  </Button>
                </div>
              </>
            )}
          </TabsContent>

          <TabsContent value="evidence" className="space-y-4 mt-4">
            {task.evidence ? (
              <div className="space-y-3">
                <img
                  src={task.evidence.photoUrl}
                  alt="Evidencia de la tarea"
                  className="w-full rounded-lg border border-slate-200"
                />
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <Image className="w-4 h-4" />
                  <span>
                    Subida el {formatDateTime(task.evidence.uploadedAt)}
                  </span>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <p className="text-sm text-slate-600">
                    📍 En una aplicación real, aquí se mostrarían los metadatos
                    EXIF (ubicación GPS, fecha/hora de captura, dispositivo,
                    etc.)
                  </p>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <Image className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <p className="text-slate-600">
                  No se ha subido evidencia fotográfica
                </p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="history" className="space-y-3 mt-4">
            {traceLog.length === 0 ? (
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
                          {entry.user}
                        </span>
                        <span className="text-xs text-slate-500">
                          {formatDateTime(entry.timestamp)}
                        </span>
                      </div>
                      <p className="text-sm text-slate-600">{entry.details}</p>
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
