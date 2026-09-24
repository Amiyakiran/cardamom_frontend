import React from 'react'
import Sidebar from '../../components/admincomponents/Sidebar'

function Adminproducts() {
  return (
    <div className="admin-page-shell">
      <Sidebar activeItem="Products" />
      <main className="admin-page-content">Adminproducts</main>
    </div>
  )
}

export default Adminproducts
