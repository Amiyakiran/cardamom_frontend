import { useContext, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRight, faCircleExclamation, faPenToSquare, faBagShopping, faBoxOpen, faCreditCard, faEnvelope, faHeart, faLocationDot, faTrashCan, faShoppingBag, faMinus } from '@fortawesome/free-solid-svg-icons'
import Header from '../components/Header'
import { AuthContext } from '../context/ContextShare'
import { addToCartApi, decrementProductCountApi, deleteAddressApi, deleteFromCartApi, deleteFromWishlistApi, emptyCartApi, getAllCartItemApi, getallUserOrderApi, getAllWishlistProductApi, getMeApi, incrementProductCountApi, placeOrderApi, UpdateAdressApi, updateProductQuantityApi, updateProfileImageApi } from '../services/allApi'
import './Profile.css'
import Footer from '../components/Footer'
import { serverUrl } from '../services/serverUrl'
import { ToastContainer, toast } from 'react-toastify';
import Modal from 'react-bootstrap/Modal';


const formatOrderDate = (createdAt) => {
  const date = new Date(createdAt)
  return Number.isNaN(date.getTime())
    ? 'Date unavailable'
    : date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      timeZone: 'Asia/Kolkata',
    })
}

const orderProgressSteps = ['Placed', 'Payment Confirmed', 'Shipped', 'Delivered']
const getOrderProgressIndex = (status) => {
  const normalizedStatus = String(status || '').trim().toLowerCase()
  const displayStatus = normalizedStatus === 'pending' ? 'placed' : normalizedStatus
  const index = orderProgressSteps.findIndex((step) => step.toLowerCase() === displayStatus)
  return index < 0 ? 0 : index
}

