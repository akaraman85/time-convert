import { useState, useEffect } from 'react'
import Head from 'next/head'
import { format, fromUnixTime } from 'date-fns'
import { utcToZonedTime, format as formatTz } from 'date-fns-tz'
import styled from '@emotion/styled'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import { TimestampForm } from '../components/forms/TimestampForm'

// Import components dynamically to reduce initial load
const TimezoneSelect = dynamic<{
  id?: string
  value: string
  onChange: (value: string) => void
  className?: string
}>(() => import('../components/timezoneSelect').then(mod => mod.default), {
  ssr: false,
  loading: () => <div>Loading timezone selector...</div>,
})

const Container = styled.main`
  margin: 0 auto;
  padding: 2rem;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  gap: 2rem;
  @media (min-width: 768px) {
    flex-direction: row;
  }
  @media (max-width: 768px) {
    padding: 1rem;
    padding-top: 4rem;
  }
`

const Title = styled.h3`
  margin: 0 0 1.5rem 0;
  color: var(--color-primary-text);
  font-size: 1.5rem;
  font-weight: 600;
  background: var(--color-title-gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-fill-color: transparent;
`

const Card = styled.div`
  background: var(--color-card-background);
  border-radius: 12px;
  box-shadow: var(--shadow-card);
  padding: 2rem;
  transition: all 0.3s ease;
  max-width: 100%;
  width: 100%;
`

const CardNarrow = styled(Card)`
  display: flex;
  flex-direction: column;
  gap: 2rem;
  @media (min-width: 768px) {
    max-width: 420px;
  }
`

interface TimezoneData {
  id: string
  name: string
}

interface TimeConversionResult {
  timezone: string
  formatted: string
  offset: string
  date: Date
}

