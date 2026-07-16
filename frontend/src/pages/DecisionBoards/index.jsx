import React, { useState, useEffect, useMemo } from 'react';
import { ThumbsUp, Plus, Search, Filter } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import api from '../../api/api';

const DecisionBoard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const searchQuery = searchParams.get('search') || '';
  
  const [decisions, setDecisions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterCategory, setFilterCategory] = useState('All');

  // Fetch decisions from backend on mount
  useEffect(() => {
    const fetchDecisions = async () => {
      try {
        const res = await api.get('/api/decisions');
        if (res.data?.success) {
          setDecisions(res.data.data);
        }
      } catch (err) {
        console.error("Failed to fetch decisions from backend:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDecisions();
  }, []);

  const filteredDecisions = useMemo(() => {
    // Only show public decisions on the main board
    let result = decisions.filter(dec => !dec.communityId);
    
    if (searchQuery) {
      const lowerQuery = searchQuery.toLowerCase();
      result = result.filter(dec => 
        (dec.title && dec.title.toLowerCase().includes(lowerQuery)) || 
        (dec.category && dec.category.toLowerCase().includes(lowerQuery)) ||
        (dec.status && dec.status.toLowerCase().includes(lowerQuery))
      );
    }
    if (filterCategory !== 'All') {
      result = result.filter(dec => dec.category === filterCategory);
    }
    return result;
  }, [decisions, searchQuery, filterCategory]);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', flexWrap: 'wrap', gap: '20px' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontFamily: 'Outfit', margin: 0 }}>
            {searchQuery ? `Search Results: "${searchQuery}"` : 'Decision Boards'}
          </h1>
          <p style={{ color: 'var(--text-secondary)' }}>
            {searchQuery ? `Showing results matching your search.` : `Explore and participate in the network's consensus.`}
          </p>
        </div>

        <div style={{ position: 'relative' }}>
          <Filter size={20} style={{ position: 'absolute', left: 14, top: 10, color: 'var(--text-secondary)' }} />
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            style={{
              appearance: 'none',
              background: 'var(--panel-bg)',
              border: '1px solid var(--glass-border)',
              borderRadius: '20px',
              padding: '10px 16px 10px 45px',
              color: 'var(--text-primary)',
              outline: 'none',
              cursor: 'pointer',
              transition: 'border-color 0.3s ease'
            }}
            onFocus={(e) => e.target.style.borderColor = 'var(--neon-cyan)'}
            onBlur={(e) => e.target.style.borderColor = 'var(--glass-border)'}
          >
            <option value="All" style={{ background: 'var(--bg-primary)', color: 'var(--text-primary)' }}>All Categories</option>
            <option value="Technology" style={{ background: 'var(--bg-primary)', color: 'var(--text-primary)' }}>Technology</option>
            <option value="Finance" style={{ background: 'var(--bg-primary)', color: 'var(--text-primary)' }}>Finance</option>
            <option value="Career" style={{ background: 'var(--bg-primary)', color: 'var(--text-primary)' }}>Career</option>
            <option value="Travel" style={{ background: 'var(--bg-primary)', color: 'var(--text-primary)' }}>Travel</option>
            <option value="Lifestyle" style={{ background: 'var(--bg-primary)', color: 'var(--text-primary)' }}>Lifestyle</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div style={{ padding: '60px', textAlign: 'center', color: 'var(--text-secondary)' }} className="glass-panel">
          <h3>Loading decision boards...</h3>
        </div>
      ) : filteredDecisions.length === 0 ? (
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
              
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '20px', lineHeight: '1.5', flex: 1 }}>
                {dec.description ? (dec.description.length > 120 ? `${dec.description.substring(0, 120)}...` : dec.description) : 'No description provided.'}
              </p>
              
              <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', flexWrap: 'wrap' }}>
                {dec.category && (
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', background: 'var(--panel-bg)', padding: '4px 8px', borderRadius: '4px' }}>
                    #{dec.category}
                  </span>
                )}
                {dec.communityName ? (
                  <span style={{ fontSize: '0.8rem', color: 'var(--neon-pink)', background: 'rgba(255, 99, 132, 0.1)', padding: '4px 8px', borderRadius: '4px', border: '1px solid rgba(255, 99, 132, 0.3)' }}>
                    Community: {dec.communityName}
                  </span>
                ) : (
                  <span style={{ fontSize: '0.8rem', color: 'var(--success)', background: 'rgba(0, 255, 127, 0.1)', padding: '4px 8px', borderRadius: '4px', border: '1px solid rgba(0, 255, 127, 0.3)' }}>
                    Public
                  </span>
                )}
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', borderTop: '1px solid var(--glass-border)', paddingTop: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                  <ThumbsUp size={16} color="var(--neon-pink)" /> Active Consensus
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
