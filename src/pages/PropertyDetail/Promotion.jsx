import { useState, useMemo, useEffect } from 'react'
import { getPromotions } from '../../data/mockData'

const ITEMS_PER_PAGE_OPTIONS = [10, 25, 50]
const DISCOUNT_TYPES = ['Percentage', 'Fixed amount']

const initialForm = {
  discountType: 'Percentage',
  discount: '',
  roomTypes: '',
  ratePlans: '',
  devices: '',
  countriesIncluded: '',
  countriesExcluded: '',
}

function Promotion({ propertyId }) {
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [currentPage, setCurrentPage] = useState(1)
  const [promotions, setPromotions] = useState(() => getPromotions(propertyId))
  const [showAddForm, setShowAddForm] = useState(false)
  const [form, setForm] = useState(initialForm)

  useEffect(() => {
    setPromotions(getPromotions(propertyId))
  }, [propertyId])

  const total = promotions.length
  const totalPages = Math.ceil(total / itemsPerPage) || 1
  const pageStart = (currentPage - 1) * itemsPerPage
  const paginated = promotions.slice(pageStart, pageStart + itemsPerPage)

  const handleAddPromotion = (e) => {
    e.preventDefault()
    if (!form.discount.trim()) return
    const nextNum = String(promotions.length + 1).padStart(3, '0')
    const newPromo = {
      id: `PROMO-${nextNum}`,
      discountType: form.discountType,
      discount: form.discount.trim(),
      roomTypes: form.roomTypes.trim() || '—',
      ratePlans: form.ratePlans.trim() || '—',
      devices: form.devices.trim() || '—',
      countriesIncluded: form.countriesIncluded.trim() || '—',
      countriesExcluded: form.countriesExcluded.trim() || '—',
    }
    setPromotions((prev) => [...prev, newPromo])
    setForm(initialForm)
    setShowAddForm(false)
    setCurrentPage(Math.ceil((promotions.length + 1) / itemsPerPage))
  }

  return (
    <>
      <div className="section-card add-promotion-card">
        <div className="section-card-header">
          <span>Add new promotion</span>
          <button type="button" className="btn-primary" onClick={() => setShowAddForm(true)}>
            Add new promotion
          </button>
        </div>
        {showAddForm ? (
          <div className="add-form-wrap">
            <form onSubmit={handleAddPromotion} className="add-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Discount type</label>
                  <select
                    value={form.discountType}
                    onChange={(e) => setForm((f) => ({ ...f, discountType: e.target.value }))}
                  >
                    {DISCOUNT_TYPES.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Discount</label>
                  <input
                    value={form.discount}
                    onChange={(e) => setForm((f) => ({ ...f, discount: e.target.value }))}
                    placeholder={form.discountType === 'Percentage' ? 'e.g. 15%' : 'e.g. 2,500 ISK'}
                    required
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Room types</label>
                  <input
                    value={form.roomTypes}
                    onChange={(e) => setForm((f) => ({ ...f, roomTypes: e.target.value }))}
                    placeholder="e.g. Double Room, Triple Room"
                  />
                </div>
                <div className="form-group">
                  <label>Rate plans</label>
                  <input
                    value={form.ratePlans}
                    onChange={(e) => setForm((f) => ({ ...f, ratePlans: e.target.value }))}
                    placeholder="e.g. Standard Rate, Non-Refundable"
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Devices</label>
                  <input
                    value={form.devices}
                    onChange={(e) => setForm((f) => ({ ...f, devices: e.target.value }))}
                    placeholder="e.g. Desktop, Mobile or All"
                  />
                </div>
                <div className="form-group">
                  <label>Countries included</label>
                  <input
                    value={form.countriesIncluded}
                    onChange={(e) => setForm((f) => ({ ...f, countriesIncluded: e.target.value }))}
                    placeholder="e.g. IS, NO, SE or All"
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Countries excluded</label>
                <input
                  value={form.countriesExcluded}
                  onChange={(e) => setForm((f) => ({ ...f, countriesExcluded: e.target.value }))}
                  placeholder="e.g. country codes or —"
                />
              </div>
              <div className="form-actions">
                <button type="submit" className="btn-primary">Save</button>
                <button type="button" className="btn-secondary" onClick={() => { setShowAddForm(false); setForm(initialForm) }}>Cancel</button>
              </div>
            </form>
          </div>
        ) : (
          <p style={{ padding: 20, margin: 0, color: 'var(--text-secondary)', fontSize: 14 }}>
            Click the button above to add a new promotion for this property.
          </p>
        )}
      </div>

      <div className="section-card promotion-card" style={{ marginTop: 24 }}>
      <div className="section-card-header availability-section-header">
        <span />
        <button type="button" className="kebab-menu" aria-label="Options">
          <KebabIcon />
        </button>
      </div>
      <div className="data-table-wrap">
        <table className="data-table promotion-table">
          <thead>
            <tr>
              <th>Promotion ID</th>
              <th>Discount type</th>
              <th>
                Discount
                <span className="promotion-info-icon" title="Discount value or percentage applied">ⓘ</span>
              </th>
              <th>Room types</th>
              <th>Rate plans</th>
              <th>Devices</th>
              <th>Countries included</th>
              <th>Countries excluded</th>
            </tr>
          </thead>
          <tbody>
            {paginated.length === 0 ? (
              <tr>
                <td colSpan={8} className="promotion-empty-state">
                  <p>You haven&apos;t added any promotions yet.</p>
                  <a href="#">Learn more</a>
                </td>
              </tr>
            ) : (
              paginated.map((row) => (
                <tr key={row.id}>
                  <td><a href="#" className="id-link">{row.id}</a></td>
                  <td>{row.discountType}</td>
                  <td>{row.discount}</td>
                  <td>{row.roomTypes}</td>
                  <td>{row.ratePlans}</td>
                  <td>{row.devices}</td>
                  <td>{row.countriesIncluded}</td>
                  <td>{row.countriesExcluded}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <div className="availability-pagination">
        <span className="pagination-label">
          Items per page:{' '}
          <select
            value={itemsPerPage}
            onChange={(e) => { setItemsPerPage(Number(e.target.value)); setCurrentPage(1) }}
            className="pagination-select"
          >
            {ITEMS_PER_PAGE_OPTIONS.map((n) => (
              <option key={n} value={n}>{n}</option>
            ))}
          </select>
        </span>
        <span className="pagination-range">
          {total === 0 ? '0 of 0' : `${pageStart + 1} - ${Math.min(pageStart + itemsPerPage, total)} of ${total}`}
        </span>
        <span className="pagination-arrows">
          <button type="button" className="pagination-arrow" disabled={currentPage <= 1} onClick={() => setCurrentPage((p) => p - 1)} aria-label="Previous">‹</button>
          <button type="button" className="pagination-arrow" disabled={currentPage >= totalPages} onClick={() => setCurrentPage((p) => p + 1)} aria-label="Next">›</button>
        </span>
      </div>
    </div>
    </>
  )
}

function KebabIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
    </svg>
  )
}

export default Promotion
