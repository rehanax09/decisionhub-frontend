import React, { useState, useEffect } from 'react';
import {
  Star, MessageSquare, AlertCircle, FileText,
  Trash2, Send, ShieldCheck, ChevronDown, ChevronUp, Loader2
} from 'lucide-react';
import api from '../../api/api';
import { useToast } from '../../context/ToastContext';

/* ─── Helpers ─────────────────────────────────────────────────────── */
const getCategoryColor = (cat) => {
  const map = {
    Bug:        'var(--neon-pink)',
    Suggestion: 'var(--neon-cyan)',
    Question:   'var(--accent-purple)',
    General:    'var(--success)',
  };
  return map[cat] || 'var(--success)';
};

const StarRow = ({ rating, size = 14 }) => (
  <div style={{ display: 'flex', gap: '3px' }}>
    {[1, 2, 3, 4, 5].map(i => (
      <Star key={i} size={size} style={{
        color:  i <= rating ? '#FFD700' : 'rgba(255,255,255,0.12)',
        fill:   i <= rating ? '#FFD700' : 'transparent',
        filter: i <= rating ? 'drop-shadow(0 0 4px rgba(255,215,0,0.4))' : 'none',
      }} />
    ))}
  </div>
);

/* ─── Feedback Card Component ─────────────────────────────────────── */
const FeedbackCard = ({
  f, isAdmin,
  replyDraft, onDraftChange,
  replyOpen, onToggleReply,
  onPostReply, onDeleteReply, onDeleteFeedback,
}) => {
  const catColor = getCategoryColor(f.category || 'General');

  return (
    <div
      className="glass-panel"
      style={{
        padding: '24px',
        borderRadius: '16px',
        background: 'rgba(18,18,18,0.55)',
        display: 'flex',
        flexDirection: 'column',
        gap: '14px',
        border: f.adminReply
          ? '1px solid rgba(0,245,255,0.22)'
          : '1px solid rgba(255,255,255,0.05)',
        transition: 'transform 0.2s, box-shadow 0.2s',
      }}
      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,245,255,0.05)'; }}
      onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)';  e.currentTarget.style.boxShadow = 'none'; }}
    >
      {/* Top Header Row */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
        <div style={{
          width: '36px', height: '36px', borderRadius: '50%', flexShrink: 0,
          background: 'linear-gradient(135deg, var(--neon-cyan), var(--accent-purple))',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontWeight: 'bold', fontSize: '0.9rem', color: '#000',
        }}>
          {(f.username || 'A')[0].toUpperCase()}
        </div>

        <span style={{ color: 'var(--neon-cyan)', fontWeight: 'bold', fontSize: '0.95rem' }}>
          @{f.username || f.user?.username || 'anonymous'}
        </span>

        <span style={{
          padding: '3px 10px', borderRadius: '12px', fontSize: '0.72rem',
          fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.5px',
          color: catColor, background: `${catColor}15`, border: `1px solid ${catColor}30`,
        }}>
          {f.category || 'General'}
        </span>

        <span style={{ color: 'var(--text-secondary)', fontSize: '0.78rem', marginLeft: 'auto' }}>
          {f.createdAt ? new Date(f.createdAt).toLocaleString() : 'Just now'}
        </span>

        {/* Delete Feedback Button (Owner or Admin) */}
        {onDeleteFeedback && (
          <button
            onClick={() => onDeleteFeedback(f.id)}
            title="Delete feedback"
            style={{
              background: 'transparent', border: 'none', cursor: 'pointer',
              color: 'var(--neon-pink)', opacity: 0.6, transition: 'opacity 0.2s', padding: '2px',
            }}
            onMouseEnter={e => e.currentTarget.style.opacity = 1}
            onMouseLeave={e => e.currentTarget.style.opacity = 0.6}
          >
            <Trash2 size={15} />
          </button>
        )}
      </div>

      {/* Rating */}
      <StarRow rating={f.rating || 0} />

      {/* Message */}
      <p style={{
        margin: 0, color: 'var(--text-primary)',
        fontSize: '0.94rem', lineHeight: '1.65', whiteSpace: 'pre-wrap',
      }}>
        {f.comment || f.feedbackText || 'No comment provided.'}
      </p>

      {/* Admin Reply Display */}
      {f.adminReply && (
        <div style={{
          background: 'rgba(0,245,255,0.04)',
          border: '1px solid rgba(0,245,255,0.2)',
          borderRadius: '12px', padding: '14px 18px',
          display: 'flex', flexDirection: 'column', gap: '8px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ShieldCheck size={15} color="var(--neon-cyan)" />
              <span style={{
                color: 'var(--neon-cyan)', fontSize: '0.8rem',
                fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.5px',
              }}>
                Admin Reply
              </span>
              {f.adminRepliedAt && (
                <span style={{ color: 'var(--text-secondary)', fontSize: '0.74rem' }}>
                  · {new Date(f.adminRepliedAt).toLocaleString()}
                </span>
              )}
            </div>
            {isAdmin && (
              <button
                onClick={() => onDeleteReply(f.id)}
                title="Remove reply"
                style={{
                  background: 'transparent', border: 'none', cursor: 'pointer',
                  color: 'var(--neon-pink)', opacity: 0.6, transition: 'opacity 0.2s', padding: '2px',
                  display: 'flex', alignItems: 'center',
                }}
                onMouseEnter={e => e.currentTarget.style.opacity = 1}
                onMouseLeave={e => e.currentTarget.style.opacity = 0.6}
              >
                <Trash2 size={13} />
              </button>
            )}
          </div>
          <p style={{ margin: 0, color: 'var(--text-primary)', fontSize: '0.92rem', lineHeight: '1.6' }}>
            {f.adminReply}
          </p>
        </div>
      )}

      {/* Admin Reply Controls */}
      {isAdmin && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <button
            onClick={() => onToggleReply(f.id)}
            style={{
              alignSelf: 'flex-start',
              background: 'transparent',
              border: '1px solid rgba(0,245,255,0.25)',
              borderRadius: '8px',
              color: 'var(--neon-cyan)',
              cursor: 'pointer',
              padding: '7px 14px',
              fontSize: '0.84rem',
              display: 'flex', alignItems: 'center', gap: '6px',
              transition: 'background 0.2s',
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(0,245,255,0.08)'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
          >
            <MessageSquare size={14} />
            {f.adminReply
              ? (replyOpen ? 'Cancel Edit' : 'Edit Reply')
              : (replyOpen ? 'Cancel'      : 'Reply to User')}
            {replyOpen ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
          </button>

          {replyOpen && (
            <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-end' }}>
              <textarea
                rows={3}
                placeholder="Write your reply to this user…"
                value={replyDraft}
                onChange={e => onDraftChange(f.id, e.target.value)}
                className="input-premium"
                style={{
                  flex: 1, resize: 'none',
                  padding: '12px 14px', borderRadius: '10px',
                  fontSize: '0.9rem', lineHeight: '1.5',
                }}
              />
              <button
                onClick={() => onPostReply(f.id)}
                className="btn-primary"
                style={{
                  padding: '10px 18px', borderRadius: '10px',
                  display: 'flex', alignItems: 'center', gap: '6px',
                  fontSize: '0.85rem', whiteSpace: 'nowrap',
                  boxShadow: 'var(--glow-cyan)',
                }}
              >
                <Send size={14} /> Post Reply
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

/* ─── Main Page Component ─────────────────────────────────────────── */
const Feedback = () => {
  const { showToast } = useToast();
  const role = localStorage.getItem('role') || 'user';
  const isAdmin = role === 'admin';

  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState(null);

  const [activeSubTab, setActiveSubTab] = useState(isAdmin ? 'all' : 'submit');

  // Submit form state
  const [rating, setRating]           = useState(5);
  const [hoveredStar, setHoveredStar] = useState(-1);
  const [category, setCategory]       = useState('General');
  const [comment, setComment]         = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Admin reply state
  const [replyDrafts, setReplyDrafts] = useState({});
  const [replyOpen, setReplyOpen]     = useState({});

  /* ── 1. Fetch Feedbacks from Backend API ── */
  const fetchFeedbacks = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.get('/api/feedback');
      if (res.data?.success) {
        setFeedbacks(res.data.data || []);
      } else {
        setFeedbacks(res.data || []);
      }
    } catch (err) {
      console.error('Failed to fetch feedbacks:', err);
      setError(err.response?.data?.message || 'Failed to load feedbacks from server.');
      setFeedbacks([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  /* ── 2. Submit Feedback to Backend API ── */
  const handleSubmit = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!comment.trim()) {
      showToast('Please write your feedback message.', 'warning');
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        rating,
        category,
        comment: comment.trim(),
      };
      await api.post('/api/feedback', payload);
      showToast('Feedback submitted successfully to admin!', 'success');
      setComment('');
      setRating(5);
      setCategory('General');

      // Refresh feedbacks list from backend
      await fetchFeedbacks();
      if (!isAdmin) {
        setActiveSubTab('history');
      }
    } catch (err) {
      console.error('Failed to submit feedback:', err);
      showToast(err.response?.data?.message || 'Failed to submit feedback to backend.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  /* ── 3. Toggle Admin Reply Box ── */
  const handleToggleReply = (id) => {
    setReplyOpen(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
    const currentFeedback = feedbacks.find(f => f.id === id);
    if (currentFeedback && currentFeedback.adminReply && !replyDrafts[id]) {
      setReplyDrafts(prev => ({ ...prev, [id]: currentFeedback.adminReply }));
    }
  };

  const handleDraftChange = (id, val) =>
    setReplyDrafts(prev => ({ ...prev, [id]: val }));

  /* ── 4. Post Admin Reply to Backend API ── */
  const handlePostReply = async (id) => {
    const text = (replyDrafts[id] || '').trim();
    if (!text) {
      showToast('Reply cannot be empty.', 'warning');
      return;
    }
    try {
      await api.post(`/api/feedback/${id}/reply`, { adminReply: text });
      showToast('Reply posted successfully!', 'success');
      setReplyDrafts(prev => ({ ...prev, [id]: '' }));
      setReplyOpen(prev => ({ ...prev, [id]: false }));
      await fetchFeedbacks();
    } catch (err) {
      console.error('Failed to post reply:', err);
      showToast(err.response?.data?.message || 'Failed to post reply to backend.', 'error');
    }
  };

  /* ── 5. Delete Admin Reply from Backend API ── */
  const handleDeleteReply = async (id) => {
    try {
      await api.delete(`/api/feedback/${id}/reply`);
      showToast('Reply removed successfully.', 'success');
      await fetchFeedbacks();
    } catch (err) {
      console.error('Failed to delete reply:', err);
      showToast(err.response?.data?.message || 'Failed to delete reply.', 'error');
    }
  };

  /* ── 6. Delete Feedback Entry from Backend API ── */
  const handleDeleteFeedback = async (id) => {
    if (!window.confirm('Are you sure you want to delete this feedback?')) return;
    try {
      await api.delete(`/api/feedback/${id}`);
      showToast('Feedback deleted successfully.', 'success');
      await fetchFeedbacks();
    } catch (err) {
      console.error('Failed to delete feedback:', err);
      showToast(err.response?.data?.message || 'Failed to delete feedback.', 'error');
    }
  };

  const avgRating = feedbacks.length
    ? (feedbacks.reduce((s, f) => s + (f.rating || 0), 0) / feedbacks.length).toFixed(1)
    : '0.0';

  const repliedCount = feedbacks.filter(f => f.adminReply).length;

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', width: '100%' }}>

      <style>{`
        .fb-tab {
          background: transparent; border: none; color: var(--text-secondary);
          padding: 12px 0; font-size: 1.05rem; font-family: 'Outfit', sans-serif;
          border-bottom: 2px solid transparent; cursor: pointer; transition: all 0.3s;
        }
        .fb-tab.active {
          color: var(--neon-cyan); border-bottom: 2px solid var(--neon-cyan); font-weight: 600;
        }
      `}</style>

      {/* Header */}
      <div style={{ marginBottom: '28px' }}>
        <h1 className="text-gradient" style={{ fontSize: '2.4rem', fontFamily: 'Outfit', margin: '0 0 8px 0' }}>
          System Feedback
        </h1>
        <p style={{ color: 'var(--text-secondary)', margin: 0 }}>
          {isAdmin
            ? 'Review user feedback submissions and reply directly to users.'
            : 'Share your thoughts, report bugs, or suggest new features.'}
        </p>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '28px', borderBottom: '1px solid var(--glass-border)', marginBottom: '28px' }}>
        {!isAdmin && (
          <>
            <button
              className={`fb-tab ${activeSubTab === 'submit' ? 'active' : ''}`}
              onClick={() => setActiveSubTab('submit')}
            >
              Submit Feedback
            </button>
            <button
              className={`fb-tab ${activeSubTab === 'history' ? 'active' : ''}`}
              onClick={() => setActiveSubTab('history')}
            >
              My History ({feedbacks.length})
            </button>
          </>
        )}
        {isAdmin && (
          <button
            className={`fb-tab ${activeSubTab === 'all' ? 'active' : ''}`}
            onClick={() => setActiveSubTab('all')}
          >
            All Submissions ({feedbacks.length})
          </button>
        )}
      </div>

      {/* ══ Submit Tab ══ */}
      {activeSubTab === 'submit' && (
        <div className="glass-panel" style={{ padding: '40px', borderRadius: '24px', background: 'rgba(18,18,18,0.6)' }}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

            {/* Rating Stars */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
              <label style={{ fontSize: '1.05rem', fontFamily: 'Outfit', fontWeight: '600', color: 'var(--text-primary)' }}>
                How would you rate your experience?
              </label>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', margin: 0 }}>Tap a star to rate from 1 to 5.</p>
              <div style={{ display: 'flex', gap: '12px', marginTop: '6px' }}>
                {[1, 2, 3, 4, 5].map(s => {
                  const filled = hoveredStar !== -1 ? s <= hoveredStar : s <= rating;
                  return (
                    <Star key={s} size={36}
                      onClick={() => setRating(s)}
                      onMouseEnter={() => setHoveredStar(s)}
                      onMouseLeave={() => setHoveredStar(-1)}
                      style={{
                        cursor: 'pointer',
                        color:  filled ? '#FFD700' : 'var(--text-secondary)',
                        fill:   filled ? '#FFD700' : 'transparent',
                        filter: filled ? 'drop-shadow(0 0 8px rgba(255,215,0,0.5))' : 'none',
                        transition: 'all 0.15s ease',
                      }}
                    />
                  );
                })}
              </div>
            </div>

            <hr style={{ border: 'none', borderTop: '1px solid var(--glass-border)' }} />

            {/* Category selection */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '0.95rem', fontWeight: '600', color: 'var(--text-primary)' }}>Category</label>
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                {['General', 'Bug', 'Suggestion', 'Question'].map(cat => {
                  const sel = category === cat;
                  const col = getCategoryColor(cat);
                  return (
                    <button key={cat} type="button" onClick={() => setCategory(cat)} style={{
                      padding: '10px 20px', borderRadius: '20px', cursor: 'pointer',
                      border:     sel ? `1px solid ${col}` : '1px solid var(--glass-border)',
                      background: sel ? `${col}15` : 'rgba(255,255,255,0.01)',
                      color:      sel ? col : 'var(--text-secondary)',
                      fontWeight: sel ? 'bold' : 'normal',
                      boxShadow:  sel ? `0 0 8px ${col}30` : 'none',
                      transition: 'all 0.2s',
                    }}>
                      {cat}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Comment area */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '0.95rem', fontWeight: '600', color: 'var(--text-primary)' }}>Your Message</label>
              <textarea
                required rows={5}
                placeholder="Describe your thoughts, bug details, or feature idea…"
                value={comment}
                onChange={e => setComment(e.target.value)}
                className="input-premium"
                style={{ resize: 'none', padding: '16px', borderRadius: '12px', fontSize: '0.95rem' }}
              />
            </div>

            <button
              type="submit" className="btn-primary" disabled={isSubmitting}
              style={{
                padding: '14px', fontSize: '1rem',
                display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px',
                boxShadow: 'var(--glow-cyan)',
              }}
            >
              {isSubmitting ? <Loader2 size={18} className="spin" /> : <MessageSquare size={18} />}
              {isSubmitting ? 'Sending to Server…' : 'Send Feedback to Admin'}
            </button>
          </form>
        </div>
      )}

      {/* ══ User History Tab ══ */}
      {activeSubTab === 'history' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {loading ? (
            <div style={{ padding: '60px', textAlign: 'center', color: 'var(--text-secondary)' }} className="glass-panel">
              <Loader2 size={32} style={{ animation: 'spin 1s linear infinite', marginBottom: '12px', color: 'var(--neon-cyan)' }} />
              <p style={{ margin: 0 }}>Loading your feedback history from server...</p>
            </div>
          ) : error ? (
            <div style={{ padding: '40px', textAlign: 'center', color: 'var(--neon-pink)' }} className="glass-panel">
              <AlertCircle size={36} style={{ marginBottom: '12px' }} />
              <p style={{ margin: 0 }}>{error}</p>
            </div>
          ) : feedbacks.length === 0 ? (
            <div style={{ padding: '60px', textAlign: 'center', color: 'var(--text-secondary)', border: '1px dashed var(--glass-border)', borderRadius: '16px' }}>
              <FileText size={40} style={{ opacity: 0.4, marginBottom: '16px' }} />
              <p style={{ margin: 0, fontStyle: 'italic' }}>You haven't submitted any feedback yet.</p>
            </div>
          ) : feedbacks.map(f => (
            <FeedbackCard
              key={f.id}
              f={f}
              isAdmin={false}
              replyDraft={replyDrafts[f.id] || ''}
              onDraftChange={handleDraftChange}
              replyOpen={!!replyOpen[f.id]}
              onToggleReply={handleToggleReply}
              onPostReply={handlePostReply}
              onDeleteReply={handleDeleteReply}
              onDeleteFeedback={handleDeleteFeedback}
            />
          ))}
        </div>
      )}

      {/* ══ Admin All Submissions Tab ══ */}
      {activeSubTab === 'all' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

          {/* Summary Bar */}
          <div className="glass-panel" style={{
            padding: '20px 28px', borderRadius: '16px',
            background: 'rgba(18,18,18,0.7)', border: '1px solid rgba(255,255,255,0.05)',
            display: 'flex', alignItems: 'center', gap: '20px',
          }}>
            <div style={{
              width: '48px', height: '48px', borderRadius: '50%', fontSize: '1.4rem',
              background: 'rgba(255,215,0,0.08)', border: '1px solid rgba(255,215,0,0.25)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>🏆</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 'bold' }}>
                Average Rating
              </span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontSize: '1.8rem', fontWeight: '800', fontFamily: 'Outfit', lineHeight: 1, color: 'var(--text-primary)' }}>
                  {avgRating} <span style={{ fontSize: '1rem', color: 'var(--text-secondary)', fontWeight: 'normal' }}>/ 5.0</span>
                </span>
                <StarRow rating={Math.round(Number(avgRating))} size={16} />
                <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>· {feedbacks.length} submissions</span>
                <span style={{ color: 'var(--neon-cyan)', fontSize: '0.82rem' }}>· {repliedCount} replied</span>
              </div>
            </div>
          </div>

          {/* Feedbacks list */}
          {loading ? (
            <div style={{ padding: '60px', textAlign: 'center', color: 'var(--text-secondary)' }} className="glass-panel">
              <Loader2 size={32} style={{ animation: 'spin 1s linear infinite', marginBottom: '12px', color: 'var(--neon-cyan)' }} />
              <p style={{ margin: 0 }}>Loading feedback submissions from server...</p>
            </div>
          ) : error ? (
            <div style={{ padding: '40px', textAlign: 'center', color: 'var(--neon-pink)' }} className="glass-panel">
              <AlertCircle size={36} style={{ marginBottom: '12px' }} />
              <p style={{ margin: 0 }}>{error}</p>
            </div>
          ) : feedbacks.length === 0 ? (
            <div style={{ padding: '60px', textAlign: 'center', color: 'var(--text-secondary)', border: '1px dashed var(--glass-border)', borderRadius: '16px' }}>
              <AlertCircle size={40} style={{ opacity: 0.4, marginBottom: '16px' }} />
              <p style={{ margin: 0, fontStyle: 'italic' }}>No feedback submissions received yet.</p>
            </div>
          ) : feedbacks.map(f => (
            <FeedbackCard
              key={f.id}
              f={f}
              isAdmin={true}
              replyDraft={replyDrafts[f.id] || ''}
              onDraftChange={handleDraftChange}
              replyOpen={!!replyOpen[f.id]}
              onToggleReply={handleToggleReply}
              onPostReply={handlePostReply}
              onDeleteReply={handleDeleteReply}
              onDeleteFeedback={handleDeleteFeedback}
            />
          ))}
        </div>
      )}

    </div>
  );
};

export default Feedback;
