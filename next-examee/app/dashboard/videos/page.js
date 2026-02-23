"use client";
import React, { useContext, useEffect, useState } from "react";
import Modal from "../../../components/Modal";
import Link from "next/link";
import { useRouter } from "next/navigation";
import ContentContext from '../../../context/ContentContext'
import * as GlobalUrls from "../../../utils/GlobalURL"
import { toast } from "react-toastify";

export default function DashboardVideosPage() {
    const context = useContext(ContentContext);
    const { searchDashContent, dasVideo, getVideo, deleteVideo } = context;
    const router = useRouter();

    const [search, setSearch] = useState('');
    const [category, setCategory] = useState("sciTechnology");
    const [status, setStatus] = useState("public");
    const [isloading, setIsloading] = useState(false);

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6;
    const indexOfLastVideo = currentPage * itemsPerPage;
    const indexOfFirstVideo = indexOfLastVideo - itemsPerPage;
    const currentVideos = dasVideo.slice(indexOfFirstVideo, indexOfLastVideo);
    const totalPages = Math.ceil(dasVideo.length / itemsPerPage);

    useEffect(() => {
        getVideo();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsloading(true);
        try {
            const res = await searchDashContent(`${GlobalUrls.SEARDASHCHCONTENT_URL}?search=${search}&category=${category}&status=${status}&type=video`);
            if (res.success === false) {
                toast.warning(res.message || "No matching content found");
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsloading(false);
        }
    }

    const getBadgeColor = (status) => {
        if (status === "public") return "info";
        if (status === "draft") return "warning";
        if (status === "archived") return "danger";
        return "secondary";
    };

    const [showModal, setShowModal] = useState(false);
    const [modalVideo, setModalVideo] = useState(null);

    const deleteConfirm = async (Video) => {
        const res = await deleteVideo(Video._id);
        setShowModal(false);
        if (res.success === true) {
            toast.success(res.message || "Video deleted successfully!");
            getVideo();
        } else {
            toast.error(res.message || "Failed to delete video!");
        }
    }

    const handleUpdate = (video) => {
        console.log("Update video:", video);
    }

    return (
        <div id="videoLectures" className="p-0">
            <Modal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                onConfirm={() => deleteConfirm(modalVideo)}
                heading={`Do You Want To Delete "${modalVideo?.title}" Video?`}
                subHeading="This action cannot be undone."
            />

            <div className="d-flex justify-content-between align-items-center mb-4">
                <h1 className="h4 fw-bold text-dark mb-0">Video Lectures Management</h1>
                <Link href="/uploadVideo" className="btn btn-info px-4 d-flex align-items-center gap-2">
                    <i className="fa-solid fa-plus-circle"></i>
                    Upload Video
                </Link>
            </div>

            <div className="card border-0 shadow-sm mb-4">
                <div className="card-body p-4">
                    <form onSubmit={handleSubmit} className="row g-3">
                        <div className="col-md-6">
                            <label className="form-label fw-bold small">Search Videos</label>
                            <input
                                type="text"
                                placeholder="Video title, description..."
                                className="form-control bg-light"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                        <div className="col-md-3">
                            <label className="form-label fw-bold small">Category</label>
                            <select className="form-select bg-light" value={category} onChange={(e) => setCategory(e.target.value)}>
                                <option value="sciTechnology">Sci-Technology</option>
                                <option value="commerce">Commerce</option>
                                <option value="artscivils">Arts & Civils</option>
                            </select>
                        </div>
                        <div className="col-md-3">
                            <label className="form-label fw-bold small">Status</label>
                            <select className="form-select bg-light" value={status} onChange={(e) => setStatus(e.target.value)}>
                                <option value="public">Active</option>
                                <option value="draft">Draft</option>
                                <option value="archived">Archived</option>
                            </select>
                        </div>
                        <div className="col-12 text-end mt-3">
                            <button type="submit" className="btn btn-dark" disabled={isloading}>
                                {isloading ? 'Searching...' : 'Search'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            {isloading ? (
                <div className="text-center py-5">
                    <div className="spinner-border text-primary" role="status"></div>
                </div>
            ) : (
                <>
                    <div className="row g-4">
                        {currentVideos?.map((data) => (
                            <div className="col-12 col-md-6 col-lg-4" key={data._id}>
                                <div className="card h-100 border-0 shadow-sm rounded-3 overflow-hidden">
                                    <div className="position-relative" style={{ height: '200px' }}>
                                        <iframe
                                            width="100%"
                                            height="100%"
                                            src={`https://www.youtube.com/embed/${data?.fileUrl}`}
                                            title={data?.title}
                                            frameBorder="0"
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                            allowFullScreen
                                        ></iframe>
                                    </div>
                                    <div className="card-body p-4">
                                        <div className="d-flex justify-content-between align-items-start mb-2">
                                            <h5 className="card-title fw-bold text-dark mb-0 text-truncate-2" style={{ height: '48px', overflow: 'hidden' }}>{data?.title}</h5>
                                            <span className={`badge bg-${getBadgeColor(data?.status)} px-2`}>{data?.status}</span>
                                        </div>
                                        <p className="card-text text-muted small mb-3 text-truncate-2" style={{ height: '40px', overflow: 'hidden' }}>
                                            {data?.description}
                                        </p>
                                        <div className="d-flex justify-content-between align-items-center pt-3 border-top">
                                            <small className="text-muted"><i className="fa-solid fa-calendar-days me-1"></i> {data?.updatedAt?.slice(0, 10)}</small>
                                            <div className="btn-group">
                                                <button className="btn btn-sm btn-outline-primary" onClick={() => handleUpdate(data)}><i className="fa-solid fa-edit"></i></button>
                                                <button className="btn btn-sm btn-outline-danger" onClick={() => { setModalVideo(data); setShowModal(true); }}><i className="fa-solid fa-trash"></i></button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {totalPages > 1 && (
                        <nav className="mt-5">
                            <ul className="pagination justify-content-center">
                                <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                                    <button className="page-link" onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}>Previous</button>
                                </li>
                                {[...Array(totalPages)].map((_, i) => (
                                    <li key={i} className={`page-item ${currentPage === i + 1 ? 'active' : ''}`}>
                                        <button className="page-link" onClick={() => setCurrentPage(i + 1)}>{i + 1}</button>
                                    </li>
                                ))}
                                <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                                    <button className="page-link" onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}>Next</button>
                                </li>
                            </ul>
                        </nav>
                    )}
                </>
            )}
        </div>
    );
}
