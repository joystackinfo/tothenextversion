import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import type { Capsule } from '../types'
import Navbar from '../components/Navbar'
import '../styles/Dashboard.css'

export default function Dashboard() {
  const { state } = useAuth()
  const navigate = useNavigate()
  const [capsules, setCapsules] = useState<Capsule[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'locked' | 'ready'>('all')
   const API_URL = import.meta.env.VITE_API_URL

  // fetch user's capsules on mount
  useEffect(() => {
    const fetchCapsules = async () => {
      try {
        const res = await fetch(`${API_URL}/api/capsules`, {
          headers: { Authorization: `Bearer ${state.token}` },
        })
        const data = await res.json()
        if (res.ok) setCapsules(data)
      } catch (err) {
        console.error('Failed to fetch capsules')
      } finally {
        setLoading(false)
      }
    }

    fetchCapsules()
  }, [state.token])

  // calculate stats
  const totalCapsules = capsules.length
  const lockedCapsules = capsules.filter(c => c.isLocked).length
  const readyCapsules = capsules.filter(c => !c.isLocked).length

  // filter capsules based on selected filter
  const filteredCapsules = capsules.filter(c => {
    if (filter === 'locked') return c.isLocked
    if (filter === 'ready') return !c.isLocked
    return true
  })

  const handleCapsuleClick = (id: string) => {
    navigate(`/capsules/${id}`)
  }

  return (
    <div className="dashboard" id="dashboard-container">
      {/* Logo header */}
      <div className="page-header">
        <span className="page-logo">To the Next Version</span>
      </div>

      <div className="dashboard-content">
        <h1 className="dashboard-greeting">Welcome back, {state.user?.name}</h1>

        {/* Stats section */}
        <div className="stats-grid">
          <div className="stat-card">
            <p className="stat-label">Total</p>
            <p className="stat-number">{totalCapsules}</p>
          </div>
          <div className="stat-card">
            <p className="stat-label">Locked</p>
            <p className="stat-number">{lockedCapsules}</p>
          </div>
          <div className="stat-card">
            <p className="stat-label">Ready</p>
            <p className="stat-number">{readyCapsules}</p>
          </div>
        </div>

        {/* Create button */}
        <button className="btn-primary btn-create" onClick={() => navigate('/create')}>
          ✍️ Create your first capsule
        </button>

        {/* Capsules list */}
        <div className="capsules-section">
          <div className="section-header">
            <h2 className="section-title">Your Capsules</h2>
            {/* Filter buttons */}
            <div className="filter-buttons" id="filter-buttons">
              <button
                className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
                onClick={() => setFilter('all')}
              >
                All
              </button>
              <button
                className={`filter-btn ${filter === 'locked' ? 'active' : ''}`}
                onClick={() => setFilter('locked')}
              >
                Locked
              </button>
              <button
                className={`filter-btn ${filter === 'ready' ? 'active' : ''}`}
                onClick={() => setFilter('ready')}
              >
                Ready
              </button>
            </div>
          </div>

          {loading ? (
            <p className="loading">Loading...</p>
          ) : filteredCapsules.length === 0 ? (
            <p className="empty-state">No capsules yet. Create one to get started!</p>
          ) : (
            <div className="capsules-list">
              {filteredCapsules.map(capsule => (
                <div
                  key={capsule._id}
                  className="capsule-card"
                  onClick={() => handleCapsuleClick(capsule._id)}
                >
                  <div className="capsule-header">
                    <h3 className="capsule-title">{capsule.title}</h3>
                    <span className={`capsule-badge ${capsule.isLocked ? 'locked' : 'unlocked'}`}>
                      {capsule.isLocked ? '🔒 Locked' : '🔓 Ready'}
                    </span>
                  </div>
                  <p className="capsule-date">Unlock: {new Date(capsule.unlockDate).toLocaleDateString()}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <Navbar />
    </div>
  )
}