import React from 'react'
import Sidebar from '../../components/admincomponents/Sidebar'
import { useMemo, useState, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAlignLeft, faBell, faBold, faCalendarDays, faCheckCircle, faCloudArrowUp, faEdit, faEllipsisVertical, faEye, faFileLines, faImage, faItalic, faLeaf, faLink, faList, faMagnifyingGlass, faPlus, faTrash, faUnderline, faXmark, faUserSlash } from '@fortawesome/free-solid-svg-icons'
import './Admincustomers.css'
import { ToastContainer, toast } from 'react-toastify';
import { deleteAUsersApi, getAllOrdersApi, getAllUsersApi } from '../../services/allApi'
import AdminHeader from '../../components/admincomponents/AdminHeader'




//basic logic
const ADMIN_EMAIL = 'greengoldspices.ndkm@gmail.com'

const formatJoinedDate = (createdAt) => {
    const joinedDate = new Date(createdAt)
    return Number.isNaN(joinedDate.getTime())
        ? 'Date unavailable'
        : joinedDate.toLocaleString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            timeZone: 'Asia/Kolkata',
        })
}

function StatCard({ icon, label, value, detail, tone = 'green' }) {
    return <article className={`blog-stat-card ${tone}`}><span className="blog-stat-icon"><FontAwesomeIcon icon={icon} /></span><div><p>{label}</p><strong>{value}</strong><small>{detail}</small></div><FontAwesomeIcon className="stat-leaf" icon={faLeaf} /></article>
}





function Admincustomers() {


    //state----------------------------
    const [search, setSearch] = useState("")
    const [allusers, setAllUsers] = useState([])
    const [allOrders, setAllOrders] = useState([])
    const [deleteStatus, setDeleteStatus] = useState(false)



    //function----------------------------

    //get all users and orders
    const getAllUsers = async () => {
        const [usersResult, ordersResult] = await Promise.all([
            getAllUsersApi(),
            getAllOrdersApi(),
        ])
        if (usersResult?.status >= 200 && usersResult.status < 300 && Array.isArray(usersResult.data?.allUsers)) {
            setAllUsers(usersResult.data.allUsers)
        } else {
            toast.error(usersResult?.response?.data?.message || 'Unable to load customers')
        }
        if (ordersResult?.status >= 200 && ordersResult.status < 300 && Array.isArray(ordersResult.data)) {
            setAllOrders(ordersResult.data)
        } else {
            toast.error(ordersResult?.response?.data?.message || 'Unable to load customer orders')
        }
    }


 //delete particular user
    const deleteUser = async (id) => {
        const result = await deleteAUsersApi(id)
        if (result.status >= 200 && result.status < 300) {
            setDeleteStatus(!deleteStatus)
        }
        else {
            toast.error("Something went wrong")
        }
    }

   
    //display users other than admin
    const customers = useMemo(
        () => allusers.filter((item) => item.email?.toLowerCase() !== ADMIN_EMAIL),
        [allusers]
    )
    //search customer
    const filteredCustomers = useMemo(() => {
        const query = search.trim().toLowerCase()
        if (!query) return customers

        return customers.filter((customer) => {
            const phoneNumbers = Array.isArray(customer.address)
                ? customer.address.map((address) => address?.mobileno || '').join(' ')
                : ''
            return [customer.name, customer.email, phoneNumbers]
                .some((value) => String(value || '').toLowerCase().includes(query))
        })
    }, [customers, search])


    //order count of users
    const orderCounts = useMemo(() => {
        const customerIdByEmail = new Map(
            customers.map((customer) => [customer.email?.toLowerCase(), String(customer._id)])
        )
        const countsByUserId = new Map()
        allOrders.forEach((order) => {
            const userId = order.userId
                ? String(order.userId)
                : customerIdByEmail.get(order.email?.toLowerCase())
            if (userId) countsByUserId.set(userId, (countsByUserId.get(userId) || 0) + 1)
        })
        return countsByUserId
    }, [allOrders, customers])


    const currentDate = new Date() //current date

    //customer who have more than 10 orders - active customer
    const activeCustomersCount = customers.filter((customer) => (
        (orderCounts.get(String(customer._id)) || 0) > 10
    )).length

    //customer joined current month - new customer
    const newCustomersCount = customers.filter((customer) => {
        const joinedDate = new Date(customer.createdAt)
        return !Number.isNaN(joinedDate.getTime()) &&
            joinedDate.getFullYear() === currentDate.getFullYear() &&
            joinedDate.getMonth() === currentDate.getMonth()
    }).length



 //Side effect-----------------------------------

     useEffect(() => {
        getAllUsers()

    }, [deleteStatus])




    //output- jsx -----------------------------------------------

    return (
        <div className="admin-page-shell admin-blog-page">
            <Sidebar activeItem="Customers" />
            <main className="admin-blog-content">
                <AdminHeader className="admin-blog-topbar" />

                <section className="admin-blog-main">
                    <div className="admin-blog-heading">
                        <div>
                            <div className="admin-blog-breadcrumb">
                                <FontAwesomeIcon icon={faLeaf} /> Admin <span>›</span> Customer</div>
                            <h1>Customer Management</h1>
                            <p>Manage Your Customer and view their details</p>
                        </div>

                    </div>

                    <div className="blog-stat-grid">
                        <StatCard icon={faFileLines} label="Total Customers" value={customers.length} />
                        <StatCard icon={faCheckCircle} label="Active Customers" value={activeCustomersCount} detail="More than 10 orders" />
                        <StatCard icon={faFileLines} label="New Customers" value={newCustomersCount} detail="Joined this month" tone="blue" />
                    </div>

                    <div >
                        <section className="admin-blog-table-panel">
                            <div className="blog-filter-row">
                                <label>
                                    <FontAwesomeIcon icon={faMagnifyingGlass} />
                                    <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search Customers by name,email,phone..." />
                                </label>


                            </div>
                            <div className="blog-table-scroll">
                                <table className="admin-blog-table">
                                    <thead>
                                        <tr>

                                            <th>Featured Image</th>
                                            <th>Name</th>
                                            <th>Email</th>
                                            <th>Phone Number</th>
                                            <th>Total Order</th>

                                            <th>Joined Date</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>

                                        {filteredCustomers.map((user) => (
                                            <tr key={user._id}>

                                                <td>
                                                    <span className="admin-account-avatar">{user.name[0].toUpperCase()}</span>
                                                </td>
                                                <td>
                                                    <strong>{user.name}</strong>
                                                    {/* <small>post.description</small> */}
                                                </td>
                                                <td>
                                                    <span>{user.email}</span>
                                                </td>
                                                <td>{user.address.map((item) => item.mobileno)}</td>

                                                <td>{orderCounts.get(String(user._id)) || 0}</td>

                                                <td>{formatJoinedDate(user.createdAt)}</td>
                                                <td>

                                                    <div className="blog-row-actions">

                                                        <button onClick={() => deleteUser(user._id)} type="button" aria-label="Delete" style={{ backgroundColor: 'red' }}>
                                                            <FontAwesomeIcon icon={faTrash} />
                                                        </button>

                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                        {filteredCustomers.length === 0 && (
                                            <tr>
                                                <td colSpan="7" className="text-center">No customers match your search.</td>
                                            </tr>
                                        )}


                                    </tbody>
                                </table>
                            </div>
                        </section>


                    </div>
                </section>
            </main>
            <ToastContainer position='top-right' autoClose={3000} theme='colored' />
        </div>
    )
}

export default Admincustomers
