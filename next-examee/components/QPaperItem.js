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

    const cardThemes = [
        { bg: '#dcfce7', text: '#065f46', tag: '#10b981' },
        { bg: '#fef3c7', text: '#92400e', tag: '#f59e0b' },
        { bg: '#ccfbf1', text: '#115e59', tag: '#14b8a6' },
        { bg: '#dbeafe', text: '#1e40af', tag: '#3b82f6' }
    ];
    const theme = cardThemes[Math.floor(Math.random() * cardThemes.length)];

    return (
        <>
            <Modal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                onConfirm={isMyLearning || PYQ?.isWatching ? handleRemoveToMyLearning : handleAddToMyLearning}
                heading={isMyLearning || PYQ?.isWatching ? `Remove from Learning?` : `Add to Learning?`}
                subHeading={PYQ?.title || PYQ?.subject}
            />

            <div className="pw-card h-100 shadow-sm transition-all rounded-4 overflow-hidden bg-white border d-flex flex-column">
                <div className="pw-card-header position-relative p-4" style={{ backgroundColor: theme.bg, height: '160px' }}>
                    <div className="d-flex flex-column h-100 justify-content-center">
                        <h4 className="fw-black mb-1" style={{ fontSize: '1.2rem', color: '#1a1a1a', maxWidth: '80%', lineHeight: '1.1' }}>
                            PYQ {PYQ?.year}
                        </h4>
                        <div className="mt-2">
                            <span className="badge text-white px-2 py-1 rounded-1 fw-bold" style={{ backgroundColor: theme.tag, fontSize: '0.6rem' }}>
                                EXAM PAPER
                            </span>
                        </div>
                    </div>
                    <i className="fa-solid fa-graduation-cap position-absolute bottom-0 end-0 m-3 opacity-10 fs-1" style={{ fontSize: '4rem' }}></i>
                </div>

                <div className="card-body p-3 d-flex flex-column">
                    <div className="d-flex justify-content-between align-items-start mb-3">
                        <div>
                            <p className="text-muted small mb-1 fw-semibold">{PYQ?.subject || "Previous Paper"}</p>
                            <h6 className="fw-bold mb-0 text-truncate-2" style={{ fontSize: '0.88rem' }}>{PYQ?.title || PYQ?.subject}</h6>
                        </div>
                        <button
                            className={`btn p-0 border-0 ${isMyLearning || PYQ?.isWatching ? 'text-dark' : 'text-muted'}`}
                            onClick={() => setShowModal(true)}
                        >
                            <i className={`${isMyLearning || PYQ?.isWatching ? 'fa-solid' : 'fa-regular'} fa-bookmark`}></i>
                        </button>
                    </div>

                    <div className="mt-auto pt-3 border-top d-flex gap-2">
                        <button
                            className="btn btn-dark fw-bold rounded-2 flex-grow-1 py-2"
                            style={{ fontSize: '0.85rem' }}
                            onClick={handleViewPDF}
                        >
                            View Paper
                        </button>
                        <button className="btn btn-light border rounded-2 d-flex align-items-center justify-content-center" style={{ width: '40px' }} onClick={handleViewPDF}>
                            <i className="fa-solid fa-arrow-right small"></i>
                        </button>
                    </div>
                </div>

                <style jsx>{`
                    .fw-black { font-weight: 900; }
                    .pw-card { border-radius: 16px; overflow: hidden; transition: transform 0.3s ease; }
                    .pw-card:hover { transform: translateY(-5px); }
                    .text-truncate-2 { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; min-height: 2.5rem; }
                `}</style>
            </div>
        </>
    )
}

export default QPaperItem
