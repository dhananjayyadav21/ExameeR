"use client";
import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import '@/styles/student-layout.css';

const DIFF_COLORS = {
    Easy: { bg: '#dcfce7', color: '#15803d' },
    Medium: { bg: '#fef9c3', color: '#92400e' },
    Hard: { bg: '#fee2e2', color: '#991b1b' },
    Expert: { bg: '#fce7f3', color: '#be185d' },
};

export default function DashboardMockTests() {
    const [tests, setTests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    // Attempters panel
    const [showAttempters, setShowAttempters] = useState(false);
    const [attemptersTest, setAttemptersTest] = useState(null);
    const [attempters, setAttempters] = useState([]);
    const [attemptersLoading, setAttemptersLoading] = useState(false);

    const [showCreateModal, setShowCreateModal] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);
    const [previewQuestions, setPreviewQuestions] = useState(null);
    const [editingId, setEditingId] = useState(null);
    const [isManualMode, setIsManualMode] = useState(false);
    const [formData, setFormData] = useState({
        title: '', description: '', course: 'B.Tech CS/IT',
        durationMinutes: 45, totalQuestions: 10, difficulty: 'Medium'
    });

    useEffect(() => { fetchTests(); }, []);

    const fetchTests = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/mock-test');
            const data = await res.json();
            if (data.success) setTests(data.tests);
        } catch { toast.error("Failed to load mock tests"); }
        setLoading(false);
    };

    const handleCreateClick = () => {
        setEditingId(null); setPreviewQuestions(null);
        setFormData({ title: '', description: '', course: 'B.Tech CS/IT', durationMinutes: 45, totalQuestions: 10, difficulty: 'Medium' });
        setIsManualMode(false); setShowCreateModal(true);
    };

    const handlePreview = async (e) => {
        e.preventDefault(); setIsGenerating(true);
        try {
            const token = localStorage.getItem('token');
            const res = await fetch('/api/mock-test', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ token, ...formData, preview: true }) });
            const data = await res.json();
            if (data.success) { setPreviewQuestions(data.questions); toast.info("AI questions ready. Please review."); }
            else toast.error(data.message || 'Generation failed');
        } catch { toast.error('AI API timeout or network error'); }
        finally { setIsGenerating(false); }
    };

    const handlePublish = async () => {
        setIsGenerating(true);
        try {
            const token = localStorage.getItem('token');
            const res = await fetch('/api/mock-test', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ token, ...formData, questions: previewQuestions, preview: false, ...(editingId && { _id: editingId }) }) });
            const data = await res.json();
            if (data.success) { toast.success('Mock Test published!'); setShowCreateModal(false); setPreviewQuestions(null); fetchTests(); }
            else toast.error(data.message);
        } catch { toast.error('Failed to publish'); }
        finally { setIsGenerating(false); }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this mock test? This cannot be undone.")) return;
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`/api/mock-test?id=${id}`, { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ token }) });
            const data = await res.json();
            if (data.success) { toast.success("Deleted successfully"); fetchTests(); }
            else toast.error(data.message);
        } catch { toast.error("Failed to delete"); }
    };

    const handleEditClick = async (test) => {
        setEditingId(test._id);
        setFormData({
            title: test.title || '',
            description: test.description || '',
            course: test.course || test.category || 'B.Tech CS/IT',
            durationMinutes: test.durationMinutes || 45,
            totalQuestions: test.totalQuestions || 10,
            difficulty: test.difficulty || 'Medium'
        });
        setPreviewQuestions(null);
        setIsManualMode(false);
        setShowCreateModal(true);

        // Fetch full test (with questions) in background
        try {
            const res = await fetch(`/api/mock-test?id=${test._id}`);
            const data = await res.json();
            if (data.success && data.test?.questions?.length > 0) {
                setPreviewQuestions(data.test.questions);
            }
        } catch {
            // silently ignore — user can still regenerate/add manually
        }
    };

    const filteredTests = tests.filter(t =>
        t.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (t.course || t.category)?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const totalAttempts = tests.reduce((s, t) => s + (t.attemptsCount || 0), 0);

    const handleViewAttempters = async (test) => {
        setAttemptersTest(test);
        setAttempters([]);
        setAttemptersLoading(true);
        setShowAttempters(true);
        try {
            const res = await fetch(`/api/mock-test/attempters?testId=${test._id}`);
            const data = await res.json();
            if (data.success) setAttempters(data.attempters);
            else toast.error('Failed to load attempters');
        } catch { toast.error('Network error'); }
        finally { setAttemptersLoading(false); }
    };

    return (
        <div className="dmt-page">

            {/* ── Header ── */}
            <div className="dmt-header">
                <div>
                    <h1 className="dmt-title">Mock Test <span className="dmt-accent">Control Center</span></h1>
                    <p className="dmt-subtitle">Create, manage and track AI-powered assessments.</p>
                </div>
                <button className="dmt-create-btn" onClick={handleCreateClick}>
                    <i className="fa-solid fa-plus"></i> Create Mock Test
                </button>
            </div>

            {/* ── Stat Pills ── */}
            <div className="dmt-stats-row">
                <div className="dmt-stat"><i className="fa-solid fa-layer-group" style={{ color: '#3b82f6' }}></i><div><div className="dmt-stat-val">{tests.length}</div><div className="dmt-stat-lbl">Total Tests</div></div></div>
                <div className="dmt-stat"><i className="fa-solid fa-users" style={{ color: '#04bd20' }}></i><div><div className="dmt-stat-val">{totalAttempts}</div><div className="dmt-stat-lbl">Total Attempts</div></div></div>
                <div className="dmt-stat"><i className="fa-solid fa-circle-check" style={{ color: '#8b5cf6' }}></i><div><div className="dmt-stat-val">{tests.filter(t => t.isAI).length}</div><div className="dmt-stat-lbl">AI Generated</div></div></div>
                <div className="dmt-stat"><i className="fa-solid fa-pen-nib" style={{ color: '#f59e0b' }}></i><div><div className="dmt-stat-val">{tests.filter(t => !t.isAI).length}</div><div className="dmt-stat-lbl">Manual Tests</div></div></div>
            </div>

            {/* ── Table Card ── */}
            <div className="dmt-card">
                {/* Toolbar */}
                <div className="dmt-toolbar">
                    <div className="dmt-search">
                        <i className="fa-solid fa-magnifying-glass"></i>
                        <input placeholder="Search tests..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
                    </div>
                    <span className="dmt-count">{filteredTests.length} test{filteredTests.length !== 1 ? 's' : ''}</span>
                </div>

                {/* Table */}
                <div className="table-responsive">
                    <table className="dmt-table">
                        <thead>
                            <tr>
                                <th>Test Details</th>
                                <th>Program</th>
                                <th className="text-center">Config</th>
                                <th className="text-center">Attempts</th>
                                <th className="text-center">Difficulty</th>
                                <th className="text-end">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                [1, 2, 3, 4].map(i => (
                                    <tr key={i}>
                                        <td><div className="dmt-skel" style={{ width: '200px', height: '14px' }}></div><div className="dmt-skel mt-1" style={{ width: '140px', height: '10px' }}></div></td>
                                        <td><div className="dmt-skel" style={{ width: '90px', height: '22px', borderRadius: '8px' }}></div></td>
                                        <td className="text-center"><div className="dmt-skel mx-auto" style={{ width: '70px', height: '14px' }}></div></td>
                                        <td className="text-center"><div className="dmt-skel mx-auto" style={{ width: '40px', height: '22px', borderRadius: '8px' }}></div></td>
                                        <td className="text-center"><div className="dmt-skel mx-auto" style={{ width: '60px', height: '22px', borderRadius: '20px' }}></div></td>
                                        <td className="text-end"><div className="dmt-skel ms-auto" style={{ width: '72px', height: '32px', borderRadius: '8px' }}></div></td>
                                    </tr>
                                ))
                            ) : filteredTests.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="text-center" style={{ padding: '60px 0' }}>
                                        <div className="dmt-empty-icon"><i className="fa-solid fa-clipboard-list"></i></div>
                                        <div className="dmt-empty-title">No mock tests yet</div>
                                        <div className="dmt-empty-sub">Create your first AI-powered assessment.</div>
                                        <button className="dmt-create-btn mt-3" onClick={handleCreateClick}>
                                            <i className="fa-solid fa-plus"></i> Create Now
                                        </button>
                                    </td>
                                </tr>
                            ) : (
                                filteredTests.map(t => {
                                    const diff = DIFF_COLORS[t.difficulty] || DIFF_COLORS.Medium;
                                    return (
                                        <tr key={t._id} className="dmt-row">
                                            <td>
                                                <div className="dmt-test-icon">
                                                    {t.isAI
                                                        ? <i className="fa-solid fa-wand-magic-sparkles" style={{ color: '#04bd20' }}></i>
                                                        : <i className="fa-solid fa-pen-nib" style={{ color: '#8b5cf6' }}></i>
                                                    }
                                                </div>
                                                <div className="dmt-test-info">
                                                    <span className="dmt-test-title">{t.title}</span>
                                                    <span className="dmt-test-desc">{t.description || 'No description'}</span>
                                                </div>
                                            </td>
                                            <td>
                                                <span className="dmt-course-badge">{t.course || t.category}</span>
                                            </td>
                                            <td className="text-center">
                                                <span className="dmt-config">{t.totalQuestions}Q · {t.durationMinutes}m</span>
                                            </td>
                                            <td className="text-center">
                                                <span className="dmt-attempts-badge">
                                                    <i className="fa-solid fa-users me-1"></i>{t.attemptsCount || 0}
                                                </span>
                                            </td>
                                            <td className="text-center">
                                                <span className="dmt-diff-badge" style={{ background: diff.bg, color: diff.color }}>{t.difficulty || 'Medium'}</span>
                                            </td>
                                            <td className="text-end">
                                                <div className="d-flex justify-content-end gap-2">
                                                    <button
                                                        onClick={() => handleViewAttempters(t)}
                                                        title="View Attempters"
                                                        style={{ width: '32px', height: '32px', borderRadius: '8px', border: '1px solid transparent', background: 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', cursor: 'pointer', color: '#15803d', transition: 'all 0.15s' }}
                                                        onMouseEnter={e => { e.currentTarget.style.background = '#f0fdf4'; e.currentTarget.style.borderColor = '#bbf7d0'; }}
                                                        onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'transparent'; }}
                                                    >
                                                        <i className="fa-solid fa-users"></i>
                                                    </button>
                                                    <button
                                                        onClick={() => handleEditClick(t)}
                                                        title="Edit"
                                                        style={{ width: '32px', height: '32px', borderRadius: '8px', border: '1px solid transparent', background: 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', cursor: 'pointer', color: '#3b82f6', transition: 'all 0.15s' }}
                                                        onMouseEnter={e => { e.currentTarget.style.background = '#eff6ff'; e.currentTarget.style.borderColor = '#bfdbfe'; }}
                                                        onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'transparent'; }}
                                                    >
                                                        <i className="fa-solid fa-pencil"></i>
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(t._id)}
                                                        title="Delete"
                                                        style={{ width: '32px', height: '32px', borderRadius: '8px', border: '1px solid transparent', background: 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', cursor: 'pointer', color: '#ef4444', transition: 'all 0.15s' }}
                                                        onMouseEnter={e => { e.currentTarget.style.background = '#fef2f2'; e.currentTarget.style.borderColor = '#fecaca'; }}
                                                        onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'transparent'; }}
                                                    >
                                                        <i className="fa-solid fa-trash-can"></i>
                                                    </button>
                                                </div>
                                            </td>

                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* ── Modal ── */}
            {showCreateModal && (
                <div className="dmt-modal-overlay" onClick={e => { if (e.target === e.currentTarget) setShowCreateModal(false); }}>
                    <div className={`dmt-modal-box ${previewQuestions ? 'dmt-modal-box--wide' : ''}`}>
                        {/* Modal Header */}
                        <div className="dmt-modal-header">
                            <div>
                                <div className="dmt-modal-title">
                                    {previewQuestions ? <><i className="fa-solid fa-eye me-2 text-success"></i>Review Questions</>
                                        : editingId ? <><i className="fa-solid fa-pencil me-2"></i>Edit Assessment</>
                                            : <><i className="fa-solid fa-wand-magic-sparkles me-2 text-success"></i>AI Assessment Generator</>}
                                </div>
                                <div className="dmt-modal-sub">
                                    {previewQuestions ? `${previewQuestions.length} questions ready — verify before publishing.` : 'Fill in details and let AI build the test.'}
                                </div>
                            </div>
                            <button className="dmt-modal-close" onClick={() => setShowCreateModal(false)}>
                                <i className="fa-solid fa-xmark"></i>
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="dmt-modal-body">
                            {!previewQuestions ? (
                                <form onSubmit={handlePreview}>
                                    <div className="row g-3">
                                        <div className="col-12">
                                            <label className="dmt-label">Topic / Title</label>
                                            <input className="dmt-input" type="text" placeholder="e.g. Data Structures & Algorithms" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} required />
                                        </div>
                                        <div className="col-12">
                                            <label className="dmt-label">AI Generation Prompt</label>
                                            <textarea className="dmt-input" placeholder="Describe what topics to cover..." value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} rows="3" required></textarea>
                                        </div>
                                        <div className="col-md-6 col-lg-3">
                                            <label className="dmt-label">Program</label>
                                            <select className="dmt-input" value={formData.course} onChange={e => setFormData({ ...formData, course: e.target.value })}>
                                                <option>All Courses</option>
                                                <option>B.Tech CS/IT</option>
                                                <option>BCA</option>
                                                <option>MCA</option>
                                                <option>UPSC CSE</option>
                                                <option>SSC CGL</option>
                                                <option>JEE Mains</option>
                                                <option>For All</option>
                                            </select>
                                        </div>
                                        <div className="col-md-6 col-lg-3">
                                            <label className="dmt-label">Duration (mins)</label>
                                            <input className="dmt-input" type="number" value={formData.durationMinutes} onChange={e => setFormData({ ...formData, durationMinutes: e.target.value })} required />
                                        </div>
                                        <div className="col-md-6 col-lg-3">
                                            <label className="dmt-label">Questions</label>
                                            <input className="dmt-input" type="number" value={formData.totalQuestions} onChange={e => setFormData({ ...formData, totalQuestions: e.target.value })} required />
                                        </div>
                                        <div className="col-md-6 col-lg-3">
                                            <label className="dmt-label">Difficulty</label>
                                            <select className="dmt-input" value={formData.difficulty} onChange={e => setFormData({ ...formData, difficulty: e.target.value })}>
                                                <option>Easy</option><option>Medium</option><option>Hard</option><option>Expert</option>
                                            </select>
                                        </div>
                                        <div className="col-12 mt-2">
                                            {!isManualMode ? (
                                                <>
                                                    <button type="submit" className="dmt-submit-btn w-100" disabled={isGenerating}>
                                                        {isGenerating
                                                            ? <><span className="spinner-border spinner-border-sm me-2"></span>AI Generating...</>
                                                            : <><i className="fa-solid fa-wand-magic-sparkles me-2"></i>{editingId ? 'Regenerate & Preview' : 'Generate & Preview'}</>}
                                                    </button>
                                                    <button type="button" className="dmt-manual-btn w-100 mt-2" onClick={() => setIsManualMode(true)}>
                                                        <i className="fa-solid fa-keyboard me-2"></i>Or add questions manually
                                                    </button>
                                                </>
                                            ) : (
                                                <div className="dmt-manual-section">
                                                    <div className="dmt-manual-header">
                                                        <div className="d-flex align-items-center gap-2">
                                                            <i className="fa-solid fa-pen-nib text-success"></i>
                                                            <span className="fw-bold" style={{ fontSize: '0.85rem' }}>Manual Entry Mode</span>
                                                        </div>
                                                        <button type="button" className="dmt-back-ai-btn" onClick={() => setIsManualMode(false)}>
                                                            Back to AI
                                                        </button>
                                                    </div>
                                                    <div className="dmt-q-list">
                                                        {(previewQuestions || []).map((q, idx) => (
                                                            <div key={idx} className="dmt-q-card">
                                                                <div className="dmt-q-num">Q{idx + 1}</div>
                                                                <button type="button" className="dmt-q-remove" onClick={() => { const n = [...previewQuestions]; n.splice(idx, 1); setPreviewQuestions(n); }}>
                                                                    <i className="fa-solid fa-xmark"></i>
                                                                </button>
                                                                <textarea className="dmt-input mb-3" placeholder="Question text..." value={q.questionText} rows="2"
                                                                    onChange={e => { const n = [...previewQuestions]; n[idx].questionText = e.target.value; setPreviewQuestions(n); }} />
                                                                <div className="row g-2">
                                                                    {q.options.map((opt, oIdx) => (
                                                                        <div key={oIdx} className="col-md-6">
                                                                            <div className={`dmt-option ${q.correctAnswerIndex === oIdx ? 'dmt-option--correct' : ''}`} onClick={() => { const n = [...previewQuestions]; n[idx].correctAnswerIndex = oIdx; setPreviewQuestions(n); }}>
                                                                                <span className="dmt-option-letter">{String.fromCharCode(65 + oIdx)}</span>
                                                                                <input className="dmt-option-input" placeholder={`Option ${String.fromCharCode(65 + oIdx)}`} value={opt}
                                                                                    onChange={e => { const n = [...previewQuestions]; n[idx].options[oIdx] = e.target.value; setPreviewQuestions(n); }}
                                                                                    onClick={e => e.stopPropagation()} />
                                                                                {q.correctAnswerIndex === oIdx && <i className="fa-solid fa-check-circle text-success ms-auto" style={{ fontSize: '0.75rem', flexShrink: 0 }}></i>}
                                                                            </div>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        ))}
                                                        <button type="button" className="dmt-add-q-btn" onClick={() => setPreviewQuestions([...(previewQuestions || []), { questionText: '', options: ['', '', '', ''], correctAnswerIndex: 0, explanation: '' }])}>
                                                            <i className="fa-solid fa-plus me-1"></i> Add Question
                                                        </button>
                                                    </div>
                                                    <button type="button" className="dmt-submit-btn w-100 mt-3" disabled={!(previewQuestions?.length > 0)} onClick={handlePublish}>
                                                        {isGenerating ? <><span className="spinner-border spinner-border-sm me-2"></span>Publishing...</> : <><i className="fa-solid fa-bolt-lightning me-2"></i>Publish Test Manually</>}
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </form>
                            ) : (
                                <div>
                                    <div className="dmt-ai-success-banner">
                                        <i className="fa-solid fa-circle-check" style={{ color: '#04bd20', fontSize: '1.1rem' }}></i>
                                        <div>
                                            <div style={{ fontWeight: 700, fontSize: '0.85rem', color: '#0f172a' }}>AI Generation Successful</div>
                                            <div style={{ fontSize: '0.72rem', color: '#64748b' }}>Review {previewQuestions.length} questions below. Click any option to mark as correct.</div>
                                        </div>
                                    </div>

                                    <div className="dmt-q-list">
                                        {previewQuestions.map((q, idx) => (
                                            <div key={idx} className="dmt-q-card">
                                                <div className="dmt-q-num">Q{idx + 1}</div>
                                                <button type="button" className="dmt-q-remove" onClick={() => { const n = [...previewQuestions]; n.splice(idx, 1); setPreviewQuestions(n); }}>
                                                    <i className="fa-solid fa-xmark"></i>
                                                </button>
                                                <textarea className="dmt-input mb-3" value={q.questionText} rows="2"
                                                    onChange={e => { const n = [...previewQuestions]; n[idx].questionText = e.target.value; setPreviewQuestions(n); }} />
                                                <div className="row g-2">
                                                    {q.options.map((opt, oIdx) => (
                                                        <div key={oIdx} className="col-md-6">
                                                            <div className={`dmt-option ${q.correctAnswerIndex === oIdx ? 'dmt-option--correct' : ''}`} onClick={() => { const n = [...previewQuestions]; n[idx].correctAnswerIndex = oIdx; setPreviewQuestions(n); }}>
                                                                <span className="dmt-option-letter">{String.fromCharCode(65 + oIdx)}</span>
                                                                <input className="dmt-option-input" value={opt}
                                                                    onChange={e => { const n = [...previewQuestions]; n[idx].options[oIdx] = e.target.value; setPreviewQuestions(n); }}
                                                                    onClick={e => e.stopPropagation()} />
                                                                {q.correctAnswerIndex === oIdx && <i className="fa-solid fa-check-circle text-success ms-auto" style={{ fontSize: '0.75rem', flexShrink: 0 }}></i>}
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                                <div className="dmt-explanation">
                                                    <i className="fa-solid fa-lightbulb" style={{ color: '#f59e0b', fontSize: '0.7rem' }}></i>
                                                    <input className="dmt-explanation-input" placeholder="Add explanation..." value={q.explanation || ''}
                                                        onChange={e => { const n = [...previewQuestions]; n[idx].explanation = e.target.value; setPreviewQuestions(n); }} />
                                                </div>
                                            </div>
                                        ))}
                                        <button type="button" className="dmt-add-q-btn" onClick={() => setPreviewQuestions([...previewQuestions, { questionText: '', options: ['', '', '', ''], correctAnswerIndex: 0, explanation: '' }])}>
                                            <i className="fa-solid fa-plus me-1"></i> Add Custom Question
                                        </button>
                                    </div>

                                    {/* Sticky Footer */}
                                    <div className="dmt-modal-footer">
                                        <button className="dmt-back-btn" onClick={() => setPreviewQuestions(null)}>
                                            <i className="fa-solid fa-arrow-left me-2"></i>Back
                                        </button>
                                        <button className="dmt-publish-btn" onClick={handlePublish} disabled={isGenerating}>
                                            {isGenerating ? <><span className="spinner-border spinner-border-sm me-2"></span>Publishing...</> : <><i className="fa-solid fa-bolt-lightning me-2"></i>Confirm & Publish</>}
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* ── Attempters Slide-over Panel ── */}
            {showAttempters && (
                <div className="att-overlay" onClick={e => { if (e.target === e.currentTarget) setShowAttempters(false); }}>
                    <div className="att-panel">
                        {/* Panel Header */}
                        <div className="att-header">
                            <div>
                                <div className="att-header-title">
                                    <i className="fa-solid fa-users me-2" style={{ color: '#04bd20' }}></i>
                                    Student Attempters
                                </div>
                                <div className="att-header-sub">
                                    {attemptersTest?.title} · {attempters.length} student{attempters.length !== 1 ? 's' : ''}
                                </div>
                            </div>
                            <button className="dmt-modal-close" onClick={() => setShowAttempters(false)}>
                                <i className="fa-solid fa-xmark"></i>
                            </button>
                        </div>

                        {/* Panel Body */}
                        <div className="att-body">
                            {attemptersLoading ? (
                                [1, 2, 3].map(i => (
                                    <div key={i} className="att-card dmt-skel" style={{ height: '88px' }}></div>
                                ))
                            ) : attempters.length === 0 ? (
                                <div className="att-empty">
                                    <div className="dmt-empty-icon" style={{ margin: '0 auto 10px' }}>
                                        <i className="fa-solid fa-user-slash"></i>
                                    </div>
                                    <div className="dmt-empty-title">No attempts yet</div>
                                    <div className="dmt-empty-sub">No students have taken this test.</div>
                                </div>
                            ) : (
                                attempters.map((a, idx) => {
                                    const name = `${a.user?.FirstName || ''} ${a.user?.LastName || ''}`.trim() || a.user?.Username || 'Unknown';
                                    const initials = name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
                                    const scoreColor = a.bestScore >= 80 ? '#15803d' : a.bestScore >= 40 ? '#92400e' : '#991b1b';
                                    const scoreBg = a.bestScore >= 80 ? '#dcfce7' : a.bestScore >= 40 ? '#fef9c3' : '#fee2e2';
                                    return (
                                        <div key={idx} className="att-card">
                                            {/* Rank */}
                                            <div className="att-rank">#{idx + 1}</div>

                                            {/* Avatar */}
                                            <div className="att-avatar">
                                                {a.user?.Profile
                                                    ? <img src={a.user.Profile} alt={name} />
                                                    : <span>{initials}</span>
                                                }
                                            </div>

                                            {/* Info */}
                                            <div className="att-info">
                                                <div className="att-name">{name}</div>
                                                <div className="att-meta">
                                                    <span>{a.user?.Email}</span>
                                                    {a.user?.Course && <><span className="att-dot">·</span><span>{a.user.Course}</span></>}
                                                </div>
                                                <div className="att-meta" style={{ marginTop: '3px' }}>
                                                    <span className="att-plan-badge att-plan-badge--{a.user?.Plan || 'e0'}">{a.user?.Plan === 'pro' ? '⭐ Pro' : a.user?.Plan === 'plus' ? '+ Plus' : 'Free'}</span>
                                                    <span className="att-dot">·</span>
                                                    <span>Last: {new Date(a.lastAttemptedAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                                                </div>
                                            </div>

                                            {/* Stats */}
                                            <div className="att-stats">
                                                <div className="att-score" style={{ color: scoreColor, background: scoreBg }}>
                                                    {a.bestScore}%
                                                </div>
                                                <div className="att-attempts-count">
                                                    <i className="fa-solid fa-rotate-right me-1"></i>{a.attempts}x
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </div>
                </div>
            )}

            <style jsx>{`
                /* ── Page ── */
                .dmt-page { padding: 0 0 60px; font-family: 'Inter', sans-serif; max-width: 1400px; margin: 0 auto; }

                /* ── Header ── */
                .dmt-header { display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 16px; margin-bottom: 20px; }
                .dmt-title { font-size: 1.3rem; font-weight: 800; color: #0f172a; margin: 0 0 3px; letter-spacing: -0.02em; }
                .dmt-accent { color: #04bd20; }
                .dmt-subtitle { font-size: 0.75rem; color: #94a3b8; margin: 0; font-weight: 500; }

                .dmt-create-btn {
                    display: inline-flex; align-items: center; gap: 8px;
                    background: #04bd20; color: #fff; border: none;
                    padding: 9px 20px; border-radius: 10px;
                    font-size: 0.78rem; font-weight: 700; cursor: pointer;
                    transition: all 0.2s; box-shadow: 0 4px 12px rgba(4,189,32,0.3);
                }
                .dmt-create-btn:hover { background: #03a61b; transform: translateY(-1px); }

                /* ── Stat Row ── */
                .dmt-stats-row { display: flex; gap: 12px; flex-wrap: wrap; margin-bottom: 20px; }
                .dmt-stat { flex: 1; min-width: 120px; background: #fff; border: 1px solid #f1f5f9; border-radius: 12px; padding: 14px 16px; display: flex; align-items: center; gap: 12px; box-shadow: 0 1px 4px rgba(0,0,0,0.04); font-size: 1rem; }
                .dmt-stat-val { font-size: 1.2rem; font-weight: 800; color: #0f172a; line-height: 1.1; }
                .dmt-stat-lbl { font-size: 0.62rem; color: #94a3b8; font-weight: 600; text-transform: uppercase; letter-spacing: 0.04em; }

                /* ── Main Card ── */
                .dmt-card { background: #fff; border: 1px solid #f1f5f9; border-radius: 16px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.04); }

                /* ── Toolbar ── */
                .dmt-toolbar { display: flex; align-items: center; justify-content: space-between; gap: 12px; padding: 16px 20px; border-bottom: 1px solid #f8fafc; }
                .dmt-search { display: flex; align-items: center; gap: 8px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 7px 12px; font-size: 0.72rem; color: #94a3b8; flex: 1; max-width: 320px; transition: border-color 0.2s; }
                .dmt-search:focus-within { border-color: #04bd20; }
                .dmt-search input { border: none; outline: none; background: transparent; font-size: 0.78rem; color: #0f172a; width: 100%; font-weight: 500; }
                .dmt-search input::placeholder { color: #94a3b8; }
                .dmt-count { font-size: 0.7rem; color: #94a3b8; font-weight: 700; white-space: nowrap; }

                /* ── Table ── */
                .dmt-table { width: 100%; border-collapse: collapse; font-size: 0.8rem; }
                .dmt-table thead tr { background: #f8fafc; }
                .dmt-table th { padding: 11px 16px; font-size: 0.62rem; font-weight: 800; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.06em; border: none; white-space: nowrap; }
                .dmt-table th:first-child { padding-left: 20px; }
                .dmt-table th:last-child { padding-right: 20px; }
                .dmt-table td { padding: 12px 16px; border: none; border-top: 1px solid #f8fafc; vertical-align: middle; }
                .dmt-table td:first-child { padding-left: 20px; }
                .dmt-table td:last-child { padding-right: 20px; }
                .dmt-row { transition: background 0.15s; }
                .dmt-row:hover { background: #fafbfc; }
                .dmt-table td:first-child { display: flex; align-items: center; gap: 12px; }

                .dmt-test-icon { width: 36px; height: 36px; border-radius: 10px; background: #f8fafc; border: 1px solid #f1f5f9; display: flex; align-items: center; justify-content: center; font-size: 0.85rem; flex-shrink: 0; }
                .dmt-test-info { display: flex; flex-direction: column; min-width: 0; }
                .dmt-test-title { font-size: 0.82rem; font-weight: 700; color: #0f172a; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 240px; margin-bottom: 2px; }
                .dmt-test-desc { font-size: 0.65rem; color: #94a3b8; font-weight: 500; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 240px; }

                .dmt-course-badge { background: #eff6ff; color: #1d4ed8; border: 1px solid #bfdbfe; padding: 3px 10px; border-radius: 8px; font-size: 0.65rem; font-weight: 700; white-space: nowrap; }
                .dmt-config { font-size: 0.72rem; font-weight: 700; color: #475569; }
                .dmt-attempts-badge { background: #f0fdf4; color: #15803d; border: 1px solid #bbf7d0; padding: 3px 10px; border-radius: 8px; font-size: 0.65rem; font-weight: 700; white-space: nowrap; }
                .dmt-diff-badge { padding: 3px 10px; border-radius: 20px; font-size: 0.62rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.04em; white-space: nowrap; }

                .dmt-action-btn { width: 32px; height: 32px; border-radius: 8px; border: 1px solid transparent; background: transparent; display: flex; align-items: center; justify-content: center; font-size: 0.72rem; cursor: pointer; transition: all 0.15s; }
                .dmt-action-btn--view { color: #15803d; }
                .dmt-action-btn--view:hover { background: #f0fdf4; border-color: #bbf7d0; transform: translateY(-1px); }
                .dmt-action-btn--edit { color: #3b82f6; }
                .dmt-action-btn--edit:hover { background: #eff6ff; border-color: #bfdbfe; transform: translateY(-1px); }
                .dmt-action-btn--delete { color: #ef4444; }
                .dmt-action-btn--delete:hover { background: #fef2f2; border-color: #fecaca; transform: translateY(-1px); }

                /* ── Empty ── */
                .dmt-empty-icon { width: 56px; height: 56px; background: #f8fafc; border-radius: 16px; margin: 0 auto 12px; display: flex; align-items: center; justify-content: center; font-size: 1.4rem; color: #cbd5e1; }
                .dmt-empty-title { font-size: 0.9rem; font-weight: 800; color: #0f172a; margin-bottom: 4px; }
                .dmt-empty-sub { font-size: 0.72rem; color: #94a3b8; }

                /* ── Skeleton ── */
                .dmt-skel { background: linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%); background-size: 200% 100%; animation: shimmer 1.4s infinite; border-radius: 6px; }
                @keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }

                /* ── Modal ── */
                .dmt-modal-overlay { position: fixed; inset: 0; background: rgba(15,23,42,0.65); backdrop-filter: blur(6px); display: flex; align-items: center; justify-content: center; z-index: 9999; padding: 20px; }
                .dmt-modal-box { background: #fff; border-radius: 18px; width: 100%; max-width: 640px; max-height: 92vh; display: flex; flex-direction: column; box-shadow: 0 24px 48px rgba(0,0,0,0.18); animation: modalIn 0.2s cubic-bezier(0.16,1,0.3,1); }
                .dmt-modal-box--wide { max-width: 780px; }
                @keyframes modalIn { from { transform: scale(0.97); opacity: 0; } to { transform: scale(1); opacity: 1; } }

                .dmt-modal-header { display: flex; align-items: flex-start; justify-content: space-between; gap: 12px; padding: 20px 22px 14px; border-bottom: 1px solid #f1f5f9; flex-shrink: 0; }
                .dmt-modal-title { font-size: 0.95rem; font-weight: 800; color: #0f172a; margin-bottom: 3px; }
                .dmt-modal-sub { font-size: 0.7rem; color: #94a3b8; font-weight: 500; }
                .dmt-modal-close { width: 32px; height: 32px; border-radius: 8px; border: 1px solid #e2e8f0; background: #f8fafc; color: #64748b; display: flex; align-items: center; justify-content: center; cursor: pointer; font-size: 0.85rem; flex-shrink: 0; transition: all 0.15s; }
                .dmt-modal-close:hover { background: #fee2e2; color: #ef4444; border-color: #fecaca; }
                .dmt-modal-body { padding: 20px 22px; overflow-y: auto; flex: 1; }

                /* ── Form ── */
                .dmt-label { display: block; font-size: 0.65rem; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.06em; margin-bottom: 5px; }
                .dmt-input { display: block; width: 100%; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 9px 12px; font-size: 0.82rem; font-weight: 600; color: #0f172a; outline: none; transition: border-color 0.2s; resize: vertical; font-family: inherit; }
                .dmt-input:focus { border-color: #04bd20; background: #fff; }

                .dmt-submit-btn { display: flex; align-items: center; justify-content: center; background: #04bd20; color: #fff; border: none; padding: 11px; border-radius: 10px; font-size: 0.82rem; font-weight: 700; cursor: pointer; transition: all 0.2s; box-shadow: 0 4px 12px rgba(4,189,32,0.25); }
                .dmt-submit-btn:hover:not(:disabled) { background: #03a61b; transform: translateY(-1px); }
                .dmt-submit-btn:disabled { opacity: 0.6; cursor: not-allowed; }
                .dmt-manual-btn { display: flex; align-items: center; justify-content: center; background: #f8fafc; border: 1px solid #e2e8f0; color: #64748b; padding: 9px; border-radius: 10px; font-size: 0.78rem; font-weight: 600; cursor: pointer; transition: all 0.15s; }
                .dmt-manual-btn:hover { background: #f1f5f9; color: #0f172a; }

                /* ── Manual mode ── */
                .dmt-manual-section { border-top: 1px solid #f1f5f9; padding-top: 16px; }
                .dmt-manual-header { display: flex; align-items: center; justify-content: space-between; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 10px 14px; margin-bottom: 14px; }
                .dmt-back-ai-btn { background: #04bd20; color: #fff; border: none; padding: 5px 14px; border-radius: 8px; font-size: 0.72rem; font-weight: 700; cursor: pointer; }

                /* ── Question cards ── */
                .dmt-q-list { display: flex; flex-direction: column; gap: 12px; }
                .dmt-q-card { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 16px; position: relative; }
                .dmt-q-num { font-size: 0.6rem; font-weight: 800; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.06em; margin-bottom: 10px; }
                .dmt-q-remove { position: absolute; top: 10px; right: 10px; width: 26px; height: 26px; border-radius: 8px; border: 1px solid #fecaca; background: #fef2f2; color: #ef4444; font-size: 0.7rem; display: flex; align-items: center; justify-content: center; cursor: pointer; }
                .dmt-q-remove:hover { background: #fee2e2; }

                .dmt-option { display: flex; align-items: center; gap: 8px; padding: 7px 10px; border-radius: 8px; border: 1px solid #e2e8f0; background: #fff; cursor: pointer; transition: all 0.15s; }
                .dmt-option:hover { border-color: #04bd20; }
                .dmt-option--correct { border-color: #86efac; background: #f0fdf4; }
                .dmt-option-letter { font-size: 0.65rem; font-weight: 800; color: #64748b; width: 16px; flex-shrink: 0; }
                .dmt-option--correct .dmt-option-letter { color: #15803d; }
                .dmt-option-input { flex: 1; border: none; outline: none; background: transparent; font-size: 0.78rem; font-weight: 500; color: #0f172a; }
                .dmt-option--correct .dmt-option-input { color: #15803d; font-weight: 600; }

                .dmt-explanation { display: flex; align-items: center; gap: 6px; margin-top: 10px; padding: 6px 10px; background: #fffbeb; border-radius: 8px; border: 1px solid #fde68a; }
                .dmt-explanation-input { flex: 1; border: none; outline: none; background: transparent; font-size: 0.72rem; color: #78350f; font-style: italic; }

                .dmt-add-q-btn { display: flex; align-items: center; justify-content: center; background: #fff; border: 2px dashed #e2e8f0; border-radius: 10px; padding: 10px; font-size: 0.75rem; font-weight: 700; color: #64748b; cursor: pointer; transition: all 0.15s; width: 100%; }
                .dmt-add-q-btn:hover { border-color: #04bd20; color: #04bd20; background: #f0fdf4; }

                /* ── AI Success Banner ── */
                .dmt-ai-success-banner { display: flex; align-items: center; gap: 12px; background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 12px; padding: 12px 16px; margin-bottom: 16px; }

                /* ── Modal Footer ── */
                .dmt-modal-footer { display: flex; gap: 10px; padding: 14px 0 0; border-top: 1px solid #f1f5f9; margin-top: 12px; }
                .dmt-back-btn { background: #f8fafc; border: 1px solid #e2e8f0; color: #475569; padding: 10px 20px; border-radius: 10px; font-size: 0.78rem; font-weight: 700; cursor: pointer; transition: all 0.15s; }
                .dmt-back-btn:hover { background: #f1f5f9; color: #0f172a; }
                .dmt-publish-btn { flex: 1; display: flex; align-items: center; justify-content: center; background: #0f172a; color: #fff; border: none; padding: 10px; border-radius: 10px; font-size: 0.82rem; font-weight: 700; cursor: pointer; transition: all 0.2s; }
                .dmt-publish-btn:hover:not(:disabled) { background: #1e293b; }
                .dmt-publish-btn:disabled { opacity: 0.6; cursor: not-allowed; }

                /* ── Attempters Overlay ── */
                .att-overlay { position: fixed; inset: 0; background: rgba(15,23,42,0.5); backdrop-filter: blur(4px); z-index: 9998; display: flex; justify-content: flex-end; }
                .att-panel { background: #fff; width: 100%; max-width: 460px; height: 100%; display: flex; flex-direction: column; box-shadow: -8px 0 32px rgba(0,0,0,0.12); animation: slideIn 0.25s cubic-bezier(0.16,1,0.3,1); }
                @keyframes slideIn { from { transform: translateX(100%); } to { transform: translateX(0); } }

                .att-header { display: flex; align-items: flex-start; justify-content: space-between; gap: 12px; padding: 20px 20px 14px; border-bottom: 1px solid #f1f5f9; flex-shrink: 0; }
                .att-header-title { font-size: 0.95rem; font-weight: 800; color: #0f172a; margin-bottom: 3px; }
                .att-header-sub { font-size: 0.7rem; color: #94a3b8; font-weight: 500; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 320px; }

                .att-body { flex: 1; overflow-y: auto; padding: 14px 16px; display: flex; flex-direction: column; gap: 10px; }

                .att-card { display: flex; align-items: center; gap: 12px; background: #fff; border: 1px solid #f1f5f9; border-radius: 12px; padding: 12px 14px; position: relative; transition: box-shadow 0.15s; }
                .att-card:hover { box-shadow: 0 4px 12px rgba(0,0,0,0.06); }

                .att-rank { font-size: 0.6rem; font-weight: 800; color: #cbd5e1; width: 18px; flex-shrink: 0; text-align: center; }

                .att-avatar { width: 40px; height: 40px; border-radius: 50%; background: linear-gradient(135deg, #04bd20, #16a34a); display: flex; align-items: center; justify-content: center; font-size: 0.75rem; font-weight: 800; color: #fff; flex-shrink: 0; overflow: hidden; }
                .att-avatar img { width: 100%; height: 100%; object-fit: cover; }

                .att-info { flex: 1; min-width: 0; }
                .att-name { font-size: 0.82rem; font-weight: 700; color: #0f172a; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; margin-bottom: 2px; }
                .att-meta { display: flex; align-items: center; gap: 5px; font-size: 0.62rem; color: #94a3b8; font-weight: 500; flex-wrap: wrap; }
                .att-dot { color: #cbd5e1; }
                .att-plan-badge { background: #f1f5f9; color: #475569; padding: 1px 6px; border-radius: 4px; font-size: 0.6rem; font-weight: 700; }

                .att-stats { display: flex; flex-direction: column; align-items: flex-end; gap: 4px; flex-shrink: 0; }
                .att-score { font-size: 1rem; font-weight: 900; padding: 3px 10px; border-radius: 8px; letter-spacing: -0.02em; }
                .att-attempts-count { font-size: 0.62rem; font-weight: 700; color: #94a3b8; white-space: nowrap; }

                .att-empty { text-align: center; padding: 48px 20px; }
            `}</style>
        </div>
    );
}

