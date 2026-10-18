import { useEffect, useMemo, useRef, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBell, faBold, faCalendarDays, faCheckCircle, faChevronDown, faCloudArrowUp, faEdit, faEllipsisVertical, faEye, faFileLines, faItalic, faLeaf, faLink, faList, faMagnifyingGlass, faTrash, faUnderline, faXmark, } from '@fortawesome/free-solid-svg-icons'
import Modal from 'react-bootstrap/Modal';
import Sidebar from '../../components/admincomponents/Sidebar'
import './Blog.css'
import { addBlogApi, deleteBlogApi, getAllBlogApi } from '../../services/allApi'
import { ToastContainer, toast } from 'react-toastify';
import { serverUrl } from '../../services/serverUrl'
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";

const BLOGS_PER_PAGE = 4



function StatCard({ icon, label, value, detail, tone = 'green' }) {
    return <article className={`blog-stat-card ${tone}`}><span className="blog-stat-icon"><FontAwesomeIcon icon={icon} /></span><div><p>{label}</p><strong>{value}</strong><small>{detail}</small></div><FontAwesomeIcon className="stat-leaf" icon={faLeaf} /></article>
}

function Blog() {
    const [posts, setPosts] = useState([])
    const [blogPage, setBlogPage] = useState(1)
    const [search, setSearch] = useState('')
    const [category, setCategory] = useState('All Categories')
    const [status, setStatus] = useState('All Status')
    const [form, setForm] = useState({
        title: '',
        image: '',
        category: '',
        status: 'Draft',
        shortDescription: '',
        longDescription: '',
        author: '',
        tags: '',
        seoTitle: '',
        publishDate: ''
    })
    const [notice, setNotice] = useState('')
    // const editorRef = useRef(null)
    const [tableChangeStatus, setTableChangeStatus] = useState(false)
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = (id) => {
        setShow(true)

    }



    console.log(form);



    // to add data to form
    const updateForm = (event) => {
        if (event.target.name === 'uploadImage') {
            const image = event.target.files?.[0]
            if (!image) return
            if (!['image/png', 'image/jpeg'].includes(image.type)) {
                toast.error('Choose a PNG or JPG image.')
                event.target.value = ''
                return
            }
            setForm((current) => ({ ...current, image }))
            return
        }
        setForm((current) => ({ ...current, [event.target.name]: event.target.value }))
    }
    //reset the form
    const resetForm = () => {
        setForm({
            title: '',
            image: "",
            category: '',
            status: 'Draft',
            shortDescription: '',
            longDescription: '',
            author: '',
            tags: '',
            seoTitle: '',
            publishDate: ''
        })
        // setNotice('')
        // if (editorRef.current) editorRef.current.innerHTML = ''
        // const imageInput = document.getElementById('imageUpload')
        // if (imageInput) imageInput.value = ''
    }
    //GET all blog
    const loadBlogs = async () => {
        const result = await getAllBlogApi()
        console.log(result);

        if (result?.status === 200 && Array.isArray(result.data)) {
            setPosts(result.data)
        }
    }

    const postCounts = useMemo(() => ({
        total: posts.length,
        published: posts.filter((post) => post.status === 'Published').length,
        draft: posts.filter((post) => post.status === 'Draft').length,
    }), [posts])

    const filteredPosts = useMemo(() => posts.filter((post) => (
        post.title.toLowerCase().includes(search.toLowerCase())
        && (category === 'All Categories' || post.category === category)
        && (status === 'All Status' || post.status === status)
    )), [posts, search, category, status])
    const pageCount = Math.ceil(filteredPosts.length / BLOGS_PER_PAGE)
    const currentBlogPage = Math.min(blogPage, Math.max(pageCount, 1))
    const paginatedPosts = filteredPosts.slice(
        (currentBlogPage - 1) * BLOGS_PER_PAGE,
        currentBlogPage * BLOGS_PER_PAGE
    )
    const firstVisiblePost = filteredPosts.length === 0 ? 0 : (currentBlogPage - 1) * BLOGS_PER_PAGE + 1
    const lastVisiblePost = Math.min(currentBlogPage * BLOGS_PER_PAGE, filteredPosts.length)

    // const updateLongDescription = () => {
    //     setForm((current) => ({
    //         ...current,
    //         longDescription: editorRef.current?.innerHTML || ''
    //     }))
    // }

    // const runEditorCommand = (command) => {
    //     const editor = editorRef.current
    //     if (!editor) return

    //     editor.focus()
    //     if (command === 'createLink') {
    //         if (!window.getSelection()?.toString().trim()) {
    //             toast.info('Select the text you want to link first.')
    //             return
    //         }

    //         const enteredUrl = window.prompt('Enter a URL for this link')
    //         if (!enteredUrl) return
    //         const trimmedUrl = enteredUrl.trim()
    //         const href = trimmedUrl.startsWith('www.') ? `https://${trimmedUrl}` : trimmedUrl
    //         if (!/^(https?:\/\/[^\s]+|mailto:[^\s@]+@[^\s@]+\.[^\s@]+)$/i.test(href)) {
    //             toast.error('Enter a valid HTTP, HTTPS, or email link.')
    //             return
    //         }
    //         document.execCommand('createLink', false, href)
    //     } else {
    //         document.execCommand(command, false, null)
    //     }
    //     updateLongDescription()
    // }

    //add blog
    const saveBlog = async (e) => {
        console.log('Inside save blog function');

        e.preventDefault()
        // const longDescription = editorRef.current?.innerHTML || ''
        // if (!editorRef.current?.innerText.trim()) {
        //     toast.error('Add content to the blog editor.')
        //     return
        // }

        const reqBody = new FormData()
        reqBody.append("title", form.title)
        reqBody.append("image", form.image)
        reqBody.append("category", form.category)
        reqBody.append("status", form.status)
        reqBody.append("shortDescription", form.shortDescription)
        reqBody.append("longDescription", form.longDescription)
        reqBody.append("author", form.author)
        reqBody.append("tags", form.tags)
        reqBody.append("seoTitle", form.seoTitle)
        reqBody.append("publishDate", form.publishDate)

        try {
            const result = await addBlogApi(reqBody, { "Content-Type": "multipart/form-data" })
            console.log(result);
            if (result.status >= 200 && result.status < 300) {
                setTableChangeStatus(!tableChangeStatus)
                toast.success(result.data.message)
                resetForm()
            } else {
                toast.error(result?.response?.data?.message || 'Unable to create the blog post.')
            }
        } catch {
            toast.error('Unable to create the blog post. Please try again.')
        }
    }

    //delete blog
    const deleteBlog = async (id) => {
        const result = await deleteBlogApi(id)
        console.log(result);
        if (result.status >= 200 && result.status < 300) {
            setTableChangeStatus(!tableChangeStatus)
        } else {
            toast.error("Something went wrong")
        }

    }

    useEffect(() => {
        loadBlogs()
    }, [tableChangeStatus])


    return (
        <div className="admin-page-shell admin-blog-page">
            <Sidebar activeItem="Blog" />
            <main className="admin-blog-content">
                <header className="admin-blog-topbar">

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

                    <div className="blog-stat-grid blog-management-stat-grid">
                        <StatCard icon={faFileLines} label="Total Blogs" value={postCounts.total} detail="All blog posts" />
                        <StatCard icon={faCheckCircle} label="Published" value={postCounts.published} detail="Live on your site" />
                        <StatCard icon={faFileLines} label="Draft" value={postCounts.draft} detail="Not yet published" tone="blue" />

                    </div>

                    <div className="admin-blog-grid">
                        <section className="admin-blog-table-panel">
                            <div className="blog-filter-row">
                                <label>
                                    <FontAwesomeIcon icon={faMagnifyingGlass} />
                                    <input value={search} onChange={(event) => { setSearch(event.target.value); setBlogPage(1) }} placeholder="Search blog posts..." />
                                </label>
                                <select value={category} onChange={(event) => { setCategory(event.target.value); setBlogPage(1) }}>
                                    <option>All Categories</option>
                                    <option>Health & Wellness</option>
                                    <option>Buying Guide</option>
                                    <option>Recipes</option>
                                    <option>Farming</option>
                                    <option>Spices</option>
                                </select>
                                <select value={status} onChange={(event) => { setStatus(event.target.value); setBlogPage(1) }}>
                                    <option>All Status</option>
                                    <option>Published</option>
                                    <option>Draft</option>

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
                                        {paginatedPosts.map((post) =>
                                            <tr key={post._id || post.title}>

                                                <td>
                                                    <img src={post.image?.startsWith('/') ? post.image : `${serverUrl}/uploads/${post.image}`} alt={post.title} />
                                                </td>
                                                <td>
                                                    <strong>{post.title}</strong>
                                                    <small>{post.shortDescription.slice(0, 25)}...</small>
                                                </td>
                                                <td>
                                                    <span className={`blog-category ${(post.category || '').toLowerCase().replaceAll(' ', '-')}`}>{post.category}</span>
                                                </td>
                                                <td>{post.author}</td>
                                                <td><span className="blog-tags">{post.tags || '—'}</span></td>
                                                <td>{post.publishDate || '—'}</td>
                                                <td><span className={`blog-status ${(post.status || '').toLowerCase()}`}>{post.status}</span></td>
                                                <td>
                                                    <div className="blog-row-actions">
                                                        <button type="button" aria-label="Edit">
                                                            <FontAwesomeIcon icon={faEdit} onClick={() => handleShow(post._id)} />
                                                        </button>
                                                        <button type="button" aria-label="View">
                                                            <FontAwesomeIcon icon={faEye} />
                                                        </button>
                                                        <button onClick={() => deleteBlog(post._id)} type="button" aria-label="Delete">
                                                            <FontAwesomeIcon icon={faTrash} />
                                                        </button>

                                                    </div>
                                                </td>
                                            </tr>)}
                                        {filteredPosts.length === 0 && <tr><td className="blog-empty-state" colSpan="8">No blog posts match these filters.</td></tr>}
                                    </tbody>
                                </table>
                            </div>
                            <div className="blog-table-footer">
                                <span>Showing {firstVisiblePost}-{lastVisiblePost} of {filteredPosts.length} entries</span>
                            </div>
                            {pageCount > 1 && <nav className="blog-table-pagination" aria-label="Blog pages">
                                <button type="button" onClick={() => setBlogPage(currentBlogPage - 1)} disabled={currentBlogPage === 1}>
                                    Previous
                                </button>
                                {Array.from({ length: pageCount }, (_, index) => index + 1).map((pageNumber) => (
                                    <button
                                        type="button"
                                        key={pageNumber}
                                        onClick={() => setBlogPage(pageNumber)}
                                        aria-label={`Blog page ${pageNumber}`}
                                        aria-current={pageNumber === currentBlogPage ? 'page' : undefined}
                                    >
                                        {pageNumber}
                                    </button>
                                ))}
                                <button type="button" onClick={() => setBlogPage(currentBlogPage + 1)} disabled={currentBlogPage === pageCount}>
                                    Next
                                </button>
                            </nav>}
                        </section>

                        <section className="admin-blog-form-panel"><div className="blog-form-title">
                            <div>
                                <h2><FontAwesomeIcon icon={faFileLines} /> Add New Blog</h2>
                                <p>Fill in the details below to create a new blog post.</p></div>
                            <button type="button" onClick={resetForm} aria-label="Clear form"><FontAwesomeIcon icon={faXmark} /></button>
                        </div>
                            <form className="admin-blog-form">
                                <label>Blog Title <em>*</em>
                                    <input name="title" value={form.title} onChange={updateForm} placeholder="Enter blog title" required />
                                </label>
                                <label>Featured Image <em>*</em>
                                    <div className="blog-upload">
                                        <input name='uploadImage' type="file" id='imageUpload' accept="image/png,image/jpeg" onChange={updateForm} required />
                                        <FontAwesomeIcon icon={faCloudArrowUp} />
                                        {form.image == "" ? <span>Click to upload or drag and drop</span>
                                            : <span>{form.image.name}</span>}
                                        <small>PNG, JPG (Max 2MB)</small>
                                    </div>
                                </label>

                                <div className="blog-form-row">
                                    <label>Category <em>*</em>
                                        <select name="category" value={form.category} onChange={updateForm} required>
                                            <option value="">Select category</option><option>Recipes</option><option>Farming</option><option>Health & Wellness</option><option>Buying Guide</option></select></label><label>Status <em>*</em><select name="status" value={form.status} onChange={updateForm}><option>Draft</option><option>Published</option>
                                            </select>
                                    </label>
                                </div>
                                <label>Short Description <em>*</em>
                                    <textarea name="shortDescription" value={form.shortDescription} onChange={updateForm} placeholder="Enter a short description (e.g., 1–2 lines)" rows="2" required />
                                </label>
                                <div className="blog-editor-field">
                                    <span className="blog-editor-label">Content Editor <em>*</em></span>
                                    {/* <div className="blog-editor">
                                        <div className="blog-editor-toolbar" role="toolbar" aria-label="Blog content formatting">
                                            <button type="button" title="Bold" aria-label="Bold" onMouseDown={(event) => event.preventDefault()} onClick={() => runEditorCommand('bold')}><FontAwesomeIcon icon={faBold} /></button>
                                            <button type="button" title="Italic" aria-label="Italic" onMouseDown={(event) => event.preventDefault()} onClick={() => runEditorCommand('italic')}><FontAwesomeIcon icon={faItalic} /></button>
                                            <button type="button" title="Underline" aria-label="Underline" onMouseDown={(event) => event.preventDefault()} onClick={() => runEditorCommand('underline')}><FontAwesomeIcon icon={faUnderline} /></button>
                                            <button type="button" title="Bulleted list" aria-label="Bulleted list" onMouseDown={(event) => event.preventDefault()} onClick={() => runEditorCommand('insertUnorderedList')}><FontAwesomeIcon icon={faList} /></button>
                                            <button type="button" title="Insert link" aria-label="Insert link" onMouseDown={(event) => event.preventDefault()} onClick={() => runEditorCommand('createLink')}><FontAwesomeIcon icon={faLink} /></button>
                                        </div>
                                        <div
                                            ref={editorRef}
                                            className="blog-editor-content"
                                            contentEditable
                                            role="textbox"
                                            aria-label="Blog content"
                                            aria-multiline="true"
                                            data-placeholder="Write your blog content here..."
                                            onInput={updateLongDescription}
                                        />
                                    </div> */}
                                    <ReactQuill
                                        theme="snow"
                                        value={form.longDescription}
                                        onChange={(html) =>
                                            setForm((prev) => ({
                                                ...prev,
                                                longDescription: html,
                                            }))
                                        }
                                        modules={{
                                            toolbar: [
                                                [{ header: [1, 2, 3, false] }],
                                                // [{ font: ['Segoe UI, Tahoma, Geneva, Verdana, sans - serif'] }, { size: [9] }],
                                                ["bold", "italic", "underline"],
                                                [{ list: "ordered" }, { list: "bullet" }],

                                                ["link"],

                                            ],
                                        }}
                                    />
                                </div>

                                <div className="blog-form-row">
                                    <label>Author <em>*</em>
                                        <input name="author" value={form.author} onChange={updateForm} placeholder='Author Name' required />

                                    </label>
                                    <label>Tags<input name="tags" value={form.tags} onChange={updateForm} placeholder="Add tags (comma separated)" />
                                    </label>
                                </div>
                                <div className="blog-form-row">
                                    <label>SEO Title <em>*</em>
                                        <input name="seoTitle" value={form.seoTitle} onChange={updateForm} placeholder="Enter SEO title" required />
                                    </label>
                                    <label>Publish Date <em>*</em>
                                        <span className="blog-date-input">
                                            <input type='date' name="publishDate" value={form.publishDate} onChange={updateForm} required />
                                        </span>
                                    </label>

                                </div>

                                <div className="blog-form-actions"><button type="button" onClick={resetForm}>Cancel</button>
                                    <button className="blog-primary-button" type="button" onClick={(e) => saveBlog(e)}>Save</button></div>{notice && <p className="blog-notice" role="status">{notice}</p>}
                            </form></section>
                    </div>
                </section>
            </main>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title className='edit-heading'>Edit The Blog</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form className="admin-blog-form">
                        <label>Blog Title <em>*</em>
                            <input name="title" value={form.title} onChange={updateForm} placeholder="Enter blog title" required />
                        </label>
                        <label>Featured Image <em>*</em>
                            <div className="blog-upload">
                                <input name='uploadImage' type="file" id='imageUpload' accept="image/png,image/jpeg" onChange={updateForm} required />
                                <FontAwesomeIcon icon={faCloudArrowUp} />
                                {form.image == "" ? <span>Click to upload or drag and drop</span>
                                    : <span>{form.image.name}</span>}
                                <small>PNG, JPG (Max 2MB)</small>
                            </div>
                        </label>

                        <div className="blog-form-row">
                            <label>Category <em>*</em>
                                <select name="category" value={form.category} onChange={updateForm} required>
                                    <option value="">Select category</option><option>Recipes</option><option>Farming</option><option>Health & Wellness</option><option>Buying Guide</option></select></label><label>Status <em>*</em><select name="status" value={form.status} onChange={updateForm}><option>Draft</option><option>Published</option>
                                    </select>
                            </label>
                        </div>
                        <label>Short Description <em>*</em>
                            <textarea name="shortDescription" value={form.shortDescription} onChange={updateForm} placeholder="Enter a short description (e.g., 1–2 lines)" rows="2" required />
                        </label>
                        <div className="blog-editor-field">
                            <span className="blog-editor-label">Content Editor <em>*</em></span>

                            <ReactQuill
                                theme="snow"
                                value={form.longDescription}
                                onChange={(html) =>
                                    setForm((prev) => ({
                                        ...prev,
                                        longDescription: html,
                                    }))
                                }
                                modules={{
                                    toolbar: [
                                        [{ header: [1, 2, 3, false] }],
                                        // [{ font: ['Segoe UI, Tahoma, Geneva, Verdana, sans - serif'] }, { size: [9] }],
                                        ["bold", "italic", "underline"],
                                        [{ list: "ordered" }, { list: "bullet" }],

                                        ["link"],

                                    ],
                                }}
                            />
                        </div>

                        <div className="blog-form-row">
                            <label>Author <em>*</em>
                                <input name="author" value={form.author} onChange={updateForm} placeholder='Author Name' required />

                            </label>
                            <label>Tags<input name="tags" value={form.tags} onChange={updateForm} placeholder="Add tags (comma separated)" />
                            </label>
                        </div>
                        <div className="blog-form-row">
                            <label>SEO Title <em>*</em>
                                <input name="seoTitle" value={form.seoTitle} onChange={updateForm} placeholder="Enter SEO title" required />
                            </label>
                            <label>Publish Date <em>*</em>
                                <span className="blog-date-input">
                                    <input type='date' name="publishDate" value={form.publishDate} onChange={updateForm} required />
                                </span>
                            </label>

                        </div>

                        <div className="blog-form-actions"><button type="button" onClick={resetForm}>Cancel</button>
                            <button className="blog-primary-button" type="button" onClick={(e) => saveBlog(e)}>Save</button></div>{notice && <p className="blog-notice" role="status">{notice}</p>}
                    </form></Modal.Body>
                <Modal.Footer>
                    <button className='btn btn-outline-warning border-1 border-warning' onClick={handleClose}>
                        Close
                    </button>
                    <button className='btn btn-outline-success border-1 border-success' onClick={handleClose}>
                        Save Changes
                    </button>
                </Modal.Footer>
            </Modal>
            <ToastContainer position='top-right' autoClose={3000} theme='colored' />
        </div >
    )
}

export default Blog
