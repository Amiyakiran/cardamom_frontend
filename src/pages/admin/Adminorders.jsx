import React, { useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Modal from 'react-bootstrap/Modal';
import { faBell, faChevronLeft, faChevronRight, faCircleCheck, faClock, faEllipsisVertical, faEye, faLeaf, faReceipt, faTruckFast,faUser ,faLocationDot ,faBoxOpen ,faPrint  } from '@fortawesome/free-solid-svg-icons'
import { Link } from 'react-router-dom'
import Sidebar from '../../components/admincomponents/Sidebar'
import AdminHeader from '../../components/admincomponents/AdminHeader'
import './Adminorders.css'
import { deleteOrderApi, getAllOrdersApi, getAOrdersApi, updateOrderStatusApi } from '../../services/allApi'
import { serverUrl } from '../../services/serverUrl';
import { toast, ToastContainer } from 'react-toastify';


//formate the date
const formatOrderCreatedAt = (createdAt) => {
  const date = new Date(createdAt)
  if (Number.isNaN(date.getTime())) {
    return { date: 'Invalid date', time: '' }
  }

  return {
    date: date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      timeZone: 'Asia/Kolkata',
    }),
    time: date.toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
      timeZone: 'Asia/Kolkata',
    }),
  }
}



function Adminorders() {
  const [orders, setOrders] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [activeStatus, setActiveStatus] = useState(false)
  const [dateRange, setDateRange] = useState('All Orders')

  const positionOrderMenu = (event) => {
    const menuDetails = event.currentTarget
    if (!menuDetails.open) return

    const summary = menuDetails.querySelector('summary')
    const menu = menuDetails.querySelector(':scope > div')
    const summaryBounds = summary.getBoundingClientRect()
    const menuWidth = menu.offsetWidth
    const menuHeight = menu.offsetHeight
    const left = Math.max(8, Math.min(summaryBounds.right - menuWidth, window.innerWidth - menuWidth - 8))
    const top = summaryBounds.bottom + menuHeight + 8 > window.innerHeight
      ? Math.max(8, summaryBounds.top - menuHeight - 4)
      : summaryBounds.bottom + 4

    menu.style.left = `${left}px`
    menu.style.top = `${top}px`
  }
  const [show, setShow] = useState(false);
  const [viewOrder, SetViewOrder] = useState({})

  const filteredOrders = orders.filter((order) => {
    if (dateRange === 'All Orders') return true

    const createdAt = new Date(order.createdAt)
    if (Number.isNaN(createdAt.getTime())) return false

    const now = new Date()
    if (dateRange === 'This year') {
      return createdAt.getFullYear() === now.getFullYear()
    }

    const days = Number.parseInt(dateRange.match(/\d+/)?.[0] || '30', 10)
    const startDate = new Date(now)
    startDate.setDate(startDate.getDate() - days)
    return createdAt >= startDate && createdAt <= now
  })

  const ordersPerPage = 6
  const pageCount = Math.ceil(filteredOrders.length / ordersPerPage)
  const displayedPage = Math.min(currentPage, Math.max(1, pageCount))
  const paginatedOrders = filteredOrders.slice(
    (displayedPage - 1) * ordersPerPage,
    displayedPage * ordersPerPage
  )


//close the view
  const handleClose = () => setShow(false);

  //view order
  const handleShow = async (id) => {
    // console.log(id);
    const result = await getAOrdersApi(id)
    // console.log(result);
    SetViewOrder(result.data)

    setShow(true)
  };
  // console.log(viewOrder);


  const updateOrderStatus = async(order) => {
    // console.log(order);
    const result = await updateOrderStatusApi(order._id,{currentStatus:order.status})
    // console.log(result);
    if(result.status>=200 && result.status<300){
      setActiveStatus(!activeStatus)
    }
    else{
      toast.error("Something went wrong. Please try after sometime")
    }
    
    
  }

  //get all
  const getAllOrders = async () => {
    const result = await getAllOrdersApi()
    //  console.log(result);
    if (result.status >= 200 && result.status < 300) {
      setOrders(result.data)
    }

  }
  // console.log(orders);

  //delete order
  const deleteOrder = async(id)=>{
   const result = await deleteOrderApi(id)
  //  console.log(result);
   if(result.status>=200 && result.status<300){
      setActiveStatus(!activeStatus)
   }
   else{
     toast.error("Something went wrong")
   }
   
  }

  useEffect(() => {
    getAllOrders()
  }, [activeStatus])

  return (
    <div className="admin-page-shell">
      <Sidebar activeItem="Orders" />
      <main className="admin-page-content orders-page">
        <AdminHeader className="orders-topbar" />

        <header className="orders-heading">
          <div>
            <p className="orders-breadcrumb"><FontAwesomeIcon icon={faLeaf} aria-hidden="true" /> Admin <span>›</span> Orders</p>
            <h1>Order Management</h1>
            <p>Track and manage all customer orders in one place.</p>
          </div>
          <p className="orders-heading-note">Good food<br />connects people.</p>
        </header>

        <section className="orders-summary" aria-label="Order summary">

          <article className="orders-summary-card" >
            <span className="orders-summary-icon"><FontAwesomeIcon icon={faReceipt} aria-hidden="true" /></span>
            <div>
              <p>Total Orders</p>
              <strong>{orders.length}</strong>

            </div>
            <FontAwesomeIcon className="orders-summary-leaf" icon={faLeaf} aria-hidden="true" />
          </article>
          <article className="orders-summary-card" >
            <span className="orders-summary-icon"><FontAwesomeIcon icon={faClock} aria-hidden="true" /></span>
            <div>
              <p>Payment confirmed</p>
              <strong>{orders.filter((item) => item.status == 'Payment Confirmed').length}</strong>

            </div>
            <FontAwesomeIcon className="orders-summary-leaf" icon={faLeaf} aria-hidden="true" />
          </article>
          <article className="orders-summary-card" >
            <span className="orders-summary-icon"><FontAwesomeIcon icon={faTruckFast} aria-hidden="true" /></span>
            <div>
              <p>Shipped</p>
              <strong>{orders.filter((item) => item.status == 'Shipped').length}</strong>

            </div>
            <FontAwesomeIcon className="orders-summary-leaf" icon={faLeaf} aria-hidden="true" />
          </article>
          <article className="orders-summary-card" >
            <span className="orders-summary-icon"><FontAwesomeIcon icon={faCircleCheck} aria-hidden="true" /></span>
            <div>
              <p>Delivered</p>
              <strong>{orders.filter((item) => item.status == 'Delivered').length}</strong>

            </div>
            <FontAwesomeIcon className="orders-summary-leaf" icon={faLeaf} aria-hidden="true" />
          </article>

        </section>

        <div className="orders-workspace">
          <section className="orders-table-panel" aria-label="Orders list">
            <div className="orders-table-toolbar">
              <div className="orders-filter-tabs" role="tablist" aria-label="Filter orders by status">
                <p>All Orders</p>
              </div>
              <label className="orders-date-filter">
                <FontAwesomeIcon icon={faClock} aria-hidden="true" />
                <select
                  value={dateRange}
                  onChange={(event) => {
                    setDateRange(event.currentTarget.value)
                    setCurrentPage(1)
                  }}
                  aria-label="Order date range"
                >
                  <option>All Orders</option>
                  <option>Last 30 days</option>
                  <option>Last 7 days</option>
                  <option>This year</option>
                </select>
              </label>
            </div>

            <div className="orders-table-scroll">
              <table className="orders-table">
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Customer</th>
                    <th>Date</th>
                    <th>Total Amount</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedOrders.map((order) => {
                    const createdAt = formatOrderCreatedAt(order.createdAt)
                    return (
                      <tr key={order._id}>
                        <td style={{ backgroundColor: 'white' }}>
                          <div className="orders-product-cell">
                            <span><strong># {order.orderId}</strong><small>{order.products.map((item) => item.title)}</small></span>
                          </div>
                        </td>
                        <td style={{ backgroundColor: 'white' }}><span className="orders-customer-cell"><strong>{order.name}</strong><small>{order.email}</small></span></td>
                        <td style={{ backgroundColor: 'white' }}><span className="orders-date-cell">{createdAt.date}<small>{createdAt.time}</small></span></td>
                        <td style={{ backgroundColor: 'white' }} className="orders-total-cell">₹ {order.TotalAmount}</td>
                        <td style={{ backgroundColor: 'white' }} ><span className={order.status=='Placed'?'orderstatusPlaced':order.status=='Payment Confirmed'?'orderstatusPayment':order.status=='Shipped'?'orderstatusShipped':'orderstatusDeli'}>{order.status}</span></td>
                        <td style={{ backgroundColor: 'white' }}>
                          <div className="orders-row-actions" onClick={(event) => event.stopPropagation()}>
                            <button type="button" onClick={() => handleShow(order._id)}>
                              <FontAwesomeIcon className='text-primary' icon={faEye} aria-hidden="true" />
                            </button>
                            <details className="orders-more-menu" onToggle={positionOrderMenu}>
                              <summary aria-label={`More actions for ${order.id}`}><FontAwesomeIcon icon={faEllipsisVertical} aria-hidden="true" /></summary>
                              <div>
                                <button type="button" onClick={() => updateOrderStatus(order)}>
                                  Advance status
                                </button>
                                <button type="button" className='text-danger' onClick={() => deleteOrder(order._id)}>Delete</button>

                              </div>
                            </details>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                  {filteredOrders.length === 0 && (
                    <tr><td className="orders-empty-state" colSpan="7">No orders found in this date range.</td></tr>
                  )}
                </tbody>
              </table>
            </div>

            {pageCount > 1 && (
              <nav className="orders-pagination" aria-label="Order pages">
                <button type="button" onClick={() => setCurrentPage(displayedPage - 1)} disabled={displayedPage === 1}>
                  Previous
                </button>
                {Array.from({ length: pageCount }, (_, index) => index + 1).map((pageNumber) => (
                  <button
                    type="button"
                    key={pageNumber}
                    onClick={() => setCurrentPage(pageNumber)}
                    aria-label={`Order page ${pageNumber}`}
                    aria-current={pageNumber === displayedPage ? 'page' : undefined}
                  >
                    {pageNumber}
                  </button>
                ))}
                <button type="button" onClick={() => setCurrentPage(displayedPage + 1)} disabled={displayedPage === pageCount}>
                  Next
                </button>
              </nav>
            )}
          </section>



        </div>
      </main>


      <Modal show={show} onHide={handleClose}>
        <Modal.Header>
          <Modal.Title style={{fontFamily:'Playfair Display, serif'}}>View Order</Modal.Title>
        </Modal.Header>
        <Modal.Body>
               <aside className="orders-detail-panel" aria-label={`Details for order`}>
              <div className="orders-detail-heading">
                <div>
                  <h2 style={{fontFamily:'var(--display)'}}>Order : {viewOrder.orderId}</h2>
                  <p>{formatOrderCreatedAt(viewOrder.createdAt).date} <span>·</span>items :  {viewOrder.products?.length} <span>·</span> ₹ {viewOrder.TotalAmount}</p>
                </div>
                <span>{viewOrder.status}</span>
              </div>

              <section className="orders-detail-section">
                <div className="orders-detail-section-title"><FontAwesomeIcon icon={faUser} aria-hidden="true" /><strong>Customer Details</strong></div>
                <div className="orders-customer-detail"><span className="orders-customer-avatar">{viewOrder.name?.charAt(0).toUpperCase()}</span><div><strong>{viewOrder.name}</strong><p>{viewOrder.email} <span>·</span> {viewOrder.address?.mobileno}</p></div></div>
              </section>

              <section className="orders-detail-section">
                <div className="orders-detail-section-title"><FontAwesomeIcon icon={faLocationDot} aria-hidden="true" /><strong>Shipping Address</strong></div>
                <p className="orders-address">{viewOrder.address?.flat}, {viewOrder.address?.landmark}, {viewOrder.address?.street} {viewOrder.address?.city}, {viewOrder.address?.state}, {viewOrder.address?.pincode} <br/> {viewOrder.address?.mobileno}</p>
              </section>


              <section className="orders-detail-section orders-items-section">
                <div className="orders-detail-section-title"><strong>Order Items</strong><span>items {viewOrder.products?.length}</span></div>
                <div className="orders-item-list">
                  {viewOrder.products?.map((product) => (
                    <div className="orders-detail-item" key={product.name}>
                      <img src={`${serverUrl}/uploads/${product.image}`} alt="" style={{ objectPosition: product.imagePosition }} />
                      <div><span>{product.title}</span><strong>{product.name}</strong><small>Qty : {product.quantity} <span>·</span> ₹ {product.price}</small> <small> count :  {product.count}</small></div>
                    </div>
                  ))} 
                </div>
                <p className='mt-4'>Total Amount : {viewOrder.TotalAmount}</p>
              </section>

            
            </aside>
        </Modal.Body>
        <Modal.Footer>
          <button className='btn btn-outline-warning border-1 border-warning' onClick={handleClose}>
            Close
          </button>
          
        </Modal.Footer>
      </Modal>

       <ToastContainer position='top-right' autoClose={3000} theme='colored' />
    </div>
  )
}

export default Adminorders
