import { useState, useEffect } from 'react'
import type { TimezoneSelectProps as PropsType } from '../types'
import styled from '@emotion/styled'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;

  @media (min-width: 768px) {
    flex-direction: row;
    gap: 0.5rem;
  }
`

const StyledSelect = styled.select`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid var(--color-input-border, #e2e8f0);
  border-radius: 0.5rem;
  background-color: var(--color-input-background, white);
  color: var(--color-primary-text, #1a202c);
  font-size: 1rem;
  line-height: 1.5;
  transition: all 0.2s ease;
  appearance: none;
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right 0.75rem center;
  background-size: 1.5em 1.5em;
  padding-right: 2.5rem;

  &:focus {
    outline: none;
    border-color: var(--color-input-focus, #667eea);
    box-shadow: var(--shadow-input, 0 0 0 2px rgba(102, 126, 234, 0.2));
  }

  &:disabled {
    background-color: var(--color-input-disabled, #f7fafc);
    cursor: not-allowed;
    opacity: 0.7;
  }

  & option {
    background-color: var(--color-input-background, white);
    color: var(--color-primary-text, #1a202c);
  }
`

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: var(--color-primary-text, #4a5568);
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
