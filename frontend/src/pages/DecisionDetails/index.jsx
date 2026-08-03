import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate, useLocation } from 'react-router-dom';
import { MessageSquare, CheckCircle, ArrowLeft, Trash2, Edit3, Plus, X, BarChart2, Check, Star, Lock, Unlock } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as ChartTooltip, Legend } from 'recharts';
import api from '../../api/api';
import { useToast } from '../../context/ToastContext';
import ConfirmModal from '../../components/ConfirmModal';

const parseNumericValue = (str) => {
  if (!str) return null;
  const cleaned = str.replace(/[^\d.-]/g, '');
  const num = parseFloat(cleaned);
  return isNaN(num) ? null : num;
};
const mergeCriteriaAndValues = (fetchedDecision) => {
  if (!fetchedDecision) return fetchedDecision;
  
  fetchedDecision.criteria = [];
  fetchedDecision.options = (fetchedDecision.options || []).map(opt => {
    return {
      ...opt,
      values: opt.values || {}
    };
  });
  return fetchedDecision;
};

const CommentItem = ({
  comment,
  depth = 0,
  currentUser,
  editingCommentId,
  setEditingCommentId,
  editCommentText,
  setEditCommentText,
  handleEditComment,
  handleDeleteCommentClick,
  activeReplyId,
  setActiveReplyId,
  replyText,
  setReplyText,
  handleAddReply
}) => {
  const commentId = comment.commentId || comment.id;
  const username = comment.username || comment.author || 'Anonymous';
  const text = comment.commentText || comment.text;
  const createdAt = comment.createdAt || comment.time;
  const formattedTime = createdAt ? (new Date(createdAt).toString() !== 'Invalid Date' ? new Date(createdAt).toLocaleString() : createdAt) : 'Just now';
  const replies = comment.replies || [];
  const isOwner = currentUser && (currentUser.username === username);
  const isAdmin = currentUser && (currentUser.role === 'ADMIN' || localStorage.getItem('role') === 'admin');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      <div style={{
        padding: depth === 0 ? '16px' : '12px 16px',
        borderRadius: '10px',
        background: depth === 0 ? 'rgba(255,255,255,0.01)' : 'rgba(255,255,255,0.005)',
        border: depth === 0 ? '1px solid var(--glass-border)' : '1px solid rgba(255,255,255,0.05)'
      }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', fontSize: depth === 0 ? '0.85rem' : '0.8rem' }}>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <span style={{ color: depth === 0 ? 'var(--neon-cyan)' : 'var(--neon-pink)', fontWeight: 'bold' }}>@{username}</span>
            <span style={{ color: 'var(--text-secondary)' }}>{formattedTime}</span>
          </div>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            {isOwner && (
              <button 
                onClick={() => { setEditingCommentId(commentId); setEditCommentText(text); }}
                style={{ background: 'transparent', border: 'none', color: 'var(--neon-cyan)', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: 0 }}
                title="Edit Comment"
              >
                <Edit3 size={depth === 0 ? 14 : 12} />
              </button>
            )}
            {(isOwner || isAdmin) && (
              <button 
                onClick={() => handleDeleteCommentClick(commentId)}
                style={{ background: 'transparent', border: 'none', color: 'var(--neon-pink)', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: 0 }}
                title="Delete Comment"
              >
                <Trash2 size={depth === 0 ? 14 : 12} />
              </button>
            )}
          </div>
        </div>

        {/* Content or Edit Form */}
        {editingCommentId === commentId ? (
          <div style={{ marginTop: '8px', marginBottom: '12px' }}>
            <textarea
              value={editCommentText}
              onChange={(e) => setEditCommentText(e.target.value)}
              className="input-premium"
              style={{ width: '100%', minHeight: '60px', padding: '10px', borderRadius: '8px', marginBottom: '8px', background: 'var(--input-bg)', color: 'var(--text-primary)', border: '1px solid var(--glass-border)' }}
            />
            <div style={{ display: 'flex', gap: '8px' }}>
              <button onClick={() => handleEditComment(commentId)} className="btn-primary" style={{ padding: '6px 12px', fontSize: '0.8rem' }}>
                Save
              </button>
              <button onClick={() => setEditingCommentId(null)} className="btn-secondary" style={{ padding: '6px 12px', fontSize: '0.8rem' }}>
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <p style={{ color: 'var(--text-primary)', margin: 0, fontSize: depth === 0 ? '0.95rem' : '0.9rem', lineHeight: '1.5', marginBottom: '12px' }}>
            {text}
          </p>
        )}

        {/* Reply Action Button */}
        <button 
          onClick={() => {
            setActiveReplyId(activeReplyId === commentId ? null : commentId);
            setReplyText('');
          }}
          style={{
            background: 'transparent',
            border: 'none',
            color: 'var(--neon-cyan)',
            fontSize: '0.82rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '4px 8px',
            borderRadius: '4px',
            background: 'rgba(0, 245, 255, 0.05)',
            transition: 'background 0.2s'
          }}
          onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(0, 245, 255, 0.1)'}
          onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(0, 245, 255, 0.05)'}
        >
          <MessageSquare size={13} /> Reply
        </button>

        {/* Inline Reply Form */}
        {activeReplyId === commentId && (
          <form onSubmit={(e) => handleAddReply(e, commentId)} style={{ display: 'flex', gap: '10px', marginTop: '16px' }}>
            <input 
              type="text"
              required
              placeholder={`Replying to @${username}...`}
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              style={{
                flex: 1,
                padding: '10px 14px',
                borderRadius: '8px',
                border: '1px solid var(--glass-border)',
                background: 'var(--input-bg)',
                color: 'var(--text-primary)',
                outline: 'none',
                fontSize: '0.9rem'
              }}
              onFocus={(e) => e.target.style.border = '1px solid var(--neon-cyan)'}
              onBlur={(e) => e.target.style.border = '1px solid var(--glass-border)'}
            />
            <button type="submit" className="btn-primary" style={{ padding: '0 16px', fontSize: '0.85rem' }}>
              Reply
            </button>
          </form>
        )}
      </div>

      {/* Indented Child Replies */}
      {replies && replies.length > 0 && (
        <div style={{ paddingLeft: '24px', display: 'flex', flexDirection: 'column', gap: '10px', borderLeft: '2px solid var(--glass-border)' }}>
          {replies.map(reply => (
            <CommentItem
              key={reply.commentId || reply.id}
              comment={reply}
              depth={depth + 1}
              currentUser={currentUser}
              editingCommentId={editingCommentId}
              setEditingCommentId={setEditingCommentId}
              editCommentText={editCommentText}
              setEditCommentText={setEditCommentText}
              handleEditComment={handleEditComment}
              handleDeleteCommentClick={handleDeleteCommentClick}
              activeReplyId={activeReplyId}
              setActiveReplyId={setActiveReplyId}
              replyText={replyText}
              setReplyText={setReplyText}
              handleAddReply={handleAddReply}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const DecisionDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState(null);
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editCommentText, setEditCommentText] = useState('');
  const [activeTab, setActiveTab] = useState('overview');
  const [decision, setDecision] = useState(null);
  const [comparisonTable, setComparisonTable] = useState(null);
  const [loading, setLoading] = useState(true);
  const [votedOptionId, setVotedOptionId] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);

  // Unified Board & Options Edit States
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editCategory, setEditCategory] = useState('');
  const [editOptions, setEditOptions] = useState([]);
  const [editParameters, setEditParameters] = useState([]);
  const [editParamValues, setEditParamValues] = useState({});
  const [newModalCriterion, setNewModalCriterion] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // Feedback & Rating States
  const [feedbacks, setFeedbacks] = useState([]);
  const [feedbackLoading, setFeedbackLoading] = useState(false);
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
  const [submitRating, setSubmitRating] = useState(5);
  const [submitComment, setSubmitComment] = useState('');
  const [isSubmittingFeedback, setIsSubmittingFeedback] = useState(false);
  const [hoveredStar, setHoveredStar] = useState(-1);

  // Comments state for discussion
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [activeReplyId, setActiveReplyId] = useState(null);
  const [replyText, setReplyText] = useState('');

  const fetchComments = async () => {
    try {
      const res = await api.get(`/api/decisions/${id}/comments`);
      if (res.data?.success && Array.isArray(res.data.data)) {
        setComments(res.data.data);
      } else if (Array.isArray(res.data)) {
        setComments(res.data);
      } else {
        setComments([]);
      }
    } catch (err) {
      console.error("Failed to fetch comments:", err);
    }
  };

  const fetchFeedbacks = async () => {
    try {
      setFeedbackLoading(true);
      const res = await api.get(`/api/decisions/${id}/feedback`);
      if (res.data?.success) {
        setFeedbacks(res.data.data || res.data || []);
      } else {
        setFeedbacks(res.data || []);
      }
    } catch (err) {
      console.error("Failed to fetch feedbacks:", err);
    } finally {
      setFeedbackLoading(false);
    }
  };

  const handleSubmitFeedback = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (submitRating < 1 || submitRating > 5) {
      showToast("Please select a rating between 1 and 5 stars.", "warning");
      return;
    }
    setIsSubmittingFeedback(true);
    try {
      const payload = {
        rating: submitRating,
        feedbackText: submitComment.trim(),
        comment: submitComment.trim()
      };
      await api.post(`/api/decisions/${id}/feedback`, payload);
      showToast("Feedback submitted successfully.", "success");
      setIsFeedbackModalOpen(false);
      setSubmitComment('');
      setSubmitRating(5);
      await fetchFeedbacks();
    } catch (err) {
      console.error("Failed to submit feedback:", err);
      showToast(err.response?.data?.message || "Failed to submit feedback.", "error");
    } finally {
      setIsSubmittingFeedback(false);
    }
  };

  // Toggle Board Status (OPEN <-> CLOSED) via Backend API
  const handleToggleStatus = async () => {
    const newStatus = isClosed ? 'OPEN' : 'CLOSED';
    try {
      const res = await api.patch(`/api/decisions/${id}/status`, { status: newStatus });
      if (res.data?.success || res.data?.data) {
        setDecision(prev => ({ ...prev, status: newStatus }));
        showToast(
          `Board ${newStatus === 'CLOSED' ? 'closed' : 'reopened'} successfully.`,
          'success'
        );
        setActiveTab('overview');
      }
    } catch (err) {
      console.error("Failed to update board status:", err);
      showToast(err.response?.data?.message || "Failed to update board status.", "error");
    }
  };

  // Inline Parameter Edition States
  const [newParamName, setNewParamName] = useState('');
  const [isAddingParam, setIsAddingParam] = useState(false);
  const [editingValues, setEditingValues] = useState({});

  const fetchDecisionDetails = async () => {
    try {
      const [res, compRes] = await Promise.all([
        api.get(`/api/decisions/${id}`),
        api.get(`/api/decisions/${id}/comparison/table`).catch(err => {
          console.warn("Comparison table fetch error:", err);
          return null;
        })
      ]);
      if (res.data?.success) {
        setDecision(mergeCriteriaAndValues(res.data.data));
        if (res.data.data.votedOptionId) {
          setVotedOptionId(Number(res.data.data.votedOptionId));
        } else {
          setVotedOptionId(null);
        }
      }
      if (compRes && compRes.data?.success) {
        const table = compRes.data.data;
        setComparisonTable(table);
        const initialVals = {};
        (table?.options || []).forEach(opt => {
          if (opt && opt.optionId) {
            (table?.parameters || []).forEach(param => {
              if (param && param.id) {
                const valObj = opt.parameterValuesMap?.[param.id] || 
                               opt.parameterValuesMap?.[String(param.id)] || 
                               (opt.parameterValuesList || []).find(v => v && (v.parameterId === param.id || String(v.parameterId) === String(param.id)));
                initialVals[`${opt.optionId}_${param.id}`] = valObj?.stringValue || '';
              }
            });
          }
        });
        setEditingValues(initialVals);
      }
      await fetchComments().catch(() => null);
      await fetchFeedbacks().catch(() => null);
    } catch (err) {
      console.error("Failed to refresh decision details:", err);
    }
  };

  useEffect(() => {
    const fetchDecisionAndUser = async () => {
      try {
        const [decisionRes, userRes, comparisonRes] = await Promise.all([
          api.get(`/api/decisions/${id}`),
          api.get('/api/users/me').catch(() => null),
          api.get(`/api/decisions/${id}/comparison/table`).catch(err => {
            console.warn("Comparison table fetch error:", err);
            return null;
          })
        ]);

        if (decisionRes.data?.success) {
          setDecision(mergeCriteriaAndValues(decisionRes.data.data));
          
          if (decisionRes.data.data.votedOptionId) {
            setVotedOptionId(Number(decisionRes.data.data.votedOptionId));
          } else {
            setVotedOptionId(null);
          }
          
          if (decisionRes.data.data.status === 'CLOSED' || decisionRes.data.data.status === 'closed') {
            fetchFeedbacks().catch(() => null);
          }
        }

        if (userRes && userRes.data?.success) {
          setCurrentUser(userRes.data.data);
        }

        if (comparisonRes && comparisonRes.data?.success) {
          const table = comparisonRes.data.data;
          setComparisonTable(table);
          const initialVals = {};
          (table?.options || []).forEach(opt => {
            if (opt && opt.optionId) {
              (table?.parameters || []).forEach(param => {
                if (param && param.id) {
                  const valObj = opt.parameterValuesMap?.[param.id] || 
                                 opt.parameterValuesMap?.[String(param.id)] || 
                                 (opt.parameterValuesList || []).find(v => v && (v.parameterId === param.id || String(v.parameterId) === String(param.id)));
                  initialVals[`${opt.optionId}_${param.id}`] = valObj?.stringValue || '';
                }
              });
            }
          });
          setEditingValues(initialVals);
        }
        await fetchComments().catch(() => null);
      } catch (err) {
        console.error("Failed to fetch decision details:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDecisionAndUser();
  }, [id]);

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const isEditParam = searchParams.get('edit') === 'true';

  useEffect(() => {
    if (isEditParam && decision) {
      startEdit();
    }
  }, [isEditParam, decision]);

  useEffect(() => {
    if (activeTab === 'discussion') {
      fetchComments().catch(() => null);
    }
  }, [activeTab]);

  const handleVote = async (optionId) => {
    try {
      const res = await api.post(`/api/decisions/${id}/votes`, { optionId, voteType: 'UPVOTE' });
      if (res.data?.success) {
        setVotedOptionId(optionId);
        await fetchDecisionDetails();
      }
    } catch (err) {
      console.error("Failed to cast vote:", err);
      showToast(err.response?.data?.message || "Failed to cast vote.", "error");
    }
  };

  const handleDeleteClick = () => {
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = async () => {
    setShowDeleteConfirm(false);
    try {
      const res = await api.delete(`/api/decisions/${id}`);
      if (res.data?.success) {
        showToast("Decision board deleted successfully.", "success");
        navigate("/decision-board");
      }
    } catch (err) {
      console.error("Failed to delete decision board:", err);
      showToast(err.response?.data?.message || "Failed to delete decision board.", "error");
    }
  };

  // Unified Edit Form Handlers
  const startEdit = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    try {
      setEditTitle(decision?.title || '');
      setEditDescription(decision?.description || '');
      setEditCategory(decision?.category || 'Technology');
      setEditOptions(
        decision?.options ? decision.options.map(opt => ({ ...opt })) : []
      );

      // Populate parameters for edit page
      const initialParams = (comparisonTable?.parameters || [])
        .filter(p => p && p.id)
        .map(p => ({
          id: p.id,
          name: p.name || 'Parameter',
          isDeleted: false
        }));
      setEditParameters(initialParams);

      // Populate option criteria values for edit page
      const initialValues = {};
      const compOptionsList = comparisonTable?.options || [];
      const compParamsList = comparisonTable?.parameters || [];

      compOptionsList.forEach(compOpt => {
        if (compOpt && compOpt.optionId) {
          compParamsList.forEach(p => {
            if (p && p.id) {
              const valObj = compOpt?.parameterValuesMap?.[p.id] || 
                             compOpt?.parameterValuesMap?.[String(p.id)] || 
                             (compOpt?.parameterValuesList || []).find(v => v && (v.parameterId === p.id || String(v.parameterId) === String(p.id)));
              initialValues[`${compOpt.optionId}_${p.id}`] = valObj?.stringValue || valObj?.numericValue || '';
            }
          });
        }
      });

      setEditParamValues(initialValues);
      setNewModalCriterion('');
      setActiveTab('edit board');
    } catch (err) {
      console.error("Error opening edit tab:", err);
      setActiveTab('edit board');
    }
  };

  const handleAddCriterionModal = () => {
    if (!newModalCriterion.trim()) return;
    const name = newModalCriterion.trim();
    if (editParameters.some(p => !p.isDeleted && p.name.toLowerCase() === name.toLowerCase())) {
      showToast("Criterion already exists.", "warning");
      return;
    }
    const tempId = `temp_${Date.now()}`;
    setEditParameters(prev => [...prev, { tempId, name, isDeleted: false }]);
    setNewModalCriterion('');
  };

  const handleRemoveCriterionModal = (paramItem) => {
    if (paramItem.id) {
      setEditParameters(prev => prev.map(p => p.id === paramItem.id ? { ...p, isDeleted: true } : p));
    } else {
      setEditParameters(prev => prev.filter(p => p.tempId !== paramItem.tempId));
    }
  };

  const handleParamValueChangeModal = (optionKey, paramKey, val) => {
    setEditParamValues(prev => ({
      ...prev,
      [`${optionKey}_${paramKey}`]: val
    }));
  };

  const handleAddOptionField = () => {
    setEditOptions([
      { optionTitle: '', description: '', pros: '', cons: '' },
      ...editOptions
    ]);
  };

  const handleRemoveOptionField = (index) => {
    const target = editOptions[index];
    const activeCount = editOptions.filter(o => !o.isDeleted).length;
    
    if (activeCount <= 2 && !target.isDeleted) {
      showToast("A decision board must have at least two options.", "warning");
      return;
    }

    if (target.id) {
      const updated = [...editOptions];
      updated[index] = { ...target, isDeleted: true };
      setEditOptions(updated);
    } else {
      setEditOptions(editOptions.filter((_, i) => i !== index));
    }
  };

  const handleOptionFieldChange = (index, field, value) => {
    const updated = [...editOptions];
    updated[index] = { ...updated[index], [field]: value };
    setEditOptions(updated);
  };

  const handleSave = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!editTitle || !editTitle.trim() || !editDescription || !editDescription.trim()) {
      showToast("Title and description are required.", "warning");
      return;
    }

    const activeOptions = (editOptions || []).filter(o => o && !o.isDeleted);
    if (activeOptions.length < 2) {
      showToast("A decision board must have at least two options.", "warning");
      return;
    }

    if (activeOptions.some(opt => !opt || !opt.optionTitle || !opt.optionTitle.trim())) {
      showToast("All options must have a title.", "warning");
      return;
    }

    setIsSaving(true);
    try {
      // 1. Update Board metadata
      await api.put(`/api/decisions/${id}`, {
        title: editTitle.trim(),
        description: editDescription.trim(),
        category: editCategory || 'Technology'
      });

      // 2. Add / Edit / Delete options based on state
      const optionsResList = [];

      for (let i = 0; i < (editOptions || []).length; i++) {
        const opt = editOptions[i];
        if (!opt) continue;
        const optKey = opt.id || `idx_${i}`;
        if (opt.id) {
          if (opt.isDeleted) {
            await api.delete(`/api/decisions/${id}/options/${opt.id}`).catch(() => null);
          } else {
            const original = (decision?.options || []).find(o => o && o.id === opt.id);
            const isChanged = !original || 
              original.optionTitle !== opt.optionTitle ||
              original.description !== opt.description ||
              original.pros !== opt.pros ||
              original.cons !== opt.cons;
              
            if (isChanged) {
              await api.put(`/api/decisions/${id}/options/${opt.id}`, {
                optionTitle: opt.optionTitle.trim(),
                description: (opt.description || '').trim(),
                pros: (opt.pros || '').trim(),
                cons: (opt.cons || '').trim()
              });
            }
            optionsResList.push({ optKey, id: opt.id });
          }
        } else if (!opt.isDeleted) {
          const res = await api.post(`/api/decisions/${id}/options`, {
            optionTitle: opt.optionTitle.trim(),
            description: (opt.description || '').trim(),
            pros: (opt.pros || '').trim(),
            cons: (opt.cons || '').trim()
          });
          if (res.data?.data?.id) {
            optionsResList.push({ optKey, id: res.data.data.id });
          }
        }
      }

      // 3. Process Parameters (Add / Delete parameters)
      const activeParamMap = {}; // { paramKey -> realParamId }

      for (const param of (editParameters || [])) {
        if (!param) continue;
        if (param.id) {
          if (param.isDeleted) {
            await api.delete(`/api/decisions/${id}/comparison/parameters/${param.id}`).catch(() => null);
          } else {
            activeParamMap[param.id] = param.id;
          }
        } else if (!param.isDeleted && param.name) {
          const req = {
            name: param.name.trim(),
            unit: "",
            weight: 1.0,
            higherIsBetter: true
          };
          const pRes = await api.post(`/api/decisions/${id}/comparison/parameters`, req);
          if (pRes.data?.data?.id) {
            activeParamMap[param.tempId] = pRes.data.data.id;
          }
        }
      }

      // 4. Process Parameter Values Bulk Save
      const valueRequests = [];
      const activeParams = (editParameters || []).filter(p => p && !p.isDeleted);

      for (const optRef of optionsResList) {
        for (const p of activeParams) {
          const pKey = p.id || p.tempId;
          const realParamId = activeParamMap[pKey];
          const valStr = editParamValues[`${optRef.optKey}_${pKey}`] !== undefined 
            ? editParamValues[`${optRef.optKey}_${pKey}`] 
            : (editParamValues[`${optRef.id}_${pKey}`] || '');

          if (realParamId && valStr && valStr.trim() !== '') {
            valueRequests.push({
              optionId: optRef.id,
              parameterId: realParamId,
              stringValue: valStr.trim(),
              numericValue: parseNumericValue(valStr.trim())
            });
          }
        }
      }

      if (valueRequests.length > 0) {
        await api.post(`/api/decisions/${id}/comparison/values`, {
          values: valueRequests
        }).catch(() => null);
      }

      await fetchDecisionDetails();
      setActiveTab('overview');
      showToast("Decision board details and criteria updated successfully!", "success");
    } catch (err) {
      console.error("Failed to save board details:", err);
      showToast(err.response?.data?.message || "Failed to save changes.", "error");
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    try {
      const res = await api.post(`/api/decisions/${id}/comments`, {
        commentText: newComment.trim()
      });
      if (res.data?.success) {
        setNewComment('');
        await fetchComments();
      }
    } catch (err) {
      console.error("Failed to add comment:", err);
      showToast(err.response?.data?.message || "Failed to add comment.", "error");
    }
  };

  const handleAddReply = async (e, parentId) => {
    e.preventDefault();
    if (!replyText.trim()) return;
    try {
      const res = await api.post(`/api/comments/${parentId}/replies`, {
        commentText: replyText.trim()
      });
      if (res.data?.success) {
        setReplyText('');
        setActiveReplyId(null);
        await fetchComments();
      }
    } catch (err) {
      console.error("Failed to add reply:", err);
      showToast(err.response?.data?.message || "Failed to add reply.", "error");
    }
  };

  const handleDeleteCommentClick = (commentId) => {
    setCommentToDelete(commentId);
  };

  const handleConfirmDeleteComment = async () => {
    if (!commentToDelete) return;
    try {
      const res = await api.delete(`/api/comments/${commentToDelete}`);
      if (res.data?.success) {
        showToast("Comment deleted successfully.", "success");
        await fetchComments();
      }
    } catch (err) {
      console.error("Failed to delete comment:", err);
      showToast(err.response?.data?.message || "Failed to delete comment.", "error");
    } finally {
      setCommentToDelete(null);
    }
  };

  const handleEditComment = async (commentId) => {
    if (!editCommentText.trim()) return;
    try {
      const res = await api.put(`/api/comments/${commentId}`, {
        commentText: editCommentText.trim()
      });
      if (res.data?.success) {
        showToast("Comment updated successfully.", "success");
        setEditingCommentId(null);
        setEditCommentText('');
        await fetchComments();
      }
    } catch (err) {
      console.error("Failed to edit comment:", err);
      showToast(err.response?.data?.message || "Failed to edit comment.", "error");
    }
  };

  const handleAddParameterInline = async (e) => {
    e.preventDefault();
    if (!newParamName.trim()) return;
    setIsAddingParam(true);
    try {
      const req = {
        name: newParamName.trim(),
        unit: "",
        weight: 1.0,
        higherIsBetter: true
      };
      const res = await api.post(`/api/decisions/${id}/comparison/parameters`, req);
      if (res.data?.success) {
        setNewParamName('');
        await fetchDecisionDetails();
      }
    } catch (err) {
      console.error("Failed to add parameter inline:", err);
      alert("Could not save parameter to database. Ensure the backend is active.");
    } finally {
      setIsAddingParam(false);
    }
  };

  const handleSaveValueInline = async (optionId, parameterId, value) => {
    try {
      const req = {
        optionId,
        parameterId,
        stringValue: value,
        numericValue: parseNumericValue(value)
      };
      await api.post(`/api/decisions/${id}/comparison/options/${optionId}/values`, req);
      const res = await api.get(`/api/decisions/${id}/comparison/table`);
      if (res.data?.success) {
        setComparisonTable(res.data.data);
      }
    } catch (err) {
      console.error("Failed to save value inline:", err);
    }
  };

  const handleDeleteParameterInline = async (parameterId) => {
    if (!window.confirm("Are you sure you want to delete this comparison parameter?")) return;
    try {
      await api.delete(`/api/decisions/${id}/comparison/parameters/${parameterId}`);
      await fetchDecisionDetails();
    } catch (err) {
      console.error("Failed to delete parameter inline:", err);
      alert("Failed to delete parameter on server.");
    }
  };

  if (loading) {
    return (
      <div style={{ padding: '60px', textAlign: 'center', color: 'var(--text-secondary)' }} className="glass-panel">
        <h3>Loading decision details...</h3>
      </div>
    );
  }

  if (!decision) {
    return (
      <div style={{ padding: '60px', textAlign: 'center', color: 'var(--text-secondary)' }} className="glass-panel">
        <h3>Decision not found.</h3>
        <Link to="/decision-board" className="btn-secondary" style={{ marginTop: '20px', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
          <ArrowLeft size={16} /> Back to Boards
        </Link>
      </div>
    );
  }

  const isOwner = Boolean(
    currentUser && (
      String(currentUser.id) === String(decision?.userId) || 
      currentUser.role === 'ADMIN' ||
      currentUser.role === 'admin'
    )
  );
  // CLOSED = locked board, anything else (OPEN, ACTIVE, etc.) = open/live
  const isClosed = decision?.status === 'CLOSED' || decision?.status === 'closed';
  const visibleOptionsEdit = (editOptions || []).map((opt, idx) => ({ opt: opt || {}, idx })).filter(x => x.opt && !x.opt.isDeleted);

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
      
      {/* Back link & Header */}
      <div style={{ marginBottom: '30px' }}>
        <Link to="/decision-board" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', textDecoration: 'none', marginBottom: '20px' }}>
          <ArrowLeft size={16} /> Back to Decision Boards
        </Link>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '20px' }}>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', gap: '10px', marginBottom: '10px', alignItems: 'center' }}>
              {decision.category && (
                <span style={{ color: 'var(--neon-cyan)', fontSize: '0.9rem', background: 'rgba(0,245,255,0.1)', padding: '4px 8px', borderRadius: '4px', fontWeight: 'bold' }}>
                  #{decision.category}
                </span>
              )}
              <span style={{ 
                color: isClosed ? 'var(--neon-pink)' : '#00FF99', 
                fontSize: '0.85rem', 
                background: isClosed ? 'rgba(255, 0, 255, 0.1)' : 'rgba(0, 255, 153, 0.1)', 
                padding: '4px 10px', 
                borderRadius: '12px',
                fontWeight: '800',
                border: isClosed ? '1px solid rgba(255, 0, 255, 0.25)' : '1px solid rgba(0, 255, 153, 0.25)',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                boxShadow: isClosed ? '0 0 10px rgba(255, 0, 255, 0.1)' : '0 0 10px rgba(0, 255, 153, 0.1)'
              }}>
                {isClosed ? '🔒 Closed' : '🟢 Open'}
              </span>
            </div>
            <h1 style={{ fontSize: '2.5rem', fontFamily: 'Outfit', margin: 0, marginBottom: '8px' }}>{decision.title}</h1>
            <p style={{ color: 'var(--text-secondary)' }}>
              Total Options: <span style={{ color: 'var(--neon-cyan)', fontWeight: 'bold' }}>{decision.options?.length || 0}</span>
            </p>
          </div>

          {isOwner && (
            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                type="button"
                onClick={handleToggleStatus}
                style={{ 
                  cursor: 'pointer', 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '8px', 
                  padding: '10px 20px', 
                  fontSize: '0.9rem',
                  borderRadius: '8px',
                  background: isClosed ? 'rgba(0, 255, 153, 0.08)' : 'rgba(255, 255, 255, 0.02)',
                  border: isClosed ? '1px solid rgba(0, 255, 153, 0.3)' : '1px solid var(--glass-border)',
                  color: isClosed ? '#00FF99' : 'var(--text-primary)',
                  transition: 'all 0.3s ease'
                }}
              >
                {isClosed ? <Unlock size={18} /> : <Lock size={18} />}
                {isClosed ? 'Reopen Board' : 'Close Board'}
              </button>
              <button
                type="button"
                onClick={startEdit}
                className="btn-primary"
                style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', fontSize: '0.9rem' }}
              >
                <Edit3 size={18} /> Edit Board
              </button>
              <button
                type="button"
                onClick={handleDeleteClick}
                className="btn-destructive"
                style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', fontSize: '0.9rem' }}
              >
                <Trash2 size={18} /> Delete Board
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '20px', borderBottom: '1px solid var(--glass-border)', marginBottom: '30px' }}>
        {['Overview', 'Discussion', 'Poll Results'].map(tab => (
          <button
            key={tab}
            onClick={(e) => {
              setActiveTab(tab.toLowerCase());
            }}
            style={{
              background: 'transparent',
              border: 'none',
              color: activeTab === tab.toLowerCase() ? 'var(--neon-cyan)' : 'var(--text-secondary)',
              padding: '12px 0',
              fontSize: '1.1rem',
              fontFamily: 'Outfit',
              borderBottom: activeTab === tab.toLowerCase() ? '2px solid var(--neon-cyan)' : '2px solid transparent',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab Contents */}
      {activeTab === 'overview' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
          {/* Details & Description */}
          <div className="glass-panel" style={{ padding: '30px' }}>
            <h3 style={{ marginBottom: '16px', fontFamily: 'Outfit', color: 'var(--text-primary)' }}>Description & Context</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', lineHeight: '1.7', whiteSpace: 'pre-wrap', margin: 0 }}>
              {decision.description || 'No description provided.'}
            </p>
          </div>

          {/* Comparison Matrix Table */}
          <div className="glass-panel" style={{ padding: '30px', borderRadius: 'var(--radius-lg)' }}>
            <h3 style={{ marginBottom: '24px', fontFamily: 'Outfit' }}>Comparison Matrix</h3>
            {comparisonTable && comparisonTable.parameters && comparisonTable.parameters.length > 0 ? (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', color: 'var(--text-primary)' }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid var(--glass-border)' }}>
                      <th style={{ textAlign: 'left', padding: '12px 16px', fontWeight: 'bold', fontSize: '1rem', color: 'var(--neon-cyan)' }}>Parameter</th>
                      {(decision?.options || []).map(opt => (
                        <th key={opt?.id || opt?.optionTitle} style={{ textAlign: 'center', padding: '12px 16px', fontWeight: 'bold', fontSize: '1rem' }}>
                          {opt?.optionTitle || 'Option'}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {(comparisonTable?.parameters || []).map((param, pIdx) => (
                      <tr key={param?.id || pIdx} style={{ borderBottom: pIdx === (comparisonTable?.parameters?.length || 0) - 1 ? 'none' : '1px solid var(--glass-border)', background: pIdx % 2 === 0 ? 'rgba(255, 255, 255, 0.01)' : 'transparent' }}>
                        <td style={{ textAlign: 'left', padding: '16px', fontWeight: '500', color: 'var(--text-primary)', fontSize: '0.95rem' }}>
                          {param?.name || 'Parameter'} {param?.unit ? `(${param.unit})` : ''}
                        </td>
                        {(decision?.options || []).map(opt => {
                          const compOpt = (comparisonTable?.options || []).find(o => o && (o.optionId === opt?.id || String(o.optionId) === String(opt?.id)));
                          const valObj = compOpt?.parameterValuesMap?.[param?.id] || 
                                         compOpt?.parameterValuesMap?.[String(param?.id)] || 
                                         (compOpt?.parameterValuesList || []).find(v => v && (v.parameterId === param?.id || String(v.parameterId) === String(param?.id)));
                          return (
                            <td key={opt?.id || opt?.optionTitle} style={{ textAlign: 'center', padding: '16px', fontSize: '0.95rem' }}>
                              {valObj?.stringValue || valObj?.numericValue || '-'}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div style={{ padding: '30px', textAlign: 'center', color: 'var(--text-secondary)', background: 'rgba(255, 255, 255, 0.01)', borderRadius: 'var(--radius-md)', border: '1px dashed var(--glass-border)' }}>
                <p style={{ margin: 0, fontSize: '1rem' }}>No parameters mentioned</p>
              </div>
            )}
          </div>

          {/* Options & Voting */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <h3 style={{ fontFamily: 'Outfit', margin: 0, color: 'var(--text-primary)' }}>Available Options</h3>

            {decision.options && decision.options.length > 0 ? (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
                {[...(decision?.options || [])].sort((a, b) => Number(a?.id || 0) - Number(b?.id || 0)).map(option => {
                  const isVoted = votedOptionId === option.id;
                  return (
                    <div key={option.id} className="glass-panel" style={{ 
                      padding: '24px', 
                      border: isVoted ? '1px solid var(--neon-cyan)' : '1px solid var(--glass-border)',
                      boxShadow: isVoted ? 'var(--glow-cyan)' : 'none',
                      display: 'flex', flexDirection: 'column', gap: '16px' 
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <h4 style={{ margin: 0, fontSize: '1.2rem', fontFamily: 'Outfit', color: 'var(--text-primary)' }}>{option.optionTitle}</h4>
                        <span style={{ background: 'rgba(0, 245, 255, 0.1)', color: 'var(--neon-cyan)', padding: '4px 10px', borderRadius: '12px', fontSize: '0.8rem', fontWeight: 'bold' }}>
                          Votes: {option.score || 0}
                        </span>
                      </div>
                      
                      {option.description && (
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', margin: 0, lineHeight: '1.5' }}>
                          {option.description}
                        </p>
                      )}

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
                        {option.pros && (
                          <div style={{ fontSize: '0.85rem' }}>
                            <span style={{ color: 'var(--success)', fontWeight: 'bold', marginRight: '6px' }}>Pros:</span>
                            <span style={{ color: 'var(--text-secondary)' }}>{option.pros}</span>
                          </div>
                        )}
                        {option.cons && (
                          <div style={{ fontSize: '0.85rem' }}>
                            <span style={{ color: 'var(--neon-pink)', fontWeight: 'bold', marginRight: '6px' }}>Cons:</span>
                            <span style={{ color: 'var(--text-secondary)' }}>{option.cons}</span>
                          </div>
                        )}
                      </div>

                      <button 
                        onClick={() => !isClosed && handleVote(option.id)}
                        className={isVoted ? 'btn-primary' : 'btn-secondary'}
                        disabled={isClosed && !isVoted}
                        style={{ 
                          width: '100%', 
                          marginTop: 'auto', 
                          display: 'flex', 
                          justifyContent: 'center', 
                          alignItems: 'center', 
                          gap: '8px',
                          opacity: isClosed && !isVoted ? 0.5 : 1,
                          cursor: isClosed && !isVoted ? 'not-allowed' : 'pointer'
                        }}
                      >
                        <CheckCircle size={18} /> {isVoted ? 'Voted' : isClosed ? 'Voting Closed' : 'Vote for this Option'}
                      </button>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p style={{ color: 'var(--text-secondary)' }}>No options have been provided for this decision.</p>
            )}
          </div>
        </div>
      )}

      {activeTab === 'discussion' && (
        <div className="glass-panel" style={{ padding: '30px' }}>
          <h3 style={{ marginBottom: '24px', fontFamily: 'Outfit' }}>Comments & Replies</h3>
          
          {/* Discussion feed */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '30px' }}>
            {comments.length === 0 ? (
              <p style={{ color: 'var(--text-secondary)', fontStyle: 'italic' }}>No comments yet. Be the first to start the discussion!</p>
            ) : (
              comments.map(comment => (
                <CommentItem
                  key={comment.commentId || comment.id}
                  comment={comment}
                  depth={0}
                  currentUser={currentUser}
                  editingCommentId={editingCommentId}
                  setEditingCommentId={setEditingCommentId}
                  editCommentText={editCommentText}
                  setEditCommentText={setEditCommentText}
                  handleEditComment={handleEditComment}
                  handleDeleteCommentClick={handleDeleteCommentClick}
                  activeReplyId={activeReplyId}
                  setActiveReplyId={setActiveReplyId}
                  replyText={replyText}
                  setReplyText={setReplyText}
                  handleAddReply={handleAddReply}
                />
              ))
            )}
          </div>

          {/* Comment Form */}
          {isClosed ? (
            <div className="glass-panel" style={{ padding: '20px', textAlign: 'center', color: 'var(--text-secondary)', background: 'rgba(255, 255, 255, 0.01)', border: '1px dashed var(--glass-border)', borderRadius: '12px' }}>
              <p style={{ margin: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontSize: '0.95rem' }}>
                <Lock size={16} color="var(--neon-pink)" /> Comments are locked because this decision is closed.
              </p>
            </div>
          ) : (
            <form onSubmit={handleAddComment} style={{ display: 'flex', gap: '12px' }}>
              <input 
                type="text"
                required
                placeholder="Add your feedback to the debate..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                style={{
                  flex: 1,
                  padding: '12px 16px',
                  borderRadius: '8px',
                  border: '1px solid var(--glass-border)',
                  background: 'var(--input-bg)',
                  color: 'var(--text-primary)',
                  outline: 'none'
                }}
                onFocus={(e) => e.target.style.border = '1px solid var(--neon-cyan)'}
                onBlur={(e) => e.target.style.border = '1px solid var(--glass-border)'}
              />
              <button type="submit" className="btn-primary" style={{ padding: '0 24px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <MessageSquare size={16} /> Comment
              </button>
            </form>
          )}
        </div>
      )}

      {activeTab === 'poll results' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>

          {/* Top Banner Recommendation */}
          <div className="glass-panel" style={{ padding: '24px', background: 'rgba(255, 255, 255, 0.02)', border: '1px solid var(--glass-border)', display: 'flex', flexDirection: 'column', gap: '8px', borderRadius: 'var(--radius-lg)' }}>
            {(() => {
              const totalVotes = decision.options.reduce((sum, opt) => sum + (opt.score || 0), 0);
              const sortedOptions = [...decision.options].sort((a, b) => (b.score || 0) - (a.score || 0));
              const leadingOption = sortedOptions[0];
              const isDraw = sortedOptions.length > 1 && sortedOptions[0].score === sortedOptions[1].score && sortedOptions[0].score > 0;
              const hasVotes = totalVotes > 0;

              return hasVotes ? (
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
                    No votes have been cast yet. Cast a vote in the Overview tab to update these results!
                  </p>
                </>
              );
            })()}
          </div>

          {/* Split grid: Progress bars list on left, Donut chart on right */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '30px' }}>
            
            {/* Vote Percentages Lists */}
            <div className="glass-panel" style={{ padding: '30px', display: 'flex', flexDirection: 'column', gap: '24px', borderRadius: 'var(--radius-lg)' }}>
              <h3 style={{ margin: 0, fontFamily: 'Outfit' }}>Vote Breakdown</h3>
              
              {(() => {
                const totalVotes = decision.options.reduce((sum, opt) => sum + (opt.score || 0), 0);
                const sortedOptions = [...decision.options].sort((a, b) => (b.score || 0) - (a.score || 0));
                const leadingOption = sortedOptions[0];
                const isDraw = sortedOptions.length > 1 && sortedOptions[0].score === sortedOptions[1].score && sortedOptions[0].score > 0;
                const hasVotes = totalVotes > 0;
                const CHART_COLORS = ['#00F5FF', '#FF00FF', '#8A2BE2', '#00FF99'];

                return (
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
                );
              })()}
            </div>

            {/* Donut Chart Visualization */}
            <div className="glass-panel" style={{ padding: '30px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', borderRadius: 'var(--radius-lg)' }}>
              <h3 style={{ marginBottom: '20px', fontFamily: 'Outfit' }}>Consensus Share</h3>
              
              {(() => {
                const totalVotes = decision.options.reduce((sum, opt) => sum + (opt.score || 0), 0);
                const pieData = decision.options
                  .map(opt => ({
                    name: opt.optionTitle,
                    value: opt.score || 0
                  }))
                  .filter(d => d.value > 0);
                const CHART_COLORS = ['#00F5FF', '#FF00FF', '#8A2BE2', '#00FF99'];

                return totalVotes > 0 ? (
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
                            const origIndex = decision.options.findIndex(o => o.optionTitle === entry.name);
                            return (
                              <Cell key={`cell-${index}`} fill={CHART_COLORS[origIndex % CHART_COLORS.length]} />
                            );
                          })}
                        </Pie>
                        <ChartTooltip contentStyle={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--glass-border)', borderRadius: '8px' }} />
                        <Legend verticalAlign="bottom" height={36} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <div style={{ height: '240px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)' }}>
                    <p>Donut chart will display once votes are received.</p>
                  </div>
                );
              })()}
            </div>
          </div>

          {/* Qualitative Side-by-Side Comparison */}
          <div className="glass-panel" style={{ padding: '30px', borderRadius: 'var(--radius-lg)' }}>
            <h3 style={{ marginBottom: '24px', fontFamily: 'Outfit' }}>Qualitative Side-by-Side Comparison</h3>
            
            <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', gap: '20px' }}>
              {(decision?.options || []).map((opt, idx) => (
                <div key={opt?.id || idx} style={{ flex: 1, minWidth: '220px', display: 'flex', flexDirection: 'column', gap: '16px', borderRight: idx === (decision?.options?.length || 0) - 1 ? 'none' : '1px solid var(--glass-border)', paddingRight: '20px' }}>
                  <div>
                    <h4 style={{ margin: 0, fontSize: '1.15rem', color: 'var(--text-primary)' }}>{opt?.optionTitle || 'Option'}</h4>
                    {opt?.description && (
                      <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '6px', lineHeight: '1.4' }}>{opt.description}</p>
                    )}
                  </div>
                  
                  {/* Pros */}
                  <div>
                    <div style={{ color: 'var(--success)', fontWeight: 'bold', fontSize: '0.85rem', marginBottom: '6px' }}>Pros</div>
                    {opt?.pros && typeof opt.pros === 'string' ? (
                      <ul style={{ paddingLeft: '16px', margin: 0, fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                        {opt.pros.split(',').map((pro, pIdx) => (
                          <li key={pIdx}>{String(pro).trim()}</li>
                        ))}
                      </ul>
                    ) : opt?.pros ? (
                      <span style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>{String(opt.pros)}</span>
                    ) : (
                      <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', fontStyle: 'italic', margin: 0 }}>None mentioned</p>
                    )}
                  </div>

                  {/* Cons */}
                  <div>
                    <div style={{ color: 'var(--neon-pink)', fontWeight: 'bold', fontSize: '0.85rem', marginBottom: '6px' }}>Cons</div>
                    {opt?.cons && typeof opt.cons === 'string' ? (
                      <ul style={{ paddingLeft: '16px', margin: 0, fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                        {opt.cons.split(',').map((con, cIdx) => (
                          <li key={cIdx}>{String(con).trim()}</li>
                        ))}
                      </ul>
                    ) : opt?.cons ? (
                      <span style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>{String(opt.cons)}</span>
                    ) : (
                      <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', fontStyle: 'italic', margin: 0 }}>None mentioned</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}



      {/* ── Inline Edit Board Page View ────────────────────────────────────────── */}
      {activeTab === 'edit board' && (
        <div className="glass-panel" style={{ padding: '35px', borderRadius: '24px', background: 'rgba(15, 15, 15, 0.95)', border: '1px solid var(--glass-border)' }}>
          <h2 style={{ fontFamily: 'Outfit', fontSize: '1.8rem', margin: '0 0 8px 0', textShadow: '0 0 10px rgba(0, 245, 255, 0.3)' }} className="text-gradient">
            Edit Decision Board & Options
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', margin: '0 0 24px 0', lineHeight: '1.4' }}>
            Modify the board parameters, comparison criteria, and option choices directly on this page.
          </p>

          <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            
            {/* Board Details */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', paddingBottom: '20px', borderBottom: '1px solid var(--glass-border)' }}>
              <h4 style={{ margin: 0, fontFamily: 'Outfit', color: 'var(--neon-cyan)' }}>Board Parameters</h4>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '0.82rem', color: 'var(--text-primary)', fontWeight: '600' }}>Decision Title</label>
                <input 
                  type="text"
                  required
                  value={editTitle || ''}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="input-premium"
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '0.82rem', color: 'var(--text-primary)', fontWeight: '600' }}>Category</label>
                <div style={{ position: 'relative' }}>
                  <select
                    value={editCategory || 'Technology'}
                    onChange={(e) => setEditCategory(e.target.value)}
                    className="input-premium"
                    style={{ appearance: 'none' }}
                  >
                    <option value="Technology" style={{ background: 'var(--bg-primary)', color: 'var(--text-primary)' }}>Technology</option>
                    <option value="Finance" style={{ background: 'var(--bg-primary)', color: 'var(--text-primary)' }}>Finance</option>
                    <option value="Career" style={{ background: 'var(--bg-primary)', color: 'var(--text-primary)' }}>Career</option>
                    <option value="Travel" style={{ background: 'var(--bg-primary)', color: 'var(--text-primary)' }}>Travel</option>
                    <option value="Lifestyle" style={{ background: 'var(--bg-primary)', color: 'var(--text-primary)' }}>Lifestyle</option>
                  </select>
                  <div style={{ position: 'absolute', right: '16px', top: '18px', pointerEvents: 'none', width: '0', height: '0', borderLeft: '5px solid transparent', borderRight: '5px solid transparent', borderTop: '5px solid var(--text-secondary)' }}></div>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '0.82rem', color: 'var(--text-primary)', fontWeight: '600' }}>Description</label>
                <textarea 
                  rows={3}
                  required
                  value={editDescription || ''}
                  onChange={(e) => setEditDescription(e.target.value)}
                  className="input-premium"
                  style={{ resize: 'none' }}
                />
              </div>
            </div>

            {/* Comparison Criteria */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', paddingBottom: '20px', borderBottom: '1px solid var(--glass-border)' }}>
              <h4 style={{ margin: 0, fontFamily: 'Outfit', color: 'var(--neon-cyan)' }}>Comparison Criteria</h4>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.82rem', margin: 0 }}>
                Add, edit, or remove comparison criteria (e.g. Battery, Price, Weight) for this decision board.
              </p>

              {/* Add Criterion Input */}
              <div style={{ display: 'flex', gap: '10px' }}>
                <input 
                  type="text"
                  placeholder="New Criterion (e.g. Battery, Price)"
                  value={newModalCriterion || ''}
                  onChange={(e) => setNewModalCriterion(e.target.value)}
                  className="input-premium"
                  style={{ flex: 1 }}
                />
                <button 
                  type="button"
                  onClick={handleAddCriterionModal}
                  className="btn-secondary"
                  style={{ padding: '8px 16px', display: 'flex', alignItems: 'center', gap: '6px', whiteSpace: 'nowrap' }}
                >
                  <Plus size={16} /> Add Criterion
                </button>
              </div>

              {/* Criteria List Badges */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '4px' }}>
                {(editParameters || []).filter(p => p && !p.isDeleted).map((param) => (
                  <span 
                    key={param.id || param.tempId}
                    className="badge-premium"
                    style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '6px', 
                      background: 'rgba(0, 245, 255, 0.1)', 
                      color: 'var(--neon-cyan)',
                      padding: '6px 12px',
                      fontSize: '0.85rem'
                    }}
                  >
                    {param.name}
                    <button
                      type="button"
                      onClick={() => handleRemoveCriterionModal(param)}
                      style={{ background: 'transparent', border: 'none', color: 'var(--neon-pink)', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center' }}
                    >
                      <X size={14} />
                    </button>
                  </span>
                ))}
                {(editParameters || []).filter(p => p && !p.isDeleted).length === 0 && (
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontStyle: 'italic' }}>No criteria added yet.</span>
                )}
              </div>
            </div>

            {/* Option Choices */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h4 style={{ margin: 0, fontFamily: 'Outfit', color: 'var(--neon-cyan)' }}>Option Choices</h4>
                <button type="button" onClick={handleAddOptionField} className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 12px', fontSize: '0.8rem', borderRadius: 'var(--radius-xl)' }}>
                  <Plus size={14} /> Add Option
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {visibleOptionsEdit.map(({ opt, idx }) => (
                  <div key={idx} className="glass-panel" style={{ padding: '20px', borderRadius: 'var(--radius-md)', border: '1px solid var(--glass-border)', background: 'rgba(255,255,255,0.01)', position: 'relative' }}>
                    <button 
                      type="button" 
                      onClick={() => handleRemoveOptionField(idx)} 
                      style={{ position: 'absolute', top: '16px', right: '16px', background: 'transparent', border: 'none', color: '#DC2626', cursor: 'pointer', transition: 'all 0.2s' }}
                      onMouseEnter={e => {
                        e.currentTarget.style.transform = 'scale(1.1)';
                        e.currentTarget.style.color = '#EF4444';
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.transform = 'none';
                        e.currentTarget.style.color = '#DC2626';
                      }}
                    >
                      <Trash2 size={16} />
                    </button>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: '600' }}>Option Title</label>
                        <input 
                          type="text"
                          required
                          placeholder="Option Title"
                          value={opt.optionTitle || ''}
                          onChange={(e) => handleOptionFieldChange(idx, 'optionTitle', e.target.value)}
                          className="input-premium"
                        />
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: '600' }}>Description</label>
                        <input 
                          type="text"
                          placeholder="Brief description"
                          value={opt.description || ''}
                          onChange={(e) => handleOptionFieldChange(idx, 'description', e.target.value)}
                          className="input-premium"
                        />
                      </div>

                      <div style={{ display: 'flex', gap: '12px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 1 }}>
                          <label style={{ fontSize: '0.8rem', color: 'var(--success)', fontWeight: '600' }}>Pros</label>
                          <input 
                            type="text"
                            placeholder="Pros"
                            value={opt.pros || ''}
                            onChange={(e) => handleOptionFieldChange(idx, 'pros', e.target.value)}
                            className="input-premium"
                          />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 1 }}>
                          <label style={{ fontSize: '0.8rem', color: 'var(--neon-pink)', fontWeight: '600' }}>Cons</label>
                          <input 
                            type="text"
                            placeholder="Cons"
                            value={opt.cons || ''}
                            onChange={(e) => handleOptionFieldChange(idx, 'cons', e.target.value)}
                            className="input-premium"
                          />
                        </div>
                      </div>

                      {/* Option Comparison Specifications */}
                      {(editParameters || []).filter(p => p && !p.isDeleted).length > 0 && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '8px', paddingTop: '12px', borderTop: '1px dashed var(--glass-border)' }}>
                          <label style={{ fontSize: '0.8rem', color: 'var(--neon-cyan)', fontWeight: '600' }}>Criteria Specifications</label>
                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '10px' }}>
                            {(editParameters || []).filter(p => p && !p.isDeleted).map(param => {
                              const pKey = param.id || param.tempId;
                              const optKey = opt.id || `idx_${idx}`;
                              const valKey = `${optKey}_${pKey}`;
                              const currentVal = editParamValues[valKey] !== undefined ? editParamValues[valKey] : ((opt.id && editParamValues[`${opt.id}_${pKey}`]) || '');
                              return (
                                <div key={pKey} style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                                  <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{param.name}</span>
                                  <input 
                                    type="text"
                                    placeholder={`Value for ${param.name}`}
                                    value={currentVal || ''}
                                    onChange={(e) => handleParamValueChangeModal(optKey, pKey, e.target.value)}
                                    className="input-premium"
                                    style={{ padding: '6px 10px', fontSize: '0.85rem' }}
                                  />
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '16px', marginTop: '10px' }}>
              <button 
                type="submit" 
                className="btn-primary" 
                disabled={isSaving}
                style={{ 
                  flex: 1,
                  padding: '14px', 
                  fontSize: '1rem', 
                  boxShadow: 'var(--glow-cyan)'
                }}
              >
                {isSaving ? 'Saving Changes...' : 'Save All Details'}
              </button>
              <button 
                type="button" 
                onClick={() => setActiveTab('overview')} 
                className="btn-outline"
                style={{ padding: '14px 24px', fontSize: '1rem' }}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <ConfirmModal
        isOpen={showDeleteConfirm}
        title="Delete Decision Board"
        message="Are you sure you want to delete this decision board? This action cannot be undone."
        onConfirm={handleConfirmDelete}
        onCancel={() => setShowDeleteConfirm(false)}
        confirmText="Delete"
        type="destructive"
      />

      <ConfirmModal
        isOpen={commentToDelete !== null}
        title="Delete Comment"
        message="Are you sure you want to delete this comment? This action cannot be undone."
        onConfirm={handleConfirmDeleteComment}
        onCancel={() => setCommentToDelete(null)}
        confirmText="Delete"
        type="destructive"
      />


    </div>
  );
};

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Caught error in DecisionDetails:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '40px', color: '#FF0055', background: 'rgba(255, 0, 85, 0.1)', borderRadius: '16px', border: '1px solid #FF0055', margin: '40px auto', maxWidth: '800px', textAlign: 'center' }}>
          <h2 style={{ marginBottom: '12px' }}>⚠️ Decision Details Diagnostic Fallback</h2>
          <p style={{ color: '#fff', fontSize: '1rem', fontFamily: 'monospace', whiteSpace: 'pre-wrap', marginBottom: '20px' }}>
            {this.state.error?.toString()}
          </p>
          <button 
            type="button"
            className="btn-primary" 
            onClick={() => window.location.reload()}
          >
            Reload Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

const DecisionDetailsWithErrorBoundary = (props) => (
  <ErrorBoundary>
    <DecisionDetails {...props} />
  </ErrorBoundary>
);

export default DecisionDetailsWithErrorBoundary;
