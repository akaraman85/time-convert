import { useState } from 'react'
import { format } from 'date-fns'
import styled from '@emotion/styled'

// Styled components
const Container = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 1rem;
  width: 100%;
`

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`

const Title = styled.h3`
  margin: 0;
  color: var(--color-primary-text, #4a5568);
  font-size: 1.1rem;
`

const ButtonGroup = styled.div`
  display: flex;
  gap: 0.5rem;
`

const Button = styled.button<{ variant?: 'primary' | 'danger' }>`
  padding: 0.5rem 1rem;
  border: 1px solid;
  border-radius: 0.375rem;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s ease;

  ${({ variant = 'primary' }) =>
    variant === 'danger'
      ? `
        background: transparent;
        border-color: var(--color-error, #e53e3e);
        color: var(--color-error, #e53e3e);
        
        &:hover {
          background: rgba(229, 62, 62, 0.1);
        }
      `
      : `
        background: var(--color-button-background, #667eea);
        border-color: transparent;
        color: var(--color-button-text, white);
        
        &:disabled {
          background: var(--color-input-disabled, #e2e8f0);
          color: var(--color-secondary-text, #a0aec0);
          cursor: not-allowed;
        }
        
        &:not(:disabled):hover {
          opacity: 0.9;
          transform: translateY(-1px);
        }
      `}
`

const HistoryList = styled.div`
  height: 100%;
  overflow-y: auto;
  padding-right: 0.25rem;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: var(--color-input-background, #f7fafc);
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb {
    background: var(--color-input-border, #e2e8f0);
    border-radius: 3px;
  }
`

const EmptyState = styled.p`
  color: var(--color-secondary-text, #718096);
  font-style: italic;
  margin: 0;
`

const HistoryItem = styled.div`
  padding: 0.75rem;
  border: 1px solid var(--color-input-border, #e2e8f0);
  border-radius: 0.5rem;
  margin-bottom: 0.5rem;
  background: var(--color-card-background, #ffffff);
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  }
`

const ItemContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 0.75rem;
`

const ItemDetails = styled.div`
  flex: 1;
`

const Timestamp = styled.div`
  font-weight: 600;
  color: var(--color-primary-text, #2d3748);
  margin-bottom: 0.25rem;
`

const ConvertedDate = styled.div`
  color: var(--color-secondary-text, #4a5568);
  font-size: 0.9rem;
  margin-bottom: 0.25rem;
`

const Timezone = styled.div`
  color: var(--color-secondary-text, #718096);
  font-size: 0.8rem;
`

const TimeAgo = styled.div`
  color: var(--color-secondary-text, #a0aec0);
  font-size: 0.75rem;
  text-align: right;
  white-space: nowrap;
`

const TimeDifference = styled.div`
  margin-top: 0.75rem;
  padding: 0.5rem;
  background: rgba(66, 153, 225, 0.1);
  border-radius: 0.25rem;
  font-size: 0.85rem;
  color: var(--color-primary, #2b6cb0);
  border-left: 3px solid var(--color-primary, #63b3ed);
`

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
    <Container>
      <Header>
        <Title>Conversion History</Title>

        <ButtonGroup>
          {history.length > 0 && (
            <>
              <Button variant='danger' onClick={onClearHistory}>
                Clear
              </Button>
              {selectedItems.size > 0 && (
                <Button
                  onClick={calculateTimeDifference}
                  disabled={selectedItems.size !== 2}
                  title={
                    selectedItems.size !== 2
                      ? 'Select exactly 2 items to compare'
                      : ''
                  }
                >
                  Calculate Difference
                </Button>
              )}
            </>
          )}
        </ButtonGroup>
      </Header>

      {history.length === 0 ? (
        <EmptyState>No conversions yet</EmptyState>
      ) : (
        <HistoryList>
          {history.map(item => (
            <HistoryItem
              key={item.id}
              onClick={e => {
                // Only trigger selection if clicking on the checkbox or its label
                if (e.target instanceof HTMLInputElement) {
                  toggleItemSelection(item.id)
                } else {
                  onSelectTimestamp(item.originalTimestamp)
                }
              }}
            >
              <ItemContent>
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
                <ItemDetails>
                  <Timestamp>{item.originalTimestamp}</Timestamp>
                  <ConvertedDate>{item.convertedDate}</ConvertedDate>
                  <Timezone>{item.timezone}</Timezone>
                </ItemDetails>
                <TimeAgo>
                  {format(new Date(item.createdAt), 'MMM d, HH:mm')}
                </TimeAgo>
              </ItemContent>

              {timeDifference &&
                selectedItems.has(item.id) &&
                selectedItems.size === 2 && (
                  <TimeDifference>
                    <strong>Time difference:</strong> {timeDifference}
                  </TimeDifference>
                )}
            </HistoryItem>
          ))}
        </HistoryList>
      )}
    </Container>
  )
}
