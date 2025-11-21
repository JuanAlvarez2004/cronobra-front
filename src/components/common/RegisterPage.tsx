import { useState } from 'react'
import { Building2, ArrowLeft } from 'lucide-react'
import { Link, useNavigate } from '@tanstack/react-router'
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
import { authService } from '@/services/authService'

export default function RegisterPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    // Validar que las contraseñas coincidan
    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden')
      return
    }

    // Validar longitud de contraseña
    if (password.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres')
      return
    }

    setIsLoading(true)

    try {
      // Llamar al endpoint de registro público de admin
      await authService.registerAdmin({
        name: name.trim(),
        email: email.trim(),
        password,
      })

      // Redirigir al login con mensaje de éxito
      navigate({ to: '/login', search: { registered: 'true' } })
    } catch (err) {
      const apiError = err as ApiError
      setError(apiError.message || 'Error al crear la cuenta')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <div className="flex justify-center">
            <div className="bg-amber-500 p-4 rounded-2xl shadow-lg">
              <Building2 className="w-12 h-12 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-slate-900">Cronobra</h1>
          <p className="text-slate-600">
            Crea tu cuenta de administrador
          </p>
        </div>

        <Card className="border-slate-200 shadow-xl">
          <CardHeader>
            <CardTitle>Registro de Administrador</CardTitle>
            <CardDescription>
              Completa el formulario para crear tu cuenta
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
                  {error}
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="name">Nombre Completo</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Tu nombre completo"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>

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
                  placeholder="Mínimo 8 caracteres"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={8}
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirmar Contraseña</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Repite tu contraseña"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  minLength={8}
                  disabled={isLoading}
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-amber-500 hover:bg-amber-600"
                disabled={isLoading}
              >
                {isLoading ? 'Creando cuenta...' : 'Crear Cuenta'}
              </Button>

              <div className="text-center">
                <Link
                  to="/login"
                  className="inline-flex items-center gap-2 text-sm text-amber-600 hover:text-amber-700"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Volver al inicio de sesión
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>

        <p className="text-center text-sm text-slate-500">
          Sistema Cronobra - Gestión de Obras
        </p>
      </div>
    </div>
  )
}
