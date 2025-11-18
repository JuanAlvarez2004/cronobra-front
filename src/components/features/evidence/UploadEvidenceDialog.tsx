import { useRef, useState } from 'react'
import { Camera, Upload, X } from 'lucide-react'
import { Button } from '../../ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../../ui/dialog'
import { Label } from '../../ui/label'
import type { Task } from '@routes/index'

interface UploadEvidenceDialogProps {
  open: boolean
  onClose: () => void
  task: Task
  onUpload: (taskId: string, photoUrl: string) => void
}

export function UploadEvidenceDialog({
  open,
  onClose,
  task,
  onUpload,
}: UploadEvidenceDialogProps) {
  const [preview, setPreview] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.FormEvent<HTMLInputElement>) => {
    const file = e.currentTarget.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (preview) {
      // En una aplicación real, aquí subirías la imagen a Supabase Storage
      // Por ahora, usamos la preview directamente
      onUpload(task.id, preview)
      setPreview(null)
    }
  }

  const handleClose = () => {
    setPreview(null)
    onClose()
  }

  const handleRemovePhoto = () => {
    setPreview(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Subir Evidencia Fotográfica</DialogTitle>
          <DialogDescription>{task.title}</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Fotografía de la Tarea Completada</Label>

            {!preview ? (
              <div
                className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center cursor-pointer hover:border-amber-500 transition-colors"
                onClick={() => fileInputRef.current?.click()}
              >
                <Camera className="w-12 h-12 text-slate-400 mx-auto mb-3" />
                <p className="text-sm text-slate-600 mb-2">
                  Haz clic para seleccionar una foto
                </p>
                <p className="text-xs text-slate-500">
                  O arrastra y suelta una imagen aquí
                </p>
              </div>
            ) : (
              <div className="relative">
                <img
                  src={preview}
                  alt="Preview"
                  className="w-full h-64 object-cover rounded-lg"
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  className="absolute top-2 right-2"
                  onClick={handleRemovePhoto}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>

          <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-sm text-blue-800">
              📸 La foto capturará automáticamente la ubicación y fecha desde tu
              dispositivo móvil (metadata EXIF).
            </p>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={!preview}
              className="bg-green-600 hover:bg-green-700"
            >
              <Upload className="w-4 h-4 mr-2" />
              Subir y Completar
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
