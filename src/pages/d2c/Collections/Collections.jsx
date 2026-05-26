import React from 'react';
import './Collections.css';
import Button from '../../../components/Button/Button';
import Card from '../../../components/Card/Card';
import { products } from '../../../data/mockData';
import { useCartStore } from '../../../store/useCartStore';
import { formatCurrency } from '../../../utils/formatters';
import toast from 'react-hot-toast';

const Collections = () => {
  const addItemToCart = useCartStore((state) => state.addItem);

  // Group realistic bundles for D2C customer curated shopping
  const collections = [
    {
      id: 'coll-001',
      title: 'Summer Cold Brew Box 🧊',
      description: 'Defeat the heat with this ready-to-pour batch. Contains Madagascar vanilla cold brew and our flagship sweet caramel macchiato concentrates.',
      price: 2199,
      originalPrice: 2498,
      image: 'https://images.unsplash.com/photo-1461023235402-278239b9b242?w=600&q=80',
      itemsList: ['prod-002', 'prod-004'], // Vanilla Cold Brew, Caramel Macchiato
      tag: 'Bestseller ☀️',
    },
    {
      id: 'coll-002',
      title: "Connoisseur's Drip Set 🫘",
      description: 'For the coffee purists. Two packs of single-origin ground Arabica beans roasted in micro-batches with slow brewing release values.',
      price: 1549,
      originalPrice: 1798,
      image: 'https://images.unsplash.com/photo-1559496417-e7f25cb247f3?w=600&q=80',
      itemsList: ['prod-005'], // Espresso Blend Beans (2 packs)
      tag: 'Limited Edition 💎',
    },
    {
      id: 'coll-003',
      title: 'Home Barista DIY Kit 🍵',
      description: 'Unlock your inner barista. Includes premium ceremonial Uji Matcha powder, bamboo whisk, and organic dark roast concentrate bottles.',
      price: 2299,
      originalPrice: 2698,
      image: 'https://images.unsplash.com/photo-1515823064-d6e0c04616a7?w=600&q=80',
      itemsList: ['prod-007', 'prod-001'], // Matcha Kit, Dark Roast Concentrate
      tag: 'Chef Picks ⭐',
    }
  ];

  const handleAddBundle = (bundle) => {
    // Find the products included in this bundle and add to cart
    bundle.itemsList.forEach((prodId) => {
      const match = products.find(p => p.id === prodId);
      if (match) {
        // Add first variant as fallback
        const variant = match.variants && match.variants.length > 0 ? match.variants[0] : { id: 'default', name: 'Standard', price: match.price };
        addItemToCart(match, variant, 1);
      }
    });

    toast.success(`Curated Bundle "${bundle.title}" added to your cart! 🛍️`);
  };

  return (
    <div className="collections-page animate-fade-in container">
      {/* Intro section */}
      <header className="collections-header">
        <span className="badge-curated">🏆 Crafted By Baristas</span>
        <h1 className="collections-title">Specialty Curated Collections</h1>
        <p className="collections-desc">
          We have gathered our finest blends, fresh single-origins, and artisanal DIY tools into premium bundles. Enjoy curated convenience with discounted combo pricing.
        </p>
      </header>

      {/* Grid of collections */}
      <div className="collections-grid">
        {collections.map((coll) => (
          <Card key={coll.id} className="collection-card" elevation="medium">
            <div className="coll-image-container">
              <img src={coll.image} alt={coll.title} className="coll-image" />
              {coll.tag && <span className="coll-tag">{coll.tag}</span>}
            </div>

            <div className="coll-details">
              <h2 className="coll-card-title">{coll.title}</h2>
              <p className="coll-description">{coll.description}</p>

              <hr className="coll-divider" />

              <div className="coll-items-preview">
                <h4>What's inside:</h4>
                <ul>
                  {coll.itemsList.map((itemId) => {
                    const match = products.find(p => p.id === itemId);
                    return match ? <li key={itemId}>📦 {match.title} (Standard Pack)</li> : null;
                  })}
                </ul>
              </div>

              <div className="coll-footer">
                <div className="coll-price-block">
                  <span className="price-label">Bundle Value:</span>
                  <div className="price-row">
                    <span className="current-price">{formatCurrency(coll.price)}</span>
                    {coll.originalPrice && (
                      <span className="original-price">{formatCurrency(coll.originalPrice)}</span>
                    )}
                  </div>
                </div>

                <Button variant="primary" onClick={() => handleAddBundle(coll)}>
                  Add Bundle to Cart 🛒
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Collections;
