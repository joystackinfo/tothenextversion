import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import type { User } from '../types'
import '../styles/Login.css'
   
export default function Register() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
 
  
   const API_URL = import.meta.env.VITE_API_URL


  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await fetch(`${API_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, username, password }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.message)
        return
      }

      const user: User = {
        _id: data._id,
        name: data.name,
        email: data.email,
        username: data.username,
      }
      login(user, data.token)
      navigate('/dashboard')
    } catch (err) {
      setError('Something went wrong. Try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-header">
        <span className="auth-logo">To the Next Version</span>
      </div>

      <div className="auth-body">
        <div className="auth-card">
          <h1 className="auth-heading">Start writing</h1>
          <p className="auth-sub">Create your first capsule</p>

          {error && <p className="auth-error">{error}</p>}

          <form onSubmit={handleSubmit}>
            <div className="field">
              <label>Name</label>
              <input
                type="text"
                placeholder="Your name"
                value={name}
                onChange={e => setName(e.target.value)}
                required
              />
            </div>
             
             <div className="field">
              <label> Username </label>
              <input 
              type="text"
              placeholder="username"
              value={username}
              onChange={e => setUsername(e.target.value)}
              required
              />
             </div>

            <div className="field">
              <label>Email</label>
              <input
                type="email"
                placeholder="you@gmail.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="field">
              <label>Password</label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="auth-btn" disabled={loading}>
              {loading ? 'Creating account...' : 'Create account'}
            </button>
          </form>

          <p className="auth-switch">
            Already have an account? <Link to="/login">Sign in →</Link>
          </p>
        </div>
      </div>
    </div>
  )
}