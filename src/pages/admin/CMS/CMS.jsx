import React, { useState, useEffect } from 'react';
import './CMS.css';
import Button from '../../../components/Button/Button';
import Modal from '../../../components/Modal/Modal';
import api from '../../../services/api';

const CMS = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    display_order: 0,
    is_active: true
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await api.get('/categories');
      setCategories(res.data.data || res.data || []);
    } catch (err) {
      console.error('Failed to fetch categories:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      try {
        await api.delete(`/categories/${id}`);
        fetchData();
      } catch (err) {
        console.error(err);
        alert('Failed to delete category. It may have existing products linked to it.');
      }
    }
  };

  const handleEdit = (category) => {
    setEditingItem(category);
    setFormData({
      name: category.name,
      display_order: category.display_order || 0,
      is_active: category.is_active !== false
    });
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setEditingItem(null);
    setFormData({
      name: '',
      display_order: 0,
      is_active: true
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        display_order: parseInt(formData.display_order) || 0
      };

      if (editingItem) {
        await api.patch(`/categories/${editingItem.id}`, payload);
      } else {
        await api.post('/categories', payload);
      }
      setIsModalOpen(false);
      fetchData();
    } catch (err) {
      console.error('Failed to save category:', err);
      alert('Failed to save category');
    }
  };

  return (
    <div className="cms-page">
      <div className="cms-header">
        <h1 className="cms-title">Website <span className="text-gradient">CMS</span></h1>
        <p className="cms-subtitle">Manage your website categories here.</p>
      </div>

      <section className="cms-section">
        <div className="section-header">
          <h2 className="section-title">Categories</h2>
          <Button variant="primary" size="small" onClick={handleAdd}>Add New Category</Button>
        </div>
        <div className="cms-table-container glass">
          {loading ? (
            <p style={{ padding: '20px' }}>Loading categories...</p>
          ) : (
            <table className="cms-table">
              <thead>
                <tr>
                  <th>Category Name</th>
                  <th>Display Order</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {categories.map(category => (
                  <tr key={category.id}>
                    <td>{category.name}</td>
                    <td>{category.display_order || 0}</td>
                    <td>
                      <span className={`status-chip ${(category.is_active !== false ? 'Active' : 'Inactive').toLowerCase()}`}>
                        {category.is_active !== false ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td>
                      <button className="action-btn edit" onClick={() => handleEdit(category)}>Edit</button>
                      <button className="action-btn delete" onClick={() => handleDelete(category.id)}>Delete</button>
                    </td>
                  </tr>
                ))}
                {categories.length === 0 && (
                  <tr>
                    <td colSpan="4" style={{ textAlign: 'center' }}>No categories found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </section>

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        title={editingItem ? 'Edit Category' : 'Add New Category'}
      >
        <form className="modal-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Category Name</label>
            <input 
              required
              value={formData.name}
              onChange={e => setFormData({...formData, name: e.target.value})}
            />
          </div>
          <div className="form-group">
            <label>Display Order</label>
            <input 
              required
              type="number"
              value={formData.display_order}
              onChange={e => setFormData({...formData, display_order: e.target.value})}
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

export default CMS;
