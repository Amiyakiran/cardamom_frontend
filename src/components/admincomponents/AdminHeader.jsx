import { useContext, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { googleLogout } from '@react-oauth/google'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronDown, faRightFromBracket } from '@fortawesome/free-solid-svg-icons'
import { AuthContext } from '../../context/ContextShare'
import { logoutApi } from '../../services/allApi'
import './AdminHeader.css'

function AdminHeader({ className = '' }) {
  const { setUser, setUserEmail, setUserId } = useContext(AuthContext)
  const [menuOpen, setMenuOpen] = useState(false)
  const [logoutError, setLogoutError] = useState('')
  const menuRef = useRef(null)
  const navigate = useNavigate()

  useEffect(() => {
    if (!menuOpen) return undefined

    const closeMenu = (event) => {
      if (event.type === 'keydown' && event.key === 'Escape') {
        setMenuOpen(false)
      } else if (event.type === 'mousedown' && !menuRef.current?.contains(event.target)) {
        setMenuOpen(false)
      }
    }

    document.addEventListener('mousedown', closeMenu)
    document.addEventListener('keydown', closeMenu)
    return () => {
      document.removeEventListener('mousedown', closeMenu)
      document.removeEventListener('keydown', closeMenu)
    }
  }, [menuOpen])

  const handleLogout = async () => {
    setLogoutError('')
    try {
      const result = await logoutApi()
      if (!(result?.status >= 200 && result.status < 300)) {
        setLogoutError(result?.response?.data?.message || 'Unable to log out. Please try again.')
        return
      }

      setUser('')
      setUserEmail('')
      setUserId('')
      googleLogout()
      setMenuOpen(false)
      navigate('/login')
    } catch (error) {
      console.error('Unable to log out', error)
      setLogoutError('Unable to log out. Please try again.')
    }
  }

  return (
    <header className={`admin-shared-header ${className}`.trim()}>
      <div className="admin-shared-account" ref={menuRef}>
        <button
          className="admin-shared-account-trigger"
          type="button"
          aria-label="Admin account menu"
          aria-haspopup="menu"
          aria-expanded={menuOpen}
          onClick={() => {
            setLogoutError('')
            setMenuOpen((open) => !open)
          }}
        >
          <span className="admin-shared-avatar" aria-hidden="true">A</span>
          <span>Admin</span>
          <FontAwesomeIcon icon={faChevronDown} aria-hidden="true" />
        </button>
        {menuOpen && (
          <div className="admin-shared-dropdown" role="menu">
            <button type="button" role="menuitem" onClick={handleLogout}>
              <FontAwesomeIcon icon={faRightFromBracket} aria-hidden="true" />
              Logout
            </button>
            {logoutError && <p role="alert">{logoutError}</p>}
          </div>
        )}
      </div>
    </header>
  )
}

export default AdminHeader
