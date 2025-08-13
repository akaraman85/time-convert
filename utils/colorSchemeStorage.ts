import { ColorScheme, defaultColorScheme } from '../types/colorScheme'

const STORAGE_KEY = 'timeConvert_colorSchemes'
const CURRENT_SCHEME_KEY = 'timeConvert_currentScheme'

export const colorSchemeStorage = {
  // Get all custom color schemes from localStorage
  getCustomSchemes(): ColorScheme[] {
    if (typeof window === 'undefined') return []

    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      return stored ? JSON.parse(stored) : []
    } catch (error) {
      console.error('Error loading custom color schemes:', error)
      return []
    }
  },

  // Save a custom color scheme to localStorage
  saveCustomScheme(scheme: ColorScheme): void {
    if (typeof window === 'undefined') return

    try {
      const existing = this.getCustomSchemes()
      const updated = existing.filter(s => s.id !== scheme.id)
      updated.push(scheme)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
    } catch (error) {
      console.error('Error saving custom color scheme:', error)
    }
  },

  // Delete a custom color scheme from localStorage
  deleteCustomScheme(id: string): void {
    if (typeof window === 'undefined') return

    try {
      const existing = this.getCustomSchemes()
      const updated = existing.filter(s => s.id !== id)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
    } catch (error) {
      console.error('Error deleting custom color scheme:', error)
    }
  },

  // Get the currently active color scheme
  getCurrentScheme(): ColorScheme {
    if (typeof window === 'undefined') return defaultColorScheme

    try {
      const stored = localStorage.getItem(CURRENT_SCHEME_KEY)
      return stored ? JSON.parse(stored) : defaultColorScheme
    } catch (error) {
      console.error('Error loading current color scheme:', error)
      return defaultColorScheme
    }
  },

  // Set the currently active color scheme
  setCurrentScheme(scheme: ColorScheme): void {
    if (typeof window === 'undefined') return

    try {
      localStorage.setItem(CURRENT_SCHEME_KEY, JSON.stringify(scheme))
    } catch (error) {
      console.error('Error saving current color scheme:', error)
    }
  },

  // Clear all stored color schemes (reset to default)
  clearAll(): void {
    if (typeof window === 'undefined') return

    try {
      localStorage.removeItem(STORAGE_KEY)
      localStorage.removeItem(CURRENT_SCHEME_KEY)
    } catch (error) {
      console.error('Error clearing color schemes:', error)
    }
  },
}
