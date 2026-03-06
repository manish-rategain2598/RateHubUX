import { useState, useMemo } from 'react'
import { getOverallAvailability, getDailyAvailability, getPropertyLevelAvailability } from '../../data/mockData'
import FilterBar, { applyTableFilters } from '../../components/FilterBar'

const ITEMS_PER_PAGE_OPTIONS = [10, 25, 50]
const DEFAULT_START = '2026-02-18'
const DEFAULT_END = '2026-03-03'

const OVERALL_COLUMNS = [
  { id: 'roomId', label: 'Room ID' },
  { id: 'ratePlanId', label: 'Rate plan ID' },
  { id: 'roomInventoryDays', label: 'Room inventory (days)' },
  { id: 'roomMapped', label: 'Room mapped' },
  { id: 'ratePlanMapped', label: 'Rate plan mapped' },
  { id: 'combinationAllowed', label: 'Room/rate plan combination allowed' },
  { id: 'openAvailabilityDays', label: 'Open availability (days)' },
  { id: 'occupancy1', label: 'Occupancy 1' },
  { id: 'occupancy2', label: 'Occupancy 2' },
  { id: 'occupancy3', label: 'Occupancy 3' },
  { id: 'occupancy4', label: 'Occupancy 4' },
  { id: 'occupancy5', label: 'Occupancy 5' },
  { id: 'occupancy6', label: 'Occupancy 6' },
  { id: 'occupancy7', label: 'Occupancy 7' },
  { id: 'occupancy8', label: 'Occupancy 8' },
  { id: 'occupancy9', label: 'Occupancy 9' },
  { id: 'occupancy10', label: 'Occupancy 10' },
  { id: 'childOccupancy', label: 'Child occupancy' },
]

