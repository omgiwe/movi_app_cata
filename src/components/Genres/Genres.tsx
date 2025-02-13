import { createContext, ReactNode, useEffect, useMemo, useState } from 'react'
import { getGenresList } from 'services/moviedb-services'
import { Genre } from 'types'

interface GenresContextType {
  genresList: Genre[]
}

export const GenresContext = createContext<GenresContextType>({ genresList: [] })

interface GenresProviderProps {
  children: ReactNode
}

export const GenresProvider: React.FC<GenresProviderProps> = ({ children }) => {
  const [genresList, setGenresList] = useState<Genre[]>([])

  const fetchGetGenres = async () => {
    try {
      const genresArr = await getGenresList()

      setGenresList(genresArr.genres)
    } catch (err) {
      throw new Error(`Failed to fetch to server`)
    }
  }

  useEffect(() => {
    fetchGetGenres()
  }, [])

  const contextValue = useMemo(() => ({ genresList }), [genresList])

  return <GenresContext.Provider value={contextValue}>{children}</GenresContext.Provider>
}
