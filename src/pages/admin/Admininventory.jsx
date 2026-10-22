import { useEffect, useMemo, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBell, faCalendarDays, faChartColumn,
  faChevronDown,
  faCircleExclamation,
  faClockRotateLeft,
  faDownload,
  faEye,
  faFileLines,
  faLeaf,
  faMagnifyingGlass,
  faPlus,
  faSave,
  faShoppingCart,
  faTrash,
  faTriangleExclamation,
  faXmark,
} from '@fortawesome/free-solid-svg-icons'
import { toast, ToastContainer } from 'react-toastify'
import Sidebar from '../../components/admincomponents/Sidebar'
import AdminHeader from '../../components/admincomponents/AdminHeader'
import { addInventoryApi, deleteInventoryApi, getAllInventoriesApi, getAllProductApi } from '../../services/allApi'
import { serverUrl } from '../../services/serverUrl'
import './Admininventory.css'

const RESTOCK_THRESHOLD = 50

//get todays date
const getToday = () => {
  const today = new Date()
  const offset = today.getTimezoneOffset() * 60000
  return new Date(today.getTime() - offset).toISOString().slice(0, 10)
}

//formate the date
const formatReportDate = (date) => new Date(`${date}T00:00:00`).toLocaleDateString('en-IN', {
  day: '2-digit',
  month: 'short',
  year: 'numeric',
})


const createDraftRow = (product) => ({
  productId: product._id,
  title: product.title,
  image: product.image,
  varient: product.varient,
  openingStock: Math.max(0, Number(product.stock) || 0),
  unitsSold: 0,
  stockAdded: 0,
})

const calculateClosingStock = (row) => (
  (Number(row.openingStock) || 0) - (Number(row.unitsSold) || 0) +
  (Number(row.stockAdded) || 0)
)

const normalizeInventoryReport = (report) => ({
  ...report,
  id: report._id || report.id,
  rows: report.products || report.rows || [],
})

