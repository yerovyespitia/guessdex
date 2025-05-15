import { createFileRoute } from '@tanstack/react-router'
import { WaitingRoom } from '../components/WaitingRoom'

export const Route = createFileRoute('/settings')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <main className='bg-sky-800 h-[calc(100vh-76px)] flex justify-center items-center mx-auto flex-col'>
      <div className='flex flex-col gap-4 items-center mx-4'>
        <WaitingRoom title='Game Settings' />
      </div>
    </main>
  )
}
