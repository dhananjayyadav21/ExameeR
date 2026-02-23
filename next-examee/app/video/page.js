"use client";
import React, { useContext, useEffect, useState, Suspense } from "react";
import VideoItem from "../../components/VideoItem";
import ContentContext from '../../context/ContentContext';
import * as GlobalUrls from "../../utils/GlobalURL";
import { useRouter, useSearchParams } from "next/navigation";

function VideoContent({ setProgress = () => { } }) {
    const searchParams = useSearchParams();
    const router = useRouter();
    const context = useContext(ContentContext);
    const { Video, getVideo } = context;

    const category = searchParams.get('category') || 'sciTechnology';
    const sortBy = searchParams.get('sortBy') || 'latest';

    useEffect(() => {
        setProgress(0);
        if (typeof window !== 'undefined' && localStorage.getItem('token')) {
            getVideo(`${GlobalUrls.GETVideo_URL}?category=${category}&sortBy=${sortBy}`);
        }
        setProgress(100);
    }, [category, sortBy]);

    const handleSortByChange = (sortBy) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set('sortBy', sortBy);
        router.push(`?${params.toString()}`);
    }

    const [currentPage, setCurrentPage] = useState(1);
    const videoPerPage = 8;
    const totalPages = Math.ceil(Video.length / videoPerPage);
    const indexOfLastVideo = currentPage * videoPerPage;
    const indexOfFirstVideo = indexOfLastVideo - videoPerPage;
    const currentVideo = Video.slice(indexOfFirstVideo, indexOfLastVideo);

    const getPageNumbers = () => {
        const pages = [];
        const startPage = Math.max(1, currentPage - 1);
        const endPage = Math.min(totalPages, currentPage + 1);
        for (let i = startPage; i <= endPage; i++) {
            pages.push(i);
        }
        return pages;
    };

    return (
        <main className="bg-light min-vh-100">
            {/* Professional Video Hero */}
            <div className="bg-white border-bottom py-5">
                <div className="container px-4">
                    <div className="row align-items-center">
                        <div className="col-lg-7">
                            <nav aria-label="breadcrumb" className="mb-3">
                                <ol className="breadcrumb small text-uppercase fw-bold ls-wide">
                                    <li className="breadcrumb-item"><a href="/" className="text-decoration-none text-muted">Home</a></li>
                                    <li className="breadcrumb-item active text-primary" aria-current="page">Video Lectures</li>
                                </ol>
                            </nav>
                            <h1 className="display-5 fw-bold mb-3">Learn Smarter with <span className="text-gradient">Video Lessons</span></h1>
                            <p className="lead text-secondary mb-0">
                                "Learn Anytime, Anywhere with Expert-Led Video Lectures". Access professional quality education at your own pace.
                            </p>
                        </div>
                        <div className="col-lg-5 d-none d-lg-block text-end">
                            <div className="p-4 bg-danger-subtle rounded-4 d-inline-block shadow-sm boop-hover transition-all">
                                <i className="fa-solid fa-play display-4 text-danger"></i>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container py-5 px-4">
                {/* Header & Controls */}
                <div className="d-flex flex-column flex-md-row justify-content-between align-items-center mb-5 gap-3">
                    <h5 className="fw-bold mb-0">Curated Lectures</h5>
                    <div className="dropdown">
                        <button className="btn btn-white shadow-sm border rounded-pill px-4 py-2 dropdown-toggle fw-medium" type="button" data-bs-toggle="dropdown">
                            <i className="fa-solid fa-arrow-down-wide-short me-2 text-muted"></i>
                            Sort by: <span className="text-primary">{sortBy === 'latest' ? 'Newest' : 'Oldest'}</span>
                        </button>
                        <ul className="dropdown-menu dropdown-menu-end shadow-lg border-0">
                            <li><button className="dropdown-item py-2" onClick={() => handleSortByChange('latest')}>Latest Videos</button></li>
                            <li><button className="dropdown-item py-2" onClick={() => handleSortByChange('oldest')}>Oldest Videos</button></li>
                        </ul>
                    </div>
                </div>

                {/* Video Grid */}
                <div className="row g-4">
                    {Video.length === 0 ? (
                        <div className="col-12 py-5 text-center">
                            <div className="p-5 bg-white rounded-4 shadow-sm">
                                <i className="fa-solid fa-video-slash display-1 text-muted opacity-25 mb-4"></i>
                                <h4 className="text-muted">No video lectures found</h4>
                                <p className="text-secondary">We are currently updating our library. Check back later!</p>
                                <div className="mt-4 d-flex justify-content-center gap-2">
                                    {[1, 2, 3, 4].map(i => <div key={i} className="spinner-grow spinner-grow-sm text-primary opacity-50" role="status"></div>)}
                                </div>
                            </div>
                        </div>
                    ) : (
                        currentVideo?.map((video) => (
                            <div key={video._id} className="col-lg-6">
                                <VideoItem video={video} />
                            </div>
                        ))
                    )}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="d-flex justify-content-center mt-5">
                        <nav className="shadow-sm rounded-pill bg-white p-2 border">
                            <ul className="pagination mb-0 border-0">
                                <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                                    <button onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} className="page-link border-0 rounded-circle mx-1">
                                        <i className="fa-solid fa-chevron-left"></i>
                                    </button>
                                </li>
                                {getPageNumbers().map(page => (
                                    <li key={page} className="page-item">
                                        <button
                                            onClick={() => setCurrentPage(page)}
                                            className={`page-link border-0 rounded-circle mx-1 fw-bold ${currentPage === page ? 'bg-primary text-white shadow-sm' : 'text-muted'}`}
                                        >
                                            {page}
                                        </button>
                                    </li>
                                ))}
                                <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                                    <button onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} className="page-link border-0 rounded-circle mx-1">
                                        <i className="fa-solid fa-chevron-right"></i>
                                    </button>
                                </li>
                            </ul>
                        </nav>
                    </div>
                )}
            </div>

            <style jsx>{`
                .text-gradient { background: var(--primary-gradient); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
                .ls-wide { letter-spacing: 0.1em; }
                .btn-white { background: #fff; }
                .boop-hover:hover { transform: scale(1.05) rotate(5deg); }
                .bg-danger-subtle { background: rgba(220, 53, 69, 0.1); }
                .transition-all { transition: all 0.3s cubic-bezier(0.165, 0.84, 0.44, 1); }
            `}</style>
        </main>
    )
}

export default function VideoPage(props) {
    return (
        <Suspense fallback={<div className="container py-5 text-center p-5"><div className="spinner-border text-primary" role="status"></div></div>}>
            <VideoContent {...props} />
        </Suspense>
    );
}