const TimeTable = () => {
  const [selectedTimezones, setSelectedTimezones] = useState<TimezoneData[]>([
    { id: 'UTC', name: 'UTC' },
  ])
  const [newTimezone, setNewTimezone] = useState<string>('')
  const [currentTime, setCurrentTime] = useState<number>(Date.now() / 1000)
  const [dateTimeInput, setDateTimeInput] = useState<string>('')
  const router = useRouter()
  const [availableTimezones, setAvailableTimezones] = useState<string[]>([])
  const [isLoadingTimezones, setIsLoadingTimezones] = useState<boolean>(false)
  const [timezoneSearch, setTimezoneSearch] = useState<string>('')

  // Update time every second
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(Date.now() / 1000)
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  // Load available timezones
  useEffect(() => {
    const loadTimezones = async () => {
      try {
        setIsLoadingTimezones(true)
        // Get timezone names from the package
        const { getTimeZones } = await import('@vvo/tzdb')
        const timezones = getTimeZones()
        setAvailableTimezones(timezones.map(tz => tz.name))
      } catch (error) {
        console.error('Error loading timezones:', error)
      } finally {
        setIsLoadingTimezones(false)
      }
    }

    loadTimezones()
  }, [])

  // Set initial date time input to current time
  useEffect(() => {
    if (dateTimeInput === '') {
      const now = new Date()
      const localDateTime = format(now, "yyyy-MM-dd'T'HH:mm")
      setDateTimeInput(localDateTime)
      setCurrentTime(Math.floor(now.getTime() / 1000))
    }
  }, [])

  const handleAddTimezone = (timezone: string) => {
    if (!timezone) return

    const timezoneExists = selectedTimezones.some(tz => tz.id === timezone)
    if (!timezoneExists) {
      setSelectedTimezones([
        ...selectedTimezones,
        { id: timezone, name: timezone },
      ])
      setNewTimezone('')
      setTimezoneSearch('')
    }
  }

  const handleRemoveTimezone = (timezoneId: string) => {
    if (selectedTimezones.length > 1) {
      setSelectedTimezones(selectedTimezones.filter(tz => tz.id !== timezoneId))
    }
  }

  const handleDateTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDateTimeInput(e.target.value)
    const date = new Date(e.target.value)
    if (!isNaN(date.getTime())) {
      setCurrentTime(Math.floor(date.getTime() / 1000))
    }
  }

  const filteredTimezones = availableTimezones
    .filter(tz => tz.toLowerCase().includes(timezoneSearch.toLowerCase()))
    .slice(0, 10) // Limit to 10 results for performance

  // Function to calculate time in different timezones
  const getTimeInTimezones = (timestamp: number): TimeConversionResult[] => {
    return selectedTimezones.map(tz => {
      try {
        const date = fromUnixTime(timestamp)
        const zonedTime = utcToZonedTime(date, tz.id)
        const offset = formatTz(zonedTime, 'xxx', { timeZone: tz.id })

        return {
          timezone: tz.name,
          formatted: formatTz(zonedTime, 'yyyy-MM-dd HH:mm:ss', {
            timeZone: tz.id,
          }),
          offset: `UTC${offset}`,
          date: zonedTime,
        }
      } catch (error) {
        console.error(`Error processing timezone ${tz.id}:`, error)
        return {
          timezone: tz.name,
          formatted: 'Invalid timezone',
          offset: 'N/A',
          date: new Date(),
        }
      }
    })
  }

  // Calculate time in all selected timezones
  const timeResults = getTimeInTimezones(currentTime)

  return (
    <>
      <Head>
        <title>Time Table | Time Convert</title>
        <meta
          name='description'
          content='View and compare multiple timezones'
        />
      </Head>

      <Container>
        <CardNarrow>
          <Title>Convert Time</Title>
          <TimestampForm
            label='Date & Time'
            id='datetime-local'
            type='datetime-local'
            value={dateTimeInput}
            onChange={setDateTimeInput}
          />

          <div style={{ marginBottom: '1.5rem' }}>
            <div
              style={{
                marginBottom: '0.5rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <label>Add Timezone</label>
            </div>
            <div style={{ position: 'relative' }}>
              <input
                type='text'
                value={timezoneSearch}
                onChange={e => setTimezoneSearch(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter' && timezoneSearch) {
                    handleAddTimezone(timezoneSearch)
                  }
                }}
                placeholder='Search timezone...'
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  borderRadius: '8px',
                  border: '1px solid var(--color-input-border)',
                  background: 'var(--color-input-background)',
                  color: 'var(--color-primary-text)',
                  fontSize: '0.95rem',
                  boxSizing: 'border-box',
                }}
              />
              {timezoneSearch && (
                <div
                  style={{
                    position: 'absolute',
                    top: '100%',
                    left: 0,
                    right: 0,
                    backgroundColor: 'var(--color-card-background)',
                    border: '1px solid var(--color-input-border)',
                    borderRadius: '8px',
                    marginTop: '0.25rem',
                    maxHeight: '300px',
                    overflowY: 'auto',
                    zIndex: 100,
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                  }}
                >
                  {isLoadingTimezones ? (
                    <div
                      style={{
                        padding: '0.75rem',
                        color: 'var(--color-secondary-text)',
                      }}
                    >
                      Loading timezones...
                    </div>
                  ) : filteredTimezones.length > 0 ? (
                    filteredTimezones.map(tz => (
                      <div
                        key={tz}
                        onClick={() => handleAddTimezone(tz)}
                        style={{
                          padding: '0.75rem',
                          cursor: 'pointer',
                          transition: 'background-color 0.2s',
                          ':hover': {
                            backgroundColor: 'var(--color-hover-bg)',
                          },
                        }}
                      >
                        {tz}
                      </div>
                    ))
                  ) : (
                    <div
                      style={{
                        padding: '0.75rem',
                        color: 'var(--color-secondary-text)',
                      }}
                    >
                      No matching timezones found
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          <div>
            <div style={{ marginBottom: '0.5rem' }}>Selected Timezones</div>
            <div
              style={{
                border: '1px solid var(--color-input-border)',
                borderRadius: '8px',
                maxHeight: '200px',
                overflowY: 'auto',
              }}
            >
              {selectedTimezones.map(tz => (
                <div
                  key={tz.id}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '0.5rem 0.75rem',
                    borderBottom: '1px solid var(--color-input-border)',
                    ':last-child': {
                      borderBottom: 'none',
                    },
                  }}
                >
                  <span style={{ fontSize: '0.9rem' }}>{tz.name}</span>
                  {selectedTimezones.length > 1 && (
                    <button
                      onClick={() => handleRemoveTimezone(tz.id)}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: 'var(--color-danger)',
                        cursor: 'pointer',
                        padding: '0.25rem',
                        borderRadius: '4px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        ':hover': {
                          backgroundColor: 'var(--color-hover-bg)',
                        },
                      }}
                      aria-label={`Remove ${tz.name}`}
                    >
                      <svg
                        width='16'
                        height='16'
                        viewBox='0 0 24 24'
                        fill='none'
                        stroke='currentColor'
                        strokeWidth='2'
                        strokeLinecap='round'
                        strokeLinejoin='round'
                      >
                        <line x1='18' y1='6' x2='6' y2='18'></line>
                        <line x1='6' y1='6' x2='18' y2='18'></line>
                      </svg>
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </CardNarrow>

        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            gap: '1.5rem',
          }}
        >
          <Card>
            <Title>Time Table</Title>
            <div style={{ overflowX: 'auto' }}>
              <table
                style={{
                  width: '100%',
                  borderCollapse: 'separate',
                  borderSpacing: 0,
                  fontSize: '0.95rem',
                }}
              >
                <thead>
                  <tr>
                    <th
                      style={{
                        textAlign: 'left',
                        padding: '1rem',
                        borderBottom: '1px solid var(--color-input-border)',
                        fontWeight: 600,
                        color: 'var(--color-secondary-text)',
                      }}
                    >
                      Timezone
                    </th>
                    <th
                      style={{
                        textAlign: 'left',
                        padding: '1rem',
                        borderBottom: '1px solid var(--color-input-border)',
                        fontWeight: 600,
                        color: 'var(--color-secondary-text)',
                      }}
                    >
                      Local Time
                    </th>
                    <th
                      style={{
                        textAlign: 'left',
                        padding: '1rem',
                        borderBottom: '1px solid var(--color-input-border)',
                        fontWeight: 600,
                        color: 'var(--color-secondary-text)',
                      }}
                    >
                      UTC Offset
                    </th>
                    <th
                      style={{
                        textAlign: 'left',
                        padding: '1rem',
                        borderBottom: '1px solid var(--color-input-border)',
                        fontWeight: 600,
                        color: 'var(--color-secondary-text)',
                      }}
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {timeResults.map((result, index) => (
                    <tr
                      key={result.timezone}
                      style={{
                        backgroundColor:
                          index % 2 === 0
                            ? 'var(--color-table-row-odd)'
                            : 'var(--color-table-row-even)',
                        transition: 'background-color 0.2s ease',
                        ':hover': {
                          backgroundColor: 'var(--color-hover-bg)',
                        },
                      }}
                    >
                      <td
                        style={{
                          padding: '1rem',
                          borderBottom: '1px solid var(--color-input-border)',
                          color: 'var(--color-primary-text)',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {result.timezone}
                      </td>
                      <td
                        style={{
                          padding: '1rem',
                          borderBottom: '1px solid var(--color-input-border)',
                          color: 'var(--color-primary-text)',
                          fontFamily: 'monospace',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {result.formatted}
                      </td>
                      <td
                        style={{
                          padding: '1rem',
                          borderBottom: '1px solid var(--color-input-border)',
                          color: 'var(--color-secondary-text)',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {result.offset}
                      </td>
                      <td
                        style={{
                          padding: '1rem',
                          borderBottom: '1px solid var(--color-input-border)',
                        }}
                      >
                        <button
                          onClick={() =>
                            handleRemoveTimezone(selectedTimezones[index].id)
                          }
                          style={{
                            background: 'none',
                            border: 'none',
                            color: 'var(--color-danger)',
                            cursor: 'pointer',
                            padding: '0.5rem',
                            borderRadius: '4px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.25rem',
                            fontSize: '0.85rem',
                            ':hover': {
                              backgroundColor: 'var(--color-hover-bg)',
                            },
                          }}
                        >
                          <svg
                            width='14'
                            height='14'
                            viewBox='0 0 24 24'
                            fill='none'
                            stroke='currentColor'
                            strokeWidth='2'
                            strokeLinecap='round'
                            strokeLinejoin='round'
                          >
                            <line x1='18' y1='6' x2='6' y2='18'></line>
                            <line x1='6' y1='6' x2='18' y2='18'></line>
                          </svg>
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {timeResults.length === 0 && (
                <div
                  style={{
                    padding: '2rem',
                    textAlign: 'center',
                    color: 'var(--color-secondary-text)',
                    borderBottom: '1px solid var(--color-input-border)',
                  }}
                >
                  No timezones selected. Add timezones using the panel on the
                  left.
                </div>
              )}
            </div>

            <div
              style={{
                marginTop: '1.5rem',
                paddingTop: '1rem',
                borderTop: '1px solid var(--color-input-border)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                fontSize: '0.9rem',
                color: 'var(--color-secondary-text)',
              }}
            >
              <div>
                Showing {timeResults.length} timezone
                {timeResults.length !== 1 ? 's' : ''}
              </div>
              <button
                onClick={() => {
                  const timezoneText = timeResults
                    .map(tz => `${tz.timezone}: ${tz.formatted} (${tz.offset})`)
                    .join('\n')
                  navigator.clipboard.writeText(timezoneText)
                }}
                style={{
                  background: 'var(--color-button-bg)',
                  color: 'var(--color-button-text)',
                  border: '1px solid var(--color-button-border)',
                  borderRadius: '4px',
                  padding: '0.4rem 0.75rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  fontSize: '0.85rem',
                  transition: 'all 0.2s ease',
                  ':hover': {
                    background: 'var(--color-button-hover-bg)',
                  },
                }}
              >
                <svg
                  width='14'
                  height='14'
                  viewBox='0 0 24 24'
                  fill='none'
                  stroke='currentColor'
                  strokeWidth='2'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                >
                  <rect x='9' y='9' width='13' height='13' rx='2' ry='2'></rect>
                  <path d='M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1'></path>
                </svg>
                Copy All to Clipboard
              </button>
            </div>
          </Card>
        </div>
      </Container>
    </>
  )
}

export default TimeTable
