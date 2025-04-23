import { Link } from '@tanstack/react-router'

export const Navbar = () => {
  return (
    <nav className='bg-purple-800 flex text-center justify-end items-center w-full p-4'>
      <div className='flex gap-4'>
        <Link
          to='/'
          className='flex items-center gap-2 text-white text-md hover:opacity-80 cursor-pointer'
          title='GuessDex'
        >
          <div className='bg-black/20 p-2 rounded-full'>
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
                d='M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6'
              />
            </svg>
          </div>
        </Link>
        <Link
          to='/create-room'
          className='flex items-center gap-2 text-white text-md hover:opacity-80 cursor-pointer'
          title='Create Room'
        >
          <div className='bg-black/20 p-2 rounded-full'>
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
                d='M12 4v16m8-8H4'
              />
            </svg>
          </div>
        </Link>
        <Link
          to='/join-room'
          className='flex items-center gap-2 text-white text-md hover:opacity-80 cursor-pointer'
          title='Join Room'
        >
          <div className='bg-black/20 p-2 rounded-full'>
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
                d='M8 3v18m0-18h8a2 2 0 012 2v14a2 2 0 01-2 2H8m4-9h4'
              />
            </svg>
          </div>
        </Link>
      </div>
    </nav>
  )
}
