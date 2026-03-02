"use client";
import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import '../../../styles/dashboard-content.css';

const ManageCertifyPage = () => {
    const [tests, setTests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingTest, setEditingTest] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        category: '',
        description: '',
        passingScore: 75,
        questions: [{ questionText: '', options: ['', '', '', ''], correctOptionIndex: 0 }]
    });

    useEffect(() => {
        fetchTests();
    }, []);

    const fetchTests = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch('/api/certify', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            if (data.success) {
                setTests(data.tests);
            }
        } catch (error) {
            toast.error("Failed to load tests");
        } finally {
            setLoading(false);
        }
    };

    const handleAddQuestion = () => {
        setFormData({
            ...formData,
            questions: [...formData.questions, { questionText: '', options: ['', '', '', ''], correctOptionIndex: 0 }]
        });
    };

    const handleRemoveQuestion = (index) => {
        const newQs = formData.questions.filter((_, i) => i !== index);
        setFormData({ ...formData, questions: newQs });
    };

    const handleQuestionChange = (index, field, value) => {
        const newQs = [...formData.questions];
        newQs[index][field] = value;
        setFormData({ ...formData, questions: newQs });
    };

    const handleOptionChange = (qIndex, oIndex, value) => {
        const newQs = [...formData.questions];
        newQs[qIndex].options[oIndex] = value;
        setFormData({ ...formData, questions: newQs });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            // For now using a generic save endpoint or expanding the existing one
            const res = await fetch('/api/dashboard/certify', {
                method: editingTest ? 'PUT' : 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify(editingTest ? { ...formData, id: editingTest._id } : formData)
            });
            const data = await res.json();
            if (data.success) {
                toast.success(editingTest ? "Updated successfully" : "Created successfully");
                setShowModal(false);
                fetchTests();
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error("Error saving test");
        }
    };

    return (
        <div className="container-fluid p-2 p-md-4 dc-page">
            <div className="dc-header d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
                <div>
                    <h2 className="dc-title fs-3 fs-md-2">Certification Management</h2>
                    <p className="dc-sub mb-0">Create and manage professional certification exams for students.</p>
                </div>
                <button className="dc-add-btn btn-success rounded-pill px-4 fw-bold w-auto border-0" onClick={() => {
                    setEditingTest(null);
                    setFormData({
                        title: '', category: '', description: '', passingScore: 75,
                        questions: [{ questionText: '', options: ['', '', '', ''], correctOptionIndex: 0 }]
                    });
                    setShowModal(true);
                }}>
                    <i className="fa-solid fa-plus me-2"></i>Create New Test
                </button>
            </div>

            <div className="dc-table-card border overflow-hidden">
                <div className="dc-table-header">
                    <span className="dc-table-title">Available Certification Tracks</span>
                    <span className="dc-pill">{tests.length} Tracks</span>
                </div>
                <div className="table-responsive">
                    <table className="dc-table mb-0" style={{ minWidth: '800px' }}>
                        <thead>
                            <tr>
                                <th className="px-4 py-3">Title</th>
                                <th className="py-3">Category</th>
                                <th className="py-3">Questions</th>
                                <th className="py-3">Passing Score</th>
                                <th className="px-4 py-3 text-end">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan="5" className="text-center py-5"><div className="dc-spinner-lg mx-auto"></div></td></tr>
                            ) : tests.map(test => (
                                <tr key={test._id} className="align-middle">
                                    <td className="px-4 py-3 fw-bold">{test.title}</td>
                                    <td className="py-3"><span className="dc-cat-tag">{test.category}</span></td>
                                    <td className="py-3 text-secondary fw-bold">{test.questions.length} Qs</td>
                                    <td className="py-3 fw-black text-success">{test.passingScore}%</td>
                                    <td className="px-4 py-3 text-end">
                                        <div className="dc-actions">
                                            <button className="dc-action-btn dc-edit" title="Edit" onClick={() => {
                                                setEditingTest(test);
                                                setFormData(test);
                                                setShowModal(true);
                                            }}><i className="fa-solid fa-pencil"></i></button>
                                            <button className="dc-action-btn dc-del" title="Delete"><i className="fa-solid fa-trash"></i></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal */}
            {showModal && (
                <div className="modal fade show d-block p-2 p-md-0" style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1050, overflowY: 'auto' }}>
                    <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable mx-auto my-4" style={{ maxWidth: '95%', width: 'auto' }}>
                        <div className="modal-content rounded-4 border-0 shadow-lg" style={{ maxWidth: '800px', margin: '0 auto' }}>
                            <form onSubmit={handleSubmit}>
                                <div className="modal-header px-4 pt-4 border-0 d-flex justify-content-between align-items-center">
                                    <h5 className="fw-black mb-0">{editingTest ? 'Edit Certification' : 'Create New Certification'}</h5>
                                    <button type="button" className="btn dc-action-btn border-0 p-0" onClick={() => setShowModal(false)} style={{ background: 'none', boxShadow: 'none' }}>
                                        <i className="fa-solid fa-xmark text-secondary fs-4"></i>
                                    </button>
                                </div>
                                <div className="modal-body p-3 p-md-4" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
                                    <div className="row g-3 mb-4">
                                        <div className="col-md-8">
                                            <label className="form-label small fw-bold text-secondary text-uppercase">Test Title</label>
                                            <input type="text" className="form-control rounded-3 shadow-sm" style={{ border: '1.5px solid #e2e8f0' }} value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} placeholder="e.g. Advanced AI Professional" required />
                                        </div>
                                        <div className="col-md-4">
                                            <label className="form-label small fw-bold text-secondary text-uppercase">Category</label>
                                            <input type="text" className="form-control rounded-3 shadow-sm" style={{ border: '1.5px solid #e2e8f0' }} value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })} placeholder="Technology" required />
                                        </div>
                                        <div className="col-12">
                                            <label className="form-label small fw-bold text-secondary text-uppercase">Description</label>
                                            <textarea className="form-control rounded-3 shadow-sm" style={{ border: '1.5px solid #e2e8f0' }} value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} rows="2" placeholder="Describe what this certificate validates..."></textarea>
                                        </div>
                                    </div>

                                    <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-3 mb-3">
                                        <h6 className="fw-black text-uppercase small text-success mb-0 border-start border-success border-4 ps-2">Examination Questions</h6>
                                        <button type="button" className="btn btn-success rounded-pill px-4 py-2 fw-bold w-auto border-0 shadow-sm" onClick={handleAddQuestion} style={{ fontSize: '0.85rem', background: 'linear-gradient(135deg, #04bd20 0%, #029d1a 100%)' }}>
                                            <i className="fa-solid fa-plus me-2"></i>Add Question
                                        </button>
                                    </div>

                                    {formData.questions.map((q, qIdx) => (
                                        <div key={qIdx} className="bg-white p-3 p-md-4 rounded-4 mb-4 border position-relative shadow-sm">
                                            <button type="button" className="position-absolute top-0 end-0 m-3 d-flex align-items-center justify-content-center" style={{ width: '32px', height: '32px', backgroundColor: '#fff', border: '1px solid #fee2e2', borderRadius: '50%', cursor: 'pointer', boxShadow: '0 2px 5px rgba(239, 68, 68, 0.1)' }} onClick={() => handleRemoveQuestion(qIdx)}>
                                                <i className="fa-solid fa-trash-can text-danger" style={{ fontSize: '0.85rem' }}></i>
                                            </button>
                                            <div className="mb-3">
                                                <label className="form-label small fw-bold">Question {qIdx + 1}</label>
                                                <input type="text" className="form-control border-0 shadow-sm" value={q.questionText} onChange={e => handleQuestionChange(qIdx, 'questionText', e.target.value)} placeholder="Enter the question here..." required />
                                            </div>
                                            <div className="row g-2">
                                                {q.options.map((opt, oIdx) => (
                                                    <div key={oIdx} className="col-12 col-md-6">
                                                        <div className="input-group">
                                                            <div className="input-group-text bg-white border-0">
                                                                <input type="radio" name={`correct-${qIdx}`} checked={q.correctOptionIndex === oIdx} onChange={() => handleQuestionChange(qIdx, 'correctOptionIndex', oIdx)} required />
                                                            </div>
                                                            <input type="text" className="form-control border-0 shadow-sm" value={opt} onChange={e => handleOptionChange(qIdx, oIdx, e.target.value)} placeholder={`Option ${String.fromCharCode(65 + oIdx)}`} required />
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="modal-footer px-4 pb-4 border-0 d-flex justify-content-end gap-3 flex-row">
                                    <button type="button" className="rounded-pill px-4 py-2 fw-bold border-0 shadow-sm" onClick={() => setShowModal(false)} style={{ backgroundColor: '#f1f5f9', color: '#64748b', transition: 'all 0.2s', minWidth: '100px', cursor: 'pointer' }}>
                                        Cancel
                                    </button>
                                    <button type="submit" className="rounded-pill px-5 py-2 fw-bold border-0 shadow-sm" style={{ backgroundColor: '#1e293b', color: '#ffffff', transition: 'all 0.2s', minWidth: '140px', cursor: 'pointer' }}>
                                        {editingTest ? 'Save Changes' : 'Create Track'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManageCertifyPage;
