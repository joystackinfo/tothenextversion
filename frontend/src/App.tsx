import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { TourProvider } from './context/TourContext'
import TourModal from './components/TourModal'
import Landing from './pages/Landing'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import CreateCapsule from './pages/CreateCapsule'
import OpenCapsule from './pages/OpenCapsule'
import Wall from './pages/Wall'
import Profile from './pages/Profile'
import ProtectedRoute from './components/ProtectedRoute'

function App() {
  return (
    <Router>
      <AuthProvider>
        <TourProvider>
          <TourModal />
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/create" element={<ProtectedRoute><CreateCapsule /></ProtectedRoute>} />
            <Route path="/capsules/:id" element={<ProtectedRoute><OpenCapsule /></ProtectedRoute>} />
            <Route path="/wall" element={<ProtectedRoute><Wall /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          </Routes>
        </TourProvider>
      </AuthProvider>
    </Router>
  )
}

export default App