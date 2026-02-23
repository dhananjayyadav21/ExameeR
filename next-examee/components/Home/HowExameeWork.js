"use client";
import React from 'react'

const HowExameeWork = () => {
    return (
        <section id="howItWorks" className="container py-5">
            <div className="text-center mb-5">
                <h6 className="text-primary fw-bold text-uppercase ls-wide mb-2">Process</h6>
                <h2 className="display-5 fw-bold mb-3">How <span className="text-gradient">Examee</span> Works</h2>
                <p className="text-muted mx-auto" style={{ maxWidth: '500px' }}>Your simple 3-step journey to academic excellence and professional skill mastery.</p>
            </div>

            <div className="row g-4 my-4">
                {[
                    { step: '1', title: 'Choose Your Course', desc: 'Browse through our curated catalog of technical and academic courses.', icon: 'fa-magnifying-glass', variant: 'primary' },
                    { step: '2', title: 'Access Materials', desc: 'Unlock instant access to verified study notes and video lectures.', icon: 'fa-folder-open', variant: 'success' },
                    { step: '3', title: 'Start Learning', desc: 'Track your progress and master concepts with structured modules.', icon: 'fa-graduation-cap', variant: 'purple' }
                ].map((item, i) => (
                    <div key={i} className="col-md-4">
                        <div className="text-center p-4 rounded-4 transition-all hover-lift">
                            <div className={`step-circle bg-${item.variant}-subtle text-${item.variant} mx-auto mb-4 d-flex align-items-center justify-content-center shadow-sm`}>
                                <h3 className="fw-bold m-0">{item.step}</h3>
                            </div>
                            <h4 className="fw-bold mb-3">{item.title}</h4>
                            <p className="text-muted small px-lg-4">{item.desc}</p>
                            <div className={`mt-3 text-${item.variant} opacity-50`}>
                                <i className={`fa-solid ${item.icon} fs-4`}></i>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="row g-4 mt-5">
                {[
                    { title: "Expert Verified", desc: "Content curated by subject matter professionals.", icon: "fa-shield-check", color: "primary" },
                    { title: "Regular Updates", desc: "Always aligned with the latest syllabus.", icon: "fa-arrows-rotate", color: "success" },
                    { title: "24/7 Access", desc: "Learn at your own pace, anytime, anywhere.", icon: "fa-clock", color: "info" },
                    { title: "Student Support", desc: "Dedicated guidance for all your queries.", icon: "fa-headset", color: "danger" }
                ].map((feat, i) => (
                    <div key={i} className="col-md-6 col-lg-3">
                        <div className="d-flex align-items-center p-3 rounded-4 bg-white shadow-sm border border-light transition-all hover-lift h-100">
                            <div className={`icon-sm bg-${feat.color}-subtle text-${feat.color} rounded-3 me-3 d-flex align-items-center justify-content-center`} style={{ width: '45px', height: '45px', minWidth: '45px' }}>
                                <i className={`fa-solid ${feat.icon} fs-5`}></i>
                            </div>
                            <div>
                                <h6 className="fw-bold mb-1">{feat.title}</h6>
                                <p className="text-muted smaller mb-0">{feat.desc}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <style jsx>{`
                .text-gradient { background: var(--primary-gradient); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
                .ls-wide { letter-spacing: 0.1em; font-size: 0.8rem; }
                .step-circle { width: 70px; height: 70px; border-radius: 50%; }
                .bg-purple-subtle { background-color: rgba(123, 8, 168, 0.1); }
                .text-purple { color: #7b08a8; }
                .hover-lift { transition: transform 0.3s ease; }
                .hover-lift:hover { transform: translateY(-5px); }
                .smaller { font-size: 0.75rem; }
            `}</style>
        </section>
    )
}

export default HowExameeWork
