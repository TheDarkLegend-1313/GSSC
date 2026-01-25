import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { authAPI } from '../services/api.js'

const OTPRequestPage = () => {
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError(null)
    setLoading(true)

    try {
      // Send email to backend - backend will check if user exists and send OTP
      const response = await authAPI.requestOTP(email)

      // If successful, navigate to OTP verify page with email
      if (response.message || response.success || response.detail) {
        // Store email in sessionStorage to use in verify page
        sessionStorage.setItem('otp_email', email)
        navigate('/verify-otp')
      } else {
        throw new Error('Failed to send OTP')
      }
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          err.response?.data?.message ||
          err.response?.data?.error ||
          err.message ||
          'Failed to send OTP. Please check if the email exists.'
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
        <h1>Request OTP</h1>
        <p className="panel-subtitle">
          Enter your email address. If the account exists, we&apos;ll send you an OTP to verify
          your identity.
        </p>

        {error && (
          <div className="auth-error" style={{ marginBottom: '1rem' }}>
            {error}
          </div>
        )}

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-field">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Sending OTP...' : 'Send OTP'}
          </button>
        </form>

        <div style={{ marginTop: '1rem', textAlign: 'center' }}>
          <button
            type="button"
            onClick={() => navigate('/register')}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#4f46e5',
              cursor: 'pointer',
              fontSize: '0.9rem',
            }}
          >
            Don&apos;t have an account? Register
          </button>
        </div>
      </motion.div>
    </div>
  )
}

export default OTPRequestPage
