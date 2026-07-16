import { createContext, useState, useCallback } from 'react'

export const UserContext = createContext()

export function UserProvider({ children }) {
  const [user, setUser] = useState({
    id: null,
    name: '',
    email: '',
    role: null, // 'employee', 'manager', 'hr', 'admin'
    avatar: null,
    isLoggedIn: false,
  })

  const login = useCallback((userData) => {
    setUser({
      ...userData,
      isLoggedIn: true,
    })
  }, [])

  const logout = useCallback(() => {
    setUser({
      id: null,
      name: '',
      email: '',
      role: null,
      avatar: null,
      isLoggedIn: false,
    })
  }, [])

  const value = {
    user,
    login,
    logout,
  }

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>
}
