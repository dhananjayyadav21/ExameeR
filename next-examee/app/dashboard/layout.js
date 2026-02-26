"use client";
import React, { useEffect, useState } from "react";
import Sidebar from "../../components/dashboard/Sidebar";
import MobileBar from "../../components/dashboard/MobileBar";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useContext } from "react";
import ContentContext from "../../context/ContentContext";

const menuItems = [
    { href: "/dashboard", label: "Overview", icon: "fa-house" },
    { href: "/dashboard/courses", label: "My Courses", icon: "fa-book-open" },
    { href: "/dashboard/notes", label: "Study Notes", icon: "fa-file-lines" },
    { href: "/dashboard/pyq", label: "Previous Papers", icon: "fa-circle-question" },
    { href: "/dashboard/videos", label: "Video Lectures", icon: "fa-circle-play" },
    { href: "/dashboard/students", label: "Students", icon: "fa-user-graduate" },
    { href: "/dashboard/analytics", label: "Analytics", icon: "fa-chart-line" },
    { href: "/dashboard/settings", label: "Settings", icon: "fa-gear" },
];

export default function DashboardLayout({ children }) {
    const context = useContext(ContentContext);
    const { userData, getUser } = context;
    const router = useRouter();
    const pathname = usePathname();
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);

    const handleLogout = () => {
        localStorage.clear();
        router.push("/auth");
    };

    useEffect(() => {
        const userRole = typeof window !== 'undefined' && localStorage.getItem("userRole");
        const allowedRoles = ["Admin", "Instructor"];
        if (!userRole || !allowedRoles.includes(userRole)) {
            router.push("/");
        } else {
            setIsAuthorized(true);
            if (!userData) {
                getUser();
            }
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

                        <div className="dl-search-container d-none d-md-flex">
                            <i className="fa-solid fa-magnifying-glass dl-search-icon"></i>
                            <input type="text" placeholder="Search materials..." className="dl-search-input" />
                            <span className="dl-search-shortcut">⌘K</span>
                        </div>
                    </div>

                    <div className="dl-topbar-right">
                        <div className="dl-actions">
                            <button className="dl-icon-btn d-none d-sm-flex" title="Notifications">
                                <i className="fa-regular fa-bell"></i>
                                <span className="dl-notification-dot"></span>
                            </button>
                            <button className="dl-icon-btn d-none d-sm-flex" title="Quick Notes">
                                <i className="fa-regular fa-comment-dots"></i>
                            </button>
                            <div className="dl-divider d-none d-sm-block"></div>

                            <div className="dl-profile-dropdown">
                                <div className="dl-profile-info d-none d-lg-block">
                                    <p className="dl-profile-name">
                                        {(userData?.FirstName || userData?.LastName) ? `${userData.FirstName} ${userData.LastName}`.trim() : (userData?.Username || "Loading...")}
                                    </p>
                                    <p className="dl-profile-role">{userData?.Role || "Admin"}</p>
                                </div>
                                <div className="dl-avatar-container">
                                    <img
                                        src={userData?.Profile ? (userData.Profile.startsWith('http') ? userData.Profile : `https://lh3.googleusercontent.com/d/${userData.Profile}`) : "/assets/img/Avtar.jpg"}
                                        alt="Profile"
                                        className="dl-avatar"
                                        onError={(e) => {
                                            e.target.src = `https://ui-avatars.com/api/?name=${userData?.FirstName || 'User'}&background=04bd20&color=fff`;
                                        }}
                                    />
                                    <div className="dl-online-indicator"></div>
                                </div>
                                <button className="dl-logout-btn" onClick={handleLogout}>
                                    <i className="fa-solid fa-arrow-right-from-bracket"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Page content */}
                <main className="dl-content">
                    {children}
                </main>
            </div>

            {/* Mobile bottom nav */}
            <div className="d-lg-none">
                <MobileBar />
            </div>

            <style jsx>{`
                /* Global resets for dashboard area to prevent blue/underlined links */
                :global(.dl-wrapper a) {
                    text-decoration: none !important;
                    color: inherit;
                }
                
                :global(.dl-wrapper .btn a), 
                :global(.dl-wrapper button a) {
                    color: inherit !important;
                }

                /* Premium Global Button Styles - Enhanced Padding & Contrast */
                :global(.dl-wrapper .btn-primary),
                :global(.dl-wrapper .btn-success),
                :global(.dl-wrapper button[class*="btn-"]) {
                    background: linear-gradient(135deg, #04bd20 0%, #029d1a 100%) !important;
                    border: none !important;
                    padding: 12px 24px !important; /* Increased padding */
                    border-radius: 12px !important;
                    font-weight: 700 !important;
                    font-size: 0.95rem !important;
                    box-shadow: 0 4px 15px rgba(4, 189, 32, 0.2) !important;
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
                    display: inline-flex !important;
                    align-items: center !important;
                    justify-content: center !important;
                    gap: 10px !important; /* Better icon spacing */
                    color: #ffffff !important; /* Solid white text */
                    text-decoration: none !important;
                    line-height: 1 !important;
                }

                :global(.dl-wrapper .btn-primary:hover),
                :global(.dl-wrapper .btn-success:hover) {
                    transform: translateY(-2px) !important;
                    box-shadow: 0 8px 20px rgba(4, 189, 32, 0.3) !important;
                    filter: brightness(1.1) !important;
                    color: white !important;
                }

                :global(.dl-wrapper .btn-warning) {
                    background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%) !important;
                    border: none !important;
                    padding: 10px 20px !important;
                    border-radius: 12px !important;
                    font-weight: 700 !important;
                    color: white !important;
                    box-shadow: 0 4px 12px rgba(245, 158, 11, 0.2) !important;
                }

                .dl-loading {
                    display: flex; flex-direction: column; align-items: center; justify-content: center;
                    height: 100vh; gap: 16px; background: #ffffff;
                    color: #64748b; font-size: 0.9rem;
                }
                .dl-spinner {
                    width: 40px; height: 40px;
                    border: 3px solid #f1f5f9;
                    border-top-color: #04bd20;
                    border-radius: 50%;
                    animation: spin 0.8s linear infinite;
                }
                @keyframes spin { to { transform: rotate(360deg); } }

                .dl-wrapper {
                    display: flex;
                    min-height: 100vh;
                    background: #f8fafc;
                }

                .dl-sidebar {
                    width: 260px;
                    flex-shrink: 0;
                    display: none;
                }
                @media (min-width: 992px) {
                    .dl-sidebar { display: block; }
                }
                @media (max-width: 991px) {
                    .dl-sidebar {
                        position: fixed;
                        top: 0; left: -260px;
                        height: 100vh;
                        z-index: 1050;
                        transition: left 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    }
                    .dl-sidebar--open { left: 0; }
                }

                .dl-overlay {
                    position: fixed; inset: 0; z-index: 1040;
                    background: rgba(15, 23, 42, 0.3);
                    backdrop-filter: blur(4px);
                }

                .dl-main { 
                    flex: 1; 
                    display: flex; 
                    flex-direction: column; 
                    min-width: 0; 
                    position: relative;
                }

                .dl-topbar {
                    display: flex; 
                    align-items: center; 
                    justify-content: space-between;
                    padding: 0 32px;
                    height: 80px;
                    background: rgba(255, 255, 255, 0.8);
                    backdrop-filter: blur(12px);
                    border-bottom: 1px solid #f1f5f9;
                    position: sticky; 
                    top: 0; 
                    z-index: 100;
                }

                .dl-topbar-left { display: flex; align-items: center; gap: 24px; flex: 1; }

                .dl-search-container {
                    position: relative;
                    max-width: 400px;
                    width: 100%;
                    display: flex;
                    align-items: center;
                }

                .dl-search-icon {
                    position: absolute;
                    left: 14px;
                    color: #94a3b8;
                    font-size: 0.9rem;
                }

                .dl-search-input {
                    width: 100%;
                    padding: 10px 14px 10px 42px;
                    background: #f1f5f9;
                    border: 1px solid transparent;
                    border-radius: 12px;
                    font-size: 0.9rem;
                    transition: all 0.2s;
                }

                .dl-search-input:focus {
                    background: white;
                    border-color: #04bd20;
                    box-shadow: 0 0 0 4px rgba(4, 189, 32, 0.1);
                    outline: none;
                }

                .dl-search-shortcut {
                    position: absolute;
                    right: 12px;
                    font-size: 0.7rem;
                    color: #94a3b8;
                    background: white;
                    padding: 2px 6px;
                    border-radius: 4px;
                    border: 1px solid #e2e8f0;
                }

                .dl-topbar-right { display: flex; align-items: center; }

                .dl-actions { display: flex; align-items: center; gap: 12px; }

                .dl-icon-btn {
                    width: 42px;
                    height: 42px;
                    border-radius: 12px;
                    border: 1px solid #f1f5f9;
                    background: white;
                    color: #64748b;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    position: relative;
                    transition: all 0.2s;
                    cursor: pointer;
                }

                .dl-icon-btn:hover {
                    background: #f8fafc;
                    color: #0f172a;
                    border-color: #e2e8f0;
                }

                .dl-notification-dot {
                    position: absolute;
                    top: 10px;
                    right: 10px;
                    width: 8px;
                    height: 8px;
                    background: #ef4444;
                    border-radius: 50%;
                    border: 2px solid white;
                }

                .dl-divider {
                    width: 1px;
                    height: 32px;
                    background: #f1f5f9;
                    margin: 0 8px;
                }

                .dl-profile-dropdown {
                    display: flex;
                    align-items: center;
                    gap: 16px;
                    padding-left: 8px;
                }

                .dl-profile-info {
                    text-align: right;
                }

                .dl-profile-name {
                    font-size: 0.9rem;
                    font-weight: 700;
                    color: #0f172a;
                    margin: 0;
                }

                .dl-profile-role {
                    font-size: 0.75rem;
                    color: #94a3b8;
                    margin: 0;
                }

                .dl-avatar-container {
                    position: relative;
                }

                .dl-avatar {
                    width: 44px;
                    height: 44px;
                    border-radius: 12px;
                    object-fit: cover;
                }

                .dl-online-indicator {
                    position: absolute;
                    bottom: -2px;
                    right: -2px;
                    width: 12px;
                    height: 12px;
                    background: #22c55e;
                    border-radius: 50%;
                    border: 2px solid white;
                }

                .dl-logout-btn {
                    width: 36px;
                    height: 36px;
                    border-radius: 10px;
                    background: #fff1f2;
                    color: #ef4444;
                    border: none;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    transition: all 0.2s;
                }

                .dl-logout-btn:hover {
                    background: #ffe4e6;
                    transform: translateX(2px);
                }

                .dl-page-header {
                    padding: 32px 32px 0;
                }

                .dl-page-title {
                    font-size: 1.75rem;
                    font-weight: 800;
                    color: #0f172a;
                    margin: 0;
                    letter-spacing: -0.02em;
                }

                .dl-subtitle {
                    font-size: 0.95rem;
                    color: #64748b;
                    margin: 4px 0 0;
                }

                .breadcrumb { background: none; padding: 0; }
                .breadcrumb-item { font-size: 0.8rem; font-weight: 600; color: #94a3b8; }
                .breadcrumb-item a { color: #94a3b8; text-decoration: none; }
                .breadcrumb-item.active { color: #04bd20; }
                .breadcrumb-item + .breadcrumb-item::before { content: "›"; color: #cbd5e1; }

                .dl-content { 
                    flex: 1; 
                    padding: 32px; 
                    overflow-x: hidden; 
                    padding-bottom: 100px;
                }

                .dl-hamburger {
                    background: white; 
                    border: 1px solid #f1f5f9; 
                    border-radius: 10px;
                    width: 42px; 
                    height: 42px; 
                    display: flex; 
                    align-items: center; 
                    justify-content: center;
                    color: #64748b; 
                    cursor: pointer;
                }

                @media (max-width: 768px) {
                    .dl-topbar { padding: 0 20px; }
                    .dl-page-header { padding: 24px 20px 0; }
                    .dl-content { padding: 24px 20px 80px; }
                    .dl-page-title { font-size: 1.5rem; }
                }
            `}</style>
        </div>
    );
}
