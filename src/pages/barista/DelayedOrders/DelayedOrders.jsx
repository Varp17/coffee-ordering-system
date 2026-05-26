import React, { useState } from 'react';
import { useOrderStore } from '../../../store/useOrderStore';
import Button from '../../../components/Button/Button';
import toast from 'react-hot-toast';
import './DelayedOrders.css';

const DelayedOrders = () => {
  const baristaOrders = useOrderStore((state) => state.baristaOrders);
  const updateOrderStatus = useOrderStore((state) => state.updateOrderStatus);
  
  // Filter active (Pending, In Progress) orders that have breached or are near breach
  // e.g. elapsedMinutes >= slaMinutes
  const delayed = baristaOrders.filter(
    (o) => (o.status === 'Pending' || o.status === 'In Progress') && o.elapsedMinutes >= o.slaMinutes
  );

  const handleEscalate = (orderId) => {
    toast.success(`Ticket #${orderId} escalated to RUSH priority! 🔔 Notification sent to head barista.`, {
      icon: '🚨',
      style: {
        background: '#e74c3c',
        color: '#fff',
        fontWeight: 'bold',
      }
    });
  };

  const handleQuickComplete = (orderId) => {
    updateOrderStatus(orderId, 'Ready');
    toast.success(`Delayed order #${orderId} marked as READY. SLA timer closed.`);
  };

  return (
    <div className="delayed-orders-view animate-fade-in">
      <div className="kds-delayed-header">
        <div>
          <h2>🚨 Delayed & SLA Breach Tickets</h2>
          <p>Orders actively exceeding pre-calculated preparation targets. Speed up dispatch and prioritize immediately.</p>
        </div>
        <span className="breach-bubble">{delayed.length} SLA Breaches</span>
      </div>

      {delayed.length === 0 ? (
        <div className="no-delayed-state  animate-scale-in">
          <span className="emoji-large">🎉</span>
          <h3>All Clear! Zero Breached Tickets</h3>
          <p>Superb performance! All orders are currently tracking safely within target SLA parameters.</p>
        </div>
      ) : (
        <div className="delayed-grid">
          {delayed.map((order) => {
            const extraTime = order.elapsedMinutes - order.slaMinutes;
            return (
              <div key={order.id} className="delayed-ticket-card  critical animate-pulse-border">
                <div className="card-header">
                  <div className="ticket-id-tag">TICKET #{order.id}</div>
                  <div className="time-breached-badge">+{extraTime}m Overdue</div>
                </div>

                <div className="card-body">
                  <h3 className="guest-name">{order.customer}</h3>
                  <div className="items-box">
                    <strong>Beverages:</strong>
                    <p>{order.items.join(', ')}</p>
                  </div>

                  <div className="sla-progress-bar-container">
                    <div className="bar-label">
                      <span>Elapsed: {order.elapsedMinutes}m</span>
                      <span>Target: {order.slaMinutes}m</span>
                    </div>
                    <div className="sla-progress-bar-fill overdue"></div>
                  </div>

                  {order.kot.specialNotes && (
                    <div className="special-notes">
                      <strong>Notes:</strong> {order.kot.specialNotes}
                    </div>
                  )}
                </div>

                <div className="card-footer">
                  <Button variant="danger" size="small" onClick={() => handleEscalate(order.id)}>
                    🚨 Escalate / Alert
                  </Button>
                  <Button variant="primary" size="small" onClick={() => handleQuickComplete(order.id)}>
                    ✓ Quick Complete
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default DelayedOrders;

