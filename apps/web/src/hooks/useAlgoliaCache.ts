import { useRef } from 'react'
import { BlogHit } from '@/types/search'

type Cache = Map<string, BlogHit[]>

export const useAlgoliaCache = () => {
  const cacheRef = useRef<Cache>(new Map())

  const getCachedResult = (query: string) => {
    return cacheRef.current.get(query)
  }

  const setCachedResult = (query: string, results: BlogHit[]) => {
    cacheRef.current.set(query, results)
  }

  return { getCachedResult, setCachedResult }
} 