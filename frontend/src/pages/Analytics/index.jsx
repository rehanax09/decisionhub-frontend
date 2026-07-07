import React from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Legend, AreaChart, Area, PieChart, Pie, Cell
} from 'recharts';

const Analytics = () => {
  const participationData = [
    { month: 'Jan', tech: 400, career: 240, finance: 240 },
    { month: 'Feb', tech: 300, career: 139, finance: 221 },
    { month: 'Mar', tech: 200, career: 980, finance: 229 },
    { month: 'Apr', tech: 278, career: 390, finance: 200 },
    { month: 'May', tech: 189, career: 480, finance: 218 },
    { month: 'Jun', tech: 239, career: 380, finance: 250 },
  ];

  const successData = [
    { name: 'Resolved', value: 75 },
    { name: 'Ongoing', value: 15 },
    { name: 'Abandoned', value: 10 },
  ];
  const COLORS = ['var(--success)', 'var(--warning)', 'var(--text-secondary)'];

  return (
    <div>
      <h1 style={{ fontSize: '2rem', fontFamily: 'Outfit', marginBottom: '10px' }}>Global Analytics</h1>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '30px' }}>Deep dive into network trends and decision metrics.</p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '30px' }}>
        
        {/* Participation Trends */}
        <div className="glass-panel" style={{ padding: '30px' }}>
          <h3 style={{ marginBottom: '20px', fontFamily: 'Outfit' }}>Category Participation Trends (Monthly)</h3>
          <div style={{ height: '400px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={participationData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="month" stroke="var(--text-secondary)" />
                <YAxis stroke="var(--text-secondary)" />
                <Tooltip contentStyle={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--glass-border)', borderRadius: '8px' }} />
                <Legend />
                <Line type="monotone" dataKey="tech" stroke="var(--neon-cyan)" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 8 }} />
                <Line type="monotone" dataKey="career" stroke="var(--neon-pink)" strokeWidth={2} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="finance" stroke="var(--accent-purple)" strokeWidth={2} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '30px' }}>
          {/* Decision Success Rate */}
          <div className="glass-panel" style={{ padding: '30px' }}>
            <h3 style={{ marginBottom: '20px', fontFamily: 'Outfit' }}>Decision Resolution State</h3>
            <div style={{ height: '300px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={successData}
                    innerRadius={80}
                    outerRadius={110}
                    paddingAngle={5}
                    dataKey="value"
                    stroke="none"
                  >
                    {successData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--glass-border)', borderRadius: '8px' }} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Community Growth */}
          <div className="glass-panel" style={{ padding: '30px' }}>
            <h3 style={{ marginBottom: '20px', fontFamily: 'Outfit' }}>Community Growth (Active Nodes)</h3>
            <div style={{ height: '300px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={participationData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis dataKey="month" stroke="var(--text-secondary)" />
                  <YAxis stroke="var(--text-secondary)" />
                  <Tooltip contentStyle={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--glass-border)', borderRadius: '8px' }} />
                  <Bar dataKey="tech" fill="var(--neon-cyan)" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
