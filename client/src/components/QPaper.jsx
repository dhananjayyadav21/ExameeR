import React, { useContext, useEffect } from "react";
import QPaperItem from "./QPaperItem.jsx";
import Footer from "./Footer.jsx";
import ContentContext from '../context/ContentContext';
import * as GlobalUrls from "../GlobalURL";
import { Link, useNavigate, useSearchParams } from "react-router-dom";

const QPaper = ({setProgress}) => {
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

    const handleShortByChange = (sortBy) => {
        searchParams.set('sortBy', sortBy);
        navigate(`?${searchParams.toString()}`);
    }

    return (
        <>
            <div className="container-fluid">
                <div className="row g-4">

                    {/*=========================================== left container ===========================================*/}
                    <div className="col-12 col-md-3 sidebar-Qpaper Qp-get-cources-btn-container">
                        {/* Temporary it controlled from backend */}
                        <div className="d-flex flex-column justify-content-center" style={{ marginTop: '20px', minHeight: 'calc(100vh - 70px - 125px)' }}>
                            <a href="https://www.youtube.com/@exameecode">
                                <img className="rounded-top" src="/assets/img/Exameeyt.png" alt="E" style={{ width: '100%', height: '100%' }} />
                                <img className="rounded-bottom" src="/assets/img/Exameeyt.png" alt="E" style={{ width: '100%', height: '100%' }} />
                            </a>
                        </div>
                        <div className="container Qp-get-cources-btn">
                            <button className='btn btn-dark mt-2 my-sm-0 w-100 fs-5 rounded-4 py-3'><Link className='nav-link' to="/cource">Get New Cources<i className="fa-solid fa-up-right-from-square mx-1 mx-md-3"></i></Link></button>
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
                                        {PYQS.length === 0 && <h6 className="d-flex justify-content-center text-muted text-center my-5">No Data Found!  Plese Check internet connection</h6>}
                                        {PYQS?.map((pyq) => <QPaperItem key={pyq._id} pyq={pyq} />)}
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
