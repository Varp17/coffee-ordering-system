import React, { useState, useEffect } from 'react';
import api from '../../../services/api';

const Stores = () => {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStores = async () => {
      try {
        const response = await api.get('/stores');
        setStores(response.data.data || response.data || []);
      } catch (error) {
        console.error('Failed to fetch stores:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStores();
  }, []);

  return (
    <div className="orders-view">
      <div className="view-header">
        <h2 className="section-title">Store Management</h2>
      </div>

      <div className="cms-table-container glass">
        {loading ? (
          <p>Loading stores...</p>
        ) : (
          <table className="cms-table">
            <thead>
              <tr>
                <th>Store ID</th>
                <th>Name</th>
                <th>Location</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {stores.map((store, index) => (
                <tr key={store.id || index}>
                  <td>{store.id}</td>
                  <td>{store.name}</td>
                  <td>{store.location}</td>
                  <td>{store.status || 'Active'}</td>
                </tr>
              ))}
              {stores.length === 0 && (
                <tr>
                  <td colSpan="4" style={{ textAlign: 'center' }}>No stores found.</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Stores;
