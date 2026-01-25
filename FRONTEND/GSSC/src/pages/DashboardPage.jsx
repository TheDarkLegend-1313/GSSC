import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  FiSun,
  FiTrendingUp,
  FiZap,
  FiMessageCircle,
  FiFileText,
  FiArrowRight,
} from 'react-icons/fi'

const heroBackground =
  'https://images.pexels.com/photos/9875446/pexels-photo-9875446.jpeg?auto=compress&cs=tinysrgb&w=1600'

const DashboardPage = () => {
  const navigate = useNavigate()

  const quickLinks = [
    {
      title: 'Solar Calculator',
      description: 'Estimate your potential solar output, payback period, and savings.',
      icon: FiSun,
      action: () => navigate('/calculator/solar'),
      accent: 'accent-solar',
    },
    {
      title: 'Power Calculator',
      description: 'Size your solar system based on appliances and daily usage.',
      icon: FiZap,
      action: () => navigate('/calculator/power'),
      accent: 'accent-power',
    },
    {
      title: 'Price Tracker',
      description: 'Track panel and inverter prices to buy at the right time.',
      icon: FiTrendingUp,
      action: () => navigate('/price-tracker'),
      accent: 'accent-price',
    },
    {
      title: 'Quotation Generator',
      description: 'Create beautiful, shareable proposals in a few clicks.',
      icon: FiFileText,
      action: () => navigate('/quotation-generator'),
      accent: 'accent-quote',
    },
    {
      title: 'AI Solar Copilot',
      description: 'Ask anything about solar, from sizing to incentives.',
      icon: FiMessageCircle,
      action: () => navigate('/ai-chatbot'),
      accent: 'accent-ai',
    },
  ]

  const featureCards = [
    {
      title: 'Capital that grows',
      body: 'See how the right-sized solar system can turn your rooftop into a long-term energy asset.',
      image:
        'https://images.pexels.com/photos/9875450/pexels-photo-9875450.jpeg?auto=compress&cs=tinysrgb&w=1200',
    },
    {
      title: 'Always optimised, always visible',
      body: 'Live price insights and performance estimates keep your project on track at every step.',
    },
    {
      title: '100% guided, zero guesswork',
      body: 'From calculators to quotes, every tool is built to guide first-time solar consumers with confidence.',
    },
  ]

  const useCases = [
    'Homeowners planning their first rooftop system',
    'Installers building transparent proposals for clients',
    'Businesses exploring hybrid solar + grid strategies',
    'Communities evaluating shared / community solar',
  ]

  return (
    <div className="dashboard-page">
      {/* Hero */}
      <section className="hero">
        <motion.div
          className="hero-inner"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          <div className="hero-copy">
            <span className="hero-pill">GSSC • Guidance System for Solar Consumers</span>
            <h1>Where Solar Decisions Grow Clear</h1>
            <p>
              GSSC is your programmable guidance layer for solar. Model savings, compare prices,
              and generate ready-to-share quotations – all in one calm, visual workspace.
            </p>
            <div className="hero-actions">
              <button
                type="button"
                className="btn-primary"
                onClick={() => navigate('/calculator/solar')}
              >
                Try solar calculator
                <FiArrowRight className="icon" />
              </button>
              <button
                type="button"
                className="btn-ghost"
                onClick={() => navigate('/price-tracker')}
              >
                View market prices
              </button>
            </div>
            <div className="hero-meta">
              <span>Built for clarity.</span>
              <span>Designed for first-time solar journeys.</span>
            </div>
          </div>

          <div className="hero-visual">
            <div
              className="hero-image"
              style={{ backgroundImage: `url(${heroBackground})` }}
            />
            <div className="hero-gradient" />
          </div>
        </motion.div>
      </section>

      {/* What is GSSC */}
      <section className="section what-is">
        <div className="section-header">
          <div>
            <h2>What is GSSC?</h2>
            <p>
              GSSC (Guidance System for Solar Consumers) turns complex solar planning into a
              guided, visual experience – from first question to final quotation.
            </p>
          </div>
          <button
            type="button"
            className="btn-outline"
            onClick={() => navigate('/ai-chatbot')}
          >
            Explore with AI copilot
          </button>
        </div>

        <div className="what-grid">
          <motion.article
            className="what-card what-card-highlight"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="what-card-image-wrapper">
              <div
                className="what-card-image"
                style={{
                  backgroundImage:
                    'url(https://images.pexels.com/photos/9875451/pexels-photo-9875451.jpeg?auto=compress&cs=tinysrgb&w=1200)',
                }}
              />
            </div>
            <div className="what-card-content">
              <h3>Capital that grows</h3>
              <p>
                Turn your energy bill into an investment. GSSC helps you visualise how
                self-generation, incentives, and tariffs shape your long-term savings.
              </p>
            </div>
          </motion.article>

          {featureCards.slice(1).map((card, index) => (
            <motion.article
              // eslint-disable-next-line react/no-array-index-key
              key={index}
              className="what-card"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.1 * index }}
            >
              <h3>{card.title}</h3>
              <p>{card.body}</p>
            </motion.article>
          ))}
        </div>
      </section>

      {/* Quick tools */}
      <section className="section tools">
        <header className="section-header">
          <div>
            <span className="eyebrow">GSSC in action</span>
            <h2>Use cases & tools</h2>
            <p>
              Every tool in GSSC is tuned for real-world solar journeys – from quick feasibility
              checks to detailed commercial proposals.
            </p>
          </div>
        </header>

        <div className="tools-layout">
          <div className="tools-list">
            {quickLinks.map((tool, index) => (
              <motion.button
                // eslint-disable-next-line react/no-array-index-key
                key={tool.title}
                type="button"
                className={`tool-card ${tool.accent}`}
                onClick={tool.action}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: index * 0.05 }}
              >
                <div className="tool-icon">
                  <tool.icon />
                </div>
                <div className="tool-body">
                  <h3>{tool.title}</h3>
                  <p>{tool.description}</p>
                </div>
                <FiArrowRight className="tool-arrow" />
              </motion.button>
            ))}
          </div>

          <motion.aside
            className="use-cases"
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h3>Use cases</h3>
            <p>
              GSSC serves developers, businesses, installers, and consumers who want solar to be
              transparent and data-backed.
            </p>
            <ul>
              {useCases.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <button
              type="button"
              className="btn-link"
              onClick={() => navigate('/quotation-generator')}
            >
              See how quotations work
              <FiArrowRight className="icon" />
            </button>
          </motion.aside>
        </div>
      </section>
    </div>
  )
}

export default DashboardPage

