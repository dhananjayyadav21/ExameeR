"use client";
import React, { useState } from 'react';
import StudentLayout from '../../components/Home/StudentLayout';
import PageBanners from '../../components/PageBanners';
import ContentContext from '../../context/ContentContext';
import { getLimit } from '../../utils/planAccess';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';

// Categories will be dynamic based on matched tests
const DEFAULT_CATEGORIES = ['All Tests'];

export default function MockTestsPage() {
    const { userData, usage, getUsage } = React.useContext(ContentContext);
    const [activeCategory, setActiveCategory] = useState('All Tests');
    const [dbTests, setDbTests] = useState([]);
    const [attemptedTestIds, setAttemptedTestIds] = useState(new Set());
    const userPlan = userData?.Plan || 'e0';
    const router = useRouter();

    React.useEffect(() => {
        getUsage();
        fetchDbTests();
        fetchAttemptedTests();
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

    const fetchAttemptedTests = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) return;
            const res = await fetch(`/api/performance?token=${token}`);
            const data = await res.json();
            if (data.success) {
                // Build a Set of all mockTestIds the user has attempted
                const ids = new Set(data.history.map(a => a.mockTestId?._id || a.mockTestId));
                setAttemptedTestIds(ids);
            }
        } catch (err) {
            console.error("Failed to load attempt history");
        }
    };

    const limit = getLimit(userPlan, 'mockTests');
    const taken = usage?.mockTestsTaken || 0;
    const remaining = limit === Infinity ? 'Unlimited' : Math.max(0, limit - taken);

    // Filter tests by profile (Strictly Match Course)
    const profileMatchedTests = dbTests.filter(test => {
        if (!userData) return true;

        const userCourse = userData.Course?.toLowerCase().trim();
        const testProgram = (test.course || test.category || '').toLowerCase().trim();

        // Only match course (e.g. "B.Tech" matches "B.Tech CS/IT")
        return userCourse && (testProgram.includes(userCourse) || userCourse.includes(testProgram));
    });

    // Dynamically derive categories from profile-matched tests
    const dynamicCategories = React.useMemo(() => {
        const cats = new Set(['All Tests']);
        profileMatchedTests.forEach(t => {
            if (t.category) cats.add(t.category);
        });
        return Array.from(cats);
    }, [profileMatchedTests]);

    const filteredTests = profileMatchedTests.filter(test =>
        activeCategory === 'All Tests' || test.category === activeCategory
    );

    const handleStartTest = async (test) => {
        if (limit !== Infinity && taken >= limit) {
            toast.info(`Monthly limit reached! (${limit} tests). Upgrade your plan for more.`);
            router.push('/plans');
            return;
        }
        if (test._id) {
            router.push(`/mock-tests/${test._id}`);
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

                {/* Categories */}
                <div className="mt-nav-wrapper mb-4">
                    <div className="d-flex gap-2 overflow-auto pb-2" style={{ scrollbarWidth: 'none' }}>
                        {dynamicCategories.map(cat => (
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
                                <h5 className="fw-bold text-dark">No Mock Tests Available</h5>
                                <p className="text-muted smaller">Check back later for new mock tests added by instructors.</p>
                            </div>
                        </div>
                    ) : (
                        filteredTests.map(test => {
                            const isAttempted = attemptedTestIds.has(String(test._id));
                            return (
                                <div key={test._id || test.id} className="col-md-6 col-lg-4">
                                    <div className={`mt-test-card ${isAttempted ? 'mt-test-card--attempted' : ''}`}>
                                        <div className="mt-card-top d-flex justify-content-between align-items-center mb-3">
                                            <div className={`mt-diff-badge mt-diff--${(test.difficulty || 'Medium').toLowerCase()}`}>
                                                {test.difficulty || 'Medium'}
                                            </div>
                                            <div className="d-flex align-items-center gap-2">
                                                <div className="mt-meta-chip">
                                                    <i className="fa-solid fa-star text-warning"></i>
                                                    <span>{test.rating || '4.5'}</span>
                                                </div>
                                                <div className="mt-meta-chip">
                                                    <i className="fa-solid fa-users" style={{ color: '#94a3b8' }}></i>
                                                    <span>{test.attemptsCount || 0}</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Already taken ribbon */}
                                        {isAttempted && (
                                            <div className="mt-taken-badge mb-2">
                                                <i className="fa-solid fa-circle-check me-1"></i> Already Attempted
                                            </div>
                                        )}

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

                                        {isAttempted ? (
                                            <div className="d-flex gap-2">
                                                <button className="mt-result-btn flex-grow-1" onClick={() => router.push('/performance')}>
                                                    <i className="fa-solid fa-chart-simple me-2"></i>View Result
                                                </button>
                                                <button className="mt-retake-btn" onClick={() => handleStartTest(test)} title="Retake Test">
                                                    <i className="fa-solid fa-rotate-right"></i>
                                                </button>
                                            </div>
                                        ) : (
                                            <button className="mt-start-btn" onClick={() => handleStartTest(test)}>
                                                Start Mock Test <i className="fa-solid fa-chevron-right ms-2"></i>
                                            </button>
                                        )}
                                    </div>
                                </div>
                            );
                        })
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
                .mt-test-card--attempted { border-color: #d1fae5; background: linear-gradient(135deg, #fff 85%, #f0fdf4 100%); }

                .mt-taken-badge {
                    display: inline-flex;
                    align-items: center;
                    font-size: 0.65rem;
                    font-weight: 700;
                    text-transform: uppercase;
                    letter-spacing: 0.04em;
                    color: #15803d;
                    background: #dcfce7;
                    border: 1px solid #86efac;
                    padding: 3px 10px;
                    border-radius: 20px;
                }

                .mt-diff-badge { font-size: 0.6rem; font-weight: 800; text-transform: uppercase; padding: 4px 10px; border-radius: 6px; }
                .mt-diff--high { background: #fee2e2; color: #ef4444; }
                .mt-diff--medium { background: #fef9c3; color: #ca8a04; }
                .mt-diff--easy { background: #dcfce7; color: #16a34a; }
                .mt-diff--pro { background: #e0f2fe; color: #0284c7; }
                .mt-diff--extreme { background: #0f172a; color: #fff; }
                .mt-diff--hard { background: #fef3c7; color: #d97706; }
                .mt-diff--expert { background: #fce7f3; color: #be185d; }

                .mt-test-rating { font-size: 0.72rem; font-weight: 700; color: #475569; }
                .mt-meta-chip {
                    display: inline-flex;
                    align-items: center;
                    gap: 4px;
                    background: #f8fafc;
                    border: 1px solid #e2e8f0;
                    border-radius: 8px;
                    padding: 3px 8px;
                    font-size: 0.7rem;
                    font-weight: 700;
                    color: #475569;
                }
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

                .mt-result-btn {
                    background: #f0fdf4;
                    border: 1px solid #86efac;
                    padding: 11px 14px;
                    border-radius: 10px;
                    font-size: 0.8rem;
                    font-weight: 700;
                    color: #15803d;
                    transition: all 0.2s;
                }
                .mt-result-btn:hover { background: #04bd20; color: #fff; border-color: #04bd20; }

                .mt-retake-btn {
                    background: #f8fafc;
                    border: 1px solid #e2e8f0;
                    padding: 11px 14px;
                    border-radius: 10px;
                    font-size: 0.82rem;
                    font-weight: 700;
                    color: #64748b;
                    transition: all 0.2s;
                    flex-shrink: 0;
                }
                .mt-retake-btn:hover { background: #0f172a; color: #fff; border-color: #0f172a; }

                @media (max-width: 768px) {
                    .mt-title { font-size: 1.5rem; }
                }
            `}</style>
        </StudentLayout>
    );
}
