import React, { useState } from 'react';
import { AlertTriangle, Trash2, ShieldOff, AlertOctagon } from 'lucide-react';

const MOCK_REPORTS = [
  { id: 1, type: 'Board',   title: 'Crypto Scam Discussion',     reason: 'Spam / Phishing link',      reporter: 'alex@example.com',  date: 'Jul 9, 2026'  },
  { id: 2, type: 'Poll',    title: 'Hateful Election Poll',       reason: 'Hate speech in options',    reporter: 'sarah@example.com', date: 'Jul 8, 2026'  },
  { id: 3, type: 'User',    title: 'spammer@example.com',         reason: 'Repeated spam posting',     reporter: 'dpark@example.com', date: 'Jul 7, 2026'  },
  { id: 4, type: 'Board',   title: 'Misleading Financial Advice', reason: 'Misinformation',            reporter: 'priya@example.com', date: 'Jul 6, 2026'  },
];

const typeColors = { Board: 'var(--neon-cyan)', Poll: 'var(--accent-purple)', User: 'var(--neon-pink)' };

const Moderation = () => {
  const [reports, setReports] = useState(MOCK_REPORTS);
  const [filter, setFilter]   = useState('ALL');

  const dismiss = (id) => setReports(r => r.filter(x => x.id !== id));
  const warn    = (id) => { alert('Warning sent to the reported user/content owner.'); dismiss(id); };
  const ban     = (id) => { if (window.confirm('Ban this user/content permanently?')) dismiss(id); };

  const filtered = filter === 'ALL' ? reports : reports.filter(r => r.type === filter);

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '20px', marginBottom: '28px' }}>
        {[
          { label: 'Total Reports', value: reports.length,                                   color: 'var(--neon-pink)'    },
          { label: 'Board Reports', value: reports.filter(r => r.type === 'Board').length,   color: 'var(--neon-cyan)'    },
          { label: 'User Reports',  value: reports.filter(r => r.type === 'User').length,    color: 'var(--accent-purple)'},
        ].map((s, i) => (
          <div key={i} className="glass-panel" style={{ padding: '20px' }}>
            <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.82rem' }}>{s.label}</p>
            <h3 style={{ margin: '4px 0 0 0', fontSize: '2rem', fontFamily: 'Outfit', color: s.color }}>{s.value}</h3>
          </div>
        ))}
      </div>

      {/* Filter tabs */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '20px' }}>
        {['ALL','Board','Poll','User'].map(f => (
          <button key={f} onClick={() => setFilter(f)}
            style={{ padding: '8px 18px', borderRadius: '20px', border: '1px solid var(--glass-border)', background: filter === f ? 'var(--neon-cyan)' : 'transparent', color: filter === f ? 'var(--bg-primary)' : 'var(--text-secondary)', cursor: 'pointer', fontSize: '0.82rem', fontWeight: filter === f ? '700' : '400', transition: 'all 0.2s' }}>
            {f}
          </button>
        ))}
      </div>

      {/* Report Cards */}
      {filtered.length === 0 ? (
        <div className="glass-panel" style={{ padding: '60px', textAlign: 'center', color: 'var(--text-secondary)' }}>
          <AlertTriangle size={40} style={{ opacity: 0.3, marginBottom: '12px' }} />
          <p>No reports in this category.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {filtered.map(r => (
            <div key={r.id} className="glass-panel" style={{ padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '20px' }}>
              <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flex: 1 }}>
                <div style={{ padding: '10px', borderRadius: '10px', background: `${typeColors[r.type]}20`, flexShrink: 0 }}>
                  <AlertTriangle color={typeColors[r.type]} size={20} />
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                    <span style={{ padding: '2px 8px', borderRadius: '12px', fontSize: '0.7rem', fontWeight: 'bold', background: `${typeColors[r.type]}20`, color: typeColors[r.type], border: `1px solid ${typeColors[r.type]}40` }}>{r.type}</span>
                    <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: '600' }}>{r.title}</h4>
                  </div>
                  <p style={{ margin: 0, fontSize: '0.82rem', color: 'var(--neon-pink)' }}>Reason: {r.reason}</p>
                  <p style={{ margin: '2px 0 0 0', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Reported by {r.reporter} · {r.date}</p>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
                <button onClick={() => dismiss(r.id)} style={{ padding: '7px 14px', borderRadius: '8px', border: '1px solid rgba(0,255,153,0.3)', background: 'transparent', color: 'var(--success)', cursor: 'pointer', fontSize: '0.8rem' }}>Dismiss</button>
                <button onClick={() => warn(r.id)}    style={{ padding: '7px', borderRadius: '8px', border: '1px solid rgba(255,165,0,0.3)', background: 'transparent', color: '#FF9500', cursor: 'pointer', display: 'flex', alignItems: 'center' }} title="Warn"><AlertOctagon size={15}/></button>
                <button onClick={() => ban(r.id)}     style={{ padding: '7px', borderRadius: '8px', border: '1px solid rgba(255,0,0,0.3)',   background: 'transparent', color: '#ff4444', cursor: 'pointer', display: 'flex', alignItems: 'center' }} title="Ban"><ShieldOff size={15}/></button>
                <button onClick={() => dismiss(r.id)} style={{ padding: '7px', borderRadius: '8px', border: '1px solid rgba(255,0,0,0.3)',   background: 'transparent', color: '#ff4444', cursor: 'pointer', display: 'flex', alignItems: 'center' }} title="Delete Content"><Trash2 size={15}/></button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Moderation;
