"use client";
import React from 'react';
import Link from 'next/link';
import { ReactTyped } from "react-typed";

export default function PremiumHero({ token }) {
    return (
        <div className="premium-hero-container position-relative overflow-hidden py-5 pt-0">
            {/* Dynamic Background Elements */}
            <div className="bg-blob-1"></div>
            <div className="bg-blob-2"></div>

            <div className="container-xl px-4 position-relative z-1">
                <div className="row align-items-center g-5 py-5">
                    {/* Left Column - Content */}
                    <div className="col-lg-6 mt-0">
                        <div className="hero-content text-start mt-4">
                            <div className="d-inline-flex align-items-center bg-white shadow-sm border rounded-pill px-2 py-1 mb-4 animate-fade-in-up">
                                <span className="badge bg-primary text-white rounded-pill me-2 py-1">New</span>
                                <span className="small text-secondary fw-medium">Bharat's Most Trusted Learning Platform</span>
                            </div>

                            <h1 className="hero-title mb-4 fw-black">
                                Bharat's <span className="text-secondary-blue">Trusted &</span><br />
                                <span className="text-secondary-blue">Affordable</span> Educational <br />
                                <span className="text-primary-green">Platform</span>
                            </h1>

                            <p className="hero-subtitle mb-5 text-muted pe-lg-5">
                                Unlock your potential by signing up with Examee - The most affordable & expert-curated learning solution. Access thousands of study materials at your fingertips.
                            </p>

                            <div className="d-flex flex-wrap align-items-center gap-3 mb-5">
                                <Link href={token ? "/dashboard" : "/auth"} className="btn btn-primary-premium btn-lg rounded-pill px-5 py-3 fw-bold shadow-lg shadow-primary-light">
                                    Get Started
                                </Link>
                                <div className="d-flex align-items-center gap-2 ms-lg-3">
                                    <div className="avatar-group d-flex">
                                        {[1, 2, 3].map(i => (
                                            <div key={i} className="avatar-circle border border-white bg-light rounded-circle overflow-hidden ms-n2 shadow-sm" style={{ width: '40px', height: '40px', background: `url(https://i.pravatar.cc/100?img=${i + 10}) center/cover` }}></div>
                                        ))}
                                    </div>
                                    <span className="small text-muted fw-bold">10M+ Happy Students</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Images/Visuals */}
                    <div className="col-lg-6 position-relative text-center">
                        <div className="hero-visual-wrapper position-relative py-5">
                            {/* Main Image Avatar Container with Animation */}
                            <div className="instructor-circle-wrapper mx-auto position-relative animate-float-slow">
                                <div className="circle-border-dotted"></div>
                                <div className="instructor-image-container overflow-hidden shadow-2xl">
                                    <img src="/assets/img/Front.png" alt="Instructor" className="img-fluid hero-main-img" />
                                </div>

                                {/* Floating Bubbles */}
                                <div className="floating-bubble bubble-1 shadow-lg animate-bounce-slow">
                                    <div className="d-flex align-items-center gap-2 px-3 py-2">
                                        <div className="bubble-icon bg-info text-white rounded-circle"><i className="fa-solid fa-book-open small"></i></div>
                                        <div className="bubble-text text-start">
                                            <div className="fw-bold smaller-alt text-dark">500+ Notes</div>
                                            <div className="smaller-alt text-muted">A+ Resources</div>
                                        </div>
                                    </div>
                                </div>

                                <div className="floating-bubble bubble-2 shadow-lg animate-bounce-slow-delayed">
                                    <div className="d-flex align-items-center gap-2 px-3 py-2">
                                        <div className="bubble-icon bg-warning text-white rounded-circle"><i className="fa-solid fa-video small"></i></div>
                                        <div className="bubble-text text-start">
                                            <div className="fw-bold smaller-alt text-dark">150+ Lectures</div>
                                            <div className="smaller-alt text-muted">Expert Tutors</div>
                                        </div>
                                    </div>
                                </div>

                                <div className="floating-bubble bubble-3 shadow-lg animate-float-fast">
                                    <div className="d-flex align-items-center gap-2 px-3 py-2">
                                        <div className="bubble-icon bg-secondary-blue text-white rounded-circle"><i className="fa-solid fa-graduation-cap small"></i></div>
                                        <div className="bubble-text text-start">
                                            <div className="fw-bold smaller-alt text-dark">Success Rate</div>
                                            <div className="smaller-alt text-muted">98% Guaranteed</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Hero Stats Bottom Card Section */}
            <div className="container-xl stats-card-wrapper position-relative z-2">
                <div className="row justify-content-center px-3">
                    <div className="col-12 bg-white shadow-3xl rounded-4 py-4 px-2 px-md-5 animate-fade-in-up delay-3 position-relative overflow-hidden">
                        {/* Subtle background pattern */}
                        <div className="stats-bg-pattern"></div>

                        <div className="row g-4 align-items-center text-center text-md-start">
                            {[
                                { val: "Daily Live", label: "Interactive classes", icon: "video", color: "danger" },
                                { val: "10 Million +", label: "Tests, sample papers & notes", icon: "file-lines", color: "primary" },
                                { val: "24 x 7", label: "Doubt solving sessions", icon: "headset", color: "warning" },
                                { val: "100 +", label: "Offline centres", icon: "building", color: "success" }
                            ].map((stat, i) => (
                                <div key={i} className={`col-md-3 ${i < 3 ? 'border-end-dotted' : ''}`}>
                                    <div className="d-flex flex-column flex-md-row align-items-center gap-3 px-2">
                                        <div className={`p-3 bg-${stat.color}-subtle-premium rounded-circle text-${stat.color} fs-4 shadow-sm`}>
                                            <i className={`fa-solid fa-${stat.icon}`}></i>
                                        </div>
                                        <div className="stat-info">
                                            <h4 className="fw-black mb-1 fs-5 text-dark-blue">{stat.val}</h4>
                                            <p className="small text-muted mb-0 fw-medium">{stat.label}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>


        </div>
    );
}
