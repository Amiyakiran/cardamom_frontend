import { useEffect, useRef, useState } from 'react'
import './blog.css'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { getABlogApi, getAllBlogApi } from '../services/allApi'
import { serverUrl } from '../services/serverUrl'
import Offcanvas from 'react-bootstrap/Offcanvas';
import { toast,ToastContainer } from 'react-toastify'


const categories = [
  'All',
  'Health & Wellness',
  'Buying Guide',
  'Recipes',
  'Farming',
  'Spices'
]



export default function Blog() {
  const [post, setPost] = useState([])
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [searchTerm, setSearchTerm] = useState('')
  const postGridRef = useRef(null)
  const sidebarCategories = [
    { name: 'Farming', count: post.filter((item) => item.category == 'Farming').length },
    { name: 'Buying Guide', count: post.filter((item) => item.category == 'Buying Guide').length },
    { name: 'Recipes', count: post.filter((item) => item.category == 'Recipes').length },
    { name: 'Health & Wellness', count: post.filter((item) => item.category == 'Health & Wellness').length },
    { name: 'Spices', count: post.filter((item) => item.category == 'Spices').length }

  ]
  const [show, setShow] = useState(false);
  const [viewBlog, setViewBlog] = useState({})



  const handleClose = () => setShow(false);
  const handleShow = async (id) => {
    setShow(true);
    const result = await getABlogApi(id)
    // console.log(result);
    setViewBlog(result.data)

  }

  const filteredPosts = post.filter(
    (item) => item.status?.trim().toLowerCase() === 'published'
  ).filter((item) => {
    const matchesCategory =
      selectedCategory === 'All' ||
      item.category?.trim().toLowerCase() === selectedCategory.toLowerCase()
    const searchableText = [
      item.title,
      item.shortDescription,
      item.category,
      item.date,
    ]
      .filter(Boolean)
      .join(' ')
      .toLowerCase()
    const matchesSearch = searchableText.includes(searchTerm.trim().toLowerCase())

    return matchesCategory && matchesSearch
  })

  const handleSubscribe= ()=>{
      toast.info('Currently not available')
  }

  useEffect(() => {
    let isMounted = true

    const loadPosts = async () => {
      const result = await getAllBlogApi()
      if (isMounted) setPost(result.data)
    }

    loadPosts()
    return () => {
      isMounted = false
    }
  }, [])

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
  }, [post, selectedCategory, searchTerm])

  return (
    <div className="blog-page">
      <section className="hero-banner" fetchPriority="high" decoding="async">

        <div className="hero-overlay" />
        <Header activePage="blog" />

        <div className="hero-text">
          <p className="mini-title"><span>♧</span>  OUR BLOG <i /></p>
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
            {categories.map((item) => (
              <button
                key={item}
                className={selectedCategory === item ? 'filter-chip active' : 'filter-chip'}
                type="button"
                aria-pressed={selectedCategory === item}
                onClick={() => setSelectedCategory(item)}
              >
                {item}
              </button>
            ))}

          </div>

          <div className="post-grid" ref={postGridRef}>
            {filteredPosts.length > 0 ? filteredPosts.map((item, index) => (
              <article key={item._id || item.id || index} className="blog-card">
                <img src={`${serverUrl}/uploads/${item.image}`} alt={item.title} loading="lazy" decoding="async" />
                <div className="card-body">
                  <div className="meta-row">
                    <span className="meta-tag">{item.category}</span>
                    <span className="meta-date">{item.date}</span>
                  </div>
                  <h3>{item.title}</h3>
                  <p>{item.shortDescription}</p>
                  <button onClick={() => handleShow(item._id)} type="button">Read More →</button>
                </div>
              </article>
            )) : (
              <p className="no-blog-results" role="status">
                No blog posts match your search.
              </p>
            )}
          </div>
        </section>

        <aside className="sidebar-column">
          <div className="sidebar-box  search-box">
            <span className="search-icon">⌕</span>
            <input
              type="search"
              placeholder="Search blog..."
              aria-label="Search blog posts"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
            />
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
            <button onClick={handleSubscribe} type="button">Subscribe →</button>
          </div>
        </aside>
      </main>
                <ToastContainer position='top-right' autoClose={3000} theme='colored' />

      <Offcanvas show={show} onHide={handleClose} placement='top'  className="custom-offcanvas p-5">
        <img src="./assets/ggs1.png" alt="logo" style={{width:'50px', height:'50px', marginLeft:'10px'}} loading="lazy" decoding="async" />
        <Offcanvas.Header closeButton style={{flexDirection:'column'}}>
          <Offcanvas.Title className='blogtitle'><h1>{viewBlog.title}</h1></Offcanvas.Title>
                  <small>{viewBlog.shortDescription}</small>


        </Offcanvas.Header>
        
        <Offcanvas.Body>

        <div className='container-fluid mt-4'>
            <div className="row">
              <div className="col-md-5">
                <img
                  className="blog-detail-image"
                  src={`${serverUrl}/uploads/${viewBlog.image}`}
                  alt={viewBlog.title}
                  loading="lazy"
                  decoding="async"
                />
                <div className='d-flex justify-content-between mt-3'>
                  <p>Author : {viewBlog.author}</p>
                  <p>Publish Date: {viewBlog.publishDate}</p>
                </div>
              </div>
              <div
                className="col-md-7 blog-detail-content"
                dangerouslySetInnerHTML={{ __html: viewBlog.longDescription }}
              >
              </div>
            </div>
        </div>
        </Offcanvas.Body>
      </Offcanvas>

      <Footer />
    </div>
  )
}
