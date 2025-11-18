// ============================================
// Enums
// ============================================

export enum UserRole {
  ADMIN = 'ADMIN',
  WORKER = 'WORKER',
}

export enum TaskStatus {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
}

// ============================================
// User Types
// ============================================

export interface User {
  id: number
  name: string
  email: string
  role: UserRole
  created_at: string
}

export interface CreateUserRequest {
  name: string
  email: string
  password: string
  role: UserRole
}

export interface UpdateUserRequest {
  name?: string
  role?: UserRole
}

// ============================================
// Auth Types
// ============================================

export interface RegisterRequest {
  name: string
  email: string
  password: string
  role: UserRole
}

export interface LoginRequest {
  email: string
  password: string
}

export interface LoginResponse {
  access_token: string
  refresh_token: string
  user: User
}

export interface AuthUser {
  id: number
  name: string
  email: string
  role: UserRole
  created_at: string
}

// ============================================
// Schedule Types
// ============================================

export interface Schedule {
  id: number
  name: string
  description: string
  start_date: string
  end_date: string
  created_by: number
}

export interface CreateScheduleRequest {
  name: string
  description: string
  start_date: string
  end_date: string
}

export interface UpdateScheduleRequest {
  name?: string
  description?: string
  start_date?: string
  end_date?: string
}

// ============================================
// Task Types
// ============================================

export interface Task {
  id: number
  schedule_id: number
  title: string
  description: string
  assigned_to: number
  status: TaskStatus
  due_date: string
}

export interface CreateTaskRequest {
  schedule_id: number
  title: string
  description: string
  assigned_to: number
  due_date: string
}

export interface UpdateTaskStatusRequest {
  status: TaskStatus
}

// ============================================
// Evidence Types
// ============================================

export interface Evidence {
  id: number
  task_id: number
  photo_url: string
  created_at: string
  metadata?: string
}

export interface CreateEvidenceRequest {
  photo: File
  metadata?: string
}

// ============================================
// Log Types
// ============================================

export interface TaskLog {
  id: number
  action: string
  from_status: TaskStatus | null
  to_status: TaskStatus | null
  timestamp: string
  user_id: number
}

// ============================================
// API Response Types
// ============================================

export interface ApiError {
  message: string
  statusCode?: number
  errors?: Record<string, Array<string>>
}

export interface MessageResponse {
  message: string
}

// ============================================
// Pagination Types
// ============================================

export interface PaginationParams {
  page?: number
  limit?: number
}

export interface PaginatedResponse<T> {
  data: Array<T>
  total: number
  page: number
  limit: number
  totalPages: number
}
