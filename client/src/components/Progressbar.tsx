type ProgressbarProps = {
  timer: number
}

export const Progressbar = ({ timer }: ProgressbarProps) => {
  return (
    <div className='flex flex-col gap-2'>
      <div className='flex justify-between'>
        <p className='text-white'>Time left</p>
        <p className='text-white font-bold'>{timer}s</p>
      </div>
      <div className='mb-5 h-2 rounded-full bg-black'>
        <div
          className='h-2 rounded-full bg-white transition-all duration-1000 ease-linear'
          style={{ width: `${(timer / 15) * 100}%` }}
        ></div>
      </div>
    </div>
  )
}
