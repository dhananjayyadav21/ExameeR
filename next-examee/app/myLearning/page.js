"use client";
import React, { useContext, useEffect, useState } from 'react';
import NotesItem from "../../components/NotesItem"
import VideoItem from "../../components/VideoItem"
import QPaperItem from "../../components/QPaperItem"
import CourceIteam from "../../components/Home/CourceIteam"
import Footer from '../../components/Footer';
import ContentContext from '../../context/ContentContext'

const TABS = [
    { key: 'all', label: 'All', icon: 'fa-grip' },
    { key: 'notes', label: 'Notes', icon: 'fa-file-lines' },
    { key: 'videos', label: 'Videos', icon: 'fa-circle-play' },
    { key: 'pyq', label: 'Q-Papers', icon: 'fa-circle-question' },
    { key: 'courses', label: 'Courses', icon: 'fa-book' },
];

// Professional section heading with icon, title, and count
function SectionHeader({ icon, color, title, count, unit }) {
    return (
        <div className="d-flex align-items-center gap-3 mb-4 pb-2" style={{ borderBottom: '1px solid #f1f1f1' }}>
            <div className={`rounded-3 bg-${color} bg-opacity-10 d-flex align-items-center justify-content-center flex-shrink-0`}
                style={{ width: '38px', height: '38px' }}>
                <i className={`fa-solid ${icon} text-${color}`} style={{ fontSize: '0.95rem' }}></i>
            </div>
            <div>
                <h2 className="mb-0 text-dark" style={{ fontSize: '1.05rem', fontWeight: 700, letterSpacing: '-0.01em' }}>{title}</h2>
                <p className="mb-0" style={{ fontSize: '0.75rem', color: '#9ca3af', fontWeight: 500, marginTop: '1px' }}>
                    {count} {unit}{count !== 1 ? 's' : ''} saved
                </p>
            </div>
        </div>
    );
}

