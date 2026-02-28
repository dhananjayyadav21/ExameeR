"use client";
import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { homeData } from '../../constants/homeData';

export default function PremiumExtra() {
    const { categories, testimonials } = homeData;
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
        <section ref={sectionRef} className="premium-extra-section py-5 bg-white overflow-hidden">
            {/* Exam Categories Section */}
            <div className={`container-xl py-5 transition-reveal ${isVisible ? 'reveal-visible' : 'reveal-hidden'}`}>
                <div className="text-center mb-5">
                    <div className="d-inline-block px-3 py-1 rounded-pill premium-badge mb-3">
                        <i className="fa-solid fa-graduation-cap me-2 small"></i> Top Categories
                    </div>
                    <h2 className="h2 fw-bold text-dark-blue mb-3">Explore Your Exam Category</h2>
                    <p className="text-muted fs-5 mx-auto" style={{ maxWidth: '700px' }}>
                        Examee is preparing students for 35+ exam categories. Find the one you are targetting and start your journey today.
                    </p>
                </div>

                <div className="row g-4 mb-5">
                    {categories.map((cat, i) => (
                        <div key={i} className={`col-lg-4 col-md-6 ${isVisible ? 'animate-fade-in-up' : 'reveal-hidden'}`} style={{ animationDelay: `${i * 0.12}s` }}>
                            <div className="category-card p-4 rounded-4 shadow-sm h-100 d-flex flex-column">
                                <div className="d-flex justify-content-between align-items-center mb-4">
                                    <div className="category-icon p-3 rounded-4 shadow-sm" style={{ background: cat.bg, color: cat.color }}>
                                        <i className={`fa-solid fa-${cat.icon} fs-4`}></i>
                                    </div>
                                    <h4 className="fw-bold text-dark-blue mb-0 ms-3 flex-grow-1" style={{ fontSize: '1.25rem' }}>{cat.title}</h4>
                                </div>

                                <div className="category-tags d-flex flex-wrap gap-2 mb-4">
                                    {cat.tags.map((tag, idx) => (
                                        <span key={idx} className="badge rounded-pill px-3 py-2 text-dark bg-premium-light border-0 fw-medium" style={{ fontSize: '0.75rem' }}>
                                            {tag}
                                        </span>
                                    ))}
                                </div>

                                <div className="mt-auto pt-3 border-top border-light-subtle">
                                    <Link href="/cource" className="text-decoration-none fw-bold text-dark d-flex align-items-center justify-content-between group">
                                        <span className="small text-uppercase ls-wide">Browse Courses</span>
                                        <i className="fa-solid fa-arrow-right-long text-secondary-blue group-hover-translate-x transition-all"></i>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Testimonials Section */}
            <div className={`container-xl py-5 transition-reveal ${isVisible ? 'reveal-visible' : 'reveal-hidden'}`} style={{ transitionDelay: '0.4s' }}>
                <div className="text-center mb-5">
                    <div className="d-inline-block px-3 py-1 rounded-pill premium-badge mb-3">
                        <i className="fa-solid fa-ranking-star me-2 small"></i> Student Success
                    </div>
                    <h2 className="h2 fw-bold text-dark-blue mb-3">What Our Students Say</h2>
                </div>

                <div className="row g-4">
                    {testimonials.map((test, i) => (
                        <div key={i} className={`col-lg-4 ${isVisible ? 'animate-fade-in-up' : 'reveal-hidden'}`} style={{ animationDelay: `${(i + 4) * 0.15}s` }}>
                            <div className="testimonial-card p-4 rounded-4 shadow-sm h-100 d-flex flex-column">
                                <div className="quote-icon mb-3 opacity-25">
                                    <i className="fa-solid fa-quote-left fs-1 text-secondary-blue"></i>
                                </div>

                                <p className="text-muted mb-4 flex-grow-1 lh-relaxed" style={{ fontSize: '0.95rem' }}>
                                    "{test.text}"
                                </p>

                                <div className="d-flex align-items-center gap-3 pt-3 border-top border-light-subtle">
                                    <div className="position-relative">
                                        <img src={test.img} alt={test.name} className="img-fluid rounded-circle shadow-sm" style={{ width: '55px', height: '55px', objectFit: 'cover' }} />
                                        <div className="position-absolute bottom-0 end-0 bg-success rounded-circle border border-2 border-white" style={{ width: '12px', height: '12px' }}></div>
                                    </div>
                                    <div className="test-info">
                                        <h6 className="fw-bold text-dark-blue mb-1" style={{ fontSize: '1rem' }}>{test.name}</h6>
                                        <p className="air-ranking mb-0" style={{ fontSize: '0.8rem' }}>{test.achievement}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
