"use client";
import React, { useContext, useEffect, useState, Suspense } from "react";
import QPaperItem from "../../components/QPaperItem";
import ContentContext from '../../context/ContentContext';
import * as GlobalUrls from "../../utils/GlobalURL";
import Link from "next/link";
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
            <div className="container-fluid p-0">
                <div className="row g-0">
                    {/* Sidebar Ad/Promo */}
                    <div className="col-lg-3 d-none d-lg-block sticky-top" style={{ height: 'calc(100vh - 70px)', top: '70px', background: '#f8fafc', borderRight: '1px solid var(--border-color)' }}>
                        <div className="h-100 p-4 d-flex flex-column">
                            <div className="promo-card rounded-4 overflow-hidden shadow-sm flex-grow-1 mb-4 position-relative group">
                                <Link href="https://www.youtube.com/@exameecode" target="_blank">
                                    <img className="w-100 h-100 transition-all group-hover-scale" src="/assets/img/Sidebarbanner2.png" alt="Promo" style={{ objectFit: 'cover' }} />
                                    <div className="position-absolute bottom-0 start-0 w-100 p-3 glass-effect">
                                        <span className="badge bg-danger rounded-pill mb-1">Live Now</span>
                                        <div className="fw-bold text-dark small">New Video Lectures</div>
                                    </div>
                                </Link>
                            </div>
                            <Link href="/cource" className='btn btn-dark w-100 rounded-pill py-3 fw-bold d-flex align-items-center justify-content-center gap-2 shadow-sm'>
                                Premium Courses <i className="fa-solid fa-crown text-warning"></i>
                            </Link>
                        </div>
                    </div>

                    {/* Main Content Area */}
                    <div className="col-lg-9">
                        <div className="bg-white border-bottom py-5 px-4">
                            <div className="container-lg">
                                <nav aria-label="breadcrumb" className="mb-3">
                                    <ol className="breadcrumb small text-uppercase fw-bold ls-wide">
                                        <li className="breadcrumb-item"><a href="/" className="text-decoration-none text-muted">Home</a></li>
                                        <li className="breadcrumb-item active text-green" aria-current="page">PYQ Papers</li>
                                    </ol>
                                </nav>
                                <h1 className="display-5 fw-bold mb-3">Previous Year <span className="text-gradient-green">Question Papers</span></h1>
                                <p className="lead text-secondary mb-4 pe-lg-5">
                                    Boost your exam preparation by practicing with authentic previous year papers. Understand patterns, manage time, and ace your finals.
                                </p>
                                <button className="btn btn-green rounded-pill px-4 py-2 fw-bold" onClick={() => router.push('/cource')}>
                                    Explore Study Guides <i className="fa-solid fa-arrow-right ms-2"></i>
                                </button>
                            </div>
                        </div>

                        <div className="container-lg py-5 px-4">
                            {/* Sort & Stats */}
                            <div className="d-flex flex-column flex-md-row justify-content-between align-items-center mb-4 gap-3">
                                <div className="text-muted small fw-medium">
                                    Showing <span className="text-dark fw-bold">{PYQS.length}</span> papers in <span className="text-green fw-bold">{category}</span>
                                </div>
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
                                        <div key={pyq._id} className="col-xl-4 col-md-6">
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
                                                        className={`page-link border-0 rounded-circle mx-1 fw-bold ${currentPage === page ? 'bg-green text-white shadow-sm' : 'text-muted'}`}
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
                    </div>
                </div>
            </div>

            <style jsx>{`
                .text-gradient-green { background: var(--primary-gradient); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
                .ls-wide { letter-spacing: 0.1em; }
                .btn-white { background: #fff; }
                .bg-green { background: var(--primary-color); }
                .text-green { color: var(--primary-color); }
                .group-hover-scale { transition: transform 0.5s ease; }
                .group:hover .group-hover-scale { transform: scale(1.05); }
                .glass-effect { background: rgba(255,255,255,0.8); backdrop-filter: blur(8px); border-top: 1px solid rgba(255,255,255,0.2); }
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
