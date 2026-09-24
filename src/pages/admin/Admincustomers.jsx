import React from 'react'
import Sidebar from '../../components/admincomponents/Sidebar'

function Admincustomers() {
  return (
    <div className="admin-page-shell">
      <Sidebar activeItem="Customers" />
      <main className="admin-page-content">Admincustomers</main>
    </div>
  )
}

export default Admincustomers
