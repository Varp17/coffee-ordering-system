import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Clock, Coffee, Sparkles, Heart, Play, ShoppingBag, Eye } from 'lucide-react';
import { useCartStore } from '../../store/useCartStore';
import toast from 'react-hot-toast';
import './RecipeDiscoverer.css';

const RECIPES = {
  light: {
    id: 'french-vanilla-latte',
    name: 'French Vanilla Latte',
    price: 249,
    originalPrice: 320,
    rating: 4.8,
    reviews: 154,
    beanType: 'Arabica',
    roast: 'Light Roast',
    prepTime: '15 Min',
    sweetness: 'Soft & Velvety',
    description: 'A smooth blend of premium single-origin Arabica beans, sweet velvety French vanilla syrup, and perfectly steamed microfoam.',
    image: '/images/products/cappuccino.png',
    ingredients: [
      { name: 'Espresso', amount: '30 ml', type: 'Bold shot' },
      { name: 'Steamed Milk', amount: '240 ml', type: 'Microfoam' },
      { name: 'Vanilla Syrup', amount: '15 ml', type: 'Artisanal' }
    ]
  },
  medium: {
    id: 'iced-caramel-macchiato',
    name: 'Iced Caramel Macchiato',
    price: 289,
    originalPrice: 360,
    rating: 4.9,
    reviews: 218,
    beanType: 'Arabica & Robusta',
    roast: 'Medium Roast',
    prepTime: '12 Min',
    sweetness: 'Balanced Caramel',
    description: 'Fresh espresso poured over cold milk and rich caramel drizzle, capturing dense buttery notes with a sweet vanilla undertone.',
    image: '/images/products/iced-coffee.png',
    ingredients: [
      { name: 'Espresso', amount: '45 ml', type: 'Double shot' },
      { name: 'Cold Milk', amount: '200 ml', type: 'Fresh dairy' },
      { name: 'Caramel Drizzle', amount: '20 ml', type: 'Buttery smooth' }
    ]
  },
  strong: {
    id: 'south-indian-filter-special',
    name: 'South Indian Filter Special',
    price: 199,
    originalPrice: 260,
    rating: 4.9,
    reviews: 342,
    beanType: 'Peaberry (70:30 chicory)',
    roast: 'Dark Roast',
    prepTime: '10 Min',
    sweetness: 'Intense & Strong',
    description: 'Authentic chicory-infused peaberry concentrate brewed slowly in a traditional filter, frothed up high with boiling milk.',
    image: '/images/products/filter-coffee.png',
    ingredients: [
      { name: 'Filter Decoction', amount: '60 ml', type: 'Chicory blend' },
      { name: 'Boiling Milk', amount: '180 ml', type: 'Highly aerated' },
      { name: 'Jaggery Sugar', amount: '10 g', type: 'Traditional' }
    ]
  }
};

