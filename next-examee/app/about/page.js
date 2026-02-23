"use client";
import React, { useEffect } from 'react';
import Footer from '../../components/Footer';

export default function AboutPage({ setProgress = () => { } }) {
    useEffect(() => {
        setProgress(0);
        setProgress(100);
    }, []);

    return (
        <main>
            <div className='about py-5 d-flex align-items-center' style={{ minHeight: "70vh" }}>
                <div className="container-md">
                    <div className="about-header text-center mb-5">
                        <h1 className="fw-bold"><i className="fas fa-leaf text-success me-2"></i>About Examee</h1>
                        <p className="text-secondary fs-5">Your smart companion for notes, videos, and PYQs — all in one place.</p>
                    </div>

                    <div className="row align-items-center">
                        <div className="col-md-6 text-center mb-4 mb-md-0">
                            <img
                                src="/assets/img/Sidebarbanner2.png"
                                alt="Study Linn"
                                className="img-fluid rounded-4 shadow-sm"
                                style={{ maxHeight: "450px" }}
                            />
                        </div>

                        <div className="col-md-6 about-text">
                            <h2 className="fw-bold mb-3"><i className="fas fa-bullseye text-danger me-2"></i>Our Mission</h2>
                            <p className="text-muted mb-4 fs-6">
                                Examee helps you study smarter, not harder. With clean notes, curated lectures, and important questions, we're here to make learning simple.
                            </p>

                            <h2 className="fw-bold mb-3"><i className="fas fa-box-open text-primary me-2"></i>What We Offer</h2>
                            <ul className="list-unstyled">
                                <li className="mb-2"><i className="fas fa-book-open text-info me-2"></i> Organized course notes</li>
                                <li className="mb-2"><i className="fas fa-video text-warning me-2"></i> Helpful video content</li>
                                <li className="mb-2"><i className="fas fa-file-alt text-secondary me-2"></i> Previous year papers</li>
                                <li className="mb-2"><i className="fas fa-bolt text-danger me-2"></i> Fast, focused platform</li>
                            </ul>
                        </div>
                    </div>

                    <div className="about-footer text-center mt-5">
                        <p className="fw-bold fs-5 text-dark"><i className="fas fa-users text-primary me-2"></i>Trusted by thousands of students.</p>
                    </div>
                </div>
            </div>

            <footer className="footer">
                <Footer />
            </footer>
        </main>
    );
}
