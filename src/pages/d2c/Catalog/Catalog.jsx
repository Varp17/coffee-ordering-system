import React, { useState, useEffect } from 'react';
import './Catalog.css';
import Card from '../../../components/Card/Card';
import api from '../../../services/api';

const Catalog = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState(['All']);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCatalog = async () => {
      try {
        const [productsRes, categoriesRes] = await Promise.all([
          api.get('/products'),
          api.get('/categories')
        ]);
        
        // Handle potentially nested data
        const fetchedProducts = productsRes.data.data || productsRes.data || [];
        const fetchedCategories = categoriesRes.data.data || categoriesRes.data || [];
        
        setProducts(fetchedProducts);
        
        const catNames = fetchedCategories.map(c => c.name || c);
        setCategories(['All', ...catNames]);
      } catch (error) {
        console.error('Failed to fetch catalog:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCatalog();
  }, []);

  const filteredProducts = selectedCategory === 'All' 
    ? products 
    : products.filter(p => (p.category?.name || p.category) === selectedCategory);

  return (
    <div className="catalog-page">
      <div className="catalog-header">
        <h1 className="catalog-title">Our <span className="text-gradient">Collection</span></h1>
        <p className="catalog-subtitle">Browse our premium coffee concentrates and blends.</p>
      </div>

      {/* Categories Filter */}
      <div className="categories-container">
        {categories.map(category => (
          <button 
            key={category}
            className={`category-chip ${selectedCategory === category ? 'active' : ''}`}
            onClick={() => setSelectedCategory(category)}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Products Grid */}
      {loading ? (
        <div className="loading-spinner">Loading...</div>
      ) : (
        <div className="catalog-grid">
          {filteredProducts.map(product => (
            <Card 
              key={product.id}
              title={product.title || product.name}
              description={product.description}
              price={product.price}
              imageUrl={product.imageUrl || product.image_url}
              onAction={() => alert(`Added ${product.title || product.name} to cart!`)}
            />
          ))}
          {filteredProducts.length === 0 && <p>No products found in this category.</p>}
        </div>
      )}
    </div>
  );
};

export default Catalog;
