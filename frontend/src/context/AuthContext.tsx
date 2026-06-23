import { createContext, useContext, useReducer, useEffect } from 'react'
import type { User } from '../types'

interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
}

type AuthAction =
  | { type: 'LOGIN'; payload: { user: User; token: string } }
  | { type: 'LOGOUT' }

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
}

function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'LOGIN':
      return {
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
      }
    case 'LOGOUT':
      return initialState
    default:
      return state
  }
}

interface AuthContextType {
  state: AuthState
  login: (user: User, token: string) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, initialState)

  useEffect(() => {
    // check localStorage on app load in case user was already logged in
    const token = localStorage.getItem('ttnv_token')
    const user = localStorage.getItem('ttnv_user')
    if (token && user) {
      dispatch({ type: 'LOGIN', payload: { token, user: JSON.parse(user) } })
    }
  }, [])
  const login = (user: User, token: string) => {
    localStorage.setItem('ttnv_token', token)
    localStorage.setItem('ttnv_user', JSON.stringify(user))
    dispatch({ type: 'LOGIN', payload: { user, token } })
  }

  const logout = () => {
    localStorage.removeItem('ttnv_token')
    localStorage.removeItem('ttnv_user')
    dispatch({ type: 'LOGOUT' })
  }

  return (
    <AuthContext.Provider value={{ state, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

// custom hook so any component can access auth easily
export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used inside AuthProvider')
  return context
}