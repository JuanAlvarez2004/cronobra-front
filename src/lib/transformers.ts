/**
 * Transformadores para convertir entre camelCase (Java) y snake_case (TypeScript)
 */

/**
 * Convierte un objeto de camelCase a snake_case
 */
export function toSnakeCase<T extends Record<string, any>>(
  obj: T,
): Record<string, any> {
  if (obj === null || obj === undefined) return obj
  if (typeof obj !== 'object') return obj
  if (Array.isArray(obj)) return obj.map((item) => toSnakeCase(item))

  const result: Record<string, any> = {}

  for (const [key, value] of Object.entries(obj)) {
    const snakeKey = key.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`)
    
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      result[snakeKey] = toSnakeCase(value)
    } else if (Array.isArray(value)) {
      result[snakeKey] = value.map((item) =>
        item && typeof item === 'object' ? toSnakeCase(item) : item,
      )
    } else {
      result[snakeKey] = value
    }
  }

  return result
}

/**
 * Convierte un objeto de snake_case a camelCase
 */
export function toCamelCase<T extends Record<string, any>>(
  obj: T,
): Record<string, any> {
  if (obj === null || obj === undefined) return obj
  if (typeof obj !== 'object') return obj
  if (Array.isArray(obj)) return obj.map((item) => toCamelCase(item))

  const result: Record<string, any> = {}

  for (const [key, value] of Object.entries(obj)) {
    const camelKey = key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase())
    
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      result[camelKey] = toCamelCase(value)
    } else if (Array.isArray(value)) {
      result[camelKey] = value.map((item) =>
        item && typeof item === 'object' ? toCamelCase(item) : item,
      )
    } else {
      result[camelKey] = value
    }
  }

  return result
}

/**
 * Transforma una fecha ISO string a formato de fecha local
 */
export function formatISODate(isoString: string | null | undefined): string {
  if (!isoString) return ''
  return isoString.split('T')[0]
}

/**
 * Transforma una fecha local a ISO string
 */
export function toISODate(dateString: string): string {
  if (!dateString) return ''
  return new Date(dateString).toISOString()
}

/**
 * Mapea TaskStatus del backend al frontend
 */
export function mapTaskStatus(status: string): string {
  // El backend solo tiene: PENDING, IN_PROGRESS, COMPLETED
  // El frontend usa: PENDING, IN_PROGRESS, COMPLETED, APPROVED, REJECTED
  // APPROVED y REJECTED se manejarán como estados virtuales o se agregarán al backend
  return status
}
