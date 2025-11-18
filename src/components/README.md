# Estructura de Componentes

Esta carpeta sigue una arquitectura **feature-based** optimizada para escalabilidad y mantenimiento.

## 📁 Estructura

```
src/components/
├── ui/                    # Componentes UI primitivos (solo 9 componentes usados)
│   ├── button.tsx
│   ├── badge.tsx
│   ├── card.tsx
│   ├── dialog.tsx
│   ├── input.tsx
│   ├── label.tsx
│   ├── select.tsx
│   ├── tabs.tsx
│   ├── textarea.tsx
│   ├── cn.ts             # Utilidad para combinar clases (clsx + tailwind-merge)
│   └── index.ts          # Barrel export
│
├── features/              # Componentes organizados por dominio/funcionalidad
│   ├── tasks/            # Todo lo relacionado con tareas
│   │   ├── TaskList.tsx
│   │   ├── TaskDetailsDialog.tsx
│   │   ├── CreateTaskDialog.tsx
│   │   └── index.ts
│   │
│   ├── schedules/        # Todo lo relacionado con cronogramas
│   │   ├── ScheduleList.tsx
│   │   ├── CreateScheduleDialog.tsx
│   │   └── index.ts
│   │
│   ├── workers/          # Componentes específicos de trabajadores
│   │   ├── WorkerTaskList.tsx
│   │   └── index.ts
│   │
│   └── evidence/         # Gestión de evidencias fotográficas
│       ├── UploadEvidenceDialog.tsx
│       └── index.ts
│
├── dashboards/           # Vistas principales de la aplicación
│   ├── WorkerDashboard.tsx
│   ├── SupervisorDashboard.tsx
│   └── index.ts
│
└── common/               # Componentes compartidos entre features
    ├── Header.tsx
    ├── LoginPage.tsx
    └── index.ts
```

## 🎯 Principios de Organización

### 1. **UI Components** (`/ui`)

- **Propósito**: Componentes primitivos reutilizables de bajo nivel
- **Contenido**: Solo componentes de shadcn/ui que realmente se usan
- **Regla**: No contienen lógica de negocio, solo presentación
- **Importar**: `import { Button, Card } from '@/components/ui'`

### 2. **Feature Components** (`/features`)

- **Propósito**: Componentes específicos de dominio/funcionalidad
- **Organización**: Por bounded context (tasks, schedules, workers, etc.)
- **Ventajas**:
  - Fácil de encontrar componentes relacionados
  - Escalable (agregar nuevas features sin afectar las existentes)
  - Mejor para code splitting
- **Importar**: `import { TaskList } from '@/components/features/tasks'`

### 3. **Dashboards** (`/dashboards`)

- **Propósito**: Vistas principales/páginas completas
- **Contenido**: Orquestadores que componen features
- **Regla**: Coordinan múltiples features, no tienen lógica de negocio
- **Importar**: `import { WorkerDashboard } from '@/components/dashboards'`

### 4. **Common Components** (`/common`)

- **Propósito**: Componentes compartidos entre múltiples features
- **Ejemplos**: Header, Footer, Layout, ErrorBoundary
- **Regla**: Solo si se usa en 3+ features
- **Importar**: `import { Header } from '@/components/common'`

## 🚀 Mejoras Implementadas

### ✅ Antes vs Después

| Antes                         | Después                               |
| ----------------------------- | ------------------------------------- |
| 48 archivos en `/ui`          | 9 archivos en `/ui` (solo los usados) |
| Todos los componentes en raíz | Organizados por dominio               |
| `utils.ts` confuso            | `cn.ts` con nombre claro              |
| Imports largos y confusos     | Barrel exports limpios                |
| Sin escalabilidad             | Feature-based escalable               |

### 📊 Componentes Eliminados

Se removieron **38 componentes** de shadcn/ui que no se usaban:

- accordion, alert-dialog, alert, aspect-ratio, avatar
- breadcrumb, calendar, carousel, chart, checkbox
- collapsible, command, context-menu, drawer, dropdown-menu
- form, hover-card, input-otp, menubar, navigation-menu
- pagination, popover, progress, radio-group, resizable
- scroll-area, separator, sheet, sidebar, skeleton
- slider, sonner, switch, table, toggle-group
- toggle, tooltip, use-mobile

## 💡 Guía de Uso

### Agregar un nuevo componente UI

```bash
# Solo agregar si realmente lo necesitas
pnpm dlx shadcn@latest add <component-name>
```

### Crear una nueva feature

```bash
mkdir src/components/features/mi-feature
touch src/components/features/mi-feature/index.ts
```

### Ejemplo de imports limpios

```tsx
// ✅ Bueno - usando barrel exports
import { Button, Card, Dialog } from '@/components/ui'
import { TaskList, CreateTaskDialog } from '@/components/features/tasks'
import { WorkerDashboard } from '@/components/dashboards'

// ❌ Evitar - imports directos largos
import { Button } from '@/components/ui/button'
import { TaskList } from '@/components/features/tasks/TaskList'
```

## 🔧 Utilidades

### `cn()` utility

```tsx
import { cn } from '@/components/ui'

// Combina clases de Tailwind sin conflictos
;<div className={cn('p-4', isActive && 'bg-blue-500', className)} />
```

**¿Por qué `cn`?**

- `clsx`: Combina clases condicionalmente
- `tailwind-merge`: Resuelve conflictos de Tailwind (ej: `p-4 p-2` → `p-2`)
- Patrón estándar en proyectos modernos de React

## 📚 Referencias

- [Feature-Sliced Design](https://feature-sliced.design/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Tailwind CSS](https://tailwindcss.com/)
