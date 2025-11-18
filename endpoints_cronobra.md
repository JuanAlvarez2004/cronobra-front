# Documentación API Cronobra MVP

## Información General

**Versión:** 1.0.0  
**Descripción:** API mínima para el MVP de Cronobra (solo ADMIN y WORKER)

### Servidores

- **Producción:** `https://api.cronobra.com`
- **Desarrollo:** `http://localhost:8080`

### Autenticación

La API utiliza **JWT (JSON Web Tokens)** mediante Bearer Authentication. Incluye el token en el header:

```
Authorization: Bearer {access_token}
```

---

## Endpoints

### 🔐 Autenticación (Auth)

#### POST `/auth/register`

Registrar un nuevo usuario (Solo debe usarlo ADMIN).

**Request Body:**

```json
{
  "name": "string",
  "email": "user@example.com",
  "password": "string",
  "role": "ADMIN" | "WORKER"
}
```

**Responses:**

- `201` - Usuario creado exitosamente
- `400` - Datos inválidos
- `409` - Email ya existe

---

#### POST `/auth/login`

Iniciar sesión en el sistema.

**Request Body:**

```json
{
  "email": "user@example.com",
  "password": "string"
}
```

**Response 200:**

```json
{
  "access_token": "string",
  "refresh_token": "string",
  "user": {
    "id": 1,
    "name": "string",
    "email": "user@example.com",
    "role": "ADMIN",
    "created_at": "2025-01-01T00:00:00Z"
  }
}
```

**Responses:**

- `200` - Login exitoso
- `401` - Credenciales incorrectas

---

#### GET `/auth/me`

Obtener información del usuario autenticado.

**Headers:** Requiere `Authorization: Bearer {token}`

**Response 200:**

```json
{
  "id": 1,
  "name": "string",
  "email": "user@example.com",
  "role": "ADMIN",
  "created_at": "2025-01-01T00:00:00Z"
}
```

---

### 👥 Usuarios (Users)

#### GET `/users`

Listar todos los usuarios (Solo ADMIN).

**Headers:** Requiere `Authorization: Bearer {token}`

**Response 200:** Array de objetos User

---

#### POST `/users`

Crear un nuevo usuario (Solo ADMIN).

**Headers:** Requiere `Authorization: Bearer {token}`

**Request Body:**

```json
{
  "name": "string",
  "email": "user@example.com",
  "password": "string",
  "role": "ADMIN" | "WORKER"
}
```

**Response 201:** Objeto User creado

---

#### GET `/users/{id}`

Obtener un usuario específico por ID.

**Headers:** Requiere `Authorization: Bearer {token}`

**Parameters:**

- `id` (path, integer) - ID del usuario

**Response 200:** Objeto User

---

#### PATCH `/users/{id}`

Editar información de un usuario (Solo ADMIN).

**Headers:** Requiere `Authorization: Bearer {token}`

**Parameters:**

- `id` (path, integer) - ID del usuario

**Request Body:**

```json
{
  "name": "string",
  "role": "ADMIN" | "WORKER"
}
```

**Response 200:** Objeto User actualizado

---

#### DELETE `/users/{id}`

Eliminar un usuario (Solo ADMIN).

**Headers:** Requiere `Authorization: Bearer {token}`

**Parameters:**

- `id` (path, integer) - ID del usuario

**Response 200:**

```json
{
  "message": "string"
}
```

---

### 📅 Cronogramas (Schedules)

#### GET `/schedules`

Listar todos los cronogramas (Solo ADMIN).

**Headers:** Requiere `Authorization: Bearer {token}`

**Response 200:** Array de objetos Schedule

---

#### POST `/schedules`

Crear un nuevo cronograma (Solo ADMIN).

**Headers:** Requiere `Authorization: Bearer {token}`

**Request Body:**

```json
{
  "name": "string",
  "description": "string",
  "start_date": "2025-01-01",
  "end_date": "2025-12-31"
}
```

**Response 201:**

```json
{
  "id": 1,
  "name": "string",
  "description": "string",
  "start_date": "2025-01-01",
  "end_date": "2025-12-31",
  "created_by": 1
}
```

---

#### GET `/schedules/{id}`

Obtener un cronograma específico.

**Headers:** Requiere `Authorization: Bearer {token}`

