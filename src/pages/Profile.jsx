import { useContext, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRight, faPenToSquare, faBagShopping, faBoxOpen, faCreditCard, faEnvelope, faHeart, faLocationDot, faTrashCan, faShoppingBag, faMinus } from '@fortawesome/free-solid-svg-icons'
import Header from '../components/Header'
import { AuthContext } from '../context/ContextShare'
import { addToCartApi, decrementProductCountApi, deleteFromCartApi, deleteFromWishlistApi, getAllCartItemApi, getAllWishlistProductApi, getMeApi, incrementProductCountApi, updateProductQuantityApi, updateProfileImageApi } from '../services/allApi'
import './Profile.css'
import Footer from '../components/Footer'
import { serverUrl } from '../services/serverUrl'
import { ToastContainer, toast } from 'react-toastify';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';



export default function Profile() {
  const { user, loading, userId } = useContext(AuthContext)
  const [profile, setProfile] = useState(null)
  const [profileLoading, setProfileLoading] = useState(true)
  const [wishlistArray, setWishListArray] = useState([])
  const [wishlistPage, setWishlistPage] = useState(1)
  const [cartArray, setCartArray] = useState([])
  const [deleteStatus, setDeleteStatus] = useState(false)
  const [show, setShow] = useState(false);
  const [address, setAddress] = useState({
    fullname: "",
    mobileno: "",
    flat: "",
    street: "",
    landmark: "",
    city: "",
    state: "",
    pincode: ""
  })

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

 // console.log(profile);
 console.log(address);
 


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
      setProfile(result?.status === 200 && result.data?.user ? result.data.user : { name: user, email: '' })
      setProfileLoading(false)
    }

    loadProfile()
    return () => { isCurrent = false }
  }, [loading, user])

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

  useEffect(() => {
    setWishlistPage((page) => Math.min(page, Math.max(1, wishlistPageCount)))
  }, [wishlistPageCount])

  //function to get all wishlist 
  const getWishlist = async () => {
    const result = await getAllWishlistProductApi(userId)
    // console.log(result);
    setWishListArray(result.data.wishlist)

  }

  console.log(wishlistArray);

  //function to get all cart product
  const getAllCartItem = async () => {
    const result = await getAllCartItemApi(userId)
    console.log(result);
    setCartArray(result.data.allcartProduct)

  }
  console.log(cartArray);

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
    console.log(result);

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
    console.log(result);
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
    console.log(result);

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
    console.log(result);

    if (result.status >= 200 && result.status < 300) {
      setDeleteStatus(!deleteStatus)
    }
    else {
      toast.error('Something went wrong')
    }
  }


  //update quantity
  const updateQuantity = async (productid, quantity) => {
    console.log(productid, quantity);
    const result = await updateProductQuantityApi(productid, { userId, quantity })
    console.log(result);
    if (result.status >= 200 && result.status < 300) {
      setDeleteStatus(!deleteStatus)
    }
    else {
      toast.error('Something went wrong')
    }

  }

  //update profile image
  const updateProfileImage = async (profileImage) => {
    console.log(profileImage);
    const reqBody = new FormData()
    reqBody.append("image", profileImage)

    const header = {
      "Content-Type": "multipart/form-data"
    }
    const result = await updateProfileImageApi(userId, reqBody, header)
    console.log(result);
    if (result.status >= 200 && result.status < 300) {
      setProfile({ ...profile, photo: result.data.photo })
    } else {
      toast.error('Something went wrong')
    }



  }

  useEffect(() => {
    if (userId) {
      getWishlist()
      getAllCartItem()
    }
  }, [deleteStatus])





  return (
    <div className="profile-page">
      <Header />
      <div className="profile-hero">
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
                {/* <div className="profile-avatar" aria-label={`Avatar for ${displayName}`}>{initials}</div>
                {/* <h2>{displayName.charAt(0).toUpperCase() + displayName.slice(1)}</h2> */}
                {/* <p>{profile.email || 'Green Gold member'}</p>
                <p style={{ fontSize: '11px', color: '#e4c778' }}>{userId}</p>  */}
              </div>
              {/* <nav className="profile-menu">
                <a className="is-active" href="#account"><FontAwesomeIcon icon={faUser} />My Profile</a>
                <a href="#orders"><FontAwesomeIcon icon={faBoxOpen} />My Orders</a>
                <Link to="/all-products"><FontAwesomeIcon icon={faBagShopping} />Shop Spices</Link>
                <a href="#payments"><FontAwesomeIcon icon={faCreditCard} />Payment Methods</a>
                <a href="#addresses"><FontAwesomeIcon icon={faLocationDot} />Addresses</a>
              </nav> */}
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
                            <img src={`${serverUrl}/uploads/${pro.image}`} alt={pro.title} style={{ height: '100px' }} />
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
                              <img src={`${serverUrl}/uploads/${pro.image}`} alt={pro.title} style={{ width: '100px', height: '50px' }} />
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
                    <div className='mb-4'>
                      <p>Total Number of Item :  {cartArray.length}</p>
                      <p>Items Price:   ₹ {cartArray.map((item) => item.total).reduce((p1, p2) => p1 + p2)} </p>
                      <p>Delivery Charge:   ₹ 60</p>
                      <h5>Grand Total :   ₹ {cartArray.map((item) => item.total).reduce((p1, p2) => p1 + p2) + 60}</h5>
                    </div>
                  </div>}
                <Link className="profile-primary-link" >Make payment <FontAwesomeIcon icon={faArrowRight} aria-hidden="true" /></Link>
              </section>

              <section className="profile-card profile-info-card" id="orders">
                <div className="profile-card-heading"><h2> Orders History</h2><FontAwesomeIcon icon={faBoxOpen} aria-hidden="true" /></div>
                <p className="profile-empty-copy">Your order history will appear here once you’ve placed an order.</p>
              </section>
            </section>

            <aside className="profile-aside" aria-label="Shopping" style={{ marginTop: '15px' }}>

              {/* edit profile  */}
              <section className="profile-card profile-account-card" id="account">
                <label >
                  <div className="profile-card-avatar" aria-hidden="true">
                    {profile?.photo ? <img src={`${serverUrl}/uploads/${profile.photo}`} alt="Profile" /> : initials}
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
                <div className="profile-card-heading"><h2>Shipping Address</h2><FontAwesomeIcon icon={faLocationDot} aria-hidden="true" /></div>
                {profile.address.length ==0  ? <p className="profile-empty-copy">No delivery address saved yet. Your address can be added when you place an order.</p> :
                  <div>
                    
                  </div>
                }

                <button type='button' onClick={handleShow} className="profile-primary-link" style={{ marginTop: '20px' }}>Add New Address<FontAwesomeIcon icon={faArrowRight} aria-hidden="true" /></button>
              </section>
              {/* <section className="profile-card profile-info-card" id="payments">
                <div className="profile-card-heading"><h2>Payment Methods</h2><FontAwesomeIcon icon={faCreditCard} aria-hidden="true" /></div>
                <p className="profile-empty-copy">Payment details are collected securely during checkout. No payment methods are stored here.</p>
                <button className="profile-primary-link" style={{ marginTop: '20px' }}>Add Payment Method<FontAwesomeIcon icon={faArrowRight} aria-hidden="true" /></button>
              </section> */}

              <Link className="profile-promo" to="/all-products" aria-label="Explore Green Gold spices">
                <img src="/assets/dashboardImg.png" alt="Green cardamom and whole spices" />
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
          <form action="" className='form px-4 py-3'>

            <div className='mt-1'>
              <input type="text" className='form-control rounded-0' placeholder='Full Name' value={address.fullname} onChange={(e)=>setAddress({...address, fullname:e.target.value})} />
            </div>
            <div className='mt-3'>
              <input type="text" className='form-control rounded-0' placeholder='mobile Number' value={address.mobileno} onChange={(e)=>setAddress({...address, mobileno:e.target.value})} />
            </div>
            <div className='mt-3'>
              <input type="text" className='form-control rounded-0' placeholder='Flat, House no, Building, Company, Apartment' value={address.flat} onChange={(e)=>setAddress({...address, flat:e.target.value})} />
            </div>
            <div className='mt-3'>
              <input type="text" className='form-control rounded-0' placeholder='Area, Street, Sector, Village' value={address.street} onChange={(e)=>setAddress({...address, street:e.target.value})} />
            </div>
            <div className='mt-3'>
              <input type="text" className='form-control rounded-0' placeholder='Landmark' value={address.landmark} onChange={(e)=>setAddress({...address, landmark:e.target.value})} />
            </div>
            <div className='mt-3'>
              <input type="text" className='form-control rounded-0' placeholder='Town/City' value={address.city} onChange={(e)=>setAddress({...address, city:e.target.value})} />
            </div>
            <div className='mt-3'>
              <input type="text" className='form-control rounded-0' placeholder='State' value={address.state} onChange={(e)=>setAddress({...address, state:e.target.value})} />
            </div>
            <div className='mt-3'>
              <input type="text" className='form-control rounded-0' placeholder='Pincode' value={address.pincode} onChange={(e)=>setAddress({...address, pincode:e.target.value})} />
            </div>

          </form>
        </Modal.Body>
        <Modal.Footer className='d-flex'>
          <button className='rounded-5 btn btn-outline-warning border-1 border-warning' style={{fontSize:'12px'}}  onClick={handleClose}>
            Cancel
          </button>
          <button style={{fontSize:'12px'}} className='rounded-5 btn btn-outline-success border-1 border-success' onClick={handleClose}>
            Update
          </button>
        </Modal.Footer>
      </Modal>
      <ToastContainer position='top-right' autoClose={3000} theme='colored' />
      <Footer />
    </div>
  )
}
