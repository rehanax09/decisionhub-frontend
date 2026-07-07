import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend
} from 'recharts';
import { ArrowLeft } from 'lucide-react';

const ComparisonPage = () => {
  const { id } = useParams();

  const radarData = [
    { subject: 'Cost (Lower is Better)', A: 30, B: 90, fullMark: 100 },
    { subject: 'Benefits', A: 95, B: 70, fullMark: 100 },
    { subject: 'Risk (Lower is Better)', A: 80, B: 40, fullMark: 100 },
    { subject: 'Time to Value', A: 40, B: 90, fullMark: 100 },
    { subject: 'Flexibility', A: 85, B: 60, fullMark: 100 },
  ];

  const barData = [
    { name: 'Option A (MBA)', score: 85 },
    { name: 'Option B (Job)', score: 72 }
  ];

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ marginBottom: '30px', display: 'flex', alignItems: 'center', gap: '20px' }}>
        <Link to={`/decision/${id}`} style={{ color: 'var(--text-secondary)', display: 'flex', alignItems: 'center' }}>
          <ArrowLeft size={24} />
        </Link>
        <div>
          <h1 style={{ fontSize: '2rem', fontFamily: 'Outfit', margin: 0 }}>Comparison Matrix</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Advanced algorithmic breakdown</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))', gap: '30px', marginBottom: '30px' }}>
        
        {/* Radar Chart */}
        <div className="glass-panel" style={{ padding: '30px' }}>
          <h3 style={{ marginBottom: '20px', fontFamily: 'Outfit', textAlign: 'center' }}>Multi-Dimensional Analysis</h3>
          <div style={{ height: '400px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                <PolarGrid stroke="rgba(255,255,255,0.1)" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: 'var(--text-secondary)', fontSize: 12 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: 'transparent' }} />
                <Radar name="Option A (MBA)" dataKey="A" stroke="var(--neon-cyan)" fill="var(--neon-cyan)" fillOpacity={0.3} />
                <Radar name="Option B (Job)" dataKey="B" stroke="var(--neon-pink)" fill="var(--neon-pink)" fillOpacity={0.3} />
                <Legend />
                <Tooltip contentStyle={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--glass-border)', borderRadius: '8px' }} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bar Chart */}
        <div className="glass-panel" style={{ padding: '30px' }}>
          <h3 style={{ marginBottom: '20px', fontFamily: 'Outfit', textAlign: 'center' }}>Overall Network Score</h3>
          <div style={{ height: '400px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} layout="vertical" margin={{ top: 20, right: 30, left: 40, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" horizontal={false} />
                <XAxis type="number" stroke="var(--text-secondary)" domain={[0, 100]} />
                <YAxis dataKey="name" type="category" stroke="var(--text-secondary)" />
                <Tooltip contentStyle={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--glass-border)', borderRadius: '8px' }} />
                <Bar dataKey="score" fill="var(--accent-purple)" radius={[0, 4, 4, 0]}>
                  {
                    barData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={index === 0 ? 'var(--neon-cyan)' : 'var(--neon-pink)'} />
                    ))
                  }
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="glass-panel" style={{ padding: '30px', textAlign: 'center', background: 'rgba(0, 245, 255, 0.05)', border: '1px solid rgba(0, 245, 255, 0.2)' }}>
        <h2 style={{ color: 'var(--neon-cyan)', marginBottom: '10px' }}>Final Recommendation: Option A</h2>
        <p style={{ color: 'var(--text-secondary)' }}>Based on the current matrix weighting and network votes, <strong>Pursue MBA</strong> holds a 13% advantage over entering the workforce immediately.</p>
      </div>

    </div>
  );
};

export default ComparisonPage;
