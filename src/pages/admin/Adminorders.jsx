import React, { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faArrowTrendUp,
  faBell,
  faBoxOpen,
  faCheck,
  faChevronDown,
  faChevronLeft,
  faChevronRight,
  faCircleCheck,
  faClock,
  faEllipsisVertical,
  faEye,
  faLeaf,
  faLocationDot,
  faMagnifyingGlass,
  faPrint,
  faReceipt,
  faTruckFast,
  faUser,
} from '@fortawesome/free-solid-svg-icons'
import { Link } from 'react-router-dom'
import Sidebar from '../../components/admincomponents/Sidebar'
import './Adminorders.css'

const initialOrders = [
  { id: 'ORD12345', customer: 'Ayesha Khan', email: 'ayesha@email.com', phone: '+91 98765 43210', date: '12 Apr 2025', time: '10:24 AM', total: 1250, status: 'Delivered', items: 5, address: '123, Green Valley Apartments, Dubai, UAE - 00000', payment: 'Paid via Visa •••• 2319', products: [{ name: 'Green Cardamom', quantity: 1, price: 450, imagePosition: '44% 56%' }, { name: 'Cinnamon', quantity: 2, price: 320, imagePosition: '78% 49%' }, { name: 'Black Pepper', quantity: 1, price: 280, imagePosition: '61% 72%' }] },
  { id: 'ORD12344', customer: 'Rahul Nair', email: 'rahul@email.com', phone: '+91 98765 43211', date: '11 Apr 2025', time: '03:40 PM', total: 980, status: 'Shipped', items: 3, address: '18 Palm Grove Road, Kochi, Kerala - 682001', payment: 'Paid via UPI', products: [{ name: 'Cinnamon', quantity: 2, price: 320, imagePosition: '78% 49%' }] },
  { id: 'ORD12343', customer: 'Sneha Pillai', email: 'sneha@email.com', phone: '+91 98765 43212', date: '11 Apr 2025', time: '11:12 AM', total: 560, status: 'Pending', items: 2, address: '24 Lake View, Thrissur, Kerala - 680001', payment: 'Cash on delivery', products: [{ name: 'Black Pepper', quantity: 2, price: 280, imagePosition: '61% 72%' }] },
  { id: 'ORD12342', customer: 'Vikram S.', email: 'vikram@email.com', phone: '+91 98765 43213', date: '10 Apr 2025', time: '06:25 PM', total: 1860, status: 'Delivered', items: 4, address: '7 Spice Garden Lane, Kozhikode, Kerala - 673001', payment: 'Paid via Mastercard', products: [{ name: 'Turmeric', quantity: 2, price: 390, imagePosition: '24% 60%' }] },
  { id: 'ORD12341', customer: 'Divya R.', email: 'divya@email.com', phone: '+91 98765 43214', date: '10 Apr 2025', time: '01:15 PM', total: 320, status: 'Shipped', items: 1, address: '51 Market Road, Kannur, Kerala - 670001', payment: 'Paid via UPI', products: [{ name: 'Cloves', quantity: 1, price: 320, imagePosition: '57% 66%' }] },
  { id: 'ORD12340', customer: 'Arjun P.', email: 'arjun@email.com', phone: '+91 98765 43215', date: '09 Apr 2025', time: '09:42 AM', total: 2480, status: 'Delivered', items: 6, address: '3 Hilltop Estate, Wayanad, Kerala - 673121', payment: 'Paid via Visa •••• 4582', products: [{ name: 'Cinnamon', quantity: 2, price: 320, imagePosition: '78% 49%' }] },
  { id: 'ORD12339', customer: 'Meera K.', email: 'meera@email.com', phone: '+91 98765 43216', date: '08 Apr 2025', time: '04:20 PM', total: 1120, status: 'Pending', items: 3, address: '90 Riverside Avenue, Ernakulam, Kerala - 682011', payment: 'Cash on delivery', products: [{ name: 'Green Cardamom', quantity: 2, price: 450, imagePosition: '44% 56%' }] },
]

const statusFilters = [
  { label: 'All Orders', count: '124' },
  { label: 'Pending', count: '8' },
  { label: 'Shipped', count: '96' },
  { label: 'Delivered', count: '18' },
]

const summaryCards = [
  { label: 'Total Orders', count: '124', note: '12% from last week', icon: faReceipt, tone: 'green', trend: 'up' },
  { label: 'Pending', count: '8', note: '3% from last week', icon: faClock, tone: 'orange', trend: 'down' },
  { label: 'Shipped', count: '96', note: '15% from last week', icon: faTruckFast, tone: 'green', trend: 'up' },
  { label: 'Delivered', count: '18', note: '8% from last week', icon: faCircleCheck, tone: 'green', trend: 'up' },
]

