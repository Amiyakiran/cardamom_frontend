import { Route, Routes } from 'react-router-dom'
import './App.css'
import Home from './pages/Home'
import Login from './pages/Login'
import Blog from './pages/blog'
import Contact from './pages/contact'
import About from './pages/about'
import NotFound from './pages/NotFound'
import Profile from './pages/Profile'
import AdminBlog from './pages/admin/Blog'
import Admindashboard from './pages/admin/Admindashboard'
import Adminproducts from './pages/admin/Adminproducts'
import Adminorders from './pages/admin/Adminorders'
import Admininventory from './pages/admin/Admininventory'
import Adminsetting from './pages/admin/Adminsetting'
import Admincustomers from './pages/admin/Admincustomers'
import Allproducts from './pages/Allproducts'

function App() {


  return (
    <>
   
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Login register />} />
        <Route path="/forgot_password" element={<Login forgetPassword />} />
        <Route path="/reset_password/:token" element={<Login reset_password />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/about" element={<About />} />
        <Route path="/:user-profile/:id" element={<Profile />} />
        <Route path="/all-products" element={<Allproducts />} />
        <Route path="/admin/:id/dashboard" element={<Admindashboard />} />
        <Route path="/admin/:id/products" element={<Adminproducts />} />
        <Route path="/admin/:id/orders" element={<Adminorders />} />
        <Route path="/admin/:id/inventory" element={<Admininventory />} />
        <Route path="/admin/:id/customers" element={<Admincustomers />} />
        <Route path="/admin/:id/blog" element={<AdminBlog />} />
        <Route path="/admin/:id/settings" element={<Adminsetting />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  )
}

export default App
