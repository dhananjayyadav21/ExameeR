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
            {/* Top Header — clean inline style, no big dark banner */}
            <div className="bg-white border-bottom py-4">
                <div className="container-lg px-4">
                    <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3">
                        <div>
                            <nav aria-label="breadcrumb" className="mb-1">
                                <ol className="breadcrumb small mb-0">
                                    <li className="breadcrumb-item"><a href="/" className="text-decoration-none text-muted">Home</a></li>
                                    <li className="breadcrumb-item active text-green fw-medium">My Learning</li>
                                </ol>
                            </nav>
                            <h2 className="fw-bold text-dark mb-0 mt-1">My <span className="text-green">Learning Hub</span></h2>
                            <p className="text-muted small mb-0 mt-1">Your saved resources — all in one place.</p>
                        </div>
                        <div className="d-flex align-items-center gap-2">
                            <span className="badge bg-green-soft text-green fw-bold px-3 py-2 rounded-pill">
                                <i className="fa-solid fa-layer-group me-1"></i> {totalItems} Total Resources
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
                                <div className="card-body d-flex justify-content-between align-items-center p-3 p-md-4">
                                    <div>
                                        <p className="small text-muted fw-bold text-uppercase mb-1" style={{ fontSize: '0.72rem', letterSpacing: '0.08em' }}>{stat.label}</p>
                                        <h2 className="fw-bold m-0">{stat.count}</h2>
                                    </div>
                                    <div className={`rounded-3 bg-${stat.color} bg-opacity-10 d-flex align-items-center justify-content-center`} style={{ width: '52px', height: '52px' }}>
                                        <i className={`fa-solid ${stat.icon} text-${stat.color} fs-4`}></i>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Category Tabs */}
                <div className="bg-white rounded-4 shadow-sm border mb-4 p-1">
                    <ul className="nav nav-pills gap-1 p-1 flex-nowrap overflow-auto" style={{ scrollbarWidth: 'none' }}>
                        {TABS.map((tab) => (
                            <li key={tab.key} className="nav-item flex-shrink-0">
                                <button
                                    className={`nav-link fw-medium px-4 py-2 rounded-3 d-flex align-items-center gap-2 ${activeTab === tab.key ? 'nav-active' : 'text-muted'}`}
                                    onClick={() => setActiveTab(tab.key)}
                                >
                                    <i className={`fa-solid ${tab.icon}`}></i>
                                    {tab.label}
                                    {tab.key !== 'all' && (
                                        <span className={`badge rounded-pill ms-1 ${activeTab === tab.key ? 'bg-white text-green' : 'bg-light text-muted'}`} style={{ fontSize: '0.72rem' }}>
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
                                <div className="d-flex align-items-center gap-3 mb-3">
                                    <div className="rounded-3 bg-success bg-opacity-10 d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px' }}>
                                        <i className="fa-solid fa-file-lines text-success"></i>
                                    </div>
                                    <div>
                                        <h5 className="fw-bold text-dark mb-0">Saved Notes</h5>
                                        <p className="text-muted small mb-0">{MyLearningNotes.length} note{MyLearningNotes.length > 1 ? 's' : ''} saved</p>
                                    </div>
                                </div>
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
                                <div className="d-flex align-items-center gap-3 mb-3">
                                    <div className="rounded-3 bg-primary bg-opacity-10 d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px' }}>
                                        <i className="fa-solid fa-circle-play text-primary"></i>
                                    </div>
                                    <div>
                                        <h5 className="fw-bold text-dark mb-0">Video Library</h5>
                                        <p className="text-muted small mb-0">{MyLearningVideo.length} lecture{MyLearningVideo.length > 1 ? 's' : ''} saved</p>
                                    </div>
                                </div>
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
                                <div className="d-flex align-items-center gap-3 mb-3">
                                    <div className="rounded-3 bg-warning bg-opacity-10 d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px' }}>
                                        <i className="fa-solid fa-circle-question text-warning"></i>
                                    </div>
                                    <div>
                                        <h5 className="fw-bold text-dark mb-0">Question Papers</h5>
                                        <p className="text-muted small mb-0">{MyLearningPYQ.length} paper{MyLearningPYQ.length > 1 ? 's' : ''} saved</p>
                                    </div>
                                </div>
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
                                <div className="d-flex align-items-center gap-3 mb-3">
                                    <div className="rounded-3 bg-info bg-opacity-10 d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px' }}>
                                        <i className="fa-solid fa-book text-info"></i>
                                    </div>
                                    <div>
                                        <h5 className="fw-bold text-dark mb-0">Enrolled Courses</h5>
                                        <p className="text-muted small mb-0">{MyLearningCourse.length} course{MyLearningCourse.length > 1 ? 's' : ''} enrolled</p>
                                    </div>
                                </div>
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

            <Footer />

            <style jsx>{`
                .text-green { color: #04bd20 !important; }
                .bg-green-soft { background-color: rgba(4, 189, 32, 0.1) !important; }
                .btn-green { background: #04bd20; color: white; border: none; }
                .btn-green:hover { background: #03a61c; color: white; }
                .stat-card { transition: all 0.25s; border: 2px solid transparent !important; }
                .stat-card:hover { transform: translateY(-3px); box-shadow: 0 8px 20px rgba(0,0,0,0.07) !important; }
                .stat-card--active { border: 2px solid #04bd20 !important; background: rgba(4,189,32,0.03) !important; }
                .nav-active { background: linear-gradient(135deg, #04bd20, #039419) !important; color: white !important; }
                .nav-link { transition: all 0.2s; border: none; background: transparent; }
                .nav-link:hover:not(.nav-active) { background: #f8f9fa !important; color: #333 !important; }
            `}</style>
        </main>
    );
}