export default function MyLearningPage({ setProgress = () => { } }) {
    const context = useContext(ContentContext);
    const { getDataFromMyLearning, MyLearningNotes, MyLearningVideo, MyLearningPYQ, MyLearningCourse } = context;
    const [activeTab, setActiveTab] = useState('all');

    useEffect(() => {
        setProgress(0);
        if (typeof window !== 'undefined' && localStorage.getItem('token')) {
            getDataFromMyLearning();
        }
        setProgress(100);
    }, []);

    const totalItems = (MyLearningNotes?.length || 0) + (MyLearningVideo?.length || 0) +
        (MyLearningPYQ?.length || 0) + (MyLearningCourse?.length || 0);

    const stats = [
        { key: 'notes', label: 'Notes', count: MyLearningNotes?.length || 0, icon: 'fa-file-lines', color: 'success' },
        { key: 'videos', label: 'Videos', count: MyLearningVideo?.length || 0, icon: 'fa-circle-play', color: 'primary' },
        { key: 'pyq', label: 'Q-Papers', count: MyLearningPYQ?.length || 0, icon: 'fa-circle-question', color: 'warning' },
        { key: 'courses', label: 'Courses', count: MyLearningCourse?.length || 0, icon: 'fa-book', color: 'info' },
    ];

    const showNotes = activeTab === 'all' || activeTab === 'notes';
    const showVideos = activeTab === 'all' || activeTab === 'videos';
    const showPYQ = activeTab === 'all' || activeTab === 'pyq';
    const showCourses = activeTab === 'all' || activeTab === 'courses';

    return (
        <main className="bg-light min-vh-100">
            {/* Page header — slim, professional */}
            <div className="bg-white border-bottom">
                <div className="container-lg px-4 py-3">
                    <div className="d-flex flex-column flex-sm-row align-items-sm-center justify-content-between gap-2">
                        <div>
                            <nav aria-label="breadcrumb">
                                <ol className="breadcrumb mb-1" style={{ fontSize: '0.78rem' }}>
                                    <li className="breadcrumb-item"><a href="/" className="text-decoration-none text-muted">Home</a></li>
                                    <li className="breadcrumb-item active text-green" style={{ fontWeight: 500 }}>My Learning</li>
                                </ol>
                            </nav>
                            <h1 className="mb-0 text-dark" style={{ fontSize: '1.35rem', fontWeight: 700, letterSpacing: '-0.01em' }}>
                                My <span className="text-green">Learning Hub</span>
                            </h1>
                            <p className="text-muted mb-0" style={{ fontSize: '0.82rem', marginTop: '2px' }}>Your saved resources — all in one place.</p>
                        </div>
                        <div className="flex-shrink-0">
                            <span className="d-inline-flex align-items-center gap-2 px-3 py-2 rounded-3"
                                style={{ background: 'rgba(4,189,32,0.08)', color: '#039419', fontSize: '0.8rem', fontWeight: 600 }}>
                                <i className="fa-solid fa-layer-group" style={{ fontSize: '0.75rem' }}></i>
                                {totalItems} Resources
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container-lg py-4 px-4">
                {/* Stats Cards — clickable to switch tabs */}
                <div className="row g-3 mb-4">
                    {stats.map((stat) => (
                        <div key={stat.key} className="col-6 col-lg-3">
                            <div
                                className={`card border-0 shadow-sm rounded-4 h-100 stat-card ${activeTab === stat.key ? 'stat-card--active' : ''}`}
                                onClick={() => setActiveTab(activeTab === stat.key ? 'all' : stat.key)}
                                style={{ cursor: 'pointer' }}
                            >
                                <div className="card-body d-flex justify-content-between align-items-center px-3 py-3">
                                    <div>
                                        <p className="text-muted text-uppercase mb-1 stat-label">{stat.label}</p>
                                        <p className="mb-0 stat-count">{stat.count}</p>
                                    </div>
                                    <div className={`rounded-3 bg-${stat.color} bg-opacity-10 d-flex align-items-center justify-content-center flex-shrink-0`} style={{ width: '44px', height: '44px' }}>
                                        <i className={`fa-solid ${stat.icon} text-${stat.color}`} style={{ fontSize: '1.15rem' }}></i>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Category Tabs */}
                <div className="bg-white rounded-3 border mb-4" style={{ padding: '4px' }}>
                    <ul className="nav gap-1 flex-nowrap overflow-auto" style={{ scrollbarWidth: 'none', padding: '2px' }}>
                        {TABS.map((tab) => (
                            <li key={tab.key} className="nav-item flex-shrink-0">
                                <button
                                    className={`tab-btn d-flex align-items-center gap-2 rounded-3 ${activeTab === tab.key ? 'tab-btn--active' : 'tab-btn--idle'}`}
                                    onClick={() => setActiveTab(tab.key)}
                                >
                                    <i className={`fa-solid ${tab.icon}`} style={{ fontSize: '0.8rem' }}></i>
                                    <span>{tab.label}</span>
                                    {tab.key !== 'all' && (
                                        <span className={`tab-count ${activeTab === tab.key ? 'tab-count--active' : ''}`}>
                                            {tab.key === 'notes' ? MyLearningNotes?.length || 0
                                                : tab.key === 'videos' ? MyLearningVideo?.length || 0
                                                    : tab.key === 'pyq' ? MyLearningPYQ?.length || 0
                                                        : MyLearningCourse?.length || 0}
                                        </span>
                                    )}
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Content Area */}
                {totalItems === 0 ? (
                    <div className="text-center py-5 bg-white rounded-4 shadow-sm border">
                        <i className="fa-solid fa-folder-open display-1 text-muted opacity-25 mb-4 d-block"></i>
                        <h4 className="text-muted fw-bold">Your library is empty</h4>
                        <p className="text-secondary">Start exploring and save resources to see them here!</p>
                        <a href="/cource" className="btn btn-green rounded-pill px-5 py-3 mt-2 fw-bold">
                            <i className="fa-solid fa-compass me-2"></i>Explore Courses
                        </a>
                    </div>
                ) : (
                    <div>
                        {/* Notes */}
                        {showNotes && MyLearningNotes?.length > 0 && (
                            <div className="mb-5">
                                <SectionHeader icon="fa-file-lines" color="success" title="Saved Notes" count={MyLearningNotes.length} unit="note" />
                                <div className="row g-4">
                                    {MyLearningNotes.map((note) => (
                                        <div key={note._id} className="col-xl-3 col-lg-4 col-md-6">
                                            <NotesItem notes={note} />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Videos */}
                        {showVideos && MyLearningVideo?.length > 0 && (
                            <div className="mb-5">
                                <SectionHeader icon="fa-circle-play" color="primary" title="Video Library" count={MyLearningVideo.length} unit="lecture" />
                                <div className="row g-4">
                                    {MyLearningVideo.map((video) => (
                                        <div key={video._id} className="col-xl-3 col-lg-4 col-md-6">
                                            <VideoItem video={video} />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Q-Papers */}
                        {showPYQ && MyLearningPYQ?.length > 0 && (
                            <div className="mb-5">
                                <SectionHeader icon="fa-circle-question" color="warning" title="Question Papers" count={MyLearningPYQ.length} unit="paper" />
                                <div className="row g-4">
                                    {MyLearningPYQ.map((pyq) => (
                                        <div key={pyq._id} className="col-xl-3 col-lg-4 col-md-6">
                                            <QPaperItem pyq={pyq} />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Courses */}
                        {showCourses && MyLearningCourse?.length > 0 && (
                            <div className="mb-5">
                                <SectionHeader icon="fa-book" color="info" title="Enrolled Courses" count={MyLearningCourse.length} unit="course" />
                                <div className="row g-4">
                                    {MyLearningCourse.map((course) => (
                                        <div key={course._id} className="col-xl-3 col-lg-4 col-md-6">
                                            <CourceIteam Course={course} />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Empty state for a specific tab */}
                        {((activeTab === 'notes' && !MyLearningNotes?.length) ||
                            (activeTab === 'videos' && !MyLearningVideo?.length) ||
                            (activeTab === 'pyq' && !MyLearningPYQ?.length) ||
                            (activeTab === 'courses' && !MyLearningCourse?.length)) && (
                                <div className="text-center py-5 bg-white rounded-4 shadow-sm border">
                                    <i className="fa-solid fa-inbox display-2 text-muted opacity-25 mb-3 d-block"></i>
                                    <h5 className="text-muted fw-bold">No {TABS.find(t => t.key === activeTab)?.label} saved yet</h5>
                                    <p className="text-secondary small">Explore and save {TABS.find(t => t.key === activeTab)?.label?.toLowerCase()} to see them here.</p>
                                </div>
                            )}
                    </div>
                )}
            </div>

            <style jsx>{`
                .text-green { color: #04bd20 !important; }
                .btn-green { background: #04bd20; color: white; border: none; font-weight: 600; }
                .btn-green:hover { background: #03a61c; color: white; }

                /* Stat cards */
                .stat-card { transition: all 0.22s; border: 1.5px solid transparent !important; background: white; }
                .stat-card:hover { transform: translateY(-2px); box-shadow: 0 6px 18px rgba(0,0,0,0.07) !important; }
                .stat-card--active { border-color: #04bd20 !important; background: rgba(4,189,32,0.03) !important; }
                .stat-label { font-size: 0.7rem; letter-spacing: 0.07em; font-weight: 600; }
                .stat-count { font-size: 1.6rem; font-weight: 700; color: #111; line-height: 1; }

                /* Tab buttons */
                .tab-btn { padding: 7px 16px; font-size: 0.84rem; font-weight: 500; border: none; background: transparent; color: #6b7280; cursor: pointer; transition: all 0.18s; white-space: nowrap; }
                .tab-btn--idle:hover { background: #f3f4f6; color: #111; }
                .tab-btn--active { background: #04bd20; color: white; font-weight: 600; }
                .tab-count { display: inline-flex; align-items: center; justify-content: center; min-width: 20px; height: 18px; border-radius: 50px; font-size: 0.68rem; font-weight: 700; padding: 0 5px; background: rgba(255,255,255,0.25); color: white; }
                .tab-count:not(.tab-count--active) { background: #e5e7eb; color: #6b7280; }
                .tab-count--active { background: rgba(255,255,255,0.3); color: white; }
            `}</style>
        </main>
    );
}
