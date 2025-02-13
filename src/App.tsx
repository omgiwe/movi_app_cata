import { Container } from 'components/Container'
import { Movies } from 'components/Movies'
import { Spin, Alert, Pagination } from 'antd'
import { useDebouncedCallback } from 'use-debounce'

import { useEffect, useState } from 'react'
import { addRatingFetch, createNewSession, getMovies, getRatedMovies } from 'services/moviedb-services'
import { LocalMovie } from 'types'
import { extractLocalMovie } from 'utils/exract-local-movie'
import { SearchMovie } from 'components/SearchMovie'
import { checkSessionValidity } from 'utils/session-validate'
import { GenresProvider } from 'components/Genres'

function App() {
  const [movies, setMovies] = useState<LocalMovie[]>([])
  const [ratedMovie, setRatedMovie] = useState<LocalMovie[]>([])
  const [type, setType] = useState('search')
  const [sessionID, setSessionID] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [query, setQuery] = useState('')
  const [totalResults, setTotalResults] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)

  const checkInternetConnection = () => {
    if (!navigator.onLine) {
      setError('No internet connection')
      setMovies([])
      setRatedMovie([])
      setTotalResults(0)
      setLoading(false)
      return true
    }
    setError(null)
    return false
  }

  const fetchMovie = async (name: string, page: number) => {
    if (checkInternetConnection()) {
      return
    }
    try {
      setLoading(true)
      const data = await getMovies(name, page)

      setMovies(extractLocalMovie(data.results))
      setTotalResults(data.total_results)
      if (data.results.length === 0 && name !== '') {
        throw new Error()
      }
    } catch (err) {
      setError('Нет результатов. Попробуйте еще раз.')
    } finally {
      setLoading(false)
    }
  }

  const fetchMovieRated = async (page: number) => {
    if (checkInternetConnection()) {
      return
    }

    if (!sessionID) {
      setError('Отсутствует индентификатор гостевой сессии')
      return
    }
    try {
      setLoading(true)
      const data = await getRatedMovies(sessionID, page)

      setRatedMovie(extractLocalMovie(data.results))
      setTotalResults(data.total_results)

      // if (data.results.length === 0) {
      //   throw new Error()
      // }
    } catch (err) {
      setError('Вы не оценили не один фильм! Оцените Ваш любимый фильм в поиске.')
    } finally {
      setLoading(false)
    }
  }

  const debouncedFetchMovie = useDebouncedCallback((text: string, page: number) => fetchMovie(text, page), 1000)

  const changeType = async (value: string) => {
    if (value === 'search') {
      setType('search')
      setCurrentPage(1)
      setTotalResults(0)
      setError(null)
    } else if (value === 'rated') {
      await fetchMovieRated(1)
      setType('rated')
      setCurrentPage(1)
      setMovies([])
      setQuery('')
    }
  }

  const handleSearchChange = (text: string) => {
    setQuery(text)
    setCurrentPage(1)
    debouncedFetchMovie(text, 1)
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    if (type === 'search') {
      fetchMovie(query, page)
    } else if (type === 'rated') {
      fetchMovieRated(page)
    }
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const addRated = async (moveId: number, rated: number) => {
    if (checkInternetConnection()) {
      setError('Ваш ключ гостевой сессии истек, перезагрузите страницу')
      return
    }
    if (sessionID) {
      try {
        await addRatingFetch(sessionID, moveId, rated)
      } catch {
        setError('Ошибка при отправления рейтинга на сервер')
      }
    }
  }

  useEffect(() => {
    const registerGuestSession = async (): Promise<void> => {
      const sessionData = localStorage.getItem('sessionTMDB')

      if (sessionData) {
        const parsedSession = JSON.parse(sessionData)
        const isValid = await checkSessionValidity()

        if (isValid) {
          setSessionID(parsedSession.guest_session_id)
          return
        }
      }

      const newSession = await createNewSession()
      if (newSession) {
        setSessionID(newSession.guest_session_id)
      } else {
        setError('Ошибка при создании новой гостевой сессии')
      }
    }
    registerGuestSession()
  }, [])

  return (
    <Container>
      <GenresProvider>
        <SearchMovie searchChange={handleSearchChange} changeType={changeType} query={query} type={type} />
        {loading ? (
          <Spin spinning={loading} fullscreen tip="Loading..." />
        ) : (
          <>
            <Movies movies={movies} ratedMovie={ratedMovie} type={type} addRated={addRated} />
            {totalResults > 20 && (
              <Pagination
                current={currentPage}
                total={totalResults}
                pageSize={20}
                onChange={handlePageChange}
                showSizeChanger={false}
              />
            )}
          </>
        )}
        {error && <Alert message={error} type="warning" />}
      </GenresProvider>
    </Container>
  )
}

export default App
