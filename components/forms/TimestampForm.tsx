import styled from '@emotion/styled'
import { ChangeEvent } from 'react'
import { format } from 'date-fns'
import dynamic from 'next/dynamic'

const TimezoneSelect = dynamic<{
  id?: string
  value: string
  onChange: (value: string) => void
  className?: string
}>(() => import('../../components/timezoneSelect').then(mod => mod.default), {
  ssr: false,
  loading: () => <div>Loading timezone selector...</div>,
})

const FormSection = styled.section`
  display: flex;
  flex-direction: column;
  gap: 2rem;
  width: 100%;
  margin-bottom: 1.5rem;
`

const FormLabel = styled.label`
  color: var(--color-primary-text);
  font-size: 0.9rem;
  font-weight: 500;
  display: block;
  margin-bottom: 1rem;
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
  box-sizing: border-box;

  &:focus {
    outline: none;
    border-color: var(--color-input-focus);
    box-shadow: var(--shadow-input);
  }
`

const CurrentTimeContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 01rem;
  @media (min-width: 768px) {
    flex-direction: row;
    gap: 0.5rem;
  }
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

const UseButton = styled.button`
  flex: 0.25;
  padding: 0.75rem 1rem;
  background: transparent;
  color: var(--color-button-text);
  border: 1px solid var(--color-button-text);
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;

  &:hover {
    background: var(--color-button-hover-bg);
    border-color: var(--color-button-hover-bg);
  }
`

const ConvertButton = styled.button`
  width: 100%;
  padding: 0.75rem 1.5rem;
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

interface TimestampFormProps {
  label: string
  id: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
  type?: string
  className?: string
  showCurrentTime?: boolean
  currentTimestamp?: number
  onUseCurrentTime?: () => void
  showTimezoneSelect?: boolean
  timezone?: string
  onTimezoneChange?: (timezone: string) => void
  showConvertButton?: boolean
  onConvert?: () => void
  convertButtonLabel?: string
}

export const TimestampForm = ({
  label,
  id,
  value,
  onChange,
  placeholder = '',
  type = 'text',
  className = '',
  currentTimestamp = 0,
  onUseCurrentTime,
  timezone = 'UTC',
  onTimezoneChange,
  onConvert,
  convertButtonLabel = 'Convert Timestamp',
}: TimestampFormProps) => {
  return (
    <FormSection className={className} aria-label='Timestamp Conversion Form'>
      <div>
        <FormLabel htmlFor={id}>{label}</FormLabel>

        <CurrentTimeContainer>
          <CurrentTimeDisplay>
            <div>{`Current timestamp: ${currentTimestamp}`}</div>
            <div>{`${format(new Date(currentTimestamp * 1000), 'PPpp')}`}</div>
          </CurrentTimeDisplay>
          {onUseCurrentTime && (
            <UseButton type='button' onClick={onUseCurrentTime}>
              Use
            </UseButton>
          )}
        </CurrentTimeContainer>

        <TimestampInput
          id={id}
          type={type}
          value={value}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            onChange(e.target.value)
          }
          placeholder={placeholder}
        />
      </div>

      <TimezoneSelect
        id='timezone'
        value={timezone}
        onChange={onTimezoneChange || (() => {})}
      />

      <ConvertButton type='button' onClick={onConvert || (() => {})}>
        {convertButtonLabel}
      </ConvertButton>
    </FormSection>
  )
}

export default TimestampForm
