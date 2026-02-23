"use client";
import React, { useContext, useEffect, useState, Suspense } from "react";
import VideoItem from "../../components/VideoItem";
import Footer from '../../components/Footer';
import ContentContext from '../../context/ContentContext';
import * as GlobalUrls from "../../utils/GlobalURL";
import { useRouter, useSearchParams } from "next/navigation";

function VideoContent({ setProgress = () => { } }) {
    const searchParams = useSearchParams();
    const router = useRouter();
    const context = useContext(ContentContext);
    const { Video, getVideo } = context;

    const category = searchParams.get('category') || 'sciTechnology';
    const sortBy = searchParams.get('sortBy') || 'latest';

    useEffect(() => {
        setProgress(0);
        if (typeof window !== 'undefined' && localStorage.getItem('token')) {
            getVideo(`${GlobalUrls.GETVideo_URL}?category=${category}&sortBy=${sortBy}`);
        }
        setProgress(100);
    }, [category, sortBy]);

    const handleSortByChange = (sortBy) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set('sortBy', sortBy);
        router.push(`?${params.toString()}`);
    }

    const [currentPage, setCurrentPage] = useState(1);
    const videoPerPage = 5;
    const totalPages = Math.ceil(Video.length / videoPerPage);
    const indexOfLastVideo = currentPage * videoPerPage;
    const indexOfFirstVideo = indexOfLastVideo - videoPerPage;
    const currentVideo = Video.slice(indexOfFirstVideo, indexOfLastVideo);

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
            <div className="container-fluid">
                <div className="row g-4">
                    {/*=========================================== left container ===========================================*/}
                    <div className="col-12 col-lg-3 py-3 overflow-hidden sidebar-VideoSection">
                        <div className="bg-white p-4 rounded-3 text-center border shadow-sm">
                            <h4>LEARN WITH LECTURES</h4>
                            <div className='row g-2 p-2 mt-3 rounded-3' >
                                <span className="btn-light-gray p-2">Your Journey, Our Voice.</span>
                                <span className='btn-light-gray p-2'>Learn Smarter, Not Harder</span>
                            </div>
                        </div>
                        <div className="py-2 d-none d-lg-flex mt-3" style={{ height: "58vh" }}>
                            <a className="rounded-3 w-100" href="https://www.youtube.com/@exameecode" target="_blank" rel="noopener noreferrer">
                                <img className="rounded-3 shadow w-100 h-100" src="/assets/img/Sidebarbanner2.png" alt="Sidebar Banner" style={{ objectFit: 'cover' }} />
                            </a>
                        </div>
                    </div>

                    {/*=========================================== right container ===========================================*/}
                    <div className="col-12 col-lg-9 main-VideoSection" style={{ minHeight: "40vh" }}>
                        <div className="video-heroSection card container-lg mt-md-4 shadow-sm border-0">
                            <div className="text-center py-3">
                                <h4 className="card-title">Explore Your <span className="notes-span-section">Video Lectures</span></h4>
                                <p>"Learn Anytime, Anywhere with Expert-Led Video Lectures" || "Your Digital Classroom, One Video at a Time"</p>
                            </div>
                        </div>
                        <div className="px-0 pb-4 p-md-4">
                            {/*========= video Section =============*/}
                            <div>
                                <div className="mt-2 d-flex justify-content-end">
                                    <div className="col-6 col-sm-3 col-md-4 col-lg-2 text-center">
                                        <div className="dropdown">
                                            <button className="btn btn-outline-dark dropdown-toggle w-100" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                                Sort By <i className="fa-solid fa-sort"></i>
                                            </button>
                                            <ul className="dropdown-menu">
                                                <li><button className="dropdown-item" onClick={() => { handleSortByChange('latest') }}>Latest-Videos</button></li>
                                                <li><button className="dropdown-item" onClick={() => { handleSortByChange('oldest') }}>Oldest-Videos</button></li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-4">
                                    <div className="row g-4">
                                        {Video.length === 0 &&
                                            <div className="text-center">
                                                <h6 className="d-flex justify-content-center text-muted text-center my-4">No Data Found! Wait or refresh page</h6>
                                                <div className="spinner-grow spinner-grow-sm me-2 blinking-spinner" role="status"></div>
                                                <div className="spinner-grow spinner-grow-sm me-2 blinking-spinner" role="status"></div>
                                                <div className="spinner-grow spinner-grow-sm me-2 blinking-spinner" role="status"></div>
                                                <div className="spinner-grow spinner-grow-sm me-2 blinking-spinner" role="status"></div>
                                            </div>
                                        }
                                        {currentVideo?.map((video) => <VideoItem key={video._id} video={video} />)}
                                    </div>
                                </div>

                                {/* Pagination controls */}
                                {currentVideo.length !== 0 && (
                                    <div className="pagination my-4 d-flex justify-content-center gap-2">
                                        <button onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))} disabled={currentPage === 1} className="btn btn-outline-dark btn-sm">
                                            Previous
                                        </button>

                                        {getPageNumbers().map((page) => (
                                            <button key={page} onClick={() => setCurrentPage(page)} className={`btn btn-sm ${currentPage === page ? 'btn-dark' : 'btn-outline-dark'}`} >
                                                {page}
                                            </button>
                                        ))}

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
    )
}

export default function VideoPage(props) {
    return (
        <Suspense fallback={<div className="container py-5 text-center"><div className="spinner-border text-primary" role="status"></div><p className="mt-3">Loading Videos...</p></div>}>
            <VideoContent {...props} />
        </Suspense>
    );
}
