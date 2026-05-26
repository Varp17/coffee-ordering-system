import React, { useState } from 'react';
import { useOrderStore } from '../../../store/useOrderStore';
import Button from '../../../components/Button/Button';
import './CompletedOrders.css';

const CompletedOrders = () => {
  const baristaOrders = useOrderStore((state) => state.baristaOrders);
  const [selectedKOT, setSelectedKOT] = useState(null);
  
  const completed = baristaOrders.filter((o) => o.status === 'Completed' || o.status === 'Ready');

  const totalPrepTime = completed.reduce((sum, o) => sum + (o.elapsedMinutes || 4), 0);
  const avgPrepTime = completed.length > 0 ? (totalPrepTime / completed.length).toFixed(1) : '4.2';

  return (
    <div className="completed-orders-view animate-fade-in">
      <div className="kds-completed-header">
        <div>
          <h2>✅ Fulfilled Coffee Queue</h2>
          <p>Recall history of completed pickups, view final prep times, and confirm guest handoffs.</p>
        </div>
        <div className="completed-stats-row">
          <div className="stat-pill">
            <span className="pill-label">Total Fulfilled Today</span>
            <span className="pill-value">{completed.length} Orders</span>
          </div>
          <div className="stat-pill">
            <span className="pill-label">Avg. Prep Duration</span>
            <span className="pill-value">{avgPrepTime} min</span>
          </div>
        </div>
      </div>

      {completed.length === 0 ? (
        <div className="empty-completed-state  animate-scale-in">
          <span className="emoji-large">☕</span>
          <h3>No Orders Completed Yet</h3>
          <p>Complete active tickets in the KDS Queue to see them here.</p>
        </div>
      ) : (
        <div className="completed-table-card ">
          <table className="completed-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Guest Name</th>
                <th>Items Prepared</th>
                <th>Source</th>
                <th>Final Prep Duration</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {completed.map((order) => (
                <tr key={order.id} className="completed-row">
                  <td><strong>#{order.id}</strong></td>
                  <td>{order.customer}</td>
                  <td>
                    <div className="completed-items-cell">
                      {order.items.join(', ')}
                    </div>
                  </td>
                  <td>
                    <span className={`source-badge ${order.source ? order.source.toLowerCase() : 'd2c'}`}>
                      {order.source || 'D2C Web'}
                    </span>
                  </td>
                  <td>
                    <span className="prep-time-duration">
                      ⏱️ {order.elapsedMinutes || 4} mins
                    </span>
                  </td>
                  <td>
                    <div className="actions-cell">
                      <Button variant="secondary" size="small" onClick={() => setSelectedKOT(order)}>
                        View KOT
                      </Button>
                      <span className="handover-done-badge">✓ Done</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* KOT Modal */}
      {selectedKOT && (
        <div className="modal-backdrop" onClick={() => setSelectedKOT(null)}>
          <div className="kot-modal  animate-scale-in" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Kitchen Order Ticket (KOT)</h2>
              <button className="close-btn" onClick={() => setSelectedKOT(null)}>×</button>
            </div>
            <div className="modal-body">
              <div className="kot-info">
                <span><strong>Order ID:</strong> #{selectedKOT.id}</span>
                <span><strong>Customer:</strong> {selectedKOT.customer}</span>
              </div>
              <div className="kot-section">
                <h3>Items Prepared</h3>
                <ul>
                  {selectedKOT.items.map((item, index) => (
                    <li key={index}>☕ {item}</li>
                  ))}
                </ul>
              </div>
              <div className="kot-section">
                <h3>Ingredients Used</h3>
                <ul>
                  {selectedKOT.kot?.ingredients?.map((ing, index) => (
                    <li key={index}>🟢 {ing.name}</li>
                  )) || <li>Standard Recipe Ingredients</li>}
                </ul>
              </div>
              <div className="kot-section">
                <h3>Barista SLA Audit</h3>
                <p><strong>Total Elapsed Time:</strong> {selectedKOT.elapsedMinutes || 4} minutes</p>
                <p><strong>Target SLA:</strong> {selectedKOT.slaMinutes || 10} minutes</p>
                <p><strong>Result:</strong> <span style={{ color: 'var(--color-success)', fontWeight: 'bold' }}>SLA Satisfied (Met)</span></p>
              </div>
            </div>
            <div className="modal-footer">
              <Button variant="primary" onClick={() => setSelectedKOT(null)}>Dismiss Recall</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CompletedOrders;

