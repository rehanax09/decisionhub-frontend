import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend
} from 'recharts';
import { ArrowLeft, Check } from 'lucide-react';
import api from '../../api/api';

const ComparisonPage = () => {
  const { id } = useParams();
  const [decision, setDecision] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDecision = async () => {
      try {
        const res = await api.get(`/api/decisions/${id}`);
        if (res.data?.success) {
          const fetchedDecision = res.data.data;
          
          // Automatically clear old dummy criteria from local storage if they exist
          const storedCriteriaRaw = localStorage.getItem(`decision_criteria_${id}`);
          if (storedCriteriaRaw) {
            try {
              const parsed = JSON.parse(storedCriteriaRaw);
              if (Array.isArray(parsed) && parsed.includes("Price") && parsed.includes("Performance")) {
                localStorage.removeItem(`decision_criteria_${id}`);
                localStorage.removeItem(`decision_option_values_${id}`);
              }
            } catch (e) {}
          }

          // Attempt to retrieve criteria and values from localStorage
          const storedCriteria = localStorage.getItem(`decision_criteria_${id}`);
          const storedOptionValues = localStorage.getItem(`decision_option_values_${id}`);
          
          if (storedCriteria && storedOptionValues) {
            fetchedDecision.criteria = JSON.parse(storedCriteria);
            const parsedOptionValues = JSON.parse(storedOptionValues);
            
            fetchedDecision.options = fetchedDecision.options.map(opt => {
              const match = parsedOptionValues.find(o => o.optionTitle === opt.optionTitle);
              return {
                ...opt,
                values: match ? match.values : {}
              };
            });
          } else {
            fetchedDecision.criteria = [];
            fetchedDecision.options = fetchedDecision.options.map(opt => {
              return {
                ...opt,
                values: {}
              };
            });
          }
          
          setDecision(fetchedDecision);
        }
      } catch (err) {
        console.error("Failed to fetch decision for comparison:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDecision();
  }, [id]);

  if (loading) {
    return (
      <div style={{ padding: '80px', textAlign: 'center', color: 'var(--text-secondary)' }} className="glass-panel">
        <div style={{ border: '3px solid rgba(0, 245, 255, 0.1)', borderTop: '3px solid var(--neon-cyan)', borderRadius: '50%', width: '40px', height: '40px', animation: 'spin 1s linear infinite', margin: '0 auto 20px auto' }}></div>
        <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
        <h3>Loading results...</h3>
      </div>
    );
  }

  if (!decision || !decision.options || decision.options.length === 0) {
    return (
      <div style={{ padding: '80px', textAlign: 'center', color: 'var(--text-secondary)' }} className="glass-panel">
        <h3>No options available to view.</h3>
        <Link to={`/decision/${id}`} className="btn-secondary" style={{ marginTop: '20px', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
          <ArrowLeft size={16} /> Back to Decision
        </Link>
      </div>
    );
  }

  // Calculate vote totals and stats
  const totalVotes = decision.options.reduce((sum, opt) => sum + (opt.score || 0), 0);

  // Construct Pie/Donut Chart data (only show options with votes)
  const pieData = decision.options
    .map(opt => ({
      name: opt.optionTitle,
      value: opt.score || 0
    }))
    .filter(d => d.value > 0);

  // Recommendation: Option with the highest score
  const sortedOptions = [...decision.options].sort((a, b) => (b.score || 0) - (a.score || 0));
  const leadingOption = sortedOptions[0];
  const isDraw = sortedOptions.length > 1 && sortedOptions[0].score === sortedOptions[1].score && sortedOptions[0].score > 0;
  const hasVotes = totalVotes > 0;

  // Curated color palette mapping for options
  const CHART_COLORS = ['#00F5FF', '#FF00FF', '#8A2BE2', '#00FF99'];

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', paddingBottom: '40px' }}>
      
      {/* Header */}
      <div style={{ marginBottom: '30px', display: 'flex', alignItems: 'center', gap: '16px' }}>
        <Link to={`/decision/${id}`} style={{ color: 'var(--text-secondary)', display: 'flex', alignItems: 'center' }}>
          <ArrowLeft size={24} />
        </Link>
        <div>
          <h1 style={{ fontSize: '2rem', fontFamily: 'Outfit', margin: 0 }}>Results Overview</h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: '4px' }}>Consensus breakdown for: "{decision.title}"</p>
        </div>
      </div>

      {/* Top Banner Recommendation */}
      <div className="glass-panel" style={{ padding: '24px', marginBottom: '30px', background: 'rgba(255, 255, 255, 0.02)', border: '1px solid var(--glass-border)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {hasVotes ? (
          isDraw ? (
            <>
              <h2 style={{ color: 'var(--neon-cyan)', margin: 0, fontSize: '1.4rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                🤝 Current State: Tie
              </h2>
              <p style={{ color: 'var(--text-secondary)', margin: 0, fontSize: '0.95rem' }}>
                The leading options are currently tied in vote score. Cast a vote to break the tie!
              </p>
            </>
          ) : (
            <>
              <h2 style={{ color: 'var(--neon-cyan)', margin: 0, fontSize: '1.4rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                🏆 Leading Option: {leadingOption.optionTitle}
              </h2>
              <p style={{ color: 'var(--text-secondary)', margin: 0, fontSize: '0.95rem' }}>
                Based on <strong>{totalVotes} total votes</strong>, {leadingOption.optionTitle} is leading with <strong>{Math.round((leadingOption.score / totalVotes) * 100)}%</strong> of the network consensus.
              </p>
            </>
          )
        ) : (
          <>
            <h2 style={{ color: 'var(--text-secondary)', margin: 0, fontSize: '1.4rem' }}>
              📊 Awaiting Votes
            </h2>
            <p style={{ color: 'var(--text-secondary)', margin: 0, fontSize: '0.95rem' }}>
              No votes have been cast yet. Share this decision board to gather consensus.
            </p>
          </>
        )}
      </div>

      {/* Split grid: Progress bars list on left, Donut chart on right */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '30px', marginBottom: '40px' }}>
        
        {/* Vote Percentages Lists */}
        <div className="glass-panel" style={{ padding: '30px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <h3 style={{ margin: 0, fontFamily: 'Outfit' }}>Vote Breakdown</h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {decision.options.map((opt, idx) => {
              const voteCount = opt.score || 0;
              const percentage = totalVotes > 0 ? Math.round((voteCount / totalVotes) * 100) : 0;
              const color = CHART_COLORS[idx % CHART_COLORS.length];
              const isWinner = hasVotes && !isDraw && opt.id === leadingOption.id;

              return (
                <div key={opt.id} style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontWeight: '600', color: isWinner ? 'var(--text-primary)' : 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      {opt.optionTitle} {isWinner && <Check size={16} color="var(--success)" />}
                    </span>
                    <span style={{ fontSize: '0.9rem', color: color, fontWeight: 'bold' }}>
                      {voteCount} {voteCount === 1 ? 'vote' : 'votes'} ({percentage}%)
                    </span>
                  </div>
                  {/* Progress Bar Container */}
                  <div style={{ width: '100%', height: '10px', background: 'rgba(255, 255, 255, 0.05)', borderRadius: '5px', overflow: 'hidden' }}>
                    <div style={{ 
                      width: `${percentage}%`, 
                      height: '100%', 
                      background: color, 
                      borderRadius: '5px',
                      boxShadow: `0 0 8px ${color}80`,
                      transition: 'width 0.6s cubic-bezier(0.1, 0.8, 0.2, 1)'
                    }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Donut Chart Visualization */}
        <div className="glass-panel" style={{ padding: '30px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <h3 style={{ marginBottom: '20px', fontFamily: 'Outfit' }}>Consensus Share</h3>
          
          {hasVotes ? (
            <div style={{ width: '100%', height: '240px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    innerRadius={60}
                    outerRadius={85}
                    paddingAngle={4}
                    dataKey="value"
                    stroke="none"
                  >
                    {pieData.map((entry, index) => {
                      // Resolve original color index based on matches
                      const origIndex = decision.options.findIndex(o => o.optionTitle === entry.name);
                      return (
                        <Cell key={`cell-${index}`} fill={CHART_COLORS[origIndex % CHART_COLORS.length]} />
                      );
                    })}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--glass-border)', borderRadius: '8px' }} />
                  <Legend verticalAlign="bottom" height={36} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div style={{ height: '240px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)' }}>
              <p>Donut chart will display once votes are received.</p>
            </div>
          )}
        </div>
      </div>

      {/* Comparison Matrix Table */}
      {decision.criteria && decision.criteria.length > 0 && (
        <div className="glass-panel" style={{ padding: '30px', marginBottom: '40px' }}>
          <h3 style={{ marginBottom: '24px', fontFamily: 'Outfit' }}>Comparison Matrix</h3>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', color: 'var(--text-primary)' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--glass-border)' }}>
                  <th style={{ textAlign: 'left', padding: '12px 16px', fontWeight: 'bold', fontSize: '1rem', color: 'var(--neon-cyan)' }}>Criteria</th>
                  {decision.options.map(opt => (
                    <th key={opt.id} style={{ textAlign: 'center', padding: '12px 16px', fontWeight: 'bold', fontSize: '1rem' }}>
                      {opt.optionTitle}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {decision.criteria.map((crit, cIdx) => (
                  <tr key={crit} style={{ borderBottom: cIdx === decision.criteria.length - 1 ? 'none' : '1px solid var(--glass-border)', background: cIdx % 2 === 0 ? 'rgba(255, 255, 255, 0.01)' : 'transparent' }}>
                    <td style={{ textAlign: 'left', padding: '16px', fontWeight: '500', color: 'var(--text-secondary)', fontSize: '0.95rem' }}>{crit}</td>
                    {decision.options.map(opt => (
                      <td key={opt.id} style={{ textAlign: 'center', padding: '16px', fontSize: '0.95rem' }}>
                        {opt.values?.[crit] || '-'}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Dynamic Option Comparison Matrix Table (Simple Text comparison) */}
      <div className="glass-panel" style={{ padding: '30px' }}>
        <h3 style={{ marginBottom: '24px', fontFamily: 'Outfit' }}>Qualitative Side-by-Side Comparison</h3>
        
        <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', gap: '20px' }}>
          {decision.options.map((opt, idx) => (
            <div key={opt.id} style={{ flex: 1, minWidth: '220px', display: 'flex', flexDirection: 'column', gap: '16px', borderRight: idx === decision.options.length - 1 ? 'none' : '1px solid var(--glass-border)', paddingRight: '20px' }}>
              <div>
                <h4 style={{ margin: 0, fontSize: '1.15rem', color: 'var(--text-primary)' }}>{opt.optionTitle}</h4>
                {opt.description && (
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '6px', lineHeight: '1.4' }}>{opt.description}</p>
                )}
              </div>
              
              {/* Pros */}
              <div>
                <div style={{ color: 'var(--success)', fontWeight: 'bold', fontSize: '0.85rem', marginBottom: '6px' }}>Pros</div>
                {opt.pros ? (
                  <ul style={{ paddingLeft: '16px', margin: 0, fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                    {opt.pros.split(',').map((pro, pIdx) => (
                      <li key={pIdx}>{pro.trim()}</li>
                    ))}
                  </ul>
                ) : (
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', fontStyle: 'italic', margin: 0 }}>None mentioned</p>
                )}
              </div>

              {/* Cons */}
              <div>
                <div style={{ color: 'var(--neon-pink)', fontWeight: 'bold', fontSize: '0.85rem', marginBottom: '6px' }}>Cons</div>
                {opt.cons ? (
                  <ul style={{ paddingLeft: '16px', margin: 0, fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                    {opt.cons.split(',').map((con, cIdx) => (
                      <li key={cIdx}>{con.trim()}</li>
                    ))}
                  </ul>
                ) : (
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', fontStyle: 'italic', margin: 0 }}>None mentioned</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default ComparisonPage;
