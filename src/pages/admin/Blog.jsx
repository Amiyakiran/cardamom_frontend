import { useMemo, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAlignLeft, faBell, faBold, faCalendarDays, faCheckCircle, faChevronDown, faCloudArrowUp, faEdit, faEllipsisVertical, faEye, faFileLines, faImage, faItalic, faLeaf, faLink, faList, faMagnifyingGlass, faPlus, faTrash, faUnderline, faXmark, } from '@fortawesome/free-solid-svg-icons'
import Sidebar from '../../components/admincomponents/Sidebar'
import './Blog.css'
import { addBlogApi } from '../../services/allApi'
import { ToastContainer, toast } from 'react-toastify';


const initialPosts = [
    { title: 'The Amazing Health Benefits of Cardamom', description: 'Discover how cardamom can boost your health naturally...', category: 'Health & Wellness', author: 'Admin', tags: '#health #cardamom', status: 'Published', date: 'Oct 10, 2025', time: '10:30 AM', image: '/assets/pod2.png' },
]

function StatCard({ icon, label, value, detail, tone = 'green' }) {
    return <article className={`blog-stat-card ${tone}`}><span className="blog-stat-icon"><FontAwesomeIcon icon={icon} /></span><div><p>{label}</p><strong>{value}</strong><small>{detail}</small></div><FontAwesomeIcon className="stat-leaf" icon={faLeaf} /></article>
}

