import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ShopContext } from '../Context/ShopContext'
import './CSS/AdminPanel.css'

const AdminPanel = () => {
  const { isAdmin } = useContext(ShopContext)
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('dashboard')
  const [allProducts, setAllProducts] = useState([])
  const [image, setImage] = useState(null)
  const [loading, setLoading] = useState(false)
  const [successMsg, setSuccessMsg] = useState('')
  const [productDetails, setProductDetails] = useState({
    name: '',
    old_price: '',
    new_price: ''
  })

  useEffect(() => {
    if (!localStorage.getItem('auth-token')) {
      navigate('/login')
      return
    }
    fetchProducts()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const fetchProducts = async () => {
    try {
      const res = await fetch(`/api/allproducts`)
      const data = await res.json()
      setAllProducts(data)
    } catch (err) {
      console.error('Could not load products:', err)
    }
  }

  const showSuccess = (msg) => {
    setSuccessMsg(msg)
    setTimeout(() => setSuccessMsg(''), 3000)
  }

  const handleAddProduct = async () => {
    if (!productDetails.name || !productDetails.old_price || !productDetails.new_price || !image) {
      alert('Please fill all fields and upload an image')
      return
    }
    setLoading(true)
    try {
      const formData = new FormData()
      formData.append('product', image)
      const uploadRes = await fetch(`/api/upload`, {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: formData
      })
      const uploadData = await uploadRes.json()

      if (uploadData.success) {
        const product = { ...productDetails, image: uploadData.image_url }
        const addRes = await fetch(`/api/addproduct`, {
          method: 'POST',
          headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
          body: JSON.stringify(product)
        })
        const addData = await addRes.json()
        if (addData.success) {
          showSuccess('Product added successfully!')
          setProductDetails({ name: '', old_price: '', new_price: '' })
          setImage(null)
          fetchProducts()
        } else {
          alert('Failed to add product')
        }
      }
    } catch (err) {
      alert('Error adding product')
    }
    setLoading(false)
  }

  const removeProduct = async (id) => {
    if (!window.confirm('Are you sure you want to remove this product?')) return
    try {
      await fetch(`/api/removeproduct`, {
        method: 'POST',
        headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      })
      showSuccess('Product removed!')
      fetchProducts()
    } catch (err) {
      alert('Error removing product')
    }
  }

  if (!isAdmin) {
    return (
      <div className="admin-panel">
        <div className="admin-no-access">
          <div className="no-access-icon">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
          </div>
          <h2>Access Denied</h2>
          <p>You need admin privileges to access this page.</p>
          <button onClick={() => navigate('/login')} className="admin-btn-primary">
            Login as Admin
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="admin-panel">
      {successMsg && (
        <div className="admin-toast">
          <span className="toast-icon">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
          </span>
          {successMsg}
        </div>
      )}

      <div className="admin-header">
        <div className="admin-header-left">
          <h1>Admin Panel</h1>
          <p className="admin-subtitle">Manage your GameVault products</p>
        </div>
        <div className="admin-stats">
          <div className="stat-card">
            <span className="stat-number">{allProducts.length}</span>
            <span className="stat-label">Total Products</span>
          </div>
        </div>
      </div>

      <div className="admin-tabs">
        <button
          className={`admin-tab ${activeTab === 'dashboard' ? 'active' : ''}`}
          onClick={() => setActiveTab('dashboard')}
        >
          <span className="tab-icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="9"/><rect x="14" y="3" width="7" height="5"/><rect x="14" y="12" width="7" height="9"/><rect x="3" y="16" width="7" height="5"/></svg>
          </span>
          Dashboard
        </button>
        <button
          className={`admin-tab ${activeTab === 'add' ? 'active' : ''}`}
          onClick={() => setActiveTab('add')}
        >
          <span className="tab-icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          </span>
          Add Product
        </button>
        <button
          className={`admin-tab ${activeTab === 'list' ? 'active' : ''}`}
          onClick={() => setActiveTab('list')}
        >
          <span className="tab-icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>
          </span>
          All Products
        </button>
      </div>

      <div className="admin-content">
        {/* ── Dashboard Tab ── */}
        {activeTab === 'dashboard' && (
          <div className="admin-dashboard">
            <div className="dashboard-grid">
              <div className="dash-card">
                <div className="dash-card-icon icon-blue">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>
                </div>
                <div className="dash-card-info">
                  <h3>{allProducts.length}</h3>
                  <p>Total Products</p>
                </div>
              </div>
              <div className="dash-card">
                <div className="dash-card-icon icon-green">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
                </div>
                <div className="dash-card-info">
                  <h3>${allProducts.reduce((sum, p) => sum + (p.new_price || 0), 0).toFixed(0)}</h3>
                  <p>Total Inventory Value</p>
                </div>
              </div>
              <div className="dash-card">
                <div className="dash-card-icon icon-purple">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                </div>
                <div className="dash-card-info">
                  <h3>{allProducts.reduce((sum, p) => sum + (p.views || 0), 0)}</h3>
                  <p>Total Views</p>
                </div>
              </div>
              <div className="dash-card">
                <div className="dash-card-icon icon-red">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
                </div>
                <div className="dash-card-info">
                  <h3>{allProducts.reduce((sum, p) => sum + (p.likes || 0), 0)}</h3>
                  <p>Total Likes</p>
                </div>
              </div>
            </div>

            <div className="recent-products">
              <h2>Recent Products</h2>
              <div className="recent-grid">
                {allProducts.slice(-6).reverse().map((product) => (
                  <div key={product.id} className="recent-card">
                    <img src={product.image} alt={product.name} />
                    <div className="recent-card-info">
                      <h4>{product.name}</h4>
                      <span className="recent-price">${product.new_price}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── Add Product Tab ── */}
        {activeTab === 'add' && (
          <div className="admin-add-product">
            <div className="add-product-form">
              <h2>Add New Product</h2>
              <p className="form-subtitle">Fill in the details to add a new game to the store</p>

              <div className="form-group">
                <label>Product Name</label>
                <input
                  type="text"
                  name="name"
                  value={productDetails.name}
                  onChange={(e) => setProductDetails({ ...productDetails, [e.target.name]: e.target.value })}
                  placeholder="Enter game title..."
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Original Price ($)</label>
                  <input
                    type="number"
                    name="old_price"
                    value={productDetails.old_price}
                    onChange={(e) => setProductDetails({ ...productDetails, [e.target.name]: e.target.value })}
                    placeholder="59.99"
                  />
                </div>
                <div className="form-group">
                  <label>Sale Price ($)</label>
                  <input
                    type="number"
                    name="new_price"
                    value={productDetails.new_price}
                    onChange={(e) => setProductDetails({ ...productDetails, [e.target.name]: e.target.value })}
                    placeholder="39.99"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Product Image</label>
                <div
                  className={`image-upload-zone ${image ? 'has-image' : ''}`}
                  onClick={() => document.getElementById('admin-file-input').click()}
                >
                  {image ? (
                    <div className="upload-preview">
                      <img src={URL.createObjectURL(image)} alt="Preview" />
                      <div className="upload-overlay">
                        <span>Click to change</span>
                      </div>
                    </div>
                  ) : (
                    <div className="upload-placeholder">
                      <div className="upload-icon">
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                      </div>
                      <p>Click to upload image</p>
                      <span>PNG, JPG, WEBP up to 5MB</span>
                    </div>
                  )}
                </div>
                <input
                  type="file"
                  id="admin-file-input"
                  accept="image/*"
                  onChange={(e) => setImage(e.target.files[0])}
                  hidden
                />
              </div>

              <button
                className="admin-btn-primary add-btn"
                onClick={handleAddProduct}
                disabled={loading}
              >
                {loading ? (
                  <span className="btn-loading">Adding...</span>
                ) : (
                  <>Add Product</>
                )}
              </button>
            </div>
          </div>
        )}

        {/* ── Product List Tab ── */}
        {activeTab === 'list' && (
          <div className="admin-product-list">
            <div className="list-header">
              <h2>All Products ({allProducts.length})</h2>
            </div>

            {allProducts.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>
                </div>
                <h3>No products yet</h3>
                <p>Add your first product to get started</p>
                <button className="admin-btn-primary" onClick={() => setActiveTab('add')}>
                  Add Product
                </button>
              </div>
            ) : (
              <div className="products-table">
                <div className="table-header">
                  <span className="col-image">Image</span>
                  <span className="col-name">Name</span>
                  <span className="col-price">Original</span>
                  <span className="col-price">Sale</span>
                  <span className="col-stats">Views</span>
                  <span className="col-stats">Likes</span>
                  <span className="col-action">Action</span>
                </div>
                <div className="table-body">
                  {allProducts.map((product) => (
                    <div key={product.id} className="table-row">
                      <span className="col-image">
                        <img src={product.image} alt={product.name} />
                      </span>
                      <span className="col-name">{product.name}</span>
                      <span className="col-price">${product.old_price}</span>
                      <span className="col-price sale-price">${product.new_price}</span>
                      <span className="col-stats">{product.views || 0}</span>
                      <span className="col-stats">{product.likes || 0}</span>
                      <span className="col-action">
                        <button
                          className="remove-btn"
                          onClick={() => removeProduct(product.id)}
                          title="Remove product"
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
                        </button>
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminPanel
