"use client";
import React, { useContext, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation';
import Modal from './Modal';
import ContentContext from '../context/ContentContext'
import { toast } from "react-toastify";
import { TierBadge, PlanGate } from './PlanGate';

const NotesItem = ({ notes }) => {
    const context = useContext(ContentContext);
    const { addInMylearning, removeFromMylearning, getDataFromMyLearning, RemoveMyLearningNotes, userData } = context;
    const userPlan = userData?.Plan || 'e0';
    const contentTier = notes?.accessTier || 'free';

    const [Notes, setNotes] = useState(notes);
    const pathname = usePathname();
    const router = useRouter();
    const isMyLearning = pathname === '/myLearning';


    const handleViewPDF = () => {
        router.push(`/pdfviewer?view=${encodeURIComponent(Notes?.fileUrl)}`);
    };

    const [showModal, setShowModal] = useState(false);

    const handleAddToMyLearning = async () => {
        try {
            let data = {
                contentId: Notes?._id,
                contentType: "Note"
            }
            setShowModal(false);
            const response = await addInMylearning(data);
            if (response.success === true) {
                setNotes({ ...Notes, isWatching: true });
                toast.success("Added to My Learning!");
            } else {
                toast.error(response.message || "Failed to add notes!");
            }
        } catch (error) {
            toast.error("Failed to add in My learning");
        }
    };

    const handleRemoveToMyLearning = async () => {
        try {
            let data = {
                contentId: Notes._id,
                contentType: "Note"
            }
            setShowModal(false);
            const response = await removeFromMylearning(data);
            if (response.success === true) {
                setNotes({ ...Notes, isWatching: false });
                RemoveMyLearningNotes(Notes._id)
                toast.info("Removed from My Learning");
            } else {
                toast.error(response.message || "Failed to remove Notes!");
            }
        } catch (error) {
            toast.error("Failed to remove from My learning");
        }
    };

    const cardThemes = [
        { bg: '#dcfce7', text: '#065f46', tag: '#10b981' },
        { bg: '#fef3c7', text: '#92400e', tag: '#f59e0b' },
        { bg: '#ccfbf1', text: '#115e59', tag: '#14b8a6' },
        { bg: '#f3f0ff', text: '#6b21a8', tag: '#a855f7' }
    ];
    const theme = cardThemes[Math.floor(Math.random() * cardThemes.length)];

    return (
        <>
            <Modal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                onConfirm={isMyLearning || Notes?.isWatching ? handleRemoveToMyLearning : handleAddToMyLearning}
                heading={isMyLearning || Notes?.isWatching ? `Remove from Learning?` : `Add to Learning?`}
                subHeading={Notes?.title}
            />

            <PlanGate userPlan={userPlan} contentTier={contentTier}>
                <div className="pw-card h-100 shadow-sm transition-all rounded-4 overflow-hidden bg-white border d-flex flex-column">
                    <div className="pw-card-header position-relative p-4" style={{ backgroundColor: theme.bg, height: '160px' }}>
                        <div className="d-flex flex-column h-100 justify-content-center">
                            <h4 className="fw-black mb-1" style={{ fontSize: '1.1rem', color: '#1a1a1a', maxWidth: '80%', lineHeight: '1.2' }}>
                                {Notes?.title}
                            </h4>
                            <div className="mt-2" style={{ display: 'flex', gap: 6, alignItems: 'center', flexWrap: 'wrap' }}>
                                <span className="badge text-white px-2 py-1 rounded-1 fw-bold" style={{ backgroundColor: theme.tag, fontSize: '0.6rem' }}>LECTURE NOTES</span>
                                <TierBadge tier={contentTier} />
                            </div>
                        </div>
                        <i className="fa-solid fa-file-lines position-absolute bottom-0 end-0 m-3 opacity-10 fs-1" style={{ fontSize: '4rem' }}></i>
                    </div>

                    <div className="card-body p-3 d-flex flex-column">
                        <div className="d-flex justify-content-between align-items-start mb-3">
                            <div>
                                <p className="text-muted small mb-1 fw-semibold">Professor</p>
                                <h6 className="fw-bold mb-0 text-truncate" style={{ fontSize: '0.9rem' }}>{Notes?.professor || "Expert Faculty"}</h6>
                            </div>
                            <button
                                className={`btn p-0 border-0 ${isMyLearning || Notes?.isWatching ? 'text-dark' : 'text-muted'}`}
                                onClick={() => setShowModal(true)}
                            >
                                <i className={`${isMyLearning || Notes?.isWatching ? 'fa-solid' : 'fa-regular'} fa-bookmark`}></i>
                            </button>
                        </div>

                        <div className="mt-auto pt-3 border-top d-flex gap-2">
                            <button
                                className="btn btn-dark fw-bold rounded-2 flex-grow-1 py-2"
                                style={{ fontSize: '0.85rem' }}
                                onClick={handleViewPDF}
                            >
                                View Notes
                            </button>
                            <button className="btn btn-light border rounded-2 d-flex align-items-center justify-content-center" style={{ width: '40px' }} onClick={handleViewPDF}>
                                <i className="fa-solid fa-arrow-up-right-from-square small"></i>
                            </button>
                        </div>
                    </div>

                    <style jsx>{`
                    .fw-black { font-weight: 900; }
                    .pw-card { border-radius: 16px; overflow: hidden; transition: transform 0.3s ease; }
                    .pw-card:hover { transform: translateY(-5px); }
                `}</style>
                </div>
            </PlanGate>
        </>
    )
}

export default NotesItem
