'use client'
import Image from 'next/image'
import { Pokemon } from '@/types/pokemon'
import { useState } from 'react'

type CardProps = {
  pokemon: Pokemon
}

export const Card = ({ pokemon }: CardProps) => {
  const [showPlaceholder, setShowPlaceholder] = useState(true)
  const [guess, setGuess] = useState('')

  console.log('guess', guess)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
  }

  return (
    <div>
      <Image
        width={400}
        height={400}
        src={pokemon.sprites.other['official-artwork'].front_default}
        alt={`Random pokemon artwork`}
        className={`${
          guess && guess.toLowerCase() === pokemon.name.toLowerCase()
            ? 'brightness-100'
            : 'brightness-0'
        }`}
      />
      <form
        onSubmit={handleSubmit}
        className='flex justify-center items-center pt-8'
      >
        <input
          type='text'
          className='px-6 py-3 w-96 border text-lg text-center border-white rounded-lg text-white outline-none'
          placeholder={showPlaceholder ? 'Make a guess...' : ''}
          value={guess}
          onChange={(e) => setGuess(e.target.value)}
          onFocus={() => setShowPlaceholder(false)}
          onBlur={() => setShowPlaceholder(true)}
        />
      </form>
    </div>
  )
}
