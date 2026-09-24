import { useEffect, useRef } from 'react'
import './about.css'
import Header from '../components/Header'
import Footer from '../components/Footer'

const values = [
  ['◒', 'PURE & NATURAL', '100% pure cardamom, no additives, no compromises.'],
  ['♧', 'SUPPORTING FARMERS', 'We stand with local farmers and their generations of hard work.'],
  ['♢', 'PREMIUM QUALITY', 'Carefully graded and handpicked for the best aroma and flavor.'],
  ['✥', 'A GREENER TOMORROW', 'Sustainable practices for a healthier planet and future.'],
]

const trustPoints = [
  ['◒', 'NATURAL', '100% Pure Cardamom'],
  ['✥', 'PREMIUM QUALITY', 'Carefully Selected'],
  ['♡', 'HANDPICKED', 'With Care & Expertise'],
  ['♢', 'TRUSTED GLOBALLY', 'From India to the World'],
]

export default function About() {
  const mainRef = useRef(null)

  useEffect(() => {
    const revealItems = mainRef.current?.querySelectorAll('.about-reveal')

    if (!revealItems?.length) return undefined

    const observer = new IntersectionObserver((entries, currentObserver) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible')
          currentObserver.unobserve(entry.target)
        }
      })
    }, { threshold: 0.18 })

    revealItems.forEach((item) => observer.observe(item))

    return () => observer.disconnect()
  }, [])

  return (
    <div className="about-page">
      <section className="about-hero">
        <video className="about-hero-image" autoPlay muted loop playsInline aria-hidden="true">
          <source src="/assets/video2.mp4" type="video/mp4" />
        </video>
        <div className="about-hero-overlay" />
        <Header activePage="about" />
        <div className="about-hero-copy">
          <div className="about-eyebrow about-eyebrow-light"><span>♧</span> ABOUT US <i /></div>
          <h1>Our Journey with<br /> Cardamom</h1>
          <p>At Green Gold, we bring you finest cardamom from Kerala’s lush hills, <br className="about-desktop-break" />rooted in nature, tradition, and the farmers who nurture it.</p>
        
        </div>
      </section>

      <main className="about-main" ref={mainRef}>
        <section className="about-story">
          <div className="about-story-copy about-reveal reveal-left">
            <div className="about-eyebrow"><span>♧</span> OUR STORY <i /></div>
            {/* <h2>From Nature&apos;s Bounty<br />to Your Cup</h2> */}
            <h2>Where Kerala's Spice Heritage Lives On.</h2>
            <p>In the mist-covered hills of Idukki, Kerala, where fertile soil, gentle rain, and a rich tropical climate create the perfect home for spices, our journey began.</p>

            <p> Green Gold Spices was born from a deep appreciation for the land and the generations of farmers who have nurtured Kerala's spice heritage. What began with a connection to the farms around us has grown into a promise — to bring the finest qualities of Kerala's spices from their natural source to your kitchen.</p>

            <p>We carefully select our spices for their purity, freshness, natural colour, distinctive aroma, and authentic flavour. Every stage, from sourcing and grading to processing and packing, is handled with care because we believe that the character of a spice begins long before it reaches the kitchen.</p>


            {/* <p>We source premium cardamom from the fertile hills of Kerala, where the cool climate and rich soil give our spices their unique aroma, flavor and quality. Every pod is carefully selected, processed and packed to preserve its natural essence.</p> */}
            <p className="about-signature ">Pure by nature. Trusted by you.</p>
          </div>
          <div className="about-story-photo"><img src="/assets/contact.png" alt="Cardamom flowers growing in Kerala" /></div>
          <div className="about-values about-reveal reveal-right">
            {values.map(([icon, title, description]) => <div className="about-value" key={title}><span>{icon}</span><div><h3>{title}</h3><p>{description}</p></div></div>)}
            <p className="about-values-signature handwritten">Goodness grows here <span>⌁</span></p>
          </div>
        </section>

        <section className="about-heritage">
          <div className="about-heritage-visual about-reveal reveal-left">
            <img src="/assets/contact.png" alt="Cardamom farm landscape in Kerala" />
          </div>
          <div className="about-story-copy about-heritage-copy session2 about-reveal reveal-right">
            <h2>A Heritage Worth Preserving</h2>
            <p>Kerala has been known for its spices for centuries. But behind that celebrated heritage are the people, farms, traditions, and patience that make every harvest possible.</p>

            <p>We work alongside local farming communities and value the traditional knowledge passed from one generation to the next. By supporting the people who cultivate our spices, we hope to preserve not only their livelihoods but also the living heritage of Kerala's spice-growing hills.</p>

            <h4>From Our Land to Your Table</h4>
            <p>To us, a spice is more than a product.</p>

            <p>It is the fragrance of a rain-soaked plantation.</p>
            <p>It is the warmth of a Kerala kitchen.</p>
            <p>It is the work of a farmer's hands.</p>
            <p>It is a tradition carried forward.</p>

            <p>With every pack of Green Gold Spices, we invite you to experience the natural richness and timeless flavour of Kerala.</p>

            <p className='about-signature'>Grown with care. Selected with purpose. Shared with pride.</p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}