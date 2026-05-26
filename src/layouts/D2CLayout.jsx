import React, { useState, useEffect, useCallback } from 'react';
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import { useCartStore } from '../store/useCartStore';
import { useAuthStore } from '../store/useAuthStore';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Coffee,
  ShoppingBag,
  User,
  Home,
  BookOpen,
  Menu,
  X,
  Heart,
  ChevronDown,
  Package,
  MapPin,
  Mail,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

const Instagram = ({ size = 24, ...props }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

const Twitter = ({ size = 24, ...props }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
  </svg>
);
import './D2CLayout.css';

const D2CLayout = () => {
  const cartItems = useCartStore((state) => state.items);
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const location = useLocation();

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Shrink header on scroll
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  // Prevent body scroll when drawer is open
  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileMenuOpen]);

  const navLinks = [
    { to: '/', label: 'Home', icon: Home, end: true },
    { to: '/catalog', label: 'Menu', icon: BookOpen },
    { to: '/collections', label: 'Collections', icon: Sparkles },
    { to: '/subscription', label: 'Plans', icon: Package },
  ];

  return (
    <div className="d2c-layout">
      {/* ─── Announcement Bar ─── */}
      <div className="announcement-bar">
        <div className="announcement-content">
          <span className="announcement-sparkle">✦</span>
          Free shipping on orders over ₹999
          <span className="announcement-divider">|</span>
          Use code <strong>WELCOME20</strong> for 20% off your first order
          <span className="announcement-sparkle">✦</span>
        </div>
      </div>

      {/* ─── Header ─── */}
      <header className={`d2c-header ${scrolled ? 'header-scrolled' : ''}`}>
        <div className="header-container">
          {/* Logo */}
          <Link to="/" className="brand-logo">
            <div className="logo-mark">
              <Coffee size={20} strokeWidth={2.5} />
            </div>
            <span className="logo-text">Digital Coffee</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="desktop-nav" role="navigation" aria-label="Main navigation">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.end}
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          {/* Header Actions */}
          <div className="header-actions">
            <Link to="/cart" className="cart-trigger" aria-label={`Cart with ${cartCount} items`}>
              <ShoppingBag size={20} strokeWidth={2} />
              <AnimatePresence mode="wait">
                {cartCount > 0 && (
                  <motion.span
                    className="cart-badge"
                    key={cartCount}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 25 }}
                  >
                    {cartCount}
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>

            {user ? (
              <div className="user-profile-menu">
                <Link to="/profile" className="profile-btn">
                  <User size={16} strokeWidth={2.5} />
                  <span className="profile-name">{user.name.split(' ')[0]}</span>
                </Link>
                <button onClick={logout} className="logout-btn-header" title="Logout" aria-label="Logout">
                  <X size={14} />
                </button>
              </div>
            ) : (
              <Link to="/login" className="login-btn-header">
                Sign In
              </Link>
            )}

            {/* Mobile Hamburger */}
            <button
              className="mobile-menu-trigger"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </header>

      {/* ─── Mobile Drawer ─── */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              className="drawer-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setMobileMenuOpen(false)}
            />
            <motion.aside
              className="mobile-drawer"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            >
              <div className="drawer-header">
                <Link to="/" className="brand-logo" onClick={() => setMobileMenuOpen(false)}>
                  <div className="logo-mark"><Coffee size={18} strokeWidth={2.5} /></div>
                  <span className="logo-text">Digital Coffee</span>
                </Link>
                <button className="drawer-close" onClick={() => setMobileMenuOpen(false)} aria-label="Close menu">
                  <X size={20} />
                </button>
              </div>
              <nav className="drawer-nav">
                {navLinks.map((link) => (
                  <NavLink
                    key={link.to}
                    to={link.to}
                    end={link.end}
                    className={({ isActive }) => `drawer-link ${isActive ? 'active' : ''}`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <link.icon size={18} />
                    <span>{link.label}</span>
                  </NavLink>
                ))}
              </nav>
              <div className="drawer-footer">
                {user ? (
                  <Link to="/profile" className="drawer-profile" onClick={() => setMobileMenuOpen(false)}>
                    <User size={18} />
                    <span>{user.name}</span>
                  </Link>
                ) : (
                  <Link to="/login" className="drawer-login-btn" onClick={() => setMobileMenuOpen(false)}>
                    Sign In
                    <ArrowRight size={16} />
                  </Link>
                )}
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* ─── Main Content ─── */}
      <main className="d2c-main-content">
        <Outlet />
      </main>

      {/* ─── Footer ─── */}
      <footer className="d2c-footer">
        <div className="footer-main">
          <div className="footer-container">
            {/* Brand Column */}
            <div className="footer-brand">
              <div className="footer-logo">
                <div className="logo-mark logo-mark-light"><Coffee size={18} strokeWidth={2.5} /></div>
                <span className="footer-logo-text">Digital Coffee</span>
              </div>
              <p className="footer-tagline">
                Premium specialty coffee, slow-brewed concentrates, and artisanal gear. 
                Delivered fresh across Bengaluru.
              </p>
              <div className="footer-socials">
                <a href="#" className="social-link" aria-label="Instagram"><Instagram size={18} /></a>
                <a href="#" className="social-link" aria-label="Twitter"><Twitter size={18} /></a>
                <a href="#" className="social-link" aria-label="Email"><Mail size={18} /></a>
              </div>
            </div>

            {/* Links Columns */}
            <div className="footer-links-grid">
              <div className="link-group">
                <h4>Shop</h4>
                <Link to="/catalog">All Products</Link>
                <Link to="/collections">Collections</Link>
                <Link to="/subscription">Coffee Plans</Link>
              </div>
              <div className="link-group">
                <h4>Company</h4>
                <a href="#">About Us</a>
                <a href="#">Our Story</a>
                <a href="#">Careers</a>
              </div>
              <div className="link-group">
                <h4>Support</h4>
                <a href="#">Contact</a>
                <a href="#">Shipping</a>
                <a href="#">Returns</a>
                <a href="#">FAQ</a>
              </div>
              <div className="link-group">
                <h4>Platform</h4>
                <Link to="/kiosk">Self-Order Kiosk</Link>
                <Link to="/barista">Barista KDS</Link>
                <Link to="/admin">Admin Portal</Link>
              </div>
            </div>
          </div>

          {/* Newsletter */}
          <div className="footer-newsletter">
            <div className="newsletter-inner section-container">
              <div className="newsletter-text">
                <h4>Stay in the loop</h4>
                <p>Join 12,000+ coffee lovers. New arrivals, offers, and brewing tips.</p>
              </div>
              <form className="newsletter-form" onSubmit={(e) => e.preventDefault()}>
                <input
                  type="email"
                  placeholder="Your email address"
                  className="newsletter-input"
                  aria-label="Email for newsletter"
                />
                <button type="submit" className="newsletter-btn">
                  Subscribe
                  <ArrowRight size={14} />
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="footer-bottom">
          <div className="footer-bottom-inner section-container">
            <p>&copy; {new Date().getFullYear()} Digital Coffee Pvt. Ltd. All rights reserved.</p>
            <div className="footer-bottom-links">
              <a href="#">Privacy</a>
              <a href="#">Terms</a>
              <a href="#">Cookies</a>
            </div>
          </div>
        </div>
      </footer>

      {/* ─── Mobile Bottom Navigation ─── */}
      <nav className="mobile-bottom-nav" role="navigation" aria-label="Mobile navigation">
        <NavLink to="/" end className={({ isActive }) => `mob-nav-item ${isActive ? 'active' : ''}`}>
          <Home size={20} strokeWidth={2} />
          <span className="mob-text">Home</span>
        </NavLink>
        <NavLink to="/catalog" className={({ isActive }) => `mob-nav-item ${isActive ? 'active' : ''}`}>
          <BookOpen size={20} />
          <span className="mob-text">Menu</span>
        </NavLink>
        <NavLink to="/cart" className={({ isActive }) => `mob-nav-item ${isActive ? 'active' : ''}`}>
          <div className="mob-cart-wrap">
            <ShoppingBag size={20} />
            {cartCount > 0 && <span className="mob-badge">{cartCount}</span>}
          </div>
          <span className="mob-text">Cart</span>
        </NavLink>
        <NavLink to="/profile" className={({ isActive }) => `mob-nav-item ${isActive ? 'active' : ''}`}>
          <User size={20} />
          <span className="mob-text">Profile</span>
        </NavLink>
      </nav>
    </div>
  );
};

export default D2CLayout;
