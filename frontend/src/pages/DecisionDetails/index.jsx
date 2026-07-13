import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ThumbsUp, ThumbsDown, MessageSquare, BarChart2, CheckCircle, ArrowLeft } from 'lucide-react';
import api from '../../api/api';

const DecisionDetails = () => {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState('overview');
  const [decision, setDecision] = useState(null);
  const [loading, setLoading] = useState(true);
  const [voted, setVoted] = useState(null); // 'agree' or 'disagree'
  const [agreePercent, setAgreePercent] = useState(50);

  // Comments local state for discussion
  const [comments, setComments] = useState([
    { id: 1, author: 'Alex_Neural', text: 'This choice depends heavily on current career progression goals.', time: '1 hour ago' },
    { id: 2, author: 'WealthBuilder', text: 'I agree. High upfront costs are worth the networking opportunities.', time: '30 mins ago' }
  ]);
  const [newComment, setNewComment] = useState('');

  useEffect(() => {
    const fetchDecision = async () => {
      try {
        const res = await api.get(`/api/decisions/${id}`);
        if (res.data?.success) {
          setDecision(res.data.data);
          
          // Load local vote from localStorage
          const localVote = localStorage.getItem(`vote_dec_${id}`);
          if (localVote) {
            setVoted(localVote);
            setAgreePercent(localVote === 'agree' ? 72 : 28);
          }
        }
      } catch (err) {
        console.error("Failed to fetch decision details:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDecision();
  }, [id]);

  const handleVote = (type) => {
    setVoted(type);
    setAgreePercent(type === 'agree' ? 72 : 28);
    localStorage.setItem(`vote_dec_${id}`, type);
  };

  const handleAddComment = (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    setComments(prev => [
      ...prev,
      {
        id: Date.now(),
        author: 'You (admin)',
        text: newComment,
        time: 'Just now'
      }
    ]);
    setNewComment('');
  };

  if (loading) {
    return (
      <div style={{ padding: '60px', textAlign: 'center', color: 'var(--text-secondary)' }} className="glass-panel">
        <h3>Loading decision details...</h3>
      </div>
    );
  }

  if (!decision) {
    return (
      <div style={{ padding: '60px', textAlign: 'center', color: 'var(--text-secondary)' }} className="glass-panel">
        <h3>Decision not found.</h3>
        <Link to="/decision-board" className="btn-secondary" style={{ marginTop: '20px', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
          <ArrowLeft size={16} /> Back to Boards
        </Link>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
      
      {/* Back link & Header */}
      <div style={{ marginBottom: '30px' }}>
        <Link to="/decision-board" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', textDecoration: 'none', marginBottom: '20px' }}>
          <ArrowLeft size={16} /> Back to Decision Boards
        </Link>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '20px' }}>
          <div>
            <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
              {decision.category && (
                <span style={{ color: 'var(--neon-cyan)', fontSize: '0.9rem', background: 'rgba(0,245,255,0.1)', padding: '4px 8px', borderRadius: '4px' }}>
                  #{decision.category}
                </span>
              )}
              <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', background: 'var(--chip-bg)', padding: '4px 8px', borderRadius: '4px' }}>
                {decision.status}
              </span>
            </div>
            <h1 style={{ fontSize: '2.5rem', fontFamily: 'Outfit', margin: 0, marginBottom: '8px' }}>{decision.title}</h1>
            <p style={{ color: 'var(--text-secondary)' }}>
              Consensus Level: <span style={{ color: 'var(--neon-cyan)', fontWeight: 'bold' }}>{agreePercent}% Support</span>
            </p>
          </div>
        </div>
      </div>

      {/* Consensus Meter */}
      <div className="glass-panel" style={{ padding: '30px', marginBottom: '30px' }}>
        <h3 style={{ marginBottom: '16px', fontFamily: 'Outfit' }}>Network Consensus Meter</h3>
        <div style={{ height: '12px', background: 'var(--glass-border)', borderRadius: '6px', display: 'flex', overflow: 'hidden', marginBottom: '12px' }}>
          <div style={{ width: `${agreePercent}%`, background: 'var(--neon-cyan)', transition: 'width 0.8s ease' }}></div>
          <div style={{ width: `${100 - agreePercent}%`, background: 'var(--neon-pink)', transition: 'width 0.8s ease' }}></div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
          <span style={{ color: 'var(--neon-cyan)', fontWeight: 'bold' }}>{agreePercent}% Support / Agree</span>
          <span style={{ color: 'var(--neon-pink)', fontWeight: 'bold' }}>{100 - agreePercent}% Oppose / Disagree</span>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '20px', borderBottom: '1px solid var(--glass-border)', marginBottom: '30px' }}>
        {['Overview', 'Discussion'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab.toLowerCase())}
            style={{
              background: 'transparent',
              border: 'none',
              color: activeTab === tab.toLowerCase() ? 'var(--neon-cyan)' : 'var(--text-secondary)',
              padding: '12px 0',
              fontSize: '1.1rem',
              fontFamily: 'Outfit',
              borderBottom: activeTab === tab.toLowerCase() ? '2px solid var(--neon-cyan)' : '2px solid transparent',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab Contents */}
      {activeTab === 'overview' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
          {/* Details & Description */}
          <div className="glass-panel" style={{ padding: '30px' }}>
            <h3 style={{ marginBottom: '16px', fontFamily: 'Outfit', color: 'var(--text-primary)' }}>Description & Context</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', lineHeight: '1.7', whiteSpace: 'pre-wrap', margin: 0 }}>
              {decision.description || 'No description provided.'}
            </p>
          </div>

          {/* Voting Action Panels */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '30px' }}>
            {/* Agree option */}
            <div className="glass-panel" style={{ padding: '30px', border: voted === 'agree' ? '1px solid var(--neon-cyan)' : '1px solid var(--glass-border)', display: 'flex', flexDirection: 'column', gap: '16px', alignItems: 'center', textAlign: 'center' }}>
              <ThumbsUp size={48} color="var(--neon-cyan)" style={{ opacity: voted === 'agree' ? 1 : 0.6 }} />
              <div>
                <h3 style={{ margin: '0 0 6px 0', fontFamily: 'Outfit' }}>Support / Agree</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', margin: 0 }}>Vote in favor of the proposal or idea described.</p>
              </div>
              <button 
                onClick={() => handleVote('agree')}
                className={voted === 'agree' ? 'btn-primary' : 'btn-secondary'}
                style={{ width: '100%', marginTop: 'auto', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}
              >
                <CheckCircle size={18} /> {voted === 'agree' ? 'Voted' : 'Cast Agree'}
              </button>
            </div>

            {/* Disagree option */}
            <div className="glass-panel" style={{ padding: '30px', border: voted === 'disagree' ? '1px solid var(--neon-pink)' : '1px solid var(--glass-border)', display: 'flex', flexDirection: 'column', gap: '16px', alignItems: 'center', textAlign: 'center' }}>
              <ThumbsDown size={48} color="var(--neon-pink)" style={{ opacity: voted === 'disagree' ? 1 : 0.6 }} />
              <div>
                <h3 style={{ margin: '0 0 6px 0', fontFamily: 'Outfit' }}>Oppose / Disagree</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', margin: 0 }}>Vote against or flag potential concerns about the proposal.</p>
              </div>
              <button 
                onClick={() => handleVote('disagree')}
                className={voted === 'disagree' ? 'btn-primary' : 'btn-secondary'}
                style={{ width: '100%', marginTop: 'auto', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', boxShadow: voted === 'disagree' ? 'var(--glow-pink)' : 'none' }}
              >
                <CheckCircle size={18} /> {voted === 'disagree' ? 'Voted' : 'Cast Disagree'}
              </button>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'discussion' && (
        <div className="glass-panel" style={{ padding: '30px' }}>
          <h3 style={{ marginBottom: '24px', fontFamily: 'Outfit' }}>Consensus Discussion</h3>
          
          {/* Discussion feed */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '30px' }}>
            {comments.map(comment => (
              <div key={comment.id} style={{ padding: '16px', borderRadius: '10px', background: 'rgba(255,255,255,0.01)', border: '1px solid var(--glass-border)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.85rem' }}>
                  <span style={{ color: 'var(--neon-cyan)', fontWeight: 'bold' }}>@{comment.author}</span>
                  <span style={{ color: 'var(--text-secondary)' }}>{comment.time}</span>
                </div>
                <p style={{ color: 'var(--text-primary)', margin: 0, fontSize: '0.95rem', lineHeight: '1.5' }}>{comment.text}</p>
              </div>
            ))}
          </div>

          {/* Comment Form */}
          <form onSubmit={handleAddComment} style={{ display: 'flex', gap: '12px' }}>
            <input 
              type="text"
              required
              placeholder="Add your feedback to the debate..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              style={{
                flex: 1,
                padding: '12px 16px',
                borderRadius: '8px',
                border: '1px solid var(--glass-border)',
                background: 'var(--input-bg)',
                color: 'var(--text-primary)',
                outline: 'none'
              }}
              onFocus={(e) => e.target.style.border = '1px solid var(--neon-cyan)'}
              onBlur={(e) => e.target.style.border = '1px solid var(--glass-border)'}
            />
            <button type="submit" className="btn-primary" style={{ padding: '0 24px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <MessageSquare size={16} /> Comment
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default DecisionDetails;
