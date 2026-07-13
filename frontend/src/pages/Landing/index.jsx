import React from 'react';
import { Link } from 'react-router-dom';
import { Target, Users, Zap, BarChart2, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const Landing = () => {
  return (
    <div style={{ paddingBottom: '100px' }}>
      
      {/* Hero Section */}
      <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '85vh', padding: '20px', textAlign: 'center', overflow: 'hidden' }}>
        {/* Animated Background Shapes */}
        <div style={{ position: 'absolute', width: '300px', height: '300px', background: 'var(--neon-cyan)', filter: 'blur(150px)', opacity: 0.08, top: '20%', left: '10%' }}></div>
        <div style={{ position: 'absolute', width: '250px', height: '250px', background: 'var(--neon-pink)', filter: 'blur(150px)', opacity: 0.08, bottom: '20%', right: '10%' }}></div>

        <motion.div 
          initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
          style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 14px', borderRadius: '20px', background: 'rgba(0, 245, 255, 0.06)', border: '1px solid rgba(0, 245, 255, 0.15)', marginBottom: '20px' }}
        >
          <Zap size={14} color="var(--neon-cyan)" />
          <span style={{ fontSize: '0.78rem', letterSpacing: '1px', fontWeight: 'bold', textTransform: 'uppercase', color: 'var(--neon-cyan)' }}>DecisionHub v2.0</span>
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}
          style={{ fontSize: '4.2rem', marginBottom: '20px', maxWidth: '900px', lineHeight: '1.15', fontFamily: 'Outfit', fontWeight: '800' }}
        >
          Collaborative Decision Making <br /><span className="text-gradient">Platform</span>
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}
          style={{ color: 'var(--text-secondary)', fontSize: '1.3rem', maxWidth: '600px', marginBottom: '40px', lineHeight: '1.6' }}
        >
          Create Decision • Vote • Compare • Decide
        </motion.p>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }}
          style={{ display: 'flex', gap: '16px' }}
        >
          <Link to="/login" className="btn-primary" style={{ padding: '12px 28px', fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: 'var(--glow-cyan)' }}>
            Get Started <ArrowRight size={16} />
          </Link>
        </motion.div>
      </div>

      {/* Features Section */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '80px 20px' }}>
        <div style={{ textAlign: 'center', marginBottom: '60px' }} data-aos="fade-up">
          <h2 style={{ fontSize: '2.8rem', fontFamily: 'Outfit', fontWeight: '700' }}>Platform Capabilities</h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px' }}>
          {[
            { icon: <Zap color="var(--neon-cyan)" size={32} />, title: "Instant Consensus", desc: "Real-time voting mechanisms ensure you get feedback at the speed of thought." },
            { icon: <BarChart2 color="var(--neon-pink)" size={32} />, title: "Deep Analytics", desc: "Radar charts, vote distribution, and sentiment analysis for every decision." },
            { icon: <Users color="var(--accent-purple)" size={32} />, title: "Community Driven", desc: "Join niche communities to get expert opinions on specialized topics." }
          ].map((feat, i) => (
            <div key={i} className="glass-panel" data-aos="fade-up" data-aos-delay={i * 100} style={{ padding: '40px', textAlign: 'center', borderRadius: '16px', border: '1px solid var(--glass-border)' }}>
              <div style={{ marginBottom: '20px' }}>{feat.icon}</div>
              <h3 style={{ marginBottom: '16px', fontSize: '1.4rem', fontFamily: 'Outfit', fontWeight: '600' }}>{feat.title}</h3>
              <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6', fontSize: '0.92rem' }}>{feat.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* How it Works */}
      <div style={{ background: 'var(--panel-bg-light)', padding: '80px 20px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '60px' }} data-aos="fade-up">
            <h2 style={{ fontSize: '2.8rem', fontFamily: 'Outfit', fontWeight: '700' }}>How It Works</h2>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
            {[
              { step: '01', title: 'Frame Your Dilemma', desc: 'Define your options and comparison criteria (Cost, Risk, Time, etc.).' },
              { step: '02', title: 'Gather Insights', desc: 'Share with the public grid or private communities to collect votes.' },
              { step: '03', title: 'Analyze & Execute', desc: 'Use our AI-driven charts to find the objectively best path forward.' }
            ].map((item, index) => (
              <div key={index} className="glass-panel" data-aos="fade-right" data-aos-delay={index * 100} style={{ display: 'flex', alignItems: 'center', padding: '30px', gap: '30px', borderRadius: '16px', border: '1px solid var(--glass-border)' }}>
                <div className="text-gradient" style={{ fontSize: '3.6rem', fontWeight: 'bold', fontFamily: 'Outfit', opacity: 0.4 }}>{item.step}</div>
                <div>
                  <h3 style={{ fontSize: '1.6rem', marginBottom: '8px', fontWeight: '600' }}>{item.title}</h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.98rem', lineHeight: '1.5' }}>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Popular Decisions / Testimonials */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '80px 20px' }}>
        <div style={{ textAlign: 'center', marginBottom: '60px' }} data-aos="fade-up">
          <h2 style={{ fontSize: '2.8rem', fontFamily: 'Outfit', fontWeight: '700' }}>Trending on the Grid</h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '30px' }}>
          <div className="glass-panel" data-aos="fade-up" style={{ padding: '30px', borderRadius: '18px', border: '1px solid var(--glass-border)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '1.3rem', fontWeight: '600' }}>MBA vs Corporate Job</h3>
              <span style={{ color: 'var(--neon-cyan)', fontSize: '0.88rem', fontWeight: 'bold' }}>12.4K Votes</span>
            </div>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '20px', fontSize: '0.92rem', lineHeight: '1.6' }}>A fierce debate on the ROI of higher education vs immediate industry experience.</p>
            <div style={{ height: '4px', background: 'var(--glass-border)', borderRadius: '2px', display: 'flex' }}>
              <div style={{ width: '60%', background: 'var(--neon-cyan)', borderRadius: '2px' }}></div>
              <div style={{ width: '40%', background: 'var(--neon-pink)', borderRadius: '2px' }}></div>
            </div>
          </div>
          <div className="glass-panel" data-aos="fade-up" data-aos-delay="100" style={{ padding: '30px', borderRadius: '18px', border: '1px solid var(--glass-border)' }}>
             <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
              <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=100&auto=format&fit=crop" alt="Avatar" style={{ width: '56px', height: '56px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--neon-cyan)' }} />
              <div>
                <h4 style={{ fontSize: '1rem', fontWeight: '600' }}>Sarah Jenkins</h4>
                <p style={{ color: 'var(--neon-cyan)', fontSize: '0.82rem' }}>Product Lead</p>
              </div>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontStyle: 'italic', fontSize: '0.9rem', lineHeight: '1.6' }}>"DecisionHub completely changed how our team aligns on architecture choices. The radar charts make trade-offs painfully obvious in the best way possible."</p>
          </div>
        </div>
      </div>

    </div>
  );
};

export default Landing;
