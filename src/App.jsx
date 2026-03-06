import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import SuppliersList from './pages/SuppliersList'
import PropertiesList from './pages/PropertiesList'
import PropertyDetail from './pages/PropertyDetail'
import SearchResults from './pages/SearchResults'
import Schedule from './pages/Schedule'
import DataSync from './pages/DataSync'
//
function App() {
  return (//
    <div className="app-layout">
      <Layout>
        <Routes>
          <Route path="/" element={<SuppliersList />} />
          <Route path="/schedule" element={<Schedule />} />
          <Route path="/data-sync" element={<DataSync />} />
          <Route path="/search" element={<SearchResults />} />
          <Route path="/supplier/:supplierId/properties" element={<PropertiesList />} />
          <Route path="/supplier/:supplierId/property/:propertyId/*" element={<PropertyDetail />} />
        </Routes>
      </Layout>
    </div>
  )
}

export default App
