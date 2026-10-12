export interface MovieSummary {
  id: number
  title: string
  overview: string
  poster_path: string | null
  backdrop_path: string | null
  release_date: string
  vote_average: number
  vote_count?: number
  genre_ids?: number[]
}

export interface Genre {
  id: number
  name: string
}

export interface CastMember {
  id: number
  name: string
  character: string
  profile_path: string | null
  order: number
}

export interface Video {
  id: string
  key: string
  name: string
  official: boolean
  site: string
  type: string
}

export interface Review {
  id: string
  author: string
  author_details: {
    avatar_path: string | null
    rating: number | null
    username: string
  }
  content: string
  created_at: string
}

export interface MovieDetailsResponse extends MovieSummary {
  genres: Genre[]
  runtime: number | null
  credits: {
    cast: CastMember[]
  }
  videos: {
    results: Video[]
  }
  reviews: {
    results: Review[]
  }
}

export interface PaginatedMovieResponse {
  page: number
  results: MovieSummary[]
  total_pages: number
  total_results: number
}

export interface MovieFilters {
  genre: string
  year: string
  rating: string
}

export interface AppError {
  message: string
  status?: number
}
