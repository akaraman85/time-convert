export interface TimezoneSelectProps {
  value: string
  onChange: (value: string) => void
  id?: string
  className?: string
}

export interface ConversionResult {
  timezone: string
  formatted: string
  iso: string
  relative: string
}

export interface ConversionHistory {
  timestamp: number
  timezone: string
  formatted: string
}
