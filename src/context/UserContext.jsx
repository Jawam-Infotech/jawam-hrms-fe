import { createContext, useState, useCallback, useEffect } from 'react'
import { loginRequest, fetchCurrentUser, logoutRequest } from '../services/authService'
import { getAccessToken, getStoredUser, setSession, clearSession } from '../utils/tokenStorage'

// eslint-disable-next-line react-refresh/only-export-components
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
  const [user, setUser] = useState(() => {
    const storedUser = getAccessToken() ? getStoredUser() : null
    return storedUser ? { ...storedUser, isLoggedIn: true } : emptyUser
  })
  const [isBootstrapping, setIsBootstrapping] = useState(true)
  const [authError, setAuthError] = useState('')

  // On app load: if a token exists in storage, restore the session
  // instead of forcing the person to log in again on every refresh.
useEffect(() => {
  const token = getAccessToken()

  if (!token) {
    // This update finishes the one-time session bootstrap when no token exists.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsBootstrapping(false)
    return
  }

  fetchCurrentUser()
    .then((freshUser) => {
      setUser({ ...freshUser, isLoggedIn: true })
      setSession({ user: freshUser })
    })
    .catch(() => {
      clearSession()
      setUser(emptyUser)
    })
    .finally(() => {
      setIsBootstrapping(false)
    })
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
