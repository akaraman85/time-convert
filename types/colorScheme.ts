export interface ColorScheme {
  id: string
  name: string
  colors: {
    // Background colors/gradients
    pageBackground: string
    cardBackground: string

    // Text colors
    primaryText: string
    secondaryText: string
    titleGradient: string

    // Interactive elements
    buttonBackground: string
    buttonText: string
    buttonHover: string

    // Form elements
    inputBorder: string
    inputFocus: string
    inputBackground: string

    // Accent colors
    primary: string
    secondary: string

    // Status colors
    success: string
    warning: string
    error: string
  }
  shadows: {
    card: string
    button: string
    input: string
  }
}

export interface ColorSchemeContextType {
  currentScheme: ColorScheme
  customSchemes: ColorScheme[]
  setCurrentScheme: (scheme: ColorScheme) => void
  saveCustomScheme: (scheme: ColorScheme) => void
  deleteCustomScheme: (id: string) => void
  resetToDefault: () => void
}

export const defaultColorScheme: ColorScheme = {
  id: 'default',
  name: 'Default',
  colors: {
    pageBackground: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    cardBackground: 'rgba(255, 255, 255, 0.95)',

    primaryText: '#1a202c',
    secondaryText: '#666',
    titleGradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',

    buttonBackground: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    buttonText: '#ffffff',
    buttonHover: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',

    inputBorder: '#e1e5e9',
    inputFocus: '#667eea',
    inputBackground: '#ffffff',

    primary: '#667eea',
    secondary: '#764ba2',

    success: '#48bb78',
    warning: '#ed8936',
    error: '#f56565',
  },
  shadows: {
    card: '0 20px 40px rgba(0, 0, 0, 0.1)',
    button: '0 4px 15px rgba(102, 126, 234, 0.4)',
    input: '0 0 0 3px rgba(102, 126, 234, 0.1)',
  },
}

export const presetColorSchemes: ColorScheme[] = [
  defaultColorScheme,
  {
    id: 'ocean',
    name: 'Ocean Breeze',
    colors: {
      pageBackground: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      cardBackground: 'rgba(255, 255, 255, 0.9)',

      primaryText: '#2d3748',
      secondaryText: '#4a5568',
      titleGradient: 'linear-gradient(135deg, #4299e1 0%, #3182ce 100%)',

      buttonBackground: 'linear-gradient(135deg, #4299e1 0%, #3182ce 100%)',
      buttonText: '#ffffff',
      buttonHover: 'linear-gradient(135deg, #3182ce 0%, #2c5282 100%)',

      inputBorder: '#cbd5e0',
      inputFocus: '#4299e1',
      inputBackground: '#ffffff',

      primary: '#4299e1',
      secondary: '#3182ce',

      success: '#38a169',
      warning: '#d69e2e',
      error: '#e53e3e',
    },
    shadows: {
      card: '0 20px 40px rgba(66, 153, 225, 0.15)',
      button: '0 4px 15px rgba(66, 153, 225, 0.4)',
      input: '0 0 0 3px rgba(66, 153, 225, 0.1)',
    },
  },
  {
    id: 'sunset',
    name: 'Sunset Glow',
    colors: {
      pageBackground: 'linear-gradient(135deg, #ff6b6b 0%, #feca57 100%)',
      cardBackground: 'rgba(255, 255, 255, 0.95)',

      primaryText: '#2d3748',
      secondaryText: '#4a5568',
      titleGradient: 'linear-gradient(135deg, #ff6b6b 0%, #feca57 100%)',

      buttonBackground: 'linear-gradient(135deg, #ff6b6b 0%, #feca57 100%)',
      buttonText: '#ffffff',
      buttonHover: 'linear-gradient(135deg, #ff5252 0%, #ffb142 100%)',

      inputBorder: '#fed7d7',
      inputFocus: '#ff6b6b',
      inputBackground: '#ffffff',

      primary: '#ff6b6b',
      secondary: '#feca57',

      success: '#68d391',
      warning: '#f6ad55',
      error: '#fc8181',
    },
    shadows: {
      card: '0 20px 40px rgba(255, 107, 107, 0.15)',
      button: '0 4px 15px rgba(255, 107, 107, 0.4)',
      input: '0 0 0 3px rgba(255, 107, 107, 0.1)',
    },
  },
  {
    id: 'forest',
    name: 'Forest Green',
    colors: {
      pageBackground: 'linear-gradient(135deg, #48bb78 0%, #38a169 100%)',
      cardBackground: 'rgba(255, 255, 255, 0.95)',

      primaryText: '#1a202c',
      secondaryText: '#4a5568',
      titleGradient: 'linear-gradient(135deg, #48bb78 0%, #38a169 100%)',

      buttonBackground: 'linear-gradient(135deg, #48bb78 0%, #38a169 100%)',
      buttonText: '#ffffff',
      buttonHover: 'linear-gradient(135deg, #38a169 0%, #2f855a 100%)',

      inputBorder: '#c6f6d5',
      inputFocus: '#48bb78',
      inputBackground: '#ffffff',

      primary: '#48bb78',
      secondary: '#38a169',

      success: '#68d391',
      warning: '#f6ad55',
      error: '#fc8181',
    },
    shadows: {
      card: '0 20px 40px rgba(72, 187, 120, 0.15)',
      button: '0 4px 15px rgba(72, 187, 120, 0.4)',
      input: '0 0 0 3px rgba(72, 187, 120, 0.1)',
    },
  },
  {
    id: 'dark',
    name: 'Dark Mode',
    colors: {
      pageBackground: 'linear-gradient(135deg, #0f0f23 0%, #1a1a2e 100%)',
      cardBackground: 'rgba(30, 30, 50, 0.95)',

      primaryText: '#e2e8f0',
      secondaryText: '#a0aec0',
      titleGradient: 'linear-gradient(135deg, #7c3aed 0%, #3b82f6 100%)',

      buttonBackground: 'linear-gradient(135deg, #7c3aed 0%, #3b82f6 100%)',
      buttonText: '#ffffff',
      buttonHover: 'linear-gradient(135deg, #6d28d9 0%, #2563eb 100%)',

      inputBorder: '#4a5568',
      inputFocus: '#7c3aed',
      inputBackground: '#2d3748',

      primary: '#7c3aed',
      secondary: '#3b82f6',

      success: '#10b981',
      warning: '#f59e0b',
      error: '#ef4444',
    },
    shadows: {
      card: '0 20px 40px rgba(0, 0, 0, 0.4)',
      button: '0 4px 15px rgba(124, 58, 237, 0.4)',
      input: '0 0 0 3px rgba(124, 58, 237, 0.1)',
    },
  },
]
