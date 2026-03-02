"use client";
import React, { useState } from 'react';
import StudentLayout from '../../components/Home/StudentLayout';
import PageBanners from '../../components/PageBanners';
import ContentContext from '../../context/ContentContext';
import { getLimit } from '../../utils/planAccess';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';

const TEST_CATEGORIES = ['All Tests'];

const DUMMY_TESTS = [];

export default function MockTestsPage() {
    const { userData, usage, getUsage, recordUsage } = React.useContext(ContentContext);
    const [activeCategory, setActiveCategory] = useState('All Tests');
    const [aiTests, setAiTests] = useState([]);
    const [dbTests, setDbTests] = useState([]);
    const [testMode, setTestMode] = useState('timed');
    const [isGenerating, setIsGenerating] = useState(false);
    const userPlan = userData?.Plan || 'e0';
    const router = useRouter();

    React.useEffect(() => {
        getUsage();
        fetchDbTests();
    }, []);

    const fetchDbTests = async () => {
        try {
            const res = await fetch('/api/mock-test');
            const data = await res.json();
            if (data.success) {
                setDbTests(data.tests);
            }
        } catch (err) {
            console.error("Failed to load DB tests");
        }
    };

    const limit = getLimit(userPlan, 'mockTests');
    const taken = usage?.mockTestsTaken || 0;
    const remaining = limit === Infinity ? 'Unlimited' : Math.max(0, limit - taken);

    const handleGenerateAITest = async () => {
        if (limit !== Infinity && taken >= limit) {
            toast.info(`Monthly limit reached! (${limit} tests). Upgrade your plan for more.`);
            router.push('/plans');
            return;
        }

        setIsGenerating(true);
        try {
            const token = localStorage.getItem('token');
            const res = await fetch('/api/mock-tests/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token, mode: testMode })
            });
            const data = await res.json();
            if (data.success) {
                setAiTests([data.test, ...aiTests]);
                toast.success("AI Mock Test Generated Successfully!");
            } else {
                toast.error(data.message || "Failed to generate AI Mock");
            }
        } catch (err) {
            toast.error("AI Engine Timeout. Please try again.");
        } finally {
            setIsGenerating(false);
        }
    };

    const filteredTests = [
        ...aiTests,
        ...dbTests,
        ...DUMMY_TESTS.filter(test =>
            activeCategory === 'All Tests' || test.category === activeCategory
        )
    ];

    const handleStartTest = async (test) => {
        if (limit !== Infinity && taken >= limit) {
            toast.info(`Monthly limit reached! (${limit} tests). Upgrade your plan for more.`);
            router.push('/plans');
            return;
        }

        // Check if it's a real DB test that the student can take interactively
        if (test._id) {
            router.push(`/mock-tests/${test._id}`);
            return;
        }

        // Fallback for purely simulated frontend/AI mocks that aren't stored in DB yet
        const confirmed = window.confirm(`Start and auto-complete "${test.title}" for demo?`);
        if (confirmed) {
            await recordUsage('mockTests');
            const randomScore = Math.floor(Math.random() * 20) + 75; // 75-95
            toast.success(`Mock Test Completed! You scored ${randomScore}%`);
        }
    };

    return (
        <StudentLayout title="Mock Tests">
            <div className="container-fluid px-0 pb-5 mt-container">
                {/* Banners */}
                <PageBanners page="mock-test" />

                {/* Header */}
                <div className="mt-header mb-5 d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-4">
                    <div>
                        <h1 className="mt-title mb-1">Examee Mock Arena</h1>
                        <p className="mt-subtitle text-muted mb-0">Simulate real exam environments and track your progress.</p>
                    </div>
                    <div className="mt-stats-pills d-flex gap-2">
                        <div className="mt-stat-pill">
                            <span className="mt-pill-count">{remaining}</span>
                            <span className="mt-pill-label">Remaining</span>
                        </div>
                        <div className="mt-stat-pill mt-stat-pill--active">
                            <span className="mt-pill-count">{taken}</span>
                            <span className="mt-pill-label">Taken ({(new Date().toLocaleString('default', { month: 'long' }))})</span>
                        </div>
                    </div>
                </div>

                <div className="mb-5">
                    <div className="p-4 rounded-4 border-0 shadow-sm position-relative overflow-hidden mb-4" style={{
                        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
                        color: '#fff'
                    }}>
                        {/* Decorative Glow */}
                        <div className="position-absolute top-0 end-0 p-5 bg-success rounded-circle" style={{ transform: 'translate(30%, -30%)', filter: 'blur(60px)', opacity: 0.15 }}></div>

                        <div className="row align-items-center g-4 position-relative">
                            <div className="col-lg-7">
                                <div className="d-flex align-items-center gap-3 mb-3">
                                    <div className="bg-success rounded-3 p-2 d-flex align-items-center justify-content-center shadow-lg" style={{ width: '42px', height: '42px' }}>
                                        <i className="fa-solid fa-wand-magic-sparkles text-white"></i>
                                    </div>
                                    <h4 className="fw-black mb-0 letter-spacing-tight">AI Personalized <span className="text-success">Mock Generator</span></h4>
                                </div>
                                <p className="mb-4 text-slate-400" style={{ fontSize: '0.92rem', color: '#94a3b8' }}>
                                    Our AI engine analyzes your academic profile to generate a custom assessment tailored to your university curriculum and current semester.
                                </p>

                                <div className="d-flex flex-wrap gap-2 mb-4">
                                    {[
                                        { label: 'University', value: userData?.University || 'Mumbai University', icon: 'fa-university' },
                                        { label: 'Course', value: userData?.Course || 'B.Sc CS/IT', icon: 'fa-graduation-cap' },
                                        { label: 'Semester', value: userData?.Semester || '3rd Year', icon: 'fa-calendar-alt' }
                                    ].map((pref, i) => (
                                        <div key={i} className="px-3 py-2 rounded-3 d-flex align-items-center gap-2 border border-slate-700 mx-1" style={{ background: 'rgba(255,255,255,0.05)', borderColor: 'rgba(255,255,255,0.1)' }}>
                                            <i className={`fa-solid ${pref.icon} text-success smaller`}></i>
                                            <div style={{ lineHeight: '1.2' }}>
                                                <p className="mb-0 text-uppercase fw-black text-muted" style={{ fontSize: '0.55rem', letterSpacing: '0.5px' }}>{pref.label}</p>
                                                <p className="mb-0 fw-bold" style={{ fontSize: '0.78rem' }}>{pref.value}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="mb-4">
                                    <p className="smaller fw-black text-uppercase text-success mb-2 letter-spacing-1">Select Test Mode</p>
                                    <div className="d-flex gap-2">
                                        <button
                                            className={`btn btn-sm rounded-pill px-3 py-2 d-flex align-items-center gap-2 transition-all ${testMode === 'timed' ? 'btn-success fw-black' : 'btn-outline-secondary text-slate-400 border-slate-700'}`}
                                            onClick={() => setTestMode('timed')}
                                            style={{ fontSize: '0.75rem' }}
                                        >
                                            <i className="fa-solid fa-stopwatch"></i> Timed Challenge
                                        </button>
                                        <button
                                            className={`btn btn-sm rounded-pill px-3 py-2 d-flex align-items-center gap-2 transition-all ${testMode === 'practice' ? 'btn-success fw-black' : 'btn-outline-secondary text-slate-400 border-slate-700'}`}
                                            onClick={() => setTestMode('practice')}
                                            style={{ fontSize: '0.75rem' }}
                                        >
                                            <i className="fa-solid fa-book-open-reader"></i> Practice Mode
                                        </button>
                                    </div>
                                </div>

                                <button
                                    className={`btn btn-success rounded-pill px-4 py-2 fw-black shadow-lg d-flex align-items-center gap-2 hover-lift border-0 ${isGenerating ? 'disabled opacity-75' : ''}`}
                                    onClick={() => !isGenerating && handleGenerateAITest()}
                                    style={{ fontSize: '0.85rem' }}
                                >
                                    {isGenerating ? (
                                        <>Generating Master Mock... <div className="spinner-border spinner-border-sm ms-2" role="status"></div></>
                                    ) : (
                                        <>Generate Master Mock with AI <i className="fa-solid fa-bolt ms-1"></i></>
                                    )}
                                </button>
                            </div>
                            <div className="col-lg-5 d-none d-lg-block text-center">
                                <div className="position-relative d-inline-block p-5">
                                    <div className="position-absolute top-50 start-50 translate-middle w-100 h-100 bg-success rounded-circle" style={{ filter: 'blur(40px)', opacity: 0.15 }}></div>
                                    <i
                                        className="fa-solid fa-brain text-success position-relative"
                                        style={{
                                            fontSize: '8rem',
                                            filter: 'drop-shadow(0 15px 25px rgba(4, 189, 32, 0.3))'
                                        }}
                                    ></i>
                                    <i
                                        className="fa-solid fa-bolt position-absolute text-warning"
                                        style={{
                                            fontSize: '2rem',
                                            top: '10%',
                                            right: '10%',
                                            filter: 'drop-shadow(0 0 10px rgba(255, 193, 7, 0.5))',
                                            transform: 'rotate(15deg)'
                                        }}
                                    ></i>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Categories */}
                <div className="mt-nav-wrapper mb-4">
                    <div className="d-flex gap-2 overflow-auto pb-2" style={{ scrollbarWidth: 'none' }}>
                        {TEST_CATEGORIES.map(cat => (
                            <button
                                key={cat}
                                className={`mt-cat-btn ${activeCategory === cat ? 'active' : ''}`}
                                onClick={() => setActiveCategory(cat)}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Grid */}
                <div className="row g-4">
                    {filteredTests.length === 0 ? (
                        <div className="col-12 text-center py-5">
                            <div className="py-5 bg-light rounded-4 border-dashed border-2" style={{ borderStyle: 'dashed', borderColor: '#e2e8f0' }}>
                                <div className="mb-3 d-inline-flex bg-white shadow-sm p-3 rounded-circle">
                                    <i className="fa-solid fa-clipboard-list text-muted fs-4"></i>
                                </div>
                                <h5 className="fw-bold text-dark">Ready to Start?</h5>
                                <p className="text-muted smaller">Use the <b>AI Generator</b> above to create a custom mock test tailored to your profile.</p>
                            </div>
                        </div>
                    ) : (
                        filteredTests.map(test => (
                            <div key={test._id || test.id} className="col-md-6 col-lg-4">
                                <div className="mt-test-card">
                                    <div className="mt-card-top d-flex justify-content-between align-items-start mb-3">
                                        <div className={`mt-diff-badge mt-diff--${(test.difficulty || 'Medium').toLowerCase()}`}>
                                            {test.difficulty || 'Medium'}
                                        </div>
                                        <div className="mt-test-rating">
                                            <i className="fa-solid fa-star me-1 text-warning"></i> {test.rating || '4.5'}
                                        </div>
                                    </div>
                                    <h3 className="mt-test-title mb-3">{test.title}</h3>

                                    <div className="mt-test-details row g-2 mb-4">
                                        <div className="col-6">
                                            <div className="mt-detail-item">
                                                <i className="fa-solid fa-circle-question me-2 text-muted"></i>
                                                <span>{test.questions || test.totalQuestions} MCQs</span>
                                            </div>
                                        </div>
                                        <div className="col-6">
                                            <div className="mt-detail-item">
                                                <i className="fa-solid fa-clock me-2 text-muted"></i>
                                                <span>{test.duration || `${test.durationMinutes} min`}</span>
                                            </div>
                                        </div>
                                        <div className="col-6">
                                            <div className="mt-detail-item">
                                                {test.isAI ? (
                                                    <i className="fa-solid fa-wand-magic-sparkles me-2 text-success"></i>
                                                ) : (
                                                    <i className="fa-solid fa-user-tie me-2 text-muted"></i>
                                                )}
                                                <span>{test.isAI ? 'AI Tailored' : `By ${test.createdBy?.FirstName || 'Instructor'}`}</span>
                                            </div>
                                        </div>
                                        <div className="col-6">
                                            <div className="mt-detail-item">
                                                <i className="fa-solid fa-tag me-2 text-muted"></i>
                                                <span>{test.category}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <button className="mt-start-btn" onClick={() => handleStartTest(test)}>
                                        Start Mock Test <i className="fa-solid fa-chevron-right ms-2"></i>
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            <style jsx>{`
                .mt-container { max-width: 1400px; margin: 0 auto; }
                .mt-title { font-size: 1.8rem; font-weight: 700; color: #0f172a; letter-spacing: -0.02em; }
                .mt-subtitle { font-size: 0.88rem; font-weight: 400; }

                .mt-stat-pill { background: #fff; border: 1px solid #e2e8f0; padding: 8px 16px; border-radius: 12px; display: flex; flex-direction: column; align-items: center; min-width: 100px; }
                .mt-stat-pill--active { background: #f0fdf4; border-color: #04bd20; }
                .mt-pill-count { font-size: 1.1rem; font-weight: 700; color: #0f172a; line-height: 1.2; }
                .mt-pill-label { font-size: 0.64rem; font-weight: 600; color: #64748b; text-transform: uppercase; }

                .mt-cat-btn {
                    white-space: nowrap;
                    padding: 8px 20px;
                    border: 1px solid #e2e8f0;
                    background: #fff;
                    border-radius: 10px;
                    font-size: 0.75rem;
                    font-weight: 600;
                    color: #64748b;
                    transition: all 0.2s;
                }
                .mt-cat-btn:hover { border-color: #04bd20; color: #0f172a; }
                .mt-cat-btn.active { background: #0f172a; color: #fff; border-color: #0f172a; }

                .mt-test-card {
                    background: #fff;
                    border: 1px solid #f1f5f9;
                    border-radius: 14px;
                    padding: 24px;
                    height: 100%;
                    transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
                    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
                }
                .mt-test-card:hover { transform: translateY(-4px); box-shadow: 0 12px 24px -10px rgba(0,0,0,0.1); border-color: #e2e8f0; }

                .mt-diff-badge { font-size: 0.6rem; font-weight: 800; text-transform: uppercase; padding: 4px 10px; border-radius: 6px; }
                .mt-diff--high { background: #fee2e2; color: #ef4444; }
                .mt-diff--medium { background: #fef9c3; color: #ca8a04; }
                .mt-diff--pro { background: #e0f2fe; color: #0284c7; }
                .mt-diff--extreme { background: #0f172a; color: #fff; }
                .mt-diff--hard { background: #fef3c7; color: #d97706; }

                .mt-test-rating { font-size: 0.72rem; font-weight: 700; color: #475569; }
                .mt-test-title { font-size: 1rem; font-weight: 600; color: #0f172a; line-height: 1.4; }
                
                .mt-detail-item { display: flex; align-items: center; font-size: 0.78rem; font-weight: 500; color: #64748b; }
                
                .mt-start-btn {
                    width: 100%;
                    background: #f8fafc;
                    border: 1px solid #e2e8f0;
                    padding: 12px;
                    border-radius: 10px;
                    font-size: 0.82rem;
                    font-weight: 700;
                    color: #0f172a;
                    transition: all 0.2s;
                }
                .mt-test-card:hover .mt-start-btn { background: #04bd20; color: #fff; border-color: #04bd20; }

                @media (max-width: 768px) {
                    .mt-title { font-size: 1.5rem; }
                }
            `}</style>
        </StudentLayout>
    );
}
