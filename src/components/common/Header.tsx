import { useAuth } from '@/contexts/AuthContext'
import { CalendarDays, LogOut } from 'lucide-react' 
import { Button } from '../ui/button'
import { useNavigate } from '@tanstack/react-router'

export default function Header() {
  const { user, logout, isAuthenticated } = useAuth()
  const navigate = useNavigate()

  if (!isAuthenticated) {
    return null
  }

  const handleLogout = async () => {
    await logout()
    navigate({ to: '/login' })
  }

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-10 shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-amber-500 p-2 rounded-lg">
              <CalendarDays className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-slate-900">{`Panel ${user?.role}`}</h1>
              <p className="text-sm text-slate-600">{user?.name}</p>
            </div>
          </div>
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="w-4 h-4 mr-2" />
            Salir
          </Button>
        </div>
      </div>
    </header>
  )
}
