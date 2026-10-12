import { useEffect, useState, type FormEvent } from "react"
import { VisibilityOffOutlined, VisibilityOutlined } from "@mui/icons-material"
import {
  Alert,
  Box,
  Button,
  IconButton,
  InputAdornment,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material"
import { alpha, type Theme } from "@mui/material/styles"
import { Navigate, useLocation, useNavigate } from "react-router-dom"
import ThemeToggle from "../components/ThemeToggle"
import { useAuth } from "../context/AuthContext"

interface LocationState {
  from?: { pathname?: string }
}

const signupPosters = [
  {
    title: "Blade Runner 2049",
    path: "/gajva2L0rPYkEWjzgFlBXCAVBE5.jpg",
    transform: "translateX(-58%) rotateY(28deg) scale(0.78)",
    left: "6%",
    zIndex: 1,
  },
  {
    title: "The Dark Knight",
    path: "/qJ2tW6WMUDux911r6m7haRef0WH.jpg",
    transform: "translateX(-34%) rotateY(16deg) scale(0.9)",
    left: "22%",
    zIndex: 2,
  },
  {
    title: "Avatar",
    path: "/kyeqWdyUXW608qlYkRqosgbbJyK.jpg",
    transform: "translateX(-50%) scale(1.03)",
    left: "50%",
    zIndex: 4,
  },
  {
    title: "Inception",
    path: "/oYuLEt3zVCKq57qu2F8dT7NIa6f.jpg",
    transform: "translateX(-66%) rotateY(-16deg) scale(0.9)",
    left: "78%",
    zIndex: 2,
  },
  {
    title: "Alita: Battle Angel",
    path: "/xRWht48C2V8XNfzvPehyClOvDni.jpg",
    transform: "translateX(-42%) rotateY(-28deg) scale(0.78)",
    left: "94%",
    zIndex: 1,
  },
]

const fieldSx = (theme: Theme) => ({
  "& .MuiInputLabel-root": {
    color: "text.primary",
    fontFamily: '"Outfit", sans-serif',
    fontSize: "0.82rem",
  },
  "& .MuiInput-underline:before": {
    borderBottomColor: alpha(theme.palette.text.primary, 0.3),
  },
  "& .MuiInput-underline:after": {
    borderBottomColor: theme.palette.primary.main,
  },
})

/** New-account registration page mirroring the LoginPage layout. */
export default function SignupPage() {
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirm, setConfirm] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [error, setError] = useState("")
  const [posterSlots, setPosterSlots] = useState(() =>
    signupPosters.map((_, i) => i),
  )
  const { isAuthenticated, signup } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const destination =
    (location.state as LocationState | null)?.from?.pathname || "/"

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    const interval = window.setInterval(() => {
      setPosterSlots((current) => {
        const shuffled = [...current]
        for (let i = shuffled.length - 1; i > 0; i -= 1) {
          const j = Math.floor(Math.random() * (i + 1))
          ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
        }
        return shuffled.every((v, i) => v === current[i])
          ? [...shuffled.slice(1), shuffled[0]]
          : shuffled
      })
    }, 3600)
    return () => window.clearInterval(interval)
  }, [])

  if (isAuthenticated) return <Navigate replace to={destination} />

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    if (!username.trim()) { setError("Username is required."); return }
    if (!email.includes("@")) { setError("Enter a valid email address."); return }
    if (password.length < 6) { setError("Password must be at least 6 characters."); return }
    if (password !== confirm) { setError("Passwords do not match."); return }
    signup(username.trim(), email.trim(), password)
    navigate(destination, { replace: true })
  }

  const visibilityAdornment = (visible: boolean, toggle: () => void, label: string) => (
    <InputAdornment position="end">
      <IconButton
        aria-label={label}
        edge="end"
        onClick={toggle}
        sx={{ color: "text.secondary" }}
      >
        {visible ? <VisibilityOffOutlined /> : <VisibilityOutlined />}
      </IconButton>
    </InputAdornment>
  )

  return (
    <Box
      sx={{
        minHeight: "100dvh",
        display: "grid",
        placeItems: "center",
        p: { xs: 2, md: 7 },
        bgcolor: "background.default",
        background: (theme) =>
          `radial-gradient(circle at 14% 18%, rgba(229,9,20,0.22), transparent 30%), radial-gradient(circle at 86% 78%, rgba(104,188,255,0.15), transparent 26%), ${theme.palette.background.default}`,
      }}
    >
      <Paper
        elevation={0}
        sx={{
          width: "100%",
          maxWidth: 1240,
          minHeight: { xs: "auto", md: 690 },
          px: { xs: 2.5, sm: 5, md: 7 },
          py: { xs: 6, md: 7 },
          position: "relative",
          overflow: "hidden",
          bgcolor: "background.paper",
          borderRadius: 0,
          border: 1,
          borderColor: "divider",
        }}
      >
        <Box sx={{ position: "absolute", right: 18, top: 18, zIndex: 5 }}>
          <ThemeToggle />
        </Box>
        <Typography
          component="h1"
          sx={{
            fontFamily: '"Outfit", sans-serif',
            fontSize: { xs: "1.45rem", sm: "2rem", md: "2.55rem" },
            fontWeight: 500,
            letterSpacing: { xs: "0.08em", md: "0.12em" },
            textAlign: "center",
            mb: { xs: 6, md: 8 },
          }}
        >
          JOIN MOVIE EXPLORER
        </Typography>

        <Stack
          alignItems="center"
          direction={{ xs: "column", md: "row" }}
          spacing={{ xs: 7, md: 4 }}
        >
          {/* Poster carousel */}
          <Box
            sx={{
              width: { xs: "100%", md: "57%" },
              height: { xs: 300, sm: 370, md: 420 },
              position: "relative",
              perspective: 1100,
              isolation: "isolate",
              "&::after": {
                content: '""',
                position: "absolute",
                left: "13%",
                right: "13%",
                bottom: "7%",
                height: "13%",
                borderRadius: "50%",
                background: "rgba(136,202,255,0.46)",
                filter: "blur(32px)",
                zIndex: -1,
              },
            }}
          >
            {signupPosters.map((poster, posterIndex) => {
              const slotIndex = posterSlots.indexOf(posterIndex)
              const slot = signupPosters[slotIndex]
              return (
                <Box
                  key={poster.title}
                  alt={`${poster.title} poster`}
                  component="img"
                  src={`https://image.tmdb.org/t/p/w500${poster.path}`}
                  sx={{
                    position: "absolute",
                    left: slot.left,
                    top: slotIndex === 2 ? "1%" : "7%",
                    width: { xs: "36%", sm: "31%", md: "35%" },
                    maxWidth: 205,
                    aspectRatio: "2 / 3",
                    objectFit: "cover",
                    transform: slot.transform,
                    transformOrigin: "center",
                    transition:
                      "left 900ms cubic-bezier(.2,.8,.2,1), top 900ms cubic-bezier(.2,.8,.2,1), transform 900ms cubic-bezier(.2,.8,.2,1), filter 900ms ease",
                    border: "1px solid rgba(206,234,255,0.46)",
                    borderRadius: "20px 20px 7px 7px",
                    boxShadow:
                      slotIndex === 2
                        ? "0 18px 34px rgba(0,0,0,0.94), 0 0 28px rgba(229,9,20,0.35)"
                        : "0 18px 28px rgba(0,0,0,0.9), 0 0 18px rgba(148,211,255,0.28)",
                    filter: slotIndex === 2 ? "brightness(1)" : "brightness(0.72)",
                    zIndex: slot.zIndex,
                  }}
                />
              )
            })}
          </Box>

          {/* Sign-up form */}
          <Paper
            component="form"
            elevation={0}
            onSubmit={handleSubmit}
            sx={{
              width: { xs: "100%", md: "43%" },
              maxWidth: 470,
              p: { xs: 3, sm: 4.5 },
              bgcolor: "background.paper",
              border: 1,
              borderColor: "divider",
              borderRadius: 2,
              backdropFilter: "blur(18px)",
              boxShadow: 4,
            }}
          >
            <Stack spacing={3}>
              {error && (
                <Alert onClose={() => setError("")} severity="error">
                  {error}
                </Alert>
              )}
              <TextField
                autoComplete="username"
                error={Boolean(error) && !username.trim()}
                fullWidth
                label="Username"
                onChange={(e) => { setUsername(e.target.value); setError("") }}
                sx={fieldSx}
                value={username}
                variant="standard"
              />
              <TextField
                autoComplete="email"
                error={Boolean(error) && !email.includes("@")}
                fullWidth
                label="Email"
                onChange={(e) => { setEmail(e.target.value); setError("") }}
                sx={fieldSx}
                type="email"
                value={email}
                variant="standard"
              />
              <TextField
                autoComplete="new-password"
                error={Boolean(error) && password.length < 6}
                fullWidth
                InputProps={{
                  endAdornment: visibilityAdornment(
                    showPassword,
                    () => setShowPassword((v) => !v),
                    showPassword ? "Hide password" : "Show password",
                  ),
                }}
                label="Password"
                onChange={(e) => { setPassword(e.target.value); setError("") }}
                sx={fieldSx}
                type={showPassword ? "text" : "password"}
                value={password}
                variant="standard"
              />
              <TextField
                autoComplete="new-password"
                error={Boolean(error) && password !== confirm}
                fullWidth
                InputProps={{
                  endAdornment: visibilityAdornment(
                    showConfirm,
                    () => setShowConfirm((v) => !v),
                    showConfirm ? "Hide password" : "Show password",
                  ),
                }}
                label="Confirm Password"
                onChange={(e) => { setConfirm(e.target.value); setError("") }}
                sx={fieldSx}
                type={showConfirm ? "text" : "password"}
                value={confirm}
                variant="standard"
              />
              <Button
                size="small"
                sx={{ alignSelf: "center", minWidth: 132, mt: 1, borderRadius: 999 }}
                type="submit"
                variant="contained"
              >
                Create account
              </Button>
              <Typography
                sx={{
                  textAlign: "center",
                  fontSize: "0.78rem",
                  color: "text.secondary",
                }}
              >
                Already have an account?{" "}
                <Box
                  component="span"
                  onClick={() => navigate("/login")}
                  sx={{
                    color: "primary.main",
                    cursor: "pointer",
                    fontWeight: 600,
                    "&:hover": { textDecoration: "underline" },
                  }}
                >
                  Log in
                </Box>
              </Typography>
            </Stack>
          </Paper>
        </Stack>
      </Paper>
    </Box>
  )
}
