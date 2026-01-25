import { useState } from 'react'
import { motion } from 'framer-motion'
import { contactAPI } from '../services/api.js'
import Cookies from 'js-cookie'

const ContactPage = () => {
  // Authentication check (commented out for dev testing)
  // useEffect(() => {
  //   const checkAuth = () => {
  //     const jwtToken = Cookies.get('access_token') // Adjust cookie name as needed
  //     if (!jwtToken) {
  //       window.location.href = '/login'
  //       return
  //     }
  //   }
  //   checkAuth()
  // }, [])

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  })
  const [loading, setLoading] = useState(false)
  const [response, setResponse] = useState(null)
  const [error, setError] = useState(null)

  // Handle input changes
  const handleChange = (e) => {
    const { id, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }))
    // Clear previous response/error when user starts typing
    if (response || error) {
      setResponse(null)
      setError(null)
    }
  }

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setResponse(null)

    // Basic validation
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      setError('Please fill in all fields.')
      setLoading(false)
      return
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address.')
      setLoading(false)
      return
    }

    try {
      const result = await contactAPI.sendContact({
        name: formData.name.trim(),
        email: formData.email.trim(),
        message: formData.message.trim(),
      })

      // Show backend response
      setResponse(
        result.message ||
          result.detail ||
          result.response ||
          'Your message has been sent successfully!'
      )

      // Clear form on success
      setFormData({
        name: '',
        email: '',
        message: '',
      })
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          err.response?.data?.message ||
          err.message ||
          'Failed to send message. Please try again.'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page page-with-hero">
      <section className="page-hero">
        <div className="page-hero-content">
          <h1>Contact</h1>
          <p>
            Share your project idea or question and the GSSC team will respond with tailored
            guidance.
          </p>
        </div>
      </section>

      <section className="page-content-grid single-column">
        <motion.div
          className="panel panel-primary"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <h2>Contact Form</h2>
          <p className="panel-subtitle">
            Fill out the form below and we&apos;ll get back to you as soon as possible.
          </p>

          {error && (
            <div className="auth-error" style={{ marginBottom: '1rem' }}>
              {error}
            </div>
          )}

          {response && (
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
              {response}
            </div>
          )}

          <form className="form-grid" onSubmit={handleSubmit}>
            <div className="form-field">
              <label htmlFor="name">Name</label>
              <input
                id="name"
                type="text"
                placeholder="Your name"
                value={formData.name}
                onChange={handleChange}
                disabled={loading}
                required
              />
            </div>
            <div className="form-field">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                disabled={loading}
                required
              />
            </div>
            <div className="form-field full-width">
              <label htmlFor="message">Project or question</label>
              <textarea
                id="message"
                rows={4}
                placeholder="Share as much context as you like..."
                value={formData.message}
                onChange={handleChange}
                disabled={loading}
                required
              />
            </div>
            <div className="form-actions">
              <button type="submit" disabled={loading} className="btn-primary">
                {loading ? 'Sending...' : 'Submit'}
              </button>
            </div>
          </form>
        </motion.div>
      </section>
    </div>
  )
}

export default ContactPage
