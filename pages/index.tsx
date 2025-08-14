import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import Head from 'next/head'
import { format, fromUnixTime } from 'date-fns'
import { utcToZonedTime, format as formatTz } from 'date-fns-tz'
import styled from '@emotion/styled'
import ConversionHistoryComponent, {
  ConversionHistory,
} from '../components/ConversionHistory'

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
    paddingtop: 4rem;
  }
`

const Title = styled.h3`
  margin: 0;
  color: var(--color-primary-text, #4a5568);
  font-size: 1.1rem;
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

const CurrentTimeContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;

  @media (min-width: 768px) {
    flex-direction: row;
    gap: 0.5rem;
  }
`

const FormSection = styled.section`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;
`

const FormLabel = styled.label`
  color: var(--color-primary-text);
  font-size: 0.9rem;
  font-weight: 500;
  display: block;
`

const CurrentTimeDisplay = styled.div`
  flex: 1;
  padding: 0.75rem 1rem;
  background: var(--color-primary);
  border-radius: 8px;
  font-size: 0.9rem;
  color: var(--color-button-text);
  line-height: 1.4;
`

const ConvertButton = styled.button`
  width: 100%;
  padding: 1rem 2rem;
  background: var(--color-button-background);
  color: var(--color-button-text);
  border: none;
  border-radius: 10px;
  font-size: 1.1rem;
  font-weight: 600;
  box-shadow: var(--shadow-button);
  cursor: pointer;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
  &:hover {
    transform: translateY(-2px);
    background: var(--color-button-hover);
    box-shadow: 0 10px 20px rgba(102, 126, 234, 0.3);
  }
  &:active {
    transform: translateY(0);
  }
`

const UseButton = styled.button`
  flex: 0.25;
  padding: 0.75rem 1rem;
  background: transparent;
  border: 1px solid var(--color-primary);
  border-radius: 6px;
  color: var(--color-primary);
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 500;
  transition: all 0.2s ease;
  width: 100%;

  &:hover {
    background: rgba(102, 126, 234, 0.1);
  }

  @media (min-width: 768px) {
    width: auto;
  }
`

const InputContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;
`

const TimestampInput = styled.input`
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid var(--color-input-border);
  border-radius: 6px;
  font-size: 1rem;
  color: var(--color-primary-text);
  background: var(--color-input-background);
  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease;

  &:focus {
    outline: none;
    border-color: var(--color-input-focus);
    box-shadow: var(--shadow-input);
  }

  &::placeholder {
    color: var(--color-secondary-text);
    opacity: 0.7;
  }
`

const ResultsContainer = styled.div`
  background: var(--color-card-background);
  border-radius: 8px;
  box-shadow: var(--shadow-card);
  margin-top: 1rem;
  overflow: hidden;
`

const ResultItem = styled.div`
  padding: 1rem;
  border-bottom: 1px solid var(--color-input-border);

  &:last-child {
    border-bottom: none;
  }
`

const ResultLabel = styled.div`
  font-weight: 600;
  color: var(--color-primary-text);
  margin-bottom: 0.25rem;
`

const ResultValue = styled.div`
  color: var(--color-primary-text);
  margin-bottom: 0.25rem;
`

const ResultMeta = styled.div`
  font-size: 0.85rem;
  color: var(--color-secondary-text);
  opacity: 0.9;
  margin-top: 0.25rem;
`

const ErrorMessage = styled(ResultItem)`
  background-color: rgba(245, 101, 101, 0.1);
  color: var(--color-error);
  border-left: 3px solid var(--color-error);
  margin: 0.5rem 0;
  border-radius: 4px;
`

interface ConversionResult {
  timezone: string
  formatted: string
  iso: string
  relative: string
}

// Generate sitemap and robots.txt at build time
export async function getStaticProps() {
  return {
    props: {},
  }
}

const TimezoneSelect = dynamic<TimezoneSelectProps>(
  () => import('../components/timezoneSelect').then(mod => mod.default),
  {
    ssr: false,
    loading: () => (
      <select className='select select-bordered w-full'>
        <option>Loading timezones...</option>
      </select>
    ),
  }
)

interface TimezoneSelectProps {
  id?: string
  value: string
  onChange: (value: string) => void
  className?: string
}

export default function Home() {
  const [timestamp, setTimestamp] = useState('')
  const [selectedTimezone, setSelectedTimezone] = useState('UTC')
  const [results, setResults] = useState<ConversionResult[]>([])
  const [error, setError] = useState('')
  const [currentTime, setCurrentTime] = useState(0)
  const [userTimezone, setUserTimezone] = useState('')
  const [conversionHistory, setConversionHistory] = useState<
    ConversionHistory[]
  >([])

  // Get user's local timezone and current time
  useEffect(() => {
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone
    setUserTimezone(timezone)
    setSelectedTimezone(timezone)

    const updateCurrentTime = () => {
      const now = new Date()
      const unixTimestamp = Math.floor(now.getTime() / 1000)
      setCurrentTime(unixTimestamp)
    }

    updateCurrentTime()
    const interval = setInterval(updateCurrentTime, 1000)

    // Load conversion history from localStorage
    loadConversionHistory()

    return () => clearInterval(interval)
  }, [])

  const loadConversionHistory = () => {
    try {
      const stored = localStorage.getItem('timestamp-conversion-history')
      if (stored) {
        const history = JSON.parse(stored)
        setConversionHistory(history)
      }
    } catch (error) {
      console.error('Error loading conversion history:', error)
    }
  }

  const saveToHistory = (
    originalTimestamp: string,
    convertedDate: string,
    timezone: string
  ) => {
    const historyItem: ConversionHistory = {
      id: Date.now().toString(),
      timestamp: originalTimestamp,
      originalTimestamp,
      convertedDate,
      timezone,
      createdAt: new Date().toISOString(),
    }

    try {
      const updatedHistory = [historyItem, ...conversionHistory].slice(0, 50) // Keep last 50 conversions
      setConversionHistory(updatedHistory)
      localStorage.setItem(
        'timestamp-conversion-history',
        JSON.stringify(updatedHistory)
      )
    } catch (error) {
      console.error('Error saving to history:', error)
    }
  }

  const clearHistory = () => {
    setConversionHistory([])
    localStorage.removeItem('timestamp-conversion-history')
  }

  const convertTimestamp = () => {
    setError('')
    setResults([])

    if (!timestamp.trim()) {
      setError('Please enter a timestamp')
      return
    }

    const numericTimestamp = parseInt(timestamp.trim())

    if (isNaN(numericTimestamp)) {
      setError('Please enter a valid numeric timestamp')
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
        relative: getRelativeTime(date),
      })

      // Add selected timezone result (if different from local)
      if (selectedTimezone !== userTimezone) {
        const selectedZonedTime = utcToZonedTime(date, selectedTimezone)
        newResults.push({
          timezone: selectedTimezone,
          formatted: formatTz(selectedZonedTime, 'PPpp', {
            timeZone: selectedTimezone,
          }),
          iso: selectedZonedTime.toISOString(),
          relative: getRelativeTime(date),
        })
      }

      // Add UTC result (if not already included)
      if (selectedTimezone !== 'UTC' && userTimezone !== 'UTC') {
        newResults.push({
          timezone: 'UTC',
          formatted: format(date, 'PPpp') + ' UTC',
          iso: date.toISOString(),
          relative: getRelativeTime(date),
        })
      }

      setResults(newResults)

      // Save to history - use the primary result (local timezone or selected timezone)
      const primaryResult = newResults[0]
      saveToHistory(
        timestamp.trim(),
        primaryResult.formatted,
        primaryResult.timezone
      )
    } catch (err) {
      setError(
        'Error converting timestamp. Please check the value and try again.'
      )
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
      return diffSeconds === 0
        ? 'now'
        : `${Math.abs(diffSeconds)} seconds ${diffSeconds > 0 ? 'ago' : 'from now'}`
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

  const pageTitle = 'Timestamp Converter | Convert Timestamps to Readable Dates'
  const pageDescription =
    'Free online tool to convert timestamps to human-readable dates and times. Supports multiple timezones and provides instant results.'
  const canonicalUrl = 'https://timestamp-converter.com'

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <meta name='description' content={pageDescription} />
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <link rel='canonical' href={canonicalUrl} />

        {/* Open Graph / Facebook */}
        <meta property='og:type' content='website' />
        <meta property='og:url' content={canonicalUrl} />
        <meta property='og:title' content={pageTitle} />
        <meta property='og:description' content={pageDescription} />
        <meta property='og:site_name' content='Timestamp Converter' />

        {/* Twitter */}
        <meta name='twitter:card' content='summary_large_image' />
        <meta name='twitter:title' content={pageTitle} />
        <meta name='twitter:description' content={pageDescription} />

        {/* Structured Data */}
        <script
          type='application/ld+json'
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebApplication',
              name: 'Timestamp Converter',
              description: pageDescription,
              applicationCategory: 'Utility',
              operatingSystem: 'Web',
              offers: {
                '@type': 'Offer',
                price: '0',
                priceCurrency: 'USD',
              },
            }),
          }}
        />
      </Head>

      <Container>
        <CardNarrow>
          <Title>Convert timestamps</Title>

          <FormSection aria-label='Timestamp Conversion Form'>
            <FormLabel htmlFor='timestamp'>
              Timestamp (seconds or milliseconds)
            </FormLabel>
            <CurrentTimeContainer>
              <CurrentTimeDisplay>
                <div>{`Current timestamp: ${currentTime}`}</div>
                <div>{`${format(new Date(currentTime * 1000), 'PPpp')}`}</div>
              </CurrentTimeDisplay>
              <UseButton type='button' onClick={fillCurrentTimestamp}>
                Use
              </UseButton>
            </CurrentTimeContainer>
            <InputContainer>
              <TimestampInput
                id='timestamp'
                type='text'
                value={timestamp}
                onChange={e => setTimestamp(e.target.value)}
                placeholder='e.g., 1691798642 or 1691798642000'
                onKeyPress={e => e.key === 'Enter' && convertTimestamp()}
              />
            </InputContainer>
          </FormSection>

          <section aria-label='Timezone Selection'>
            <TimezoneSelect
              id='timezone'
              value={selectedTimezone}
              onChange={setSelectedTimezone}
            />
          </section>

          <ConvertButton
            onClick={convertTimestamp}
            aria-label='Convert Timestamp'
          >
            Convert Timestamp
          </ConvertButton>

          {error && (
            <ErrorMessage>
              <ResultLabel>Error</ResultLabel>
              <ResultValue>{error}</ResultValue>
            </ErrorMessage>
          )}

          {results.length > 0 && (
            <ResultsContainer>
              {results.map((result, index) => (
                <ResultItem key={index}>
                  <ResultLabel>{result.timezone}</ResultLabel>
                  <ResultValue>{result.formatted}</ResultValue>
                  <ResultMeta>
                    {result.relative} • ISO: {result.iso}
                  </ResultMeta>
                </ResultItem>
              ))}
            </ResultsContainer>
          )}
        </CardNarrow>
        <Card className='conversion-history'>
          <section aria-label='Conversion History'>
            <ConversionHistoryComponent
              history={conversionHistory}
              onClearHistory={clearHistory}
              onSelectTimestamp={setTimestamp}
            />
          </section>
        </Card>
      </Container>
    </>
  )
}
