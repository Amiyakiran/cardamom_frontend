import React from 'react'
import Sidebar from '../../components/admincomponents/Sidebar'

function Admindashboard() {
  return (
    <div className="admin-page-shell">
      <Sidebar activeItem="Dashboard" />
      <main className="admin-page-content">Admindashboard</main>
    </div>
  )
}

export default Admindashboard
