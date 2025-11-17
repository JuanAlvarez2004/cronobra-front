# Cronobra Frontend

Sistema de gestión de cronogramas de construcción desarrollado con React, TanStack Router y TanStack Query.

## 🚀 Tecnologías

- **React 19** - Librería de interfaz de usuario
- **TypeScript** - Tipado estático
- **TanStack Router** - Enrutamiento file-based con protección de rutas
- **TanStack Query** - Gestión de estado del servidor
- **Axios** - Cliente HTTP con interceptores JWT
- **Tailwind CSS v4** - Framework de CSS
- **Vite** - Bundler y dev server

## 📁 Estructura del Proyecto

```
src/
├── components/        # Componentes de React
│   ├── ui/           # Componentes UI de shadcn
│   ├── Header.tsx    # Header con navegación
│   └── LoginPage.tsx # Página de login
├── contexts/          # Contextos de React
│   └── AuthContext.tsx
├── hooks/
│   └── queries/      # React Query hooks
│       ├── useAuth.ts
│       ├── useUsers.ts
│       ├── useSchedules.ts
│       ├── useTasks.ts
│       └── useEvidence.ts
├── lib/
│   └── api-client.ts # Cliente Axios configurado
├── routes/           # Rutas de TanStack Router (file-based)
│   ├── __root.tsx
│   ├── index.tsx
│   ├── _public/      # Rutas públicas
│   │   └── login.tsx
│   └── _authenticated/ # Rutas protegidas
│       ├── dashboard.tsx
│       ├── tasks.tsx
│       └── _admin/   # Rutas solo para ADMIN
│           └── schedules.tsx
├── services/         # Servicios de API
│   ├── authService.ts
│   ├── usersService.ts
│   ├── schedulesService.ts
│   ├── tasksService.ts
│   └── evidenceService.ts
├── types/
│   └── api.ts       # Tipos TypeScript de la API
└── main.tsx         # Punto de entrada
```

## 🛠️ Configuración

### Requisitos Previos

- Node.js 18+
- pnpm (recomendado)

### Instalación

```bash
# Instalar dependencias
pnpm install

# Copiar archivo de variables de entorno
cp .env.example .env

# Editar .env con tu configuración
# VITE_API_URL=http://localhost:8080
```

### Desarrollo

```bash
# Iniciar servidor de desarrollo
pnpm dev

# El proyecto estará disponible en http://localhost:3000
```

### Build

```bash
# Generar build de producción
pnpm build

# Vista previa del build
pnpm serve
```

## 🔐 Autenticación

La aplicación utiliza JWT (JSON Web Tokens) para autenticación:

- Los tokens se almacenan en `localStorage`
- Se incluyen automáticamente en todas las peticiones mediante interceptores de Axios
- Las rutas protegidas redirigen a `/login` si no hay autenticación
- Las rutas admin verifican el rol del usuario

## 📋 Rutas Disponibles

### Públicas
- `/login` - Página de inicio de sesión

### Protegidas (requieren autenticación)
- `/dashboard` - Dashboard principal (diferente según rol)
- `/tasks` - Tareas del trabajador (WORKER)

### Admin (requieren rol ADMIN)
- `/schedules` - Gestión de cronogramas

## 🎯 Características Implementadas

- ✅ Configuración completa de TanStack Router (file-based)
- ✅ Configuración de TanStack Query con React Query DevTools
- ✅ Sistema de tipos TypeScript completo
- ✅ Cliente API con Axios e interceptores JWT
- ✅ Servicios organizados por entidad
- ✅ Hooks de React Query para todas las operaciones
- ✅ Contexto de autenticación
- ✅ Rutas protegidas y públicas
- ✅ Guards de rutas basados en roles
- ✅ Manejo de errores de API
- ✅ Variables de entorno

## 🔧 Scripts Disponibles

```bash
pnpm dev       # Servidor de desarrollo
pnpm build     # Build de producción
pnpm serve     # Vista previa del build
pnpm lint      # Ejecutar ESLint
pnpm format    # Formatear con Prettier
pnpm check     # Formatear y corregir lint
pnpm test      # Ejecutar tests
```

## 📝 Tipos de Usuario

### ADMIN (Supervisor)
- Crear, editar y eliminar usuarios
- Crear, editar y eliminar cronogramas
- Crear tareas y asignarlas a trabajadores
- Ver logs de tareas
- Acceso completo al sistema

### WORKER (Trabajador)
- Ver sus tareas asignadas
- Cambiar estado de sus tareas
- Subir evidencias fotográficas
- Ver su propio perfil

## 🌐 API Endpoints

La aplicación se conecta a los siguientes endpoints (ver `endpoints_cronobra.md` para detalles completos):

- `/auth/*` - Autenticación
- `/users/*` - Gestión de usuarios
- `/schedules/*` - Gestión de cronogramas
- `/tasks/*` - Gestión de tareas
- `/tasks/:id/evidence` - Subida de evidencias
- `/tasks/:id/logs` - Historial de cambios

## 🎨 Componentes UI

El proyecto incluye componentes de UI de shadcn/ui configurados con Tailwind CSS:

- Buttons, Cards, Dialogs
- Forms, Inputs, Selects
- Tables, Tabs, Badges
- Y muchos más...

## 📱 DevTools

El proyecto incluye:
- **React Query DevTools** - Inspección de queries y mutations
- **TanStack Router DevTools** - Inspección de rutas y navegación

## 🚧 Próximos Pasos

1. Implementar componentes completos para cada vista
2. Agregar validación de formularios con react-hook-form
3. Implementar notificaciones con sonner
4. Agregar manejo de permisos más granular
5. Implementar refresh token automático
6. Agregar tests unitarios y de integración

## 📄 Licencia

Este proyecto es privado y confidencial.
