import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ThumbsUp, ThumbsDown, MessageSquare, BarChart2, CheckCircle } from 'lucide-react';

// Mock DB for dynamic decisions based on ID
const decisionData = {
  1: {
    title: 'MBA vs Corporate Job',
    status: 'Open Discussion',
    tags: ['Career', 'Education'],
    creator: 'Alex_Neural',
    timeAgo: '2 days ago',
    votes: 120,
    optionA: { name: 'Pursue MBA', percentage: 65, pros: ['Higher long-term salary ceiling', 'Extensive alumni network', 'Pivot to new industry easier'], cons: ['Extremely high upfront cost', '2 years of lost income'] },
    optionB: { name: 'Corporate Job', percentage: 35, pros: ['Immediate income and savings', 'Real-world experience gained', 'Zero student debt'], cons: ['Harder to switch completely different fields', 'Slower promotion track initially'] }
  },
  2: {
    title: 'Goa vs Bali',
    status: 'Voting Active',
    tags: ['Travel'],
    creator: 'TravelBug99',
    timeAgo: '5 hours ago',
    votes: 89,
    optionA: { name: 'Goa, India', percentage: 40, pros: ['Cheaper flights and stay', 'Familiar food and culture', 'Great nightlife'], cons: ['Can be very crowded', 'Beaches are less pristine'] },
    optionB: { name: 'Bali, Indonesia', percentage: 60, pros: ['Exotic culture and temples', 'World-class surfing and beaches', 'Unique villas'], cons: ['Longer flight time', 'Slightly more expensive overall'] }
  },
  3: {
    title: 'React vs Vue for next project',
    status: 'Open Discussion',
    tags: ['Technology'],
    creator: 'DevGuru',
    timeAgo: '1 day ago',
    votes: 432,
    optionA: { name: 'React', percentage: 70, pros: ['Huge ecosystem and community', 'Easier to hire developers', 'React Native compatibility'], cons: ['Steeper learning curve', 'Boilerplate heavy'] },
    optionB: { name: 'Vue', percentage: 30, pros: ['Gentle learning curve', 'Excellent official documentation', 'Cleaner single-file components'], cons: ['Smaller job market', 'Fewer enterprise plugins'] }
  },
  4: {
    title: 'Buy House vs Invest in Stocks',
    status: 'Closed',
    tags: ['Finance'],
    creator: 'WealthBuilder',
    timeAgo: '1 week ago',
    votes: 215,
    optionA: { name: 'Buy a House', percentage: 55, pros: ['Tangible asset', 'Forced savings', 'Rental income potential'], cons: ['High upfront down payment', 'Illiquid asset', 'Maintenance costs'] },
    optionB: { name: 'Invest in Stocks', percentage: 45, pros: ['Highly liquid', 'Historical 7-10% return', 'Zero maintenance'], cons: ['Market volatility', 'No physical utility'] }
  },
  5: {
    title: 'iPhone 15 vs Pixel 8',
    status: 'Voting Active',
    tags: ['Technology'],
    creator: 'TechEnthusiast',
    timeAgo: '3 days ago',
    votes: 890,
    optionA: { name: 'iPhone 15', percentage: 52, pros: ['Incredible video recording', 'Ecosystem integration (AirDrop, Apple Watch)', 'High resale value'], cons: ['Expensive', 'iOS can feel restrictive'] },
    optionB: { name: 'Pixel 8', percentage: 48, pros: ['Best still photography', 'Clean Android experience', 'Cheaper starting price'], cons: ['Lower resale value', 'Video isn\'t as good as iPhone'] }
  },
  6: {
    title: 'Remote Work vs Hybrid',
    status: 'Open Discussion',
    tags: ['Career', 'Lifestyle'],
    creator: 'NomadWorker',
    timeAgo: '12 hours ago',
    votes: 156,
    optionA: { name: 'Fully Remote', percentage: 80, pros: ['Zero commute time', 'Work from anywhere', 'Better work-life balance'], cons: ['Can feel isolating', 'Harder to build team culture'] },
    optionB: { name: 'Hybrid', percentage: 20, pros: ['Face-to-face collaboration', 'Clear separation of home and work', 'Office perks'], cons: ['Still requires commuting', 'Less flexibility'] }
  }
};

