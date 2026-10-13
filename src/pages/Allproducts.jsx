import { useEffect, useRef, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRight, faBagShopping, faHeart, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'
import Header from '../components/Header'
import { addToCartApi, addToWishlistApi, deleteFromWishlistApi, getAllProductApi, getAllWishlistProductApi } from '../services/allApi'
import { serverUrl } from '../services/serverUrl'
import './Allproducts.css'
import Footer from '../components/Footer'
import { useContext } from 'react'
import { AuthContext } from '../context/ContextShare'
import { ToastContainer, toast } from 'react-toastify';

const PRODUCTS_PER_PAGE = 4

const getBestSellerId = (variantProducts) => {
  const bestSeller = variantProducts.reduce((currentBest, product) => {
    const orderCount = Number(product.noOfOrders)

    if (Number(product.stock) <= 0 || !Number.isFinite(orderCount) || orderCount <= 0) {
      return currentBest
    }

    return !currentBest || orderCount > Number(currentBest.noOfOrders) ? product : currentBest
  }, null)

  return bestSeller ? bestSeller._id || bestSeller.title : null
}

function ProductPagination({ page, pageCount, onPageChange, label }) {
  if (pageCount <= 1) return null

  return (
    <nav className="products-pagination" aria-label={`${label} product pages`}>
      <button type="button" onClick={() => onPageChange(page - 1)} disabled={page === 1}>
        Previous
      </button>
      {Array.from({ length: pageCount }, (_, index) => index + 1).map((pageNumber) => (
        <button
          type="button"
          key={pageNumber}
          onClick={() => onPageChange(pageNumber)}
          aria-label={`${label} page ${pageNumber}`}
          aria-current={pageNumber === page ? 'page' : undefined}
        >
          {pageNumber}
        </button>
      ))}
      <button type="button" onClick={() => onPageChange(page + 1)} disabled={page === pageCount}>
        Next
      </button>
    </nav>
  )
}

function Allproducts() {
  const productsContentRef = useRef(null)
  const [products, setProducts] = useState([])
  const [search, setSearch] = useState('')
  const [categoryPages, setCategoryPages] = useState({ elite: 1, premium: 1, classic: 1 })
  const [favorites, setFavorites] = useState([])
  const [pendingFavorites, setPendingFavorites] = useState(() => new Set())
  const [bagCount, setBagCount] = useState(0)
  const { userId } = useContext(AuthContext)
  const eliteProducts = products.filter((item) => item.varient === 'Elite (1st quality)')
  const premiumProducts = products.filter((item) => item.varient === 'Premium (2nd quality)')
  const classicProducts = products.filter((item) => item.varient === 'Classic (3rd quality)')
  const elitePageCount = Math.ceil(eliteProducts.length / PRODUCTS_PER_PAGE)
  const premiumPageCount = Math.ceil(premiumProducts.length / PRODUCTS_PER_PAGE)
  const classicPageCount = Math.ceil(classicProducts.length / PRODUCTS_PER_PAGE)
  const paginatedEliteProducts = eliteProducts.slice(
    (categoryPages.elite - 1) * PRODUCTS_PER_PAGE,
    categoryPages.elite * PRODUCTS_PER_PAGE
  )
  const paginatedPremiumProducts = premiumProducts.slice(
    (categoryPages.premium - 1) * PRODUCTS_PER_PAGE,
    categoryPages.premium * PRODUCTS_PER_PAGE
  )
  const paginatedClassicProducts = classicProducts.slice(
    (categoryPages.classic - 1) * PRODUCTS_PER_PAGE,
    categoryPages.classic * PRODUCTS_PER_PAGE
  )
  const setCategoryPage = (category, page) => {
    setCategoryPages((current) => ({ ...current, [category]: page }))
  }
  const bestSellerIds = {
    elite: getBestSellerId(eliteProducts),
    premium: getBestSellerId(premiumProducts),
    classic: getBestSellerId(classicProducts),
  }

  const getAllProducts = async () => {
    const result = await getAllProductApi(search)
    console.log(result.data);

    setProducts(result.data)
  }

  useEffect(() => {
    let isCurrent = true

    const getWishlistItems = async () => {
      if (!userId) {
        setFavorites([])
        return
      }

      const result = await getAllWishlistProductApi(userId)
      if (isCurrent && result?.status === 200) {
        setFavorites(result.data.wishlist.map((item) => item.productid))
      }
    }

    getWishlistItems()
    return () => {
      isCurrent = false
    }
  }, [userId])

  const handleClick = async (product) => {
    if (!userId) {
      toast.info('Please login to make wishlist')
      return
    }

    const productId = product._id || product.title
    if (pendingFavorites.has(productId)) return



    //to wishlist / delete from wishlist
    const isFavorite = favorites.includes(productId)
    setPendingFavorites((current) => new Set(current).add(productId))

    try {
      const result = isFavorite
        ? await deleteFromWishlistApi(productId, { userId })
        : await addToWishlistApi(product, userId)

      if (result?.status !== 200) {
        toast.error(result?.response?.data?.message || 'Could not update wishlist')
        return
      }

      setFavorites((current) => isFavorite ? current.filter((id) => id !== productId) : current.includes(productId) ? current : [...current, productId])
      toast.success(isFavorite ? 'Removed from wishlist' : 'Added to wishlist')
    }
    finally {
      setPendingFavorites((current) => {
        const next = new Set(current)
        next.delete(productId)
        return next
      })
    }

  }

  //add to cart
  const addToCart = async (product) => {
    console.log(userId);

    if (!userId) {
      toast.info('Please Login')
    }
    else {
      if (product.stock <= 0) {
        toast.error("sorry product is out off stock")
      }
      else {
        const result = await addToCartApi(userId, product)
        console.log(result);
        if (result?.status >= 200 && result.status < 300) {
          toast.success(result.data.message)

        }
        else {
          toast.error(result?.response?.data?.message || 'Could not update Cart')
          return
        }
      }



    }
  }



  useEffect(() => {
    setCategoryPages({ elite: 1, premium: 1, classic: 1 })
    getAllProducts()
  }, [search])

  useEffect(() => {
    const cards = productsContentRef.current?.querySelectorAll('.spice-product')

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
  }, [products, categoryPages])




  return (
    <div className="products-page">
      <Header activePage="products" />

      <main style={{ marginBottom: '80px' }}>
        <section className="products-hero">
          <div className="products-hero-copy">
            <p className="products-eyebrow mini-title"><span>♧</span>Pure spices. Naturally.<i /></p>
            <h1>Our Products</h1>
            <p>Handpicked from the finest farms, our spices bring out the true flavour of nature, rich, aromatic and full of goodness.</p>

          </div>
        </section>

        <section className="products-catalog" aria-label="Spice collection">
          <aside className="products-intro">
            <div className="products-intro-copy">
              <p className="products-eyebrow">Explore</p>
              <h2>Nature’s<br />Finest<br />Spices</h2>
              <span className="products-rule" />
              <p>Pure. Fresh. Authentic.</p>
            </div>
            <div className="products-intro-footer">
              <span>From our farms<br />to your kitchen</span>
              <span className="products-rule" />
            </div>
          </aside>

          <div className="products-content" ref={productsContentRef}>
            <div className="products-toolbar">
              <p>Our collection <span>{products.length} spices</span></p>
              <label className="products-search">
                <FontAwesomeIcon icon={faMagnifyingGlass} aria-hidden="true" />
                <input
                  type="search"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search the Spice name"
                  aria-label="Search products"
                />
              </label>
              {bagCount > 0 && <span className="products-bag-count"><FontAwesomeIcon icon={faBagShopping} /> {bagCount}</span>}
            </div>
            <h2 className='varient-heading'>Elite Spices</h2>
            {products.length > 0 ? (
              <div className="products-grid">
                {paginatedEliteProducts.map((product, index) => {
                  const productId = product._id || product.title
                  const image = product._id ? `${serverUrl}/uploads/${product.image}` : product.image
                  const isLastEliteProduct = (categoryPages.elite - 1) * PRODUCTS_PER_PAGE + index === eliteProducts.length - 1

                  return (
                    <article className="spice-product" key={productId}>
                      <div className="spice-product-image-wrap">
                        <img
                          className="spice-product-image"
                          src={image}
                          alt={product.title}
                          style={{ objectPosition: product.imagePosition || `${50 + (index % 4) * 8}% center` }} />

                        {Number(product.stock) <= 0 ? (
                          <span className="spice-product-tag" style={{ backgroundColor: 'red' }}>Out of Stock</span>
                        ) : productId === bestSellerIds.elite ? (
                          <span className="spice-product-tag">Best seller</span>
                        ) : isLastEliteProduct ? (
                          <span className="spice-product-tag">New</span>
                        ) : null}
                        <button
                          className={`spice-favorite ${favorites.includes(productId) ? 'is-favorite' : ''}`}
                          type="button"
                          aria-label={`${favorites.includes(productId) ? 'Remove' : 'Add'} ${product.title} ${favorites.includes(productId) ? 'from' : 'to'} wishlist`}
                          aria-pressed={favorites.includes(productId)}
                          disabled={pendingFavorites.has(productId)}
                          onClick={() => handleClick(product)}
                        >
                          <FontAwesomeIcon icon={faHeart} />
                        </button>
                      </div>
                      <div className="spice-product-details">
                        <h3>{product.title}</h3>
                        <p>{product.varient || 'Whole Spices'}</p>
                        <p>{product.description}</p>
                        <div className="spice-product-buy">
                          <span>₹ {product.price}<small> /kg</small></span>
                          <button type="button" aria-label={`Add ${product.title} to bag`} onClick={() => { setBagCount((count) => count + 1), addToCart(product) }}>
                            <FontAwesomeIcon icon={faBagShopping} />
                            {/* <FontAwesomeIcon icon={faArrowRight} /> */}
                          </button>
                        </div>
                      </div>
                    </article>
                  )
                })}
                {eliteProducts.length === 0 && (
                  <p className="products-empty">No elite spices match.</p>
                )}
              </div>
            ) : (
              <p className="products-empty">No spices match “{search}”.</p>
            )}
            <ProductPagination
              page={categoryPages.elite}
              pageCount={elitePageCount}
              onPageChange={(page) => setCategoryPage('elite', page)}
              label="Elite"
            />

            <h2 className='varient-heading'>Premium Spices</h2>

            {products.length > 0 ? (
              <div className="products-grid">
                {paginatedPremiumProducts.map((product, index) => {
                  const productId = product._id || product.title
                  const image = product._id ? `${serverUrl}/uploads/${product.image}` : product.image
                  const isLastPremiumProduct = (categoryPages.premium - 1) * PRODUCTS_PER_PAGE + index === premiumProducts.length - 1

                  return (
                    <article className="spice-product" key={productId}>
                      <div className="spice-product-image-wrap">
                        <img
                          className="spice-product-image"
                          src={image}
                          alt={product.title}
                          style={{ objectPosition: product.imagePosition || `${50 + (index % 4) * 8}% center` }} />

                        {Number(product.stock) <= 0 ? (
                          <span className="spice-product-tag" style={{ backgroundColor: 'red' }}>Out of Stock</span>
                        ) : productId === bestSellerIds.premium ? (
                          <span className="spice-product-tag">Best seller</span>
                        ) : isLastPremiumProduct ? (
                          <span className="spice-product-tag">New</span>
                        ) : null}
                        <button
                          className={`spice-favorite ${favorites.includes(productId) ? 'is-favorite' : ''}`}
                          type="button"
                          aria-label={`${favorites.includes(productId) ? 'Remove' : 'Add'} ${product.title} ${favorites.includes(productId) ? 'from' : 'to'} wishlist`}
                          aria-pressed={favorites.includes(productId)}
                          disabled={pendingFavorites.has(productId)}
                          onClick={() => handleClick(product)}
                        >
                          <FontAwesomeIcon icon={faHeart} />
                        </button>
                      </div>
                      <div className="spice-product-details">
                        <h3>{product.title}</h3>
                        <p>{product.varient || 'Whole Spices'}</p>
                        <p>{product.description}</p>
                        <div className="spice-product-buy">
                          <span>₹ {product.price}<small> /kg</small></span>
                          <button type="button" aria-label={`Add ${product.title} to bag`} onClick={() =>{ setBagCount((count) => count + 1), addToCart(product)}}>
                            <FontAwesomeIcon icon={faBagShopping} />
                            {/* <FontAwesomeIcon icon={faArrowRight} /> */}
                          </button>
                        </div>
                      </div>
                    </article>
                  )
                })}
                {premiumProducts.length === 0 && (
                  <p className="products-empty">No premium spices match.</p>
                )}
              </div>
            ) : (
              <p className="products-empty">No spices match “{search}”.</p>
            )}
            <ProductPagination
              page={categoryPages.premium}
              pageCount={premiumPageCount}
              onPageChange={(page) => setCategoryPage('premium', page)}
              label="Premium"
            />

            <h2 className='varient-heading'>Classic Spices</h2>

            {products.length > 0 ? (
              <div className="products-grid">
                {paginatedClassicProducts.map((product, index) => {
                  const productId = product._id || product.title
                  const image = product._id ? `${serverUrl}/uploads/${product.image}` : product.image
                  const isLastClassicProduct = (categoryPages.classic - 1) * PRODUCTS_PER_PAGE + index === classicProducts.length - 1

                  return (
                    <article className="spice-product" key={productId}>
                      <div className="spice-product-image-wrap">
                        <img
                          className="spice-product-image"
                          src={image}
                          alt={product.title}
                          style={{ objectPosition: product.imagePosition || `${50 + (index % 4) * 8}% center` }} />

                        {Number(product.stock) <= 0 ? (
                          <span className="spice-product-tag" style={{ backgroundColor: 'red' }}>Out of Stock</span>
                        ) : productId === bestSellerIds.classic ? (
                          <span className="spice-product-tag">Best seller</span>
                        ) : isLastClassicProduct ? (
                          <span className="spice-product-tag">New</span>
                        ) : null}
                        <button
                          className={`spice-favorite ${favorites.includes(productId) ? 'is-favorite' : ''}`}
                          type="button"
                          aria-label={`${favorites.includes(productId) ? 'Remove' : 'Add'} ${product.title} ${favorites.includes(productId) ? 'from' : 'to'} wishlist`}
                          aria-pressed={favorites.includes(productId)}
                          disabled={pendingFavorites.has(productId)}
                          onClick={() => handleClick(product)}
                        >
                          <FontAwesomeIcon icon={faHeart} />
                        </button>
                      </div>
                      <div className="spice-product-details">
                        <h3>{product.title}</h3>
                        <p>{product.varient || 'Whole Spices'}</p>
                        <p>{product.description}</p>
                        <div className="spice-product-buy">
                          <span>₹ {product.price}<small> /kg</small></span>
                          <button type="button" aria-label={`Add ${product.title} to bag`} onClick={() => {setBagCount((count) => count + 1), addToCart(product)}}>
                            <FontAwesomeIcon icon={faBagShopping} />
                            {/* <FontAwesomeIcon icon={faArrowRight} /> */}
                          </button>
                        </div>
                      </div>
                    </article>
                  )
                })}
                {classicProducts.length === 0 && (
                  <p className="products-empty">No classic spices match.</p>
                )}
              </div>
            ) : (
              <p className="products-empty">No spices match “{search}”.</p>
            )}
            <ProductPagination
              page={categoryPages.classic}
              pageCount={classicPageCount}
              onPageChange={(page) => setCategoryPage('classic', page)}
              label="Classic"
            />


          </div>
        </section>
      </main>
      <ToastContainer position='top-right' autoClose={3000} theme='colored' />
      <Footer />
    </div>
  )
}

export default Allproducts
