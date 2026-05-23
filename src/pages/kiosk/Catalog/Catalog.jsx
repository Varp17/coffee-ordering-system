import React, { useState, useEffect } from 'react';
import './Catalog.css';
import Button from '../../../components/Button/Button';
import Card from '../../../components/Card/Card';
import api from '../../../services/api';

const Catalog = ({ onBack, onLogin, onCreateCustom, onCheckout }) => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [cart, setCart] = useState([]);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState(['All']);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCatalog = async () => {
      try {
        const [productsRes, categoriesRes] = await Promise.all([
          api.get('/products'),
          api.get('/categories')
        ]);
        const fetchedProducts = productsRes.data.data || productsRes.data || [];
        const fetchedCategories = categoriesRes.data.data || categoriesRes.data || [];
        
        setProducts(fetchedProducts);
        const catNames = fetchedCategories.map(c => c.name || c);
        setCategories(['All', ...catNames]);
      } catch (error) {
        console.error('Failed to fetch kiosk catalog:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCatalog();
  }, []);

  const filteredProducts = selectedCategory === 'All' 
    ? products 
    : products.filter(p => (p.category?.name || p.category) === selectedCategory);

  const addToCart = (product) => {
    setCart([...cart, product]);
  };

  const total = cart.reduce((sum, item) => sum + item.base_price, 0);

  return (
    <div className="kiosk-catalog">
      <div className="catalog-sidebar">
        <button className="back-btn" onClick={onBack}>← Back</button>
        <div className="categories-list">
          {categories.map(cat => (
            <button 
              key={cat} 
              className={`category-btn ${selectedCategory === cat ? 'active' : ''}`}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="catalog-main">
        <div className="catalog-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2>Select Your Items</h2>
          <div style={{ display: 'flex', gap: '10px' }}>
            <Button variant="secondary" size="small" onClick={onCreateCustom}>Custom Drink</Button>
            <Button variant="secondary" size="small" onClick={onLogin}>Login</Button>
          </div>
        </div>
        <div className="products-grid">
          {filteredProducts.map(product => (
            <Card 
              key={product.id}
              title={product.name}
              price={`₹${product.base_price}`}
              imageUrl={product.image_url}
              actionText="Add"
              onAction={() => addToCart(product)}
            />
          ))}
        </div>
      </div>

      <div className="catalog-cart-summary glass">
        <h3>Your Order</h3>
        <div className="cart-items">
          {cart.length === 0 ? (
            <p className="empty-msg">No items added yet</p>
          ) : (
            <ul>
              {cart.map((item, index) => (
                <li key={index}>
                  <span>{item.name}</span>
                  <span>₹{item.base_price}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="cart-total">
          <span>Total:</span>
          <span>₹{total}</span>
        </div>
        <Button variant="primary" size="large" disabled={cart.length === 0} onClick={() => onCheckout(cart, total)}>Checkout</Button>
      </div>
    </div>
  );
};

export default Catalog;
