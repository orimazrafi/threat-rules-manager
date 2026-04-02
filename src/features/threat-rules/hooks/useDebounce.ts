import { useEffect, useState } from 'react'

/**
 * Returns `value` delayed by `delayMs`. The delay is the right place for a
 * small effect: it mirrors an external clock, not “syncing” React state.
 */
export function useDebounce<T>(value: T, delayMs: number): T {
  const [debounced, setDebounced] = useState(value)

  useEffect(() => {
    const id = window.setTimeout(() => setDebounced(value), delayMs)
    return () => window.clearTimeout(id)
  }, [value, delayMs])

  return debounced
}
