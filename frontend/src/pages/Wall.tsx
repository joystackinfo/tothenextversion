import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import type { Capsule } from '../types'
import Navbar from '../components/Navbar'
import '../styles/Wall.css'

export default function Wall() {
  const { state } = useAuth()
  const [capsules, setCapsules] = useState<Capsule[]>([])
  const [loading, setLoading] = useState(true)
  const [likes, setLikes] = useState<{ [key: string]: number }>({})
  const [likedByMe, setLikedByMe] = useState<{ [key: string]: boolean }>({})
     const API_URL = import.meta.env.VITE_API_URL

  // fetch public capsules
  useEffect(() => {
    const fetchWall = async () => {
      try {
        const res = await fetch(`${API_URL}/api/wall`, {
          headers: { Authorization: `Bearer ${state.token}` },
        })
        const data = await res.json()
        if (res.ok) {
          setCapsules(data)
          // initialize likes FROM backend response
          const initialLikes: { [key: string]: number } = {}
          const initialLikedByMe: { [key: string]: boolean } = {}
          
          data.forEach((capsule: any) => {
            initialLikes[capsule._id] = capsule.likes || 0

            initialLikedByMe[capsule._id] = capsule.likedBy?.includes(state.user?._id) || false
          })
          setLikes(initialLikes)
          setLikedByMe(initialLikedByMe)
        }
      } catch (err) {
        console.error('Failed to fetch wall')
      } finally {
        setLoading(false)
      }
    }
    fetchWall()
  }, [state.token])

  // format days ago
  const formatDaysAgo = (date: string) => {
    const now = new Date()
    const created = new Date(date)
    const diffTime = Math.abs(now.getTime() - created.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays === 0 ? 'today' : diffDays === 1 ? '1 day ago' : `${diffDays}d ago`
  }

  // toggle like/unlike
  const handleLike = async (postId: string) => {
    const isCurrentlyLiked = likedByMe[postId]
    
    // Update UI immediately
    setLikedByMe(prev => ({
      ...prev,
      [postId]: !prev[postId],
    }))
    setLikes(prev => ({
      ...prev,
      [postId]: prev[postId] + (isCurrentlyLiked ? -1 : 1),
    }))

    // Save to backend if liking
   
      try {
        const res = await fetch(`${API_URL}api/wall/${postId}/like`, {
          method: 'PATCH',
          headers: { Authorization: `Bearer ${state.token}` },
        })
        if (!res.ok) {
          console.error('Failed to save like')
        }
      } catch (err) {
        console.error('Failed to save like', err)
      }
    
  }

  return (
    <div className="wall-page">
      <div className="page-header">
        <span className="page-logo">To the Next Version</span>
      </div>

      <div className="wall-content">
        <h1 className="wall-title">The Emotional Wall</h1>
        <p className="wall-subtitle">Messages from futures that have arrived</p>

        {loading ? (
          <p className="loading">Loading emotional wall...</p>
        ) : capsules.length === 0 ? (
          <p className="empty-state">No capsules shared yet. Be the first to share yours.</p>
        ) : (
          <div className="wall-list">
            {capsules.map(capsule => (
              <div key={capsule._id} className="wall-card">
                <div className="card-top">
                  <p className="username">@{capsule.user}</p>
                </div>

                <h2 className="card-title">{capsule.title}</h2>

                <p className="card-message">{capsule.message}</p>

                <p className="card-meta">
                  Age {capsule.currentAge} • {capsule.currentMood}
                  {capsule.currentSong && ` • 🎵 ${capsule.currentSong}`}
                </p>

                <div className="card-bottom">
                  <span className="shared-time">Shared {formatDaysAgo(capsule.createdAt)}</span>
                  <button
                    className={`like-btn ${likedByMe[capsule._id] ? 'liked' : ''}`}
                    onClick={() => handleLike(capsule._id)}
                  >
                    {likedByMe[capsule._id] ? '❤️' : '🤍'} {likes[capsule._id] || 0}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Navbar />
    </div>
  )
}