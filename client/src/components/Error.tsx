import { useRouter } from '@tanstack/react-router'

type ErrorProps = {
  error: string
}

export const Error = ({ error }: ErrorProps) => {
  const { navigate } = useRouter()

  const pushToHome = () => {
    navigate({ to: '/' })
  }

  return (
    <div className='bg-sky-800 h-[calc(100vh-76px)] flex justify-center items-center mx-auto flex-col'>
      <h1 className='text-white text-3xl md:text-4xl font-bold mb-8 font-[Helvetica] tracking-tight'>
        Error: <span className='font-medium'>{error}</span>
      </h1>
      <button
        onClick={pushToHome}
        className='bg-white font-bold text-sky-800 px-8 py-3 rounded-full cursor-pointer'
      >
        Go Home
      </button>
    </div>
  )
}
