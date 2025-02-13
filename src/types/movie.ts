export type LocalMovie = {
  id: number
  overview: string
  poster: string | null
  date: string
  title: string
  averageRate: number
  genreMovie: number[]
  rating?: number
}

export type MdbMovie = {
  id: number
  overview: string
  poster_path: string | null
  release_date: string
  title: string
  vote_average: number
  genre_ids: number[]
  rating?: number
}

export type MdbMovieResponse = {
  page: number
  results: MdbMovie[]
  total_results: number
  total_pages: number
}

// guest session

export type GuestSessionCreateResponse = {
  success: boolean
  guest_session_id: string
  expires_at: string
}

// Ganres response

export type Genre = {
  id: number
  name: string
}

export type GenresResponse = {
  genres: Genre[]
}
