import { useState, useEffect } from 'react'
import { format, fromUnixTime } from 'date-fns'
import { zonedTimeToUtc, utcToZonedTime, format as formatTz } from 'date-fns-tz'

// Common timezones for the dropdown
const COMMON_TIMEZONES = [
  'UTC',
  'America/New_York',
  'America/Chicago', 
  'America/Denver',
  'America/Los_Angeles',
  'America/Toronto',
  'America/Vancouver',
  'Europe/London',
  'Europe/Paris',
  'Europe/Berlin',
  'Europe/Rome',
  'Europe/Madrid',
  'Asia/Tokyo',
  'Asia/Shanghai',
  'Asia/Hong_Kong',
  'Asia/Singapore',
  'Asia/Seoul',
  'Asia/Mumbai',
  'Asia/Dubai',
  'Australia/Sydney',
  'Australia/Melbourne',
  'Pacific/Auckland',
  'Africa/Cairo',
  'America/Sao_Paulo',
  'America/Mexico_City'
]

interface ConversionResult {
  timezone: string
  formatted: string
  iso: string
  relative: string
}

export default function Home() {
  const [timestamp, setTimestamp] = useState('')
  const [selectedTimezone, setSelectedTimezone] = useState('UTC')
  const [results, setResults] = useState<ConversionResult[]>([])
  const [error, setError] = useState('')
  const [currentTime, setCurrentTime] = useState('')
  const [userTimezone, setUserTimezone] = useState('')

  // Get user's local timezone and current time
  useEffect(() => {
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone
    setUserTimezone(timezone)
    setSelectedTimezone(timezone)
    
    const updateCurrentTime = () => {
      const now = new Date()
      const unixTimestamp = Math.floor(now.getTime() / 1000)
      setCurrentTime(`Current Unix timestamp: ${unixTimestamp} (${format(now, 'PPpp')})`)
    }
    
    updateCurrentTime()
    const interval = setInterval(updateCurrentTime, 1000)
    
    return () => clearInterval(interval)
  }, [])

  const convertTimestamp = () => {
    setError('')
    setResults([])
    
    if (!timestamp.trim()) {
      setError('Please enter a Unix timestamp')
      return
    }
    
    const numericTimestamp = parseInt(timestamp.trim())
    
    if (isNaN(numericTimestamp)) {
      setError('Please enter a valid numeric Unix timestamp')
      return
    }
    
    // Handle both seconds and milliseconds timestamps
    let timestampInSeconds = numericTimestamp
    if (numericTimestamp > 9999999999) {
      // Likely milliseconds, convert to seconds
      timestampInSeconds = Math.floor(numericTimestamp / 1000)
    }
    
    try {
      const date = fromUnixTime(timestampInSeconds)
      
      // Check if the date is valid
      if (isNaN(date.getTime())) {
        setError('Invalid timestamp - results in an invalid date')
        return
      }
      
      const newResults: ConversionResult[] = []
      
      // Add local timezone result
      const localZonedTime = utcToZonedTime(date, userTimezone)
      newResults.push({
        timezone: `${userTimezone} (Your Local Time)`,
        formatted: formatTz(localZonedTime, 'PPpp', { timeZone: userTimezone }),
        iso: localZonedTime.toISOString(),
        relative: getRelativeTime(date)
      })
      
      // Add selected timezone result (if different from local)
      if (selectedTimezone !== userTimezone) {
        const selectedZonedTime = utcToZonedTime(date, selectedTimezone)
        newResults.push({
          timezone: selectedTimezone,
          formatted: formatTz(selectedZonedTime, 'PPpp', { timeZone: selectedTimezone }),
          iso: selectedZonedTime.toISOString(),
          relative: getRelativeTime(date)
        })
      }
      
      // Add UTC result (if not already included)
      if (selectedTimezone !== 'UTC' && userTimezone !== 'UTC') {
        newResults.push({
          timezone: 'UTC',
          formatted: format(date, 'PPpp') + ' UTC',
          iso: date.toISOString(),
          relative: getRelativeTime(date)
        })
      }
      
      setResults(newResults)
    } catch (err) {
      setError('Error converting timestamp. Please check the value and try again.')
    }
  }
  
  const getRelativeTime = (date: Date): string => {
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffSeconds = Math.floor(diffMs / 1000)
    const diffMinutes = Math.floor(diffSeconds / 60)
    const diffHours = Math.floor(diffMinutes / 60)
    const diffDays = Math.floor(diffHours / 24)
    
    if (Math.abs(diffSeconds) < 60) {
      return diffSeconds === 0 ? 'now' : `${Math.abs(diffSeconds)} seconds ${diffSeconds > 0 ? 'ago' : 'from now'}`
    } else if (Math.abs(diffMinutes) < 60) {
      return `${Math.abs(diffMinutes)} minutes ${diffMinutes > 0 ? 'ago' : 'from now'}`
    } else if (Math.abs(diffHours) < 24) {
      return `${Math.abs(diffHours)} hours ${diffHours > 0 ? 'ago' : 'from now'}`
    } else {
      return `${Math.abs(diffDays)} days ${diffDays > 0 ? 'ago' : 'from now'}`
    }
  }
  
  const fillCurrentTimestamp = () => {
    const now = Math.floor(Date.now() / 1000)
    setTimestamp(now.toString())
  }

  return (
    <div className="container">
      <div className="card">
        <h1 className="title">Unix Timestamp Converter</h1>
        <p className="subtitle">
          Convert Unix timestamps (epoch time) to human-readable dates in any timezone
        </p>
        
        <div className="input-group">
          <label className="label" htmlFor="timestamp">
            Unix Timestamp (seconds or milliseconds)
          </label>
          <input
            id="timestamp"
            type="text"
            className="input"
            value={timestamp}
            onChange={(e) => setTimestamp(e.target.value)}
            placeholder="e.g., 1691798642 or 1691798642000"
            onKeyPress={(e) => e.key === 'Enter' && convertTimestamp()}
          />
          <button 
            type="button" 
            onClick={fillCurrentTimestamp}
            style={{ 
              marginTop: '0.5rem', 
              padding: '0.5rem 1rem', 
              background: 'transparent',
              border: '1px solid #667eea',
              borderRadius: '5px',
              color: '#667eea',
              cursor: 'pointer',
              fontSize: '0.9rem'
            }}
          >
            Use Current Time
          </button>
        </div>
        
        <div className="input-group">
          <label className="label" htmlFor="timezone">
            Target Timezone
          </label>
          <select
            id="timezone"
            className="select"
            value={selectedTimezone}
            onChange={(e) => setSelectedTimezone(e.target.value)}
          >
            {COMMON_TIMEZONES.map((tz) => (
              <option key={tz} value={tz}>
                {tz}
              </option>
            ))}
          </select>
        </div>
        
        <button className="button" onClick={convertTimestamp}>
          Convert Timestamp
        </button>
        
        {error && (
          <div className="results">
            <div className="result-item error">
              <div className="result-label">Error</div>
              <div className="result-value">{error}</div>
            </div>
          </div>
        )}
        
        {results.length > 0 && (
          <div className="results">
            {results.map((result, index) => (
              <div key={index} className="result-item">
                <div className="result-label">{result.timezone}</div>
                <div className="result-value">{result.formatted}</div>
                <div className="result-value" style={{ fontSize: '0.85rem', opacity: 0.7, marginTop: '0.25rem' }}>
                  {result.relative} • ISO: {result.iso}
                </div>
              </div>
            ))}
          </div>
        )}
        
        <div className="current-time">
          {currentTime}
        </div>
      </div>
    </div>
  )
}
