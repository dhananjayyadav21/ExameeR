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

    return (
        <div className="card h-100 border-0 shadow-sm transition-all hover-lift rounded-4 overflow-hidden bg-white">
            <div className="position-relative overflow-hidden" style={{ height: "180px" }}>
                <img className="w-100 h-100 transition-scale" src={Course?.courseImage ? `https://lh3.googleusercontent.com/d/${Course?.courseImage}` : "/assets/img/cource.jpg"} alt={Course?.title} style={{ objectFit: "cover" }} />
                {!Course?.isEnrolled && (
                    <div className="position-absolute top-0 end-0 m-3">
                        <span className="badge bg-green rounded-pill shadow-sm px-3 py-2">{Course?.offerPercent}% OFF</span>
                    </div>
                )}
            </div>
            <div className="card-body p-4 d-flex flex-column">
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <span className="badge bg-green-subtle text-green px-2 py-1 rounded-2 fw-semibold small text-uppercase ls-wide" style={{ fontSize: '0.65rem' }}>{Course?.courseLevel}</span>
                    <div className="d-flex align-items-center text-muted small">
                        <i className="fa-regular fa-clock me-1"></i> {Course?.duration}
                    </div>
                </div>
                <h6 className="card-title fw-semibold mb-2 line-clamp-2" style={{ fontSize: '0.9rem' }}>{Course?.title}</h6>
                <p className="card-text text-muted small mb-4 line-clamp-2">
                    {Course?.courseContents}
                </p>
                <div className="mt-auto">
                    {Course?.isEnrolled ? (
                        <button className="btn btn-dark w-100 rounded-pill py-2 fw-semibold d-flex align-items-center justify-content-center gap-2" style={{ fontSize: '0.85rem' }} onClick={() => handleWatchCourse(Course)}>
                            Continue Learning <i className="fa-solid fa-play small"></i>
                        </button>
                    ) : (
                        <button className="btn btn-green w-100 rounded-pill py-2 fw-semibold shadow-sm" style={{ fontSize: '0.85rem' }} onClick={() => handleEnroll(Course)}>
                            Enroll Now
                        </button>
                    )}
                </div>
            </div>

        </div>
    )
}

export default CourceIteam
