const ACCESS_KEY = 'access_token'
const REFRESH_KEY = 'refresh_token'
const EMAIL_KEY = 'user_email'

export const tokenService = {
  setTokens(access, refresh, email) {
    localStorage.setItem(ACCESS_KEY, access)
    localStorage.setItem(REFRESH_KEY, refresh)
    localStorage.setItem(EMAIL_KEY, email)
  },

  getAccessToken() {
    return localStorage.getItem(ACCESS_KEY)
  },

  getRefreshToken() {
    return localStorage.getItem(REFRESH_KEY)
  },

  getUserEmail() {
    return localStorage.getItem(EMAIL_KEY)
  },

  hasTokens() {
    return !!localStorage.getItem(ACCESS_KEY)
  },

  clearTokens() {
    localStorage.removeItem(ACCESS_KEY)
    localStorage.removeItem(REFRESH_KEY)
    localStorage.removeItem(EMAIL_KEY)
  }
}
