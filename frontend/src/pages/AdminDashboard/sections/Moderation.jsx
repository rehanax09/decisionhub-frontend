import React, { useState, useEffect } from 'react';
import {
  AlertTriangle, Trash2, ShieldOff, AlertOctagon, CheckCircle2,
  RefreshCw, Filter, ShieldCheck, Eye, MessageSquare, AlertCircle
} from 'lucide-react';
import api from '../../../api/api';

const typeColors = {
  BOARD: 'var(--neon-cyan)',
  DECISION: 'var(--neon-cyan)',
  POLL: 'var(--accent-purple)',
  USER: 'var(--neon-pink)',
  COMMENT: '#FF9500',
  COMMUNITY: 'var(--success)'
};

const Moderation = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('PENDING');
  const [actionModal, setActionModal] = useState(null); // { report, actionType: 'WARN' | 'BAN' | 'DELETE' }
  const [modalNotes, setModalNotes] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  const fetchReports = async () => {
    setLoading(true);
    try {
      const res = await api.get('/api/moderation/reports', {
        params: {
          status: statusFilter,
          type: typeFilter
        }
      });
      if (res.data?.success && res.data.data) {
        setReports(res.data.data);
      }
    } catch (err) {
      console.error('Failed to fetch moderation reports:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, [typeFilter, statusFilter]);

  const handleDismiss = async (id) => {
    try {
      await api.post(`/api/moderation/reports/${id}/dismiss`);
      setReports(prev => prev.filter(r => r.id !== id));
    } catch (err) {
      console.error('Failed to dismiss report:', err);
      alert('Failed to dismiss report.');
    }
  };

  const handleExecuteAction = async () => {
    if (!actionModal) return;
    setActionLoading(true);
    const { report, actionType } = actionModal;

    try {
      let action = 'DISMISS';
      if (actionType === 'WARN') action = 'WARN';
      else if (actionType === 'DELETE') action = 'DELETE_CONTENT';
      else if (actionType === 'SUSPEND') action = 'SUSPEND_USER';
      else if (actionType === 'BAN') action = 'BAN_USER';

      await api.post(`/api/moderation/reports/${report.id}/action`, {
        action: action,
        moderatorNotes: modalNotes,
        warningMessage: modalNotes || undefined
      });

      setReports(prev => prev.filter(r => r.id !== report.id));
      setActionModal(null);
      setModalNotes('');
    } catch (err) {
      console.error('Failed to execute moderation action:', err);
      alert(err.response?.data?.message || 'Failed to execute moderation action.');
    } finally {
      setActionLoading(false);
    }
  };

  const pendingCount = reports.filter(r => r.status === 'PENDING').length;
  const boardReportsCount = reports.filter(r => r.targetType === 'BOARD' || r.targetType === 'DECISION').length;
  const userReportsCount = reports.filter(r => r.targetType === 'USER').length;
  const commentReportsCount = reports.filter(r => r.targetType === 'COMMENT').length;

  return (
    <div>
      {/* Metrics Header */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '28px' }}>
        {[
          { label: 'Active Reports', value: reports.length, color: 'var(--neon-pink)', icon: AlertTriangle },
          { label: 'Board Reports', value: boardReportsCount, color: 'var(--neon-cyan)', icon: Eye },
          { label: 'User Reports', value: userReportsCount, color: 'var(--accent-purple)', icon: ShieldOff },
          { label: 'Comment Reports', value: commentReportsCount, color: '#FF9500', icon: MessageSquare },
        ].map((s, i) => (
          <div key={i} className="glass-panel" style={{ padding: '20px', borderLeft: `3px solid ${s.color}` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
              <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.82rem' }}>{s.label}</p>
              <s.icon size={18} color={s.color} />
            </div>
            <h3 style={{ margin: 0, fontSize: '1.8rem', fontFamily: 'Outfit', color: s.color }}>
              {loading ? '—' : s.value}
            </h3>
          </div>
        ))}
      </div>

      {/* Filter and Action Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '16px' }}>
        {/* Type Filter Buttons */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {['ALL', 'BOARD', 'POLL', 'COMMENT', 'USER', 'COMMUNITY'].map(f => (
            <button
              key={f}
              onClick={() => setTypeFilter(f)}
              style={{
                padding: '6px 16px',
                borderRadius: '20px',
                border: '1px solid var(--glass-border)',
                background: typeFilter === f ? 'var(--neon-cyan)' : 'rgba(255, 255, 255, 0.05)',
                color: typeFilter === f ? '#0a0a0f' : 'var(--text-secondary)',
                cursor: 'pointer',
                fontSize: '0.8rem',
                fontWeight: typeFilter === f ? '700' : '500',
                transition: 'all 0.2s'
              }}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Status Filter & Refresh */}
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{
              padding: '7px 12px',
              background: 'var(--bg-secondary)',
              border: '1px solid var(--glass-border)',
              borderRadius: '8px',
              color: 'var(--text-primary)',
              fontSize: '0.82rem',
              outline: 'none'
            }}
          >
            <option value="PENDING">Pending Review</option>
            <option value="ACTION_TAKEN">Action Taken</option>
            <option value="DISMISSED">Dismissed</option>
            <option value="ALL">All Statuses</option>
          </select>

          <button
            onClick={fetchReports}
            className="btn-secondary"
            style={{ padding: '7px 14px', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem' }}
          >
            <RefreshCw size={14} className={loading ? 'spin' : ''} /> Refresh
          </button>
        </div>
      </div>

      {/* Reports List */}
      {loading ? (
        <div className="glass-panel" style={{ padding: '60px', textAlign: 'center', color: 'var(--text-secondary)' }}>
          <RefreshCw size={32} className="spin" style={{ margin: '0 auto 12px auto', display: 'block', color: 'var(--neon-cyan)' }} />
          <p>Loading moderation queue...</p>
        </div>
      ) : reports.length === 0 ? (
        <div className="glass-panel" style={{ padding: '60px', textAlign: 'center', color: 'var(--text-secondary)' }}>
          <ShieldCheck size={48} color="var(--success)" style={{ margin: '0 auto 12px auto', display: 'block', opacity: 0.8 }} />
          <h4 style={{ fontFamily: 'Outfit', fontSize: '1.2rem', margin: '0 0 6px 0', color: 'var(--text-primary)' }}>Moderation Queue Clean</h4>
          <p style={{ margin: 0, fontSize: '0.9rem' }}>No reports matching current filter criteria.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {reports.map(r => {
            const color = typeColors[r.targetType] || 'var(--neon-cyan)';
            return (
              <div
                key={r.id}
                className="glass-panel"
                style={{
                  padding: '20px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: '20px',
                  flexWrap: 'wrap',
                  borderLeft: `4px solid ${r.status === 'PENDING' ? 'var(--neon-pink)' : 'var(--glass-border)'}`
                }}
              >
                <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flex: 1, minWidth: '280px' }}>
                  <div style={{ padding: '12px', borderRadius: '12px', background: `${color}20`, flexShrink: 0 }}>
                    <AlertTriangle color={color} size={22} />
                  </div>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px', flexWrap: 'wrap' }}>
                      <span style={{
                        padding: '2px 8px',
                        borderRadius: '12px',
                        fontSize: '0.7rem',
                        fontWeight: 'bold',
                        background: `${color}20`,
                        color: color,
                        border: `1px solid ${color}40`
                      }}>
                        {r.targetType}
                      </span>
                      <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: '600' }}>{r.targetTitle}</h4>
                      {r.status !== 'PENDING' && (
                        <span style={{
                          padding: '2px 8px',
                          borderRadius: '12px',
                          fontSize: '0.7rem',
                          background: r.status === 'ACTION_TAKEN' ? 'rgba(0,255,153,0.15)' : 'rgba(255,255,255,0.1)',
                          color: r.status === 'ACTION_TAKEN' ? 'var(--success)' : 'var(--text-secondary)'
                        }}>
                          {r.status} ({r.actionTaken})
                        </span>
                      )}
                    </div>
                    <p style={{ margin: 0, fontSize: '0.85rem', color: '#ff6b6b', fontWeight: '500' }}>
                      Reason: {r.reason}
                    </p>
                    {r.details && (
                      <p style={{ margin: '4px 0 0 0', fontSize: '0.82rem', color: 'var(--text-primary)', fontStyle: 'italic' }}>
                        "{r.details}"
                      </p>
                    )}
                    <p style={{ margin: '4px 0 0 0', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                      Reported by <strong style={{ color: 'var(--text-primary)' }}>{r.reporterUsername || 'Anonymous'}</strong>
                      {r.reportedUsername && (
                        <> · Author: <strong style={{ color: 'var(--neon-cyan)' }}>@{r.reportedUsername}</strong></>
                      )}
                      {' · '}{r.createdAt ? new Date(r.createdAt).toLocaleDateString() : 'Recent'}
                    </p>
                  </div>
                </div>

                {r.status === 'PENDING' ? (
                  <div style={{ display: 'flex', gap: '8px', flexShrink: 0, alignItems: 'center' }}>
                    <button
                      onClick={() => handleDismiss(r.id)}
                      className="btn-secondary"
                      style={{ padding: '8px 14px', fontSize: '0.8rem', color: 'var(--success)', borderColor: 'rgba(0,255,153,0.3)' }}
                    >
                      Dismiss
                    </button>
                    <button
                      onClick={() => setActionModal({ report: r, actionType: 'WARN' })}
                      style={{
                        padding: '8px 12px',
                        borderRadius: '8px',
                        border: '1px solid rgba(255,165,0,0.4)',
                        background: 'rgba(255,165,0,0.1)',
                        color: '#FF9500',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        fontSize: '0.8rem'
                      }}
                      title="Send Official Warning"
                    >
                      <AlertOctagon size={15} /> Warn
                    </button>
                    <button
                      onClick={() => setActionModal({ report: r, actionType: 'DELETE' })}
                      style={{
                        padding: '8px 12px',
                        borderRadius: '8px',
                        border: '1px solid rgba(255,0,0,0.4)',
                        background: 'rgba(255,0,0,0.1)',
                        color: '#ff4444',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        fontSize: '0.8rem'
                      }}
                      title="Delete Content"
                    >
                      <Trash2 size={15} /> Delete
                    </button>
                    <button
                      onClick={() => setActionModal({ report: r, actionType: 'BAN' })}
                      style={{
                        padding: '8px 12px',
                        borderRadius: '8px',
                        border: '1px solid rgba(255,0,127,0.4)',
                        background: 'rgba(255,0,127,0.1)',
                        color: 'var(--neon-pink)',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        fontSize: '0.8rem'
                      }}
                      title="Ban Offending User"
                    >
                      <ShieldOff size={15} /> Ban
                    </button>
                  </div>
                ) : (
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textAlign: 'right' }}>
                    Resolved by <strong>{r.moderatorUsername || 'Admin'}</strong>
                    {r.moderatorNotes && <div style={{ fontSize: '0.75rem', opacity: 0.8 }}>Note: {r.moderatorNotes}</div>}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Action Execution Dialog Modal */}
      {actionModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0, 0, 0, 0.75)',
          backdropFilter: 'blur(6px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: '20px'
        }}>
          <div className="glass-panel" style={{ maxWidth: '480px', width: '100%', padding: '26px' }}>
            <h3 style={{ fontFamily: 'Outfit', fontSize: '1.25rem', margin: '0 0 10px 0', color: actionModal.actionType === 'BAN' ? 'var(--neon-pink)' : '#FF9500' }}>
              Confirm Action: {actionModal.actionType}
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '16px' }}>
              Target: <strong style={{ color: 'var(--text-primary)' }}>{actionModal.report.targetTitle}</strong>
              {actionModal.report.reportedUsername && <> (@{actionModal.report.reportedUsername})</>}
            </p>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                Moderation Note / Warning Message to Author:
              </label>
              <textarea
                value={modalNotes}
                onChange={(e) => setModalNotes(e.target.value)}
                placeholder="Optional explanation or directive..."
                rows={3}
                style={{
                  width: '100%',
                  padding: '10px',
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--glass-border)',
                  borderRadius: '8px',
                  color: 'var(--text-primary)',
                  fontSize: '0.85rem',
                  outline: 'none'
                }}
              />
            </div>

            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
              <button
                onClick={() => setActionModal(null)}
                className="btn-secondary"
                style={{ padding: '8px 18px', fontSize: '0.85rem' }}
                disabled={actionLoading}
              >
                Cancel
              </button>
              <button
                onClick={handleExecuteAction}
                className="btn-primary"
                style={{
                  padding: '8px 20px',
                  fontSize: '0.85rem',
                  background: actionModal.actionType === 'BAN' ? '#ff0055' : actionModal.actionType === 'DELETE' ? '#ff4444' : '#FF9500',
                  border: 'none'
                }}
                disabled={actionLoading}
              >
                {actionLoading ? 'Executing...' : `Confirm ${actionModal.actionType}`}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Moderation;
