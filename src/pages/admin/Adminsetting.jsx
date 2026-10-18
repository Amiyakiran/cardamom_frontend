import React, { useRef, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faLeaf,
  faBell,
  faBoxOpen,
  faCamera,
  faChartColumn,
  faChevronDown,
  faCirclePlus,
  faClock,
  faCreditCard,
  faFloppyDisk,
  faGear,
  faGlobe,
  faHeadset,
  faLayerGroup,
  faMagnifyingGlass,
  faStore,
  faTruck,
  faUsers,
  faWrench,
} from '@fortawesome/free-solid-svg-icons'
import { Link } from 'react-router-dom'
import Sidebar from '../../components/admincomponents/Sidebar'
import './Adminsetting.css'

const tabs = [
  { label: 'General', icon: faGear },
  { label: 'Store', icon: faStore },
  { label: 'Payment', icon: faCreditCard },
  { label: 'Shipping', icon: faTruck },
  { label: 'Notifications', icon: faBell },
  { label: 'Users', icon: faUsers },
]

const initialSettings = {
  storeName: 'Green Gold',
  email: 'info@greengold.com',
  phone: '+91 98765 43210',
  description: 'Premium quality spices sourced from the finest farms. Bringing authentic flavour to your kitchen.',
  currency: 'INR - ₹',
  language: 'English',
  timezone: 'Asia/Kolkata (IST)',
  storeOpen: true,
  maintenanceMode: false,
  guestCheckout: true,
}

const quickActions = [
  { label: 'Add New Product', to: '/admin/products', icon: faCirclePlus },
  { label: 'View Orders', to: '/admin/orders', icon: faBoxOpen },
  { label: 'Manage Inventory', to: '/admin/inventory', icon: faLayerGroup },
  { label: 'View Customers', to: '/admin/customers', icon: faUsers },
]

