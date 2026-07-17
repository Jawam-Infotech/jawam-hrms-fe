import { createContext, useState, useCallback, useEffect } from 'react'
import { loginRequest, fetchCurrentUser, logoutRequest } from '../services/authService'
import { getAccessToken, getStoredUser, setSession, clearSession } from '../utils/tokenStorage'

export const UserContext = createContext()

const emptyUser = {
  id: null,
  name: '',
  email: '',
  role: null,
  avatar: null,
  isLoggedIn: false,
}

export function UserProvider({ children }) {
  const [user, setUser] = useState(emptyUser)
  const [isBootstrapping, setIsBootstrapping] = useState(true)
  const [authError, setAuthError] = useState('')

  // On app load: if a token exists in storage, restore the session
  // instead of forcing the person to log in again on every refresh.
  useEffect(() => {
    const token = getAccessToken()
    const storedUser = getStoredUser()

    if (!token) {
      setIsBootstrapping(false)
      return
    }

    if (storedUser) {
      setUser({ ...storedUser, isLoggedIn: true })
    }

    // Optionally re-validate against the backend if a /me endpoint exists.
    // If your backend doesn't have one yet, this quietly fails and we
    // still trust the cached user above.
    fetchCurrentUser()
      .then((freshUser) => {
        setUser({ ...freshUser, isLoggedIn: true })
        setSession({ user: freshUser })
      })
      .catch(() => {
        // token invalid/expired and refresh failed elsewhere — log out cleanly
        if (!getAccessToken()) {
          setUser(emptyUser)
        }
      })
      .finally(() => setIsBootstrapping(false))
  }, [])

  const login = useCallback(async (email, password) => {
    setAuthError('')
    const { accessToken, refreshToken, user: loggedInUser } = await loginRequest({ email, password })
    setSession({ accessToken, refreshToken, user: loggedInUser })
    setUser({ ...loggedInUser, isLoggedIn: true })
    return loggedInUser
  }, [])

  const logout = useCallback(async () => {
    await logoutRequest()
    clearSession()
    setUser(emptyUser)
  }, [])

  const value = {
    user,
    login,
    logout,
    isBootstrapping,
    authError,
    setAuthError,
  }

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>
}