import { Box, CircularProgress, Skeleton, Stack } from "@mui/material"

interface LoaderProps {
  variant?: "page" | "grid"
  count?: number
}

/** Renders either a centered progress indicator or poster-grid skeletons. */
export default function Loader({ variant = "page", count = 12 }: LoaderProps) {
  if (variant === "page") {
    return (
      <Stack
        alignItems="center"
        justifyContent="center"
        sx={{ minHeight: 320 }}
      >
        <CircularProgress aria-label="Loading movies" color="primary" />
      </Stack>
    )
  }

  return (
    <Box
      aria-label="Loading movies"
      sx={{
        display: "grid",
        gap: { xs: 2, sm: 2.5, md: 3 },
        gridTemplateColumns: {
          xs: "repeat(2, minmax(0, 1fr))",
          sm: "repeat(3, minmax(0, 1fr))",
          md: "repeat(4, minmax(0, 1fr))",
          lg: "repeat(5, minmax(0, 1fr))",
          xl: "repeat(6, minmax(0, 1fr))",
        },
      }}
    >
      {Array.from({ length: count }, (_, index) => (
        <Stack key={index} spacing={1}>
          <Skeleton
            animation="wave"
            sx={{ aspectRatio: "2 / 3", transform: "none" }}
            variant="rounded"
          />
          <Skeleton width="80%" />
          <Skeleton width="32%" />
        </Stack>
      ))}
    </Box>
  )
}
