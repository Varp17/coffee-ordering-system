import React, { useState, useEffect } from 'react';
import './Menu.css';
import Button from '../../../components/Button/Button';
import api from '../../../services/api';

const Menu = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await api.get('/products');
        setProducts(response.data.data || response.data || []);
      } catch (error) {
        console.error('Failed to fetch products:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  return (
    <div className="menu-view">
      <div className="view-header">
        <h2 className="section-title">Product & Menu Management</h2>
        <Button variant="primary" size="small">Add New Product</Button>
      </div>

      <div className="cms-table-container glass">
        {loading ? (
          <p style={{ padding: '20px' }}>Loading products...</p>
        ) : (
          <table className="cms-table">
            <thead>
              <tr>
                <th>Product Name</th>
                <th>Category</th>
                <th>Price (₹)</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map(product => (
                <tr key={product.id}>
                  <td>{product.title || product.name}</td>
                  <td>{product.category?.name || product.category || 'N/A'}</td>
                  <td>₹{product.price}</td>
                  <td>
                    <span className={`status-chip ${(product.status || 'Active').toLowerCase()}`}>
                      {product.status || 'Active'}
                    </span>
                  </td>
                  <td>
                    <button className="action-btn edit">Edit</button>
                    <button className="action-btn delete">Delete</button>
                  </td>
                </tr>
              ))}
              {products.length === 0 && (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center' }}>No products found.</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Menu;
