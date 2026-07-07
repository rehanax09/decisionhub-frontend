import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      console.log('Login submitted:', { email, password });
    }, 1500);
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', padding: '20px' }}>
      <div className="glass-panel" style={{ width: '100%', maxWidth: '400px', padding: '40px', borderRadius: '24px' }}>
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <Link to="/" style={{ textDecoration: 'none' }}>
            <h2 className="text-gradient" style={{ fontSize: '2.5rem', marginBottom: '10px' }}>DecisionHub</h2>
          </Link>
          <p style={{ color: 'var(--text-secondary)' }}>Welcome back to the grid.</p>
        </div>
        
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label htmlFor="email" style={{ fontSize: '0.9rem', color: 'var(--text-primary)', fontWeight: '500' }}>Email</label>
            <input 
              type="email" 
              id="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              required 
              style={{ padding: '12px 16px', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'var(--input-bg)', color: 'var(--text-primary)', outline: 'none', transition: 'border 0.2s', width: '100%' }}
              onFocus={(e) => e.target.style.border = '1px solid var(--neon-cyan)'}
              onBlur={(e) => e.target.style.border = '1px solid var(--glass-border)'}
            />
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label htmlFor="password" style={{ fontSize: '0.9rem', color: 'var(--text-primary)', fontWeight: '500' }}>Password</label>
            <input 
              type="password" 
              id="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required 
              style={{ padding: '12px 16px', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'var(--input-bg)', color: 'var(--text-primary)', outline: 'none', transition: 'border 0.2s', width: '100%' }}
              onFocus={(e) => e.target.style.border = '1px solid var(--neon-cyan)'}
              onBlur={(e) => e.target.style.border = '1px solid var(--glass-border)'}
            />
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', color: 'var(--text-secondary)' }}>
              <input type="checkbox" style={{ accentColor: 'var(--neon-cyan)' }} />
              <span>Remember me</span>
            </label>
            <a href="#" style={{ color: 'var(--neon-pink)' }}>Forgot Password?</a>
          </div>

          <button 
            type="submit" 
            className="btn-primary"
            disabled={isSubmitting}
            style={{ width: '100%', marginTop: '10px', boxShadow: 'var(--glow-cyan)' }}
          >
            {isSubmitting ? 'Authenticating...' : 'Login'}
          </button>
          
          <div style={{ display: 'flex', alignItems: 'center', margin: '10px 0' }}>
            <div style={{ flex: 1, height: '1px', background: 'var(--glass-border)' }}></div>
            <span style={{ margin: '0 10px', color: 'var(--text-secondary)', fontSize: '0.8rem' }}>OR</span>
            <div style={{ flex: 1, height: '1px', background: 'var(--glass-border)' }}></div>
          </div>
          
          <button type="button" style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px',
            background: 'white',
            color: 'black',
            border: 'none',
            padding: '12px',
            borderRadius: '8px',
            fontFamily: 'Outfit',
            fontWeight: '600',
            cursor: 'pointer'
          }}>
            <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" style={{ width: '20px' }} />
            Continue with Google
          </button>
        </form>
        
        <div style={{ textAlign: 'center', marginTop: '24px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
          <p>Don't have an account? <Link to="/register" style={{ fontWeight: '600', color: 'var(--neon-cyan)' }}>Register</Link></p>
        </div>
      </div>
    </div>
  );
};

export default Login;
