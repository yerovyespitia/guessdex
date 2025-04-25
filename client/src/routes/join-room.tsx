import { createFileRoute } from '@tanstack/react-router'
import { JoinForm } from '../components/JoinRoom'

export const Route = createFileRoute('/join-room')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <main className='bg-sky-800 h-[calc(100vh-76px)] flex justify-center items-center mx-auto flex-col'>
      <h1 className='text-white text-3xl md:text-5xl font-bold mb-8'>
        Join Room
      </h1>
      <div className='flex flex-col gap-4 items-center'>
        <JoinForm />
      </div>
    </main>
  )
}
