import React, { useState } from 'react';
import { Tag, X, Plus, Save, Palette } from 'lucide-react';

const THEMES = [
  {
    id: 'neon-dark',
    name: 'Neon Dark (Default)',
    cyan: '#00F5FF',
    pink: '#FF00FF',
    colors: {
      '--neon-cyan': '#00F5FF',
      '--neon-pink': '#FF00FF',
      '--glow-cyan': '0 0 10px rgba(0, 245, 255, 0.5), 0 0 20px rgba(0, 245, 255, 0.3)',
      '--glow-pink': '0 0 10px rgba(255, 0, 255, 0.5), 0 0 20px rgba(255, 0, 255, 0.3)'
    }
  },
  {
    id: 'cyberpunk-pink',
    name: 'Cyberpunk Pink',
    cyan: '#FF00FF',
    pink: '#00F5FF',
    colors: {
      '--neon-cyan': '#FF00FF',
      '--neon-pink': '#00F5FF',
      '--glow-cyan': '0 0 10px rgba(255, 0, 255, 0.5), 0 0 20px rgba(255, 0, 255, 0.3)',
      '--glow-pink': '0 0 10px rgba(0, 245, 255, 0.5), 0 0 20px rgba(0, 245, 255, 0.3)'
    }
  },
  {
    id: 'emerald-glow',
    name: 'Emerald Glow',
    cyan: '#00FF99',
    pink: '#FF8C00',
    colors: {
      '--neon-cyan': '#00FF99',
      '--neon-pink': '#FF8C00',
      '--glow-cyan': '0 0 10px rgba(0, 255, 153, 0.5), 0 0 20px rgba(0, 255, 153, 0.3)',
      '--glow-pink': '0 0 10px rgba(255, 140, 0, 0.5), 0 0 20px rgba(255, 140, 0, 0.3)'
    }
  },
  {
    id: 'classic-slate',
    name: 'Classic Slate',
    cyan: '#94A3B8',
    pink: '#64748B',
    colors: {
      '--neon-cyan': '#94A3B8',
      '--neon-pink': '#64748B',
      '--glow-cyan': '0 0 10px rgba(148, 163, 184, 0.3)',
      '--glow-pink': '0 0 10px rgba(100, 116, 139, 0.3)'
    }
  }
];

