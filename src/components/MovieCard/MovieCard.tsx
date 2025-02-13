import { Genre, LocalMovie } from 'types'
import { Rate } from 'antd'
import { format } from 'date-fns'
import { enUS } from 'date-fns/locale'
import { useContext } from 'react'
import { GenresContext } from 'components/Genres'
import styles from './MovieCard.module.scss'

interface MovieCardProps extends LocalMovie {
  addRated: (moveId: number, rated: number) => void
  ratedMovieArr: LocalMovie[]
}

const URL_IMG = 'https://image.tmdb.org/t/p/w500'

export const MovieCard = ({
  date,
  overview,
  poster,
  title,
  id,
  addRated,
  rating,
  ratedMovieArr,
  averageRate,
  genreMovie,
}: MovieCardProps) => {
  const formattedDate = date ? format(new Date(date), 'MMMM d, yyyy', { locale: enUS }) : 'Unknown date'

  const formattedOverview = (text: string, maxLength: number): string => {
    if (!text) return ''
    if (text.length <= maxLength) return text

    let trimmed = text.slice(0, maxLength)
    trimmed = trimmed.slice(0, trimmed.lastIndexOf(' '))
    return `${trimmed}...`
  }

  const handleAddRated = (starCount: number) => {
    addRated(id, starCount)
  }

  const checkRaiting = (): number | undefined => {
    if (ratedMovieArr.length === 0) return undefined
    const ratedMovie = ratedMovieArr.find((movie) => movie.id === id)
    return ratedMovie ? ratedMovie.rating : undefined
  }

  const getRatingColor = (): string => {
    if (averageRate <= 3) return '#E90000'
    if (averageRate <= 5) return '#E97E00'
    if (averageRate <= 7) return '#E9D100'
    return '#66E900'
  }

  const { genresList } = useContext(GenresContext)

  const getGenreNames = (genreIds: number[], genresArr: Genre[]) => {
    return genreIds.map((genreId) => genresArr.find((genre) => genre.id === genreId)?.name)
  }

  return (
    <li className={styles.movieCard}>
      <div className={styles.movieCardWrapper}>
        <div className={styles.movieCardPoster}>
          {poster !== null ? (
            <img src={`${URL_IMG}${poster}`} alt={title} />
          ) : (
            <img src={`https://placehold.jp/697c9a/ffffff/200x300.jpg?text=${title}`} alt={title} />
          )}
        </div>
        <div className={styles.movieCardAbout}>
          <h1 className={styles.movieCardTitle}>{title}</h1>
          <div className={styles.movieCardRating} style={{ borderColor: getRatingColor() }}>
            {averageRate.toFixed(1)}
          </div>
          <span className={styles.movieCardData}>{formattedDate}</span>
          {genreMovie ? (
            <div className={styles.movieCardGenres}>
              {getGenreNames(genreMovie, genresList).map((name) => (
                <span key={name} className={styles.movieCardGenre}>
                  {name}
                </span>
              ))}
            </div>
          ) : null}
          <p>{formattedOverview(overview, 160)}</p>
          <Rate
            defaultValue={rating || checkRaiting()}
            count={10}
            style={{ fontSize: 16, marginTop: 'auto' }}
            onChange={handleAddRated}
            disabled={!!(rating || checkRaiting())}
          />
        </div>
      </div>
    </li>
  )
}
