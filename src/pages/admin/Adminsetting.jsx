import React from 'react'
import Sidebar from '../../components/admincomponents/Sidebar'

function Adminsetting() {
  return (
    <div className="admin-page-shell">
      <Sidebar activeItem="Settings" />
      <main className="admin-page-content">Adminsetting</main>
    </div>
  )
}

export default Adminsetting
