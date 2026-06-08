import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { register } from '../../api/register'
import { validateEmail, validatePassword } from '../shared/auth'

export function RegisterPage() {
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')

    if (!username.trim()) {
      setError('Username is required.')
      return
    }

    const emailError = validateEmail(email)
    if (emailError) {
      setError(emailError)
      return
    }

    const passwordError = validatePassword(password)
    if (passwordError) {
      setError(passwordError)
      return
    }

    setIsSubmitting(true)

    try {
      const payload = {
        username: username.trim(),
        email: email.trim(),
        password,
      }
      await register(payload)

      navigate('/login', {
        state: {
          successMessage: 'Registration successful. Please sign in.',
        },
      })
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
    <main className="grid min-h-[100svh] place-items-center box-border px-5 py-10">
      <section
        className="w-full max-w-[440px] text-left"
        aria-labelledby="auth-title"
      >
        <div className="mb-7">
          <p className="mb-2.5 text-sm font-bold tracking-normal text-[var(--accent)] uppercase">
            Interview React
          </p>
          <h1 id="auth-title" className="!mt-0 !mb-3">
            Create account
          </h1>
          <p className="text-[var(--text)]">
            Register with username, email, and password.
          </p>
        </div>

        <form className="grid gap-[18px]" onSubmit={handleSubmit} noValidate>
          <label className="grid gap-2 text-[15px] font-semibold text-[var(--text-h)]">
            Username
            <input
              className="box-border w-full rounded-lg border border-[var(--border)] bg-[var(--bg)] px-3.5 py-3 text-base leading-[1.4] text-[var(--text-h)] [font-family:var(--sans)] focus:border-[var(--accent)] focus:outline-2 focus:outline-offset-2 focus:outline-[var(--accent-bg)]"
              autoComplete="username"
              name="username"
              onChange={(event) => setUsername(event.target.value)}
              placeholder="John Doe"
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

          <label className="grid gap-2 text-[15px] font-semibold text-[var(--text-h)]">
            Password
            <input
              className="box-border w-full rounded-lg border border-[var(--border)] bg-[var(--bg)] px-3.5 py-3 text-base leading-[1.4] text-[var(--text-h)] [font-family:var(--sans)] focus:border-[var(--accent)] focus:outline-2 focus:outline-offset-2 focus:outline-[var(--accent-bg)]"
              autoComplete="new-password"
              name="password"
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Password"
              type="password"
              value={password}
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

          <button
            className="inline-flex min-h-11 cursor-pointer items-center justify-center rounded-lg border-0 bg-[var(--accent)] px-[18px] text-base leading-none font-bold text-white no-underline [font-family:var(--sans)] disabled:cursor-not-allowed disabled:opacity-65"
            disabled={isSubmitting}
            type="submit"
          >
            {isSubmitting ? 'Submitting...' : 'Create account'}
          </button>
        </form>

        <p className="mt-5 text-[15px]">
          Already have an account?{' '}
          <Link className="font-bold text-[var(--accent)]" to="/login">
            Sign in
          </Link>
        </p>
      </section>
    </main>
  )
}
