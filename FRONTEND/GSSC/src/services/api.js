import axios from 'axios'

// Base URL for Django backend - adjust this to match your Django server
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Token storage keys
const ACCESS_TOKEN_KEY = 'access_token'
const REFRESH_TOKEN_KEY = 'refresh_token'
const USERNAME_KEY = 'user_username'

// Token management functions
export const tokenService = {
  getAccessToken: () => localStorage.getItem(ACCESS_TOKEN_KEY),
  getRefreshToken: () => localStorage.getItem(REFRESH_TOKEN_KEY),
  getUsername: () => localStorage.getItem(USERNAME_KEY),
  setTokens: (accessToken, refreshToken, username) => {
    localStorage.setItem(ACCESS_TOKEN_KEY, accessToken)
    if (refreshToken) {
      localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken)
    }
    if (username) {
      localStorage.setItem(USERNAME_KEY, username)
    }
  },
  clearTokens: () => {
    localStorage.removeItem(ACCESS_TOKEN_KEY)
    localStorage.removeItem(REFRESH_TOKEN_KEY)
    localStorage.removeItem(USERNAME_KEY)
  },
  hasTokens: () => {
    return !!(
      localStorage.getItem(ACCESS_TOKEN_KEY) && localStorage.getItem(REFRESH_TOKEN_KEY) && localStorage.getItem(USERNAME_KEY)
    )
  },
}

// Request interceptor to add access token to requests
api.interceptors.request.use(
  (config) => {
    const token = tokenService.getAccessToken()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    // If error is 401 and we haven't already tried to refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        const refreshToken = tokenService.getRefreshToken()
        if (!refreshToken) {
          throw new Error('No refresh token available')
        }

        // Try to refresh the token
        const response = await axios.post(`${API_BASE_URL}/auth/token/refresh/`, {
          refresh: refreshToken,
        })

        const { access } = response.data
        tokenService.setTokens(access, refreshToken)

        // Retry the original request with new token
        originalRequest.headers.Authorization = `Bearer ${access}`
        return api(originalRequest)
      } catch (refreshError) {
        // Refresh failed, clear tokens and redirect to login
        tokenService.clearTokens()
        window.location.href = '/login'
        return Promise.reject(refreshError)
      }
    }

    return Promise.reject(error)
  }
)

// Auth API endpoints
export const authAPI = {
  login: async (username, password) => {
    const response = await api.post('/auth/login/', { username, password })
    // Return the full response data - let AuthContext handle token extraction
    return response.data
  },

  register: async (username, email, password) => {
    const response = await api.post('/auth/register/', {
      username,
      email,
      password,
    })
    // Registration might return tokens or just success message
    if (response.data.access && response.data.refresh) {
      tokenService.setTokens(response.data.access, response.data.refresh)
    }
    return response.data
  },

  logout: async () => {
    try {
      const refreshToken = tokenService.getRefreshToken()
      if (refreshToken) {
        await api.post('/auth/logout/', { refresh: refreshToken })
      }
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      tokenService.clearTokens()
    }
  },

  getCurrentUser: async () => {
    const response = await api.get('/auth/me/')
    return response.data
  },

  getUser: async (id) => {
    const response = await api.get(`/auth/users/${id}/`)
    return response.data
  },

  updateUser: async (id, data) => {
    const response = await api.patch(`/auth/users/${id}/update/`, data)
    return response.data
  },

  // Request OTP for password reset/change
  requestOTP: async (email) => {
    const response = await api.post('/auth/request-otp/', { email })
    return response.data
  },

  // Verify OTP
  verifyOTP: async (email, otp) => {
    const response = await api.post('/auth/verify-otp/', { email, otp })
    return response.data
  },

  // Change password (for logged-in users)
  changePassword: async (oldPassword, newPassword) => {
    const response = await api.post('/auth/change-password/', {
      old_password: oldPassword,
      new_password: newPassword,
    })
    return response.data
  },
}

// Calculator API endpoints
export const calculatorAPI = {
  calculateSolar: async (data) => {
    const response = await api.post('/calculator/panel/', data)
    return response.data
  },

  calculatePower: async (data) => {
    const response = await api.post('/calculator/power/', data)
    return response.data
  },
}

// Price Tracker API endpoints
export const priceTrackerAPI = {
  getPrices: async (filter, page = 1) => {
    const response = await api.get(`/price-tracker/`, {
      params: { filter, page },
    })
    return response.data
  },

  updateItems: async () => {
    const response = await api.post('/price-tracker/update/')
    return response.data
  },
}

// Quotation Generator API endpoints
export const quotationAPI = {
  // Get quotation options (descriptions and unit prices) for all items
  getQuotationOptions: async () => {
    const response = await api.get('/quotation/options/')
    return response.data
  },

  // Calculate quotation - send table data, receive ROI and total price
  calculateQuotation: async (quotationData) => {
    const response = await api.post('/quotation/calculate/', quotationData)
    return response.data
  },

  // Request old quotation
  requestOldQuotation: async () => {
    const response = await api.get('/quotation/old/')
    return response.data
  },

  // Save current quotation
  saveQuotation: async (quotationData) => {
    const response = await api.post('/quotation/save/', quotationData)
    return response.data
  },

  // Email quotation
  emailQuotation: async (quotationData) => {
    const response = await api.post('/quotation/email/', quotationData)
    return response.data
  },
}

// AI Chatbot API endpoints
export const chatbotAPI = {
  // Get old chat history
  getOldChat: async () => {
    const response = await api.get('/chatbot/chat/')
    return response.data
  },

  // Send user query and get AI response
  sendMessage: async (userQuery) => {
    const response = await api.post('/chatbot/message/', { query: userQuery })
    return response.data
  },
}

// Contact API endpoints
export const contactAPI = {
  // Send contact form data
  sendContact: async (contactData) => {
    const response = await api.post('/contact/', contactData)
    return response.data
  },
}

export default api
