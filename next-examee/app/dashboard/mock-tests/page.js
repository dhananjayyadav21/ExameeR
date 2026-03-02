"use client";
import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

export default function DashboardMockTests() {
    const [tests, setTests] = useState([]);
    const [loading, setLoading] = useState(true);

    const [showCreateModal, setShowCreateModal] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        course: 'B.Tech CS/IT',
        durationMinutes: 45,
        totalQuestions: 5,
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
            toast.error("Failed to load tests");
        }
        setLoading(false);
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        setIsGenerating(true);

        try {
            const token = localStorage.getItem('token');
            const url = editingId ? `/api/mock-test?id=${editingId}` : '/api/mock-test';
            const method = editingId ? 'PUT' : 'POST';

            const res = await fetch(url, {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    token,
                    ...formData,
                })
            });
            const data = await res.json();
            if (data.success) {
                toast.success(editingId ? 'Mock Test updated successfully!' : 'AI Mock Test created successfully!');
                setShowCreateModal(false);
                setEditingId(null);
                setFormData({
                    title: '',
                    description: '',
                    course: 'B.Tech CS/IT',
                    durationMinutes: 45,
                    totalQuestions: 5,
                    difficulty: 'Medium'
                });
                fetchTests();
            } else {
                toast.error(data.message || 'Error saving test');
            }
        } catch (err) {
            toast.error('Network Error or API timeout');
        } finally {
            setIsGenerating(false);
        }
    };

    const handleEditClick = (test) => {
        setEditingId(test._id);
        setFormData({
            title: test.title || '',
            description: test.description || '',
            course: test.course || test.category || 'B.Tech CS/IT',
            durationMinutes: test.durationMinutes || 45,
            totalQuestions: test.totalQuestions || 5,
            difficulty: test.difficulty || 'Medium'
        });
        setShowCreateModal(true);
    };

    const handleCreateClick = () => {
        setEditingId(null);
        setFormData({
            title: '',
            description: '',
            course: 'B.Tech CS/IT',
            durationMinutes: 45,
            totalQuestions: 5,
            difficulty: 'Medium'
        });
        setShowCreateModal(true);
    };

    return (
        <div className="container-fluid py-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h4 className="fw-bold mb-0 text-dark">Manage Mock Tests</h4>
                <button className="btn btn-success fw-bold px-4 rounded-pill" onClick={handleCreateClick}>
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
                                        <th className="py-3 fw-bold text-muted text-uppercase smaller">Course</th>
                                        <th className="py-3 fw-bold text-muted text-uppercase smaller">Questions</th>
                                        <th className="py-3 fw-bold text-muted text-uppercase smaller">Duration</th>
                                        <th className="px-4 py-3 fw-bold text-muted text-uppercase smaller text-end">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {tests.length === 0 && (
                                        <tr>
                                            <td colSpan="5" className="text-center py-5 text-muted">
                                                <i className="fa-solid fa-folder-open fs-1 text-light mb-3"></i>
                                                <p className="mb-0">No mock tests found.</p>
                                            </td>
                                        </tr>
                                    )}
                                    {tests.map((t) => (
                                        <tr key={t._id}>
                                            <td className="px-4 py-3 fw-bold text-dark">{t.title}</td>
                                            <td className="py-3">
                                                <span className="badge" style={{ backgroundColor: 'rgba(4, 189, 32, 0.1)', color: '#039618', border: '1px solid rgba(4, 189, 32, 0.2)' }}>{t.course || t.category}</span>
                                            </td>
                                            <td className="py-3 fw-medium">{t.totalQuestions} Questions</td>
                                            <td className="py-3 fw-medium">{t.durationMinutes} min</td>
                                            <td className="px-4 py-3 text-end">
                                                <button className="btn btn-sm btn-outline-secondary me-2" onClick={() => handleEditClick(t)}>Edit</button>
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
                            <div className="modal-header border-bottom-0 pb-0 px-4 pt-4 d-flex justify-content-between align-items-center">
                                <h5 className="fw-black mb-0 text-dark">{editingId ? 'Edit Mock Test' : 'Create New Mock Test'}</h5>
                                <button type="button" className="btn btn-light rounded-circle d-flex align-items-center justify-content-center p-0" style={{ width: '36px', height: '36px' }} onClick={() => setShowCreateModal(false)}>
                                    <i className="fa-solid fa-xmark text-secondary"></i>
                                </button>
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
                                            <textarea className="form-control rounded-3" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} rows="3" required></textarea>
                                        </div>
                                        <div className="col-md-4">
                                            <label className="fw-bold mb-1 smaller text-muted">Course</label>
                                            <select className="form-select rounded-3" value={formData.course || 'B.Tech CS/IT'} onChange={e => setFormData({ ...formData, course: e.target.value })}>
                                                <option>All Courses</option>
                                                <option>B.Tech CS/IT</option>
                                                <option>BCA</option>
                                                <option>MCA</option>
                                                <option>B.Sc CS/IT</option>
                                                <option>B.Com</option>
                                                <option>BBA</option>
                                                <option>MBA</option>
                                                <option>Diploma Engg.</option>
                                                <option>UPSC CSE</option>
                                                <option>SSC CGL</option>
                                                <option>NEET</option>
                                                <option>JEE Mains</option>
                                                <option>For All</option>
                                                <option>Other / General</option>
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
                                        <div className="col-12 mt-4 d-flex justify-content-end gap-3">
                                            <button type="button" className="btn btn-outline-secondary fw-bold rounded-pill px-4" onClick={() => setShowCreateModal(false)} disabled={isGenerating}>Cancel</button>
                                            <button type="submit" className="btn btn-success fw-bold rounded-pill px-4 border-0" style={{ background: 'linear-gradient(135deg, #04bd20 0%, #039618 100%)' }} disabled={isGenerating}>
                                                {isGenerating ? <><span className="spinner-border spinner-border-sm me-2" />Processing...</> : (editingId ? 'Update Test' : 'Publish Test')}
                                            </button>
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
