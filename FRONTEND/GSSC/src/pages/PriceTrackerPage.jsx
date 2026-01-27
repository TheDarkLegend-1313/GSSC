import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { priceTrackerAPI } from '../services/api.js'
import { FiRefreshCw, FiChevronLeft, FiChevronRight } from 'react-icons/fi'

const FILTERS = [
  { value: 'solar_panel', label: 'Solar Panel' },
  { value: 'inverter', label: 'Inverter' },
  { value: 'battery', label: 'Battery' },
]

const ITEMS_PER_PAGE = 10

const PriceTrackerPage = () => {
  const [filter, setFilter] = useState('solar_panel')
  const [currentPage, setCurrentPage] = useState(1)
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [updateLoading, setUpdateLoading] = useState(false)
  const [updateResponse, setUpdateResponse] = useState(null)
  const [totalItems, setTotalItems] = useState(0)

  // Fetch data when filter or page changes
  useEffect(() => {
    fetchData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter, currentPage])

  const fetchData = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await priceTrackerAPI.getPrices(filter, currentPage)
      setData(response.results || response.data || response)
      // If backend returns total count, use it; otherwise estimate
      setTotalItems(response.count || response.total || (response.results?.length || 0))
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          err.response?.data?.message ||
          err.message ||
          'Failed to load price data. Please try again.'
      )
      setData([])
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateItems = async () => {
    setUpdateLoading(true)
    setUpdateResponse(null)
    try {
      const response = await priceTrackerAPI.updateItems()
      setUpdateResponse(response.message || response.detail || 'Items updated successfully!')
      
      // Show response for 3 seconds, then reload
      setTimeout(() => {
        window.location.reload()
      }, 3000)
    } catch (err) {
      setUpdateResponse(
        err.response?.data?.detail ||
          err.response?.data?.message ||
          err.message ||
          'Failed to update items.'
      )
      setUpdateLoading(false)
    }
  }

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter)
    setCurrentPage(1) // Reset to first page when filter changes
  }

  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE

  // Get table headers based on available data
  const getTableHeaders = () => {
    if (data.length === 0) return []
    return Object.keys(data[0]).filter(
      (key) => key !== 'id' && key !== '_id' // Exclude internal IDs
    )
  }

  const headers = data.length > 0 ? getTableHeaders() : []

  return (
    <div className="page page-with-hero">
      <section className="page-hero">
        <div className="page-hero-content">
          <h1>Price Tracker</h1>
          <p>
            Track solar hardware pricing across vendors. Filter by product type and browse through
            the latest market prices.
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
          <div className="price-tracker-header">
            <div>
              <h2>Market Prices</h2>
              <p className="panel-subtitle">
                Select a filter to view pricing data. Showing {data.length} of {totalItems} items.
              </p>
            </div>
            <div className="price-tracker-controls">
              <div className="filter-buttons">
                {FILTERS.map((f) => (
                  <button
                    key={f.value}
                    type="button"
                    className={`filter-btn ${filter === f.value ? 'active' : ''}`}
                    onClick={() => handleFilterChange(f.value)}
                    disabled={loading}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
              <button
                type="button"
                className="btn-primary update-btn"
                onClick={handleUpdateItems}
                disabled={updateLoading}
              >
                {updateLoading ? (
                  <>
                    <FiRefreshCw className="icon spinning" />
                    <span>Updating...</span>
                  </>
                ) : (
                  <>
                    <FiRefreshCw className="icon" />
                    <span>Update Items</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {updateResponse && (
            <div
              className="update-response"
              style={{
                marginBottom: '1rem',
                padding: '0.75rem 1rem',
                borderRadius: '0.8rem',
                background: 'rgba(34, 197, 94, 0.1)',
                border: '1px solid rgba(34, 197, 94, 0.3)',
                color: '#16a34a',
              }}
            >
              {updateResponse}
            </div>
          )}

          {error && (
            <div className="auth-error" style={{ marginBottom: '1rem' }}>
              {error}
            </div>
          )}

          {loading ? (
            <div className="loading-state">
              <p>Loading price data...</p>
            </div>
          ) : data.length === 0 ? (
            <div className="empty-state">
              <p>No data available for this filter.</p>
            </div>
          ) : (
            <>
              <div className="price-table-wrapper">
                <div className="price-table">
                  <div className="table-row table-head">
                    <span className="col-number">#</span>
                    {headers.map((header) => (
                      <span key={header} className={`col-${header}`}>
                        {header
                          .split('_')
                          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                          .join(' ')}
                      </span>
                    ))}
                  </div>
                  {data.map((item, index) => (
                    <div key={index} className="table-row">
                      <span className="col-number">{startIndex + index + 1}</span>
                      {headers.map((header) => (
                        <span key={header} className={`col-${header}`}>
                          {item[header] !== null && item[header] !== undefined
                            ? String(item[header])
                            : 'N/A'}
                        </span>
                      ))}
                    </div>
                  ))}
                </div>
              </div>

              {totalPages > 1 && (
                <div className="pagination">
                  <button
                    type="button"
                    className="pagination-btn"
                    onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                    disabled={currentPage === 1 || loading}
                  >
                    <FiChevronLeft className="icon" />
                    Previous
                  </button>
                  <span className="pagination-info">
                    Page {currentPage} of {totalPages}
                  </span>
                  <button
                    type="button"
                    className="pagination-btn"
                    onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages || loading}
                  >
                    Next
                    <FiChevronRight className="icon" />
                  </button>
                </div>
              )}
            </>
          )}
        </motion.div>
      </section>
    </div>
  )
}

export default PriceTrackerPage
