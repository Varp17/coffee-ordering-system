import React, { useState, useEffect } from 'react';
import './Orders.css';
import api from '../../../services/api';

const Orders = () => {
  const [filter, setFilter] = useState('all'); // all, live, completed
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await api.get('/orders');
        setOrders(response.data.data || response.data || []);
      } catch (error) {
        console.error('Failed to fetch orders:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const filteredOrders = filter === 'all' 
    ? orders 
    : orders.filter(order => (order.status || '').toLowerCase() === filter);

  return (
    <div className="orders-view">
      <div className="view-header">
        <h2 className="section-title">Order Management</h2>
        <div className="filter-buttons">
          <button className={`filter-btn ${filter === 'all' ? 'active' : ''}`} onClick={() => setFilter('all')}>All</button>
          <button className={`filter-btn ${filter === 'live' ? 'active' : ''}`} onClick={() => setFilter('live')}>Live</button>
          <button className={`filter-btn ${filter === 'completed' ? 'active' : ''}`} onClick={() => setFilter('completed')}>Completed</button>
        </div>
      </div>

      <div className="cms-table-container glass">
        {loading ? (
          <p style={{ padding: '20px' }}>Loading orders...</p>
        ) : (
          <table className="cms-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Items</th>
                <th>Total</th>
                <th>Status</th>
                <th>Time</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map(order => (
                <tr key={order.id}>
                  <td>{order.id}</td>
                  <td>{order.customer_name || 'Walk-in'}</td>
                  <td>{order.items?.length || 0} items</td>
                  <td>${order.total_amount || order.total}</td>
                  <td>
                    <span className={`status-chip ${(order.status || 'pending').toLowerCase()}`}>
                      {order.status || 'Pending'}
                    </span>
                  </td>
                  <td>{new Date(order.created_at || order.time).toLocaleString()}</td>
                  <td>
                    <button className="action-btn">View Details</button>
                    {(order.status || '').toLowerCase() === 'live' && <button className="action-btn edit">Complete</button>}
                  </td>
                </tr>
              ))}
              {filteredOrders.length === 0 && (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center' }}>No orders found.</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Orders;
