"use client";
import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

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
            { href: "/dashboard/students", label: "Students", icon: "fa-user-graduate" },
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

    const isActive = (href, exact) => {
        if (exact) return pathname === href;
        return pathname.startsWith(href) && (href !== '/dashboard' || pathname === '/dashboard');
    };

    return (
        <nav className="ds-sidebar">
            {/* Brand */}
            <div className="ds-brand">
                <div className="ds-brand-logo">
                    <i className="fa-solid fa-graduation-cap"></i>
                </div>
                <div className="ds-brand-text">
                    <span className="ds-brand-name">Examee</span>
                    <span className="ds-brand-tag">Premium Learning</span>
                </div>
            </div>

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
                <div className="ds-upgrade-card">
                    <div className="ds-upgrade-icon">
                        <i className="fa-solid fa-rocket"></i>
                    </div>
                    <div className="ds-upgrade-info">
                        <p className="ds-upgrade-title">Pro Plan</p>
                        <p className="ds-upgrade-desc">Unlock all features</p>
                    </div>
                    <button className="ds-upgrade-btn">
                        <i className="fa-solid fa-chevron-right"></i>
                    </button>
                </div>
            </div>

            <style jsx>{`
                .ds-sidebar {
                    width: 100%;
                    height: 100vh;
                    background: #ffffff;
                    display: flex;
                    flex-direction: column;
                    border-right: 1px solid #f1f5f9;
                    position: sticky;
                    top: 0;
                    box-shadow: 4px 0 24px rgba(0,0,0,0.02);
                }

                .ds-brand {
                    padding: 32px 24px;
                    display: flex;
                    align-items: center;
                    gap: 12px;
                }

                .ds-brand-logo {
                    width: 40px;
                    height: 40px;
                    background: linear-gradient(135deg, #04bd20 0%, #029d1a 100%);
                    border-radius: 12px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: white;
                    font-size: 1.2rem;
                    box-shadow: 0 8px 16px rgba(4, 189, 32, 0.2);
                }

                .ds-brand-text {
                    display: flex;
                    flex-direction: column;
                }

                .ds-brand-name {
                    font-size: 1.25rem;
                    font-weight: 800;
                    color: #0f172a;
                    letter-spacing: -0.02em;
                    line-height: 1;
                }

                .ds-brand-tag {
                    font-size: 0.65rem;
                    font-weight: 600;
                    color: #94a3b8;
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                    margin-top: 4px;
                }

                .ds-nav-container {
                    flex: 1;
                    padding: 0 16px;
                    overflow-y: auto;
                }

                .ds-nav-container::-webkit-scrollbar {
                    width: 4px;
                }

                .ds-nav-container::-webkit-scrollbar-thumb {
                    background: #f1f5f9;
                    border-radius: 10px;
                }

                .ds-section {
                    margin-bottom: 24px;
                }

                .ds-section-title {
                    font-size: 0.7rem;
                    font-weight: 700;
                    color: #94a3b8;
                    margin-bottom: 12px;
                    padding-left: 12px;
                    letter-spacing: 0.1em;
                }

                .ds-menu-list {
                    list-style: none;
                    padding: 0;
                    margin: 0;
                    display: flex;
                    flex-direction: column;
                    gap: 4px;
                }

                /* Fixed Link Styles - Using :global to override any bootstrap/global link styles */
                :global(.ds-menu-item) {
                    display: flex !important;
                    flex-direction: row !important;
                    align-items: center !important;
                    gap: 12px !important;
                    padding: 10px 16px !important;
                    border-radius: 12px !important;
                    color: #64748b !important;
                    text-decoration: none !important;
                    font-weight: 600 !important;
                    font-size: 0.9rem !important;
                    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1) !important;
                    position: relative !important;
                    border: none !important;
                }

                :global(.ds-menu-item:hover) {
                    background: #f8fafc !important;
                    color: #0f172a !important;
                }

                :global(.ds-menu-item--active) {
                    background: #f0fdf4 !important;
                    color: #04bd20 !important;
                }

                .ds-menu-icon {
                    width: 20px;
                    display: flex;
                    justify-content: center;
                    font-size: 1rem;
                    pointer-events: none;
                }

                .ds-menu-label {
                    flex: 1;
                    pointer-events: none;
                    text-decoration: none !important;
                }

                .ds-active-indicator {
                    width: 4px;
                    height: 18px;
                    background: #04bd20;
                    border-radius: 10px;
                    position: absolute;
                    right: 8px;
                }

                .ds-footer {
                    padding: 24px 16px;
                    border-top: 1px solid #f1f5f9;
                }

                .ds-upgrade-card {
                    background: #0f172a;
                    border-radius: 16px;
                    padding: 16px;
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    color: white;
                    cursor: pointer;
                    transition: transform 0.2s;
                }

                .ds-upgrade-card:hover {
                    transform: translateY(-2px);
                }

                .ds-upgrade-icon {
                    width: 36px;
                    height: 36px;
                    background: rgba(255, 255, 255, 0.1);
                    border-radius: 10px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: #04bd20;
                }

                .ds-upgrade-info {
                    flex: 1;
                }

                .ds-upgrade-title {
                    font-size: 0.85rem;
                    font-weight: 700;
                    margin: 0;
                }

                .ds-upgrade-desc {
                    font-size: 0.65rem;
                    color: #94a3b8;
                    margin: 0;
                }

                .ds-upgrade-btn {
                    background: none;
                    border: none;
                    color: #94a3b8;
                    font-size: 0.8rem;
                }

                @media (max-width: 991px) {
                    .ds-sidebar { height: 100%; border-right: none; }
                }
            `}</style>
        </nav>
    );
};


export default Sidebar;
