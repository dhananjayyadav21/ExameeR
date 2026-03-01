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
            <div className="container-fluid px-0 pb-5 ml-container">
                {/* Header Section */}
                <div className="ml-header d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-5 gap-4">
                    <div className="ml-header-text">
                        <h1 className="ml-title mb-1">My Digital Library</h1>
                        <p className="ml-subtitle text-muted mb-0">Your personalized sanctuary of knowledge and growth.</p>
                    </div>
                    <div className="ml-header-stats d-flex gap-2">
                        <div className="ml-total-badge">
                            <i className="fa-solid fa-bolt-lightning text-warning me-2"></i>
                            <span className="fw-bold">{totalItems}</span>
                            <span className="ms-1 opacity-75">Resources Saved</span>
                        </div>
                    </div>
                </div>

                {/* Stat Grid */}
                <div className="row g-3 mb-5">
                    {stats.map((stat) => (
                        <div key={stat.key} className="col-6 col-lg-3">
                            <div
                                className={`ml-stat-card ml-stat-card--${stat.color} ${activeTab === stat.key ? 'active' : ''}`}
                                onClick={() => setActiveTab(stat.key)}
                            >
                                <div className="ml-stat-icon">
                                    <i className={`fa-solid ${stat.icon}`}></i>
                                </div>
                                <div className="ml-stat-info">
                                    <span className="ml-stat-count">{stat.count}</span>
                                    <span className="ml-stat-label">{stat.label}</span>
                                </div>
                                {activeTab === stat.key && <div className="ml-stat-indicator"></div>}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Floating Navigation (Glassmorphism) */}
                <div className="ml-nav-wrapper sticky-top">
                    <div className="ml-glass-nav p-2">
                        <ul className="nav nav-pills nav-fill gap-2 flex-nowrap overflow-auto" style={{ scrollbarWidth: 'none' }}>
                            {TABS.map((tab) => (
                                <li key={tab.key} className="nav-item">
                                    <button
                                        className={`ml-nav-btn ${activeTab === tab.key ? 'active' : ''}`}
                                        onClick={() => setActiveTab(tab.key)}
                                    >
                                        <i className={`fa-solid ${tab.icon} me-2`}></i>
                                        <span className="d-none d-sm-inline">{tab.label}</span>
                                        <span className="ml-nav-count ms-2">
                                            {tab.key === 'notes' ? MyLearningNotes?.length || 0
                                                : tab.key === 'videos' ? MyLearningVideo?.length || 0
                                                    : tab.key === 'pyq' ? MyLearningPYQ?.length || 0
                                                        : MyLearningCourse?.length || 0}
                                        </span>
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Content Area */}
                <div className="ml-content-area mt-5">
                    {totalItems === 0 ? (
                        <div className="ml-empty-state text-center py-5">
                            <div className="ml-empty-icon mb-4">
                                <i className="fa-solid fa-cloud-moon display-1 opacity-25"></i>
                            </div>
                            <h3 className="fw-bold text-dark">A Quiet Library...</h3>
                            <p className="text-secondary mb-4 mx-auto" style={{ maxWidth: '400px' }}>You haven't saved any resources yet. Start exploring our vast collection to light up your library!</p>
                            <a href="/cource" className="ml-btn-explore">
                                <i className="fa-solid fa-compass me-2"></i>Explore Excellence
                            </a>
                        </div>
                    ) : (
                        <div className="ml-grid-wrapper animate-fade-in">
                            {/* Notes */}
                            {showNotes && MyLearningNotes?.length > 0 && (
                                <div className="ml-section">
                                    <SectionHeader icon="fa-file-lines" color="success" title="Scholarly Notes" count={MyLearningNotes.length} unit="note" />
                                    <div className="row g-4">
                                        {MyLearningNotes.map((note) => (
                                            <div key={note._id} className="col-xl-4 col-lg-4 col-md-6 ml-item-animate">
                                                <NotesItem notes={note} />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Videos */}
                            {showVideos && MyLearningVideo?.length > 0 && (
                                <div className="ml-section">
                                    <SectionHeader icon="fa-circle-play" color="primary" title="Visual Lectures" count={MyLearningVideo.length} unit="lecture" />
                                    <div className="row g-4">
                                        {MyLearningVideo.map((video) => (
                                            <div key={video._id} className="col-xl-4 col-lg-4 col-md-6 ml-item-animate">
                                                <VideoItem video={video} />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Q-Papers */}
                            {showPYQ && MyLearningPYQ?.length > 0 && (
                                <div className="ml-section">
                                    <SectionHeader icon="fa-circle-question" color="warning" title="Battle Tests (PYQs)" count={MyLearningPYQ.length} unit="paper" />
                                    <div className="row g-4">
                                        {MyLearningPYQ.map((pyq) => (
                                            <div key={pyq._id} className="col-xl-4 col-lg-4 col-md-6 ml-item-animate">
                                                <QPaperItem pyq={pyq} />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Courses */}
                            {showCourses && MyLearningCourse?.length > 0 && (
                                <div className="ml-section">
                                    <SectionHeader icon="fa-book" color="info" title="Masterclass Courses" count={MyLearningCourse.length} unit="course" />
                                    <div className="row g-4">
                                        {MyLearningCourse.map((course) => (
                                            <div key={course._id} className="col-xl-4 col-lg-4 col-md-6 ml-item-animate">
                                                <CourceIteam Course={course} />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Tab Specific Empty State */}
                            {((activeTab === 'notes' && !MyLearningNotes?.length) ||
                                (activeTab === 'videos' && !MyLearningVideo?.length) ||
                                (activeTab === 'pyq' && !MyLearningPYQ?.length) ||
                                (activeTab === 'courses' && !MyLearningCourse?.length)) && (
                                    <div className="ml-tab-empty text-center py-5">
                                        <div className="ml-empty-circle mx-auto mb-4">
                                            <i className={`fa-solid ${TABS.find(t => t.key === activeTab)?.icon} opacity-50`}></i>
                                        </div>
                                        <h4 className="fw-bold text-muted">No {TABS.find(t => t.key === activeTab)?.label} yet</h4>
                                        <p className="small text-secondary">Your collection in this category is waiting for you.</p>
                                    </div>
                                )}
                        </div>
                    )}
                </div>
            </div>

            <style jsx>{`
                .animate-fade-in { animation: fadeIn 0.4s ease-out; }
                @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
                
                .ml-container { max-width: 1400px; margin: 0 auto; }
                .ml-title { font-size: 2.2rem; font-weight: 850; color: #0f172a; letter-spacing: -0.02em; }
                .ml-subtitle { font-size: 1rem; font-weight: 500; }
                
                .ml-total-badge { background: #fff; border: 1px solid #e2e8f0; padding: 10px 20px; border-radius: 16px; font-size: 0.9rem; color: #475569; display: flex; align-items: center; box-shadow: 0 4px 10px rgba(0,0,0,0.03); }
                
                .ml-stat-card { position: relative; background: #fff; border-radius: 20px; padding: 20px; border: 1px solid #f1f5f9; cursor: pointer; display: flex; align-items: center; gap: 16px; transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1); }
                .ml-stat-card:hover { transform: translateY(-4px); box-shadow: 0 8px 15px rgba(0,0,0,0.05); border-color: #e2e8f0; }
                .ml-stat-card.active { border-color: #04bd20; background: #f0fdf4; box-shadow: 0 4px 12px rgba(4,189,31,0.1); }
                
                .ml-stat-icon { width: 44px; height: 44px; border-radius: 14px; display: flex; align-items: center; justify-content: center; font-size: 1.2rem; }
                .ml-stat-card--success .ml-stat-icon { background: #dcfce7; color: #16a34a; }
                .ml-stat-card--primary .ml-stat-icon { background: #dbeafe; color: #2563eb; }
                .ml-stat-card--warning .ml-stat-icon { background: #fef9c3; color: #ca8a04; }
                .ml-stat-card--info .ml-stat-icon { background: #e0f2fe; color: #0284c7; }
                
                .ml-stat-info { display: flex; flex-direction: column; }
                .ml-stat-count { font-size: 1.4rem; font-weight: 800; color: #0f172a; line-height: 1; }
                .ml-stat-label { font-size: 0.75rem; font-weight: 700; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.05em; margin-top: 4px; }
                
                .ml-stat-indicator { position: absolute; top: 12px; right: 12px; width: 6px; height: 6px; border-radius: 50%; background: #04bd20; }
                
                .ml-nav-wrapper { top: 20px; z-index: 100; padding: 0 10px; }
                .ml-glass-nav { background: rgba(255, 255, 255, 0.85); backdrop-filter: blur(12px); border: 1px solid rgba(255, 255, 255, 0.4); border-radius: 18px; box-shadow: 0 8px 32px rgba(0, 0, 0, 0.06); }
                
                .ml-nav-btn { width: 100%; border: none; padding: 12px 18px; border-radius: 14px; background: transparent; color: #64748b; font-weight: 700; font-size: 0.9rem; transition: all 0.2s; display: flex; align-items: center; justify-content: center; }
                .ml-nav-btn:hover { background: rgba(0,0,0,0.03); color: #0f172a; }
                .ml-nav-btn.active { background: #0f172a; color: #fff; box-shadow: 0 4px 12px rgba(15, 23, 42, 0.2); }
                
                .ml-nav-count { font-size: 0.7rem; padding: 2px 8px; border-radius: 20px; background: rgba(0,0,0,0.08); font-weight: 800; }
                .ml-nav-btn.active .ml-nav-count { background: rgba(255, 255, 255, 0.2); color: #fff; }
                
                .ml-btn-explore { display: inline-flex; align-items: center; background: linear-gradient(135deg, #04bd20 0%, #03a61c 100%); color: #fff; border: none; padding: 16px 36px; border-radius: 18px; font-weight: 800; text-decoration: none; transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1); box-shadow: 0 10px 25px -5px rgba(4,189,32,0.4); }
                .ml-btn-explore:hover { transform: translateY(-4px); box-shadow: 0 15px 35px -5px rgba(4,189,32,0.5); color: #fff; }
                
                .ml-empty-circle { width: 80px; height: 80px; border-radius: 50%; background: #f8fafc; display: flex; align-items: center; justify-content: center; font-size: 2rem; color: #94a3b8; border: 2px dashed #e2e8f0; }
                
                .ml-item-animate { animation: itemSlide 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards; opacity: 0; }
                .ml-item-animate:nth-child(2) { animation-delay: 0.1s; }
                .ml-item-animate:nth-child(3) { animation-delay: 0.2s; }
                .ml-item-animate:nth-child(4) { animation-delay: 0.3s; }
                
                @keyframes itemSlide { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
                
                @media (max-width: 768px) {
                    .ml-title { font-size: 1.7rem; }
                    .ml-stat-card { padding: 14px; gap: 10px; }
                    .ml-stat-count { font-size: 1.1rem; }
                    .ml-nav-btn { padding: 10px; }
                }
            `}</style>
        </StudentLayout>
    );
}
