import { useTour } from '../context/TourContext'
import { useEffect } from 'react'

export default function TourModal() {
  const { showTour, currentStep, nextStep, skipTour, step } = useTour()

  useEffect(() => {
    if (showTour && step?.highlightId) {
      // Highlight the element
      const element = document.getElementById(step.highlightId)
      if (element) {
        element.style.outline = '2px solid #C17A3A'
        element.style.outlineOffset = '4px'
        element.style.borderRadius = '8px'
        element.style.boxShadow = '0 0 0 4px rgba(193, 122, 58, 0.15)'
        return () => {
          element.style.outline = 'none'
          element.style.boxShadow = 'none'
        }
      }
    }
  }, [showTour, step?.highlightId])

  if (!showTour || !step) return null

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(0, 0, 0, 0.4)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
    }}>
      <div style={{
        background: '#F5E6D0',
        border: '1px solid #E8D5BB',
        borderRadius: '12px',
        padding: '1.5rem',
        width: '90%',
        maxWidth: '380px',
        boxShadow: '0 4px 16px rgba(61, 43, 31, 0.15)',
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1rem',
        }}>
          <h2 style={{
            margin: 0,
            fontSize: '16px',
            fontWeight: 600,
            color: '#3D2B1F',
          }}>
            {step.title}
          </h2>
          <span style={{
            fontSize: '12px',
            color: '#7C4A1E',
            fontWeight: 500,
          }}>
            {currentStep + 1}/10
          </span>
        </div>

        <p style={{
          margin: '0 0 1.5rem 0',
          fontSize: '14px',
          lineHeight: 1.6,
          color: '#3D2B1F',
        }}>
          {step.body}
        </p>

        <div style={{
          display: 'flex',
          gap: '10px',
        }}>
          <button
            onClick={skipTour}
            style={{
              flex: 1,
              padding: '9px 14px',
              background: 'transparent',
              border: '0.5px solid #C17A3A',
              borderRadius: '6px',
              color: '#3D2B1F',
              fontSize: '13px',
              fontWeight: 500,
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(193, 122, 58, 0.05)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent'
            }}
          >
            Skip
          </button>
          <button
            onClick={nextStep}
            style={{
              flex: 1,
              padding: '9px 14px',
              background: '#C17A3A',
              border: 'none',
              borderRadius: '6px',
              color: '#FDF6EE',
              fontSize: '13px',
              fontWeight: 500,
              cursor: 'pointer',
              transition: 'all 0.2s',
              boxShadow: '0 0 0 3px rgba(255, 255, 255, 0.35)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-1px)'
              e.currentTarget.style.boxShadow = '0 0 0 3px rgba(255, 255, 255, 0.5)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.boxShadow = '0 0 0 3px rgba(255, 255, 255, 0.35)'
            }}
          >
            {currentStep === 9 ? 'Done' : 'Next →'}
          </button>
        </div>
      </div>
    </div>
  )
}