**Parameters:**

- `id` (path, integer) - ID del cronograma

**Response 200:** Objeto Schedule

---

#### PATCH `/schedules/{id}`

Editar un cronograma (Solo ADMIN).

**Headers:** Requiere `Authorization: Bearer {token}`

**Parameters:**

- `id` (path, integer) - ID del cronograma

**Request Body:**

```json
{
  "name": "string",
  "description": "string",
  "start_date": "2025-01-01",
  "end_date": "2025-12-31"
}
```

**Response 200:** Objeto Schedule actualizado

---

#### DELETE `/schedules/{id}`

Eliminar un cronograma (Solo ADMIN).

**Headers:** Requiere `Authorization: Bearer {token}`

**Parameters:**

- `id` (path, integer) - ID del cronograma

**Response 200:**

```json
{
  "message": "string"
}
```

---

### ✅ Tareas (Tasks)

#### GET `/tasks/{id}`

Ver una tarea específica por ID.

**Headers:** Requiere `Authorization: Bearer {token}`

**Parameters:**

- `id` (path, integer) - ID de la tarea

**Response 200:**

```json
{
  "id": 1,
  "schedule_id": 1,
  "title": "string",
  "description": "string",
  "assigned_to": 1,
  "status": "PENDING",
  "due_date": "2025-01-01"
}
```

---

#### POST `/tasks`

Crear una nueva tarea (Solo ADMIN).

**Headers:** Requiere `Authorization: Bearer {token}`

**Request Body:**

```json
{
  "schedule_id": 1,
  "title": "string",
  "description": "string",
  "assigned_to": 1,
  "due_date": "2025-01-01"
}
```

**Response 201:** Objeto Task creado

---

#### PATCH `/tasks/{id}/status`

Cambiar el estado de una tarea (WORKER).

**Headers:** Requiere `Authorization: Bearer {token}`

**Parameters:**

- `id` (path, integer) - ID de la tarea

**Request Body:**

```json
{
  "status": "PENDING" | "IN_PROGRESS" | "COMPLETED"
}
```

**Response 200:** Objeto Task actualizado

**Estados disponibles:**

- `PENDING` - Pendiente
- `IN_PROGRESS` - En progreso
- `COMPLETED` - Completada

---

### 📸 Evidencias (Evidence)

#### POST `/tasks/{id}/evidence`

Subir foto de evidencia para una tarea (WORKER).

**Headers:** Requiere `Authorization: Bearer {token}`

**Parameters:**

- `id` (path, integer) - ID de la tarea

**Request Body:** `multipart/form-data`

- `photo` (binary) - Archivo de imagen
- `metadata` (string, opcional) - Metadatos adicionales

**Response 201:**

```json
{
  "id": 1,
  "task_id": 1,
  "photo_url": "https://...",
  "created_at": "2025-01-01T00:00:00Z"
}
```

---

### 📋 Logs

#### GET `/tasks/{id}/logs`

Ver historial de cambios de una tarea (Solo ADMIN).

**Headers:** Requiere `Authorization: Bearer {token}`

**Parameters:**

- `id` (path, integer) - ID de la tarea

**Response 200:**

```json
[
  {
    "id": 1,
    "action": "string",
    "from_status": "PENDING",
    "to_status": "IN_PROGRESS",
    "timestamp": "2025-01-01T00:00:00Z",
    "user_id": 1
  }
]
```

---

## Roles y Permisos

### ADMIN

- Crear, editar y eliminar usuarios
- Crear, editar y eliminar cronogramas
- Crear tareas
- Ver logs de tareas
- Acceso completo al sistema

### WORKER

- Ver sus tareas asignadas
- Cambiar estado de sus tareas
- Subir evidencias fotográficas
- Ver su propio perfil

---

## Códigos de Respuesta HTTP

- `200` - OK - Operación exitosa
- `201` - Created - Recurso creado exitosamente
- `400` - Bad Request - Datos inválidos o mal formateados
- `401` - Unauthorized - No autenticado o token inválido
- `403` - Forbidden - Sin permisos para realizar la acción
- `404` - Not Found - Recurso no encontrado
- `409` - Conflict - Conflicto (ej: email duplicado)
- `500` - Internal Server Error - Error del servidor

---
