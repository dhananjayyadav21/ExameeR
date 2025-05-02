import React, { useContext, useEffect, useState } from "react";
import VideoItem from "./VideoItem";
import Footer from './Footer';
import ContentContext from '../context/ContentContext';
import * as GlobalUrls from "../GlobalURL";
import { useNavigate, useSearchParams } from "react-router-dom";

const Video = ({ setProgress }) => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const context = useContext(ContentContext);
    const { Video, getVideo } = context;

    const category = searchParams.get('category') || 'sciTechnology';
    const sortBy = searchParams.get('sortBy') || 'latest';

    useEffect(() => {
        setProgress(0);
        if (localStorage.getItem('token')) {
            getVideo(`${GlobalUrls.GETVideo_URL}?category=${category}&sortBy=${sortBy}`);
        }
        setProgress(100);
        // eslint-disable-next-line
    }, [category, sortBy]);

    //-- handle sorting
    const handleShortByChange = (sortBy) => {
        searchParams.set('sortBy', sortBy);
        navigate(`?${searchParams.toString()}`);
    }

    //-- handle paging nation 
    const [currentPage, setCurrentPage] = useState(1);
    const videoPerPage = 5;
    // Calculate total pages
    const totalPages = Math.ceil(Video.length / videoPerPage);
    // Slice video for current page
    const indexOfLastVideo = currentPage * videoPerPage;
    const indexOfFirstVideo = indexOfLastVideo - videoPerPage;
    const currentVideo = Video.slice(indexOfFirstVideo, indexOfLastVideo);

    const getPageNumbers = () => {
        const pages = [];

        if (currentPage > 1) pages.push(currentPage - 1);
        pages.push(currentPage);
        if (currentPage < totalPages) pages.push(currentPage + 1);

        return pages;
    };

    return (
        <>
            <div className="container-fluid">
                <div className="row g-4">
                    {/*=========================================== left container ===========================================*/}
                    <div className="col-12 col-lg-3 sidebar-VideoSection">
                        <div className='p-4 my-3 rounded-3 text-center' style={{ backgroundColor: "white" }}>
                            <h4>LEARN WITH LECTURES</h4>
                            <div className='row g-2 p-2 mt-3 rounded-3' >
                                <span className="btn-light-gray p-2">Your Journey, Our Voice.</span>
                                <span className='btn-light-gray p-2'>Learn Smarter, Not Harder</span>
                            </div>
                        </div>
                        {/* Temporary it controlled from backend */}
                        <div className="d-none d-lg-flex flex-column justify-content-center" style={{ marginTop: '20px', minHeight: 'calc(56vh)' }}>
                            <a href="https://www.youtube.com/@exameecode"><img className="rounded-3" src="/assets/img/Exameeyt.png" alt="E" style={{ width: '100%', height: '100%' }} /></a>
                        </div>
                    </div>

                    {/*=========================================== right container ===========================================*/}
                    <div className="col-12 col-lg-9 main-VideoSection scrollable">
                        <div className="video-heroSection card container-lg mt-md-4 shadow-sm">
                            <div className="text-center py-3">
                                <h4 className="card-title">Explore Your <span className="notes-span-section">Video Lectures</span></h4>
                                <p>"Learn Anytime, Anywhere with Expert-Led Video Lectures" || "Your Digital Classroom, One Video at a Time"</p>
                            </div>
                        </div>
                        <div className="px-2 pb-4 p-md-4">
                            {/*========= video Section =============*/}
                            <div>
                                <div className="mt-2 d-flex justify-content-end">
                                    <div className="col-4 col-sm-3 col-md-4 col-lg-2 text-center">
                                        <a className="nav-text nav-link p-1 border border-dark border-1 rounded-2 " href="/" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                            Sort By <i className="fa-solid fa-sort"></i>
                                        </a>
                                        <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
                                            <li><button className="dropdown-item" onClick={() => { handleShortByChange('latest') }}>Latest-Videos</button></li>
                                            <li><button className="dropdown-item" onClick={() => { handleShortByChange('oldest') }}>Oldest-Videos</button></li>
                                        </ul>
                                    </div>
                                </div>

                                <div className="mt-4">
                                    <div className="row g-4">
                                        {currentVideo.length === 0 &&
                                            <div className="text-center">
                                                <h6 className="d-flex justify-content-center text-muted text-center my-4">No Data Found!  Plese Check internet connection</h6>
                                                <div className="spinner-grow spinner-grow-sm me-2 blinking-spinner" role="status"></div>
                                                <div className="spinner-grow spinner-grow-sm me-2 blinking-spinner" role="status"></div>
                                                <div className="spinner-grow spinner-grow-sm me-2 blinking-spinner" role="status"></div>
                                                <div className="spinner-grow spinner-grow-sm me-2 blinking-spinner" role="status"></div>
                                            </div>
                                        }
                                        {Video?.map((video) => <VideoItem key={video._id} video={video} />)}
                                    </div>
                                </div>

                                {/* Pagination controls */}
                                {currentVideo.length !== 0 && (
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
            <footer className="footer bottom-0">
                <Footer />
            </footer>
        </>
    )
}

export default Video
