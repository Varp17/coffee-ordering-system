import React, { useState, useEffect } from 'react'
import Home from './pages/d2c/Home/Home'
import Catalog from './pages/d2c/Catalog/Catalog'
import Cart from './pages/d2c/Cart/Cart'
import Profile from './pages/d2c/Profile/Profile'
import Checkout from './pages/d2c/Cart/Checkout'
import Login from './pages/admin/Login/Login'
import Layout from './pages/admin/Layout/Layout'
import OrderQueue from './pages/barista/OrderQueue/OrderQueue'
import KioskHome from './pages/kiosk/Home/Home'
import KioskCatalog from './pages/kiosk/Catalog/Catalog'
import KioskLogin from './pages/kiosk/Login/Login'
import KioskQrOrder from './pages/kiosk/QrOrder/QrOrder'
import KioskCustomDrink from './pages/kiosk/CustomDrink/CustomDrink'
import KioskCheckout from './pages/kiosk/Checkout/Checkout' // Import Kiosk Checkout

function App() {
  // Detect app mode from URL path
  const getAppModeFromUrl = () => {
    const path = window.location.pathname;
    if (path.startsWith('/admin')) return 'admin';
    if (path.startsWith('/barista')) return 'barista';
    if (path.startsWith('/kiosk')) return 'kiosk';
    return 'd2c';
  };

  const appMode = getAppModeFromUrl();

  // Set document title based on mode
  useEffect(() => {
    if (appMode === 'admin') document.title = 'Admin Dashboard';
    else if (appMode === 'barista') document.title = 'Barista Interface';
    else if (appMode === 'kiosk') document.title = 'Kiosk Interface';
    else document.title = 'Vasify Coffee - D2C';
  }, [appMode]);
  
  // Set initial page based on mode
  const getInitialPage = () => {
    if (appMode === 'admin') return 'admin-login';
    if (appMode === 'barista') return 'barista';
    if (appMode === 'kiosk') return 'kiosk';
    return 'home'; // Default D2C
  };

  const [currentPage, setCurrentPage] = useState(getInitialPage());
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  
  // Kiosk Cart State
  const [kioskCart, setKioskCart] = useState([]);
  const [kioskTotal, setKioskTotal] = useState(0);

  // Determine if we should show the main nav
  const shouldShowNav = !appMode || appMode === 'd2c';
  
  // Hide nav for specific pages
  const hideNavPages = ['admin-dashboard', 'kiosk', 'kiosk-catalog', 'kiosk-login', 'kiosk-qr', 'kiosk-custom', 'kiosk-checkout'];
  const isNavHidden = hideNavPages.includes(currentPage);

  return (
    <>
      {/* Navigation Bar */}
      {shouldShowNav && !isNavHidden && (
        <nav className="d2c-nav">
          <button 
            onClick={() => setCurrentPage('home')} 
            className={`d2c-nav-btn ${currentPage === 'home' ? 'active' : ''}`}
          >
            Home
          </button>
          <button 
            onClick={() => setCurrentPage('catalog')} 
            className={`d2c-nav-btn ${currentPage === 'catalog' ? 'active' : ''}`}
          >
            Catalog
          </button>
          <button 
            onClick={() => setCurrentPage('cart')} 
            className={`d2c-nav-btn ${currentPage === 'cart' || currentPage === 'checkout' ? 'active' : ''}`}
          >
            Cart
          </button>
          <button 
            onClick={() => setCurrentPage('profile')} 
            className={`d2c-nav-btn ${currentPage === 'profile' ? 'active' : ''}`}
          >
            Profile
          </button>
        </nav>
      )}

      {currentPage === 'home' && <Home />}
      {currentPage === 'catalog' && <Catalog />}
      {currentPage === 'cart' && <Cart onProceedToCheckout={() => setCurrentPage('checkout')} />}
      {currentPage === 'profile' && <Profile />}
      {currentPage === 'checkout' && <Checkout onBackToCart={() => setCurrentPage('cart')} />}
      {currentPage === 'barista' && <OrderQueue />}
      
      {/* Kiosk Flow */}
      {currentPage === 'kiosk' && (
        <KioskHome 
          onStart={() => setCurrentPage('kiosk-catalog')} 
          onQrScan={() => setCurrentPage('kiosk-qr')}
        />
      )}
      {currentPage === 'kiosk-catalog' && (
        <KioskCatalog 
          onBack={() => setCurrentPage('kiosk')} 
          onLogin={() => setCurrentPage('kiosk-login')}
          onCreateCustom={() => setCurrentPage('kiosk-custom')}
          onCheckout={(cart, total) => {
            setKioskCart(cart);
            setKioskTotal(total);
            setCurrentPage('kiosk-checkout');
          }}
        />
      )}
      {currentPage === 'kiosk-login' && (
        <KioskLogin 
          onLogin={(mobile) => {
            alert(`Logged in with ${mobile}`);
            setCurrentPage('kiosk-catalog');
          }} 
          onBack={() => setCurrentPage('kiosk-catalog')}
        />
      )}
      {currentPage === 'kiosk-qr' && (
        <KioskQrOrder onBack={() => setCurrentPage('kiosk')} />
      )}
      {currentPage === 'kiosk-custom' && (
        <KioskCustomDrink 
          onBack={() => setCurrentPage('kiosk-catalog')} 
          onAddToCart={(drink) => {
            setKioskCart([...kioskCart, drink]);
            setKioskTotal(kioskTotal + drink.price);
            setCurrentPage('kiosk-catalog');
          }}
        />
      )}
      {currentPage === 'kiosk-checkout' && (
        <KioskCheckout 
          cart={kioskCart}
          total={kioskTotal}
          onBack={() => setCurrentPage('kiosk-catalog')} 
          onComplete={() => {
            setKioskCart([]);
            setKioskTotal(0);
            setCurrentPage('kiosk');
          }}
        />
      )}

      {/* Admin Flow */}
      {currentPage === 'admin-login' && (
        <Login onLogin={() => {
          setIsAdminLoggedIn(true);
          setCurrentPage('admin-dashboard');
        }} />
      )}
      {currentPage === 'admin-dashboard' && isAdminLoggedIn && <Layout />}
    </>
  )
}

export default App
