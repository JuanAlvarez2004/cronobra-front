import { useState } from 'react'
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
import type { Schedule, User } from '@routes/index'

interface CreateScheduleDialogProps {
  open: boolean
  onClose: () => void
  onCreate: (schedule: Schedule) => void
  currentUser: User
}

export function CreateScheduleDialog({
  open,
  onClose,
  onCreate,
  currentUser,
}: CreateScheduleDialogProps) {
  const [name, setName] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const newSchedule: Schedule = {
      id: `schedule-${Date.now()}`,
      name,
      startDate,
      endDate,
      createdAt: new Date().toISOString(),
      createdBy: currentUser.id,
    }

    onCreate(newSchedule)
    setName('')
    setStartDate('')
    setEndDate('')
  }

  const handleClose = () => {
    setName('')
    setStartDate('')
    setEndDate('')
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Crear Nuevo Cronograma</DialogTitle>
          <DialogDescription>
            Ingresa los datos del cronograma de construcción
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="schedule-name">Nombre del Cronograma</Label>
            <Input
              id="schedule-name"
              placeholder="Ej: Construcción Torre A"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="start-date">Fecha de Inicio</Label>
              <Input
                id="start-date"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="end-date">Fecha de Fin</Label>
              <Input
                id="end-date"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                required
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancelar
            </Button>
            <Button type="submit" className="bg-amber-500 hover:bg-amber-600">
              Crear Cronograma
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
