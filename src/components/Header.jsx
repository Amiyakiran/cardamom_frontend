import { Link, useNavigate } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser } from '@fortawesome/free-regular-svg-icons'
import { faChevronDown, faRightFromBracket ,faAddressCard} from '@fortawesome/free-solid-svg-icons'
import './Header.css'
import { useContext, useState } from 'react'
import { AuthContext } from '../context/ContextShare'
import { logoutApi } from '../services/allApi'
import {googleLogout } from '@react-oauth/google';

function Header({ activePage = '' }) {
  const { user, setUser } = useContext(AuthContext)
  const [menuOpen, setMenuOpen] = useState(false)
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logoutApi()
    setUser("")
    setMenuOpen(false)
    navigate('/login')
     googleLogout(); // Clears Google session
  }

  return (
    <header className="site-header">
      <Link className="site-brand" to="/" aria-label="Green Gold home">
        <img className="site-brand-mark" src="/assets/leaf.png" alt="" />
        <span className="site-brand-copy">
          <strong>GREEN GOLD</strong>
          <small>CARDAMOM</small>
        </span>
      </Link>

      <nav className="site-nav" aria-label="Main navigation">
        <Link className={activePage === 'home' ? 'active' : ''} to="/">Home</Link>
        <Link className={activePage === 'about' ? 'active' : ''} to="/about">About Us</Link>
        <Link className={activePage === 'blog' ? 'active' : ''} to="/blog">Blog</Link>
        <Link className={activePage === 'contact' ? 'active' : ''} to="/contact">Contact</Link>
      </nav>

      <div className="site-tools">
        {user === "" ? (
          <Link className="site-login" to="/login">
            <FontAwesomeIcon icon={faUser} aria-hidden="true" />
            <span>Login</span>
          </Link>
        ) : (
          <div className="account-menu">
            <button
              className="site-login account-trigger"
              type="button"
              aria-expanded={menuOpen}
              aria-haspopup="menu"
              onClick={() => setMenuOpen((open) => !open)}
            >
              <FontAwesomeIcon icon={faUser} aria-hidden="true" />
              <span>{user}</span>
              <FontAwesomeIcon className="account-chevron" icon={faChevronDown} aria-hidden="true" />
            </button>

            {menuOpen && (
              <div className="account-dropdown" role="menu">
                <Link to="/profile" role="menuitem" onClick={() => setMenuOpen(false)}>
                <FontAwesomeIcon icon={faAddressCard} />
                  Profile
                </Link>
                <button type="button" role="menuitem" onClick={handleLogout}>
                  <FontAwesomeIcon icon={faRightFromBracket} aria-hidden="true" />
                  Logout
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  )
}

export default Header
