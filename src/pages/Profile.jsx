import { useContext, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRight, faBagShopping, faBoxOpen, faCreditCard, faEnvelope, faHeart, faLocationDot, faUser } from '@fortawesome/free-solid-svg-icons'
import Header from '../components/Header'
import { AuthContext } from '../context/ContextShare'
import { getMeApi } from '../services/allApi'
import './Profile.css'
import Footer from '../components/Footer'

export default function Profile() {
  const { user, loading, userId } = useContext(AuthContext)
  const [profile, setProfile] = useState(null)
  const [profileLoading, setProfileLoading] = useState(true)

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

  return (
    <div className="profile-page">
      <Header />
      <div className="profile-hero">

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
              <header className="profile-heading">
                <p className="profile-eyebrow">Your account</p>
                <h1>Hello, {displayName.charAt(0).toUpperCase() + displayName.slice(1)}</h1>
                <p>Manage your profile, orders, and preferences.</p>
              </header>
              <section className="profile-card profile-account-card" id="account">
                <div className="profile-card-avatar" aria-hidden="true">{initials}</div>
                <div className="profile-account-fields">
                  <div><span>Full Name</span><strong>{displayName}</strong></div>
                  <div><span>Email Address</span><strong>{profile.email || 'Not provided'}</strong></div>
                  <div><span>Account</span><strong className="profile-status">Active member</strong></div>
                </div>
              </section>
              <section className="profile-card profile-cart-card" style={{ marginTop: '20px' }}>
                <div className="profile-cart-heading">
                  <div><h2>Your Wishlist</h2><span>Save what you love.</span></div>
                  <FontAwesomeIcon icon={faHeart} aria-hidden="true" />
                </div>
                <div className="profile-cart-empty">
                  <span className="profile-cart-icon"><FontAwesomeIcon icon={faBagShopping} /></span>
                  <p>Your basket is waiting for something good.</p>
                </div>
                <div className="wishlist-items">

                </div>
                <Link className="profile-primary-link" to="/all-products">Browse spices <FontAwesomeIcon icon={faArrowRight} aria-hidden="true" /></Link>
              </section>
              <section className="profile-card profile-cart-card" style={{ marginTop: '20px' }}>
                <div className="profile-cart-heading">
                  <div><h2>Your Cart</h2><span>Ready when you are</span></div>
                  <FontAwesomeIcon icon={faBagShopping} aria-hidden="true" />
                </div>
                {/* <div className="profile-cart-empty">
                  <span className="profile-cart-icon"><FontAwesomeIcon icon={faBagShopping} /></span>
                  <p>Your basket is waiting for something good.</p>
                </div> */}
                <div>
                  <table className="table">
                    <thead>
                      <tr>
                        <th >Item</th>
                        <th>Name</th>
                        <th>Price</th>
                        <th>Quantity</th>
                        <th>Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {/* Cart items would be populated here */}
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                    </tbody>
                  </table>
                </div>
                <Link className="profile-primary-link" >Make payment <FontAwesomeIcon icon={faArrowRight} aria-hidden="true" /></Link>
              </section>

              <section className="profile-card profile-info-card" id="orders">
                <div className="profile-card-heading"><h2> Orders History</h2><FontAwesomeIcon icon={faBoxOpen} aria-hidden="true" /></div>
                <p className="profile-empty-copy">Your order history will appear here once you’ve placed an order.</p>
              </section>
            </section>

            <aside className="profile-aside" aria-label="Shopping" style={{ marginTop: '80px' }}>
              <section className="profile-card profile-info-card" id="addresses">
                <div className="profile-card-heading"><h2>Shipping Address</h2><FontAwesomeIcon icon={faLocationDot} aria-hidden="true" /></div>
                <p className="profile-empty-copy">No delivery address saved yet. Your address can be added when you place an order.</p>
              </section>
              <section className="profile-card profile-info-card" id="payments">
                <div className="profile-card-heading"><h2>Payment Methods</h2><FontAwesomeIcon icon={faCreditCard} aria-hidden="true" /></div>
                <p className="profile-empty-copy">Payment details are collected securely during checkout. No payment methods are stored here.</p>
              </section>

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
      <Footer />
    </div>
  )
}
