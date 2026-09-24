import { useContext } from 'react'
import { Link } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { AuthContext } from '../context/ContextShare'
import './Profile.css'

export default function Profile() {
  const { user } = useContext(AuthContext)

  return (
    <div className="profile-page">
      <Header />
      <main className="profile-content">
        {user ? (
          <section className="profile-panel">
            <div className="profile-icon">♧</div>
            <p className="profile-kicker">YOUR ACCOUNT</p>
            <h1>Welcome, {user}</h1>
            <p>Your Green Gold account is ready for your next cardamom journey.</p>
          </section>
        ) : (
          <section className="profile-panel">
            <div className="profile-icon">♧</div>
            <p className="profile-kicker">YOUR ACCOUNT</p>
            <h1>Sign in to view your profile</h1>
            <Link className="profile-login" to="/login">Go to Login</Link>
          </section>
        )}
      </main>
      <Footer />
    </div>
  )
}
