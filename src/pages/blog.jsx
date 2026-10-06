import { useEffect, useRef } from 'react'
import './blog.css'
import Header from '../components/Header'
import Footer from '../components/Footer'

const blogPosts = [
  {
    category: 'FARMING',
    date: 'Apr 22, 2025',
    title: 'The Journey of Cardamom from Farm to You',
    description:
      'Discover how the finest cardamom is carefully grown, harvested and processed in the misty hills of Kerala.',
    image:
      'https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=900&q=80',
  },
  {
    category: 'GROWING TIPS',
    date: 'Apr 15, 2025',
    title: 'Why Cardamom is Called the Queen of Spices',
    description:
      'Explore the rich history, unique aroma and the global love for this precious spice.',
    image:
      'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=900&q=80',
  },
  {
    category: 'RECIPES',
    date: 'Apr 5, 2025',
    title: '5 Delicious Ways to Use Cardamom in Your Kitchen',
    description:
      'From traditional sweets to refreshing drinks, bring the flavor of cardamom to your everyday recipes.',
    image:
      'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=900&q=80',
  },
  {
    category: 'HEALTH & WELLNESS',
    date: 'Mar 28, 2025',
    title: 'The Health Benefits of Cardamom',
    description:
      'Learn how this powerful spice supports digestion, immunity and overall well-being.',
    image:
      'https://images.unsplash.com/photo-1502741338009-cac2772e18bc?auto=format&fit=crop&w=900&q=80',
  },
  {
    category: 'LIFESTYLE',
    date: 'Mar 20, 2025',
    title: 'Life in the Cardamom Hills',
    description:
      'A glimpse into the peaceful, natural beauty behind every pod of this cherished spice.',
    image:
      'https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?auto=format&fit=crop&w=900&q=80',
  },
  {
    category: 'FARMERS',
    date: 'Mar 12, 2025',
    title: 'Meet the Farmers Behind Our Cardamom',
    description:
      'Real stories, real people, and the hands that bring quality to your cup.',
    image:
      'https://images.unsplash.com/photo-1471193945509-9ad0617afabf?auto=format&fit=crop&w=900&q=80',
  },
]

const categories = [
  'All',
  'Farming',
  'Health & Wellness',
  'Recipes',
  'Lifestyle',
]

const sidebarCategories = [
  { name: 'Farming', count: 12 },
  { name: 'Growing Tips', count: 8 },
  { name: 'Recipes', count: 6 },
  { name: 'Health & Wellness', count: 5 },
  { name: 'Lifestyle', count: 7 },
  { name: 'Farmers', count: 4 },
]

export default function Blog() {
  const postGridRef = useRef(null)

  useEffect(() => {
    const cards = postGridRef.current?.querySelectorAll('.blog-card')

    if (!cards?.length) return undefined

    const observer = new IntersectionObserver((entries, currentObserver) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible')
          currentObserver.unobserve(entry.target)
        }
      })
    }, { threshold: 0.2 })

    cards.forEach((card) => observer.observe(card))

    return () => observer.disconnect()
  }, [])

  return (
    <div className="blog-page">
      <section className="hero-banner">
        {/* <video
          className="hero-video"
          autoPlay
          muted
          loop
          playsInline
        >
          <source src="/assets/video.mp4" type="video/mp4" />
        </video> */}

        <div className="hero-overlay" />
        <Header activePage="blog" />

        <div className="hero-text">
          <p className="mini-title"><span>♧</span>  OUR BLOG <i/></p>
          <h1>Stories, Tips &amp; Insights from the Misty Hills</h1>
          <p>
            Explore the journey of cardamom — from our lush farms to your cup.
            Discover farming stories, health benefits, recipes and more.
          </p>
        </div>
      </section>

      <main className="blog-main">
        <section className="content-column">
          <div className="filter-bar">
            {categories.map((item, index) => (
              <button
                key={item}
                className={index === 0 ? 'filter-chip active' : 'filter-chip'}
                type="button"
              >
                {item}
              </button>
            ))}
          </div>

          <div className="post-grid" ref={postGridRef}>
            {blogPosts.map((post) => (
              <article key={post.title} className="blog-card">
                <img src={post.image} alt={post.title} />
                <div className="card-body">
                  <div className="meta-row">
                    <span className="meta-tag">{post.category}</span>
                    <span className="meta-date">{post.date}</span>
                  </div>
                  <h3>{post.title}</h3>
                  <p>{post.description}</p>
                  <button type="button">Read More →</button>
                </div>
              </article>
            ))}
          </div>
        </section>

        <aside className="sidebar-column">
          <div className="sidebar-box  search-box">
            <span className="search-icon">⌕</span>
            <input type="text" placeholder="Search blog..." />
          </div>

          <div className="sidebar-box categories-box">
            <div className="sidebar-title">Categories</div>
            <ul>
              {sidebarCategories.map((category) => (
                <li key={category.name}>
                  <span className="category-name">{category.name}</span>
                  <span className="category-count">{category.count}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="sidebar-box subscribe-box">
            <div className="small-leaf" />
            <h4>Stay Connected</h4>
            <p>
              Get the latest blog updates, farming tips and special offers straight to your inbox.
            </p>
            <div className="subscribe-field">
              <span className="mail-icon">✉</span>
              <input type="email" placeholder="Your email address" />
            </div>
            <button type="button">Subscribe →</button>
          </div>
        </aside>
      </main>
      <Footer />
    </div>
  )
}
