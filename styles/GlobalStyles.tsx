import { Global, css } from '@emotion/react'
import React from 'react'

const globalStyles = css({
  ':root': {
    // Default color scheme variables (will be overridden by ColorSchemeProvider)
    '--color-page-background':
      'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    '--color-card-background': 'rgba(255, 255, 255, 0.95)',
    '--color-primary-text': '#1a202c',
    '--color-secondary-text': '#666',
    '--color-title-gradient':
      'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    '--color-button-background':
      'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    '--color-button-text': '#ffffff',
    '--color-button-hover': 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
    '--color-input-border': '#e1e5e9',
    '--color-input-focus': '#667eea',
    '--color-input-background': '#ffffff',
    '--color-primary': '#667eea',
    '--color-secondary': '#764ba2',
    '--color-success': '#48bb78',
    '--color-warning': '#ed8936',
    '--color-error': '#f56565',
    '--shadow-card': '0 20px 40px rgba(0, 0, 0, 0.1)',
    '--shadow-button': '0 4px 15px rgba(102, 126, 234, 0.4)',
    '--shadow-input': '0 0 0 3px rgba(102, 126, 234, 0.1)',
  },
  '*': {
    boxSizing: 'border-box',
    padding: 0,
    margin: 0,
  },
  'html, body': {
    maxWidth: '100vw',
    overflowX: 'hidden',
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    background: 'var(--color-page-background)',
    minHeight: '100vh',
  },
  a: {
    color: 'inherit',
    textDecoration: 'none',
  },
  '.container': {
    margin: '0 auto',
    padding: '2rem',
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    gap: '2rem',
    '@media (min-width: 768px)': {
      flexDirection: 'row',
    },
    '@media (max-width: 768px)': {
      padding: '1rem',
      paddingTop: '4rem', // Space for mobile menu button
    },
  },
  '.mobile-menu-toggle': {
    '@media (max-width: 768px)': {
      display: 'block !important',
    },
  },
  '.card': {
    background: 'var(--color-card-background)',
    backdropFilter: 'blur(10px)',
    borderRadius: '20px',
    padding: '2rem',
    boxShadow: 'var(--shadow-card)',
    width: '100%',
    maxWidth: '600px',
    '@media (max-width: 768px)': {
      padding: '1rem',
    },
  },
  '.title': {
    fontSize: '2rem',
    fontWeight: 700,
    textAlign: 'left',
    marginBottom: '0.5rem',
    background: 'var(--color-title-gradient)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
  },
  '.subtitle': {
    textAlign: 'left',
    color: 'var(--color-secondary-text)',
    marginBottom: '2rem',
    fontSize: '0.9rem',
  },
  '.input-group': {
    marginBottom: '1.5rem',
  },
  '.label': {
    display: 'block',
    fontWeight: 600,
    color: 'var(--color-primary-text)',
  },
  '.input, .select': {
    width: '100%',
    padding: '1rem',
    border: '2px solid var(--color-input-border)',
    borderRadius: '10px',
    fontSize: '1rem',
    background: 'var(--color-input-background)',
    color: 'var(--color-primary-text)',
    transition: 'border-color 0.3s ease',
    '&:focus': {
      outline: 'none',
      borderColor: 'var(--color-input-focus)',
      boxShadow: 'var(--shadow-input)',
    },
  },
  '.select': {
    background: 'var(--color-input-background)',
    cursor: 'pointer',
  },
  '.button': {
    width: '100%',
    padding: '1rem 2rem',
    background: 'var(--color-button-background)',
    color: 'var(--color-button-text)',
    border: 'none',
    borderRadius: '10px',
    fontSize: '1.1rem',
    fontWeight: 600,
    boxShadow: 'var(--shadow-button)',
    cursor: 'pointer',
    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
    marginBottom: '1.5rem',
    '&:hover': {
      transform: 'translateY(-2px)',
      background: 'var(--color-button-hover)',
      boxShadow: '0 10px 20px rgba(102, 126, 234, 0.3)',
    },
    '&:active': {
      transform: 'translateY(0)',
    },
  },
  '.results': {
    background: '#f8f9fa',
    borderRadius: '10px',
  },
  '.result-item': {
    marginBottom: '1rem',
    padding: '1rem',
    background: 'white',
    borderRadius: '8px',
    borderLeft: '4px solid #667eea',
    '&.error': {
      background: '#fee',
      borderLeftColor: '#e74c3c',
      color: '#c0392b',
    },
  },
  '.result-label': {
    fontWeight: 600,
    color: '#333',
    marginBottom: '0.25rem',
  },
  '.result-value': {
    fontFamily: "'Monaco', 'Menlo', 'Ubuntu Mono', monospace",
    color: '#555',
    fontSize: '0.95rem',
  },
})

const GlobalStyles: React.FC = () => <Global styles={globalStyles} />

export default GlobalStyles
