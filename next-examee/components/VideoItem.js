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

            <div className="pw-card h-100 shadow-sm transition-all rounded-4 overflow-hidden bg-white border d-flex flex-column">
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

                <div className="card-body p-3 d-flex flex-column">
                    <div className="d-flex justify-content-between align-items-start mb-2">
                        <div className="flex-grow-1 overflow-hidden">
                            <span className="badge bg-danger text-white px-2 py-1 rounded-1 fw-bold mb-2 uppercase-ls" style={{ fontSize: '0.6rem' }}>VIDEO LECTURE</span>
                            <h6 className="fw-bold mb-1 text-truncate-2" style={{ fontSize: '0.9rem' }} title={Video?.title}>{Video?.title}</h6>
                        </div>
                        <button
                            className={`btn p-0 border-0 ${isMyLearning || Video?.isWatching ? 'text-dark' : 'text-muted'}`}
                            onClick={() => setShowModal(true)}
                        >
                            <i className={`${isMyLearning || Video?.isWatching ? 'fa-solid' : 'fa-regular'} fa-bookmark`}></i>
                        </button>
                    </div>

                    <p className="text-muted smaller mb-0 text-truncate-2 lh-sm opacity-75 mb-3">
                        {Video?.description || "Watch this comprehensive video lecture to master the core concepts."}
                    </p>

                    <div className="mt-auto pt-3 border-top">
                        <button className="btn btn-dark fw-bold rounded-2 w-100 py-2 d-flex align-items-center justify-content-center gap-2" style={{ fontSize: '0.85rem' }} onClick={handleFullscreen}>
                            Watch Fullscreen <i className="fa-solid fa-play small"></i>
                        </button>
                    </div>
                </div>

                <style jsx>{`
                    .pw-card { border-radius: 16px; overflow: hidden; transition: transform 0.3s ease; }
                    .pw-card:hover { transform: translateY(-5px); }
                    .text-truncate-2 { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; min-height: 2.4rem; }
                    .smaller { font-size: 0.75rem; }
                    .btn-white { background: rgba(255,255,255,0.9); }
                    .hover-show { opacity: 0; transition: opacity 0.3s ease; }
                    .pw-card:hover .hover-show { opacity: 1 !important; }
                    .uppercase-ls { letter-spacing: 0.05em; }
                `}</style>
            </div>
        </div>
    )
}

export default VideoItem
