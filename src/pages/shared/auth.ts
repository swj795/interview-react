export type UserInfo = {
  username?: string
  email?: string
  raw?: unknown
}

const authTokenStorageKey = 'interview-react.authToken'
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function getStoredToken(): string {
  try {
    return sessionStorage.getItem(authTokenStorageKey) || ''
  } catch {
    return ''
  }
}

export function storeToken(token: string) {
  try {
    sessionStorage.setItem(authTokenStorageKey, token)
  } catch {
    // Keep auth state in memory when browser storage is unavailable.
  }
}

export function clearStoredToken() {
  try {
    sessionStorage.removeItem(authTokenStorageKey)
  } catch {
    // Ignore storage failures so logout-style cleanup stays best effort.
  }
}

export function getAuthToken(response: unknown): string {
  if (!response || typeof response !== 'object') {
    return ''
  }

  const record = response as Record<string, unknown>
  const token = readString(record, 'token') || readString(record, 'accessToken')
  if (token) {
    return token
  }

  const data = record.data
  if (!data || typeof data !== 'object') {
    return ''
  }

  const dataRecord = data as Record<string, unknown>
  return readString(dataRecord, 'token') || readString(dataRecord, 'accessToken')
}

export function getUserInfo(response: unknown, fallback: UserInfo): UserInfo {
  if (!response || typeof response !== 'object') {
    return { ...fallback, raw: response }
  }

  const record = response as Record<string, unknown>
  const user = record.user

  if (user && typeof user === 'object') {
    const userRecord = user as Record<string, unknown>
    return {
      username:
        typeof userRecord.username === 'string'
          ? userRecord.username
          : fallback.username,
      email:
        typeof userRecord.email === 'string' ? userRecord.email : fallback.email,
      raw: response,
    }
  }

  return {
    username:
      typeof record.username === 'string' ? record.username : fallback.username,
    email: typeof record.email === 'string' ? record.email : fallback.email,
    raw: response,
  }
}

export function validateEmail(email: string): string {
  if (!email.trim()) {
    return 'Email is required.'
  }

  if (!emailPattern.test(email)) {
    return 'Enter a valid email address.'
  }

  return ''
}

function readString(record: Record<string, unknown>, key: string): string {
  const value = record[key]
  return typeof value === 'string' ? value : ''
}

export function validatePassword(password: string): string {
  if (!password) {
    return 'Password is required.'
  }

  return ''
}
