'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSocket } from '@/hooks/useSocket'

type JoinFormProps = {
  disabled?: boolean
}

export const JoinForm = ({ disabled }: JoinFormProps) => {
  const [code, setCode] = useState('')
  const [showPlaceholder, setShowPlaceholder] = useState(true)
  const router = useRouter()
  const socket = useSocket()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (code.trim() && socket) {
      console.log('Joining room:', code)
      router.push(`/room/${code}`)
      setCode('')
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className='flex justify-center items-center'
    >
      <input
        type='text'
        className='px-6 py-3 w-96 border text-center border-white rounded-lg text-white outline-none bg-transparent disabled:opacity-50 disabled:cursor-not-allowed'
        placeholder={showPlaceholder ? 'Enter Room Code' : ''}
        value={code}
        onChange={(e) => setCode(e.target.value)}
        onFocus={() => setShowPlaceholder(false)}
        onBlur={() => setShowPlaceholder(true)}
        disabled={disabled}
      />
    </form>
  )
}
