"use client";
import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

export default function DashboardMockTests() {
    const [tests, setTests] = useState([]);
    const [loading, setLoading] = useState(true);

    const [showCreateModal, setShowCreateModal] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: 'Engineering',
        durationMinutes: 45,
        totalQuestions: 5,
        difficulty: 'Medium'
    });
    // Simplified: Just an array of strings representing questions for MVP.
    const [questionsText, setQuestionsText] = useState('');

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
            toast.error("Failed to load tests");
        }
        setLoading(false);
    };

    const handleCreate = async (e) => {
        e.preventDefault();

        // Very basic parsing for demo: line by line, assuming "Q? Option1, Option2, Option3, Option4 (CorrectIndex)"
        // In real app we'd build a dynamic form builder.
        // For simplicity we will auto-generate some dummy questions inside api or build a dummy array here.

        let parsedQuestions = [];
        for (let i = 0; i < formData.totalQuestions; i++) {
            parsedQuestions.push({
                questionText: `Sample question ${i + 1} for ${formData.title}`,
                options: ['Option A', 'Option B', 'Option C', 'Option D'],
                correctAnswerIndex: 0,
                marks: 1
            });
        }

        try {
            const token = localStorage.getItem('token');
            const res = await fetch('/api/mock-test', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    token,
                    ...formData,
                    questions: parsedQuestions
                })
            });
            const data = await res.json();
            if (data.success) {
                toast.success('Mock Test created!');
                setShowCreateModal(false);
                fetchTests();
            } else {
                toast.error(data.message || 'Error creating test');
            }
        } catch (err) {
            toast.error('Network Error');
        }
    };

    return (
        <div className="container-fluid py-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h4 className="fw-bold mb-0 text-dark">Manage Mock Tests</h4>
                <button className="btn btn-success fw-bold px-4 rounded-pill" onClick={() => setShowCreateModal(true)}>
                    + New Mock Test
                </button>
            </div>

            {loading ? (
                <div className="text-center p-5"><div className="spinner-border text-success" /></div>
            ) : (
                <div className="card border-0 shadow-sm rounded-4">
                    <div className="card-body p-0">
                        <div className="table-responsive">
                            <table className="table table-hover align-middle mb-0">
                                <thead className="table-light">
                                    <tr>
                                        <th className="px-4 py-3 fw-bold text-muted text-uppercase smaller">Title</th>
                                        <th className="py-3 fw-bold text-muted text-uppercase smaller">Category</th>
                                        <th className="py-3 fw-bold text-muted text-uppercase smaller">Questions</th>
                                        <th className="py-3 fw-bold text-muted text-uppercase smaller">Duration</th>
                                        <th className="px-4 py-3 fw-bold text-muted text-uppercase smaller text-end">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {tests.length === 0 && (
                                        <tr>
                                            <td colSpan="5" className="text-center py-4 text-muted">No mock tests found.</td>
                                        </tr>
                                    )}
                                    {tests.map((t) => (
                                        <tr key={t._id}>
                                            <td className="px-4 py-3 fw-bold">{t.title}</td>
                                            <td className="py-3">
                                                <span className="badge bg-light text-dark border px-2 py-1">{t.category}</span>
                                            </td>
                                            <td className="py-3 fw-medium">{t.totalQuestions} Questions</td>
                                            <td className="py-3 fw-medium">{t.durationMinutes} min</td>
                                            <td className="px-4 py-3 text-end">
                                                <button className="btn btn-sm btn-outline-secondary me-2">Edit</button>
                                                <button className="btn btn-sm btn-outline-danger">Delete</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}

            {/* Create Modal */}
            {showCreateModal && (
                <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog modal-lg modal-dialog-centered">
                        <div className="modal-content border-0 rounded-4 shadow-lg">
                            <div className="modal-header border-bottom-0 pb-0 px-4 pt-4">
                                <h5 className="fw-black mb-0">Create New Mock Test</h5>
                                <button type="button" className="btn-close" onClick={() => setShowCreateModal(false)}></button>
                            </div>
                            <div className="modal-body p-4">
                                <form onSubmit={handleCreate}>
                                    <div className="row g-3">
                                        <div className="col-12">
                                            <label className="fw-bold mb-1 smaller text-muted">Title</label>
                                            <input type="text" className="form-control rounded-3" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} required />
                                        </div>
                                        <div className="col-12">
                                            <label className="fw-bold mb-1 smaller text-muted">Description</label>
                                            <textarea className="form-control rounded-3" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} required></textarea>
                                        </div>
                                        <div className="col-md-4">
                                            <label className="fw-bold mb-1 smaller text-muted">Category</label>
                                            <select className="form-select rounded-3" value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })}>
                                                <option>Engineering</option>
                                                <option>Medical</option>
                                                <option>General</option>
                                            </select>
                                        </div>
                                        <div className="col-md-4">
                                            <label className="fw-bold mb-1 smaller text-muted">Duration (Mins)</label>
                                            <input type="number" className="form-control rounded-3" value={formData.durationMinutes} onChange={e => setFormData({ ...formData, durationMinutes: e.target.value })} required />
                                        </div>
                                        <div className="col-md-4">
                                            <label className="fw-bold mb-1 smaller text-muted">Total Questions</label>
                                            <input type="number" className="form-control rounded-3" value={formData.totalQuestions} onChange={e => setFormData({ ...formData, totalQuestions: e.target.value })} required />
                                        </div>
                                        <div className="col-12 mt-4 text-end">
                                            <button type="button" className="btn btn-light fw-bold me-2 rounded-pill px-4" onClick={() => setShowCreateModal(false)}>Cancel</button>
                                            <button type="submit" className="btn btn-success fw-bold rounded-pill px-4">Publish Test</button>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
