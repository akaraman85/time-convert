import { Global, css } from '@emotion/react'
import React from 'react'

const globalStyles = css({
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
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
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
    },
  },
  '.card': {
    background: 'rgba(255, 255, 255, 0.95)',
    backdropFilter: 'blur(10px)',
    borderRadius: '20px',
    padding: '2rem',
    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
    width: '100%',
    maxWidth: '600px',
    '@media (max-width: 768px)': {
      padding: '1rem',
    },
  },
  '.conversion-history': {
    width: '100%',
    maxWidth: 'unset',
  },
  '.title': {
    fontSize: '2rem',
    fontWeight: 700,
    textAlign: 'left',
    marginBottom: '0.5rem',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
  },
  '.subtitle': {
    textAlign: 'left',
    color: '#666',
    marginBottom: '2rem',
    fontSize: '0.9rem',
  },
  '.input-group': {
    marginBottom: '1.5rem',
  },
  '.label': {
    display: 'block',
    marginBottom: '0.5rem',
    fontWeight: 600,
    color: '#333',
  },
  '.input, .select': {
    width: '100%',
    padding: '1rem',
    border: '2px solid #e1e5e9',
    borderRadius: '10px',
    fontSize: '1rem',
    transition: 'border-color 0.3s ease',
    '&:focus': {
      outline: 'none',
      borderColor: '#667eea',
    },
  },
  '.select': {
    background: 'white',
    cursor: 'pointer',
  },
  '.button': {
    width: '100%',
    padding: '1rem 2rem',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '10px',
    fontSize: '1.1rem',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
    marginBottom: '1.5rem',
    '&:hover': {
      transform: 'translateY(-2px)',
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
  '.current-time': {
    margin: '1rem 0',
    padding: '0.5rem 1rem',
    background: 'rgb(102, 126, 234)',
    borderRadius: '10px',
    fontSize: '0.9rem',
    color: 'rgba(255, 255, 255, 0.95)',
  },
})

const GlobalStyles: React.FC = () => <Global styles={globalStyles} />

export default GlobalStyles
