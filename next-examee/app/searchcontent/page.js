"use client";
import React, { useContext, useEffect, Suspense } from 'react'
import NotesItem from '../../components/NotesItem';
import VideoItem from '../../components/VideoItem';
import QPaperItem from '../../components/QPaperItem';
import ContentContext from '../../context/ContentContext';

function SearchContent({ setProgress = () => { } }) {
    const context = useContext(ContentContext);
    const { searchContentData = [] } = context;

    useEffect(() => {
        setProgress(0);
        setProgress(100);
    }, []);

    const notes = searchContentData.filter(i => i.type === 'note');
    const videos = searchContentData.filter(i => i.type === 'video');
    const pyqs = searchContentData.filter(i => i.type === 'pyq');

    const typeCount = [
        { label: 'Notes', count: notes.length, icon: 'fa-file-lines', color: '#04bd20', bg: 'rgba(4,189,32,0.1)' },
        { label: 'Videos', count: videos.length, icon: 'fa-circle-play', color: '#6366f1', bg: 'rgba(99,102,241,0.1)' },
        { label: 'Q-Papers', count: pyqs.length, icon: 'fa-circle-question', color: '#f59e0b', bg: 'rgba(245,158,11,0.1)' },
    ];

    return (
        <main className="sc-page">
            {/* Hero Banner */}
            <div className="sc-hero">
                <div className="sc-hero-bg sc-blob1"></div>
                <div className="sc-hero-bg sc-blob2"></div>
                <div className="sc-hero-content">
                    <div className="sc-hero-icon">
                        <i className="fa-solid fa-magnifying-glass"></i>
                    </div>
                    <h1 className="sc-hero-title">
                        Found <span className="sc-hero-count">{searchContentData.length}</span> Results
                    </h1>
                    <p className="sc-hero-sub">
                        Your study material, just a click away. Smart search for smarter studies.
                    </p>

                    {/* Type pills */}
                    {searchContentData.length > 0 && (
                        <div className="sc-type-pills">
                            {typeCount.filter(t => t.count > 0).map((t, i) => (
                                <span key={i} className="sc-pill" style={{ background: t.bg, color: t.color, border: `1px solid ${t.color}33` }}>
                                    <i className={`fa-solid ${t.icon}`}></i>
                                    {t.count} {t.label}
                                </span>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <div className="container px-4 py-5">
                {searchContentData.length > 0 ? (
                    <div>
                        {/* Notes */}
                        {notes.length > 0 && (
                            <div className="sc-section mb-5">
                                <div className="sc-section-header">
                                    <div className="sc-section-icon" style={{ background: 'rgba(4,189,32,0.1)' }}>
                                        <i className="fa-solid fa-file-lines" style={{ color: '#04bd20' }}></i>
                                    </div>
                                    <h2 className="sc-section-title">Notes <span className="sc-section-badge">{notes.length}</span></h2>
                                </div>
                                <div className="row g-3">
                                    {notes.map((item, index) => (
                                        <div key={index} className="col-xl-3 col-lg-4 col-md-6">
                                            <NotesItem notes={item} />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Videos */}
                        {videos.length > 0 && (
                            <div className="sc-section mb-5">
                                <div className="sc-section-header">
                                    <div className="sc-section-icon" style={{ background: 'rgba(99,102,241,0.1)' }}>
                                        <i className="fa-solid fa-circle-play" style={{ color: '#6366f1' }}></i>
                                    </div>
                                    <h2 className="sc-section-title">Videos <span className="sc-section-badge" style={{ background: 'rgba(99,102,241,0.1)', color: '#6366f1' }}>{videos.length}</span></h2>
                                </div>
                                <div className="row g-3">
                                    {videos.map((item, index) => (
                                        <div key={index} className="col-lg-6">
                                            <VideoItem video={item} />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Q-Papers */}
                        {pyqs.length > 0 && (
                            <div className="sc-section mb-5">
                                <div className="sc-section-header">
                                    <div className="sc-section-icon" style={{ background: 'rgba(245,158,11,0.1)' }}>
                                        <i className="fa-solid fa-circle-question" style={{ color: '#f59e0b' }}></i>
                                    </div>
                                    <h2 className="sc-section-title">Question Papers <span className="sc-section-badge" style={{ background: 'rgba(245,158,11,0.1)', color: '#d97706' }}>{pyqs.length}</span></h2>
                                </div>
                                <div className="row g-3">
                                    {pyqs.map((item, index) => (
                                        <div key={index} className="col-xl-3 col-lg-4 col-md-6">
                                            <QPaperItem pyq={item} />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="sc-empty">
                        <div className="sc-empty-icon">
                            <i className="fa-solid fa-folder-open"></i>
                        </div>
                        <h3 className="sc-empty-title">No Results Found</h3>
                        <p className="sc-empty-sub">Try adjusting your keywords or search for a different category.</p>
                        <a href="/" className="sc-empty-btn">
                            <i className="fa-solid fa-house me-2"></i>Back to Home
                        </a>
                    </div>
                )}
            </div>

            <style jsx>{`
                .sc-page { min-height: 100vh; background: #f8fafc; }

                /* Hero */
                .sc-hero {
                    position: relative;
                    background: linear-gradient(135deg, #0a1628 0%, #0d3320 60%, #0a1628 100%);
                    padding: 60px 20px;
                    text-align: center;
                    overflow: hidden;
                }
                .sc-hero-bg { position: absolute; border-radius: 50%; filter: blur(70px); opacity: 0.2; }
                .sc-blob1 { width: 400px; height: 400px; background: #04bd20; top: -100px; left: -100px; }
                .sc-blob2 { width: 350px; height: 350px; background: #6366f1; bottom: -80px; right: -80px; }
                .sc-hero-content { position: relative; z-index: 1; }
                .sc-hero-icon {
                    width: 60px; height: 60px; border-radius: 18px;
                    background: linear-gradient(135deg, #04bd20, #06d6a0);
                    display: flex; align-items: center; justify-content: center;
                    margin: 0 auto 20px;
                    font-size: 1.4rem; color: white;
                    box-shadow: 0 8px 24px rgba(4,189,32,0.35);
                }
                .sc-hero-title { font-size: clamp(1.6rem,4vw,2.2rem); font-weight: 900; color: white; margin: 0 0 10px; letter-spacing: -0.03em; }
                .sc-hero-count { background: linear-gradient(135deg,#04bd20,#6ee7b7); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
                .sc-hero-sub { color: rgba(255,255,255,0.55); font-size: 0.95rem; max-width: 480px; margin: 0 auto 24px; line-height: 1.6; }

                .sc-type-pills { display: flex; flex-wrap: wrap; justify-content: center; gap: 10px; }
                .sc-pill {
                    display: inline-flex; align-items: center; gap: 6px;
                    padding: 7px 16px; border-radius: 50px;
                    font-size: 0.8rem; font-weight: 600;
                }

                /* Section */
                .sc-section-header { display: flex; align-items: center; gap: 12px; margin-bottom: 18px; }
                .sc-section-icon {
                    width: 38px; height: 38px; border-radius: 10px;
                    display: flex; align-items: center; justify-content: center;
                    font-size: 0.95rem; flex-shrink: 0;
                }
                .sc-section-title { font-size: 1rem; font-weight: 700; color: #0f172a; margin: 0; display: flex; align-items: center; gap: 8px; }
                .sc-section-badge { background: rgba(4,189,32,0.1); color: #039419; font-size: 0.72rem; font-weight: 700; padding: 2px 8px; border-radius: 50px; }

                /* Empty state */
                .sc-empty { text-align: center; padding: 60px 20px; }
                .sc-empty-icon {
                    width: 80px; height: 80px; border-radius: 22px;
                    background: #f1f5f9;
                    display: flex; align-items: center; justify-content: center;
                    font-size: 2rem; color: #cbd5e1;
                    margin: 0 auto 20px;
                }
                .sc-empty-title { font-size: 1.3rem; font-weight: 700; color: #1e293b; margin: 0 0 8px; }
                .sc-empty-sub { color: #64748b; font-size: 0.9rem; margin: 0 0 24px; }
                .sc-empty-btn {
                    display: inline-flex; align-items: center;
                    padding: 12px 28px; border-radius: 12px;
                    background: linear-gradient(135deg,#04bd20,#03a61c);
                    color: white; text-decoration: none;
                    font-size: 0.9rem; font-weight: 700;
                    box-shadow: 0 4px 14px rgba(4,189,32,0.3);
                    transition: all 0.2s;
                }
                .sc-empty-btn:hover { transform: translateY(-1px); box-shadow: 0 6px 20px rgba(4,189,32,0.4); color: white; }
            `}</style>
        </main>
    );
}

export default function SearchContentPage(props) {
    return (
        <Suspense fallback={<div className="container py-5 text-center p-5"><div className="spinner-border text-success" role="status"></div></div>}>
            <SearchContent {...props} />
        </Suspense>
    );
}
