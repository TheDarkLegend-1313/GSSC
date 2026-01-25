import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useState } from 'react'
import { authAPI } from '../services/api.js'

const RegisterPage = () => {
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setLoading(true)

    try {
      // Register user
      const response = await authAPI.register(username, email, password)

      // If registration is successful, redirect to OTP request page
      if (response.message || response.success || response.detail) {
        // Store email in sessionStorage for OTP flow
        sessionStorage.setItem('otp_email', email)
        navigate('/request-otp')
      } else {
        throw new Error('Registration failed')
      }
    } catch (err) {
      let message = 'Registration failed.'

      if (err.response) {
        const data = err.response.data
        message =
          data?.email?.[0] ||
          data?.username?.[0] ||
          data?.password?.[0] ||
          data?.detail ||
          data?.message ||
          `Server error: ${err.response.status}`
      } else if (err.message) {
        message = err.message
      }

      setError(message)
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
        <h1>Create your GSSC account</h1>
        <p className="panel-subtitle">
          Join GSSC to start planning your solar journey with confidence.
        </p>

        {error && (
          <div className="auth-error" style={{ marginBottom: '1rem', color: '#ef4444' }}>
            {error}
          </div>
        )}

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-field">
            <label htmlFor="username">Username</label>
            <input
              id="username"
              type="text"
              placeholder="Choose a username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              disabled={loading}
            />
          </div>
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
          <div className="form-field">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
              disabled={loading}
            />
          </div>
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Creating account...' : 'Sign up'}
          </button>
        </form>

        <div style={{ marginTop: '1rem', textAlign: 'center' }}>
          <button
            type="button"
            onClick={() => navigate('/login')}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#4f46e5',
              cursor: 'pointer',
              fontSize: '0.9rem',
            }}
          >
            Already have an account? Login
          </button>
        </div>
      </motion.div>
    </div>
  )
}

export default RegisterPage
