"use client";
import React, { useState, useEffect } from 'react';
import StudentLayout from '@/components/Home/StudentLayout';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import '@/styles/student-layout.css';

const SkeletonCard = () => (
    <div className="perf-stat-card anim-pulse">
        <div className="skel-box" style={{ width: '44px', height: '44px', borderRadius: '12px', marginBottom: '20px' }}></div>
        <div className="skel-box" style={{ width: '55%', height: '36px', marginBottom: '8px' }}></div>
        <div className="skel-box" style={{ width: '70%', height: '14px' }}></div>
    </div>
);

const SkeletonRow = () => (
    <div className="perf-attempt-card anim-pulse">
        <div className="skel-box" style={{ width: '48px', height: '48px', borderRadius: '14px', flexShrink: 0 }}></div>
        <div className="flex-grow-1">
            <div className="skel-box" style={{ width: '60%', height: '16px', marginBottom: '8px' }}></div>
            <div className="skel-box" style={{ width: '35%', height: '12px' }}></div>
        </div>
        <div className="skel-box" style={{ width: '80px', height: '28px', borderRadius: '20px' }}></div>
    </div>
);

const getScoreColor = (pct) => {
    if (pct >= 80) return { bg: '#dcfce7', color: '#15803d', bar: '#04bd20' };
    if (pct >= 40) return { bg: '#fef9c3', color: '#92400e', bar: '#f59e0b' };
    return { bg: '#fee2e2', color: '#991b1b', bar: '#ef4444' };
};

const getScoreLabel = (pct) => {
    if (pct >= 80) return 'Excellent';
    if (pct >= 60) return 'Good';
    if (pct >= 40) return 'Pass';
    return 'Fail';
};

