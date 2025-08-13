import { useState, useEffect } from 'react'
import type { TimezoneSelectProps as PropsType } from '../types'
import styled from '@emotion/styled'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;

  @media (min-width: 768px) {
    flex-direction: row;
    gap: 0.5rem;
  }
`

const StyledSelect = styled.select`
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.375rem;
  background-color: white;
  color: #1a202c;
  font-size: 1rem;
  line-height: 1.5;
  transition: border-color 0.2s;

  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 2px rgba(102, 126, 234, 0.2);
  }

  &:disabled {
    background-color: #f7fafc;
    cursor: not-allowed;
  }
`

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: #4a5568;
`

interface TimezoneGroup {
  region: string
  timezones: string[]
}

export default function TimezoneSelect({
  value,
  onChange,
  id = 'timezone',
  className = '',
  ...props
}: PropsType) {
  const [isClient, setIsClient] = useState(false)
  const [selectedRegion, setSelectedRegion] = useState('')
  const [timezoneGroups, setTimezoneGroups] = useState<TimezoneGroup[]>([])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsClient(true)

      // Using type assertion for Intl.supportedValuesOf
      const timezones = (Intl as any).supportedValuesOf('timeZone') as string[]

      const groups: Record<string, string[]> = {}

      timezones.forEach(tz => {
        const [region] = tz.split('/')
        if (region) {
          if (!groups[region]) {
            groups[region] = []
          }
          groups[region].push(tz)
        }
      })

      const sortedGroups = Object.entries(groups)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([region, timezones]) => ({
          region,
          timezones: timezones.sort(),
        }))

      setTimezoneGroups(sortedGroups)
    }
  }, [])

  useEffect(() => {
    if (value) {
      const [region] = value.split('/')
      if (region) {
        setSelectedRegion(region)
      }
    }
  }, [value])

  if (!isClient) {
    return (
      <div className={className}>
        <StyledSelect disabled>
          <option>Loading regions...</option>
        </StyledSelect>
        <StyledSelect disabled>
          <option>Loading timezones...</option>
        </StyledSelect>
      </div>
    )
  }

  const handleRegionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newRegion = e.target.value
    setSelectedRegion(newRegion)
    // Select first timezone in the new region
    const firstTz = timezoneGroups.find(
      (g: TimezoneGroup) => g.region === newRegion
    )?.timezones[0]
    if (firstTz) {
      onChange(firstTz)
    }
  }

  const handleTimezoneChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange(e.target.value)
  }

  const currentTimezones = selectedRegion
    ? timezoneGroups.find((g: TimezoneGroup) => g.region === selectedRegion)
        ?.timezones || []
    : []

  return (
    <Container className={className}>
      <div>
        <Label htmlFor={`${id}-region`}>Region</Label>
        <StyledSelect
          id={`${id}-region`}
          value={selectedRegion}
          onChange={handleRegionChange}
        >
          <option value=''>Select a region</option>
          {timezoneGroups.map(({ region }) => (
            <option key={region} value={region}>
              {region}
            </option>
          ))}
        </StyledSelect>
      </div>
      <div>
        <Label htmlFor={id}>Timezone</Label>
        <StyledSelect
          id={id}
          value={value}
          onChange={handleTimezoneChange}
          disabled={!selectedRegion}
          {...props}
        >
          <option value=''>Select a timezone</option>
          {currentTimezones.map(timezone => (
            <option key={timezone} value={timezone}>
              {timezone}
            </option>
          ))}
        </StyledSelect>
      </div>
    </Container>
  )
}