function Blog() {
    const [posts, setPosts] = useState(initialPosts)
    const [search, setSearch] = useState('')
    const [category, setCategory] = useState('All Categories')
    const [status, setStatus] = useState('All Status')
    const [form, setForm] = useState(
        {
            title: '',
            image: "",
            category: '',
            status: 'Draft',
            shortDescription: '',
            longDescription: "",
            author: '',
            tags: '',
            seoTitle: '',
            publishDate: ''
        })
    const [notice, setNotice] = useState('')

    const filteredPosts = useMemo(() => posts.filter((post) => (
        post.title.toLowerCase().includes(search.toLowerCase())
        && (category === 'All Categories' || post.category === category)
        && (status === 'All Status' || post.status === status)
    )), [posts, search, category, status])

    const updateForm = (event) => {
        console.log(event.target);

        if (event.target.name != 'uploadImage') {
            setForm((current) => ({ ...current, [event.target.name]: event.target.value }))
        }
        else {
            setForm((current) => ({ ...current, image: event.target.files[0] }))
        }
    }
   // console.log(form);


    const saveBlog = async (event) => {
        event.preventDefault()

        const { title, image, category, status, shortDescription, longDescription, author, tags, seoTitle, publishDate } = form

        const reqHeader = {
            "Content-Type": "multipart/form-data"
        }
        const reqBody = new FormData()

        reqBody.append("title", title)
        reqBody.append("image", image)
        reqBody.append("category", category)
        reqBody.append("status", status)
        reqBody.append("shortDescription", shortDescription)
        reqBody.append("longDescription", longDescription)
        reqBody.append("author", author)
        reqBody.append("seoTitle", seoTitle)
        reqBody.append("tags", tags)
        reqBody.append("publishDate", publishDate)

        const result = await addBlogApi(reqBody, reqHeader)
        //console.log(result);
        if (result.status >= 200 && result.status < 300) {
            toast.success(result.data.message)
            setForm({
                title: '',
                image: "",
                category: '',
                status: 'Draft',
                shortDescription: '',
                longDescription: "",
                author: '',
                tags: '',
                seoTitle: '',
                publishDate: ''
            })
        }
        else{
            toast.error("Something Went wrong. Please try after some time") 
        }

    }

    return (
        <div className="admin-page-shell admin-blog-page">
            <Sidebar activeItem="Blog" />
            <main className="admin-blog-content">
                <header className="admin-blog-topbar">
                    <label className="admin-global-search">
                        <FontAwesomeIcon icon={faMagnifyingGlass} />
                        <input placeholder="Search here..." />
                    </label>
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
                                <FontAwesomeIcon icon={faLeaf} /> Admin <span>›</span> Blog</div>
                            <h1>Blog Management</h1>
                            <p>Create, edit, delete and manage your blog posts.</p>
                        </div>

                    </div>

                    <div className="blog-stat-grid">
                        <StatCard icon={faFileLines} label="Total Blogs" value="18" detail="↑ 2 new this week" />
                        <StatCard icon={faCheckCircle} label="Published" value="12" detail="↑ 1 new this week" />
                        <StatCard icon={faFileLines} label="Draft" value="4" detail="↑ 0 this week" tone="blue" />
                        <StatCard icon={faCalendarDays} label="Scheduled" value="2" detail="↑ 1 this week" tone="gold" /></div>

                    <div className="admin-blog-grid">
                        <section className="admin-blog-table-panel">
                            <div className="blog-filter-row">
                                <label>
                                    <FontAwesomeIcon icon={faMagnifyingGlass} />
                                    <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search blog posts..." />
                                </label>
                                <select value={category} onChange={(event) => setCategory(event.target.value)}>
                                    <option>All Categories</option>
                                    <option>Health & Wellness</option>
                                    <option>Buying Guide</option>
                                    <option>Recipes</option>
                                    <option>Farming</option>
                                    <option>Spices</option>
                                </select>
                                <select value={status} onChange={(event) => setStatus(event.target.value)}>
                                    <option>All Status</option>
                                    <option>Published</option>
                                    <option>Draft</option>
                                    <option>Scheduled</option>
                                </select>
                            </div>
                            <div className="blog-table-scroll">
                                <table className="admin-blog-table">
                                    <thead>
                                        <tr>

                                            <th>Featured Image</th>
                                            <th>Title</th>
                                            <th>Category</th>
                                            <th>Author</th>
                                            <th>Tags</th>
                                            <th>Publish Date</th>
                                            <th>Status</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredPosts.map((post) =>
                                            <tr key={post.title}>

                                                <td>
                                                    <img src={post.image} alt="" />
                                                </td>
                                                <td>
                                                    <strong>{post.title}</strong>
                                                    <small>{post.description}</small>
                                                </td>
                                                <td>
                                                    <span className={`blog-category ${post.category.toLowerCase().replaceAll(' ', '-')}`}>{post.category}</span>
                                                </td>
                                                <td>{post.author}</td>
                                                <td><span className="blog-tags">{post.tags}</span></td>
                                                <td>{post.date}<small>{post.time}</small></td>
                                                <td><span className={`blog-status ${post.status.toLowerCase()}`}>{post.status}</span></td>
                                                <td>
                                                    <div className="blog-row-actions">
                                                        <button type="button" aria-label="Edit">
                                                            <FontAwesomeIcon icon={faEdit} />
                                                        </button>
                                                        <button type="button" aria-label="View">
                                                            <FontAwesomeIcon icon={faEye} />
                                                        </button>
                                                        <button type="button" aria-label="Delete">
                                                            <FontAwesomeIcon icon={faTrash} />
                                                        </button>
                                                        <button type="button" aria-label="More">
                                                            <FontAwesomeIcon icon={faEllipsisVertical} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>)}
                                    </tbody>
                                </table>
                            </div>
                            <div className="blog-table-footer">Showing 1 to {filteredPosts.length} of {posts.length} entries <span><button type="button">‹</button><b>1</b><button type="button">2</button><button type="button">3</button><button type="button">›</button></span></div>
                        </section>

                        <section className="admin-blog-form-panel"><div className="blog-form-title">
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
                            </form></section>
                    </div>
                </section>
            </main>
            <ToastContainer
                position='top-right'
                autoClose={3000}
                theme='colored' />
        </div>
    )
}

export default Blog
