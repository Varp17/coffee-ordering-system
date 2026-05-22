import React, { useState, useEffect } from 'react';
import './OrderQueue.css';
import Button from '../../../components/Button/Button';
import api from '../../../services/api';

const OrderQueue = () => {
  const [orders, setOrders] = useState([]);
  const [selectedKOT, setSelectedKOT] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const response = await api.get('/barista/orders');
      setOrders(response.data.data || response.data || []);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    // In a real app, we'd poll or use websockets here
    const interval = setInterval(fetchOrders, 30000);
    return () => clearInterval(interval);
  }, []);

  const moveStatus = async (id, newStatus) => {
    try {
      await api.patch(`/barista/orders/${id}/status`, { status: newStatus });
      setOrders(orders.map(order => 
        order.id === id ? { ...order, status: newStatus } : order
      ));
    } catch (error) {
      console.error('Failed to update order status:', error);
      alert('Failed to update order status');
    }
  };

  return (
    <div className="order-queue-view">
      <div className="view-header">
        <h2 className="section-title">Barista Order Queue</h2>
      </div>

      <div className="queue-columns">
        {/* Pending Column */}
        <div className="queue-column glass">
          <div className="column-header">
            <h3>Pending</h3>
            <span className="count">{orders.filter(o => o.status === 'Pending').length}</span>
          </div>
          <div className="column-content">
            {orders.filter(o => o.status === 'Pending').map(order => (
              <div key={order.id} className="order-ticket glass">
                <div className="ticket-header">
                  <span className="order-id">{order.id}</span>
                  <span className="order-time">{order.time}</span>
                </div>
                <div className="ticket-body">
                  <p className="customer-name">{order.customer}</p>
                  <ul className="item-list">
                    {order.items.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                </div>
                <div className="ticket-footer">
                  <Button variant="secondary" size="small" onClick={() => setSelectedKOT(order)}>View KOT</Button>
                  <Button variant="primary" size="small" onClick={() => moveStatus(order.id, 'In Progress')}>Start</Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* In Progress Column */}
        <div className="queue-column glass">
          <div className="column-header">
            <h3>In Progress</h3>
            <span className="count">{orders.filter(o => o.status === 'In Progress').length}</span>
          </div>
          <div className="column-content">
            {orders.filter(o => o.status === 'In Progress').map(order => (
              <div key={order.id} className="order-ticket glass in-progress">
                <div className="ticket-header">
                  <span className="order-id">{order.id}</span>
                  <span className="order-time">{order.time}</span>
                </div>
                <div className="ticket-body">
                  <p className="customer-name">{order.customer}</p>
                  <ul className="item-list">
                    {order.items.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                </div>
                <div className="ticket-footer">
                  <Button variant="secondary" size="small" onClick={() => setSelectedKOT(order)}>View KOT</Button>
                  <Button variant="secondary" size="small" onClick={() => moveStatus(order.id, 'Pending')}>Revert</Button>
                  <Button variant="primary" size="small" onClick={() => moveStatus(order.id, 'Completed')}>Complete</Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Completed Column */}
        <div className="queue-column glass">
          <div className="column-header">
            <h3>Completed</h3>
            <span className="count">{orders.filter(o => o.status === 'Completed').length}</span>
          </div>
          <div className="column-content">
            {orders.filter(o => o.status === 'Completed').map(order => (
              <div key={order.id} className="order-ticket glass completed">
                <div className="ticket-header">
                  <span className="order-id">{order.id}</span>
                  <span className="order-time">{order.time}</span>
                </div>
                <div className="ticket-body">
                  <p className="customer-name">{order.customer}</p>
                  <ul className="item-list">
                    {order.items.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                </div>
                <div className="ticket-footer">
                  <Button variant="secondary" size="small" onClick={() => setSelectedKOT(order)}>View KOT</Button>
                  <span className="status-badge">Done</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* KOT Modal */}
      {selectedKOT && (
        <div className="modal-backdrop" onClick={() => setSelectedKOT(null)}>
          <div className="kot-modal glass" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Kitchen Order Ticket (KOT)</h2>
              <button className="close-btn" onClick={() => setSelectedKOT(null)}>×</button>
            </div>
            <div className="modal-body">
              <div className="kot-info">
                <span><strong>Order ID:</strong> {selectedKOT.id}</span>
                <span><strong>Customer:</strong> {selectedKOT.customer}</span>
              </div>
              <div className="kot-section">
                <h3>Items</h3>
                <ul>
                  {selectedKOT.items.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>
              <div className="kot-section">
                <h3>Ingredients</h3>
                <ul>
                  {selectedKOT.kot.ingredients.map((ing, index) => (
                    <li key={index}>{ing}</li>
                  ))}
                </ul>
              </div>
              <div className="kot-section">
                <h3>Workflow Guidance</h3>
                <ol style={{ paddingLeft: '20px' }}>
                  {selectedKOT.kot.steps.map((step, index) => (
                    <li key={index} style={{ marginBottom: '10px', color: 'var(--color-text-muted)' }}>{step}</li>
                  ))}
                </ol>
              </div>
            </div>
            <div className="modal-footer">
              <Button variant="primary" onClick={() => setSelectedKOT(null)}>Close</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderQueue;
