import React, { useState, useEffect } from 'react';
import './Customers.css';
import api from '../../../services/api';

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        // We'll use the users or customers endpoint based on what the backend offers
        // Some d2c routes might handle customers. For now let's use /admin/users or /customers.
        // As per app.js, there is an admin module `app.use(`${API}/admin`, adminRoutes);`
        const response = await api.get('/admin/users');
        setCustomers(response.data.data || response.data || []);
      } catch (error) {
        console.error('Failed to fetch customers:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCustomers();
  }, []);

  return (
    <div className="customers-view">
      <div className="view-header">
        <h2 className="section-title">Customer Data Management</h2>
      </div>

      <div className="cms-table-container glass">
        {loading ? (
          <p style={{ padding: '20px' }}>Loading customers...</p>
        ) : (
          <table className="cms-table">
            <thead>
              <tr>
                <th>Customer Name</th>
                <th>Email</th>
                <th>Total Orders</th>
                <th>Total Spent (₹)</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {customers.map(customer => (
                <tr key={customer.id}>
                  <td>{customer.name || customer.first_name}</td>
                  <td>{customer.email}</td>
                  <td>{customer.orders_count || 0}</td>
                  <td>₹{customer.total_spent || 0}</td>
                  <td>
                    <span className={`status-chip ${(customer.status || 'Active').toLowerCase()}`}>
                      {customer.status || 'Active'}
                    </span>
                  </td>
                  <td>
                    <button className="action-btn">View History</button>
                    <button className="action-btn edit">Contact</button>
                  </td>
                </tr>
              ))}
              {customers.length === 0 && (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center' }}>No customers found.</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Customers;
