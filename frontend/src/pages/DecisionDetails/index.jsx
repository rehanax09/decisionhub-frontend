import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ThumbsUp, ThumbsDown, MessageSquare, BarChart2, CheckCircle, ArrowLeft, Trash2 } from 'lucide-react';
import api from '../../api/api';

const DecisionDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [decision, setDecision] = useState(null);
  const [loading, setLoading] = useState(true);
  const [votedOptionId, setVotedOptionId] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);

  // Comments local state for discussion
  const [comments, setComments] = useState([
    { id: 1, author: 'Alex_Neural', text: 'This choice depends heavily on current career progression goals.', time: '1 hour ago' },
    { id: 2, author: 'WealthBuilder', text: 'I agree. High upfront costs are worth the networking opportunities.', time: '30 mins ago' }
  ]);
  const [newComment, setNewComment] = useState('');

  useEffect(() => {
    const fetchDecisionAndUser = async () => {
      try {
        const [decisionRes, userRes] = await Promise.all([
          api.get(`/api/decisions/${id}`),
          api.get('/api/users/me').catch(() => null)
        ]);

        if (decisionRes.data?.success) {
          setDecision(decisionRes.data.data);
          
          if (decisionRes.data.data.votedOptionId) {
            setVotedOptionId(Number(decisionRes.data.data.votedOptionId));
          } else {
            setVotedOptionId(null);
          }
        }

        if (userRes && userRes.data?.success) {
          setCurrentUser(userRes.data.data);
        }
      } catch (err) {
        console.error("Failed to fetch decision details:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDecisionAndUser();
  }, [id]);

  const handleVote = async (optionId) => {
    try {
      const res = await api.post(`/api/decisions/${id}/votes`, { optionId, voteType: 'UPVOTE' });
      if (res.data?.success) {
        setVotedOptionId(optionId);
        
        // Refresh decision to update scores
        const decisionRes = await api.get(`/api/decisions/${id}`);
        if (decisionRes.data?.success) {
          setDecision(decisionRes.data.data);
          if (decisionRes.data.data.votedOptionId) {
            setVotedOptionId(Number(decisionRes.data.data.votedOptionId));
          }
        }
      }
    } catch (err) {
      console.error("Failed to cast vote:", err);
      alert(err.response?.data?.message || "Failed to cast vote.");
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this decision board? This action cannot be undone.")) {
      return;
    }
    
    try {
      const res = await api.delete(`/api/decisions/${id}`);
      if (res.data?.success) {
        alert("Decision board deleted successfully.");
        navigate("/decision-board");
      }
    } catch (err) {
      console.error("Failed to delete decision board:", err);
      alert(err.response?.data?.message || "Failed to delete decision board.");
    }
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
              Total Options: <span style={{ color: 'var(--neon-cyan)', fontWeight: 'bold' }}>{decision.options?.length || 0}</span>
            </p>
          </div>

          {currentUser && (currentUser.id === decision.userId || currentUser.role === 'ADMIN') && (
            <button
              onClick={handleDelete}
              className="btn-danger"
              style={{
                background: 'rgba(255, 0, 92, 0.1)',
                border: '1px solid rgba(255, 0, 92, 0.3)',
                color: 'var(--neon-pink)',
                padding: '10px 20px',
                borderRadius: '8px',
                cursor: 'pointer',
                fontFamily: 'Outfit',
                fontSize: '0.95rem',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255, 0, 92, 0.2)';
                e.currentTarget.style.borderColor = 'var(--neon-pink)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255, 0, 92, 0.1)';
                e.currentTarget.style.borderColor = 'rgba(255, 0, 92, 0.3)';
              }}
            >
              <Trash2 size={16} /> Delete Board
            </button>
          )}
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

          {/* Options & Voting */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <h3 style={{ fontFamily: 'Outfit', margin: 0, color: 'var(--text-primary)' }}>Available Options</h3>
            {decision.options && decision.options.length > 0 ? (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
                {decision.options.map(option => {
                  const isVoted = votedOptionId === option.id;
                  return (
                    <div key={option.id} className="glass-panel" style={{ 
                      padding: '24px', 
                      border: isVoted ? '1px solid var(--neon-cyan)' : '1px solid var(--glass-border)',
                      boxShadow: isVoted ? 'var(--glow-cyan)' : 'none',
                      display: 'flex', flexDirection: 'column', gap: '16px' 
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <h4 style={{ margin: 0, fontSize: '1.2rem', fontFamily: 'Outfit', color: 'var(--text-primary)' }}>{option.optionTitle}</h4>
                        <span style={{ background: 'rgba(0, 245, 255, 0.1)', color: 'var(--neon-cyan)', padding: '4px 10px', borderRadius: '12px', fontSize: '0.8rem', fontWeight: 'bold' }}>
                          Score: {option.score || 0}
                        </span>
                      </div>
                      
                      {option.description && (
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', margin: 0, lineHeight: '1.5' }}>
                          {option.description}
                        </p>
                      )}

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
                        {option.pros && (
                          <div style={{ fontSize: '0.85rem' }}>
                            <span style={{ color: 'var(--neon-cyan)', fontWeight: 'bold', marginRight: '6px' }}>Pros:</span>
                            <span style={{ color: 'var(--text-secondary)' }}>{option.pros}</span>
                          </div>
                        )}
                        {option.cons && (
                          <div style={{ fontSize: '0.85rem' }}>
                            <span style={{ color: 'var(--neon-pink)', fontWeight: 'bold', marginRight: '6px' }}>Cons:</span>
                            <span style={{ color: 'var(--text-secondary)' }}>{option.cons}</span>
                          </div>
                        )}
                      </div>

                      <button 
                        onClick={() => handleVote(option.id)}
                        className={isVoted ? 'btn-primary' : 'btn-secondary'}
                        style={{ width: '100%', marginTop: 'auto', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}
                      >
                        <CheckCircle size={18} /> {isVoted ? 'Voted' : 'Vote for this Option'}
                      </button>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p style={{ color: 'var(--text-secondary)' }}>No options have been provided for this decision.</p>
            )}
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
