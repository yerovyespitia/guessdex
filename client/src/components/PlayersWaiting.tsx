export const PlayersWaiting = () => {
  return (
    <div className='flex flex-col gap-2 bg-zinc-100 p-2 rounded-lg'>
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
  )
}
