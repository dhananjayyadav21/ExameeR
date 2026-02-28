"use client";
import React, { useEffect, useState } from 'react';
import '../../styles/static-pages.css';

export default function PrivacyPage() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        setIsVisible(true);
    }, []);

    const sections = [
        {
            title: "Information We Collect",
            icon: "fa-user-check",
            content: "We collect information you provide directly to us when you create an account, such as your name, email address, and academic preferences. This helps us personalize your learning experience."
        },
        {
            title: "How We Use Your Data",
            icon: "fa-chart-line",
            content: "Your data is used to provide, maintain, and improve our services. We use your learning patterns to recommend the most relevant resources. We never sell your personal information."
        },
        {
            title: "Data Security",
            icon: "fa-shield-halved",
            content: "We implement industry-standard security measures to protect your data. This includes secure encryption for all data transfers and storage protocols to prevent unauthorized access."
        },
        {
            title: "Cookies & Tracking",
            icon: "fa-cookie-bite",
            content: "We use cookies to enhance your browsing experience, remember your login state, and analyze site traffic. You can control cookie settings through your browser."
        }
    ];

    return (
        <main className="min-vh-100 bg-white position-relative">
            {/* Breadcrumb Header */}
            <div className="border-bottom py-3 position-sticky top-0 z-index-10 bg-white bg-opacity-75 backdrop-blur">
                <div className="container px-4">
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb mb-0 small fw-medium">
                            <li className="breadcrumb-item"><a href="/" className="text-decoration-none text-secondary hover-green transition-all">Home</a></li>
                            <li className="breadcrumb-item active text-primary-green">Privacy Policy</li>
                        </ol>
                    </nav>
                </div>
            </div>

            <div className="container py-5 px-4">
                <div className="row justify-content-center">
                    <div className="col-lg-10">
                        {/* Policy Header */}
                        <div className={`text-center mb-5 transition-reveal ${isVisible ? 'reveal-visible' : 'reveal-hidden'}`}>
                            <span className="badge bg-primary-subtle text-primary fw-semibold rounded-pill px-3 py-2 mb-3 border border-primary-subtle">
                                Data Protection
                            </span>
                            <h1 className="h1-large fw-bold text-dark-blue mb-3">Privacy <span className="text-primary-green">Policy</span></h1>
                            <p className="text-muted mx-auto fs-5" style={{ maxWidth: '600px' }}>
                                Last Updated: February 2024. This policy describes how we handle your personal information at Examee.
                            </p>
                        </div>

                        {/* Policy Grid */}
                        <div className="row g-4 mt-2">
                            {sections.map((sec, idx) => (
                                <div key={idx} className={`col-md-6 transition-reveal ${isVisible ? 'reveal-visible' : 'reveal-hidden'}`} style={{ transitionDelay: `${0.1 * idx}s` }}>
                                    <div className="p-4 p-lg-5 rounded-5 border border-light-subtle bg-light-subtle h-100 hover-border-green transition-all shadow-sm">
                                        <div className="rounded-3 bg-white text-success d-flex align-items-center justify-content-center mb-4 shadow-sm"
                                            style={{ width: '48px', height: '48px' }}>
                                            <i className={`fa-solid ${sec.icon} fs-5`}></i>
                                        </div>
                                        <h4 className="fw-semibold text-dark-blue mb-3">{sec.title}</h4>
                                        <p className="text-muted lh-relaxed smaller mb-0">
                                            {sec.content}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Detailed Section */}
                        <div className={`mt-5 p-4 p-md-5 rounded-5 border border-light-subtle bg-white transition-reveal ${isVisible ? 'reveal-visible' : 'reveal-hidden'}`} style={{ transitionDelay: '0.4s' }}>
                            <h5 className="fw-bold text-dark-blue mb-4">Detailed Terms</h5>
                            <div className="text-muted smaller lh-lg">
                                <p>
                                    Examee ("we", "us", or "our") operates the learning platform. By using the platform, you agree to the collection and use of information in accordance with this policy.
                                </p>
                                <p>
                                    We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date.
                                </p>
                            </div>
                        </div>

                        <div className="text-center mt-5 mb-5 p-4 rounded-4 bg-dark-blue text-white shadow-lg">
                            <p className="mb-0 fw-medium">Questions about your data? <a href="/contact" className="text-primary-green text-decoration-none ms-2 fw-bold">Contact Support &rarr;</a></p>
                        </div>
                    </div>
                </div>
            </div>


        </main>
    );
}
