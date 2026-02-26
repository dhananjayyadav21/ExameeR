"use client";
import React, { useContext, useEffect, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation';
import Modal from './Modal';
import ContentContext from '../context/ContentContext'
import { toast } from "react-toastify";

const QPaperItem = ({ pyq }) => {
    const context = useContext(ContentContext);
    const { addInMylearning, removeFromMylearning, getDataFromMyLearning, RemoveMyLearningPYQ } = context;

    const [PYQ, setPYQ] = useState(pyq);
    const pathname = usePathname();
    const router = useRouter();
    const isMyLearning = pathname === '/myLearning';

    useEffect(() => {
        getDataFromMyLearning();
    }, []);

    const handleViewPDF = () => {
        router.push(`/pdfviewer?view=${encodeURIComponent(PYQ.fileUrl)}`);
    };

    const [showModal, setShowModal] = useState(false);

    const handleAddToMyLearning = async () => {
        try {
            let data = {
                contentId: PYQ?._id,
                contentType: "PYQ"
            }
            setShowModal(false);
            const response = await addInMylearning(data);
            if (response.success === true) {
                setPYQ({ ...PYQ, isWatching: true });
                toast.success("Added to My Learning!");
            } else {
                toast.error(response.message || "Failed to add pyq!");
            }
        } catch (error) {
            toast.error("Failed to add in My learning");
        }
    };

    const handleRemoveToMyLearning = async () => {
        try {
            let data = {
                contentId: PYQ._id,
                contentType: "PYQ"
            }
            setShowModal(false);
            const response = await removeFromMylearning(data);
            if (response.success === true) {
                setPYQ({ ...PYQ, isWatching: false });
                RemoveMyLearningPYQ(PYQ._id);
                toast.info("Removed from My Learning");
            } else {
                toast.error(response.message || "Failed to remove pyq!");
            }
        } catch (error) {
            toast.error("Failed to remove from My learning");
        }
    };

    return (
        <>
            <Modal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                onConfirm={isMyLearning || PYQ?.isWatching ? handleRemoveToMyLearning : handleAddToMyLearning}
                heading={isMyLearning || PYQ?.isWatching ? `Remove from Learning?` : `Add to Learning?`}
                subHeading={PYQ?.title || PYQ?.subject}
            />

            <div className="card h-100 border-0 shadow-sm transition-all hover-lift rounded-4 overflow-hidden bg-white">
                <div className="card-header border-0 bg-transparent p-4 pb-0 d-flex justify-content-between align-items-center">
                    <div className="bg-warning-subtle rounded-circle p-3 d-flex align-items-center justify-content-center" style={{ width: '55px', height: '55px' }}>
                        <i className="fa-solid fa-file-contract text-warning fs-4"></i>
                    </div>
                    <button
                        className={`btn p-0 border-0 ${isMyLearning || PYQ?.isWatching ? 'text-green' : 'text-muted opacity-50'}`}
                        onClick={() => setShowModal(true)}
                        title={isMyLearning || PYQ?.isWatching ? "Saved" : "Save for later"}
                    >
                        <div className="d-flex align-items-center justify-content-center" style={{ width: '32px', height: '32px' }}>
                            <i className={`${isMyLearning || PYQ?.isWatching ? 'fa-solid' : 'fa-regular'} fa-bookmark fs-5`}></i>
                        </div>
                    </button>
                </div>

                <div className="card-body p-4">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                        <span className="badge bg-light text-dark border px-2 py-1 rounded-2 fw-semibold smaller uppercase-ls">Session {PYQ?.year}</span>
                    </div>
                    <h6 className="fw-semibold mb-3 text-truncate-2" style={{ fontSize: '0.88rem' }} title={PYQ?.title || PYQ?.subject}>{PYQ?.title || PYQ?.subject}</h6>

                    <button
                        className="btn btn-yellow w-100 rounded-pill py-2 fw-semibold d-flex align-items-center justify-content-center gap-2 transition-all hover-fill"
                        onClick={handleViewPDF}
                    >
                        <span>View Question Paper</span>
                        <i className="fa-solid fa-arrow-right small"></i>
                    </button>
                </div>

                <style jsx>{`
                    .hover-lift { transition: all 0.3s cubic-bezier(0.165, 0.84, 0.44, 1); }
                    .hover-lift:hover { transform: translateY(-5px); box-shadow: 0 10px 20px rgba(0,0,0,0.08) !important; }
                    .btn-yellow { 
                        background: transparent; 
                        color: #fbbf24; 
                        border: 2px solid #fbbf24; 
                    }
                    .btn-yellow:hover { 
                        background: #fbbf24; 
                        color: #000 !important; 
                        box-shadow: 0 4px 12px rgba(251, 191, 36, 0.2);
                    }
                    .text-truncate-2 { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; min-height: 2.5rem; }
                    .uppercase-ls { letter-spacing: 0.05em; font-size: 0.7rem; }
                `}</style>
            </div>
        </>
    )
}

export default QPaperItem
