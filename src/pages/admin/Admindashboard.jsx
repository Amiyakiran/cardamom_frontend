import { useEffect, useMemo, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faBell,
  faBoxOpen,
  faCalendarDays,
  faChevronRight,
  faCircleCheck,
  faClock,
  faCreditCard,
  faLeaf,
  faReceipt,
  faShoppingBag,
  faTriangleExclamation,
  faTruckFast,
  faUsers,
  faWallet,
} from '@fortawesome/free-solid-svg-icons'
import { Link } from 'react-router-dom'
import Sidebar from '../../components/admincomponents/Sidebar'
import AdminHeader from '../../components/admincomponents/AdminHeader'
import { getAllInventoriesApi, getAllOrdersApi, getAllProductApi, getAllUsersApi } from '../../services/allApi'
import { serverUrl } from '../../services/serverUrl'
import './Admindashboard.css'

const normalizeStatus = (status) => String(status || '').trim().toLowerCase()
const ADMIN_EMAIL = 'greengoldspices.ndkm@gmail.com'
const getOrderAmount = (order) => Number(order.TotalAmount ?? order.total ?? 0) || 0
const getOrderCustomer = (order) => order.name || order.customer || 'Customer'
const getOrderUnitsSold = (order) => (
  Array.isArray(order.products)
    ? order.products.reduce((sum, product) => sum + (Number(product.count ?? product.quantity ?? 1) || 0), 0)
    : 0
)
const getInventoryUnitsSold = (report) => {
  const reportProducts = Array.isArray(report.products) ? report.products : report.rows
  return Array.isArray(reportProducts)
    ? reportProducts.reduce((sum, product) => sum + (Number(product.unitsSold) || 0), 0)
    : 0
}
const getOrderDate = (date) => {
  const parsedDate = new Date(date)
  return Number.isNaN(parsedDate.getTime())
    ? 'Date unavailable'
    : parsedDate.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
}

const formatCurrency = (amount) => `₹${Number(amount || 0).toLocaleString('en-IN')}`

