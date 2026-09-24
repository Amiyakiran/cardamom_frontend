import React from 'react'
import Sidebar from '../../components/admincomponents/Sidebar'

function Admininventory() {
  return (
    <div className="admin-page-shell">
      <Sidebar activeItem="Inventory" />
      <main className="admin-page-content">Admininventory</main>
    </div>
  )
}

export default Admininventory
