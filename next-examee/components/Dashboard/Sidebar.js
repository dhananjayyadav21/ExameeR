"use client";
import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useContext } from "react";
import ContentContext from "@/context/ContentContext";

const menuItems = [
    {
        title: "MAIN MENU",
        items: [
            { href: "/dashboard", label: "Overview", icon: "fa-house", exact: true },
            { href: "/dashboard/courses", label: "My Courses", icon: "fa-book-open" },
            { href: "/dashboard/notes", label: "Study Notes", icon: "fa-file-lines" },
            { href: "/dashboard/pyq", label: "Previous Papers", icon: "fa-circle-question" },
            { href: "/dashboard/videos", label: "Video Lectures", icon: "fa-circle-play" },
        ]
    },
    {
        title: "MANAGEMENT",
        items: [
            { href: "/dashboard/students", label: "Users", icon: "fa-users" },
            { href: "/dashboard/analytics", label: "Analytics", icon: "fa-chart-line" },
        ]
    },
    {
        title: "SUPPORT",
        items: [
            { href: "/dashboard/settings", label: "Settings", icon: "fa-gear" },
            { href: "/help", label: "Help Center", icon: "fa-circle-info" },
        ]
    }
];

const Sidebar = () => {
    const pathname = usePathname();
    const router = useRouter();
    const { userData } = useContext(ContentContext);

    const userProfile = userData?.Profile ? (userData.Profile.startsWith('http') ? userData.Profile : `https://lh3.googleusercontent.com/d/${userData.Profile}`) : "/assets/img/Avtar.jpg";
    const displayName = (userData?.FirstName || userData?.LastName) ? `${userData.FirstName} ${userData.LastName}`.trim() : (userData?.Username || "User");

    const isActive = (href, exact) => {
        if (exact) return pathname === href;
        return pathname.startsWith(href) && (href !== '/dashboard' || pathname === '/dashboard');
    };

    return (
        <nav className="ds-sidebar">
            {/* Brand */}
            <Link href="/" className="ds-brand p-4"
                style={{ display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none', color: 'inherit' }}>
                <div className="ds-brand-logo">
                    <i className="fa-solid fa-graduation-cap"></i>
                </div>
                <div className="ds-brand-text">
                    <span className="ds-brand-name">Examee</span>
                    <span className="ds-brand-tag">Premium Learning</span>
                </div>
            </Link>

            {/* Navigation Sections */}
            <div className="ds-nav-container">
                {menuItems.map((section, idx) => (
                    <div key={idx} className="ds-section">
                        <p className="ds-section-title">{section.title}</p>
                        <ul className="ds-menu-list">
                            {section.items.map((item) => {
                                const active = isActive(item.href, item.exact);
                                return (
                                    <li key={item.href} className="ds-menu-li">
                                        <Link
                                            href={item.href}
                                            className={`ds-menu-item ${active ? 'ds-menu-item--active' : ''}`}
                                        >
                                            <span className="ds-menu-icon">
                                                <i className={`fa-solid ${item.icon}`}></i>
                                            </span>
                                            <span className="ds-menu-label">{item.label}</span>
                                            {active && <div className="ds-active-indicator" />}
                                        </Link>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                ))}
            </div>

            {/* Sidebar Footer */}
            <div className="ds-footer">
                {/* User Profile Card */}
                <Link href="/profile" className="ds-user-card text-decoration-none">
                    <div className="ds-user-avatar">
                        <img
                            src={userProfile}
                            alt="User"
                            onError={(e) => { e.target.src = "https://ui-avatars.com/api/?name=" + (userData?.FirstName || 'User') + "&background=04bd20&color=fff"; }}
                        />
                        <div className="ds-status-dot"></div>
                    </div>
                    <div className="ds-user-info">
                        <p className="ds-user-name">{displayName}</p>
                        <p className="ds-user-role">{userData?.Role || 'Student'}</p>
                    </div>
                </Link>

                <div className="ds-upgrade-card">
                    <div className="ds-upgrade-icon">
                        <i className="fa-solid fa-rocket"></i>
                    </div>
                    <div className="ds-upgrade-info">
                        <p className="ds-upgrade-title">Pro Plan</p>
                        <p className="ds-upgrade-desc">Unlock all features</p>
                    </div>
                </div>
            </div>

            import "./Sidebar.css";

const Sidebar = () => {
        </nav>
    );
};


export default Sidebar;
