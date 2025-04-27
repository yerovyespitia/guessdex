const gameModes = [
  {
    id: 'classic',
    name: 'Classic',
    description: 'Guess Pokémon with a 15-second timer per round',
  },
  {
    id: 'timeAttack',
    name: 'Time Attack',
    description: 'Race against the clock with decreasing time per round',
  },
  {
    id: 'survival',
    name: 'Survival',
    description: 'Keep playing until you make 3 wrong guesses',
  },
]

const generations = [
  { value: 'all', label: 'All Generations' },
  { value: 'gen1', label: 'Gen 1 (Kanto)' },
  { value: 'gen2', label: 'Gen 2 (Johto)' },
  { value: 'gen3', label: 'Gen 3 (Hoenn)' },
  { value: 'gen4', label: 'Gen 4 (Sinnoh)' },
  { value: 'gen5', label: 'Gen 5 (Unova)' },
  { value: 'gen6', label: 'Gen 6 (Kalos)' },
  { value: 'gen7', label: 'Gen 7 (Alola)' },
  { value: 'gen8', label: 'Gen 8 (Galar)' },
]

export const WaitingRoom = () => {
  return (
    <div className='h-[calc(100vh-76px)] flex flex-col items-center justify-center bg-sky-800 text-white w-full px-12'>
      <h1 className='text-3xl font-bold mb-2'>Waiting Room</h1>
      <p className='font-light text-zinc-300'>
        Choose your game settings while waiting for other players
      </p>
      <div className='flex flex-col gap-4'>
        <div>
          <h2 className='font-bold text-2xl'>Game mode</h2>
          <div className='flex gap-2'>
            {gameModes.map((mode) => (
              <label
                key={mode.id}
                className='flex items-center gap-2 p-3 rounded-lg hover:bg-sky-700 cursor-pointer border-2 border-transparent peer-checked:border-white'
              >
                <input
                  type='radio'
                  id={mode.id}
                  name='gameMode'
                  value={mode.id}
                  className='peer hidden'
                />
                <div>
                  <h3 className='font-semibold'>{mode.name}</h3>
                  <p className='text-sm text-zinc-300'>{mode.description}</p>
                </div>
              </label>
            ))}
          </div>
        </div>
        <div className='flex flex-col gap-2'>
          <label
            className='font-bold text-2xl'
            htmlFor='generation'
          >
            Pokémon Generation
          </label>
          <select
            className='w-fit px-4 py-2 bg-white text-black rounded-lg border-2 border-white cursor-pointer hover:bg-white transition-colors appearance-none focus:outline-none focus:ring-2 focus:ring-white'
            id='generation'
          >
            {generations.map((gen) => (
              <option
                key={gen.value}
                value={gen.value}
                className='px-4 py-2 bg-white text-black hover:bg-gray-100'
              >
                {gen.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  )
}
