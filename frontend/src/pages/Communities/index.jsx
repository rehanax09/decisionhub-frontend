import React, { useState } from 'react';
import { Users, MessageSquare, TrendingUp, Search, PlusCircle, CheckCircle, Shield } from 'lucide-react';

const Communities = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  // Dummy data for communities
  const [communities, setCommunities] = useState([
    {
      id: 1,
      name: "Tech Innovators",
      description: "Discussing the bleeding edge of software, AI, and hardware. Join us to shape the future of technology.",
      members: 14500,
      activeDiscussions: 342,
      tags: ["AI", "Web3", "Hardware"],
      isJoined: true,
      color: "var(--neon-cyan)",
      icon: <TrendingUp size={24} />
    },
    {
      id: 2,
      name: "Financial Strategists",
      description: "Debating market trends, crypto analysis, and long-term investment portfolios. High yield discussions.",
      members: 8900,
      activeDiscussions: 156,
      tags: ["Crypto", "Stocks", "Economy"],
      isJoined: false,
      color: "var(--success)",
      icon: <Shield size={24} />
    },
    {
      id: 3,
      name: "Design Thinkers",
      description: "A hub for UI/UX designers, graphic artists, and product managers to debate aesthetics and usability.",
      members: 12200,
      activeDiscussions: 289,
      tags: ["UI/UX", "Product", "Art"],
      isJoined: false,
      color: "var(--neon-pink)",
      icon: <Users size={24} />
    },
    {
      id: 4,
      name: "Startup Founders",
      description: "Network, pitch ideas, and get feedback from fellow entrepreneurs and venture capitalists.",
      members: 5400,
      activeDiscussions: 98,
      tags: ["Startup", "VC", "Pitch"],
      isJoined: true,
      color: "var(--accent-purple)",
      icon: <MessageSquare size={24} />
    }
  ]);

  const toggleJoin = (id) => {
    setCommunities(communities.map(c => {
      if (c.id === id) {
        return {
          ...c,
          isJoined: !c.isJoined,
          members: c.isJoined ? c.members - 1 : c.members + 1
        };
      }
      return c;
    }));
  };

  const filteredCommunities = communities.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
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
              placeholder="Search communities or tags..." 
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
          <button className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <PlusCircle size={20} /> Create Group
          </button>
        </div>
      </div>

      {/* Communities Grid */}
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
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Users size={14} /> {(community.members / 1000).toFixed(1)}k</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><MessageSquare size={14} /> {community.activeDiscussions} Active</span>
                </div>
              </div>
            </div>

            {/* Description */}
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: '1.5', flex: 1, marginBottom: '20px' }}>
              {community.description}
            </p>

            {/* Tags */}
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '24px' }}>
              {community.tags.map(tag => (
                <span key={tag} style={{ 
                  background: 'var(--panel-bg)', 
                  border: '1px solid var(--glass-border)',
                  color: 'var(--text-secondary)',
                  padding: '4px 10px',
                  borderRadius: '12px',
                  fontSize: '0.75rem'
                }}>
                  {tag}
                </span>
              ))}
            </div>

            {/* Action Button */}
            <button 
              onClick={() => toggleJoin(community.id)}
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
    </div>
  );
};

export default Communities;
