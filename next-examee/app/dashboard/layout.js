"use client";
import React, { useEffect, useState } from "react";
import Sidebar from "../../components/dashboard/Sidebar";
import MobileBar from "../../components/dashboard/MobileBar";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useContext } from "react";
import ContentContext from "../../context/ContentContext";

import "./dashboard-layout.css";

const menuItems = [
    { href: "/dashboard", label: "Overview", icon: "fa-house" },
    { href: "/dashboard/courses", label: "My Courses", icon: "fa-book-open" },
    { href: "/dashboard/notes", label: "Study Notes", icon: "fa-file-lines" },
    { href: "/dashboard/pyq", label: "Previous Papers", icon: "fa-circle-question" },
    { href: "/dashboard/videos", label: "Video Lectures", icon: "fa-circle-play" },
    { href: "/dashboard/students", label: "Users", icon: "fa-users" },
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

        </div>
    );
}
