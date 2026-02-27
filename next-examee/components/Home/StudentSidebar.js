"use client";
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const StudentSidebar = ({ userData, handleLogout, isSpecialUser, userProfile }) => {
    const pathname = usePathname();

    const sidebarMenu = [
        {
            section: "LEARN Today",
            items: [
                { label: "Notes", icon: "fa-file-lines", href: "/notes" },
                { label: "PYQ", icon: "fa-circle-question", href: "/Q-paper" },
                { label: "Video", icon: "fa-circle-play", href: "/video" },
            ]
        },
        {
            section: "STUDY PACKS",
            items: [
                { label: "Course", icon: "fa-layer-group", href: "/cource" },
                { label: "Mock Test", icon: "fa-vial", href: "/mock-test" },
            ]
        },
        {
            section: "EXPLORE EXAMEE",
            items: [
                { label: "Examee Books", icon: "fa-book", href: "/books" },
                { label: "Call Book", icon: "fa-headset", href: "/call-book" },
            ]
        },
        {
            section: "ACCOUNT",
            items: [
                { label: "My Profile", icon: "fa-circle-user", href: "/profile" },
                { label: "My Library", icon: "fa-book-open", href: "/myLearning" },
                { label: "Logout", icon: "fa-arrow-right-from-bracket", href: "#", onClick: true },
            ]
        }
    ];

    const isActive = (href) => {
        if (href === '/') return pathname === '/';
        return pathname.startsWith(href);
    };

    return (
        <aside className="li-sidebar shadow-sm">
            {/* Mobile Only Header with Icons */}
            <div className="d-lg-none px-3 py-4 border-bottom mb-3" style={{ background: '#f8fafc' }}>
                <div className="d-flex align-items-center justify-content-between mb-3">
                    <div className="d-flex align-items-center gap-3">
                        <img
                            src={userProfile}
                            alt="Profile"
                            className="rounded-circle border"
                            style={{ width: '45px', height: '45px', objectFit: 'cover' }}
                            onError={(e) => { e.target.src = "https://ui-avatars.com/api/?name=" + (userData?.FirstName || 'User') + "&background=04bd20&color=fff"; }}
                        />
                        <div>
                            <p className="fw-bold mb-0" style={{ fontSize: '0.9rem' }}>{userData?.FirstName || 'Student'}</p>
                            <span className="text-success fw-bold" style={{ fontSize: '0.7rem' }}>PRO STATUS</span>
                        </div>
                    </div>

                </div>
            </div>

            <div className="px-4 mb-5 pt-3 d-none d-lg-block">
                <Link href="/" className="text-decoration-none d-flex align-items-center gap-2">
                    <img src="/assets/img/brandlog.png" alt="Examee" style={{ height: "32px", width: "auto" }} />
                </Link>
            </div>

            {sidebarMenu.map((sec, idx) => (
                <div key={idx} className="li-nav-section">
                    <p className="li-section-label">{sec.section}</p>
                    {sec.items.map((item, i) => (
                        item.onClick ? (
                            <button
                                key={i}
                                onClick={handleLogout}
                                className="li-menu-item w-100 border-0 bg-transparent text-start text-decoration-none d-flex align-items-center text-danger"
                            >
                                <span className="li-menu-icon" style={{ width: '24px', textAlign: 'center' }}><i className={`fa-solid ${item.icon}`}></i></span>
                                <span className="ms-3">{item.label}</span>
                            </button>
                        ) : (
                            <Link
                                key={i}
                                href={item.href}
                                className={`li-menu-item w-100 border-0 bg-transparent text-start text-decoration-none d-flex align-items-center ${isActive(item.href) ? 'li-menu-item--active' : ''}`}
                            >
                                <span className="li-menu-icon" style={{ width: '24px', textAlign: 'center' }}><i className={`fa-solid ${item.icon}`}></i></span>
                                <span className="ms-3">{item.label}</span>
                                {item.badge && <span className="li-badge-new ms-auto">{item.badge}</span>}
                            </Link>
                        )
                    ))}
                </div>
            ))}


            {/* Sidebar Support Card */}
            <div className="mx-3 mt-4 p-3 rounded-4 bg-light border opacity-75 d-none d-xl-block mt-auto mb-4">
                <p className="fw-bold small mb-1">Need help?</p>
                <p className="smaller text-muted mb-2">Get 24/7 priority support from Examee Team.</p>
                <button className="btn btn-dark w-100 rounded-pill btn-sm py-1 fw-bold smaller">Get Support</button>
            </div>
        </aside>
    );
};

export default StudentSidebar;
