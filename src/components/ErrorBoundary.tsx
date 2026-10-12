import { Component, type ErrorInfo, type ReactNode } from "react"
import { Box, Button, Stack, Typography } from "@mui/material"

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
  message: string
}

/** Catches unhandled render errors so the app shows a recovery screen instead of crashing. */
export default class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, message: "" }

  static getDerivedStateFromError(error: unknown): State {
    const message =
      error instanceof Error ? error.message : "An unexpected error occurred."
    return { hasError: true, message }
  }

  componentDidCatch(error: unknown, info: ErrorInfo) {
    console.error("[ErrorBoundary]", error, info.componentStack)
  }

  render() {
    if (!this.state.hasError) return this.props.children

    return (
      <Box
        sx={{
          minHeight: "100dvh",
          display: "grid",
          placeItems: "center",
          p: 3,
          textAlign: "center",
          bgcolor: "#070708",
          color: "common.white",
          background:
            "radial-gradient(circle at 50% 30%, rgba(229,9,20,0.18), transparent 36%), #070708",
        }}
      >
        <Stack alignItems="center" spacing={2.5}>
          <Typography
            color="primary"
            sx={{ fontSize: { xs: "6rem", md: "10rem" }, lineHeight: 0.8 }}
          >
            ✕
          </Typography>
          <Typography component="h1" variant="h3">
            Something went wrong
          </Typography>
          <Typography
            color="text.secondary"
            sx={{ maxWidth: 480, fontFamily: "monospace", fontSize: "0.82rem" }}
          >
            {this.state.message}
          </Typography>
          <Button
            onClick={() => window.location.reload()}
            variant="contained"
          >
            Reload page
          </Button>
        </Stack>
      </Box>
    )
  }
}
