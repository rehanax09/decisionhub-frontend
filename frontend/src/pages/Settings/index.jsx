import React, { useState, useEffect } from 'react';
import { Bell, Lock, Globe, Shield, CreditCard, Monitor, Save, CheckCircle2, Link as LinkIcon, Eye, Terminal, HelpCircle } from 'lucide-react';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('account');
  const [showSaveToast, setShowSaveToast] = useState(false);

  // Load from localStorage or use defaults
  const loadState = (key, defaultVal) => {
    const saved = localStorage.getItem(`decisionhub_settings_${key}`);
    return saved ? JSON.parse(saved) : defaultVal;
  };

  const [account, setAccount] = useState(() => loadState('account', {
    email: 'user@decisionhub.app',
    username: '@decisionmaker'
  }));

  const [notifications, setNotifications] = useState(() => loadState('notifications', {
    emailReplies: true,
    pushPolls: false,
    weeklySummary: true,
    alertResolution: true
  }));

  const [privacy, setPrivacy] = useState(() => loadState('privacy', {
    profileVisibility: 'public',
    dataSharing: false,
    showOnlineStatus: true
  }));

  const [appearance, setAppearance] = useState(() => loadState('appearance', {
    accentColor: 'cyan'
  }));

  const [language, setLanguage] = useState(() => loadState('language', {
    lang: 'en-US',
    timezone: 'UTC'
  }));

  const handleSave = () => {
    localStorage.setItem('decisionhub_settings_account', JSON.stringify(account));
    localStorage.setItem('decisionhub_settings_notifications', JSON.stringify(notifications));
    localStorage.setItem('decisionhub_settings_privacy', JSON.stringify(privacy));
    localStorage.setItem('decisionhub_settings_appearance', JSON.stringify(appearance));
    localStorage.setItem('decisionhub_settings_language', JSON.stringify(language));
    
    setShowSaveToast(true);
    setTimeout(() => setShowSaveToast(false), 3000);
  };

  const inputStyle = {
    width: '100%', maxWidth: '400px', padding: '12px', 
    background: 'var(--input-bg)', border: '1px solid var(--glass-border)', 
    color: 'var(--text-primary)', borderRadius: '8px', outline: 'none'
  };

  const selectStyle = {
    ...inputStyle,
    appearance: 'none',
    cursor: 'pointer'
  };

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', position: 'relative' }}>
      
      {/* Save Success Toast */}
      {showSaveToast && (
        <div style={{
          position: 'fixed', top: '100px', right: '40px', background: 'var(--success)', color: '#000',
          padding: '12px 24px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '8px',
          fontWeight: 'bold', zIndex: 1000, animation: 'fadeIn 0.3s ease'
        }}>
          <CheckCircle2 size={20} /> Settings Saved Successfully
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '40px' }}>
        <div>
          <h1 style={{ fontSize: '2.5rem', fontFamily: 'Outfit', margin: '0 0 10px 0' }}>Settings</h1>
          <p style={{ color: 'var(--text-secondary)', margin: 0 }}>Manage your preferences and platform behavior.</p>
        </div>
        <button onClick={handleSave} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Save size={18} /> Save All Changes
        </button>
      </div>

      <div style={{ display: 'flex', gap: '30px', alignItems: 'flex-start' }}>
        
        {/* Settings Navigation */}
        <div className="glass-panel" style={{ width: '250px', display: 'flex', flexDirection: 'column', gap: '5px', padding: '15px' }}>
          {[
            { id: 'account', label: 'Account', icon: Shield },
            { id: 'notifications', label: 'Notifications', icon: Bell },
            { id: 'privacy', label: 'Privacy & Security', icon: Lock },
            { id: 'appearance', label: 'Appearance', icon: Monitor },
            { id: 'billing', label: 'Billing', icon: CreditCard },
            { id: 'language', label: 'Language & Region', icon: Globe },
            { id: 'integrations', label: 'Connected Apps', icon: LinkIcon },
            { id: 'accessibility', label: 'Accessibility', icon: Eye },
            { id: 'advanced', label: 'Advanced Settings', icon: Terminal },
            { id: 'support', label: 'Help & Support', icon: HelpCircle },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 16px',
                background: activeTab === tab.id ? 'rgba(0, 245, 255, 0.1)' : 'transparent',
                color: activeTab === tab.id ? 'var(--neon-cyan)' : 'var(--text-secondary)',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                textAlign: 'left',
                fontSize: '0.95rem',
                transition: 'all 0.2s',
                fontWeight: activeTab === tab.id ? 'bold' : 'normal'
              }}
            >
              <tab.icon size={18} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Settings Content Area */}
        <div className="glass-panel" style={{ flex: 1, padding: '30px', minHeight: '500px' }}>
          
          {activeTab === 'account' && (
            <div className="animate-fade-in">
              <h2 style={{ fontFamily: 'Outfit', marginBottom: '20px', fontSize: '1.5rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '10px' }}>Account Settings</h2>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div>
                  <label style={{ display: 'block', color: 'var(--text-secondary)', marginBottom: '8px', fontSize: '0.9rem' }}>Email Address</label>
                  <input 
                    type="email" 
                    value={account.email} 
                    onChange={e => setAccount({...account, email: e.target.value})}
                    style={inputStyle} 
                  />
                </div>
                <div>
                  <label style={{ display: 'block', color: 'var(--text-secondary)', marginBottom: '8px', fontSize: '0.9rem' }}>Username</label>
                  <input 
                    type="text" 
                    value={account.username} 
                    onChange={e => setAccount({...account, username: e.target.value})}
                    style={inputStyle} 
                  />
                </div>
                <div style={{ marginTop: '10px', padding: '16px', background: 'rgba(255,0,0,0.05)', border: '1px solid rgba(255,0,0,0.2)', borderRadius: '8px' }}>
                  <h3 style={{ color: '#ff4444', margin: '0 0 10px 0', fontSize: '1.1rem' }}>Danger Zone</h3>
                  <button style={{ background: 'transparent', color: '#ff4444', border: '1px solid #ff4444', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer' }}>Delete Account</button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="animate-fade-in">
              <h2 style={{ fontFamily: 'Outfit', marginBottom: '20px', fontSize: '1.5rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '10px' }}>Notification Preferences</h2>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {[
                  { key: 'emailReplies', label: 'Email when someone replies to my discussion' },
                  { key: 'pushPolls', label: 'Push notifications for new polls' },
                  { key: 'weeklySummary', label: 'Weekly summary reports' },
                  { key: 'alertResolution', label: 'Alert on decision resolution' }
                ].map((item) => (
                  <label key={item.key} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '15px', background: 'var(--panel-bg-light)', borderRadius: '8px', border: '1px solid var(--glass-border)', cursor: 'pointer' }}>
                    <span>{item.label}</span>
                    <input 
                      type="checkbox" 
                      checked={notifications[item.key]}
                      onChange={e => setNotifications({...notifications, [item.key]: e.target.checked})}
                      style={{ width: '18px', height: '18px', cursor: 'pointer', accentColor: 'var(--neon-cyan)' }} 
                    />
                  </label>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'privacy' && (
            <div className="animate-fade-in">
              <h2 style={{ fontFamily: 'Outfit', marginBottom: '20px', fontSize: '1.5rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '10px' }}>Privacy & Security</h2>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <div>
                  <label style={{ display: 'block', color: 'var(--text-secondary)', marginBottom: '8px', fontSize: '0.9rem' }}>Profile Visibility</label>
                  <select 
                    value={privacy.profileVisibility}
                    onChange={e => setPrivacy({...privacy, profileVisibility: e.target.value})}
                    style={selectStyle}
                  >
                    <option value="public" style={{background: 'var(--bg-primary)'}}>Public (Everyone can see)</option>
                    <option value="friends" style={{background: 'var(--bg-primary)'}}>Connections Only</option>
                    <option value="private" style={{background: 'var(--bg-primary)'}}>Private</option>
                  </select>
                </div>
                
                <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '15px', background: 'var(--panel-bg-light)', borderRadius: '8px', border: '1px solid var(--glass-border)', cursor: 'pointer' }}>
                  <div>
                    <span style={{ display: 'block', fontWeight: 'bold' }}>Data Sharing</span>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Allow anonymous data collection to improve suggestions.</span>
                  </div>
                  <input 
                    type="checkbox" 
                    checked={privacy.dataSharing}
                    onChange={e => setPrivacy({...privacy, dataSharing: e.target.checked})}
                    style={{ width: '18px', height: '18px', cursor: 'pointer', accentColor: 'var(--neon-cyan)' }} 
                  />
                </label>
                
                <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '15px', background: 'var(--panel-bg-light)', borderRadius: '8px', border: '1px solid var(--glass-border)', cursor: 'pointer' }}>
                  <div>
                    <span style={{ display: 'block', fontWeight: 'bold' }}>Online Status</span>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Let others see when you are active.</span>
                  </div>
                  <input 
                    type="checkbox" 
                    checked={privacy.showOnlineStatus}
                    onChange={e => setPrivacy({...privacy, showOnlineStatus: e.target.checked})}
                    style={{ width: '18px', height: '18px', cursor: 'pointer', accentColor: 'var(--neon-cyan)' }} 
                  />
                </label>
              </div>
            </div>
          )}

          {activeTab === 'appearance' && (
            <div className="animate-fade-in">
              <h2 style={{ fontFamily: 'Outfit', marginBottom: '20px', fontSize: '1.5rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '10px' }}>Appearance</h2>
              <p style={{ color: 'var(--text-secondary)' }}>You can toggle your dark/light mode preference using the icon in the top navigation bar.</p>
              
              <div style={{ marginTop: '30px' }}>
                <h3 style={{ fontSize: '1.1rem', marginBottom: '15px' }}>Theme Accents</h3>
                <div style={{ display: 'flex', gap: '20px' }}>
                  {[
                    { id: 'cyan', color: 'var(--neon-cyan)' },
                    { id: 'pink', color: 'var(--neon-pink)' },
                    { id: 'purple', color: 'var(--accent-purple)' },
                    { id: 'success', color: 'var(--success)' },
                  ].map(accent => (
                    <div 
                      key={accent.id}
                      onClick={() => setAppearance({...appearance, accentColor: accent.id})}
                      style={{ 
                        width: '50px', height: '50px', 
                        background: accent.color, 
                        borderRadius: '50%', 
                        cursor: 'pointer', 
                        border: appearance.accentColor === accent.id ? '3px solid white' : '3px solid transparent',
                        boxShadow: appearance.accentColor === accent.id ? `0 0 15px ${accent.color}` : 'none',
                        transition: 'all 0.2s'
                      }}
                    />
                  ))}
                </div>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '15px' }}>
                  *Accent color changes are applied visually here. For global application, a context provider is needed.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'billing' && (
            <div className="animate-fade-in">
              <h2 style={{ fontFamily: 'Outfit', marginBottom: '20px', fontSize: '1.5rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '10px' }}>Billing & Plans</h2>
              
              <div style={{ background: 'linear-gradient(135deg, rgba(0, 245, 255, 0.1), rgba(255, 0, 255, 0.1))', padding: '30px', borderRadius: '12px', border: '1px solid var(--glass-border)' }}>
                <h3 style={{ margin: '0 0 10px 0', fontSize: '1.3rem' }}>Pro Plan <span style={{ background: 'var(--neon-cyan)', color: '#000', padding: '2px 8px', borderRadius: '12px', fontSize: '0.8rem', verticalAlign: 'middle', marginLeft: '10px' }}>ACTIVE</span></h3>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '20px' }}>You are on the Pro plan. Billed $15/month.</p>
                <button className="btn-secondary">Manage Subscription</button>
              </div>
              
              <h3 style={{ marginTop: '30px', fontSize: '1.1rem', marginBottom: '15px' }}>Payment Methods</h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px', padding: '15px', background: 'var(--panel-bg-light)', borderRadius: '8px', border: '1px solid var(--glass-border)' }}>
                <CreditCard size={24} color="var(--text-secondary)" />
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 'bold' }}>Visa ending in 4242</div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Expires 12/28</div>
                </div>
                <button style={{ background: 'transparent', border: 'none', color: 'var(--neon-cyan)', cursor: 'pointer' }}>Edit</button>
              </div>
            </div>
          )}

          {activeTab === 'language' && (
            <div className="animate-fade-in">
              <h2 style={{ fontFamily: 'Outfit', marginBottom: '20px', fontSize: '1.5rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '10px' }}>Language & Region</h2>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div>
                  <label style={{ display: 'block', color: 'var(--text-secondary)', marginBottom: '8px', fontSize: '0.9rem' }}>Language</label>
                  <select 
                    value={language.lang}
                    onChange={e => setLanguage({...language, lang: e.target.value})}
                    style={selectStyle}
                  >
                    <option value="en-US" style={{background: 'var(--bg-primary)'}}>English (US)</option>
                    <option value="es-ES" style={{background: 'var(--bg-primary)'}}>Español (ES)</option>
                    <option value="fr-FR" style={{background: 'var(--bg-primary)'}}>Français (FR)</option>
                    <option value="de-DE" style={{background: 'var(--bg-primary)'}}>Deutsch (DE)</option>
                    <option value="ja-JP" style={{background: 'var(--bg-primary)'}}>日本語 (JP)</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', color: 'var(--text-secondary)', marginBottom: '8px', fontSize: '0.9rem' }}>Timezone</label>
                  <select 
                    value={language.timezone}
                    onChange={e => setLanguage({...language, timezone: e.target.value})}
                    style={selectStyle}
                  >
                    <option value="UTC" style={{background: 'var(--bg-primary)'}}>UTC (Coordinated Universal Time)</option>
                    <option value="EST" style={{background: 'var(--bg-primary)'}}>Eastern Standard Time (EST)</option>
                    <option value="PST" style={{background: 'var(--bg-primary)'}}>Pacific Standard Time (PST)</option>
                    <option value="IST" style={{background: 'var(--bg-primary)'}}>Indian Standard Time (IST)</option>
                    <option value="CET" style={{background: 'var(--bg-primary)'}}>Central European Time (CET)</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'integrations' && (
            <div className="animate-fade-in">
              <h2 style={{ fontFamily: 'Outfit', marginBottom: '20px', fontSize: '1.5rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '10px' }}>Connected Apps</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                {['Google Workspace', 'Slack', 'Discord', 'GitHub'].map(app => (
                  <div key={app} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '15px', background: 'var(--panel-bg-light)', borderRadius: '8px', border: '1px solid var(--glass-border)' }}>
                    <div style={{ fontWeight: 'bold' }}>{app}</div>
                    <button className="btn-secondary" style={{ padding: '6px 12px', fontSize: '0.8rem' }}>Connect</button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'accessibility' && (
            <div className="animate-fade-in">
              <h2 style={{ fontFamily: 'Outfit', marginBottom: '20px', fontSize: '1.5rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '10px' }}>Accessibility</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '15px', background: 'var(--panel-bg-light)', borderRadius: '8px', border: '1px solid var(--glass-border)', cursor: 'pointer' }}>
                  <span>High Contrast Mode</span>
                  <input type="checkbox" style={{ width: '18px', height: '18px', cursor: 'pointer', accentColor: 'var(--neon-cyan)' }} />
                </label>
                <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '15px', background: 'var(--panel-bg-light)', borderRadius: '8px', border: '1px solid var(--glass-border)', cursor: 'pointer' }}>
                  <span>Reduce Motion</span>
                  <input type="checkbox" defaultChecked style={{ width: '18px', height: '18px', cursor: 'pointer', accentColor: 'var(--neon-cyan)' }} />
                </label>
              </div>
            </div>
          )}
          
          {activeTab === 'advanced' && (
            <div className="animate-fade-in">
              <h2 style={{ fontFamily: 'Outfit', marginBottom: '20px', fontSize: '1.5rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '10px' }}>Advanced Settings</h2>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div style={{ padding: '15px', background: 'var(--panel-bg-light)', borderRadius: '8px', border: '1px solid var(--glass-border)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                    <span style={{ fontWeight: 'bold' }}>Developer Mode</span>
                    <input type="checkbox" style={{ width: '18px', height: '18px', cursor: 'pointer', accentColor: 'var(--neon-cyan)' }} />
                  </div>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', margin: 0 }}>Enable experimental features and debugging tools.</p>
                </div>

                <div style={{ padding: '15px', background: 'var(--panel-bg-light)', borderRadius: '8px', border: '1px solid var(--glass-border)' }}>
                  <h3 style={{ fontSize: '1rem', margin: '0 0 10px 0' }}>API Access</h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '15px' }}>Generate a token to access DecisionHub via API.</p>
                  <button className="btn-secondary" style={{ padding: '8px 16px', fontSize: '0.85rem' }}>Generate New Token</button>
                </div>

                <div style={{ padding: '15px', background: 'rgba(255,0,0,0.05)', borderRadius: '8px', border: '1px solid rgba(255,0,0,0.2)' }}>
                  <h3 style={{ color: '#ff4444', margin: '0 0 10px 0', fontSize: '1rem' }}>Factory Reset</h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '15px' }}>Clear all local data, cache, and reset settings to default.</p>
                  <button style={{ background: 'transparent', color: '#ff4444', border: '1px solid #ff4444', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontSize: '0.85rem' }}>Reset Everything</button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'support' && (
            <div className="animate-fade-in">
              <h2 style={{ fontFamily: 'Outfit', marginBottom: '20px', fontSize: '1.5rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '10px' }}>Help & Support</h2>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '30px' }}>
                <div style={{ padding: '20px', background: 'var(--panel-bg-light)', borderRadius: '12px', border: '1px solid var(--glass-border)', textAlign: 'center', cursor: 'pointer' }}>
                  <Globe size={32} color="var(--neon-cyan)" style={{ marginBottom: '10px', margin: '0 auto' }} />
                  <h3 style={{ margin: '0 0 5px 0' }}>Knowledge Base</h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', margin: 0 }}>Browse articles and guides.</p>
                </div>
                <div style={{ padding: '20px', background: 'var(--panel-bg-light)', borderRadius: '12px', border: '1px solid var(--glass-border)', textAlign: 'center', cursor: 'pointer' }}>
                  <HelpCircle size={32} color="var(--neon-pink)" style={{ marginBottom: '10px', margin: '0 auto' }} />
                  <h3 style={{ margin: '0 0 5px 0' }}>Community Forum</h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', margin: 0 }}>Ask questions and get help.</p>
                </div>
              </div>

              <div style={{ padding: '20px', background: 'var(--panel-bg)', borderRadius: '12px', border: '1px solid var(--glass-border)' }}>
                <h3 style={{ margin: '0 0 15px 0' }}>Contact Support</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                  <input type="text" placeholder="Subject" style={inputStyle} />
                  <textarea placeholder="How can we help you?" style={{ ...inputStyle, minHeight: '100px', resize: 'vertical', width: '100%', maxWidth: 'none' }}></textarea>
                  <button className="btn-primary" style={{ alignSelf: 'flex-start' }}>Send Message</button>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default Settings;
