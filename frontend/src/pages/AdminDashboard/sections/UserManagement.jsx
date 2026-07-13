import React, { useState, useEffect } from 'react';
import { Search, Shield, Trash2, UserCheck, UserX } from 'lucide-react';
import api from '../../../api/api';

const UserManagement = () => {
  const [users, setUsers]       = useState([]);
  const [search, setSearch]     = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await api.get('/api/admin/users', { headers: { Authorization: `Bearer ${token}` } });
        if (res.data?.success) {
          setUsers(res.data.data);
        } else {
          setUsers([]);
        }
      } catch (err) {
        console.error("Failed to load users from backend:", err);
        setUsers([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const patch = async (id, endpoint, localUpdate) => {
    try {
      const token = localStorage.getItem('token');
      await api.patch(`/api/admin/users/${id}/${endpoint}`, {}, { headers: { Authorization: `Bearer ${token}` } });
      setUsers(prev => prev.map(u => u.id === id ? { ...u, ...localUpdate(u) } : u));
    } catch (err) {
      console.error(`Failed to patch ${endpoint}:`, err);
      alert(`Could not update user ${endpoint} on server.`);
    }
  };

  const toggleRole   = (id) => patch(id, 'role',   u => ({ role:   u.role?.toLowerCase()   === 'admin'  ? 'USER'      : 'ADMIN'     }));
  const toggleStatus = (id) => patch(id, 'status', u => ({ status: u.status?.toLowerCase() === 'active' ? 'SUSPENDED' : 'ACTIVE'    }));
  
  const deleteUser = async (id) => {
    if (window.confirm('Delete this user permanently?')) {
      try {
        const token = localStorage.getItem('token');
        await api.delete(`/api/admin/users/${id}`, { headers: { Authorization: `Bearer ${token}` } });
        setUsers(prev => prev.filter(x => x.id !== id));
      } catch (err) {
        console.error("Failed to delete user:", err);
        alert("Could not delete user on server.");
      }
    }
  };

  const filtered = users.filter(u => {
    const q = search.toLowerCase();
    const matchSearch = !q || (u.fullName||'').toLowerCase().includes(q) || (u.email||'').toLowerCase().includes(q) || (u.username||'').toLowerCase().includes(q);
    const matchRole   = roleFilter === 'ALL' || u.role?.toUpperCase() === roleFilter;
    return matchSearch && matchRole;
  });

  return (
    <div>
      {/* Controls */}
      <div style={{ display: 'flex', gap: '16px', marginBottom: '24px', flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: '220px' }}>
          <Search size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by name, email, username…"
            style={{ width: '100%', padding: '10px 16px 10px 38px', borderRadius: '10px', border: '1px solid var(--glass-border)', background: 'var(--input-bg)', color: 'var(--text-primary)', outline: 'none', fontSize: '0.9rem' }}
          />
        </div>
        {['ALL','USER','ADMIN'].map(r => (
          <button key={r} onClick={() => setRoleFilter(r)}
            style={{ padding: '10px 20px', borderRadius: '10px', border: '1px solid var(--glass-border)', background: roleFilter === r ? 'var(--neon-cyan)' : 'transparent', color: roleFilter === r ? 'var(--bg-primary)' : 'var(--text-secondary)', cursor: 'pointer', fontWeight: roleFilter === r ? '700' : '400', fontSize: '0.85rem', transition: 'all 0.2s' }}>
            {r}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="glass-panel" style={{ padding: '0', overflowX: 'auto' }}>
        {loading ? (
          <p style={{ color: 'var(--text-secondary)', padding: '40px', textAlign: 'center' }}>Loading users…</p>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--glass-border)' }}>
                {['Name','Email','Username','Role','Status','Actions'].map((h, i) => (
                  <th key={h} style={{ padding: '16px 16px', textAlign: i === 5 ? 'right' : 'left', fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--text-secondary)', fontWeight: '600' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(user => {
                const isAdmin  = user.role?.toLowerCase()   === 'admin';
                const isActive = user.status?.toLowerCase() === 'active' || !user.status;
                return (
                  <tr key={user.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                    <td style={{ padding: '14px 16px', fontWeight: '500' }}>{user.fullName || user.username || 'N/A'}</td>
                    <td style={{ padding: '14px 16px', color: 'var(--text-secondary)', fontSize: '0.88rem' }}>{user.email}</td>
                    <td style={{ padding: '14px 16px', color: 'var(--text-secondary)', fontSize: '0.88rem' }}>@{user.username}</td>
                    <td style={{ padding: '14px 16px' }}>
                      <span style={{ padding: '3px 10px', borderRadius: '20px', fontSize: '0.72rem', fontWeight: 'bold', background: isAdmin ? 'rgba(255,0,255,0.1)' : 'rgba(0,245,255,0.1)', color: isAdmin ? 'var(--neon-pink)' : 'var(--neon-cyan)', border: `1px solid ${isAdmin ? 'rgba(255,0,255,0.3)' : 'rgba(0,245,255,0.3)'}` }}>
                        {isAdmin ? 'ADMIN' : 'USER'}
                      </span>
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <span style={{ padding: '3px 10px', borderRadius: '20px', fontSize: '0.72rem', fontWeight: 'bold', background: isActive ? 'rgba(0,255,153,0.1)' : 'rgba(255,0,0,0.1)', color: isActive ? 'var(--success)' : '#ff4444', border: `1px solid ${isActive ? 'rgba(0,255,153,0.3)' : 'rgba(255,0,0,0.3)'}` }}>
                        {isActive ? 'ACTIVE' : 'SUSPENDED'}
                      </span>
                    </td>
                    <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                      <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                        <button onClick={() => toggleStatus(user.id)} title={isActive ? 'Block user' : 'Unblock user'}
                          style={{ padding: '6px', borderRadius: '8px', border: `1px solid ${isActive ? 'rgba(255,0,0,0.3)' : 'rgba(0,255,153,0.3)'}`, background: 'transparent', color: isActive ? '#ff4444' : 'var(--success)', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                          {isActive ? <UserX size={16}/> : <UserCheck size={16}/>}
                        </button>
                        <button onClick={() => toggleRole(user.id)} title={isAdmin ? 'Demote to User' : 'Promote to Admin'}
                          style={{ padding: '6px', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'transparent', color: isAdmin ? 'var(--neon-pink)' : 'var(--neon-cyan)', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                          <Shield size={16}/>
                        </button>
                        <button onClick={() => deleteUser(user.id)} title="Delete user"
                          style={{ padding: '6px', borderRadius: '8px', border: '1px solid rgba(255,0,0,0.3)', background: 'transparent', color: '#ff4444', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                          <Trash2 size={16}/>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr><td colSpan={6} style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)' }}>No users match your filters.</td></tr>
              )}
            </tbody>
          </table>
        )}
      </div>
      <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', marginTop: '12px' }}>{filtered.length} user(s) shown</p>
    </div>
  );
};

export default UserManagement;
