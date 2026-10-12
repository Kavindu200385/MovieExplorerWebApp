import { useCallback, useState } from "react"

type SetValue<T> = T | ((previous: T) => T)

/** Persists JSON state without allowing malformed or unavailable storage to crash UI. */
export default function useLocalStorage<T>(key: string, initialValue: T) {
  const [value, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key)
      return item ? JSON.parse(item) as T : initialValue
    } catch {
      return initialValue
    }
  })

  const setValue = useCallback(
    (nextValue: SetValue<T>) => {
      setStoredValue((previous) => {
        const resolved =
          nextValue instanceof Function ? nextValue(previous) : nextValue
        try {
          window.localStorage.setItem(key, JSON.stringify(resolved))
        } catch {
          // Keep in-memory state usable when storage is blocked or full.
        }
        return resolved
      })
    },
    [key],
  )

  return [value, setValue] as const
}
