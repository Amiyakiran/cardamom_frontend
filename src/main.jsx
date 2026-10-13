import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import ContextShare from './context/ContextShare.jsx'
import 'react-toastify/dist/ReactToastify.css'
import { GoogleOAuthProvider } from '@react-oauth/google';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css'
import ScrollToTop from './pages/ScrollToTop.jsx'

const GOOGLE_CLIENT_ID = '468396612144-gm41drmhhfgq7dg6b00eijf6omlb4rgt.apps.googleusercontent.com'


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <BrowserRouter>
         <ScrollToTop/>
        <ContextShare>
          <App />
        </ContextShare>
      </BrowserRouter>
    </GoogleOAuthProvider >
  </StrictMode>,
)
