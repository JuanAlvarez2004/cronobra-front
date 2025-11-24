import { useState } from 'react'
import { useInstallPrompt } from '@/hooks/useInstallPrompt'
import { Download, X } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function InstallPrompt() {
  const { canInstall, promptInstall } = useInstallPrompt()
  const [dismissed, setDismissed] = useState(false)

  if (!canInstall || dismissed) return null

  return (
    <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:w-96 bg-white border border-slate-200 rounded-lg shadow-lg p-4 z-50 animate-in slide-in-from-bottom duration-300">
      <button
        onClick={() => setDismissed(true)}
        className="absolute top-2 right-2 text-slate-400 hover:text-slate-600 transition-colors"
        aria-label="Cerrar"
      >
        <X className="w-4 h-4" />
      </button>
      
      <div className="flex items-start gap-3">
        <div className="bg-amber-100 p-2 rounded-lg shrink-0">
          <Download className="w-5 h-5 text-amber-600" />
        </div>
        
        <div className="flex-1">
          <h3 className="font-medium text-slate-900 mb-1">
            Instalar Cronobra
          </h3>
          <p className="text-sm text-slate-600 mb-3">
            Instala la app para acceso rápido y trabajo offline
          </p>
          
          <div className="flex gap-2">
            <Button
              onClick={promptInstall}
              className="flex-1 bg-amber-600 hover:bg-amber-700"
              size="sm"
            >
              Instalar
            </Button>
            <Button
              onClick={() => setDismissed(true)}
              variant="outline"
              size="sm"
            >
              Ahora no
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
