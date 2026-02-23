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
                    <span className="badge bg-green-subtle text-green px-2 py-1 rounded-2 fw-bold small text-uppercase ls-wide">{Course?.courseLevel}</span>
                    <div className="d-flex align-items-center text-muted small">
                        <i className="fa-regular fa-clock me-1"></i> {Course?.duration}
                    </div>
                </div>
                <h6 className="card-title fw-bold mb-2 line-clamp-2">{Course?.title}</h6>
                <p className="card-text text-muted small mb-4 line-clamp-2">
                    {Course?.courseContents}
                </p>
                <div className="mt-auto">
                    {Course?.isEnrolled ? (
                        <button className="btn btn-dark w-100 rounded-pill py-2 fw-bold d-flex align-items-center justify-content-center gap-2" onClick={() => handleWatchCourse(Course)}>
                            Continue Learning <i className="fa-solid fa-play small"></i>
                        </button>
                    ) : (
                        <button className="btn btn-green w-100 rounded-pill py-2 fw-bold shadow-sm" onClick={() => handleEnroll(Course)}>
                            Enroll Now
                        </button>
                    )}
                </div>
            </div>
            <style jsx>{`
                .hover-lift { transition: transform 0.3s ease, box-shadow 0.3s ease; }
                .hover-lift:hover { transform: translateY(-8px); box-shadow: 0 12px 24px rgba(0,0,0,0.1) !important; }
                .transition-scale { transition: transform 0.5s ease; }
                .hover-lift:hover .transition-scale { transform: scale(1.05); }
                .line-clamp-2 { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
                .ls-wide { letter-spacing: 0.05em; }
                .bg-green { background: #04bd20 !important; }
                .bg-green-subtle { background: rgba(4, 189, 32, 0.1); }
                .text-green { color: #04bd20 !important; }
            `}</style>
        </div>
    )
}

export default CourceIteam
