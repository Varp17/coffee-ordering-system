import React, { useState, useEffect } from 'react';
import './Menu.css';
import Button from '../../../components/Button/Button';
import Modal from '../../../components/Modal/Modal';
import api from '../../../services/api';

const Menu = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    category_id: '',
    base_price: '',
    product_type: 'beverage',
    is_active: true
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const [prodRes, catRes] = await Promise.all([
        api.get('/products'),
        api.get('/categories')
      ]);
      setProducts(prodRes.data.data || prodRes.data || []);
      setCategories(catRes.data.data || catRes.data || []);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await api.delete(`/products/${id}`);
        fetchData();
      } catch (err) {
        console.error(err);
        alert('Failed to delete product. It may be linked to existing orders.');
      }
    }
  };

  const handleEdit = (product) => {
    setEditingItem(product);
    setFormData({
      name: product.name || product.title,
      category_id: product.category?.id || product.category || '',
      base_price: product.base_price || product.price || '',
      product_type: product.product_type || 'beverage',
      is_active: product.is_active !== false
    });
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setEditingItem(null);
    setFormData({
      name: '',
      category_id: categories.length > 0 ? categories[0].id : '',
      base_price: '',
      product_type: 'beverage',
      is_active: true
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        base_price: parseFloat(formData.base_price)
      };

      if (editingItem) {
        await api.patch(`/products/${editingItem.id}`, payload);
      } else {
        await api.post('/products', payload);
      }
      setIsModalOpen(false);
      fetchData();
    } catch (err) {
      console.error('Failed to save product:', err);
      alert('Failed to save product');
    }
  };

  return (
    <div className="menu-view">
      <div className="view-header">
        <h2 className="section-title">Product & Menu Management</h2>
        <Button variant="primary" size="small" onClick={handleAdd}>Add New Product</Button>
      </div>

      <div className="cms-table-container glass">
        {loading ? (
          <p style={{ padding: '20px' }}>Loading products...</p>
        ) : (
          <table className="cms-table">
            <thead>
              <tr>
                <th>Product Name</th>
                <th>Category</th>
                <th>Price (₹)</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map(product => (
                <tr key={product.id}>
                  <td>{product.title || product.name}</td>
                  <td>{product.category?.name || product.category || 'N/A'}</td>
                  <td>₹{product.base_price || product.price}</td>
                  <td>
                    <span className={`status-chip ${(product.is_active !== false ? 'Active' : 'Inactive').toLowerCase()}`}>
                      {product.is_active !== false ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td>
                    <button className="action-btn edit" onClick={() => handleEdit(product)}>Edit</button>
                    <button className="action-btn delete" onClick={() => handleDelete(product.id)}>Delete</button>
                  </td>
                </tr>
              ))}
              {products.length === 0 && (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center' }}>No products found.</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        title={editingItem ? 'Edit Product' : 'Add New Product'}
      >
        <form className="modal-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Product Name</label>
            <input 
              required
              value={formData.name}
              onChange={e => setFormData({...formData, name: e.target.value})}
            />
          </div>
          <div className="form-group">
            <label>Category</label>
            <select 
              required
              value={formData.category_id}
              onChange={e => setFormData({...formData, category_id: e.target.value})}
            >
              <option value="">Select Category</option>
              {categories.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Base Price (₹)</label>
            <input 
              required
              type="number"
              step="0.01"
              value={formData.base_price}
              onChange={e => setFormData({...formData, base_price: e.target.value})}
            />
          </div>
          <div className="form-group">
            <label>Status</label>
            <select 
              value={formData.is_active}
              onChange={e => setFormData({...formData, is_active: e.target.value === 'true'})}
            >
              <option value="true">Active</option>
              <option value="false">Inactive</option>
            </select>
          </div>
          <div className="modal-actions">
            <Button variant="secondary" onClick={() => setIsModalOpen(false)} type="button">Cancel</Button>
            <Button variant="primary" type="submit">Save</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Menu;
