"use client";
import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import '@/styles/student-layout.css';
import '@/styles/mock-test.css';

export default function TakeTestPage() {
    const params = useParams();
    const router = useRouter();
    const { id } = params;

    const [test, setTest] = useState(null);
    const [loading, setLoading] = useState(true);
    const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
    const [answers, setAnswers] = useState({});
    const [markedForReview, setMarkedForReview] = useState(new Set());
    const [visited, setVisited] = useState(new Set([0]));
    const [timeLeft, setTimeLeft] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        fetchTestDetails();
    }, [id]);

    useEffect(() => {
        if (test && timeLeft === null) {
            setTimeLeft(test.durationMinutes * 60);
        }
    }, [test]);

    useEffect(() => {
        if (timeLeft === null || timeLeft <= 0 || isSubmitting) return;

        const timer = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    clearInterval(timer);
                    autoSubmit();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [timeLeft, isSubmitting]);

    const fetchTestDetails = async () => {
        try {
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

    const autoSubmit = () => {
        toast.info("Time is up! Submitting your test automatically.");
        submitTest();
    };

    const handleSelectOption = (optIdx) => {
        setAnswers({ ...answers, [currentQuestionIdx]: optIdx });
    };

    const toggleMarkForReview = () => {
        const newMarked = new Set(markedForReview);
        if (newMarked.has(currentQuestionIdx)) {
            newMarked.delete(currentQuestionIdx);
        } else {
            newMarked.add(currentQuestionIdx);
        }
        setMarkedForReview(newMarked);
    };

    const navigateToQuestion = (idx) => {
        setCurrentQuestionIdx(idx);
        setVisited(new Set([...visited, idx]));
    };

    const formatTime = (seconds) => {
        if (seconds === null) return "00:00";
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = seconds % 60;
        return `${h > 0 ? h + ':' : ''}${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    const submitTest = async (isAuto = false) => {
        if (isSubmitting) return;

        if (!isAuto) {
            const confirm = window.confirm("Are you sure you want to submit the test?");
            if (!confirm) return;
        }

        setIsSubmitting(true);
        try {
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
                    durationTaken: test.durationMinutes * 60 - (timeLeft || 0)
                })
            });
            const data = await res.json();

            if (data.success) {
                toast.success(`Test Completed! Score: ${score}/${test.totalQuestions || test.questions.length}`);
                router.push('/performance');
            } else {
                toast.error(data.message || 'Failed to submit test');
                setIsSubmitting(false); // Only reset if failed so user can try again
            }
        } catch (err) {
            toast.error('Network Error during submission');
            setIsSubmitting(false);
        }
    };

    if (loading) return (
        <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
            <div className="text-center">
                <div className="spinner-border text-success mb-3" role="status" style={{ width: '3rem', height: '3rem' }}></div>
                <h5 className="text-muted fw-medium">Loading your test...</h5>
            </div>
        </div>
    );

    if (!test) return null;

    const currentQ = test.questions[currentQuestionIdx];
    const isAnswered = answers[currentQuestionIdx] !== undefined;
    const isMarked = markedForReview.has(currentQuestionIdx);

    return (
        <div className="test-session-container">
            <header className="test-header">
                <div className="d-flex align-items-center gap-3">
                    <button onClick={() => router.back()} className="btn btn-white btn-sm rounded-circle" style={{ width: '36px', height: '36px', padding: 0 }}>
                        <i className="fa-solid fa-chevron-left"></i>
                    </button>
                    <img src="/assets/img/brandlog.png" alt="Examee" style={{ height: "24px", width: "auto" }} />
                    <div className="vr mx-2 opacity-10" style={{ height: '20px' }}></div>
                    <h1 className="test-title">{test.title}</h1>
                </div>

                <div className="d-flex align-items-center gap-4">
                    <div className={`timer-box ${timeLeft < 300 ? 'warning' : ''}`}>
                        <i className="fa-regular fa-clock"></i>
                        <span>{formatTime(timeLeft)}</span>
                    </div>
                    <button className="btn-finish" onClick={submitTest} disabled={isSubmitting}>
                        {isSubmitting ? 'Submitting...' : 'Finish Test'}
                    </button>
                </div>
            </header>

            <main className="test-main-layout">
                <section className="question-area">
                    <div className="question-card animate-fade-in">
                        <div className="progress rounded-0" style={{ height: '4px', background: '#f1f5f9' }}>
                            <div
                                className="progress-bar bg-success transition-all"
                                style={{ width: `${((currentQuestionIdx + 1) / test.questions.length) * 100}%` }}
                            ></div>
                        </div>

                        <div className="question-card-header">
                            <span className="question-number">Question {currentQuestionIdx + 1} of {test.questions.length}</span>
                            <div className="d-flex gap-2">
                                {isMarked && <span className="badge bg-primary rounded-pill px-3">Marked for Review</span>}
                                {isAnswered && <span className="badge bg-success rounded-pill px-3">Answered</span>}
                            </div>
                        </div>

                        <div className="question-card-body">
                            <h2 className="question-text">{currentQ?.questionText}</h2>

                            <div className="options-grid">
                                {currentQ?.options?.map((opt, oIdx) => (
                                    <button
                                        key={oIdx}
                                        onClick={() => handleSelectOption(oIdx)}
                                        className={`option-item ${answers[currentQuestionIdx] === oIdx ? 'selected' : ''}`}
                                    >
                                        <div className="option-prefix">{String.fromCharCode(65 + oIdx)}</div>
                                        <div className="option-content">{opt}</div>
                                        {answers[currentQuestionIdx] === oIdx && (
                                            <i className="fa-solid fa-circle-check text-success ms-auto fs-5"></i>
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="question-card-footer">
                            <button
                                className="btn btn-white fw-bold rounded-pill px-4"
                                onClick={() => navigateToQuestion(Math.max(0, currentQuestionIdx - 1))}
                                disabled={currentQuestionIdx === 0}
                            >
                                <i className="fa-solid fa-arrow-left me-2"></i> Previous
                            </button>

                            <div className="d-flex gap-2">
                                <button
                                    className={`btn ${isMarked ? 'btn-primary' : 'btn-outline-primary'} fw-bold rounded-pill px-4`}
                                    onClick={toggleMarkForReview}
                                >
                                    {isMarked ? 'Unmark Review' : 'Mark for Review'}
                                </button>

                                {currentQuestionIdx === test.questions.length - 1 ? (
                                    <button
                                        className="btn btn-success fw-bold rounded-pill px-5"
                                        onClick={submitTest}
                                        disabled={isSubmitting}
                                    >
                                        Submit Test
                                    </button>
                                ) : (
                                    <button
                                        className="btn btn-dark fw-bold rounded-pill px-4"
                                        onClick={() => navigateToQuestion(Math.min(test.questions.length - 1, currentQuestionIdx + 1))}
                                    >
                                        Next <i className="fa-solid fa-arrow-right ms-2"></i>
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </section>

                <aside className="test-sidebar">
                    <div className="palette-card">
                        <div className="palette-title">Question Palette</div>
                        <div className="question-grid">
                            {test.questions.map((_, idx) => {
                                let statusClass = "";
                                if (markedForReview.has(idx)) statusClass = "marked";
                                else if (answers[idx] !== undefined) statusClass = "answered";
                                else if (visited.has(idx)) statusClass = "skipped";
                                else statusClass = "not-visited";

                                if (idx === currentQuestionIdx) statusClass += " active";

                                return (
                                    <div
                                        key={idx}
                                        className={`grid-item ${statusClass}`}
                                        onClick={() => navigateToQuestion(idx)}
                                    >
                                        {idx + 1}
                                    </div>
                                );
                            })}
                        </div>

                        <div className="palette-legend">
                            <div className="legend-item">
                                <div className="legend-color legend-answered"></div>
                                <span>Answered</span>
                            </div>
                            <div className="legend-item">
                                <div className="legend-color legend-marked"></div>
                                <span>Marked for Review</span>
                            </div>
                            <div className="legend-item">
                                <div className="legend-color legend-skipped"></div>
                                <span>Skipped / Not Answered</span>
                            </div>
                            <div className="legend-item">
                                <div className="legend-color legend-not-visited"></div>
                                <span>Not Visited</span>
                            </div>
                        </div>
                    </div>

                    <div className="premium-card bg-light p-3 border-0">
                        <h6 className="fw-bold mb-2">Instructions</h6>
                        <ul className="smaller text-muted ps-3 mb-0">
                            <li>Click on options to select an answer.</li>
                            <li>Use "Mark for Review" to come back later.</li>
                            <li>Test will auto-submit when timer ends.</li>
                        </ul>
                    </div>
                </aside>
            </main>
        </div>
    );
}

