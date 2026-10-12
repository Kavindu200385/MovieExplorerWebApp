import { PersonRounded } from "@mui/icons-material"
import { Avatar, Box, Paper, Stack, Typography } from "@mui/material"
import { getImageUrl } from "../api/tmdb"
import type { CastMember } from "../api/types"
import EmptyState from "./EmptyState"

interface CastListProps {
  cast: CastMember[]
}

/** Shows top-billed performers in a horizontally scrollable portrait rail. */
export default function CastList({ cast }: CastListProps) {
  const topCast = [...cast].sort((a, b) => a.order - b.order).slice(0, 12)

  if (!topCast.length) {
    return (
      <EmptyState
        description="Cast information hasn’t been published for this title."
        title="Cast unavailable"
      />
    )
  }

  return (
    <Box
      sx={{
        display: "grid",
        gap: 2,
        gridAutoColumns: { xs: "44%", sm: "28%", md: "18%", lg: "14%" },
        gridAutoFlow: "column",
        overflowX: "auto",
        pb: 2,
        scrollSnapType: "x mandatory",
      }}
    >
      {topCast.map((member) => {
        const profile = getImageUrl(member.profile_path, "w185")
        return (
          <Paper
            key={member.id}
            variant="outlined"
            sx={{ overflow: "hidden", scrollSnapAlign: "start" }}
          >
            {profile ? (
              <Box
                alt={`${member.name} profile`}
                component="img"
                loading="lazy"
                src={profile}
                sx={{
                  aspectRatio: "2 / 3",
                  display: "block",
                  objectFit: "cover",
                  width: "100%",
                }}
              />
            ) : (
              <Stack
                alignItems="center"
                justifyContent="center"
                sx={{
                  aspectRatio: "2 / 3",
                  bgcolor: "action.hover",
                  color: "text.secondary",
                }}
              >
                <Avatar sx={{ bgcolor: "primary.main" }}>
                  <PersonRounded />
                </Avatar>
              </Stack>
            )}
            <Stack spacing={0.25} sx={{ p: 1.5 }}>
              <Typography noWrap fontWeight={750} variant="body2">
                {member.name}
              </Typography>
              <Typography color="text.secondary" noWrap variant="caption">
                {member.character || "Cast"}
              </Typography>
            </Stack>
          </Paper>
        )
      })}
    </Box>
  )
}
