import { useState, useEffect, useCallback, useMemo } from 'react'
import { useSearchBox, useHits } from 'react-instantsearch'
import { BlogHit } from '@/types/search'
import { useAlgoliaCache } from './useAlgoliaCache'

export const useSearchState = () => {
  const { query, refine, clear } = useSearchBox()
  const { hits } = useHits<BlogHit>()
  const { getCachedResult, setCachedResult } = useAlgoliaCache()

  const [localQuery, setLocalQuery] = useState(query)
  const [isSearching, setIsSearching] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [cachedSuggestions, setCachedSuggestions] = useState<BlogHit[]>([])

  const debouncedRefine = useCallback(
    debounce((searchQuery: string) => {
      const cached = getCachedResult(searchQuery)
      if (cached) {
        setCachedSuggestions(cached)
        setIsSearching(false)
      } else {
        refine(searchQuery)
        setIsSearching(false)
      }
    }, 300),
    [refine, getCachedResult]
  )

  const handleQueryChange = useCallback(
    (newQuery: string) => {
      setLocalQuery(newQuery)
      setIsSearching(true)
      setShowSuggestions(true)
      debouncedRefine(newQuery)
    },
    [debouncedRefine]
  )

  const handleClear = useCallback(() => {
    setLocalQuery('')
    setShowSuggestions(false)
    setCachedSuggestions([])
    clear()
  }, [clear])

  const handleSuggestionSelect = useCallback(
    (suggestion: BlogHit) => {
      setLocalQuery(suggestion.title)
      setShowSuggestions(false)
      refine(suggestion.title)
    },
    [refine]
  )

  useEffect(() => {
    if (localQuery.length === 0) {
      setShowSuggestions(false)
      setCachedSuggestions([])
    }
  }, [localQuery])

  useEffect(() => {
    if (!isSearching && localQuery.length > 0 && !getCachedResult(localQuery)) {
      setCachedResult(localQuery, hits)
      setCachedSuggestions(hits)
    }
  }, [hits, isSearching, localQuery, getCachedResult, setCachedResult])

  const suggestions = useMemo(
    () => (cachedSuggestions.length > 0 ? cachedSuggestions : hits.slice(0, 5)),
    [cachedSuggestions, hits]
  )

  return {
    query: localQuery,
    isSearching,
    showSuggestions,
    suggestions,
    handleQueryChange,
    handleClear,
    handleSuggestionSelect,
    setShowSuggestions,
  }
}

function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout
  return (...args: Parameters<T>) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
} 