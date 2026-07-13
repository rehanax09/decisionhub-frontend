import React, { useState } from 'react';
import { ResponsiveContainer, AreaChart, Area, BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const userGrowth = [
  { month: 'Jan', users: 120 }, { month: 'Feb', users: 230 }, { month: 'Mar', users: 310 },
  { month: 'Apr', users: 480 }, { month: 'May', users: 620 }, { month: 'Jun', users: 890 },
  { month: 'Jul', users: 1100 },
];

const votingTrends = [
  { week: 'W1', votes: 1200 }, { week: 'W2', votes: 1800 }, { week: 'W3', votes: 1500 },
  { week: 'W4', votes: 2400 }, { week: 'W5', votes: 2100 }, { week: 'W6', votes: 3100 },
];

const topBoards = [
  { name: 'MBA vs Corp', votes: 12400 },
  { name: 'React vs Vue', votes: 8900  },
  { name: 'M3 vs XPS',   votes: 3420  },
  { name: 'Freelance',   votes: 5670  },
  { name: 'City vs Rural',votes: 2100 },
];

const communityData = [
  { name: 'Tech Innovators', value: 512 },
  { name: 'AI Enthusiasts',  value: 341 },
  { name: 'Finance Wizards', value: 234 },
  { name: 'Career Hub',      value: 89  },
];
const PIE_COLORS = ['var(--neon-cyan)', 'var(--neon-pink)', 'var(--accent-purple)', '#FF9500'];

const tooltipStyle = { backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--glass-border)', borderRadius: '8px' };

const Analytics = () => {
  const [period, setPeriod] = useState('monthly');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>

      {/* Period Toggle */}
      <div style={{ display: 'flex', gap: '12px' }}>
        {['daily','weekly','monthly'].map(p => (
          <button key={p} onClick={() => setPeriod(p)}
            style={{ padding: '8px 18px', borderRadius: '20px', border: '1px solid var(--glass-border)', background: period === p ? 'var(--neon-cyan)' : 'transparent', color: period === p ? 'var(--bg-primary)' : 'var(--text-secondary)', cursor: 'pointer', textTransform: 'capitalize', fontSize: '0.85rem', fontWeight: period === p ? '700' : '400', transition: 'all 0.2s' }}>
            {p}
          </button>
        ))}
      </div>

      {/* Row 1 */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>

        {/* User Growth */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <h3 style={{ margin: '0 0 20px 0', fontFamily: 'Outfit', fontSize: '1.1rem' }}>📈 User Growth</h3>
          <div style={{ height: '240px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={userGrowth}>
                <defs>
                  <linearGradient id="ugGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="var(--neon-cyan)" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="var(--neon-cyan)" stopOpacity={0}   />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="month" stroke="var(--text-secondary)" tick={{ fontSize: 11 }} />
                <YAxis stroke="var(--text-secondary)" tick={{ fontSize: 11 }} />
                <Tooltip contentStyle={tooltipStyle} />
                <Area type="monotone" dataKey="users" stroke="var(--neon-cyan)" fill="url(#ugGrad)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Voting Trends */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <h3 style={{ margin: '0 0 20px 0', fontFamily: 'Outfit', fontSize: '1.1rem' }}>🗳️ Voting Trends</h3>
          <div style={{ height: '240px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={votingTrends}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="week" stroke="var(--text-secondary)" tick={{ fontSize: 11 }} />
                <YAxis stroke="var(--text-secondary)" tick={{ fontSize: 11 }} />
                <Tooltip contentStyle={tooltipStyle} />
                <Line type="monotone" dataKey="votes" stroke="var(--neon-pink)" strokeWidth={2} dot={{ fill: 'var(--neon-pink)', r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Row 2 */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '24px' }}>

        {/* Most Voted Decision Boards */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <h3 style={{ margin: '0 0 20px 0', fontFamily: 'Outfit', fontSize: '1.1rem' }}>🏆 Most Voted Decision Boards</h3>
          <div style={{ height: '240px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topBoards} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" horizontal={false} />
                <XAxis type="number" stroke="var(--text-secondary)" tick={{ fontSize: 11 }} />
                <YAxis type="category" dataKey="name" stroke="var(--text-secondary)" tick={{ fontSize: 11 }} width={90} />
                <Tooltip contentStyle={tooltipStyle} />
                <Bar dataKey="votes" fill="var(--accent-purple)" radius={[0,6,6,0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Most Active Communities */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <h3 style={{ margin: '0 0 20px 0', fontFamily: 'Outfit', fontSize: '1.1rem' }}>🌐 Most Active Communities</h3>
          <div style={{ height: '200px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={communityData} innerRadius={55} outerRadius={90} paddingAngle={4} dataKey="value" stroke="none">
                  {communityData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                </Pie>
                <Tooltip contentStyle={tooltipStyle} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', justifyContent: 'center', marginTop: '8px' }}>
            {communityData.map((c, i) => (
              <div key={c.name} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: PIE_COLORS[i] }} />
                {c.name}
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Analytics;
