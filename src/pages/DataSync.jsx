import { useState } from 'react'

const REQUEST_TYPES = ['HOTEL_PROPERTIES_DATA', 'HOTEL_PROMOTION', 'HOTEL_RATE', 'HOTEL_TAXES', 'HOTEL_AVAIL', 'HOTEL_INV']
const DEMAND_PARTNERS = ['MICROSOFT', 'GOOGLE', 'TRV', 'TA']

function generateEchoToken() {
  const hex = (n) => Array.from({ length: n }, () => Math.floor(Math.random() * 16).toString(16)).join('')
  return 'MS_' + [hex(8), hex(4), hex(4), hex(4), hex(12)].join('-')
}

function DataSync() {
  const [hotelCodes, setHotelCodes] = useState('')
  const [source, setSource] = useState('')
  const [echoToken, setEchoToken] = useState('MS_e689876-9a64-4bf5-a89c-1d05a62444c6')
  const [startDate, setStartDate] = useState('2026-02-18')
  const [endDate, setEndDate] = useState('2026-03-20')
  const [requestTypes, setRequestTypes] = useState(() => REQUEST_TYPES.map(() => false))
  const [demandPartners, setDemandPartners] = useState(() => DEMAND_PARTNERS.map(() => false))
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const allRequestSelected = requestTypes.every(Boolean)
  const allDemandSelected = demandPartners.every(Boolean)

  const toggleRequestAll = () => {
    setRequestTypes(REQUEST_TYPES.map(() => !allRequestSelected))
  }
  const toggleDemandAll = () => {
    setDemandPartners(DEMAND_PARTNERS.map(() => !allDemandSelected))
  }
  const toggleRequest = (i) => {
    setRequestTypes((prev) => prev.map((v, j) => (j === i ? !v : v)))
  }
  const toggleDemand = (i) => {
    setDemandPartners((prev) => prev.map((v, j) => (j === i ? !v : v)))
  }

  const refreshEchoToken = () => {
    setEchoToken(generateEchoToken())
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // Placeholder: would call sync API
  }

  return (
    <div className="sync-page">
      <h1 className="sync-page-title">Ratehub ARI Manual Sync</h1>

      <form onSubmit={handleSubmit} className="sync-form section-card">
        <div className="sync-form-body">
          <div className="form-group">
            <label htmlFor="hotel-codes">Hotel Code(s) (Ratehub HotelCode) - Comma separated:</label>
            <input
              id="hotel-codes"
              type="text"
              value={hotelCodes}
              onChange={(e) => setHotelCodes(e.target.value)}
              placeholder="e.g., HOTEL1, HOTEL2, HOTEL3"
              className="sync-input"
            />
            <p className="form-hint">Enter multiple hotel codes separated by commas. Spaces around commas are automatically trimmed.</p>
          </div>

          <div className="form-group">
            <label htmlFor="source">Source (Who is Initiating):</label>
            <input
              id="source"
              type="text"
              value={source}
              onChange={(e) => setSource(e.target.value)}
              className="sync-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="echo-token">Echo Token:</label>
            <div className="input-with-action">
              <input
                id="echo-token"
                type="text"
                value={echoToken}
                onChange={(e) => setEchoToken(e.target.value)}
                className="sync-input"
              />
              <button type="button" className="sync-refresh-btn" onClick={refreshEchoToken} title="Generate new token">
                <RefreshIcon />
              </button>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="start-date">Start Date:</label>
              <div className="input-with-action">
                <input
                  id="start-date"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="sync-input"
                />
                <span className="sync-calendar-icon" aria-hidden><CalendarIcon /></span>
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="end-date">End Date:</label>
              <div className="input-with-action">
                <input
                  id="end-date"
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="sync-input"
                />
                <span className="sync-calendar-icon" aria-hidden><CalendarIcon /></span>
              </div>
            </div>
          </div>

          <div className="form-group">
            <label>Request Type:</label>
            <div className="checkbox-group">
              <label className="checkbox-label">
                <input type="checkbox" checked={allRequestSelected} onChange={toggleRequestAll} />
                Select All
              </label>
            </div>
            <div className="checkbox-grid">
              {REQUEST_TYPES.map((name, i) => (
                <label key={name} className="checkbox-label">
                  <input type="checkbox" checked={requestTypes[i]} onChange={() => toggleRequest(i)} />
                  {name}
                </label>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label>Demand Partners:</label>
            <div className="checkbox-group">
              <label className="checkbox-label">
                <input type="checkbox" checked={allDemandSelected} onChange={toggleDemandAll} />
                Select All
              </label>
            </div>
            <div className="checkbox-grid">
              {DEMAND_PARTNERS.map((name, i) => (
                <label key={name} className="checkbox-label">
                  <input type="checkbox" checked={demandPartners[i]} onChange={() => toggleDemand(i)} />
                  {name}
                </label>
              ))}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="username">Username:</label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="sync-input"
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">Password:</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="sync-input"
              />
            </div>
          </div>
        </div>

        <div className="sync-form-footer">
          <button type="submit" className="sync-submit-btn">Submit</button>
        </div>
      </form>
    </div>
  )
}

function RefreshIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 4V1L8 5l4 4V6c3.31 0 6 2.69 6 6 0 1.01-.25 1.97-.7 2.8l1.46 1.46C19.54 15.03 20 13.57 20 12c0-4.42-3.58-8-8-8zm0 14c-3.31 0-6-2.69-6-6 0-1.01.25-1.97.7-2.8L5.24 7.74C4.46 8.97 4 10.43 4 12c0 4.42 3.58 8 8 8v3l4-4-4-4v3z" />
    </svg>
  )
}

function CalendarIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V9h14v11z" />
    </svg>
  )
}

export default DataSync
