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
import AdminReports from './pages/admin/AdminReports'
import Admincoupons from './pages/admin/Admincoupons'
import Adminsetting from './pages/admin/Adminsetting'
import Admincustomers from './pages/admin/Admincustomers'
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
        <Route path="/profile" element={<Profile />} />
        <Route path="/admin/dashboard" element={<Admindashboard />} />
        <Route path="/admin/products" element={<Adminproducts />} />
        <Route path="/admin/orders" element={<Adminorders />} />
        <Route path="/admin/inventory" element={<Admininventory />} />
        <Route path="/admin/customers" element={<Admincustomers />} />
        <Route path="/admin/reports" element={<AdminReports />} />
        <Route path="/admin/coupons" element={<Admincoupons />} />
        <Route path="/admin/blog" element={<AdminBlog />} />
        <Route path="/admin/settings" element={<Adminsetting />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  )
}

export default App