function Adminorders() {
  const [orders, setOrders] = useState(initialOrders)
  const [selectedId, setSelectedId] = useState(initialOrders[0].id)
  const [activeStatus, setActiveStatus] = useState('All Orders')
  const [search, setSearch] = useState('')
  const [dateRange, setDateRange] = useState('Last 30 days')
  const [notice, setNotice] = useState('')

  const visibleOrders = orders.filter((order) => {
    const matchesStatus = activeStatus === 'All Orders' || order.status === activeStatus
    const query = search.trim().toLowerCase()
    const matchesSearch = !query || [order.id, order.customer, order.email].some((value) => value.toLowerCase().includes(query))
    return matchesStatus && matchesSearch
  })
  const selectedOrder = orders.find((order) => order.id === selectedId) || visibleOrders[0]

  const updateOrderStatus = (orderId) => {
    setOrders((current) => current.map((order) => (
      order.id === orderId
        ? { ...order, status: order.status === 'Pending' ? 'Shipped' : order.status === 'Shipped' ? 'Delivered' : 'Pending' }
        : order
    )))
    setNotice('Order status updated')
  }

  return (
    <div className="admin-page-shell">
      <Sidebar activeItem="Orders" />
      <main className="admin-page-content orders-page">
        <div className="orders-topbar">
          <label className="orders-search">
            <FontAwesomeIcon icon={faMagnifyingGlass} aria-hidden="true" />
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.currentTarget.value)}
              placeholder="Search by order id, customer name or product..."
              aria-label="Search orders"
            />
          </label>
          <div className="orders-account-tools">
            <button className="orders-notifications" type="button" aria-label="Notifications, 3 unread">
              <FontAwesomeIcon icon={faBell} aria-hidden="true" />
              <span>3</span>
            </button>
            <button className="orders-account" type="button">
              <span className="orders-avatar">A</span>
              <span>Admin</span>
              <FontAwesomeIcon icon={faChevronDown} aria-hidden="true" />
            </button>
          </div>
        </div>

        <header className="orders-heading">
          <div>
            <p className="orders-breadcrumb"><FontAwesomeIcon icon={faLeaf} aria-hidden="true" /> Admin <span>›</span> Orders</p>
            <h1>Order Management</h1>
            <p>Track and manage all customer orders in one place.</p>
          </div>
          <p className="orders-heading-note">Good food<br />connects people.</p>
        </header>

        <section className="orders-summary" aria-label="Order summary">
          {summaryCards.map((card) => (
            <article className={`orders-summary-card is-${card.tone}`} key={card.label}>
              <span className="orders-summary-icon"><FontAwesomeIcon icon={card.icon} aria-hidden="true" /></span>
              <div>
                <p>{card.label}</p>
                <strong>{card.count}</strong>
                <small className={card.trend === 'down' ? 'is-down' : ''}>
                  <FontAwesomeIcon icon={faArrowTrendUp} aria-hidden="true" /> {card.note}
                </small>
              </div>
              <span className="orders-summary-leaf" aria-hidden="true">✦</span>
            </article>
          ))}
        </section>

        <div className="orders-workspace">
          <section className="orders-table-panel" aria-label="Orders list">
            <div className="orders-table-toolbar">
              <div className="orders-filter-tabs" role="tablist" aria-label="Filter orders by status">
                {statusFilters.map((filter) => (
                  <button
                    className={activeStatus === filter.label ? 'is-active' : ''}
                    key={filter.label}
                    type="button"
                    role="tab"
                    aria-selected={activeStatus === filter.label}
                    onClick={() => setActiveStatus(filter.label)}
                  >
                    {filter.label}<span>{filter.count}</span>
                  </button>
                ))}
              </div>
              <label className="orders-date-filter">
                <FontAwesomeIcon icon={faClock} aria-hidden="true" />
                <select value={dateRange} onChange={(event) => setDateRange(event.currentTarget.value)} aria-label="Order date range">
                  <option>Last 30 days</option>
                  <option>Last 7 days</option>
                  <option>This year</option>
                </select>
                <FontAwesomeIcon icon={faChevronDown} aria-hidden="true" />
              </label>
            </div>

            <div className="orders-table-scroll">
              <table className="orders-table">
                <thead>
                  <tr>
                    <th><span className="orders-checkbox" aria-label="Orders" /></th>
                    <th>Order ID</th>
                    <th>Customer</th>
                    <th>Date</th>
                    <th>Total Amount</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {visibleOrders.map((order) => (
                    <tr className={selectedOrder?.id === order.id ? 'is-selected' : ''} key={order.id} onClick={() => setSelectedId(order.id)}>
                      <td><span className="orders-checkbox" aria-hidden="true" /></td>
                      <td>
                        <div className="orders-product-cell">
                          <img src="/assets/hero_IMAGE.png" alt="" style={{ objectPosition: order.products[0].imagePosition }} />
                          <span><strong>#{order.id}</strong><small>{order.items} items</small></span>
                        </div>
                      </td>
                      <td><span className="orders-customer-cell"><strong>{order.customer}</strong><small>{order.email}</small></span></td>
                      <td><span className="orders-date-cell">{order.date}<small>{order.time}</small></span></td>
                      <td className="orders-total-cell">₹ {order.total.toLocaleString('en-IN')}</td>
                      <td><span className={`orders-status is-${order.status.toLowerCase()}`}>{order.status}</span></td>
                      <td>
                        <div className="orders-row-actions" onClick={(event) => event.stopPropagation()}>
                          <button type="button" aria-label={`View order ${order.id}`} onClick={() => setSelectedId(order.id)}>
                            <FontAwesomeIcon icon={faEye} aria-hidden="true" />
                          </button>
                          <details className="orders-more-menu">
                            <summary aria-label={`More actions for ${order.id}`}><FontAwesomeIcon icon={faEllipsisVertical} aria-hidden="true" /></summary>
                            <div>
                              <button type="button" onClick={() => setSelectedId(order.id)}>View details</button>
                              <button type="button" onClick={() => updateOrderStatus(order.id)}>Advance status</button>
                            </div>
                          </details>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {visibleOrders.length === 0 && (
                    <tr><td className="orders-empty-state" colSpan="7">No orders match your search.</td></tr>
                  )}
                </tbody>
              </table>
            </div>

            <footer className="orders-table-footer">
              <p aria-live="polite">{visibleOrders.length ? `Showing 1–${visibleOrders.length} of ${activeStatus === 'All Orders' ? '124' : statusFilters.find((filter) => filter.label === activeStatus)?.count} orders` : 'No orders to display'}{notice ? ` · ${notice}` : ''}</p>
              <nav className="orders-pagination" aria-label="Orders pages">
                <button type="button" disabled aria-label="Previous page"><FontAwesomeIcon icon={faChevronLeft} aria-hidden="true" /></button>
                <button className="is-active" type="button" aria-current="page">1</button>
                <button type="button" disabled>2</button>
                <button type="button" disabled>3</button>
                <button type="button" disabled>4</button>
                <button type="button" disabled>5</button>
                <button type="button" disabled aria-label="Next page"><FontAwesomeIcon icon={faChevronRight} aria-hidden="true" /></button>
              </nav>
            </footer>
          </section>

          {selectedOrder && (
            <aside className="orders-detail-panel" aria-label={`Details for order ${selectedOrder.id}`}>
              <div className="orders-detail-heading">
                <div>
                  <h2>Order #{selectedOrder.id}</h2>
                  <p>{selectedOrder.date} <span>·</span> {selectedOrder.items} items <span>·</span> ₹ {selectedOrder.total.toLocaleString('en-IN')}</p>
                </div>
                <span className={`orders-status is-${selectedOrder.status.toLowerCase()}`}>{selectedOrder.status}</span>
              </div>

              <section className="orders-detail-section">
                <div className="orders-detail-section-title"><FontAwesomeIcon icon={faUser} aria-hidden="true" /><strong>Customer Details</strong><Link to="/admin/customers">View Profile</Link></div>
                <div className="orders-customer-detail"><span className="orders-customer-avatar">{selectedOrder.customer.charAt(0)}</span><div><strong>{selectedOrder.customer}</strong><p>{selectedOrder.email} <span>·</span> {selectedOrder.phone}</p></div></div>
              </section>

              <section className="orders-detail-section">
                <div className="orders-detail-section-title"><FontAwesomeIcon icon={faLocationDot} aria-hidden="true" /><strong>Shipping Address</strong><button type="button" onClick={() => setNotice('Address edit is not available in this preview')}>Edit</button></div>
                <p className="orders-address">{selectedOrder.address}</p>
              </section>

              <section className="orders-detail-section">
                <div className="orders-detail-section-title"><FontAwesomeIcon icon={faBoxOpen} aria-hidden="true" /><strong>Payment Method</strong></div>
                <p className="orders-payment">{selectedOrder.payment}</p>
              </section>

              <section className="orders-detail-section orders-items-section">
                <div className="orders-detail-section-title"><strong>Order Items</strong><span>{selectedOrder.items} items</span></div>
                <div className="orders-item-list">
                  {selectedOrder.products.map((product) => (
                    <div className="orders-detail-item" key={product.name}>
                      <img src="/assets/hero_IMAGE.png" alt="" style={{ objectPosition: product.imagePosition }} />
                      <div><strong>{product.name}</strong><small>Qty: {product.quantity} <span>·</span> ₹ {product.price}</small></div>
                    </div>
                  ))}
                </div>
              </section>

              <div className="orders-detail-actions">
                <button type="button" onClick={() => setNotice(`Invoice for ${selectedOrder.id} is ready to print`)}><FontAwesomeIcon icon={faPrint} aria-hidden="true" />Print Invoice</button>
                <button type="button" onClick={() => updateOrderStatus(selectedOrder.id)}><FontAwesomeIcon icon={faTruckFast} aria-hidden="true" />Track Order</button>
              </div>
            </aside>
          )}
        </div>
      </main>
    </div>
  )
}

export default Adminorders
