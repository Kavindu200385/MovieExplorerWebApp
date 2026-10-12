import { Box } from "@mui/material"
import type { Video } from "../api/types"

interface TrailerPlayerProps {
  videos: Video[]
}

/** Selects the best YouTube trailer and embeds it in a responsive player. */
export default function TrailerPlayer({ videos }: TrailerPlayerProps) {
  const trailers = videos.filter(
    (video) => video.site === "YouTube" && video.type === "Trailer",
  )
  const trailer = trailers.find((video) => video.official) ?? trailers[0]

  if (!trailer) return null

  return (
    <Box
      sx={{
        aspectRatio: "16 / 9",
        bgcolor: "common.black",
        borderRadius: 2,
        boxShadow: 8,
        overflow: "hidden",
      }}
    >
      <Box
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen"
        allowFullScreen
        component="iframe"
        loading="lazy"
        src={`https://www.youtube-nocookie.com/embed/${trailer.key}?playsinline=1`}
        sx={{ border: 0, height: "100%", width: "100%" }}
        title={`${trailer.name} trailer`}
      />
    </Box>
  )
}
