import React, { useState, lazy, Suspense } from 'react'
import styled from '@emotion/styled'

// Lazy load the ColorSchemeEditor component
const ColorSchemeEditor = lazy(() => import('./ColorSchemeEditor'))

const Button = styled.button`
  position: fixed
  top: 1rem
  right: 1rem
  width: 50px
  height: 50px
  border-radius: 50%
  background: var(--color-button-background, linear-gradient(135deg, #667eea 0%, #764ba2 100%))
  border: none
  cursor: pointer
  display: flex
  align-items: center
  justify-content: center
  box-shadow: var(--shadow-button, 0 4px 15px rgba(102, 126, 234, 0.4))
  transition: all 0.3s ease
  z-index: 999
  
  &:hover {
    background: var(--color-button-hover, linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%))
    transform: translateY(-2px)
    box-shadow: 0 6px 20px rgba(102, 126, 234, 0.5)
  }
  
  &:active {
    transform: translateY(0)
  }
  
  @media (max-width: 768px) {
    width: 45px
    height: 45px
    top: 0.75rem
    right: 0.75rem
  }
`

const Icon = styled.div`
  width: 24px
  height: 24px
  position: relative
  
  &::before,
  &::after {
    content: ''
    position: absolute
    border-radius: 50%
  }
  
  &::before {
    top: 0
    left: 0
    width: 12px
    height: 12px
    background: #ff6b6b
  }
  
  &::after {
    bottom: 0
    right: 0
    width: 12px
    height: 12px
    background: #4ecdc4
  }
`

const LoadingSpinner = styled.div`
  width: 20px
  height: 20px
  border: 2px solid rgba(255, 255, 255, 0.3)
  border-top: 2px solid white
  border-radius: 50%
  animation: spin 1s linear infinite
  
  @keyframes spin {
    0% { transform: rotate(0deg) }
    100% { transform: rotate(360deg) }
  }
`

const ColorSchemeButton: React.FC = () => {
  const [isEditorOpen, setIsEditorOpen] = useState(false)

  const handleClick = () => {
    setIsEditorOpen(true)
  }

  const handleClose = () => {
    setIsEditorOpen(false)
  }

  return (
    <>
      <Button onClick={handleClick} title='Customize Color Scheme'>
        <Icon />
      </Button>

      {isEditorOpen && (
        <Suspense
          fallback={
            <div
              style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'rgba(0, 0, 0, 0.5)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 1000,
              }}
            >
              <div
                style={{
                  background:
                    'var(--color-card-background, rgba(255, 255, 255, 0.95))',
                  borderRadius: '20px',
                  padding: '2rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                }}
              >
                <LoadingSpinner />
                <span style={{ color: 'var(--color-primary-text, #1a202c)' }}>
                  Loading Color Editor...
                </span>
              </div>
            </div>
          }
        >
          <ColorSchemeEditor isOpen={isEditorOpen} onClose={handleClose} />
        </Suspense>
      )}
    </>
  )
}

export default ColorSchemeButton
