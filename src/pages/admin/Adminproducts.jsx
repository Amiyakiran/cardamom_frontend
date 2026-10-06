import React from 'react'
import Sidebar from '../../components/admincomponents/Sidebar'
import { useMemo, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAlignLeft, faBell, faBold, faCalendarDays, faCheckCircle, faChevronDown, faCloudArrowUp, faEdit, faEllipsisVertical, faEye, faFileLines, faImage, faItalic, faLeaf, faLink, faList, faMagnifyingGlass, faPlus, faTrash, faUnderline, faXmark, } from '@fortawesome/free-solid-svg-icons'
import './Blog.css'
import './Adminproducts.css'
import { ToastContainer, toast } from 'react-toastify';
import { addProductApi, deleteproductApi, editproductApi, getAllProductApi, getAproductApi } from '../../services/allApi'
import { useEffect } from 'react'
import { serverUrl } from '../../services/serverUrl'
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';


function StatCard({ icon, label, value, detail, tone = 'green' }) {
    return <article className={`blog-stat-card ${tone}`}><span className="blog-stat-icon"><FontAwesomeIcon icon={icon} /></span><div><p>{label}</p><strong>{value}</strong><small>{detail}</small></div><FontAwesomeIcon className="stat-leaf" icon={faLeaf} /></article>
}


