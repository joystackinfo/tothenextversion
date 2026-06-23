// redirects to login if user is not authenticated
import { useAuth } from '../context/AuthContext'
import { Navigate } from 'react-router-dom'

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { state } = useAuth()

  if (!state.isAuthenticated) {
    return <Navigate to="/login" /> // send to login if not logged in
  }

  return <>{children}</>
}