export default function PerformancePage() {
    const [stats, setStats] = useState({ totalTaken: 0, totalPassed: 0, avgPercentage: 0 });
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const router = useRouter();

    useEffect(() => { fetchPerformance(); }, []);

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
            setTimeout(() => setLoading(false), 500);
        }
    };

    const filteredHistory = history.filter(item => {
        const matchSearch =
            item.mockTestId?.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.mockTestId?.category?.toLowerCase().includes(searchQuery.toLowerCase());
        const matchFilter =
            filterStatus === 'all' ||
            (filterStatus === 'passed' && item.isPassed) ||
            (filterStatus === 'failed' && !item.isPassed);
        return matchSearch && matchFilter;
    });

    const passRate = stats.totalTaken > 0
        ? Math.round((stats.totalPassed / stats.totalTaken) * 100)
        : 0;

    const statCards = [
        {
            icon: 'fa-solid fa-clipboard-check',
            iconBg: 'linear-gradient(135deg, #3b82f6, #6366f1)',
            label: 'Total Attempts',
            sublabel: 'All time',
            value: stats.totalTaken,
            suffix: '',
            bar: 100,
            barColor: '#3b82f6',
        },
        {
            icon: 'fa-solid fa-bullseye',
            iconBg: 'linear-gradient(135deg, #04bd20, #16a34a)',
            label: 'Avg. Accuracy',
            sublabel: 'Across all tests',
            value: stats.avgPercentage,
            suffix: '%',
            bar: stats.avgPercentage,
            barColor: '#04bd20',
            highlight: true,
        },
        {
            icon: 'fa-solid fa-trophy',
            iconBg: 'linear-gradient(135deg, #f59e0b, #d97706)',
            label: 'Tests Passed',
            sublabel: `${passRate}% pass rate`,
            value: stats.totalPassed,
            suffix: '',
            bar: passRate,
            barColor: '#f59e0b',
        },
    ];

    return (
        <StudentLayout title="My Performance">
            <div className="perf-page">

                {/* ── Hero Banner ── */}
                <div className="perf-hero">
                    <div className="perf-hero-bg-orb perf-hero-orb1"></div>
                    <div className="perf-hero-bg-orb perf-hero-orb2"></div>
                    <div className="perf-hero-content">
                        <div>
                            <div className="perf-hero-eyebrow">
                                <i className="fa-solid fa-chart-line me-1"></i> Performance Tracker
                            </div>
                            <h1 className="perf-hero-title">
                                Your <span className="perf-hero-accent">Analytics</span> Dashboard
                            </h1>
                            <p className="perf-hero-sub">
                                Track every attempt, measure growth, and ace your exams.
                            </p>
                        </div>
                        <div className="d-flex gap-2 flex-wrap">
                            <button className="perf-hero-btn" onClick={fetchPerformance}>
                                <i className="fa-solid fa-rotate"></i> Refresh
                            </button>
                            <button className="perf-hero-btn perf-hero-btn--outline" onClick={() => router.push('/mock-tests')}>
                                <i className="fa-solid fa-play"></i> Take Test
                            </button>
                        </div>
                    </div>
                </div>

                {/* ── Stat Cards ── */}
                <div className="perf-stats-grid">
                    {loading
                        ? [1, 2, 3].map(i => <SkeletonCard key={i} />)
                        : statCards.map((s, i) => (
                            <div key={i} className={`perf-stat-card ${s.highlight ? 'perf-stat-card--green' : ''}`}>
                                <div className="perf-stat-icon" style={{ background: s.iconBg }}>
                                    <i className={s.icon}></i>
                                </div>
                                <div className="perf-stat-value">
                                    {s.value}<span className="perf-stat-suffix">{s.suffix}</span>
                                </div>
                                <div className="perf-stat-label">{s.label}</div>
                                <div className="perf-stat-sub">{s.sublabel}</div>
                                <div className="perf-stat-bar-track">
                                    <div className="perf-stat-bar-fill" style={{ width: `${Math.min(s.bar, 100)}%`, background: s.highlight ? '#fff' : s.barColor }}></div>
                                </div>
                            </div>
                        ))
                    }
                </div>

                {/* ── Attempt History ── */}
                <div className="perf-section">
                    {/* Toolbar */}
                    <div className="perf-toolbar">
                        <div>
                            <h2 className="perf-section-title">Attempt History</h2>
                            <p className="perf-section-sub">{filteredHistory.length} result{filteredHistory.length !== 1 ? 's' : ''} found</p>
                        </div>
                        <div className="d-flex gap-2 flex-wrap align-items-center">
                            {/* Search */}
                            <div className="perf-search">
                                <i className="fa-solid fa-magnifying-glass"></i>
                                <input
                                    type="text"
                                    placeholder="Search tests..."
                                    value={searchQuery}
                                    onChange={e => setSearchQuery(e.target.value)}
                                />
                            </div>
                            {/* Filter tabs */}
                            <div className="perf-filter-tabs">
                                {['all', 'passed', 'failed'].map(f => (
                                    <button
                                        key={f}
                                        className={`perf-filter-tab ${filterStatus === f ? 'active' : ''} perf-filter-tab--${f}`}
                                        onClick={() => setFilterStatus(f)}
                                    >
                                        {f === 'all' ? 'All' : f === 'passed' ? '✓ Passed' : '✗ Failed'}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Cards list */}
                    <div className="perf-attempt-list">
                        {loading ? (
                            [1, 2, 3, 4].map(i => <SkeletonRow key={i} />)
                        ) : filteredHistory.length === 0 ? (
                            <div className="perf-empty">
                                <div className="perf-empty-icon">
                                    <i className="fa-solid fa-chart-column"></i>
                                </div>
                                <h4>No attempts yet</h4>
                                <p>Take a mock test to see your performance here.</p>
                                <button className="perf-take-test-btn" onClick={() => router.push('/mock-tests')}>
                                    <i className="fa-solid fa-play me-2"></i> Start a Mock Test
                                </button>
                            </div>
                        ) : (
                            filteredHistory.map((item, idx) => {
                                const sc = getScoreColor(item.percentage);
                                const lbl = getScoreLabel(item.percentage);
                                const attemptDate = new Date(item.attemptedAt);
                                return (
                                    <div key={idx} className="perf-attempt-card">
                                        {/* Icon */}
                                        <div className="perf-attempt-icon" style={{ background: sc.bg, color: sc.color }}>
                                            <i className="fa-solid fa-file-pen"></i>
                                        </div>

                                        {/* Info */}
                                        <div className="perf-attempt-info">
                                            <div className="perf-attempt-title">
                                                {item.mockTestId?.title || 'Practice Quiz'}
                                            </div>
                                            <div className="perf-attempt-meta">
                                                <span className="perf-attempt-cat">{item.mockTestId?.category || 'General'}</span>
                                                <span className="perf-attempt-dot">·</span>
                                                <span>{attemptDate.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                                                <span className="perf-attempt-dot">·</span>
                                                <span>{attemptDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                            </div>
                                        </div>

                                        {/* Score bar */}
                                        <div className="perf-attempt-score-col d-none d-md-flex">
                                            <div className="perf-attempt-pct" style={{ color: sc.color }}>
                                                {item.percentage}%
                                            </div>
                                            <div className="perf-attempt-bar-track">
                                                <div className="perf-attempt-bar-fill" style={{ width: `${item.percentage}%`, background: sc.bar }}></div>
                                            </div>
                                            <div className="perf-attempt-score-label">{item.score}/{item.totalScore} correct</div>
                                        </div>

                                        {/* Badge */}
                                        <div className="perf-attempt-badge-col">
                                            <span className="perf-attempt-badge" style={{ background: sc.bg, color: sc.color, border: `1px solid ${sc.bar}30` }}>
                                                {lbl}
                                            </span>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>
            </div>

            <style jsx>{`
                /* ── Page Shell ── */
                .perf-page {
                    max-width: 1300px;
                    margin: 0 auto;
                    padding: 0 0 60px;
                    font-family: 'Inter', sans-serif;
                }

                /* ── Hero ── */
                .perf-hero {
                    position: relative;
                    overflow: hidden;
                    background: linear-gradient(135deg, #0f172a 0%, #1e293b 60%, #0f4c2a 100%);
                    border-radius: 20px;
                    padding: 32px 36px;
                    margin-bottom: 20px;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    gap: 24px;
                    flex-wrap: wrap;
                }
                .perf-hero-bg-orb {
                    position: absolute;
                    border-radius: 50%;
                    filter: blur(60px);
                    opacity: 0.25;
                    pointer-events: none;
                }
                .perf-hero-orb1 { width: 320px; height: 320px; background: #04bd20; top: -80px; right: -80px; }
                .perf-hero-orb2 { width: 200px; height: 200px; background: #3b82f6; bottom: -60px; left: 20%; }
                .perf-hero-content { position: relative; z-index: 1; display: flex; align-items: center; justify-content: space-between; gap: 24px; flex-wrap: wrap; width: 100%; }
                .perf-hero-eyebrow {
                    display: inline-flex;
                    align-items: center;
                    background: rgba(4,189,32,0.15);
                    color: #4ade80;
                    font-size: 0.72rem;
                    font-weight: 800;
                    text-transform: uppercase;
                    letter-spacing: 0.08em;
                    padding: 5px 14px;
                    border-radius: 20px;
                    margin-bottom: 14px;
                    border: 1px solid rgba(4,189,32,0.25);
                }
                .perf-hero-title {
                    font-size: 1.7rem;
                    font-weight: 800;
                    color: #fff;
                    line-height: 1.2;
                    margin: 0 0 8px;
                    letter-spacing: -0.02em;
                }
                .perf-hero-accent { color: #4ade80; }
                .perf-hero-sub {
                    color: rgba(255,255,255,0.55);
                    font-size: 0.8rem;
                    margin: 0;
                    max-width: 400px;
                }
                .perf-hero-btn {
                    display: inline-flex;
                    align-items: center;
                    gap: 8px;
                    background: rgba(255,255,255,0.12);
                    border: 1px solid rgba(255,255,255,0.2);
                    color: #fff;
                    padding: 8px 18px;
                    border-radius: 50px;
                    font-size: 0.75rem;
                    font-weight: 700;
                    transition: all 0.2s;
                    backdrop-filter: blur(8px);
                    cursor: pointer;
                }
                .perf-hero-btn:hover { background: rgba(255,255,255,0.22); transform: translateY(-1px); }
                .perf-hero-btn--outline { background: rgba(4,189,32,0.15); border-color: rgba(4,189,32,0.4); color: #4ade80; }
                .perf-hero-btn--outline:hover { background: rgba(4,189,32,0.25); }

                /* ── Stat Cards Grid ── */
                .perf-stats-grid {
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                    gap: 20px;
                    margin-bottom: 28px;
                }
                @media (max-width: 768px) { .perf-stats-grid { grid-template-columns: 1fr; } }
                @media (min-width: 576px) and (max-width: 768px) { .perf-stats-grid { grid-template-columns: repeat(2, 1fr); } }

                .perf-stat-card {
                    background: #fff;
                    border: 1px solid #f1f5f9;
                    border-radius: 16px;
                    padding: 22px;
                    display: flex;
                    flex-direction: column;
                    transition: transform 0.25s, box-shadow 0.25s;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.04);
                }
                .perf-stat-card:hover { transform: translateY(-4px); box-shadow: 0 16px 32px rgba(0,0,0,0.08); }
                .perf-stat-card--green {
                    background: linear-gradient(135deg, #04bd20 0%, #16a34a 100%);
                    border-color: transparent;
                    box-shadow: 0 12px 30px rgba(4,189,32,0.25);
                }
                .perf-stat-card--green .perf-stat-value,
                .perf-stat-card--green .perf-stat-label,
                .perf-stat-card--green .perf-stat-sub { color: #fff !important; }
                .perf-stat-card--green .perf-stat-bar-track { background: rgba(255,255,255,0.2); }

                .perf-stat-icon {
                    width: 40px;
                    height: 40px;
                    border-radius: 12px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: #fff;
                    font-size: 0.95rem;
                    margin-bottom: 16px;
                    flex-shrink: 0;
                }
                .perf-stat-value {
                    font-size: 1.9rem;
                    font-weight: 900;
                    color: #0f172a;
                    line-height: 1;
                    margin-bottom: 4px;
                    letter-spacing: -0.03em;
                }
                .perf-stat-suffix { font-size: 1rem; font-weight: 700; opacity: 0.7; margin-left: 2px; }
                .perf-stat-label { font-size: 0.82rem; font-weight: 700; color: #0f172a; margin-bottom: 2px; }
                .perf-stat-sub { font-size: 0.65rem; color: #94a3b8; font-weight: 600; margin-bottom: 12px; text-transform: uppercase; letter-spacing: 0.04em; }
                .perf-stat-bar-track { height: 5px; background: #f1f5f9; border-radius: 10px; overflow: hidden; margin-top: auto; }
                .perf-stat-bar-fill { height: 100%; border-radius: 10px; transition: width 1s ease; }

                /* ── Section ── */
                .perf-section { background: #fff; border: 1px solid #f1f5f9; border-radius: 20px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.04); }

                .perf-toolbar {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    flex-wrap: wrap;
                    gap: 16px;
                    padding: 24px 28px;
                    border-bottom: 1px solid #f1f5f9;
                }
                .perf-section-title { font-size: 0.95rem; font-weight: 800; color: #0f172a; margin: 0 0 2px; }
                .perf-section-sub { font-size: 0.65rem; color: #94a3b8; font-weight: 600; margin: 0; }

                .perf-search {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    background: #f8fafc;
                    border: 1px solid #e2e8f0;
                    border-radius: 12px;
                    padding: 8px 16px;
                    font-size: 0.78rem;
                    color: #94a3b8;
                    min-width: 220px;
                    transition: border-color 0.2s;
                }
                .perf-search:focus-within { border-color: #04bd20; }
                .perf-search input {
                    border: none;
                    outline: none;
                    background: transparent;
                    font-size: 0.82rem;
                    color: #0f172a;
                    width: 100%;
                    font-weight: 500;
                }
                .perf-search input::placeholder { color: #94a3b8; }

                .perf-filter-tabs {
                    display: flex;
                    background: #f8fafc;
                    border: 1px solid #e2e8f0;
                    border-radius: 12px;
                    padding: 3px;
                    gap: 2px;
                }
                .perf-filter-tab {
                    padding: 6px 14px;
                    border-radius: 9px;
                    border: none;
                    background: transparent;
                    font-size: 0.72rem;
                    font-weight: 700;
                    color: #64748b;
                    cursor: pointer;
                    transition: all 0.15s;
                }
                .perf-filter-tab.active { background: #fff; color: #0f172a; box-shadow: 0 1px 4px rgba(0,0,0,0.08); }
                .perf-filter-tab--passed.active { color: #15803d; }
                .perf-filter-tab--failed.active { color: #991b1b; }

                /* ── Attempt Cards ── */
                .perf-attempt-list { display: flex; flex-direction: column; padding: 16px 20px; gap: 10px; }

                .perf-attempt-card {
                    display: flex;
                    align-items: center;
                    gap: 16px;
                    background: #fff;
                    border: 1px solid #f1f5f9;
                    border-radius: 12px;
                    padding: 12px 16px;
                    transition: all 0.2s;
                }
                .perf-attempt-card:hover { border-color: #e2e8f0; box-shadow: 0 4px 12px rgba(0,0,0,0.06); transform: translateY(-1px); }

                .perf-attempt-icon {
                    width: 40px;
                    height: 40px;
                    border-radius: 12px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 0.9rem;
                    flex-shrink: 0;
                }

                .perf-attempt-info { flex: 1; min-width: 0; }
                .perf-attempt-title {
                    font-size: 0.82rem;
                    font-weight: 700;
                    color: #0f172a;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    margin-bottom: 3px;
                }
                .perf-attempt-meta {
                    display: flex;
                    align-items: center;
                    gap: 5px;
                    font-size: 0.65rem;
                    color: #94a3b8;
                    font-weight: 600;
                    flex-wrap: wrap;
                }
                .perf-attempt-cat {
                    background: #f1f5f9;
                    color: #64748b;
                    padding: 2px 8px;
                    border-radius: 6px;
                    font-size: 0.65rem;
                    font-weight: 700;
                    text-transform: uppercase;
                    letter-spacing: 0.03em;
                }
                .perf-attempt-dot { color: #cbd5e1; }

                .perf-attempt-score-col {
                    display: flex;
                    flex-direction: column;
                    align-items: flex-end;
                    gap: 4px;
                    min-width: 130px;
                }
                .perf-attempt-pct { font-size: 1.1rem; font-weight: 900; letter-spacing: -0.02em; line-height: 1; }
                .perf-attempt-bar-track { width: 120px; height: 4px; background: #f1f5f9; border-radius: 10px; overflow: hidden; }
                .perf-attempt-bar-fill { height: 100%; border-radius: 10px; transition: width 0.8s ease; }
                .perf-attempt-score-label { font-size: 0.65rem; font-weight: 600; color: #94a3b8; white-space: nowrap; }

                .perf-attempt-badge-col { flex-shrink: 0; min-width: 80px; text-align: right; }
                .perf-attempt-badge {
                    display: inline-block;
                    padding: 4px 10px;
                    border-radius: 20px;
                    font-size: 0.62rem;
                    font-weight: 800;
                    text-transform: uppercase;
                    letter-spacing: 0.06em;
                }

                /* ── Empty State ── */
                .perf-empty {
                    text-align: center;
                    padding: 64px 24px;
                }
                .perf-empty-icon {
                    width: 72px;
                    height: 72px;
                    background: #f8fafc;
                    border-radius: 20px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 1.8rem;
                    color: #cbd5e1;
                    margin: 0 auto 16px;
                }
                .perf-empty h4 { font-size: 0.9rem; font-weight: 800; color: #0f172a; margin-bottom: 4px; }
                .perf-empty p { font-size: 0.75rem; color: #94a3b8; margin-bottom: 16px; }
                .perf-take-test-btn {
                    display: inline-flex;
                    align-items: center;
                    background: #04bd20;
                    color: #fff;
                    border: none;
                    padding: 10px 24px;
                    border-radius: 50px;
                    font-size: 0.82rem;
                    font-weight: 700;
                    cursor: pointer;
                    transition: all 0.2s;
                }
                .perf-take-test-btn:hover { background: #03a61b; transform: translateY(-1px); }

                /* ── Skeleton ── */
                .skel-box { background: linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%); background-size: 200% 100%; animation: shimmer 1.6s infinite; border-radius: 8px; }
                @keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }
                .anim-pulse { animation: pulse 2s infinite; }
                @keyframes pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.6; } }

                /* ── Responsive ── */
                @media (max-width: 576px) {
                    .perf-hero { padding: 32px 24px; }
                    .perf-hero-title { font-size: 1.7rem; }
                    .perf-toolbar { flex-direction: column; align-items: flex-start; }
                    .perf-search { min-width: 100%; }
                }
            `}</style>
        </StudentLayout>
    );
}
