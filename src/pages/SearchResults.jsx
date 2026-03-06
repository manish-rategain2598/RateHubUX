import { Link, useSearchParams } from 'react-router-dom'
import { searchProperties } from '../data/mockData'

function SearchResults() {
  const [searchParams] = useSearchParams()
  const q = searchParams.get('q') || ''
  const results = searchProperties(q)

  return (
    <>
      <h1 className="page-title">Search results {q && `for "${q}"`}</h1>
      <div className="data-table-wrap">
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Supplier</th>
              <th>Price coverage</th>
              <th>Match status</th>
              <th>Location</th>
              <th>Live on Google</th>
            </tr>
          </thead>
          <tbody>
            {results.length === 0 ? (
              <tr>
                <td colSpan={7} className="empty-state">
                  <p>No properties found.</p>
                  <p>Try a different search term (property name, ID, or location).</p>
                </td>
              </tr>
            ) : (
              results.map((p) => (
                <tr key={`${p.supplierId}-${p.id}`}>
                  <td>
                    <Link
                      to={`/supplier/${p.supplierId}/property/${p.id}`}
                      className="id-link"
                    >
                      {p.id}
                    </Link>
                  </td>
                  <td>{p.name}</td>
                  <td>{p.supplierName}</td>
                  <td>{p.priceCoverage}</td>
                  <td>{p.matchStatus}</td>
                  <td>{p.location}</td>
                  <td>
                    {p.liveOnGoogle ? (
                      <span className="status-yes">Yes</span>
                    ) : (
                      <span className="status-no">No</span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </>
  )
}

export default SearchResults
