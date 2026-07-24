import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react';

const ToastContext = createContext(null);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type, isExiting: false }]);

    // Trigger exit animation after 3.7 seconds
    setTimeout(() => {
      setToasts(prev =>
        prev.map(t => (t.id === id ? { ...t, isExiting: true } : t))
      );
    }, 3700);

    // Remove toast completely after 4.0 seconds
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prev =>
      prev.map(t => (t.id === id ? { ...t, isExiting: true } : t))
    );
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 300);
  }, []);

  // Map icon and styles based on toast type
  const getToastDetails = (type) => {
    switch (type) {
      case 'error':
        return {
          icon: <XCircle size={18} color="var(--neon-pink)" />,
          borderLeft: '4px solid var(--neon-pink)',
          shadow: '0 0 10px rgba(255, 0, 255, 0.2)'
        };
      case 'warning':
        return {
          icon: <AlertTriangle size={18} color="#FF8C00" />,
          borderLeft: '4px solid #FF8C00',
          shadow: '0 0 10px rgba(255, 140, 0, 0.2)'
        };
      case 'info':
        return {
          icon: <Info size={18} color="var(--neon-cyan)" />,
          borderLeft: '4px solid var(--neon-cyan)',
          shadow: '0 0 10px rgba(0, 245, 255, 0.2)'
        };
      case 'success':
      default:
        return {
          icon: <CheckCircle size={18} color="#00FF99" />,
          borderLeft: '4px solid #00FF99',
          shadow: '0 0 10px rgba(0, 255, 153, 0.2)'
        };
    }
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      
      {/* Toast Portal Container */}
      <div style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        zIndex: 99999,
        display: 'flex',
        flexDirection: 'column-reverse',
        gap: '12px',
        maxWidth: '350px',
        width: '100%',
        pointerEvents: 'none'
      }}>
        {toasts.map(t => {
          const details = getToastDetails(t.type);
          return (
            <div
              key={t.id}
              className={t.isExiting ? 'toast-exit' : 'toast-enter'}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '14px 18px',
                background: 'rgba(15, 15, 15, 0.85)',
                backdropFilter: 'blur(12px)',
                border: '1px solid var(--glass-border)',
                borderLeft: details.borderLeft,
                borderRadius: '8px',
                boxShadow: `0 8px 32px 0 rgba(0, 0, 0, 0.37), ${details.shadow}`,
                color: 'var(--text-primary)',
                fontFamily: 'Outfit, sans-serif',
                fontSize: '0.92rem',
                pointerEvents: 'auto',
                transition: 'all 0.3s ease'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1 }}>
                {details.icon}
                <span style={{ lineHeight: '1.4', fontWeight: '500' }}>{t.message}</span>
              </div>
              <button
                onClick={() => removeToast(t.id)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--text-secondary)',
                  cursor: 'pointer',
                  padding: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  marginLeft: '12px',
                  transition: 'color 0.2s'
                }}
                onMouseEnter={e => e.currentTarget.style.color = 'var(--text-primary)'}
                onMouseLeave={e => e.currentTarget.style.color = 'var(--text-secondary)'}
              >
                <X size={14} />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
};
