import { useState } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { HomePage } from './pages/home'
import { LoginPage } from './pages/login'
import { ProfilePage } from './pages/profile'
import { RegisterPage } from './pages/register'
import { clearStoredToken, getStoredToken } from './pages/shared/auth'
import type { UserInfo } from './pages/shared/auth'

function App() {
  const [token, setToken] = useState(getStoredToken)
  const [user, setUser] = useState<UserInfo | null>(null)

  function handleAuthenticated(nextToken: string, nextUser: UserInfo) {
    setToken(nextToken)
    setUser(nextUser)
  }

  function handleLogout() {
    clearStoredToken()
    setToken('')
    setUser(null)
  }

  return (
    <Routes>
      <Route
        path="/"
        element={
          <HomePage
            token={token}
            user={user}
            onLogout={handleLogout}
            onUserLoaded={setUser}
          />
        }
      />
      <Route
        path="/login"
        element={<LoginPage onAuthenticated={handleAuthenticated} />}
      />
      <Route
        path="/profile"
        element={
          <ProfilePage token={token} user={user} onUserLoaded={setUser} />
        }
      />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  )
}

export default App
