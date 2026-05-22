import React, { useState, useEffect } from 'react';
import './Ingredients.css';
import Button from '../../../components/Button/Button';
import api from '../../../services/api';

const Ingredients = () => {
  const [ingredients, setIngredients] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchIngredients = async () => {
      try {
        const response = await api.get('/ingredients');
        setIngredients(response.data.data || response.data || []);
      } catch (error) {
        console.error('Failed to fetch ingredients:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchIngredients();
  }, []);

  return (
    <div className="ingredients-view">
      <div className="view-header">
        <h2 className="section-title">Ingredient Mapping & Pricing</h2>
        <Button variant="primary" size="small">Add New Mapping</Button>
      </div>

      <div className="cms-table-container glass">
        {loading ? (
          <p style={{ padding: '20px' }}>Loading ingredients...</p>
        ) : (
          <table className="cms-table">
            <thead>
              <tr>
                <th>Ingredient</th>
                <th>Applicable Product/Category</th>
                <th>Base Cost (₹)</th>
                <th>Selling Price (₹)</th>
                <th>Margin (₹)</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {ingredients.map(item => (
                <tr key={item.id}>
                  <td>{item.name}</td>
                  <td>{item.product_name || item.product || 'Global'}</td>
                  <td>₹{item.cost || 0}</td>
                  <td>₹{item.price || 0}</td>
                  <td style={{ color: '#28a745' }}>₹{(item.price || 0) - (item.cost || 0)}</td>
                  <td>
                    <button className="action-btn edit">Edit</button>
                    <button className="action-btn delete">Remove</button>
                  </td>
                </tr>
              ))}
              {ingredients.length === 0 && (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center' }}>No ingredients found.</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Ingredients;
