import React, { useContext, useEffect } from "react";
import QPaperItem from "./QPaperItem.jsx"
import Footer from "./Footer.jsx";
import ContentContext from '../context/ContentContext'
import * as GlobalUrls from "../GlobalURL"

const QPaper = () => {
    const context = useContext(ContentContext);
    const { PYQS, getPYQ } = context;

    useEffect(() => {
        if (localStorage.getItem('token')) {
            getPYQ();
        }
        // eslint-disable-next-line
    }, []);

    const handleShortByChange = (sortBy) => {
        getPYQ(`${GlobalUrls.GETPYQ_URL}?sortBy=${sortBy}`);
    }

    return (
        <>
            <div className="container-fluid">
                <div className="row g-4">

                    {/*=========================================== left container ===========================================*/}
                    <div className="col-12 col-md-3 sidebar-Qpaper Qp-get-cources-btn-container">
                        <div className="container Qp-get-cources-btn">
                            <button className='btn btn-dark mt-2 my-sm-0 w-100 fs-5 rounded-4 py-3'><a className='nav-link' href="/">Get New Cources<i className="fa-solid fa-up-right-from-square mx-1 mx-md-3"></i></a></button>
                        </div>
                    </div>

                    {/*=========================================== right container ===========================================*/}
                    <div className="col-12 col-md-9 main-Qpaper scrollable">
                        <div className="container-lg p-lg-4 py-4">
                            {/*========= heroSection ============== */}
                            <div className="Qpaper-heroSection p-4 rounded-4 text-center ">
                                <h2>Previous Year <span className="Qpaper-span-section"> Question Paper </span></h2>
                                <p>Prepare effectively with access to a comprehensive repository of previous year question papers.
                                    Browse and download question papers by course and subject.
                                    Practice with real exam patterns to improve performance.
                                    Filter papers by year, difficulty level, or specific topics.
                                    Gain insights into frequently asked questions and exam trends.
                                    Boost your preparation with this invaluable resource and enhance your chances of success!</p>
                                <button className="btn btn-info">Get Best Cources <i className="fa-solid fa-arrow-right"></i></button>
                            </div>

                            {/*========= Q-p Section =============*/}
                            <div>
                                <div className="container-lg mt-5 d-flex justify-content-end">
                                    <div className="col-6 col-sm-3 col-md-2 col-lg-1 text-center">
                                        <a className="nav-text nav-link p-1 border border-dark border-1 rounded-2 " href="/" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                            Sort By <i className="fa-solid fa-sort"></i>
                                        </a>
                                        <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
                                            <li><button className="dropdown-item" onClick={() => { handleShortByChange('latest') }}>Latest-Notes</button></li>
                                            <li><button className="dropdown-item" onClick={() => { handleShortByChange('oldest') }}>Oldest-Notes</button></li>
                                        </ul>
                                    </div>
                                </div>

                                <div className="container-lg mt-2">
                                    <div className="row g-4">
                                        {PYQS.map((pyq, index) => <QPaperItem key={index} PYQ={pyq} />)}
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>

                </div>
            </div>

            {/* ====================================== footer ================================================================= */}
            <footer className="footer bottom-0">
                <Footer />
            </footer>
        </>
    );
};

export default QPaper;
