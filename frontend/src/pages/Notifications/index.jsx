import React, { useState, useEffect } from 'react';
import { Bell, MessageSquare, TrendingUp, UserPlus, CheckCircle, Trash2 } from 'lucide-react';
import api from '../../api/api';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch real notifications from Backend API
  const fetchNotifications = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.get('/api/notifications');
      if (res.data && res.data.data) {
        setNotifications(res.data.data);
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
      setNotifications(notifications.map(n => ({ ...n, read: true })));
    } catch (err) {
      console.error("Failed to mark all as read:", err);
    }
  };

  // Mark a single notification as read when clicked
  const markAsRead = async (id, isRead) => {
    if (isRead) return;
    try {
      await api.patch(`/api/notifications/${id}/read`);
      setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
    } catch (err) {
      console.error("Failed to mark notification as read:", err);
    }
  };

  // Delete a notification
  const deleteNotification = async (e, id) => {
    e.stopPropagation();
    try {
      await api.delete(`/api/notifications/${id}`);
      setNotifications(notifications.filter(n => n.id !== id));
    } catch (err) {
      console.error("Failed to delete notification:", err);
    }
  };

  // Format notification type icon & color
  const getNotificationStyle = (type) => {
    switch (type) {
      case 'VOTE':
        return { icon: <TrendingUp size={20} />, color: 'var(--neon-cyan)' };
      case 'COMMENT':
        return { icon: <MessageSquare size={20} />, color: 'var(--neon-pink)' };
      case 'INVITATION':
      case 'COMMUNITY_JOIN_REQUEST':
        return { icon: <UserPlus size={20} />, color: 'var(--accent-purple)' };
      case 'COMMUNITY_APPROVED':
        return { icon: <CheckCircle size={20} />, color: 'var(--success)' };
      default:
        return { icon: <Bell size={20} />, color: 'var(--text-secondary)' };
    }
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
                onClick={() => markAsRead(notification.id, notification.read)}
                className="glass-panel"
                style={{ 
                  padding: '24px', 
                  display: 'flex', 
                  alignItems: 'flex-start', 
                  gap: '20px',
                  cursor: isUnread ? 'pointer' : 'default',
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
                    {notification.message}
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
