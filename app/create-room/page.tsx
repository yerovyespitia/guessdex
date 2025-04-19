import { CreateForm } from '@/components/CreateForm'

export default function CreateRoom() {
  return (
    <main className='bg-purple-800 h-[calc(100vh-64px)] flex justify-center items-center mx-auto flex-col'>
      <h1 className='text-white text-3xl md:text-5xl font-bold mb-8'>
        Create Room
      </h1>
      <div className='flex flex-col gap-4 items-center'>
        <CreateForm />
      </div>
    </main>
  )
}
