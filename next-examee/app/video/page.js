"use client";
import React, { useContext, useEffect, useState, Suspense } from "react";
import VideoItem from "../../components/VideoItem";
import ContentContext from '../../context/ContentContext';
import * as GlobalUrls from "../../utils/GlobalURL";
import { useRouter, useSearchParams } from "next/navigation";
import StudentLayout from "../../components/Home/StudentLayout";
import { academicOptions } from "../../constants/academicOptions";
import PageBanners from "../../components/PageBanners";

function VideoContent({ setProgress = () => { } }) {
    const searchParams = useSearchParams();
    const router = useRouter();
    const context = useContext(ContentContext);
    const { Video, getVideo, getDataFromMyLearning, globalSearch, userData } = context;

    const category = searchParams.get('category') || 'sciTechnology';
    const sortBy = searchParams.get('sortBy') || 'latest';

    useEffect(() => {
        setProgress(0);
        if (typeof window !== 'undefined' && localStorage.getItem('token') && userData) {
            let fetchUrl = `${GlobalUrls.GETVideo_URL}?category=${category}&sortBy=${sortBy}`;
            if (userData.Course) fetchUrl += `&course=${userData.Course}`;
            if (userData.Semester) fetchUrl += `&semester=${userData.Semester}`;
            if (userData.University) fetchUrl += `&university=${userData.University}`;
            if (userData.Category) fetchUrl += `&category=${userData.Category}`;

            getVideo(fetchUrl);
            getDataFromMyLearning();
        } else if (typeof window !== 'undefined' && localStorage.getItem('token') && !userData) {
            getVideo(`${GlobalUrls.GETVideo_URL}?category=${category}&sortBy=${sortBy}`);
        }
        setProgress(100);
    }, [category, sortBy, userData]);

    const handleSortByChange = (sortBy) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set('sortBy', sortBy);
        router.push(`?${params.toString()}`);
    }

    const filteredVideo = Video.filter(v =>
        v.title?.toLowerCase().includes(globalSearch.toLowerCase()) ||
        v.description?.toLowerCase().includes(globalSearch.toLowerCase()) ||
        v.category?.toLowerCase().includes(globalSearch.toLowerCase())
    );

    const [currentPage, setCurrentPage] = useState(1);
    const videoPerPage = 8;
    const totalPages = Math.ceil(filteredVideo.length / videoPerPage);
    const indexOfLastVideo = currentPage * videoPerPage;
    const indexOfFirstVideo = indexOfLastVideo - videoPerPage;
    const currentVideo = filteredVideo.slice(indexOfFirstVideo, indexOfLastVideo);

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
        <StudentLayout title="Video">
            <div className="container-fluid px-0">
                {/* Banners */}
                <PageBanners page="video" />

                {/* Header & Controls */}
                <div className="d-flex flex-column flex-md-row justify-content-between align-items-center mb-5 gap-3">
                    <div>
                        <h2 className="fw-black mb-1" style={{ fontSize: '1.8rem' }}>Tutorial Catalog</h2>
                        <p className="text-muted small mb-0">{filteredVideo.length} videos available for your profile</p>
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

                {/* Video Grid */}
                <div className="row g-4">
                    {filteredVideo.length === 0 ? (
                        <div className="col-12 py-5 text-center">
                            <div className="p-5 bg-white rounded-4 shadow-sm border">
                                <i className="fa-solid fa-video-slash display-1 text-muted opacity-25 mb-4"></i>
                                <h4 className="text-muted">No video lectures found</h4>
                                <p className="text-secondary">We are currently updating our library. Check back later!</p>
                            </div>
                        </div>
                    ) : (
                        currentVideo?.map((video) => (
                            <div key={video._id} className="col-xl-4 col-lg-4 col-md-6">
                                <VideoItem video={video} />
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


import PageLoader from "../../components/PageLoader";

export default function VideoPage(props) {
    return (
        <Suspense fallback={<PageLoader text="Loading video catalog..." subtext="Getting the best tutorials ready" />}>
            <VideoContent {...props} />
        </Suspense>
    );
}