function Adminsetting() {
  const [settings, setSettings] = useState(initialSettings)
  const [activeTab, setActiveTab] = useState('General')
  const [storeLogo, setStoreLogo] = useState('/assets/ggs.png')
  const [saveMessage, setSaveMessage] = useState('')
  const logoInput = useRef(null)

  const updateSetting = (event) => {
    const { name, value, type, checked } = event.currentTarget
    setSettings((current) => ({
      ...current,
      [name]: type === 'checkbox' ? checked : value,
    }))
    setSaveMessage('')
  }

  const handleLogoChange = (event) => {
    const file = event.currentTarget.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = () => setStoreLogo(reader.result)
    reader.readAsDataURL(file)
  }

  const resetSettings = () => {
    setSettings(initialSettings)
    setSaveMessage('')
  }

  const saveSettings = (event) => {
    event.preventDefault()
    setSaveMessage('Changes saved')
  }

  return (
    <div className="admin-page-shell">
      <Sidebar activeItem="Settings" />
      <main className="admin-page-content settings-page">
        {/* <div className="settings-topbar">
          <label className="settings-search">
            <FontAwesomeIcon icon={faMagnifyingGlass} aria-hidden="true" />
            <input type="search" placeholder="Search anything..." aria-label="Search settings" />
          </label>
          <div className="settings-account-tools">
            <button className="settings-icon-button settings-notifications" type="button" aria-label="Notifications, 3 unread">
              <FontAwesomeIcon icon={faBell} aria-hidden="true" />
              <span>3</span>
            </button>
            <button className="settings-account-button" type="button">
              <span className="settings-avatar">A</span>
              <span>Admin</span>
              <FontAwesomeIcon icon={faChevronDown} aria-hidden="true" />
            </button>
          </div>
        </div> */}
        <header className="admin-blog-topbar">
          {/* <label className="admin-global-search">
                                    <FontAwesomeIcon icon={faMagnifyingGlass} />
                                    <input placeholder="Search here..." />
                                </label> */}
          <div className="admin-account">
            <button type="button" aria-label="Notifications">
              <FontAwesomeIcon icon={faBell} />
              <b>3</b>
            </button>
            <span className="admin-account-avatar">A</span>
            <strong>Admin</strong>
            <FontAwesomeIcon icon={faChevronDown} /></div>
        </header>
        {/* 
        <header className="settings-heading">
          <div>
            <p className="settings-eyebrow">STORE ADMINISTRATION</p>
            <h1>Settings</h1>
            <p className="settings-subtitle">Customize your store, manage preferences and keep everything running smoothly.</p>
          </div>
          <p className="settings-heading-note">Good spices,<br />better living.</p>
        </header> */}
        <div className="admin-blog-heading">
          <div>
            <div className="admin-blog-breadcrumb">
              <FontAwesomeIcon icon={faLeaf} /> Admin <span>›</span>Setting</div>
            <h1>Setting Management</h1>
            <p>Customize your store, manage preferences and keep everything running smoothly.</p>
          </div>

        </div>

        <div className="settings-columns">
          <form className="settings-panel" onSubmit={saveSettings}>
            {/* <div className="settings-tabs" role="tablist" aria-label="Settings categories">
              {tabs.map((tab) => (
                <button
                  className={`settings-tab${activeTab === tab.label ? ' is-active' : ''}`}
                  key={tab.label}
                  type="button"
                  role="tab"
                  aria-selected={activeTab === tab.label}
                  onClick={() => setActiveTab(tab.label)}
                >
                  <FontAwesomeIcon icon={tab.icon} aria-hidden="true" />
                  <span>{tab.label}</span>
                </button>
              ))}
            </div> */}

            <section className="settings-section" aria-labelledby="store-information-title">
              <div className="settings-section-heading">
                <h2 id="store-information-title">Store Information</h2>
                <p>Update your basic store details and branding.</p>
              </div>

              <div className="store-information-grid">
                <div className="settings-logo-control">
                  <div className="settings-logo-preview">
                    <img src={storeLogo} alt="Green Gold store logo" />
                  </div>
                  <input
                    ref={logoInput}
                    className="settings-file-input"
                    type="file"
                    accept="image/*"
                    onChange={handleLogoChange}
                    aria-label="Choose a new store logo"
                  />
                  <button className="settings-logo-button" type="button" onClick={() => logoInput.current?.click()}>
                    <FontAwesomeIcon icon={faCamera} aria-hidden="true" />
                    Change Logo
                  </button>
                </div>

                <label className="settings-field">
                  <span>Store Name <b>*</b></span>
                  <input name="storeName" value={settings.storeName} onChange={updateSetting} required />
                </label>
                <label className="settings-field">
                  <span>Email Address <b>*</b></span>
                  <input name="email" type="email" value={settings.email} onChange={updateSetting} required />
                </label>
                <label className="settings-field">
                  <span>Phone Number <b>*</b></span>
                  <input name="phone" type="tel" value={settings.phone} onChange={updateSetting} required />
                </label>
                <label className="settings-field settings-description-field">
                  <span>Store Description</span>
                  <textarea name="description" maxLength={220} value={settings.description} onChange={updateSetting} />
                  <small>{settings.description.length}/220</small>
                </label>
              </div>
            </section>

            <section className="settings-section preferences-section" aria-labelledby="store-preferences-title">
              <div className="settings-section-heading">
                <h2 id="store-preferences-title">Store Preferences</h2>
                <p>Manage your store's basic preferences and features.</p>
              </div>

              <div className="settings-preferences-grid">
                <label className="settings-preference">
                  <FontAwesomeIcon className="settings-preference-icon" icon={faClock} aria-hidden="true" />
                  <span className="settings-preference-copy"><strong>Store Status</strong><small>Open or close your store</small></span>
                  <span className="settings-toggle-wrap"><input type="checkbox" name="storeOpen" checked={settings.storeOpen} onChange={updateSetting} /><span>{settings.storeOpen ? 'Open' : 'Closed'}</span></span>
                </label>
                <label className="settings-preference">
                  <FontAwesomeIcon className="settings-preference-icon" icon={faGlobe} aria-hidden="true" />
                  <span className="settings-preference-copy"><strong>Currency</strong><small>Select your store currency</small></span>
                  <select name="currency" value={settings.currency} onChange={updateSetting} aria-label="Currency">
                    <option>INR - ₹</option><option>USD - $</option><option>EUR - €</option>
                  </select>
                </label>
                <label className="settings-preference">
                  <FontAwesomeIcon className="settings-preference-icon" icon={faWrench} aria-hidden="true" />
                  <span className="settings-preference-copy"><strong>Maintenance Mode</strong><small>Show maintenance page to customers</small></span>
                  <span className="settings-toggle-wrap"><input type="checkbox" name="maintenanceMode" checked={settings.maintenanceMode} onChange={updateSetting} /><span>{settings.maintenanceMode ? 'On' : 'Off'}</span></span>
                </label>
                <label className="settings-preference">
                  <FontAwesomeIcon className="settings-preference-icon" icon={faGlobe} aria-hidden="true" />
                  <span className="settings-preference-copy"><strong>Default Language</strong><small>Choose your default language</small></span>
                  <select name="language" value={settings.language} onChange={updateSetting} aria-label="Default language">
                    <option>English</option><option>Hindi</option><option>Malayalam</option>
                  </select>
                </label>
                <label className="settings-preference">
                  <FontAwesomeIcon className="settings-preference-icon" icon={faUsers} aria-hidden="true" />
                  <span className="settings-preference-copy"><strong>Allow Guest Checkout</strong><small>Let customers order without an account</small></span>
                  <span className="settings-toggle-wrap"><input type="checkbox" name="guestCheckout" checked={settings.guestCheckout} onChange={updateSetting} /><span>{settings.guestCheckout ? 'On' : 'Off'}</span></span>
                </label>
                <label className="settings-preference">
                  <FontAwesomeIcon className="settings-preference-icon" icon={faClock} aria-hidden="true" />
                  <span className="settings-preference-copy"><strong>Time Zone</strong><small>Set your store time zone</small></span>
                  <select name="timezone" value={settings.timezone} onChange={updateSetting} aria-label="Time zone">
                    <option>Asia/Kolkata (IST)</option><option>UTC</option><option>Europe/London (GMT)</option>
                  </select>
                </label>
              </div>
            </section>

            <div className="settings-form-footer">
              <p className="settings-save-message" aria-live="polite">{saveMessage}</p>
              <div>
                <button className="settings-cancel-button" type="button" onClick={resetSettings}>Cancel</button>
                <button className="settings-save-button" type="submit">
                  <FontAwesomeIcon icon={faFloppyDisk} aria-hidden="true" />
                  Save Changes
                </button>
              </div>
            </div>
          </form>

          <aside className="settings-side-rail" aria-label="Store shortcuts and support">
            <section className="settings-promo">
              <div className="settings-promo-copy">
                <span>FROM OUR FARMS</span>
                <h2>Good food<br />brings people<br />together.</h2>
                <i />
              </div>
            </section>

            <section className="settings-quick-actions">
              <h2>Quick Actions</h2>
              <div>
                {quickActions.map((action) => (
                  <Link key={action.label} to={action.to}>
                    <FontAwesomeIcon icon={action.icon} aria-hidden="true" />
                    <span>{action.label}</span>
                    <FontAwesomeIcon className="settings-action-arrow" icon={faChevronDown} aria-hidden="true" />
                  </Link>
                ))}
              </div>
            </section>

            {/* <section className="settings-support">
              <div className="settings-support-copy">
                <FontAwesomeIcon icon={faHeadset} aria-hidden="true" />
                <h2>Support</h2>
                <p>Need help? We're here for you.</p>
                <a href="mailto:support@greengold.com">Contact Support</a>
              </div>
              <img src="/assets/dashboardImg.png" alt="Fresh cardamom pods" />
            </section> */}
          </aside>
        </div>
      </main>
    </div>
  )
}

export default Adminsetting
