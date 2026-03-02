"use client";
import React, { useState } from 'react';
import StudentLayout from '../../components/Home/StudentLayout';
import PageBanners from '../../components/PageBanners';
import ContentContext from '../../context/ContentContext';
import { getLimit } from '../../utils/planAccess';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';

const TEST_CATEGORIES = ['All Tests', 'Engineering', 'Medical', 'GATE', 'UPSC', 'SSC'];

const DUMMY_TESTS = [
    { id: 1, title: "JEE Mains - Phase 1 Full Mock", category: "Engineering", questions: 90, duration: "180 min", attempts: "12k+", rating: 4.8, difficulty: 'High' },
    { id: 2, title: "NEET Biology Sectional Test", category: "Medical", questions: 100, duration: "60 min", attempts: "8.5k+", rating: 4.9, difficulty: 'Medium' },
    { id: 3, title: "GATE CS - Algorithm & Data Structures", category: "GATE", questions: 30, duration: "90 min", attempts: "5k+", rating: 4.7, difficulty: 'Pro' },
    { id: 4, title: "UPSC GS Paper 1 - Weekly Quiz", category: "UPSC", questions: 100, duration: "120 min", attempts: "25k+", rating: 4.6, difficulty: 'Hard' },
    { id: 5, title: "SSC CGL Tier 1 - Quantitative Aptitude", category: "SSC", questions: 25, duration: "20 min", attempts: "15k+", rating: 4.5, difficulty: 'Medium' },
    { id: 6, title: "JEE Advanced - Physics Complex Problems", category: "Engineering", questions: 54, duration: "180 min", attempts: "3k+", rating: 4.9, difficulty: 'Extreme' },
];

export default function MockTestsPage() {
    const { userData, usage, getUsage, recordUsage } = React.useContext(ContentContext);
    const [activeCategory, setActiveCategory] = useState('All Tests');
    const userPlan = userData?.Plan || 'e0';
    const router = useRouter();

    React.useEffect(() => {
        getUsage();
    }, []);

    const limit = getLimit(userPlan, 'mockTests');
    const taken = usage?.mockTestsTaken || 0;
    const remaining = limit === Infinity ? 'Unlimited' : Math.max(0, limit - taken);

    const filteredTests = DUMMY_TESTS.filter(test =>
        activeCategory === 'All Tests' || test.category === activeCategory
    );

    const handleStartTest = async (test) => {
        if (limit !== Infinity && taken >= limit) {
            toast.info(`Monthly limit reached! (${limit} tests). Upgrade your plan for more.`);
            router.push('/plans');
            return;
        }

        const confirmed = window.confirm(`Start "${test.title}"? This will count as 1 attempt for this month.`);
        if (confirmed) {
            await recordUsage('mockTests');
            toast.success("Test session started! (Usage recorded)");
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
                    {filteredTests.map(test => (
                        <div key={test.id} className="col-md-6 col-lg-4">
                            <div className="mt-test-card">
                                <div className="mt-card-top d-flex justify-content-between align-items-start mb-3">
                                    <div className={`mt-diff-badge mt-diff--${test.difficulty.toLowerCase()}`}>
                                        {test.difficulty}
                                    </div>
                                    <div className="mt-test-rating">
                                        <i className="fa-solid fa-star me-1 text-warning"></i> {test.rating}
                                    </div>
                                </div>
                                <h3 className="mt-test-title mb-3">{test.title}</h3>

                                <div className="mt-test-details row g-2 mb-4">
                                    <div className="col-6">
                                        <div className="mt-detail-item">
                                            <i className="fa-solid fa-circle-question me-2 text-muted"></i>
                                            <span>{test.questions} MCQs</span>
                                        </div>
                                    </div>
                                    <div className="col-6">
                                        <div className="mt-detail-item">
                                            <i className="fa-solid fa-clock me-2 text-muted"></i>
                                            <span>{test.duration}</span>
                                        </div>
                                    </div>
                                    <div className="col-6">
                                        <div className="mt-detail-item">
                                            <i className="fa-solid fa-users me-2 text-muted"></i>
                                            <span>{test.attempts} Taken</span>
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
                    ))}
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
