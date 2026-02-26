"use client";
import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Sidebar from "./Sidebar";

const bottomNavItems = [
    { href: "/dashboard", label: "Home", icon: "fa-house" },
    { href: "/dashboard/notes", label: "Notes", icon: "fa-file-lines" },
    { href: "/dashboard/videos", label: "Videos", icon: "fa-circle-play" },
    { href: "/dashboard/courses", label: "Courses", icon: "fa-book-open" },
    { href: "/dashboard/analytics", label: "Stats", icon: "fa-chart-line" },
];

function MobileMenuButton() {
    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname();

    const isActive = (href) => {
        if (href === "/dashboard") return pathname === href;
        return pathname.startsWith(href);
    };

    return (
        <>
            {/* ── Bottom Nav Bar ────────────────────────────────── */}
            <nav className="mb-nav">
                <div className="mb-nav-content">
                    {bottomNavItems.map((item) => {
                        const active = isActive(item.href);
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`mb-nav-item ${active ? 'mb-nav-item--active' : ''}`}
                            >
                                <div className="mb-nav-icon-wrapper">
                                    <i className={`fa-solid ${item.icon}`}></i>
                                    {active && <span className="mb-active-glow"></span>}
                                </div>
                                <span className="mb-nav-label">{item.label}</span>
                            </Link>
                        );
                    })}

                    <button
                        className={`mb-nav-item ${isOpen ? 'mb-nav-item--active' : ''}`}
                        onClick={() => setIsOpen(!isOpen)}
                        aria-label="Open menu"
                    >
                        <div className="mb-nav-icon-wrapper">
                            <i className={`fa-solid ${isOpen ? 'fa-xmark' : 'fa-bars-staggered'}`}></i>
                        </div>
                        <span className="mb-nav-label">More</span>
                    </button>
                </div>
            </nav>

            {/* ── Full Sidebar Drawer ───────────────────────────── */}
            {isOpen && (
                <>
                    <div
                        className="mb-overlay"
                        onClick={() => setIsOpen(false)}
                    />
                    <div className="mb-drawer">
                        <div className="mb-drawer-header">
                            <p>Navigation Menu</p>
                            <button onClick={() => setIsOpen(false)}><i className="fa-solid fa-xmark"></i></button>
                        </div>
                        <Sidebar />
                    </div>
                </>
            )}

            <style jsx>{`
                .mb-nav {
                    position: fixed;
                    bottom: 20px;
                    left: 20px;
                    right: 20px;
                    z-index: 1060;
                }

                .mb-nav-content {
                    display: flex;
                    align-items: center;
                    justify-content: space-around;
                    height: 70px;
                    background: rgba(255, 255, 255, 0.85);
                    backdrop-filter: blur(20px);
                    border: 1px solid rgba(255, 255, 255, 0.3);
                    border-radius: 20px;
                    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
                    padding: 0 10px;
                }

                .mb-nav-item {
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    gap: 6px;
                    text-decoration: none;
                    color: #94a3b8;
                    background: none;
                    border: none;
                    padding: 0;
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                }

                .mb-nav-item--active {
                    color: #04bd20;
                }

                .mb-nav-icon-wrapper {
                    position: relative;
                    font-size: 1.2rem;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    width: 32px;
                    height: 32px;
                }

                .mb-active-glow {
                    position: absolute;
                    width: 40px;
                    height: 40px;
                    background: rgba(4, 189, 32, 0.15);
                    border-radius: 12px;
                    z-index: -1;
                    filter: blur(8px);
                }

                .mb-nav-label {
                    font-size: 0.65rem;
                    font-weight: 700;
                    letter-spacing: 0.02em;
                }

                .mb-overlay {
                    position: fixed;
                    inset: 0;
                    background: rgba(15, 23, 42, 0.4);
                    backdrop-filter: blur(8px);
                    z-index: 1070;
                }

                .mb-drawer {
                    position: fixed;
                    bottom: 0;
                    left: 0;
                    right: 0;
                    height: 80vh;
                    background: white;
                    z-index: 1080;
                    border-top-left-radius: 32px;
                    border-top-right-radius: 32px;
                    display: flex;
                    flex-direction: column;
                    box-shadow: 0 -20px 40px rgba(0, 0, 0, 0.1);
                    animation: slideUp 0.4s cubic-bezier(0.4, 0, 0.2, 1);
                }

                .mb-drawer-header {
                    padding: 24px 32px;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    border-bottom: 1px solid #f1f5f9;
                }

                .mb-drawer-header p {
                    margin: 0;
                    font-weight: 800;
                    color: #0f172a;
                    font-size: 1.1rem;
                }

                .mb-drawer-header button {
                    background: #f1f5f9;
                    border: none;
                    width: 36px;
                    height: 36px;
                    border-radius: 50%;
                    color: #64748b;
                    cursor: pointer;
                }

                @keyframes slideUp {
                    from { transform: translateY(100%); }
                    to { transform: translateY(0); }
                }
            `}</style>
        </>
    );
}

export default MobileMenuButton;
