"use client";
import React, { useEffect, useState } from "react";
import Sidebar from "../../components/dashboard/Sidebar";
import MobileBar from "../../components/dashboard/MobileBar";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const menuItems = [
    { href: "/dashboard", label: "Overview", icon: "fa-house" },
    { href: "/dashboard/notes", label: "Notes", icon: "fa-file-lines" },
    { href: "/dashboard/pyq", label: "PYQs", icon: "fa-circle-question" },
    { href: "/dashboard/videos", label: "Videos", icon: "fa-circle-play" },
    { href: "/dashboard/courses", label: "Courses", icon: "fa-book-open" },
    { href: "/dashboard/students", label: "Students", icon: "fa-user-graduate" },
    { href: "/dashboard/analytics", label: "Analytics", icon: "fa-chart-line" },
    { href: "/dashboard/settings", label: "Settings", icon: "fa-gear" },
];

export default function DashboardLayout({ children }) {
    const router = useRouter();
    const pathname = usePathname();
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);

    useEffect(() => {
        const userRole = typeof window !== 'undefined' && localStorage.getItem("userRole");
        const allowedRoles = ["Admin", "Instructor"];
        if (!userRole || !allowedRoles.includes(userRole)) {
            router.push("/");
        } else {
            setIsAuthorized(true);
        }
    }, []);

    if (!isAuthorized) {
        return (
            <div className="dl-loading">
                <div className="dl-spinner"></div>
                <p>Verifying access...</p>
            </div>
        );
    }

    const currentLabel = menuItems.find(m => pathname === m.href || (m.href !== '/dashboard' && pathname.startsWith(m.href)))?.label || 'Dashboard';

    return (
        <div className="dl-wrapper">
            {/* Sidebar */}
            <aside className={`dl-sidebar ${mobileOpen ? 'dl-sidebar--open' : ''}`}>
                <Sidebar />
            </aside>

            {/* Mobile overlay */}
            {mobileOpen && <div className="dl-overlay" onClick={() => setMobileOpen(false)} />}

            {/* Main Content */}
            <div className="dl-main">
                {/* Top bar */}
                <header className="dl-topbar">
                    <div className="dl-topbar-left">
                        <button className="dl-hamburger d-lg-none" onClick={() => setMobileOpen(!mobileOpen)}>
                            <i className={`fa-solid ${mobileOpen ? 'fa-xmark' : 'fa-bars'}`}></i>
                        </button>
                        <div>
                            <nav aria-label="breadcrumb">
                                <ol className="breadcrumb mb-0" style={{ fontSize: '0.75rem' }}>
                                    <li className="breadcrumb-item"><a href="/dashboard" className="text-decoration-none text-muted">Dashboard</a></li>
                                    {pathname !== '/dashboard' && <li className="breadcrumb-item active" style={{ color: '#04bd20' }}>{currentLabel}</li>}
                                </ol>
                            </nav>
                            <h1 className="dl-page-title">{currentLabel}</h1>
                        </div>
                    </div>
                    <div className="dl-topbar-right">
                        <Link href="/" className="dl-topbar-btn" title="View Site">
                            <i className="fa-solid fa-arrow-up-right-from-square"></i>
                            <span>View Site</span>
                        </Link>
                        <div className="dl-topbar-avatar">
                            <img
                                src="/assets/img/Avtar.jpg"
                                alt="Profile"
                                onError={(e) => { e.target.src = "https://ui-avatars.com/api/?name=Admin&background=04bd20&color=fff"; }}
                            />
                        </div>
                    </div>
                </header>

                {/* Page content */}
                <main className="dl-content">
                    {children}
                </main>
            </div>

            {/* Mobile bottom nav — only on small screens */}
            <div className="d-lg-none">
                <MobileBar />
            </div>

            <style jsx>{`
                .dl-loading {
                    display: flex; flex-direction: column; align-items: center; justify-content: center;
                    height: 100vh; gap: 16px; background: #0a1628;
                    color: rgba(255,255,255,0.6); font-size: 0.9rem;
                }
                .dl-spinner {
                    width: 36px; height: 36px;
                    border: 3px solid rgba(4,189,32,0.2);
                    border-top-color: #04bd20;
                    border-radius: 50%;
                    animation: spin 0.8s linear infinite;
                }
                @keyframes spin { to { transform: rotate(360deg); } }

                .dl-wrapper {
                    display: flex;
                    min-height: 100vh;
                    background: #f1f5f9;
                }

                /* Sidebar */
                .dl-sidebar {
                    width: 230px;
                    flex-shrink: 0;
                    display: none;
                }
                @media (min-width: 992px) {
                    .dl-sidebar { display: block; }
                }
                @media (max-width: 991px) {
                    .dl-sidebar {
                        position: fixed;
                        top: 0; left: -230px;
                        height: 100vh;
                        z-index: 1050;
                        transition: left 0.28s ease;
                    }
                    .dl-sidebar--open { left: 0; }
                }
                .dl-overlay {
                    position: fixed; inset: 0; z-index: 1040;
                    background: rgba(0,0,0,0.5); backdrop-filter: blur(2px);
                }

                /* Main */
                .dl-main { flex: 1; display: flex; flex-direction: column; min-width: 0; }

                /* Topbar */
                .dl-topbar {
                    display: flex; align-items: center; justify-content: space-between;
                    padding: 0 24px;
                    height: 60px;
                    background: white;
                    border-bottom: 1px solid #e2e8f0;
                    position: sticky; top: 0; z-index: 100;
                    gap: 16px;
                }
                .dl-topbar-left { display: flex; align-items: center; gap: 14px; }
                .dl-page-title { font-size: 1rem; font-weight: 700; color: #0f172a; margin: 0; letter-spacing: -0.01em; }
                .dl-hamburger {
                    background: none; border: 1.5px solid #e2e8f0; border-radius: 8px;
                    width: 36px; height: 36px; display: flex; align-items: center; justify-content: center;
                    color: #64748b; cursor: pointer; font-size: 0.85rem; flex-shrink: 0;
                }
                .dl-topbar-right { display: flex; align-items: center; gap: 10px; }
                .dl-topbar-btn {
                    display: flex; align-items: center; gap: 6px;
                    padding: 6px 14px; border-radius: 8px;
                    background: rgba(4,189,32,0.08); color: #039419;
                    font-size: 0.78rem; font-weight: 600;
                    text-decoration: none; border: 1px solid rgba(4,189,32,0.2);
                    transition: all 0.2s;
                }
                .dl-topbar-btn:hover { background: rgba(4,189,32,0.15); color: #027515; }
                .dl-topbar-btn span { display: none; }
                @media (min-width: 576px) { .dl-topbar-btn span { display: inline; } }
                .dl-topbar-avatar img {
                    width: 34px; height: 34px;
                    border-radius: 50%;
                    border: 2px solid rgba(4,189,32,0.4);
                    object-fit: cover;
                }

                /* Content */
                .dl-content { flex: 1; padding: 24px; padding-bottom: 80px; overflow-x: hidden; }
                @media (min-width: 992px) { .dl-content { padding: 28px 32px; } }
            `}</style>
        </div>
    );
}
