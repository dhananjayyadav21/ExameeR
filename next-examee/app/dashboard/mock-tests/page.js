"use client";
import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import '@/styles/student-layout.css';

export default function DashboardMockTests() {
    const [tests, setTests] = useState([]);
    const [loading, setLoading] = useState(true);

    const [showCreateModal, setShowCreateModal] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);
    const [previewQuestions, setPreviewQuestions] = useState(null);
    const [editingId, setEditingId] = useState(null);
    const [isManualMode, setIsManualMode] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        course: 'B.Tech CS/IT',
        durationMinutes: 45,
        totalQuestions: 10,
        difficulty: 'Medium'
    });

    useEffect(() => {
        fetchTests();
    }, []);

    const fetchTests = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/mock-test');
            const data = await res.json();
            if (data.success) {
                setTests(data.tests);
            }
        } catch (error) {
            toast.error("Failed to load mock tests");
        }
        setLoading(false);
    };

    const handleCreateClick = () => {
        setEditingId(null);
        setPreviewQuestions(null);
        setFormData({
            title: '',
            description: '',
            course: 'B.Tech CS/IT',
            durationMinutes: 45,
            totalQuestions: 10,
            difficulty: 'Medium'
        });
        setIsManualMode(false);
        setShowCreateModal(true);
    };

    const handleManualPublish = () => {
        // Create 1 template question so the preview isn't empty
        const template = [{
            questionText: `New Question for ${formData.title}`,
            options: ["Option 1", "Option 2", "Option 3", "Option 4"],
            correctAnswerIndex: 0,
            explanation: "Edit this question manually in preview"
        }];
        setPreviewQuestions(template);
    };

    const handlePreview = async (e) => {
        e.preventDefault();
        setIsGenerating(true);
        try {
            const token = localStorage.getItem('token');
            const res = await fetch('/api/mock-test', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    token,
                    ...formData,
                    preview: true
                })
            });
            const data = await res.json();
            if (data.success) {
                setPreviewQuestions(data.questions);
                toast.info("AI has generated the questions. Please review them.");
            } else {
                toast.error(data.message || 'Generation failed');
            }
        } catch (err) {
            toast.error('AI API timeout or network error');
        } finally {
            setIsGenerating(false);
        }
    };

    const handlePublish = async () => {
        setIsGenerating(true);
        try {
            const token = localStorage.getItem('token');
            const res = await fetch('/api/mock-test', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    token,
                    ...formData,
                    questions: previewQuestions,
                    preview: false,
                    // If editing, include the ID
                    ...(editingId && { _id: editingId })
                })
            });
            const data = await res.json();
            if (data.success) {
                toast.success('AI Mock Test published successfully!');
                setShowCreateModal(false);
                setPreviewQuestions(null);
                fetchTests();
            } else {
                toast.error(data.message);
            }
        } catch (err) {
            toast.error('Failed to publish');
        } finally {
            setIsGenerating(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this mock test? This action cannot be undone.")) return;

        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`/api/mock-test?id=${id}`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token })
            });
            const data = await res.json();
            if (data.success) {
                toast.success("Mock test deleted successfully");
                fetchTests();
            } else {
                toast.error(data.message);
            }
        } catch (err) {
            toast.error("Failed to delete test");
        }
    };

    const handleEditClick = (test) => {
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
        setShowCreateModal(true);
    };

    return (
        <div className="container-fluid py-4 min-vh-100 bg-light-subtle">
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-5">
                <div>
                    <h1 className="fw-bold text-dark mb-1 h4">Mock Test Control Center</h1>
                    <p className="text-muted small mb-0 fs-8">Manage AI-powered assessments and track student progress.</p>
                </div>
                <button className="btn btn-success fw-bold rounded-3 px-4 py-2 d-flex align-items-center gap-2" style={{ backgroundColor: '#04BD20', border: 'none' }} onClick={handleCreateClick}>
                    <i className="fa-solid fa-plus-circle fs-8"></i>
                    Create Mock Test
                </button>
            </div>

            {loading ? (
                <div className="d-flex flex-column align-items-center justify-content-center py-5 opacity-50">
                    <div className="spinner-border text-success mb-3" style={{ width: '3rem', height: '3rem' }} />
                    <span className="fw-bold text-muted">Synchronizing Dashboard...</span>
                </div>
            ) : (
                <div className="premium-card border-0 bg-white shadow-sm rounded-4 overflow-hidden animate-fade-in">
                    <div className="table-responsive">
                        <table className="table border-0 align-middle mb-0">
                            <thead className="bg-white">
                                <tr>
                                    <th className="px-4 py-3 fw-bold text-muted fs-8 text-uppercase ls-wide border-0">Topic / Title</th>
                                    <th className="py-3 fw-bold text-muted fs-8 text-uppercase ls-wide border-0">Program</th>
                                    <th className="py-3 fw-bold text-muted fs-8 text-uppercase ls-wide text-center border-0">Config</th>
                                    <th className="py-3 fw-bold text-muted fs-8 text-uppercase ls-wide text-center border-0">Status</th>
                                    <th className="px-4 py-3 fw-bold text-muted fs-8 text-uppercase ls-wide text-end border-0">Control</th>
                                </tr>
                            </thead>
                            <tbody>
                                {tests.length === 0 && (
                                    <tr>
                                        <td colSpan="5" className="text-center py-5 border-0">
                                            <div className="py-4">
                                                <i className="fa-solid fa-microchip fs-3 text-light mb-3"></i>
                                                <p className="text-muted fw-medium fs-7">No active mock tests generated yet.</p>
                                                <button className="btn btn-outline-success btn-sm rounded-pill mt-2 fs-8 px-3" onClick={handleCreateClick}>Start AI Generation</button>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                                {tests.map((t) => (
                                    <tr key={t._id} className="transition-all hover-row border-top">
                                        <td className="px-4 py-3 border-0">
                                            <div className="ps-0">
                                                <span className="fw-semibold text-dark d-block mb-0 fs-7 ls-tight">{t.title}</span>
                                                <span className="text-muted smaller d-block text-truncate op-75" style={{ maxWidth: '280px' }}>{t.description}</span>
                                            </div>
                                        </td>
                                        <td className="py-3 border-0">
                                            <span className="badge rounded-2 fw-medium fs-8" style={{ backgroundColor: '#F0F9FF', color: '#0369A1', padding: '4px 10px', border: '1px solid #E0F2FE' }}>
                                                {t.course || t.category}
                                            </span>
                                        </td>
                                        <td className="py-3 text-center border-0">
                                            <div className="d-flex flex-column align-items-center">
                                                <span className="fw-medium text-dark fs-7">{t.totalQuestions} Qs</span>
                                                <span className="smaller text-muted opacity-75">{t.durationMinutes}m • {t.difficulty}</span>
                                            </div>
                                        </td>
                                        <td className="py-3 text-center border-0">
                                            <div className="d-flex flex-column align-items-center">
                                                <span className="badge rounded-2 px-2 py-1 fs-8 fw-semibold" style={{ backgroundColor: '#F0FDF4', color: '#15803D', border: '1px solid #DCFCE7' }}>Active</span>
                                                <span className="smaller text-muted mt-1 fw-medium"><i className="fa-solid fa-users me-1 opacity-75"></i> {t.attemptsCount || 0} Attempts</span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 text-end border-0">
                                            <div className="d-flex justify-content-end gap-2">
                                                <button
                                                    className="btn btn-sm rounded-3 d-flex align-items-center justify-content-center border-0 transition-all icon-btn-edit"
                                                    style={{ width: '36px', height: '36px', backgroundColor: '#EFF6FF' }}
                                                    onClick={() => handleEditClick(t)}
                                                    title="Edit Test"
                                                >
                                                    <i className="fa-solid fa-pencil text-primary fs-7"></i>
                                                </button>
                                                <button
                                                    className="btn btn-sm rounded-3 d-flex align-items-center justify-content-center border-0 transition-all icon-btn-delete"
                                                    style={{ width: '36px', height: '36px', backgroundColor: '#FEF2F2' }}
                                                    onClick={() => handleDelete(t._id)}
                                                    title="Delete Test"
                                                >
                                                    <i className="fa-solid fa-trash-can text-danger fs-7"></i>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* AI Generation Modal */}
            {showCreateModal && (
                <div className="modal show d-block backdrop-blur" style={{ backgroundColor: 'rgba(15, 23, 42, 0.7)' }}>
                    <div className={`modal-dialog modal-lg modal-dialog-centered ${previewQuestions ? 'modal-fullscreen-sm-down' : ''}`}>
                        <div className="modal-content border-0 rounded-4 shadow-2xl animate-scale-in overflow-hidden">
                            <div className="modal-header border-0 pb-0 px-4 pt-4 d-flex justify-content-between align-items-center bg-white sticky-top" style={{ zIndex: 10 }}>
                                <div>
                                    <h5 className="fw-black mb-0 text-dark">
                                        {previewQuestions ? 'Review Generated Questions' : (editingId ? 'Modify Assessment' : 'AI Assessment Generator')}
                                    </h5>
                                    <p className="smaller text-muted mb-0">
                                        {previewQuestions ? 'AI has architected your questions. Please verify below.' : 'Enter requirements and let AI build the test.'}
                                    </p>
                                </div>
                                <button type="button" className="btn btn-light rounded-circle shadow-sm d-flex align-items-center justify-content-center p-0" style={{ width: '40px', height: '40px' }} onClick={() => setShowCreateModal(false)}>
                                    <i className="fa-solid fa-xmark text-secondary fs-5"></i>
                                </button>
                            </div>

                            <div className="modal-body p-4 overflow-auto" style={{ maxHeight: '80vh' }}>
                                {!previewQuestions ? (
                                    <form onSubmit={handlePreview}>
                                        <div className="row g-4">
                                            <div className="col-12">
                                                <label className="fw-bold mb-1 smaller text-muted text-uppercase ls-wide">Topic / Title</label>
                                                <input type="text" className="form-control rounded-3 p-3 bg-light border-0 fw-bold" placeholder="Topic name..." value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} required />
                                            </div>
                                            <div className="col-12">
                                                <label className="fw-bold mb-1 smaller text-muted text-uppercase ls-wide">AI Generation Prompt</label>
                                                <textarea className="form-control rounded-3 p-3 bg-light border-0 fw-medium" placeholder="Generation prompt..." value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} rows="4" required></textarea>
                                            </div>
                                            <div className="col-md-6 col-lg-3">
                                                <label className="fw-bold mb-1 smaller text-muted text-uppercase ls-wide">Program</label>
                                                <select className="form-select rounded-3 p-3 bg-light border-0 fw-bold" value={formData.course} onChange={e => setFormData({ ...formData, course: e.target.value })}>
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
                                                <label className="fw-bold mb-1 smaller text-muted text-uppercase ls-wide">Duration (Mins)</label>
                                                <input type="number" className="form-control rounded-3 p-3 bg-light border-0 fw-bold" value={formData.durationMinutes} onChange={e => setFormData({ ...formData, durationMinutes: e.target.value })} required />
                                            </div>
                                            <div className="col-md-6 col-lg-3">
                                                <label className="fw-bold mb-1 smaller text-muted text-uppercase ls-wide">Questions</label>
                                                <input type="number" className="form-control rounded-3 p-3 bg-light border-0 fw-bold" value={formData.totalQuestions} onChange={e => setFormData({ ...formData, totalQuestions: e.target.value })} required />
                                            </div>
                                            <div className="col-md-6 col-lg-3">
                                                <label className="fw-bold mb-1 smaller text-muted text-uppercase ls-wide">Difficulty</label>
                                                <select className="form-select rounded-3 p-3 bg-light border-0 fw-bold" value={formData.difficulty} onChange={e => setFormData({ ...formData, difficulty: e.target.value })}>
                                                    <option>Easy</option>
                                                    <option>Medium</option>
                                                    <option>Hard</option>
                                                    <option>Expert</option>
                                                </select>
                                            </div>
                                            <div className="col-12 mt-4">
                                                <div className="d-flex flex-column gap-3">
                                                    {!isManualMode ? (
                                                        <>
                                                            <button
                                                                type="submit"
                                                                className="btn btn-success w-100 py-3 rounded-pill fw-bold shadow-lg d-flex align-items-center justify-content-center gap-2"
                                                                style={{ backgroundColor: '#04BD20', border: 'none' }}
                                                                disabled={isGenerating}
                                                            >
                                                                {isGenerating ? <><span className="spinner-border spinner-border-sm" /> AI Architecting...</> : (
                                                                    <>
                                                                        <i className="fa-solid fa-wand-magic-sparkles"></i>
                                                                        {editingId ? 'AI Regenerate & Preview' : 'AI Generate & Preview'}
                                                                    </>
                                                                )}
                                                            </button>
                                                            <button
                                                                type="button"
                                                                className="btn btn-outline-secondary w-100 py-2 rounded-pill fw-medium border-0"
                                                                onClick={() => setIsManualMode(true)}
                                                            >
                                                                <i className="fa-solid fa-keyboard me-2"></i> Or Create Manually Without AI
                                                            </button>
                                                        </>
                                                    ) : (
                                                        <div className="animate-fade-in">
                                                            <div className="d-flex justify-content-between align-items-center mb-4 p-4 rounded-4 bg-white shadow-sm border">
                                                                <div className="d-flex align-items-center gap-3">
                                                                    <div className="bg-success bg-opacity-10 p-2 rounded-circle">
                                                                        <i className="fa-solid fa-pen-nib text-success"></i>
                                                                    </div>
                                                                    <h5 className="fw-bold mb-0 text-dark">Manual Entry Mode</h5>
                                                                </div>
                                                                <button type="button" className="btn btn-success rounded-pill px-4 fw-bold shadow-sm" style={{ backgroundColor: '#04BD20', border: 'none' }} onClick={() => setIsManualMode(false)}>
                                                                    Back to AI Generation
                                                                </button>
                                                            </div>

                                                            <div className="alert alert-info py-3 px-4 rounded-4 border-0 small d-flex align-items-start gap-3 mb-4 shadow-sm" style={{ backgroundColor: '#E3F4FC' }}>
                                                                <i className="fa-solid fa-circle-info mt-1 text-info fs-5"></i>
                                                                <span className="text-dark-emphasis fw-medium">Switching to manual mode allows you to publish the test with your currently saved content or a basic template.</span>
                                                            </div>

                                                            <div className="d-flex justify-content-between align-items-center mb-3 border-start border-success border-4 ps-3">
                                                                <h6 className="fw-black text-success text-uppercase ls-wide mb-0">Examination Questions</h6>
                                                                <button
                                                                    type="button"
                                                                    className="btn btn-success btn-sm rounded-pill px-3 py-2 fw-bold d-flex align-items-center gap-2 shadow-sm"
                                                                    style={{ backgroundColor: '#04BD20', border: 'none' }}
                                                                    onClick={() => {
                                                                        const base = previewQuestions || [];
                                                                        setPreviewQuestions([...base, { questionText: '', options: ['', '', '', ''], correctAnswerIndex: 0, explanation: '' }]);
                                                                    }}
                                                                >
                                                                    <i className="fa-solid fa-plus"></i> Add Question
                                                                </button>
                                                            </div>

                                                            <div className="manual-questions-list mb-4">
                                                                {(previewQuestions || []).map((q, idx) => (
                                                                    <div key={idx} className="card border-0 shadow-sm rounded-4 p-4 mb-3 position-relative bg-white border border-light-subtle">
                                                                        <button
                                                                            className="btn btn-danger btn-sm rounded-circle d-flex align-items-center justify-content-center position-absolute top-0 end-0 m-3 shadow-sm opacity-75 hover-opacity-100"
                                                                            style={{ width: '32px', height: '32px', backgroundColor: '#FFF0F0', border: '1px solid #FFE0E0' }}
                                                                            onClick={() => {
                                                                                const n = [...previewQuestions];
                                                                                n.splice(idx, 1);
                                                                                setPreviewQuestions(n);
                                                                            }}
                                                                        >
                                                                            <i className="fa-solid fa-trash-can text-danger smaller"></i>
                                                                        </button>

                                                                        <p className="smaller fw-bold text-muted mb-2 text-uppercase ls-wide">Question {idx + 1}</p>
                                                                        <textarea
                                                                            className="form-control bg-light border-0 fw-medium p-3 rounded-3 mb-4"
                                                                            placeholder="Enter your question here..."
                                                                            value={q.questionText}
                                                                            rows="2"
                                                                            onChange={(e) => {
                                                                                const n = [...previewQuestions];
                                                                                n[idx].questionText = e.target.value;
                                                                                setPreviewQuestions(n);
                                                                            }}
                                                                        />

                                                                        <div className="row g-3">
                                                                            {q.options.map((opt, oIdx) => (
                                                                                <div key={oIdx} className="col-md-6">
                                                                                    <div className="d-flex align-items-center gap-3 p-2 border rounded-3 bg-white hover-shadow transition-all">
                                                                                        <div className="form-check mb-0 ms-2">
                                                                                            <input
                                                                                                className="form-check-input cursor-pointer custom-radio"
                                                                                                type="radio"
                                                                                                name={`q-${idx}`}
                                                                                                checked={q.correctAnswerIndex === oIdx}
                                                                                                onChange={() => {
                                                                                                    const n = [...previewQuestions];
                                                                                                    n[idx].correctAnswerIndex = oIdx;
                                                                                                    setPreviewQuestions(n);
                                                                                                }}
                                                                                            />
                                                                                        </div>
                                                                                        <input
                                                                                            className="form-control form-control-sm border-0 bg-transparent p-1 fw-medium"
                                                                                            placeholder={`Option ${String.fromCharCode(65 + oIdx)}`}
                                                                                            value={opt}
                                                                                            onChange={(e) => {
                                                                                                const n = [...previewQuestions];
                                                                                                n[idx].options[oIdx] = e.target.value;
                                                                                                setPreviewQuestions(n);
                                                                                            }}
                                                                                        />
                                                                                    </div>
                                                                                </div>
                                                                            ))}
                                                                        </div>
                                                                    </div>
                                                                ))}

                                                                {(previewQuestions || []).length === 0 && (
                                                                    <div className="text-center py-5 rounded-4 bg-light border border-dashed text-muted">
                                                                        <i className="fa-solid fa-layer-group fs-2 mb-2 opacity-25"></i>
                                                                        <p className="mb-0 fw-medium">Start adding questions to your assessment</p>
                                                                    </div>
                                                                )}
                                                            </div>

                                                            <button
                                                                type="button"
                                                                className="btn btn-success w-100 py-3 rounded-pill fw-bold shadow-lg mt-2 mb-4"
                                                                style={{ backgroundColor: '#04BD20', border: 'none' }}
                                                                disabled={!(previewQuestions?.length > 0)}
                                                                onClick={() => handlePublish()}
                                                            >
                                                                Publish Test Manually
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </form>
                                ) : (
                                    <div className="animate-fade-in">
                                        <div className="alert alert-success border-0 rounded-4 p-3 mb-4 d-flex align-items-center gap-3">
                                            <i className="fa-solid fa-circle-check fs-4"></i>
                                            <div>
                                                <h6 className="fw-bold mb-0">AI Generation Successful</h6>
                                                <span className="smaller opacity-75">Review the {previewQuestions.length} questions below before publishing.</span>
                                            </div>
                                        </div>

                                        {previewQuestions.map((q, idx) => (
                                            <div key={idx} className="mb-4 p-4 border rounded-4 bg-light bg-opacity-50 position-relative animate-fade-in">
                                                <button
                                                    className="btn btn-sm btn-outline-danger border-0 position-absolute top-0 end-0 m-3 rounded-circle shadow-sm"
                                                    style={{ width: '32px', height: '32px' }}
                                                    onClick={() => {
                                                        const newQs = [...previewQuestions];
                                                        newQs.splice(idx, 1);
                                                        setPreviewQuestions(newQs);
                                                    }}
                                                >
                                                    <i className="fa-solid fa-trash-can smaller"></i>
                                                </button>

                                                <div className="d-flex gap-3 mb-3 pe-5">
                                                    <span className="badge bg-dark rounded-pill" style={{ height: 'fit-content' }}>Q{idx + 1}</span>
                                                    <div className="flex-grow-1">
                                                        <textarea
                                                            className="form-control bg-white border-0 fw-bold fs-6 p-2 rounded-3 shadow-sm"
                                                            value={q.questionText}
                                                            rows="2"
                                                            onChange={(e) => {
                                                                const newQs = [...previewQuestions];
                                                                newQs[idx].questionText = e.target.value;
                                                                setPreviewQuestions(newQs);
                                                            }}
                                                        />
                                                    </div>
                                                </div>

                                                <div className="row g-3">
                                                    {q.options.map((opt, oIdx) => (
                                                        <div key={oIdx} className="col-md-6">
                                                            <div
                                                                className={`p-2 px-3 rounded-3 border d-flex align-items-center gap-2 transition-all cursor-pointer ${q.correctAnswerIndex === oIdx ? 'bg-success bg-opacity-10 border-success shadow-sm' : 'bg-white border-light-subtle'}`}
                                                                onClick={() => {
                                                                    const newQs = [...previewQuestions];
                                                                    newQs[idx].correctAnswerIndex = oIdx;
                                                                    setPreviewQuestions(newQs);
                                                                }}
                                                                style={{ cursor: 'pointer' }}
                                                            >
                                                                <span className={`fw-bold ${q.correctAnswerIndex === oIdx ? 'text-success' : 'text-muted'}`}>
                                                                    {String.fromCharCode(65 + oIdx)}.
                                                                </span>
                                                                <input
                                                                    type="text"
                                                                    className={`form-control form-control-sm border-0 bg-transparent ${q.correctAnswerIndex === oIdx ? 'text-success fw-bold' : 'text-dark'}`}
                                                                    value={opt}
                                                                    onChange={(e) => {
                                                                        const newQs = [...previewQuestions];
                                                                        newQs[idx].options[oIdx] = e.target.value;
                                                                        setPreviewQuestions(newQs);
                                                                    }}
                                                                    onClick={(e) => e.stopPropagation()}
                                                                />
                                                                {q.correctAnswerIndex === oIdx && <i className="fa-solid fa-check-circle text-success ms-auto"></i>}
                                                                {q.correctAnswerIndex !== oIdx && <i className="fa-solid fa-circle-check text-light-subtle ms-auto opacity-25"></i>}
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>

                                                <div className="mt-3 d-flex align-items-center gap-2">
                                                    <i className="fa-solid fa-lightbulb text-warning smaller"></i>
                                                    <input
                                                        className="form-control form-control-sm border-0 bg-transparent text-muted italic p-0"
                                                        placeholder="Add an explanation for students..."
                                                        value={q.explanation || ''}
                                                        onChange={(e) => {
                                                            const newQs = [...previewQuestions];
                                                            newQs[idx].explanation = e.target.value;
                                                            setPreviewQuestions(newQs);
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        ))}

                                        <div className="text-center py-3">
                                            <button
                                                className="btn btn-outline-success rounded-pill px-4 fw-bold border-2 d-inline-flex align-items-center gap-2"
                                                onClick={() => {
                                                    setPreviewQuestions([
                                                        ...previewQuestions,
                                                        {
                                                            questionText: '',
                                                            options: ['', '', '', ''],
                                                            correctAnswerIndex: 0,
                                                            explanation: ''
                                                        }
                                                    ]);
                                                }}
                                            >
                                                <i className="fa-solid fa-plus-circle"></i> Add Custom Question
                                            </button>
                                        </div>

                                        <div className="d-flex gap-3 mt-4 sticky-bottom bg-white bg-opacity-95 p-4 border-top mx-n4 mb-n4" style={{ backdropFilter: 'blur(10px)' }}>
                                            <button className="btn btn-light rounded-pill px-4 fw-bold border shadow-sm" onClick={() => setPreviewQuestions(null)}>
                                                <i className="fa-solid fa-arrow-left me-2"></i> Adjust Settings
                                            </button>
                                            <button className="btn btn-dark rounded-pill flex-grow-1 fw-black shadow-lg animate-pulse-subtle bg-gradient-dark" onClick={handlePublish} disabled={isGenerating}>
                                                {isGenerating ? <><span className="spinner-border spinner-border-sm me-2" /> Finalizing Assessment...</> : <><i className="fa-solid fa-bolt-lightning me-2 text-warning"></i> Confirm & Publish to Dashboard</>}
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <style jsx>{`
                .fs-7 { font-size: 0.85rem; }
                .fs-8 { font-size: 0.75rem; }
                .fs-9 { font-size: 0.65rem; }
                .smaller { font-size: 0.75rem; }
                .ls-wide { letter-spacing: 0.05em; }
                .backdrop-blur { backdrop-filter: blur(12px); }
                .shadow-premium { box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05); }
                .animate-fade-in { animation: fadeIn 0.2s ease-out; }
                .animate-scale-in { animation: scaleIn 0.2s cubic-bezier(0.16, 1, 0.3, 1); }
                @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
                @keyframes scaleIn { from { transform: scale(0.99); opacity: 0; } to { transform: scale(1); opacity: 1; } }
                .transition-all { transition: all 0.15s ease-in-out; }
                .hover-row { transition: all 0.1s ease; cursor: default; }
                .hover-row:hover { background-color: #fafbfc; }
                .italic { font-style: italic; }
                .cursor-pointer { cursor: pointer; }
                .custom-radio { width: 1rem; height: 1rem; margin-top: 0.1em; border-color: #dee2e6; }
                .custom-radio:checked { background-color: #04BD20; border-color: #04BD20; }
                .hover-shadow:hover { box-shadow: 0 2px 8px rgba(0,0,0,0.04); }
                .ls-tight { letter-spacing: -0.01em; }
                .fw-semibold { font-weight: 600; }
                .fw-medium { font-weight: 500; }
                .op-75 { opacity: 0.75; }
                .icon-btn-edit:hover { background-color: #DBEAFE !important; transform: translateY(-1px); }
                .icon-btn-delete:hover { background-color: #FEE2E2 !important; transform: translateY(-1px); }
            `}</style>
        </div>
    );
}
