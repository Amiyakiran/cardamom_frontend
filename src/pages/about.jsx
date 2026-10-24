import './about.css'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { useEffect, useRef } from 'react'



export default function About() {
  const storyCardsRef = useRef(null)

  useEffect(() => {
    const cards = storyCardsRef.current?.querySelectorAll('.about-story-step-info, .about-step-visual')

    if (!cards?.length) return undefined

    const observer = new IntersectionObserver((entries, currentObserver) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible')
          currentObserver.unobserve(entry.target)
        }
      })
    }, { threshold: 0.2 })

    const delays = [0, 100, 200, 100, 200, 300]
    const steps = storyCardsRef.current.querySelectorAll('.about-story-step')
    cards.forEach((card) => {
      const stepIndex = Array.from(steps).indexOf(card.closest('.about-story-step'))
      card.style.transitionDelay = `${delays[stepIndex % delays.length]}ms`
      observer.observe(card)
    })

    return () => observer.disconnect()
  }, [])

  return (
    <div className="about-page" ref={storyCardsRef}>
      <Header activePage="about" />

      <main className="about-story-page">
        <section className="about-story-header" fetchPriority="high" decoding="async">
          <div className="overlay" />
          <div className="about-story-copy">
            <p className="about-story-kicker mini-title"><span>♧</span> OUR STORY <i/></p>
            <h1>The Journey with <br className="about-mobile-break" /> Spices</h1>
            <p>We Bring you the finest Spices, sourced from <br className="about-mobile-break" /> the lush green hills of kerala</p>
          </div>

        </section>

      </main>
      <p className="about-story-kicker about-process-kicker">The Journey Continues</p>
      <h1 className="about-process-title">From farm to Pack</h1>
      <p className="about-process-description">Nature. Precision. Purity.</p>
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
          <img src='/assets/harvest.png' alt="First image" loading="lazy" decoding="async" />
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
          <img src='/assets/cleaning.png' alt="First image" loading="lazy" decoding="async" />
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
          <img src='/assets/sorting.png' alt="First image" loading="lazy" decoding="async" />
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
          <img src='/assets/grading.png' alt="First image" loading="lazy" decoding="async" />
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
          <img src='/assets/quality.png' alt="First image" loading="lazy" decoding="async" />
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
          <img src='/assets/banner.png' alt="First image" loading="lazy" decoding="async" />

        </div>
      </div>


      <Footer />
    </div>
  )
}