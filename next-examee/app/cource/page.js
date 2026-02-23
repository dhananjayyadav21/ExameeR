"use client";
import React, { useContext, useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import CourceIteam from '../../components/Home/CourceIteam'
import Footer from '../../components/Footer'
import ContentContext from '../../context/ContentContext';
import * as GlobalUrls from "../../utils/GlobalURL";

function CourseContent({ setProgress = () => { } }) {
    const searchParams = useSearchParams();
    const router = useRouter();
    const context = useContext(ContentContext);
    const { Course, getCourse } = context;

    const category = searchParams.get('category') || 'sciTechnology';
    const sortBy = searchParams.get('sortBy') || 'latest';

    useEffect(() => {
        setProgress(0);
        if (typeof window !== 'undefined' && localStorage.getItem('token')) {
            getCourse(`${GlobalUrls.GETCourse_URL}?category=${category}&sortBy=${sortBy}`);
        }
        setProgress(100);
    }, [category, sortBy]);

    const handleSortByChange = (sortBy) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set('sortBy', sortBy);
        router.push(`?${params.toString()}`);
    }

    const [currentPage, setCurrentPage] = useState(1);
    const CoursePerPage = 4;
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
        <main>
            <div className='Course-header'>
                <div className='container-lg p-3'>
                    <p className='my-3'> Your Cources   <span><i className="fa-solid fa-laptop-code"></i> Enroll Courses</span></p>
                    <h5 className='my-3'>Discover Your Courses online</h5>
                    <p>Explore a world of knowledge, curated by passionate mentors.
                        From foundational skills to advanced mastery, every course is built to empower you.
                        Learn at your pace, on your terms.
                        Your journey to growth starts here.</p>
                </div>
            </div>

            <div className="container-lg my-3" style={{ minHeight: "70vh" }}>
                <div className="row g-4">
                    <div className="col-12 col-md-12 main-CoursesSection">
                        <div className="px-2 pb-4 pt-md-4">
                            <div className="d-sm-flex justify-content-between">
                                <div className='my-4 my-sm-0'><h5>{`<> Find courses that fit your pace and passion`}</h5> </div>
                                <div className="col-4 col-md-2 col-lg-2 text-center">
                                    <div className="dropdown">
                                        <button className="btn btn-outline-dark dropdown-toggle w-100" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                            Sort By <i className="fa-solid fa-sort"></i>
                                        </button>
                                        <ul className="dropdown-menu">
                                            <li><button className="dropdown-item" onClick={() => { handleSortByChange('latest') }}>Latest-Course</button></li>
                                            <li><button className="dropdown-item" onClick={() => { handleSortByChange('oldest') }}>Oldest-Course</button></li>
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-4">
                                <div className="row g-4">
                                    {Course.length === 0 &&
                                        <div className="text-center">
                                            <h6 className="d-flex justify-content-center text-muted text-center my-4">No Data Found! Wait or refresh page</h6>
                                            <div className="spinner-grow spinner-grow-sm me-2 blinking-spinner" role="status"></div>
                                            <div className="spinner-grow spinner-grow-sm me-2 blinking-spinner" role="status"></div>
                                            <div className="spinner-grow spinner-grow-sm me-2 blinking-spinner" role="status"></div>
                                            <div className="spinner-grow spinner-grow-sm me-2 blinking-spinner" role="status"></div>
                                        </div>
                                    }
                                    {currentCourse?.map((Course, index) => <CourceIteam key={index} Course={Course} />)}
                                </div>
                            </div>


                            {/* Pagination controls */}
                            {currentCourse.length !== 0 && (
                                <div className="pagination my-4 d-flex justify-content-center gap-2">
                                    <button onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))} disabled={currentPage === 1} className="btn btn-outline-dark btn-sm">
                                        Previous
                                    </button>

                                    {currentPage > 2 && (
                                        <>
                                            <button onClick={() => setCurrentPage(1)} className="btn btn-outline-dark btn-sm">
                                                1
                                            </button>
                                            {currentPage > 3 && <span className="btn btn-sm disabled">...</span>}
                                        </>
                                    )}

                                    {getPageNumbers().map((page) => (
                                        <button key={page} onClick={() => setCurrentPage(page)} className={`btn btn-sm ${currentPage === page ? 'btn-dark' : 'btn-outline-dark'}`} >
                                            {page}
                                        </button>
                                    ))}

                                    {currentPage < totalPages - 1 && (
                                        <>
                                            {currentPage < totalPages - 2 && <span className="btn btn-sm disabled">...</span>}
                                            <button onClick={() => setCurrentPage(totalPages)} className="btn btn-outline-dark btn-sm">
                                                {totalPages}
                                            </button>
                                        </>
                                    )}

                                    <button onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages}
                                        className="btn btn-outline-dark btn-sm">
                                        Next
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <footer className="footer">
                <Footer />
            </footer>
        </main>
    )
}

export default function CoursePage(props) {
    return (
        <Suspense fallback={<div className="container py-5 text-center"><div className="spinner-border text-primary" role="status"></div><p className="mt-3">Loading Courses...</p></div>}>
            <CourseContent {...props} />
        </Suspense>
    );
}
