import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAward, faGlobe, faHandHolding, faLeaf } from '@fortawesome/free-solid-svg-icons'
import './Footer.css'

const footerPoints = [
  [faLeaf, 'NATURAL', '100% Pure Cardamom'],
  [faAward, 'PREMIUM QUALITY', 'Carefully Selected'],
  [faHandHolding, 'HANDPICKED', 'With Care & Expertise'],
  [faGlobe, 'TRUSTED GLOBALLY', 'From India to the World'],
]

export default function Footer({login}) {
  return (
    <footer className={login?"site-footer1":"site-footer"}>
      <div className="site-footer-points">
        {footerPoints.map(([icon, title, description]) => (
          <div className="site-footer-point" key={title}>
            <FontAwesomeIcon icon={icon} className="site-footer-icon" />
            <span>
              <strong>{title}</strong>
              <small>{description}</small>
            </span>
          </div>
        ))}
      </div>
      <div className="site-footer-copyright">
        &copy; 2026 Green Gold. All rights reserved.
      </div>
    </footer>
  )
}