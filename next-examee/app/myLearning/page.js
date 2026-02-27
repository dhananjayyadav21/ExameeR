"use client";
import React, { useContext, useEffect, useState } from 'react';
import NotesItem from "../../components/NotesItem"
import VideoItem from "../../components/VideoItem"
import QPaperItem from "../../components/QPaperItem"
import CourceIteam from "../../components/Home/CourceIteam"
import Footer from '../../components/Footer';
import ContentContext from '../../context/ContentContext'

const TABS = [
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
                <h2 className="mb-0 text-dark" style={{ fontSize: '0.95rem', fontWeight: 600, letterSpacing: '-0.01em' }}>{title}</h2>
                <p className="mb-0" style={{ fontSize: '0.72rem', color: '#9ca3af', fontWeight: 500, marginTop: '1px' }}>
                    {count} {unit}{count !== 1 ? 's' : ''} saved
                </p>
            </div>
        </div>
    );
}

import StudentLayout from '../../components/Home/StudentLayout';

export default function MyLearningPage({ setProgress = () => { } }) {
    const context = useContext(ContentContext);
    const { getDataFromMyLearning, MyLearningNotes, MyLearningVideo, MyLearningPYQ, MyLearningCourse } = context;
    const [activeTab, setActiveTab] = useState('notes');

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

    const showNotes = activeTab === 'notes';
    const showVideos = activeTab === 'videos';
    const showPYQ = activeTab === 'pyq';
    const showCourses = activeTab === 'courses';

    return (
        <StudentLayout title="My Library">
            <div className="container-fluid px-0">
                <div className="d-flex justify-content-between align-items-center mb-5">
                    <div>
                        <h2 className="fw-black mb-1" style={{ fontSize: '1.8rem' }}>My Library</h2>
                        <p className="text-muted small mb-0">Your saved resources — all in one place.</p>
                    </div>
                    <div className="flex-shrink-0">
                        <span className="d-inline-flex align-items-center gap-2 px-3 py-2 rounded-3 shadow-sm border bg-white"
                            style={{ color: '#039419', fontSize: '0.8rem', fontWeight: 600 }}>
                            <i className="fa-solid fa-layer-group" style={{ fontSize: '0.75rem' }}></i>
                            {totalItems} Resources
                        </span>
                    </div>
                </div>

                {/* Stats Cards — clickable to switch tabs */}
                <div className="row g-3 mb-4">
                    {stats.map((stat) => (
                        <div key={stat.key} className="col-6 col-lg-3">
                            <div
                                className={`card border-1 shadow-sm rounded-4 h-100 stat-card transition-all ${activeTab === stat.key ? 'stat-card--active shadow' : 'bg-white'}`}
                                onClick={() => setActiveTab(activeTab === stat.key ? 'all' : stat.key)}
                                style={{ cursor: 'pointer', border: activeTab === stat.key ? '1px solid #04bd20' : '1px solid transparent' }}
                            >
                                <div className="card-body d-flex justify-content-between align-items-center px-3 py-3">
                                    <div>
                                        <p className="text-muted text-uppercase mb-1 stat-label" style={{ fontSize: '0.65rem' }}>{stat.label}</p>
                                        <p className="mb-0 stat-count" style={{ fontSize: '1.3rem' }}>{stat.count}</p>
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
                <div className="bg-white rounded-4 border shadow-sm mb-4 p-1">
                    <ul className="nav gap-1 flex-nowrap overflow-auto" style={{ scrollbarWidth: 'none' }}>
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
                                        <div key={note._id} className="col-xl-4 col-lg-4 col-md-6">
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
                                        <div key={video._id} className="col-xl-4 col-lg-4 col-md-6">
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
                                        <div key={pyq._id} className="col-xl-4 col-lg-4 col-md-6">
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
                                        <div key={course._id} className="col-xl-4 col-lg-4 col-md-6">
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

        </StudentLayout>
    );
}

