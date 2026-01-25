import { useState } from 'react'
import { motion } from 'framer-motion'
import { calculatorAPI } from '../services/api.js'

const PANEL_WATTS = [550, 650, 750]

const PowerCalculatorPage = () => {
  const [solarPanelQuantity, setSolarPanelQuantity] = useState('')
  const [panelWatt, setPanelWatt] = useState(550)
  const [backupHoursEnabled, setBackupHoursEnabled] = useState(false)
  const [backupHours, setBackupHours] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [results, setResults] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const requestData = {
      solarpanel_quantity: Number(solarPanelQuantity),
      panelwatt: panelWatt,
      backup_hours: backupHoursEnabled ? Number(backupHours) : 0,
    }

    try {
      const response = await calculatorAPI.calculatePower(requestData)
      setResults(response)
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          err.response?.data?.message ||
          err.message ||
          'Failed to calculate power requirements. Please try again.'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page page-with-hero">
      <section className="page-hero">
        <div className="page-hero-content">
          <h1>Power Calculator</h1>
          <p>
            Calculate power requirements based on your solar panel configuration. Enter the number
            of panels, panel wattage, and backup hours if needed.
          </p>
        </div>
      </section>

      <section className="page-content-grid">
        <motion.div
          className="panel panel-primary"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <h2>Power System Configuration</h2>
          <p className="panel-subtitle">
            Enter your solar panel configuration to calculate power requirements.
          </p>

          {error && (
            <div className="auth-error" style={{ marginBottom: '1rem' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-grid">
              <div className="form-field">
                <label htmlFor="solarPanelQuantity">Solar Panel Quantity</label>
                <input
                  id="solarPanelQuantity"
                  type="number"
                  min="1"
                  step="1"
                  placeholder="e.g. 10"
                  value={solarPanelQuantity}
                  onChange={(e) => setSolarPanelQuantity(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>

              <div className="form-field">
                <label htmlFor="panelWatt">Panel Watt</label>
                <select
                  id="panelWatt"
                  value={panelWatt}
                  onChange={(e) => setPanelWatt(Number(e.target.value))}
                  required
                  disabled={loading}
                >
                  {PANEL_WATTS.map((watt) => (
                    <option key={watt} value={watt}>
                      {watt}W
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-field full-width">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={backupHoursEnabled}
                    onChange={(e) => setBackupHoursEnabled(e.target.checked)}
                    disabled={loading}
                  />
                  <span>Enable Backup Hours</span>
                </label>
                {backupHoursEnabled && (
                  <input
                    type="number"
                    min="0"
                    step="1"
                    placeholder="Backup Hours"
                    value={backupHours || ''}
                    onChange={(e) => setBackupHours(Number(e.target.value) || 0)}
                    style={{ marginTop: '0.5rem' }}
                    required
                    disabled={loading}
                  />
                )}
              </div>

              <div className="form-actions">
                <button type="submit" className="btn-primary" disabled={loading}>
                  {loading ? 'Calculating...' : 'Calculate Power Requirements'}
                </button>
              </div>
            </div>
          </form>
        </motion.div>

        <motion.div
          className="panel panel-secondary"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <h2>Power Calculation Results</h2>
          {results ? (
            <div className="summary-grid">
              <div className="summary-item">
                <span className="label">Usable Power (kWh)</span>
                <strong>{results.usable_power_kwh || 'N/A'}</strong>
              </div>
              <div className="summary-item">
                <span className="label">Total Daily (kWh)</span>
                <strong>{results.total_daily_kwh || 'N/A'}</strong>
              </div>
              <div className="summary-item">
                <span className="label">Inverter Capacity (kWh)</span>
                <strong>{results.invertor_capacity_kwh || 'N/A'}</strong>
              </div>
              <div className="summary-item">
                <span className="label">Battery Capacity (kWh)</span>
                <strong>{results.battery_capacity_kwh || 'N/A'}</strong>
              </div>
            </div>
          ) : (
            <p className="panel-subtitle">
              Fill in the form and click Calculate to see power requirements.
            </p>
          )}
        </motion.div>
      </section>
    </div>
  )
}

export default PowerCalculatorPage
