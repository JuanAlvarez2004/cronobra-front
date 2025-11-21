import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { ArrowLeft, Calendar, User, History, Image } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { useTask, useTaskLogs } from '@/hooks/queries/useTasks'
import { useTaskEvidence } from '@/hooks/queries/useEvidence'
import { useUsers } from '@/hooks/queries/useUsers'
import { useSchedule } from '@/hooks/queries/useSchedules'
import type { Task, TaskLog, Evidence } from '@/types/api'
import { useState } from 'react'

export const Route = createFileRoute('/_authenticated/_admin/tasks/$taskId')({
  component: TaskDetailsPage,
})

function TaskDetailsPage() {
  const { taskId } = Route.useParams()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<'details' | 'evidence' | 'history'>(
    'details',
  )

  const taskIdNum = parseInt(taskId, 10)
  const { data: task, isLoading: loadingTask } = useTask(taskIdNum)
  const { data: evidence = [], isLoading: loadingEvidence } =
    useTaskEvidence(taskIdNum)
  const { data: logs = [], isLoading: loadingLogs } = useTaskLogs(taskIdNum)
  const { data: users = [] } = useUsers()
  const { data: schedule } = useSchedule(task?.schedule_id ?? 0)

  const worker = users.find((u) => u.id === task?.assigned_to)

  if (loadingTask) {
    return (
      <div className="p-8">
        <div className="text-center">
          <p className="text-slate-600">Cargando detalles de la tarea...</p>
        </div>
      </div>
    )
  }

  if (!task) {
    return (
      <div className="p-8">
        <div className="text-center">
          <p className="text-slate-600">Tarea no encontrada</p>
          <Button onClick={() => navigate({ to: '/tasks' })} className="mt-4">
            Volver a Tareas
          </Button>
        </div>
      </div>
    )
  }

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

  const getUserName = (userId: number) => {
    const user = users.find((u) => u.id === userId)
    return user?.name || 'Usuario desconocido'
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-6">
        <Link
          to="/tasks"
          className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver a Tareas
        </Link>
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">{task.title}</h1>
            <p className="text-slate-600 mt-1">
              Detalles y trazabilidad de la tarea
            </p>
          </div>
          {getStatusBadge(task.status)}
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex gap-2 border-b border-slate-200 mb-6">
        <button
          onClick={() => setActiveTab('details')}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'details'
              ? 'border-blue-500 text-blue-600'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          Detalles
        </button>
        <button
          onClick={() => setActiveTab('evidence')}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'evidence'
              ? 'border-blue-500 text-blue-600'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          Evidencia ({evidence.length})
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'history'
              ? 'border-blue-500 text-blue-600'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          Historial
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'details' && (
        <Card>
          <CardHeader>
            <CardTitle>Información de la Tarea</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-slate-600">Descripción</Label>
              <p className="text-slate-900 mt-1">{task.description}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-slate-600">Fecha de Vencimiento</Label>
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
                <p className="text-sm text-slate-500 mt-1">
                  {schedule.description}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {activeTab === 'evidence' && (
        <Card>
          <CardHeader>
            <CardTitle>Evidencia Fotográfica</CardTitle>
          </CardHeader>
          <CardContent>
            {loadingEvidence ? (
              <div className="text-center py-12">
                <p className="text-slate-600">Cargando evidencias...</p>
              </div>
            ) : evidence.length === 0 ? (
              <div className="text-center py-12">
                <Image className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <p className="text-slate-600">
                  No hay evidencias fotográficas para esta tarea
                </p>
                <p className="text-sm text-slate-500 mt-2">
                  Las evidencias se suben desde el dashboard del trabajador
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {evidence.map((item) => (
                  <EvidenceCard
                    key={item.id}
                    evidence={item}
                    userName={getUserName(item.uploaded_by)}
                  />
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {activeTab === 'history' && (
        <Card>
          <CardHeader>
            <CardTitle>Historial de Cambios</CardTitle>
          </CardHeader>
          <CardContent>
            {loadingLogs ? (
              <div className="text-center py-12">
                <p className="text-slate-600">Cargando historial...</p>
              </div>
            ) : logs.length === 0 ? (
              <div className="text-center py-12">
                <History className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <p className="text-slate-600">
                  No hay registros en el historial
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {logs
                  .sort(
                    (a, b) =>
                      new Date(b.timestamp).getTime() -
                      new Date(a.timestamp).getTime(),
                  )
                  .map((entry) => (
                    <LogEntry
                      key={entry.id}
                      log={entry}
                      userName={getUserName(entry.user_id)}
                      formatDateTime={formatDateTime}
                    />
                  ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}

function EvidenceCard({
  evidence,
  userName,
}: {
  evidence: Evidence
  userName: string
}) {
  const [imageError, setImageError] = useState(false)

  return (
    <div className="border border-slate-200 rounded-lg overflow-hidden">
      {!imageError ? (
        <img
          src={evidence.photo_url}
          alt="Evidencia"
          className="w-full h-48 object-cover"
          onError={() => setImageError(true)}
        />
      ) : (
        <div className="w-full h-48 bg-slate-100 flex items-center justify-center">
          <Image className="w-12 h-12 text-slate-300" />
        </div>
      )}
      <div className="p-3">
        <div className="flex items-center justify-between text-sm mb-2">
          <span className="text-slate-900 font-medium">{userName}</span>
          <span className="text-slate-500">
            {new Date(evidence.uploaded_at).toLocaleDateString('es-ES')}
          </span>
        </div>
        {evidence.description && (
          <p className="text-sm text-slate-600">{evidence.description}</p>
        )}
      </div>
    </div>
  )
}

function LogEntry({
  log,
  userName,
  formatDateTime,
}: {
  log: TaskLog
  userName: string
  formatDateTime: (date: string) => string
}) {
  const getActionLabel = (action: string) => {
    const actions: Record<string, string> = {
      CREATED: 'Tarea creada',
      STATUS_CHANGED: 'Estado cambiado',
      EVIDENCE_UPLOADED: 'Evidencia subida',
      ASSIGNED: 'Tarea asignada',
      UPDATED: 'Tarea actualizada',
    }
    return actions[action] || action
  }

  const getStatusLabel = (status: string | null) => {
    if (!status) return null
    const labels: Record<string, string> = {
      PENDING: 'Pendiente',
      IN_PROGRESS: 'En Progreso',
      COMPLETED: 'Completada',
    }
    return labels[status] || status
  }

  let details = getActionLabel(log.action)
  if (log.from_status && log.to_status) {
    details += `: ${getStatusLabel(log.from_status)} → ${getStatusLabel(log.to_status)}`
  }

  return (
    <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
      <div className="flex items-start justify-between gap-2 mb-1">
        <span className="text-sm font-medium text-slate-900">{userName}</span>
        <span className="text-xs text-slate-500">
          {formatDateTime(log.timestamp)}
        </span>
      </div>
      <p className="text-sm text-slate-600">{details}</p>
    </div>
  )
}
