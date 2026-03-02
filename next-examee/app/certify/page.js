"use client";
import React, { useState, useEffect, useContext } from 'react';
import StudentLayout from '../../components/Home/StudentLayout';
import ContentContext from '../../context/ContentContext';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';

const CertifyPage = () => {
    const [tests, setTests] = useState([]);
    const [attempts, setAttempts] = useState([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

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
                setAttempts(data.attempts);
            }
        } catch (error) {
            console.error("Error fetching certify tests:", error);
            toast.error("Failed to load certification tracks");
        } finally {
            setLoading(false);
        }
    };

    const getTestStatus = (testId) => {
        const lastAttempt = attempts.filter(a => a.testId === testId).sort((a, b) => new Date(b.lastAttemptedAt) - new Date(a.lastAttemptedAt))[0];
        if (!lastAttempt) return { status: 'Not Attempted', color: 'secondary' };

        const oneWeek = 7 * 24 * 60 * 60 * 1000;
        const diff = Date.now() - new Date(lastAttempt.lastAttemptedAt).getTime();
        const canRetry = diff >= oneWeek;

        if (lastAttempt.passed) return { status: 'Certified', color: 'success' };
        if (!canRetry) {
            const daysLeft = Math.ceil((oneWeek - diff) / (24 * 60 * 60 * 1000));
            return { status: `Retake in ${daysLeft} days`, color: 'warning' };
        }
        return { status: 'Ready for Retake', color: 'danger' };
    };

    return (
        <StudentLayout title="Get Certified">
            <div className="container-fluid pb-5">
                <div className="mt-4 mb-5">
                    <h1 className="fw-black text-dark" style={{ fontSize: '2.5rem', letterSpacing: '-0.04em' }}>Professional <span className="text-success">Certifications</span></h1>
                    <div className="d-flex flex-wrap align-items-center gap-3 mt-2">
                        <p className="text-muted fw-medium mb-0" style={{ fontSize: '1rem' }}>
                            Validate your expertise with industry-recognized certifications.
                        </p>
                        <span className="badge bg-success-subtle text-success border border-success-subtle rounded-pill px-3 py-2 smaller fw-black text-uppercase">
                            75% Score Required to Pass
                        </span>
                    </div>
                </div>

                {loading ? (
                    <div className="d-flex justify-content-center py-5">
                        <div className="spinner-border text-success" role="status"></div>
                    </div>
                ) : (
                    <div className="row g-4">
                        {tests.map((test) => {
                            const { status, color } = getTestStatus(test._id);
                            const lastAttempt = attempts.filter(a => a.testId === test._id).sort((a, b) => new Date(b.lastAttemptedAt) - new Date(a.lastAttemptedAt))[0];
                            const lockout = status.includes('Retake in');

                            return (
                                <div key={test._id} className="col-lg-4 col-md-6">
                                    <div className="p-3 rounded-4 shadow-sm border bg-white h-100 transition-all position-relative overflow-hidden d-flex flex-column hover-lift">
                                        <div className="text-end mb-1">
                                            <span className={`badge bg-${color}-subtle text-${color} border border-${color}-subtle px-2 py-1 rounded-pill smaller fw-bold uppercase`} style={{ fontSize: '0.65rem' }}>
                                                {status}
                                            </span>
                                        </div>

                                        <div className="mb-3">
                                            <span className="text-success fw-black text-uppercase letter-spacing-1" style={{ fontSize: '0.65rem' }}>{test.category}</span>
                                            <h3 className="fw-black text-dark mt-1 mb-1 fs-6">{test.title}</h3>
                                            <p className="text-muted line-clamp-2 mb-0" style={{ fontSize: '0.75rem', lineHeight: '1.4' }}>{test.description}</p>
                                        </div>

                                        <div className="row g-2 mb-3 mt-auto">
                                            <div className="col-6">
                                                <div className="py-2 bg-light rounded-3 text-center border-0" style={{ backgroundColor: '#f8fafc' }}>
                                                    <p className="fw-bold mb-0 text-secondary" style={{ fontSize: '0.65rem' }}>Questions</p>
                                                    <p className="fw-black mb-0 small">{test.questions.length}</p>
                                                </div>
                                            </div>
                                            <div className="col-6">
                                                <div className="py-2 bg-light rounded-3 text-center border-0" style={{ backgroundColor: '#f8fafc' }}>
                                                    <p className="fw-bold mb-0 text-secondary" style={{ fontSize: '0.65rem' }}>Passing Score</p>
                                                    <p className="fw-black mb-0 text-success small">75%</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="d-flex align-items-center gap-2 mt-auto">
                                            {status === 'Certified' ? (
                                                <button className="btn btn-outline-success rounded-pill px-3 py-2 fw-bold flex-grow-1" style={{ fontSize: '0.75rem', borderWidth: '1.5px' }} onClick={() => router.push('/certificates')}>
                                                    View Reward <i className="fa-solid fa-award ms-1"></i>
                                                </button>
                                            ) : (
                                                <button
                                                    className={`btn ${lockout ? 'btn-light disabled border text-muted' : 'btn-dark'} rounded-pill px-3 py-2 fw-black flex-grow-1 shadow-sm`}
                                                    style={{ fontSize: '0.75rem' }}
                                                    onClick={() => !lockout && router.push(`/certify/${test._id}`)}
                                                >
                                                    {status.includes('Retake in') ? 'Locked' : 'Take Exam'}
                                                    {!lockout && <i className="fa-solid fa-chevron-right ms-1"></i>}
                                                </button>
                                            )}
                                        </div>

                                        {lastAttempt && !lastAttempt.passed && !status.includes('Retake in') && (
                                            <p className="text-danger smaller mt-2 mb-0 text-center fw-bold">
                                                Last: {lastAttempt.score}% (Try Again)
                                            </p>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </StudentLayout>
    );
};

export default CertifyPage;
