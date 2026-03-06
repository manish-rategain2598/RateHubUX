import { Link, useParams, NavLink, Routes, Route, Navigate } from 'react-router-dom'
import { suppliers, getPropertyDetails } from '../data/mockData'
import RoomRatePlans from './PropertyDetail/RoomRatePlans'
import Availability from './PropertyDetail/Availability'
import Inventory from './PropertyDetail/Inventory'
import Prices from './PropertyDetail/Prices'
import Taxes from './PropertyDetail/Taxes'
import Promotion from './PropertyDetail/Promotion'

function PropertyDetail() {
  const { supplierId, propertyId } = useParams()
  const supplier = suppliers.find((s) => s.id === supplierId)
  const property = getPropertyDetails(propertyId)

  if (!property) {
    return (
      <div className="content-body">
        <p>Property not found.</p>
        <Link to={`/supplier/${supplierId}/properties`}>← Back to properties</Link>
      </div>
    )
  }

  const base = `/supplier/${supplierId}/property/${propertyId}`

  return (
    <>
      <div className="breadcrumb">
        <Link to="/">Suppliers</Link>
        <span>›</span>
        <Link to={`/supplier/${supplierId}/properties`}>{supplier?.name}</Link>
        <span>›</span>
        <span>{property.name}</span>
      </div>
      <h1 className="page-title">{property.name}</h1>

      <div className="detail-tabs">
        <NavLink to={base} end className={({ isActive }) => `detail-tab ${isActive ? 'active' : ''}`}>
          Details
        </NavLink>
        <NavLink to={`${base}/room-rate-plans`} className={({ isActive }) => `detail-tab ${isActive ? 'active' : ''}`}>
          Room & Rate Plans
        </NavLink>
        <NavLink to={`${base}/availability`} className={({ isActive }) => `detail-tab ${isActive ? 'active' : ''}`}>
          Availability
        </NavLink>
        <NavLink to={`${base}/inventory`} className={({ isActive }) => `detail-tab ${isActive ? 'active' : ''}`}>
          Inventory
        </NavLink>
        <NavLink to={`${base}/prices`} className={({ isActive }) => `detail-tab ${isActive ? 'active' : ''}`}>
          Prices
        </NavLink>
        <NavLink to={`${base}/taxes`} className={({ isActive }) => `detail-tab ${isActive ? 'active' : ''}`}>
          Taxes
        </NavLink>
        <NavLink to={`${base}/promotion`} className={({ isActive }) => `detail-tab ${isActive ? 'active' : ''}`}>
          Promotion
        </NavLink>
      </div>

      <Routes>
        <Route index element={<PropertyOverview property={property} />} />
        <Route path="room-rate-plans" element={<RoomRatePlans propertyId={propertyId} />} />
        <Route path="availability" element={<Availability propertyId={propertyId} />} />
        <Route path="inventory" element={<Inventory propertyId={propertyId} />} />
        <Route path="prices" element={<Prices propertyId={propertyId} />} />
        <Route path="taxes" element={<Taxes propertyId={propertyId} />} />
        <Route path="promotion" element={<Promotion propertyId={propertyId} />} />
        <Route path="availability-prices-tax" element={<Navigate to={`/supplier/${supplierId}/property/${propertyId}/availability`} replace />} />
      </Routes>
    </>
  )
}

function PropertyOverview({ property }) {
  return (
    <div className="section-card">
      <div className="section-card-header">Property details</div>
      <div style={{ padding: 20 }}>
        <div className="form-row">
          <div className="form-group">
            <label>Property ID</label>
            <div>{property.id}</div>
          </div>
          <div className="form-group">
            <label>Name</label>
            <div>{property.name}</div>
          </div>
        </div>
        <div className="form-group">
          <label>Address</label>
          <div>{property.address}</div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>Country</label>
            <div>{property.country}</div>
          </div>
          <div className="form-group">
            <label>Currency</label>
            <div>{property.currency}</div>
          </div>
          <div className="form-group">
            <label>Timezone</label>
            <div>{property.timezone}</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PropertyDetail
