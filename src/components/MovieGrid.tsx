import { Box } from "@mui/material"
import type { MovieSummary } from "../api/types"
import MovieCard from "./MovieCard"

interface MovieGridProps {
  movies: MovieSummary[]
}

/** Lays movie cards out from one narrow column to six wide-screen columns. */
export default function MovieGrid({ movies }: MovieGridProps) {
  return (
    <Box
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
      {movies.map((movie) => (
        <MovieCard key={movie.id} movie={movie} />
      ))}
    </Box>
  )
}
