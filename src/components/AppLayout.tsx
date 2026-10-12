import { Box } from "@mui/material"
import { Outlet } from "react-router-dom"
import Navbar from "./Navbar"

/** Wraps all protected pages in the shared navigation and page surface. */
export default function AppLayout() {
  return (
    <Box sx={{ minHeight: "100dvh", bgcolor: "background.default" }}>
      <Navbar />
      <Outlet />
    </Box>
  )
}
