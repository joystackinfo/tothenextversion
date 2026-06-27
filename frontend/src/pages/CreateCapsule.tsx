import { useState } from 'react'
import type { FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Navbar from '../components/Navbar'
import '../styles/CreateCapsule.css'

export default function CreateCapsule() {
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  
  // form state
  const [title, setTitle] = useState('')
  const [message, setMessage] = useState('')
  const [currentAge, setCurrentAge] = useState('')
  const [currentMood, setCurrentMood] = useState('')
  const [currentSong, setCurrentSong] = useState('')
  const [currentHobby, setCurrentHobby] = useState('')
  const [unlockDate, setUnlockDate] = useState('')
  const [isPublic, setIsPublic] = useState(false)
  const [photo, setPhoto] = useState<File | null>(null)
 const API_URL = import.meta.env.VITE_API_URL 

  const { state } = useAuth()
  const navigate = useNavigate()

  // validate step before moving next
  const validateStep = (currentStep: number): boolean => {
    if (currentStep === 1) {
      if (!title.trim() || !message.trim()) {
        setError('Title and message are required')
        return false
      }
    }
    if (currentStep === 2) {
      if (!currentAge || !currentMood) {
        setError('Age and mood are required')
        return false
      }
    }
    if (currentStep === 3) {
      if (!unlockDate) {
        setError('Unlock date is required')
        return false
      }
    }
    setError('')
    return true
  }

  const handleNext = () => {
    if (validateStep(step)) {
      setStep(step + 1)
    }
  }

  const handlePrev = () => {
    setError('')
    setStep(step - 1)
  }

 const [showConfirm, setShowConfirm] = useState(false)

const handleSubmit = async (e: FormEvent) => {
  e.preventDefault()
  if (!validateStep(3)) return

  setLoading(true)
  try {
    const formData = new FormData()
    formData.append('title', title)
    formData.append('message', message)
    formData.append('currentAge', currentAge)
    formData.append('currentMood', currentMood)
    formData.append('currentSong', currentSong)
    formData.append('currentHobby', currentHobby)
    formData.append('unlockDate', unlockDate)
    formData.append('isPublic', String(isPublic))
    if (photo) formData.append('photo', photo)

    const res = await fetch(`${API_URL}/api/capsules`,{
      method: 'POST',
      headers: { Authorization: `Bearer ${state.token}` },
      body: formData,
    })

    // parse response FIRST
    const data = await res.json()

    if (!res.ok) {
      setError(data.message || 'Failed to create capsule')
      return
    }

    setShowConfirm(true)
    setTimeout(() => {
      navigate('/dashboard')
    }, 2000)
  } catch (err) {
    setError('Something went wrong. Try again.')
  } finally {
    setLoading(false)
  }
}

return (
  <div className="create-page">
    {/* Logo header */}
    <div className="page-header">
      <span className="page-logo">To the Next Version</span>
    </div>

    <div className="create-content">
      {/* Progress indicator */}
      <div className="progress-bar">
        <div className="progress-fill" style={{ width: `${(step / 3) * 100}%` }}></div>
      </div>
      <p className="progress-text">Step {step} of 3</p>

      <form onSubmit={handleSubmit}>
        {/* Step 1: The Letter */}
        {step === 1 && (
          <div className="form-step" id="create-step-1">
            <h2 className="step-title">Start your time capsule</h2>
            <p className="step-subtitle">A message to your future self</p>

            <div className="field">
              <label>Title</label>
              <input
                type="text"
                placeholder="What's this letter about?"
                value={title}
                onChange={e => setTitle(e.target.value)}
              />
            </div>

            <div className="field">
              <label>Your Letter</label>
              <textarea
                placeholder="Dear future me,

I'm writing this to you on [date]. Right now I'm feeling [mood], and I want you to remember...

No word limit. Write freely."
                value={message}
                onChange={e => setMessage(e.target.value)}
                rows={10}
              ></textarea>
            </div>
          </div>
        )}
          {/* Step 2: About You */}
          {step === 2 && (
            <div className="form-step" id="create-step-2">
              <h2 className="step-title">About you right now</h2>
              <p className="step-subtitle">Capture this moment</p>

              <div className="field">
                <label>How old are you?</label>
                <input
                  type="number"
                  placeholder="Your age"
                  value={currentAge}
                  onChange={e => setCurrentAge(e.target.value)}
                />
              </div>

              <div className="field">
                <label>Your mood</label>
                <select value={currentMood} onChange={e => setCurrentMood(e.target.value)}>
                  <option value="">Select a mood</option>
                  <option value="happy">😊 Happy</option>
                  <option value="sad">😢 Sad</option>
                  <option value="excited">🤩 Excited</option>
                  <option value="anxious">😰 Anxious</option>
                  <option value="calm">😌 Calm</option>
                  <option value="confused">😕 Confused</option>
                </select>
              </div>

              <div className="field">
                <label>Your favorite song (optional)</label>
                <input
                  type="text"
                  placeholder="What are you listening to?"
                  value={currentSong}
                  onChange={e => setCurrentSong(e.target.value)}
                />
              </div>

              <div className="field">
                <label>Your hobby (optional)</label>
                <input
                  type="text"
                  placeholder="What do you love doing?"
                  value={currentHobby}
                  onChange={e => setCurrentHobby(e.target.value)}
                />
              </div>
            </div>
          )}

          {/* Step 3: Settings */}
          {step === 3 && (
            <div className="form-step" id="create-step-3">
              <h2 className="step-title">Seal your capsule</h2>
              <p className="step-subtitle">When should you open this?</p>

              <div className="field">
                <label>Unlock date</label>
                <input
                  type="date"
                  value={unlockDate}
                  onChange={e => setUnlockDate(e.target.value)}
                />
              </div>

              <div className="field checkbox">
                <input
                  type="checkbox"
                  id="isPublic"
                  checked={isPublic}
                  onChange={e => setIsPublic(e.target.checked)}
                />
                <label htmlFor="isPublic">Share on the emotional wall when opened</label>
              </div>

              <div className="field">
                <label>Add a photo (optional)</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={e => setPhoto(e.target.files?.[0] || null)}
                />
              </div>
            </div>
          )}

          {/* Error message */}
          {error && <p className="error-message">{error}</p>}

          {/* Navigation buttons */}
          <div className="form-buttons">
            {step > 1 && (
              <button type="button" className="btn-secondary" onClick={handlePrev}>
                ← Previous
              </button>
            )}
            {step < 3 && (
              <button type="button" className="btn-primary" onClick={handleNext}>
                Next →
              </button>
            )}
            {step === 3 && (
              <button type="submit" className="btn-primary" disabled={loading}>
                {loading ? 'Sealing...' : 'Seal capsule'}
              </button>

            )}
            
      {/* Confirmation modal INSIDE return */}
      {showConfirm && (
        <div className="confirmation-modal">
          <div className="modal-content">
            <p className="modal-message">"It's sealed. See you later."</p>
            <div className="loader"></div>
          </div>
        </div>
      )}
          </div>
        </form>
      </div>

    <Navbar />
  </div>
) 
}