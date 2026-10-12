import { useEffect, useRef } from "react"

interface InfiniteScrollOptions {
  enabled: boolean
  onLoadMore: () => void
}

/** Observes a list sentinel and invokes pagination when it nears the viewport. */
export default function useInfiniteScroll({
  enabled,
  onLoadMore,
}: InfiniteScrollOptions) {
  const sentinelRef = useRef<HTMLDivElement | null>(null)
  const callbackRef = useRef(onLoadMore)
  callbackRef.current = onLoadMore

  useEffect(() => {
    const element = sentinelRef.current
    if (!enabled || !element || !("IntersectionObserver" in window)) {
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          callbackRef.current()
        }
      },
      { rootMargin: "320px 0px" },
    )

    observer.observe(element)
    return () => observer.disconnect()
  }, [enabled])

  return sentinelRef
}
