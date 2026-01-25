import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useState, useEffect, useRef } from 'react'
import { FiChevronDown, FiUser, FiLogOut, FiMoon, FiSun, FiLock } from 'react-icons/fi'
import { useAuth } from '../context/AuthContext.jsx'
import { useTheme } from '../context/ThemeContext.jsx'

const navLinkClass = ({ isActive }) =>
  `nav-link ${isActive ? 'nav-link-active' : ''}`

const Header = () => {
  const { user, logout } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const navigate = useNavigate()

  const [isCalcOpen, setIsCalcOpen] = useState(false)
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const calcDropdownRef = useRef(null)
  const profileDropdownRef = useRef(null)

  // Handle outside clicks for calculator dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (calcDropdownRef.current && !calcDropdownRef.current.contains(event.target)) {
        setIsCalcOpen(false)
      }
    }

    if (isCalcOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isCalcOpen])

  // Handle outside clicks for profile dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target)) {
        setIsProfileOpen(false)
      }
    }

    if (isProfileOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isProfileOpen])

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  return (
    <header className="gssc-header">
      <div className="gssc-header-inner">
        {/* Brand */}
        <Link to="/" className="brand">
          <span className="brand-mark">✹</span>
          <div className="brand-text">
            <span className="brand-name">GSSC</span>
            <span className="brand-tagline">
              Guidance System for Solar Consumers
            </span>
          </div>
        </Link>

        {/* Navigation */}
        <nav className="nav">
          <div
            ref={calcDropdownRef}
            className="nav-item nav-dropdown"
          >
            <button
              className="nav-link nav-dropdown-trigger"
              type="button"
              onClick={() => setIsCalcOpen(!isCalcOpen)}
            >
              Calculator
              <FiChevronDown className="icon" />
            </button>
            {isCalcOpen && (
              <div className="nav-dropdown-menu">
                <NavLink
                  to="/calculator/solar"
                  className={navLinkClass}
                  onClick={() => setIsCalcOpen(false)}
                >
                  Solar Calculator
                </NavLink>
                <NavLink
                  to="/calculator/power"
                  className={navLinkClass}
                  onClick={() => setIsCalcOpen(false)}
                >
                  Power Calculator
                </NavLink>
              </div>
            )}
          </div>

          <NavLink to="/price-tracker" className={navLinkClass}>
            Price Tracker
          </NavLink>
          <NavLink to="/quotation-generator" className={navLinkClass}>
            Quotation Generator
          </NavLink>
          <NavLink to="/ai-chatbot" className={navLinkClass}>
            AI Chatbot
          </NavLink>
          <NavLink to="/contact" className={navLinkClass}>
            Contact
          </NavLink>
        </nav>

        {/* Right Section */}
        <div className="header-right">
          {/* Theme Toggle */}
          <button
            type="button"
            className="theme-toggle"
            onClick={toggleTheme}
            aria-label="Toggle dark mode"
          >
            {theme === 'dark' ? (
              <FiSun className="icon" />
            ) : (
              <FiMoon className="icon" />
            )}
          </button>

          {/* Profile */}
          <div ref={profileDropdownRef} className="profile-area">
            <button
              className="profile-trigger"
              type="button"
              onClick={() => setIsProfileOpen(!isProfileOpen)}
            >
              <FiUser className="icon" />
              <span>{user ? user.email : 'Guest'}</span>
              <FiChevronDown className="icon" />
            </button>

            {isProfileOpen && (
              <div className="nav-dropdown-menu profile-menu">
                {user ? (
                  <>
                    <NavLink
                      to="/change-password"
                      className={navLinkClass}
                      onClick={() => setIsProfileOpen(false)}
                    >
                      <FiLock className="icon" />
                      Change Password
                    </NavLink>
                    <button
                      type="button"
                      className="nav-link profile-action"
                      onClick={() => {
                        setIsProfileOpen(false)
                        handleLogout()
                      }}
                    >
                      <FiLogOut className="icon" />
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <NavLink
                      to="/login"
                      className={navLinkClass}
                      onClick={() => setIsProfileOpen(false)}
                    >
                      Login
                    </NavLink>
                    <NavLink
                      to="/register"
                      className={navLinkClass}
                      onClick={() => setIsProfileOpen(false)}
                    >
                      Sign up
                    </NavLink>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
