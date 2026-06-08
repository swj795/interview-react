import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { getUserInfo as requestUserInfo } from '../../api/home'
import { updateProfile } from '../../api/profile'
import { getUserInfo, validateEmail } from '../shared/auth'
import type { UserInfo } from '../shared/auth'

type ProfilePageProps = {
  token: string
  user: UserInfo | null
  onUserLoaded: (user: UserInfo | null) => void
}

type LoadState = {
  error: string
  token: string
}

export function ProfilePage({
  token,
  user,
  onUserLoaded,
}: ProfilePageProps) {
  const [loadState, setLoadState] = useState<LoadState>({
    error: '',
    token: '',
  })
  const isLoading = Boolean(token) && !user && loadState.token !== token
  const loadError = loadState.token === token ? loadState.error : ''

  useEffect(() => {
    if (!token || user) {
      return
    }

    let isCurrent = true

    requestUserInfo(token)
      .then((response) => {
        if (!isCurrent) {
          return
        }

        onUserLoaded(getUserInfo(response, {}))
        setLoadState({ error: '', token })
      })
      .catch((caughtError) => {
        if (!isCurrent) {
          return
        }

        setLoadState({
          error:
            caughtError instanceof Error
              ? caughtError.message
              : 'Failed to load user information.',
          token,
        })
      })

    return () => {
      isCurrent = false
    }
  }, [token, user, onUserLoaded])

  if (!token) {
    return <Navigate to="/login" replace />
  }

  return (
    <main className="grid min-h-[100svh] place-items-center box-border bg-[var(--bg)] px-5 py-10 text-left">
      <section
        className="w-full max-w-[480px]"
        aria-labelledby="profile-title"
      >
        <div className="mb-7">
          <Link
            className="mb-5 inline-flex text-sm font-bold text-[var(--accent)] no-underline"
            to="/"
          >
            Back home
          </Link>
          <h1 id="profile-title" className="!mt-0 !mb-3">
            Profile
          </h1>
          <p className="text-[var(--text)]">
            Update your username and email.
          </p>
        </div>

        {isLoading ? (
          <p className="text-[var(--text)]">Loading user information...</p>
        ) : loadError ? (
          <p
            className="m-0 rounded-lg bg-red-600/10 px-3 py-2.5 text-sm text-red-700"
            role="alert"
          >
            {loadError}
          </p>
        ) : (
          <ProfileForm
            token={token}
            user={user}
            onUserLoaded={onUserLoaded}
          />
        )}
      </section>
    </main>
  )
}

type ProfileFormProps = {
  token: string
  user: UserInfo | null
  onUserLoaded: (user: UserInfo | null) => void
}

function ProfileForm({ token, user, onUserLoaded }: ProfileFormProps) {
  const [username, setUsername] = useState(user?.username || '')
  const [email, setEmail] = useState(user?.email || '')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')
    setSuccess('')

    const nextUsername = username.trim()
    const nextEmail = email.trim()

    if (!nextUsername) {
      setError('Username is required.')
      return
    }

    const emailError = validateEmail(nextEmail)
    if (emailError) {
      setError(emailError)
      return
    }

    setIsSubmitting(true)

    try {
      const payload = { username: nextUsername, email: nextEmail }
      const response = await updateProfile(token, payload)
      const nextUser = getUserInfo(response, payload)

      setUsername(nextUser.username || payload.username)
      setEmail(nextUser.email || payload.email)
      onUserLoaded(nextUser)
      setSuccess('Profile updated successfully.')
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : 'Request failed. Please try again.',
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form className="grid gap-[18px]" onSubmit={handleSubmit} noValidate>
      <label className="grid gap-2 text-[15px] font-semibold text-[var(--text-h)]">
        Username
        <input
          className="box-border w-full rounded-lg border border-[var(--border)] bg-[var(--bg)] px-3.5 py-3 text-base leading-[1.4] text-[var(--text-h)] [font-family:var(--sans)] focus:border-[var(--accent)] focus:outline-2 focus:outline-offset-2 focus:outline-[var(--accent-bg)]"
          autoComplete="username"
          name="username"
          onChange={(event) => setUsername(event.target.value)}
          placeholder="Username"
          type="text"
          value={username}
        />
      </label>

      <label className="grid gap-2 text-[15px] font-semibold text-[var(--text-h)]">
        Email
        <input
          className="box-border w-full rounded-lg border border-[var(--border)] bg-[var(--bg)] px-3.5 py-3 text-base leading-[1.4] text-[var(--text-h)] [font-family:var(--sans)] focus:border-[var(--accent)] focus:outline-2 focus:outline-offset-2 focus:outline-[var(--accent-bg)]"
          autoComplete="email"
          name="email"
          onChange={(event) => setEmail(event.target.value)}
          placeholder="example@example.com"
          type="email"
          value={email}
        />
      </label>

      {error ? (
        <p
          className="m-0 rounded-lg bg-red-600/10 px-3 py-2.5 text-sm text-red-700"
          role="alert"
        >
          {error}
        </p>
      ) : null}
      {success ? (
        <p className="m-0 rounded-lg bg-green-600/10 px-3 py-2.5 text-sm text-green-700">
          {success}
        </p>
      ) : null}

      <button
        className="inline-flex min-h-11 cursor-pointer items-center justify-center rounded-lg border-0 bg-[var(--accent)] px-[18px] text-base leading-none font-bold text-white no-underline [font-family:var(--sans)] disabled:cursor-not-allowed disabled:opacity-65"
        disabled={isSubmitting}
        type="submit"
      >
        {isSubmitting ? 'Saving...' : 'Save profile'}
      </button>
    </form>
  )
}
