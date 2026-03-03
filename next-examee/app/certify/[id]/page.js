"use client";
import React, { useState, useEffect } from 'react';
import StudentLayout from '@/components/Home/StudentLayout';
import { toast } from 'react-toastify';
import { useRouter, useParams } from 'next/navigation';
import '@/styles/student-layout.css';

const SkeletonForm = () => (
    <div className="premium-card border-0 bg-white p-4 p-md-5 animate-pulse">
        {[1, 2, 3].map(i => (
            <div key={i} className="mb-5">
                <div className="bg-light rounded-3 mb-3" style={{ width: '40%', height: '24px' }}></div>
                <div className="row g-2">
                    {[1, 2, 3, 4].map(j => (
                        <div key={j} className="col-md-6">
                            <div className="bg-light rounded-3" style={{ height: '50px' }}></div>
                        </div>
                    ))}
                </div>
            </div>
        ))}
    </div>
);

const CertifyExamPage = () => {
    const { id } = useParams();
    const router = useRouter();
    const [test, setTest] = useState(null);
    const [answers, setAnswers] = useState({});
    const [submitting, setSubmitting] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchTest();
    }, [id]);

    const fetchTest = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const res = await fetch('/api/certify', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            if (data.success) {
                const found = data.tests.find(t => t._id === id);
                if (found) {
                    setTest(found);
                } else {
                    toast.error("Certification track not found");
                    router.push('/certify');
                }
            }
        } catch (error) {
            toast.error("Failed to load certification assessment");
        } finally {
            setTimeout(() => setLoading(false), 500);
        }
    };

    const handleOptionSelect = (qIdx, oIdx) => {
        setAnswers({ ...answers, [qIdx]: oIdx });
    };

    const handleSubmit = async () => {
        const totalQs = test.questions.length;
        const answeredCount = Object.keys(answers).length;

        if (answeredCount < totalQs) {
            toast.warning(`Please complete all questions (${answeredCount}/${totalQs}).`);
            return;
        }

        if (!confirm("Confirm submission for certification?")) return;

        setSubmitting(true);
        try {
            const token = localStorage.getItem('token');
            const res = await fetch('/api/certify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ testId: id, answers, token })
            });
            const data = await res.json();
            if (data.success) {
                if (data.passed) {
                    toast.success(`🎉 Passed! Score: ${data.score}%`);
                    router.push('/certificates');
                } else {
                    toast.error(data.message || `Failed. Score: ${data.score}%`);
                    router.push('/certify');
                }
            }
        } catch (error) {
            toast.error("Submission failed.");
        } finally {
            setSubmitting(false);
        }
    };

    const answeredCount = Object.keys(answers).length;
    const progressPercent = test ? (answeredCount / test.questions.length) * 100 : 0;

    if (loading) return (
        <StudentLayout title="Loading Assessment...">
            <div className="container py-4">
                <SkeletonForm />
            </div>
        </StudentLayout>
    );

    if (!test) return null;

    return (
        <StudentLayout title={test.title}>
            <div className="container-fluid py-4 bg-light-subtle min-vh-100">
                {/* Compact Header */}
                <div className="premium-card mb-4 border-0 animate-fade-in overflow-hidden position-relative"
                    style={{
                        background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
                        color: '#fff',
                        padding: '2.5rem 2rem',
                        borderRadius: '20px'
                    }}>
                    <div className="position-relative z-1 d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
                        <div>
                            <span className="badge rounded-pill mb-2 px-3 py-2 fw-bold" style={{ background: 'rgba(255,255,255,0.1)', color: 'var(--primary-green)', fontSize: '0.65rem', letterSpacing: '0.5px' }}>
                                <i className="fa-solid fa-award me-1"></i> CERTIFICATION TRACK
                            </span>
                            <h2 className="fw-bold mb-1 text-white ls-tight">{test.title}</h2>
                            <p className="text-white-50 mb-0 small" style={{ maxWidth: '500px' }}>Validate your proficiency. Requires 75% score to pass.</p>
                        </div>
                        <div className="text-md-end">
                            <span className="d-block text-white-50 smaller fw-medium mb-1">CURRENT PROGRESS</span>
                            <div className="d-flex align-items-center gap-3">
                                <div className="progress flex-grow-1 d-none d-md-flex" style={{ height: '6px', width: '120px', borderRadius: '10px', background: 'rgba(255,255,255,0.1)' }}>
                                    <div className="progress-bar bg-success" style={{ width: `${progressPercent}%` }}></div>
                                </div>
                                <span className="fw-bold fs-5 text-success">{answeredCount}/{test.questions.length}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="row justify-content-center">
                    <div className="col-xl-9 col-lg-11">
                        {/* Consolidated Form Container */}
                        <div className="premium-card border-0 bg-white shadow-sm p-4 p-md-5" style={{ borderRadius: '20px' }}>
                            {test.questions.map((q, qIdx) => (
                                <div key={qIdx} className={`mb-5 ${qIdx !== test.questions.length - 1 ? 'pb-5 border-bottom' : ''}`} style={{ borderColor: '#f1f5f9' }}>
                                    <div className="d-flex align-items-start gap-3 mb-4">
                                        <div className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0"
                                            style={{ width: '32px', height: '32px', background: '#f8fafc', border: '1px solid #e2e8f0', color: '#64748b' }}>
                                            <span className="fw-bold smaller">{qIdx + 1}</span>
                                        </div>
                                        <h5 className="fw-semibold text-dark mb-0 pt-1" style={{ fontSize: '1.05rem', lineHeight: '1.5' }}>
                                            {q.questionText}
                                        </h5>
                                    </div>

                                    <div className="row g-3">
                                        {q.options.map((option, oIdx) => (
                                            <div key={oIdx} className="col-md-6">
                                                <button
                                                    className={`btn w-100 h-100 p-3 rounded-3 text-start fw-medium transition-all border d-flex align-items-center gap-3 ${answers[qIdx] === oIdx
                                                            ? 'border-success bg-success bg-opacity-5 text-dark'
                                                            : 'border-light-subtle bg-light bg-opacity-10 text-dark hover-light'
                                                        }`}
                                                    onClick={() => handleOptionSelect(qIdx, oIdx)}
                                                >
                                                    <div className={`rounded-circle d-flex align-items-center justify-content-center border flex-shrink-0 transition-all ${answers[qIdx] === oIdx ? 'bg-success text-white border-success' : 'bg-white border-secondary-subtle'
                                                        }`} style={{ width: '28px', height: '28px', fontSize: '0.85rem' }}>
                                                        {String.fromCharCode(65 + oIdx)}
                                                    </div>
                                                    <span style={{ fontSize: '0.9rem', opacity: 0.85 }}>{option}</span>
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}

                            {/* Centered Submit Action */}
                            <div className="text-center pt-4 mt-2">
                                <div className="mb-4 text-muted small fw-medium">
                                    {answeredCount < test.questions.length
                                        ? `Pending: ${test.questions.length - answeredCount} more questions to answer`
                                        : "All questions completed. Double-check before submitting."}
                                </div>
                                <button
                                    className="btn btn-dark rounded-pill px-5 py-3 fw-bold transition-all hover-scale d-inline-flex align-items-center gap-2"
                                    onClick={handleSubmit}
                                    style={{ fontSize: '1rem' }}
                                    disabled={submitting || answeredCount < test.questions.length}
                                >
                                    {submitting ? (
                                        <><span className="spinner-border spinner-border-sm"></span> Submitting...</>
                                    ) : (
                                        <><i className="fa-solid fa-cloud-arrow-up me-1"></i> Send Assessment</>
                                    )}
                                </button>
                                <p className="smaller text-muted mt-3 opacity-60">Verified attempt • Permanent Score</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style jsx>{`
                .hover-light:hover { background: #f8fafc !important; border-color: #cbd5e1 !important; }
                .transition-all { transition: all 0.2s ease-in-out; }
                .hover-scale:hover:not(:disabled) { transform: scale(1.03); filter: brightness(1.1); }
                .ls-tight { letter-spacing: -0.01em; }
            `}</style>
        </StudentLayout>
    );
};

export default CertifyExamPage;
