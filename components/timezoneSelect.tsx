import { useState, useEffect, useMemo } from 'react'
import TIMEZONES from '../utils/timezones'

interface TimezoneSelectProps {
  value: string
  onChange: (value: string) => void
  id?: string
  className?: string
}

type TimezoneGroup = {
  region: string
  timezones: string[]
}

export default function TimezoneSelect({
  value,
  onChange,
  id = 'timezone',
  className = '',
  ...props
}: TimezoneSelectProps) {
  const [isClient, setIsClient] = useState(false)
  const [selectedRegion, setSelectedRegion] = useState('')

  // Group timezones by region
  const timezoneGroups = useMemo(() => {
    const groups: Record<string, string[]> = {}

    TIMEZONES.forEach(tz => {
      const [region] = tz.split('/')
      if (!groups[region]) {
        groups[region] = []
      }
      groups[region].push(tz)
    })

    // Convert to array and sort regions
    return Object.entries(groups)
      .map(([region, timezones]) => ({
        region,
        timezones: timezones.sort(),
      }))
      .sort((a, b) => a.region.localeCompare(b.region))
  }, [])

  // Set default region based on current value
  useEffect(() => {
    if (value) {
      const [region] = value.split('/')
      setSelectedRegion(region)
    } else if (timezoneGroups.length > 0) {
      setSelectedRegion(timezoneGroups[0].region)
    }
  }, [value, timezoneGroups])

  // Get filtered timezones based on selected region
  const filteredTimezones = useMemo(() => {
    const group = timezoneGroups.find(g => g.region === selectedRegion)
    return group ? group.timezones : []
  }, [selectedRegion, timezoneGroups])

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) {
    return (
      <div className={`space-y-2 ${className}`}>
        <select className='select select-bordered w-full' disabled>
          <option>Loading regions...</option>
        </select>
        <select className='select select-bordered w-full' disabled>
          <option>Loading timezones...</option>
        </select>
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'row', gap: '1rem' }}>
      <div>
        <label htmlFor={`${id}-region`} className='label'>
          <span className='label-text'>Region</span>
        </label>
        <select
          id={`${id}-region`}
          className='select select-bordered w-full'
          value={selectedRegion}
          onChange={e => {
            const newRegion = e.target.value
            setSelectedRegion(newRegion)
            // Select first timezone in the new region
            const firstTz = timezoneGroups.find(g => g.region === newRegion)
              ?.timezones[0]
            if (firstTz) {
              onChange(firstTz)
            }
          }}
        >
          {timezoneGroups.map(({ region }) => (
            <option key={region} value={region}>
              {region}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor={id} className='label'>
          <span className='label-text'>Timezone</span>
        </label>
        <select
          id={id}
          className='select select-bordered w-full'
          value={value}
          onChange={e => onChange(e.target.value)}
          {...props}
        >
          {filteredTimezones.map(tz => {
            const tzName = tz.includes('/')
              ? tz.split('/').slice(1).join(' / ')
              : tz
            return (
              <option key={tz} value={tz}>
                {tzName}
              </option>
            )
          })}
        </select>
      </div>
    </div>
  )
}