function Admininventory() {
  const [products, setProducts] = useState([])
  const [draftRows, setDraftRows] = useState([])
  const [reportDate, setReportDate] = useState(getToday)
  const [reports, setReports] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchDate, setSearchDate] = useState('')
  const [historyRange, setHistoryRange] = useState('All Dates')
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedReport, setSelectedReport] = useState(null)
  const [deleteReport, setDeleteReport] = useState(null)
  const [savingReport, setSavingReport] = useState(false)


  //functions

  useEffect(() => {
    let isCurrent = true
    const loadProducts = async () => {
      try {
        const result = await getAllProductApi('')
        if (!isCurrent) return
        if (result?.status >= 200 && result.status < 300 && Array.isArray(result.data)) {
          setProducts(result.data)
          setDraftRows(result.data.map(createDraftRow))
        } else {
          toast.error(result?.response?.data?.message || 'Unable to load products for inventory')
        }
      } catch (error) {
        // console.error('Unable to load products for inventory', error)
        if (isCurrent) toast.error('Unable to load products for inventory')
      } finally {
        if (isCurrent) setLoading(false)
      }
    }
    loadProducts()
    return () => { isCurrent = false }
  }, [])

  useEffect(() => {
    let isCurrent = true
    const loadInventoryReports = async () => {
      const result = await getAllInventoriesApi()
      if (!isCurrent) return
      if (result?.status >= 200 && result.status < 300 && Array.isArray(result.data)) {
        setReports(result.data.map(normalizeInventoryReport))
      } else {
        toast.error(result?.response?.data?.message || 'Unable to load inventory reports')
      }
    }
    loadInventoryReports()
    return () => { isCurrent = false }
  }, [])

  const unitsSoldToday = draftRows.reduce((total, row) => total + (Number(row.unitsSold) || 0), 0)
  const unitsAddedToday = draftRows.reduce((total, row) => total + (Number(row.stockAdded) || 0), 0)
  const restockCount = products.filter((product) => Number(product.stock) <= RESTOCK_THRESHOLD).length

  const filteredReports = useMemo(() => reports
    .filter((report) => !searchDate || formatReportDate(report.date).toLowerCase().includes(searchDate.toLowerCase()))
    .filter((report) => {
      if (historyRange === 'All Dates') return true
      const reportDateValue = new Date(`${report.date}T00:00:00`)
      const today = new Date()
      if (historyRange === 'This Month') {
        return reportDateValue.getFullYear() === today.getFullYear() &&
          reportDateValue.getMonth() === today.getMonth()
      }
      const days = Number.parseInt(historyRange, 10)
      const firstDate = new Date(today)
      firstDate.setDate(today.getDate() - days)
      firstDate.setHours(0, 0, 0, 0)
      return reportDateValue >= firstDate && reportDateValue <= today
    })
    .sort((first, second) => second.date.localeCompare(first.date)), [reports, searchDate, historyRange])

  const reportsPerPage = 5
  const pageCount = Math.ceil(filteredReports.length / reportsPerPage)
  const displayedPage = Math.min(currentPage, Math.max(1, pageCount))
  const paginatedReports = filteredReports.slice(
    (displayedPage - 1) * reportsPerPage,
    displayedPage * reportsPerPage
  )

  const updateDraftRow = (productId, field, value) => {
    setDraftRows((current) => current.map((row) => {
      if (row.productId !== productId) return row
      if (field === 'unitsSold') {
        const openingStock = Math.max(0, Number(row.openingStock) || 0)
        const unitsSold = Math.min(Math.max(0, Number(value) || 0), openingStock)
        return { ...row, unitsSold }
      }
      return { ...row, [field]: value }
    }))
  }

  const saveDailyReport = async () => {
    const report = {
      date: reportDate,
      products: draftRows.map((row) => ({
        ...row,
        openingStock: Number(row.openingStock) || 0,
        unitsSold: Number(row.unitsSold) || 0,
        stockAdded: Number(row.stockAdded) || 0,
        closingStock: calculateClosingStock(row),
      })),
    }
    setSavingReport(true)
    try {
      const result = await addInventoryApi(report)
      if (result?.status >= 200 && result.status < 300 && result.data?.inventory) {
        const savedReport = normalizeInventoryReport(result.data.inventory)
        setReports((current) => [
          savedReport,
          ...current.filter((currentReport) => currentReport.date !== reportDate),
        ])
        setCurrentPage(1)
        setProducts((current) => current.map((product) => {
          const updatedStock = report.products.find((item) => item.productId === product._id)?.closingStock
          return updatedStock === undefined ? product : { ...product, stock: updatedStock }
        }))
        toast.success(result.data.message || 'Daily inventory report saved')
      } else {
        toast.error(result?.response?.data?.message || 'Unable to save the inventory report')
      }
    } catch (error) {
      // console.error('Unable to save inventory report', error)
      toast.error('Unable to save the inventory report')
    } finally {
      setSavingReport(false)
    }
  }

  

  const confirmDeleteReport = async () => {
    if (!deleteReport) return
    try {
      const result = await deleteInventoryApi(deleteReport.id)
      if (!(result?.status >= 200 && result.status < 300)) {
        toast.error(result?.response?.data?.message || 'Unable to delete the report')
        return
      }
      const nextReports = reports.filter((report) => report.id !== deleteReport.id)
      setReports(nextReports)
      if (selectedReport?.id === deleteReport.id) setSelectedReport(null)
      setDeleteReport(null)
      toast.success(result.data.message || 'Inventory report deleted')
    } catch (error) {
      // console.error('Unable to delete inventory report', error)
      toast.error('Unable to delete the report')
    }
  }

  const focusStockAdded = () => {
    document.querySelector('.inventory-stock-added')?.focus()
  }

  return (
    <div className="admin-page-shell inventory-shell">
      <Sidebar activeItem="Inventory" />
      <main className="inventory-content">
        <AdminHeader className="inventory-topbar" />

        <div className="inventory-main">
          <header className="inventory-hero">
            <p className="inventory-breadcrumb"><FontAwesomeIcon icon={faLeaf} aria-hidden="true" /> Admin <span>›</span> Inventory Management</p>
            <h1>Inventory Management</h1>
            <p>Track daily stock movement, stock additions and product sales</p>
          </header>

          <section className="inventory-stat-grid" aria-label="Inventory summary">
           
            <article className="inventory-stat-card">
              <span className="inventory-stat-icon is-green"><FontAwesomeIcon icon={faShoppingCart} aria-hidden="true" /></span>
              <div><p>Units Sold Today</p><strong>{unitsSoldToday}</strong></div>
              <FontAwesomeIcon className="inventory-stat-leaf" icon={faLeaf} aria-hidden="true" />
            </article>
            <article className="inventory-stat-card blue">
              <span className="inventory-stat-icon is-blue"><FontAwesomeIcon icon={faPlus} aria-hidden="true" /></span>
              <div><p>Stock Added Today</p><strong>{unitsAddedToday}</strong></div>
              <FontAwesomeIcon className="inventory-stat-leaf" icon={faLeaf} aria-hidden="true" />
            </article>
            <article className="inventory-stat-card gold">
              <span className="inventory-stat-icon is-gold"><FontAwesomeIcon icon={faTriangleExclamation} aria-hidden="true" /></span>
              <div><p>Products Requiring Restock</p><strong>{restockCount}</strong></div>
              <FontAwesomeIcon className="inventory-stat-leaf" icon={faLeaf} aria-hidden="true" />
            </article>
          </section>

          <div className="inventory-dashboard-grid">
            <div className="inventory-primary-column">
              <section className="inventory-panel inventory-report-panel">
                <div className="inventory-panel-heading">
                  <div>
                    <h2><FontAwesomeIcon icon={faLeaf} aria-hidden="true" /> Create Daily Report</h2>
                    <p>Add the daily stock movement details for each product.</p>
                  </div>
                  <label className="inventory-date-picker">
                    <FontAwesomeIcon icon={faCalendarDays} aria-hidden="true" />
                    <input type="date" value={reportDate} onChange={(event) => setReportDate(event.currentTarget.value)} aria-label="Report date" />
                  </label>
                </div>

                <div className="inventory-table-scroll">
                  <table className="inventory-table">
                    <thead>
                      <tr>
                        <th>Product</th>
                        <th>Opening Stock/kg</th>
                        <th>Units Sold/kg</th>
                        <th>Stock Added/kg</th>
                        <th>Closing Stock/kg</th>
                      </tr>
                    </thead>
                    <tbody>
                     {loading ? (
                       <tr><td className="inventory-empty" colSpan="5">Loading products...</td></tr>
                     ) : draftRows.length === 0 ? (
                       <tr><td className="inventory-empty" colSpan="5">No products found.</td></tr>
                     ) : draftRows.map((row) => (
                       <tr key={row.productId}>
                          <td>
                            <div className="inventory-product">
                              {row.image && <img src={`${serverUrl}/uploads/${row.image}`} alt="" />}
                              <span><strong>{row.title}</strong><small>{row.varient}</small></span>
                            </div>
                          </td>
                          <td><input className="inventory-number-input" type="number" min={0} value={row.openingStock} readOnly aria-label={`${row.title} opening stock`} /></td>
                          <td><input className="inventory-number-input" type="number" min={0} max={row.openingStock} value={row.unitsSold} disabled={Number(row.openingStock) <= 0} onChange={(event) => updateDraftRow(row.productId, 'unitsSold', event.currentTarget.value)} aria-label={`${row.title} units sold`} /></td>
                          <td><input className="inventory-number-input" type="number" min={0} value={row.stockAdded} onChange={(event) => updateDraftRow(row.productId, 'stockAdded', event.currentTarget.value)} aria-label={`${row.title} stock added`} /></td>
                          <td><input className="inventory-number-input" type="number" value={calculateClosingStock(row)} readOnly aria-label={`${row.title} closing stock`} /></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="inventory-report-actions">
                  <div></div>
                  <button className="inventory-button is-primary" type="button" onClick={saveDailyReport} disabled={loading || savingReport || draftRows.length === 0}><FontAwesomeIcon icon={faSave} /> {savingReport ? 'Saving...' : 'Save Daily Report'}</button>
                </div>
              </section>

              <section className="inventory-panel inventory-history-panel">
                <div className="inventory-panel-heading inventory-history-heading">
                  <h2><FontAwesomeIcon icon={faClockRotateLeft} aria-hidden="true" /> Daily Report History</h2>
                  <div className="inventory-history-filters">
                    <label className="inventory-search">
                      <FontAwesomeIcon icon={faMagnifyingGlass} aria-hidden="true" />
                      <input type="search" value={searchDate} onChange={(event) => { setSearchDate(event.currentTarget.value); setCurrentPage(1) }} placeholder="Search by date (e.g. 22 Oct 2026)" aria-label="Search reports by date" />
                    </label>
                    <label className="inventory-range-filter">
                      <FontAwesomeIcon icon={faCalendarDays} aria-hidden="true" />
                      <select value={historyRange} onChange={(event) => { setHistoryRange(event.currentTarget.value); setCurrentPage(1) }} aria-label="Filter report date range">
                        <option>All Dates</option><option>Last 7 days</option><option>Last 30 days</option><option>This Month</option>
                      </select>
                      <FontAwesomeIcon icon={faChevronDown} aria-hidden="true" />
                    </label>
                  </div>
                </div>

                <div className="inventory-table-scroll">
                  <table className="inventory-table inventory-history-table">
                    <thead><tr><th>Date</th><th>Products</th><th>Units Sold</th><th>Units Added</th><th>Status</th><th>Actions</th></tr></thead>
                    <tbody>
                      {paginatedReports.length === 0 ? (
                        <tr><td className="inventory-empty" colSpan="6">No saved reports found.</td></tr>
                      ) : paginatedReports.map((report) => (
                        <tr key={report.id}>
                          <td>{formatReportDate(report.date)}</td>
                          <td>{report.rows.length}</td>
                          <td>{report.rows.reduce((sum, row) => sum + Number(row.unitsSold || 0), 0)}</td>
                          <td>{report.rows.reduce((sum, row) => sum + Number(row.stockAdded || 0), 0)}</td>
                          <td><span className="inventory-saved-badge">Saved</span></td>
                          <td>
                            <div className="inventory-history-actions">
                              <button className="inventory-button is-small" type="button" onClick={() => setSelectedReport(selectedReport?.id === report.id ? null : report)}><FontAwesomeIcon icon={faEye} /> View</button>
                              <button className="inventory-icon-button is-delete" type="button" aria-label={`Delete report for ${formatReportDate(report.date)}`} onClick={() => setDeleteReport(report)}><FontAwesomeIcon icon={faTrash} /></button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {selectedReport && (
                  <div className="inventory-report-details">
                    <div className="inventory-report-details-heading">
                      <strong>Report details · {formatReportDate(selectedReport.date)}</strong>
                      <button type="button" aria-label="Close report details" onClick={() => setSelectedReport(null)}><FontAwesomeIcon icon={faXmark} /></button>
                    </div>
                    {selectedReport.rows.map((row) => (
                      <p key={row.productId}>{row.title}<span>Opening {row.openingStock} · Sold {row.unitsSold} · Added {row.stockAdded} · Closing {row.closingStock}</span></p>
                    ))}
                  </div>
                )}

                {pageCount > 1 && (
                  <nav className="inventory-pagination" aria-label="Inventory report pages">
                    <button type="button" onClick={() => setCurrentPage(displayedPage - 1)} disabled={displayedPage === 1} aria-label="Previous page">‹</button>
                    {Array.from({ length: pageCount }, (_, index) => index + 1).map((page) => (
                      <button key={page} type="button" onClick={() => setCurrentPage(page)} aria-current={page === displayedPage ? 'page' : undefined}>{page}</button>
                    ))}
                    <button type="button" onClick={() => setCurrentPage(displayedPage + 1)} disabled={displayedPage === pageCount} aria-label="Next page">›</button>
                    <span>Showing {(displayedPage - 1) * reportsPerPage + 1}–{Math.min(displayedPage * reportsPerPage, filteredReports.length)} of {filteredReports.length} reports</span>
                  </nav>
                )}
              </section>
            </div>

          
          </div>
        </div>
      </main>
      <ToastContainer position="top-right" autoClose={3000} theme="colored" />
    </div>
  )
}

export default Admininventory
