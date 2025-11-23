import { useState } from 'react'
import { Building2 } from 'lucide-react'
import { Link, useNavigate, useSearch } from '@tanstack/react-router'
import { Button } from '../ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../ui/card'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import type { ApiError } from '@/types/api'
import { useAuth } from '@/contexts/AuthContext'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const { login } = useAuth()
  const navigate = useNavigate()
  const search = useSearch({ from: '/_public/login' }) as { registered?: string }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    try {
      await login({ email, password })
      navigate({ to: '/dashboard' })
    } catch (err) {
      const apiError = err as ApiError
      setError(apiError.message || 'Error al iniciar sesión')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-transparent flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <div className="flex justify-center">
            <div>
              <Building2 className="w-12 h-12 text-black" />
            </div>
          </div>
          <h1 className="text-5xl font-bold text-slate-900">Cronobra</h1>
          <p className="text-slate-600">
            Sistema de cronogramas de construcción
          </p>
        </div>

        <Card className="border-slate-200 shadow-xl bg-white">
          <CardHeader>
            <CardTitle className='mb-2'>Iniciar Sesión</CardTitle>
            <CardDescription className='text-xs'>
              Ingresa tus credenciales para continuar
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {search?.registered === 'true' && (
                <div className="p-3 text-sm text-green-600 bg-green-50 border border-green-200 rounded-md">
                  ✓ Cuenta creada exitosamente. Ahora puedes iniciar sesión.
                </div>
              )}

              {error && (
                <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
                  {error}
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">Correo Electrónico</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="tu@correo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Contraseña</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-amber-600 hover:bg-amber-600"
                disabled={isLoading}
              >
                {isLoading ? 'Ingresando...' : 'Ingresar'}
              </Button>

              <div className="text-center pt-4 border-t border-slate-200">
                <p className="text-sm text-slate-600 mb-2">
                  ¿No tienes una cuenta?
                </p>
                <Link
                  to="/register"
                  className="text-sm text-amber-600 hover:text-amber-700 font-medium"
                >
                  Crear cuenta de administrador
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
