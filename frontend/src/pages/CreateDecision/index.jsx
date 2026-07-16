import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Plus, Trash2 } from 'lucide-react';
import api from '../../api/api';

const CreateDecision = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const paramCommunityId = searchParams.get('communityId');
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Technology');
  const [communityId, setCommunityId] = useState(paramCommunityId || '');
  const [myCommunities, setMyCommunities] = useState([]);
  const [options, setOptions] = useState([
    { optionTitle: '', description: '', pros: '', cons: '' },
    { optionTitle: '', description: '', pros: '', cons: '' }
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  React.useEffect(() => {
    const fetchModeratorCommunities = async () => {
      try {
        const userRes = await api.get('/api/users/me');
        const user = userRes.data?.data;
        if (user) {
          const commsRes = await api.get('/api/communities');
          if (commsRes.data?.success) {
             const joinedList = JSON.parse(localStorage.getItem(`joined_comm_${user.id}`) || "[]");
             const allowed = commsRes.data.data.filter(c => 
                 c.moderatorUsername === user.username || joinedList.includes(c.id) || user.role === 'ADMIN'
             );
             setMyCommunities(allowed);
          }
        }
      } catch (err) {
        console.error("Failed to load communities for decision creation:", err);
      }
    };
    fetchModeratorCommunities();
  }, []);

  const handleOptionChange = (index, field, value) => {
    const newOptions = [...options];
    newOptions[index][field] = value;
    setOptions(newOptions);
  };

  const addOption = () => {
    setOptions([...options, { optionTitle: '', description: '', pros: '', cons: '' }]);
  };

  const removeOption = (index) => {
    if (options.length > 2) {
      setOptions(options.filter((_, i) => i !== index));
    } else {
      alert("You must have at least two options.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      alert("Please fill in the title and description.");
      return;
    }

    if (options.some(opt => !opt.optionTitle.trim())) {
      alert("All options must have a title.");
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        title,
        description,
        category,
        options
      };
      if (communityId) {
        payload.communityId = parseInt(communityId);
      }

      const res = await api.post('/api/decisions', payload);

      if (res.data?.success) {
        alert("Decision initialized successfully!");
        navigate('/decision-board');
      }
    } catch (err) {
      console.error("Failed to create decision:", err);
      alert(err.response?.data?.message || "Failed to initialize decision.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '2rem', fontFamily: 'Outfit', margin: 0, marginBottom: '10px' }}>Create New Decision</h1>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '30px' }}>Frame your dilemma and invite the network to weigh in.</p>

      <form onSubmit={handleSubmit} className="glass-panel" style={{ padding: '40px', display: 'flex', flexDirection: 'column', gap: '30px' }}>
        
        {/* Title */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <label style={{ fontSize: '0.9rem', color: 'var(--text-primary)', fontWeight: '500' }}>Decision Title</label>
          <input 
            type="text" 
            required
            placeholder="e.g. MBA vs Corporate Job"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={{ padding: '12px 16px', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'var(--input-bg)', color: 'var(--text-primary)', outline: 'none', width: '100%' }}
            onFocus={(e) => e.target.style.border = '1px solid var(--neon-cyan)'} 
            onBlur={(e) => e.target.style.border = '1px solid var(--glass-border)'}
          />
        </div>

        {/* Community Selection */}
        {!paramCommunityId && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontSize: '0.9rem', color: 'var(--text-primary)', fontWeight: '500' }}>Target Audience / Community</label>
            <select
              value={communityId}
              onChange={(e) => setCommunityId(e.target.value)}
              style={{
                padding: '12px 16px',
                borderRadius: '8px',
                border: '1px solid var(--glass-border)',
                background: 'var(--input-bg)',
                color: 'var(--text-primary)',
                outline: 'none',
                width: '100%'
              }}
            >
              <option value="" style={{ background: 'var(--bg-primary)', color: 'var(--text-primary)' }}>Public (Open to everyone)</option>
              {myCommunities.map(c => (
                <option key={c.id} value={c.id} style={{ background: 'var(--bg-primary)', color: 'var(--text-primary)' }}>{c.name}</option>
              ))}
            </select>
          </div>
        )}

        {/* Category */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <label style={{ fontSize: '0.9rem', color: 'var(--text-primary)', fontWeight: '500' }}>Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            style={{
              padding: '12px 16px',
              borderRadius: '8px',
              border: '1px solid var(--glass-border)',
              background: 'var(--input-bg)',
              color: 'var(--text-primary)',
              outline: 'none',
              width: '100%'
            }}
          >
              <option value="Technology" style={{ background: 'var(--bg-primary)', color: 'var(--text-primary)' }}>Technology</option>
              <option value="Finance" style={{ background: 'var(--bg-primary)', color: 'var(--text-primary)' }}>Finance</option>
              <option value="Career" style={{ background: 'var(--bg-primary)', color: 'var(--text-primary)' }}>Career</option>
              <option value="Travel" style={{ background: 'var(--bg-primary)', color: 'var(--text-primary)' }}>Travel</option>
              <option value="Lifestyle" style={{ background: 'var(--bg-primary)', color: 'var(--text-primary)' }}>Lifestyle</option>
          </select>
        </div>

        {/* Description */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <label style={{ fontSize: '0.9rem', color: 'var(--text-primary)', fontWeight: '500' }}>Description</label>
          <textarea 
            rows={4} 
            required
            placeholder="Provide context about the decision you need to make..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            style={{ padding: '12px 16px', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'var(--input-bg)', color: 'var(--text-primary)', outline: 'none', width: '100%', resize: 'vertical' }}
            onFocus={(e) => e.target.style.border = '1px solid var(--neon-cyan)'} 
            onBlur={(e) => e.target.style.border = '1px solid var(--glass-border)'}
          />
        </div>

        {/* Options Section */}
        <div style={{ marginTop: '10px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ margin: 0, fontFamily: 'Outfit', color: 'var(--text-primary)' }}>Options</h3>
            <button type="button" onClick={addOption} className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 12px', fontSize: '0.85rem' }}>
              <Plus size={14} /> Add Option
            </button>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {options.map((option, index) => (
              <div key={index} style={{ padding: '20px', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'rgba(255,255,255,0.02)', position: 'relative' }}>
                {options.length > 2 && (
                  <button type="button" onClick={() => removeOption(index)} style={{ position: 'absolute', top: '16px', right: '16px', background: 'transparent', border: 'none', color: 'var(--neon-pink)', cursor: 'pointer' }}>
                    <Trash2 size={18} />
                  </button>
                )}
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Option {index + 1} Title</label>
                    <input 
                      type="text" 
                      required
                      placeholder="e.g. Option A"
                      value={option.optionTitle}
                      onChange={(e) => handleOptionChange(index, 'optionTitle', e.target.value)}
                      style={{ padding: '10px', borderRadius: '6px', border: '1px solid var(--glass-border)', background: 'var(--input-bg)', color: 'var(--text-primary)', outline: 'none', width: '100%' }}
                      onFocus={(e) => e.target.style.border = '1px solid var(--neon-cyan)'} 
                      onBlur={(e) => e.target.style.border = '1px solid var(--glass-border)'}
                    />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Description</label>
                    <textarea 
                      rows={2}
                      placeholder="Brief details about this option..."
                      value={option.description}
                      onChange={(e) => handleOptionChange(index, 'description', e.target.value)}
                      style={{ padding: '10px', borderRadius: '6px', border: '1px solid var(--glass-border)', background: 'var(--input-bg)', color: 'var(--text-primary)', outline: 'none', width: '100%', resize: 'vertical' }}
                      onFocus={(e) => e.target.style.border = '1px solid var(--neon-cyan)'} 
                      onBlur={(e) => e.target.style.border = '1px solid var(--glass-border)'}
                    />
                  </div>
                  <div style={{ display: 'flex', gap: '16px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
                      <label style={{ fontSize: '0.85rem', color: 'var(--neon-cyan)' }}>Pros</label>
                      <input 
                        type="text" 
                        placeholder="e.g. Higher salary"
                        value={option.pros}
                        onChange={(e) => handleOptionChange(index, 'pros', e.target.value)}
                        style={{ padding: '10px', borderRadius: '6px', border: '1px solid var(--glass-border)', background: 'var(--input-bg)', color: 'var(--text-primary)', outline: 'none', width: '100%' }}
                        onFocus={(e) => e.target.style.border = '1px solid var(--neon-cyan)'} 
                        onBlur={(e) => e.target.style.border = '1px solid var(--glass-border)'}
                      />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
                      <label style={{ fontSize: '0.85rem', color: 'var(--neon-pink)' }}>Cons</label>
                      <input 
                        type="text" 
                        placeholder="e.g. Less free time"
                        value={option.cons}
                        onChange={(e) => handleOptionChange(index, 'cons', e.target.value)}
                        style={{ padding: '10px', borderRadius: '6px', border: '1px solid var(--glass-border)', background: 'var(--input-bg)', color: 'var(--text-primary)', outline: 'none', width: '100%' }}
                        onFocus={(e) => e.target.style.border = '1px solid var(--neon-pink)'} 
                        onBlur={(e) => e.target.style.border = '1px solid var(--glass-border)'}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <button 
          type="submit" 
          disabled={isSubmitting}
          className="btn-primary" 
          style={{ padding: '16px', fontSize: '1.1rem', marginTop: '20px', boxShadow: 'var(--glow-cyan)' }}
        >
          {isSubmitting ? 'Initializing Decision...' : 'Initialize Decision'}
        </button>
      </form>
    </div>
  );
};

export default CreateDecision;
