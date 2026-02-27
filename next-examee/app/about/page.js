"use client";
import React, { useEffect, useState } from 'react';

import '../static-pages.css';

export default function AboutPage() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        setIsVisible(true);
    }, []);

    const features = [
        { icon: 'fa-book-open', variant: 'success', title: 'Study Notes', desc: 'Expert-verified, structured notes for every subject to streamline your learning experience.' },
        { icon: 'fa-video', variant: 'primary', title: 'Video Lectures', desc: 'Comprehensive video tutorials led by experts, designed to simplify complex concepts.' },
        { icon: 'fa-file-alt', variant: 'warning', title: 'Previous Papers', desc: 'A massive repository of past exam papers to help you master patterns and time management.' },
        { icon: 'fa-bolt', variant: 'danger', title: 'High Performance', desc: 'Built on optimized technology to ensure your study sessions are smooth and efficient.' },
    ];

    const stats = [
        { val: '10K+', label: 'Resources', icon: 'fa-layer-group', color: '#16a34a', bg: 'rgba(22,163,74,0.05)' },
        { val: '5K+', label: 'Students', icon: 'fa-users', color: '#2563eb', bg: 'rgba(37,99,235,0.05)' },
        { val: '100+', label: 'Instructors', icon: 'fa-user-tie', color: '#7c3aed', bg: 'rgba(124,58,237,0.05)' },
        { val: '500+', label: 'Q-Papers', icon: 'fa-file-invoice', color: '#d97706', bg: 'rgba(217,119,6,0.05)' },
    ];

    return (
        <main className="min-vh-100 bg-white position-relative overflow-hidden">
            {/* Subtle Gradient Accent */}
            <div className="position-absolute top-0 end-0 w-50 h-50 opacity-10 pointer-events-none bg-success-subtle blur-3xl rounded-circle translate-middle"></div>

            {/* Breadcrumb Header */}
            <div className="border-bottom py-3 position-sticky top-0 z-index-10 bg-white bg-opacity-75 backdrop-blur">
                <div className="container px-4">
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb mb-0 small fw-medium">
                            <li className="breadcrumb-item"><a href="/" className="text-decoration-none text-secondary hover-green transition-all">Home</a></li>
                            <li className="breadcrumb-item active text-primary-green">About Us</li>
                        </ol>
                    </nav>
                </div>
            </div>

            {/* Hero Section */}
            <section className="py-5 mt-4">
                <div className="container px-4">
                    <div className="row align-items-center g-5">
                        <div className={`col-lg-6 transition-reveal ${isVisible ? 'reveal-visible' : 'reveal-hidden'}`}>
                            <div className="d-inline-flex align-items-center bg-success-subtle text-success px-3 py-1 rounded-pill fw-semibold smaller mb-4 border border-success-subtle">
                                Our Mission
                            </div>
                            <h1 className="h1-large fw-bold text-dark-blue mb-4 lh-tight">
                                Empowering students with <br />
                                <span className="text-primary-green">Quality Academic Resources.</span>
                            </h1>
                            <p className="text-secondary fs-5 mb-5 lh-relaxed">
                                Examee is a dedicated digital ecosystem designed to provide students with verified, high-quality content that makes academic preparation more structured and efficient.
                            </p>
                            <div className="d-flex gap-3 flex-wrap">
                                <a href="/auth" className="btn btn-primary-premium rounded-pill px-5 py-3 shadow-sm fw-semibold">
                                    Join Examee Today
                                </a>
                                <a href="/contact" className="btn btn-outline-dark rounded-pill px-4 py-3 fw-semibold border-2 transition-all">
                                    Learn More
                                </a>
                            </div>
                        </div>
                        <div className={`col-lg-6 transition-reveal ${isVisible ? 'reveal-visible' : 'reveal-hidden'}`} style={{ transitionDelay: '0.1s' }}>
                            <div className="p-1 bg-light border border-light-subtle rounded-5 overflow-hidden shadow-sm">
                                <img
                                    src="/assets/img/Sidebarbanner2.png"
                                    alt="About Academic Excellence"
                                    className="img-fluid rounded-4 grayscale-hover transition-all"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats strip */}
            <section className="py-5 mb-5 mt-4">
                <div className="container px-4">
                    <div className="border border-light-subtle rounded-5 bg-light-subtle p-4 p-md-5">
                        <div className="row g-4 g-lg-0 align-items-center">
                            {stats.map((s, i) => (
                                <div key={i} className={`col-6 col-md-3 text-center ${i < 3 ? 'border-lg-end' : ''}`}>
                                    <h2 className="display-6 fw-bold mb-1" style={{ color: s.color }}>{s.val}</h2>
                                    <p className="text-muted fw-medium small mb-0">{s.label}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Feature Cards */}
            <section className="py-5 bg-white">
                <div className="container px-4">
                    <div className="text-center mb-5">
                        <h2 className="fw-bold text-dark-blue h2">The Examee Advantage</h2>
                        <p className="text-muted mx-auto mt-3" style={{ maxWidth: '600px' }}>Streamlined tools designed for modern academic success.</p>
                    </div>
                    <div className="row g-4">
                        {features.map((f, idx) => (
                            <div key={idx} className={`col-md-6 col-lg-3 transition-reveal ${isVisible ? 'reveal-visible' : 'reveal-hidden'}`} style={{ transitionDelay: `${0.1 * idx}s` }}>
                                <div className="p-4 rounded-4 bg-white h-100 border border-light-subtle hover-border-green transition-all shadow-sm">
                                    <div className={`icon-box-premium bg-${f.variant}-subtle text-${f.variant} mb-4`}>
                                        <i className={`fa-solid ${f.icon} fs-5`}></i>
                                    </div>
                                    <h5 className="fw-semibold text-dark-blue mb-3">{f.title}</h5>
                                    <p className="text-muted smaller mb-0 lh-relaxed">{f.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA section */}
            <section className="py-5 mb-5 mt-5">
                <div className="container px-4">
                    <div className="bg-dark-blue rounded-5 p-5 shadow-lg position-relative overflow-hidden">
                        <div className="row align-items-center position-relative z-1">
                            <div className="col-lg-8">
                                <h2 className="text-white fw-bold mb-3">Commitment to Excellence</h2>
                                <p className="text-white-50 fs-5 mb-0">
                                    We bridge the gap between effort and achievement by consolidating all necessary resources into one unified platform.
                                </p>
                            </div>
                            <div className="col-lg-4 text-lg-end mt-4 mt-lg-0">
                                <a href="/contact" className="btn btn-green rounded-pill px-5 py-3 fw-semibold">Contact Support</a>
                            </div>
                        </div>
                    </div>
                </div>
            </section>


        </main>
    );
}
