import React, { useState, lazy, Suspense } from 'react'
import styled from '@emotion/styled'

// Lazy load the ColorSchemeEditor component
const ColorSchemeEditor = lazy(() => import('./ColorSchemeEditor'))

interface SidebarProps {
  isCollapsed: boolean
  onToggle: () => void
}

const SidebarContainer = styled.div<{ isCollapsed: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  width: ${props => (props.isCollapsed ? '60px' : '280px')};
  background: var(--color-card-background);
  backdrop-filter: blur(10px);
  border-right: 1px solid var(--color-input-border);
  box-shadow: var(--shadow-card);
  transition:
    width 0.3s ease,
    transform 0.3s ease;
  z-index: 900;
  display: flex;
  flex-direction: column;
  overflow: hidden;

  @media (max-width: 768px) {
    width: 280px;
    transform: translateX(-100%);

    &.mobile-open {
      transform: translateX(0);
    }
  }
`

const SidebarHeader = styled.div`
  padding: 1rem;
  border-bottom: 1px solid var(--color-input-border);
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 70px;
`

const Logo = styled.div<{ isCollapsed: boolean }>`
  font-size: 1.25rem;
  font-weight: 700;
  background: var(--color-title-gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  opacity: ${props => (props.isCollapsed ? 0 : 1)};
  transition: opacity 0.3s ease;
  white-space: nowrap;
  overflow: hidden;
`

const ToggleButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 8px;
  color: var(--color-primary-text);
  transition: background-color 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: var(--color-input-border);
  }
`

const SidebarMenu = styled.div`
  flex: 1;
  padding: 1rem 0;
  overflow-y: auto;
`

const MenuItem = styled.button<{ isCollapsed: boolean }>`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.75rem 1rem;
  border: none;
  background: none;
  color: var(--color-primary-text);
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: left;
  border-radius: 0 25px 25px 0;
  margin-right: 1rem;

  &:hover {
    background: var(--color-input-border);
  }

  &:active {
    background: var(--color-primary);
    color: var(--color-button-text);
  }
`

const MenuIcon = styled.div`
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`

const MenuText = styled.span<{ isCollapsed: boolean }>`
  opacity: ${props => (props.isCollapsed ? 0 : 1)};
  transition: opacity 0.3s ease;
  white-space: nowrap;
  overflow: hidden;
  font-weight: 500;
`

const MainContentWrapper = styled.div<{ sidebarCollapsed: boolean }>`
  margin-left: ${props => (props.sidebarCollapsed ? '60px' : '280px')};
  transition: margin-left 0.3s ease;
  min-height: 100vh;

  @media (max-width: 768px) {
    margin-left: 0;
  }
`

const MobileOverlay = styled.div<{ isVisible: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  z-index: 850;
  display: ${props => (props.isVisible ? 'block' : 'none')};

  @media (min-width: 769px) {
    display: none;
  }
`

const LoadingSpinner = styled.div`
  width: 20px;
  height: 20px;
  border: 2px solid rgba(102, 126, 234, 0.3);
  border-top: 2px solid var(--color-primary);
  border-radius: 50%;
  animation: spin 1s linear infinite;

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`

// Hamburger menu icon component
const HamburgerIcon: React.FC = () => (
  <svg
    width='20'
    height='20'
    viewBox='0 0 24 24'
    fill='none'
    stroke='currentColor'
    strokeWidth='2'
  >
    <line x1='3' y1='6' x2='21' y2='6'></line>
    <line x1='3' y1='12' x2='21' y2='12'></line>
    <line x1='3' y1='18' x2='21' y2='18'></line>
  </svg>
)

// Color palette icon component
const ColorPaletteIcon: React.FC = () => (
  <svg
    width='20'
    height='20'
    viewBox='0 0 24 24'
    fill='none'
    stroke='currentColor'
    strokeWidth='2'
  >
    <circle cx='13.5' cy='6.5' r='.5'></circle>
    <circle cx='17.5' cy='10.5' r='.5'></circle>
    <circle cx='8.5' cy='7.5' r='.5'></circle>
    <circle cx='6.5' cy='12.5' r='.5'></circle>
    <path d='M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z'></path>
  </svg>
)

// Clock icon component
const ClockIcon: React.FC = () => (
  <svg
    width='20'
    height='20'
    viewBox='0 0 24 24'
    fill='none'
    stroke='currentColor'
    strokeWidth='2'
  >
    <circle cx='12' cy='12' r='10'></circle>
    <polyline points='12,6 12,12 16,14'></polyline>
  </svg>
)

const Sidebar: React.FC<SidebarProps> = ({ isCollapsed, onToggle }) => {
  const [isColorEditorOpen, setIsColorEditorOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const handleColorSchemeClick = () => {
    setIsColorEditorOpen(true)
    setIsMobileMenuOpen(false)
  }

  const handleCloseColorEditor = () => {
    setIsColorEditorOpen(false)
  }

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  return (
    <>
      {/* Mobile hamburger button */}
      <div
        style={{
          position: 'fixed',
          top: '1rem',
          left: '1rem',
          zIndex: 950,
          display: 'none',
        }}
        className='mobile-menu-toggle'
      >
        <ToggleButton onClick={toggleMobileMenu}>
          <HamburgerIcon />
        </ToggleButton>
      </div>

      {/* Mobile overlay */}
      <MobileOverlay
        isVisible={isMobileMenuOpen}
        onClick={() => setIsMobileMenuOpen(false)}
      />

      {/* Sidebar */}
      <SidebarContainer
        isCollapsed={isCollapsed}
        className={isMobileMenuOpen ? 'mobile-open' : ''}
      >
        <SidebarHeader>
          <Logo isCollapsed={isCollapsed}>Time Convert</Logo>
          <ToggleButton onClick={onToggle}>
            <HamburgerIcon />
          </ToggleButton>
        </SidebarHeader>

        <SidebarMenu>
          <MenuItem isCollapsed={isCollapsed} onClick={() => {}}>
            <MenuIcon>
              <ClockIcon />
            </MenuIcon>
            <MenuText isCollapsed={isCollapsed}>Time Converter</MenuText>
          </MenuItem>

          <MenuItem isCollapsed={isCollapsed} onClick={handleColorSchemeClick}>
            <MenuIcon>
              <ColorPaletteIcon />
            </MenuIcon>
            <MenuText isCollapsed={isCollapsed}>Color Themes</MenuText>
          </MenuItem>
        </SidebarMenu>
      </SidebarContainer>

      {/* Color Scheme Editor Modal */}
      {isColorEditorOpen && (
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
                  background: 'var(--color-card-background)',
                  borderRadius: '20px',
                  padding: '2rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                }}
              >
                <LoadingSpinner />
                <span style={{ color: 'var(--color-primary-text)' }}>
                  Loading Color Editor...
                </span>
              </div>
            </div>
          }
        >
          <ColorSchemeEditor
            isOpen={isColorEditorOpen}
            onClose={handleCloseColorEditor}
          />
        </Suspense>
      )}
    </>
  )
}

export { Sidebar, MainContentWrapper }
