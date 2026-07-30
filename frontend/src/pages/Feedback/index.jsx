import React, { useState, useEffect } from 'react';
import { Star, MessageSquare, AlertCircle, FileText, CheckCircle, Trash2, Check } from 'lucide-react';
import api from '../../api/api';
import { useToast } from '../../context/ToastContext';

const Feedback = () => {
  const { showToast } = useToast();
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [rating, setRating] = useState(5);
  const [hoveredStar, setHoveredStar] = useState(-1);
  const [category, setCategory] = useState('General');
  const [comment, setComment] = useState('');
  const role = localStorage.getItem('role') || 'user';
  const isAdmin = role === 'admin';

  const [activeSubTab, setActiveSubTab] = useState(isAdmin ? 'all' : 'submit');

  const fetchFeedbacks = async () => {
    try {
      setLoading(true);
      const res = await api.get('/api/feedback');
      if (res.data?.success) {
        setFeedbacks(res.data.data || res.data || []);
      } else {
        setFeedbacks(res.data || []);
      }
    } catch (err) {
      console.error('Failed to fetch feedback:', err);
      // Fallback to empty if not created yet
      setFeedbacks([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const handleSubmit = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!comment.trim()) {
      showToast('Please enter your feedback comments.', 'warning');
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        rating,
        category,
        comment: comment.trim(),
        feedbackText: comment.trim() // send both to be safe
      };
      
      await api.post('/api/feedback', payload);
      showToast('Feedback submitted successfully to admin!', 'success');
      setComment('');
      setRating(5);
      setCategory('General');
      
      // Refresh list
      await fetchFeedbacks();
      if (!isAdmin) {
        setActiveSubTab('history');
      }
    } catch (err) {
      console.error('Failed to submit feedback:', err);
      showToast(err.response?.data?.message || 'Failed to submit feedback.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteFeedback = async (feedbackId) => {
    if (!window.confirm('Are you sure you want to delete this feedback?')) return;
    try {
      await api.delete(`/api/feedback/${feedbackId}`);
      showToast('Feedback deleted successfully.', 'success');
      await fetchFeedbacks();
    } catch (err) {
      console.error('Failed to delete feedback:', err);
      showToast(err.response?.data?.message || 'Failed to delete feedback.', 'error');
    }
  };

  const getCategoryColor = (cat) => {
    switch (cat) {
      case 'Bug':
        return 'var(--neon-pink)';
      case 'Suggestion':
        return 'var(--neon-cyan)';
      case 'Question':
        return 'var(--accent-purple)';
      default:
        return 'var(--success)';
    }
  };

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', width: '100%' }}>
      
      {/* Custom Styles */}
      <style>{`
        .feedback-tab-btn {
          background: transparent;
          border: none;
          color: var(--text-secondary);
          padding: 12px 0;
          font-size: 1.1rem;
          font-family: 'Outfit', sans-serif;
          border-bottom: 2px solid transparent;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        .feedback-tab-btn.active {
          color: var(--neon-cyan);
          border-bottom: 2px solid var(--neon-cyan);
          font-weight: 600;
        }
        .feedback-card-glow {
          border: 1px solid rgba(255, 255, 255, 0.05);
          transition: transform 0.2s, box-shadow 0.2s, border-color 0.2s;
        }
        .feedback-card-glow:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(0, 245, 255, 0.02);
          border-color: rgba(0, 245, 255, 0.1);
        }
        .cat-chip {
          padding: 4px 10px;
          border-radius: 12px;
          font-size: 0.78rem;
          font-weight: bold;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
      `}</style>

      {/* Header */}
      <div style={{ marginBottom: '30px' }}>
        <h1 style={{ fontSize: '2.5rem', fontFamily: 'Outfit', margin: '0 0 8px 0', textShadow: '0 0 10px rgba(0, 245, 255, 0.2)' }} className="text-gradient">
          System Feedback
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', margin: 0 }}>
          {isAdmin 
            ? 'Monitor and manage user feedback, bug reports, and suggestions.' 
            : 'Help us improve DecisionHub. Share your thoughts, report bugs, or suggest features.'
          }
        </p>
      </div>

      {/* Sub Tabs */}
      <div style={{ display: 'flex', gap: '24px', borderBottom: '1px solid var(--glass-border)', marginBottom: '30px' }}>
        {!isAdmin && (
          <>
            <button 
              className={`feedback-tab-btn ${activeSubTab === 'submit' ? 'active' : ''}`}
              onClick={() => setActiveSubTab('submit')}
            >
              Submit Feedback
            </button>
            <button 
              className={`feedback-tab-btn ${activeSubTab === 'history' ? 'active' : ''}`}
              onClick={() => setActiveSubTab('history')}
            >
              My Submissions ({feedbacks.length})
            </button>
          </>
        )}
        {isAdmin && (
          <button 
            className={`feedback-tab-btn ${activeSubTab === 'all' ? 'active' : ''}`}
            onClick={() => setActiveSubTab('all')}
          >
            All Feedback Feed ({feedbacks.length})
          </button>
        )}
      </div>

      {/* Tab Contents */}
      {activeSubTab === 'submit' && (
        <div className="glass-panel" style={{ padding: '40px', borderRadius: '24px', background: 'rgba(20, 20, 20, 0.6)' }}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            
            {/* Rating Selector */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'center' }}>
              <label style={{ fontSize: '1.1rem', color: 'var(--text-primary)', fontFamily: 'Outfit', fontWeight: '600' }}>
                How would you rate your experience?
              </label>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', margin: '0 0 10px 0' }}>
                Tap a star to rate from 1 to 5.
              </p>
              
              <div style={{ display: 'flex', gap: '12px' }}>
                {[1, 2, 3, 4, 5].map((starIndex) => {
                  const isFilled = hoveredStar !== -1 ? starIndex <= hoveredStar : starIndex <= rating;
                  return (
                    <Star
                      key={starIndex}
                      size={36}
                      onClick={() => setRating(starIndex)}
                      onMouseEnter={() => setHoveredStar(starIndex)}
                      onMouseLeave={() => setHoveredStar(-1)}
                      style={{
                        cursor: 'pointer',
                        color: isFilled ? '#FFD700' : 'var(--text-secondary)',
                        fill: isFilled ? '#FFD700' : 'transparent',
                        filter: isFilled ? 'drop-shadow(0 0 8px rgba(255, 215, 0, 0.5))' : 'none',
                        transition: 'all 0.15s ease'
                      }}
                    />
                  );
                })}
              </div>
            </div>

            <hr style={{ border: 'none', borderTop: '1px solid var(--glass-border)', margin: '10px 0' }} />

            {/* Category selection */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '0.95rem', color: 'var(--text-primary)', fontWeight: '600' }}>Category</label>
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                {['General', 'Bug', 'Suggestion', 'Question'].map((cat) => {
                  const isSelected = category === cat;
                  const catColor = getCategoryColor(cat);
                  return (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setCategory(cat)}
                      style={{
                        padding: '10px 20px',
                        borderRadius: '20px',
                        border: isSelected ? `1px solid ${catColor}` : '1px solid var(--glass-border)',
                        background: isSelected ? `${catColor}15` : 'rgba(255, 255, 255, 0.01)',
                        color: isSelected ? catColor : 'var(--text-secondary)',
                        fontWeight: isSelected ? 'bold' : 'normal',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        boxShadow: isSelected ? `0 0 8px ${catColor}30` : 'none'
                      }}
                    >
                      {cat}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Comment Message */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '0.95rem', color: 'var(--text-primary)', fontWeight: '600' }}>Your Message</label>
              <textarea
                required
                rows={5}
                placeholder="Share your thoughts, describe a bug in detail, or write feature suggestions..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="input-premium"
                style={{ resize: 'none', padding: '16px', borderRadius: '12px', fontSize: '0.95rem' }}
              />
            </div>

            <button
              type="submit"
              className="btn-primary"
              disabled={isSubmitting}
              style={{ padding: '14px', fontSize: '1rem', marginTop: '10px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px', boxShadow: 'var(--glow-cyan)' }}
            >
              <MessageSquare size={18} />
              {isSubmitting ? 'Sending feedback...' : 'Send Feedback to Admin'}
            </button>

          </form>
        </div>
      )}

      {/* History Sub-tab */}
      {activeSubTab === 'history' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {loading ? (
            <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)' }} className="glass-panel">
              <p>Loading your feedback history...</p>
            </div>
          ) : feedbacks.length === 0 ? (
            <div style={{ padding: '60px', textAlign: 'center', color: 'var(--text-secondary)', borderRadius: '16px', border: '1px dashed var(--glass-border)', background: 'rgba(255,255,255,0.01)' }}>
              <FileText size={40} style={{ color: 'var(--text-secondary)', marginBottom: '16px', opacity: 0.5 }} />
              <p style={{ margin: 0, fontSize: '0.98rem', fontStyle: 'italic' }}>
                You have not submitted any feedbacks yet.
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {feedbacks.map((f, idx) => {
                const catColor = getCategoryColor(f.category || 'General');
                return (
                  <div 
                    key={f.id || idx} 
                    className="glass-panel feedback-card-glow" 
                    style={{ padding: '24px', borderRadius: '16px', background: 'rgba(20, 20, 20, 0.45)', display: 'flex', flexDirection: 'column', gap: '12px' }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span className="cat-chip" style={{ color: catColor, background: `${catColor}15`, border: `1px solid ${catColor}30` }}>
                        {f.category || 'General'}
                      </span>
                      <span style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>
                        {f.createdAt ? new Date(f.createdAt).toLocaleString() : 'Just now'}
                      </span>
                    </div>

                    <div style={{ display: 'flex', gap: '4px' }}>
                      {[1, 2, 3, 4, 5].map(sIdx => {
                        const isFilled = sIdx <= (f.rating || 0);
                        return (
                          <Star 
                            key={sIdx} 
                            size={14} 
                            style={{ 
                              color: isFilled ? '#FFD700' : 'rgba(255,255,255,0.08)', 
                              fill: isFilled ? '#FFD700' : 'transparent',
                              filter: isFilled ? 'drop-shadow(0 0 3px rgba(255, 215, 0, 0.3))' : 'none'
                            }} 
                          />
                        );
                      })}
                    </div>

                    <p style={{ margin: 0, color: 'var(--text-primary)', fontSize: '0.95rem', lineHeight: '1.6', whiteSpace: 'pre-wrap' }}>
                      {f.feedbackText || f.comment || 'No comment provided.'}
                    </p>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Admin View All Feedbacks Sub-tab */}
      {activeSubTab === 'all' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* Average Rating Summary Card */}
          {feedbacks.length > 0 && (() => {
            const avgRating = (feedbacks.reduce((sum, f) => sum + (f.rating || 0), 0) / feedbacks.length).toFixed(1);
            return (
              <div className="glass-panel" style={{ padding: '24px 30px', borderRadius: '16px', background: 'rgba(20, 20, 20, 0.7)', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', gap: '20px' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'rgba(255,215,0,0.08)', border: '1px solid rgba(255,215,0,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' }}>
                  🏆
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <span style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 'bold' }}>
                    Average Application Rating
                  </span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ fontSize: '1.8rem', fontWeight: '800', color: 'var(--text-primary)', fontFamily: 'Outfit', lineHeight: 1 }}>
                      {avgRating} <span style={{ fontSize: '1rem', color: 'var(--text-secondary)', fontWeight: 'normal' }}>/ 5.0</span>
                    </span>
                    <div style={{ display: 'flex', gap: '3px' }}>
                      {[1, 2, 3, 4, 5].map(sIdx => {
                        const isFilled = sIdx <= Math.round(Number(avgRating));
                        return (
                          <Star 
                            key={sIdx} 
                            size={16} 
                            style={{ 
                              color: isFilled ? '#FFD700' : 'rgba(255,255,255,0.1)', 
                              fill: isFilled ? '#FFD700' : 'transparent',
                              filter: isFilled ? 'drop-shadow(0 0 4px rgba(255, 215, 0, 0.4))' : 'none'
                            }} 
                          />
                        );
                      })}
                    </div>
                    <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                      • ({feedbacks.length} submissions)
                    </span>
                  </div>
                </div>
              </div>
            );
          })()}

          {loading ? (
            <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)' }} className="glass-panel">
              <p>Loading feedback feed...</p>
            </div>
          ) : feedbacks.length === 0 ? (
            <div style={{ padding: '60px', textAlign: 'center', color: 'var(--text-secondary)', borderRadius: '16px', border: '1px dashed var(--glass-border)', background: 'rgba(255,255,255,0.01)' }}>
              <AlertCircle size={40} style={{ color: 'var(--text-secondary)', marginBottom: '16px', opacity: 0.5 }} />
              <p style={{ margin: 0, fontSize: '0.98rem', fontStyle: 'italic' }}>
                No feedback has been received from users yet.
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {feedbacks.map((f, idx) => {
                const catColor = getCategoryColor(f.category || 'General');
                return (
                  <div 
                    key={f.id || idx} 
                    className="glass-panel feedback-card-glow" 
                    style={{ padding: '24px', borderRadius: '16px', background: 'rgba(20, 20, 20, 0.45)', display: 'flex', flexDirection: 'column', gap: '14px', position: 'relative' }}
                  >
                    {/* Delete button for Admin */}
                    {f.id && (
                      <button
                        onClick={() => handleDeleteFeedback(f.id)}
                        style={{ position: 'absolute', top: '24px', right: '24px', background: 'transparent', border: 'none', color: 'var(--neon-pink)', cursor: 'pointer', opacity: 0.6, transition: 'opacity 0.2s' }}
                        onMouseEnter={e => e.currentTarget.style.opacity = 1}
                        onMouseLeave={e => e.currentTarget.style.opacity = 0.6}
                        title="Delete Feedback"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}

                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
                      <span style={{ color: 'var(--neon-cyan)', fontWeight: 'bold', fontSize: '0.95rem' }}>
                        @{f.username || f.user?.username || 'Anonymous'}
                      </span>
                      <span className="cat-chip" style={{ color: catColor, background: `${catColor}15`, border: `1px solid ${catColor}30`, fontSize: '0.7rem' }}>
                        {f.category || 'General'}
                      </span>
                      <span style={{ color: 'var(--text-secondary)', fontSize: '0.78rem', marginLeft: 'auto', marginRight: f.id ? '24px' : '0' }}>
                        {f.createdAt ? new Date(f.createdAt).toLocaleString() : 'Just now'}
                      </span>
                    </div>

                    <div style={{ display: 'flex', gap: '4px' }}>
                      {[1, 2, 3, 4, 5].map(sIdx => {
                        const isFilled = sIdx <= (f.rating || 0);
                        return (
                          <Star 
                            key={sIdx} 
                            size={14} 
                            style={{ 
                              color: isFilled ? '#FFD700' : 'rgba(255,255,255,0.08)', 
                              fill: isFilled ? '#FFD700' : 'transparent',
                              filter: isFilled ? 'drop-shadow(0 0 3px rgba(255, 215, 0, 0.3))' : 'none'
                            }} 
                          />
                        );
                      })}
                    </div>

                    <p style={{ margin: 0, color: 'var(--text-primary)', fontSize: '0.94rem', lineHeight: '1.6', whiteSpace: 'pre-wrap', paddingRight: '15px' }}>
                      {f.feedbackText || f.comment || 'No comment provided.'}
                    </p>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

    </div>
  );
};

export default Feedback;
