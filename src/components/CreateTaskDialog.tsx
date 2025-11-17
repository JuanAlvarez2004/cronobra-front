import { useState } from 'react';
import { Button } from './ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import type { Worker, Schedule, Task } from '@routes/index';

interface CreateTaskDialogProps {
  open: boolean;
  onClose: () => void;
  onCreate: (task: Task) => void;
  schedule: Schedule;
  workers: Worker[];
}

export function CreateTaskDialog({
  open,
  onClose,
  onCreate,
  schedule,
  workers,
}: CreateTaskDialogProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [assignedTo, setAssignedTo] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const now = new Date().toISOString();
    const newTask: Task = {
      id: `task-${Date.now()}`,
      scheduleId: schedule.id,
      title,
      description,
      dueDate,
      assignedTo,
      status: 'PENDING',
      createdAt: now,
      updatedAt: now,
    };

    onCreate(newTask);
    setTitle('');
    setDescription('');
    setDueDate('');
    setAssignedTo('');
  };

  const handleClose = () => {
    setTitle('');
    setDescription('');
    setDueDate('');
    setAssignedTo('');
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Crear Nueva Tarea</DialogTitle>
          <DialogDescription>
            Cronograma: {schedule.name}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="task-title">Título de la Tarea</Label>
            <Input
              id="task-title"
              placeholder="Ej: Colocar columnas del segundo piso"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="task-description">Descripción</Label>
            <Textarea
              id="task-description"
              placeholder="Describe los detalles de la tarea..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="task-due-date">Fecha de Vencimiento</Label>
            <Input
              id="task-due-date"
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="task-worker">Asignar a Obrero</Label>
            <Select value={assignedTo} onValueChange={setAssignedTo} required>
              <SelectTrigger id="task-worker">
                <SelectValue placeholder="Selecciona un obrero" />
              </SelectTrigger>
              <SelectContent>
                {workers.map((worker) => (
                  <SelectItem key={worker.id} value={worker.id}>
                    {worker.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancelar
            </Button>
            <Button type="submit" className="bg-amber-500 hover:bg-amber-600">
              Crear Tarea
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
