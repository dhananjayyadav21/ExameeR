"use client";
import React, { useEffect } from 'react';
import Footer from '../../components/Footer';

export default function AboutPage({ setProgress = () => { } }) {
    useEffect(() => { setProgress(0); setProgress(100); }, []);

    const features = [
        { icon: 'fa-book-open', color: '#04bd20', bg: 'rgba(4,189,32,0.1)', title: 'Study Notes', desc: 'Expert-verified, structured notes for every subject.' },
        { icon: 'fa-video', color: '#0d6efd', bg: 'rgba(13,110,253,0.1)', title: 'Video Lectures', desc: 'Learn from experienced instructors with curated videos.' },
        { icon: 'fa-file-alt', color: '#f59e0b', bg: 'rgba(245,158,11,0.1)', title: 'Previous Papers', desc: 'Practise real exam questions from past years.' },
        { icon: 'fa-bolt', color: '#dc3545', bg: 'rgba(220,53,69,0.1)', title: 'Fast Platform', desc: 'Optimised for speed so you can focus on studying.' },
    ];

    const stats = [
        { val: '10,000+', label: 'Resources', icon: 'fa-layer-group', color: '#04bd20' },
        { val: '5,000+', label: 'Students', icon: 'fa-users', color: '#0d6efd' },
        { val: '100+', label: 'Video Hrs', icon: 'fa-circle-play', color: '#f59e0b' },
        { val: '500+', label: 'Q-Papers', icon: 'fa-file-invoice', color: '#dc3545' },
    ];

    return (
        <main className="min-vh-100 bg-light">
            {/* Slim breadcrumb */}
            <div className="bg-white border-bottom py-3">
                <div className="container px-4">
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb mb-0 small">
                            <li className="breadcrumb-item"><a href="/" className="text-decoration-none text-muted">Home</a></li>
                            <li className="breadcrumb-item active text-green fw-medium">About</li>
                        </ol>
                    </nav>
                </div>
            </div>

            {/* Hero — light, no dark banner */}
            <section className="bg-white py-5 border-bottom">
                <div className="container px-4">
                    <div className="row align-items-center g-5">
                        <div className="col-lg-6">
                            <span className="badge bg-green-soft text-green fw-bold rounded-pill px-3 py-2 mb-3 d-inline-block">
                                <i className="fa-solid fa-leaf me-1"></i> About Examee
                            </span>
                            <h1 className="display-5 fw-bold text-dark mb-4">
                                Your Smart Academic<br /><span className="text-green">Companion</span>
                            </h1>
                            <p className="text-muted lh-lg mb-4">
                                Examee brings together notes, video lectures, and previous year question papers under one roof — so students can find everything they need to ace their exams without switching between platforms.
                            </p>
                            <div className="d-flex gap-3 flex-wrap">
                                <a href="/cource" className="btn btn-green rounded-pill fw-bold px-4 py-2">
                                    Explore Courses <i className="fa-solid fa-arrow-right ms-2"></i>
                                </a>
                                <a href="/contact" className="btn btn-outline-secondary rounded-pill fw-bold px-4 py-2">
                                    Contact Us
                                </a>
                            </div>
                        </div>
                        <div className="col-lg-6 text-center">
                            <img
                                src="/assets/img/Sidebarbanner2.png"
                                alt="About Examee"
                                className="img-fluid rounded-4 shadow-sm"
                                style={{ maxHeight: '400px' }}
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats strip */}
            <section className="py-4 bg-white border-bottom">
                <div className="container px-4">
                    <div className="row g-3 text-center">
                        {stats.map((s, i) => (
                            <div key={i} className="col-6 col-md-3">
                                <div className="card border-0 rounded-4 p-3 h-100" style={{ background: s.bg ? s.bg : '#f8f9fa', border: 'none' }}>
                                    <div className="rounded-circle mx-auto mb-2 d-flex align-items-center justify-content-center"
                                        style={{ width: '48px', height: '48px', background: `${s.color}18` }}>
                                        <i className={`fa-solid ${s.icon}`} style={{ color: s.color }}></i>
                                    </div>
                                    <h4 className="fw-bold mb-0" style={{ color: s.color }}>{s.val}</h4>
                                    <p className="text-muted small mb-0">{s.label}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Mission */}
            <section className="py-5">
                <div className="container px-4">
                    <div className="row justify-content-center">
                        <div className="col-lg-8 text-center mb-5">
                            <h6 className="text-green fw-bold text-uppercase small ls-wide mb-2">Our Mission</h6>
                            <h2 className="fw-bold text-dark">Built to Make Learning <span className="text-green">Simple</span></h2>
                            <p className="text-muted mt-3">
                                We believe every student deserves access to quality resources. Examee was created to break barriers and democratise academic content.
                            </p>
                        </div>
                    </div>

                    {/* Feature cards */}
                    <div className="row g-4">
                        {features.map((f, idx) => (
                            <div key={idx} className="col-sm-6 col-lg-3">
                                <div className="card border-0 shadow-sm rounded-4 p-4 h-100 feature-card">
                                    <div className="rounded-3 mb-4 d-flex align-items-center justify-content-center"
                                        style={{ width: '52px', height: '52px', background: f.bg }}>
                                        <i className={`fa-solid ${f.icon}`} style={{ color: f.color, fontSize: '1.3rem' }}></i>
                                    </div>
                                    <h5 className="fw-bold text-dark mb-2">{f.title}</h5>
                                    <p className="text-muted small mb-0">{f.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-5 border-top bg-white">
                <div className="container px-4 text-center">
                    <h3 className="fw-bold text-dark mb-2">Trusted by <span className="text-green">thousands of students</span> across India</h3>
                    <p className="text-muted mb-4">Join Examee today — it's free to get started.</p>
                    <a href="/auth" className="btn btn-green fw-bold rounded-pill px-5 py-3 shadow-sm">
                        Join For Free <i className="fa-solid fa-arrow-right ms-2"></i>
                    </a>
                </div>
            </section>

            <style jsx>{`
                .text-green { color: #04bd20 !important; }
                .bg-green-soft { background: rgba(4,189,32,0.1); }
                .ls-wide { letter-spacing: 0.1em; }
                .btn-green { background: #04bd20; color: white; border: none; transition: all 0.3s; }
                .btn-green:hover { background: #03a61c; color: white; transform: translateY(-2px); }
                .feature-card { transition: all 0.25s ease; }
                .feature-card:hover { transform: translateY(-6px); box-shadow: 0 12px 25px rgba(0,0,0,0.08) !important; }
            `}</style>
        </main>
    );
}
