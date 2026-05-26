import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useOrderStore } from '../../../store/useOrderStore';
import { useWebSocket } from '../../../hooks/useWebSocket';
import Button from '../../../components/Button/Button';
import './OrderQueue.css';

const OrderQueue = () => {
  // Activate real-time websocket connection for barista
  useWebSocket('barista');

  const baristaOrders = useOrderStore((state) => state.baristaOrders);
  const fetchBaristaQueue = useOrderStore((state) => state.fetchBaristaQueue);
  const advanceBaristaOrder = useOrderStore((state) => state.advanceBaristaOrder);
  const updateOrderStatus = useOrderStore((state) => state.updateOrderStatus);

  const [selectedKOT, setSelectedKOT] = useState(null);

  useEffect(() => {
    fetchBaristaQueue();
  }, [fetchBaristaQueue]);

  // Group orders by KDS status (case-insensitive checks matching backend string)
  const pendingOrders = baristaOrders.filter((o) => (o.status || '').toLowerCase() === 'pending');
  const inProgressOrders = baristaOrders.filter((o) => (o.status || '').toLowerCase() === 'in_progress');
  const completedOrders = baristaOrders.filter((o) => 
    (o.status || '').toLowerCase() === 'completed' || 
    (o.status || '').toLowerCase() === 'ready'
  );

  // Animation variants
  const listVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };
  const ticketVariants = {
    hidden: { opacity: 0, scale: 0.9, y: 20 },
    show: { opacity: 1, scale: 1, y: 0, transition: { type: 'spring', stiffness: 400, damping: 25 } },
    exit: { opacity: 0, scale: 0.9, transition: { duration: 0.2 } }
  };

  return (
    <div className="order-queue-view animate-fade-in">
      <div className="kds-queue-header">
        <div>
          <h2>KDS Dispatch</h2>
          <p>Scannable layout. High-speed operational board.</p>
        </div>
        <div className="queue-metric-summary">
          <span className="queue-tag">⏳ {pendingOrders.length} Pending</span>
          <span className="queue-tag active">👨‍🍳 {inProgressOrders.length} Preparing</span>
          <span className="queue-tag done">✅ {completedOrders.length} Ready</span>
        </div>
      </div>

      <div className="queue-columns">
        {/* Pending Column */}
        <div className="queue-column">
          <div className="column-header">
            <h3>📥 Pending</h3>
            <span className="count-badge">{pendingOrders.length}</span>
          </div>
          <motion.div className="column-content" variants={listVariants} initial="hidden" animate="show">
            <AnimatePresence mode="popLayout">
              {pendingOrders.length === 0 ? (
                <p className="empty-column-msg">No pending tickets</p>
              ) : (
                pendingOrders.map((order) => (
                  <motion.div 
                    layoutId={`order-${order.id}`}
                    variants={ticketVariants}
                    initial="hidden"
                    animate="show"
                    exit="exit"
                    key={order.id} 
                    className={`order-ticket ${order.priority === 'rush' ? 'rush-priority' : ''}`}
                  >
                    <div className="ticket-header">
                      <span className="order-id">#{order.order_number || order.id}</span>
                      <span className="order-time">{order.time || '1 min ago'}</span>
                    </div>
                    <div className="ticket-body">
                      <p className="customer-name">{order.customer || 'Guest'}</p>
                      <ul className="item-list">
                        {order.items && order.items.map((item, index) => (
                          <li key={index}>☕ {item.item_name || item}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="ticket-footer">
                      <Button variant="outline" className="kds-action-btn" onClick={() => setSelectedKOT(order)}>KOT</Button>
                      <Button variant="primary" className="kds-action-btn" style={{backgroundColor: 'var(--color-info)'}} onClick={() => advanceBaristaOrder(order.id)}>START</Button>
                    </div>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </motion.div>
        </div>

        {/* In Progress Column */}
        <div className="queue-column">
          <div className="column-header">
            <h3>👨‍🍳 In Progress</h3>
            <span className="count-badge active">{inProgressOrders.length}</span>
          </div>
          <motion.div className="column-content" variants={listVariants} initial="hidden" animate="show">
            <AnimatePresence mode="popLayout">
              {inProgressOrders.length === 0 ? (
                <p className="empty-column-msg">No active brews</p>
              ) : (
                inProgressOrders.map((order) => (
                  <motion.div 
                    layoutId={`order-${order.id}`}
                    variants={ticketVariants}
                    initial="hidden"
                    animate="show"
                    exit="exit"
                    key={order.id} 
                    className="order-ticket in-progress"
                  >
                    <div className="ticket-header">
                      <span className="order-id">#{order.order_number || order.id}</span>
                      <span className="order-time">{order.time || 'Active'}</span>
                    </div>
                    <div className="ticket-body">
                      <p className="customer-name">{order.customer || 'Guest'}</p>
                      <ul className="item-list">
                        {order.items && order.items.map((item, index) => (
                          <li key={index}>☕ {item.item_name || item}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="ticket-footer">
                      <Button variant="outline" className="kds-action-btn" onClick={() => updateOrderStatus(order.id, 'Pending')}>REVERT</Button>
                      <Button variant="primary" className="kds-action-btn" style={{backgroundColor: 'var(--color-success)'}} onClick={() => advanceBaristaOrder(order.id)}>READY</Button>
                    </div>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </motion.div>
        </div>

        {/* Completed/Ready Column */}
        <div className="queue-column">
          <div className="column-header">
            <h3>✅ Ready</h3>
            <span className="count-badge done">{completedOrders.length}</span>
          </div>
          <motion.div className="column-content" variants={listVariants} initial="hidden" animate="show">
            <AnimatePresence mode="popLayout">
              {completedOrders.length === 0 ? (
                <p className="empty-column-msg">No ready items</p>
              ) : (
                completedOrders.map((order) => (
                  <motion.div 
                    layoutId={`order-${order.id}`}
                    variants={ticketVariants}
                    initial="hidden"
                    animate="show"
                    exit="exit"
                    key={order.id} 
                    className="order-ticket completed"
                  >
                    <div className="ticket-header">
                      <span className="order-id">#{order.order_number || order.id}</span>
                      <span className="order-time">{order.time || 'Ready'}</span>
                    </div>
                    <div className="ticket-body">
                      <p className="customer-name">{order.customer || 'Guest'}</p>
                      <ul className="item-list">
                        {order.items && order.items.map((item, index) => (
                          <li key={index}>☕ {item.item_name || item}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="ticket-footer">
                      <span className="pickup-ready-tag">AWAITING PICKUP</span>
                    </div>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>

      {/* KOT Modal */}
      <AnimatePresence>
        {selectedKOT && (
          <motion.div 
            className="modal-overlay" 
            onClick={() => setSelectedKOT(null)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div 
              className="kot-modal" 
              onClick={e => e.stopPropagation()}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            >
              <div className="modal-header">
                <h2>Kitchen Order Ticket</h2>
                <button className="close-btn" onClick={() => setSelectedKOT(null)}>×</button>
              </div>
              <div className="modal-body">
                <div className="kot-info">
                  <span><strong>ID:</strong> #{selectedKOT.order_number || selectedKOT.id}</span>
                  <span><strong>Customer:</strong> {selectedKOT.customer || 'Guest'}</span>
                </div>
                <div className="kot-section">
                  <h3>Items</h3>
                  <ul>
                    {selectedKOT.items && selectedKOT.items.map((item, index) => (
                      <li key={index}>☕ {item.item_name || item}</li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="modal-footer">
                <Button variant="primary" size="large" onClick={() => setSelectedKOT(null)}>Close</Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default OrderQueue;
