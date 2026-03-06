import { getAvailabilityPrices } from '../../data/mockData'

function Prices({ propertyId }) {
  const prices = getAvailabilityPrices(propertyId)

  return (
    <div className="section-card">
      <div className="section-card-header">Prices</div>
      <div className="data-table-wrap">
        <table className="data-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Price</th>
              <th>Currency</th>
            </tr>
          </thead>
          <tbody>
            {prices.map((row) => (
              <tr key={row.date}>
                <td>{row.date}</td>
                <td>{row.price != null ? row.price.toLocaleString() : '—'}</td>
                <td>{row.currency}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Prices
