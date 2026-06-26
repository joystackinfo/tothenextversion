import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Navbar from '../components/Navbar'
import '../styles/Profile.css'

export default function Profile() {
  const { state, logout } = useAuth()
  const navigate = useNavigate()
  const [editing, setEditing] = useState(false)
  const [username, setUsername] = useState(state.user?.username || '')
  const [tagline, setTagline] = useState('')
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)
  
  // REAL STATS from backend
  const [stats, setStats] = useState({ total: 0, opened: 0, hearts: 0 })
  const [loadingStats, setLoadingStats] = useState(true)

  // fetch real stats on mount
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/capsules', {
          headers: { Authorization: `Bearer ${state.token}` },
        })
        const capsules = await res.json()
        
        if (res.ok) {
          const total = capsules.length
          const opened = capsules.filter((c: any) => !c.isLocked).length
          // hearts would come from wall/likes - for now default to 0
          setStats({ total, opened, hearts: 0 })
        }
      } catch (err) {
        console.error('Failed to fetch stats')
      } finally {
        setLoadingStats(false)
      }
    }

    if (state.token) fetchStats()
  }, [state.token])

  const getInitials = (name?: string) => {
    if (!name) return 'U'
    return name
      .split(' ') 
      .map(n => n[0])
      .join('')
      .toUpperCase()
  }

  const handleSave = async () => {
    if (!username.trim()) {
      setError('Username is required')
      return
    }

    setSaving(true)
    try {
      const res = await fetch('http://localhost:5000/api/auth/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${state.token}`,
        },
        body: JSON.stringify({ username, tagline }),
      })

      if (res.ok) {
        setEditing(false)
        setError('')
      } else {
        setError('Failed to save profile')
      }
    } catch (err) {
      setError('Something went wrong')
    } finally {
      setSaving(false)
    }
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="profile-page">
      <div className="page-header">
        <span className="page-logo">To the Next Version</span>
      </div>

      <div className="profile-content">
        <div className="profile-container">
          {/* Profile Header with Avatar */}
          <div className="profile-header">
            <div className="avatar">{getInitials(state.user?.name)}</div>
            <div className="user-info">
              <h2 className="user-name">{state.user?.name}</h2>
              <p className="user-handle">@{state.user?.username}</p>
              {!editing && (
                <p className="user-tagline">
                  "{tagline || 'Writing to tomorrow, one capsule at a time.'}"
                </p>
              )}
            </div>
          </div>

          {/* Stats Grid - REAL DATA */}
          {loadingStats ? (
            <p className="loading-stats">Loading stats...</p>
          ) : (
            <div className="stats-grid">
              <div className="stat-card">
                <p className="stat-number">{stats.total}</p>
                <p className="stat-label">Capsules</p>
              </div>
              <div className="stat-card">
                <p className="stat-number">{stats.opened}</p>
                <p className="stat-label">Opened</p>
              </div>
              <div className="stat-card">
                <p className="stat-number">{stats.hearts}</p>
                <p className="stat-label">Hearts</p>
              </div>
            </div>
          )}

          {/* Email Display */}
          <div className="profile-info-row">
            <span className="info-label">Email</span>
            <span className="info-value">{state.user?.email}</span>
          </div>

          {/* Edit Form */}
          {editing ? (
            <>
              <div className="edit-field">
                <label className="edit-label">Username</label>
                <input
                  type="text"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  className="edit-input"
                />
              </div>

              <div className="edit-field">
                <label className="edit-label">Your Tagline</label>
                <input
                  type="text"
                  placeholder="Writing to tomorrow, one capsule at a time."
                  value={tagline}
                  onChange={e => setTagline(e.target.value)}
                  className="edit-input"
                />
              </div>

              {error && <p className="error-message">{error}</p>}

              <div className="button-group">
                <button className="btn-primary" onClick={handleSave} disabled={saving}>
                  {saving ? 'Saving...' : 'Save changes'}
                </button>
                <button className="btn-secondary" onClick={() => setEditing(false)}>
                  Cancel
                </button>
              </div>
            </>
          ) : (
            <button className="btn-secondary btn-edit" onClick={() => setEditing(true)}>
              Edit profile
            </button>
          )}
        </div>

        {/* Logout Button Outside Container */}
        <button className="btn-logout" onClick={handleLogout}>
          Sign out
        </button>
      </div>

      <Navbar />
    </div>
  )
}