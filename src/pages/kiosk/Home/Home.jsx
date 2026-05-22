import React from 'react';
import './Home.css';
import Button from '../../../components/Button/Button';

const Home = ({ onStart, onQrScan, onLogout }) => {
  return (
    <div className="kiosk-home">
      <div className="kiosk-overlay"></div>
      <div className="kiosk-content">
        <div className="brand-header">
          <h1 className="brand-title text-gradient">VASIFY COFFEE</h1>
          <p className="brand-subtitle">Premium Specialty Coffee</p>
        </div>

        <div className="cta-container">
          <div className="glass-card start-card">
            <h2>Welcome!</h2>
            <p>Experience the finest brews made just for you.</p>
            <button className="massive-btn" onClick={onStart}>
              <span className="btn-icon">☕</span>
              <span className="btn-text">Tap to Start Ordering</span>
            </button>
            <button className="qr-btn" onClick={onQrScan} style={{
              background: 'transparent',
              border: '1px solid var(--glass-border)',
              color: 'var(--color-text)',
              padding: '15px 30px',
              borderRadius: '30px',
              marginTop: '10px',
              cursor: 'pointer',
              fontWeight: '600',
              width: '100%',
              transition: 'all 0.3s ease'
            }}>
              📱 Scan QR to Order on Phone
            </button>
          </div>
        </div>

        <div className="action-buttons">
          <Button variant="primary" size="large" onClick={onStart}>Order Now</Button>
          <Button variant="secondary" size="large" onClick={onQrScan}>Scan QR</Button>
        </div>
        {onLogout && (
          <div style={{ marginTop: '30px' }}>
            <Button variant="secondary" size="small" onClick={onLogout}>Exit Kiosk Mode</Button>
          </div>
        )}

        <div className="brand-footer">
          <p>Scan QR code at the kiosk to order from your phone</p>
        </div>
      </div>
    </div>
  );
};

export default Home;
