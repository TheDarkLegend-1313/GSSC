import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { quotationAPI } from '../services/api.js'
import Cookies from 'js-cookie'
import { FiMail, FiSave, FiDownload, FiRefreshCw } from 'react-icons/fi'

// Fixed items for the quotation table
const QUOTATION_ITEMS = [
  'Panel',
  'Inverter',
  'Battery',
  'Panel Mount Structure',
  'DB Box',
  'Tin Coated Cable',
  'AC Cable',
  'Installation Accessories',
  'AC/DC Earthing Bore',
  'Net Metering Green Meter', 
]

const QuotationGeneratorPage = () => {
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

  // State for quotation items
  const [items, setItems] = useState(
    QUOTATION_ITEMS.map((item, index) => ({
      id: index + 1,
      name: item,
      enabled: true,
      description: '',
      quantity: 1, // Default quantity for enabled items
      unitPrice: 0,
      totalPrice: 0,
      descriptionOptions: [], // Will be populated from backend
    }))
  )

  // State for quotation options from backend
  const [quotationOptions, setQuotationOptions] = useState({})
  const [loadingOptions, setLoadingOptions] = useState(true)
  const [optionsError, setOptionsError] = useState(null)

  // State for calculation results
  const [calculationResults, setCalculationResults] = useState(null)
  const [calculating, setCalculating] = useState(false)
  const [calculationError, setCalculationError] = useState(null)

  // State for email quotation
  const [emailLoading, setEmailLoading] = useState(false)
  const [emailResponse, setEmailResponse] = useState(null)
  const [emailError, setEmailError] = useState(null)

  // State for save/request operations
  const [saveLoading, setSaveLoading] = useState(false)
  const [requestLoading, setRequestLoading] = useState(false)
  const [saveResponse, setSaveResponse] = useState(null)
  const [requestResponse, setRequestResponse] = useState(null)

  // Fetch quotation options on component mount
  useEffect(() => {
    fetchQuotationOptions()
  }, [])

  // Fetch quotation options (descriptions and unit prices) from backend
  const fetchQuotationOptions = async () => {
    setLoadingOptions(true)
    setOptionsError(null)
    try {
      const response = await quotationAPI.getQuotationOptions()
      setQuotationOptions(response)

      // Update items with description options and default values
      setItems((prevItems) =>
        prevItems.map((item) => {
          const itemOptions = response[item.name] || {}
          const descriptions = itemOptions.descriptions || []
          const defaultDescription = descriptions.length > 0 ? descriptions[0] : ''
          const defaultUnitPrice = itemOptions.unitPrices?.[defaultDescription] || 0

          return {
            ...item,
            descriptionOptions: descriptions,
            description: defaultDescription,
            unitPrice: defaultUnitPrice,
            quantity: item.enabled ? (item.quantity || 1) : 0,
            totalPrice: item.enabled ? defaultUnitPrice * (item.quantity || 1) : 0,
          }
        })
      )
    } catch (err) {
      setOptionsError(
        err.response?.data?.detail ||
          err.response?.data?.message ||
          err.message ||
          'Failed to load quotation options. Please try again.'
      )
    } finally {
      setLoadingOptions(false)
    }
  }

  // Handle checkbox toggle
  const handleToggleItem = (itemId) => {
    setItems((prevItems) =>
      prevItems.map((item) => {
        if (item.id === itemId) {
          const newEnabled = !item.enabled
          return {
            ...item,
            enabled: newEnabled,
            quantity: newEnabled ? (item.quantity || 1) : 0,
            totalPrice: newEnabled ? item.unitPrice * (item.quantity || 1) : 0,
          }
        }
        return item
      })
    )
  }

  // Handle description change
  const handleDescriptionChange = (itemId, newDescription) => {
    setItems((prevItems) =>
      prevItems.map((item) => {
        if (item.id === itemId) {
          const itemOptions = quotationOptions[item.name] || {}
          const newUnitPrice = itemOptions.unitPrices?.[newDescription] || 0
          return {
            ...item,
            description: newDescription,
            unitPrice: newUnitPrice,
            totalPrice: item.enabled ? newUnitPrice * item.quantity : 0,
          }
        }
        return item
      })
    )
  }

  // Handle quantity change
  const handleQuantityChange = (itemId, newQuantity) => {
    const quantity = Math.max(0, parseFloat(newQuantity) || 0)
    setItems((prevItems) =>
      prevItems.map((item) => {
        if (item.id === itemId) {
          return {
            ...item,
            quantity: quantity,
            totalPrice: item.enabled ? item.unitPrice * quantity : 0,
          }
        }
        return item
      })
    )
  }

  // Calculate quotation
  const handleCalculate = async () => {
    setCalculating(true)
    setCalculationError(null)
    setCalculationResults(null)

    try {
      // Prepare quotation data for backend
      const quotationData = {
        items: items.map((item) => ({
          name: item.name,
          enabled: item.enabled,
          description: item.description,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          totalPrice: item.totalPrice,
        })),
      }

      const response = await quotationAPI.calculateQuotation(quotationData)
      setCalculationResults({
        roi: response.roi || response.ROI || 0,
        estimatedTotalPrice: response.estimatedTotalPrice || response.estimated_total_price || 0,
      })
    } catch (err) {
      setCalculationError(
        err.response?.data?.detail ||
          err.response?.data?.message ||
          err.message ||
          'Failed to calculate quotation. Please try again.'
      )
    } finally {
      setCalculating(false)
    }
  }

  // Request old quotation
  const handleRequestOldQuotation = async () => {
    setRequestLoading(true)
    setRequestResponse(null)
    try {
      const response = await quotationAPI.requestOldQuotation()
      setRequestResponse(response.message || response.detail || 'Old quotation retrieved successfully!')
      
      // If response contains quotation data, populate the table
      if (response.quotationData || response.items) {
        const oldItems = response.quotationData || response.items
        setItems((prevItems) =>
          prevItems.map((item) => {
            const oldItem = oldItems.find((old) => old.name === item.name)
            if (oldItem) {
              return {
                ...item,
                enabled: oldItem.enabled !== undefined ? oldItem.enabled : item.enabled,
                description: oldItem.description || item.description,
                quantity: oldItem.quantity || item.quantity,
                unitPrice: oldItem.unitPrice || oldItem.unit_price || item.unitPrice,
                totalPrice: oldItem.totalPrice || oldItem.total_price || item.totalPrice,
              }
            }
            return item
          })
        )
      }
    } catch (err) {
      setRequestResponse(
        err.response?.data?.detail ||
          err.response?.data?.message ||
          err.message ||
          'Failed to request old quotation.'
      )
    } finally {
      setRequestLoading(false)
    }
  }

  // Save quotation
  const handleSaveQuotation = async () => {
    setSaveLoading(true)
    setSaveResponse(null)
    try {
      const quotationData = {
        items: items.map((item) => ({
          name: item.name,
          enabled: item.enabled,
          description: item.description,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          totalPrice: item.totalPrice,
        })),
      }

      const response = await quotationAPI.saveQuotation(quotationData)
      setSaveResponse(response.message || response.detail || 'Quotation saved successfully!')
    } catch (err) {
      setSaveResponse(
        err.response?.data?.detail ||
          err.response?.data?.message ||
          err.message ||
          'Failed to save quotation.'
      )
    } finally {
      setSaveLoading(false)
    }
  }

  // Email quotation
  const handleEmailQuotation = async () => {
    setEmailLoading(true)
    setEmailError(null)
    setEmailResponse(null)

    try {
      const quotationData = {
        items: items.map((item) => ({
          name: item.name,
          enabled: item.enabled,
          description: item.description,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          totalPrice: item.totalPrice,
        })),
        calculationResults: calculationResults,
      }

      const response = await quotationAPI.emailQuotation(quotationData)
      setEmailResponse(response.message || response.detail || 'Quotation emailed successfully!')
    } catch (err) {
      setEmailError(
        err.response?.data?.detail ||
          err.response?.data?.message ||
          err.message ||
          'Failed to email quotation. Please try again.'
      )
    } finally {
      setEmailLoading(false)
    }
  }

  return (
    <div className="page page-with-hero">
      <section className="page-hero">
        <div className="page-hero-content">
          <h1>Quotation Generator</h1>
          <p>
            Create and manage solar system quotations with detailed item breakdowns, pricing, and ROI calculations.
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
          <h2>Quotation Table</h2>

          {loadingOptions && (
            <div className="loading-state">
              <p>Loading quotation options...</p>
            </div>
          )}

          {optionsError && (
            <div className="auth-error" style={{ marginBottom: '1rem' }}>
              {optionsError}
            </div>
          )}

          {!loadingOptions && (
            <div className="quotation-table-wrapper">
              <table className="quotation-table">
                <thead>
                  <tr>
                    <th style={{ width: '50px' }}>
                      <input type="checkbox" checked disabled style={{ cursor: 'not-allowed' }} />
                    </th>
                    <th style={{ width: '60px' }}>S.No</th>
                    <th>Item</th>
                    <th>Description</th>
                    <th style={{ width: '120px' }}>Quantity</th>
                    <th style={{ width: '120px' }}>Unit Price</th>
                    <th style={{ width: '120px' }}>Total Price</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item, index) => (
                    <tr key={item.id} className={!item.enabled ? 'disabled-row' : ''}>
                      <td>
                        <input
                          type="checkbox"
                          checked={item.enabled}
                          onChange={() => handleToggleItem(item.id)}
                        />
                      </td>
                      <td>{index + 1}</td>
                      <td>{item.name}</td>
                      <td>
                        <select
                          value={item.description}
                          onChange={(e) => handleDescriptionChange(item.id, e.target.value)}
                          disabled={!item.enabled}
                          style={{
                            width: '100%',
                            padding: '0.5rem',
                            borderRadius: '0.5rem',
                            border: '1px solid #e2e8f0',
                            backgroundColor: item.enabled ? '#fff' : '#f1f5f9',
                            cursor: item.enabled ? 'pointer' : 'not-allowed',
                          }}
                        >
                          <option value="">Select Description</option>
                          {item.descriptionOptions.map((desc, idx) => (
                            <option key={idx} value={desc}>
                              {desc}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td>
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          value={item.quantity}
                          onChange={(e) => handleQuantityChange(item.id, e.target.value)}
                          disabled={!item.enabled}
                          style={{
                            width: '100%',
                            padding: '0.5rem',
                            borderRadius: '0.5rem',
                            border: '1px solid #e2e8f0',
                            backgroundColor: item.enabled ? '#fff' : '#f1f5f9',
                            cursor: item.enabled ? 'pointer' : 'not-allowed',
                          }}
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          value={item.unitPrice.toFixed(2)}
                          disabled
                          style={{
                            width: '100%',
                            padding: '0.5rem',
                            borderRadius: '0.5rem',
                            border: '1px solid #e2e8f0',
                            backgroundColor: '#f8fafc',
                            cursor: 'not-allowed',
                          }}
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          value={item.totalPrice.toFixed(2)}
                          disabled
                          style={{
                            width: '100%',
                            padding: '0.5rem',
                            borderRadius: '0.5rem',
                            border: '1px solid #e2e8f0',
                            backgroundColor: '#f8fafc',
                            cursor: 'not-allowed',
                          }}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Calculate Section */}
          <div style={{ marginTop: '2rem', padding: '1.5rem', background: '#f8fafc', borderRadius: '0.8rem' }}>
            <h3 style={{ marginBottom: '1rem' }}>Calculate</h3>
            <button
              type="button"
              className="btn-primary"
              onClick={handleCalculate}
              disabled={calculating || loadingOptions}
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
            >
              {calculating ? (
                <>
                  <FiRefreshCw className="icon spinning" />
                  <span>Calculating...</span>
                </>
              ) : (
                <>
                  <FiRefreshCw className="icon" />
                  <span>Calculate</span>
                </>
              )}
            </button>

            {calculationError && (
              <div className="auth-error" style={{ marginTop: '1rem' }}>
                {calculationError}
              </div>
            )}

            {calculationResults && (
              <div style={{ marginTop: '1rem', padding: '1rem', background: '#fff', borderRadius: '0.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <strong>ROI (Return on Investment):</strong>
                  <span>{calculationResults.roi}%</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <strong>Estimated Total Price:</strong>
                  <span>Rs. {calculationResults.estimatedTotalPrice.toFixed(2)}</span>
                </div>
              </div>
            )}
          </div>

          {/* Access Quotation Section */}
          <div style={{ marginTop: '2rem', padding: '1.5rem', background: '#f8fafc', borderRadius: '0.8rem' }}>
            <h3 style={{ marginBottom: '1rem' }}>Access Quotation</h3>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <button
                type="button"
                className="btn-secondary"
                onClick={handleRequestOldQuotation}
                disabled={requestLoading || loadingOptions}
                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
              >
                {requestLoading ? (
                  <>
                    <FiRefreshCw className="icon spinning" />
                    <span>Loading...</span>
                  </>
                ) : (
                  <>
                    <FiDownload className="icon" />
                    <span>Request Old Quotation</span>
                  </>
                )}
              </button>

              <button
                type="button"
                className="btn-secondary"
                onClick={handleSaveQuotation}
                disabled={saveLoading || loadingOptions}
                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
              >
                {saveLoading ? (
                  <>
                    <FiRefreshCw className="icon spinning" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <FiSave className="icon" />
                    <span>Save this Quotation</span>
                  </>
                )}
              </button>
            </div>

            {requestResponse && (
              <div
                style={{
                  marginTop: '1rem',
                  padding: '0.75rem 1rem',
                  borderRadius: '0.5rem',
                  background: requestResponse.includes('Failed') ? 'rgba(239, 68, 68, 0.1)' : 'rgba(34, 197, 94, 0.1)',
                  border: `1px solid ${requestResponse.includes('Failed') ? 'rgba(239, 68, 68, 0.3)' : 'rgba(34, 197, 94, 0.3)'}`,
                  color: requestResponse.includes('Failed') ? '#ef4444' : '#16a34a',
                }}
              >
                {requestResponse}
              </div>
            )}

            {saveResponse && (
              <div
                style={{
                  marginTop: '1rem',
                  padding: '0.75rem 1rem',
                  borderRadius: '0.5rem',
                  background: saveResponse.includes('Failed') ? 'rgba(239, 68, 68, 0.1)' : 'rgba(34, 197, 94, 0.1)',
                  border: `1px solid ${saveResponse.includes('Failed') ? 'rgba(239, 68, 68, 0.3)' : 'rgba(34, 197, 94, 0.3)'}`,
                  color: saveResponse.includes('Failed') ? '#ef4444' : '#16a34a',
                }}
              >
                {saveResponse}
              </div>
            )}
          </div>

          {/* Email Quotation Button */}
          <div style={{ marginTop: '2rem', textAlign: 'center' }}>
            <button
              type="button"
              className="btn-primary"
              onClick={handleEmailQuotation}
              disabled={emailLoading || loadingOptions}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.75rem 2rem',
                fontSize: '1rem',
              }}
            >
              {emailLoading ? (
                <>
                  <FiRefreshCw className="icon spinning" />
                  <span>Sending Email...</span>
                </>
              ) : (
                <>
                  <FiMail className="icon" />
                  <span>Email me the quotation</span>
                </>
              )}
            </button>

            {emailError && (
              <div className="auth-error" style={{ marginTop: '1rem' }}>
                {emailError}
              </div>
            )}

            {emailResponse && (
              <div
                style={{
                  marginTop: '1rem',
                  padding: '0.75rem 1rem',
                  borderRadius: '0.5rem',
                  background: 'rgba(34, 197, 94, 0.1)',
                  border: '1px solid rgba(34, 197, 94, 0.3)',
                  color: '#16a34a',
                }}
              >
                {emailResponse}
              </div>
            )}
          </div>
        </motion.div>
      </section>
    </div>
  )
}

export default QuotationGeneratorPage
