import React, { useMemo } from 'react';
import { MessageSquare, ThumbsUp, Plus } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const DecisionBoard = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const searchQuery = searchParams.get('search') || '';
  const decisions = [
    { id: 1, title: 'MBA vs Corporate Job', votes: 120, status: 'Open Discussion', tags: ['Career', 'Education'] },
    { id: 2, title: 'Goa vs Bali', votes: 89, status: 'Voting Active', tags: ['Travel'] },
    { id: 3, title: 'React vs Vue for next project', votes: 432, status: 'Open Discussion', tags: ['Technology'] },
    { id: 4, title: 'Buy House vs Invest in Stocks', votes: 215, status: 'Closed', tags: ['Finance'] },
    { id: 5, title: 'iPhone 15 vs Pixel 8', votes: 890, status: 'Voting Active', tags: ['Technology'] },
    { id: 6, title: 'Remote Work vs Hybrid', votes: 156, status: 'Open Discussion', tags: ['Career', 'Lifestyle'] },
  ];

  const filteredDecisions = useMemo(() => {
    if (!searchQuery) return decisions;
    const lowerQuery = searchQuery.toLowerCase();
    return decisions.filter(dec => 
      dec.title.toLowerCase().includes(lowerQuery) || 
      dec.tags.some(tag => tag.toLowerCase().includes(lowerQuery)) ||
      dec.status.toLowerCase().includes(lowerQuery)
    );
  }, [searchQuery]);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontFamily: 'Outfit', margin: 0 }}>
            {searchQuery ? `Search Results: "${searchQuery}"` : 'Decision Boards'}
          </h1>
          <p style={{ color: 'var(--text-secondary)' }}>
            {searchQuery ? `Showing results matching your search.` : `Explore and participate in the network's consensus.`}
          </p>
        </div>
      </div>

      {filteredDecisions.length === 0 ? (
        <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)' }} className="glass-panel">
          <h3>No decisions found matching "{searchQuery}"</h3>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
          {filteredDecisions.map((dec) => (
            <div key={dec.id} className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '1.2rem', fontFamily: 'Outfit', flex: 1, margin: '0 10px 0 0' }}>{dec.title}</h3>
              <span style={{ 
                background: dec.status === 'Closed' ? 'var(--chip-bg)' : 'rgba(0, 245, 255, 0.1)', 
                color: dec.status === 'Closed' ? 'var(--text-secondary)' : 'var(--neon-cyan)',
                padding: '4px 10px',
                borderRadius: '12px',
                fontSize: '0.75rem',
                whiteSpace: 'nowrap'
              }}>
                {dec.status}
              </span>
            </div>
            
            <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', flexWrap: 'wrap' }}>
              {dec.tags.map(tag => (
                <span key={tag} style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', background: 'var(--panel-bg)', padding: '4px 8px', borderRadius: '4px' }}>
                  #{tag}
                </span>
              ))}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', borderTop: '1px solid var(--glass-border)', paddingTop: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                <ThumbsUp size={16} color="var(--neon-pink)" /> {dec.votes} Votes
              </div>
              <Link to={`/decision/${dec.id}`} className="btn-secondary" style={{ padding: '6px 16px', fontSize: '0.85rem' }}>
                View
              </Link>
            </div>
          </div>
        ))}
        </div>
      )}

      {/* Floating Action Button */}
      <Link to="/create-decision" style={{
        position: 'fixed',
        bottom: '40px',
        right: '40px',
        width: '60px',
        height: '60px',
        borderRadius: '50%',
        background: 'var(--neon-cyan)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: 'var(--glow-cyan)',
        color: 'black',
        transition: 'transform 0.2s',
        zIndex: 100
      }}
      onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
      onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
      >
        <Plus size={32} />
      </Link>
    </div>
  );
};

export default DecisionBoard;
