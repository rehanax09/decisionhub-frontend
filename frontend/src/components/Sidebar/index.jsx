import React from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  CheckSquare, 
  BarChart2, 
  Users, 
  TrendingUp, 
  FileText, 
  Bell, 
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

const LogoIcon = () => (
  <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="cube_top" x1="-16" y1="-2" x2="16" y2="-2" gradientUnits="userSpaceOnUse">
        <stop stopColor="#00F5FF" />
        <stop offset="1" stopColor="#FF00FF" />
      </linearGradient>
      <linearGradient id="cube_left" x1="-16" y1="-2" x2="0" y2="18" gradientUnits="userSpaceOnUse">
        <stop stopColor="#00F5FF" />
        <stop offset="1" stopColor="rgba(0, 245, 255, 0)" />
      </linearGradient>
      <linearGradient id="cube_right" x1="16" y1="-2" x2="0" y2="18" gradientUnits="userSpaceOnUse">
        <stop stopColor="#FF00FF" />
        <stop offset="1" stopColor="rgba(255, 0, 255, 0)" />
      </linearGradient>
      <filter id="core_glow" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
        <feMerge>
          <feMergeNode in="coloredBlur"/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
    </defs>

    <g transform="translate(20, 22)">
      {/* Left Face */}
      <path d="M -16 -2 L 0 6 L 0 18 L -16 10 Z" fill="url(#cube_left)" fillOpacity="0.8" stroke="#00F5FF" strokeWidth="0.5" strokeOpacity="0.5" />
      {/* Right Face */}
      <path d="M 0 6 L 16 -2 L 16 10 L 0 18 Z" fill="url(#cube_right)" fillOpacity="0.8" stroke="#FF00FF" strokeWidth="0.5" strokeOpacity="0.5" />
      {/* Top Face */}
      <path d="M 0 -10 L 16 -2 L 0 6 L -16 -2 Z" fill="url(#cube_top)" fillOpacity="0.9" stroke="#FFFFFF" strokeWidth="0.5" strokeOpacity="0.8" />
    </g>
    
    {/* Floating Data Core */}
    <circle cx="20" cy="6" r="3" fill="#FFFFFF" filter="url(#core_glow)" />
    <circle cx="20" cy="6" r="2" fill="#00F5FF" />
  </svg>
);

const Sidebar = ({ isCollapsed, setIsCollapsed }) => {
  const navigate = useNavigate();
  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Decision Boards', path: '/decision-board', icon: CheckSquare },
    { name: 'Polls', path: '/polls', icon: BarChart2 },
    { name: 'Communities', path: '/communities', icon: Users },
    { name: 'Analytics', path: '/analytics', icon: TrendingUp },
    { name: 'Reports', path: '/reports', icon: FileText },
    { name: 'Notifications', path: '/notifications', icon: Bell },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  return (
    <div style={{
      width: isCollapsed ? '80px' : '250px',
      transition: 'width 0.3s ease',
      height: '100vh',
      position: 'fixed',
      left: 0,
      top: 0,
      background: 'var(--nav-bg-solid)',
      borderRight: '1px solid var(--glass-border)',
      padding: '24px 0',
      display: 'flex',
      flexDirection: 'column',
      zIndex: 100
    }}>
      <div style={{ 
        padding: isCollapsed ? '0' : '0 24px', 
        marginBottom: '40px', 
        display: 'flex', 
        flexDirection: isCollapsed ? 'column' : 'row',
        alignItems: 'center', 
        justifyContent: isCollapsed ? 'center' : 'space-between',
        gap: isCollapsed ? '15px' : '0'
      }}>
        <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px' }}>
          {isCollapsed && <LogoIcon />}
          {!isCollapsed && (
            <h2 className="text-gradient" style={{ fontFamily: 'Outfit', fontSize: '1.4rem', margin: 0, letterSpacing: '0.5px' }}>
              DECISION_HUB
            </h2>
          )}
        </Link>
        <button 
          onClick={() => setIsCollapsed(!isCollapsed)} 
          style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
        >
          {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>

      <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px', padding: '0 12px' }}>
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            title={isCollapsed ? item.name : undefined}
            style={({ isActive }) => ({
              display: 'flex',
              alignItems: 'center',
              justifyContent: isCollapsed ? 'center' : 'flex-start',
              gap: isCollapsed ? '0' : '12px',
              padding: isCollapsed ? '12px' : '12px 16px',
              borderRadius: '8px',
              color: isActive ? 'var(--neon-cyan)' : 'var(--text-secondary)',
              background: isActive ? 'rgba(0, 245, 255, 0.1)' : 'transparent',
              textDecoration: 'none',
              transition: 'all 0.2s',
              fontWeight: isActive ? '600' : '400',
            })}
          >
            <item.icon size={20} />
            {!isCollapsed && <span>{item.name}</span>}
          </NavLink>
        ))}
      </nav>

      <div style={{ padding: '0 12px', marginTop: 'auto' }}>
        <button 
          onClick={() => navigate('/login')}
          title={isCollapsed ? "Logout" : undefined}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: isCollapsed ? 'center' : 'flex-start',
            gap: isCollapsed ? '0' : '12px',
            padding: isCollapsed ? '12px' : '12px 16px',
            borderRadius: '8px',
            color: 'var(--neon-pink)',
            background: 'transparent',
            border: '1px solid rgba(255, 0, 255, 0.3)',
            width: '100%',
            cursor: 'pointer',
            transition: 'all 0.2s',
            fontFamily: 'Inter, sans-serif',
            fontSize: '1rem'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(255, 0, 255, 0.1)';
            e.currentTarget.style.boxShadow = 'var(--glow-pink)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'transparent';
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          <LogOut size={20} />
          {!isCollapsed && <span>Logout</span>}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
