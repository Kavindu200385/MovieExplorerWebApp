import { RefreshRounded } from "@mui/icons-material"
import { Alert, AlertTitle, Button, Stack } from "@mui/material"

interface ErrorMessageProps {
  message: string
  onRetry?: () => void
}

/** Presents a friendly recoverable failure instead of raw API errors. */
export default function ErrorMessage({ message, onRetry }: ErrorMessageProps) {
  return (
    <Alert severity="error" variant="outlined">
      <AlertTitle>We hit a snag</AlertTitle>
      <Stack
        alignItems={{ sm: "center" }}
        direction={{ xs: "column", sm: "row" }}
        justifyContent="space-between"
        spacing={2}
      >
        {message}
        {onRetry && (
          <Button
            color="inherit"
            onClick={onRetry}
            startIcon={<RefreshRounded />}
            variant="outlined"
          >
            Try again
          </Button>
        )}
      </Stack>
    </Alert>
  )
}
