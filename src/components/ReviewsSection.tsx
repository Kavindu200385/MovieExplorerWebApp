import { StarRounded, StarBorderRounded } from "@mui/icons-material"
import {
  Alert,
  Avatar,
  Box,
  Button,
  Divider,
  IconButton,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material"
import { alpha } from "@mui/material/styles"
import { useEffect, useState, type FormEvent } from "react"
import type { Review } from "../api/types"
import { useAuth } from "../context/AuthContext"

interface LocalReview {
  id: string
  author: string
  rating: number
  content: string
  createdAt: string
}

function storageKey(movieId: number) {
  return `movie-reviews-${movieId}`
}

function loadLocal(movieId: number): LocalReview[] {
  try {
    return JSON.parse(localStorage.getItem(storageKey(movieId)) ?? "[]")
  } catch {
    return []
  }
}

function saveLocal(movieId: number, reviews: LocalReview[]) {
  try {
    localStorage.setItem(storageKey(movieId), JSON.stringify(reviews))
  } catch {
    // storage full — silently ignore
  }
}

function StarPicker({
  value,
  onChange,
}: {
  value: number
  onChange: (n: number) => void
}) {
  const [hover, setHover] = useState(0)
  return (
    <Stack direction="row" spacing={0.25}>
      {[1, 2, 3, 4, 5].map((n) => (
        <Tooltip key={n} title={`${n} star${n > 1 ? "s" : ""}`}>
          <IconButton
            onClick={() => onChange(n)}
            onMouseEnter={() => setHover(n)}
            onMouseLeave={() => setHover(0)}
            size="small"
            sx={{ p: 0.25, color: "primary.main" }}
          >
            {n <= (hover || value) ? (
              <StarRounded fontSize="small" />
            ) : (
              <StarBorderRounded fontSize="small" />
            )}
          </IconButton>
        </Tooltip>
      ))}
    </Stack>
  )
}

function ReviewCard({
  author,
  avatarUrl,
  rating,
  content,
  date,
  isLocal,
}: {
  author: string
  avatarUrl?: string | null
  rating: number | null
  content: string
  date: string
  isLocal?: boolean
}) {
  const [expanded, setExpanded] = useState(false)
  const long = content.length > 300
  const displayed = long && !expanded ? content.slice(0, 300) + "…" : content

  return (
    <Box
      sx={{
        p: { xs: 2, md: 3 },
        borderRadius: 2,
        border: 1,
        borderColor: isLocal
          ? (theme) => alpha(theme.palette.primary.main, 0.3)
          : "divider",
        bgcolor: "background.paper",
      }}
    >
      <Stack direction="row" spacing={1.5} alignItems="flex-start">
        <Avatar
          src={avatarUrl ?? undefined}
          sx={{
            width: 40,
            height: 40,
            bgcolor: "primary.main",
            fontSize: "0.9rem",
            fontWeight: 700,
            flexShrink: 0,
          }}
        >
          {author.charAt(0).toUpperCase()}
        </Avatar>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={{ xs: 0.25, sm: 1 }}
            alignItems={{ sm: "center" }}
          >
            <Typography fontWeight={700} noWrap>
              {author}
            </Typography>
            {isLocal && (
              <Typography
                variant="caption"
                sx={{
                  px: 0.75,
                  py: 0.15,
                  borderRadius: 0.75,
                  bgcolor: (theme) => alpha(theme.palette.primary.main, 0.14),
                  color: "primary.main",
                  fontWeight: 600,
                  lineHeight: 1.6,
                  alignSelf: "flex-start",
                }}
              >
                Your review
              </Typography>
            )}
            <Typography color="text.disabled" variant="caption" sx={{ flexShrink: 0 }}>
              {new Date(date).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </Typography>
          </Stack>

          {rating !== null && (
            <Stack direction="row" spacing={0.25} sx={{ mt: 0.5, mb: 1 }}>
              {[1, 2, 3, 4, 5].map((n) => (
                <StarRounded
                  key={n}
                  fontSize="small"
                  sx={{ color: n <= Math.round(rating / 2) ? "primary.main" : "action.disabled" }}
                />
              ))}
              <Typography color="text.secondary" variant="caption" sx={{ ml: 0.5 }}>
                {rating}/10
              </Typography>
            </Stack>
          )}

          <Typography
            variant="body2"
            sx={{ color: "text.secondary", lineHeight: 1.75, whiteSpace: "pre-wrap" }}
          >
            {displayed}
          </Typography>
          {long && (
            <Button
              onClick={() => setExpanded((v) => !v)}
              size="small"
              sx={{ mt: 0.5, p: 0, minWidth: 0, fontWeight: 600 }}
              variant="text"
            >
              {expanded ? "Show less" : "Show more"}
            </Button>
          )}
        </Box>
      </Stack>
    </Box>
  )
}

interface ReviewsSectionProps {
  movieId: number
  tmdbReviews: Review[]
}

/** Renders TMDb reviews and a localStorage-backed write form for a given movie. */
export default function ReviewsSection({ movieId, tmdbReviews }: ReviewsSectionProps) {
  const { user } = useAuth()
  const [localReviews, setLocalReviews] = useState<LocalReview[]>(() =>
    loadLocal(movieId),
  )

  const [author, setAuthor] = useState(user?.username ?? "")
  const [rating, setRating] = useState(0)
  const [content, setContent] = useState("")
  const [formError, setFormError] = useState("")
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    if (user?.username && !author) setAuthor(user.username)
  }, [user])

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (!author.trim()) { setFormError("Name is required."); return }
    if (rating === 0) { setFormError("Please select a star rating."); return }
    if (content.trim().length < 20) { setFormError("Review must be at least 20 characters."); return }

    const review: LocalReview = {
      id: `${Date.now()}-${Math.random()}`,
      author: author.trim(),
      rating,
      content: content.trim(),
      createdAt: new Date().toISOString(),
    }
    const updated = [review, ...localReviews]
    setLocalReviews(updated)
    saveLocal(movieId, updated)
    setContent("")
    setRating(0)
    setFormError("")
    setSubmitted(true)
    setTimeout(() => setSubmitted(false), 3000)
  }

  const totalCount = tmdbReviews.length + localReviews.length

  return (
    <Box>
      <Typography
        color="primary"
        fontWeight={800}
        letterSpacing="0.12em"
        variant="overline"
      >
        AUDIENCE
      </Typography>
      <Typography component="h2" sx={{ mb: 4 }} variant="h3">
        Reviews {totalCount > 0 && `(${totalCount})`}
      </Typography>

      {totalCount === 0 && (
        <Typography color="text.secondary" sx={{ mb: 4 }}>
          No reviews yet — be the first to write one.
        </Typography>
      )}

      {/* TMDb reviews */}
      {tmdbReviews.length > 0 && (
        <Stack spacing={2} sx={{ mb: 4 }}>
          {tmdbReviews.map((r) => {
            const rawAvatar = r.author_details.avatar_path ?? null
            const avatarUrl = rawAvatar
              ? rawAvatar.startsWith("/https")
                ? rawAvatar.slice(1)
                : `https://image.tmdb.org/t/p/w185${rawAvatar}`
              : null
            return (
              <ReviewCard
                key={r.id}
                author={r.author}
                avatarUrl={avatarUrl}
                rating={r.author_details.rating ? r.author_details.rating * 2 : null}
                content={r.content}
                date={r.created_at}
              />
            )
          })}
        </Stack>
      )}

      {/* Local reviews */}
      {localReviews.length > 0 && (
        <Stack spacing={2} sx={{ mb: 4 }}>
          {localReviews.map((r) => (
            <ReviewCard
              key={r.id}
              author={r.author}
              rating={r.rating * 2}
              content={r.content}
              date={r.createdAt}
              isLocal
            />
          ))}
        </Stack>
      )}

      <Divider sx={{ mb: 4 }} />

      {/* Write a review form */}
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          p: { xs: 2.5, md: 3.5 },
          borderRadius: 2,
          border: 1,
          borderColor: "divider",
          bgcolor: "background.paper",
        }}
      >
        <Typography fontWeight={700} variant="h6" sx={{ mb: 2.5 }}>
          Write a review
        </Typography>

        {formError && (
          <Alert onClose={() => setFormError("")} severity="error" sx={{ mb: 2 }}>
            {formError}
          </Alert>
        )}
        {submitted && (
          <Alert severity="success" sx={{ mb: 2 }}>
            Review posted — thanks!
          </Alert>
        )}

        <Stack spacing={2.5}>
          <TextField
            fullWidth
            label="Your name"
            onChange={(e) => { setAuthor(e.target.value); setFormError("") }}
            size="small"
            value={author}
          />

          <Box>
            <Typography color="text.secondary" gutterBottom variant="body2">
              Your rating
            </Typography>
            <StarPicker onChange={(n) => { setRating(n); setFormError("") }} value={rating} />
          </Box>

          <TextField
            fullWidth
            label="Your review"
            minRows={4}
            multiline
            onChange={(e) => { setContent(e.target.value); setFormError("") }}
            placeholder="What did you think of this movie?"
            value={content}
          />

          <Button sx={{ alignSelf: "flex-start" }} type="submit" variant="contained">
            Post review
          </Button>
        </Stack>
      </Box>
    </Box>
  )
}
