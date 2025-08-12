import { useState } from 'react'
import { format } from 'date-fns'

export interface ConversionHistory {
  id: string
  timestamp: string
  originalTimestamp: string
  convertedDate: string
  timezone: string
  createdAt: string
}

interface ConversionHistoryProps {
  history: ConversionHistory[]
  onClearHistory: () => void
  onSelectTimestamp: (timestamp: string) => void
}

export default function ConversionHistoryComponent({ 
  history, 
  onClearHistory, 
  onSelectTimestamp 
}: ConversionHistoryProps) {
  const [showHistory, setShowHistory] = useState(false)

  return (
    <div style={{ marginTop: '2rem', borderTop: '1px solid #e2e8f0', paddingTop: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h3 style={{ margin: 0, color: '#4a5568', fontSize: '1.1rem' }}>Conversion History</h3>
        <div>
          <button
            onClick={() => setShowHistory(!showHistory)}
            style={{
              padding: '0.5rem 1rem',
              background: 'transparent',
              border: '1px solid #667eea',
              borderRadius: '5px',
              color: '#667eea',
              cursor: 'pointer',
              fontSize: '0.9rem',
              marginRight: '0.5rem'
            }}
          >
            {showHistory ? 'Hide' : 'Show'} History ({history.length})
          </button>
          {history.length > 0 && (
            <button
              onClick={onClearHistory}
              style={{
                padding: '0.5rem 1rem',
                background: 'transparent',
                border: '1px solid #e53e3e',
                borderRadius: '5px',
                color: '#e53e3e',
                cursor: 'pointer',
                fontSize: '0.9rem'
              }}
            >
              Clear
            </button>
          )}
        </div>
      </div>
      
      {showHistory && (
        <div>
          {history.length === 0 ? (
            <p style={{ color: '#718096', fontStyle: 'italic' }}>No conversions yet</p>
          ) : (
            <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
              {history.map((item) => (
                <div
                  key={item.id}
                  style={{
                    padding: '0.75rem',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    marginBottom: '0.5rem',
                    background: '#f7fafc',
                    cursor: 'pointer'
                  }}
                  onClick={() => onSelectTimestamp(item.originalTimestamp)}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 'bold', color: '#2d3748', marginBottom: '0.25rem' }}>
                        {item.originalTimestamp}
                      </div>
                      <div style={{ color: '#4a5568', fontSize: '0.9rem', marginBottom: '0.25rem' }}>
                        {item.convertedDate}
                      </div>
                      <div style={{ color: '#718096', fontSize: '0.8rem' }}>
                        {item.timezone}
                      </div>
                    </div>
                    <div style={{ color: '#a0aec0', fontSize: '0.75rem', textAlign: 'right' }}>
                      {format(new Date(item.createdAt), 'MMM d, HH:mm')}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
