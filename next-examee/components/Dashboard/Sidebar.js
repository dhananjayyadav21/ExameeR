"use client";
import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const menuItems = [
    { href: "/dashboard", label: "Overview", icon: "fa-house", exact: true },
    { href: "/dashboard/notes", label: "Notes", icon: "fa-file-lines" },
    { href: "/dashboard/pyq", label: "PYQs", icon: "fa-circle-question" },
    { href: "/dashboard/videos", label: "Videos", icon: "fa-circle-play" },
    { href: "/dashboard/courses", label: "Courses", icon: "fa-book-open" },
    { href: "/dashboard/students", label: "Students", icon: "fa-user-graduate" },
    { href: "/dashboard/analytics", label: "Analytics", icon: "fa-chart-line" },
    { href: "/dashboard/settings", label: "Settings", icon: "fa-gear" },
];

const quickActions = [
    { href: "/uploadNotes", label: "Notes", icon: "fa-note-sticky", color: "#04bd20" },
    { href: "/uploadPYQ", label: "PYQ", icon: "fa-file-invoice", color: "#f59e0b" },
    { href: "/uploadVideo", label: "Video", icon: "fa-video", color: "#8b5cf6" },
    { href: "/uploadCourse", label: "Course", icon: "fa-graduation-cap", color: "#0ea5e9" },
];

