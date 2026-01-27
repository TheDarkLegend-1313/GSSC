import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext.jsx'

const LoginPage = () => {
  const { login } = useAuth()
  const navigate = useNavigate()

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError(null)
    setLoading(true)

    try {
      // Use AuthContext login which handles JWT authentication
      const result = await login(username, password)

      if (result.success) {
        // Redirect to home page
        navigate('/')
      } else {
        setError(result.error || 'Invalid username or password')
      }
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          err.response?.data?.message ||
          err.response?.data?.error ||
          err.message ||
          'Invalid username or password'
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
        <h1>Welcome back to GSSC</h1>
        <p className="panel-subtitle">
          Sign in using your registered username and password.
        </p>

        {error && (
          <div className="auth-error" style={{ marginBottom: '1rem' }}>
            {error}
          </div>
        )}

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-field">
            <label htmlFor="username">Username</label>
            <input
              id="username"
              type="text"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
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
              disabled={loading}
            />
          </div>

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>
        <div className="auth-footer">
        <p>
          New user?{' '}
          <Link to="/register" className="auth-link">
            Create an account
          </Link>
        </p>
      </div>
      </motion.div>
    </div>
  )
}

export default LoginPage
