"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import * as GlobalUrls from "../../utils/GlobalURL"
import Footer from "../../components/Footer";

export default function ProfilePage({ setProgress = () => { } }) {
    const router = useRouter();
    const [user, setUser] = useState(null);

    useEffect(() => {
        setProgress(0);
        const token = typeof window !== 'undefined' && localStorage.getItem("token");
        if (token) {
            getUser(token);
        } else {
            router.push("/auth");
        }
        setProgress(100);
    }, []);

    const getUser = async (token) => {
        try {
            const response = await fetch(`${GlobalUrls.GETUSER_URL}`, {
                method: "GET",
                headers: { "Content-Type": "application/json", "AuthToken": token },
            });
            const result = await response.json();
            if (result.success) setUser(result.user);
        } catch (error) {
            console.error("getUser error:", error.message);
        }
    }

    const profileImage = typeof window !== 'undefined' && localStorage.getItem("Profile") && localStorage.getItem("Profile") !== "undefined"
        ? localStorage.getItem("Profile")
        : "/assets/img/Avtar.jpg";

    return (
        <main className="bg-light min-vh-100">
            {/* Slim top breadcrumb bar — no hero */}
            <div className="bg-white border-bottom py-3">
                <div className="container px-4">
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb small mb-0">
                            <li className="breadcrumb-item"><a href="/" className="text-decoration-none text-muted">Home</a></li>
                            <li className="breadcrumb-item active text-green fw-medium">My Profile</li>
                        </ol>
                    </nav>
                </div>
            </div>

            {!user ? (
                <div className="text-center py-5 my-5">
                    <div className="spinner-grow me-2 text-success" role="status"></div>
                    <div className="spinner-grow me-2 text-success" role="status"></div>
                    <div className="spinner-grow text-success" role="status"></div>
                    <p className="text-muted mt-4 fw-medium">Fetching your profile details...</p>
                </div>
            ) : (
                <div className="container py-5 px-4">
                    <div className="row g-4 justify-content-center">
                        {/* Profile Card */}
                        <div className="col-lg-4 col-md-5">
                            <div className="card border-0 shadow-sm rounded-4 text-center p-4 p-lg-5 h-100">
                                {/* Avatar */}
                                <div className="position-relative d-inline-block mx-auto mb-3">
                                    <img
                                        src={user?.Profile ? (user.Profile.startsWith('http') ? user.Profile : `https://lh3.googleusercontent.com/d/${user.Profile}`) : "/assets/img/Avtar.jpg"}
                                        alt="Avatar"
                                        className="rounded-circle shadow-sm"
                                        style={{ width: '110px', height: '110px', objectFit: 'cover', border: '4px solid #04bd20' }}
                                        onError={(e) => { e.target.src = "https://ui-avatars.com/api/?name=" + (user?.FirstName || 'User') + "&background=04bd20&color=fff"; }}
                                    />
                                    <span className="position-absolute bottom-0 end-0 rounded-circle d-flex align-items-center justify-content-center"
                                        style={{ width: '28px', height: '28px', background: '#04bd20', border: '2px solid #fff' }}>
                                        <i className="fa-solid fa-check text-white" style={{ fontSize: '0.65rem' }}></i>
                                    </span>
                                </div>

                                <h4 className="fw-bold text-dark mb-1">
                                    {(user?.FirstName || user?.LastName) ? `${user.FirstName} ${user.LastName}`.trim() : user?.Username}
                                </h4>
                                <p className="text-muted small mb-3">@{user?.Username} · {user?.Email}</p>

                                {user?.isVerified ? (
                                    <span className="badge rounded-pill mx-auto mb-3 px-3 py-2" style={{ background: 'rgba(4,189,32,0.12)', color: '#039419', fontSize: '0.82rem' }}>
                                        <i className="fas fa-check-circle me-1"></i> Verified Account
                                    </span>
                                ) : (
                                    <span className="badge bg-danger-subtle text-danger rounded-pill mx-auto mb-3 px-3 py-2">
                                        <i className="fas fa-times-circle me-1"></i> Not Verified
                                    </span>
                                )}

                                <hr className="my-3" />

                                <div className="text-start small">
                                    <div className="mb-3">
                                        <p className="text-muted mb-1 text-uppercase fw-bold" style={{ fontSize: '0.7rem', letterSpacing: '0.08em' }}>Role</p>
                                        <p className="fw-bold text-dark mb-0 d-flex align-items-center gap-2">
                                            <i className="fa-solid fa-user-tag text-green"></i>
                                            {user?.Role || 'Student'}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-muted mb-1 text-uppercase fw-bold" style={{ fontSize: '0.7rem', letterSpacing: '0.08em' }}>About</p>
                                        <p className="text-dark mb-0">{user?.About || 'One lesson at a time, one step closer to greatness.'}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Details Panel */}
                        <div className="col-lg-8 col-md-7">
                            <div className="card border-0 shadow-sm rounded-4 p-4 p-lg-5 mb-4">
                                <h5 className="fw-bold text-dark mb-4 d-flex align-items-center gap-2">
                                    <i className="fa-solid fa-circle-info text-green"></i> Account Information
                                </h5>
                                <div className="row g-3">
                                    {[
                                        { label: 'Full Name', value: user?.FirstName ? `${user.FirstName} ${user.LastName}` : 'Not Set', icon: 'fa-user' },
                                        { label: 'Email Address', value: user?.Email, icon: 'fa-envelope' },
                                        { label: 'Institution', value: user?.Institution || 'Not Set', icon: 'fa-building' },
                                        { label: 'Phone Number', value: user?.Phone || 'Not Set', icon: 'fa-phone' },
                                        { label: 'Location', value: user?.Location || 'Not Set', icon: 'fa-location-dot' },
                                        { label: 'Gender', value: user?.Gender || 'Not Set', icon: 'fa-venus-mars' },
                                        { label: 'Account Role', value: user?.Role || 'Student', icon: 'fa-user-shield' },
                                        { label: 'Verified Status', value: user?.isVerified ? '✓ Verified' : '✗ Not Verified', icon: 'fa-circle-check' },
                                    ].map((item, idx) => (
                                        <div key={idx} className="col-sm-6">
                                            <div className="bg-light rounded-3 p-3">
                                                <div className="d-flex align-items-center gap-2 mb-1">
                                                    <i className={`fa-solid ${item.icon} text-green`} style={{ fontSize: '0.8rem' }}></i>
                                                    <span className="text-muted fw-bold text-uppercase" style={{ fontSize: '0.68rem', letterSpacing: '0.08em' }}>{item.label}</span>
                                                </div>
                                                <p className="fw-bold text-dark mb-0">{item.value}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Quick Links */}
                            <div className="card border-0 shadow-sm rounded-4 p-4">
                                <h6 className="fw-bold text-dark mb-3 d-flex align-items-center gap-2">
                                    <i className="fa-solid fa-rocket text-green"></i> Quick Links
                                </h6>
                                <div className="row g-3">
                                    {[
                                        { href: '/myLearning', icon: 'fa-graduation-cap', label: 'My Learning', color: 'success' },
                                        { href: '/notes', icon: 'fa-file-lines', label: 'Browse Notes', color: 'primary' },
                                        { href: '/video', icon: 'fa-circle-play', label: 'Video Lectures', color: 'warning' },
                                        { href: '/cource', icon: 'fa-book', label: 'All Courses', color: 'info' },
                                    ].map((link, idx) => (
                                        <div key={idx} className="col-6 col-md-3">
                                            <a href={link.href} className="card border-0 bg-light text-decoration-none rounded-3 p-3 text-center d-block quick-link">
                                                <i className={`fa-solid ${link.icon} text-${link.color} fs-4 mb-2 d-block`}></i>
                                                <span className="small fw-medium text-dark">{link.label}</span>
                                            </a>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="text-center mt-5">
                        <img src="/assets/img/brandlog.png" alt="Examee" style={{ width: '120px', opacity: 0.5 }} />
                    </div>
                </div>
            )}

            <style jsx>{`
                .text-green { color: #04bd20 !important; }
                .quick-link { transition: all 0.2s; }
                .quick-link:hover { transform: translateY(-4px); box-shadow: 0 8px 16px rgba(0,0,0,0.08); background: white !important; }
            `}</style>
        </main>
    );
}
