import { useState } from 'react'

type GuessFormProps = {
  value: string
  onChange: (value: string) => void
  onSubmit: () => void
}

export const GuessForm = ({ value, onChange, onSubmit }: GuessFormProps) => {
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
        type='text'
        className='px-6 py-3 w-full md:w-96 border text-lg text-center border-white rounded-lg text-white outline-none'
        placeholder={showPlaceholder ? 'Make a guess...' : ''}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setShowPlaceholder(false)}
        onBlur={() => setShowPlaceholder(true)}
      />
    </form>
  )
}
