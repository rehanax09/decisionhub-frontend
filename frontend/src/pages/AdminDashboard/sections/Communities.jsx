import React, { useState, useEffect } from 'react';
import { Users, Trash2, Eye } from 'lucide-react';
import api from '../../../api/api';

const statusColors = {
  ACTIVE:  { bg: 'rgba(0,255,153,0.1)',  color: 'var(--success)',  border: 'rgba(0,255,153,0.3)'  },
  BANNED:  { bg: 'rgba(255,0,0,0.1)',    color: '#ff4444',         border: 'rgba(255,0,0,0.3)'    },
};

const Communities = () => {
  const [communities, setCommunities] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch communities from backend on mount
  useEffect(() => {
    const fetchCommunities = async () => {
      try {
        const res = await api.get('/api/communities');
        if (res.data?.success) {
          setCommunities(res.data.data);
        }
      } catch (err) {
        console.error("Failed to load admin communities:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCommunities();
  }, []);

  // Delete community permanently
  const remove = async (id) => {
    if (window.confirm('Are you sure you want to delete this community permanently? This will remove all associated member data.')) {
      try {
        await api.delete(`/api/admin/communities/${id}`);
        setCommunities(prev => prev.filter(x => x.id !== id));
        alert("Community deleted successfully.");
      } catch (err) {
        console.error("Failed to delete community:", err);
        alert(err.response?.data?.message || "Could not delete community on server.");
      }
    }
  };

  return (
    <div>
      {/* Summary cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px', marginBottom: '28px' }}>
        {[
          { label: 'Total Communities', value: loading ? '...' : communities.length, color: 'var(--neon-cyan)'  },
          { label: 'System Active Status', value: loading ? '...' : 'All Live', color: 'var(--success)'    },
        ].map((s, i) => (
          <div key={i} className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.82rem' }}>{s.label}</p>
            <h3 style={{ margin: 0, fontSize: '2rem', fontFamily: 'Outfit', color: s.color }}>{s.value}</h3>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="glass-panel" style={{ overflowX: 'auto' }}>
        {loading ? (
          <p style={{ color: 'var(--text-secondary)', padding: '40px', textAlign: 'center' }}>Loading communities…</p>
        ) : communities.length === 0 ? (
          <p style={{ color: 'var(--text-secondary)', padding: '40px', textAlign: 'center' }}>No communities found in database.</p>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--glass-border)' }}>
                {['Community', 'Owner / Mod', 'Members Count', 'Category', 'Created At', 'Actions'].map((h, i) => (
                  <th key={h} style={{ padding: '16px', textAlign: i === 5 ? 'right' : 'left', fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--text-secondary)', fontWeight: '600' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {communities.map(c => {
                const createdDate = c.createdAt ? new Date(c.createdAt).toLocaleDateString() : 'N/A';
                return (
                  <tr key={c.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                    <td style={{ padding: '14px 16px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(0,245,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Users size={18} color="var(--neon-cyan)" />
                      </div>
                      {c.name}
                    </td>
                    <td style={{ padding: '14px 16px', color: 'var(--text-secondary)', fontSize: '0.88rem' }}>@{c.moderatorUsername || 'system'}</td>
                    <td style={{ padding: '14px 16px', color: 'var(--neon-cyan)', fontWeight: '600' }}>{c.memberCount}</td>
                    <td style={{ padding: '14px 16px' }}>
                      <span style={{ padding: '3px 10px', borderRadius: '20px', fontSize: '0.72rem', fontWeight: 'bold', background: 'rgba(0,245,255,0.1)', color: 'var(--neon-cyan)' }}>
                        #{c.category || 'General'}
                      </span>
                    </td>
                    <td style={{ padding: '14px 16px', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{createdDate}</td>
                    <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                      <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                        <button onClick={() => setSelected(c)} title="View Details" style={{ padding: '6px', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'transparent', color: 'var(--neon-cyan)', cursor: 'pointer', display: 'flex' }}><Eye size={15}/></button>
                        <button onClick={() => remove(c.id)} title="Delete permanently" style={{ padding: '6px', borderRadius: '8px', border: '1px solid rgba(255,0,0,0.3)', background: 'transparent', color: '#ff4444', cursor: 'pointer', display: 'flex' }}><Trash2 size={15}/></button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Details Modal */}
      {selected && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(4px)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={() => setSelected(null)}>
          <div className="glass-panel" style={{ padding: '36px', maxWidth: '440px', width: '100%', borderRadius: '20px' }} onClick={e => e.stopPropagation()}>
            <h3 style={{ margin: '0 0 16px 0', fontFamily: 'Outfit', color: 'var(--neon-cyan)' }}>{selected.name}</h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.95rem' }}>
              <p style={{ margin: 0, color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                {selected.description || 'No description provided.'}
              </p>
              <div style={{ height: '1px', background: 'var(--glass-border)', margin: '8px 0' }}></div>
              <div>
                <strong style={{ color: 'var(--text-primary)' }}>Moderator:</strong> @{selected.moderatorUsername || 'system'}
              </div>
              <div>
                <strong style={{ color: 'var(--text-primary)' }}>Members Count:</strong> {selected.memberCount}
              </div>
              <div>
                <strong style={{ color: 'var(--text-primary)' }}>Category:</strong> #{selected.category || 'General'}
              </div>
              <div>
                <strong style={{ color: 'var(--text-primary)' }}>Created At:</strong> {selected.createdAt ? new Date(selected.createdAt).toLocaleString() : 'N/A'}
              </div>
            </div>

            <button onClick={() => setSelected(null)} className="btn-secondary" style={{ marginTop: '24px', width: '100%' }}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Communities;
