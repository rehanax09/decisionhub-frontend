import React from 'react';
import { AlertTriangle, Trash2 } from 'lucide-react';

const ConfirmModal = ({ 
  isOpen, 
  title, 
  message, 
  onConfirm, 
  onCancel, 
  confirmText = "Confirm", 
  cancelText = "Cancel", 
  type = "warning" 
}) => {
  if (!isOpen) return null;

  const isDestructive = type === 'destructive';

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      background: 'rgba(0, 0, 0, 0.75)',
      backdropFilter: 'blur(8px)',
      zIndex: 100000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div 
        className="glass-panel modal-animate" 
        style={{
          width: '100%',
          maxWidth: '400px',
          padding: '30px',
          borderRadius: '16px',
          boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.5)',
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '16px'
        }}
      >
        <div style={{
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          background: 'rgba(255,255,255,0.03)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: '1px solid var(--glass-border)',
          marginBottom: '8px'
        }}>
          {isDestructive ? (
            <Trash2 size={24} color="var(--neon-pink)" style={{ filter: 'drop-shadow(0 0 5px rgba(255,0,255,0.4))' }} />
          ) : (
            <AlertTriangle size={24} color="var(--neon-cyan)" style={{ filter: 'drop-shadow(0 0 5px rgba(0,245,255,0.4))' }} />
          )}
        </div>

        <h3 style={{ margin: 0, fontFamily: 'Outfit', fontSize: '1.4rem', color: 'var(--text-primary)' }}>{title}</h3>
        <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: '1.5' }}>{message}</p>

        <div style={{ display: 'flex', gap: '12px', width: '100%', marginTop: '12px' }}>
          <button 
            type="button"
            onClick={onCancel}
            className="btn-secondary"
            style={{ 
              flex: 1, 
              height: '40px', 
              borderRadius: '8px', 
              fontSize: '0.9rem',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid var(--glass-border)',
              color: 'var(--text-secondary)',
              cursor: 'pointer',
              fontWeight: '500'
            }}
          >
            {cancelText}
          </button>
          
          <button 
            type="button"
            onClick={onConfirm}
            className={isDestructive ? 'btn-destructive' : 'btn-primary'}
            style={{ 
              flex: 1, 
              height: '40px', 
              borderRadius: '8px', 
              fontSize: '0.9rem',
              cursor: 'pointer',
              fontWeight: '600'
            }}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
