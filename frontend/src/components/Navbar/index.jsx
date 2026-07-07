import React, { useState, useEffect } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { Search, Bell, User, Sun, Moon } from 'lucide-react';

const Navbar = ({ isDashboard, isCollapsed }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };
  
  if (location.pathname === '/login' || location.pathname === '/register') {
    return (
      <nav style={{ position: 'fixed', top: 0, width: '100%', padding: '20px', zIndex: 1000, display: 'flex', justifyContent: 'center' }}>
        <Link to="/" style={{ fontSize: '1.5rem', fontWeight: 'bold', fontFamily: 'Outfit', textDecoration: 'none' }} className="text-gradient">
          DECISION_HUB
        </Link>
      </nav>
    );
  }

  if (isDashboard) {
    return (
      <nav style={{
        height: '80px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 40px',
        background: 'var(--nav-bg)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid var(--glass-border)',
        position: 'fixed',
        top: 0,
        right: 0,
        left: isCollapsed ? '80px' : '250px',
        transition: 'left 0.3s ease',
        zIndex: 90
      }}>
        <div style={{ flex: 1 }}></div>
        <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
          <button onClick={toggleTheme} style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', display: 'flex', alignItems: 'center' }} title="Toggle Theme">
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          <div style={{ position: 'relative' }}>
            <Search size={20} style={{ position: 'absolute', left: 10, top: 10, color: 'var(--text-secondary)' }} />
            <input 
              type="text" 
              placeholder="Search grid..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && searchQuery.trim()) {
                  navigate(`/decision-board?search=${encodeURIComponent(searchQuery.trim())}`);
                }
              }}
              style={{
                background: 'var(--panel-bg)',
                border: '1px solid var(--glass-border)',
                borderRadius: '20px',
                padding: '10px 16px 10px 40px',
                color: 'var(--text-primary)',
                outline: 'none',
                width: '250px'
              }} 
            />
          </div>
          <Link to="/notifications" style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
            <Bell size={24} />
          </Link>
          <Link to="/profile" style={{ background: 'transparent', border: 'none', color: 'var(--neon-cyan)', cursor: 'pointer' }}>
            <User size={24} />
          </Link>
        </div>
      </nav>
    );
  }

  // Public Landing Navbar
  return (
    <nav style={{ 
      position: 'fixed', 
      top: 0, 
      width: '100%', 
      height: '80px',
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'space-between',
      padding: '0 40px',
      zIndex: 1000,
      background: 'var(--nav-bg)',
      backdropFilter: 'blur(12px)',
      borderBottom: '1px solid var(--glass-border)'
    }}>
      {/* Left: Logo */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center' }}>
        <Link to="/" style={{ fontSize: '1.5rem', fontWeight: 'bold', fontFamily: 'Outfit', textDecoration: 'none' }} className="text-gradient">
          DECISION_HUB
        </Link>
      </div>
      
      {/* Middle: Links */}
      <div style={{ display: 'flex', gap: '10px', alignItems: 'center', justifyContent: 'center' }}>
        <NavLink to="/dashboard" className="nav-link">Dashboard</NavLink>
        <NavLink to="/decision-board" className="nav-link">Decisions</NavLink>
        <NavLink to="/polls" className="nav-link">Polls</NavLink>
        <NavLink to="/communities" className="nav-link">Communities</NavLink>
        <NavLink to="/analytics" className="nav-link">Analytics</NavLink>
        <NavLink to="/reports" className="nav-link">Reports</NavLink>
      </div>
      
      {/* Right: Actions */}
      <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end', gap: '16px', alignItems: 'center' }}>
        <button onClick={toggleTheme} style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', display: 'flex', alignItems: 'center' }} title="Toggle Theme">
          {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
        </button>
        <Link to="/login" className="btn-secondary" style={{ padding: '8px 24px', fontSize: '0.9rem', borderRadius: '20px' }}>
          Login / Profile
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
