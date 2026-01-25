import { Link } from 'react-router-dom'
import { FiTwitter, FiGithub, FiLinkedin } from 'react-icons/fi'

const Footer = () => {
  return (
    <footer className="gssc-footer">
      <div className="gssc-footer-inner">
        <div className="footer-brand">
          <div className="brand-inline">
            <span className="brand-mark">✹</span>
            <span className="brand-name">GSSC</span>
          </div>
          <p className="footer-description">
            Guidance System for Solar Consumers – helping you plan, price, and
            optimize your solar journey with clarity and confidence.
          </p>
        </div>

        <div className="footer-links">
          <div className="footer-column">
            <h4>Platform</h4>
            <Link to="/">Dashboard</Link>
            <Link to="/price-tracker">Price Tracker</Link>
            <Link to="/quotation-generator">Quotation Generator</Link>
            <Link to="/ai-chatbot">AI Chatbot</Link>
          </div>
          <div className="footer-column">
            <h4>Calculators</h4>
            <Link to="/calculator/solar">Solar Calculator</Link>
            <Link to="/calculator/power">Power Calculator</Link>
          </div>
          <div className="footer-column">
            <h4>Company</h4>
            <Link to="/contact">Contact</Link>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </div>
          <div className="footer-column">
            <h4>Social</h4>
            <div className="footer-social">
              <a href="https://twitter.com" target="_blank" rel="noreferrer">
                <FiTwitter />
              </a>
              <a href="https://github.com" target="_blank" rel="noreferrer">
                <FiGithub />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noreferrer">
                <FiLinkedin />
              </a>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} GSSC. All rights reserved.</span>
        </div>
      </div>
    </footer>
  )
}

export default Footer

