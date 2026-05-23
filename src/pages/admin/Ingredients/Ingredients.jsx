import React, { useState, useEffect } from 'react';
import './Ingredients.css';
import Button from '../../../components/Button/Button';
import Modal from '../../../components/Modal/Modal';
import api from '../../../services/api';

const Ingredients = () => {
  const [ingredients, setIngredients] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    unit: 'ml',
    cost_per_unit: '',
    is_active: true
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await api.get('/ingredients');
      setIngredients(response.data.data || response.data || []);
    } catch (error) {
      console.error('Failed to fetch ingredients:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this ingredient?')) {
      try {
        await api.delete(`/ingredients/${id}`);
        fetchData();
      } catch (err) {
        console.error(err);
        alert('Failed to delete ingredient.');
      }
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      unit: item.unit || 'ml',
      cost_per_unit: item.cost_per_unit || 0,
      is_active: item.is_active !== false
    });
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setEditingItem(null);
    setFormData({
      name: '',
      unit: 'ml',
      cost_per_unit: '',
      is_active: true
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        cost_per_unit: parseFloat(formData.cost_per_unit) || 0
      };

      if (editingItem) {
        await api.patch(`/ingredients/${editingItem.id}`, payload);
      } else {
        await api.post('/ingredients', payload);
      }
      setIsModalOpen(false);
      fetchData();
    } catch (err) {
      console.error('Failed to save ingredient:', err);
      alert('Failed to save ingredient');
    }
  };

  return (
    <div className="ingredients-view">
      <div className="view-header">
        <h2 className="section-title">Ingredient Management</h2>
        <Button variant="primary" size="small" onClick={handleAdd}>Add New Ingredient</Button>
      </div>

      <div className="cms-table-container glass">
        {loading ? (
          <p style={{ padding: '20px' }}>Loading ingredients...</p>
        ) : (
          <table className="cms-table">
            <thead>
              <tr>
                <th>Ingredient</th>
                <th>Unit</th>
                <th>Cost Per Unit (₹)</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {ingredients.map(item => (
                <tr key={item.id}>
                  <td>{item.name}</td>
                  <td>{item.unit}</td>
                  <td>₹{item.cost_per_unit || 0}</td>
                  <td>
                    <span className={`status-chip ${(item.is_active !== false ? 'Active' : 'Inactive').toLowerCase()}`}>
                      {item.is_active !== false ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td>
                    <button className="action-btn edit" onClick={() => handleEdit(item)}>Edit</button>
                    <button className="action-btn delete" onClick={() => handleDelete(item.id)}>Delete</button>
                  </td>
                </tr>
              ))}
              {ingredients.length === 0 && (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center' }}>No ingredients found.</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        title={editingItem ? 'Edit Ingredient' : 'Add New Ingredient'}
      >
        <form className="modal-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Ingredient Name</label>
            <input 
              required
              value={formData.name}
              onChange={e => setFormData({...formData, name: e.target.value})}
            />
          </div>
          <div className="form-group">
            <label>Unit</label>
            <input 
              required
              placeholder="e.g. ml, g, shot"
              value={formData.unit}
              onChange={e => setFormData({...formData, unit: e.target.value})}
            />
          </div>
          <div className="form-group">
            <label>Cost Per Unit (₹)</label>
            <input 
              required
              type="number"
              step="0.01"
              value={formData.cost_per_unit}
              onChange={e => setFormData({...formData, cost_per_unit: e.target.value})}
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

export default Ingredients;
