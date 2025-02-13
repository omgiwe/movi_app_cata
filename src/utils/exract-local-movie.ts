import { LocalMovie, MdbMovie } from 'types'

export const extractLocalMovie = (movies: MdbMovie[]): LocalMovie[] =>
  movies.map((movie) => ({
    id: movie.id,
    overview: movie.overview,
    poster: movie.poster_path,
    date: movie.release_date,
    title: movie.title,
    averageRate: movie.vote_average,
    genreMovie: movie.genre_ids,
    rating: movie.rating,
  }))
