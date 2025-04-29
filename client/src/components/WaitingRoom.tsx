const gameModes = [
  {
    id: 'classic',
    name: 'Classic',
    description: 'Guess Pokémon with a 15-second timer per round',
  },
  {
    id: 'mirror',
    name: 'Mirror Mode',
    description: 'Both players guess the same Pokémon at the same time',
  },
  {
    id: 'marathon',
    name: 'Marathon',
    description: 'Guess as many Pokémon as you can in 60 seconds',
  },
  {
    id: 'speed',
    name: 'Speed Run',
    description: 'Race against time with only 5 seconds per Pokémon',
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
    <div className='flex flex-col items-center justify-center bg-white text-white w-full px-12 py-8 rounded-lg max-w-5xl mx-auto'>
      <h1 className='text-3xl font-bold mb-2 text-zinc-800'>Waiting Room</h1>
      <p className='font-light text-zinc-500'>
        Choose your game settings while waiting for other players
      </p>
      <div className='flex flex-col gap-2'>
        <h2 className='font-semibold text-xl text-zinc-800'>Game mode</h2>
        <div className='flex gap-2 mb-4'>
          {gameModes.map((mode) => (
            <label
              key={mode.id}
              className='flex items-center gap-2 p-3 rounded-lg border border-zinc-200 hover:bg-gray-200 cursor-pointer peer-checked:border-white'
            >
              <input
                type='radio'
                id={mode.id}
                name='gameMode'
                value={mode.id}
                className='peer hidden'
              />
              <div>
                <h3 className='font-semibold text-zinc-800'>{mode.name}</h3>
                <p className='text-sm text-zinc-600'>{mode.description}</p>
              </div>
            </label>
          ))}
        </div>
        <div className='flex flex-col gap-2 mb-4'>
          <label
            className='font-semibold text-xl text-zinc-800'
            htmlFor='generation'
          >
            Pokémon Generation
          </label>
          <select
            className='w-fit px-4 py-2 bg-white text-black rounded-lg border-2 border-zinc-200 hover:border-zinc-300 cursor-pointer hover:bg-white transition-colors appearance-none focus:outline-none focus:ring-2 focus:ring-white'
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
        <div className='flex flex-col gap-2 mb-4'>
          <div className='flex gap-2'>
            <label className='relative inline-flex items-center cursor-pointer'>
              <input
                type='checkbox'
                className='sr-only peer'
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              <span className='ml-3 text-sm font-semibold text-zinc-800'>
                Random Mode
              </span>
            </label>
          </div>
        </div>
        <div className='flex flex-col gap-2 bg-zinc-100 p-4 rounded-lg'>
          <div className='flex flex-col gap-2'>
            <div className='flex items-center justify-between gap-2'>
              <div className='flex items-center gap-2'>
                <img
                  src='/svgs/players.svg'
                  alt='players'
                  className='size-5'
                />
                <h2 className='font-semibold text-lg text-zinc-800'>
                  Players waiting
                </h2>
              </div>
              <div className='bg-gray-200 px-3 rounded-full border border-gray-300'>
                <p className='text-sm text-black/80 font-semibold'>1/2</p>
              </div>
            </div>
            <div className='flex items-center gap-2'>
              <div className='w-full h-2 bg-green-500 rounded-full'></div>
              <div className='w-full h-2 bg-gray-300 rounded-full animate-pulse'></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
