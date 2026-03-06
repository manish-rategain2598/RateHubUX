import { useState } from 'react'
import { getTaxes } from '../../data/mockData'

function Taxes({ propertyId }) {
  const [taxes, setTaxes] = useState(() => getTaxes(propertyId))
  const [showTaxForm, setShowTaxForm] = useState(false)
  const [taxForm, setTaxForm] = useState({ name: '', rate: '', type: 'Percentage', included: false })

  const handleAddTax = (e) => {
    e.preventDefault()
    if (!taxForm.name || !taxForm.rate) return
    setTaxes((prev) => [
      ...prev,
      {
        id: `t-${Date.now()}`,
        name: taxForm.name,
        rate: taxForm.rate,
        type: taxForm.type,
        included: taxForm.included,
      },
    ])
    setTaxForm({ name: '', rate: '', type: 'Percentage', included: false })
    setShowTaxForm(false)
  }

  return (
    <div className="section-card">
      <div className="section-card-header">
        <span>Taxes</span>
        <button type="button" className="btn-primary" onClick={() => setShowTaxForm(true)}>
          Add new tax
        </button>
      </div>
      {showTaxForm && (
        <div style={{ padding: 20, borderBottom: '1px solid var(--border-light)' }}>
          <form onSubmit={handleAddTax}>
            <div className="form-row">
              <div className="form-group">
                <label>Tax name</label>
                <input
                  value={taxForm.name}
                  onChange={(e) => setTaxForm((f) => ({ ...f, name: e.target.value }))}
                  placeholder="e.g. VAT"
                  required
                />
              </div>
              <div className="form-group">
                <label>Rate</label>
                <input
                  value={taxForm.rate}
                  onChange={(e) => setTaxForm((f) => ({ ...f, rate: e.target.value }))}
                  placeholder="e.g. 11% or Fixed 500"
                  required
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Type</label>
                <select
                  value={taxForm.type}
                  onChange={(e) => setTaxForm((f) => ({ ...f, type: e.target.value }))}
                >
                  <option value="Percentage">Percentage</option>
                  <option value="Fixed">Fixed</option>
                </select>
              </div>
              <div className="form-group" style={{ display: 'flex', alignItems: 'center', paddingTop: 24 }}>
                <label style={{ marginBottom: 0, marginRight: 8 }}>
                  <input
                    type="checkbox"
                    checked={taxForm.included}
                    onChange={(e) => setTaxForm((f) => ({ ...f, included: e.target.checked }))}
                  />
                  {' '}Included in price
                </label>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
              <button type="submit" className="btn-primary">Save</button>
              <button type="button" className="btn-secondary" onClick={() => setShowTaxForm(false)}>Cancel</button>
            </div>
          </form>
        </div>
      )}
      <div className="data-table-wrap">
        <table className="data-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Rate</th>
              <th>Type</th>
              <th>Included in price</th>
            </tr>
          </thead>
          <tbody>
            {taxes.length === 0 ? (
              <tr>
                <td colSpan={4} className="empty-state">
                  <p>No taxes configured.</p>
                  <button type="button" className="btn-primary" onClick={() => setShowTaxForm(true)}>Add new tax</button>
                </td>
              </tr>
            ) : (
              taxes.map((t) => (
                <tr key={t.id}>
                  <td>{t.name}</td>
                  <td>{t.rate}</td>
                  <td>{t.type}</td>
                  <td>{t.included ? 'Yes' : 'No'}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Taxes
