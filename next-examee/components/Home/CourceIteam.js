"use client";
import React, { useContext } from 'react'
import { useRouter } from 'next/navigation'
import ContentContext from '../../context/ContentContext'

const CourceIteam = ({ Course }) => {
    const router = useRouter();
    const { setSelectedCourse } = useContext(ContentContext);

    const handleEnroll = (course) => {
        setSelectedCourse(course);
        router.push("/enrollmentcource");
    };

    const handleWatchCourse = (course) => {
        setSelectedCourse(course);
        router.push("/WatchCourse");
    };

    const cardThemes = [
        { bg: '#dcfce7', text: '#065f46', tag: '#10b981' },
        { bg: '#fef3c7', text: '#92400e', tag: '#f59e0b' },
        { bg: '#ccfbf1', text: '#115e59', tag: '#14b8a6' },
        { bg: '#dbeafe', text: '#1e40af', tag: '#3b82f6' }
    ];
    const theme = cardThemes[Math.floor(Math.random() * cardThemes.length)];

    return (
        <div className="pw-card h-100 shadow-sm transition-all rounded-4 overflow-hidden bg-white border">
            <div className="pw-card-header position-relative p-4" style={{ backgroundColor: theme.bg, height: '180px' }}>
                <div className="d-flex flex-column h-100 justify-content-center">
                    <h3 className="fw-black mb-1" style={{ fontSize: '1.2rem', color: '#1a1a1a', maxWidth: '70%', lineHeight: '1.1' }}>
                        {Course?.title?.split(' ')[0]} {new Date().getFullYear() + 1}
                    </h3>
                    <div className="mt-2">
                        <span className="badge text-white px-2 py-1 rounded-1 fw-bold" style={{ backgroundColor: theme.tag, fontSize: '0.65rem' }}>
                            {Course?.courseLevel || "EXPERT BATCH"}
                        </span>
                    </div>
                </div>
                <img
                    src="/assets/img/instructor-preview.png"
                    alt="Instructor"
                    className="position-absolute bottom-0 end-0"
                    style={{ height: '100%', objectFit: 'contain', zIndex: 1 }}
                />
            </div>

            <div className="card-body p-3">
                <div className="d-flex justify-content-between align-items-start mb-2">
                    <div>
                        <p className="text-muted small mb-1 fw-semibold">{Course?.subject || "Core Subjects"}</p>
                        <h6 className="fw-bold mb-2 line-clamp-1" style={{ fontSize: '0.9rem' }}>{Course?.title}</h6>
                    </div>
                    <span className="badge bg-light text-dark border px-2 py-1 rounded-1 fw-bold" style={{ fontSize: '0.6rem' }}>HINGLISH</span>
                </div>

                <div className="pw-status d-flex align-items-center gap-2 mb-3">
                    <div className="rounded-circle" style={{ width: '8px', height: '8px', backgroundColor: '#ef4444' }}></div>
                    <span className="fw-bold text-danger" style={{ fontSize: '0.75rem' }}>Ongoing</span>
                    <span className="text-muted" style={{ fontSize: '0.75rem' }}>• Starts on 1st Jun'25</span>
                </div>

                <div className="d-flex align-items-center gap-2 mb-4 text-muted smaller">
                    <i className="fa-regular fa-calendar"></i>
                    <span>Target {Course?.duration || "2025"}</span>
                </div>

                <div className="d-flex align-items-center justify-content-between mt-auto pt-2 border-top">
                    <div>
                        <div className="d-flex align-items-baseline gap-2">
                            <span className="fw-black fs-5">₹2,999</span>
                            <span className="text-muted text-decoration-line-through smaller">₹6,000</span>
                        </div>
                        <span className="text-success fw-bold smaller">50% OFF</span>
                    </div>
                    <div className="d-flex gap-2">
                        <button className="btn btn-dark fw-bold rounded-2 px-3 py-2" style={{ fontSize: '0.8rem' }} onClick={() => Course?.isEnrolled ? handleWatchCourse(Course) : handleEnroll(Course)}>
                            {Course?.isEnrolled ? 'Continue' : 'Buy Now'}
                        </button>
                        <button className="btn btn-light border rounded-2 d-flex align-items-center justify-content-center" style={{ width: '38px' }}>
                            <i className="fa-solid fa-chevron-right small"></i>
                        </button>
                    </div>
                </div>
            </div>

            <style jsx>{`
                .fw-black { font-weight: 900; }
                .smaller { font-size: 0.75rem; }
                .line-clamp-1 { display: -webkit-box; -webkit-line-clamp: 1; -webkit-box-orient: vertical; overflow: hidden; }
            `}</style>
        </div>
    )
}

export default CourceIteam
