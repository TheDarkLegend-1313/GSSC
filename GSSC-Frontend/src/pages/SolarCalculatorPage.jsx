import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { calculatorAPI } from '../services/api.js'
import { cookieService } from '../utils/cookieService.js'

const APPLIANCES = [
  { key: 'lightbulb', label: 'Lightbulb' },
  { key: 'fans', label: 'Fans' },
  { key: 'AC', label: 'AC' },
  { key: 'Heater', label: 'Heater' },
  { key: 'Fridge', label: 'Fridge' },
  { key: 'other', label: 'Other' },
]

const PANEL_WATTS = [550, 650, 750]

const SolarCalculatorPage = () => {
  const [appliances, setAppliances] = useState(
    APPLIANCES.reduce((acc, app) => {
      acc[app.key] = { enabled: false, power: 0 }
      return acc
    }, {})
  )
  const [panelWatt, setPanelWatt] = useState(550)
  const [backupHoursEnabled, setBackupHoursEnabled] = useState(false)
  const [backupHours, setBackupHours] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [results, setResults] = useState(null)

  // Load data from cookie on mount
  useEffect(() => {
    const savedData = cookieService.getSolarCalcData()
    if (savedData) {
      setAppliances(savedData.appliances || appliances)
      setPanelWatt(savedData.panelWatt || 550)
      setBackupHoursEnabled(savedData.backupHoursEnabled || false)
      setBackupHours(savedData.backupHours || 0)
    }
  }, [])

  const handleApplianceChange = (key, field, value) => {
    setAppliances((prev) => ({
      ...prev,
      [key]: {
        ...prev[key],
        [field]: field === 'enabled' ? value : Number(value) || 0,
      },
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    // Build appliances JSON
    const appliancesJson = Object.keys(appliances).reduce((acc, key) => {
      if (appliances[key].enabled) {
        acc[key] = appliances[key].power
      }
      return acc
    }, {})

    const requestData = {
      appliances: appliancesJson,
      panel_watt: panelWatt,
      backup_hours: backupHoursEnabled ? backupHours : 0,
    }

    try {
      // Send to backend
      const response = await calculatorAPI.calculateSolar(requestData)
      setResults(response)

      // Store in cookie (including results for Power Calculator)
      cookieService.setSolarCalcData({
        appliances,
        panelWatt,
        backupHoursEnabled,
        backupHours: backupHoursEnabled ? backupHours : 0,
        solarPanelQuantity: response.Solar_panel_Quantity,
      })
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          err.response?.data?.message ||
          err.message ||
          'Failed to calculate solar requirements. Please try again.'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page page-with-hero">
      <section className="page-hero">
        <div className="page-hero-content">
          <h1>Solar Calculator</h1>
          <p>
            Select your appliances, panel wattage, and backup requirements to calculate your ideal
            solar system configuration.
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
          <h2>System Configuration</h2>
          <p className="panel-subtitle">
            Select appliances and configure your solar panel requirements.
          </p>

          {error && (
            <div className="auth-error" style={{ marginBottom: '1rem' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-grid">
              <div className="form-field full-width">
                <label style={{ marginBottom: '0.75rem', display: 'block' }}>Appliances</label>
                <div className="appliances-list">
                  {APPLIANCES.map((app) => (
                    <div key={app.key} className="appliance-item">
                      <label className="checkbox-label">
                        <input
                          type="checkbox"
                          checked={appliances[app.key].enabled}
                          onChange={(e) =>
                            handleApplianceChange(app.key, 'enabled', e.target.checked)
                          }
                        />
                        <span>{app.label}</span>
                      </label>
                      {appliances[app.key].enabled && (
                        <input
                          type="number"
                          min="0"
                          step="1"
                          placeholder="Power (W)"
                          value={appliances[app.key].power || ''}
                          onChange={(e) =>
                            handleApplianceChange(app.key, 'power', e.target.value)
                          }
                          className="appliance-power-input"
                          required
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="form-field">
                <label htmlFor="panelWatt">Panel Watt</label>
                <select
                  id="panelWatt"
                  value={panelWatt}
                  onChange={(e) => setPanelWatt(Number(e.target.value))}
                  required
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
                  />
                )}
              </div>

              <div className="form-actions">
                <button type="submit" className="btn-primary" disabled={loading}>
                  {loading ? 'Calculating...' : 'Calculate'}
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
          <h2>Calculation Results</h2>
          {results ? (
            <div className="result-grid">
              <div className="result-card">
                <span className="label">Max Inverter Capacity</span>
                <strong>{results.Max_inverter_capacity || 'N/A'}</strong>
              </div>
              <div className="result-card">
                <span className="label">Total Daily kWh</span>
                <strong>{results.total_daily_kwh || 'N/A'}</strong>
              </div>
              <div className="result-card">
                <span className="label">Solar Panel Quantity</span>
                <strong>{results.Solar_panel_Quantity || 'N/A'}</strong>
              </div>
            </div>
          ) : (
            <p className="panel-subtitle">
              Fill in the form and click Calculate to see results.
            </p>
          )}
        </motion.div>
      </section>
    </div>
  )
}

export default SolarCalculatorPage

