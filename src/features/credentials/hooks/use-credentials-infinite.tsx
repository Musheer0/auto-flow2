// hooks/use-workflows-infinite.ts
"use client"
import { useTRPC } from '@/trpc/client'
import { useInfiniteQuery } from '@tanstack/react-query'

export const useCredentialsInfinite = () => {
  const trpc = useTRPC()
  return useInfiniteQuery(
    trpc.credentials.getAll.infiniteQueryOptions(
      {},
      {
        getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
        initialCursor: undefined,
      }
    )
  )
}