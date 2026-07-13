import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/api';

const CreateDecision = () => {
  const navigate = useNavigate();
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Technology');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      alert("Please fill in the title and description.");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await api.post('/api/decisions', {
        title,
        description,
        category
      });

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
            <option value="Technology">Technology</option>
            <option value="Finance">Finance</option>
            <option value="Career">Career</option>
            <option value="Travel">Travel</option>
            <option value="Lifestyle">Lifestyle</option>
          </select>
        </div>

        {/* Description */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <label style={{ fontSize: '0.9rem', color: 'var(--text-primary)', fontWeight: '500' }}>Description</label>
          <textarea 
            rows={6} 
            required
            placeholder="Provide context about the decision you need to make..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            style={{ padding: '12px 16px', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'var(--input-bg)', color: 'var(--text-primary)', outline: 'none', width: '100%', resize: 'vertical' }}
            onFocus={(e) => e.target.style.border = '1px solid var(--neon-cyan)'} 
            onBlur={(e) => e.target.style.border = '1px solid var(--glass-border)'}
          />
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
