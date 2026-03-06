import { Link, useParams } from 'react-router-dom'
import { suppliers, getPropertiesBySupplier } from '../data/mockData'
import { useState } from 'react'

function PropertiesList() {
  const { supplierId } = useParams()
  const supplier = suppliers.find((s) => s.id === supplierId)
  const properties = getPropertiesBySupplier(supplierId) || []
  const [sortBy, setSortBy] = useState('matchStatus')
  const [sortAsc, setSortAsc] = useState(true)

  const sorted = [...properties].sort((a, b) => {
    const aVal = a[sortBy]
    const bVal = b[sortBy]
    if (typeof aVal === 'string' && typeof bVal === 'string') return sortAsc ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal)
    if (typeof aVal === 'number' && typeof bVal === 'number') return sortAsc ? aVal - bVal : bVal - aVal
    return 0
  })

  const toggleSort = (col) => {
    if (sortBy === col) setSortAsc((p) => !p)
    else setSortBy(col)
  }

  return (
    <>
      <div className="breadcrumb">
        <Link to="/">Suppliers</Link>
        <span>›</span>
        <span>{supplier?.name || 'Properties'}</span>
      </div>
      <h1 className="page-title">Properties</h1>
      <div className="data-table-wrap">
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Price coverage</th>
              <th
                className="sortable"
                onClick={() => toggleSort('matchStatus')}
              >
                Match status
                <span className="sort-icon">{sortAsc ? '↑' : '↓'}</span>
              </th>
              <th>Match issues</th>
              <th>Location</th>
              <th>Live on Google</th>
              <th>URL</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((p) => (
              <tr key={p.id}>
                <td>
                  <Link
                    to={`/supplier/${supplierId}/property/${p.id}`}
                    className="id-link"
                  >
                    {p.id}
                  </Link>
                </td>
                <td>{p.name}</td>
                <td>{p.priceCoverage}</td>
                <td>
                  <div>
                    <span>{p.matchStatus}</span>
                    <br />
                    <Link
                      to={`/supplier/${supplierId}/property/${p.id}`}
                      className="action-link"
                    >
                      {p.matchStatus === 'Matched' ? 'Unmatch' : 'Match'}
                    </Link>
                  </div>
                </td>
                <td>—</td>
                <td>{p.location}</td>
                <td>
                  {p.liveOnGoogle ? (
                    <span className="status-yes">
                      <CheckIcon /> Yes
                    </span>
                  ) : (
                    <span className="status-no">
                      <NoIcon /> No
                    </span>
                  )}
                </td>
                <td>
                  <a href="#" className="action-link">URL</a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}

function CheckIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
    </svg>
  )
}

function NoIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
    </svg>
  )
}

export default PropertiesList
