"use client";
import React, { useEffect, useRef, useState } from 'react'
import { homeData } from '../../constants/homeData'

const HowExameeWork = () => {
    const { howItWorks } = homeData;
    const { steps, features } = howItWorks;
    const sectionRef = useRef(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) setIsVisible(true);
            },
            { threshold: 0.1 }
        );
        if (sectionRef.current) observer.observe(sectionRef.current);
        return () => sectionRef.current && observer.unobserve(sectionRef.current);
    }, []);

    return (
        <section ref={sectionRef} id="howItWorks" className="container-xl py-5">
            <div className={`text-center mb-5 transition-reveal ${isVisible ? 'reveal-visible' : 'reveal-hidden'}`}>
                <div className="d-inline-block px-3 py-1 rounded-pill premium-badge mb-3">
                    <i className="fa-solid fa-list-check me-2 small"></i> Simple Process
                </div>
                <h2 className="h2 fw-bold mb-3 text-dark-blue">How <span className="text-primary-green">Examee</span> Works</h2>
                <p className="text-muted fs-5 mx-auto" style={{ maxWidth: '600px' }}>Your simple 3-step journey to academic excellence and professional skill mastery.</p>
            </div>

            <div className="row g-5 my-4 position-relative">
                {/* Connecting Line (Desktop) */}
                <div className="position-absolute top-50 start-0 w-100 d-none d-lg-block z-0" style={{ transform: 'translateY(-50%)', marginTop: '-40px' }}>
                    <div className="step-line-animated"></div>
                </div>

                {steps.map((item, i) => (
                    <div key={i} className={`col-lg-4 z-1 transition-reveal ${isVisible ? 'reveal-visible' : 'reveal-hidden'}`} style={{ transitionDelay: `${(i + 1) * 0.2}s` }}>
                        <div className="how-card text-center p-4 rounded-4 transition-all h-100 border-0" style={{ '--theme-color': `var(--${item.variant})` }}>
                            <div className={`step-circle-premium mx-auto mb-4 d-flex align-items-center justify-content-center fw-bold`}>
                                {item.step}
                            </div>
                            <h4 className="fw-bold mb-3 text-dark-blue fs-5">{item.title}</h4>
                            <p className="text-muted mb-4 px-lg-3 small">{item.desc}</p>
                            <div className={`step-icon-box mx-auto rounded-circle d-flex align-items-center justify-content-center text-${item.variant} shadow-sm`}>
                                <i className={`fa-solid ${item.icon} fs-4`}></i>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="features-marquee-container mt-5 py-4 overflow-hidden border-top border-bottom">
                <div className="marquee-track d-flex align-items-center">
                    {[...Array(4)].map((_, groupIdx) => (
                        <div key={groupIdx} className="d-flex align-items-center gap-4 px-2">
                            {features.map((feat, i) => (
                                <div key={i} className="feat-card-marquee flex-shrink-0" style={{ width: '300px' }}>
                                    <div className="feat-card d-flex align-items-center p-3 rounded-4 bg-white border border-light-subtle shadow-sm transition-all h-100">
                                        <div className={`icon-sm-premium bg-${feat.color}-subtle text-${feat.color} rounded-3 me-3 d-flex align-items-center justify-content-center`} style={{ width: '50px', height: '50px', minWidth: '50px' }}>
                                            <i className={`fa-solid ${feat.icon} fs-5`}></i>
                                        </div>
                                        <div>
                                            <h6 className="fw-bold mb-1 text-dark-blue">{feat.title}</h6>
                                            <p className="text-muted smaller mb-0">{feat.desc}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            </div>


        </section>
    )
}

export default HowExameeWork
