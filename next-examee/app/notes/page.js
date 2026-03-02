"use client";
import React, { useContext, useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import NotesItem from "../../components/NotesItem"
import ContentContext from '../../context/ContentContext'
import * as GlobalUrls from "../../utils/GlobalURL"
import StudentLayout from "../../components/Home/StudentLayout";
import { academicOptions } from "../../constants/academicOptions";
import PageBanners from "../../components/PageBanners";

function NotesContent({ setProgress = () => { } }) {
    const searchParams = useSearchParams();
    const router = useRouter();
    const context = useContext(ContentContext);
    const { Notes, getNote, getDataFromMyLearning, globalSearch, userData } = context;
    const category = searchParams.get('category') || 'sciTechnology';
    const sortBy = searchParams.get('sortBy') || 'latest';

    useEffect(() => {
        setProgress(0);
        if (localStorage.getItem('token') && userData) {
            let fetchUrl = `${GlobalUrls.GETNOTE_URL}?category=${category}&sortBy=${sortBy}`;
            if (userData.Course) fetchUrl += `&course=${userData.Course}`;
            if (userData.Semester) fetchUrl += `&semester=${userData.Semester}`;
            if (userData.University) fetchUrl += `&university=${userData.University}`;
            if (userData.Category) fetchUrl += `&category=${userData.Category}`; // Ensure category from profile is used if it matches

            getNote(fetchUrl);
            getDataFromMyLearning();
        } else if (localStorage.getItem('token') && !userData) {
            // Wait for user data to load if not already present
            getNote(`${GlobalUrls.GETNOTE_URL}?category=${category}&sortBy=${sortBy}`);
        }
        setProgress(100);
    }, [category, sortBy, userData]);

    const handleSortByChange = (sortBy) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set('sortBy', sortBy);
        router.push(`?${params.toString()}`);
    }

    const filteredNotes = Notes.filter(n =>
        n.title?.toLowerCase().includes(globalSearch.toLowerCase()) ||
        n.professor?.toLowerCase().includes(globalSearch.toLowerCase()) ||
        n.description?.toLowerCase().includes(globalSearch.toLowerCase())
    );

    const [currentPage, setCurrentPage] = useState(1);
    const notesPerPage = 12;
    const totalPages = Math.ceil(filteredNotes.length / notesPerPage);
    const indexOfLastNote = currentPage * notesPerPage;
    const indexOfFirstNote = indexOfLastNote - notesPerPage;
    const currentNotes = filteredNotes.slice(indexOfFirstNote, indexOfLastNote);

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
        <StudentLayout title="Notes">
            <div className="container-fluid px-0">
                {/* Banners */}
                <PageBanners page="notes" />

                {/* Header & Controls */}
                <div className="d-flex flex-column flex-md-row justify-content-between align-items-center mb-5 gap-3">
                    <div>
                        <h2 className="fw-black mb-1" style={{ fontSize: '1.8rem' }}>Study Library</h2>
                        <p className="text-muted small mb-0">{filteredNotes.length} notes available for your profile</p>
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

                {/* Notes Grid */}
                <div className="row g-4">
                    {Notes.length === 0 ? (
                        <div className="col-12 py-5 text-center">
                            <div className="p-5 bg-white rounded-4 shadow-sm border">
                                <i className="fa-solid fa-magnifying-glass fs-1 text-muted mb-3 opacity-25"></i>
                                <h4 className="text-muted">No notes found for this category</h4>
                                <p className="text-secondary">Try switching categories or check back later for new uploads.</p>
                            </div>
                        </div>
                    ) : (
                        currentNotes?.map((note) => (
                            <div key={note._id} className="col-xl-4 col-lg-4 col-md-6">
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

        </StudentLayout>
    );
}


export default function NotesPage(props) {
    return (
        <Suspense fallback={<div className="container py-5 text-center"><div className="spinner-border text-primary" role="status"></div><p className="mt-3 text-muted">Loading your notes...</p></div>}>
            <NotesContent {...props} />
        </Suspense>
    );
}
