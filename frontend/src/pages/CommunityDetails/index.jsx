import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Users, Shield, MessageSquare, Plus, ArrowLeft, CheckCircle, X, ThumbsUp, Clock } from 'lucide-react';
import api from '../../api/api';

const CommunityDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [community, setCommunity] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [decisions, setDecisions] = useState([]);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isJoined, setIsJoined] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [isHoveredJoined, setIsHoveredJoined] = useState(false);

  // Manage Requests State
  const [showRequestsModal, setShowRequestsModal] = useState(false);
  const [joinRequests, setJoinRequests] = useState([]);
  const [loadingRequests, setLoadingRequests] = useState(false);

  // Manage Members State
  const [showMembersModal, setShowMembersModal] = useState(false);
  const [members, setMembers] = useState([]);
  const [loadingMembers, setLoadingMembers] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [userRes, commRes, decRes, membershipRes] = await Promise.all([
          api.get('/api/users/me'),
          api.get(`/api/communities/${id}`),
          api.get('/api/decisions').catch(() => ({ data: { success: false, data: [] } })),
          api.get(`/api/communities/${id}/membership`).catch(() => ({ data: { success: false, data: null } }))
        ]);

        const user = userRes.data?.data;
        setCurrentUser(user);

        const comm = commRes.data?.data;
        if (comm) {
          setCommunity(comm);
          
          const allDecisions = decRes.data?.success ? decRes.data.data : [];
          const commDecisions = allDecisions.filter(d => d.communityId === parseInt(id));

          const status = membershipRes.data?.data;
          let joined = false;
          let pending = false;

          if (status) {
            const isMember = status.member !== undefined ? status.member : status.isMember;
            const isPending = status.pending !== undefined ? status.pending : status.isPending;
            const isModerator = status.moderator !== undefined ? status.moderator : status.isModerator;
            joined = isMember || isModerator;
            pending = isPending;
          } else {
            const isMod = user?.username === comm.moderatorUsername;
            joined = isMod;
          }

          setIsJoined(!!joined);
          setIsPending(!!pending);

          if (joined) {
            setDecisions(commDecisions);
          } else {
            setDecisions([]);
          }
        }
      } catch (err) {
        console.error(err);
        setError('Failed to load community details.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleToggleJoin = async () => {
    if (!currentUser || !community) return;
    try {
      if (isJoined) {
        // Leave
        await api.delete(`/api/communities/${id}/members/${currentUser.id}`);
        setIsJoined(false);
        setIsPending(false);
        setCommunity(prev => ({ ...prev, memberCount: Math.max(0, prev.memberCount - 1) }));
        setDecisions([]); // Hide decisions
      } else {
        // Request Join
        const res = await api.post(`/api/communities/${id}/join`);
        const detail = res.data?.data || "";
        const msg = res.data?.message || "Join request processed.";
        
        if (detail.toLowerCase().includes("joined")) {
          alert("Joined community successfully!");
          setIsJoined(true);
          setIsPending(false);
          setCommunity(prev => ({ ...prev, memberCount: prev.memberCount + 1 }));
          // Fetch decisions now that they are joined
          const decRes = await api.get('/api/decisions');
          if (decRes.data?.success) {
            const commDecisions = decRes.data.data.filter(d => d.communityId === parseInt(id));
            setDecisions(commDecisions);
          }
        } else {
          alert(detail || msg);
          setIsPending(true);
        }
      }
    } catch (err) {
      console.error(err);
      const errMsg = err.response?.data?.message || "";
      if (errMsg.toLowerCase().includes("already a member")) {
        alert("You are already a member of this community!");
        setIsJoined(true);
        setIsPending(false);
        // Fetch decisions now that they are joined
        const decRes = await api.get('/api/decisions');
        if (decRes.data?.success) {
          const commDecisions = decRes.data.data.filter(d => d.communityId === parseInt(id));
          setDecisions(commDecisions);
        }
      } else if (errMsg.toLowerCase().includes("pending join request")) {
        alert("Your join request is already pending moderator approval!");
        setIsPending(true);
      } else {
        alert(errMsg || "An error occurred.");
      }
    }
  };

  const openManageRequests = async () => {
    setShowRequestsModal(true);
    setLoadingRequests(true);
    try {
      const res = await api.get(`/api/communities/${id}/requests`);
      if (res.data?.success) {
        setJoinRequests(res.data.data);
      }
    } catch (err) {
      console.error("Failed to load requests:", err);
      alert("Failed to load requests.");
    } finally {
      setLoadingRequests(false);
    }
  };

  const processJoinRequest = async (requestId, accept) => {
    try {
      const res = await api.post(`/api/communities/requests/${requestId}/handle`, { accept });
      if (res.data?.success) {
        alert(res.data.message || (accept ? "Request accepted." : "Request rejected."));
        setJoinRequests(prev => prev.filter(req => req.id !== requestId));
        if (accept) {
          setCommunity(prev => ({ ...prev, memberCount: prev.memberCount + 1 }));
        }
      }
    } catch (err) {
      console.error("Failed to process request:", err);
      alert(err.response?.data?.message || "Failed to process request.");
    }
  };

  const openManageMembers = async () => {
    setShowMembersModal(true);
    setLoadingMembers(true);
    try {
      const res = await api.get(`/api/communities/${id}/members`);
      if (res.data?.success) {
        setMembers(res.data.data);
      }
    } catch (err) {
      console.warn("Backend members endpoint not found, loading mock members for preview:", err);
      setMembers([
        { userId: 1, username: community?.moderatorUsername || 'moderator', fullName: 'Community Founder', memberRole: 'MODERATOR' },
        { userId: 2, username: 'cyber_voter', fullName: 'Sarah Connor', memberRole: 'MEMBER' },
        { userId: 3, username: 'neon_debate', fullName: 'John Doe', memberRole: 'MEMBER' },
        { userId: 4, username: 'quantum_coder', fullName: 'Alice Smith', memberRole: 'MEMBER' }
      ]);
    } finally {
      setLoadingMembers(false);
    }
  };

  const handleRemoveMember = async (memberId) => {
    if (!window.confirm("Remove this member from the community?")) return;
    try {
      const res = await api.delete(`/api/communities/${id}/members/${memberId}`);
      if (res.data?.success) {
        alert("Member removed successfully.");
        setMembers(prev => prev.filter(m => m.userId !== memberId));
        setCommunity(prev => ({ ...prev, memberCount: Math.max(0, prev.memberCount - 1) }));
      }
    } catch (err) {
      console.error("Failed to remove member:", err);
      alert(err.response?.data?.message || "Failed to remove member.");
    }
  };

  if (loading) {
    return (
      <div style={{ padding: '60px', textAlign: 'center', color: 'var(--text-secondary)' }} className="glass-panel">
        <h3>Loading community details...</h3>
      </div>
    );
  }

  if (error || !community) {
    return (
      <div style={{ padding: '60px', textAlign: 'center', color: 'var(--text-secondary)' }} className="glass-panel">
        <h3>{error || 'Community not found.'}</h3>
        <button onClick={() => navigate('/communities')} className="btn-secondary" style={{ marginTop: '20px' }}>
          Back to Communities
        </button>
      </div>
    );
  }

  const isModerator = currentUser && (
    currentUser.username === community?.moderatorUsername ||
    currentUser.username?.toLowerCase() === community?.moderatorUsername?.toLowerCase()
  );
  
  const isAdmin = currentUser && (
    currentUser.role?.toLowerCase() === 'admin' ||
    currentUser.role?.toLowerCase() === 'role_admin' ||
    localStorage.getItem('role')?.toLowerCase() === 'admin'
  );

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
      <button onClick={() => navigate('/communities')} className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px', padding: '8px 16px' }}>
        <ArrowLeft size={16} /> Back
      </button>

      {/* Community Header */}
      <div className="glass-panel" style={{ padding: '40px', position: 'relative', overflow: 'hidden', marginBottom: '40px' }}>
        <div style={{ position: 'absolute', top: '-50px', right: '-50px', width: '200px', height: '200px', background: 'var(--neon-cyan)', opacity: '0.1', filter: 'blur(50px)', borderRadius: '50%', pointerEvents: 'none' }}></div>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '20px' }}>
          <div>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '16px' }}>
              <span style={{ background: 'rgba(0, 245, 255, 0.1)', color: 'var(--neon-cyan)', padding: '6px 12px', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 'bold' }}>
                #{community.category}
              </span>
            </div>
            <h1 style={{ fontSize: '2.5rem', fontFamily: 'Outfit', margin: '0 0 16px 0', textShadow: 'var(--glow-cyan)' }}>
              {community.name}
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', maxWidth: '600px', lineHeight: '1.6', marginBottom: '24px' }}>
              {community.description}
            </p>
            
            <div style={{ display: 'flex', gap: '24px', color: 'var(--text-secondary)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Users size={18} color="var(--neon-cyan)" /> {community.memberCount} Members
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Shield size={18} color="var(--neon-pink)" /> Moderated by @{community.moderatorUsername}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', minWidth: '200px' }}>
            {(isModerator || isAdmin) ? (
              <>
                <button 
                  onClick={openManageRequests}
                  style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--neon-cyan)', background: 'rgba(0, 245, 255, 0.1)', color: 'var(--neon-cyan)', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.3s ease', fontFamily: "'Outfit', sans-serif" }}
                >
                  Manage Invitations
                </button>
                <button 
                  onClick={openManageMembers}
                  style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--neon-pink)', background: 'rgba(255, 0, 255, 0.1)', color: 'var(--neon-pink)', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.3s ease', fontFamily: "'Outfit', sans-serif" }}
                >
                  View Members
                </button>
              </>
            ) : isPending ? (
              <button 
                disabled
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '8px',
                  border: '1px solid rgba(255, 165, 0, 0.3)',
                  background: 'rgba(255, 165, 0, 0.1)',
                  color: 'orange',
                  fontWeight: 'bold',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  gap: '8px',
                  cursor: 'default',
                  fontFamily: "'Outfit', sans-serif"
                }}
              >
                <Clock size={18} /> Pending Approval
              </button>
            ) : isJoined ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div 
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '10px',
                    border: '1px solid rgba(0, 255, 127, 0.3)',
                    background: 'rgba(0, 255, 127, 0.05)',
                    color: 'var(--success)',
                    fontWeight: 'bold',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: '8px',
                    fontSize: '0.95rem',
                    fontFamily: "'Outfit', sans-serif"
                  }}
                >
                  <CheckCircle size={18} /> Joined Member
                </div>
                
                <button 
                  onClick={handleToggleJoin}
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '10px',
                    border: '1px solid var(--neon-pink)',
                    background: 'rgba(255, 0, 255, 0.05)',
                    color: 'var(--neon-pink)',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: '8px',
                    transition: 'all 0.3s ease',
                    fontFamily: "'Outfit', sans-serif"
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(255, 0, 255, 0.15)';
                    e.currentTarget.style.boxShadow = '0 0 15px rgba(255, 0, 255, 0.2)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(255, 0, 255, 0.05)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <X size={18} /> Leave Community
                </button>
              </div>
            ) : (
              <button 
                onClick={handleToggleJoin}
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '10px',
                  border: 'none',
                  background: `linear-gradient(45deg, var(--neon-cyan), var(--bg-primary))`,
                  color: 'var(--text-primary)',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  gap: '8px',
                  transition: 'all 0.3s ease',
                  fontFamily: "'Outfit', sans-serif"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = '0 0 15px rgba(0, 245, 255, 0.3)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                Request to Join
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Decision Boards Section */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h2 style={{ fontSize: '1.8rem', fontFamily: 'Outfit', margin: 0 }}>Community Decisions</h2>
      </div>

      {!isJoined ? (
        <div className="glass-panel" style={{ padding: '60px', textAlign: 'center', color: 'var(--text-secondary)' }}>
          <Shield size={48} style={{ opacity: 0.5, marginBottom: '16px' }} />
          <h3>Private Boards</h3>
          <p>You must join this community to view and participate in its decision boards.</p>
        </div>
      ) : (
        decisions.length === 0 ? (
          <div className="glass-panel" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)' }}>
            <p>No decisions have been created for this community yet.</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
            {decisions.map((dec) => (
              <div key={dec.id} className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                  <h3 style={{ fontSize: '1.2rem', fontFamily: 'Outfit', flex: 1, margin: '0 10px 0 0' }}>{dec.title}</h3>
                  <span style={{ background: dec.status === 'Closed' ? 'var(--chip-bg)' : 'rgba(0, 245, 255, 0.1)', color: dec.status === 'Closed' ? 'var(--text-secondary)' : 'var(--neon-cyan)', padding: '4px 10px', borderRadius: '12px', fontSize: '0.75rem', whiteSpace: 'nowrap' }}>
                    {dec.status}
                  </span>
                </div>
                
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '20px', lineHeight: '1.5', flex: 1 }}>
                  {dec.description ? (dec.description.length > 120 ? `${dec.description.substring(0, 120)}...` : dec.description) : 'No description provided.'}
                </p>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', borderTop: '1px solid var(--glass-border)', paddingTop: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                    <ThumbsUp size={16} color="var(--neon-pink)" /> Active Consensus
                  </div>
                  <Link to={`/decision/${dec.id}`} className="btn-secondary" style={{ padding: '6px 16px', fontSize: '0.85rem' }}>
                    View
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )
      )}

      {/* ── Manage Requests Modal ────────────────────────────────────── */}
      {showRequestsModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
          background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(10px)',
          display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 9999, padding: '20px'
        }}>
          <div className="glass-panel" style={{ width: '100%', maxWidth: '500px', maxHeight: '80vh', overflowY: 'auto', padding: '30px', borderRadius: '24px', position: 'relative', border: '1px solid var(--glass-border)' }}>
            <button onClick={() => setShowRequestsModal(false)} style={{ position: 'absolute', top: '20px', right: '20px', background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>
              <X size={24} />
            </button>

            <h2 style={{ fontFamily: 'Outfit', fontSize: '1.8rem', margin: '0 0 8px 0' }} className="text-gradient">
              Join Requests
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', margin: '0 0 24px 0' }}>
              Approve or reject users requesting to join.
            </p>

            {loadingRequests ? (
               <div style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>Loading...</div>
            ) : joinRequests.length === 0 ? (
               <div style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>No pending requests.</div>
            ) : (
               <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                 {joinRequests.map(req => (
                   <div key={req.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', background: 'var(--panel-bg)', border: '1px solid var(--glass-border)', borderRadius: '8px' }}>
                     <div>
                       <div style={{ fontWeight: 'bold' }}>{req.username}</div>
                       <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{new Date(req.createdAt).toLocaleDateString()}</div>
                     </div>
                     <div style={{ display: 'flex', gap: '8px' }}>
                       <button onClick={() => processJoinRequest(req.id, false)} style={{ padding: '6px 12px', borderRadius: '4px', border: 'none', background: 'rgba(255, 99, 132, 0.2)', color: 'var(--neon-pink)', cursor: 'pointer' }}>Reject</button>
                       <button onClick={() => processJoinRequest(req.id, true)} style={{ padding: '6px 12px', borderRadius: '4px', border: 'none', background: 'rgba(0, 245, 255, 0.2)', color: 'var(--neon-cyan)', cursor: 'pointer' }}>Accept</button>
                     </div>
                   </div>
                 ))}
               </div>
            )}
          </div>
        </div>
      )}

      {/* ── Manage Members Modal ────────────────────────────────────── */}
      {showMembersModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
          background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(10px)',
          display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 9999, padding: '20px'
        }}>
          <div className="glass-panel" style={{ width: '100%', maxWidth: '500px', maxHeight: '80vh', overflowY: 'auto', padding: '30px', borderRadius: '24px', position: 'relative', border: '1px solid var(--glass-border)' }}>
            <button onClick={() => setShowMembersModal(false)} style={{ position: 'absolute', top: '20px', right: '20px', background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>
              <X size={24} />
            </button>

            <h2 style={{ fontFamily: 'Outfit', fontSize: '1.8rem', margin: '0 0 8px 0' }} className="text-gradient">
              Community Members
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', margin: '0 0 24px 0' }}>
              Manage users who are currently members of this community.
            </p>

            {loadingMembers ? (
               <div style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>Loading members...</div>
            ) : members.length === 0 ? (
               <div style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>No members found.</div>
            ) : (
               <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                 {members.map(member => (
                   <div key={member.userId} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', background: 'var(--panel-bg)', border: '1px solid var(--glass-border)', borderRadius: '8px' }}>
                     <div>
                       <div style={{ fontWeight: 'bold', color: 'var(--text-primary)' }}>@{member.username}</div>
                       <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                         {member.email || 'No email provided'}
                       </div>
                     </div>
                     {member.username !== community.moderatorUsername ? (
                       <button 
                         onClick={() => handleRemoveMember(member.userId)} 
                         style={{ 
                           padding: '6px 12px', 
                           borderRadius: '4px', 
                           border: '1px solid rgba(220, 38, 38, 0.3)', 
                           background: 'rgba(220, 38, 38, 0.1)', 
                           color: '#DC2626', 
                           cursor: 'pointer',
                           fontSize: '0.82rem',
                           fontWeight: '600',
                           transition: 'all 0.2s'
                         }}
                         onMouseEnter={e => {
                           e.currentTarget.style.background = 'rgba(220, 38, 38, 0.2)';
                           e.currentTarget.style.color = '#EF4444';
                         }}
                         onMouseLeave={e => {
                           e.currentTarget.style.background = 'rgba(220, 38, 38, 0.1)';
                           e.currentTarget.style.color = '#DC2626';
                         }}
                       >
                         Remove
                       </button>
                     ) : (
                       <span style={{ fontSize: '0.8rem', color: 'var(--neon-cyan)', fontWeight: 'bold' }}>Owner</span>
                     )}
                   </div>
                 ))}
               </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CommunityDetails;
