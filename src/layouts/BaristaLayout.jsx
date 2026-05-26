import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useOrderStore } from '../store/useOrderStore';
import './BaristaLayout.css';

const BaristaLayout = () => {
  const baristaOrders = useOrderStore((state) => state.baristaOrders);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const navigate = useNavigate();

  const activeCount = baristaOrders.filter(
    (o) => o.status === 'Pending' || o.status === 'In Progress'
  ).length;

  return (
    <div className="barista-layout">
      {/* KDS Header Bar */}
      <header className="kds-header">
        <div className="kds-brand">
          <span className="kds-logo">☕</span>
          <h1>KDS Terminal</h1>
          <span className="station-badge">Station #1 - Espresso Bar</span>
        </div>

        <nav className="kds-nav">
          <NavLink to="/barista" end className={({ isActive }) => `kds-nav-link ${isActive ? 'active' : ''}`}>
            📥 Queue <span className="kds-badge">{activeCount}</span>
          </NavLink>
          <NavLink to="/barista/active" className={({ isActive }) => `kds-nav-link ${isActive ? 'active' : ''}`}>
            👨‍🍳 Active Prep
          </NavLink>
          <NavLink to="/barista/completed" className={({ isActive }) => `kds-nav-link ${isActive ? 'active' : ''}`}>
            ✅ Completed
          </NavLink>
          <NavLink to="/barista/delayed" className={({ isActive }) => `kds-nav-link ${isActive ? 'active' : ''}`}>
            🚨 Delayed
          </NavLink>
          <NavLink to="/barista/performance" className={({ isActive }) => `kds-nav-link ${isActive ? 'active' : ''}`}>
            📈 Speed stats
          </NavLink>
        </nav>

        <div className="kds-actions">
          <button 
            onClick={() => setSoundEnabled(!soundEnabled)} 
            className={`sound-toggle ${soundEnabled ? 'sound-on' : 'sound-off'}`}
            title={soundEnabled ? 'Mute Alert Sound' : 'Unmute Alert Sound'}
          >
            {soundEnabled ? '🔊 Sound On' : '🔇 Muted'}
          </button>
          
          <button onClick={() => navigate('/')} className="kds-exit-btn">
            🚪 Exit KDS
          </button>
        </div>
      </header>

      {/* Main KDS Board Workspace */}
      <main className="kds-workspace">
        <Outlet context={{ soundEnabled }} />
      </main>
    </div>
  );
};

export default BaristaLayout;
