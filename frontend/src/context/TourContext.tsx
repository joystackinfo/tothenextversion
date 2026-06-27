import { createContext, useContext, useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

import type { ReactNode } from 'react'
import { useAuth } from './AuthContext'


interface TourStep {
  title: string
  body: string
  page: string
  highlightId?: string // element to highlight
}

interface TourContextType {
  currentStep: number
  showTour: boolean
  nextStep: () => void
  skipTour: () => void
  step: TourStep | null
}

const TourContext = createContext<TourContextType | null>(null)

const TOUR_STEPS: TourStep[] = [
  { title: 'Your Dashboard', body: 'This is your personal timeline. Every capsule you write becomes a memory waiting for your future self', page: '/dashboard', highlightId: 'dashboard-container' },
  { title: 'Filter Your Capsules', body: 'Find exactly what you\'re looking for. Switch between all capsules, the ones still waiting or the ones ready to be opened', page: '/dashboard', highlightId: 'filter-buttons' },
  { title: 'Write a Letter', body: 'Start by writing your title and message. Be honest, be you. Your future self is listening.', page: '/create', highlightId: 'create-step-1' },
  { title: 'About You Right Now', body: ' Capture who you are today. Your age, mood, favorite song, and hobbies may surprise your future self', page: '/create', highlightId: 'create-step-2' },
  { title: 'Set Your Unlock Date', body: 'Choose when your future self should read this. Once it\'s sealed, the message can\'t be changed', page: '/create', highlightId: 'create-step-3' },
  { title: 'The Emotional Wall', body: 'See letters from others who\'ve shared theirs. These are real people, real moments, real growth.', page: '/wall', highlightId: 'wall-container' },
  { title: 'Read & React', body: 'Click a card to read the full letter. If it moves you, give it a heart. They\'ll know someone cared.', page: '/wall', highlightId: 'wall-card' },
  { title: 'Your Profile', body: 'This is your account space. See your stats, edit your info, sign out.', page: '/profile', highlightId: 'profile-container' },
  { title: 'Your Stats', body: 'Total capsules written, opened, and hearts received. Watch your growth.', page: '/profile', highlightId: 'stats-section' },
  { title: 'Edit Your Profile', body: 'Update your username and tagline. Tell people who you are becoming.', page: '/profile', highlightId: 'edit-section' },
]

export function TourProvider({ children }: { children: ReactNode }) {
  const navigate = useNavigate()
  const location = useLocation()
  const [currentStep, setCurrentStep] = useState(0)
  const [showTour, setShowTour] = useState(false)

  const { state } = useAuth()

  const tourKey = `ttnv_tour_completed_${state.user?._id}`


  // Check if tour should show on mount - ONLY on dashboard
  useEffect(() => {
    if(!state.user) return
      const tourCompleted = localStorage.getItem(tourKey)
    const userLoggedIn = localStorage.getItem('ttnv_token')
    
    if (userLoggedIn && !tourCompleted && location.pathname === '/dashboard') {
      setShowTour(true)
      setCurrentStep(0)
    } else if (location.pathname !== '/dashboard' && location.pathname !== '/login' && location.pathname !== '/register' && location.pathname !== '/') {
      // User is on protected route but tour already started
      if (!tourCompleted && userLoggedIn) {
        setShowTour(true)
      }
    }
  }, [location.pathname])

  const nextStep = () => {
    if (currentStep < TOUR_STEPS.length - 1) {
      const nextStepData = TOUR_STEPS[currentStep + 1]
      navigate(nextStepData.page)
      setCurrentStep(currentStep + 1)
    } else {
      // Tour complete
      skipTour()
    }
  }

  const skipTour = () => {
    localStorage.setItem(tourKey, 'true')
    setShowTour(false)
    setCurrentStep(0)
  }

  const step = TOUR_STEPS[currentStep] || null

  return (
    <TourContext.Provider value={{ currentStep, showTour, nextStep, skipTour, step }}>
      {children}
    </TourContext.Provider>
  )
}

export function useTour() {
  const context = useContext(TourContext)
  if (!context) throw new Error('useTour must be used inside TourProvider')
  return context
}