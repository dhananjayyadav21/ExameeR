"use client";
import React, { useContext, useEffect, Suspense } from 'react';
import NotesItem from '../../components/NotesItem';
import VideoItem from '../../components/VideoItem';
import QPaperItem from '../../components/QPaperItem';
import ContentContext from '../../context/ContentContext';
import StudentLayout from '../../components/Home/StudentLayout';

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

    return (
        <StudentLayout title="Search Results">
            <div className="container-fluid px-0">
                <div className="mb-4">
                    <h2 className="fw-black mb-1" style={{ fontSize: '1.8rem' }}>
                        Search <span className="text-secondary opacity-50">/</span> Results
                    </h2>
                    <p className="text-muted small">Found {searchContentData.length} matches for your query</p>
                </div>

                {searchContentData.length > 0 ? (
                    <div>
                        {/* Notes */}
                        {notes.length > 0 && (
                            <div className="mb-5">
                                <div className="d-flex align-items-center gap-3 mb-4">
                                    <div className="bg-light rounded-3 d-flex align-items-center justify-content-center" style={{ width: '42px', height: '42px', backgroundColor: '#f0fdf4' }}>
                                        <i className="fa-solid fa-file-lines text-success fs-5"></i>
                                    </div>
                                    <h5 className="fw-bold text-dark mb-0">Notes ({notes.length})</h5>
                                </div>
                                <div className="row g-4">
                                    {notes.map((item, index) => (
                                        <div key={index} className="col-xl-4 col-lg-4 col-md-6">
                                            <NotesItem notes={item} />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Videos */}
                        {videos.length > 0 && (
                            <div className="mb-5">
                                <div className="d-flex align-items-center gap-3 mb-4">
                                    <div className="bg-light rounded-3 d-flex align-items-center justify-content-center" style={{ width: '42px', height: '42px', backgroundColor: '#eef2ff' }}>
                                        <i className="fa-solid fa-circle-play text-primary fs-5"></i>
                                    </div>
                                    <h5 className="fw-bold text-dark mb-0">Videos ({videos.length})</h5>
                                </div>
                                <div className="row g-4">
                                    {videos.map((item, index) => (
                                        <div key={index} className="col-xl-4 col-lg-4 col-md-6">
                                            <VideoItem video={item} />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Q-Papers */}
                        {pyqs.length > 0 && (
                            <div className="mb-5">
                                <div className="d-flex align-items-center gap-3 mb-4">
                                    <div className="bg-light rounded-3 d-flex align-items-center justify-content-center" style={{ width: '42px', height: '42px', backgroundColor: '#fffbeb' }}>
                                        <i className="fa-solid fa-circle-question text-warning fs-5"></i>
                                    </div>
                                    <h5 className="fw-bold text-dark mb-0">Question Papers ({pyqs.length})</h5>
                                </div>
                                <div className="row g-4">
                                    {pyqs.map((item, index) => (
                                        <div key={index} className="col-xl-4 col-lg-4 col-md-6">
                                            <QPaperItem pyq={item} />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="text-center py-5 bg-white rounded-5 border border-dashed mt-4">
                        <div className="bg-light rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3" style={{ width: '80px', height: '80px' }}>
                            <i className="fa-solid fa-magnifying-glass fs-2 text-muted opacity-30"></i>
                        </div>
                        <h4 className="fw-bold text-dark mb-1">No Results Found</h4>
                        <p className="text-muted small">We couldn't find any items matching your search. Try different keywords.</p>
                        <button className="btn btn-dark rounded-pill px-4 fw-bold mt-2 btn-sm" onClick={() => window.history.back()}>
                            Go Back
                        </button>
                    </div>
                )}
            </div>
        </StudentLayout>
    );
}


export default function SearchContentPage(props) {
    return (
        <Suspense fallback={
            <div className="d-flex align-items-center justify-content-center min-vh-100">
                <div className="spinner-border text-success" role="status"></div>
            </div>
        }>
            <SearchContent {...props} />
        </Suspense>
    );
}
