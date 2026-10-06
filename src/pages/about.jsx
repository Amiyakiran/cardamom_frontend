import './about.css'
import Header from '../components/Header'
import Footer from '../components/Footer'



export default function About() {
  return (
    <div className="about-page">
      <Header activePage="about" />

      <main className="about-story-page">
        <section className="about-story-header">
          <div className="overlay" />
          <div className="about-story-copy">
            <p className="about-story-kicker mini-title"><span>♧</span> OUR STORY <i/></p>
            <h1>The Journey with <br/> Spices</h1>
            <p>We Bring you the finest Spices, sourced from <br /> the lush green hills of kerala</p>
          </div>

        </section>

      </main>
      <p className='about-story-kicker' style={{ marginTop: '100px', textAlign: 'center', marginLeft:'0px' }}>The Journey Continues</p>
      <h1 style={{ marginTop: '100px', marginBottom: '100px', fontFamily: 'var(--font-display)', textAlign: 'center', margin: 0, fontSize: 'clamp(32px, 4vw, 48px)', lineHeight: '1', fontWeight: '700' }}>From farm  to Pack</h1>
      <p style={{color: '#5c6d61',fontSize: '14px',lineHeight: '1.6', margin: '30px 0 50px 40px', maxWidth: '330px', textAlign: 'center' }}>Nature. Precision. Purity.</p>
      <div className="about-story-step" >
        <div className="about-story-step-info">
          <div className="about-step-number">1</div>
          <div className="about-step-text">
            <small>The Harvest</small>
            <h4>Handpicked with care</h4>
            <p>Only the Finest, fully matured pods are selected, preserving their natural richness</p>
          </div>
        </div>

        <div className="about-step-visual">
          <img src='/assets/harvest.png' alt="First image" />
          {/* {step.tag && <span className="step-tag">{step.tag} <b>+</b></span>} */}
        </div>
      </div>


      <div className="about-story-step" >
        <div className="about-story-step-info">
          <div className="about-step-number">2</div>
          <div className="about-step-text">
            <small>The Cleaning</small>
            <h4>Pure & Fresh</h4>
            <p>The harvested spices are gently cleaned to remove  dust and impurities, ensuring the highest quality and natural freshness.</p>
          </div>
        </div>

        <div className="about-step-visual">
          <img src='/assets/cleaning.png' alt="First image" />
          {/* {step.tag && <span className="step-tag">{step.tag} <b>+</b></span>} */}
        </div>
      </div>



      <div className="about-story-step" >
        <div className="about-story-step-info">
          <div className="about-step-number">3</div>
          <div className="about-step-text">
            <small>The sorting</small>
            <h4>Only the Best</h4>
            <p>Each spices is sorted, removing inconsistent size, colour and quality, so only the fibest make it forward</p>
          </div>
        </div>

        <div className="about-step-visual">
          <img src='/assets/sorting.png' alt="First image" />
          {/* {step.tag && <span className="step-tag">{step.tag} <b>+</b></span>} */}
        </div>
      </div>



      <div className="about-story-step" >
        <div className="about-story-step-info">
          <div className="about-step-number">4</div>
          <div className="about-step-text">
            <small>The Grading</small>
            <h4>Consistent Excellence</h4>
            <p>The spices are graded by size, colour and overall quality to maintain uniformity and premium standard</p>
          </div>
        </div>

        <div className="about-step-visual">
          <img src='/assets/grading.png' alt="First image" />
          {/* {step.tag && <span className="step-tag">{step.tag} <b>+</b></span>} */}
        </div>
      </div>



      <div className="about-story-step" >
        <div className="about-story-step-info">
          <div className="about-step-number">5</div>
          <div className="about-step-text">
            <small>The quality Check</small>
            <h4>Trusted at Every Step</h4>
            <p>Our Experts conduct thorough quality checks to ensure purity, aroma, moisture and overall excellence.</p>
          </div>
        </div>

        <div className="about-step-visual">
          <img src='/assets/quality.png' alt="First image" />
          {/* {step.tag && <span className="step-tag">{step.tag} <b>+</b></span>} */}
        </div>
      </div>




      <div className="about-story-step" >
        <div className="about-story-step-info">
          <div className="about-step-number">6</div>
          <div className="about-step-text">
            <small>The Packing</small>
            <h4>Freshness Sealed</h4>
            <p>Finally, The selected spuces is packed in airtight, food-grade packaging to lock in its naturak aroma, flavour and goodness - from our farms to you.</p>
          </div>
        </div>

        <div className="about-step-visual img6">
          <img src='/assets/banner.png' alt="First image" />

        </div>
      </div>


      <Footer />
    </div>
  )
}