import { useEffect, useRef, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faClock, faEnvelope, faLocationDot, faPhone, faSpinner } from '@fortawesome/free-solid-svg-icons'
import './contact.css'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { sendMessageApi } from '../services/allApi'
import { toast, ToastContainer } from 'react-toastify'



const contactDetails = [
  { icon: faLocationDot, label: 'Our Location', value: 'Green Gold Cardamom\n Nedumkandam Idukki, Kerala, India\nPIN -  685553' },
  { icon: faEnvelope, label: 'Email Us', value: 'greengoldspices.ndkm@gmail.com\nWe usually reply within 24 hours.' },
  { icon: faPhone, label: 'Call Us', value: ' +91 9562214570, +91 7560979717,+91 8113804245\nMon - Fri: 8am - 8pm \n ​​Saturday: 9am - 7pm \n ​Sunday: 10am - 5pm (IST)' },
  { icon: faClock, label: 'Delivery Time', value: 'Mondays: 8am - 1pm\nWednesdays: 8am - 1pm\nFridays: 8am - 1pm' },
]


export default function Contact() {
  const mainRef = useRef(null)
  const [sent, setSent] = useState(0)
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  })

  useEffect(() => {
    const revealItems = mainRef.current?.querySelectorAll('.contact-reveal')

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

  function handleChange(e) {
    const { name, value } = e.target
    // console.log(name, value );
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  //console.log(formData);

  async function handleSubmit(event) {
    event.preventDefault()
    setSent(1)
    try {
      const result = await sendMessageApi(formData)
      // console.log(result);
      if (result.status == 200) {
        toast.success(result.data.message)
        setFormData({
          name: "",
          email: "",
          subject: "",
          message: ""
        })
        setSent(2)
      }
      else if (result.status == 400) {
        toast.info(result.data.message)
      }
      else {
        toast.error(result.error.message)
      }

    }
    catch (error) {

    }
  }

  return (
    <div className="contact-page">
      <section className="contact-hero">
        {/* <video className="contact-hero-video" autoPlay muted loop playsInline aria-hidden="true">
          <source src="/assets/video1.mp4" type="video/mp4" />
        </video> */}
        <div className="contact-hero-overlay" />
        <Header activePage="contact" />
        <div className="contact-hero-copy">
          <div className="eyebrow light"><span>♧</span> GET IN TOUCH <i /></div>
          <h1>We&apos;d Love to Hear <br />From You</h1>
          <p>Whether you have a question, a partnership idea,<br className="desktop-break" /> or simply want to know more about our cardamom —<br className="desktop-break" /> we&apos;re here to help.</p>
        </div>
      </section>

      <main className="contact-main" ref={mainRef}>
        <section className="contact-details contact-reveal reveal-left">
          <div className="eyebrow"><span>♧</span> OUR CONTACT <i /></div>
          <div className="details-list">
            {contactDetails.map((detail) => (
              <div className="detail-item" key={detail.label}>
                <span className="detail-icon"><FontAwesomeIcon icon={detail.icon} /></span>
                <div>
                  <h2>{detail.label}</h2>
                  <p>{detail.value}</p>
                </div>
              </div>
            ))}
          </div>
          <p className="handwritten">Let&apos;s grow Together <span>⌁</span></p>
        </section>

        <section className="message-card contact-reveal reveal-right">
          <h2>Send Us a Message</h2>
          <p className="message-intro">We&apos;d love to hear from you. Fill out the form below<br />and we&apos;ll get back to you as soon as possible.</p>
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <input required type="text" placeholder="Your Name *" aria-label="Your name" name='name' value={formData.name} onChange={(e) => handleChange(e)} />

              <input required type="email" name='email' placeholder="Your Email *" aria-label="Your email" value={formData.email} onChange={handleChange} />
            </div>
            <input type="text" name='subject' placeholder="Subject" aria-label="Subject" value={formData.subject} onChange={handleChange} />

            <textarea required name='message' placeholder="Your Message *" aria-label="Your message" rows="4" value={formData.message} onChange={handleChange} />

            <button className="submit-button" type="submit">{sent == 0 ? 'Message Sent' : sent == 1 ? <FontAwesomeIcon icon={faSpinner} spin size="lg" /> : 'Send new Message'} <span>→</span></button>

          </form>
        </section>

        <aside className="farm-panel contact-reveal reveal-right contact-reveal-delay">
          <div className="farm-photo"><img src="/assets/farm.png" alt="Cardamom flowers in the hills" /></div>
          <div className="eyebrow"><span>♧</span> VISIT OUR FARM <i /></div>
          <p>Experience the journey of pure cardamom straight from our <br />lush green hills.</p>
          {/* <div className="map-frame-wrap">
            <iframe
              className="map-frame"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d31449.32420620446!2d77.12952324292408!3d9.836461526672366!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3b07a7d652aa57b5%3A0x54f328bc3a6a742f!2sNedumkandam%2C%20Kerala!5e0!3m2!1sen!2sin!4v1789577004198!5m2!1sen!2sin"
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="strict-origin-when-cross-origin"
              title="Green Gold Cardamom location map"
            ></iframe>

          </div> */}
           <p className="handwritten">Goodness grows here <span>⌁</span></p>
        </aside>

      </main>
      <ToastContainer theme='colored' autoClose={3000} position='top-right' />

      <Footer />
    </div>
  )
}