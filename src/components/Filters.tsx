import { RestartAltRounded, TuneRounded } from "@mui/icons-material"
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
} from "@mui/material"
import type { Genre, MovieFilters } from "../api/types"

interface FiltersProps {
  genres: Genre[]
  filters: MovieFilters
  onChange: (filters: MovieFilters) => void
  onReset: () => void
}

const currentYear = new Date().getFullYear()
const years = Array.from({ length: currentYear - 1969 }, (_, index) =>
  String(currentYear - index),
)

/** Provides genre, release year, and minimum rating discovery controls. */
export default function Filters({
  genres,
  filters,
  onChange,
  onReset,
}: FiltersProps) {
  const update = (key: keyof MovieFilters, value: string) => {
    onChange({ ...filters, [key]: value })
  }
  const isActive = Boolean(filters.genre || filters.year || filters.rating)

  return (
    <Stack direction={{ xs: "column", md: "row" }} spacing={1.5}>
      <FormControl fullWidth size="small">
        <InputLabel id="genre-label">Genre</InputLabel>
        <Select
          label="Genre"
          labelId="genre-label"
          onChange={(event) => update("genre", event.target.value)}
          startAdornment={<TuneRounded color="primary" sx={{ mr: 1 }} />}
          value={filters.genre}
        >
          <MenuItem value="">All genres</MenuItem>
          {genres.map((genre) => (
            <MenuItem key={genre.id} value={String(genre.id)}>
              {genre.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControl fullWidth size="small">
        <InputLabel id="year-label">Release year</InputLabel>
        <Select
          label="Release year"
          labelId="year-label"
          onChange={(event) => update("year", event.target.value)}
          value={filters.year}
        >
          <MenuItem value="">Any year</MenuItem>
          {years.map((year) => (
            <MenuItem key={year} value={year}>
              {year}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControl fullWidth size="small">
        <InputLabel id="rating-label">Minimum rating</InputLabel>
        <Select
          label="Minimum rating"
          labelId="rating-label"
          onChange={(event) => update("rating", event.target.value)}
          value={filters.rating}
        >
          <MenuItem value="">Any rating</MenuItem>
          {["5", "6", "7", "8", "9"].map((rating) => (
            <MenuItem key={rating} value={rating}>
              {rating}+ / 10
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <Box sx={{ flexShrink: 0 }}>
        <Button
          disabled={!isActive}
          fullWidth
          onClick={onReset}
          startIcon={<RestartAltRounded />}
          sx={{ height: 40, whiteSpace: "nowrap" }}
          variant="outlined"
        >
          Reset
        </Button>
      </Box>
    </Stack>
  )
}
