import Header from '../components/Header'
import Footer from '../components/Footer'
import './home.css'
import { Link, Links } from 'react-router-dom'
import {faArrowRight}from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome' // Icon component
import { getHomeProductsApi } from '../services/allApi'
import { useState , useEffect } from 'react'
import { serverUrl } from '../services/serverUrl'

// const products = [
//   ['Premium Green Cardamom', 'Bold aroma · Rich flavor'],
//   ['Farm Fresh Packaging', 'Long lasting freshness'],
//   ['Whole Pods', '100% natural · No additives'],
 
// ]

function Home() {

  const [products, setProducts] = useState([])

  const getProducts = async()=>{
    const result = await getHomeProductsApi()
    // console.log(result);
     setProducts(result?.data)
  }
  console.log(products);
  

useEffect(()=>{
  getProducts()
},[])

  return (
    <div className="home-page">
      <section className="home-hero">
        <div className="home-hero-image">
          <img className="home-hero-image-asset" src="/assets/hero_IMAGE.png" alt="Fresh cardamom pods" />
        </div>
        <div className="home-hero-shade" />
        <Header activePage="home" />
        <div className="home-hero-copy">
          <p className="home-kicker mini-title"><span>♧</span> PURENESS FROM NATURE <i/></p>
          <h1>The True Essence <br /> of Spices</h1>
          <p>From misty hills to your cup, discover the unmatched aroma,<br />  purity and taste of premium cardamom.</p>
          <span className="home-scroll-cue"><i /> Scroll to explore</span>
        </div>
      </section>

      <main className="home-content">

        <section className="home-products">
          <p className="home-kicker">OUR PRODUCTS</p>
          <h2>Elite Spices<br />for a Richer Tomorrow</h2>
          <p>Pure. Natural. Authentic.</p>
          <div className="home-product-grid">
            {products.map((item, index) => (
              <article className="home-product-card" key={item.title}>
                <div className={`home-product-visual visual-${index + 1}`}>
                  <img className="home-product-image" src={`${serverUrl}/uploads/${item.image}`} alt={item.title} />
                </div>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
                <button type="button"><Link style={{textDecoration:'none', color:'black'}} to="/all-products">View Details <span>→</span></Link></button>
              </article>
            ))}
          </div>
        </section>
      <div style={{display:'flex', justifyContent:'center', alignItems:'center', flexDirection:'column'}}>
        <Link to="/all-products" style={{fontSize: '16px', color: '#9e9653'}}>let's have a look to all our Products<span>→</span></Link>
         </div>
      </main>
      <Footer />
    </div>
  )
}

export default Home
