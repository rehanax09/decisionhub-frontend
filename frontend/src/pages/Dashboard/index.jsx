import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, AreaChart, Area
} from 'recharts';
import { Target, CheckSquare, Users, BarChart2 } from 'lucide-react';
import api from '../../api/api';

const Dashboard = () => {
  const navigate = useNavigate();
  const role = localStorage.getItem('role');
  const [decisionsCount, setDecisionsCount] = useState(0);
  const [joinedCommunitiesCount, setJoinedCommunitiesCount] = useState(0);

  React.useEffect(() => {
    if (role === 'admin') {
      navigate('/admin/dashboard?tab=overview', { replace: true });
    }
  }, [role, navigate]);

  React.useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const userRes = await api.get('/api/users/me');
        if (userRes.data?.success) {
          const userObj = userRes.data.data;
          const list = JSON.parse(localStorage.getItem(`joined_comm_${userObj.id}`) || "[]");
          setJoinedCommunitiesCount(list.length);
        }

        const decisionsRes = await api.get('/api/decisions');
        if (decisionsRes.data?.success) {
          setDecisionsCount(decisionsRes.data.data.length);
        }
      } catch (err) {
        console.error("Failed to load dashboard data:", err);
      }
    };
    loadDashboardData();
  }, []);

  // Stats Data
  const stats = [
    { title: 'Total Decisions', value: decisionsCount.toString(), icon: Target, color: 'var(--neon-cyan)' },
    { title: 'Votes Received', value: '12.4K', icon: CheckSquare, color: 'var(--neon-pink)' },
    { title: 'Communities Joined', value: joinedCommunitiesCount.toString(), icon: Users, color: 'var(--accent-purple)' },
    { title: 'Polls Created', value: '24', icon: BarChart2, color: 'var(--success)' },
  ];

  const voteData = [
    { name: 'Mon', votes: 400 },
    { name: 'Tue', votes: 300 },
    { name: 'Wed', votes: 550 },
    { name: 'Thu', votes: 480 },
    { name: 'Fri', votes: 700 },
    { name: 'Sat', votes: 850 },
    { name: 'Sun', votes: 920 },
  ];

  const categoryData = [
    { name: 'Technology', value: 400 },
    { name: 'Career', value: 300 },
    { name: 'Finance', value: 300 },
    { name: 'Lifestyle', value: 200 },
  ];
  const COLORS = ['#00F5FF', '#FF00EA', '#7C3AED', '#00FF9D'];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontFamily: 'Outfit', margin: 0 }}>System Overview</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Welcome back to the grid, user.</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button className="btn-primary" onClick={() => navigate('/create-decision')}>Create Decision</button>
          <button className="btn-secondary" onClick={() => navigate('/reports')}>Generate Report</button>
        </div>
      </div>

      {/* Stats Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '24px', marginBottom: '40px' }}>
        {stats.map((stat, i) => (
          <div key={i} className="glass-panel" style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div style={{ background: `${stat.color}20`, padding: '16px', borderRadius: '12px' }}>
              <stat.icon color={stat.color} size={28} />
            </div>
            <div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '4px' }}>{stat.title}</p>
              <h3 style={{ fontSize: '1.8rem', margin: 0 }}>{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px', marginBottom: '40px' }}>
        {/* Vote Distribution */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <h3 style={{ marginBottom: '20px', fontFamily: 'Outfit' }}>Vote Distribution (Weekly)</h3>
          <div style={{ height: '300px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={voteData}>
                <defs>
                  <linearGradient id="colorVotes" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--neon-cyan)" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="var(--neon-cyan)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="name" stroke="var(--text-secondary)" />
                <YAxis stroke="var(--text-secondary)" />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--glass-border)', borderRadius: '8px' }}
                  itemStyle={{ color: 'var(--neon-cyan)' }}
                />
                <Area type="monotone" dataKey="votes" stroke="var(--neon-cyan)" fillOpacity={1} fill="url(#colorVotes)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Popular Categories */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <h3 style={{ marginBottom: '20px', fontFamily: 'Outfit' }}>Popular Categories</h3>
          <div style={{ height: '300px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--glass-border)', borderRadius: '8px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', justifyContent: 'center' }}>
            {categoryData.map((cat, i) => (
              <div key={cat.name} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem' }}>
                <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: COLORS[i] }}></div>
                {cat.name}
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
};

export default Dashboard;
