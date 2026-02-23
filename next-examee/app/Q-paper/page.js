"use client";
import React, { useContext, useEffect, useState, Suspense } from "react";
import QPaperItem from "../../components/QPaperItem";
import Footer from "../../components/Footer";
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
    const pyqPerPage = 10;
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
        <main>
            <div className="container-fluid" >
                <div className="row g-4">
                    {/*=========================================== left container ===========================================*/}
                    <div className="col-12 col-lg-3 py-2 overflow-hidden sidebar-Qpaper Qp-get-cources-btn-container">
                        <div className="overflow-hidden rounded-3" style={{ height: "88%" }}>
                            <a href="https://www.youtube.com/@exameecode" target="_blank" rel="noopener noreferrer">
                                <img className="rounded-3 img-fluid w-100" src="/assets/img/Sidebarbanner2.png" alt="Sidebar Banner" style={{ minHeight: '500px', objectFit: 'cover' }} />
                            </a>
                        </div>
                        <div className="Qp-get-cources-btn d-flex align-items-center mt-3" style={{ height: "12%" }}>
                            <Link href="/cource" className='btn btn-dark w-100 fs-5 rounded-4 py-3 text-white text-decoration-none'>
                                Get New Cources <i className="fa-solid fa-up-right-from-square ms-2"></i>
                            </Link>
                        </div>
                    </div>

                    {/*=========================================== right container ===========================================*/}
                    <div className="col-12 col-lg-9 main-Qpaper" style={{ minHeight: "40vh" }}>
                        <div className="container-lg p-lg-4 py-4">
                            {/*========= heroSection ============== */}
                            <div className="Qpaper-heroSection p-4 rounded-4 text-center ">
                                <h2>Previous Year <span className="Qpaper-span-section"> Question Paper </span></h2>
                                <p>Prepare effectively with access to a comprehensive repository of previous year question papers.
                                    Browse and download question papers by course and subject.
                                    Practice with real exam patterns to improve performance.
                                    Boost your preparation with this invaluable resource and enhance your chances of success!</p>
                                <button className="btn btn-info" onClick={() => router.push('/cource')}>Get Best Cources <i className="fa-solid fa-arrow-right"></i></button>
                            </div>

                            {/*========= Q-p Section =============*/}
                            <div>
                                <div className="container-lg mt-5 d-flex justify-content-end">
                                    <div className="col-6 col-sm-3 col-md-2 col-lg-2 text-center">
                                        <div className="dropdown">
                                            <button className="btn btn-outline-dark dropdown-toggle w-100" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                                Sort By <i className="fa-solid fa-sort"></i>
                                            </button>
                                            <ul className="dropdown-menu">
                                                <li><button className="dropdown-item" onClick={() => { handleSortByChange('latest') }}>Latest-PYQ</button></li>
                                                <li><button className="dropdown-item" onClick={() => { handleSortByChange('oldest') }}>Oldest-PYQ</button></li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>

                                <div className="container-lg mt-4">
                                    <div className="row g-4">
                                        {PYQS.length === 0 &&
                                            <div className="text-center">
                                                <h6 className="d-flex justify-content-center text-muted text-center my-4">No Data Found! Wait or refresh page</h6>
                                                <div className="spinner-grow spinner-grow-sm me-2 blinking-spinner" role="status"></div>
                                                <div className="spinner-grow spinner-grow-sm me-2 blinking-spinner" role="status"></div>
                                                <div className="spinner-grow spinner-grow-sm me-2 blinking-spinner" role="status"></div>
                                                <div className="spinner-grow spinner-grow-sm me-2 blinking-spinner" role="status"></div>
                                            </div>
                                        }
                                        {currentPYQS?.map((pyq) => <QPaperItem key={pyq._id} pyq={pyq} />)}
                                    </div>
                                </div>

                                {/* Pagination controls */}
                                {currentPYQS.length !== 0 && (
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
            </div>

            <footer className="footer">
                <Footer />
            </footer>
        </main>
    );
}

export default function QPaperPage(props) {
    return (
        <Suspense fallback={<div className="container py-5 text-center"><div className="spinner-border text-primary" role="status"></div><p className="mt-3">Loading Question Papers...</p></div>}>
            <QPaperContent {...props} />
        </Suspense>
    );
}
