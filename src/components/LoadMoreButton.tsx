import { ExpandMoreRounded } from "@mui/icons-material"
import { Button, CircularProgress, Stack, Typography } from "@mui/material"

interface LoadMoreButtonProps {
  hasMore: boolean
  loading: boolean
  onClick: () => void
}

/** Keeps pagination operable when automatic intersection loading is unavailable. */
export default function LoadMoreButton({
  hasMore,
  loading,
  onClick,
}: LoadMoreButtonProps) {
  return (
    <Stack alignItems="center" spacing={1.5} sx={{ py: 5 }}>
      {hasMore ? (
        <Button
          disabled={loading}
          onClick={onClick}
          startIcon={
            loading ? (
              <CircularProgress color="inherit" size={18} />
            ) : (
              <ExpandMoreRounded />
            )
          }
          variant="outlined"
        >
          {loading ? "Loading more..." : "Load more"}
        </Button>
      ) : (
        <Typography color="text.secondary" variant="body2">
          You’ve reached the end of the reel.
        </Typography>
      )}
    </Stack>
  )
}
