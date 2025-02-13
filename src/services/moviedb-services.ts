import { GenresResponse, GuestSessionCreateResponse, MdbMovieResponse } from 'types'

const BASE_URL = 'https://api.themoviedb.org/3'

const AUTH_TOKEN = import.meta.env.VITE_TMDB_AUTH_TOKEN

const options = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: `Bearer ${AUTH_TOKEN}`,
  },
}

export const getMovies = async (name: string, page: number): Promise<MdbMovieResponse> => {
  const res = await fetch(
    `${BASE_URL}/search/movie?query=${name}&include_adult=false&language=en-US&page=${page}`,
    options
  )

  if (!res.ok) {
    throw new Error(`Failed to fetch movies: ${res.status} ${res.statusText}`)
  }

  return res.json()
}

export const getRatedMovies = async (sessionID: string, page: number): Promise<MdbMovieResponse> => {
  const res = await fetch(
    `${BASE_URL}/guest_session/${sessionID}/rated/movies?language=en-US&page=${page}&sort_by=created_at.asc`,
    options
  )

  if (!res.ok) {
    throw new Error(`Failed to fetch rated movies: ${res.status} ${res.statusText}`)
  }

  return res.json()
}

export const getGenresList = async (): Promise<GenresResponse> => {
  const res = await fetch(`${BASE_URL}/genre/movie/list?language=en`, options)

  if (!res.ok) {
    throw new Error(`Failed to fetch genres movies: ${res.status} ${res.statusText}`)
  }

  return res.json()
}

export const createNewSession = async (): Promise<GuestSessionCreateResponse> => {
  const res = await fetch(`${BASE_URL}/authentication/guest_session/new`, options)

  if (!res.ok) {
    throw new Error(`Failed to fetch create guest session: ${res.status} ${res.statusText}`)
  }

  const newSession: GuestSessionCreateResponse = await res.json()
  localStorage.setItem('sessionTMDB', JSON.stringify(newSession))
  return newSession
}

export const addRatingFetch = async (sessionId: string, movieID: number, num: number) => {
  const postoptions = {
    method: 'POST',
    headers: {
      accept: 'application/json',
      'Content-Type': 'application/json;charset=utf-8',
      Authorization: `Bearer ${AUTH_TOKEN}`,
    },
    body: JSON.stringify({ value: num }),
  }
  const res = await fetch(`${BASE_URL}/movie/${movieID}/rating?guest_session_id=${sessionId}`, postoptions)
  if (!res.ok) {
    throw new Error(`Failed to fetch add rating: ${res.status} ${res.statusText}`)
  }
}
