import { useEffect, useRef, useState } from "react"

/**
 * Animates a number from 0 to `target` over `duration` ms with ease-out cubic.
 * Only starts when `active` becomes true; fires once and stops.
 */
export default function useCountUp(
  target: number,
  duration: number,
  active: boolean,
): number {
  const [count, setCount] = useState(0)
  const rafRef = useRef<number | null>(null)
  const startTimeRef = useRef<number | null>(null)

  useEffect(() => {
    if (!active) return

    startTimeRef.current = null

    const step = (timestamp: number) => {
      if (startTimeRef.current === null) startTimeRef.current = timestamp
      const elapsed = timestamp - startTimeRef.current
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setCount(Math.round(eased * target * 10) / 10)
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(step)
      }
    }

    rafRef.current = requestAnimationFrame(step)

    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current)
    }
  }, [active, target, duration])

  return count
}
