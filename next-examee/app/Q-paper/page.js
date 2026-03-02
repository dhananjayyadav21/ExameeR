"use client";
import React, { useContext, useEffect, useState, Suspense } from "react";
import QPaperItem from "../../components/QPaperItem";
import ContentContext from '../../context/ContentContext';
import * as GlobalUrls from "../../utils/GlobalURL";
import { useRouter, useSearchParams } from "next/navigation";
import StudentLayout from "../../components/Home/StudentLayout";
import { academicOptions } from "../../constants/academicOptions";
import PageBanners from "../../components/PageBanners";

function QPaperContent({ setProgress = () => { } }) {
    const searchParams = useSearchParams();
    const router = useRouter();
    const context = useContext(ContentContext);
    const { PYQS, getPYQ, getDataFromMyLearning, globalSearch, userData } = context;

    const category = searchParams.get('category') || 'sciTechnology';
    const sortBy = searchParams.get('sortBy') || 'latest';

    useEffect(() => {
        setProgress(0);
        if (typeof window !== 'undefined' && localStorage.getItem('token') && userData) {
            let fetchUrl = `${GlobalUrls.GETPYQ_URL}?category=${category}&sortBy=${sortBy}`;
            if (userData.Course) fetchUrl += `&course=${userData.Course}`;
            if (userData.Semester) fetchUrl += `&semester=${userData.Semester}`;
            if (userData.University) fetchUrl += `&university=${userData.University}`;
            if (userData.Category) fetchUrl += `&category=${userData.Category}`;

            getPYQ(fetchUrl);
            getDataFromMyLearning();
        } else if (typeof window !== 'undefined' && localStorage.getItem('token') && !userData) {
            getPYQ(`${GlobalUrls.GETPYQ_URL}?category=${category}&sortBy=${sortBy}`);
        }
        setProgress(100);
    }, [category, sortBy, userData]);

    const handleSortByChange = (sortBy) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set('sortBy', sortBy);
        router.push(`?${params.toString()}`);
    }

    const filteredPYQS = PYQS.filter(p =>
        p.title?.toLowerCase().includes(globalSearch.toLowerCase()) ||
        p.subject?.toLowerCase().includes(globalSearch.toLowerCase()) ||
        p.year?.toString().includes(globalSearch)
    );

    const [currentPage, setCurrentPage] = useState(1);
    const pyqPerPage = 12;
    const totalPages = Math.ceil(filteredPYQS.length / pyqPerPage);
    const indexOfLastPYQ = currentPage * pyqPerPage;
    const indexOfFirstPYQ = indexOfLastPYQ - pyqPerPage;
    const currentPYQS = filteredPYQS.slice(indexOfFirstPYQ, indexOfLastPYQ);

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
        <StudentLayout title="PYQ">
            <div className="container-fluid px-0">
                {/* Banners */}
                <PageBanners page="pyq" />

                {/* Header & Controls */}
                <div className="d-flex flex-column flex-md-row justify-content-between align-items-center mb-5 gap-3">
                    <div>
                        <h2 className="fw-black mb-1" style={{ fontSize: '1.8rem' }}>Paper Archives</h2>
                        <p className="text-muted small mb-0">{filteredPYQS.length} papers available for your profile</p>
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
                            <div key={pyq._id} className="col-xl-4 col-lg-4 col-md-6">
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

        </StudentLayout>
    );
}


import PageLoader from "../../components/PageLoader";

export default function QPaperPage(props) {
    return (
        <Suspense fallback={<PageLoader text="Scanning archives..." subtext="Retrieving PYQs for you" />}>
            <QPaperContent {...props} />
        </Suspense>
    );
}
