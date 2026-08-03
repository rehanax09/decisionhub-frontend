import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, MessageSquare, TrendingUp, UserPlus, CheckCircle, Trash2, ShieldAlert, Sparkles } from 'lucide-react';
import api from '../../api/api';

const Notifications = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch real notifications from Backend API
  const fetchNotifications = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.get('/api/notifications');
      if (res.data?.success && Array.isArray(res.data.data)) {
        setNotifications(res.data.data);
      } else if (Array.isArray(res.data)) {
        setNotifications(res.data);
      } else {
        setNotifications([]);
      }
    } catch (err) {
      console.error("Failed to fetch notifications:", err);
      setError("Failed to load notifications. Please make sure you are logged in.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  // Mark all notifications as read
  const markAllAsRead = async () => {
    try {
      await api.patch('/api/notifications/read-all');
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    } catch (err) {
      console.error("Failed to mark all as read:", err);
    }
  };

  // Mark a single notification as read when clicked & navigate
  const handleNotificationClick = async (notification) => {
    if (!notification.read) {
      try {
        await api.patch(`/api/notifications/${notification.id}/read`);
        setNotifications(prev => prev.map(n => n.id === notification.id ? { ...n, read: true } : n));
      } catch (err) {
        console.error("Failed to mark notification as read:", err);
      }
    }

    // Navigate to relevant entity if available
    if (notification.decisionId) {
      navigate(`/decision-board/${notification.decisionId}`);
    } else if (notification.communityId) {
      navigate(`/community/${notification.communityId}`);
    }
  };

  // Delete a notification
  const deleteNotification = async (e, id) => {
    e.stopPropagation();
    try {
      await api.delete(`/api/notifications/${id}`);
      setNotifications(prev => prev.filter(n => n.id !== id));
    } catch (err) {
      console.error("Failed to delete notification:", err);
    }
  };

  // Format notification type icon & color
  const getNotificationStyle = (type) => {
    switch (type) {
      case 'VOTE':
      case 'VOTE_UPDATED':
      case 'VOTE_REMOVED':
        return { icon: <TrendingUp size={20} />, color: 'var(--neon-cyan)' };
      case 'COMMENT':
      case 'REPLY':
      case 'COMMENT_EDIT':
      case 'COMMENT_DELETE':
        return { icon: <MessageSquare size={20} />, color: 'var(--neon-pink)' };
      case 'JOIN_REQUEST':
      case 'JOIN_REQUEST_APPROVED':
      case 'JOIN_REQUEST_REJECTED':
      case 'INVITATION':
        return { icon: <UserPlus size={20} />, color: 'var(--accent-purple)' };
      case 'COMMUNITY_CREATED':
      case 'DECISION_CREATED':
      case 'COMMUNITY_APPROVED':
        return { icon: <CheckCircle size={20} />, color: 'var(--success)' };
      case 'MEMBER_REMOVED':
      case 'COMMUNITY_DELETED':
        return { icon: <Trash2 size={20} />, color: 'var(--neon-pink)' };
      case 'MODERATOR_ACTION':
        return { icon: <ShieldAlert size={20} />, color: 'var(--warning)' };
      default:
        return { icon: <Bell size={20} />, color: 'var(--neon-cyan)' };
    }
  };

  // Reformat notification messages for clean, consistent entity context
  const formatNotificationMessage = (n) => {
    let msg = n.message || '';
    if (!msg) return '';

    // Handle community deletion / removal
    if (n.type === 'COMMUNITY_DELETED') {
      const name = msg.replace(/\s+has been deleted\.?$/i, '').replace(/\s+is removed\.?$/i, '').trim();
      return `The '${name}' community has been deleted.`;
    }

    // Handle member removal from community
    if (n.type === 'MEMBER_REMOVED') {
      if (msg.toLowerCase().includes('removed from ')) {
        const commName = msg.replace(/^You have been removed from\s+/i, '').replace(/\.?$/, '').trim();
        return `You have been removed from the '${commName}' community.`;
      }
    }

    // Handle community update
    if (n.type === 'COMMUNITY_UPDATED') {
      const name = msg.replace(/\s+has been updated\.?$/i, '').trim();
      return `The '${name}' community has been updated.`;
    }

    // Handle community creation
    if (n.type === 'COMMUNITY_CREATED') {
      const match = msg.match(/^(.+?)\s+was created by\s+(.+)$/i);
      if (match) {
        return `The '${match[1]}' community was created by ${match[2]}`;
      }
    }

    // Handle join request
    if (n.type === 'JOIN_REQUEST') {
      const match = msg.match(/^(.+?)\s+requested to join\s+(.+)$/i);
      if (match) {
        const commName = match[2].replace(/\.?$/, '').trim();
        return `${match[1]} requested to join the '${commName}' community.`;
      }
    }

    // Handle join request approved
    if (n.type === 'JOIN_REQUEST_APPROVED') {
      if (msg.toLowerCase().includes('request to join ')) {
        const commName = msg.replace(/^Your request to join\s+/i, '').replace(/\s+was approved\.?$/i, '').trim();
        return `Your request to join the '${commName}' community was approved.`;
      }
    }

    // Handle join request rejected
    if (n.type === 'JOIN_REQUEST_REJECTED') {
      if (msg.toLowerCase().includes('request to join ')) {
        const commName = msg.replace(/^Your request to join\s+/i, '').replace(/\s+was rejected\.?$/i, '').trim();
        return `Your request to join the '${commName}' community was rejected.`;
      }
    }

    // Handle decision updated / created
    if (n.type === 'DECISION_UPDATED') {
      const title = msg.replace(/\s+has been updated\.?$/i, '').trim();
      return `The '${title}' decision board has been updated.`;
    }

    if (n.type === 'DECISION_CREATED') {
      const match = msg.match(/^(.+?)\s+was created by\s+(.+)$/i);
      if (match) {
        return `The '${match[1]}' decision board was created by ${match[2]}`;
      }
    }

    return msg;
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', paddingBottom: '40px' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
        <div>
          <h1 style={{ fontSize: '2.5rem', fontFamily: 'Outfit', margin: 0, marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '12px' }}>
            Notifications
            {unreadCount > 0 && (
              <span style={{ 
                background: 'var(--neon-pink)', 
                color: 'var(--text-primary)', 
                fontSize: '1rem', 
                padding: '4px 12px', 
                borderRadius: '20px',
                fontWeight: 'bold',
                boxShadow: '0 0 10px var(--neon-pink)'
              }}>
                {unreadCount} New
              </span>
            )}
          </h1>
          <p style={{ color: 'var(--text-secondary)' }}>Stay updated with your community's activity.</p>
        </div>
        
        {unreadCount > 0 && (
          <button 
            onClick={markAllAsRead}
            className="btn-secondary" 
            style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', fontSize: '0.9rem' }}
          >
            <CheckCircle size={18} /> Mark all as read
          </button>
        )}
      </div>

      {/* Loading state */}
      {loading && (
        <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-secondary)' }}>
          Loading your notifications...
        </div>
      )}

      {/* Error state */}
      {error && !loading && (
        <div style={{ textAlign: 'center', padding: '40px', color: 'var(--neon-pink)' }}>
          {error}
        </div>
      )}

      {/* Notifications List */}
      {!loading && !error && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {notifications.map((notification) => {
            const { icon, color } = getNotificationStyle(notification.type);
            const isUnread = !notification.read;

            return (
              <div 
                key={notification.id} 
                onClick={() => handleNotificationClick(notification)}
                className="glass-panel"
                style={{ 
                  padding: '24px', 
                  display: 'flex', 
                  alignItems: 'flex-start', 
                  gap: '20px',
                  cursor: 'pointer',
                  borderLeft: isUnread ? `4px solid ${color}` : '1px solid var(--glass-border)',
                  background: isUnread ? 'var(--panel-bg)' : 'var(--panel-bg-light)',
                  transition: 'all 0.3s ease',
                  position: 'relative'
                }}
              >
                {/* Icon */}
                <div style={{ 
                  width: '48px', 
                  height: '48px', 
                  borderRadius: '50%', 
                  background: `${color}20`, 
                  color: color,
                  display: 'flex', 
                  justifyContent: 'center', 
                  alignItems: 'center',
                  boxShadow: isUnread ? `0 0 15px ${color}40` : 'none',
                  flexShrink: 0
                }}>
                  {icon}
                </div>

                {/* Message Content */}
                <div style={{ flex: 1 }}>
                  <p style={{ margin: 0, fontSize: '1.05rem', lineHeight: '1.5', color: isUnread ? 'white' : 'var(--text-secondary)' }}>
                    {formatNotificationMessage(notification)}
                  </p>
                  <span style={{ display: 'block', marginTop: '8px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    {notification.createdAt ? new Date(notification.createdAt).toLocaleString() : ''}
                  </span>
                </div>

                {/* Delete Button */}
                <button
                  onClick={(e) => deleteNotification(e, notification.id)}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: 'var(--text-secondary)',
                    cursor: 'pointer',
                    opacity: 0.6,
                    padding: '4px',
                    transition: 'opacity 0.2s'
                  }}
                  onMouseOver={(e) => e.currentTarget.style.opacity = 1}
                  onMouseOut={(e) => e.currentTarget.style.opacity = 0.6}
                  title="Delete notification"
                >
                  <Trash2 size={18} />
                </button>

                {/* Unread Dot Indicator */}
                {isUnread && (
                  <div style={{
                    width: '10px',
                    height: '10px',
                    borderRadius: '50%',
                    background: color,
                    boxShadow: `0 0 10px ${color}`,
                    marginTop: '19px'
                  }} />
                )}
              </div>
            );
          })}

          {notifications.length === 0 && (
            <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-secondary)' }}>
              <Bell size={40} style={{ opacity: 0.5, marginBottom: '16px' }} />
              <h3>No notifications yet</h3>
              <p>You're all caught up!</p>
            </div>
          )}
        </div>
      )}

    </div>
  );
};

export default Notifications;
