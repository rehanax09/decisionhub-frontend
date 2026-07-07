import React from 'react';
import { Link } from 'react-router-dom';
import { PlayCircle, Target, Users, Zap, CheckCircle, BarChart2 } from 'lucide-react';
import { motion } from 'framer-motion';

const Landing = () => {
  return (
    <div style={{ paddingBottom: '100px' }}>
      {/* Hero Section */}
      <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '90vh', padding: '20px', textAlign: 'center', overflow: 'hidden' }}>
        
        {/* Animated Background Shapes */}
        <div style={{ position: 'absolute', width: '300px', height: '300px', background: 'var(--neon-cyan)', filter: 'blur(150px)', opacity: 0.1, top: '20%', left: '10%', animation: 'float 6s ease-in-out infinite' }}></div>
        <div style={{ position: 'absolute', width: '250px', height: '250px', background: 'var(--neon-pink)', filter: 'blur(150px)', opacity: 0.1, bottom: '20%', right: '10%', animation: 'float 8s ease-in-out infinite reverse' }}></div>

        <motion.h2 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
          className="text-gradient" 
          style={{ fontSize: '1.2rem', textTransform: 'uppercase', letterSpacing: '4px', marginBottom: '20px', fontFamily: 'Outfit' }}
        >
          DecisionHub
        </motion.h2>
        <motion.h1 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}
          style={{ fontSize: '4.5rem', marginBottom: '20px', maxWidth: '900px', lineHeight: '1.1' }}
        >
          Collaborative Decision Making Platform
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}
          style={{ color: 'var(--text-secondary)', fontSize: '1.4rem', maxWidth: '600px', marginBottom: '40px', lineHeight: '1.6' }}
        >
          Compare • Vote • Analyze • Decide
        </motion.p>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }}
          style={{ display: 'flex', gap: '20px' }}
        >
          <Link to="/create-decision" className="btn-primary" style={{ padding: '16px 32px', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Target size={20} /> Create Decision
          </Link>
          <Link to="/communities" className="btn-secondary" style={{ padding: '16px 32px', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Users size={20} /> Explore Community
          </Link>
        </motion.div>
      </div>

      {/* Features Section */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '100px 20px' }}>
        <div style={{ textAlign: 'center', marginBottom: '60px' }} data-aos="fade-up">
          <h2 style={{ fontSize: '3rem', fontFamily: 'Outfit' }}>Platform Features</h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px' }}>
          {[
            { icon: <Zap color="var(--neon-cyan)" size={32} />, title: "Instant Consensus", desc: "Real-time voting mechanisms ensure you get feedback at the speed of thought." },
            { icon: <BarChart2 color="var(--neon-pink)" size={32} />, title: "Deep Analytics", desc: "Radar charts, vote distribution, and sentiment analysis for every decision." },
            { icon: <Users color="var(--accent-purple)" size={32} />, title: "Community Driven", desc: "Join niche communities to get expert opinions on specialized topics." }
          ].map((feat, i) => (
            <div key={i} className="glass-panel" data-aos="fade-up" data-aos-delay={i * 100} style={{ padding: '40px', textAlign: 'center' }}>
              <div style={{ marginBottom: '20px' }}>{feat.icon}</div>
              <h3 style={{ marginBottom: '16px', fontSize: '1.5rem', fontFamily: 'Outfit' }}>{feat.title}</h3>
              <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6' }}>{feat.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* How it Works */}
      <div style={{ background: 'var(--panel-bg-light)', padding: '100px 20px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '60px' }} data-aos="fade-up">
            <h2 style={{ fontSize: '3rem', fontFamily: 'Outfit' }}>How It Works</h2>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
            {[
              { step: '01', title: 'Frame Your Dilemma', desc: 'Define your options and comparison criteria (Cost, Risk, Time, etc.).' },
              { step: '02', title: 'Gather Insights', desc: 'Share with the public grid or private communities to collect votes.' },
              { step: '03', title: 'Analyze & Execute', desc: 'Use our AI-driven charts to find the objectively best path forward.' }
            ].map((item, index) => (
              <div key={index} className="glass-panel" data-aos="fade-right" data-aos-delay={index * 100} style={{ display: 'flex', alignItems: 'center', padding: '30px', gap: '30px' }}>
                <div className="text-gradient" style={{ fontSize: '4rem', fontWeight: 'bold', fontFamily: 'Outfit', opacity: 0.5 }}>{item.step}</div>
                <div>
                  <h3 style={{ fontSize: '1.8rem', marginBottom: '10px' }}>{item.title}</h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Popular Decisions / Testimonials */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '100px 20px' }}>
        <div style={{ textAlign: 'center', marginBottom: '60px' }} data-aos="fade-up">
          <h2 style={{ fontSize: '3rem', fontFamily: 'Outfit' }}>Trending on the Grid</h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '30px' }}>
          <div className="glass-panel" data-aos="fade-up" style={{ padding: '30px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '1.4rem' }}>MBA vs Corporate Job</h3>
              <span style={{ color: 'var(--neon-cyan)' }}>12.4K Votes</span>
            </div>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '20px' }}>A fierce debate on the ROI of higher education vs immediate industry experience.</p>
            <div style={{ height: '4px', background: 'var(--glass-border)', borderRadius: '2px', display: 'flex' }}>
              <div style={{ width: '60%', background: 'var(--neon-cyan)', borderRadius: '2px' }}></div>
              <div style={{ width: '40%', background: 'var(--neon-pink)', borderRadius: '2px' }}></div>
            </div>
          </div>
          <div className="glass-panel" data-aos="fade-up" data-aos-delay="100" style={{ padding: '30px' }}>
             <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '20px' }}>
              <img src="https://i.pravatar.cc/100?img=3" alt="Avatar" style={{ width: '60px', height: '60px', borderRadius: '50%' }} />
              <div>
                <h4 style={{ fontSize: '1.1rem' }}>Sarah Jenkins</h4>
                <p style={{ color: 'var(--neon-cyan)', fontSize: '0.9rem' }}>Product Manager</p>
              </div>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontStyle: 'italic' }}>"DecisionHub completely changed how our team aligns on architecture choices. The radar charts make trade-offs painfully obvious in the best way possible."</p>
          </div>
        </div>
      </div>

    </div>
  );
};

export default Landing;
