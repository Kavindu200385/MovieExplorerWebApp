import { CloseRounded, SearchRounded } from "@mui/icons-material"
import { IconButton, InputAdornment, TextField } from "@mui/material"

interface SearchBarProps {
  value: string
  onChange: (value: string) => void
}

/** Renders the controlled movie title search with an accessible clear action. */
export default function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <TextField
      fullWidth
      label="Search movies"
      onChange={(event) => onChange(event.target.value)}
      placeholder="Search by title..."
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <SearchRounded color="primary" />
          </InputAdornment>
        ),
        endAdornment: value ? (
          <InputAdornment position="end">
            <IconButton
              aria-label="Clear search"
              edge="end"
              onClick={() => onChange("")}
              size="small"
            >
              <CloseRounded />
            </IconButton>
          </InputAdornment>
        ) : null,
      }}
      value={value}
    />
  )
}
