import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react'
import {
  ColorScheme,
  ColorSchemeContextType,
  defaultColorScheme,
  presetColorSchemes,
} from '../types/colorScheme'
import { colorSchemeStorage } from '../utils/colorSchemeStorage'

const ColorSchemeContext = createContext<ColorSchemeContextType | undefined>(
  undefined
)

interface ColorSchemeProviderProps {
  children: ReactNode
}

export const ColorSchemeProvider: React.FC<ColorSchemeProviderProps> = ({
  children,
}) => {
  const [currentScheme, setCurrentSchemeState] =
    useState<ColorScheme>(defaultColorScheme)
  const [customSchemes, setCustomSchemes] = useState<ColorScheme[]>([])

  // Load saved schemes on mount
  useEffect(() => {
    const savedScheme = colorSchemeStorage.getCurrentScheme()
    const savedCustomSchemes = colorSchemeStorage.getCustomSchemes()

    setCurrentSchemeState(savedScheme)
    setCustomSchemes(savedCustomSchemes)
  }, [])

  // Apply CSS custom properties when scheme changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const root = document.documentElement
      const { colors, shadows } = currentScheme

      // Set CSS custom properties
      root.style.setProperty('--color-page-background', colors.pageBackground)
      root.style.setProperty('--color-card-background', colors.cardBackground)
      root.style.setProperty('--color-primary-text', colors.primaryText)
      root.style.setProperty('--color-secondary-text', colors.secondaryText)
      root.style.setProperty('--color-title-gradient', colors.titleGradient)
      root.style.setProperty(
        '--color-button-background',
        colors.buttonBackground
      )
      root.style.setProperty('--color-button-text', colors.buttonText)
      root.style.setProperty('--color-button-hover', colors.buttonHover)
      root.style.setProperty('--color-input-border', colors.inputBorder)
      root.style.setProperty('--color-input-focus', colors.inputFocus)
      root.style.setProperty('--color-input-background', colors.inputBackground)
      root.style.setProperty('--color-primary', colors.primary)
      root.style.setProperty('--color-secondary', colors.secondary)
      root.style.setProperty('--color-success', colors.success)
      root.style.setProperty('--color-warning', colors.warning)
      root.style.setProperty('--color-error', colors.error)

      root.style.setProperty('--shadow-card', shadows.card)
      root.style.setProperty('--shadow-button', shadows.button)
      root.style.setProperty('--shadow-input', shadows.input)
    }
  }, [currentScheme])

  const setCurrentScheme = (scheme: ColorScheme) => {
    setCurrentSchemeState(scheme)
    colorSchemeStorage.setCurrentScheme(scheme)
  }

  const saveCustomScheme = (scheme: ColorScheme) => {
    colorSchemeStorage.saveCustomScheme(scheme)
    setCustomSchemes(prev => {
      const filtered = prev.filter(s => s.id !== scheme.id)
      return [...filtered, scheme]
    })
  }

  const deleteCustomScheme = (id: string) => {
    colorSchemeStorage.deleteCustomScheme(id)
    setCustomSchemes(prev => prev.filter(s => s.id !== id))

    // If the deleted scheme was active, switch to default
    if (currentScheme.id === id) {
      setCurrentScheme(defaultColorScheme)
    }
  }

  const resetToDefault = () => {
    colorSchemeStorage.clearAll()
    setCurrentScheme(defaultColorScheme)
    setCustomSchemes([])
  }

  const value: ColorSchemeContextType = {
    currentScheme,
    customSchemes,
    setCurrentScheme,
    saveCustomScheme,
    deleteCustomScheme,
    resetToDefault,
  }

  return (
    <ColorSchemeContext.Provider value={value}>
      {children}
    </ColorSchemeContext.Provider>
  )
}

export const useColorScheme = (): ColorSchemeContextType => {
  const context = useContext(ColorSchemeContext)
  if (context === undefined) {
    throw new Error('useColorScheme must be used within a ColorSchemeProvider')
  }
  return context
}

// Helper hook to get all available schemes (presets + custom)
export const useAllColorSchemes = () => {
  const { customSchemes } = useColorScheme()
  return [...presetColorSchemes, ...customSchemes]
}
