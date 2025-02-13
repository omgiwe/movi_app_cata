import { GuestSessionCreateResponse } from 'types'

export const checkSessionValidity = async (): Promise<boolean> => {
  const sessionData = localStorage.getItem('sessionTMDB')

  if (!sessionData) {
    return false
  }

  try {
    const parsedSession: GuestSessionCreateResponse = JSON.parse(sessionData)
    const expiresAt = new Date(parsedSession.expires_at).getTime()
    const now = new Date().getTime()

    if (expiresAt > now) {
      return true
    }
    return false
  } catch (e) {
    return false
  }
}
