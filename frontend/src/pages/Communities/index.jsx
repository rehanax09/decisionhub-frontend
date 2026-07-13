import React, { useState, useEffect } from 'react';
import { Users, MessageSquare, TrendingUp, Search, PlusCircle, CheckCircle, Shield, X } from 'lucide-react';
import api from '../../api/api';

const CATEGORY_STYLES = {
  Technology: { color: 'var(--neon-cyan)', icon: <TrendingUp size={24} /> },
  Finance:    { color: 'var(--success)',   icon: <Shield size={24} /> },
  Career:     { color: 'var(--accent-purple)', icon: <Users size={24} /> },
  Travel:     { color: 'var(--neon-pink)', icon: <MessageSquare size={24} /> },
  Lifestyle:  { color: '#FF9500',          icon: <Users size={24} /> },
};

const DEFAULT_STYLE = { color: 'var(--neon-cyan)', icon: <Users size={24} /> };

const Communities = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [communities, setCommunities] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Create community modal state
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Technology');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load user profile and communities from backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        const userRes = await api.get('/api/users/me');
        if (userRes.data?.success) {
          setCurrentUser(userRes.data.data);
        }

        const commsRes = await api.get('/api/communities');
        if (commsRes.data?.success) {
          const list = commsRes.data.data.map(c => {
            const styleInfo = CATEGORY_STYLES[c.category] || DEFAULT_STYLE;
            // The moderator/creator is automatically joined.
            // For other users, check if they are joined (we'll also track it locally if updated)
            const isModerator = userRes.data?.data && c.moderatorUsername === userRes.data.data.username;
            
            // Check if user has joined community using localStorage list (or default to false if not moderator)
            const joinedList = JSON.parse(localStorage.getItem(`joined_comm_${userRes.data?.data?.id}`) || "[]");
            const isJoined = isModerator || joinedList.includes(c.id);

            return {
              ...c,
              color: styleInfo.color,
              icon: styleInfo.icon,
              isJoined: isJoined
            };
          });
          setCommunities(list);
        }
      } catch (err) {
        console.error("Failed to load communities data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const toggleJoin = async (id, isJoined) => {
    if (!currentUser) return;
    try {
      if (isJoined) {
        // Leave community
        await api.delete(`/api/communities/${id}/members/${currentUser.id}`);
        setCommunities(prev => prev.map(c => {
          if (c.id === id) {
            return { ...c, isJoined: false, memberCount: Math.max(0, c.memberCount - 1) };
          }
          return c;
        }));
        
        // Update local storage tracking
        const joinedList = JSON.parse(localStorage.getItem(`joined_comm_${currentUser.id}`) || "[]");
        localStorage.setItem(`joined_comm_${currentUser.id}`, JSON.stringify(joinedList.filter(x => x !== id)));
      } else {
        // Join community
        await api.post(`/api/communities/${id}/members`);
        setCommunities(prev => prev.map(c => {
          if (c.id === id) {
            return { ...c, isJoined: true, memberCount: c.memberCount + 1 };
          }
          return c;
        }));

        // Update local storage tracking
        const joinedList = JSON.parse(localStorage.getItem(`joined_comm_${currentUser.id}`) || "[]");
        if (!joinedList.includes(id)) {
          localStorage.setItem(`joined_comm_${currentUser.id}`, JSON.stringify([...joinedList, id]));
        }
      }
    } catch (err) {
      console.error("Failed to toggle join status:", err);
      alert(err.response?.data?.message || "An error occurred.");
    }
  };

  const handleCreateCommunity = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsSubmitting(true);
    try {
      const res = await api.post('/api/communities', {
        name,
        category,
        description
      });

      if (res.data?.success) {
        const created = res.data.data;
        const styleInfo = CATEGORY_STYLES[created.category] || DEFAULT_STYLE;
        
        const newComm = {
          ...created,
          color: styleInfo.color,
          icon: styleInfo.icon,
          isJoined: true // creator is automatically moderator and joined
        };

        setCommunities(prev => [newComm, ...prev]);
        
        // Reset and close
        setName('');
        setCategory('Technology');
        setDescription('');
        setShowModal(false);
        alert("Community created successfully!");
      }
    } catch (err) {
      console.error("Failed to create community:", err);
      alert(err.response?.data?.message || "Failed to create community.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredCommunities = communities.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (c.category && c.category.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      
      {/* Header & Search */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '40px', flexWrap: 'wrap', gap: '20px' }}>
        <div>
          <h1 style={{ fontSize: '2.5rem', fontFamily: 'Outfit', margin: 0, marginBottom: '8px' }}>Communities</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Find your tribe. Debate, vote, and decide together.</p>
        </div>
        
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative' }}>
            <Search size={20} style={{ position: 'absolute', left: 14, top: 10, color: 'var(--text-secondary)' }} />
            <input 
              type="text" 
              placeholder="Search communities..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                background: 'var(--panel-bg)',
                border: '1px solid var(--glass-border)',
                borderRadius: '20px',
                padding: '10px 16px 10px 45px',
                color: 'var(--text-primary)',
                outline: 'none',
                width: '300px',
                transition: 'border-color 0.3s ease'
              }} 
              onFocus={(e) => e.target.style.borderColor = 'var(--neon-cyan)'}
              onBlur={(e) => e.target.style.borderColor = 'var(--glass-border)'}
            />
          </div>
          <button 
            className="btn-primary" 
            onClick={() => setShowModal(true)}
            style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            <PlusCircle size={20} /> Create Group
          </button>
        </div>
      </div>

      {/* Loading State */}
      {loading ? (
        <div style={{ padding: '60px', textAlign: 'center', color: 'var(--text-secondary)' }} className="glass-panel">
          <h3>Loading communities...</h3>
        </div>
      ) : (
        /* Communities Grid */
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '30px' }}>
          
          {filteredCommunities.map((community) => (
            <div 
              key={community.id} 
              className="glass-panel" 
              style={{ 
                padding: '30px', 
                display: 'flex', 
                flexDirection: 'column', 
                position: 'relative', 
                transition: 'transform 0.3s ease, box-shadow 0.3s ease'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-5px)';
                e.currentTarget.style.boxShadow = `0 10px 30px ${community.color}30`;
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'none';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              
              {/* Header: Icon & Title */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
                <div style={{ 
                  width: '50px', 
                  height: '50px', 
                  borderRadius: '12px', 
                  background: `${community.color}20`, 
                  color: community.color,
                  display: 'flex', 
                  justifyContent: 'center', 
                  alignItems: 'center',
                  boxShadow: `0 0 15px ${community.color}40`
                }}>
                  {community.icon}
                </div>
                <div>
                  <h2 style={{ fontSize: '1.3rem', fontFamily: 'Outfit', margin: 0 }}>{community.name}</h2>
                  <div style={{ display: 'flex', gap: '12px', color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '4px' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Users size={14} /> {community.memberCount} members</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><MessageSquare size={14} /> @{community.moderatorUsername || 'moderator'}</span>
                  </div>
                </div>
              </div>

              {/* Description */}
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: '1.5', flex: 1, marginBottom: '20px' }}>
                {community.description || 'No description provided.'}
              </p>

              {/* Category Tag */}
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '24px' }}>
                <span style={{ 
                  background: 'var(--panel-bg)', 
                  border: '1px solid var(--glass-border)',
                  color: community.color,
                  padding: '4px 10px',
                  borderRadius: '12px',
                  fontSize: '0.75rem'
                }}>
                  #{community.category || 'General'}
                </span>
              </div>

              {/* Action Button */}
              <button 
                onClick={() => toggleJoin(community.id, community.isJoined)}
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '8px',
                  border: community.isJoined ? '1px solid var(--glass-border)' : 'none',
                  background: community.isJoined ? 'var(--panel-bg)' : `linear-gradient(45deg, ${community.color}, var(--bg-primary))`,
                  color: 'var(--text-primary)',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  gap: '8px',
                  transition: 'all 0.3s ease'
                }}
              >
                {community.isJoined ? (
                  <>
                    <CheckCircle size={18} color="var(--success)" /> Joined
                  </>
                ) : (
                  'Join Community'
                )}
              </button>
              
            </div>
          ))}

          {filteredCommunities.length === 0 && (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '60px', color: 'var(--text-secondary)' }}>
              <Search size={40} style={{ opacity: 0.5, marginBottom: '16px' }} />
              <h3>No communities found</h3>
              <p>Try adjusting your search terms or create a new community.</p>
            </div>
          )}
          
        </div>
      )}

      {/* ── Create Community Modal ────────────────────────────────────── */}
      {showModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          background: 'rgba(0,0,0,0.85)',
          backdropFilter: 'blur(10px)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 9999,
          padding: '20px'
        }}>
          <div className="glass-panel" style={{
            width: '100%',
            maxWidth: '500px',
            padding: '30px',
            borderRadius: '24px',
            position: 'relative',
            border: '1px solid var(--glass-border)'
          }}>
            <button 
              onClick={() => setShowModal(false)}
              style={{
                position: 'absolute',
                top: '20px',
                right: '20px',
                background: 'transparent',
                border: 'none',
                color: 'var(--text-secondary)',
                cursor: 'pointer'
              }}
            >
              <X size={24} />
            </button>

            <h2 style={{ fontFamily: 'Outfit', fontSize: '1.8rem', margin: '0 0 8px 0' }} className="text-gradient">
              Create Community
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', margin: '0 0 24px 0' }}>
              Launch a new hub to collaborate and gather consensus.
            </p>

            <form onSubmit={handleCreateCommunity} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '0.85rem', color: 'var(--text-primary)', fontWeight: '500' }}>
                  Community Name
                </label>
                <input 
                  type="text"
                  required
                  placeholder="e.g. AI Pioneers"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  style={{
                    padding: '12px 16px',
                    borderRadius: '8px',
                    border: '1px solid var(--glass-border)',
                    background: 'var(--input-bg)',
                    color: 'var(--text-primary)',
                    outline: 'none',
                    width: '100%'
                  }}
                  onFocus={(e) => e.target.style.border = '1px solid var(--neon-cyan)'}
                  onBlur={(e) => e.target.style.border = '1px solid var(--glass-border)'}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '0.85rem', color: 'var(--text-primary)', fontWeight: '500' }}>
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  style={{
                    padding: '12px 16px',
                    borderRadius: '8px',
                    border: '1px solid var(--glass-border)',
                    background: 'var(--input-bg)',
                    color: 'var(--text-primary)',
                    outline: 'none',
                    width: '100%'
                  }}
                >
                  <option value="Technology">Technology</option>
                  <option value="Finance">Finance</option>
                  <option value="Career">Career</option>
                  <option value="Travel">Travel</option>
                  <option value="Lifestyle">Lifestyle</option>
                </select>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '0.85rem', color: 'var(--text-primary)', fontWeight: '500' }}>
                  Description
                </label>
                <textarea 
                  rows={4}
                  placeholder="What is this community about?"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  style={{
                    padding: '12px 16px',
                    borderRadius: '8px',
                    border: '1px solid var(--glass-border)',
                    background: 'var(--input-bg)',
                    color: 'var(--text-primary)',
                    outline: 'none',
                    width: '100%',
                    resize: 'none'
                  }}
                  onFocus={(e) => e.target.style.border = '1px solid var(--neon-cyan)'}
                  onBlur={(e) => e.target.style.border = '1px solid var(--glass-border)'}
                />
              </div>

              <button 
                type="submit" 
                className="btn-primary" 
                disabled={isSubmitting}
                style={{ 
                  padding: '14px', 
                  fontSize: '1rem', 
                  marginTop: '10px',
                  boxShadow: 'var(--glow-cyan)'
                }}
              >
                {isSubmitting ? 'Creating Community...' : 'Create Community'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Communities;
