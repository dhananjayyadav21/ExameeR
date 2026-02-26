"use client";
import React, { useContext, useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import CourceIteam from '../../components/Home/CourceIteam'
import ContentContext from '../../context/ContentContext';
import * as GlobalUrls from "../../utils/GlobalURL";

function CourseContent({ setProgress = () => { } }) {
    const searchParams = useSearchParams();
    const router = useRouter();
    const context = useContext(ContentContext);
    const { Course, getCourse, getDataFromMyLearning } = context;

    const category = searchParams.get('category') || 'sciTechnology';
    const sortBy = searchParams.get('sortBy') || 'latest';

    useEffect(() => {
        setProgress(0);
        if (typeof window !== 'undefined' && localStorage.getItem('token')) {
            getCourse(`${GlobalUrls.GETCourse_URL}?category=${category}&sortBy=${sortBy}`);
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
    const CoursePerPage = 12;
    const totalPages = Math.ceil(Course.length / CoursePerPage);
    const indexOfLastCourse = currentPage * CoursePerPage;
    const indexOfFirstCourse = indexOfLastCourse - CoursePerPage;
    const currentCourse = Course.slice(indexOfFirstCourse, indexOfLastCourse);

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
            {/* Courses Professional Banner - Dark Theme */}
            <div className="position-relative overflow-hidden py-5 mb-0" style={{ background: 'linear-gradient(135deg, #1e1b4b 0%, #064e3b 100%)' }}>
                <div className="position-absolute top-0 end-0 w-50 h-100 opacity-10 d-none d-lg-block">
                    <i className="fa-solid fa-graduation-cap position-absolute" style={{ fontSize: '20rem', right: '-5rem', top: '-2rem', transform: 'rotate(-10deg)' }}></i>
                </div>
                <div className="container px-4 position-relative z-1 py-lg-4">
                    <div className="row align-items-center">
                        <div className="col-lg-7">
                            <nav aria-label="breadcrumb" className="mb-4">
                                <ol className="breadcrumb small text-uppercase fw-semibold ls-wide mb-0" style={{ fontSize: '0.7rem' }}>
                                    <li className="breadcrumb-item"><a href="/" className="text-decoration-none text-white-50">Home</a></li>
                                    <li className="breadcrumb-item active text-green" aria-current="page">Courses</li>
                                </ol>
                            </nav>
                            <h1 className="display-6 fw-semibold mb-3 text-white" style={{ fontSize: '1.9rem' }}>Premium <span className="text-green">Learning Path</span></h1>
                            <p className="lead text-light-muted mb-4 opacity-75 pe-lg-5">
                                Master new skills with structured learning paths. Our courses are designed by industry experts to take you from beginner to professional.
                            </p>
                            <div className="d-flex gap-3">
                                <div className="d-flex align-items-center gap-2 small bg-white bg-opacity-10 px-3 py-2 rounded-pill backdrop-blur">
                                    <i className="fa-solid fa-certificate text-green"></i>
                                    <span className="text-white fw-normal" style={{ fontSize: '0.8rem' }}>Certification</span>
                                </div>
                                <div className="d-flex align-items-center gap-2 small bg-white bg-opacity-10 px-3 py-2 rounded-pill backdrop-blur">
                                    <i className="fa-solid fa-user-group text-primary"></i>
                                    <span className="text-white fw-normal" style={{ fontSize: '0.8rem' }}>Expert Mentors</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container py-5 px-4">
                {/* Header & Controls */}
                <div className="d-flex flex-column flex-md-row justify-content-between align-items-center mb-5 gap-3">
                    <h5 className="fw-bold mb-0 text-dark">Discover Your Path</h5>
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

                {/* Courses Grid */}
                <div className="row g-4">
                    {Course.length === 0 ? (
                        <div className="col-12 py-5 text-center">
                            <div className="p-5 bg-white rounded-4 shadow-sm border">
                                <i className="fa-solid fa-laptop-code display-1 text-muted opacity-25 mb-4"></i>
                                <h4 className="text-muted">No courses found matching your criteria</h4>
                                <p className="text-secondary">Explore other categories or check back soon for new content!</p>
                            </div>
                        </div>
                    ) : (
                        currentCourse?.map((c, index) => (
                            <div key={index} className="col-xl-3 col-lg-4 col-md-6">
                                <CourceIteam Course={c} />
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
                .breadcrumb-item + .breadcrumb-item::before { color: rgba(255, 255, 255, 0.4); }
                .text-green { color: #04bd20 !important; }
                .btn-green { background: #04bd20; color: white; border: none; }
                .btn-green:hover { background: #03a61c; color: white; }
                .ls-wide { letter-spacing: 0.1em; }
                .btn-white { background: #fff; }
                .transition-all { transition: all 0.3s ease; }
            `}</style>
        </main>
    )
}

export default function CoursePage(props) {
    return (
        <Suspense fallback={<div className="container py-5 text-center p-5"><div className="spinner-border text-primary" role="status"></div></div>}>
            <CourseContent {...props} />
        </Suspense>
    );
}
