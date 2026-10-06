import { useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRight, faBagShopping, faHeart, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'
import Header from '../components/Header'
import { getAllProductApi } from '../services/allApi'
import { serverUrl } from '../services/serverUrl'
import './Allproducts.css'
import Footer from '../components/Footer'



function Allproducts() {
  const [products, setProducts] = useState([])
  const [search, setSearch] = useState('')
  const [favorites, setFavorites] = useState([])
  const [bagCount, setBagCount] = useState(0)

  const getAllProducts = async () => {
    const result = await getAllProductApi(search)
    console.log(result.data);

    setProducts(result.data)
  }

  useEffect(() => {
    const savedWishlist = JSON.parse(localStorage.getItem('wishlist') || '[]')
    setFavorites(savedWishlist)
  }, [])

  const handleClick = (product) => {
    const productId = product._id || product.title

    setFavorites((currentFavorites) => {
      const isFavorite = currentFavorites.includes(productId)
      const nextFavorites = isFavorite
        ? currentFavorites.filter((id) => id !== productId)
        : [...currentFavorites, productId]

      localStorage.setItem('wishlist', JSON.stringify(nextFavorites))
      return nextFavorites
    })
  }

  useEffect(() => {
    getAllProducts()
  }, [search])



  // const toggleFavorite = (product) => {
  //   const productId = product._id || product.title
  //   const wishlist = readWishlist()
  //   const nextWishlist = wishlist.some((item) => item.id === productId)
  //     ? wishlist.filter((item) => item.id !== productId)
  //     : [...wishlist, {
  //       id: productId,
  //       title: product.title,
  //       price: product.price,
  //       varient: product.varient || 'Whole Spices',
  //       quantity: product.quantity || '100g',
  //       image: product._id ? `${serverUrl}/uploads/${product.image}` : product.image,
  //     }]

  //   localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(nextWishlist))
  //   setFavorites(nextWishlist.map((item) => item.id))
  // }

  return (
    <div className="products-page">
      <Header activePage="products" />

      <main>
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

          <div className="products-content">
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
                {products.filter((item) => item.varient === 'Elite (1st quality)').map((product, index, array) => {
                  const productId = product._id || product.title
                  const image = product._id ? `${serverUrl}/uploads/${product.image}` : product.image

                  return (
                    <article className="spice-product" key={productId}>
                      <div className="spice-product-image-wrap">
                        <img
                          className="spice-product-image"
                          src={image}
                          alt={product.title}
                          style={{ objectPosition: product.imagePosition || `${50 + (index % 4) * 8}% center` }} />

                        {(index === 0 && index !== array.length - 1) && <span className="spice-product-tag">Best seller</span>}
                        {index === array.length - 1 && <span className="spice-product-tag">New</span>}
                        {product.stock == 0 && <span className="spice-product-tag" style={{ backgroundColor: 'red' }}>Out of Stock</span>}
                        <button
                          className={`spice-favorite ${favorites.includes(productId) ? 'is-favorite' : ''}`}
                          type="button"
                          aria-label={`${favorites.includes(productId) ? 'Remove' : 'Add'} ${product.title} ${favorites.includes(productId) ? 'from' : 'to'} wishlist`}
                          aria-pressed={favorites.includes(productId)}
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
                          <button type="button" aria-label={`Add ${product.title} to bag`} onClick={() => setBagCount((count) => count + 1)}>
                            <FontAwesomeIcon icon={faBagShopping} />
                            {/* <FontAwesomeIcon icon={faArrowRight} /> */}
                          </button>
                        </div>
                      </div>
                    </article>
                  )
                })}
                {products.filter((item) => item.varient === 'Elite (1st quality)').length === 0 && (
                  <p className="products-empty">No elite spices match.</p>
                )}
              </div>
            ) : (
              <p className="products-empty">No spices match “{search}”.</p>
            )}

            <h2 className='varient-heading'>Premium Spices</h2>

            {/* {products.length > 0 ? (
              <div className="products-grid">
                {products.filter((item) => item.varient === 'Premium (2nd quality)').map((product, index, array) => {
                  const productId = product._id || product.title
                  const image = product._id ? `${serverUrl}/uploads/${product.image}` : product.image

                  return (
                    <article className="spice-product" key={productId}>
                      <div className="spice-product-image-wrap">
                        <img
                          className="spice-product-image"
                          src={image}
                          alt={product.title}
                          style={{ objectPosition: product.imagePosition || `${50 + (index % 4) * 8}% center` }}
                          onError={(event) => { event.currentTarget.src = '/assets/hero_IMAGE.png' }}
                        />
                        {(index === 0 && index !== array.length - 1) && <span className="spice-product-tag">Best seller</span>}
                        {(index === array.length - 1) && <span className="spice-product-tag">New</span>}
                        {product.stock == 0 && <span className="spice-product-tag" style={{ backgroundColor: 'red' }}>Out of Stock</span>}
                        <button
                          className={`spice-favorite${favorites.includes(productId) ? ' is-favorite' : ''}`}
                          type="button"
                          aria-label={`${favorites.includes(productId) ? 'Remove' : 'Add'} ${product.title} ${favorites.includes(productId) ? 'from' : 'to'} favorites`}
                          aria-pressed={favorites.includes(productId)}
                          onClick={() => toggleFavorite(product)}
                        >
                          <FontAwesomeIcon icon={faHeart} />
                        </button>
                      </div>
                      <div className="spice-product-details">
                        <h3>{product.title}</h3>
                        <p>{product.varient || 'Whole Spices'}</p>
                        <p>{product.description}</p>
                        <div className="spice-product-buy">
                          <span>₹ {product.price}<small> / {product.quantity || '100g'}</small></span>
                          <button type="button" aria-label={`Add ${product.title} to bag`} onClick={() => setBagCount((count) => count + 1)}>
                            <FontAwesomeIcon icon={faBagShopping} />

                          </button>
                        </div>
                      </div>
                    </article>
                  )
                })}
                {products.filter((item) => item.varient === 'Premium (2nd quality)').length === 0 && (
                  <p className="products-empty">No premium spices match</p>
                )}
              </div>
            ) : (
              <p className="products-empty">No spices match “{search}”.</p>
            )} */}

            <h2 className='varient-heading'>Classic Spices</h2>

            {/* {products.length > 0 ? (
              <div className="products-grid">
                {products.filter((item) => item.varient === 'Classic (low quality)').map((product, index, array) => {
                  const productId = product._id || product.title
                  const image = product._id ? `${serverUrl}/uploads/${product.image}` : product.image

                  return (
                    <article className="spice-product" key={productId}>
                      <div className="spice-product-image-wrap">
                        <img
                          className="spice-product-image"
                          src={image}
                          alt={product.title}
                          style={{ objectPosition: product.imagePosition || `${50 + (index % 4) * 8}% center` }}
                          onError={(event) => { event.currentTarget.src = '/assets/hero_IMAGE.png' }}
                        />
                        {(index === 0 && index !== array.length - 1) && <span className="spice-product-tag">Best seller</span>}
                        {index === array.length - 1 && <span className="spice-product-tag">New</span>}
                        {product.stock == 0 && <span className="spice-product-tag" style={{ backgroundColor: 'red' }}>Out of Stock</span>}
                        <button
                          className={`spice-favorite${favorites.includes(productId) ? ' is-favorite' : ''}`}
                          type="button"
                          aria-label={`${favorites.includes(productId) ? 'Remove' : 'Add'} ${product.title} ${favorites.includes(productId) ? 'from' : 'to'} favorites`}
                          aria-pressed={favorites.includes(productId)}
                          onClick={() => toggleFavorite(product)}
                        >
                          <FontAwesomeIcon icon={faHeart} />
                        </button>
                      </div>
                      <div className="spice-product-details">
                        <h3>{product.title}</h3>
                        <p>{product.varient || 'Whole Spices'}</p>
                        <p>{product.description}</p>
                        <div className="spice-product-buy">
                          <span>₹ {product.price}<small> / {product.quantity || '100g'}</small></span>
                          <button type="button" aria-label={`Add ${product.title} to bag`} onClick={() => setBagCount((count) => count + 1)}>
                            <FontAwesomeIcon icon={faBagShopping} />

                          </button>
                        </div>
                      </div>
                    </article>
                  )
                })}
                {products.filter((item) => item.varient === 'Classic (low quality)').length === 0 && (
                  <p className="products-empty">No classic spices match </p>
                )}
              </div>
            ) : (
              <p className="products-empty">No spices match “{search}”.</p>
            )} */}


          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

export default Allproducts
