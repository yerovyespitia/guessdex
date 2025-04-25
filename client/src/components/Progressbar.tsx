type ProgressbarProps = {
  timer: number
}

export const Progressbar = ({ timer }: ProgressbarProps) => {
  return (
    <div className='flex flex-col gap-2'>
      <div className='relative w-12 h-12 mx-auto'>
        <svg className='transform -rotate-90 w-12 h-12'>
          <circle
            cx='24'
            cy='24'
            r='22'
            stroke='black'
            strokeWidth='4'
            fill='transparent'
            className='w-full h-full'
            strokeLinecap='round'
          />
          <circle
            cx='24'
            cy='24'
            r='22'
            stroke={timer <= 3 ? 'red' : timer <= 10 ? 'yellow' : 'white'}
            strokeWidth='4'
            fill='transparent'
            strokeDasharray={`${2 * Math.PI * 22}`}
            strokeDashoffset={`${2 * Math.PI * 22 * (1 - timer / 15)}`}
            className='transition-all duration-1000 ease-linear'
            strokeLinecap='round'
          />
        </svg>
        <div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2'>
          <p className='text-white font-bold'>{timer}</p>
        </div>
      </div>
    </div>
  )
}