const RecipeDiscoverer = () => {
  const [strength, setStrength] = useState('medium');
  const [showVideoModal, setShowVideoModal] = useState(false);
  const addItemToCart = useCartStore((state) => state.addItem);

  const activeRecipe = RECIPES[strength];

  const handleBrewAndCart = () => {
    const product = {
      id: activeRecipe.id,
      name: activeRecipe.name,
      price: activeRecipe.price,
      original_price: activeRecipe.originalPrice,
      image_url: activeRecipe.image,
      rating: activeRecipe.rating,
      review_count: activeRecipe.reviews,
      tags: [strength.toUpperCase(), activeRecipe.roast],
      in_stock: true
    };
    
    const variant = {
      id: `${activeRecipe.id}-standard`,
      name: 'Standard (360ml)',
      price: activeRecipe.price
    };

    addItemToCart(product, variant, 1);
    toast.success(`${activeRecipe.name} brewed and added to cart! ☕✨`);
  };

  return (
    <section className="discoverer-wrapper">
      <div className="discoverer-bg-details">
        <div className="bg-blur blur-1" />
        <div className="bg-blur blur-2" />
      </div>

      <div className="section-container discoverer-layout">
        {/* Left Interactive Wizard Column */}
        <div className="wizard-panel">
          <span className="eyebrow" style={{ color: 'var(--color-primary)' }}>
            <Sparkles size={12} style={{ marginRight: '6px', color: 'var(--color-accent)' }} />
            Artisanal Assistant
          </span>
          <h2 className="wizard-title">
            How do you <em className="italic-accent">like</em> your coffee?
          </h2>
          <p className="wizard-subtitle">
            Choose your signature profile below. Our assistant will instantly configure the volumetric balance, bean origin, and recipe guidelines.
          </p>

          <div className="strength-selector-container">
            <span className="selector-label">SELECT COFFEE STRENGTH</span>
            <div className="strength-buttons">
              {['light', 'medium', 'strong'].map((level) => (
                <button
                  key={level}
                  onClick={() => setStrength(level)}
                  className={`strength-btn ${strength === level ? 'active' : ''}`}
                >
                  <span className="btn-indicator" />
                  {level.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          <div className="pro-insights-card">
            <div className="insight-icon">
              <Coffee size={18} />
            </div>
            <div className="insight-text">
              <strong>Barista's Pairing Tip</strong>
              <p>
                {strength === 'light' && 'Best paired with our premium measured pourer and premium shaker glass. Perfect for late mornings.'}
                {strength === 'medium' && 'Excellent as an everyday refresher. Tastes best with organic oat milk or honey sweeteners.'}
                {strength === 'strong' && 'Ideal with a standard 360ml tall standard cup. Our Peaberry blend will power up your focus instantly.'}
              </p>
            </div>
          </div>
        </div>

        {/* Right Phone Mockup Column */}
        <div className="phone-mockup-panel">
          <div className="phone-device">
            {/* Dynamic notch */}
            <div className="phone-notch" />
            
            {/* Screen Header */}
            <div className="phone-screen-header">
              <div className="user-avatar-row">
                <div className="mini-avatar">☕</div>
                <div>
                  <span className="avatar-welcome">Brewing Now</span>
                  <strong className="avatar-name">Signature Recipe</strong>
                </div>
              </div>
              <button className="like-btn" aria-label="Add to favorites">
                <Heart size={14} fill="#EF4444" stroke="#EF4444" />
              </button>
            </div>

            {/* Screen Content */}
            <div className="phone-screen-content">
              <AnimatePresence mode="wait">
                <motion.div
                  key={strength}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  className="recipe-details"
                >
                  {/* Glass image display */}
                  <div className="recipe-image-wrap">
                    <img src={activeRecipe.image} alt={activeRecipe.name} className="recipe-image" />
                    <div className="recipe-badge-tag">{activeRecipe.roast}</div>
                  </div>

                  {/* Title & Rating */}
                  <div className="recipe-meta">
                    <div>
                      <h3 className="recipe-name">{activeRecipe.name}</h3>
                      <span className="recipe-sweet-flag">{activeRecipe.sweetness}</span>
                    </div>
                    <div className="recipe-rating">
                      <Star size={14} fill="#F59E0B" stroke="#F59E0B" />
                      <strong>{activeRecipe.rating}</strong>
                    </div>
                  </div>

                  {/* Attributes Bar */}
                  <div className="attributes-grid">
                    <div className="attr-pill">
                      <strong className="attr-val">{activeRecipe.beanType}</strong>
                      <span className="attr-lbl">Beans</span>
                    </div>
                    <div className="attr-pill">
                      <div className="attr-flex">
                        <Clock size={12} />
                        <strong className="attr-val">{activeRecipe.prepTime}</strong>
                      </div>
                      <span className="attr-lbl">Duration</span>
                    </div>
                  </div>

                  {/* Description */}
                  <div className="recipe-description-box">
                    <h4>Description</h4>
                    <p>{activeRecipe.description}</p>
                  </div>

                  {/* Ingredients */}
                  <div className="ingredients-box">
                    <h4>Volumetric Recipe</h4>
                    <div className="ingredients-list">
                      {activeRecipe.ingredients.map((ing, idx) => (
                        <div key={idx} className="ingredient-item">
                          <div>
                            <span className="ing-name">{ing.name}</span>
                            <span className="ing-type">{ing.type}</span>
                          </div>
                          <strong className="ing-amount">{ing.amount}</strong>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Screen Sticky Bottom Actions */}
            <div className="phone-screen-footer">
              <button className="watch-tutorial-btn" onClick={() => setShowVideoModal(true)}>
                <Play size={10} fill="currentColor" />
                Watch Tutorial
              </button>
              <button className="brew-now-btn" onClick={handleBrewAndCart}>
                <ShoppingBag size={14} />
                <span>Brew & Cart</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Lightweight Local Video Modal */}
      <AnimatePresence>
        {showVideoModal && (
          <div className="local-modal-overlay" onClick={() => setShowVideoModal(false)}>
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="local-modal-card"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modal-header">
                <h3>{activeRecipe.name} — Crafting Video</h3>
                <button className="close-modal-btn" onClick={() => setShowVideoModal(false)}>×</button>
              </div>
              <div className="video-player-container">
                <div className="mock-video-player">
                  <div className="player-overlay">
                    <Play size={44} className="play-icon-glow" />
                    <span>Barista Volumetric Demonstration</span>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <p>Learn to aerate and frothed standard standard milk cup configurations at home using premium measured pourers.</p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default RecipeDiscoverer;
