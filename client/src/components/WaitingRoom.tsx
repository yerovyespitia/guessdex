import { useRouter } from '@tanstack/react-router'
import { singlePlayerGameModes, generations } from '../config'
import { PlayersWaiting } from './PlayersWaiting'
import { useGameModeStore } from '../store/gamemode'
import { useGenerationStore } from '../store/generations'

type WaitingRoomProps = {
  title: string
  multiplayer?: boolean
}

export const WaitingRoom = ({
  title,
  multiplayer = false,
}: WaitingRoomProps) => {
  const { gameMode, setGameMode } = useGameModeStore()
  const { generation, setGeneration } = useGenerationStore()
  const router = useRouter()

  console.log('generation', generation)

  return (
    <div className='flex flex-col justify-center bg-zinc-100 text-white w-full px-6 py-8 rounded-lg md:max-w-3xl mx-auto'>
      <section className='flex flex-col items-center gap-2 mb-4'>
        <h1 className='text-2xl font-bold text-zinc-800'>{title}</h1>
        <p className='font-light text-zinc-500'>
          Choose your settings for the game
        </p>
      </section>
      {/* <section className='flex flex-col gap-2 mb-4'>
        <label
          className='font-semibold text-lg md:text-xl text-zinc-800'
          htmlFor='nickname'
        >
          Your Nickname
        </label>
        <input
          type='text'
          id='nickname'
          placeholder='Enter your nickname'
          className='w-full px-4 py-2 bg-white text-black rounded-lg border-2 border-zinc-200 hover:border-zinc-300 focus:outline-none focus:ring-2 focus:ring-white'
          maxLength={15}
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
        />
      </section> */}
      <div className='flex flex-col gap-2'>
        <h2 className='font-semibold text-lg md:text-xl text-zinc-800'>
          Game modes
        </h2>
        <div className='flex flex-col md:flex-row gap-2 mb-4'>
          {singlePlayerGameModes.map((mode) => (
            <div
              key={mode.id}
              className='relative'
            >
              <input
                type='radio'
                id={mode.id}
                name='gameMode'
                value={mode.id}
                className='peer sr-only'
                checked={gameMode === mode.id}
                onChange={() => setGameMode(mode.id)}
              />
              <label
                htmlFor={mode.id}
                className='flex items-center gap-2 p-3 rounded-lg border border-zinc-200 hover:bg-gray-200 cursor-pointer peer-checked:border-blue-500 peer-checked:bg-blue-50 transition-all'
              >
                <div>
                  <h3 className='font-semibold text-zinc-800'>{mode.name}</h3>
                  <p className='text-sm text-zinc-600'>{mode.description}</p>
                </div>
              </label>
            </div>
          ))}
        </div>
        <div className='flex flex-col gap-2 mb-4'>
          <label
            className='font-semibold text-lg md:text-xl text-zinc-800'
            htmlFor='generation'
          >
            Pokémon Generation
          </label>
          <select
            className='w-full md:w-fit px-4 py-2 bg-white text-black rounded-lg border-2 border-zinc-200 hover:border-zinc-300 cursor-pointer hover:bg-white transition-colors appearance-none focus:outline-none focus:ring-2 focus:ring-white'
            id='generation'
            value={generation.id}
            onChange={(e) =>
              setGeneration({
                id: e.target.value,
                value:
                  generations.find((gen) => gen.id === e.target.value)?.value ||
                  151,
                label:
                  generations.find((gen) => gen.id === e.target.value)?.label ||
                  'Gen 1 (Kanto)',
                offset:
                  generations.find((gen) => gen.id === e.target.value)
                    ?.offset || 0,
              })
            }
          >
            {generations.map((gen) => (
              <option
                key={gen.id}
                value={gen.id}
                className='px-4 py-2 bg-white text-black hover:bg-gray-600'
              >
                {gen.label}
              </option>
            ))}
          </select>
        </div>
        {multiplayer && <PlayersWaiting />}
        <div className='flex justify-between gap-2'>
          <button
            onClick={() => router.navigate({ to: '/' })}
            className='bg-white border-2 border-zinc-200 hover:border-zinc-300 hover:bg-neutral-200 rounded-md px-4 py-2.5 text-black flex items-center cursor-pointer'
          >
            <img
              src='/svgs/left.svg'
              alt='back'
              className='mr-2 size-4'
            />
            Back to Game
          </button>
        </div>
      </div>
    </div>
  )
}
