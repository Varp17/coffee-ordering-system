import React from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useKioskStore } from '../store/useKioskStore';
import { useIdleTimeout } from '../hooks/useIdleTimeout';
import './KioskLayout.css';

const KioskLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const cart = useKioskStore((state) => state.cart);
  const clearKioskCart = useKioskStore((state) => state.clearKioskCart);

  // Return to landing page if inactive for 60 seconds
  useIdleTimeout(() => {
    if (location.pathname !== '/kiosk') {
      console.log('[KIOSK TIMEOUT] Inactivity detected, resetting kiosk.');
      clearKioskCart();
      navigate('/kiosk');
    }
  }, 60000);

  const getStepProgress = () => {
    const path = location.pathname;
    if (path === '/kiosk') return 0;
    if (path === '/kiosk/catalog') return 1;
    if (path === '/kiosk/custom') return 2;
    if (path === '/kiosk/checkout') return 3;
    if (path === '/kiosk/token') return 4;
    return 0;
  };

  const currentStep = getStepProgress();
  const showProgress = currentStep > 0 && currentStep < 4;

  return (
    <div className="kiosk-layout-container">
      {/* Fullscreen Touch Header */}
      {showProgress && (
        <header className="kiosk-top-bar">
          <button className="kiosk-back-arrow-btn" onClick={() => navigate(-1)}>
            ⬅ Back
          </button>
          
          <div className="kiosk-progress-bar-steps">
            <div className={`step-dot ${currentStep >= 1 ? 'completed' : ''}`}>1. Select Drink</div>
            <div className="step-line-connector"></div>
            <div className={`step-dot ${currentStep >= 2 ? 'completed' : ''}`}>2. Customize</div>
            <div className="step-line-connector"></div>
            <div className={`step-dot ${currentStep >= 3 ? 'completed' : ''}`}>3. Payment Checkout</div>
          </div>

          <div className="kiosk-right-info">
            <span className="kiosk-cart-summary-bubble">
              🛒 {cart.length} {cart.length === 1 ? 'item' : 'items'}
            </span>
          </div>
        </header>
      )}

      {/* Main Touch Area */}
      <main className="kiosk-view-workspace">
        <Outlet />
      </main>

      {/* Floating Kiosk Help Footer */}
      {currentStep > 0 && (
        <footer className="kiosk-assistive-footer">
          <p>Need assistance? Tap the "Help" icon on the bottom right of the terminal.</p>
          <button className="kiosk-help-trigger-btn" onClick={() => alert('Assistance is on the way! A barista will help you shortly.')}>
            ❓ Call Staff Help
          </button>
        </footer>
      )}
    </div>
  );
};

export default KioskLayout;
