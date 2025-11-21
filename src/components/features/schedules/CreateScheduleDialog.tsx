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
import { useCreateSchedule } from '@/hooks/queries/useSchedules'

interface CreateScheduleDialogProps {
  open: boolean
  onClose: () => void
}

export function CreateScheduleDialog({
  open,
  onClose,
}: CreateScheduleDialogProps) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')

  const createSchedule = useCreateSchedule()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      await createSchedule.mutateAsync({
        name,
        description,
        start_date: startDate,
        end_date: endDate,
      })

      // Reset form and close dialog
      setName('')
      setDescription('')
      setStartDate('')
      setEndDate('')
      onClose()
    } catch (error) {
      console.error('Error creating schedule:', error)
    }
  }

  const handleClose = () => {
    setName('')
    setDescription('')
    setStartDate('')
    setEndDate('')
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md bg-white border-0">
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

          <div className="space-y-2">
            <Label htmlFor="schedule-description">Descripción</Label>
            <Input
              id="schedule-description"
              placeholder="Descripción del cronograma"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
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
            <Button 
              type="submit" 
              className="bg-amber-500 hover:bg-amber-600"
              disabled={createSchedule.isPending}
            >
              {createSchedule.isPending ? 'Creando...' : 'Crear Cronograma'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
