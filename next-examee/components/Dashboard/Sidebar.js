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
    { href: "/uploadNotes", label: "Add Notes", icon: "fa-note-sticky", color: "#04bd20" },
    { href: "/uploadPYQ", label: "Add PYQ", icon: "fa-file-invoice", color: "#f59e0b" },
    { href: "/uploadVideo", label: "Upload Video", icon: "fa-video", color: "#6366f1" },
    { href: "/uploadCourse", label: "New Course", icon: "fa-graduation-cap", color: "#0ea5e9" },
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
                <span className="ds-brand-name">Examee</span>
                <span className="ds-admin-badge">Admin</span>
            </div>

            {/* Menu */}
            <div className="ds-menu-section">
                <p className="ds-section-label">NAVIGATION</p>
                {menuItems.map((item) => (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={`ds-menu-item ${isActive(item) ? 'ds-menu-item--active' : ''}`}
                    >
                        <span className={`ds-menu-icon ${isActive(item) ? 'ds-menu-icon--active' : ''}`}>
                            <i className={`fa-solid ${item.icon}`}></i>
                        </span>
                        <span className="ds-menu-label">{item.label}</span>
                        {isActive(item) && <span className="ds-active-dot"></span>}
                    </Link>
                ))}
            </div>

            {/* Quick Upload */}
            <div className="ds-quick-section">
                <p className="ds-section-label">QUICK UPLOAD</p>
                <div className="ds-quick-grid">
                    {quickActions.map((action) => (
                        <Link key={action.href} href={action.href} className="ds-quick-btn" title={action.label}>
                            <i className={`fa-solid ${action.icon}`} style={{ color: action.color }}></i>
                            <span>{action.label}</span>
                        </Link>
                    ))}
                </div>
            </div>

            {/* Profile Footer */}
            <div className="ds-profile-footer">
                <img
                    src="/assets/img/Avtar.jpg"
                    alt="Profile"
                    className="ds-avatar"
                    onError={(e) => { e.target.src = "https://ui-avatars.com/api/?name=Admin&background=04bd20&color=fff"; }}
                />
                <div className="ds-profile-info">
                    <p className="ds-profile-name">Administrator</p>
                    <p className="ds-profile-role">admin@examee.com</p>
                </div>
                <button className="ds-logout-btn" onClick={handleLogout} title="Sign Out">
                    <i className="fa-solid fa-right-from-bracket"></i>
                </button>
            </div>

            <style jsx>{`
                .ds-sidebar {
                    width: 100%;
                    height: 100vh;
                    background: linear-gradient(180deg, #0a1628 0%, #0d1f0e 100%);
                    display: flex;
                    flex-direction: column;
                    overflow: hidden;
                    position: sticky;
                    top: 0;
                }

                /* Brand */
                .ds-brand {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    padding: 22px 20px 18px;
                    border-bottom: 1px solid rgba(255,255,255,0.07);
                }
                .ds-brand-icon {
                    width: 34px; height: 34px;
                    background: linear-gradient(135deg,#04bd20,#06d6a0);
                    border-radius: 10px;
                    display: flex; align-items: center; justify-content: center;
                    color: white; font-size: 0.9rem;
                }
                .ds-brand-name { color: white; font-weight: 800; font-size: 1.1rem; letter-spacing: -0.02em; flex: 1; }
                .ds-admin-badge {
                    font-size: 0.6rem; font-weight: 700; letter-spacing: 0.08em;
                    color: #04bd20; background: rgba(4,189,32,0.12);
                    border: 1px solid rgba(4,189,32,0.25);
                    border-radius: 50px; padding: 2px 8px;
                }

                /* Section label */
                .ds-section-label {
                    font-size: 0.6rem; font-weight: 700; letter-spacing: 0.1em;
                    color: rgba(255,255,255,0.25);
                    margin: 0 0 8px;
                    padding: 0 16px;
                }

                /* Menu section */
                .ds-menu-section {
                    flex: 1;
                    overflow-y: auto;
                    padding: 18px 10px 12px;
                    scrollbar-width: none;
                }
                .ds-menu-section::-webkit-scrollbar { display: none; }

                .ds-menu-item {
                    display: flex;
                    align-items: center;
                    gap: 11px;
                    padding: 10px 12px;
                    border-radius: 10px;
                    margin-bottom: 2px;
                    text-decoration: none;
                    color: rgba(255,255,255,0.5);
                    font-size: 0.87rem;
                    font-weight: 500;
                    transition: all 0.18s;
                    position: relative;
                }
                .ds-menu-item:hover { background: rgba(255,255,255,0.06); color: rgba(255,255,255,0.85); }
                .ds-menu-item--active {
                    background: rgba(4,189,32,0.12);
                    color: #4dfa6a;
                    font-weight: 600;
                }
                .ds-menu-icon {
                    width: 30px; height: 30px;
                    border-radius: 8px;
                    display: flex; align-items: center; justify-content: center;
                    font-size: 0.8rem;
                    background: rgba(255,255,255,0.05);
                    color: rgba(255,255,255,0.45);
                    flex-shrink: 0;
                    transition: all 0.18s;
                }
                .ds-menu-icon--active { background: rgba(4,189,32,0.2); color: #04bd20; }
                .ds-menu-item:hover .ds-menu-icon { background: rgba(255,255,255,0.1); color: rgba(255,255,255,0.8); }
                .ds-menu-label { flex: 1; }
                .ds-active-dot {
                    width: 6px; height: 6px; border-radius: 50%;
                    background: #04bd20;
                    box-shadow: 0 0 6px rgba(4,189,32,0.7);
                    flex-shrink: 0;
                }

                /* Quick upload */
                .ds-quick-section { padding: 12px 10px; border-top: 1px solid rgba(255,255,255,0.07); }
                .ds-quick-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 6px; }
                .ds-quick-btn {
                    display: flex; flex-direction: column; align-items: center; gap: 4px;
                    padding: 10px 8px;
                    background: rgba(255,255,255,0.04);
                    border: 1px solid rgba(255,255,255,0.07);
                    border-radius: 10px;
                    text-decoration: none;
                    font-size: 0.67rem;
                    color: rgba(255,255,255,0.45);
                    transition: all 0.18s;
                    text-align: center;
                }
                .ds-quick-btn:hover { background: rgba(255,255,255,0.09); color: rgba(255,255,255,0.8); transform: translateY(-1px); }
                .ds-quick-btn i { font-size: 1rem; }

                /* Profile Footer */
                .ds-profile-footer {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    padding: 14px 14px;
                    border-top: 1px solid rgba(255,255,255,0.08);
                    background: rgba(255,255,255,0.03);
                }
                .ds-avatar {
                    width: 36px; height: 36px;
                    border-radius: 50%;
                    border: 2px solid rgba(4,189,32,0.4);
                    object-fit: cover;
                    flex-shrink: 0;
                }
                .ds-profile-info { flex: 1; overflow: hidden; }
                .ds-profile-name { font-size: 0.8rem; font-weight: 700; color: rgba(255,255,255,0.9); margin: 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
                .ds-profile-role { font-size: 0.68rem; color: rgba(255,255,255,0.4); margin: 1px 0 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
                .ds-logout-btn {
                    width: 30px; height: 30px;
                    background: rgba(220,53,69,0.1);
                    border: 1px solid rgba(220,53,69,0.2);
                    border-radius: 8px;
                    display: flex; align-items: center; justify-content: center;
                    color: #f87171;
                    font-size: 0.75rem;
                    cursor: pointer;
                    transition: all 0.18s;
                    flex-shrink: 0;
                }
                .ds-logout-btn:hover { background: rgba(220,53,69,0.2); color: #ef4444; }
            `}</style>
        </nav>
    );
};

export default Sidebar;
