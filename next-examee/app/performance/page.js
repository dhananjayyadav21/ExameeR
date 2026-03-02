"use client";
import React, { useState, useEffect } from 'react';
import StudentLayout from '@/components/Home/StudentLayout';
import { toast } from 'react-toastify';
import '@/styles/student-layout.css';

const SkeletonCard = () => (
    <div className="premium-card h-100 border-0 animate-pulse" style={{ background: '#fff' }}>
        <div className="d-flex justify-content-between mb-4">
            <div className="bg-light rounded-3" style={{ width: '48px', height: '48px' }}></div>
            <div className="bg-light rounded-pill" style={{ width: '60px', height: '20px' }}></div>
        </div>
        <div className="bg-light rounded-3 mb-2" style={{ width: '40%', height: '32px' }}></div>
        <div className="bg-light rounded-3" style={{ width: '60%', height: '16px' }}></div>
    </div>
);

const SkeletonRow = () => (
    <tr className="animate-pulse">
        <td className="ps-4 py-4"><div className="bg-light rounded-3" style={{ width: '200px', height: '40px' }}></div></td>
        <td className="py-4"><div className="bg-light rounded-3" style={{ width: '100px', height: '20px' }}></div></td>
        <td className="py-4"><div className="bg-light rounded-3" style={{ width: '120px', height: '30px' }}></div></td>
        <td className="pe-4 py-4 text-end"><div className="bg-light rounded-pill ms-auto" style={{ width: '80px', height: '24px' }}></div></td>
    </tr>
);

