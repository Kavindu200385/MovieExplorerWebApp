import { LocalMoviesOutlined } from "@mui/icons-material"
import { Button, Paper, Stack, Typography } from "@mui/material"

interface EmptyStateProps {
  title: string
  description: string
  actionLabel?: string
  onAction?: () => void
}

/** Displays an intentional blank state with an optional recovery action. */
export default function EmptyState({
  title,
  description,
  actionLabel,
  onAction,
}: EmptyStateProps) {
  return (
    <Paper
      variant="outlined"
      sx={{
        background:
          "linear-gradient(145deg, rgba(229,9,20,0.08), transparent 55%)",
        py: { xs: 6, md: 9 },
        px: 3,
      }}
    >
      <Stack alignItems="center" spacing={2} textAlign="center">
        <LocalMoviesOutlined color="primary" sx={{ fontSize: 54 }} />
        <Typography variant="h4">{title}</Typography>
        <Typography color="text.secondary" sx={{ maxWidth: 520 }}>
          {description}
        </Typography>
        {actionLabel && onAction && (
          <Button onClick={onAction} variant="contained">
            {actionLabel}
          </Button>
        )}
      </Stack>
    </Paper>
  )
}
