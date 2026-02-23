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
            {/* Video Professional Banner */}
            <div className="position-relative overflow-hidden py-5 mb-0" style={{ background: 'linear-gradient(135deg, #0f172a 0%, #064e3b 100%)' }}>
                <div className="position-absolute top-0 end-0 w-50 h-100 opacity-10 d-none d-lg-block">
                    <i className="fa-solid fa-play position-absolute" style={{ fontSize: '20rem', right: '-2rem', top: '-1rem', transform: 'rotate(-5deg)' }}></i>
                </div>
                <div className="container px-4 position-relative z-1 py-lg-4">
                    <div className="row align-items-center">
                        <div className="col-lg-7">
                            <nav aria-label="breadcrumb" className="mb-4">
                                <ol className="breadcrumb small text-uppercase fw-bold ls-wide mb-0">
                                    <li className="breadcrumb-item"><a href="/" className="text-decoration-none text-muted opacity-75">Home</a></li>
                                    <li className="breadcrumb-item active text-green" aria-current="page">Video Tutorials</li>
                                </ol>
                            </nav>
                            <h1 className="display-4 fw-bold mb-3 text-white">Interactive <span className="text-green">Visual Learning</span></h1>
                            <p className="lead text-light-muted mb-4 opacity-75 pe-lg-5">
                                Learn at your own pace with our step-by-step video tutorials. High-quality content designed to make complex concepts easy to grasp.
                            </p>
                            <div className="d-flex gap-3">
                                <div className="d-flex align-items-center gap-2 small bg-white bg-opacity-10 px-3 py-2 rounded-pill backdrop-blur">
                                    <i className="fa-solid fa-film text-green"></i>
                                    <span className="text-white fw-medium font-sm">HD Quality</span>
                                </div>
                                <div className="d-flex align-items-center gap-2 small bg-white bg-opacity-10 px-3 py-2 rounded-pill backdrop-blur">
                                    <i className="fa-solid fa-infinity text-primary"></i>
                                    <span className="text-white fw-medium font-sm">Lifetime Access</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container py-5 px-4">
                {/* Header & Controls */}
                <div className="d-flex flex-column flex-md-row justify-content-between align-items-center mb-5 gap-3">
                    <h5 className="fw-bold mb-0 text-dark">Tutorial Catalog</h5>
                    <div className="dropdown">
                        <button className="btn btn-white shadow-sm border rounded-pill px-4 py-2 dropdown-toggle fw-medium" type="button" data-bs-toggle="dropdown">
                            <i className="fa-solid fa-arrow-down-wide-short me-2 text-muted"></i>
                            Sort by: <span className="text-green">{sortBy === 'latest' ? 'Newest' : 'Oldest'}</span>
                        </button>
                        <ul className="dropdown-menu dropdown-menu-end shadow-lg border-0">
                            <li><button className="dropdown-item py-2" onClick={() => handleSortByChange('latest')}>Newest First</button></li>
                            <li><button className="dropdown-item py-2" onClick={() => handleSortByChange('oldest')}>Oldest First</button></li>
                        </ul>
                    </div>
                </div>

                {/* Video Grid */}
                <div className="row g-4">
                    {Video.length === 0 ? (
                        <div className="col-12 py-5 text-center">
                            <div className="p-5 bg-white rounded-4 shadow-sm border">
                                <i className="fa-solid fa-video-slash display-1 text-muted opacity-25 mb-4"></i>
                                <h4 className="text-muted">No video lectures found</h4>
                                <p className="text-secondary">We are currently updating our library. Check back later!</p>
                            </div>
                        </div>
                    ) : (
                        currentVideo?.map((video) => (
                            <div key={video._id} className="col-xl-3 col-lg-4 col-md-6">
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
                                            className={`page-link border-0 rounded-circle mx-1 fw-bold ${currentPage === page ? 'btn-green text-white shadow-sm' : 'text-muted'}`}
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
                .text-green { color: #04bd20 !important; }
                .btn-green { background: #04bd20; color: white; border: none; }
                .btn-green:hover { background: #03a61c; color: white; }
                .text-light-muted { color: rgba(255, 255, 255, 0.7) !important; }
                .ls-wide { letter-spacing: 0.1em; }
                .btn-white { background: #fff; }
                .backdrop-blur { backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px); }
                .font-sm { font-size: 0.85rem; }
                .transition-all { transition: all 0.3s ease; }
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
