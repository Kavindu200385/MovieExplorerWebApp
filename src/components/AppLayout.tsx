import { Box, Container, Typography } from "@mui/material"
import { useEffect } from "react"
import { Outlet, useLocation } from "react-router-dom"
import Navbar from "./Navbar"

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

/** Wraps all protected pages in the shared navigation and page surface. */
export default function AppLayout() {
  return (
    <Box sx={{ minHeight: "100dvh", bgcolor: "background.default" }}>
      <ScrollToTop />
      <Navbar />
      <Outlet />
      <Box component="footer" sx={{ borderTop: 1, borderColor: "divider", py: 3, mt: 4 }}>
        <Container maxWidth="xl">
          <Typography align="center" color="text.disabled" variant="caption">
            This product uses the TMDB API but is not endorsed or certified by TMDB.
          </Typography>
        </Container>
      </Box>
    </Box>
  )
}
