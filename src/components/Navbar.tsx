import { useState } from "react"
import {
  FavoriteBorderRounded,
  HomeRounded,
  LogoutRounded,
  MenuRounded,
} from "@mui/icons-material"
import {
  AppBar,
  Badge,
  Box,
  Button,
  Container,
  Divider,
  IconButton,
  ListItemIcon,
  Menu,
  MenuItem,
  Stack,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material"
import { alpha } from "@mui/material/styles"
import { NavLink, useLocation, useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { useFavorites } from "../context/FavoritesContext"
import ThemeToggle from "./ThemeToggle"

/** Provides reference-style desktop and compact mobile navigation. */
export default function Navbar() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const { logout } = useAuth()
  const { favorites } = useFavorites()
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = () => {
    setAnchorEl(null)
    logout()
    navigate("/login", { replace: true })
  }

  const navButtonSx = (path: string) => ({
    color: location.pathname === path ? "common.white" : "text.secondary",
    "&::after": {
      content: '""',
      position: "absolute",
      left: 12,
      right: 12,
      bottom: 3,
      height: 2,
      bgcolor: location.pathname === path ? "primary.main" : "transparent",
    },
  })

  return (
    <AppBar
      elevation={0}
      position="sticky"
      sx={{
        bgcolor: (theme) => alpha(theme.palette.background.default, 0.88),
        backdropFilter: "blur(18px)",
        borderBottom: 1,
        borderColor: "divider",
      }}
    >
      <Container maxWidth="xl">
        <Toolbar disableGutters sx={{ minHeight: { xs: 64, md: 72 } }}>
          <Stack
            component={NavLink}
            direction="row"
            spacing={0.7}
            sx={{
              alignItems: "baseline",
              color: "inherit",
              textDecoration: "none",
            }}
            to="/"
          >
            <Typography
              color="primary"
              sx={{
                fontFamily: '"Outfit", sans-serif',
                fontSize: { xs: 15, md: 17 },
                letterSpacing: "0.11em",
                lineHeight: 1,
              }}
            >
              MOVIE
            </Typography>
            <Typography
              sx={{
                color: "text.primary",
                fontFamily: '"Outfit", sans-serif',
                fontSize: { xs: 15, md: 17 },
                letterSpacing: "0.11em",
                lineHeight: 1,
              }}
            >
              EXPLORER
            </Typography>
          </Stack>

          <Stack
            direction="row"
            spacing={1}
            sx={{ display: { xs: "none", md: "flex" }, ml: 6 }}
          >
            <Button
              component={NavLink}
              startIcon={<HomeRounded />}
              sx={navButtonSx("/")}
              to="/"
            >
              Home
            </Button>
            <Button
              component={NavLink}
              startIcon={
                <Badge badgeContent={favorites.length} color="primary">
                  <FavoriteBorderRounded />
                </Badge>
              }
              sx={navButtonSx("/favorites")}
              to="/favorites"
            >
              Favorites
            </Button>
          </Stack>

          <Box sx={{ flexGrow: 1 }} />
          <ThemeToggle />
          <Tooltip title="Log out">
            <IconButton
              aria-label="Log out"
              color="inherit"
              onClick={handleLogout}
              sx={{ display: { xs: "none", md: "inline-flex" }, ml: 0.5 }}
            >
              <LogoutRounded />
            </IconButton>
          </Tooltip>
          <IconButton
            aria-label="Open navigation menu"
            color="inherit"
            onClick={(event) => setAnchorEl(event.currentTarget)}
            sx={{ display: { md: "none" }, ml: 0.5 }}
          >
            <MenuRounded />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
            onClose={() => setAnchorEl(null)}
            open={Boolean(anchorEl)}
            transformOrigin={{ horizontal: "right", vertical: "top" }}
          >
            <MenuItem
              onClick={() => {
                setAnchorEl(null)
                navigate("/")
              }}
              selected={location.pathname === "/"}
            >
              <ListItemIcon>
                <HomeRounded fontSize="small" />
              </ListItemIcon>
              Home
            </MenuItem>
            <MenuItem
              onClick={() => {
                setAnchorEl(null)
                navigate("/favorites")
              }}
              selected={location.pathname === "/favorites"}
            >
              <ListItemIcon>
                <Badge badgeContent={favorites.length} color="primary">
                  <FavoriteBorderRounded fontSize="small" />
                </Badge>
              </ListItemIcon>
              Favorites
            </MenuItem>
            <Divider />
            <MenuItem onClick={handleLogout}>
              <ListItemIcon>
                <LogoutRounded fontSize="small" />
              </ListItemIcon>
              Log out
            </MenuItem>
          </Menu>
        </Toolbar>
      </Container>
    </AppBar>
  )
}
