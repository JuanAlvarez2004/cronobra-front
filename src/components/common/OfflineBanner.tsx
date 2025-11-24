import { useOnlineStatus } from '@/hooks/useOnlineStatus'
import { WifiOff } from 'lucide-react'

export function OfflineBanner() {
  const isOnline = useOnlineStatus()

  if (isOnline) return null

  return (
    <div className="fixed top-0 left-0 right-0 bg-red-600 text-white py-2 px-4 z-50 flex items-center justify-center gap-2 shadow-lg">
      <WifiOff className="w-4 h-4 shrink-0" />
      <span className="text-sm font-medium">
        Sin conexión - Trabajando en modo offline
      </span>
    </div>
  )
}