const AdminSettings = () => {
  const [tags,         setTags]         = useState(['Technology', 'Finance', 'Career', 'Lifestyle', 'Travel', 'Health', 'Education']);
  const [newTag,       setNewTag]       = useState('');
  const [platform,     setPlatform]     = useState({ maintenance: false, allowRegistration: true, requireEmailVerify: false });
  const [email,        setEmail]        = useState({ fromAddress: 'noreply@decisionhub.com', smtpHost: 'smtp.gmail.com', smtpPort: '587' });
  const [selectedTheme, setSelectedTheme] = useState(() => localStorage.getItem('admin-theme') || 'neon-dark');
  const [saved,        setSaved]        = useState(false);

  const addTag    = () => { if (newTag.trim() && !tags.includes(newTag.trim())) { setTags([...tags, newTag.trim()]); setNewTag(''); } };
  const removeTag = (t) => setTags(tags.filter(x => x !== t));

  const applyThemeColors = (themeId) => {
    const theme = THEMES.find(t => t.id === themeId);
    if (theme) {
      Object.entries(theme.colors).forEach(([variable, value]) => {
        document.documentElement.style.setProperty(variable, value);
      });
    }
  };

  const save = async () => {
    setSaved(true);
    // Persist and apply selected theme
    localStorage.setItem('admin-theme', selectedTheme);
    applyThemeColors(selectedTheme);
    await new Promise(r => setTimeout(r, 1000));
    setSaved(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px', maxWidth: '800px' }}>

      {/* Categories / Tags */}
      <div className="glass-panel" style={{ padding: '28px' }}>
        <h3 style={{ margin: '0 0 20px 0', fontFamily: 'Outfit', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Tag color="var(--neon-cyan)" size={18} /> Categories & Tags
        </h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '16px' }}>
          {tags.map(t => (
            <span key={t} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 14px', borderRadius: '20px', background: 'rgba(0,245,255,0.1)', color: 'var(--neon-cyan)', border: '1px solid rgba(0,245,255,0.2)', fontSize: '0.85rem' }}>
              {t}
              <button onClick={() => removeTag(t)} style={{ background: 'none', border: 'none', color: 'var(--neon-cyan)', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center', opacity: 0.6 }}><X size={12}/></button>
            </span>
          ))}
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <input value={newTag} onChange={e => setNewTag(e.target.value)} onKeyDown={e => e.key === 'Enter' && addTag()}
            placeholder="Add new category…"
            style={{ flex: 1, padding: '10px 14px', borderRadius: '10px', border: '1px solid var(--glass-border)', background: 'var(--input-bg)', color: 'var(--text-primary)', outline: 'none', fontSize: '0.9rem' }}
            onFocus={e => e.target.style.border = '1px solid var(--neon-cyan)'}
            onBlur={e  => e.target.style.border = '1px solid var(--glass-border)'} />
          <button onClick={addTag} className="btn-primary" style={{ padding: '10px 18px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Plus size={16} /> Add
          </button>
        </div>
      </div>

      {/* Platform Settings */}
      <div className="glass-panel" style={{ padding: '28px' }}>
        <h3 style={{ margin: '0 0 20px 0', fontFamily: 'Outfit', fontSize: '1.1rem' }}>⚙️ Platform Settings</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {[
            { key: 'maintenance',         label: 'Maintenance Mode',              desc: 'Blocks all non-admin access to the platform.' },
            { key: 'allowRegistration',   label: 'Allow New Registrations',       desc: 'Allows new users to sign up.' },
            { key: 'requireEmailVerify',  label: 'Require Email Verification',    desc: 'Users must verify email before accessing the platform.' },
          ].map(({ key, label, desc }) => (
            <div key={key} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', borderRadius: '12px', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--glass-border)' }}>
              <div>
                <p style={{ margin: 0, fontWeight: '500', fontSize: '0.95rem' }}>{label}</p>
                <p style={{ margin: '4px 0 0 0', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{desc}</p>
              </div>
              <div onClick={() => setPlatform(p => ({ ...p, [key]: !p[key] }))}
                style={{ width: '44px', height: '24px', borderRadius: '12px', background: platform[key] ? 'var(--neon-cyan)' : 'var(--glass-border)', cursor: 'pointer', position: 'relative', transition: 'background 0.2s', flexShrink: 0 }}>
                <div style={{ position: 'absolute', top: '3px', left: platform[key] ? '22px' : '3px', width: '18px', height: '18px', borderRadius: '50%', background: '#fff', transition: 'left 0.2s', boxShadow: '0 1px 4px rgba(0,0,0,0.3)' }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Email Settings */}
      <div className="glass-panel" style={{ padding: '28px' }}>
        <h3 style={{ margin: '0 0 20px 0', fontFamily: 'Outfit', fontSize: '1.1rem' }}>📧 Email Settings</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {[
            { key: 'fromAddress', label: 'From Address',  placeholder: 'noreply@decisionhub.com' },
            { key: 'smtpHost',    label: 'SMTP Host',     placeholder: 'smtp.gmail.com'          },
            { key: 'smtpPort',    label: 'SMTP Port',     placeholder: '587'                     },
          ].map(({ key, label, placeholder }) => (
            <div key={key} style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: '500' }}>{label}</label>
              <input value={email[key]} onChange={e => setEmail(em => ({ ...em, [key]: e.target.value }))} placeholder={placeholder}
                style={{ padding: '10px 14px', borderRadius: '10px', border: '1px solid var(--glass-border)', background: 'var(--input-bg)', color: 'var(--text-primary)', outline: 'none', fontSize: '0.9rem' }}
                onFocus={e => e.target.style.border = '1px solid var(--neon-cyan)'}
                onBlur={e  => e.target.style.border = '1px solid var(--glass-border)'} />
            </div>
          ))}
        </div>
      </div>

      {/* Theme Settings (Optional) */}
      <div className="glass-panel" style={{ padding: '28px' }}>
        <h3 style={{ margin: '0 0 20px 0', fontFamily: 'Outfit', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Palette color="var(--neon-cyan)" size={18} /> Theme Settings (Optional)
        </h3>
        <p style={{ margin: '0 0 20px 0', color: 'var(--text-secondary)', fontSize: '0.82rem' }}>Customize the color palette and glows of the admin console and user dashboard.</p>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px' }}>
          {THEMES.map(theme => {
            const isSelected = selectedTheme === theme.id;
            return (
              <div 
                key={theme.id}
                onClick={() => {
                  setSelectedTheme(theme.id);
                  // Preview immediately
                  applyThemeColors(theme.id);
                }}
                style={{
                  padding: '16px',
                  borderRadius: '12px',
                  background: isSelected ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.02)',
                  border: isSelected ? '2px solid var(--neon-cyan)' : '1px solid var(--glass-border)',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px'
                }}
              >
                <span style={{ fontSize: '0.88rem', fontWeight: '600', color: isSelected ? 'var(--neon-cyan)' : 'var(--text-primary)' }}>{theme.name}</span>
                <div style={{ display: 'flex', gap: '6px' }}>
                  <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: theme.cyan, boxShadow: `0 0 6px ${theme.cyan}` }} />
                  <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: theme.pink, boxShadow: `0 0 6px ${theme.pink}` }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Save Button */}
      <button onClick={save} className="btn-primary" disabled={saved}
        style={{ padding: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', boxShadow: 'var(--glow-cyan)', opacity: saved ? 0.7 : 1 }}>
        <Save size={18} /> {saved ? 'Settings Saved!' : 'Save All Settings'}
      </button>

    </div>
  );
};

export default AdminSettings;
