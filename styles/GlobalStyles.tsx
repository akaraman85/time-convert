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
    '--color-danger': '#f56565',
    '--color-button-bg': 'var(--color-button-background)',
    '--color-button-border': 'transparent',
    '--color-button-hover-bg': 'var(--color-button-hover)',
    '--color-button-danger-bg': '#fff5f5',
    '--color-button-danger-text': '#f56565',
    '--color-button-danger-hover': '#fff5f5',
    '--color-hover-bg': 'rgba(0, 0, 0, 0.03)',
    '--color-table-row-odd': 'rgba(255, 255, 255, 0.5)',
    '--color-table-row-even': 'rgba(249, 250, 252, 0.5)',
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
  '.mobile-menu-toggle': {
    '@media (max-width: 768px)': {
      display: 'block !important',
    },
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
})

const GlobalStyles: React.FC = () => <Global styles={globalStyles} />

export default GlobalStyles
