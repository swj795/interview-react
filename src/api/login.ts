export type LoginRequest = {
  email: string
  password: string
}

export async function login(request: LoginRequest): Promise<unknown> {
  const response = await fetch('/user/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  })

  const text = await response.text()
  const data = parseJson(text)

  if (!response.ok) {
    const message =
      getErrorMessage(data) || `Request failed with status ${response.status}`
    throw new Error(message)
  }

  return data
}

function parseJson(text: string): unknown {
  if (!text) {
    return null
  }

  try {
    return JSON.parse(text)
  } catch {
    return text
  }
}

function getErrorMessage(data: unknown): string {
  if (!data || typeof data !== 'object') {
    return ''
  }

  if ('message' in data) {
    const message = data.message
    if (Array.isArray(message)) {
      return message.join(', ')
    }
    if (typeof message === 'string') {
      return message
    }
  }

  if ('error' in data && typeof data.error === 'string') {
    return data.error
  }

  return ''
}
