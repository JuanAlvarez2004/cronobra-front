import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { Users, Plus, Trash2, Mail } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CreateWorkerDialog } from '@/components/features/workers/CreateWorkerDialog'
import { useUsers, useDeleteUser } from '@/hooks/queries/useUsers'
import { UserRole } from '@/types/api'

export const Route = createFileRoute('/_authenticated/_admin/workers')({
  component: WorkersPage,
})

function WorkersPage() {
  const [showCreateWorker, setShowCreateWorker] = useState(false)
  const { data: users = [], isLoading } = useUsers()
  const deleteUser = useDeleteUser()

  // Filtrar solo trabajadores
  const workers = users.filter((u) => u.role === UserRole.WORKER)

  const handleDeleteWorker = async (id: number, name: string) => {
    if (
      window.confirm(
        `¿Estás seguro de eliminar al trabajador "${name}"?\n\nNota: No se puede eliminar si tiene tareas asignadas.`,
      )
    ) {
      try {
        await deleteUser.mutateAsync(id)
      } catch (error) {
        alert('Error al eliminar trabajador. Puede tener tareas asignadas.')
      }
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-slate-600">Cargando trabajadores...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <div className="bg-amber-600 p-3 rounded-lg">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900">
                  Gestión de Trabajadores
                </h1>
                <p className="text-slate-600">
                  {workers.length} trabajador(es) registrado(s)
                </p>
              </div>
            </div>
            <Button
              onClick={() => setShowCreateWorker(true)}
              className="bg-amber-600 hover:bg-amber-600"
            >
              <Plus className="w-4 h-4 mr-2" />
              Nuevo Trabajador
            </Button>
          </div>
        </div>

        {workers.length === 0 ? (
          <Card className="p-12 text-center">
            <div className="flex justify-center mb-4">
              <div className="p-6 rounded-full">
                <Users className="w-12 h-12 text-slate-400" />
              </div>
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">
              No hay trabajadores
            </h3>
            <p className="text-slate-600 mb-4">
              Comienza agregando tu primer trabajador al sistema
            </p>
            <Button
              onClick={() => setShowCreateWorker(true)}
              className="bg-amber-600 hover:bg-amber-600"
            >
              <Plus className="w-4 h-4 mr-2" />
              Crear Primer Trabajador
            </Button>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {workers.map((worker) => (
              <Card key={worker.id} className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-amber-100 p-2 rounded-lg">
                      <Users className="w-5 h-5 text-amber-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900">
                        {worker.name}
                      </h3>
                      <Badge variant="outline" className="mt-1">
                        {worker.role}
                      </Badge>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteWorker(worker.id, worker.name)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <Mail className="w-4 h-4" />
                    <span className="truncate">{worker.email}</span>
                  </div>
                  <div className="text-xs text-slate-500">
                    Creado:{' '}
                    {new Date(worker.created_at).toLocaleDateString('es-ES', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      <CreateWorkerDialog
        open={showCreateWorker}
        onClose={() => setShowCreateWorker(false)}
      />
    </div>
  )
}
