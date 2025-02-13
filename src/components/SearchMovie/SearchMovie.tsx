import { Radio, RadioChangeEvent } from 'antd'
import styles from './SearchMovie.module.scss'

interface SearchMovieProps {
  searchChange: (text: string) => void
  query: string
  changeType: (text: string) => void
  type: string
}

export const SearchMovie = ({ searchChange, query, changeType, type }: SearchMovieProps) => {
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = e.target.value
    searchChange(newQuery)
  }

  const handleChangeType = (e: RadioChangeEvent) => {
    changeType(e.target.value)
  }

  return (
    <div className={styles.searchMovie}>
      <Radio.Group defaultValue="search" size="large" onChange={handleChangeType}>
        <Radio.Button value="search">Search </Radio.Button>
        <Radio.Button value="rated">Rated</Radio.Button>
      </Radio.Group>
      {type === 'search' && (
        <input
          type="text"
          className={styles.searchMovieInput}
          placeholder="Type to search..."
          value={query}
          onChange={handleSearch}
        />
      )}
    </div>
  )
}
