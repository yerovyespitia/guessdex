import { useQuery } from '@tanstack/react-query'
import { getPokemon } from '../utils/get'

export function usePokemon() {
  return useQuery({
    queryKey: ['pokemon'],
    queryFn: getPokemon,
    staleTime: 0, // Always consider data stale to get fresh Pokemon on each query
    refetchOnWindowFocus: false, // Don't refetch when window regains focus
  })
}
