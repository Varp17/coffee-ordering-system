import React, { useState, useEffect } from 'react';
import './Roles.css';
import Button from '../../../components/Button/Button';
import Modal from '../../../components/Modal/Modal';
import api from '../../../services/api';

const Roles = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    role: 'customer'
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await api.get('/admin/users');
      setUsers(res.data.data || res.data || []);
    } catch (err) {
      console.error('Failed to fetch users:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleEdit = (user) => {
    setEditingItem(user);
    setFormData({
      role: user.role || 'customer'
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.patch(`/admin/users/${editingItem.id}/role`, formData);
      setIsModalOpen(false);
      fetchData();
    } catch (err) {
      console.error('Failed to save role:', err);
      alert('Failed to save role');
    }
  };

  return (
    <div className="roles-view">
      <div className="view-header">
        <h2 className="section-title">Role & Access Management</h2>
      </div>

      <div className="cms-table-container glass">
        {loading ? (
          <p style={{ padding: '20px' }}>Loading users...</p>
        ) : (
          <table className="cms-table">
            <thead>
              <tr>
                <th>User Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user.id}>
                  <td>{user.name || user.first_name}</td>
                  <td>{user.email}</td>
                  <td>
                    <span className="permission-tag">{user.role}</span>
                  </td>
                  <td>
                    <span className={`status-chip ${(user.is_active !== false ? 'Active' : 'Inactive').toLowerCase()}`}>
                      {user.is_active !== false ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td>
                    <button className="action-btn edit" onClick={() => handleEdit(user)}>Edit Role</button>
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center' }}>No users found.</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        title="Edit User Role"
      >
        <form className="modal-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Role</label>
            <select 
              value={formData.role}
              onChange={e => setFormData({...formData, role: e.target.value})}
            >
              <option value="customer">Customer</option>
              <option value="super_admin">Super Admin</option>
              <option value="admin">Admin</option>
              <option value="store_manager">Store Manager</option>
              <option value="barista">Barista</option>
              <option value="kitchen">Kitchen</option>
              <option value="kiosk">Kiosk</option>
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

export default Roles;
