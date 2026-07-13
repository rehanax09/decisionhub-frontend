import React, { useState } from 'react';
import { CheckSquare, Trash2, Lock, Edit3 } from 'lucide-react';

const MOCK = [
  { id: 1, title: 'MBA vs Corporate Job',        owner: 'alexc_dev', votes: 12400, status: 'OPEN',   created: 'Jun 1, 2026'  },
  { id: 2, title: 'Next.js vs Nuxt.js',          owner: 'sarah_j',   votes: 8900,  status: 'CLOSED', created: 'May 18, 2026' },
  { id: 3, title: 'MacBook M3 vs Dell XPS 15',   owner: 'dpark',     votes: 3420,  status: 'OPEN',   created: 'Jun 15, 2026' },
  { id: 4, title: 'Freelance vs Full-Time Job',   owner: 'priya_n',   votes: 5670,  status: 'OPEN',   created: 'Jun 20, 2026' },
  { id: 5, title: 'City Life vs Remote Village',  owner: 'admin',     votes: 2100,  status: 'CLOSED', created: 'Apr 30, 2026' },
];

const DecisionBoards = () => {
  const [boards, setBoards] = useState(MOCK);
  const [filter, setFilter] = useState('ALL');
  const [editingBoard, setEditingBoard] = useState(null);

  const closeBoard  = (id) => setBoards(b => b.map(x => x.id === id ? { ...x, status: 'CLOSED' } : x));
  const deleteBoard = (id) => { if (window.confirm('Delete this decision board?')) setBoards(b => b.filter(x => x.id !== id)); };

  const filtered = filter === 'ALL' ? boards : boards.filter(b => b.status === filter);

  return (
    <div>
      {/* Summary */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '20px', marginBottom: '28px' }}>
        {[
          { label: 'Total Boards', value: boards.length,                                   color: 'var(--neon-cyan)' },
          { label: 'Open',         value: boards.filter(b => b.status === 'OPEN').length,   color: 'var(--success)'   },
          { label: 'Closed',       value: boards.filter(b => b.status === 'CLOSED').length, color: 'var(--neon-pink)' },
        ].map((s, i) => (
          <div key={i} className="glass-panel" style={{ padding: '20px' }}>
            <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.82rem' }}>{s.label}</p>
            <h3 style={{ margin: '4px 0 0 0', fontSize: '2rem', fontFamily: 'Outfit', color: s.color }}>{s.value}</h3>
          </div>
        ))}
      </div>

      {/* Filter */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '20px' }}>
        {['ALL','OPEN','CLOSED'].map(f => (
          <button key={f} onClick={() => setFilter(f)}
            style={{ padding: '8px 18px', borderRadius: '20px', border: '1px solid var(--glass-border)', background: filter === f ? 'var(--neon-cyan)' : 'transparent', color: filter === f ? 'var(--bg-primary)' : 'var(--text-secondary)', cursor: 'pointer', fontSize: '0.82rem', fontWeight: filter === f ? '700' : '400', transition: 'all 0.2s' }}>
            {f}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="glass-panel" style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--glass-border)' }}>
              {['Board Title','Owner','Total Votes','Status','Created','Actions'].map((h, i) => (
                <th key={h} style={{ padding: '16px', textAlign: i === 5 ? 'right' : 'left', fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--text-secondary)', fontWeight: '600' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map(b => {
              const isClosed = b.status === 'CLOSED';
              return (
                <tr key={b.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                  <td style={{ padding: '14px 16px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(0,245,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <CheckSquare size={18} color="var(--neon-cyan)" />
                    </div>
                    {b.title}
                  </td>
                  <td style={{ padding: '14px 16px', color: 'var(--text-secondary)', fontSize: '0.88rem' }}>@{b.owner}</td>
                  <td style={{ padding: '14px 16px', color: 'var(--neon-cyan)', fontWeight: '600' }}>{b.votes.toLocaleString()}</td>
                  <td style={{ padding: '14px 16px' }}>
                    <span style={{ 
                      padding: '3px 10px', 
                      borderRadius: '20px', 
                      fontSize: '0.72rem', 
                      fontWeight: 'bold', 
                      background: isClosed ? 'rgba(255,0,0,0.1)' : 'rgba(0,255,153,0.1)', 
                      color: isClosed ? '#ff4444' : 'var(--success)', 
                      border: `1px solid ${isClosed ? 'rgba(255,0,0,0.3)' : 'rgba(0,255,153,0.3)'}` 
                    }}>
                      {b.status}
                    </span>
                  </td>
                  <td style={{ padding: '14px 16px', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{b.created}</td>
                  <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                      {!isClosed && (
                        <button onClick={() => closeBoard(b.id)} title="Close Board" style={{ padding: '6px', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'transparent', color: 'var(--neon-cyan)', cursor: 'pointer', display: 'flex' }}><Lock size={15}/></button>
                      )}
                      <button onClick={() => setEditingBoard(b)} title="Edit Details" style={{ padding: '6px', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'transparent', color: 'var(--neon-cyan)', cursor: 'pointer', display: 'flex' }}><Edit3 size={15}/></button>
                      <button onClick={() => deleteBoard(b.id)} title="Delete" style={{ padding: '6px', borderRadius: '8px', border: '1px solid rgba(255,0,0,0.3)', background: 'transparent', color: '#ff4444', cursor: 'pointer', display: 'flex' }}><Trash2 size={15}/></button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Edit Board Modal */}
      {editingBoard && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={() => setEditingBoard(null)}>
          <div className="glass-panel" style={{ padding: '36px', maxWidth: '440px', width: '100%', borderRadius: '20px' }} onClick={e => e.stopPropagation()}>
            <h3 style={{ margin: '0 0 20px 0', fontFamily: 'Outfit' }}>Edit Board Details</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', fontWeight: '500' }}>Board Title</label>
                <input 
                  type="text" 
                  value={editingBoard.title} 
                  onChange={e => setEditingBoard({ ...editingBoard, title: e.target.value })}
                  style={{ padding: '10px 14px', borderRadius: '10px', border: '1px solid var(--glass-border)', background: 'var(--input-bg)', color: 'var(--text-primary)', outline: 'none', fontSize: '0.9rem' }}
                />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', fontWeight: '500' }}>Owner Username</label>
                <input 
                  type="text" 
                  value={editingBoard.owner} 
                  onChange={e => setEditingBoard({ ...editingBoard, owner: e.target.value })}
                  style={{ padding: '10px 14px', borderRadius: '10px', border: '1px solid var(--glass-border)', background: 'var(--input-bg)', color: 'var(--text-primary)', outline: 'none', fontSize: '0.9rem' }}
                />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', fontWeight: '500' }}>Total Votes</label>
                <input 
                  type="number" 
                  value={editingBoard.votes} 
                  onChange={e => setEditingBoard({ ...editingBoard, votes: parseInt(e.target.value) || 0 })}
                  style={{ padding: '10px 14px', borderRadius: '10px', border: '1px solid var(--glass-border)', background: 'var(--input-bg)', color: 'var(--text-primary)', outline: 'none', fontSize: '0.9rem' }}
                />
              </div>
            </div>
            <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
              <button onClick={() => setEditingBoard(null)} className="btn-secondary" style={{ flex: 1, padding: '10px 14px' }}>Cancel</button>
              <button onClick={() => {
                setBoards(boards.map(b => b.id === editingBoard.id ? editingBoard : b));
                setEditingBoard(null);
              }} className="btn-primary" style={{ flex: 1, padding: '10px 14px', boxShadow: 'var(--glow-cyan)' }}>Save Details</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DecisionBoards;
