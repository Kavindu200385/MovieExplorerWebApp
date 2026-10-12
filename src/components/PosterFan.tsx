import { useEffect, useState } from "react"
import { Box, Container, Stack, Typography } from "@mui/material"
import { getImageUrl } from "../api/tmdb"
import type { MovieSummary } from "../api/types"

interface PosterFanProps {
  movies: MovieSummary[]
}

const rotations = [-31, -22, -13, -4, 7, 17, 28]

/** Arranges featured posters into the dramatic arced fan used by the reference. */
export default function PosterFan({ movies }: PosterFanProps) {
  const posters = movies
    .filter((movie) => movie.poster_path)
    .slice(0, rotations.length)
  const [slotOrder, setSlotOrder] = useState<number[]>(() =>
    posters.map((movie) => movie.id),
  )
  const [hoveredId, setHoveredId] = useState<number | null>(null)
  const posterKey = posters.map((movie) => movie.id).join(",")

  useEffect(() => {
    setSlotOrder(posters.map((movie) => movie.id))
  }, [posterKey])

  useEffect(() => {
    if (
      hoveredId !== null ||
      posters.length < 2 ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return
    }

    const interval = window.setInterval(() => {
      setSlotOrder((current) => {
        if (current.length < 2) return current
        const next = [...current]
        const first = next.shift()
        if (first !== undefined) next.push(first)
        return next
      })
    }, 3200)

    return () => window.clearInterval(interval)
  }, [hoveredId, posters.length])

  if (!posters.length) return null

  return (
    <Box
      component="section"
      sx={{
        bgcolor: "common.black",
        color: "common.white",
        overflow: "hidden",
        py: { xs: 10, md: 16 },
      }}
    >
      <Container maxWidth="lg">
        <Box
          sx={{
            height: { xs: 270, sm: 420, md: 520 },
            mx: "auto",
            position: "relative",
            width: "100%",
          }}
        >
          {posters.map((movie, index) => {
            const poster = getImageUrl(movie.poster_path)
            const center = (posters.length - 1) / 2
            const slotIndex = Math.max(slotOrder.indexOf(movie.id), 0)
            const offset = slotIndex - center
            const isHovered = hoveredId === movie.id
            const restingTransform = `translateX(-50%) rotate(${rotations[slotIndex]}deg)`
            return (
              <Box
                key={movie.id}
                alt={`${movie.title} poster`}
                component="img"
                onMouseEnter={() => setHoveredId(movie.id)}
                onMouseLeave={() => setHoveredId(null)}
                src={poster ?? undefined}
                sx={{
                  position: "absolute",
                  width: { xs: "31%", sm: "25%", md: "22%" },
                  aspectRatio: "2 / 3",
                  objectFit: "cover",
                  borderRadius: "48% 48% 8px 8px / 20% 20% 8px 8px",
                  boxShadow: isHovered
                    ? "0 30px 65px rgba(0,0,0,0.96), 0 0 34px rgba(229,9,20,0.42)"
                    : "0 18px 38px rgba(0,0,0,0.88), 0 0 14px rgba(150,210,255,0.18)",
                  border: isHovered
                    ? "1px solid rgba(255,255,255,0.72)"
                    : "1px solid rgba(173,220,255,0.24)",
                  left: `${50 + offset * 11.5}%`,
                  top: isHovered
                    ? { xs: 4, md: -24 }
                    : `${Math.abs(offset) * 19}px`,
                  transform: {
                    xs: isHovered
                      ? "translateX(-50%) rotate(0deg) scale(1.12)"
                      : restingTransform,
                    md: isHovered
                      ? "translateX(-50%) rotate(0deg) scale(1.36)"
                      : restingTransform,
                  },
                  transformOrigin: "50% 120%",
                  transition:
                    "left 850ms cubic-bezier(.2,.8,.2,1), top 650ms cubic-bezier(.2,.8,.2,1), transform 650ms cubic-bezier(.2,.8,.2,1), filter 300ms ease, box-shadow 300ms ease",
                  filter: isHovered
                    ? "brightness(1.12) saturate(1.08)"
                    : Math.abs(offset) > 2
                      ? "brightness(0.68)"
                      : "brightness(0.88)",
                  cursor: "zoom-in",
                  zIndex: isHovered ? 50 : 20 - Math.abs(offset),
                }}
              />
            )
          })}
        </Box>
        <Stack alignItems="center" spacing={1} textAlign="center">
          <Typography
            component="h2"
            sx={{
              fontFamily: '"Outfit", sans-serif',
              fontSize: { xs: "1rem", md: "1.45rem" },
              fontWeight: 600,
              letterSpacing: "0.11em",
              lineHeight: 1.15,
              maxWidth: 460,
            }}
          >
            STEP INTO A WORLD OF
            <br />
            ENDLESS STORIES.
          </Typography>
        </Stack>
      </Container>
    </Box>
  )
}
