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
    const { Notes, getNote } = context;

    const category = searchParams.get('category') || 'sciTechnology';
    const sortBy = searchParams.get('sortBy') || 'latest';

    useEffect(() => {
        setProgress(0);
        if (localStorage.getItem('token')) {
            getNote(`${GlobalUrls.GETNOTE_URL}?category=${category}&sortBy=${sortBy}`);
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
            {/* Notes Hero Section */}
            <div className="bg-white border-bottom py-5">
                <div className="container px-4">
                    <div className="row align-items-center">
                        <div className="col-lg-7">
                            <nav aria-label="breadcrumb" className="mb-3">
                                <ol className="breadcrumb small text-uppercase fw-bold ls-wide">
                                    <li className="breadcrumb-item"><a href="/" className="text-decoration-none text-muted">Home</a></li>
                                    <li className="breadcrumb-item active text-primary" aria-current="page">Study Notes</li>
                                </ol>
                            </nav>
                            <h1 className="display-5 fw-bold mb-3">Explore & Discover <span className="text-gradient">Your Notes</span></h1>
                            <p className="lead text-secondary mb-0">
                                Access a vast library of expert-curated notes. Filter by category, sort by relevance, and download for offline study.
                            </p>
                        </div>
                        <div className="col-lg-5 d-none d-lg-block text-end">
                            <div className="p-4 bg-primary-subtle rounded-4 d-inline-block shadow-sm boop-hover transition-all">
                                <i className="fa-solid fa-book-open-reader display-4 text-primary"></i>
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
                        <div className="badge bg-white text-dark border shadow-sm px-3 py-2 rounded-pill d-flex align-items-center gap-2">
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
                        <nav className="shadow-sm rounded-pill bg-white p-2">
                            <ul className="pagination mb-0 border-0 overflow-hidden">
                                <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                                    <button onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} className="page-link border-0 rounded-circle mx-1"><i className="fa-solid fa-chevron-left"></i></button>
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
                                    <button onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} className="page-link border-0 rounded-circle mx-1"><i className="fa-solid fa-chevron-right"></i></button>
                                </li>
                            </ul>
                        </nav>
                    </div>
                )}
            </div>

            <style jsx>{`
                .text-gradient { background: var(--primary-gradient); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
                .ls-wide { letter-spacing: 0.1em; }
                .btn-white { background: #fff; color: #1e293b; }
                .btn-white:hover { background: #f8fafc; }
                .boop-hover:hover { transform: scale(1.05) rotate(5deg); }
                .transition-all { transition: all 0.3s cubic-bezier(0.165, 0.84, 0.44, 1); }
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
