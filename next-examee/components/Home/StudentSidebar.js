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
                { label: "Logout", icon: "fa-arrow-right-from-bracket", onClick: true, danger: true },
            ]
        }
    ];

    const isActive = (href) => {
        if (!href) return false;
        if (href === '/') return pathname === '/';
        return pathname.startsWith(href);
    };

    return (
        <aside className="li-sidebar">
            {/* Logo Area */}
            <div className="px-5 pt-3 pb-4 d-none d-lg-block text-center shadow-sm">
                <Link href="/" className="text-decoration-none">
                    <img src="/assets/img/brandlog.png" alt="Examee" style={{ height: "32px", width: "auto" }} />
                </Link>
            </div>

            {/* Mobile Only Header */}
            <div className="d-lg-none px-4 py-3 mb-4" style={{ background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)', borderBottom: '1px solid #e2e8f0' }}>
                <div className="d-flex align-items-center gap-3">
                    <img
                        src={userProfile}
                        alt="Profile"
                        className="li-user-avatar"
                        onError={(e) => { e.target.src = "https://ui-avatars.com/api/?name=" + (userData?.FirstName || 'User') + "&background=04bd20&color=fff"; }}
                    />
                    <div>
                        <p className="fw-bold mb-0 text-dark" style={{ fontSize: '1.05rem' }}>{userData?.FirstName || 'Student'}</p>
                        <span className="badge bg-success-subtle text-success border border-success-subtle smaller fw-bold px-2 py-1">PRO STUDENT</span>
                    </div>
                </div>
            </div>

            <div className="flex-grow-1 py-4 overflow-auto custom-scrollbar">
                {sidebarMenu.map((sec, idx) => (
                    <div key={idx} className="li-nav-section">
                        <p className="li-section-label">{sec.section}</p>
                        {sec.items.map((item, i) => (
                            item.onClick ? (
                                <button
                                    key={i}
                                    onClick={handleLogout}
                                    className={`li-menu-item w-100 border-0 bg-transparent ${item.danger ? 'text-danger' : 'text-secondary'}`}
                                >
                                    <span className="li-menu-icon"><i className={`fa-solid ${item.icon}`}></i></span>
                                    <span className="ms-3">{item.label}</span>
                                </button>
                            ) : (
                                <Link
                                    key={i}
                                    href={item.href}
                                    className={`li-menu-item ${isActive(item.href) ? 'li-menu-item--active' : ''}`}
                                >
                                    <span className="li-menu-icon"><i className={`fa-solid ${item.icon}`}></i></span>
                                    <span className="ms-3">{item.label}</span>
                                </Link>
                            )
                        ))}
                    </div>
                ))}
            </div>

            {/* Sidebar Support Card (Premium V2) */}
            <div className="mt-auto px-1">
                <div className="li-support-card m-2 shadow-lg" style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', color: '#fff', borderRadius: '16px', padding: '16px' }}>
                    <p className="fw-bold mb-1" style={{ fontSize: '0.85rem', color: '#fff' }}>Need Help?</p>
                    <p className="mb-2" style={{ fontSize: '0.72rem', opacity: '0.8', color: '#fff', lineHeight: '1.3' }}>Get 24/7 priority support from our exam experts.</p>
                    <button
                        className="btn btn-success btn-sm w-100 rounded-pill fw-bold border-0 py-1"
                        style={{ background: '#04bd20', fontSize: '0.78rem', boxShadow: '0 4px 12px rgba(4, 189, 32, 0.3)' }}
                    >
                        Chat with Us
                    </button>
                </div>
            </div>
        </aside>
    );
};

export default StudentSidebar;
