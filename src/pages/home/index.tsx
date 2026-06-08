import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import viteLogo from '../../assets/vite.svg'
import { getUserInfo as requestUserInfo } from '../../api/home'
import { clearStoredToken, getUserInfo } from '../shared/auth'
import type { UserInfo } from '../shared/auth'

type HomePageProps = {
  token: string
  user: UserInfo | null
  onLogout: () => void
  onUserLoaded: (user: UserInfo | null) => void
}

type LoadState = {
  error: string
  token: string
}

export function HomePage({
  token,
  user,
  onLogout,
  onUserLoaded,
}: HomePageProps) {
  const navigate = useNavigate()
  const [loadState, setLoadState] = useState<LoadState>({
    error: '',
    token: '',
  })
  const [isLogoutConfirmOpen, setIsLogoutConfirmOpen] = useState(false)
  const error = loadState.token === token ? loadState.error : ''
  const isLoading = Boolean(token) && loadState.token !== token
  const displayName = getDisplayName({ isLoading, token, user })
  const welcomeMessage = getWelcomeMessage({ token, user })

  useEffect(() => {
    if (!token) {
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
  }, [token, onUserLoaded])

  function handleLogoutRequest() {
    setIsLogoutConfirmOpen(true)
  }

  function handleLogoutConfirm() {
    onLogout()
    setIsLogoutConfirmOpen(false)
    navigate('/login')
  }

  return (
    <div className="flex min-h-[100svh] flex-col bg-[var(--bg)] text-left">
      <nav className="flex min-h-16 w-full items-center justify-between gap-5 border-b border-[var(--border)] px-6 py-3 max-[640px]:px-4">
        <Link
          className="inline-flex min-w-0 items-center"
          to="/"
          aria-label="Home"
        >
          <span className="inline-flex h-8 w-8 shrink-0 items-center overflow-hidden">
            <img
              className="h-8 w-auto max-w-none -translate-x-[11px]"
              src={viteLogo}
              alt="Vite logo"
            />
          </span>
        </Link>
        <UserMenu
          displayName={displayName}
          isDisabled={!token}
          onLogoutRequest={handleLogoutRequest}
        />
      </nav>

      <main className="grid flex-1 place-items-center box-border px-5 py-10 text-center">
        <section className="w-full max-w-[720px]">
          {!token ? (
            <EmptyState message={welcomeMessage} />
          ) : isLoading ? (
            <div className="grid gap-4">
              <h1 className="!m-0">Welcome back.</h1>
              <p className="text-[var(--text)]">Loading user information...</p>
            </div>
          ) : error ? (
            <div className="mx-auto grid max-w-[560px] gap-5 text-left">
              <p
                className="m-0 rounded-lg bg-red-600/10 px-3 py-2.5 text-sm text-red-700"
                role="alert"
              >
                {error}
              </p>
              <Link
                className="inline-flex min-h-11 cursor-pointer items-center justify-center rounded-lg border-0 bg-[var(--accent)] px-[18px] text-base leading-none font-bold text-white no-underline [font-family:var(--sans)]"
                onClick={clearStoredToken}
                to="/login"
              >
                Go to login
              </Link>
            </div>
          ) : user ? (
            <h1 className="!m-0">{welcomeMessage}</h1>
          ) : (
            <EmptyState message={welcomeMessage} />
          )}
        </section>
      </main>

      {isLogoutConfirmOpen ? (
        <LogoutConfirmDialog
          onCancel={() => setIsLogoutConfirmOpen(false)}
          onConfirm={handleLogoutConfirm}
        />
      ) : null}
    </div>
  )
}

function UserMenu({
  displayName,
  isDisabled,
  onLogoutRequest,
}: {
  displayName: string
  isDisabled: boolean
  onLogoutRequest: () => void
}) {
  const [isOpen, setIsOpen] = useState(false)

  function closeMenu() {
    setIsOpen(false)
  }

  return (
    <div className="relative min-w-0 max-w-[55vw] text-right">
      <button
        className="min-w-0 max-w-full cursor-pointer truncate rounded-md border-0 bg-transparent px-2 py-1 text-right text-sm font-bold text-[var(--text-h)] [font-family:var(--sans)] hover:bg-[var(--accent-bg)] disabled:cursor-default disabled:hover:bg-transparent"
        disabled={isDisabled}
        onClick={() => setIsOpen((current) => !current)}
        title={displayName}
        type="button"
      >
        {displayName}
      </button>

      {isOpen ? (
        <div className="absolute right-0 top-[calc(100%+8px)] z-10 grid min-w-36 overflow-hidden rounded-lg border border-[var(--border)] bg-[var(--bg)] py-1 text-left shadow-[var(--shadow)]">
          <Link
            className="px-4 py-2.5 text-sm font-semibold text-[var(--text-h)] no-underline hover:bg-[var(--accent-bg)]"
            onClick={closeMenu}
            to="/profile"
          >
            修改信息
          </Link>
          <button
            className="cursor-pointer border-0 bg-transparent px-4 py-2.5 text-left text-sm font-semibold text-red-600 [font-family:var(--sans)] hover:bg-red-600/10"
            onClick={() => {
              closeMenu()
              onLogoutRequest()
            }}
            type="button"
          >
            退出登录
          </button>
        </div>
      ) : null}
    </div>
  )
}

function LogoutConfirmDialog({
  onCancel,
  onConfirm,
}: {
  onCancel: () => void
  onConfirm: () => void
}) {
  return (
    <div
      className="fixed inset-0 z-20 grid place-items-center bg-black/45 px-5"
      role="presentation"
    >
      <section
        aria-labelledby="logout-confirm-title"
        aria-modal="true"
        className="w-full max-w-[360px] rounded-lg border border-[var(--border)] bg-[var(--bg)] p-5 text-left shadow-[var(--shadow)]"
        role="dialog"
      >
        <h2 id="logout-confirm-title" className="!mb-3">
          确认退出登录？
        </h2>
        <p className="text-sm text-[var(--text)]">
          退出后需要重新登录才能继续访问当前账号。
        </p>
        <div className="mt-5 flex justify-end gap-3">
          <button
            className="inline-flex min-h-10 cursor-pointer items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--bg)] px-4 text-sm font-bold text-[var(--text-h)] [font-family:var(--sans)]"
            onClick={onCancel}
            type="button"
          >
            取消
          </button>
          <button
            className="inline-flex min-h-10 cursor-pointer items-center justify-center rounded-lg border-0 bg-red-600 px-4 text-sm font-bold text-white [font-family:var(--sans)]"
            onClick={onConfirm}
            type="button"
          >
            确定
          </button>
        </div>
      </section>
    </div>
  )
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="mx-auto grid max-w-[560px] gap-5">
      <h1 className="!m-0">{message}</h1>
      <Link
        className="inline-flex min-h-11 cursor-pointer items-center justify-center rounded-lg border-0 bg-[var(--accent)] px-[18px] text-base leading-none font-bold text-white no-underline [font-family:var(--sans)]"
        to="/login"
      >
        Go to login
      </Link>
    </div>
  )
}

function getDisplayName({
  isLoading,
  token,
  user,
}: {
  isLoading: boolean
  token: string
  user: UserInfo | null
}): string {
  if (!token) {
    return 'Guest'
  }

  if (isLoading) {
    return 'Loading...'
  }

  return user?.username || user?.email || 'Guest'
}

function getWelcomeMessage({
  token,
  user,
}: {
  token: string
  user: UserInfo | null
}): string {
  if (!token) {
    return 'Welcome. Please sign in to continue.'
  }

  if (user?.username) {
    return `Welcome back, ${user.username}.`
  }

  return 'Welcome back.'
}
