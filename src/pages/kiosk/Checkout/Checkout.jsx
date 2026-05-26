import React, { useState } from 'react';
import './Checkout.css';
import Button from '../../../components/Button/Button';
import { formatCurrency } from '../../../utils/formatters';

const Checkout = ({ cart = [], total = 0, onBack, onComplete }) => {
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  const handlePay = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setIsCompleted(true);
    }, 2000);
  };

  if (isCompleted) {
    return (
      <div className="kiosk-checkout success-screen animate-fade-in">
        <div className="success-card">
          <div className="success-icon">✓</div>
          <h2>Order Placed!</h2>
          <p>Thank you for your order.</p>
          <p className="order-number">Order #1234</p>
          <p>Please collect your receipt and wait for your number to be called.</p>
          <Button variant="primary" size="large" onClick={onComplete} style={{marginTop: 'var(--space-16)'}}>Back to Home</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="kiosk-checkout animate-fade-in">
      <div className="checkout-card">
        <button className="back-btn" onClick={onBack}>← Back</button>
        <h2>Checkout</h2>

        <div className="order-summary-section">
          <h3>Your Order</h3>
          <ul className="cart-items-list">
            {cart.map((item, index) => (
              <li key={index} className="cart-item">
                <span>{item.name} {item.qty ? `×${item.qty}` : ''}</span>
                <span>{formatCurrency(item.price || 0)}</span>
              </li>
            ))}
            {cart.length === 0 && (
              <li className="cart-item" style={{justifyContent: 'center', color: 'var(--color-text-secondary)'}}>
                Cart is empty
              </li>
            )}
          </ul>
          <div className="total-row">
            <span>Total:</span>
            <span className="total-price">{formatCurrency(total)}</span>
          </div>
        </div>

        <div className="payment-section">
          <h3>Select Payment Method</h3>
          <div className="payment-options">
            <button 
              className={`payment-option ${paymentMethod === 'card' ? 'active' : ''}`}
              onClick={() => setPaymentMethod('card')}
            >
              <span className="icon">💳</span>
              <span>Credit / Debit Card</span>
            </button>
            <button 
              className={`payment-option ${paymentMethod === 'upi' ? 'active' : ''}`}
              onClick={() => setPaymentMethod('upi')}
            >
              <span className="icon">📱</span>
              <span>UPI / QR Scan</span>
            </button>
          </div>
        </div>

        <div className="action-section">
          <Button 
            variant="primary" 
            size="large" 
            onClick={handlePay}
            disabled={isProcessing || cart.length === 0}
            style={{ width: '100%', padding: 'var(--space-20)', fontSize: 'var(--font-size-h3)', minHeight: '64px' }}
          >
            {isProcessing ? 'Processing...' : `Pay ${formatCurrency(total)}`}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
