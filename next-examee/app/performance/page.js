"use client";
import React, { useState, useEffect } from 'react';
import StudentLayout from '../../components/Home/StudentLayout';
import { toast } from 'react-toastify';

export default function PerformancePage() {
    const [stats, setStats] = useState({ totalTaken: 0, totalPassed: 0, avgPercentage: 0 });
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchPerformance();
    }, []);

    const fetchPerformance = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`/api/performance?token=${token}`);
            const data = await res.json();
            if (data.success) {
                setStats(data.stats);
                setHistory(data.history);
            }
        } catch (error) {
            toast.error("Failed to load performance data");
        }
        setLoading(false);
    };

    return (
        <StudentLayout title="My Performance">
            <div className="container-fluid py-5">
                {/* Header */}
                <div className="mb-5 d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-4 bg-white p-4 rounded-4 shadow-sm border" style={{ borderColor: '#f1f5f9' }}>
                    <div>
                        <h1 className="fw-black mb-1 letter-spacing-tight" style={{ color: '#0f172a' }}>Performance <span className="text-success">Dashboard</span></h1>
                        <p className="text-muted mb-0" style={{ fontSize: '0.9rem' }}>Track your exam readiness and analyze your mock test history.</p>
                    </div>
                    <div className="d-flex gap-3">
                        <div className="bg-light rounded-circle d-flex align-items-center justify-content-center text-success shadow-sm" style={{ width: 45, height: 45 }}>
                            <i className="fa-solid fa-chart-line fs-5"></i>
                        </div>
                    </div>
                </div>

                {loading ? (
                    <div className="text-center py-5"><div className="spinner-border text-success" /></div>
                ) : (
                    <>
                        <div className="row g-4 mb-5">
                            <div className="col-md-4">
                                <div className="card border-0 shadow-sm rounded-4 text-center p-4 position-relative overflow-hidden h-100" style={{ background: '#fff' }}>
                                    <div className="position-absolute top-0 end-0 p-3 opacity-10">
                                        <i className="fa-solid fa-list-check" style={{ fontSize: '4rem', color: '#04bd20' }}></i>
                                    </div>
                                    <div className="position-relative z-index-1 text-start">
                                        <h1 className="fw-black text-dark mb-1 display-5">{stats.totalTaken}</h1>
                                        <p className="text-muted fw-bold mb-0 text-uppercase letter-spacing-1" style={{ fontSize: '0.75rem' }}>Tests Attempted</p>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-4">
                                <div className="card shadow-lg rounded-4 text-center p-4 position-relative overflow-hidden h-100 border-0" style={{ background: 'linear-gradient(135deg, #04bd20 0%, #039618 100%)' }}>
                                    <div className="position-absolute top-0 end-0 p-3 opacity-20">
                                        <i className="fa-solid fa-percent" style={{ fontSize: '4rem', color: '#fff' }}></i>
                                    </div>
                                    <div className="position-relative z-index-1 text-start">
                                        <h1 className="fw-black text-white mb-1 display-5">{stats.avgPercentage}%</h1>
                                        <p className="text-white fw-bold mb-0 text-uppercase letter-spacing-1 opacity-75" style={{ fontSize: '0.75rem' }}>Average Score</p>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-4">
                                <div className="card border-0 shadow-sm rounded-4 text-center p-4 position-relative overflow-hidden h-100" style={{ background: '#fff' }}>
                                    <div className="position-absolute top-0 end-0 p-3 opacity-10">
                                        <i className="fa-solid fa-trophy" style={{ fontSize: '4rem', color: '#04bd20' }}></i>
                                    </div>
                                    <div className="position-relative z-index-1 text-start">
                                        <h1 className="fw-black text-dark mb-1 display-5">{stats.totalPassed}</h1>
                                        <p className="text-muted fw-bold mb-0 text-uppercase letter-spacing-1" style={{ fontSize: '0.75rem' }}>Tests Passed</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="d-flex align-items-center mb-4">
                            <h4 className="fw-bold mb-0 text-dark">Attempt History</h4>
                            <div className="ms-auto">
                                <span className="badge bg-light text-muted border px-3 py-2 rounded-pill fw-medium">Last 30 Days</span>
                            </div>
                        </div>

                        <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
                            <div className="card-body p-0">
                                <div className="table-responsive">
                                    <table className="table table-hover align-middle mb-0" style={{ minWidth: '800px' }}>
                                        <thead style={{ background: '#f8fafc' }}>
                                            <tr>
                                                <th className="px-4 py-3 fw-bold text-muted text-uppercase letter-spacing-1 border-bottom-0" style={{ fontSize: '0.7rem' }}>Test Details</th>
                                                <th className="py-3 fw-bold text-muted text-uppercase letter-spacing-1 border-bottom-0" style={{ fontSize: '0.7rem' }}>Date</th>
                                                <th className="py-3 fw-bold text-muted text-uppercase letter-spacing-1 border-bottom-0" style={{ fontSize: '0.7rem' }}>Score</th>
                                                <th className="px-4 py-3 fw-bold text-muted text-uppercase letter-spacing-1 border-bottom-0 text-end" style={{ fontSize: '0.7rem' }}>Status</th>
                                            </tr>
                                        </thead>
                                        <tbody className="border-top-0">
                                            {history.length === 0 && (
                                                <tr>
                                                    <td colSpan="4" className="text-center py-5">
                                                        <div className="d-inline-flex align-items-center justify-content-center bg-light rounded-circle mb-3" style={{ width: 60, height: 60 }}>
                                                            <i className="fa-solid fa-chart-simple fs-3 text-muted opacity-50"></i>
                                                        </div>
                                                        <h6 className="fw-bold text-dark mb-1">No Activity Found</h6>
                                                        <p className="text-muted smaller mb-0">Start taking mock tests to see your performance metrics here.</p>
                                                    </td>
                                                </tr>
                                            )}
                                            {history.map((h, idx) => (
                                                <tr key={idx} style={{ transition: 'background-color 0.2s' }}>
                                                    <td className="px-4 py-3">
                                                        <div>
                                                            <span className="fw-bold text-dark d-block mb-1">{h.mockTestId?.title || 'Unknown Test'}</span>
                                                            <span className="badge bg-light text-muted border" style={{ fontSize: '0.65rem' }}>{h.mockTestId?.category || 'N/A'}</span>
                                                        </div>
                                                    </td>
                                                    <td className="py-3 text-muted fw-medium" style={{ fontSize: '0.85rem' }}>
                                                        {new Date(h.attemptedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                                    </td>
                                                    <td className="py-3">
                                                        <div className="d-flex align-items-center gap-2">
                                                            <div className="fw-black text-dark">{h.percentage}%</div>
                                                            <span className="text-muted" style={{ fontSize: '0.75rem' }}>({h.score}/{h.totalScore})</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-3 text-end">
                                                        {h.isPassed ? (
                                                            <span className="badge rounded-pill d-inline-flex align-items-center gap-1" style={{ background: '#f0fdf4', color: '#166534', border: '1px solid #bbf7d0', padding: '6px 12px' }}>
                                                                <i className="fa-solid fa-circle-check" style={{ fontSize: '0.7rem' }}></i> Passed
                                                            </span>
                                                        ) : (
                                                            <span className="badge rounded-pill d-inline-flex align-items-center gap-1" style={{ background: '#fef2f2', color: '#991b1b', border: '1px solid #fecaca', padding: '6px 12px' }}>
                                                                <i className="fa-solid fa-circle-xmark" style={{ fontSize: '0.7rem' }}></i> Failed
                                                            </span>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </StudentLayout>
    );
}
