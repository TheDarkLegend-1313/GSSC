const ACCESS_KEY = 'access_token'
const REFRESH_KEY = 'refresh_token'
const USERNAME_KEY = 'username'

export const tokenService = {
  setTokens(access, refresh, username) {
    localStorage.setItem(ACCESS_KEY, access)
    localStorage.setItem(REFRESH_KEY, refresh)
    localStorage.setItem(USERNAME_KEY, username)
  },

  getAccessToken() {
    return localStorage.getItem(ACCESS_KEY)
  },

  getRefreshToken() {
    return localStorage.getItem(REFRESH_KEY)
  },

  getUsername() {
    return localStorage.getItem(USERNAME_KEY)
  },

  hasTokens() {
    return !!localStorage.getItem(ACCESS_KEY)
  },

  clearTokens() {
    localStorage.removeItem(ACCESS_KEY)
    localStorage.removeItem(REFRESH_KEY)
    localStorage.removeItem(USERNAME_KEY)
  }
}
