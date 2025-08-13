import React, { useState, useEffect } from 'react'
import { Sidebar, MainContentWrapper } from './Sidebar'

interface LayoutProps {
  children: React.ReactNode
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)

  // Load sidebar state from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('timeConvert_sidebarCollapsed')
      if (saved !== null) {
        setIsSidebarCollapsed(JSON.parse(saved))
      }
    }
  }, [])

  // Save sidebar state to localStorage
  const toggleSidebar = () => {
    const newState = !isSidebarCollapsed
    setIsSidebarCollapsed(newState)
    if (typeof window !== 'undefined') {
      localStorage.setItem(
        'timeConvert_sidebarCollapsed',
        JSON.stringify(newState)
      )
    }
  }

  return (
    <>
      <Sidebar isCollapsed={isSidebarCollapsed} onToggle={toggleSidebar} />
      <MainContentWrapper sidebarCollapsed={isSidebarCollapsed}>
        {children}
      </MainContentWrapper>
    </>
  )
}

export default Layout
