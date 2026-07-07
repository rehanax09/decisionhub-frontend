import React, { useState } from 'react';
import { Plus, Trash2, CheckCircle } from 'lucide-react';

const CreateDecision = () => {
  const [options, setOptions] = useState([{ id: 1, text: '' }]);
  const [criteria, setCriteria] = useState(['Cost', 'Risk', 'Benefits', 'Time']);

  const addOption = () => {
    setOptions([...options, { id: Date.now(), text: '' }]);
  };

  const removeOption = (id) => {
    setOptions(options.filter(o => o.id !== id));
  };

  const toggleCriteria = (c) => {
    if (criteria.includes(c)) {
      setCriteria(criteria.filter(item => item !== c));
    } else {
      setCriteria([...criteria, c]);
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '2rem', fontFamily: 'Outfit', margin: 0, marginBottom: '10px' }}>Create New Decision</h1>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '30px' }}>Frame your dilemma and invite the network to weigh in.</p>

      <form className="glass-panel" style={{ padding: '40px', display: 'flex', flexDirection: 'column', gap: '30px' }}>
        
        {/* Basic Info */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <label style={{ fontSize: '0.9rem', color: 'var(--text-primary)', fontWeight: '500' }}>Decision Title</label>
          <input 
            type="text" placeholder="e.g. MBA vs Corporate Job"
            style={{ padding: '12px 16px', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'var(--input-bg)', color: 'var(--text-primary)', outline: 'none', width: '100%' }}
            onFocus={(e) => e.target.style.border = '1px solid var(--neon-cyan)'} onBlur={(e) => e.target.style.border = '1px solid var(--glass-border)'}
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <label style={{ fontSize: '0.9rem', color: 'var(--text-primary)', fontWeight: '500' }}>Description</label>
          <textarea 
            rows={4} placeholder="Provide context about the decision you need to make..."
            style={{ padding: '12px 16px', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'var(--input-bg)', color: 'var(--text-primary)', outline: 'none', width: '100%', resize: 'vertical' }}
            onFocus={(e) => e.target.style.border = '1px solid var(--neon-cyan)'} onBlur={(e) => e.target.style.border = '1px solid var(--glass-border)'}
          />
        </div>

        {/* Visibility */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <label style={{ fontSize: '0.9rem', color: 'var(--text-primary)', fontWeight: '500' }}>Visibility</label>
          <div style={{ display: 'flex', gap: '20px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
              <input type="radio" name="visibility" value="public" defaultChecked style={{ accentColor: 'var(--neon-cyan)' }} />
              Public Grid
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
              <input type="radio" name="visibility" value="private" style={{ accentColor: 'var(--neon-cyan)' }} />
              Private Community
            </label>
          </div>
        </div>

        <div style={{ height: '1px', background: 'var(--glass-border)', margin: '10px 0' }}></div>

        {/* Options */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <label style={{ fontSize: '0.9rem', color: 'var(--text-primary)', fontWeight: '500' }}>Options (The Choices)</label>
          {options.map((opt, index) => (
            <div key={opt.id} style={{ display: 'flex', gap: '12px' }}>
              <input 
                type="text" placeholder={`Option ${index + 1}`}
                style={{ flex: 1, padding: '12px 16px', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'var(--input-bg)', color: 'var(--text-primary)', outline: 'none' }}
                onFocus={(e) => e.target.style.border = '1px solid var(--neon-cyan)'} onBlur={(e) => e.target.style.border = '1px solid var(--glass-border)'}
              />
              <button 
                type="button" onClick={() => removeOption(opt.id)}
                style={{ background: 'rgba(255,0,0,0.1)', border: '1px solid rgba(255,0,0,0.3)', color: '#ff4444', borderRadius: '8px', padding: '0 16px', cursor: 'pointer' }}
              >
                <Trash2 size={20} />
              </button>
            </div>
          ))}
          <button type="button" onClick={addOption} className="btn-secondary" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '12px', width: '200px' }}>
            <Plus size={18} /> Add Option
          </button>
        </div>

        <div style={{ height: '1px', background: 'var(--glass-border)', margin: '10px 0' }}></div>

        {/* Criteria */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <label style={{ fontSize: '0.9rem', color: 'var(--text-primary)', fontWeight: '500' }}>Comparison Criteria</label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
            {['Cost', 'Risk', 'Benefits', 'Time', 'Effort', 'Impact'].map(c => (
              <button
                key={c} type="button" onClick={() => toggleCriteria(c)}
                style={{
                  padding: '8px 16px',
                  borderRadius: '20px',
                  border: `1px solid ${criteria.includes(c) ? 'var(--neon-pink)' : 'var(--glass-border)'}`,
                  background: criteria.includes(c) ? 'rgba(255,0,234,0.1)' : 'transparent',
                  color: criteria.includes(c) ? 'var(--neon-pink)' : 'var(--text-secondary)',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                {criteria.includes(c) && <CheckCircle size={14} />} {c}
              </button>
            ))}
          </div>
        </div>

        <button type="submit" className="btn-primary" style={{ padding: '16px', fontSize: '1.1rem', marginTop: '20px', boxShadow: 'var(--glow-cyan)' }}>
          Initialize Decision
        </button>
      </form>
    </div>
  );
};

export default CreateDecision;