const DecisionDetails = () => {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState('overview');

  // Fetch decision by ID, fallback to ID 1 if not found
  const decision = decisionData[id] || decisionData[1];

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
      <div style={{ marginBottom: '30px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
            {decision.tags.map(tag => (
              <span key={tag} style={{ color: 'var(--neon-cyan)', fontSize: '0.9rem', background: 'rgba(0,245,255,0.1)', padding: '4px 8px', borderRadius: '4px' }}>#{tag}</span>
            ))}
            <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', background: 'var(--chip-bg)', padding: '4px 8px', borderRadius: '4px' }}>{decision.status}</span>
          </div>
          <h1 style={{ fontSize: '2.5rem', fontFamily: 'Outfit', margin: 0, marginBottom: '8px' }}>{decision.title}</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Created by <span style={{ color: 'var(--neon-cyan)' }}>{decision.creator}</span> • {decision.timeAgo}</p>
        </div>
        <Link to={`/decision/${id}/compare`} className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <BarChart2 size={18} /> View Radar Comparison
        </Link>
      </div>

      <div className="glass-panel" style={{ padding: '30px', marginBottom: '30px' }}>
        <h3 style={{ marginBottom: '16px', fontFamily: 'Outfit' }}>Current Consensus Progress ({decision.votes} Votes)</h3>
        <div style={{ height: '8px', background: 'var(--glass-border)', borderRadius: '4px', display: 'flex', overflow: 'hidden', marginBottom: '10px' }}>
          <div style={{ width: `${decision.optionA.percentage}%`, background: 'var(--neon-cyan)', transition: 'width 1s ease' }}></div>
          <div style={{ width: `${decision.optionB.percentage}%`, background: 'var(--neon-pink)', transition: 'width 1s ease' }}></div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
          <span style={{ color: 'var(--neon-cyan)' }}>{decision.optionA.percentage}% ({decision.optionA.name})</span>
          <span style={{ color: 'var(--neon-pink)' }}>{decision.optionB.percentage}% ({decision.optionB.name})</span>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '20px', borderBottom: '1px solid var(--glass-border)', marginBottom: '30px' }}>
        {['Overview', 'Discussion'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab.toLowerCase())}
            style={{
              background: 'transparent',
              border: 'none',
              color: activeTab === tab.toLowerCase() ? 'var(--neon-cyan)' : 'var(--text-secondary)',
              padding: '12px 0',
              fontSize: '1.1rem',
              fontFamily: 'Outfit',
              borderBottom: activeTab === tab.toLowerCase() ? '2px solid var(--neon-cyan)' : '2px solid transparent',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === 'overview' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px' }}>
          {/* Option A */}
          <div className="glass-panel" style={{ padding: '30px', border: '1px solid rgba(0,245,255,0.3)', display: 'flex', flexDirection: 'column' }}>
            <h2 style={{ fontSize: '1.8rem', color: 'var(--neon-cyan)', marginBottom: '20px' }}>Option A: {decision.optionA.name}</h2>
            
            <div style={{ marginBottom: '20px' }}>
              <h4 style={{ color: 'var(--success)', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                <ThumbsUp size={16} /> Pros
              </h4>
              <ul style={{ color: 'var(--text-secondary)', paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {decision.optionA.pros.map((pro, idx) => <li key={idx}>{pro}</li>)}
              </ul>
            </div>

            <div style={{ marginBottom: '30px', flex: 1 }}>
              <h4 style={{ color: 'var(--warning)', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                <ThumbsDown size={16} /> Cons
              </h4>
              <ul style={{ color: 'var(--text-secondary)', paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {decision.optionA.cons.map((con, idx) => <li key={idx}>{con}</li>)}
              </ul>
            </div>

            <button className="btn-primary" style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', marginTop: 'auto' }}>
              <CheckCircle size={18} /> Vote for {decision.optionA.name}
            </button>
          </div>

          {/* Option B */}
          <div className="glass-panel" style={{ padding: '30px', border: '1px solid rgba(255,0,234,0.3)', display: 'flex', flexDirection: 'column' }}>
            <h2 style={{ fontSize: '1.8rem', color: 'var(--neon-pink)', marginBottom: '20px' }}>Option B: {decision.optionB.name}</h2>
            
            <div style={{ marginBottom: '20px' }}>
              <h4 style={{ color: 'var(--success)', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                <ThumbsUp size={16} /> Pros
              </h4>
              <ul style={{ color: 'var(--text-secondary)', paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {decision.optionB.pros.map((pro, idx) => <li key={idx}>{pro}</li>)}
              </ul>
            </div>

            <div style={{ marginBottom: '30px', flex: 1 }}>
              <h4 style={{ color: 'var(--warning)', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                <ThumbsDown size={16} /> Cons
              </h4>
              <ul style={{ color: 'var(--text-secondary)', paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {decision.optionB.cons.map((con, idx) => <li key={idx}>{con}</li>)}
              </ul>
            </div>

            <button className="btn-secondary" style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', marginTop: 'auto' }}>
              <CheckCircle size={18} /> Vote for {decision.optionB.name}
            </button>
          </div>
        </div>
      )}

      {activeTab === 'discussion' && (
        <div className="glass-panel" style={{ padding: '30px' }}>
          <h3 style={{ marginBottom: '20px' }}>Network Discussion - {decision.title}</h3>
          <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)' }}>
            <MessageSquare size={48} style={{ opacity: 0.3, marginBottom: '16px' }} />
            <h4>Discussion thread is active</h4>
            <p>Chat UI implementation goes here.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default DecisionDetails;
