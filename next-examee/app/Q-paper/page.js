"use client";
import React, { useContext, useEffect, useState, Suspense } from "react";
import QPaperItem from "../../components/QPaperItem";
import ContentContext from '../../context/ContentContext';
import * as GlobalUrls from "../../utils/GlobalURL";
import { useRouter, useSearchParams } from "next/navigation";

function QPaperContent({ setProgress = () => { } }) {
    const searchParams = useSearchParams();
    const router = useRouter();
    const context = useContext(ContentContext);
    const { PYQS, getPYQ } = context;

    const category = searchParams.get('category') || 'sciTechnology';
    const sortBy = searchParams.get('sortBy') || 'latest';

    useEffect(() => {
        setProgress(0);
        if (typeof window !== 'undefined' && localStorage.getItem('token')) {
            getPYQ(`${GlobalUrls.GETPYQ_URL}?category=${category}&sortBy=${sortBy}`);
        }
        setProgress(100);
    }, [category, sortBy]);

    const handleSortByChange = (sortBy) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set('sortBy', sortBy);
        router.push(`?${params.toString()}`);
    }

    const [currentPage, setCurrentPage] = useState(1);
    const pyqPerPage = 12;
    const totalPages = Math.ceil(PYQS.length / pyqPerPage);
    const indexOfLastPYQ = currentPage * pyqPerPage;
    const indexOfFirstPYQ = indexOfLastPYQ - pyqPerPage;
    const currentPYQS = PYQS.slice(indexOfFirstPYQ, indexOfLastPYQ);

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
            {/* Q-Paper Professional Banner - Dark Theme */}
            <div className="position-relative overflow-hidden py-5 mb-0" style={{ background: 'linear-gradient(135deg, #0f172a 0%, #064e3b 100%)' }}>
                <div className="position-absolute top-0 end-0 w-50 h-100 opacity-10 d-none d-lg-block">
                    <i className="fa-solid fa-file-invoice position-absolute" style={{ fontSize: '20rem', right: '-5rem', top: '-2rem', transform: 'rotate(15deg)' }}></i>
                </div>
                <div className="container px-4 position-relative z-1 py-lg-4">
                    <div className="row align-items-center">
                        <div className="col-lg-7">
                            <nav aria-label="breadcrumb" className="mb-4">
                                <ol className="breadcrumb small text-uppercase fw-bold ls-wide mb-0">
                                    <li className="breadcrumb-item"><a href="/" className="text-decoration-none text-white-50">Home</a></li>
                                    <li className="breadcrumb-item active text-green" aria-current="page">Question Papers</li>
                                </ol>
                            </nav>
                            <h1 className="display-6 fw-semibold mb-3 text-white" style={{ fontSize: '1.9rem' }}>Premium <span className="text-green">Q-Papers</span></h1>
                            <p className="lead text-light-muted mb-4 opacity-75 pe-lg-5">
                                Master your exams with real paper patterns. Practice with authentic previous year questions to build confidence and accuracy.
                            </p>
                            <div className="d-flex gap-3">
                                <div className="d-flex align-items-center gap-2 small bg-white bg-opacity-10 px-3 py-2 rounded-pill backdrop-blur">
                                    <i className="fa-solid fa-calendar-check text-green"></i>
                                    <span className="text-white fw-normal" style={{ fontSize: '0.8rem' }}>Latest Sessions</span>
                                </div>
                                <div className="d-flex align-items-center gap-2 small bg-white bg-opacity-10 px-3 py-2 rounded-pill backdrop-blur">
                                    <i className="fa-solid fa-bolt text-warning"></i>
                                    <span className="text-white fw-normal" style={{ fontSize: '0.8rem' }}>Exam Ready</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container py-5 px-4">
                {/* Sort & Stats */}
                <div className="d-flex flex-column flex-md-row justify-content-between align-items-center mb-5 gap-3">
                    <h5 className="fw-semibold mb-0 text-dark" style={{ fontSize: '1rem' }}>Paper Archives</h5>
                    <div className="dropdown">
                        <button className="btn btn-white shadow-sm border rounded-pill px-4 py-2 dropdown-toggle fw-medium" type="button" data-bs-toggle="dropdown">
                            <i className="fa-solid fa-sort me-2 text-muted"></i>
                            Sort: <span className="text-green">{sortBy === 'latest' ? 'Newest' : 'Oldest'}</span>
                        </button>
                        <ul className="dropdown-menu dropdown-menu-end shadow-lg border-0">
                            <li><button className="dropdown-item py-2" onClick={() => handleSortByChange('latest')}>Newest First</button></li>
                            <li><button className="dropdown-item py-2" onClick={() => handleSortByChange('oldest')}>Oldest First</button></li>
                        </ul>
                    </div>
                </div>

                {/* Papers Grid */}
                <div className="row g-4">
                    {PYQS.length === 0 ? (
                        <div className="col-12 py-5 text-center bg-white rounded-4 shadow-sm border">
                            <i className="fa-solid fa-file-circle-exclamation display-4 text-muted mb-3 opacity-25"></i>
                            <h4 className="text-muted">No papers found</h4>
                            <p className="text-secondary">We're currently updating our archives. Please check back later.</p>
                        </div>
                    ) : (
                        currentPYQS?.map((pyq) => (
                            <div key={pyq._id} className="col-xl-3 col-lg-4 col-md-6">
                                <QPaperItem pyq={pyq} />
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
                                        <i className="fa-solid fa-angle-left"></i>
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
                                        <i className="fa-solid fa-angle-right"></i>
                                    </button>
                                </li>
                            </ul>
                        </nav>
                    </div>
                )}
            </div>

            <style jsx>{`
                .breadcrumb-item + .breadcrumb-item::before { color: rgba(255, 255, 255, 0.4); }
                .text-green { color: #04bd20 !important; }
                .btn-green { background: #04bd20 !important; color: white !important; border: none !important; }
                .btn-green:hover { background: #03a61c !important; }
                .ls-wide { letter-spacing: 0.1em; }
                .btn-white { background: #fff; }
                .transition-all { transition: all 0.3s ease; }
            `}</style>
        </main>
    );
}

export default function QPaperPage(props) {
    return (
        <Suspense fallback={<div className="container py-5 text-center"><div className="spinner-border text-success" role="status"></div><p className="mt-3 text-muted">Scanning archives...</p></div>}>
            <QPaperContent {...props} />
        </Suspense>
    );
}
