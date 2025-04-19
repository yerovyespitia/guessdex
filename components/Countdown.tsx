type CountdownProps = {
  value: number | null
}

export const Countdown = ({ value }: CountdownProps) => {
  return (
    <div className='text-white text-2xl font-bold mt-4 h-[36px] flex items-center justify-center'>
      {value !== null && <p>Next Pokémon in: {value}</p>}
    </div>
  )
}
