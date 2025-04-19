type ScoreBoardProps = {
  correct: number
  wrong: number
}

export const ScoreBoard = ({ correct, wrong }: ScoreBoardProps) => (
  <div className='flex justify-between gap-12 text-white mb-4'>
    <p className='text-2xl md:text-3xl font-bold'>
      Correct: <span className='font-medium'>{correct}</span>
    </p>
    <p className='text-2xl md:text-3xl font-bold'>
      Wrong: <span className='font-medium'>{wrong}</span>
    </p>
  </div>
)
