"use client";
import React, { useContext, useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import CourceIteam from '../../components/Home/CourceIteam'
import ContentContext from '../../context/ContentContext';
import * as GlobalUrls from "../../utils/GlobalURL";

import StudentLayout from "../../components/Home/StudentLayout";

function CourseContent({ setProgress = () => { } }) {
    const searchParams = useSearchParams();
    const router = useRouter();
    const context = useContext(ContentContext);
    const { Course, getCourse, getDataFromMyLearning, globalSearch } = context;

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

    const filteredCourse = Course.filter(c =>
        c.title?.toLowerCase().includes(globalSearch.toLowerCase()) ||
        c.subject?.toLowerCase().includes(globalSearch.toLowerCase()) ||
        c.category?.toLowerCase().includes(globalSearch.toLowerCase()) ||
        c.InstructorName?.toLowerCase().includes(globalSearch.toLowerCase())
    );

    const [currentPage, setCurrentPage] = useState(1);
    const CoursePerPage = 12;
    const totalPages = Math.ceil(filteredCourse.length / CoursePerPage);
    const indexOfLastCourse = currentPage * CoursePerPage;
    const indexOfFirstCourse = indexOfLastCourse - CoursePerPage;
    const currentCourse = filteredCourse.slice(indexOfFirstCourse, indexOfLastCourse);

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
        <StudentLayout title="Course">
            <div className="container-fluid px-0">
                {/* Header & Controls */}
                <div className="d-flex flex-column flex-md-row justify-content-between align-items-center mb-5 gap-3">
                    <div>
                        <h2 className="fw-black mb-1" style={{ fontSize: '1.8rem' }}>Discover Your Path</h2>
                        <p className="text-muted small mb-0">{filteredCourse.length} courses available in {category}</p>
                    </div>
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
                    {filteredCourse.length === 0 ? (
                        <div className="col-12 py-5 text-center">
                            <div className="p-5 bg-white rounded-4 shadow-sm border">
                                <i className="fa-solid fa-laptop-code display-1 text-muted opacity-25 mb-4"></i>
                                <h4 className="text-muted">No courses found matching your criteria</h4>
                                <p className="text-secondary">Explore other categories or check back soon for new content!</p>
                            </div>
                        </div>
                    ) : (
                        currentCourse?.map((c, index) => (
                            <div key={index} className="col-xl-4 col-lg-4 col-md-6">
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

        </StudentLayout>
    );
}


export default function CoursePage(props) {
    return (
        <Suspense fallback={<div className="container py-5 text-center p-5"><div className="spinner-border text-primary" role="status"></div></div>}>
            <CourseContent {...props} />
        </Suspense>
    );
}