export default function PerformancePage() {
    const [stats, setStats] = useState({ totalTaken: 0, totalPassed: 0, avgPercentage: 0 });
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");

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
        } finally {
            // Artificial delay for smooth skeleton transition
            setTimeout(() => setLoading(false), 600);
        }
    };

    const filteredHistory = history.filter(item =>
        item.mockTestId?.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.mockTestId?.category?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <StudentLayout title="My Performance">
            <div className="container-fluid py-4">
                {/* Modern Hero Header */}
                <div className="premium-card mb-5 border-0 animate-fade-in overflow-hidden position-relative" style={{
                    background: 'linear-gradient(225deg, #0f172a 0%, #1e293b 100%)',
                    color: '#fff',
                    padding: '3rem 2.5rem'
                }}>
                    <div className="position-absolute top-0 end-0 p-5 opacity-10 d-none d-lg-block">
                        <i className="fa-solid fa-chart-pie" style={{ fontSize: '12rem', transform: 'rotate(15deg)' }}></i>
                    </div>

                    <div className="position-relative z-1">
                        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-4">
                            <div className="max-w-600">
                                <div className="d-flex align-items-center gap-2 mb-3">
                                    <span className="badge rounded-pill px-3 py-2" style={{ background: 'rgba(4, 189, 32, 0.15)', color: 'var(--primary-green)', fontSize: '0.75rem', fontWeight: '800' }}>
                                        <i className="fa-solid fa-sparkles me-2"></i> LEVEL: PRO
                                    </span>
                                    <span className="text-white-50 smaller fw-bold">• UPDATED JUST NOW</span>
                                </div>
                                <h1 className="fw-black mb-2 display-4 text-white letter-spacing-tight">Performance <span style={{ color: 'var(--primary-green)' }}>Insights</span></h1>
                                <p className="text-white-50 mb-0 fs-5" style={{ maxWidth: '500px' }}>Visualize your growth, track your exam readiness, and conquer your goals with precision.</p>
                            </div>
                            <div className="d-flex gap-3">
                                <button onClick={fetchPerformance} className="btn btn-white rounded-pill px-4 py-2 fw-bold shadow-sm hover-scale">
                                    <i className="fa-solid fa-rotate me-2"></i> Recalculate Stats
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="row g-4 mb-5">
                    {loading ? (
                        [1, 2, 3].map(i => <div key={i} className="col-lg-4"><SkeletonCard /></div>)
                    ) : (
                        <>
                            <div className="col-lg-4">
                                <div className="premium-card h-100 border-0 d-flex flex-column justify-content-between transition-all hover-up"
                                    style={{ borderLeft: '4px solid #3b82f6 !important' }}>
                                    <div className="d-flex justify-content-between align-items-start mb-4">
                                        <div style={{ background: '#eff6ff', color: '#3b82f6', width: '56px', height: '56px', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <i className="fa-solid fa-layer-group fs-4"></i>
                                        </div>
                                        <div className="text-end">
                                            <span className="d-block text-muted smaller fw-bold ls-wide">VOLUME</span>
                                            <span className="text-primary smaller fw-bold">Total Attempts</span>
                                        </div>
                                    </div>
                                    <div>
                                        <h2 className="fw-black text-dark mb-1 display-5">{stats.totalTaken}</h2>
                                        <div className="progress mt-3" style={{ height: '6px', borderRadius: '10px', background: '#f1f5f9' }}>
                                            <div className="progress-bar" style={{ width: '100%', background: '#3b82f6' }}></div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="col-lg-4">
                                <div className="premium-card h-100 border-0 text-white transition-all hover-up"
                                    style={{ background: 'var(--primary-green)', boxShadow: '0 20px 40px rgba(4, 189, 32, 0.2)' }}>
                                    <div className="d-flex justify-content-between align-items-start mb-4">
                                        <div style={{ background: 'rgba(255, 255, 255, 0.2)', color: '#fff', width: '56px', height: '56px', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <i className="fa-solid fa-bullseye fs-4"></i>
                                        </div>
                                        <div className="text-end">
                                            <span className="d-block text-white-50 smaller fw-bold ls-wide">PRECISION</span>
                                            <span className="text-white smaller fw-bold">Current Accuracy</span>
                                        </div>
                                    </div>
                                    <div>
                                        <h2 className="fw-black text-white mb-1 display-5">{stats.avgPercentage}%</h2>
                                        <div className="progress mt-3" style={{ height: '6px', borderRadius: '10px', background: 'rgba(255,255,255,0.2)' }}>
                                            <div className="progress-bar bg-white" style={{ width: `${stats.avgPercentage}%` }}></div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="col-lg-4">
                                <div className="premium-card h-100 border-0 d-flex flex-column justify-content-between transition-all hover-up"
                                    style={{ borderLeft: '4px solid #8b5cf6 !important' }}>
                                    <div className="d-flex justify-content-between align-items-start mb-4">
                                        <div style={{ background: '#f5f3ff', color: '#8b5cf6', width: '56px', height: '56px', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <i className="fa-solid fa-trophy fs-4"></i>
                                        </div>
                                        <div className="text-end">
                                            <span className="d-block text-muted smaller fw-bold ls-wide">OUTCOME</span>
                                            <span className="text-primary smaller fw-bold" style={{ color: '#8b5cf6' }}>Pass Rate</span>
                                        </div>
                                    </div>
                                    <div>
                                        <h2 className="fw-black text-dark mb-1 display-5">{stats.totalPassed}</h2>
                                        <div className="progress mt-3" style={{ height: '6px', borderRadius: '10px', background: '#f1f5f9' }}>
                                            <div className="progress-bar" style={{ width: `${(stats.totalPassed / (stats.totalTaken || 1)) * 100}%`, background: '#8b5cf6' }}></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </div>

                {/* Detailed Breakdown Header */}
                <div className="row align-items-center mb-4 g-3">
                    <div className="col-md-4">
                        <h4 className="fw-black text-dark mb-0">Detailed Breakdown</h4>
                    </div>
                    <div className="col-md-5">
                        <div className="li-search-box w-100" style={{ maxWidth: '100%', background: '#fff', border: '1px solid var(--border-subtle)', height: '48px' }}>
                            <i className="fa-solid fa-magnifying-glass text-muted me-2"></i>
                            <input
                                type="text"
                                className="li-search-input"
                                placeholder="Search by test title or category..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="col-md-3 text-md-end">
                        <select className="btn btn-white rounded-pill px-3 py-2 fw-semibold smaller">
                            <option>All Attempts</option>
                            <option>Passed Only</option>
                            <option>Failed Only</option>
                        </select>
                    </div>
                </div>

                {/* History Table */}
                <div className="premium-card border-0 p-0 overflow-hidden shadow-sm" style={{ background: '#fff' }}>
                    <div className="table-responsive">
                        <table className="table table-hover align-middle mb-0">
                            <thead style={{ background: '#f8fafc' }}>
                                <tr>
                                    <th className="ps-4 py-4 fw-bold text-muted text-uppercase smaller ls-wide border-0">Mock Test Details</th>
                                    <th className="py-4 fw-bold text-muted text-uppercase smaller ls-wide border-0">Timestamp</th>
                                    <th className="py-4 fw-bold text-muted text-uppercase smaller ls-wide border-0">Score Performance</th>
                                    <th className="pe-4 py-4 fw-bold text-muted text-uppercase smaller ls-wide border-0 text-end">Status</th>
                                </tr>
                            </thead>
                            <tbody style={{ borderTop: 'none' }}>
                                {loading ? (
                                    [1, 2, 3, 4, 5].map(i => <SkeletonRow key={i} />)
                                ) : filteredHistory.length === 0 ? (
                                    <tr>
                                        <td colSpan="4" className="text-center py-5">
                                            <div className="py-5">
                                                <div className="mb-4 d-inline-block p-4 rounded-circle" style={{ background: '#f8fafc' }}>
                                                    <i className="fa-solid fa-ghost fs-1 text-muted opacity-30"></i>
                                                </div>
                                                <h5 className="fw-bold text-dark mb-1">No matches found</h5>
                                                <p className="text-muted mb-0">Try adjusting your search or take a new mock test.</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    filteredHistory.map((item, idx) => (
                                        <tr key={idx} className="transition-all">
                                            <td className="ps-4 py-4">
                                                <div className="d-flex align-items-center gap-3">
                                                    <div className="rounded-4 d-flex align-items-center justify-content-center flex-shrink-0"
                                                        style={{ width: '48px', height: '48px', background: 'rgba(4, 189, 32, 0.08)', color: 'var(--primary-green)' }}>
                                                        <i className="fa-solid fa-rectangle-list fs-5"></i>
                                                    </div>
                                                    <div>
                                                        <span className="fw-bold text-dark d-block mb-1" style={{ fontSize: '1rem' }}>{item.mockTestId?.title || 'Practice Quiz'}</span>
                                                        <span className="badge rounded-pill fw-bold" style={{ background: '#f1f5f9', color: '#64748b', fontSize: '0.65rem', textTransform: 'uppercase' }}>{item.mockTestId?.category || 'Practice'}</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-4">
                                                <span className="text-dark fw-bold d-block mb-1" style={{ fontSize: '0.9rem' }}>
                                                    {new Date(item.attemptedAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                                                </span>
                                                <span className="text-muted smaller fw-medium">{new Date(item.attemptedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                            </td>
                                            <td className="py-4">
                                                <div className="d-flex align-items-center gap-3 mb-2">
                                                    <span className="fw-black text-dark" style={{ fontSize: '1.2rem' }}>{item.percentage}%</span>
                                                    <span className="badge bg-light text-muted fw-bold">PRO</span>
                                                </div>
                                                <div className="progress" style={{ height: '6px', width: '120px', borderRadius: '10px', background: '#f1f5f9' }}>
                                                    <div className="progress-bar rounded-pill transition-all"
                                                        style={{ width: `${item.percentage}%`, background: item.percentage >= 80 ? 'var(--primary-green)' : item.percentage >= 40 ? '#f59e0b' : '#ef4444' }}></div>
                                                </div>
                                            </td>
                                            <td className="pe-4 py-4 text-end">
                                                {item.isPassed ? (
                                                    <span className="badge rounded-pill px-4 py-2" style={{ background: '#f0fdf4', color: '#166534', fontWeight: '700', border: '1px solid rgba(22, 101, 52, 0.1)' }}>
                                                        PASSED
                                                    </span>
                                                ) : (
                                                    <span className="badge rounded-pill px-4 py-2" style={{ background: '#fff1f2', color: '#991b1b', fontWeight: '700', border: '1px solid rgba(153, 27, 27, 0.1)' }}>
                                                        FAILED
                                                    </span>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <style jsx>{`
                .hover-up { transition: all 0.3s ease; }
                .hover-up:hover { transform: translateY(-8px); box-shadow: 0 20px 40px rgba(0,0,0,0.1); }
                .max-w-600 { max-width: 600px; }
                .ls-wide { letter-spacing: 0.05em; }
                .animate-pulse { animation: pulse 2s infinite ease-in-out; }
                @keyframes pulse { 0% { opacity: 1; } 50% { opacity: 0.5; } 100% { opacity: 1; } }
            `}</style>
        </StudentLayout>
    );
}


