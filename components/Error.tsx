import { useRouter } from 'next/navigation'

type ErrorProps = {
  error: string
}

export const Error = ({ error }: ErrorProps) => {
  const router = useRouter()

  return (
    <div className='bg-purple-800 h-[calc(100vh-64px)] flex justify-center items-center mx-auto flex-col'>
      <h1 className='text-white text-3xl md:text-4xl font-bold mb-8 font-[Helvetica] tracking-tight'>
        Error: <span className='font-medium'>{error}</span>
      </h1>
      <button
        onClick={() => router.push('/')}
        className='bg-white font-bold text-purple-800 px-8 py-3 rounded-lg cursor-pointer'
      >
        Go Home
      </button>
    </div>
  )
}
