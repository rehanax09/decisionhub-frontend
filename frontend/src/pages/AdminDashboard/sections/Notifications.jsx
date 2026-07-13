import React, { useState } from 'react';
import { Send, Bell, Users, Globe } from 'lucide-react';

const COMMUNITIES = ['All Users', 'Tech Innovators', 'Finance Wizards', 'AI Enthusiasts', 'Career Launchers', 'Startup Founders'];

const Notifications = () => {
  const [title,   setTitle]   = useState('');
  const [message, setMessage] = useState('');
  const [target,  setTarget]  = useState('All Users');
  const [sent,    setSent]    = useState([]);
  const [sending, setSending] = useState(false);

  const handleSend = async () => {
    if (!title.trim() || !message.trim()) { alert('Please fill in both title and message.'); return; }
    setSending(true);
    await new Promise(r => setTimeout(r, 800));
    setSent(prev => [{ id: Date.now(), title, message, target, time: new Date().toLocaleTimeString() }, ...prev]);
    setTitle(''); setMessage('');
    setSending(false);
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '28px', alignItems: 'start' }}>

      {/* Compose Panel */}
      <div className="glass-panel" style={{ padding: '28px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <h3 style={{ margin: 0, fontFamily: 'Outfit', fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Bell color="var(--neon-cyan)" size={20} /> Send Announcement
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: '500' }}>Target Audience</label>
          <select value={target} onChange={e => setTarget(e.target.value)}
            style={{ padding: '10px 14px', borderRadius: '10px', border: '1px solid var(--glass-border)', background: 'var(--input-bg)', color: 'var(--text-primary)', outline: 'none', fontSize: '0.9rem' }}>
            {COMMUNITIES.map(c => <option key={c} value={c}>{c === 'All Users' ? '🌐 All Users' : `👥 ${c}`}</option>)}
          </select>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: '500' }}>Announcement Title</label>
          <input value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. Platform Maintenance on July 15"
            style={{ padding: '10px 14px', borderRadius: '10px', border: '1px solid var(--glass-border)', background: 'var(--input-bg)', color: 'var(--text-primary)', outline: 'none', fontSize: '0.9rem' }}
            onFocus={e => e.target.style.border = '1px solid var(--neon-cyan)'}
            onBlur={e  => e.target.style.border = '1px solid var(--glass-border)'} />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: '500' }}>Message</label>
          <textarea value={message} onChange={e => setMessage(e.target.value)} rows={5}
            placeholder="Write your announcement message here…"
            style={{ padding: '10px 14px', borderRadius: '10px', border: '1px solid var(--glass-border)', background: 'var(--input-bg)', color: 'var(--text-primary)', outline: 'none', resize: 'vertical', fontSize: '0.9rem', fontFamily: 'inherit' }}
            onFocus={e => e.target.style.border = '1px solid var(--neon-cyan)'}
            onBlur={e  => e.target.style.border = '1px solid var(--glass-border)'} />
        </div>

        <button onClick={handleSend} disabled={sending}
          className="btn-primary"
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', padding: '14px', boxShadow: 'var(--glow-cyan)', opacity: sending ? 0.7 : 1 }}>
          <Send size={18} /> {sending ? 'Sending…' : 'Send Announcement'}
        </button>
      </div>

      {/* Sent History */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <h3 style={{ margin: 0, fontFamily: 'Outfit', fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Globe color="var(--neon-cyan)" size={20} /> Sent History
        </h3>
        {sent.length === 0 ? (
          <div className="glass-panel" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)' }}>
            <Bell size={36} style={{ opacity: 0.3, marginBottom: '12px' }} />
            <p style={{ margin: 0 }}>No announcements sent yet.</p>
          </div>
        ) : (
          sent.map(s => (
            <div key={s.id} className="glass-panel" style={{ padding: '18px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: '600' }}>{s.title}</h4>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{s.time}</span>
              </div>
              <p style={{ margin: '0 0 8px 0', fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>{s.message}</p>
              <span style={{ fontSize: '0.75rem', padding: '2px 10px', borderRadius: '20px', background: 'rgba(0,245,255,0.1)', color: 'var(--neon-cyan)', border: '1px solid rgba(0,245,255,0.2)' }}>
                → {s.target}
              </span>
            </div>
          ))
        )}
      </div>

    </div>
  );
};

export default Notifications;
