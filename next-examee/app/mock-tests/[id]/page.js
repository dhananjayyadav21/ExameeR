"use client";
import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { toast } from 'react-toastify';

export default function TakeTestPage() {
    const params = useParams();
    const router = useRouter();
    const { id } = params;

    const [test, setTest] = useState(null);
    const [loading, setLoading] = useState(true);
    const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
    const [answers, setAnswers] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        fetchTestDetails();
    }, [id]);

    const fetchTestDetails = async () => {
        try {
            // Note: Our previous GET /api/mock-test endpoint stripped 'questions' from the response
            // so we need an endpoint to fetch the specific test WITH questions. 
            // We can fetch from a new endpoint or pass a parameter. 
            // Let's assume we can fetch it via /api/mock-test/session
            const token = localStorage.getItem('token');
            const res = await fetch(`/api/mock-test/session?id=${id}&token=${token}`);
            const data = await res.json();

            if (data.success) {
                setTest(data.test);
            } else {
                toast.error(data.message || 'Test not found');
                router.push('/mock-tests');
            }
        } catch (error) {
            toast.error('Failed to load test');
            router.push('/mock-tests');
        } finally {
            setLoading(false);
        }
    };

    const handleSelectOption = (qIdx, optIdx) => {
        setAnswers({ ...answers, [qIdx]: optIdx });
    };

    const submitTest = async () => {
        setIsSubmitting(true);
        try {
            // Calculate score purely client-side for simplicity
            let score = 0;
            test.questions.forEach((q, idx) => {
                if (answers[idx] === q.correctAnswerIndex) {
                    score += (q.marks || 1);
                }
            });

            const token = localStorage.getItem('token');
            const res = await fetch('/api/mock-test/submit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    token,
                    mockTestId: test._id,
                    score: score,
                    durationTaken: 0
                })
            });
            const data = await res.json();

            if (data.success) {
                toast.success(`Test Completed! You scored ${score}/${test.totalQuestions}`);
                router.push('/performance');
            } else {
                toast.error(data.message || 'Failed to submit test');
            }
        } catch (err) {
            toast.error('Network Error');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) return <div className="text-center p-5"><span className="spinner-border text-success"></span></div>;
    if (!test) return null;

    const currentQ = test.questions[currentQuestionIdx];

    return (
        <div className="container-fluid py-5 bg-light min-vh-100">
            <div className="container" style={{ maxWidth: '800px' }}>
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h3 className="fw-black text-dark mb-0">{test.title}</h3>
                    <div className="badge bg-success px-3 py-2 rounded-pill fs-6"><i className="fa-regular fa-clock me-2"></i>{test.durationMinutes} mins</div>
                </div>

                <div className="card border-0 shadow-lg rounded-4 overflow-hidden">
                    <div className="progress rounded-0" style={{ height: '6px' }}>
                        <div className="progress-bar bg-success" style={{ width: `${((currentQuestionIdx + 1) / test.questions.length) * 100}%` }}></div>
                    </div>

                    <div className="card-body p-4 p-md-5">
                        <div className="d-flex justify-content-between align-items-center mb-4">
                            <span className="text-muted fw-bold text-uppercase smaller letter-spacing-1">Question {currentQuestionIdx + 1} of {test.questions.length}</span>
                        </div>

                        <h4 className="fw-bold mb-4" style={{ lineHeight: '1.5' }}>{currentQ?.questionText}</h4>

                        <div className="d-flex flex-column gap-3">
                            {currentQ?.options?.map((opt, oIdx) => (
                                <button
                                    key={oIdx}
                                    onClick={() => handleSelectOption(currentQuestionIdx, oIdx)}
                                    className={`btn text-start p-3 rounded-3 border fw-medium ${answers[currentQuestionIdx] === oIdx ? 'btn-success text-white border-success' : 'btn-light text-dark border-light-subtle'}`}
                                    style={{ transition: 'all 0.2s', fontSize: '1.05rem' }}>
                                    <span className={`fw-bold me-3 ${answers[currentQuestionIdx] === oIdx ? 'text-white' : 'text-muted'}`}>{String.fromCharCode(65 + oIdx)}.</span> {opt}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="card-footer bg-white border-top-0 p-4 p-md-5 d-flex justify-content-between">
                        <button
                            className="btn btn-outline-secondary fw-bold rounded-pill px-4"
                            onClick={() => setCurrentQuestionIdx(prev => Math.max(0, prev - 1))}
                            disabled={currentQuestionIdx === 0}>
                            Previous
                        </button>

                        {currentQuestionIdx === test.questions.length - 1 ? (
                            <button
                                className="btn btn-success fw-bold rounded-pill px-5"
                                onClick={submitTest}
                                disabled={isSubmitting || Object.keys(answers).length !== test.questions.length}>
                                {isSubmitting ? 'Submitting...' : 'Submit Final Details'}
                            </button>
                        ) : (
                            <button
                                className="btn btn-dark fw-bold rounded-pill px-5"
                                onClick={() => setCurrentQuestionIdx(prev => Math.min(test.questions.length - 1, prev + 1))}>
                                Next Question
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
