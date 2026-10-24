import { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faBoxOpen,
  faBars,
  faChartColumn,
  faChevronRight,
  faFileLines,
  faGear,
  faReceipt,
  faTag,
  faUsers,
} from '@fortawesome/free-solid-svg-icons'
import './Sidebar.css'
import { Link, NavLink, useParams } from 'react-router-dom'

const navigationItems = [
  { label: 'Dashboard', path: 'dashboard', icon: faChartColumn },
  { label: 'Products', path: 'products', icon: faBoxOpen},
  { label: 'Orders', path: 'orders', icon: faReceipt},
  { label: 'Inventory', path: 'inventory', icon: faBoxOpen },
  { label: 'Customers', path: 'customers', icon: faUsers},
  { label: 'Blog', path: 'blog', icon: faFileLines },
  // { label: 'Reports', path: '/admin/reports', icon: faChartColumn },
  // { label: 'Coupons', path: '/admin/coupons', icon: faTag },
  { label: 'Settings', path: 'settings', icon: faGear },
]

function Sidebar({ activeItem = 'Blog', onNavigate }) {
  const [isOpen, setIsOpen] = useState(false)
  const { id } = useParams()
  const adminBasePath = `/admin/${id}`

  const handleNavigate = (label) => {
    onNavigate?.(label)
    setIsOpen(false)
  }

  return (
    <>
      <button
        className={`admin-sidebar-toggle${isOpen ? ' is-open' : ''}`}
        type="button"
        aria-label={isOpen ? 'Close admin navigation' : 'Open admin navigation'}
        aria-expanded={isOpen}
        aria-controls="admin-navigation"
        onClick={() => setIsOpen((open) => !open)}
      >
        <FontAwesomeIcon icon={faBars} aria-hidden="true" />
      </button>
      {isOpen && (
        <button
          className="admin-sidebar-backdrop"
          type="button"
          aria-label="Close admin navigation"
          onClick={() => setIsOpen(false)}
        />
      )}
      <aside id="admin-navigation" className={`admin-sidebar-design${isOpen ? ' is-open' : ''}`}>
      {/* <div className="admin-sidebar-design__brand">
        <img src="/assets/logo.png" alt="Green Gold Cardamom" loading="lazy" decoding="async" />
      </div> */}
        <Link className="site-brand" to={`${adminBasePath}/dashboard`} aria-label="Green Gold home">
        <img className="site-brand-mark" src="/assets/ggs.png" alt="" loading="lazy" decoding="async" />
        {/* <span className="site-brand-copy">
          <strong>GREEN GOLD</strong>
          <small>SPICES</small>
        </span> */}
      </Link>

      <nav className="admin-sidebar-design__nav" aria-label="Admin navigation">
        {navigationItems.map((item) => (
          <NavLink
            className={({ isActive }) => item.label === activeItem || isActive ? 'is-active' : ''}
            key={item.label}
            to={`${adminBasePath}/${item.path}`}
            onClick={() => handleNavigate(item.label)}
          >
            <FontAwesomeIcon icon={item.icon} aria-hidden="true" />
            <span>{item.label}</span>
           <FontAwesomeIcon className="nav-arrow" icon={faChevronRight} aria-hidden="true" />
          </NavLink>
        ))}
      </nav>

      {/* <div className="admin-sidebar-design__footer">
        <p>Bringing<br />Nature's Goodness<br />to Your Table</p>
        <FontAwesomeIcon icon={faLeaf} aria-hidden="true" />
        <div className="admin-sidebar-design__foliage" aria-hidden="true" />
      </div> */}
      </aside>
    </>
  )
}

export default Sidebar
