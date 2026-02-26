"use client";
import React, { useState, useEffect } from 'react';
import Footer from '../../components/Footer';
import { postData } from "../../services/HttpService"
import * as GlobalUrls from "../../utils/GlobalURL"
import { toast } from "react-toastify";

export default function ContactPage({ setProgress = () => { } }) {
    useEffect(() => { setProgress(0); setProgress(100); }, []);

    const [formData, setFormData] = useState({ name: "", email: "", subject: "", body: "" });
    const [submitting, setSubmitting] = useState(false);

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
        <main className="bg-light min-vh-100">

            {/* Slim breadcrumb bar — no heavy dark banner */}
            <div className="bg-white border-bottom py-3">
                <div className="container px-4">
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb mb-0 small">
                            <li className="breadcrumb-item"><a href="/" className="text-decoration-none text-muted">Home</a></li>
                            <li className="breadcrumb-item active text-green fw-medium">Contact</li>
                        </ol>
                    </nav>
                </div>
            </div>

            <div className="container py-5 px-4">
                {/* Page Title */}
                <div className="row justify-content-center mb-5">
                    <div className="col-lg-7 text-center">
                        <span className="badge bg-green-soft text-green fw-bold rounded-pill px-3 py-2 mb-3">
                            <i className="fa-solid fa-headset me-1"></i> Support & Contact
                        </span>
                        <h1 className="display-6 fw-semibold text-dark mb-3" style={{ fontSize: '1.8rem' }}>Get In <span className="text-green">Touch</span></h1>
                        <p className="text-muted">Have a question, suggestion, or need help? We're always here. Send us a message and expect a reply within 24 hours.</p>
                    </div>
                </div>

                <div className="row g-4 justify-content-center">
                    {/* Info Column */}
                    <div className="col-lg-4">
                        {[
                            { icon: 'fa-phone', bg: '#04bd20', iconCol: '#fff', title: 'Phone', value: '+91 9769 XXX XXX', href: null },
                            { icon: 'fa-envelope', bg: '#0d6efd', iconCol: '#fff', title: 'Email', value: 'support@examee.com', href: 'mailto:youaretopperofficial+exameesupport@gmail.com' },
                            { icon: 'fa-location-dot', bg: '#f59e0b', iconCol: '#fff', title: 'Location', value: 'Mumbai, India', href: null },
                        ].map((item, idx) => (
                            <div key={idx} className="card border-0 shadow-sm rounded-4 p-4 mb-3 info-card">
                                <div className="d-flex align-items-center gap-3">
                                    <div className="rounded-3 d-flex align-items-center justify-content-center flex-shrink-0"
                                        style={{ width: '48px', height: '48px', background: item.bg }}>
                                        <i className={`fa-solid ${item.icon} text-white`}></i>
                                    </div>
                                    <div>
                                        <p className="text-muted small fw-bold text-uppercase mb-0" style={{ fontSize: '0.7rem', letterSpacing: '0.08em' }}>{item.title}</p>
                                        {item.href
                                            ? <a href={item.href} className="fw-semibold text-dark text-decoration-none" style={{ fontSize: '0.9rem' }}>{item.value}</a>
                                            : <p className="fw-semibold text-dark mb-0" style={{ fontSize: '0.9rem' }}>{item.value}</p>}
                                    </div>
                                </div>
                            </div>
                        ))}

                        {/* Social links */}
                        <div className="card border-0 shadow-sm rounded-4 p-4">
                            <p className="text-muted small fw-bold text-uppercase mb-3" style={{ fontSize: '0.7rem', letterSpacing: '0.08em' }}>Follow Us</p>
                            <div className="d-flex gap-2">
                                {[
                                    { icon: 'fa-youtube', color: '#FF0000' },
                                    { icon: 'fa-instagram', color: '#E1306C' },
                                    { icon: 'fa-linkedin', color: '#0A66C2' },
                                    { icon: 'fa-github', color: '#333' },
                                ].map((s, i) => (
                                    <a key={i} href="#" className="rounded-circle border bg-light d-flex align-items-center justify-content-center social-icon"
                                        style={{ width: '40px', height: '40px', color: s.color }}>
                                        <i className={`fa-brands ${s.icon}`}></i>
                                    </a>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Form Column */}
                    <div className="col-lg-7">
                        <div className="card border-0 shadow-sm rounded-4 p-4 p-xl-5">
                            <h5 className="fw-semibold text-dark mb-1" style={{ fontSize: '1.1rem' }}>Send a Message</h5>
                            <p className="text-muted small mb-4">Fill out the form below. We read every message.</p>
                            <form onSubmit={handleOnSubmit}>
                                <div className="row g-3">
                                    <div className="col-md-6">
                                        <label htmlFor="name" className="form-label fw-semibold small">Full Name</label>
                                        <input type="text" id="name" name="name" value={formData.name} onChange={handleOnChange}
                                            className="form-control rounded-3" placeholder="Your full name" />
                                    </div>
                                    <div className="col-md-6">
                                        <label htmlFor="email" className="form-label fw-semibold small">Email Address</label>
                                        <input type="email" id="email" name="email" value={formData.email} onChange={handleOnChange}
                                            className="form-control rounded-3" placeholder="you@example.com" />
                                    </div>
                                    <div className="col-12">
                                        <label htmlFor="subject" className="form-label fw-semibold small">Subject</label>
                                        <input type="text" id="subject" name="subject" value={formData.subject} onChange={handleOnChange}
                                            className="form-control rounded-3" placeholder="What's this about?" />
                                    </div>
                                    <div className="col-12">
                                        <label htmlFor="body" className="form-label fw-semibold small">Message</label>
                                        <textarea id="body" name="body" value={formData.body} onChange={handleOnChange}
                                            rows="5" className="form-control rounded-3" placeholder="Write your message..."></textarea>
                                    </div>
                                    <div className="col-12 mt-1">
                                        <button type="submit" className="btn btn-green fw-semibold w-100 py-3 rounded-3" style={{ fontSize: '0.92rem' }} disabled={submitting}>
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
                .text-green { color: #04bd20 !important; }
                .bg-green-soft { background: rgba(4,189,32,0.1); }
                .btn-green { background: #04bd20; color: white; border: none; transition: all 0.3s; }
                .btn-green:hover { background: #03a61c; color: white; }
                .btn-green:disabled { background: #adb5bd; }
                .info-card { transition: all 0.25s; }
                .info-card:hover { transform: translateY(-3px); box-shadow: 0 10px 20px rgba(0,0,0,0.07) !important; }
                .social-icon { transition: all 0.2s; text-decoration: none; }
                .social-icon:hover { transform: scale(1.15); background: white !important; }
            `}</style>
        </main>
    );
}
