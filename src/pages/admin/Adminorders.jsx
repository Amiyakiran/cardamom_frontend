import React from 'react'
import Sidebar from '../../components/admincomponents/Sidebar'

function Adminorders() {
  return (
    <div className="admin-page-shell">
      <Sidebar activeItem="Orders" />
      <main className="admin-page-content">Adminorders</main>
    </div>
  )
}

export default Adminorders
