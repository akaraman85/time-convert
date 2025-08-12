import { useState, useMemo } from 'react'
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
  onSelectTimestamp,
}: ConversionHistoryProps) {
  const toggleItemSelection = (id: string) => {
    const newSelected = new Set(selectedItems)
    if (newSelected.has(id)) {
      newSelected.delete(id)
    } else {
      newSelected.add(id)
    }
    setSelectedItems(newSelected)
    setTimeDifference(null)
  }

  const calculateTimeDifference = () => {
    if (selectedItems.size !== 2) return

    const selectedHistory = history.filter(item => selectedItems.has(item.id))
    if (selectedHistory.length !== 2) return

    const [first, second] = selectedHistory
    const diff = Math.abs(
      new Date(first.originalTimestamp).getTime() -
        new Date(second.originalTimestamp).getTime()
    )

    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
    const seconds = Math.floor((diff % (1000 * 60)) / 1000)

    setTimeDifference(`${days}d ${hours}h ${minutes}m ${seconds}s`)
  }
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set())
  const [timeDifference, setTimeDifference] = useState<string | null>(null)

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        marginBottom: '1rem',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <h3 style={{ margin: 0, color: '#4a5568', fontSize: '1.1rem' }}>
          Conversion History
        </h3>

        <div>
          {history.length > 0 && (
            <>
              <button
                onClick={onClearHistory}
                style={{
                  padding: '0.5rem 1rem',
                  background: 'transparent',
                  border: '1px solid #e53e3e',
                  borderRadius: '5px',
                  color: '#e53e3e',
                  cursor: 'pointer',
                  fontSize: '0.9rem',
                  marginRight: '0.5rem',
                }}
              >
                Clear
              </button>
              {selectedItems.size > 0 && (
                <button
                  onClick={calculateTimeDifference}
                  disabled={selectedItems.size !== 2}
                  style={{
                    padding: '0.5rem 1rem',
                    background:
                      selectedItems.size === 2 ? '#667eea' : '#e2e8f0',
                    border: 'none',
                    borderRadius: '5px',
                    color: selectedItems.size === 2 ? 'white' : '#a0aec0',
                    cursor:
                      selectedItems.size === 2 ? 'pointer' : 'not-allowed',
                    fontSize: '0.9rem',
                    marginRight: '0.5rem',
                  }}
                  title={
                    selectedItems.size !== 2
                      ? 'Select exactly 2 items to compare'
                      : ''
                  }
                >
                  Calculate Difference
                </button>
              )}
            </>
          )}
        </div>
      </div>

      <div>
        {history.length === 0 ? (
          <p style={{ color: '#718096', fontStyle: 'italic' }}>
            No conversions yet
          </p>
        ) : (
          <div style={{ height: '100%', overflowY: 'auto' }}>
            {history.map(item => (
              <div
                key={item.id}
                style={{
                  padding: '0.75rem',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  marginBottom: '0.5rem',
                  background: '#f7fafc',
                  cursor: 'pointer',
                }}
                onClick={e => {
                  // Only trigger selection if clicking on the checkbox or its label
                  if (e.target instanceof HTMLInputElement) {
                    toggleItemSelection(item.id)
                  } else {
                    onSelectTimestamp(item.originalTimestamp)
                  }
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    gap: '0.75rem',
                  }}
                >
                  <input
                    type='checkbox'
                    checked={selectedItems.has(item.id)}
                    onChange={() => toggleItemSelection(item.id)}
                    onClick={e => e.stopPropagation()}
                    style={{
                      marginTop: '0.25rem',
                      cursor: 'pointer',
                    }}
                  />
                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        fontWeight: 'bold',
                        color: '#2d3748',
                        marginBottom: '0.25rem',
                      }}
                    >
                      {item.originalTimestamp}
                    </div>
                    <div
                      style={{
                        color: '#4a5568',
                        fontSize: '0.9rem',
                        marginBottom: '0.25rem',
                      }}
                    >
                      {item.convertedDate}
                    </div>
                    <div style={{ color: '#718096', fontSize: '0.8rem' }}>
                      {item.timezone}
                    </div>
                  </div>
                  <div
                    style={{
                      color: '#a0aec0',
                      fontSize: '0.75rem',
                      textAlign: 'right',
                    }}
                  >
                    {format(new Date(item.createdAt), 'MMM d, HH:mm')}
                  </div>
                </div>
                {timeDifference &&
                  selectedItems.has(item.id) &&
                  selectedItems.size === 2 && (
                    <div
                      style={{
                        marginTop: '0.75rem',
                        padding: '0.5rem',
                        background: '#ebf8ff',
                        borderRadius: '4px',
                        fontSize: '0.85rem',
                        color: '#2b6cb0',
                        borderLeft: '3px solid #63b3ed',
                      }}
                    >
                      <strong>Time difference:</strong> {timeDifference}
                    </div>
                  )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
