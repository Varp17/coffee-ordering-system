import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import './ActivePrep.css';
import Button from '../../../components/Button/Button';
import Card from '../../../components/Card/Card';
import { useOrderStore } from '../../../store/useOrderStore';
import toast from 'react-hot-toast';

const ActivePrep = () => {
  const { soundEnabled } = useOutletContext();
  const baristaOrders = useOrderStore((state) => state.baristaOrders);
  const advanceBaristaOrder = useOrderStore((state) => state.advanceBaristaOrder);

  const activeOrders = baristaOrders.filter((o) => o.status === 'In Progress');
  const [selectedOrder, setSelectedOrder] = useState(activeOrders[0] || null);

  // Steps checklist tracker: { [orderId]: { [stepIndex]: boolean } }
  const [checklist, setChecklist] = useState({});

  const handleSelectOrder = (order) => {
    setSelectedOrder(order);
  };

  const handleToggleStep = (orderId, stepIdx) => {
    setChecklist((prev) => {
      const orderSteps = prev[orderId] || {};
      return {
        ...prev,
        [orderId]: {
          ...orderSteps,
          [stepIdx]: !orderSteps[stepIdx],
        },
      };
    });
  };

  const handleCompleteOrder = (orderId) => {
    advanceBaristaOrder(orderId);
    toast.success(`Order #${orderId} marked as READY for pickup! ☕`);
    if (soundEnabled) {
      // Play a nice browser beep sound if possible
      try {
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        const osc = audioCtx.createOscillator();
        osc.frequency.setValueAtTime(880, audioCtx.currentTime); // A5 note
        osc.connect(audioCtx.destination);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.2);
      } catch (e) {
        console.warn('Audio context fallback blocked by browser security.');
      }
    }

    // Set next selected order
    const remaining = activeOrders.filter((o) => o.id !== orderId);
    setSelectedOrder(remaining[0] || null);
  };

  const isOrderAllStepsChecked = (order) => {
    if (!order) return false;
    const stepsChecked = checklist[order.id] || {};
    return order.kot.steps.every((_, idx) => stepsChecked[idx]);
  };

  return (
    <div className="active-prep-view animate-fade-in">
      <div className="kds-prep-header-row">
        <div>
          <h2>👨‍🍳 Focused Preparation Mode</h2>
          <p>Tackle active orders with precise step-by-step guidance and raw ingredient checklists</p>
        </div>
        <span className="live-counter-bubble">{activeOrders.length} Active in Prep</span>
      </div>

      {activeOrders.length === 0 ? (
        <div className="empty-prep-state  animate-scale-in">
          <span className="emoji-large">🎉</span>
          <h3>All Clear! No Active Prep</h3>
          <p>Go to the KDS Queue to assign and start incoming orders.</p>
        </div>
      ) : (
        <div className="prep-workspace-split">
          {/* Active Orders List panel */}
          <div className="prep-orders-sidebar ">
            {activeOrders.map((order) => {
              const totalSteps = order.kot.steps.length;
              const checkedSteps = Object.values(checklist[order.id] || {}).filter(Boolean).length;
              const progressPercent = Math.round((checkedSteps / totalSteps) * 100);

              return (
                <div
                  key={order.id}
                  className={`prep-order-tile ${selectedOrder?.id === order.id ? 'active' : ''}`}
                  onClick={() => handleSelectOrder(order)}
                >
                  <div className="tile-main-row">
                    <strong>{order.customer}</strong>
                    <span className={`priority-tag ${order.priority}`}>{order.priority}</span>
                  </div>
                  <p className="tile-items-snippet">{order.items.join(', ')}</p>
                  
                  {/* Progress bar */}
                  <div className="tile-progress-bar-wrap">
                    <div className="progress-bar-fill" style={{ width: `${progressPercent}%` }}></div>
                  </div>
                  <span className="tile-progress-text">{checkedSteps}/{totalSteps} steps completed</span>
                </div>
              );
            })}
          </div>

          {/* Active Checklist Panel */}
          {selectedOrder && (
            <div className="prep-interactive-checklist  animate-slide-up">
              <div className="checklist-header">
                <div>
                  <span className="token-id">Ticket #{selectedOrder.id}</span>
                  <h3>Active Prep: {selectedOrder.customer}</h3>
                </div>
                <Button
                  variant="primary"
                  onClick={() => handleCompleteOrder(selectedOrder.id)}
                  disabled={!isOrderAllStepsChecked(selectedOrder)}
                >
                  Mark as Prepared ✓
                </Button>
              </div>

              {/* Special instructions */}
              {selectedOrder.kot.specialNotes && (
                <div className="prep-notes-warning">
                  <strong>⚠️ SPECIAL INSTRUCTIONS:</strong> {selectedOrder.kot.specialNotes}
                </div>
              )}

              {/* Ingredients list */}
              <div className="checklist-sub-section">
                <h4>Ingredients Mapping</h4>
                <div className="prep-ingredients-row">
                  {selectedOrder.kot.ingredients.map((ing, idx) => (
                    <span key={idx} className="ing-check-tag">
                      🟢 {ing.name}
                    </span>
                  ))}
                </div>
              </div>

              <hr />

              {/* Steps checklist */}
              <div className="checklist-sub-section">
                <h4>Preparation Checklist</h4>
                <div className="interactive-steps-stack">
                  {selectedOrder.kot.steps.map((step, idx) => {
                    const isChecked = !!(checklist[selectedOrder.id]?.[idx]);
                    return (
                      <div
                        key={idx}
                        className={`interactive-step-row ${isChecked ? 'completed' : ''}`}
                        onClick={() => handleToggleStep(selectedOrder.id, idx)}
                      >
                        <div className="step-checkbox">
                          {isChecked ? '✓' : ''}
                        </div>
                        <span className="step-label-text">{step}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ActivePrep;

