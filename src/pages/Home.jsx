import Header from '../components/Header'
import Footer from '../components/Footer'
import './home.css'


const products = [
  ['Premium Green Cardamom', 'Bold aroma · Rich flavor'],
  ['Farm Fresh Packaging', 'Long lasting freshness'],
  ['Whole Pods', '100% natural · No additives'],
 
]

function Home() {
  return (
    <div className="home-page">
      <section className="home-hero">
        <div className="home-hero-image">
          <img className="home-hero-image-asset" src="/assets/pod2.png" alt="Fresh cardamom pods" />
        </div>
        <div className="home-hero-shade" />
        <Header activePage="home" />
        <div className="home-hero-copy">
          <p className="home-kicker">PURENESS FROM NATURE</p>
          <h1>The True Essence<br />of Cardamom</h1>
          <p>From misty hills to your cup, discover the unmatched aroma, purity and taste of premium cardamom.</p>
          <span className="home-scroll-cue"><i /> Scroll to explore</span>
        </div>
      </section>

      <main className="home-content">

        <section className="home-products">
          <p className="home-kicker">OUR PRODUCTS</p>
          <h2>Premium Cardamom<br />for a Richer Tomorrow</h2>
          <p>Pure. Natural. Authentic.</p>
          <div className="home-product-grid">
            {products.map(([title, text], index) => (
              <article className="home-product-card" key={title}>
                <div className={`home-product-visual visual-${index + 1}`}><span>GG</span></div>
                <h3>{title}</h3>
                <p>{text}</p>
                <button type="button">View Details <span>→</span></button>
              </article>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}

export default Home
