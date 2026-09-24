import { Link } from 'react-router-dom'
import './not-found.css'

export default function NotFound() {
  return (
    <main className="not-found-page">
      <div className="not-found-overlay" />
      <section className="not-found-content" aria-labelledby="not-found-title">
        <span className="not-found-mark" aria-hidden="true">♧</span>
        <p className="not-found-code">404</p>
        <h1 id="not-found-title">Page Not Found</h1>
        <span className="not-found-rule" aria-hidden="true" />
        <p className="not-found-message">
          The page you&apos;re looking for might have been<br className="not-found-break" /> moved, deleted, or never existed.
        </p>
        <Link className="not-found-button" to="/">
          Back to Home <span aria-hidden="true">&#8594;</span>
        </Link>
      </section>
    </main>
  )
}