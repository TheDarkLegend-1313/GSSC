import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { authAPI } from '../services/api.js'
import { tokenService } from '../services/api.js'
import Cookies from 'js-cookie'

const ChangePasswordPage = () => {
  const navigate = useNavigate()

  const [oldPassword, setOldPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)
  const [loading, setLoading] = useState(false)

  // Authentication check (commented out for dev testing)
  // useEffect(() => {
  //   const checkAuth = () => {
  //     const jwtToken = Cookies.get('access_token') || tokenService.getAccessToken()
  //     if (!jwtToken) {
  //       window.location.href = '/login'
  //       return
  //     }
  //   }
  //   checkAuth()
  // }, [])

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError(null)
    setSuccess(null)
    setLoading(true)

    // Validation
    if (newPassword !== confirmPassword) {
      setError('New passwords do not match')
      setLoading(false)
      return
    }

    if (newPassword.length < 8) {
      setError('New password must be at least 8 characters long')
      setLoading(false)
      return
    }

    if (oldPassword === newPassword) {
      setError('New password must be different from old password')
      setLoading(false)
      return
    }

    try {
      // Send old and new password to backend
      const response = await authAPI.changePassword(oldPassword, newPassword)

      setSuccess(
        response.message || response.detail || 'Password changed successfully! Redirecting...'
      )

      // Clear form
      setOldPassword('')
      setNewPassword('')
      setConfirmPassword('')

      // Redirect to home after 2 seconds
      setTimeout(() => {
        navigate('/')
      }, 2000)
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          err.response?.data?.message ||
          err.response?.data?.error ||
          err.message ||
          'Failed to change password. Please try again.'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page page-with-hero">
      <section className="page-hero">
        <div className="page-hero-content">
          <h1>Change Password</h1>
          <p>Update your account password to keep your account secure.</p>
        </div>
      </section>

      <section className="page-content-grid single-column">
        <motion.div
          className="panel panel-primary"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <h2>Change Password</h2>

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

          <form className="form-grid" onSubmit={handleSubmit}>
            <div className="form-field">
              <label htmlFor="oldPassword">Current Password</label>
              <input
                id="oldPassword"
                type="password"
                placeholder="Enter current password"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                required
                disabled={loading}
              />
            </div>

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

            <div className="form-actions">
              <button type="submit" className="btn-primary" disabled={loading}>
                {loading ? 'Changing Password...' : 'Change Password'}
              </button>
            </div>
          </form>
        </motion.div>
      </section>
    </div>
  )
}

export default ChangePasswordPage
