"use client";
import React, { useState, useEffect } from 'react';
import Footer from '../../components/Footer';
import { postData } from "../../services/HttpService"
import * as GlobalUrls from "../../utils/GlobalURL"
import { toast } from "react-toastify";
import GlobalLoader from '../../components/GlobalLoader';

export default function ContactPage() {
    const [isVisible, setIsVisible] = useState(false);
    const [formData, setFormData] = useState({ name: "", email: "", subject: "", body: "" });
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        setIsVisible(true);
    }, []);

    const handleOnChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleOnSubmit = async (e) => {
        e.preventDefault();
        const { email, name, subject, body } = formData;
        if (!email || !name || !subject || !body) {
            toast.warning("Please fill in all fields!", { position: "top-right" });
            return;
        }
        setSubmitting(true);
        try {
            const json = await postData(`${GlobalUrls.SUPPORTUSER_URL}`, formData);
            if (json?.success) {
                setFormData({ name: "", email: "", subject: "", body: "" });
                toast.success("Message sent successfully!", { position: "top-right" });
            } else {
                toast.error(json?.message || "Something went wrong!", { position: "top-right" });
            }
        } catch (error) {
            toast.error("Something went wrong!", { position: "top-right" });
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <main className="min-vh-100 bg-white position-relative overflow-hidden">
            <GlobalLoader />

            {/* Subtle Professional Background */}
            <div className="position-absolute top-0 start-0 w-100 h-100 opacity-5 pointer-events-none">
                <div className="position-absolute top-0 start-0 w-50 h-50 rounded-circle bg-success blur-2xl translate-middle"></div>
            </div>

            {/* Breadcrumb Header */}
            <div className="border-bottom py-3 position-sticky top-0 z-index-0 bg-white bg-opacity-75 backdrop-blur">
                <div className="container px-4">
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb mb-0 small fw-medium">
                            <li className="breadcrumb-item"><a href="/" className="text-decoration-none text-secondary hover-green transition-all">Home</a></li>
                            <li className="breadcrumb-item active text-primary-green">Contact Support</li>
                        </ol>
                    </nav>
                </div>
            </div>

            <div className="container py-5 px-4 position-relative">
                {/* Section Header */}
                <div className={`text-center mb-5 transition-reveal ${isVisible ? 'reveal-visible' : 'reveal-hidden'}`}>
                    <span className="badge bg-success-subtle text-success fw-semibold rounded-pill px-3 py-2 mb-3 border border-success-subtle">
                        Contact Us
                    </span>
                    <h1 className="h1-large fw-bold text-dark-blue mb-3">Get in <span className="text-primary-green">Touch</span></h1>
                    <p className="text-muted mx-auto fs-5 mb-0" style={{ maxWidth: '600px' }}>
                        We're here to help you with any questions about our resources or platform.
                    </p>
                </div>

                <div className="row g-5 justify-content-center mt-2">
                    {/* Contact Info */}
                    <div className={`col-lg-4 transition-reveal ${isVisible ? 'reveal-visible' : 'reveal-hidden'}`} style={{ transitionDelay: '0.1s' }}>
                        <div className="d-flex flex-column gap-3">
                            {[
                                { icon: 'fa-phone', color: '#16a34a', bg: '#f0fdf4', title: 'Support Line', val: '+91 9769 XXX XXX' },
                                { icon: 'fa-envelope', color: '#2563eb', bg: '#f0f9ff', title: 'Email Address', val: 'support@examee.com' },
                                { icon: 'fa-location-dot', color: '#d97706', bg: '#fffbeb', title: 'Location', val: 'Mumbai, India' }
                            ].map((item, idx) => (
                                <div key={idx} className="p-4 rounded-4 border border-light-subtle background-light hover-border-green transition-all shadow-sm">
                                    <div className="d-flex align-items-center gap-3">
                                        <div className="rounded-3 d-flex align-items-center justify-content-center flex-shrink-0"
                                            style={{ width: '48px', height: '48px', background: item.bg, color: item.color }}>
                                            <i className={`fa-solid ${item.icon} fs-5`}></i>
                                        </div>
                                        <div>
                                            <p className="text-muted smaller fw-bold text-uppercase mb-1" style={{ letterSpacing: '0.05em' }}>{item.title}</p>
                                            <p className="fw-semibold text-dark-blue mb-0">{item.val}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}

                            {/* Simple Social Connect */}
                            <div className="p-4 rounded-4 border border-light-subtle shadow-sm">
                                <p className="text-muted smaller fw-bold text-uppercase mb-3" style={{ letterSpacing: '0.05em' }}>Follow Us</p>
                                <div className="d-flex gap-2">
                                    {[
                                        { icon: 'fa-instagram', color: '#e1306c' },
                                        { icon: 'fa-linkedin-in', color: '#0077b5' },
                                        { icon: 'fa-youtube', color: '#ff0000' }
                                    ].map((s, i) => (
                                        <a key={i} href="#" className="social-link-prof" style={{ '--hover-color': s.color }}>
                                            <i className={`fa-brands ${s.icon}`}></i>
                                        </a>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className={`col-lg-7 transition-reveal ${isVisible ? 'reveal-visible' : 'reveal-hidden'}`} style={{ transitionDelay: '0.2s' }}>
                        <div className="p-4 p-md-5 rounded-5 border border-light-subtle shadow-sm bg-white">
                            <h4 className="fw-bold text-dark-blue mb-4">Send us a Message</h4>

                            <form onSubmit={handleOnSubmit}>
                                <div className="row g-4">
                                    <div className="col-md-6">
                                        <div className="form-group">
                                            <label className="small fw-semibold text-muted mb-2 ms-1">Full Name</label>
                                            <input type="text" name="name" value={formData.name} onChange={handleOnChange}
                                                className="form-control-prof" placeholder="Your name" />
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="form-group">
                                            <label className="small fw-semibold text-muted mb-2 ms-1">Email Address</label>
                                            <input type="email" name="email" value={formData.email} onChange={handleOnChange}
                                                className="form-control-prof" placeholder="Email@example.com" />
                                        </div>
                                    </div>
                                    <div className="col-12">
                                        <div className="form-group">
                                            <label className="small fw-semibold text-muted mb-2 ms-1">Subject</label>
                                            <input type="text" name="subject" value={formData.subject} onChange={handleOnChange}
                                                className="form-control-prof" placeholder="How can we help?" />
                                        </div>
                                    </div>
                                    <div className="col-12">
                                        <div className="form-group">
                                            <label className="small fw-semibold text-muted mb-2 ms-1">Message</label>
                                            <textarea name="body" value={formData.body} onChange={handleOnChange}
                                                rows="5" className="form-control-prof" placeholder="Describe your query..."></textarea>
                                        </div>
                                    </div>
                                    <div className="col-12 mt-4 pt-2">
                                        <button type="submit" className="btn btn-primary-premium w-100 py-3 rounded-pill fw-bold shadow-sm" disabled={submitting}>
                                            {submitting
                                                ? <><span className="spinner-border spinner-border-sm me-2"></span>Sending...</>
                                                : <><i className="fa-solid fa-paper-plane me-2"></i>Send Message</>}
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />

            <style jsx>{`
                .text-dark-blue { color: #0f172a !important; }
                .text-primary-green { color: #16a34a !important; }
                .h1-large { font-size: 3rem; letter-spacing: -0.02em; }
                .backdrop-blur { backdrop-filter: blur(8px); }
                .blur-2xl { filter: blur(48px); }
                
                .hover-border-green:hover { border-color: #16a34a !important; transform: translateY(-3px); }
                .background-light { background: #f8fafc; }

                .social-link-prof {
                    width: 40px; height: 40px; 
                    border-radius: 10px;
                    display: flex; align-items: center; justify-content: center;
                    background: #f1f5f9; color: #64748b;
                    text-decoration: none; transition: all 0.2s ease;
                }
                .social-link-prof:hover {
                    background: #fff; color: var(--hover-color);
                    box-shadow: 0 4px 12px rgba(0,0,0,0.05);
                }

                .form-control-prof {
                    width: 100%; padding: 12px 18px;
                    border: 1px solid #e2e8f0; border-radius: 12px;
                    background: #fcfcfc; color: #1e293b;
                    transition: all 0.2s ease; font-size: 0.95rem;
                }
                .form-control-prof:focus {
                    outline: none; border-color: #16a34a;
                    background: #white; box-shadow: 0 0 0 4px rgba(22, 163, 74, 0.05);
                }
                
                .transition-reveal { transition: all 0.6s ease-out; }
                .reveal-hidden { opacity: 0; transform: translateY(20px); }
                .reveal-visible { opacity: 1; transform: translateY(0); }
                .smaller { font-size: 0.75rem; }
            `}</style>
        </main>
    );
}
