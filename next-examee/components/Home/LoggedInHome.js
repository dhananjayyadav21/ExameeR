"use client";
import React, { useContext, useEffect, useState } from 'react';
import Link from 'next/link';
import ContentContext from '../../context/ContentContext';
import NotesItem from '../NotesItem';
import VideoItem from '../VideoItem';
import QPaperItem from '../QPaperItem';
import CourceIteam from './CourceIteam';

const LoggedInHome = ({ userData }) => {
    const context = useContext(ContentContext);
    const { Course, getCourse, Notes, getNote, PYQS, getPYQ, Video, getVideo } = context;
    const [searchTerm, setSearchTerm] = useState('');
    const [activeTab, setActiveTab] = useState('Course');

    useEffect(() => {
        getCourse();
        getNote();
        getPYQ();
        getVideo();
    }, []);

    const sidebarMenu = [
        {
            section: "LEARN Today",
            items: [
                { label: "Notes", icon: "fa-file-lines", id: "Notes" },
                { label: "PYQ", icon: "fa-circle-question", id: "PYQ" },
                { label: "Video", icon: "fa-circle-play", id: "Video" },
            ]
        },
        {
            section: "STUDY PACKS",
            items: [
                { label: "Course", icon: "fa-layer-group", id: "Course" },
                { label: "Mock Test", icon: "fa-vial", id: "Mock Test" },
            ]
        },
        {
            section: "EXPLORE EXAMEE",
            items: [
                { label: "Examee Books", icon: "fa-book", id: "Books" },
                { label: "Call Book", icon: "fa-headset", id: "Call" },
            ]
        }
    ];

    const getCurrentData = () => {
        switch (activeTab) {
            case 'Notes': return Notes;
            case 'PYQ': return PYQS;
            case 'Video': return Video;
            case 'Course': return Course;
            default: return [];
        }
    };

    const currentData = getCurrentData();

    const filteredData = currentData.filter(item =>
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.courseLevel?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.category?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getBatchColor = (idx) => {
        const colors = ['#e1f5fe', '#fff9c4', '#e8f5e9', '#f3e5f5'];
        return colors[idx % colors.length];
    };

    const getDisplayTitle = (item) => {
        if (activeTab === 'Notes') return 'NOTES';
        if (activeTab === 'PYQ') return 'PYQ';
        if (activeTab === 'Video') return 'VIDEO';
        return item.courseLevel || 'BATCH';
    }

    return (
        <div className="li-home-wrapper">
            {/* Sidebar */}
            <aside className="li-sidebar shadow-sm">
                <div className="px-4 mb-5 pt-3">
                    <Link href="/" className="text-decoration-none d-flex align-items-center gap-2">
                        <img src="/assets/img/brandlog.png" alt="Examee" style={{ height: "32px", width: "auto" }} />
                    </Link>
                </div>

                {sidebarMenu.map((sec, idx) => (
                    <div key={idx} className="li-nav-section">
                        <p className="li-section-label">{sec.section}</p>
                        {sec.items.map((item, i) => (
                            <button
                                key={i}
                                onClick={() => setActiveTab(item.id)}
                                className={`li-menu-item w-100 border-0 bg-transparent text-start ${activeTab === item.id ? 'li-menu-item--active' : ''}`}
                            >
                                <span className="li-menu-icon"><i className={`fa-solid ${item.icon}`}></i></span>
                                <span>{item.label}</span>
                                {item.badge && <span className="li-badge-new">{item.badge}</span>}
                            </button>
                        ))}
                    </div>
                ))}

                {/* Sidebar Support Card */}
                <div className="mx-3 mt-4 p-3 rounded-4 bg-light border opacity-75 d-none d-xl-block">
                    <p className="fw-bold small mb-1">Need help?</p>
                    <p className="smaller text-muted mb-2">Get 24/7 priority support from Examee Team.</p>
                    <button className="btn btn-dark w-100 rounded-pill btn-sm py-1 fw-bold smaller">Get Support</button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="li-main">
                <header className="li-header">
                    <div className="d-flex align-items-center gap-4">
                        <h6 className="fw-bold mb-0 text-muted opacity-50">Exploration / <span className="text-dark">{activeTab}</span></h6>
                        <div className="li-search-box">
                            <i className="fa-solid fa-magnifying-glass text-muted small"></i>
                            <input
                                type="text"
                                placeholder={`Search through our library...`}
                                className="li-search-input"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="li-user-greet">
                        <div className="d-flex align-items-center me-3 gap-3 d-none d-md-flex">
                            <div className="btn btn-light rounded-circle shadow-sm border p-2" style={{ width: '40px', height: '40px' }}>
                                <i className="fa-regular fa-bell"></i>
                            </div>
                            <div className="btn btn-light rounded-circle shadow-sm border p-2" style={{ width: '40px', height: '40px' }}>
                                <i className="fa-solid fa-gear"></i>
                            </div>
                        </div>
                        <div className="li-greet-text">
                            <p className="li-greet-hi fw-bold">Hi, {userData?.FirstName || 'dhananjay'}</p>
                            <p className="smaller text-success mb-0 fw-bold"><i className="fa-solid fa-circle small me-1" style={{ fontSize: '0.5rem' }}></i>Pro Student</p>
                        </div>
                        <img
                            src={userData?.Profile ? (userData.Profile.startsWith('http') ? userData.Profile : `https://lh3.googleusercontent.com/d/${userData.Profile}`) : "/assets/img/Avtar.jpg"}
                            className="li-user-avatar border-2 shadow-sm"
                            alt="User"
                        />
                    </div>
                </header>

                <div className="px-5 py-4">
                    <div className="mb-4">
                        <p className="fw-bold text-muted small mb-1 ls-wide" style={{ letterSpacing: '0.05em' }}>{activeTab === 'Course' ? 'Batches' : 'Study Packs'}</p>
                        <h2 className="fw-black mb-1" style={{ fontSize: '1.8rem' }}>All {activeTab}s</h2>
                        <p className="text-muted small">{filteredData.length} {activeTab.toLowerCase()}s available</p>
                    </div>

                    <div className="d-flex gap-2 mb-4">
                        <button className="btn btn-white rounded-pill border px-3 py-1 btn-sm d-flex align-items-center gap-2 fw-bold shadow-sm">
                            Filter <i className="fa-solid fa-sliders small"></i>
                        </button>
                        <button className="btn btn-white rounded-pill border px-3 py-1 btn-sm fw-bold shadow-sm">Online</button>
                    </div>

                    <div className="row g-4 mt-2">
                        {filteredData.map((item, idx) => (
                            <div key={idx} className="col-xl-3 col-lg-4 col-md-6 animate-scale-in" style={{ animationDelay: `${idx * 0.05}s` }}>
                                {activeTab === 'Notes' && <NotesItem notes={item} />}
                                {activeTab === 'PYQ' && <QPaperItem pyq={item} />}
                                {activeTab === 'Video' && <VideoItem video={item} />}
                                {activeTab === 'Course' && <CourceIteam Course={item} />}
                                {activeTab === 'Mock Test' && (
                                    <div className="card h-100 border-0 shadow-sm rounded-4 p-4 text-center">
                                        <div className="bg-light rounded-circle mx-auto mb-3 d-flex align-items-center justify-content-center" style={{ width: '60px', height: '60px' }}>
                                            <i className="fa-solid fa-vial fs-4 text-muted"></i>
                                        </div>
                                        <h6 className="fw-bold mb-1">Practice Test</h6>
                                        <p className="smaller text-muted mb-3">{item.title || "Subject Mock Test"}</p>
                                        <button className="btn btn-outline-dark rounded-pill btn-sm fw-bold">Start Test</button>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    {filteredData.length === 0 && (
                        <div className="text-center py-5 bg-light rounded-5 mt-4 border border-dashed">
                            <div className="bg-white shadow-sm rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3" style={{ width: '80px', height: '80px' }}>
                                <i className="fa-solid fa-magnifying-glass fs-2 text-muted opacity-50"></i>
                            </div>
                            <h4 className="fw-bold text-dark mb-1">No {activeTab} Found</h4>
                            <p className="text-muted">We couldn't find any results matching your search criteria.</p>
                            <button className="btn btn-purple-primary rounded-pill px-4 fw-bold mt-2" onClick={() => setSearchTerm('')} style={{ backgroundColor: '#7c3aed', color: '#fff', border: 'none' }}>Clear Search</button>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default LoggedInHome;
