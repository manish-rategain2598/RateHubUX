import { getInventory } from '../../data/mockData'

function Inventory({ propertyId }) {
  const inventory = getInventory(propertyId)

  return (
    <div className="section-card">
      <div className="section-card-header">Inventory</div>
      <div className="data-table-wrap">
        <table className="data-table">
          <thead>
            <tr>
              <th>Room type</th>
              <th>Rate plan</th>
              <th>Total</th>
              <th>Sold</th>
              <th>Available</th>
            </tr>
          </thead>
          <tbody>
            {inventory.map((row, i) => (
              <tr key={`${row.roomType}-${row.ratePlan}-${i}`}>
                <td>{row.roomType}</td>
                <td>{row.ratePlan}</td>
                <td>{row.total}</td>
                <td>{row.sold}</td>
                <td>{row.available}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Inventory
