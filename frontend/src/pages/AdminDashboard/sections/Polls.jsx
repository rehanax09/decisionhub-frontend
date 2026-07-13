import React, { useState } from 'react';
import { BarChart2, Trash2, Lock, ChevronDown, ChevronUp } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

const MOCK = [
  { id: 1, title: 'Best Frontend Framework 2027', options: ['React','Vue','Svelte','Angular'], votes: [540, 320, 210, 180], status: 'OPEN',   owner: 'alexc_dev', created: 'Jun 10, 2026' },
  { id: 2, title: 'Preferred Cloud Provider',      options: ['AWS','GCP','Azure'],             votes: [890, 540, 420],      status: 'CLOSED', owner: 'dpark',     created: 'May 5, 2026'  },
  { id: 3, title: 'Top Programming Language',      options: ['Python','JS','Go','Rust'],       votes: [720, 650, 310, 280], status: 'OPEN',   owner: 'sarah_j',   created: 'Jun 22, 2026' },
  { id: 4, title: 'Best IDE for Web Dev',          options: ['VSCode','WebStorm','Neovim'],    votes: [980, 450, 230],      status: 'OPEN',   owner: 'priya_n',   created: 'Jun 28, 2026' },
];

const Polls = () => {
  const [polls, setPolls]         = useState(MOCK);
  const [expanded, setExpanded]   = useState(null);

  const closePoll  = (id) => setPolls(p => p.map(x => x.id === id ? { ...x, status: 'CLOSED' } : x));
  const deletePoll = (id) => { if (window.confirm('Delete this poll?')) setPolls(p => p.filter(x => x.id !== id)); };
  const toggleExpand = (id)  => setExpanded(prev => prev === id ? null : id);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Summary */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '20px', marginBottom: '8px' }}>
        {[
          { label: 'Total Polls', value: polls.length,                                  color: 'var(--neon-cyan)' },
          { label: 'Open',        value: polls.filter(p => p.status === 'OPEN').length,   color: 'var(--success)'   },
          { label: 'Closed',      value: polls.filter(p => p.status === 'CLOSED').length, color: 'var(--neon-pink)' },
        ].map((s, i) => (
          <div key={i} className="glass-panel" style={{ padding: '20px' }}>
            <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.82rem' }}>{s.label}</p>
            <h3 style={{ margin: '4px 0 0 0', fontSize: '2rem', fontFamily: 'Outfit', color: s.color }}>{s.value}</h3>
          </div>
        ))}
      </div>

      {/* Poll cards */}
      {polls.map(poll => {
        const total = poll.votes.reduce((a, b) => a + b, 0);
        const isOpen  = poll.status === 'OPEN';
        const isExpanded = expanded === poll.id;
        const chartData = poll.options.map((o, i) => ({ name: o, votes: poll.votes[i] }));

        return (
          <div key={poll.id} className="glass-panel" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <BarChart2 size={18} color="var(--neon-cyan)" />
                <div>
                  <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: '600' }}>{poll.title}</h4>
                  <p style={{ margin: '2px 0 0 0', color: 'var(--text-secondary)', fontSize: '0.8rem' }}>by @{poll.owner} · {total.toLocaleString()} votes · {poll.created}</p>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <span style={{ padding: '3px 10px', borderRadius: '20px', fontSize: '0.72rem', fontWeight: 'bold', background: isOpen ? 'rgba(0,255,153,0.1)' : 'rgba(255,0,0,0.08)', color: isOpen ? 'var(--success)' : '#ff4444', border: `1px solid ${isOpen ? 'rgba(0,255,153,0.3)' : 'rgba(255,0,0,0.3)'}` }}>{poll.status}</span>
                <button onClick={() => toggleExpand(poll.id)} style={{ padding: '6px', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'transparent', color: 'var(--neon-cyan)', cursor: 'pointer', display: 'flex' }}>
                  {isExpanded ? <ChevronUp size={15}/> : <ChevronDown size={15}/>}
                </button>
                {isOpen && <button onClick={() => closePoll(poll.id)} title="Close poll" style={{ padding: '6px', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'transparent', color: 'var(--neon-pink)', cursor: 'pointer', display: 'flex' }}><Lock size={15}/></button>}
                <button onClick={() => deletePoll(poll.id)} title="Delete" style={{ padding: '6px', borderRadius: '8px', border: '1px solid rgba(255,0,0,0.3)', background: 'transparent', color: '#ff4444', cursor: 'pointer', display: 'flex' }}><Trash2 size={15}/></button>
              </div>
            </div>

            {/* Expandable results chart */}
            {isExpanded && (
              <div style={{ marginTop: '20px', height: '180px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" horizontal={false} />
                    <XAxis type="number" stroke="var(--text-secondary)" tick={{ fontSize: 11 }} />
                    <YAxis type="category" dataKey="name" stroke="var(--text-secondary)" tick={{ fontSize: 11 }} width={80} />
                    <Tooltip contentStyle={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--glass-border)', borderRadius: '8px' }} />
                    <Bar dataKey="votes" fill="var(--neon-cyan)" radius={[0,4,4,0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default Polls;