export default function Profile() {

  //states
  const { user, loading, userId } = useContext(AuthContext)
  const [profile, setProfile] = useState("")
  const [profileLoading, setProfileLoading] = useState(true)
  const [wishlistArray, setWishListArray] = useState([])
  const [wishlistPage, setWishlistPage] = useState(1)
  const [ordersPage, setOrdersPage] = useState(1)
  const [cartArray, setCartArray] = useState([])
  const [userOrders, setUserOrders] = useState([])
  const [ordersLoading, setOrdersLoading] = useState(false)
  const [deleteStatus, setDeleteStatus] = useState(false)
  const [show, setShow] = useState(false);
  const [addressSaving, setAddressSaving] = useState(false)
  const [addressValidationVisible, setAddressValidationVisible] = useState({})
  const [address, setAddress] = useState({ fullname: "", mobileno: "", flat: "", street: "", landmark: "", city: "", state: "", pincode: "" })
  const [confirmedAddress, setConfirmedAddress] = useState(null)
  const [show1, setShow1] = useState(false);

  // console.log(profile);
  // console.log(address);
   // console.log(wishlistArray);


  //functions

  const handleClose1 = () => {
    setShow1(false)
    setConfirmedAddress(null)
  }


  const handleShow1 = () => {
    if(cartArray.length==0){
        toast.error('Please add Product to place order')
    }else{
      setConfirmedAddress(null)
    setShow1(true)
    }
  }


  const handleClose = () => {
    if (addressSaving) return
    setShow(false)
    setAddress({
      fullname: "",
      mobileno: "",
      flat: "",
      street: "",
      landmark: "",
      city: "",
      state: "",
      pincode: ""
    })
    setAddressValidationVisible({})
  };

  const handleShow = () => setShow(true);
  const showAddressValidation = (event) => {
    const { name } = event.target
    setAddressValidationVisible((current) => ({ ...current, [name]: true }))
  }
  const handleAddressChange = (event) => {
    const { name, value } = event.target
    const digitLimits = { mobileno: 10, pincode: 6 }
    const nextValue = name in digitLimits
      ? value.replace(/\D/g, '').slice(0, digitLimits[name])
      : value
    setAddress((currentAddress) => ({ ...currentAddress, [name]: nextValue }))
  }
  const displayName = profile?.name || user
  const initials = displayName
    ? displayName.split(' ').filter(Boolean).slice(0, 2).map((part) => part[0]).join('').toUpperCase()
    : 'GG'
  const wishlistPageSize = 3
  const wishlistPageCount = Math.ceil(wishlistArray.length / wishlistPageSize)
  const currentWishlistPage = Math.min(wishlistPage, Math.max(1, wishlistPageCount))
  const paginatedWishlist = wishlistArray.slice(
    (currentWishlistPage - 1) * wishlistPageSize,
    currentWishlistPage * wishlistPageSize
  )
  const sortedOrders = [...userOrders].sort((first, second) => {
    const firstDate = new Date(first.createdAt).getTime()
    const secondDate = new Date(second.createdAt).getTime()
    if (Number.isNaN(firstDate)) return Number.isNaN(secondDate) ? 0 : 1
    if (Number.isNaN(secondDate)) return -1
    return secondDate - firstDate
  })
  const ordersPageSize = 2
  const ordersPageCount = Math.ceil(userOrders.length / ordersPageSize)
  const currentOrdersPage = Math.min(ordersPage, Math.max(1, ordersPageCount))
  const paginatedOrders = sortedOrders.slice(
    (currentOrdersPage - 1) * ordersPageSize,
    currentOrdersPage * ordersPageSize
  )


  //function to get all wishlist 
  const getWishlist = async () => {
    const result = await getAllWishlistProductApi(userId)
    // console.log(result);
    setWishListArray(result.data.wishlist)

  }



  //function to get all cart product
  const getAllCartItem = async () => {
    const result = await getAllCartItemApi(userId)
    // console.log(result);
    setCartArray(result.data.allcartProduct)

  }
  // console.log(cartArray);

  //function to delete from wishlist
  const deleteItemFromWishlist = async (productid) => {
    const result = await deleteFromWishlistApi(productid, { userId })

    if (result.status >= 200 && result.status < 300) {
      toast.success("Deleted Successfully")
      setDeleteStatus(!deleteStatus)
    }
    else {
      toast.error("Something went wrong")
    }
  }

  //add to cart
  const addToCart = async (pro) => {
    const result = await addToCartApi(userId, pro)
    // console.log(result);

    if (result.status >= 200 && result.status < 300) {
      await deleteFromWishlistApi(pro.productid, { userId: userId })
      toast.success("Add to cart Successfully")
      setDeleteStatus(!deleteStatus)
    }
    else {
      toast.error("Something went wrong")
    }
  }

  //delete from cart
  const deleteFromCart = async (productid) => {
    const result = await deleteFromCartApi(productid, { userId })
    // console.log(result);
    if (result.status >= 200 && result.status < 300) {
      toast.success("Deleted Successfully")
      setDeleteStatus(!deleteStatus)
    }
    else {
      toast.error("Something went wrong")
    }

  }

  //increment the product Count
  const incrementProductCount = async (productid) => {
    const result = await incrementProductCountApi(productid, { userId })
    // console.log(result);

    if (result.status >= 200 && result.status < 300) {
      setDeleteStatus(!deleteStatus)
    }
    else {
      toast.error('Something went wrong')
    }
  }


  //decrement the product Count
  const decrementProductCount = async (productid) => {
    const result = await decrementProductCountApi(productid, { userId })
    // console.log(result);

    if (result.status >= 200 && result.status < 300) {
      setDeleteStatus(!deleteStatus)
    }
    else {
      toast.error('Something went wrong')
    }
  }


  //update quantity
  const updateQuantity = async (productid, quantity) => {
    // console.log(productid, quantity);
    const result = await updateProductQuantityApi(productid, { userId, quantity })
    // console.log(result);
    if (result.status >= 200 && result.status < 300) {
      setDeleteStatus(!deleteStatus)
    }
    else {
      toast.error('Something went wrong')
    }

  }

  //update profile image
  const updateProfileImage = async (profileImage) => {
    // console.log(profileImage);
    const reqBody = new FormData()
    reqBody.append("image", profileImage)

    const header = {
      "Content-Type": "multipart/form-data"
    }
    const result = await updateProfileImageApi(userId, reqBody, header)
    // console.log(result);
    if (result.status >= 200 && result.status < 300) {
      setProfile({ ...profile, photo: result.data.photo })
    } else {
      toast.error('Something went wrong')
    }



  }

  //update Address
  const updateAddress = async (event) => {
    event.preventDefault()
    setAddressSaving(true)
    try {
      const result = await UpdateAdressApi(userId, address)
      if (result.status >= 200 && result.status < 300) {
        toast.success(result.data.message)
        setProfile((currentProfile) => ({
          ...currentProfile,
          address: [...(currentProfile?.address ?? []), address]
        }))
        setShow(false)
        setAddress({
          fullname: "",
          mobileno: "",
          flat: "",
          street: "",
          landmark: "",
          city: "",
          state: "",
          pincode: ""
        })
      } else {
        toast.error('Something went wrong')
      }
    } catch {
      toast.error('Something went wrong')
    } finally {
      setAddressSaving(false)
    }

  }

  //delete address
  const deleteAddress = async (index) => {
    try {
      const result = await deleteAddressApi(userId, { index })
      if (result?.status === 200) {
        setProfile((currentProfile) => currentProfile ? {
          ...currentProfile,
          address: (currentProfile.address ?? []).filter((_, addressIndex) => addressIndex !== index)
        } : currentProfile)
      } else {
        toast.error('Something went wrong')
      }
    } catch {
      toast.error('Something went wrong')
    }
  }

  //handle order placement
  const handleOrderPlacement = async () => {
    if (!confirmedAddress || Object.keys(confirmedAddress).length === 0) {
      toast.info('Please select an address')
      return
    }

    const reqBody = {
      name: profile.name,
      email: profile.email,
      address: confirmedAddress,
      products: cartArray,
      amount: cartArray.map((item) => item.total).reduce((p1, p2) => p1 + p2) + 60
    }
    const result = await placeOrderApi(reqBody)
    //console.log(result);
    if (result.status >= 200 && result.status < 300) {
      toast.success(result.data.message)
      handleClose1()
      getUserOrders(profile.email)
      let phone = '+918113804245'
      let Daddress = result.data.order.address
      const message = `
🛒 *Order Details*

Order ID: ${result.data.order.orderId}
Total items : ${result.data.order.products.length}
Amount: ₹${result.data.order.TotalAmount}
Placed Date: ${new Date(result.data.order.createdAt).toLocaleString('en-IN', {
        dateStyle: 'medium',
        timeStyle: 'short',
        timeZone: 'Asia/Kolkata',
      })}
Delivery Address: ${Daddress.flat} ${Daddress.landmark} ${Daddress.street} ${Daddress.city} ${Daddress.state}, ${Daddress.pincode}, ${Daddress.mobileno}


Please follow the provided instructions to complete your payment. Kindly include your **Order ID** in the payment reference or remarks, and share a screenshot of the successful transaction for verification. Your order will be confirmed once the payment has been received and verified.
                    `;

      const whatsappURL = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;

      window.open(whatsappURL, "_blank");
      handleClose1()
      const clearCartResult = await emptyCartApi(userId)
      if (clearCartResult?.status >= 200 && clearCartResult?.status < 300) {
        setCartArray([])
      } else {
        toast.error(
          clearCartResult?.response?.data?.message ||
          'Order placed, but we could not clear your cart. Please try again.'
        )
      }
    }
    else {
      toast.error("Something went wrong")
    }
  }

  //get user orders
  const getUserOrders = async (email) => {
    if (!email) return

    setOrdersLoading(true)
    const result = await getallUserOrderApi(email)
    if (result?.status >= 200 && result.status < 300 && Array.isArray(result.data)) {
      setUserOrders(result.data)
      setOrdersPage(1)
    } else {
      setUserOrders([])
      setOrdersPage(1)
      toast.error(result?.response?.data?.message || 'Unable to load your orders')
    }
    setOrdersLoading(false)
  }

  //useEffects
  useEffect(() => {
    setWishlistPage((page) => Math.min(page, Math.max(1, wishlistPageCount)))
  }, [wishlistPageCount])

  useEffect(() => {
    if (loading) return undefined
    if (!user) {
      setProfile(null)
      setProfileLoading(false)
      return undefined
    }

    let isCurrent = true
    const loadProfile = async () => {
      const result = await getMeApi()
      if (!isCurrent) return
      setProfile(
        result?.status === 200 && result.data?.user
          ? {
            ...result.data.user,
            address: Array.isArray(result.data.user.address)
              ? result.data.user.address
              : [],
          }
          : { name: user, email: '', address: [] }
      )
      setProfileLoading(false)
    }

    loadProfile()


    return () => { isCurrent = false }
  }, [loading, user])

  useEffect(() => {
    if (userId) {
      getWishlist()
      getAllCartItem()
    }
  }, [deleteStatus, userId])

  useEffect(() => {
    if (profile?.email) {
      getUserOrders(profile.email)
    }
  }, [profile?.email, user])



  return (
    <div className="profile-page">
      <Header />
      <div className="profile-hero" fetchPriority="high" decoding="async">
        <div className='overlayer' />
        <header className="profile-heading">
          <p className="profile-eyebrow mini-title"><span>♧</span>Your account <i /></p>
          <h1>Hello, {displayName.charAt(0).toUpperCase() + displayName.slice(1)}</h1>
          <p>Manage your profile, orders, and preferences.</p>
        </header>
      </div>
      <main className="profile-content">
        {profileLoading ? (
          <div className="profile-loading" role="status">Loading your account...</div>
        ) : profile ? (
          <div className="profile-layout">
            <aside className="profile-sidebar" aria-label="Account navigation">
              <div className="profile-identity">
                <h2>PROFILE</h2>
                <h1>Everything you need, <br /> all in one place.</h1>
                <p style={{ marginTop: '15px', color: '#6b675c', }}>Make it uniquely yours.</p>

              </div>

              <div className="profile-sidebar-note">
                <p>Good food begins<br />with great spices.</p>
              </div>
            </aside>

            <section className="profile-details" aria-label="Your account details">





              {/* wishlist */}
              <section className="profile-card profile-cart-card" style={{ marginTop: '20px' }}>
                <div className="profile-cart-heading">
                  <div><h2>Your Wishlist</h2><span>Save what you love.</span></div>
                  <FontAwesomeIcon icon={faHeart} aria-hidden="true" />
                </div>
                {wishlistArray.length == 0 ? <div className="profile-cart-empty">
                  <span className="profile-cart-icon"><FontAwesomeIcon icon={faBagShopping} /></span>
                  <p>Your basket is waiting for something good.</p>
                </div> :
                  <div className="wishlist-items">
                    <div className="row w-100">
                      {paginatedWishlist.map((pro, index) => (
                        <div className="col-md-4" key={index}>
                          <div className="card border-0 shadow-none my-3 w-100 p-0 rounded-0" >
                            <img src={`${serverUrl}/uploads/${pro.image}`} alt={pro.title} style={{ height: '100px' }} loading="lazy" decoding="async" />
                            <p className='card-title mt-1 px-1'>{pro.title}</p>
                            <p className='card-des px-1'>{pro.description.slice(0, 55)}...</p>
                            <div className='d-flex justify-content-between px-1'>
                              <p className='mt-3'>{pro.price}<span style={{ color: 'rgba(128, 128, 128, 0.523)' }}>/kg</span></p>
                              <div className='d-flex'>
                                <button onClick={() => addToCart(pro)} className='btn btn-outline-success me-2'><FontAwesomeIcon icon={faShoppingBag} /></button>
                                <button type='button' onClick={() => deleteItemFromWishlist(pro.productid)} className='btn btn-outline-danger'><FontAwesomeIcon icon={faTrashCan} /></button>
                              </div>
                            </div>
                          </div>

                        </div>
                      ))}

                    </div>
                  </div>}
                {wishlistPageCount > 1 && (
                  <nav className="profile-pagination" aria-label="Wishlist pages">
                    <button
                      type="button"
                      onClick={() => setWishlistPage(currentWishlistPage - 1)}
                      disabled={currentWishlistPage === 1}
                      aria-label="Previous wishlist page"
                    >Previous</button>
                    {Array.from({ length: wishlistPageCount }, (_, index) => index + 1).map((page) => (
                      <button
                        type="button"
                        key={page}
                        onClick={() => setWishlistPage(page)}
                        aria-label={`Wishlist page ${page}`}
                        aria-current={page === currentWishlistPage ? 'page' : undefined}
                      >{page}</button>
                    ))}
                    <button
                      type="button"
                      onClick={() => setWishlistPage(currentWishlistPage + 1)}
                      disabled={currentWishlistPage === wishlistPageCount}
                      aria-label="Next wishlist page"
                    >Next</button>
                  </nav>
                )}
                <Link className="profile-primary-link" to="/all-products">Browse spices <FontAwesomeIcon icon={faArrowRight} aria-hidden="true" /></Link>
              </section>


              {/* cart items */}
              <section className="profile-card profile-cart-card" style={{ marginTop: '20px' }}>
                <div className="profile-cart-heading">
                  <div><h2>Your Cart</h2><span>Ready when you are</span></div>
                  <FontAwesomeIcon icon={faBagShopping} aria-hidden="true" />
                </div>
                {cartArray.length == 0 ? <div className="profile-cart-empty">
                  <span className="profile-cart-icon"><FontAwesomeIcon icon={faBagShopping} /></span>
                  <p>Your basket is waiting for something good.</p>
                </div> :
                  <div className='table-responsive'>
                    <table className="table table-bordered">
                      <thead>
                        <tr>
                          <th>Item</th>
                          <th>Name</th>
                          <th>Price</th>
                          <th>Quantity</th>
                          <th>Count</th>
                          <th>Total</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {/* Cart items would be populated here */}
                        {cartArray.map((pro, index) => (
                          <tr key={index}>
                            <td>
                              <img src={`${serverUrl}/uploads/${pro.image}`} alt={pro.title} style={{ width: '100px', height: '50px' }} loading="lazy" decoding="async" />
                            </td>
                            <td><p>{pro.title}</p>
                              <small >{pro.varient}</small>
                            </td>
                            <td>{pro.price}/kg</td>
                            <td>
                              <select name="" id="" style={{ width: '50px' }} className='form-control' onChange={(e) => updateQuantity(pro.productid, e.target.value)}>
                                <option value={1000}>1kg </option>
                                <option value={500}>500g</option>
                                <option value={250}>250g</option>
                                <option value={100}>100g</option>
                              </select>
                            </td>
                            <td>
                              <div className='d-flex'>
                                <button type='button' onClick={() => decrementProductCount(pro.productid)} className='btn btn-outline-danger w-25 me-2 border-1 border-danger'>-</button>

                                <input type="text" readOnly className='form-control me-2' style={{ width: '50px' }} value={pro.count} />
                                <button type='button' onClick={() => incrementProductCount(pro.productid)} className='btn btn-outline-success w-25 border-1 border-success'>+</button>
                              </div>
                            </td>
                            <td>{pro.total}</td>
                            <td>
                              <button onClick={() => deleteFromCart(pro.productid)} className='btn btn-outline-danger'><FontAwesomeIcon icon={faTrashCan} /></button>
                            </td>

                          </tr>
                        ))}

                      </tbody>
                    </table>
                    <div className='mb-4  total'>
                      <p>Total Number of Item :  {cartArray.length}</p>
                      <p>Items Price:   ₹ {cartArray.map((item) => item.total).reduce((p1, p2) => p1 + p2)} </p>
                      <p>Delivery Charge:   ₹ 60</p>
                      <h5 style={{ fontFamily: 'var(--font-display)' }}>Grand Total :   <span style={{ fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif' }}>₹ {cartArray.map((item) => item.total).reduce((p1, p2) => p1 + p2) + 60}</span></h5>
                    </div>
                  </div>}
                <Link onClick={handleShow1} className="profile-primary-link" >Place the Order<FontAwesomeIcon icon={faArrowRight} aria-hidden="true" /></Link>
              </section>

              <section className="profile-card profile-info-card" id="orders">
                <div className="profile-card-heading"><h2> Orders History</h2><FontAwesomeIcon icon={faBoxOpen} aria-hidden="true" /></div>
                {ordersLoading ? (
                  <p className="profile-empty-copy" role="status">Loading your orders...</p>
                ) : userOrders.length === 0 ? (
                  <p className="profile-empty-copy">Your order history will appear here once you’ve placed an order.</p>
                ) : (
                  <div className="profile-order-list">
                    {paginatedOrders.map((order) => (
                      <article className="profile-order-item" key={order._id || order.orderId}>
                        <div className="profile-order-summary">
                          <strong>Order #{order.orderId}</strong>
                          <span>{formatOrderDate(order.createdAt)}</span>
                        </div>
                        <div className="profile-order-summary">
                         <div>
                           {order.products.map((item)=>(
                              <span style={{fontSize:'10px'}}>{item.title} -{item.quantity}g - {item.count} </span>
                            ))}
                         </div>
                          <strong className="profile-order-status">Total : ₹{order.TotalAmount}</strong>
                        </div>
                        <div>
                          <p className='text-success' style={{fontSize:'12px', fontWeight:600}}>Status</p>
                          <ol className="profile-order-stepper" aria-label={`Order status: ${order.status || 'Placed'}`}>
                            {orderProgressSteps.map((step, index) => {
                              const currentStep = getOrderProgressIndex(order.status)
                              const stepState = index < currentStep
                                ? 'is-complete'
                                : index === currentStep
                                  ? 'is-current'
                                  : ''

                              return (
                                <li className={`profile-order-step ${stepState}`} key={step} aria-current={index === currentStep ? 'step' : undefined}>
                                  <span className="profile-order-step-marker">{index + 1}</span>
                                  <span className="profile-order-step-label">{step}</span>
                                </li>
                              )
                            })}
                          </ol>
                        </div>
                      </article>
                    ))}
                  </div>
                )}
                {ordersPageCount > 1 && (
                  <nav className="profile-pagination" aria-label="Order history pages">
                    <button
                      type="button"
                      onClick={() => setOrdersPage(currentOrdersPage - 1)}
                      disabled={currentOrdersPage === 1}
                      aria-label="Previous order history page"
                    >Previous</button>
                    {Array.from({ length: ordersPageCount }, (_, index) => index + 1).map((page) => (
                      <button
                        type="button"
                        key={page}
                        onClick={() => setOrdersPage(page)}
                        aria-label={`Order history page ${page}`}
                        aria-current={page === currentOrdersPage ? 'page' : undefined}
                      >{page}</button>
                    ))}
                    <button
                      type="button"
                      onClick={() => setOrdersPage(currentOrdersPage + 1)}
                      disabled={currentOrdersPage === ordersPageCount}
                      aria-label="Next order history page"
                    >Next</button>
                  </nav>
                )}
              </section>
            </section>

            <aside className="profile-aside" aria-label="Shopping" style={{ marginTop: '15px' }}>

              {/* edit profile  */}
              <section className="profile-card profile-account-card" id="account">
                <label >
                  <div className="profile-card-avatar" aria-hidden="true">
                    {profile?.photo ? <img src={`${serverUrl}/uploads/${profile.photo}`} alt="Profile" loading="lazy" decoding="async" /> : initials}
                    <input type="file" style={{ display: 'none' }} onChange={(e) => updateProfileImage(e.target.files[0])} />
                    <FontAwesomeIcon onClick={handleShow} id='editicon' icon={faPenToSquare} aria-hidden="true" />
                  </div>
                </label>
                <div className="profile-account-fields ">
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <div><span>Full Name</span><strong>{displayName}</strong> </div>
                  </div>
                  <div><span>Email Address</span><strong>{profile.email || 'Not provided'}</strong></div>
                  <div><span>Account</span><strong className="profile-status">Active member</strong></div>
                </div>
              </section>
              <section className="profile-card profile-info-card" id="addresses">
                <div className="profile-card-heading mb-4"><h2>Shipping Address</h2><FontAwesomeIcon icon={faLocationDot} aria-hidden="true" /></div>
                {profile.address.length == 0 ? <p className="profile-empty-copy">No delivery address saved yet. Your address can be added when you place an order.</p> :
                  <div>
                    {profile.address.map((add, index) => (

                      <div className='addressLabel' key={index}>


                        <label className='ms-4' htmlFor="addressInput">
                          <span style={{ fontWeight: 600 }}>{add.fullname}</span> <br />
                          <span>{add.flat}, {add.landmark}, {add.street}, {add.city}, {add.state}, PIN: {add.pincode} </span> <br />
                          <span>{add.mobileno}</span>

                        </label>
                        <FontAwesomeIcon icon={faTrashCan} className='text-danger' onClick={() => deleteAddress(index)} />
                      </div>

                    ))}
                  </div>
                }

                <button type='button' onClick={handleShow} className="profile-primary-link" style={{ marginTop: '20px' }}>Add New Address<FontAwesomeIcon icon={faArrowRight} aria-hidden="true" /></button>

              </section>

              <Link className="profile-promo" to="/all-products" aria-label="Explore Green Gold spices">
                <img src="/assets/dashboardImg.png" alt="Green cardamom and whole spices" loading="lazy" decoding="async" />
                <span className="profile-promo-copy">
                  <strong>Fresh Spices,<br />Better Living</strong>
                  <small>Pure. Natural. Always.</small>
                  <span>Explore more <FontAwesomeIcon icon={faArrowRight} aria-hidden="true" /></span>
                </span>
              </Link>
              <div className="profile-help-card">
                <FontAwesomeIcon icon={faEnvelope} aria-hidden="true" />
                <p>Need a hand with your account?</p>
                <Link to="/contact">Contact us <FontAwesomeIcon icon={faArrowRight} aria-hidden="true" /></Link>
              </div>
            </aside>
          </div>
        ) : (
          <section className="profile-guest">
            <div className="profile-card-avatar" aria-hidden="true">GG</div>
            <p className="profile-eyebrow">Your account</p>
            <h1>Sign in to view your profile</h1>
            <p>Your account details and order updates will be waiting here.</p>
            <Link className="profile-primary-link" to="/login">Go to Login <FontAwesomeIcon icon={faArrowRight} /></Link>
          </section>
        )}
      </main>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title className='Modaltitle'>Add New Address</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form id="address-form" className='form px-4 py-3' onSubmit={updateAddress}>

            <div className='mt-1'>
              <label className="visually-hidden" htmlFor="address-fullname">Full Name</label>
              <input id="address-fullname" name="fullname" type="text" className='form-control rounded-0' placeholder='Full Name' value={address.fullname} onChange={handleAddressChange} required />
            </div>
            <div className='mt-3'>
              <label className="visually-hidden" htmlFor="address-mobileno">Mobile Number</label>
              <input id="address-mobileno" name="mobileno" type="tel" inputMode="numeric" maxLength={10} pattern="[0-9]{10}" title="Enter exactly 10 digits" aria-describedby="address-mobileno-error" aria-invalid={addressValidationVisible.mobileno && !/^\d{10}$/.test(address.mobileno)} className='form-control rounded-0' placeholder='Mobile Number' value={address.mobileno} onChange={handleAddressChange} onBlur={showAddressValidation} onInvalid={showAddressValidation} required />
              {addressValidationVisible.mobileno && !/^\d{10}$/.test(address.mobileno) && <small id="address-mobileno-error" className="text-danger d-block mt-1">* Enter exactly 10 digits.</small>}
            </div>
            <div className='mt-3'>
              <label className="visually-hidden" htmlFor="address-flat">Flat, house, or building</label>
              <input id="address-flat" name="flat" type="text" className='form-control rounded-0' placeholder='Flat, House no, Building, Company, Apartment' value={address.flat} onChange={handleAddressChange} required />
            </div>
            <div className='mt-3'>
              <label className="visually-hidden" htmlFor="address-street">Area, street, sector, or village</label>
              <input id="address-street" name="street" type="text" className='form-control rounded-0' placeholder='Area, Street, Sector, Village' value={address.street} onChange={handleAddressChange} required />
            </div>
            <div className='mt-3'>
              <label className="visually-hidden" htmlFor="address-landmark">Landmark</label>
              <input id="address-landmark" name="landmark" type="text" className='form-control rounded-0' placeholder='Landmark' value={address.landmark} onChange={handleAddressChange} />
            </div>
            <div className='mt-3'>
              <label className="visually-hidden" htmlFor="address-city">Town or city</label>
              <input id="address-city" name="city" type="text" className='form-control rounded-0' placeholder='Town/City' value={address.city} onChange={handleAddressChange} required />
            </div>
            <div className='mt-3'>
              <label className="visually-hidden" htmlFor="address-state">State</label>
              <input id="address-state" name="state" type="text" className='form-control rounded-0' placeholder='State' value={address.state} onChange={handleAddressChange} required />
            </div>
            <div className='mt-3'>
              <label className="visually-hidden" htmlFor="address-pincode">Pincode</label>
              <input id="address-pincode" name="pincode" type="text" inputMode="numeric" maxLength={6} pattern="[0-9]{6}" title="Enter exactly 6 digits" aria-describedby="address-pincode-error" aria-invalid={addressValidationVisible.pincode && !/^\d{6}$/.test(address.pincode)} className='form-control rounded-0' placeholder='Pincode' value={address.pincode} onChange={handleAddressChange} onBlur={showAddressValidation} onInvalid={showAddressValidation} required />
              {addressValidationVisible.pincode && !/^\d{6}$/.test(address.pincode) && <small id="address-pincode-error" className="text-danger d-block mt-1">* Enter exactly 6 digits.</small>}
            </div>

          </form>
        </Modal.Body>
        <Modal.Footer className='d-flex'>
          <button className='rounded-5 btn btn-outline-warning border-1 border-warning' style={{ fontSize: '12px' }} onClick={handleClose}>
            Cancel
          </button>
          <button type="submit" form="address-form" disabled={addressSaving} style={{ fontSize: '12px' }} className='rounded-5 btn btn-outline-success border-1 border-success'>
            {addressSaving ? 'Saving...' : 'Update'}
          </button>
        </Modal.Footer>
      </Modal>

      <Modal show={show1} onHide={handleClose1} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Address Confirmation</Modal.Title>
        </Modal.Header>
        <Modal.Body>


          {(profile?.address ?? []).map((add, index) => (
            <div key={add._id || index} className="address-option">
              <input
                type="radio"
                id={`shipping-address-${index}`}
                name="address"
                value={index}
                onChange={() => setConfirmedAddress(add)}
              />
              <label htmlFor={`shipping-address-${index}`} className='ps-2'>
                {[
                  add.fullname,
                  add.flat,
                  add.landmark,
                  add.street,
                  add.city,
                  add.state,
                  add.pincode && `PIN: ${add.pincode}`,
                  add.mobileno && `Phone: ${add.mobileno}`,
                ].filter(Boolean).join(', ')}
              </label>
            </div>
          ))}

          <p className="mt-5 text-danger text-start"><FontAwesomeIcon icon={faCircleExclamation} className="me-2" />By clicking Continue, you will be redirected to our official WhatsApp account to proceed with the payment process. Please follow the instructions provided to complete your payment. Your order will be confirmed once the payment has been received and verified.</p>

        </Modal.Body>
        <Modal.Footer className='d-flex'>
          <button className='btn btn-outline-warning border-1 border-warning w-25' onClick={handleClose1}>
            Close
          </button>
          <button variant="primary" className='btn btn-outline-success border-1 border-success w-25' onClick={handleOrderPlacement}>
            Continue
          </button>
        </Modal.Footer>
      </Modal>
      <ToastContainer position='top-right' autoClose={3000} theme='colored' />
      <Footer />
    </div>
  )
}
