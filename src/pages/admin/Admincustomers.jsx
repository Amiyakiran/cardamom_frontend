import React from 'react'
import Sidebar from '../../components/admincomponents/Sidebar'
import { useMemo, useState,  useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAlignLeft, faBell, faBold, faCalendarDays, faCheckCircle, faChevronDown, faCloudArrowUp, faEdit, faEllipsisVertical, faEye, faFileLines, faImage, faItalic, faLeaf, faLink, faList, faMagnifyingGlass, faPlus, faTrash, faUnderline, faXmark,faUserSlash } from '@fortawesome/free-solid-svg-icons'
import './Admincustomers.css'
import { ToastContainer, toast } from 'react-toastify';
import { getAllUsersApi } from '../../services/allApi'

function StatCard({ icon, label, value, detail, tone = 'green' }) {
    return <article className={`blog-stat-card ${tone}`}><span className="blog-stat-icon"><FontAwesomeIcon icon={icon} /></span><div><p>{label}</p><strong>{value}</strong><small>{detail}</small></div><FontAwesomeIcon className="stat-leaf" icon={faLeaf} /></article>
}

function Admincustomers() {

  const [search , setSearch] = useState("")
  const [allusers, setAllUsers] = useState([])

  const getAllUsers = async()=>{
    const result = await getAllUsersApi()
    console.log(result);
    setAllUsers(result.data.allUsers)
    
  }
  const deleteUser = (id)=>{
    
  }

  useEffect(()=>{
    getAllUsers()

  },[])

  return (
    <div className="admin-page-shell admin-blog-page">
            <Sidebar activeItem="Customers" />
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
                                <FontAwesomeIcon icon={faLeaf} /> Admin <span>›</span> Customer</div>
                            <h1>Customer Management</h1>
                            <p>Manage Your Customer and view their details</p>
                        </div>

                    </div>

                    <div className="blog-stat-grid">
                        <StatCard icon={faFileLines} label="Total Customers" value="18" detail="↑ 2 new this week" />
                        <StatCard icon={faCheckCircle} label="Active Customers" value="12" detail="↑ 1 new this week" />
                        <StatCard icon={faFileLines} label="New Customers" value="4" detail="↑ 0 this week" tone="blue" />
                        <StatCard icon={faCalendarDays} label="Blocked Customers" value="2" detail="↑ 1 this week" tone="gold" />
                        </div>

                    <div >
                        <section className="admin-blog-table-panel">
                            <div className="blog-filter-row">
                                <label>
                                    <FontAwesomeIcon icon={faMagnifyingGlass} />
                                    <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search Customers by name,email,phone..." />
                                </label>
                                {/* <select >
                                    <option>All Categories</option>
                                    <option>Health & Wellness</option>
                                    <option>Buying Guide</option>
                                    <option>Recipes</option>
                                    <option>Farming</option>
                                    <option>Spices</option>
                                </select> */}
                                <select>
                                    <option>All Status</option>
                                    <option>Active</option>
                                    <option>InActive</option>
                                    <option>Deactivated</option>
                                    <option>Blocked</option>
                                </select>
                            </div>
                            <div className="blog-table-scroll">
                                <table className="admin-blog-table">
                                    <thead>
                                        <tr>

                                            <th>Featured Image</th>
                                            <th>Name</th>
                                            <th>Email</th>
                                            <th>Phone Number</th>
                                            <th>Total Order</th>
                                             <th>Status</th>
                                            <th>Joined Date</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                       
                                           {allusers.map((user)=>(
                                            <tr >

                                                <td>
                                                    <span className="admin-account-avatar">{user.name[0].toUpperCase()}</span>
                                                </td>
                                                <td>
                                                    <strong>{user.name}</strong>
                                                    {/* <small>post.description</small> */}
                                                </td>
                                                <td>
                                                  <span>{user.email}</span>
                                                    {/* <span className={`blog-category ${post.category.toLowerCase().replaceAll(' ', '-')}`}>{post.category}</span> */}
                                                </td>
                                                <td>Nil</td>
                                              
                                                <td>0</td>
                                                  <td><span className="blog-tags" style={{backgroundColor:'green', color:'white'}}>Active</span>
                                                  <span className="blog-tags" >InActive</span>
                                                  <span className="blog-tags" style={{backgroundColor:'red', color:'white'}}>DeActivated</span>
                                                  <span className="blog-tags" style={{backgroundColor:'yellow', color:'black'}}>Blocked</span></td>
                                                  <td>{user.createdAt}</td>
                                                  <td>
                                                  
                                                    <div className="blog-row-actions">
                                                        <button style={{backgroundColor:'yellow', color:'black'}} type="button" aria-label="View">
                                                            <FontAwesomeIcon icon={faUserSlash} />
                                                        </button>
                                                        <button onClick={()=>deleteUser(user._id)} type="button" aria-label="Delete" style={{backgroundColor:'red'}}>
                                                            <FontAwesomeIcon icon={faTrash}  />
                                                        </button>
                                                       
                                                    </div>
                                                </td>
                                            </tr>
                                           )) }


                                    </tbody>
                                </table>
                            </div>
                            {/* <div className="blog-table-footer">Showing 1 to {filteredPosts.length} of {posts.length} entries <span><button type="button">‹</button><b>1</b><button type="button">2</button><button type="button">3</button><button type="button">›</button></span></div> */}
                        </section>

                        {/* <section className="admin-blog-form-panel"><div className="blog-form-title">
                            <div>
                                <h2><FontAwesomeIcon icon={faFileLines} /> Add New Blog</h2>
                                <p>Fill in the details below to create a new blog post.</p></div>
                            <button type="button" onClick={() => setForm(emptyForm)} aria-label="Clear form"><FontAwesomeIcon icon={faXmark} /></button>
                        </div>
                            <form className="admin-blog-form" onSubmit={saveBlog}>
                                <label>Blog Title <em>*</em>
                                    <input name="title" value={form.title} onChange={updateForm} placeholder="Enter blog title" required />
                                </label>
                                <label>Featured Image <em>*</em>
                                    <div className="blog-upload">
                                        <input name='uploadImage' type="file" id='imageUpload' onChange={updateForm} />
                                        <FontAwesomeIcon icon={faCloudArrowUp} />
                                        {form.image == "" ? <span>Click to upload or drag and drop</span>
                                            : <span>{form.image.name}</span>}
                                        <small>PNG, JPG (Max 2MB)</small>
                                    </div>
                                </label>

                                <div className="blog-form-row">
                                    <label>Category <em>*</em>
                                        <select name="category" value={form.category} onChange={updateForm}>
                                            <option value="">Select category</option><option>Recipes</option><option>Farming</option><option>Health & Wellness</option><option>Buying Guide</option></select></label><label>Status <em>*</em><select name="status" value={form.status} onChange={updateForm}><option>Draft</option><option>Published</option><option>Scheduled</option>
                                            </select>
                                    </label>
                                </div>
                                <label>Short Description <em>*</em>
                                    <textarea name="shortDescription" value={form.shortDescription} onChange={updateForm} placeholder="Enter a short description (e.g., 1–2 lines)" rows="2" />
                                </label>
                                <label>Content Editor <em>*</em>
                                    <div className="blog-editor">
                                        <div><FontAwesomeIcon icon={faBold} /><FontAwesomeIcon icon={faItalic} /><FontAwesomeIcon icon={faUnderline} /><FontAwesomeIcon icon={faList} /><FontAwesomeIcon icon={faAlignLeft} /><FontAwesomeIcon icon={faImage} /><FontAwesomeIcon icon={faLink} /><FontAwesomeIcon icon={faChevronDown} /></div>
                                        <textarea name='longDescription' value={form.longDescription} placeholder="Write your blog content here..." rows="5" onChange={updateForm} />
                                    </div>
                                </label>

                                <div className="blog-form-row">
                                    <label>Author <em>*</em>
                                        <input name="author" value={form.author} onChange={updateForm} placeholder='Author Name' />

                                    </label>
                                    <label>Tags<input name="tags" value={form.tags} onChange={updateForm} placeholder="Add tags (comma separated)" />
                                    </label>
                                </div>
                                <div className="blog-form-row">
                                    <label>SEO Title <em>*</em>
                                        <input name="seoTitle" value={form.seoTitle} onChange={updateForm} placeholder="Enter SEO title" />
                                    </label>
                                    <label>Publish Date <em>*</em>
                                        <span className="blog-date-input">
                                            <input type='date' name="publishDate" value={form.publishDate} onChange={updateForm} placeholder="dd/mm/yyyy" />
                                        </span>
                                    </label>

                                </div>

                                <div className="blog-form-actions"><button type="button" onClick={() => setForm(emptyForm)}>Cancel</button>
                                    <button className="blog-primary-button" type="submit">Save</button></div>{notice && <p className="blog-notice" role="status">{notice}</p>}
                            </form></section> */}
                    </div>
                </section>
            </main>
            <ToastContainer position='top-right' autoClose={3000} theme='colored' />
        </div>
  )
}

export default Admincustomers