function Availability({ propertyId }) {
  const [viewTab, setViewTab] = useState('Room')
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [currentPage, setCurrentPage] = useState(1)
  const [dateRangeStart, setDateRangeStart] = useState(DEFAULT_START)
  const [dateRangeEnd, setDateRangeEnd] = useState(DEFAULT_END)
  const [allExpanded, setAllExpanded] = useState(true)
  const [overallFilters, setOverallFilters] = useState([])
  const [dailyFilters, setDailyFilters] = useState([])

  const overallRowsRaw = useMemo(() => getOverallAvailability(), [])
  const { roomRows: roomRowsRaw, dateColumns } = useMemo(
    () => getDailyAvailability(dateRangeStart, dateRangeEnd),
    [dateRangeStart, dateRangeEnd]
  )

  const overallRows = useMemo(
    () => applyTableFilters(overallRowsRaw, overallFilters, (row, colId) => row[colId]),
    [overallRowsRaw, overallFilters]
  )

  const dailyColumns = useMemo(
    () => [
      { id: 'roomId', label: 'Room' },
      { id: 'ratePlan', label: 'Rate plan' },
      { id: 'occupancy', label: 'Occupancy' },
      ...dateColumns.map((col, i) => ({ id: `date_${i}`, label: col.label })),
    ],
    [dateColumns]
  )

  const getDailyCellValue = (row, colId) => {
    if (colId.startsWith('date_')) {
      const i = parseInt(colId.replace('date_', ''), 10)
      return row.dailyValues && row.dailyValues[i] != null ? String(row.dailyValues[i]) : ''
    }
    return row[colId] != null ? String(row[colId]) : ''
  }

  const roomRows = useMemo(
    () => applyTableFilters(roomRowsRaw, dailyFilters, getDailyCellValue),
    [roomRowsRaw, dailyFilters]
  )

  const totalItems = overallRows.length
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1
  const pageStart = (currentPage - 1) * itemsPerPage
  const paginatedRows = overallRows.slice(pageStart, pageStart + itemsPerPage)

  const propertyLevelData = useMemo(() => getPropertyLevelAvailability(), [])

  return (
    <div className="availability-page">
      <h2 className="availability-title">Overall availability</h2>

      <div className="availability-tabs">
        <button
          type="button"
          className={`availability-tab ${viewTab === 'Room' ? 'active' : ''}`}
          onClick={() => setViewTab('Room')}
        >
          Room
        </button>
        <button
          type="button"
          className={`availability-tab ${viewTab === 'Property' ? 'active' : ''}`}
          onClick={() => setViewTab('Property')}
        >
          Property
        </button>
      </div>

      {viewTab === 'Room' && (
        <>
      <div className="availability-filter-bar">
        <FilterBar
          columns={OVERALL_COLUMNS}
          filters={overallFilters}
          onFiltersChange={(f) => { setOverallFilters(f); setCurrentPage(1) }}
        />
      </div>

      {/* Upper table - Room and Rate Plan Overview */}
      <div className="section-card availability-section">
        <div className="section-card-header availability-section-header">
          <span />
          <button type="button" className="kebab-menu" aria-label="Options">
            <KebabIcon />
          </button>
        </div>
        <div className="data-table-wrap">
          <table className="data-table availability-table">
            <thead>
              <tr>
                <th>Room ID</th>
                <th>Rate plan ID</th>
                <th>Room inventory (days)</th>
                <th>Room mapped</th>
                <th>Rate plan mapped</th>
                <th>Room/rate plan combination allowed</th>
                <th>Open availability (days)</th>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
                  <th key={n}>Occupancy {n}</th>
                ))}
                <th>Child occupancy</th>
              </tr>
            </thead>
            <tbody>
              {paginatedRows.map((row) => (
                <tr key={row.roomId}>
                  <td>{row.roomId}</td>
                  <td>{row.ratePlanId}</td>
                  <td>{row.roomInventoryDays}</td>
                  <td>{row.roomMapped}</td>
                  <td>{row.ratePlanMapped}</td>
                  <td>{row.combinationAllowed}</td>
                  <td>{row.openAvailabilityDays}</td>
                  <td>{row.occupancy1}</td>
                  <td>{row.occupancy2}</td>
                  <td>{row.occupancy3}</td>
                  <td>{row.occupancy4}</td>
                  <td>{row.occupancy5}</td>
                  <td>{row.occupancy6}</td>
                  <td>{row.occupancy7}</td>
                  <td>{row.occupancy8}</td>
                  <td>{row.occupancy9}</td>
                  <td>{row.occupancy10}</td>
                  <td>{row.childOccupancy}</td>
                </tr>
              ))}
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
            {pageStart + 1}-{Math.min(pageStart + itemsPerPage, totalItems)} of {totalItems}
          </span>
          <span className="pagination-arrows">
            <button
              type="button"
              className="pagination-arrow"
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage((p) => p - 1)}
              aria-label="Previous page"
            >
              ‹
            </button>
            <button
              type="button"
              className="pagination-arrow"
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage((p) => p + 1)}
              aria-label="Next page"
            >
              ›
            </button>
          </span>
        </div>
      </div>

      {/* Lower section - Daily Availability */}
      <div className="availability-daily-section">
        <div className="availability-daily-toolbar">
          <FilterBar
            columns={dailyColumns}
            filters={dailyFilters}
            onFiltersChange={setDailyFilters}
          />
          <button
            type="button"
            className="btn-secondary"
            onClick={() => setAllExpanded((e) => !e)}
          >
            {allExpanded ? 'Collapse all' : 'Expand all'}
          </button>
          <div className="date-range-wrap">
            <label className="date-range-label">Enter a date range</label>
            <div className="date-range-inputs">
              <input
                type="date"
                value={dateRangeStart}
                onChange={(e) => setDateRangeStart(e.target.value)}
                className="date-input"
              />
              <span className="date-range-sep"> – </span>
              <input
                type="date"
                value={dateRangeEnd}
                onChange={(e) => setDateRangeEnd(e.target.value)}
                className="date-input"
              />
            </div>
          </div>
        </div>
        <div className="data-table-wrap">
          <table className="data-table availability-daily-table">
            <thead>
              <tr>
                <th className="col-room">Room</th>
                <th>Rate plan</th>
                <th>Occupancy</th>
                {dateColumns.map((col) => (
                  <th key={col.key}>{col.label}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {roomRows.map((row) => (
                <tr key={`${row.roomId}-${row.occupancy}`} className="daily-detail-row">
                  <td className="col-room">{row.roomId}</td>
                  <td>{row.ratePlan}</td>
                  <td>{row.occupancy}</td>
                  {row.dailyValues.map((val, i) => (
                    <td key={dateColumns[i]?.key || i}>{val}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
        </>
      )}

      {viewTab === 'Property' && (
        <div className="section-card availability-section property-level-card">
          <div className="section-card-header availability-section-header">
            <span />
            <button type="button" className="kebab-menu" aria-label="Options">
              <KebabIcon />
            </button>
          </div>
          <div className="data-table-wrap">
            <table className="data-table property-level-table">
              <thead>
                <tr>
                  <th>Total rooms</th>
                  <th>Room mapped</th>
                  <th>Total rate plans</th>
                  <th>Rate plan mapped</th>
                  <th>Open availability (days)</th>
                  <th colSpan={8} className="rates-days-header">Rates (days)</th>
                </tr>
                <tr>
                  <th />
                  <th />
                  <th />
                  <th />
                  <th />
                  <th>Occupancy 1</th>
                  <th>Occupancy 2</th>
                  <th>Occupancy 3</th>
                  <th>Occupancy 4</th>
                  <th>Occupancy 5</th>
                  <th>Occupancy 6</th>
                  <th>Occupancy 7</th>
                  <th>Occupancy 8</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{propertyLevelData.totalRooms}</td>
                  <td>{propertyLevelData.roomMapped}</td>
                  <td>{propertyLevelData.totalRatePlans}</td>
                  <td>{propertyLevelData.ratePlanMapped}</td>
                  <td>{propertyLevelData.openAvailabilityDays}</td>
                  <td>{propertyLevelData.occupancy1}</td>
                  <td>{propertyLevelData.occupancy2}</td>
                  <td>{propertyLevelData.occupancy3}</td>
                  <td>{propertyLevelData.occupancy4}</td>
                  <td>{propertyLevelData.occupancy5}</td>
                  <td>{propertyLevelData.occupancy6}</td>
                  <td>{propertyLevelData.occupancy7}</td>
                  <td>{propertyLevelData.occupancy8}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}

function KebabIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
    </svg>
  )
}

export default Availability
