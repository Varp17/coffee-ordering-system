import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, Play, CheckCircle, AlertTriangle, HelpCircle } from 'lucide-react';

// SLA thresholds in seconds (10 mins SLA target)
const SLA_LIMIT = 600;
const SLA_WARNING = 450;

export const KdsQueue = ({ orders = [], onStart, onComplete }) => {
  const [timers, setTimers] = useState({});

  useEffect(() => {
    const interval = setInterval(() => {
      setTimers((prev) => {
        const next = { ...prev };
        orders.forEach((o) => {
          if (o.status !== 'completed' && o.status !== 'delivered') {
            const elapsed = Math.floor((Date.now() - new Date(o.created_at).getTime()) / 1000);
            next[o.id] = elapsed;

            // Audio Alert if warning/SLA breached
            if (elapsed === SLA_WARNING) {
              _playWarningSound();
            }
          }
        });
        return next;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [orders]);

  const _playWarningSound = () => {
    try {
      const audio = new Audio('/sounds/warning-sla.mp3');
      audio.volume = 0.5;
      audio.play();
    } catch (_) {
      // Browsers block autoplay often, ignore
    }
  };

  const getSLAStatus = (elapsed) => {
    if (!elapsed) return { label: '0m', color: 'text-neutral-500' };
    if (elapsed >= SLA_LIMIT) return { label: 'BREACHED', color: 'text-rose-600 font-bold animate-pulse' };
    if (elapsed >= SLA_WARNING) return { label: 'WARNING', color: 'text-amber-500 font-bold' };
    const mins = Math.floor(elapsed / 60);
    const secs = elapsed % 60;
    return { label: `${mins}m ${secs}s`, color: 'text-emerald-500' };
  };

  return (
    <div className="queue-columns">
      {/* 📥 PENDING QUEUE */}
      <div className="queue-column">
        <div className="column-header">
          <h3>📥 Pending</h3>
          <span className="count-badge">
            {orders.filter(o => o.status === 'pending').length}
          </span>
        </div>
        <div className="column-content">
          <AnimatePresence mode="popLayout">
            {orders.filter(o => o.status === 'pending').length === 0 ? (
              <p className="empty-column-msg">No pending tickets</p>
            ) : (
              orders.filter(o => o.status === 'pending').map((order) => {
                const elapsed = timers[order.id] || 0;
                const sla = getSLAStatus(elapsed);

                return (
                  <motion.div
                    key={order.id}
                    layoutId={`order-${order.id}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="order-ticket"
                  >
                    <div className="ticket-header">
                      <span className="order-id">#{order.order_number}</span>
                      <span className={`order-time flex items-center gap-1 ${sla.color}`}>
                        <Clock className="w-3.5 h-3.5" style={{ display: 'inline' }} /> {sla.label}
                      </span>
                    </div>
                    <div className="ticket-body">
                      <p className="customer-name">{order.customer_name || 'Guest'}</p>
                      <ul className="item-list">
                        {(order.items || []).map((it, idx) => {
                          const name = typeof it === 'string' ? it : (it.name || it.item_name || 'Item');
                          const qty = typeof it === 'string' ? 1 : (it.quantity || it.qty || 1);
                          return <li key={idx}>☕ {name} (x{qty})</li>;
                        })}
                      </ul>
                    </div>
                    <div className="ticket-footer">
                      <button
                        onClick={() => onStart && onStart(order.id)}
                        className="btn btn-primary kds-action-btn w-full"
                        style={{ backgroundColor: 'var(--color-info)' }}
                      >
                        <Play className="w-3.5 h-3.5" style={{ display: 'inline', marginRight: '6px' }} />
                        <span>Start Prep</span>
                      </button>
                    </div>
                  </motion.div>
                );
              })
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* 👨‍🍳 IN PROGRESS QUEUE */}
      <div className="queue-column">
        <div className="column-header">
          <h3>👨‍🍳 Preparing</h3>
          <span className="count-badge active">
            {orders.filter(o => o.status === 'in_progress').length}
          </span>
        </div>
        <div className="column-content">
          <AnimatePresence mode="popLayout">
            {orders.filter(o => o.status === 'in_progress').length === 0 ? (
              <p className="empty-column-msg">No active brews</p>
            ) : (
              orders.filter(o => o.status === 'in_progress').map((order) => {
                const elapsed = timers[order.id] || 0;
                const sla = getSLAStatus(elapsed);

                return (
                  <motion.div
                    key={order.id}
                    layoutId={`order-${order.id}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="order-ticket in-progress"
                  >
                    <div className="ticket-header">
                      <span className="order-id">#{order.order_number}</span>
                      <span className={`order-time flex items-center gap-1 ${sla.color}`}>
                        <Clock className="w-3.5 h-3.5" style={{ display: 'inline' }} /> {sla.label}
                      </span>
                    </div>
                    <div className="ticket-body">
                      <p className="customer-name">{order.customer_name || 'Guest'}</p>
                      <ul className="item-list">
                        {(order.items || []).map((it, idx) => {
                          const name = typeof it === 'string' ? it : (it.name || it.item_name || 'Item');
                          const qty = typeof it === 'string' ? 1 : (it.quantity || it.qty || 1);
                          return (
                            <li key={idx} style={{ color: 'var(--color-primary)' }}>
                              ☕ {name} (x{qty})
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                    <div className="ticket-footer">
                      <button
                        onClick={() => onComplete && onComplete(order.id)}
                        className="btn btn-primary kds-action-btn w-full"
                        style={{ backgroundColor: 'var(--color-success)' }}
                      >
                        <CheckCircle className="w-3.5 h-3.5" style={{ display: 'inline', marginRight: '6px' }} />
                        <span>Ready</span>
                      </button>
                    </div>
                  </motion.div>
                );
              })
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* ✅ READY FOR PICKUP */}
      <div className="queue-column">
        <div className="column-header">
          <h3>✅ Ready</h3>
          <span className="count-badge done">
            {orders.filter(o => o.status === 'completed' || o.status === 'ready').length}
          </span>
        </div>
        <div className="column-content">
          <AnimatePresence mode="popLayout">
            {orders.filter(o => o.status === 'completed' || o.status === 'ready').length === 0 ? (
              <p className="empty-column-msg">No ready items</p>
            ) : (
              orders.filter(o => o.status === 'completed' || o.status === 'ready').map((order) => {
                return (
                  <motion.div
                    key={order.id}
                    layoutId={`order-${order.id}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="order-ticket completed"
                  >
                    <div className="ticket-header">
                      <span className="order-id">#{order.order_number}</span>
                      <span className="pickup-ready-tag" style={{ border: 'none', padding: '2px 8px', fontSize: '0.8rem' }}>
                        READY
                      </span>
                    </div>
                    <div className="ticket-body">
                      <p className="customer-name">{order.customer_name || 'Guest'}</p>
                      <ul className="item-list">
                        {(order.items || []).map((it, idx) => {
                          const name = typeof it === 'string' ? it : (it.name || it.item_name || 'Item');
                          const qty = typeof it === 'string' ? 1 : (it.quantity || it.qty || 1);
                          return <li key={idx}>☕ {name} (x{qty})</li>;
                        })}
                      </ul>
                    </div>
                    <div className="ticket-footer">
                      <span className="pickup-ready-tag">AWAITING PICKUP</span>
                    </div>
                  </motion.div>
                );
              })
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default KdsQueue;
