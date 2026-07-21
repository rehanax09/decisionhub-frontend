import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Plus, Trash2, Globe, Users, ChevronDown } from 'lucide-react';
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
  const [criteria, setCriteria] = useState(['Price', 'Performance', 'Battery', 'Weight', 'Warranty']);
  const [newCriterion, setNewCriterion] = useState('');
  const [options, setOptions] = useState([
    { optionTitle: '', description: '', pros: '', cons: '', values: {} },
    { optionTitle: '', description: '', pros: '', cons: '', values: {} }
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

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

  const handleOptionValueChange = (index, criterion, value) => {
    const newOptions = [...options];
    if (!newOptions[index].values) {
      newOptions[index].values = {};
    }
    newOptions[index].values[criterion] = value;
    setOptions(newOptions);
  };

  const addOption = () => {
    setOptions([...options, { optionTitle: '', description: '', pros: '', cons: '', values: {} }]);
  };

  const removeOption = (index) => {
    if (options.length > 2) {
      setOptions(options.filter((_, i) => i !== index));
    } else {
      alert("You must have at least two options.");
    }
  };

  const addCriterion = () => {
    if (newCriterion.trim() && !criteria.includes(newCriterion.trim())) {
      setCriteria([...criteria, newCriterion.trim()]);
      setNewCriterion('');
    }
  };

  const removeCriterion = (critToRemove) => {
    setCriteria(criteria.filter(c => c !== critToRemove));
    setOptions(options.map(opt => {
      const nextValues = { ...opt.values };
      delete nextValues[critToRemove];
      return { ...opt, values: nextValues };
    }));
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
        const createdDecisionId = res.data.data.id;
        localStorage.setItem(`decision_criteria_${createdDecisionId}`, JSON.stringify(criteria));
        localStorage.setItem(`decision_option_values_${createdDecisionId}`, JSON.stringify(
          options.map(opt => ({
            optionTitle: opt.optionTitle,
            values: opt.values
          }))
        ));

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

  const selectedCommunity = myCommunities.find(c => String(c.id) === String(communityId));

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', paddingBottom: '40px' }} className="card-animate">
      <h1 style={{ fontSize: '2.5rem', fontFamily: 'Outfit', margin: 0, marginBottom: '8px', textShadow: '0 0 20px rgba(0, 245, 255, 0.2)' }}>Create New Decision</h1>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '30px', fontSize: '1.05rem' }}>Frame your dilemma and invite the network to weigh in.</p>

      <form onSubmit={handleSubmit} className="glass-panel" style={{ padding: '40px', display: 'flex', flexDirection: 'column', gap: '30px', borderRadius: 'var(--radius-xl)', border: '1px solid var(--glass-border)' }}>
        
        {/* Title */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <label style={{ fontSize: '0.9rem', color: 'var(--text-primary)', fontWeight: '600' }}>Decision Title</label>
          <input 
            type="text" 
            required
            placeholder="e.g. MBA vs Corporate Job"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="input-premium"
          />
        </div>

        {/* Community Selection */}
        {!paramCommunityId && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', position: 'relative' }}>
            <label style={{ fontSize: '0.9rem', color: 'var(--text-primary)', fontWeight: '600' }}>Target Audience / Community</label>
            
            <div style={{ position: 'relative' }}>
              {/* Dropdown Trigger */}
              <button
                type="button"
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="input-premium"
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  cursor: 'pointer',
                  textAlign: 'left',
                  height: '48px',
                  width: '100%',
                  background: 'rgba(0, 0, 0, 0.45)',
                  border: '1px solid var(--glass-border)',
                  borderRadius: 'var(--radius-md)',
                  padding: '12px 18px',
                  color: 'var(--text-primary)',
                  fontFamily: 'inherit',
                  transition: 'all 0.3s ease'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  {selectedCommunity ? (
                    <>
                      <Users size={16} color="var(--neon-cyan)" />
                      <span>{selectedCommunity.name}</span>
                      <span className="badge-premium badge-cyan" style={{ fontSize: '0.65rem', padding: '2px 8px', textTransform: 'uppercase' }}>
                        {selectedCommunity.category}
                      </span>
                    </>
                  ) : (
                    <>
                      <Globe size={16} color="var(--success)" />
                      <span>Public (Open to everyone)</span>
                      <span className="badge-premium badge-success" style={{ fontSize: '0.65rem', padding: '2px 8px', textTransform: 'uppercase' }}>
                        Public
                      </span>
                    </>
                  )}
                </div>
                <ChevronDown size={18} style={{ transform: dropdownOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s', color: 'var(--text-secondary)' }} />
              </button>

              {/* Dropdown Menu */}
              {dropdownOpen && (
                <>
                  {/* Click Overlay to close */}
                  <div 
                    onClick={() => setDropdownOpen(false)} 
                    style={{ position: 'fixed', inset: 0, zIndex: 998 }} 
                  />
                  
                  <div 
                    className="glass-panel modal-animate" 
                    style={{
                      position: 'absolute',
                      top: 'calc(100% + 8px)',
                      left: 0,
                      width: '100%',
                      zIndex: 999,
                      background: 'rgba(15, 15, 15, 0.95)',
                      border: '1px solid var(--glass-border)',
                      borderRadius: 'var(--radius-md)',
                      overflow: 'hidden',
                      boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5), 0 0 1px rgba(0, 245, 255, 0.2)',
                      padding: '6px'
                    }}
                  >
                    {/* Public Option */}
                    <div
                      onClick={() => {
                        setCommunityId('');
                        setDropdownOpen(false);
                      }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '12px 14px',
                        borderRadius: 'var(--radius-sm)',
                        cursor: 'pointer',
                        background: !communityId ? 'rgba(0, 245, 255, 0.08)' : 'transparent',
                        transition: 'all 0.2s ease',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'rgba(0, 245, 255, 0.05)';
                        e.currentTarget.style.transform = 'translateX(4px)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = !communityId ? 'rgba(0, 245, 255, 0.08)' : 'transparent';
                        e.currentTarget.style.transform = 'none';
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <Globe size={15} color="var(--success)" />
                        <span style={{ fontSize: '0.92rem', color: !communityId ? 'var(--neon-cyan)' : 'var(--text-primary)' }}>Public (Open to everyone)</span>
                      </div>
                      <span className="badge-premium badge-success" style={{ fontSize: '0.65rem', padding: '2px 8px' }}>
                        Global
                      </span>
                    </div>

                    <div style={{ height: '1px', background: 'var(--glass-border)', margin: '6px 0' }} />

                    {/* Communities Options */}
                    {myCommunities.length === 0 ? (
                      <div style={{ padding: '12px 14px', color: 'var(--text-secondary)', fontSize: '0.85rem', textAlign: 'center' }}>
                        No moderating/joined communities found.
                      </div>
                    ) : (
                      myCommunities.map(c => {
                        const isSelected = String(c.id) === String(communityId);
                        return (
                          <div
                            key={c.id}
                            onClick={() => {
                              setCommunityId(String(c.id));
                              setDropdownOpen(false);
                            }}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              padding: '12px 14px',
                              borderRadius: 'var(--radius-sm)',
                              cursor: 'pointer',
                              background: isSelected ? 'rgba(0, 245, 255, 0.08)' : 'transparent',
                              transition: 'all 0.2s ease',
                              marginTop: '2px'
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.background = 'rgba(0, 245, 255, 0.05)';
                              e.currentTarget.style.transform = 'translateX(4px)';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.background = isSelected ? 'rgba(0, 245, 255, 0.08)' : 'transparent';
                              e.currentTarget.style.transform = 'none';
                            }}
                          >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                              <Users size={15} color="var(--neon-cyan)" />
                              <span style={{ fontSize: '0.92rem', color: isSelected ? 'var(--neon-cyan)' : 'var(--text-primary)' }}>{c.name}</span>
                            </div>
                            <span className="badge-premium badge-cyan" style={{ fontSize: '0.65rem', padding: '2px 8px' }}>
                              {c.category}
                            </span>
                          </div>
                        );
                      })
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {/* Category */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <label style={{ fontSize: '0.9rem', color: 'var(--text-primary)', fontWeight: '600' }}>Category</label>
          <div style={{ position: 'relative' }}>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="input-premium"
              style={{ appearance: 'none' }}
            >
                <option value="Technology" style={{ background: 'var(--bg-primary)', color: 'var(--text-primary)' }}>Technology</option>
                <option value="Finance" style={{ background: 'var(--bg-primary)', color: 'var(--text-primary)' }}>Finance</option>
                <option value="Career" style={{ background: 'var(--bg-primary)', color: 'var(--text-primary)' }}>Career</option>
                <option value="Travel" style={{ background: 'var(--bg-primary)', color: 'var(--text-primary)' }}>Travel</option>
                <option value="Lifestyle" style={{ background: 'var(--bg-primary)', color: 'var(--text-primary)' }}>Lifestyle</option>
            </select>
            <div style={{ position: 'absolute', right: '16px', top: '18px', pointerEvents: 'none', width: '0', height: '0', borderLeft: '5px solid transparent', borderRight: '5px solid transparent', borderTop: '5px solid var(--text-secondary)' }}></div>
          </div>
        </div>

        {/* Description */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <label style={{ fontSize: '0.9rem', color: 'var(--text-primary)', fontWeight: '600' }}>Description</label>
          <textarea 
            rows={4} 
            required
            placeholder="Provide context about the decision you need to make..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="input-premium"
            style={{ resize: 'vertical' }}
          />
        </div>

        {/* Comparison Criteria */}
        <div style={{ marginTop: '10px', padding: '24px', borderRadius: '16px', border: '1px solid var(--glass-border)', background: 'rgba(255,255,255,0.01)' }}>
          <h3 style={{ margin: 0, fontFamily: 'Outfit', color: 'var(--text-primary)', fontSize: '1.25rem', marginBottom: '8px' }}>Comparison Criteria</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '16px', lineHeight: '1.4' }}>
            Define comparison aspects (e.g. Price, Performance, Battery life). This generates matching input fields inside each option card for side-by-side comparison tables.
          </p>
          <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
            <input 
              type="text" 
              placeholder="e.g. Warranty" 
              value={newCriterion} 
              onChange={(e) => setNewCriterion(e.target.value)} 
              className="input-premium" 
              style={{ flex: 1 }}
            />
            <button 
              type="button" 
              onClick={addCriterion} 
              className="btn-secondary" 
              style={{ padding: '0 20px', borderRadius: '8px' }}
            >
              Add Criterion
            </button>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {criteria.map(crit => (
              <span 
                key={crit} 
                style={{ 
                  display: 'inline-flex', 
                  alignItems: 'center', 
                  gap: '8px', 
                  background: 'rgba(0, 245, 255, 0.08)', 
                  border: '1px solid rgba(0, 245, 255, 0.15)', 
                  color: 'var(--neon-cyan)', 
                  padding: '6px 12px', 
                  borderRadius: '20px', 
                  fontSize: '0.85rem' 
                }}
              >
                {crit}
                <button 
                  type="button" 
                  onClick={() => removeCriterion(crit)} 
                  style={{ background: 'transparent', border: 'none', color: 'var(--neon-pink)', cursor: 'pointer', fontWeight: 'bold', padding: 0 }}
                >
                  &times;
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Options Section */}
        <div style={{ marginTop: '10px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3 style={{ margin: 0, fontFamily: 'Outfit', color: 'var(--text-primary)', fontSize: '1.25rem' }}>Options</h3>
            <button type="button" onClick={addOption} className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', fontSize: '0.82rem', borderRadius: '20px' }}>
              <Plus size={15} /> Add Option
            </button>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {options.map((option, index) => (
              <div key={index} className="glass-panel" style={{ padding: '24px', borderRadius: '16px', border: '1px solid var(--glass-border)', background: 'rgba(255,255,255,0.01)', position: 'relative', transition: 'all 0.3s ease' }}>
                {options.length > 2 && (
                  <button 
                    type="button" 
                    onClick={() => removeOption(index)} 
                    style={{ position: 'absolute', top: '20px', right: '20px', background: 'transparent', border: 'none', color: '#DC2626', cursor: 'pointer', transition: 'all 0.2s' }} 
                    onMouseEnter={e => {
                      e.currentTarget.style.transform = 'scale(1.15)';
                      e.currentTarget.style.color = '#EF4444';
                    }} 
                    onMouseLeave={e => {
                      e.currentTarget.style.transform = 'scale(1)';
                      e.currentTarget.style.color = '#DC2626';
                    }}
                  >
                    <Trash2 size={18} />
                  </button>
                )}
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: '600' }}>Option {index + 1} Title</label>
                    <input 
                      type="text" 
                      required
                      placeholder="e.g. Option A"
                      value={option.optionTitle}
                      onChange={(e) => handleOptionChange(index, 'optionTitle', e.target.value)}
                      className="input-premium"
                    />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: '600' }}>Description</label>
                    <textarea 
                      rows={2}
                      placeholder="Brief details about this option..."
                      value={option.description}
                      onChange={(e) => handleOptionChange(index, 'description', e.target.value)}
                      className="input-premium"
                      style={{ resize: 'vertical' }}
                    />
                  </div>
                  <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1, minWidth: '200px' }}>
                      <label style={{ fontSize: '0.85rem', color: 'var(--success)', fontWeight: '600' }}>Pros</label>
                      <input 
                        type="text" 
                        placeholder="e.g. Higher salary"
                        value={option.pros}
                        onChange={(e) => handleOptionChange(index, 'pros', e.target.value)}
                        className="input-premium input-premium-pro"
                      />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1, minWidth: '200px' }}>
                      <label style={{ fontSize: '0.85rem', color: 'var(--neon-pink)', fontWeight: '600' }}>Cons</label>
                      <input 
                        type="text" 
                        placeholder="e.g. Less free time"
                        value={option.cons}
                        onChange={(e) => handleOptionChange(index, 'cons', e.target.value)}
                        className="input-premium input-premium-con"
                      />
                    </div>
                  </div>

                  {/* Criteria Values Inputs */}
                  {criteria.length > 0 && (
                    <div style={{ 
                      marginTop: '8px', 
                      padding: '16px', 
                      borderRadius: '8px', 
                      background: 'rgba(255,255,255,0.01)', 
                      border: '1px solid var(--glass-border)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '12px'
                    }}>
                      <h4 style={{ margin: 0, fontSize: '0.9rem', color: 'var(--neon-cyan)', fontFamily: 'Outfit' }}>Criteria Specifications</h4>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px' }}>
                        {criteria.map(crit => (
                          <div key={crit} style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                            <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{crit}</label>
                            <input 
                              type="text" 
                              placeholder={`Value for ${crit}`}
                              value={option.values?.[crit] || ''}
                              onChange={(e) => handleOptionValueChange(index, crit, e.target.value)}
                              className="input-premium"
                              style={{ height: '36px', padding: '6px 12px', fontSize: '0.85rem' }}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <button 
          type="submit" 
          disabled={isSubmitting}
          className="btn-primary" 
          style={{ padding: '16px', fontSize: '1.05rem', marginTop: '20px', borderRadius: '12px', boxShadow: 'var(--glow-cyan)' }}
        >
          {isSubmitting ? 'Initializing Decision...' : 'Initialize Decision'}
        </button>
      </form>
    </div>
  );
};

export default CreateDecision;
