import React from 'react'
import Sidebar from '../../components/admincomponents/Sidebar'

function AdminReports() {
  return (
    <div className="admin-page-shell">
      <Sidebar activeItem="Reports" />
      <main className="admin-page-content">AdminReports</main>
    </div>
  )
}

export default AdminReports