function Adminproducts() {
    const [search, setSearch] = useState('')

    const [productDetails, setProductDetails] = useState({
        title: "", image: "", varient: "", description: "", stock: "", price: "", date: ""
    })
    const [filter, setFilter] = useState({
        Fvarient: "All Varient",
        Fstock: "All Stock"

    })
    const [stockThreshold, setStockThreshold] = useState(50)
    const [status, setStatus] = useState({
        addStatus: false,
        deleteStatus: false,
        filterStatus: false
    })
    const [allproducts, setAllProducts] = useState({
        allProductArray: [],
        tempArray: []
    })
    const [show, setShow] = useState(false);
    const [editProduct, setEditProduct] = useState({ title: "", image: "", varient: "", description: "", stock: "", price: "", date: "" })



    const handleClose = () => setShow(false);

    const handleShow = async (id) => {
        setShow(true);
        console.log(id);

        const result = await getAproductApi(id)
        // console.log(result);
        setEditProduct(result.data.product)


    }

    // console.log(productDetails);

    const addproducts = async (e) => {
        e.preventDefault()
        const { title, image, varient, description, stock, price, date } = productDetails

        try {
            if (!title || !image || !varient || !description || !stock || !price || !date) {
                toast.info('fil all the fields completely')
            }
            else {
                const reqBody = new FormData()
                reqBody.append("title", title)
                reqBody.append("image", image)
                reqBody.append("varient", varient)
                reqBody.append("description", description)
                reqBody.append("stock", Number(stock))
                reqBody.append("price", Number(price))
                reqBody.append("date", date)

                const header = {
                    "Content-Type": "multipart/form-data"
                }
                const result = await addProductApi(reqBody, header)
                console.log(result);
                if (result.status >= 200 && result.status < 300) {
                    toast.success(result.data.message)
                    setStatus({ ...status, addStatus: !status.addStatus })
                    setProductDetails({
                        title: "", image: "", varient: "", description: "", stock: "", price: "", date: ""
                    })
                }
                else {
                    toast.error("internal server error")
                }

            }
        } catch (error) {
            console.log('something went wrong', error)
        }
    }


    const handleCancel = () => {
        setProductDetails({
            title: "", image: "", varient: "", description: "", stock: "", price: "", date: ""
        })
    }

    const getallProducts = async () => {
        try {
            const result = await getAllProductApi(search)
            //console.log(result);
            setAllProducts({ allProductArray: result.data, tempArray: result.data })

        } catch (error) {
            console.log(error)
        }

    }
    // console.log(allproducts.allproductArray);

    const deleteProduct = async (id) => {
        const result = await deleteproductApi(id)
        console.log(result);
        if (result.status >= 200 && result.status < 300) {
            toast.success('product deleted Successfully')
            setStatus({ ...status, deleteStatus: !status.deleteStatus })
        }

    }
    const filterAllProducts = (nextFilter, thresholdValue = stockThreshold) => {
        const { Fvarient, Fstock } = nextFilter

        const matchesStockFilter = (stock) => {
            if (Fstock === 'All Stock') return true
            if (Fstock === 'In Stock') return Number(stock) >= Number(thresholdValue)
            if (Fstock === 'Low Stock') return Number(stock) > 0 && Number(stock) < Number(thresholdValue)
            if (Fstock === 'Out of Stock') return Number(stock) === 0
            return true
        }

        const filteredProducts = allproducts.tempArray.filter((item) =>
            (Fvarient === "All Varient" || item.varient === Fvarient) &&
            matchesStockFilter(item.stock)
        )

        setAllProducts((current) => ({ ...current, allProductArray: filteredProducts }))
    }

    console.log(editProduct);

    const editProductfunction = async (e) => {
        e.preventDefault()
        const { title, image, varient, description, stock, price, seoTitle, date } = editProduct

        if (!title || !image || !varient || !description || stock === '' || price === '' || !date) {
            toast.info('Please fill all the fields')
            return
        }

        const reqBody = new FormData()
        reqBody.append('title', title)
        if (image instanceof File) reqBody.append('image', image)
        reqBody.append('varient', varient)
        reqBody.append('description', description)
        reqBody.append('stock', Number(stock))
        reqBody.append('price', Number(price))
        reqBody.append('date', date)

        try {
            const result = await editproductApi(editProduct._id, reqBody, { 'Content-Type': 'multipart/form-data' })
            if (result.status >= 200 && result.status < 300) {
                toast.success(result.data.message || 'Product updated successfully')
                setStatus((current) => ({ ...current, addStatus: !current.addStatus }))
                handleClose()
            } else {
                toast.error(result.response?.data?.message || 'Unable to update product')
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Unable to update product')
        }
    }

    useEffect(() => {
        getallProducts()
    }, [status, search])

    return (
        <>
            <div className="admin-page-shell admin-blog-page">
                <Sidebar activeItem="products" />
                <main className="admin-blog-content">
                    <header className="admin-blog-topbar">
                        {/* <label className="admin-global-search">
                            <FontAwesomeIcon icon={faMagnifyingGlass} />
                            <input placeholder="Search here..." />
                        </label> */}
                        <div className="admin-account">
                            <button type="button" aria-label="Notifications">
                                <FontAwesomeIcon icon={faBell} />
                                <b>3</b>
                            </button>
                            <span className="admin-account-avatar">A</span>
                            <strong>Admin</strong>
                            <FontAwesomeIcon icon={faChevronDown} /></div>
                    </header>

                    <section className="admin-blog-main">
                        <div className="admin-blog-heading">
                            <div>
                                <div className="admin-blog-breadcrumb">
                                    <FontAwesomeIcon icon={faLeaf} /> Admin <span>›</span> Products</div>
                                <h1>Product Management</h1>
                                <p>Manage your products, Update price, stock and availability</p>
                            </div>

                        </div>

                        <div className="blog-stat-grid">
                            <StatCard icon={faFileLines} label="Total products" value={allproducts.allProductArray.length} detail="↑ 2 new this week" />
                            <StatCard icon={faCheckCircle} label="In stock" value={allproducts.allProductArray.filter((item) => Number(item.stock) >= Number(stockThreshold))?.length} detail="↑ 1 new this week" />
                            <StatCard icon={faFileLines} label="Low stock" value={allproducts.allProductArray.filter((item) => Number(item.stock) > 0 && Number(item.stock) < Number(stockThreshold))?.length} detail="↑ 0 this week" tone="blue" />
                            <StatCard icon={faCalendarDays} label="Out of stock" value={allproducts.allProductArray.filter((item) => Number(item.stock) === 0)?.length} detail="↑ 1 this week" tone="gold" /></div>

                        <div className="admin-blog-grid">
                            <section className="admin-blog-table-panel">
                                <div className="blog-filter-row">
                                    <label>
                                        <FontAwesomeIcon icon={faMagnifyingGlass} />
                                        <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search by product name" />
                                    </label>
                                    <select name='varient' value={filter.Fvarient} onChange={(event) => {
                                        const nextFilter = { ...filter, Fvarient: event.target.value }
                                        setFilter(nextFilter)
                                        filterAllProducts(nextFilter)
                                    }}>
                                        <option value={'All Varient'}>All Varient</option>
                                        <option value={'Elite (1st quality)'}>Elite (1st quality)</option>
                                        <option value={'Premium (2nd quality)'}>Premium (2nd quality)</option>
                                        <option value={'Classic (low quality)'}>Classic (low quality)</option>

                                    </select>
                                    <select name='Stock' value={filter.Fstock} onChange={(event) => {
                                        const nextFilter = { ...filter, Fstock: event.target.value }
                                        setFilter(nextFilter)
                                        filterAllProducts(nextFilter)
                                    }}>
                                        <option value={'All Stock'}>All Stock</option>
                                        <option value={'In Stock'}>In Stock</option>
                                        <option value={'Low Stock'}>Low Stock</option>
                                        <option value={'Out of Stock'}>Out of Stock</option>
                                    </select>
                                </div>
                                <div className="blog-table-scroll">
                                    <table className="admin-blog-table">
                                        <thead>
                                            <tr>

                                                <th>Featured Image</th>
                                                <th>Title</th>
                                                <th>Varient</th>
                                                <th>Price</th>
                                                <th>Stock</th>
                                                <th>Status</th>
                                                <th>Added Date</th>
                                                <th>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>

                                            {allproducts.allProductArray.map((item, index) => (
                                                <tr key={index}>

                                                    <td>
                                                        <img src={`${serverUrl}/uploads/${item.image}`} alt="" />
                                                    </td>
                                                    <td>
                                                        <strong>{item.title}</strong>
                                                        <small>{item.description}</small>
                                                    </td>
                                                    <td>
                                                        {item.varient}
                                                    </td>
                                                    <td>₹ {item.price}/kg</td>
                                                    <td>{item.stock} kg</td>
                                                    <td>
                                                        {Number(item.stock) >= Number(stockThreshold) ? (<span className='blog-tags' style={{ backgroundColor: 'green', color: 'white' }}>in stock</span>) : Number(item.stock) === 0 ? (<span className='blog-tags' style={{ backgroundColor: 'red', color: 'white' }}>out of stock</span>) :
                                                            (<span className='blog-tags'>Low stock</span>)
                                                        }

                                                    </td>
                                                    <td>{item.date}</td>

                                                    <td>
                                                        <div className="blog-row-actions">
                                                            <button onClick={() => handleShow(item._id)} type="button" aria-label="Edit" style={{ backgroundColor: 'blue', color: 'white' }}>
                                                                <FontAwesomeIcon icon={faEdit} />
                                                            </button>

                                                            <button type="button" aria-label="Delete" style={{ backgroundColor: 'red', color: 'white' }}>
                                                                <FontAwesomeIcon icon={faTrash} onClick={() => deleteProduct(item._id)} />
                                                            </button>

                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                            </section>



                            <div>

                                <div className="blog-form-title" style={{width:'100%', margin:'5px 0'}}>
                                    <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', fontSize:'10px',width:'100%',  color:' #bfbfbf'}}>
                                        <label >Default Stock Threshold</label>
                                        <input
                                            id="stock-threshold"
                                            type="text"
                                            min="0"
                                            value={stockThreshold}
                                            onChange={(event) => {
                                                const nextThreshold = Number(event.target.value)
                                                const safeThreshold = Number.isFinite(nextThreshold) && nextThreshold >= 0 ? nextThreshold : 0
                                                setStockThreshold(safeThreshold)
                                                filterAllProducts(filter, safeThreshold)
                                            }}
                                            placeholder="Stock Threshold = 50"
                                            style={{ width: '100%', padding: '5px 12px', borderRadius: '5px', border: '1px solid #d9d9d9' }}
                                        />
                                    </div>
                                </div>

                                <section className="admin-blog-form-panel">



                                    <div className="blog-form-title">
                                        <div>
                                            <h2><FontAwesomeIcon icon={faFileLines} /> Add New Product</h2>
                                            <p>Fill in the details below to create a new product to the list.</p>
                                        </div>

                                    </div>


                                    <form className="admin-blog-form" onSubmit={(e) => addproducts(e)} >
                                        <label>Product Title <em>*</em>
                                            <input name="title" value={productDetails.title} placeholder="Enter Product title" required onChange={(e) => setProductDetails({ ...productDetails, title: e.target.value })} />
                                        </label>
                                        <label>Featured Image <em>*</em>
                                            <div className="blog-upload">
                                                <input name='image' type="file" id='imageUpload' onChange={(e) => setProductDetails({ ...productDetails, image: e.target.files[0] })} />
                                                <FontAwesomeIcon icon={faCloudArrowUp} />
                                                {productDetails.image == "" ? <span>Click to upload or drag and drop</span>
                                                    : <span>{productDetails.image.name}</span>}
                                                <small>PNG, JPG (Max 2MB)</small>
                                            </div>
                                        </label>

                                        <div className="blog-form-row">
                                            <label>Varient <em>*</em>
                                                <select name="varient" value={productDetails.varient} onChange={(e) => setProductDetails({ ...productDetails, varient: e.target.value })} >
                                                    <option>select Varient</option>
                                                    <option>Elite (1st quality)</option>
                                                    <option>Premium (2nd quality)</option>
                                                    <option>Classic (low quality)</option>
                                                </select>
                                            </label>
                                            <label>Price <em>*</em><input name="price" placeholder="₹" value={productDetails.price} onChange={(e) => setProductDetails({ ...productDetails, price: e.target.value })} />
                                            </label>
                                        </div>
                                        <label>Description <em>*</em>
                                            <textarea name="Description" value={productDetails.description} placeholder="Enter a description (e.g., 1–2 lines)" rows="2" onChange={(e) => setProductDetails({ ...productDetails, description: e.target.value })} />
                                        </label>

                                        <div className="blog-form-row">
                                            <label>Stock <em>*</em>
                                                <input value={productDetails.stock} name="stock" placeholder='per kg' onChange={(e) => setProductDetails({ ...productDetails, stock: e.target.value })} />

                                            </label>
                                            <label>Added Date <em>*</em>
                                                <span className="blog-date-input">
                                                    <input type='date' value={productDetails.date} name="date" placeholder="dd/mm/yyyy" onChange={(e) => setProductDetails({ ...productDetails, date: e.target.value })} />
                                                </span>
                                            </label>

                                        </div>
                                        <div className="blog-form-actions">
                                            <button type="button" onClick={handleCancel} >Cancel</button>
                                            <button className="blog-primary-button" type="submit">Save</button>
                                        </div>
                                    </form>
                                </section>


                            </div>


                        </div>
                    </section>
                </main>
                <ToastContainer
                    position='top-right'
                    autoClose={3000}
                    theme='colored' />
            </div>

            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>
                        <h2 style={{ fontFamily: ' Playfair Display, serif' }} className='text-success fs-5 modaltitle' ><FontAwesomeIcon icon={faFileLines} /> Edit Product</h2>
                        <p style={{ fontSize: '10px' }} className='text-secondary'>Fill in the details below to create a new product to the list.</p></Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form className="admin-blog-form" onSubmit={editProductfunction}>
                        <label>Product Title <em>*</em>
                            <input name="title" value={editProduct.title} placeholder="Enter Product title" onChange={(e) => setEditProduct({ ...editProduct, title: e.target.value })} />
                        </label>
                        <label>Featured Image <em>*</em>
                            <div className="blog-upload">
                                <input name='image' type="file" id='imageUpload' onChange={(e) => setEditProduct({ ...editProduct, image: e.target.files[0] })} />
                                <FontAwesomeIcon icon={faCloudArrowUp} />
                                <span>{editProduct.image instanceof File ? editProduct.image.name : editProduct.image}</span>
                                <small>PNG, JPG (Max 2MB)</small>
                            </div>
                        </label>

                        <div className="blog-form-row">
                            <label>Varient <em>*</em>
                                <select name="varient" value={editProduct.varient} onChange={(e) => setEditProduct({ ...editProduct, varient: e.target.value })} >
                                    <option>select Varient</option>
                                    <option>Elite (1st quality)</option>
                                    <option>Premium (2nd quality)</option>
                                    <option>Classic (low quality)</option>
                                </select>
                            </label>

                             <label>Price <em>*</em><input name="price" placeholder="₹" value={editProduct.price} onChange={(e) => setEditProduct({ ...editProduct, price: e.target.value })} />
                            </label>
                           
                        </div>
                        <label>Description <em>*</em>
                            <textarea name="Description" value={editProduct.description} placeholder="Enter a description (e.g., 1–2 lines)" rows="2" onChange={(e) => setEditProduct({ ...editProduct, description: e.target.value })} />
                        </label>

                        <div className="blog-form-row">
                            <label>Stock <em>*</em>
                                <input value={editProduct.stock} name="stock" placeholder='In packets' onChange={(e) => setEditProduct({ ...editProduct, stock: e.target.value })} />

                            </label>
                              <label>Added Date <em>*</em>
                                <span className="blog-date-input">
                                    <input type='date' value={editProduct.date} name="date" placeholder="dd/mm/yyyy" onChange={(e) => setEditProduct({ ...editProduct, date: e.target.value })} />
                                </span>
                            </label>
                           
                        </div>
                        

                        <div className="blog-form-actions"><button type="button" onClick={handleClose} >Cancel</button>
                            <button className="blog-primary-button" type="submit">Save</button></div>
                    </form>
                </Modal.Body>

            </Modal>
        </>
    )
}

export default Adminproducts
