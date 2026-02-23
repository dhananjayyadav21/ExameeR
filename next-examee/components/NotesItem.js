"use client";
import React, { useContext, useState, useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation';
import Modal from './Modal';
import ContentContext from '../context/ContentContext'
import { toast } from "react-toastify";

const NotesItem = ({ notes }) => {
    const context = useContext(ContentContext);
    const { addInMylearning, removeFromMylearning, getDataFromMyLearning, RemoveMyLearningNotes } = context;

    const [Notes, setNotes] = useState(notes);
    const pathname = usePathname();
    const router = useRouter();
    const isMyLearning = pathname === '/myLearning';

    useEffect(() => {
        getDataFromMyLearning();
    }, []);

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

    return (
        <>
            <Modal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                onConfirm={isMyLearning || Notes?.isWatching ? handleRemoveToMyLearning : handleAddToMyLearning}
                heading={isMyLearning || Notes?.isWatching ? `Remove from Learning?` : `Add to Learning?`}
                subHeading={Notes?.title}
            />

            <div className="card h-100 border-0 shadow-sm transition-all hover-lift rounded-4 overflow-hidden bg-white">
                <div className="card-header border-0 bg-transparent p-4 pb-0 d-flex justify-content-between align-items-center">
                    <div className="bg-primary-subtle rounded-circle p-3 d-flex align-items-center justify-content-center" style={{ width: '55px', height: '55px' }}>
                        <i className="fa-solid fa-file-pdf text-primary fs-4"></i>
                    </div>
                    <button
                        className={`btn p-0 border-0 ${Notes?.isWatching ? 'text-danger' : 'text-primary'}`}
                        onClick={() => setShowModal(true)}
                        title={Notes?.isWatching ? "Remove from learning" : "Add to learning"}
                    >
                        <div className={`rounded-circle shadow-sm border d-flex align-items-center justify-content-center bg-white`} style={{ width: '32px', height: '32px' }}>
                            <i className={`fa-solid ${Notes?.isWatching ? 'fa-minus' : 'fa-plus'} small`}></i>
                        </div>
                    </button>
                </div>

                <div className="card-body p-4">
                    <h6 className="fw-bold mb-1 text-truncate" title={Notes?.title}>{Notes?.title}</h6>
                    <p className="small text-muted mb-4 d-flex align-items-center gap-1">
                        <i className="fa-solid fa-user-tie smaller opacity-50"></i> {Notes?.professor || "Unknown Author"}
                    </p>

                    <button
                        className="btn btn-outline-primary w-100 rounded-pill py-2 fw-bold d-flex align-items-center justify-content-center gap-2 transition-all hover-fill"
                        onClick={handleViewPDF}
                    >
                        <span>View Notes</span>
                        <i className="fa-solid fa-arrow-up-right-from-square small"></i>
                    </button>
                </div>

                <style jsx>{`
                    .hover-lift { transition: all 0.3s cubic-bezier(0.165, 0.84, 0.44, 1); }
                    .hover-lift:hover { transform: translateY(-5px); box-shadow: 0 10px 20px rgba(0,0,0,0.08) !important; }
                    .hover-fill:hover { background-color: var(--primary-color) !important; color: white !important; border-color: var(--primary-color) !important; }
                    .smaller { font-size: 0.7rem; }
                    .smaller-auth { font-size: 0.8rem; }
                `}</style>
            </div>
        </>
    )
}

export default NotesItem
