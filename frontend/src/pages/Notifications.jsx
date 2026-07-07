import React, { useState } from 'react';
import { Bell, Heart, MessageSquare, TrendingUp, UserPlus, CheckCircle } from 'lucide-react';

const Notifications = () => {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'like',
      icon: <Heart size={20} />,
      color: 'var(--neon-pink)',
      content: <span><strong>Alex Chen</strong> liked your comment on <strong>"Which frontend framework will dominate 2027?"</strong></span>,
      time: '2 hours ago',
      unread: true
    },
    {
      id: 2,
      type: 'comment',
      icon: <MessageSquare size={20} />,
      color: 'var(--neon-cyan)',
      content: <span><strong>Sarah Jenkins</strong> replied to your discussion in <strong>Tech Innovators</strong>.</span>,
      time: '5 hours ago',
      unread: true
    },
    {
      id: 3,
      type: 'trending',
      icon: <TrendingUp size={20} />,
      color: 'var(--success)',
      content: <span>A poll you voted on, <strong>"4-day work week"</strong>, is currently trending!</span>,
      time: '1 day ago',
      unread: false
    },
    {
      id: 4,
      type: 'invite',
      icon: <UserPlus size={20} />,
      color: 'var(--accent-purple)',
      content: <span>You have been invited to join the <strong>Startup Founders</strong> community.</span>,
      time: '2 days ago',
      unread: false
    },
    {
      id: 5,
      type: 'system',
      icon: <Bell size={20} />,
      color: 'var(--text-secondary)',
      content: <span>Welcome to DecisionHub! Customize your profile to get started.</span>,
      time: '1 week ago',
      unread: false
    }
  ]);

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, unread: false })));
  };

  const markAsRead = (id) => {
    setNotifications(notifications.map(n => n.id === id ? { ...n, unread: false } : n));
  };

  const unreadCount = notifications.filter(n => n.unread).length;

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

      {/* Notifications List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {notifications.map((notification) => (
          <div 
            key={notification.id} 
            onClick={() => markAsRead(notification.id)}
            className="glass-panel"
            style={{ 
              padding: '24px', 
              display: 'flex', 
              alignItems: 'flex-start', 
              gap: '20px',
              cursor: notification.unread ? 'pointer' : 'default',
              borderLeft: notification.unread ? `4px solid ${notification.color}` : '1px solid var(--glass-border)',
              background: notification.unread ? 'var(--panel-bg)' : 'var(--panel-bg-light)',
              transition: 'all 0.3s ease',
              position: 'relative'
            }}
            onMouseOver={(e) => {
              if (notification.unread) {
                e.currentTarget.style.background = 'rgba(255,255,255,0.08)';
              }
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = notification.unread ? 'var(--panel-bg)' : 'var(--panel-bg-light)';
            }}
          >
            {/* Icon */}
            <div style={{ 
              width: '48px', 
              height: '48px', 
              borderRadius: '50%', 
              background: `${notification.color}20`, 
              color: notification.color,
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center',
              boxShadow: notification.unread ? `0 0 15px ${notification.color}40` : 'none',
              flexShrink: 0
            }}>
              {notification.icon}
            </div>

            {/* Content */}
            <div style={{ flex: 1 }}>
              <p style={{ margin: 0, fontSize: '1.05rem', lineHeight: '1.5', color: notification.unread ? 'white' : 'var(--text-secondary)' }}>
                {notification.content}
              </p>
              <span style={{ display: 'block', marginTop: '8px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                {notification.time}
              </span>
            </div>

            {/* Unread Dot Indicator */}
            {notification.unread && (
              <div style={{
                width: '10px',
                height: '10px',
                borderRadius: '50%',
                background: notification.color,
                boxShadow: `0 0 10px ${notification.color}`,
                marginTop: '19px'
              }} />
            )}
          </div>
        ))}

        {notifications.length === 0 && (
          <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-secondary)' }}>
            <Bell size={40} style={{ opacity: 0.5, marginBottom: '16px' }} />
            <h3>No notifications yet</h3>
            <p>You're all caught up!</p>
          </div>
        )}
      </div>

    </div>
  );
};

export default Notifications;