const Sidebar = () => {
    const pathname = usePathname();
    const router = useRouter();

    const isActive = (item) => {
        if (item.exact) return pathname === item.href;
        return pathname.startsWith(item.href);
    };

    const handleLogout = () => {
        localStorage.clear();
        router.push("/auth");
    };

    return (
        <nav className="ds-sidebar">

            {/* Brand */}
            <div className="ds-brand">
                <div className="ds-brand-icon">
                    <i className="fa-solid fa-graduation-cap"></i>
                </div>
                <div className="ds-brand-text">
                    <span className="ds-brand-name">Examee</span>
                    <span className="ds-admin-badge">Admin Panel</span>
                </div>
            </div>

            {/* Navigation */}
            <div className="ds-menu-section">
                <p className="ds-section-label">NAVIGATION</p>
                <ul className="ds-menu-list">
                    {menuItems.map((item) => {
                        const active = isActive(item);
                        return (
                            <li key={item.href} className="ds-menu-li">
                                <Link
                                    href={item.href}
                                    className={`ds-menu-item ${active ? 'ds-menu-item--active' : ''}`}
                                >
                                    {/* Active left-line indicator */}
                                    <span className="ds-item-line"></span>

                                    <span className={`ds-menu-icon ${active ? 'ds-menu-icon--active' : ''}`}>
                                        <i className={`fa-solid ${item.icon}`}></i>
                                    </span>
                                    <span className="ds-menu-label">{item.label}</span>

                                    {active && (
                                        <span className="ds-active-chip">
                                            <i className="fa-solid fa-circle" style={{ fontSize: '5px' }}></i>
                                        </span>
                                    )}
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </div>

            {/* Quick Upload */}
            <div className="ds-quick-section">
                <p className="ds-section-label">QUICK UPLOAD</p>
                <div className="ds-quick-grid">
                    {quickActions.map((action) => (
                        <Link key={action.href} href={action.href} className="ds-quick-btn" title={action.label}>
                            <span className="ds-quick-icon" style={{ background: `${action.color}1a`, color: action.color }}>
                                <i className={`fa-solid ${action.icon}`}></i>
                            </span>
                            <span className="ds-quick-label">{action.label}</span>
                        </Link>
                    ))}
                </div>
            </div>

            {/* Profile Footer */}
            <div className="ds-profile-footer">
                <div className="ds-avatar-wrap">
                    <img
                        src="/assets/img/Avtar.jpg"
                        alt="Profile"
                        className="ds-avatar"
                        onError={(e) => { e.target.src = "https://ui-avatars.com/api/?name=Admin&background=04bd20&color=fff"; }}
                    />
                    <span className="ds-online-dot"></span>
                </div>
                <div className="ds-profile-info">
                    <p className="ds-profile-name">Administrator</p>
                    <p className="ds-profile-role">admin@examee.com</p>
                </div>
                <button className="ds-logout-btn" onClick={handleLogout} title="Sign Out">
                    <i className="fa-solid fa-right-from-bracket"></i>
                </button>
            </div>

            <style jsx>{`
                /* ─── Sidebar shell ─────────────────────────────── */
                .ds-sidebar {
                    width: 100%;
                    height: 100vh;
                    background: linear-gradient(180deg, #0a1628 0%, #0c1a10 100%);
                    display: flex;
                    flex-direction: column;
                    overflow: hidden;
                    position: sticky;
                    top: 0;
                    border-right: 1px solid rgba(255,255,255,0.05);
                }

                /* ─── Brand ─────────────────────────────────────── */
                .ds-brand {
                    display: flex;
                    align-items: center;
                    gap: 11px;
                    padding: 20px 18px 16px;
                    border-bottom: 1px solid rgba(255,255,255,0.06);
                    flex-shrink: 0;
                }
                .ds-brand-icon {
                    width: 36px; height: 36px;
                    background: linear-gradient(135deg,#04bd20,#06d6a0);
                    border-radius: 10px;
                    display: flex; align-items: center; justify-content: center;
                    color: white; font-size: 0.95rem;
                    flex-shrink: 0;
                    box-shadow: 0 4px 12px rgba(4,189,32,0.35);
                }
                .ds-brand-text { display: flex; flex-direction: column; }
                .ds-brand-name {
                    color: white; font-weight: 800; font-size: 1.05rem;
                    letter-spacing: -0.02em; line-height: 1.1;
                }
                .ds-admin-badge {
                    font-size: 0.58rem; font-weight: 700; letter-spacing: 0.07em;
                    color: #04bd20; margin-top: 1px;
                }

                /* ─── Section label ──────────────────────────────── */
                .ds-section-label {
                    font-size: 0.58rem; font-weight: 800; letter-spacing: 0.12em;
                    color: rgba(255,255,255,0.2);
                    margin: 0 0 7px;
                    padding: 0 18px;
                }

                /* ─── Menu ───────────────────────────────────────── */
                .ds-menu-section {
                    flex: 1;
                    overflow-y: auto;
                    padding: 18px 10px 10px;
                    scrollbar-width: none;
                }
                .ds-menu-section::-webkit-scrollbar { display: none; }
                .ds-menu-list { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 1px; }
                .ds-menu-li { position: relative; }

                /* The left slim accent line */
                .ds-item-line {
                    position: absolute;
                    left: 0; top: 50%; transform: translateY(-50%);
                    width: 3px; height: 0;
                    background: #04bd20;
                    border-radius: 0 3px 3px 0;
                    transition: height 0.22s ease;
                }
                .ds-menu-item--active .ds-item-line { height: 60%; }

                .ds-menu-item {
                    display: flex;
                    align-items: center;
                    gap: 11px;
                    padding: 9px 14px 9px 16px;
                    border-radius: 10px;
                    text-decoration: none;
                    color: rgba(255,255,255,0.45);
                    font-size: 0.85rem;
                    font-weight: 500;
                    transition: all 0.16s;
                    position: relative;
                    overflow: hidden;
                }
                .ds-menu-item:hover {
                    background: rgba(255,255,255,0.055);
                    color: rgba(255,255,255,0.85);
                }
                .ds-menu-item--active {
                    background: rgba(4,189,32,0.1);
                    color: #5dfc78;
                    font-weight: 650;
                }

                .ds-menu-icon {
                    width: 30px; height: 30px;
                    border-radius: 8px;
                    display: flex; align-items: center; justify-content: center;
                    font-size: 0.78rem;
                    background: rgba(255,255,255,0.045);
                    color: rgba(255,255,255,0.4);
                    flex-shrink: 0;
                    transition: all 0.16s;
                }
                .ds-menu-icon--active {
                    background: rgba(4,189,32,0.18);
                    color: #04bd20;
                    box-shadow: 0 0 10px rgba(4,189,32,0.25);
                }
                .ds-menu-item:hover .ds-menu-icon {
                    background: rgba(255,255,255,0.09);
                    color: rgba(255,255,255,0.8);
                }
                .ds-menu-label { flex: 1; }

                .ds-active-chip {
                    display: flex; align-items: center; justify-content: center;
                    color: #04bd20;
                    animation: pulse-dot 2s ease-in-out infinite;
                }
                @keyframes pulse-dot {
                    0%,100% { opacity: 1; }
                    50% { opacity: 0.4; }
                }

                /* ─── Quick Upload ───────────────────────────────── */
                .ds-quick-section {
                    padding: 12px 10px 14px;
                    border-top: 1px solid rgba(255,255,255,0.06);
                    flex-shrink: 0;
                }
                .ds-quick-grid {
                    display: grid; grid-template-columns: 1fr 1fr;
                    gap: 6px;
                }
                .ds-quick-btn {
                    display: flex; flex-direction: column; align-items: center; gap: 5px;
                    padding: 10px 6px;
                    background: rgba(255,255,255,0.035);
                    border: 1px solid rgba(255,255,255,0.06);
                    border-radius: 10px;
                    text-decoration: none;
                    font-size: 0.65rem;
                    font-weight: 600;
                    color: rgba(255,255,255,0.4);
                    transition: all 0.18s;
                    text-align: center;
                }
                .ds-quick-btn:hover {
                    background: rgba(255,255,255,0.08);
                    color: rgba(255,255,255,0.85);
                    transform: translateY(-1px);
                    border-color: rgba(255,255,255,0.12);
                }
                .ds-quick-icon {
                    width: 28px; height: 28px;
                    border-radius: 8px;
                    display: flex; align-items: center; justify-content: center;
                    font-size: 0.85rem;
                    transition: all 0.18s;
                }
                .ds-quick-btn:hover .ds-quick-icon { transform: scale(1.1); }
                .ds-quick-label { letter-spacing: 0.02em; }

                /* ─── Profile Footer ─────────────────────────────── */
                .ds-profile-footer {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    padding: 12px 14px;
                    border-top: 1px solid rgba(255,255,255,0.07);
                    background: rgba(0,0,0,0.15);
                    flex-shrink: 0;
                }
                .ds-avatar-wrap { position: relative; flex-shrink: 0; }
                .ds-avatar {
                    width: 36px; height: 36px;
                    border-radius: 50%;
                    border: 2px solid rgba(4,189,32,0.45);
                    object-fit: cover;
                    display: block;
                }
                .ds-online-dot {
                    position: absolute;
                    bottom: 0; right: 0;
                    width: 9px; height: 9px;
                    background: #04bd20;
                    border: 2px solid #0a1628;
                    border-radius: 50%;
                    box-shadow: 0 0 6px rgba(4,189,32,0.6);
                }
                .ds-profile-info { flex: 1; overflow: hidden; }
                .ds-profile-name {
                    font-size: 0.8rem; font-weight: 700;
                    color: rgba(255,255,255,0.9);
                    margin: 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
                }
                .ds-profile-role {
                    font-size: 0.66rem; color: rgba(255,255,255,0.35);
                    margin: 1px 0 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
                }
                .ds-logout-btn {
                    width: 30px; height: 30px;
                    background: rgba(239,68,68,0.08);
                    border: 1px solid rgba(239,68,68,0.18);
                    border-radius: 8px;
                    display: flex; align-items: center; justify-content: center;
                    color: #f87171;
                    font-size: 0.75rem;
                    cursor: pointer;
                    transition: all 0.18s;
                    flex-shrink: 0;
                }
                .ds-logout-btn:hover {
                    background: rgba(239,68,68,0.18);
                    color: #ef4444;
                    transform: scale(1.05);
                }
            `}</style>
        </nav>
    );
};

export default Sidebar;
