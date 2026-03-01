"use client";
import React from 'react';
import StudentLayout from '../../components/Home/StudentLayout';

export default function CallBookPage() {
    return (
        <StudentLayout title="Call Book">
            <div className="container-fluid px-0 pb-5 cb-container">
                <div className="cb-header mb-5">
                    <h1 className="cb-title mb-2">Examee Support & Mentorship</h1>
                    <p className="cb-subtitle text-muted">Book a call with top mentors, educators, and career counselors.</p>
                </div>

                <div className="row g-4">
                    {[
                        { name: "Dr. Alok Sharma", role: "Physics Mentor", rating: 4.9, sessions: "1.2k", image: "https://i.pravatar.cc/150?u=alok" },
                        { name: "Sarah Jenkins", role: "Career Counselor", rating: 4.8, sessions: "850", image: "https://i.pravatar.cc/150?u=sarah" },
                        { name: "Vivek Gupta", role: "Mathematics Expert", rating: 4.9, sessions: "2k+", image: "https://i.pravatar.cc/150?u=vivek" },
                        { name: "Ananya Iyer", role: "Biology Educator", rating: 4.7, sessions: "600", image: "https://i.pravatar.cc/150?u=ananya" }
                    ].map((mentor, i) => (
                        <div key={i} className="col-md-6 col-lg-3">
                            <div className="cb-mentor-card">
                                <div className="text-center mb-3">
                                    <img src={mentor.image} alt={mentor.name} className="cb-mentor-img shadow-sm" />
                                </div>
                                <h3 className="cb-mentor-name mb-1">{mentor.name}</h3>
                                <p className="cb-mentor-role text-muted small mb-3">{mentor.role}</p>

                                <div className="d-flex justify-content-between mb-4 px-2">
                                    <div className="text-center">
                                        <p className="mb-0 fw-bold small text-dark">{mentor.rating}</p>
                                        <p className="mb-0 smaller text-muted">Rating</p>
                                    </div>
                                    <div className="text-center">
                                        <p className="mb-0 fw-bold small text-dark">{mentor.sessions}</p>
                                        <p className="mb-0 smaller text-muted">Calls</p>
                                    </div>
                                </div>

                                <button className="cb-call-btn">
                                    <i className="fa-solid fa-phone-volume me-2"></i> Book Session
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <style jsx>{`
                .cb-container { max-width: 1400px; margin: 0 auto; }
                .cb-title { font-size: 1.8rem; font-weight: 700; color: #0f172a; letter-spacing: -0.02em; }
                .cb-subtitle { font-size: 0.88rem; font-weight: 400; }

                .cb-mentor-card {
                    background: #fff;
                    border: 1px solid #f1f5f9;
                    border-radius: 14px;
                    padding: 24px;
                    text-align: center;
                    transition: all 0.3s ease;
                    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
                }
                .cb-mentor-card:hover { transform: translateY(-4px); box-shadow: 0 12px 24px -10px rgba(0,0,0,0.1); border-color: #e2e8f0; }

                .cb-mentor-img { width: 80px; height: 80px; border-radius: 50%; object-fit: cover; border: 3px solid #fff; }
                .cb-mentor-name { font-size: 1rem; font-weight: 700; color: #0f172a; }
                
                .cb-call-btn {
                    width: 100%;
                    background: #f8fafc;
                    border: 1px solid #e2e8f0;
                    padding: 10px;
                    border-radius: 10px;
                    font-size: 0.82rem;
                    font-weight: 700;
                    color: #0f172a;
                    transition: all 0.2s;
                }
                .cb-mentor-card:hover .cb-call-btn { background: #04bd20; color: #fff; border-color: #04bd20; }
                
                .smaller { font-size: 0.65rem; }
            `}</style>
        </StudentLayout>
    );
}
