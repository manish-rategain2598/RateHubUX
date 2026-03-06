import { useLocation, useNavigate, useSearchParams, NavLink } from 'react-router-dom'
import { useState, useEffect, useRef } from 'react'
import { suppliers, searchProperties } from '../data/mockData'

// Derive supplierId from URL so dropdown shows correct selection (Layout is above Routes so useParams() isn't available)
function getSupplierIdFromPathname(pathname) {
  const match = pathname.match(/^\/supplier\/([^/]+)/)
  return match ? match[1] : null
}

function Layout({ children }) {
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [showSuggestions, setShowSuggestions] = useState(false)
  const suggestionsRef = useRef(null)
  const location = useLocation()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const supplierId = getSupplierIdFromPathname(location.pathname)
  const currentSupplier = suppliers.find((s) => s.id === supplierId)

  const suggestions = searchQuery.trim()
    ? searchProperties(searchQuery.trim()).slice(0, 8)
    : []

  useEffect(() => {
    if (location.pathname === '/search') {
      setSearchQuery(searchParams.get('q') || '')
    }
  }, [location.pathname, searchParams])

  const handleSearch = (e) => {
    e.preventDefault()
    setShowSuggestions(false)
    const q = searchQuery.trim()
    navigate(q ? `/search?q=${encodeURIComponent(q)}` : '/search')
  }

  const handleSuggestionClick = (property) => {
    setShowSuggestions(false)
    setSearchQuery(property.name)
    navigate(`/supplier/${property.supplierId}/property/${property.id}`)
  }

  const handleSearchBlur = () => {
    setTimeout(() => setShowSuggestions(false), 150)
  }

  const handleSelectAllSuppliers = () => {
    setDropdownOpen(false)
    navigate('/')
  }

  const handleSelectSupplier = (id) => {
    setDropdownOpen(false)
    navigate(`/supplier/${id}/properties`)
  }

  return (
    <>
      <aside className="sidebar">
        <div className="sidebar-dropdown" onClick={() => setDropdownOpen(!dropdownOpen)}>
          <span>{currentSupplier ? currentSupplier.name : 'All Suppliers / IBE providers'}</span>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path d="M7 10l5 5 5-5z" />
          </svg>
        </div>
        {dropdownOpen && (
          <div style={{ padding: '0 16px 16px' }}>
            <button
              type="button"
              className="nav-link"
              style={{ display: 'block', width: '100%', marginBottom: 4 }}
              onClick={handleSelectAllSuppliers}
            >
              All Suppliers
            </button>
            {suppliers.map((s) => (
              <button
                key={s.id}
                type="button"
                className="nav-link"
                style={{ display: 'block', width: '100%', marginBottom: 4 }}
                onClick={() => handleSelectSupplier(s.id)}
              >
                {s.name}
              </button>
            ))}
          </div>
        )}
        <nav className="sidebar-menu">
          <NavLink to="/schedule" className={({ isActive }) => `sidebar-menu-item ${isActive ? 'active' : ''}`}>
            <ScheduleIcon />
            <span>Schedule</span>
          </NavLink>
          <NavLink to="/data-sync" className={({ isActive }) => `sidebar-menu-item ${isActive ? 'active' : ''}`}>
            <DataSyncIcon />
            <span>Data Sync</span>
          </NavLink>
        </nav>
      </aside>
      <main className="main-content">
        <header className="content-header">
          <div className="search-wrap">
            <form className="search-form" onSubmit={handleSearch}>
              <input
                type="search"
                className="search-input"
                placeholder="Search property..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value)
                  setShowSuggestions(!!e.target.value.trim())
                }}
                onFocus={() => searchQuery.trim() && setShowSuggestions(true)}
                onBlur={handleSearchBlur}
                aria-label="Search property"
                aria-autocomplete="list"
                aria-expanded={showSuggestions && suggestions.length > 0}
              />
              <button type="submit" className="btn-primary search-btn">Search</button>
            </form>
            {showSuggestions && suggestions.length > 0 && (
              <ul className="search-suggestions" ref={suggestionsRef} role="listbox">
                {suggestions.map((p) => (
                  <li
                    key={`${p.supplierId}-${p.id}`}
                    role="option"
                    className="search-suggestion-item"
                    onMouseDown={(e) => { e.preventDefault(); handleSuggestionClick(p) }}
                  >
                    <span className="search-suggestion-name">{p.name}</span>
                    <span className="search-suggestion-meta">{p.supplierName} · {p.location}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <button type="button" className="kebab-menu" aria-label="More options">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
            </svg>
          </button>
        </header>
        <div className="content-body">{children}</div>
      </main>
    </>
  )
}

function ScheduleIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="sidebar-menu-icon">
      <path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V9h14v11zM9 11H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2z" />
    </svg>
  )
}

function DataSyncIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="sidebar-menu-icon">
      <path d="M12 4V1L8 5l4 4V6c3.31 0 6 2.69 6 6 0 1.01-.25 1.97-.7 2.8l1.46 1.46C19.54 15.03 20 13.57 20 12c0-4.42-3.58-8-8-8zm0 14c-3.31 0-6-2.69-6-6 0-1.01.25-1.97.7-2.8L5.24 7.74C4.46 8.97 4 10.43 4 12c0 4.42 3.58 8 8 8v3l4-4-4-4v3z" />
    </svg>
  )
}

export default Layout
