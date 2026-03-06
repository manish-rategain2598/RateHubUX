import { useState, useRef, useEffect } from 'react'

const OPERATORS = [
  { id: '=', label: '=' },
  { id: 'any_of', label: 'any of' },
  { id: 'contains', label: 'contains' },
]

export function applyTableFilters(rows, filters, getCellValue) {
  if (!filters || filters.length === 0) return rows
  return rows.filter((row) =>
    filters.every((f) => {
      const cell = getCellValue(row, f.columnId)
      const cellStr = cell != null ? String(cell) : ''
      const val = (f.value || '').trim()
      if (f.operator === '=') return cellStr === val
      if (f.operator === 'any_of') {
        const list = val.split(',').map((s) => s.trim()).filter(Boolean)
        return list.length ? list.some((v) => cellStr === v) : false
      }
      if (f.operator === 'contains') return cellStr.toLowerCase().includes(val.toLowerCase())
      return true
    })
  )
}

function FilterIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className="filter-bar-icon">
      <path d="M10 18h4v-2h-4v2zM3 6v2h18V6H3zm3 7h12v-2H6v2z" />
    </svg>
  )
}

function FilterBar({ columns, filters, onFiltersChange }) {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [selectedColumnId, setSelectedColumnId] = useState('')
  const [operator, setOperator] = useState('=')
  const [value, setValue] = useState('')
  const [operatorOpen, setOperatorOpen] = useState(false)
  const dialogRef = useRef(null)
  const operatorRef = useRef(null)

  const selectedColumn = columns.find((c) => c.id === selectedColumnId)
  const canApply = selectedColumnId && value.trim().length > 0

  useEffect(() => {
    if (!dialogOpen) return
    const handleClickOutside = (e) => {
      if (
        dialogRef.current && !dialogRef.current.contains(e.target) &&
        operatorRef.current && !operatorRef.current.contains(e.target)
      ) {
        setDialogOpen(false)
        setOperatorOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [dialogOpen])

  const handleApply = () => {
    if (!canApply || !selectedColumn) return
    onFiltersChange([
      ...filters,
      {
        id: `f-${Date.now()}`,
        columnId: selectedColumnId,
        columnLabel: selectedColumn.label,
        operator,
        value: value.trim(),
      },
    ])
    setValue('')
    setSelectedColumnId('')
    setOperator('=')
    setDialogOpen(false)
  }

  const handleRemove = (filterId) => {
    onFiltersChange(filters.filter((f) => f.id !== filterId))
  }

  const formatFilterLabel = (f) => {
    const op = OPERATORS.find((o) => o.id === f.operator)?.label || f.operator
    return `${f.columnLabel} ${op} ${f.value}`
  }

  return (
    <div className="filter-bar">
      <FilterIcon />
      <div className="filter-pills">
        {filters.map((f) => (
          <span key={f.id} className="filter-pill">
            {formatFilterLabel(f)}
            <button
              type="button"
              className="filter-pill-remove"
              onClick={() => handleRemove(f.id)}
              aria-label={`Remove filter ${formatFilterLabel(f)}`}
            >
              ×
            </button>
          </span>
        ))}
      </div>
      <div className="filter-add-wrap" ref={dialogRef}>
        <button
          type="button"
          className="filter-add-btn"
          onClick={() => setDialogOpen((o) => !o)}
          aria-expanded={dialogOpen}
        >
          Add a filter
        </button>
        {dialogOpen && (
          <div className="filter-dialog">
            <div className="filter-dialog-header">
              {selectedColumn ? selectedColumn.label : 'Select column'}
            </div>
            <div className="filter-dialog-body">
              <div className="form-group">
                <label>Column</label>
                <select
                  value={selectedColumnId}
                  onChange={(e) => setSelectedColumnId(e.target.value)}
                  className="filter-dialog-select"
                >
                  <option value="">Select column</option>
                  {columns.map((c) => (
                    <option key={c.id} value={c.id}>{c.label}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Operator</label>
                <div className="filter-operator-wrap" ref={operatorRef}>
                  <button
                    type="button"
                    className="filter-operator-btn"
                    onClick={() => setOperatorOpen((o) => !o)}
                  >
                    {OPERATORS.find((o) => o.id === operator)?.label || operator}
                    <span className="filter-operator-arrow">▼</span>
                  </button>
                  {operatorOpen && (
                    <ul className="filter-operator-dropdown">
                      {OPERATORS.map((o) => (
                        <li key={o.id}>
                          <button
                            type="button"
                            className={operator === o.id ? 'active' : ''}
                            onClick={() => { setOperator(o.id); setOperatorOpen(false) }}
                          >
                            {operator === o.id && '✓ '}{o.label}
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
              <div className="form-group">
                <label>Value</label>
                <input
                  type="text"
                  className="filter-dialog-input"
                  placeholder={selectedColumn ? `${selectedColumn.label} value` : 'Enter value'}
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleApply()}
                />
              </div>
            </div>
            <div className="filter-dialog-footer">
              <button type="button" className="filter-dialog-cancel" onClick={() => setDialogOpen(false)}>
                Cancel
              </button>
              <button
                type="button"
                className="filter-dialog-apply"
                disabled={!canApply}
                onClick={handleApply}
              >
                Apply
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default FilterBar
