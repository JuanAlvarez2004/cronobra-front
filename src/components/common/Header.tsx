import { Link } from '@tanstack/react-router'
import { useAuth } from '@/contexts/AuthContext'
import { UserRole } from '@/types/api'

export default function Header() {
  const { user, logout, isAuthenticated } = useAuth()

  if (!isAuthenticated) {
    return null
  }

  const handleLogout = async () => {
    await logout()
  }

  return (
    <header className="bg-white shadow">
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 justify-between">
          <div className="flex">
            <div className="flex shrink-0 items-center">
              <Link to="/dashboard" className="text-xl font-bold text-gray-900">
                Cronobra
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link
                to="/dashboard"
                className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-900"
                activeProps={{ className: 'border-b-2 border-indigo-500' }}
              >
                Dashboard
              </Link>

              {user?.role === UserRole.ADMIN && (
                <Link
                  to="/schedules"
                  className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-500 hover:text-gray-900"
                  activeProps={{
                    className: 'border-b-2 border-indigo-500 text-gray-900',
                  }}
                >
                  Cronogramas
                </Link>
              )}

              {user?.role === UserRole.WORKER && (
                <Link
                  to="/tasks"
                  className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-500 hover:text-gray-900"
                  activeProps={{
                    className: 'border-b-2 border-indigo-500 text-gray-900',
                  }}
                >
                  Mis Tareas
                </Link>
              )}
            </div>
          </div>
          <div className="flex items-center">
            <div className="shrink-0">
              <span className="text-sm text-gray-700">{user?.name}</span>
              <span className="ml-2 inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800">
                {user?.role}
              </span>
            </div>
            <button
              onClick={handleLogout}
              className="ml-4 inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
            >
              Cerrar sesión
            </button>
          </div>
        </div>
      </nav>
    </header>
  )
}
