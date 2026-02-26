"use client";
import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { homeData } from '../../constants/homeData';

export default function PremiumFeatures() {
    const { trustedStats, studyResources } = homeData;
    const sectionRef = useRef(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                }
            },
            { threshold: 0.1 }
        );

        if (sectionRef.current) {
            observer.observe(sectionRef.current);
        }

        return () => {
            if (sectionRef.current) {
                observer.unobserve(sectionRef.current);
            }
        };
    }, []);

    return (
        <section ref={sectionRef} className="premium-features-section overflow-hidden">
            {/* Trusted Stats Section - White Background */}
            <div className="bg-white py-5">
                <div className={`container-xl py-5 transition-reveal ${isVisible ? 'reveal-visible' : 'reveal-hidden'}`}>
                    <div className="text-center mb-5">
                        <div className="d-inline-block px-3 py-1 rounded-pill premium-badge mb-3">
                            <i className="fa-solid fa-star me-2 small"></i> Impact & Trust
                        </div>
                        <h2 className="h2 fw-bold text-dark-blue mb-3">A Platform Trusted by Students</h2>
                        <p className="text-muted fs-5 mx-auto" style={{ maxWidth: '700px' }}>
                            Examee aims to transform not just through words, but provide results with numbers! Join the revolution in digital learning.
                        </p>
                    </div>

                    <div className="row g-4 mb-5">
                        {trustedStats.map((stat, i) => (
                            <div key={i} className={`col-lg-3 col-md-6 ${isVisible ? 'animate-fade-in-up' : 'reveal-hidden'}`} style={{ animationDelay: `${i * 0.15}s` }}>
                                <div className="stat-card p-5 h-100 rounded-4 text-center border-0 transition-transform shadow-sm" style={{ backgroundColor: stat.bg }}>
                                    <div className="stat-icon-mb mb-4 d-inline-flex p-3 rounded-circle bg-white shadow-sm" style={{ color: stat.color }}>
                                        <i className={`fa-solid fa-${stat.icon} fs-3`}></i>
                                    </div>
                                    <h3 className="fw-black mb-2" style={{ fontSize: '2rem', color: stat.color }}>{stat.count}</h3>
                                    <p className="text-secondary fw-bold mb-0 text-uppercase ls-wide" style={{ fontSize: '0.8rem' }}>{stat.label}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="text-center mb-5">
                        <Link href="/auth" className="btn btn-primary-premium btn-lg rounded-pill px-5 py-3 fw-bold shadow-lg">
                            Get Started <i className="fa-solid fa-arrow-right ms-2"></i>
                        </Link>
                    </div>
                </div>
            </div>

            {/* Study Resources Section - Light Grey Background */}
            <div className="bg-premium-light py-5">
                <div className={`container-xl py-5 transition-reveal ${isVisible ? 'reveal-visible' : 'reveal-hidden'}`} style={{ transitionDelay: '0.3s' }}>
                    <div className="text-center mb-5">
                        <div className="d-inline-block px-3 py-1 rounded-pill bg-success-subtle-premium text-primary-green fw-bold small-tag mb-3 text-uppercase ls-wide">
                            Knowledge Hub
                        </div>
                        <h2 className="h2 fw-bold text-dark-blue mb-3">Comprehensive Study Resources</h2>
                        <p className="text-muted fs-5 mx-auto" style={{ maxWidth: '700px' }}>
                            A diverse array of learning materials to enhance your educational journey with quality and depth.
                        </p>
                    </div>

                    <div className="row g-4">
                        {studyResources.map((res, i) => (
                            <div key={i} className={`col-lg-4 ${isVisible ? 'animate-fade-in-up' : 'reveal-hidden'}`} style={{ animationDelay: `${(i + 4) * 0.1}s` }}>
                                <div className="resource-card p-4 h-100 rounded-4 shadow-sm">
                                    <div className="d-flex align-items-center gap-3 mb-4">
                                        <div className="resource-icon-box text-primary">
                                            <i className={`fa-solid fa-${res.icon} fs-4`}></i>
                                        </div>
                                        <h4 className="fw-bold mb-0 text-dark-blue fs-5">{res.title}</h4>
                                    </div>
                                    <p className="text-secondary mb-4 small-text-res">
                                        {res.desc}
                                    </p>

                                    <div className="resource-img-overlay p-3 mb-4">
                                        <img src={res.img} alt={res.title} className="img-fluid rounded resource-preview-img" style={{ height: '180px', objectFit: 'contain', width: '100%' }} />
                                    </div>

                                    <Link href="/cource" className="btn btn-dark-outline rounded-pill px-4 py-2 w-100 fw-bold d-flex align-items-center justify-content-center group">
                                        Explore More <i className="fa-solid fa-arrow-right ms-2 small group-hover-translate-x transition-all"></i>
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
