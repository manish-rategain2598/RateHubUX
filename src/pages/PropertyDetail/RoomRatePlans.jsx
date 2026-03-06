import { useState, useMemo, useEffect } from 'react'
import { getRoomTypes, getRatePlansList } from '../../data/mockData'

const ITEMS_PER_PAGE_OPTIONS = [10, 25, 50]

function RoomRatePlans({ propertyId }) {
  const [activeTab, setActiveTab] = useState('Rooms')
  const [roomsPerPage, setRoomsPerPage] = useState(10)
  const [plansPerPage, setPlansPerPage] = useState(10)
  const [roomsPage, setRoomsPage] = useState(1)
  const [plansPage, setPlansPage] = useState(1)
  const [showAddForm, setShowAddForm] = useState(false)
  const [addFormType, setAddFormType] = useState('room') // 'room' | 'rateplan'
  const [roomTypes, setRoomTypes] = useState(() => getRoomTypes(propertyId))
  const [ratePlans, setRatePlans] = useState(() => getRatePlansList(propertyId))

  useEffect(() => {
    setRoomTypes(getRoomTypes(propertyId))
    setRatePlans(getRatePlansList(propertyId))
  }, [propertyId])

  const addFormInitial = {
    room: { name: '', description: '', capacity: '', ratePlans: 'All rate plans' },
    rateplan: { name: '', description: '', refundable: 'Yes, until 1 day before check in at 12:00 AM', roomTypes: '' },
  }
  const [addForm, setAddForm] = useState(addFormInitial.room)

  const roomsTotal = roomTypes.length
  const roomsTotalPages = Math.ceil(roomsTotal / roomsPerPage) || 1
  const roomsStart = (roomsPage - 1) * roomsPerPage
  const roomsPaginated = roomTypes.slice(roomsStart, roomsStart + roomsPerPage)

  const plansTotal = ratePlans.length
  const handleOpenAddForm = (type) => {
    setAddFormType(type)
    setAddForm(type === 'room' ? addFormInitial.room : addFormInitial.rateplan)
    setShowAddForm(true)
  }
  const handleAddRoom = (e) => {
    e.preventDefault()
    if (!addForm.name.trim()) return
    const nextId = Math.max(0, ...roomTypes.map((r) => r.roomTypeId)) + 1
    setRoomTypes((prev) => [
      ...prev,
      {
        roomTypeId: nextId,
        name: addForm.name.trim(),
        description: addForm.description ? `<p>${addForm.description}</p>` : '',
        capacity: addForm.capacity || '—',
        ratePlans: addForm.ratePlans || 'All rate plans',
        hasPhoto: false,
      },
    ])
    setAddForm(addFormInitial.room)
    setShowAddForm(false)
  }
  const handleAddRatePlan = (e) => {
    e.preventDefault()
    if (!addForm.name.trim()) return
    const nextId = Math.max(0, ...ratePlans.map((r) => r.ratePlanId)) + 1
    setRatePlans((prev) => [
      ...prev,
      {
        ratePlanId: nextId,
        name: addForm.name.trim(),
        description: addForm.description ? `<p>${addForm.description}</p>` : '',
        refundable: addForm.refundable || '—',
        roomTypes: addForm.roomTypes || '—',
      },
    ])
    setAddForm(addFormInitial.rateplan)
    setShowAddForm(false)
  }
  const plansTotalPages = Math.ceil(plansTotal / plansPerPage) || 1
  const plansStart = (plansPage - 1) * plansPerPage
  const plansPaginated = ratePlans.slice(plansStart, plansStart + plansPerPage)

  return (
    <>
      <div className="section-card add-room-rateplan-card">
        <div className="section-card-header">
          <span>Add new Room & Rate Plan</span>
          <button type="button" className="btn-primary" onClick={() => handleOpenAddForm('room')}>
            Add new Room & Rate Plan
          </button>
        </div>
        {showAddForm ? (
          <div className="add-form-wrap">
            <div className="add-form-tabs">
              <button type="button" className={addFormType === 'room' ? 'active' : ''} onClick={() => { setAddFormType('room'); setAddForm(addFormInitial.room) }}>Add Room type</button>
              <button type="button" className={addFormType === 'rateplan' ? 'active' : ''} onClick={() => { setAddFormType('rateplan'); setAddForm(addFormInitial.rateplan) }}>Add Rate plan</button>
            </div>
            {addFormType === 'room' ? (
              <form onSubmit={handleAddRoom} className="add-form">
                <div className="form-row">
                  <div className="form-group">
                    <label>Name(s)</label>
                    <input value={addForm.name} onChange={(e) => setAddForm((f) => ({ ...f, name: e.target.value }))} placeholder="e.g. Double Room" required />
                  </div>
                  <div className="form-group">
                    <label>Capacity</label>
                    <input type="number" min="0" value={addForm.capacity} onChange={(e) => setAddForm((f) => ({ ...f, capacity: e.target.value }))} placeholder="e.g. 2" />
                  </div>
                </div>
                <div className="form-group">
                  <label>Description(s)</label>
                  <textarea value={addForm.description} onChange={(e) => setAddForm((f) => ({ ...f, description: e.target.value }))} placeholder="Optional description" rows={2} />
                </div>
                <div className="form-actions">
                  <button type="submit" className="btn-primary">Save</button>
                  <button type="button" className="btn-secondary" onClick={() => setShowAddForm(false)}>Cancel</button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleAddRatePlan} className="add-form">
                <div className="form-group">
                  <label>Name(s)</label>
                  <input value={addForm.name} onChange={(e) => setAddForm((f) => ({ ...f, name: e.target.value }))} placeholder="e.g. BOOKING Double Room Standard Rate" required />
                </div>
                <div className="form-group">
                  <label>Description(s)</label>
                  <textarea value={addForm.description} onChange={(e) => setAddForm((f) => ({ ...f, description: e.target.value }))} placeholder="Optional" rows={2} />
                </div>
                <div className="form-group">
                  <label>Refundable</label>
                  <input value={addForm.refundable} onChange={(e) => setAddForm((f) => ({ ...f, refundable: e.target.value }))} placeholder="e.g. Yes, until 1 day before check in" />
                </div>
                <div className="form-group">
                  <label>Room types</label>
                  <input value={addForm.roomTypes} onChange={(e) => setAddForm((f) => ({ ...f, roomTypes: e.target.value }))} placeholder="e.g. Double Room (ID: 163100)" />
                </div>
                <div className="form-actions">
                  <button type="submit" className="btn-primary">Save</button>
                  <button type="button" className="btn-secondary" onClick={() => setShowAddForm(false)}>Cancel</button>
                </div>
              </form>
            )}
          </div>
        ) : (
          <p style={{ padding: 20, margin: 0, color: 'var(--text-secondary)', fontSize: 14 }}>
            Click the button above to add a new room type or rate plan for this property.
          </p>
        )}
      </div>

      <div className="room-rateplans-tabs">
        <button
          type="button"
          className={`room-rateplans-tab ${activeTab === 'Rooms' ? 'active' : ''}`}
          onClick={() => setActiveTab('Rooms')}
        >
          Rooms
        </button>
        <button
          type="button"
          className={`room-rateplans-tab ${activeTab === 'Rate plans' ? 'active' : ''}`}
          onClick={() => setActiveTab('Rate plans')}
        >
          Rate plans
        </button>
      </div>

      {activeTab === 'Rooms' && (
        <div className="section-card">
          <div className="section-card-header availability-section-header">
            <span />
            <button type="button" className="kebab-menu" aria-label="Options">
              <KebabIcon />
            </button>
          </div>
          <div className="data-table-wrap">
            <table className="data-table room-rateplans-table">
              <thead>
                <tr>
                  <th className="col-photos">Photos</th>
                  <th>Room type ID</th>
                  <th>Name(s)</th>
                  <th>Description(s)</th>
                  <th>Capacity</th>
                  <th>Rate plans</th>
                </tr>
              </thead>
              <tbody>
                {roomsPaginated.map((row) => (
                  <tr key={row.roomTypeId}>
                    <td className="col-photos">
                      {row.hasPhoto ? (
                        <div className="room-thumb" aria-hidden>
                          <div className="room-thumb-placeholder" />
                        </div>
                      ) : (
                        <span className="no-photo">—</span>
                      )}
                    </td>
                    <td>
                      <a href="#" className="id-link">{row.roomTypeId}</a>
                    </td>
                    <td>{row.name || '—'}</td>
                    <td className="col-description">
                      {row.description ? <span dangerouslySetInnerHTML={{ __html: row.description }} /> : '—'}
                    </td>
                    <td>{row.capacity}</td>
                    <td>{row.ratePlans}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="availability-pagination">
            <span className="pagination-label">
              Items per page:{' '}
              <select
                value={roomsPerPage}
                onChange={(e) => { setRoomsPerPage(Number(e.target.value)); setRoomsPage(1) }}
                className="pagination-select"
              >
                {ITEMS_PER_PAGE_OPTIONS.map((n) => (
                  <option key={n} value={n}>{n}</option>
                ))}
              </select>
            </span>
            <span className="pagination-range">
              {roomsStart + 1} - {Math.min(roomsStart + roomsPerPage, roomsTotal)} of {roomsTotal}
            </span>
            <span className="pagination-arrows">
              <button type="button" className="pagination-arrow" disabled={roomsPage <= 1} onClick={() => setRoomsPage((p) => p - 1)} aria-label="Previous">‹</button>
              <button type="button" className="pagination-arrow" disabled={roomsPage >= roomsTotalPages} onClick={() => setRoomsPage((p) => p + 1)} aria-label="Next">›</button>
            </span>
          </div>
        </div>
      )}

      {activeTab === 'Rate plans' && (
        <div className="section-card">
          <div className="section-card-header availability-section-header">
            <span />
            <button type="button" className="kebab-menu" aria-label="Options">
              <KebabIcon />
            </button>
          </div>
          <div className="data-table-wrap">
            <table className="data-table room-rateplans-table">
              <thead>
                <tr>
                  <th>Name(s)</th>
                  <th>Rate plan ID</th>
                  <th>Description(s)</th>
                  <th>Refundable</th>
                  <th>Room types</th>
                </tr>
              </thead>
              <tbody>
                {plansPaginated.map((row) => (
                  <tr key={row.ratePlanId}>
                    <td>{row.name || '—'}</td>
                    <td>
                      <a href="#" className="id-link">{row.ratePlanId}</a>
                    </td>
                    <td className="col-description">
                      {row.description ? <span dangerouslySetInnerHTML={{ __html: row.description }} /> : '—'}
                    </td>
                    <td>{row.refundable || '—'}</td>
                    <td>{row.roomTypes || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="availability-pagination">
            <span className="pagination-label">
              Items per page:{' '}
              <select
                value={plansPerPage}
                onChange={(e) => { setPlansPerPage(Number(e.target.value)); setPlansPage(1) }}
                className="pagination-select"
              >
                {ITEMS_PER_PAGE_OPTIONS.map((n) => (
                  <option key={n} value={n}>{n}</option>
                ))}
              </select>
            </span>
            <span className="pagination-range">
              {plansStart + 1} - {Math.min(plansStart + plansPerPage, plansTotal)} of {plansTotal}
            </span>
            <span className="pagination-arrows">
              <button type="button" className="pagination-arrow" disabled={plansPage <= 1} onClick={() => setPlansPage((p) => p - 1)} aria-label="Previous">‹</button>
              <button type="button" className="pagination-arrow" disabled={plansPage >= plansTotalPages} onClick={() => setPlansPage((p) => p + 1)} aria-label="Next">›</button>
            </span>
          </div>
        </div>
      )}
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

export default RoomRatePlans
