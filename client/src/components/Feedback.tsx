type FeedbackProps = {
  status: 'correct' | 'wrong' | null
  name: string
}

export const Feedback = ({ status, name }: FeedbackProps) => {
  if (!status) return null

  const icon =
    status === 'correct' ? (
      <div className='bg-green-500 text-white rounded-full p-2'>
        <svg
          xmlns='http://www.w3.org/2000/svg'
          className='size-4'
          fill='none'
          viewBox='0 0 24 24'
          stroke='currentColor'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth={2}
            d='M5 13l4 4L19 7'
          />
        </svg>
      </div>
    ) : (
      <div className='bg-red-500 text-white rounded-full p-2'>
        <svg
          xmlns='http://www.w3.org/2000/svg'
          className='size-4'
          fill='none'
          viewBox='0 0 24 24'
          stroke='currentColor'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth={2}
            d='M6 18L18 6M6 6l12 12'
          />
        </svg>
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