function Admindashboard() {
  const [orders, setOrders] = useState([])
  const [products, setProducts] = useState([])
  const [customers, setCustomers] = useState([])
  const [inventoryReports, setInventoryReports] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadErrors, setLoadErrors] = useState([])

  useEffect(() => {
    let isCurrent = true
    const loadDashboard = async () => {
      const [ordersResult, productsResult, customersResult, inventoryResult] = await Promise.all([
        getAllOrdersApi(),
        getAllProductApi(''),
        getAllUsersApi(),
        getAllInventoriesApi(),
      ])
      if (!isCurrent) return

      const errors = []
      if (ordersResult?.status >= 200 && ordersResult.status < 300 && Array.isArray(ordersResult.data)) {
        setOrders(ordersResult.data)
      } else {
        errors.push('Orders could not be loaded')
      }
      if (productsResult?.status >= 200 && productsResult.status < 300 && Array.isArray(productsResult.data)) {
        setProducts(productsResult.data)
      } else {
        errors.push('Products could not be loaded')
      }
      const customerList = Array.isArray(customersResult?.data)
        ? customersResult.data
        : customersResult?.data?.allUsers
      if (customersResult?.status >= 200 && customersResult.status < 300 && Array.isArray(customerList)) {
        setCustomers(customerList)
      } else {
        errors.push('Customers could not be loaded')
      }
      if (inventoryResult?.status >= 200 && inventoryResult.status < 300 && Array.isArray(inventoryResult.data)) {
        setInventoryReports(inventoryResult.data)
      } else {
        errors.push('Inventory reports could not be loaded')
      }
      setLoadErrors(errors)
      setLoading(false)
    }

    loadDashboard()
    return () => { isCurrent = false }
  }, [])

  const now = new Date()
  const monthlyOrders = orders.filter((order) => {
    const date = new Date(order.createdAt)
    return !Number.isNaN(date.getTime()) &&
      date.getMonth() === now.getMonth() &&
      date.getFullYear() === now.getFullYear()
  })
  const totalRevenue = orders.reduce((sum, order) => sum + getOrderAmount(order), 0)
  const monthlyRevenue = monthlyOrders.reduce((sum, order) => sum + getOrderAmount(order), 0)
  const monthlyUnitsSold = inventoryReports
    .filter((report) => {
      const [year, month] = String(report.date || '').split('-').map(Number)
      return year === now.getFullYear() && month === now.getMonth() + 1
    })
    .reduce((sum, report) => sum + getInventoryUnitsSold(report), 0)
  const totalUnitsSold = orders.reduce((sum, order) => sum + getOrderUnitsSold(order), 0)
  const customerCount = customers.filter(
    (customer) => customer.email?.toLowerCase() !== ADMIN_EMAIL
  ).length

  const statusCounts = useMemo(() => ({
    placed: orders.filter((order) => ['placed', 'pending'].includes(normalizeStatus(order.status))).length,
    payment: orders.filter((order) => ['payment confirmed', 'awaiting payment', 'awaiting payment verification'].includes(normalizeStatus(order.status))).length,
    shipping: orders.filter((order) => ['shipped', 'processing', 'processing / shipping'].includes(normalizeStatus(order.status))).length,
    delivered: orders.filter((order) => normalizeStatus(order.status) === 'delivered').length,
  }), [orders])

  const lowStockProducts = products.filter((product) => {
    const stock = Number(product.stock)
    return Number.isFinite(stock) && stock > 0 && stock <= 50
  })
  const outOfStockProducts = products.filter((product) => Number(product.stock) === 0)
  const totalSpiceStock = products.reduce((total, product) => {
    const stock = Number(product.stock)
    return total + (Number.isFinite(stock) ? stock : 0)
  }, 0)

  const topProducts = useMemo(() => {
    const soldByTitle = new Map()
    orders.forEach((order) => {
      if (!Array.isArray(order.products)) return
      order.products.forEach((product) => {
        const title = product.title || product.name
        if (!title) return
        const units = Number(product.count ?? product.quantity ?? 1) || 0
        soldByTitle.set(title, (soldByTitle.get(title) || 0) + units)
      })
    })

    return products
      .map((product) => ({ ...product, unitsSold: soldByTitle.get(product.title) || 0 }))
      .sort((first, second) => second.unitsSold - first.unitsSold)
      .slice(0, 4)
  }, [orders, products])

  const recentOrders = [...orders]
    .sort((first, second) => new Date(second.createdAt).getTime() - new Date(first.createdAt).getTime())
    .slice(0, 5)

  const recentActivity = recentOrders.map((order) => ({
    id: order._id || order.orderId,
    title: `Order ${order.orderId || ''} · ${order.status || 'Placed'}`,
    detail: `${getOrderCustomer(order)} · ${getOrderDate(order.createdAt)}`,
    type: normalizeStatus(order.status),
  }))

  const stats = [
    { label: 'Total Revenue', value: formatCurrency(totalRevenue), note: 'All recorded orders', icon: faWallet },
    { label: 'Monthly Revenue', value: formatCurrency(monthlyRevenue), note: now.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' }), icon: faCalendarDays },
    { label: 'Monthly Sales', value: monthlyUnitsSold.toLocaleString('en-IN'), note: 'Units sold per inventory reports this month', icon: faShoppingBag },
    
    { label: 'Total Customers', value: customerCount.toLocaleString('en-IN'), note: 'Registered customers', icon: faUsers },
  ]

  return (
    <div className="admin-page-shell dashboard-shell">
      <Sidebar activeItem="Dashboard" />
      <main className="dashboard-content">
        <AdminHeader className="dashboard-topbar" />

        <div className="dashboard-main">
          <header className="dashboard-hero">
            <p className="dashboard-breadcrumb"><FontAwesomeIcon icon={faLeaf} aria-hidden="true" />Admin <span>›</span> Dashboard</p>
            <h1>Welcome back, Admin!</h1>
            <p>Here's what's happening with Green Gold today.</p>
          </header>

          {loadErrors.length > 0 && (
            <p className="dashboard-load-error" role="alert">{loadErrors.join('. ')}. Some dashboard metrics may be incomplete.</p>
          )}

          <section className="dashboard-stat-grid" aria-label="Business summary">
            {stats.map((stat) => (
              <article className="dashboard-stat-card" key={stat.label}>
                <span className="dashboard-stat-icon"><FontAwesomeIcon icon={stat.icon} aria-hidden="true" /></span>
                <div>
                  <p>{stat.label}</p>
                  <strong>{loading ? '—' : stat.value}</strong>
                  <small>{stat.note}</small>
                </div>
                <FontAwesomeIcon className="dashboard-stat-leaf" icon={faLeaf} aria-hidden="true" />
              </article>
            ))}
          </section>

          <div className="dashboard-primary-grid">
            <section className="dashboard-panel dashboard-order-overview">
              <div className="dashboard-panel-heading">
                <h2><FontAwesomeIcon icon={faShoppingBag} aria-hidden="true" /> Order Overview</h2>
                <Link to="/admin/orders">View all orders <FontAwesomeIcon icon={faChevronRight} aria-hidden="true" /></Link>
              </div>
              <div className="dashboard-overview-list">
                <article className="dashboard-overview-row is-placed">
                  <span className="dashboard-overview-icon"><FontAwesomeIcon icon={faClock} /></span>
                  <span>Placed orders</span><strong>{loading ? '—' : statusCounts.placed}</strong>
                </article>
                <article className="dashboard-overview-row is-payment">
                  <span className="dashboard-overview-icon"><FontAwesomeIcon icon={faCreditCard} /></span>
                  <span>Awaiting payment verification</span><strong>{loading ? '—' : statusCounts.payment}</strong>
                </article>
                <article className="dashboard-overview-row is-shipping">
                  <span className="dashboard-overview-icon"><FontAwesomeIcon icon={faTruckFast} /></span>
                  <span>Shipping</span><strong>{loading ? '—' : statusCounts.shipping}</strong>
                </article>
                <article className="dashboard-overview-row is-delivered">
                  <span className="dashboard-overview-icon"><FontAwesomeIcon icon={faCircleCheck} /></span>
                  <span>Delivered orders</span><strong>{loading ? '—' : statusCounts.delivered}</strong>
                </article>
              </div>
            </section>

            <section className="dashboard-panel dashboard-inventory-alerts">
              <div className="dashboard-panel-heading">
                <h2><FontAwesomeIcon icon={faBoxOpen} aria-hidden="true" /> Inventory Alerts</h2>
                <Link to="/admin/inventory">View inventory <FontAwesomeIcon icon={faChevronRight} aria-hidden="true" /></Link>
              </div>
              <div className="dashboard-alert-list">
                <article className="dashboard-alert-row is-low">
                  <span className="dashboard-alert-icon"><FontAwesomeIcon icon={faTriangleExclamation} /></span>
                  <div><strong>Low-stock products</strong><small>Products that need restocking</small></div>
                  <b>{loading ? '—' : lowStockProducts.length}</b>
                </article>
                <article className="dashboard-alert-row is-empty">
                  <span className="dashboard-alert-icon"><FontAwesomeIcon icon={faCircleCheck} /></span>
                  <div><strong>Out-of-stock products</strong><small>Products currently unavailable</small></div>
                  <b>{loading ? '—' : outOfStockProducts.length}</b>
                </article>
                <article className="dashboard-alert-row is-total">
                  <span className="dashboard-alert-icon"><FontAwesomeIcon icon={faBoxOpen} /></span>
                  <div><strong>Total spice stock</strong><small>Across all products</small></div>
                  <b>{loading ? '—' : totalSpiceStock.toLocaleString('en-IN')}</b>
                </article>
              </div>
            </section>

            <section className="dashboard-panel dashboard-top-products">
              <div className="dashboard-panel-heading">
                <h2><FontAwesomeIcon icon={faLeaf} aria-hidden="true" /> Top-Selling Products</h2>
                <Link to="/admin/products">View all products <FontAwesomeIcon icon={faChevronRight} aria-hidden="true" /></Link>
              </div>
              <div className="dashboard-product-list">
                {loading ? <p className="dashboard-empty">Loading product sales…</p> : topProducts.length === 0 ? (
                  <p className="dashboard-empty">No product sales to show yet.</p>
                ) : topProducts.map((product) => {
                  const maximumSales = Math.max(1, topProducts[0].unitsSold)
                  return (
                    <article className="dashboard-product-row" key={product._id || product.title}>
                      <img src={product.image ? `${serverUrl}/uploads/${product.image}` : '/assets/hero_IMAGE.png'} alt="" />
                      <div className="dashboard-product-info">
                        <strong>{product.title}</strong>
                        <small>{product.unitsSold} units sold</small>
                        <span className="dashboard-product-bar"><i style={{ width: `${(product.unitsSold / maximumSales) * 100}%` }} /></span>
                      </div>
                      <FontAwesomeIcon icon={faChevronRight} aria-hidden="true" />
                    </article>
                  )
                })}
              </div>
              <small className="dashboard-panel-footnote">Ranked by units sold across recorded orders.</small>
            </section>
          </div>

          <div className="dashboard-secondary-grid">
            <section className="dashboard-panel dashboard-recent-orders">
              <div className="dashboard-panel-heading">
                <h2><FontAwesomeIcon icon={faReceipt} aria-hidden="true" /> Recent Orders</h2>
                <Link to="/admin/orders">View all orders <FontAwesomeIcon icon={faChevronRight} aria-hidden="true" /></Link>
              </div>
              <div className="dashboard-table-scroll">
                <table className="dashboard-table">
                  <thead><tr><th>Order ID</th><th>Customer</th><th>Amount</th><th>Payment / Status</th><th>Date</th></tr></thead>
                  <tbody>
                    {recentOrders.length === 0 ? (
                      <tr><td className="dashboard-empty" colSpan="5">{loading ? 'Loading orders…' : 'No orders received yet.'}</td></tr>
                    ) : recentOrders.map((order) => (
                      <tr key={order._id || order.orderId}>
                        <td><strong>#{order.orderId || '—'}</strong></td>
                        <td>{getOrderCustomer(order)}</td>
                        <td>{formatCurrency(getOrderAmount(order))}</td>
                        <td><span className={`dashboard-order-badge is-${normalizeStatus(order.status).replace(/\s+/g, '-') || 'placed'}`}>{order.status || 'Placed'}</span></td>
                        <td>{getOrderDate(order.createdAt)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            <section className="dashboard-panel dashboard-recent-activity">
              <div className="dashboard-panel-heading">
                <h2><FontAwesomeIcon icon={faClock} aria-hidden="true" /> Recent Activity</h2>
                <Link to="/admin/orders">View all activity <FontAwesomeIcon icon={faChevronRight} aria-hidden="true" /></Link>
              </div>
              {recentActivity.length === 0 ? (
                <p className="dashboard-empty">{loading ? 'Loading activity…' : 'No recent activity.'}</p>
              ) : (
                <ol className="dashboard-activity-list">
                  {recentActivity.map((activity) => (
                    <li className={`is-${activity.type.replace(/\s+/g, '-') || 'placed'}`} key={activity.id}>
                      <span><FontAwesomeIcon icon={activity.type.includes('ship') ? faTruckFast : faReceipt} aria-hidden="true" /></span>
                      <div><strong>{activity.title}</strong><small>{activity.detail}</small></div>
                    </li>
                  ))}
                </ol>
              )}
            </section>
          </div>

         
        </div>
      </main>
    </div>
  )
}

export default Admindashboard
