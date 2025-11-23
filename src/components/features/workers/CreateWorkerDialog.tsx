import { useState } from 'react'
import { UserPlus } from 'lucide-react'
import { Button } from '../../ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../../ui/dialog'
import { Input } from '../../ui/input'
import { Label } from '../../ui/label'
import { UserRole } from '@/types/api'
import { useCreateUser } from '@/hooks/queries/useUsers'

interface CreateWorkerDialogProps {
  open: boolean
  onClose: () => void
}

export function CreateWorkerDialog({
  open,
  onClose,
}: CreateWorkerDialogProps) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const createUser = useCreateUser()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      await createUser.mutateAsync({
        name: name.trim(),
        email: email.trim(),
        password,
        role: UserRole.WORKER,
      })

      // Reset and close
      setName('')
      setEmail('')
      setPassword('')
      onClose()
    } catch (error) {
      console.error('Error creating worker:', error)
    }
  }

  const handleClose = () => {
    setName('')
    setEmail('')
    setPassword('')
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Crear Nuevo Trabajador</DialogTitle>
          <DialogDescription>
            Agrega un nuevo trabajador al sistema
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nombre Completo</Label>
            <Input
              id="name"
              placeholder="Juan Pérez"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              disabled={createUser.isPending}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Correo Electrónico</Label>
            <Input
              id="email"
              type="email"
              placeholder="juan@ejemplo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={createUser.isPending}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Contraseña</Label>
            <Input
              id="password"
              type="password"
              placeholder="Mínimo 8 caracteres"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
              disabled={createUser.isPending}
            />
            <p className="text-xs text-slate-500">
              La contraseña debe tener al menos 8 caracteres
            </p>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={createUser.isPending}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="bg-amber-600 hover:bg-amber-600"
              disabled={createUser.isPending}
            >
              <UserPlus className="w-4 h-4 mr-2" />
              {createUser.isPending ? 'Creando...' : 'Crear Trabajador'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
