import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import type { Capsule } from '../types'
import Navbar from '../components/Navbar'
import '../styles/OpenCapsule.css'

export default function OpenCapsule() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { state } = useAuth()
  const [capsule, setCapsule] = useState<Capsule | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [sharing, setSharing] = useState(false)
  const [shared, setShared] = useState(false)

  // fetch capsule by ID
  useEffect(() => {
    const fetchCapsule = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/capsules/${id}`, {
          headers: { Authorization: `Bearer ${state.token}` },
        })
        const data = await res.json()
        if (res.ok) {
          setCapsule(data)
          setShared(data.isPublic)
        } else {
          setError(data.message || 'Failed to load capsule')
        }
      } catch (err) {
        setError('Something went wrong')
      } finally {
        setLoading(false)
      }
    }

    if (id) fetchCapsule()
  }, [id, state.token])

  const handleShare = async () => {
  if (!capsule) return
  
  console.log('Capsule:', capsule)  // DEBUG
  console.log('Capsule ID:', capsule._id)  // DEBUG
  
  setSharing(true)
  try {
    const url = `http://localhost:5000/api/wall/${capsule._id}/share`
    console.log('Calling:', url)  // DEBUG
    
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${state.token}`,
      },
      body: JSON.stringify({ isAnonymous: false }),
    })
      if (res.ok) {
        setShared(true)
        alert('Shared to the emotional wall!')
      } else {
        setError('Failed to share')
      }
    } catch (err) {
      setError('Something went wrong')
    } finally {
      setSharing(false)
    }
  }

  if (loading) {
    return (
      <div className="open-capsule">
        <div className="page-header">
          <span className="page-logo">To the Next Version</span>
        </div>
        <p className="loading">Loading your capsule...</p>
        <Navbar />
      </div>
    )
  }

  if (error || !capsule) {
    return (
      <div className="open-capsule">
        <div className="page-header">
          <span className="page-logo">To the Next Version</span>
        </div>
        <p className="error-state">{error || 'Capsule not found'}</p>
        <button className="btn-secondary" onClick={() => navigate('/dashboard')}>
          ← Back to dashboard
        </button>
        <Navbar />
      </div>
    )
  }

  // check if capsule is unlocked
  const isUnlocked = !capsule.isLocked

  if (!isUnlocked) {
    return (
      <div className="open-capsule">
        <div className="page-header">
          <span className="page-logo">To the Next Version</span>
        </div>
        <div className="capsule-content">
          <button className="back-btn" onClick={() => navigate('/dashboard')}>
            ← Back
          </button>
          <div className="locked-message">
            <p className="locked-icon">🔒</p>
            <h2>This capsule is locked</h2>
            <p className="unlock-info">Opens on {new Date(capsule.unlockDate).toLocaleDateString()}</p>
            <button className="btn-secondary" onClick={() => navigate('/dashboard')}>
              Go back to dashboard
            </button>
          </div>
        </div>
        <Navbar />
      </div>
    )
  }

  // If unlocked, show the content
  return (
    <div className="open-capsule">
      <div className="page-header">
        <span className="page-logo">To the Next Version</span>
      </div>

      <div className="capsule-content">
        <button className="back-btn" onClick={() => navigate('/dashboard')}>
          ← Back
        </button>

        <div className="capsule-header-section">
          <h1 className="capsule-title-large">{capsule.title}</h1>
          <p className="capsule-meta">
            Written at age {capsule.currentAge} • Mood: {capsule.currentMood}
          </p>
          <p className="capsule-unlocked">
            🔓 Opened on {new Date(capsule.createdAt).toLocaleDateString()}
          </p>
        </div>

        {/* Letter content */}
        <div className="letter-section">
          <p className="letter-content">{capsule.message}</p>
        </div>

        {/* Snapshot of the moment */}
        <div className="snapshot-section">
          <h3 className="snapshot-title">A snapshot of this moment</h3>
          <div className="snapshot-grid">
            {capsule.currentSong && (
              <div className="snapshot-item">
                <span className="snapshot-label">🎵 Listening to</span>
                <p className="snapshot-value">{capsule.currentSong}</p>
              </div>
            )}
            {capsule.currentHobby && (
              <div className="snapshot-item">
                <span className="snapshot-label">🎨 Hobby</span>
                <p className="snapshot-value">{capsule.currentHobby}</p>
              </div>
            )}
          </div>
        </div>

        {/* Share section */}
        <div className="share-section">
          <p className="share-prompt">Want to share this with others?</p>
          <button
            className={`btn-primary ${shared ? 'shared' : ''}`}
            onClick={handleShare}
            disabled={sharing || shared}
          >
            {shared ? '✓ Shared to wall' : '📤 Share to emotional wall'}
          </button>
        </div>
      </div>

      <Navbar />
    </div>
  )
}