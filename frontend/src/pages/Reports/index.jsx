import React from 'react';
import { Download, FileText, PieChart, Users } from 'lucide-react';

const Reports = () => {
  const reports = [
    { title: 'Decision Report', desc: 'Comprehensive breakdown of all decisions made in the last 30 days.', icon: FileText, color: 'var(--neon-cyan)' },
    { title: 'Voting Analytics', desc: 'Demographic and temporal analysis of voting patterns.', icon: PieChart, color: 'var(--neon-pink)' },
    { title: 'Community Report', desc: 'Growth, engagement, and trending topics across all communities.', icon: Users, color: 'var(--accent-purple)' },
  ];

  return (
    <div>
      <h1 style={{ fontSize: '2rem', fontFamily: 'Outfit', margin: 0, marginBottom: '10px' }}>Generated Reports</h1>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '30px' }}>Export data for offline analysis and auditing.</p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '30px' }}>
        {reports.map((report, idx) => (
          <div key={idx} className="glass-panel" style={{ padding: '30px', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
              <div style={{ background: `${report.color}20`, padding: '12px', borderRadius: '12px' }}>
                <report.icon color={report.color} size={28} />
              </div>
              <h3 style={{ fontSize: '1.3rem', fontFamily: 'Outfit', margin: 0 }}>{report.title}</h3>
            </div>
            
            <p style={{ color: 'var(--text-secondary)', flex: 1, marginBottom: '24px' }}>
              {report.desc}
            </p>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button className="btn-primary" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '10px' }}>
                <Download size={18} /> PDF
              </button>
              <button className="btn-secondary" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '10px' }}>
                <Download size={18} /> Excel
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Reports;
