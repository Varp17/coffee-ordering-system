import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useKioskStore } from '../../../store/useKioskStore';
import Button from '../../../components/Button/Button';
import './TokenConfirmation.css';

const TokenConfirmation = () => {
  const navigate = useNavigate();
  const currentToken = useKioskStore((state) => state.currentToken);
  const estimatedWaitTime = useKioskStore((state) => state.estimatedWaitTime);
  const clearKioskCart = useKioskStore((state) => state.clearKioskCart);

  // If there's no current token, fallback and redirect back to kiosk welcome
  useEffect(() => {
    if (!currentToken) {
      const timer = setTimeout(() => {
        navigate('/kiosk');
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [currentToken, navigate]);

  const handleFinish = () => {
    clearKioskCart();
    navigate('/kiosk');
  };

  const activeToken = currentToken || 'T-204';
  const activeWait = estimatedWaitTime || 7;

  return (
    <div className="token-confirmation-view animate-fade-in">
      <div className="token-success-card  animate-scale-in">
        <div className="success-icon-animation">
          <div className="icon-circle">
            <span className="coffee-cup-bounce">☕</span>
          </div>
          <div className="confetti-sparks">
            <span></span><span></span><span></span><span></span>
          </div>
        </div>

        <h1 className="token-success-title">Order Received!</h1>
        <p className="token-success-subtitle">Please collect your printed receipt below the kiosk terminal screen.</p>

        <div className="token-display-box">
          <span className="token-display-label">YOUR PICKUP TOKEN</span>
          <h2 className="token-code-number">{activeToken}</h2>
        </div>

        <div className="timer-estimation-box">
          <span className="timer-icon">⏳</span>
          <div className="timer-text">
            <strong>Est. Preparation Duration:</strong>
            <p>Ready in approximately <span>{activeWait} minutes</span></p>
          </div>
        </div>

        <div className="kiosk-instruction-alert">
          <p>🔔 Watch the overhead monitor above the bar. Your ticket code will flash once the barista completes preparation.</p>
        </div>

        <Button
          variant="primary"
          size="large"
          onClick={handleFinish}
          style={{ width: '100%', padding: '18px', fontSize: '1.3rem', borderRadius: '12px', marginTop: '10px' }}
        >
          ✓ Tap to Finish (Done)
        </Button>
      </div>
    </div>
  );
};

export default TokenConfirmation;

