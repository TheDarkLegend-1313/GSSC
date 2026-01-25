import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { authAPI } from '../services/api.js'
import { tokenService } from '../services/api.js'

const OTPVerifyPage = () => {
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  // Get email from sessionStorage on mount
  useEffect(() => {
    const storedEmail = sessionStorage.getItem('otp_email')
    if (storedEmail) {
      setEmail(storedEmail)
    } else {
      // If no email found, redirect to OTP request page
      navigate('/request-otp')
    }
  }, [navigate])

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError(null)
    setLoading(true)

    try {
      // Verify OTP with backend
      const response = await authAPI.verifyOTP(email, otp)

      // If OTP is verified, backend should return access_token
      const accessToken = response.access_token || response.access || response.data?.access_token

      if (accessToken) {
        // Store access token
        tokenService.setTokens(accessToken, response.refresh_token || '', email)

        // Clear session storage
        sessionStorage.removeItem('otp_email')

        // Redirect to change password page
        navigate('/change-password')
      } else {
        throw new Error('OTP verification failed')
      }
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          err.response?.data?.message ||
          err.response?.data?.error ||
          err.message ||
          'Invalid OTP. Please try again.'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page auth-page">
      <motion.div
        className="auth-card"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1>Verify OTP</h1>
        <p className="panel-subtitle">
          Enter the OTP sent to <strong>{email}</strong>
        </p>

        {error && (
          <div className="auth-error" style={{ marginBottom: '1rem' }}>
            {error}
          </div>
        )}

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-field">
            <label htmlFor="otp">OTP Code</label>
            <input
              id="otp"
              type="text"
              placeholder="Enter 6-digit OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
              required
              maxLength={6}
              disabled={loading}
              style={{ textAlign: 'center', letterSpacing: '0.5rem', fontSize: '1.2rem' }}
            />
          </div>

          <button type="submit" className="btn-primary" disabled={loading || otp.length !== 6}>
            {loading ? 'Verifying...' : 'Verify OTP'}
          </button>
        </form>

        <div style={{ marginTop: '1rem', textAlign: 'center' }}>
          <button
            type="button"
            onClick={() => navigate('/request-otp')}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#4f46e5',
              cursor: 'pointer',
              fontSize: '0.9rem',
            }}
          >
            Resend OTP
          </button>
        </div>
      </motion.div>
    </div>
  )
}

export default OTPVerifyPage
