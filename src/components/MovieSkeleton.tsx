import { Box, Skeleton } from "@mui/material"

/**
 * Placeholder card shown during movie grid fetches.
 * Matches the aspect ratio and layout of MovieCard.
 */
export default function MovieSkeleton() {
  return (
    <Box>
      <Skeleton
        animation="wave"
        height={0}
        sx={{ paddingTop: "150%", borderRadius: 2 }}
        variant="rectangular"
      />
      <Box sx={{ mt: 1.5, px: 0.5 }}>
        <Skeleton height={20} width="80%" />
        <Skeleton height={16} width="40%" />
      </Box>
    </Box>
  )
}
