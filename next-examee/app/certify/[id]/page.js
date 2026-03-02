"use client";
import React, { useState, useEffect, useContext } from 'react';
import StudentLayout from '../../../components/Home/StudentLayout';
import ContentContext from '../../../context/ContentContext';
import { toast } from 'react-toastify';
import { useRouter, useParams } from 'next/navigation';

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
                    toast.error("Test not found");
                    router.push('/certify');
                }
            }
        } catch (error) {
            console.error("Error fetching certify test:", error);
            toast.error("Failed to load certification tracks");
        } finally {
            setLoading(false);
        }
    };

    const handleOptionSelect = (qIdx, oIdx) => {
        setAnswers({ ...answers, [qIdx]: oIdx });
    };

    const handleSubmit = async () => {
        if (Object.keys(answers).length < test.questions.length) {
            toast.warning("Please answer all questions before submitting.");
            return;
        }

        if (!confirm("Are you sure you want to submit? This counts as an attempt.")) return;

        setSubmitting(true);
        try {
            const token = localStorage.getItem('token');
            const res = await fetch('/api/certify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    testId: id,
                    answers,
                    token
                })
            });
            const data = await res.json();
            if (data.success) {
                if (data.passed) {
                    toast.success("Congratulations! You passed with " + data.score + "%");
                    router.push('/certificates');
                } else {
                    toast.error(data.message);
                    router.push('/certify');
                }
            } else {
                toast.error(data.message || "Failed to submit test");
            }
        } catch (error) {
            console.error("Error submitting certify test:", error);
            toast.error("Failed to reach server");
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return (
        <StudentLayout title="Loading Exam...">
            <div className="d-flex justify-content-center py-5">
                <div className="spinner-border text-success" role="status"></div>
            </div>
        </StudentLayout>
    );

    if (!test) return null;

    return (
        <StudentLayout title={test.title}>
            <div className="container-fluid pb-5">
                <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-5 mt-4">
                    <div>
                        <span className="text-success small fw-black text-uppercase letter-spacing-1">{test.category}</span>
                        <h1 className="fw-black text-dark mb-0 fs-2 fs-md-1">{test.title}</h1>
                    </div>
                    <div className="bg-dark text-white p-2 p-md-3 rounded-pill px-4 d-flex align-items-center gap-2 shadow-sm" style={{ width: 'fit-content' }}>
                        <i className="fa-solid fa-circle-info fs-6 opacity-75 text-success"></i>
                        <span className="smaller fw-bold">75% Score Required to Certify</span>
                    </div>
                </div>

                <div className="row justify-content-center">
                    <div className="col-lg-10 col-xl-8">
                        {test.questions.map((q, qIdx) => (
                            <div key={qIdx} className="p-4 rounded-4 shadow-sm border bg-white mb-4">
                                <h4 className="fw-bold mb-4 d-flex gap-2">
                                    <span className="text-success fw-black">Q{qIdx + 1}.</span>
                                    <span>{q.questionText}</span>
                                </h4>
                                <div className="row g-3">
                                    {q.options.map((option, oIdx) => (
                                        <div key={oIdx} className="col-12 col-md-6">
                                            <button
                                                className={`btn w-100 py-3 px-4 rounded-4 text-start fw-bold transition-all border d-flex align-items-center gap-3 ${answers[qIdx] === oIdx
                                                    ? 'bg-success-subtle border-success text-dark'
                                                    : 'bg-white text-dark hover-translate-x'
                                                    }`}
                                                onClick={() => handleOptionSelect(qIdx, oIdx)}
                                                style={{ border: '2px solid' + (answers[qIdx] === oIdx ? '#04bd20' : '#f1f5f9') }}
                                            >
                                                <div className={`rounded-circle d-flex align-items-center justify-content-center border flex-shrink-0 ${answers[qIdx] === oIdx ? 'bg-success text-white border-success' : 'bg-light border-secondary-subtle'
                                                    }`} style={{ width: '32px', height: '32px', fontSize: '0.9rem' }}>
                                                    {String.fromCharCode(65 + oIdx)}
                                                </div>
                                                <span className="fs-6">{option}</span>
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}

                        <div className="text-center pt-4">
                            <button
                                className="btn btn-dark rounded-pill px-5 py-3 fw-black shadow-lg"
                                style={{ fontSize: '1.2rem' }}
                                onClick={handleSubmit}
                                disabled={submitting}
                            >
                                {submitting ? <span className="spinner-border spinner-border-sm me-2"></span> : <i className="fa-solid fa-check-circle me-3"></i>}
                                Submit My Assessment
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <style jsx>{`
                .hover-border-success:hover { border-color: #04bd20 !important; transform: translateX(5px); }
            `}</style>
        </StudentLayout>
    );
};

export default CertifyExamPage;
