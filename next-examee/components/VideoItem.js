"use client";
import React, { useContext, useState, useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation';
import Modal from './Modal';
import ContentContext from '../context/ContentContext'
import { toast } from "react-toastify";

const VideoItem = ({ video }) => {
    const context = useContext(ContentContext);
    const { addInMylearning, removeFromMylearning, getDataFromMyLearning, RemoveMyLearningVideo } = context;

    const videoContainerRef = useRef();

    const handleFullscreen = () => {
        if (videoContainerRef.current) {
            if (document.fullscreenElement) {
                document.exitFullscreen();
            } else {
                videoContainerRef.current.requestFullscreen();
            }
        }
    };

    const [Video, setVideo] = useState(video);
    const pathname = usePathname();
    const isMyLearning = pathname === '/myLearning';


    const [showModal, setShowModal] = useState(false);

    const handleAddToMyLearning = async () => {
        try {
            let data = {
                contentId: Video?._id,
                contentType: "Video"
            }
            setShowModal(false);
            const response = await addInMylearning(data);
            if (response.success === true) {
                setVideo({ ...Video, isWatching: true });
                toast.success("Added to My Learning!");
            } else {
                toast.error(response.message || "Failed to add Video!");
            }
        } catch (error) {
            toast.error("Failed to add in My learning");
        }
    };

    const handleRemoveToMyLearning = async () => {
        try {
            let data = {
                contentId: Video._id,
                contentType: "Video"
            }
            setShowModal(false);
            const response = await removeFromMylearning(data);
            if (response.success === true) {
                setVideo({ ...Video, isWatching: false });
                RemoveMyLearningVideo(Video._id);
                toast.info("Removed from My Learning");
            } else {
                toast.error(response.message || "Failed to remove Video!");
            }
        } catch (error) {
            toast.error("Failed to remove from My learning");
        }
    };

    return (
        <div className="h-100">
            <Modal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                onConfirm={isMyLearning || Video?.isWatching ? handleRemoveToMyLearning : handleAddToMyLearning}
                heading={isMyLearning || Video?.isWatching ? `Remove from Learning?` : `Add to Learning?`}
                subHeading={Video?.title}
            />

            <div className="card h-100 border-0 shadow-sm transition-all hover-lift rounded-4 overflow-hidden bg-white">
                <div className="position-relative overflow-hidden bg-dark" ref={videoContainerRef} style={{ aspectRatio: '16/9' }}>
                    <iframe
                        className="w-100 h-100 border-0"
                        src={`https://www.youtube.com/embed/${Video?.fileUrl}?rel=0&modestbranding=1`}
                        title={Video?.title}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                    ></iframe>
                    <button
                        onClick={handleFullscreen}
                        className="btn btn-sm btn-white position-absolute top-0 end-0 m-2 opacity-0 hover-show rounded-pill shadow-sm"
                        style={{ zIndex: 10 }}
                    >
                        <i className="fa-solid fa-expand"></i>
                    </button>
                </div>

                <div className="card-body p-4 d-flex flex-column">
                    <div className="d-flex justify-content-between align-items-start mb-3">
                        <h6 className="fw-semibold mb-0 text-truncate-2 flex-grow-1" style={{ fontSize: '0.88rem' }} title={Video?.title}>{Video?.title}</h6>
                        <button
                            className={`btn p-0 border-0 ${isMyLearning || Video?.isWatching ? 'text-green' : 'text-muted opacity-50'}`}
                            onClick={() => setShowModal(true)}
                            title={isMyLearning || Video?.isWatching ? "Saved" : "Save for later"}
                        >
                            <div className="d-flex align-items-center justify-content-center" style={{ width: '32px', height: '32px' }}>
                                <i className={`${isMyLearning || Video?.isWatching ? 'fa-solid' : 'fa-regular'} fa-bookmark fs-5`}></i>
                            </div>
                        </button>
                    </div>
                    <p className="text-muted smaller mb-0 text-truncate-2 lh-sm opacity-75">
                        {Video?.description || "No description provided for this video lecture."}
                    </p>
                </div>

                <style jsx>{`
                    .hover-lift { transition: all 0.3s cubic-bezier(0.165, 0.84, 0.44, 1); }
                    .hover-lift:hover { transform: translateY(-5px); box-shadow: 0 10px 20px rgba(0,0,0,0.08) !important; }
                    .text-truncate-2 { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
                    .smaller { font-size: 0.75rem; }
                    .btn-white { background: rgba(255,255,255,0.9); }
                    .hover-show { transition: opacity 0.3s ease; }
                    .card:hover .hover-show { opacity: 1 !important; }
                `}</style>
            </div>
        </div>
    )
}

export default VideoItem
