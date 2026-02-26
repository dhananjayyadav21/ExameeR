"use client";
import React, { useContext, useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import NotesItem from "../../components/NotesItem"
import ContentContext from '../../context/ContentContext'
import * as GlobalUrls from "../../utils/GlobalURL"

function NotesContent({ setProgress = () => { } }) {
    const searchParams = useSearchParams();
    const router = useRouter();
    const context = useContext(ContentContext);
    const { Notes, getNote, getDataFromMyLearning } = context;

    const category = searchParams.get('category') || 'sciTechnology';
    const sortBy = searchParams.get('sortBy') || 'latest';

    useEffect(() => {
        setProgress(0);
        if (localStorage.getItem('token')) {
            getNote(`${GlobalUrls.GETNOTE_URL}?category=${category}&sortBy=${sortBy}`);
            getDataFromMyLearning();
        }
        setProgress(100);
    }, [category, sortBy]);

    const handleSortByChange = (sortBy) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set('sortBy', sortBy);
        router.push(`?${params.toString()}`);
    }

    const [currentPage, setCurrentPage] = useState(1);
    const notesPerPage = 12;
    const totalPages = Math.ceil(Notes.length / notesPerPage);
    const indexOfLastNote = currentPage * notesPerPage;
    const indexOfFirstNote = indexOfLastNote - notesPerPage;
    const currentNotes = Notes.slice(indexOfFirstNote, indexOfLastNote);

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
            {/* Notes Professional Banner - Dark Theme */}
            <div className="position-relative overflow-hidden py-5 mb-0" style={{ background: 'linear-gradient(135deg, #1e293b 0%, #064e3b 100%)' }}>
                <div className="position-absolute top-0 end-0 w-50 h-100 opacity-10 d-none d-lg-block">
                    <i className="fa-solid fa-book-open position-absolute" style={{ fontSize: '20rem', right: '-5rem', top: '-2rem', transform: 'rotate(-15deg)' }}></i>
                </div>
                <div className="container px-4 position-relative z-1 py-lg-4">
                    <div className="row align-items-center">
                        <div className="col-lg-7">
                            <nav aria-label="breadcrumb" className="mb-4">
                                <ol className="breadcrumb small text-uppercase fw-semibold ls-wide mb-0" style={{ fontSize: '0.7rem' }}>
                                    <li className="breadcrumb-item"><a href="/" className="text-decoration-none text-white-50">Home</a></li>
                                    <li className="breadcrumb-item active text-green" aria-current="page">Study Resources</li>
                                </ol>
                            </nav>
                            <h1 className="display-6 fw-semibold mb-3 text-white" style={{ fontSize: '1.9rem' }}>Expert <span className="text-green">Study Notes</span></h1>
                            <p className="lead text-light-muted mb-4 opacity-75 pe-lg-5">
                                Turbocharge your learning with expert-curated notes. Detailed, easy-to-understand, and designed for maximum retention.
                            </p>
                            <div className="d-flex gap-3">
                                <div className="d-flex align-items-center gap-2 small bg-white bg-opacity-10 px-3 py-2 rounded-pill backdrop-blur">
                                    <i className="fa-solid fa-circle-check text-green"></i>
                                    <span className="text-white fw-normal" style={{ fontSize: '0.8rem' }}>Verified Content</span>
                                </div>
                                <div className="d-flex align-items-center gap-2 small bg-white bg-opacity-10 px-3 py-2 rounded-pill backdrop-blur">
                                    <i className="fa-solid fa-download text-primary"></i>
                                    <span className="text-white fw-normal" style={{ fontSize: '0.8rem' }}>Free Access</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container py-5 px-4">
                {/* Filters & Actions */}
                <div className="d-flex flex-column flex-md-row justify-content-between align-items-center mb-5 gap-3">
                    <div className="d-flex align-items-center gap-3">
                        <span className="text-muted fw-medium small">Filter:</span>
                        <div className="badge bg-white text-dark border shadow-sm px-3 py-2 rounded-pill d-flex align-items-center gap-2 fw-semibold" style={{ fontSize: '0.8rem' }}>
                            <i className="fa-solid fa-filter text-primary"></i>
                            {category === 'sciTechnology' ? 'Sci-Technology' : category.charAt(0).toUpperCase() + category.slice(1)}
                        </div>
                    </div>

                    <div className="dropdown">
                        <button className="btn btn-white shadow-sm border rounded-pill px-4 py-2 dropdown-toggle fw-medium" type="button" data-bs-toggle="dropdown">
                            <i className="fa-solid fa-arrow-down-wide-short me-2 text-muted"></i>
                            Sort by: <span className="text-primary">{sortBy === 'latest' ? 'Newest First' : 'Oldest First'}</span>
                        </button>
                        <ul className="dropdown-menu dropdown-menu-end shadow-lg border-0">
                            <li><button className="dropdown-item py-2" onClick={() => handleSortByChange('latest')}>Newest First</button></li>
                            <li><button className="dropdown-item py-2" onClick={() => handleSortByChange('oldest')}>Oldest First</button></li>
                        </ul>
                    </div>
                </div>

                {/* Notes Grid */}
                <div className="row g-4">
                    {Notes.length === 0 ? (
                        <div className="col-12 py-5 text-center">
                            <div className="p-5 bg-white rounded-4 shadow-sm">
                                <i className="fa-solid fa-magnifying-glass fs-1 text-muted mb-3 opacity-25"></i>
                                <h4 className="text-muted">No notes found for this category</h4>
                                <p className="text-secondary">Try switching categories or check back later for new uploads.</p>
                                {Notes.length === 0 && (
                                    <div className="mt-4 d-flex justify-content-center gap-2">
                                        {[1, 2, 3, 4].map(i => <div key={i} className="spinner-grow spinner-grow-sm text-primary opacity-50" role="status"></div>)}
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : (
                        currentNotes?.map((note) => (
                            <div key={note._id} className="col-xl-3 col-lg-4 col-md-6">
                                <NotesItem notes={note} />
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
                                    <button onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} className="page-link border-0 rounded-circle mx-1"><i className="fa-solid fa-chevron-left"></i></button>
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
                                    <button onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} className="page-link border-0 rounded-circle mx-1"><i className="fa-solid fa-chevron-right"></i></button>
                                </li>
                            </ul>
                        </nav>
                    </div>
                )}
            </div>

            <style jsx>{`
                .breadcrumb-item + .breadcrumb-item::before { color: rgba(255, 255, 255, 0.4); }
                .text-green { color: #04bd20 !important; }
                .btn-green { background: #04bd20; color: white; border: none; }
                .btn-green:hover { background: #03a61c; color: white; }
                .ls-wide { letter-spacing: 0.1em; }
                .btn-white { background: #fff; }
                .transition-all { transition: all 0.3s ease; }
            `}</style>
        </main>
    );
}

export default function NotesPage(props) {
    return (
        <Suspense fallback={<div className="container py-5 text-center"><div className="spinner-border text-primary" role="status"></div><p className="mt-3 text-muted">Loading your notes...</p></div>}>
            <NotesContent {...props} />
        </Suspense>
    );
}
