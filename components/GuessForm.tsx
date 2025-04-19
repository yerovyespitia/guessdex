import { useState, forwardRef } from 'react'

type GuessFormProps = {
  value: string
  onChange: (value: string) => void
  onSubmit: () => void
  disabled?: boolean
}

export const GuessForm = forwardRef<HTMLInputElement, GuessFormProps>(
  ({ value, onChange, onSubmit, disabled }, ref) => {
    const [showPlaceholder, setShowPlaceholder] = useState(true)

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault()
      onSubmit()
    }

    return (
      <form
        onSubmit={handleSubmit}
        className='flex justify-center items-center'
      >
        <input
          ref={ref}
          type='text'
          className='px-6 py-3 w-96 border text-lg text-center border-white rounded-lg text-white outline-none bg-transparent disabled:opacity-50 disabled:cursor-not-allowed'
          placeholder={showPlaceholder ? 'Make a guess...' : ''}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setShowPlaceholder(false)}
          onBlur={() => setShowPlaceholder(true)}
          disabled={disabled}
        />
      </form>
    )
  }
)

GuessForm.displayName = 'GuessForm'
