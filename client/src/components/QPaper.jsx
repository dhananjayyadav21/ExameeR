import React, { useContext, useEffect, useState } from "react";
import QPaperItem from "./QPaperItem.jsx";
import Footer from "./Footer.jsx";
import ContentContext from '../context/ContentContext';
import * as GlobalUrls from "../GlobalURL";
import { Link, useNavigate, useSearchParams } from "react-router-dom";

const QPaper = ({ setProgress }) => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const context = useContext(ContentContext);
    const { PYQS, getPYQ } = context;

    const category = searchParams.get('category') || 'sciTechnology';
    const sortBy = searchParams.get('sortBy') || 'latest';
    useEffect(() => {
        setProgress(0);
        if (localStorage.getItem('token')) {
            getPYQ(`${GlobalUrls.GETPYQ_URL}?category=${category}&sortBy=${sortBy}`);
        }
        setProgress(100);
        // eslint-disable-next-line
    }, [category, sortBy]);

    //-- handle shorting
    const handleShortByChange = (sortBy) => {
        searchParams.set('sortBy', sortBy);
        navigate(`?${searchParams.toString()}`);
    }

    //-- handle paging nation 
    const [currentPage, setCurrentPage] = useState(1);
    const pyqPerPage = 10;
    // Calculate total pages
    const totalPages = Math.ceil(PYQS.length / pyqPerPage);
    // Slice pyq for current page
    const indexOfLastPYQ = currentPage * pyqPerPage;
    const indexOfFirstPYQ = indexOfLastPYQ - pyqPerPage;
    const currentPYQS = PYQS.slice(indexOfFirstPYQ, indexOfLastPYQ);

    const getPageNumbers = () => {
        const pages = [];

        if (currentPage > 1) pages.push(currentPage - 1);
        pages.push(currentPage);
        if (currentPage < totalPages) pages.push(currentPage + 1);

        return pages;
    };

    return (
        <>
            <div className="container-fluid" >
                <div className="row g-4">

                    {/*=========================================== left container ===========================================*/}
                    <div className="col-12 col-lg-3 py-2 overflow-hidden sidebar-Qpaper Qp-get-cources-btn-container">
                        {/* Temporary it controlled from backend */}
                        <div className="overflow-hidden rounded-3">
                            <a href="https://www.youtube.com/@exameecode">
                                <img className="rounded-3" src="/assets/img/Sidebaneer.png" alt="E" style={{ maxWidth: '100%', height: '700px' }} />
                            </a>
                        </div>
                        <div className="Qp-get-cources-btn d-flex align-items-center" style={{ height: "12%" }}>
                            <button className='btn btn-dark w-100 fs-5 rounded-4 py-3'>
                                <Link className='nav-link' to="/cource">Get New Cources
                                    <i className="fa-solid fa-up-right-from-square mx-1 mx-md-3"></i>
                                </Link>
                            </button>
                        </div>
                    </div>

                    {/*=========================================== right container ===========================================*/}
                    <div className="col-12 col-lg-9 main-Qpaper scrollable"  style={{minHeight:"40vh"}}>
                        <div className="container-lg p-lg-4 py-4">
                            {/*========= heroSection ============== */}
                            <div className="Qpaper-heroSection p-4 rounded-4 text-center ">
                                <h2>Previous Year <span className="Qpaper-span-section"> Question Paper </span></h2>
                                <p>Prepare effectively with access to a comprehensive repository of previous year question papers.
                                    Browse and download question papers by course and subject.
                                    Practice with real exam patterns to improve performance.
                                    Boost your preparation with this invaluable resource and enhance your chances of success!</p>
                                <button className="btn btn-info" onClick={() => navigate('/cource')}>Get Best Cources <i className="fa-solid fa-arrow-right"></i></button>
                            </div>

                            {/*========= Q-p Section =============*/}
                            <div>
                                <div className="container-lg mt-5 d-flex justify-content-end">
                                    <div className="col-6 col-sm-3 col-md-2 col-lg-1 text-center">
                                        <a className="nav-text nav-link p-1 border border-dark border-1 rounded-2 " href="/" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                            Sort By <i className="fa-solid fa-sort"></i>
                                        </a>
                                        <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
                                            <li><button className="dropdown-item" onClick={() => { handleShortByChange('latest') }}>Latest-PYQ</button></li>
                                            <li><button className="dropdown-item" onClick={() => { handleShortByChange('oldest') }}>Oldest-PYQ</button></li>
                                        </ul>
                                    </div>
                                </div>

                                <div className="container-lg mt-4">
                                    <div className="row g-4">
                                        {PYQS.length === 0 &&
                                            <div className="text-center">
                                                <h6 className="d-flex justify-content-center text-muted text-center my-4">No Data Found!  Plese Check internet connection</h6>
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

            {/* ====================================== footer ================================================================= */}
            <footer className="footer">
                <Footer />
            </footer>
        </>
    );
};

export default QPaper;
