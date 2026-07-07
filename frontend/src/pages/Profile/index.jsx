import React, { useState } from 'react';
import { User, Settings, Award, Edit3, Grid, MessageSquare, Bookmark, CheckCircle, Clock } from 'lucide-react';

const Profile = () => {
  const [activeTab, setActiveTab] = useState('activity');

  // Dummy user data
  const user = {
    name: 'Alex Chen',
    handle: '@alexc_dev',
    bio: 'Full-stack developer | UI/UX enthusiast | Exploring the intersection of design and code.',
    reputation: 4850,
    stats: {
      decisions: 12,
      pollsVoted: 145,
      communities: 8
    }
  };

  // Dummy activity data
  const activities = [
    { id: 1, type: 'vote', title: 'Voted on "Which frontend framework will dominate 2027?"', time: '2 hours ago', icon: <CheckCircle size={16} />, color: 'var(--success)' },
    { id: 2, type: 'comment', title: 'Commented in "Tech Innovators" community', time: '5 hours ago', icon: <MessageSquare size={16} />, color: 'var(--neon-cyan)' },
    { id: 3, type: 'create', title: 'Created decision "MacBook Pro M3 vs XPS 15"', time: '1 day ago', icon: <Grid size={16} />, color: 'var(--neon-pink)' },
  ];

  const myDecisions = [
    { id: 1, title: "MacBook Pro M3 vs XPS 15", status: "Active", votes: 342, date: "Oct 24, 2026" },
    { id: 2, title: "Next.js App Router vs Pages Router", status: "Closed", votes: 890, date: "Sep 12, 2026" }
  ];

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', paddingBottom: '40px' }}>
      
      {/* Profile Header Card */}
      <div className="glass-panel" style={{ padding: '40px', display: 'flex', gap: '30px', alignItems: 'center', marginBottom: '30px', position: 'relative', overflow: 'hidden' }}>
        {/* Background glow */}
        <div style={{ position: 'absolute', top: '-50px', right: '-50px', width: '200px', height: '200px', background: 'var(--neon-cyan)', filter: 'blur(100px)', opacity: 0.1, zIndex: 0 }} />
        
        {/* Avatar */}
        <div style={{ 
          width: '120px', 
          height: '120px', 
          borderRadius: '50%', 
          background: 'linear-gradient(45deg, var(--neon-cyan), var(--neon-pink))',
          padding: '3px',
          zIndex: 1
        }}>
          <div style={{ 
            width: '100%', 
            height: '100%', 
            borderRadius: '50%', 
            background: 'var(--bg-secondary)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            color: 'var(--text-secondary)'
          }}>
            <User size={60} />
          </div>
        </div>

        {/* User Info */}
        <div style={{ flex: 1, zIndex: 1 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <h1 style={{ fontSize: '2.2rem', fontFamily: 'Outfit', margin: 0 }}>{user.name}</h1>
              <span style={{ color: 'var(--neon-cyan)', fontSize: '1.1rem', fontWeight: '500' }}>{user.handle}</span>
            </div>
            <button className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', borderRadius: '20px' }}>
              <Edit3 size={16} /> Edit Profile
            </button>
          </div>
          <p style={{ color: 'var(--text-secondary)', marginTop: '16px', fontSize: '1.05rem', lineHeight: '1.5', maxWidth: '600px' }}>
            {user.bio}
          </p>
        </div>
      </div>

      {/* Stats Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '40px' }}>
        {[
          { label: 'Reputation', value: user.reputation, icon: <Award size={24} />, color: 'var(--accent-purple)' },
          { label: 'Decisions Created', value: user.stats.decisions, icon: <Grid size={24} />, color: 'var(--neon-cyan)' },
          { label: 'Polls Voted', value: user.stats.pollsVoted, icon: <CheckCircle size={24} />, color: 'var(--success)' },
          { label: 'Communities', value: user.stats.communities, icon: <User size={24} />, color: 'var(--neon-pink)' }
        ].map((stat, idx) => (
          <div key={idx} className="glass-panel" style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ width: '50px', height: '50px', borderRadius: '12px', background: `${stat.color}20`, color: stat.color, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              {stat.icon}
            </div>
            <div>
              <div style={{ fontSize: '1.8rem', fontWeight: 'bold', fontFamily: 'Outfit', color: 'var(--text-primary)' }}>{stat.value}</div>
              <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{stat.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '30px', borderBottom: '1px solid var(--glass-border)', marginBottom: '30px' }}>
        {[
          { id: 'activity', label: 'Recent Activity', icon: <Clock size={18} /> },
          { id: 'decisions', label: 'My Decisions', icon: <Grid size={18} /> },
          { id: 'bookmarks', label: 'Bookmarks', icon: <Bookmark size={18} /> }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              background: 'none',
              border: 'none',
              color: activeTab === tab.id ? 'var(--neon-cyan)' : 'var(--text-secondary)',
              padding: '12px 0',
              fontSize: '1.05rem',
              fontWeight: activeTab === tab.id ? 'bold' : 'normal',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              borderBottom: activeTab === tab.id ? '2px solid var(--neon-cyan)' : '2px solid transparent',
              transition: 'all 0.3s ease'
            }}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div style={{ minHeight: '300px' }}>
        
        {/* Activity Tab */}
        {activeTab === 'activity' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {activities.map(activity => (
              <div key={activity.id} className="glass-panel" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '20px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: `${activity.color}20`, color: activity.color, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  {activity.icon}
                </div>
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontSize: '1.05rem', margin: 0, fontWeight: 'normal', color: 'var(--text-primary)' }}>{activity.title}</h3>
                  <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{activity.time}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* My Decisions Tab */}
        {activeTab === 'decisions' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            {myDecisions.map(decision => (
              <div key={decision.id} className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <h3 style={{ fontSize: '1.2rem', fontFamily: 'Outfit', margin: 0 }}>{decision.title}</h3>
                  <span style={{ 
                    padding: '4px 10px', 
                    borderRadius: '12px', 
                    fontSize: '0.75rem', 
                    fontWeight: 'bold',
                    background: decision.status === 'Active' ? 'rgba(0, 255, 153, 0.1)' : 'var(--panel-bg)',
                    color: decision.status === 'Active' ? 'var(--success)' : 'var(--text-secondary)'
                  }}>
                    {decision.status}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                  <span>{decision.votes} Votes</span>
                  <span>{decision.date}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Bookmarks Tab */}
        {activeTab === 'bookmarks' && (
          <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-secondary)' }}>
            <Bookmark size={48} style={{ opacity: 0.3, marginBottom: '16px' }} />
            <h3>No bookmarks yet</h3>
            <p>Save polls and decisions to easily find them later.</p>
          </div>
        )}

      </div>
    </div>
  );
};

export default Profile;
