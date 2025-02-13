import { LocalMovie } from 'types'
import { MovieCard } from 'components/MovieCard'
import styles from './Movies.module.scss'

interface MoviesProps {
  movies: LocalMovie[]
  ratedMovie: LocalMovie[]
  type: string
  addRated: (moveId: number, rated: number) => void
}

export const Movies = ({ movies, addRated, type, ratedMovie }: MoviesProps) => {
  return (
    <ul className={styles.movies}>
      {type === 'search'
        ? movies?.map((movie) => <MovieCard key={movie.id} {...movie} ratedMovieArr={ratedMovie} addRated={addRated} />)
        : ratedMovie?.map((movierate) => (
            <MovieCard key={movierate.id} {...movierate} ratedMovieArr={ratedMovie} addRated={addRated} />
          ))}
    </ul>
  )
}
