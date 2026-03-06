import { Link } from 'react-router-dom'
import { suppliers } from '../data/mockData'

function SuppliersList() {
  return (
    <>
      <h1 className="page-title">Suppliers / IBE providers</h1>
      <div className="data-table-wrap">
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Properties</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {suppliers.map((s) => (
              <tr key={s.id}>
                <td>
                  <Link to={`/supplier/${s.id}/properties`} className="id-link">
                    {s.id}
                  </Link>
                </td>
                <td>{s.name}</td>
                <td>{s.propertyCount}</td>
                <td>
                  <Link to={`/supplier/${s.id}/properties`} className="action-link">
                    View properties
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}

export default SuppliersList
