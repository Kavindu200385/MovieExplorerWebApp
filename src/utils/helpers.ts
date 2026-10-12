export { getImageUrl } from "../api/tmdb"

/** Returns the 4-digit release year from an ISO date string, or "Unknown". */
export function formatYear(dateStr: string | null | undefined): string {
  if (!dateStr) return "Unknown"
  return dateStr.slice(0, 4)
}

/** Returns a vote average formatted to one decimal place. */
export function formatRating(vote: number): string {
  return vote.toFixed(1)
}
