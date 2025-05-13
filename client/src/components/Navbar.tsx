import { Link } from '@tanstack/react-router'
import { useSoundStore } from '../store/sound'

export const Navbar = () => {
  const { isMuted, toggleMute } = useSoundStore()

  const navLinks = [
    { to: '/', title: 'GuessDex', icon: 'home' },
    { to: '/create-room', title: 'Create Room', icon: 'plus' },
    { to: '/join-room', title: 'Join Room', icon: 'door' },
    { to: '/', title: 'Settings', icon: 'settings' },
  ]

  return (
    <nav className='bg-sky-800 flex text-center justify-end items-center w-full p-4'>
      <div className='flex gap-4'>
        <button
          onClick={toggleMute}
          className='bg-black/20 p-3 rounded-full hover:opacity-80 cursor-pointer'
        >
          <img
            src={`/svgs/${isMuted ? 'muted' : 'volume'}.svg`}
            alt='volume'
            className='filter invert'
          />
        </button>
        {navLinks.map(({ to, title, icon }) => (
          <Link
            key={to}
            to={to}
            className='flex items-center gap-2 text-white text-md hover:opacity-80 cursor-pointer'
            title={title}
          >
            <div className='bg-black/20 p-3 rounded-full'>
              <img
                src={`/svgs/${icon}.svg`}
                alt={icon}
                className='filter invert'
              />
            </div>
          </Link>
        ))}
      </div>
    </nav>
  )
}
