import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { authAPI } from '../services/api.js'

const ForgetChangePasswordPage = () => {
  const navigate = useNavigate()

  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)
  const [loading, setLoading] = useState(false)

  // Check if user came from forgot password flow
  useEffect(() => {
    const forgotPasswordFlow = sessionStorage.getItem('forgot_password_flow')
    if (!forgotPasswordFlow) {
      // If not from forgot password flow, redirect to login
      navigate('/login')
    }
  }, [navigate])

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError(null)
    setSuccess(null)
    setLoading(true)

    // Validation
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match')
      setLoading(false)
      return
    }

    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters long')
      setLoading(false)
      return
    }

    try {
      // Reset password using OTP token (stored from OTP verification)
      const response = await authAPI.resetPassword(newPassword, confirmPassword)

      setSuccess(
        response.message || response.detail || 'Password reset successfully! Redirecting to login...'
      )

      // Clear session storage
      sessionStorage.removeItem('forgot_password_flow')
      sessionStorage.removeItem('otp_email')

      // Clear form
      setNewPassword('')
      setConfirmPassword('')

      // Redirect to login after 2 seconds
      setTimeout(() => {
        navigate('/login')
      }, 2000)
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          err.response?.data?.message ||
          err.response?.data?.error ||
          err.message ||
          'Failed to reset password. Please try again.'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page auth-page">
      <Link to="/" className="auth-brand">
        <span className="brand-mark">✹</span>
        <div className="brand-text">
          <span className="brand-name">GSSC</span>
          <span className="brand-tagline">
            Guidance System for Solar Consumers
          </span>
        </div>
      </Link>
      <motion.div
        className="auth-card"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1>Reset Password</h1>
        <p className="panel-subtitle">
          Enter your new password below.
        </p>

        {error && (
          <div className="auth-error" style={{ marginBottom: '1rem' }}>
            {error}
          </div>
        )}

        {success && (
          <div
            style={{
              marginBottom: '1rem',
              padding: '0.75rem 1rem',
              borderRadius: '0.8rem',
              background: 'rgba(34, 197, 94, 0.1)',
              border: '1px solid rgba(34, 197, 94, 0.3)',
              color: '#16a34a',
            }}
          >
            {success}
          </div>
        )}

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-field">
            <label htmlFor="newPassword">New Password</label>
            <input
              id="newPassword"
              type="password"
              placeholder="Enter new password (min 8 characters)"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              minLength={8}
              disabled={loading}
            />
          </div>

          <div className="form-field">
            <label htmlFor="confirmPassword">Confirm New Password</label>
            <input
              id="confirmPassword"
              type="password"
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              minLength={8}
              disabled={loading}
            />
          </div>

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Resetting Password...' : 'Reset Password'}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            Remember your password?{' '}
            <Link to="/login" className="auth-link">
              Sign in
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  )
}

export default ForgetChangePasswordPage
