type FeedbackProps = {
  status: 'correct' | 'wrong' | null
  name: string
}

export const Feedback = ({ status, name }: FeedbackProps) => {
  if (!status) return null

  const icon =
    status === 'correct' ? (
      <div className='bg-green-500 text-white rounded-full p-2'>
        <img
          src='/svgs/check.svg'
          alt='check'
          className='size-4 filter invert'
        />
      </div>
    ) : (
      <div className='bg-red-500 text-white rounded-full p-2'>
        <img
          src='/svgs/wrong.svg'
          alt='wrong'
          className='size-4 filter invert'
        />
      </div>
    )

  return (
    <div className='flex items-center justify-center gap-2'>
      <div className='text-white text-2xl font-bold text-center'>
        <p className='capitalize'>{name}</p>
      </div>
      <div className='flex items-center justify-center'>{icon}</div>
    </div>
  )
}
